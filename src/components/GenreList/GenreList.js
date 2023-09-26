import React from 'react';
import { Row, Col, Tag } from 'antd';

import { GenresContextConsumer } from '../GenresContext';
import './GenreList.css';

function GenreList(props) {
  const { genres } = props;
  return (
    <GenresContextConsumer>
      {(genresList) => {
        return genres.length > 0 ? (
          <ul className="genre-list">
            <Row gutter={10}>
              {genres.map((el) => {
                const genre = genresList.find((item) => item.id === el);
                return (
                  <Col key={el}>
                    <Tag>{genre.name}</Tag>
                  </Col>
                );
              })}
            </Row>
          </ul>
        ) : null;
      }}
    </GenresContextConsumer>
  );
}

export default GenreList;
