import React, { Component, useState } from 'react';
import { format, parseISO } from 'date-fns';
import { Offline, Online } from 'react-detect-offline';
import { Alert, Pagination, Tabs } from 'antd';

import MovieService from '../../services/MovieService';
import MoviesList from '../MoviesList';
import Spinner from '../Spinner';
import Search from '../Search';
import poster from '../MoviesList/poster.png';
import { GenresContextProvider } from '../GenresContext';

import './App.css';

export default class App extends Component {
  movieService = new MovieService();

  constructor() {
    super();
    this.state = {
      sessionId: '',
      genresList: [],
      movies: [],
      rated: [],
      loading: true,
      onError: false,
      currentPage: 1,
      totalPages: 1,
      searchWord: '',
    };
    this.getMoviesList = this.getMoviesList.bind(this);
  }

  componentDidMount() {
    this.getGuestSessionId();
    this.getGenresList();
    this.getMoviesList();
  }

  componentDidUpdate(nextState, prevState) {
    const { currentPage, searchWord } = this.state;
    if (currentPage !== prevState.currentPage && prevState.searchWord === '') {
      this.getMoviesList();
    }
    if (prevState.searchWord !== '' && searchWord === '') {
      this.getMoviesList();
    }
    if (prevState.searchWord === searchWord && currentPage !== prevState.currentPage && searchWord) {
      this.nextSearch();
    }
  }

  getGuestSessionId = () => {
    const { sessionId } = this.state;
    this.movieService.createGuestSession().then((body) => {
      this.setState({
        sessionId: body,
      });
    });
  };

  getGenresList = () => {
    this.movieService.getGenres().then((body) => {
      this.setState({
        genresList: body,
      });
    });
  };

  getMoviesList = () => {
    const { currentPage } = this.state;
    let newMovies;
    this.movieService.getCountPopular().then((body) => {
      this.setState({
        totalPages: Number(body),
      });
    });
    this.movieService
      .getPopularMovies(currentPage)
      .then((body) => {
        newMovies = body.map((item) => this.transformMovies(item));
        this.setState({
          movies: newMovies,
          loading: false,
        });
      })
      .catch(() => {
        this.setState({
          onError: true,
        });
      });
  };

  firstSearch = (searchText) => {
    this.onSearch(searchText);
  };

  nextSearch = () => {
    const { searchWord } = this.state;
    this.onSearch(searchWord);
  };

  onSearch = (searchText) => {
    const { currentPage, searchWord } = this.state;
    let page = currentPage;
    if (searchText !== searchWord) {
      page = 1;
    }
    let newMovies;
    this.movieService.getCountSearch(page, searchText).then((body) => {
      this.setState({
        totalPages: Number(body),
      });
    });
    this.movieService
      .searchMovies(page, searchText)
      .then((body) => {
        newMovies = body.map((item) => this.transformMovies(item));
        this.setState({
          movies: newMovies,
          loading: false,
          searchWord: searchText,
          currentPage: page,
        });
      })
      .catch(() => {
        this.setState({
          onError: true,
        });
      });
  };

  changePage = (page) => {
    this.setState({
      loading: true,
      currentPage: page,
    });
  };

  transformMovies = (movie) => {
    return {
      id: movie.id,
      title: movie.title || 'Untitled',
      average: movie.vote_average,
      date: movie.release_date ? format(parseISO(movie.release_date), 'MMMM dd, yyyy') : null,
      genres: movie.genre_ids || null,
      overview:
        movie.overview.length > 140 ? `${movie.overview.replace(/^(.{140}[^\s]*).*/, '$1')}...` : movie.overview,
      imgPath: movie.poster_path !== null ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : poster,
    };
  };

  addRating = (id, newRating) => {
    this.setState(({ movies }) => {
      const index = movies.findIndex((el) => el.id === id);
      const oldItem = movies[index];
      const newItem = { ...oldItem, rating: newRating };
      const newMovies = [...movies.slice(0, index), newItem, ...movies.slice(index + 1)];
      return {
        movies: newMovies,
      };
    });
  };

  render() {
    const { movies, rated, genresList, loading, onError, currentPage, totalPages, searchWord, rating } = this.state;
    const total = totalPages * 10 < 500 ? totalPages * 10 : 5000;
    const spinner = loading && !onError ? <Spinner /> : null;
    const moviesList =
      !loading && !onError ? <MoviesList movies={movies} loading={loading} addRating={this.addRating} /> : null;
    const ratedList = !loading && !onError ? <MoviesList movies={rated} loading={loading} /> : null;
    const search =
      !loading && !onError ? (
        <Search searchWord={searchWord} firstSearch={this.firstSearch} nextSearch={this.nextSearch} />
      ) : null;
    const error = onError ? (
      <Alert className="error-warning" description="The download failed. Please, try later" type="error" showIcon />
    ) : null;
    const pagination =
      !loading && !onError ? (
        <Pagination
          className="pagination"
          defaultCurrent={1}
          current={currentPage}
          total={total}
          onChange={this.changePage}
        />
      ) : null;

    const items = [
      {
        key: '1',
        label: 'Search',
        children: (
          <div>
            {spinner}
            {error}
            {search}
            {moviesList}
            {pagination}
          </div>
        ),
      },
      {
        key: '2',
        label: 'Rated',
        children: (
          <div>
            {spinner}
            {error}
            {rated}
          </div>
        ),
      },
    ];

    return (
      <div className="App">
        <div className="container">
          <Online>
            <GenresContextProvider value={genresList}>
              <Tabs centered defaultActiveKey="1" items={items} />
            </GenresContextProvider>
          </Online>
          <Offline>
            <Alert
              className="error-warning"
              description="You are offline. Please check your internet connection"
              type="error"
              showIcon
            />
          </Offline>
        </div>
      </div>
    );
  }
}
