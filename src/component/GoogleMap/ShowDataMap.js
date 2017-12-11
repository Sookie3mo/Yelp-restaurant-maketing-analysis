import React, { Component } from 'react';
import { initMap } from './initMap';
import { constructGeoJson, getColor, constructInfoToShow, isSameArray, parsePrice, mapTheme, findMaxMin } from './helpers';

const google = window.google;
var map;

export class ShowDataMap extends Component {
  constructor(props) {
    super(props);
    this.drawBubble = this.drawBubble.bind(this);
    this.drawPolygons = this.drawPolygons.bind(this);
  }

  componentDidMount() {
    const { currentArea, currentFeature } = this.props;

    if( !currentArea || currentArea.length === 0 ) return;

    map = new google.maps.Map(this.showDataMapContainer, {
        center: currentArea.center || {lat: 34.022, lng: -118.288},
        mapTypeId: 'roadmap',
        styles: mapTheme,
        gestureHandling: 'cooperative',
      });

    this.relocateAndDraw(currentArea, currentFeature);
  }

  componentWillReceiveProps(nextProps) {
    const { currentArea, currentFeature } = nextProps;
    if( !currentArea || currentArea.length === 0 ) return;

    if(currentArea.key !== this.props.currentArea.key || currentFeature !== this.props.currentFeature || this.props.currentArea.length !== nextProps.currentArea.length) {
      this.relocateAndDraw(currentArea, currentFeature);
    }
  }

  relocateAndDraw(currentArea, currentFeature) {
    if (Array.isArray(currentArea) && currentArea.length >= 1) {              // comprehensive view but only one element in the areaList
      const newBound = {
        east: Math.max.apply(Math, currentArea.map(function(o){return o.bound.east;})),
        north: Math.max.apply(Math, currentArea.map(function(o){return o.bound.north;})),
        south: Math.min.apply(Math, currentArea.map(function(o){return o.bound.south;})),
        west: Math.min.apply(Math, currentArea.map(function(o){return o.bound.west;})),
      };
      map.fitBounds(newBound);
      this.clearData();
      this.drawPolygons(currentArea, currentFeature);
    } else {                                                                // single view
      map.fitBounds(currentArea.bound);
      this.clearData();
      this.drawBubble(currentArea, currentFeature);
    }
  }

  clearData() {
    map.data.forEach(function (feature) {
        map.data.remove(feature);
    });
    google.maps.event.clearInstanceListeners(map.data);
  }

  drawBubble(currentArea, currentFeature) {
    if (!map || !currentArea || !currentArea.yelpData || currentArea.yelpData.length === 0) {
      return;
    }

    map.data.addGeoJson(constructGeoJson(currentArea.yelpData));

    const { min, max } = currentArea.ranges[currentFeature];

    map.data.setStyle(function(feature) {
      const value = (feature.getProperty(currentFeature || 'price')-min)/(max-min);
      // console.log('-------get ra ---', currentFeature, feature.getProperty(currentFeature || 'price'), Math.round(currentFeature === 'review_count' ? Math.pow(value, 0.5) * 30 : (currentFeature === 'price' ? Math.pow(value, 1.5) * 25 : Math.pow(value, 2) * 20)));
      return {
        icon: {
          // path: google.maps.SymbolPath.CIRCLE,
          // fillColor: 'red',
          // fillOpacity: .3,
          // scale: Math.round(currentFeature === 'review_count' ? Math.pow(value, 0.5) * 30 : (currentFeature === 'price' ? Math.pow(value, 1.5) * 25 : Math.pow(value, 2) * 20)),
          // strokeColor: 'white',
          // strokeWeight: .5
          path: google.maps.SymbolPath.CIRCLE,
          fillColor: getColor(value),
          fillOpacity: .5,
          scale: 8,
          strokeWeight: 0
        }
      };
    })

    let infowindow = new google.maps.InfoWindow();
    map.data.addListener('mouseover', function(event) {
      // console.log('---- on mouse over ----', event);
      if (event.feature.getProperty(currentFeature)) {
        const myHTML = currentFeature === 'price' ? parsePrice(event.feature.getProperty(currentFeature)): event.feature.getProperty(currentFeature);
        infowindow.setContent("<div style='width:initial; white-space:pre-line; text-transform:capitalize;'>"+currentFeature.replace('_', ' ')+": "+myHTML+"</div>");
        // position the infowindow on the marker
        infowindow.setPosition(event.latLng);
        // anchor the infowindow on the marker
        infowindow.setOptions({pixelOffset: new google.maps.Size(0,-30)});
        infowindow.open(map);
        this.infoContainer.textContent = constructInfoToShow(event.feature.f);
      }
    }.bind(this))
    map.data.addListener('mouseout', event => {
      infowindow.close();
      this.infoContainer.textContent = '';
      // this.infoContainer.style.display = 'hidden';
    })

    map.data.addListener('click', event => {
      console.log('====== on click =======', event);
      map.setCenter(event.latLng);
      map.setZoom(15);
    })

    map.data.addListener('click', function(event) {
      if (event.feature.getProperty(currentFeature)) {
        infowindow.setContent("<div style='width:initial; white-space:pre-line; text-transform:capitalize;'>"+constructInfoToShow(event.feature.f)+"</div>");
        // position the infowindow on the marker
        infowindow.setPosition(event.latLng);
        // anchor the infowindow on the marker
        infowindow.setOptions({pixelOffset: new google.maps.Size(0,-30)});
        infowindow.open(map);
      }
    });

  }

