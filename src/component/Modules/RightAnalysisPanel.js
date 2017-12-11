// right hand panel: with map view and d3 charts

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Switch } from 'antd';

import CollapsePad from '../collapse/collapse';
import Instruction from './Instruction';

import { toggleComp } from '../../action/AppAction';
import { getAreaList, getAreaToShow, getComprehensive } from '../../reducer/AppReducer';

class RightAnalysisPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      comprehensiveAreas: props.areaList.filter( ele => ele.selected ),
    };
  }

  componentWillReceiveProps(nextProps) {
    // console.log("===willreceiveprops===comprehensiveAreas", this.state.comprehensiveAreas);
    const selectedList = nextProps.areaList.filter( ele => ele.selected );
    this.setState({
      comprehensiveAreas: selectedList,
    });
  }

  render() {
    console.log("---comprehensiveAreas---", this.state.comprehensiveAreas);
    const { areaList, areaToShow, comprehensive, dispatch } = this.props;

    const topTabs = (
      <div className="topTabs">
        <span className={`singleTab ${comprehensive ? '' : 'currentTab'}`} onClick={() => { dispatch(toggleComp(false)); }}>
          SINGLE AREA ANALYSIS
        </span>
        <span className={`comparisonTab ${comprehensive ? 'currentTab' : ''}`} onClick={() => { dispatch(toggleComp(true)); }}>
          MULTIPLE AREAS ANALYSIS
        </span>
      </div>
    )

    const currentArea = areaList.find(ele => ele.key === areaToShow);
    if ((comprehensive || !currentArea) && (!this.state.comprehensiveAreas || this.state.comprehensiveAreas.length === 0)) {
      return <div className="rightView">{topTabs}<div className="contentCard"><div className="contentWrapper"><Instruction needSelect /></div></div></div>;
    }

    return (
      <div className="rightView">
        {topTabs}
        <div className="contentCard">
          <div className="contentWrapper" id="contentWrapper">
            {/* put any charts here, map, sunburst, scatter ... */}
            <CollapsePad data={comprehensive ? this.state.comprehensiveAreas : (currentArea || this.state.comprehensiveAreas)}/>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(store) {
  console.log("==store==", store);
  return {
    areaList: getAreaList(store),
    areaToShow: getAreaToShow(store),
    comprehensive: getComprehensive(store),
  };
}

export default connect(mapStateToProps)(RightAnalysisPanel);
