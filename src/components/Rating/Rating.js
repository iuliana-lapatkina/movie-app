import React, { useState, useCallback } from 'react';
import { Rate } from 'antd';

function Rating(props) {
  const { id, addRating } = props;
  const [value, setValue] = useState(0);

  return (
    <Rate
      allowHalf
      defaultValue={0}
      onChange={(val) => {
        setValue(val);
        addRating(id, val);
      }}
      value={value}
      count={10}
    />
  );
}

export default Rating;