  drawPolygons(areaList, currentFeature) {
    console.log('------- draw polygons --------', areaList);
    const { MAX, MIN, MAXAVG, MINAVG, AVG } = findMaxMin(areaList, currentFeature);
    const polygons = areaList.map(ele => {
      return {
        properties: {
          avg: ele.ranges[currentFeature].avg,
          max: ele.ranges[currentFeature].max,
          min: ele.ranges[currentFeature].min,
          cnt: ele.yelpData.length,
        },
        geometry: new google.maps.Data.Polygon([[
          {lat: ele.bound.north, lng: ele.bound.west}, // north west
          {lat: ele.bound.south, lng: ele.bound.west}, // south west
          {lat: ele.bound.south, lng: ele.bound.east}, // south east
          {lat: ele.bound.north, lng: ele.bound.east}  // north east
        ]]),
      };
    });

    polygons.forEach(ele => { map.data.add(ele); });

    areaList.forEach(ele => { map.data.addGeoJson(constructGeoJson(ele.yelpData)); });

    map.data.setStyle(function(feature) {
      if (!feature.getProperty('avg')) {
        const value = feature.getProperty(currentFeature || 'price');
        return {
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: getColor((value-MIN)/(MAX-MIN)),
            fillOpacity: .3,
            scale: 10,
            strokeWeight: 0
          }
        };
      } else {
        return {
          fillColor: getColor((feature.getProperty('avg')-MINAVG)/(MAXAVG-MINAVG)),
          strokeColor: 'white',
          fillOpacity: .2,
          strokeWeight: .5,
        };
      }
    }.bind(this));

    let infowindow = new google.maps.InfoWindow();
    map.data.addListener('mouseover', function(event) {
      if (event.feature.getProperty('avg')) {
        const max = event.feature.getProperty('max');
        const min = event.feature.getProperty('min');
        const avg = event.feature.getProperty('avg');
        const cnt = event.feature.getProperty('cnt');
        infowindow.setContent("<div style='width:initial; white-space: pre-line; text-transform:capitalize;'>"+this.renderTotal(max, min, avg, cnt, currentFeature, true)+"</div>");
        // position the infowindow on the marker
        infowindow.setPosition(event.latLng);
        // anchor the infowindow on the marker
        infowindow.setOptions({pixelOffset: new google.maps.Size(0,-30)});
        infowindow.open(map);
      } else {
        this.infoContainer.textContent = constructInfoToShow(event.feature && event.feature.f ? event.feature.f : '');
      }
    }.bind(this));
    map.data.addListener('mouseout', event => {
      infowindow.close();
      this.infoContainer.textContent = '';
    })
  }

  renderTotal(max, min, avg, cnt, currentFeature, singleArea) {
    if (currentFeature === 'price') {
      return `${currentFeature} of ${singleArea ? 'this area' : 'all these areas'}: \r\n max: ${parsePrice(max)}\r\n min: ${parsePrice(min)}\r\n average: ${parsePrice(avg)}${cnt ? '\r\n restaurants count: ' + cnt : ''}`;
    } else {
      return `${currentFeature.replace('_', ' ')} of ${singleArea ? 'this area' : 'all these areas'}: \r\n max: ${max}\r\n min: ${min}\r\n average: ${avg}${cnt ? '\r\n restaurants count: ' + cnt : ''}`;
    }
  }

  render() {
    console.log('------- show data map this.props -------', this.props.currentArea);
    const { currentArea, currentFeature } = this.props;
    let totalInfo;
    if( !currentArea || currentArea.length === 0 ) {
      return <div></div>;
    }
    if (Array.isArray(currentArea)) {
      const { MAX, MIN, MAXAVG, MINAVG, AVG, CNT } = findMaxMin(currentArea, currentFeature);
      totalInfo = this.renderTotal(MAX, MIN, AVG, CNT, currentFeature);
    } else {
      const { max, min, avg } = currentArea.ranges[currentFeature];
      const cnt = currentArea.yelpData.length;
      totalInfo = this.renderTotal(max, min, avg, cnt, currentFeature, true);
    }

    return (
      <div className="showDataMapWrapper">
        <div ref={ ele => { this.showDataMapContainer = ele; }} className="showDataMap"></div>
        <div className="infoWrapper" >
          <div ref={ ele => { this.totalInfoContainer = ele; }} className="totalInfoContainer">
            {totalInfo}
          </div>
          <div ref={ ele => { this.infoContainer = ele; }} className="infoContainer"></div>
        </div>
      </div>
    )
  }
}

export default ShowDataMap;
