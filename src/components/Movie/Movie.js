import React from 'react';
import { Space, Row, Col } from 'antd';

import './Movie.css';

function Movie(props) {
  const { title, imgPath, date, genres, overview } = props;

  return (
    <Space className="card-space">
      <div className="card-img">
        <img className="card-poster" src={imgPath} alt={`poster for ${title}`} />
      </div>
      <div className="card-text">
        <h2 className="card-title">{title}</h2>
        <p className="card-date">{date}</p>
        <ul className="genre-list">
          <Row gutter={10}>
            {genres.map((el) => {
              return <Col key={el}>{el}</Col>;
            })}
          </Row>
        </ul>
        <p>{overview}</p>
      </div>
    </Space>
  );
}

export default Movie;
