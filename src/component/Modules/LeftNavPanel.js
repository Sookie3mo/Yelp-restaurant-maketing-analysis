import React from 'react';
import { connect } from 'react-redux';

import ButtonMap from '../GoogleMap/ButtonMap';

import { toggleArea, removeArea, analyzeArea } from '../../action/AppAction';
import { getAreaList, getAreaToShow, getComprehensive } from '../../reducer/AppReducer';

function mapStateToProps(store) {
  return {
    areaList: getAreaList(store),
    areaToShow: getAreaToShow(store),
    comprehensive: getComprehensive(store),
  };
}

export default connect(mapStateToProps)( ({ toggleAddNewPanel, areaList, areaToShow, comprehensive, dispatch }) => {
  const instructionNode = (
    <div className="leftNavCard instruction">
      <div className="upperLayer" style={{width: "100%", left: "0"}}>
        <div><i>CLICK THE CARDS!</i></div>
        {comprehensive ? <div><i>Add to compare: </i><i className="material-icons">check_box</i></div> : null}
        {comprehensive ? null : <div><i>See analysis: </i><i className="material-icons">poll</i></div>}
        <div><i>Remove the area: </i><i className="material-icons">close</i></div>
      </div>
    </div>
  );
  const instructionNode2 = (
    <div className="leftNavCard instruction">
      <div className="upperLayer" style={{width: "100%", left: "0"}}>
        <div style={{height: "30%"}}><i>RESTAURANT ATTRIBUTES</i></div>
          <div style={{"font-size":"0.9vmax", height: "20%"}}><i>Price: $ - $$$$</i></div>
          <div style={{"font-size":"0.9vmax", height: "20%"}}><i>Rating: 1 - 5</i></div>
          <div style={{"font-size":"0.9vmax", height: "20%"}}><i>Review Count: >= 0</i></div>
      </div>
    </div>
  );
  return (
    <div className="leftNavContainer"><div className="leftNav">
      {instructionNode}
      {instructionNode2}
      { areaList.map((ele, index) => {
        const buttons = comprehensive ? <div className="upperLayer">
                      {/* <div className="rowTitle">{ele.title}</div> */}
                      <div className={ele.selected ? 'rowCheck selected' : 'rowCheck'} onClick={() => { dispatch(toggleArea(ele.key)); }}>
                        <i className="material-icons">{ele.selected ? 'check_box' : 'check_box_outline_blank'}</i>
                      </div>
                      <div className="rowRemove" onClick={() => { dispatch(removeArea(ele.key)); }}>
                        <i className="material-icons">close</i>
                      </div>
                    </div> : <div className="upperLayer">
                      {/* <div className="rowTitle">{ele.title}</div> */}
                      <div className={ele.key === areaToShow && !comprehensive ? 'rowAnalyze selected' : 'rowAnalyze'} onClick={() => { dispatch(analyzeArea(ele.key)) }}>
                        <i className="material-icons">poll</i>
                      </div>
                      <div className="rowRemove" onClick={() => { dispatch(removeArea(ele.key)); }}>
                        <i className="material-icons">close</i>
                      </div>
                    </div>
        return (
          <div key={index} className={`leftNavCard ${ele.key === areaToShow && !comprehensive  ? 'selectedCardSingle' : ''} ${ele.selected && comprehensive ? 'selectedCardCompr' : ''}`}>
            <ButtonMap center={ele.center} bound={ele.bound} />
            <div className="buttonMapMask" onClick={comprehensive ? () => { dispatch(toggleArea(ele.key)); } : () => { dispatch(analyzeArea(ele.key)) }}></div>
              {buttons}
          </div>
        );
      }) }
      <button className="leftNavCard addBtn" onClick={toggleAddNewPanel}> + Add Area </button>
    </div></div>
  );
})
