import React, { Component } from 'react';
import { connect } from 'react-redux';

import LeftNavPanel from '../Modules/LeftNavPanel';
import RightAnalysisPanel from '../Modules/RightAnalysisPanel';
import Instruction from '../Modules/Instruction';

import AddAreaMapMask from '../Modules/AddAreaMapMask';
import LoadingMask from '../Modules/LoadingMask';
import CustomizedAlert from '../Modules/CustomizedAlert';

import { fetchYelpData } from '../../action/AppAction';

import { getAreaList, getLoading } from '../../reducer/AppReducer';

class AnalysisPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showAddNewPanel: false,
      showMsg: ''
    };

    this.toggleAddNewPanel = this.toggleAddNewPanel.bind(this);
  }

  componentWillMount() {
    // default add area USC and UCLA for test

    this.props.dispatch(fetchYelpData({
      key: '111',
      center: { lat: 34.02214227674331, lng: -118.28559674072267 },
      bound: {
        east: -118.25126446533204,
        north: 34.05059283085535,
        south: 33.99368218251132,
        west: -118.31992901611329,
      },
      searchInfo: '',
      selected: true,
      title: 'USC',
    }));
    this.props.dispatch(fetchYelpData({
      key: '222',
      center: { lat: 34.071349473266956, lng: -118.4465487 },
      bound: {
        east: -118.41221642460937,
        north: 34.09978351606314,
        south: 34.042905883759005,
        west: -118.48088097539062,
      },
      searchInfo: '',
      selected: true,
      title: 'UCLA',
    }));
  }


  toggleAddNewPanel(event, msg) {
    if (!msg) {
      this.setState({
        showAddNewPanel: !this.state.showAddNewPanel,
      });
    } else {
      console.log("---", msg);
      this.setState({
        showAddNewPanel: !this.state.showAddNewPanel,
        showMsg: msg,
      });
      window.setTimeout( function(){
        this.setState({
          showMsg: ''
        });
      }.bind(this), 2000 );
    }
  }

  render() {
    if (!this.props.areaList || this.props.areaList.length === 0) {
      return (
        <div style={{padding: "10px", background: "#CD4F39"}}>
          <div className="contentCard" style={{margin: "auto"}}>
            {this.props.loading ? <LoadingMask /> : null}
            {this.state.showAddNewPanel ? <AddAreaMapMask closeCallback={this.toggleAddNewPanel}/> : null}
            {this.state.showMsg ? <CustomizedAlert><span>{this.state.showMsg}</span></CustomizedAlert> : null}
            <Instruction toggleAddNewPanel={this.toggleAddNewPanel}/>
          </div>
        </div>
      );
    }

    return (
      <div>
        {this.props.loading ? <LoadingMask /> : null}
        {this.state.showAddNewPanel ? <AddAreaMapMask closeCallback={this.toggleAddNewPanel}/> : null}
        {this.state.showMsg ? <CustomizedAlert><span>{this.state.showMsg}</span></CustomizedAlert> : null}
        <LeftNavPanel toggleAddNewPanel={this.toggleAddNewPanel} />
        <RightAnalysisPanel />
      </div>
    );
  }
}

function mapStateToProps(store) {
  console.log("===", store);
  return {
    areaList: getAreaList(store),
    loading: getLoading(store),
  };
}

export default connect(mapStateToProps)(AnalysisPage);
