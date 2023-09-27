import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Rate } from 'antd';

import './Rating.css';

export default class Rating extends Component {
  state = { rate: 0 };

  static propTypes = {
    id: PropTypes.number,
    addRating: PropTypes.func.isRequired,
  };

  static defaultProps = {
    id: 0,
  };

  addRate = (val) => {
    const { rate } = this.state;
    const { id, addRating } = this.props;
    addRating(id, val);
    this.setState({
      rate: val,
    });
  };

  render() {
    const { rating } = this.props;
    return (
      <Rate
        allowHalf
        defaultValue={0}
        onChange={(val) => {
          this.addRate(val);
        }}
        value={rating}
        count={10}
      />
    );
  }
}
