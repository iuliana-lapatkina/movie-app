import React from 'react';
import { Space, Card } from 'antd';

import Movie from '../Movie';

import './MoviesList.css';

function MoviesList(props) {
  const { movies } = props;

  const elements = movies.map((item) => {
    const { id, ...itemProps } = item;

    return (
      <Card className="movie-card" key={id}>
        <Movie id={id} {...itemProps} />
      </Card>
    );
  });

  return <Space className="movie-list">{elements}</Space>;
}

export default MoviesList;
