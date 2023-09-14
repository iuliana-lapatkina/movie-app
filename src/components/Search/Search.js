import React, { Component } from 'react';
import { debounce } from 'lodash';
import { Input } from 'antd';

import './Search.css';

export default class Search extends Component {
  state = {
    label: '',
  };

  debounceSearch = debounce((val) => {
    const { firstSearch } = this.props;
    firstSearch(val);
  }, 500);

  onLabelChange = (e) => {
    e.preventDefault();
    const {
      target: { value },
    } = e;
    this.setState({
      label: value,
    });
    this.debounceSearch(value);
  };

  enterPress = (e) => {
    if (e.keyCode === 27) {
      this.setState({
        label: '',
      });
    }
  };

  render() {
    const { label } = this.state;

    return (
      <Input
        className="search"
        placeholder="Type to search..."
        value={label}
        onChange={this.onLabelChange}
        onKeyDown={this.enterPress}
      />
    );
  }
}
