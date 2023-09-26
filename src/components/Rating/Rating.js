import React, { Component } from 'react';
import { Rate } from 'antd';

import './Rating.css';

export default class Rating extends Component {
  state = {
    rate: 0,
  };

  render() {
    const { id, addRating } = this.props;
    const { rate } = this.state;
    return (
      <Rate
        allowHalf
        defaultValue={0}
        onChange={(val) => {
          addRating(id, val);
          this.setState({
            rate: val,
          });
          console.log(val);
        }}
        value={rate}
        count={10}
      />
    );
  }
}
