import React, { Component } from 'react';
import { mapTheme2 } from './helpers';

export default class ButtonMap extends Component {
  componentDidMount() {
    var map = new window.google.maps.Map( this.buttomMapContainer, {
      center: this.props.center ? {lat: this.props.center.lat, lng: this.props.center.lng + 0.006} : {lat: 34.022, lng: -118.288 + 0.006},
      zoom: 12,
      mapTypeId: 'roadmap',
      disableDefaultUI: true,
      gestureHandling: 'cooperative',
      styles: mapTheme2,
    });
  }

  render() {
    const mapStyles = {
      display: "block",
      height: "100%",
      width: "100%",
      margin: "auto",
    }
    return (
      <div className="buttonMap">
        <div ref={ ele => { this.buttomMapContainer = ele; }} style={mapStyles}></div>
      </div>
    );
  }
}
