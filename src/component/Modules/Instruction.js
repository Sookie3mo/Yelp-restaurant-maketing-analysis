import React from 'react';
import SelectAreaMap from '../GoogleMap/SelectAreaMap';

export default (props) => {
  if (props.needSelect) {
    return (
      <div className="instructionWrapper needSelect">
        <div style={{textTransform: 'uppercase'}}>
          <i className="material-icons" style={{fontSize: "20px"}}>reply</i>
          <span className="instruction"> Click the cards on the left to start analysis. </span>
        </div>
      </div>
    );
  }
  return (
    <div className="instructionWrapper">
      <div style={{textTransform: 'uppercase'}}>
        <span className="instruction" style={{marginLeft: '25px'}}> Click the button
          <button
            className="leftNavBtn addBtn"
            onClick={props.toggleAddNewPanel}
            style={{margin: '0 10px 10px 10px', width: '120px', height: '80px'}}
          > + Add Area </button>
          to add a new area.
        </span>
      </div>
      <p style={{marginLeft: '25px', textTransform: 'uppercase'}}>
        Or use the map below to add an area:
        <i className="material-icons" style={{fontSize: "20px", transform: 'rotate(45deg) translateX(10px)'}}>redo</i>
      </p>
      {/*<ul style={{marginLeft: '25px', padding: '5px 20px 0 20px', listStyle: 'circle', fontSize: '12px'}}>
        <li>Use the search box on the map to find the area you are interested in! You will see analysis of price, rating and review count for the restaurants.</li>
        <li>Select more nearby areas to enable our fantastic comprehensive analysis panel!</li>
      </ul>*/}
      <SelectAreaMap />
    </div>
  );
}
