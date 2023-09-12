import React from 'react';

import Movie from '../Movie';

import './MoviesList.css';

function MoviesList(props) {
  const { movies } = props;

  return (
    <div className="movie-list">
      <Movie movies={movies} />
    </div>
  );
}

export default MoviesList;
