import React from 'react';
import { Card, List, Row, Col } from 'antd';

import './Movie.css';

function Movie(props) {
  const { movies } = props;

  return (
    <List
      grid={{
        gutter: 30,
        column: 2,
      }}
      dataSource={movies}
      renderItem={(item) => (
        <List.Item justify="center">
          <Card>
            <li key={item.id} className="movie-card">
              <Row gutter={20}>
                <Col span={10} flex="120px">
                  <div className="movie-img">
                    <img className="movie-poster" src={item.imgPath} alt={`poster for ${item.title}`} />
                  </div>
                </Col>
                <Col span={14}>
                  <div>
                    <h2 className="card-title">{item.title}</h2>
                    <p className="card-date">{item.date}</p>
                    <ul className="genre-list">
                      <Row gutter={10}>
                        {item.genres.map((el) => {
                          return <Col key={el}>{el}</Col>;
                        })}
                      </Row>
                    </ul>
                    <p className="card-text">{item.overview}</p>
                  </div>
                </Col>
              </Row>
            </li>
          </Card>
        </List.Item>
      )}
    />
  );
}

export default Movie;
