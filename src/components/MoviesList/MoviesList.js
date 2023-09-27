import React from 'react';
import PropTypes from 'prop-types';
import { Space, Card } from 'antd';

import Movie from '../Movie';

import './MoviesList.css';

function MoviesList(props) {
  const { movies, addRating } = props;

  const elements = movies.map((item) => {
    const { id, ...itemProps } = item;

    return (
      <Card className="movie-card" key={id}>
        <Movie id={id} {...itemProps} addRating={addRating} />
      </Card>
    );
  });

  return <Space className="movie-list">{elements}</Space>;
}

MoviesList.propTypes = {
  movies: PropTypes.instanceOf(Array).isRequired,
};

export default MoviesList;
