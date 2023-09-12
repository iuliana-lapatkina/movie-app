import React from 'react';
import { Spin } from 'antd';

import './Spinner.css';

function Spinner() {
  return (
    <Spin className="movie-list-spin" tip="Loading" size="large">
      <div />
    </Spin>
  );
}

export default Spinner;
