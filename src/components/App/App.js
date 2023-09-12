import React, { Component } from 'react';
import { format, parseISO } from 'date-fns';
import { Offline, Online } from 'react-detect-offline';
import { Alert } from 'antd';

import MovieService from '../../services/MovieService';
import MoviesList from '../MoviesList';
import Spinner from '../Spinner';
import poster from '../MoviesList/poster.png';

import './App.css';

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      movies: [],
      loading: true,
      onError: false,
    };
    this.getMoviesList = this.getMoviesList.bind(this);
  }

  componentDidMount() {
    this.getMoviesList();
  }

  getMoviesList = () => {
    const movieService = new MovieService();
    movieService
      .getMovies()
      .then((body) => {
        body = body.map((item) => this.transformMovies(item));
        this.setState({
          movies: body,
          loading: false,
        });
      })
      .catch(() => {
        this.setState({
          onError: true,
        });
      });
  };

  transformMovies = (movie) => {
    return {
      id: movie.id,
      title: movie.title || null,
      date: movie.release_date ? format(parseISO(movie.release_date), 'MMMM dd, yyyy') : null,
      genres: movie.genre_ids || null,
      overview:
        movie.overview.length > 140 ? `${movie.overview.replace(/^(.{140}[^\s]*).*/, '$1')}...` : movie.overview,
      imgPath: movie.poster_path !== null ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : poster,
    };
  };

  render() {
    const { movies, loading, onError } = this.state;
    const spinner = loading && !onError ? <Spinner /> : null;
    const moviesList = !loading && !onError ? <MoviesList movies={movies} loading={loading} /> : null;
    const error = onError ? (
      <Alert className="error-warning" description="The download failed. Please, try later" type="error" showIcon />
    ) : null;

    return (
      <div className="App">
        <div className="container">
          <Online>
            {spinner}
            {error}
            {moviesList}
          </Online>
          <Offline>
            <Alert
              className="error-warning"
              description="You are offline. Please check your internet connection."
              type="error"
              showIcon
            />
          </Offline>
        </div>
      </div>
    );
  }
}
