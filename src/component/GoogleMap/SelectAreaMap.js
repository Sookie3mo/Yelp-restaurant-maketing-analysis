import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import { initMap } from './initMap';
import { mapTheme2 } from './helpers';

import { fetchYelpData } from '../../action/AppAction';


const google = window.google;

const mapStyles = {
  display: "block",
  height: "80vw",
  width: "100%",
  margin: "auto",
  maxWidth: "600px",
  maxHeight: "500px",
  border: "1px solid #CD0000",
}

const inputStyles = {
  width: '35vw',
  maxWidth: "240px",
  marginTop: "8px",
  border: "1px solid #e0e0e0",
  fontSize: "16px",
  padding: "8px 5px"
}

class SelectAreaMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      center: '',
      bound: '',
      searchInfo: '',
    };
    this.handleCenterChange = _.debounce( this.handleCenterChange.bind(this), 150 );
    this.handleBoundsChange = _.debounce( this.handleBoundsChange.bind(this), 150 );
    this.handleSearch = this.handleSearch.bind(this);
    this.addCurrentArea = _.debounce( this.addCurrentArea.bind(this), 200 );
    this.constructAreaObject = this.constructAreaObject.bind(this);
    this.handleAddAreaResponse = this.handleAddAreaResponse.bind(this);
  }

  componentDidMount() {
    // @ param:
    // ( DOMNode, initCenter, DOMNodeForSearchBox, handleSearchCallback, handleCenterChangeCallback )
    // DOMNode: DOM node for render the google map
    // initCenter: center on view when init google map, default to be USC
    // DOMNodeForSearchBox: DOM node for render the search box
    // handleSearchCallback: callback function after user search for something
    // handleCenterChangeCallback: callback function after the center of map view changed
    this.setState({center: {lat: 34.022, lng: -118.288}});

    var myGoogleMap = initMap(this.selectAreaMapContainer, {lat: 34.022, lng: -118.288}, this["pac-input"], this.handleSearch, this.handleCenterChange, this.handleBoundsChange, mapTheme2);

  }

  handleCenterChange( LatLngObj ) {
    // pass in a google maps "LatLng" Object, see: https://developers.google.com/maps/documentation/javascript/reference#LatLng
    // can be used in google maps directly or get the latitude/logitude by calling .lat() and .lng()
    console.log("=== google maps: center change to ", { lat: LatLngObj.lat(), lng: LatLngObj.lng() } );
    this.setState({
      center: { lat: LatLngObj.lat(), lng: LatLngObj.lng() },
    });
    // do something

  }

  handleBoundsChange( LatLngBoundsObj ) {
    // pass in a google map "LatLngBounds" object, see: https://developers.google.com/maps/documentation/javascript/reference#LatLngBounds
    console.log("=== google maps: bounds change to ", LatLngBoundsObj.toJSON() );
    this.setState({
      bound: LatLngBoundsObj.toJSON(),
    });
    // do something

  }

  handleSearch( MarkerObj ) {
    // pass in a google map "Marker" object, see: https://developers.google.com/maps/documentation/javascript/reference#Marker
    console.log("=== google maps: get marker ", MarkerObj );
    this.setState({
      searchInfo: MarkerObj,
    });
    // do something

  }

  constructAreaObject(currentState) {
    return {
      ...currentState,
      key: new Date().getTime(),  // to ensure it is unique
      title: currentState.searchInfo && currentState.searchInfo.title ? currentState.searchInfo.title : `(${Math.floor(currentState.center.lat*1000)/1000}, ${Math.floor(currentState.center.lng*1000)/1000})`,  // can use the palce name if user used "search", otherwise use the country/state/city/street of the center point?
      yelpData: [],  // should fetch the restaurants information inside current area from the server
    }
  }

  addCurrentArea() {
    const newArea = this.constructAreaObject(this.state);
    this.props.dispatch(fetchYelpData(newArea, this.handleAddAreaResponse));
    // "addArea" action will be triggered when restaurants data successfully fetched
  }

  handleAddAreaResponse(err, data) {
    if (!err) {
      console.log("--- successfully fetched data ---", data);
      if (this.props.closeCallback) this.props.closeCallback(null, "Successfully added!");  // pass in cb(event, msg)
    } else {
      if (this.props.closeCallback) this.props.closeCallback(null, data);  // pass in cb(event, msg)
    }
  }

  render() {
    return (
      <div className="selectAreaMapWrapper">
        <input id="pac-input" className="controls" type="text" placeholder="Search Box" ref={ ele => { this["pac-input"] = ele; }} style={inputStyles} />
        <div ref={ ele => { this.selectAreaMapContainer = ele; }} style={mapStyles}></div>
        {this.state.center ? <button onClick={this.addCurrentArea}> add current area </button> : <button disabled> loading... </button>}
      </div>
    );
  }
}

export default connect()(SelectAreaMap);
