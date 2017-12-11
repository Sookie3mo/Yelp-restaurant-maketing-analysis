import React from 'react';
import { Element } from 'react-scroll';

import Sunburst from '../Sunburst/Sunburst';

export default (props) => {
  return (
    <div>
      <Sunburst data={props.data}/>
      <Element name="ele1"></Element>
    </div>
  );
}
