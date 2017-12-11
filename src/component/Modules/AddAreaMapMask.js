import React from 'react';

import SelectAreaMap from '../GoogleMap/SelectAreaMap';

export default function ({ closeCallback }) {
  return (
    <div className="fullScreenMask">
        <button onClick={closeCallback} className="closeBtn"><i className="material-icons">highlight_off</i></button>
        <SelectAreaMap closeCallback={closeCallback}/>
    </div>
  )
}
