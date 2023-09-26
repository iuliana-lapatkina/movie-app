import React from 'react';
import { Space, Progress } from 'antd';

import Rating from '../Rating';
import GenreList from '../GenreList';
import './Movie.css';

function Movie(props) {
  const { id, title, average, imgPath, date, genres, overview, rating, addRating } = props;
  let color = '#66E900';
  if (average <= 3) color = '#E90000';
  if (average > 3 && average <= 5) color = '#E97E00';
  if (average > 5 && average <= 7) color = '#E9D100';

  return (
    <Space className="card-space">
      <div className="card-img">
        <img className="card-poster" src={imgPath} alt={`poster for ${title}`} />
      </div>
      <div className="card-text">
        <div>
          <h2 className="card-title">{title}</h2>
          <Progress
            className="rate"
            type="circle"
            percent={100}
            size={40}
            format={() => `${average.toFixed(1)}`}
            strokeColor={color}
          />
        </div>
        <p className="card-date">{date}</p>
        <GenreList genres={genres} />
        <p>{overview}</p>
        <Rating id={id} rating={rating} addRating={addRating} />
      </div>
    </Space>
  );
}

export default Movie;
