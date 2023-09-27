import React, { Component } from 'react';
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
      notFound: false,
      currentPage: 1,
      totalPages: 1,
      currentTab: 1,
      searchWord: '',
    };
    this.getMoviesList = this.getMoviesList.bind(this);
  }

  componentDidMount() {
    this.getGuestSessionId();
    this.getGenresList();
  }

  componentDidUpdate(nextState, prevState) {
    const { sessionId, currentPage, searchWord, currentTab } = this.state;
    if (sessionId && !prevState.sessionId) {
      this.getMoviesList();
    }
    if (
      (currentPage !== prevState.currentPage && prevState.searchWord === '') ||
      (prevState.searchWord !== '' && searchWord === '')
    ) {
      this.getMoviesList();
    }
    if (currentPage !== prevState.currentPage && currentTab === 2) {
      this.getRatedMovies();
    }
    if (prevState.searchWord === searchWord && currentPage !== prevState.currentPage && searchWord) {
      this.nextSearch();
    }
    if (currentPage !== prevState.currentPage) {
      window.scrollTo(0, 0);
    }
  }

  getGuestSessionId = () => {
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
    const { currentPage, rated } = this.state;
    this.startLoading();
    let newMovies;
    let total;
    this.movieService
      .getPopularMovies(currentPage)
      .then((body) => {
        total = body.total_pages;
        newMovies = body.results.map((item) => this.transformMovies(item));
        newMovies = newMovies.map((item) => {
          const ratedItem = rated.find((el) => el.id === item.id);
          if (ratedItem) {
            item.rating = ratedItem.rating;
          }
          return item;
        });
        this.setState({
          totalPages: Number(total),
          movies: newMovies,
          loading: false,
          notFound: false,
        });
      })
      .catch(() => {
        this.createError();
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
    this.startLoading();
    let newMovies;
    let total;
    this.movieService
      .searchMovies(page, searchText)
      .then((body) => {
        total = body.total_pages;
        newMovies = body.results.map((item) => this.transformMovies(item));
        this.notFound(newMovies);
        this.setState({
          totalPages: Number(total),
          movies: newMovies,
          loading: false,
          searchWord: searchText,
          currentPage: page,
        });
      })
      .catch(() => {
        this.createError();
      });
  };

  getRatedMovies = () => {
    const { sessionId, currentPage } = this.state;
    this.startLoading();
    let newMovies;
    let total;
    this.movieService
      .getRatedMovies(sessionId, currentPage)
      .then((body) => {
        total = body.total_pages;
        newMovies = body.results.map((item) => this.transformMovies(item));
        this.setState({
          totalPages: Number(total),
          rated: newMovies,
          loading: false,
          notFound: false,
        });
        this.notFound(newMovies);
      })
      .catch(() => {
        this.createError();
      });
  };

  changePage = (page) => {
    this.setState({
      loading: true,
      currentPage: page,
    });
  };

  createError = () => {
    this.setState({
      onError: true,
      loading: false,
    });
  };

  startLoading = () => {
    this.setState({
      onError: false,
      loading: true,
    });
  };

  notFound = (arr) => {
    if (arr.length === 0) {
      this.setState({
        notFound: true,
        loading: false,
      });
    }
  };

  transformMovies = (movie) => {
    return {
      id: movie.id,
      rating: movie.rating,
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
    const { sessionId } = this.state;
    this.movieService.addRateMovie(sessionId, id, newRating);
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

  changeRating = (id, newRating) => {
    const { sessionId } = this.state;
    this.movieService.addRateMovie(sessionId, id, newRating);
    setTimeout(() => {
      this.getRatedMovies();
    }, 1500);
  };

  TabChange = (activeKey) => {
    this.setState({
      currentPage: 1,
      onError: false,
      loading: true,
    });
    if (activeKey === '1') {
      this.getMoviesList();
      this.setState({
        currentTab: 1,
      });
    }
    if (activeKey === '2') {
      this.setState({
        currentTab: 2,
      });
      this.getRatedMovies();
    }
  };

  render() {
    const { notFound, movies, rated, genresList, loading, onError, currentPage, totalPages, searchWord, currentTab } =
      this.state;
    const total = totalPages * 10 < 500 ? totalPages * 10 : 5000;
    const spinner = loading && !onError ? <Spinner /> : null;
    const moviesList =
      !loading && !onError ? (
        <MoviesList currentTab={currentTab} movies={movies} loading={loading} addRating={this.addRating} />
      ) : null;
    const ratedList =
      !loading && !onError ? (
        <MoviesList currentTab={currentTab} movies={rated} loading={loading} addRating={this.changeRating} />
      ) : null;
    const search =
      !loading && !onError ? (
        <Search searchWord={searchWord} firstSearch={this.firstSearch} nextSearch={this.nextSearch} />
      ) : null;
    const error = onError ? (
      <Alert className="error-warning" description="The download failed. Please, try later" type="error" showIcon />
    ) : null;
    const foundError = notFound ? (
      <Alert className="error-warning" description="Nothing found" type="error" showIcon />
    ) : null;
    const pagination =
      !loading && !onError && !notFound ? (
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
            {foundError}
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
            {ratedList}
            {foundError}
            {pagination}
          </div>
        ),
      },
    ];

    return (
      <div className="App">
        <div className="container">
          <Online>
            <GenresContextProvider value={genresList}>
              <Tabs centered defaultActiveKey="1" items={items} onChange={this.TabChange} />
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
