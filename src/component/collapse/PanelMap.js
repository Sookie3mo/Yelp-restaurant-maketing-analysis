import React, { Component } from 'react';
import { Element } from 'react-scroll';

import ShowDataMap from '../GoogleMap/ShowDataMap';
import { parsePrice, getColor, findMaxMin } from '../GoogleMap/helpers';

export class PanelMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentFeature: 'price',  // 'price', 'rating', 'review_count'
    };
    this.onChangeFeature = this.onChangeFeature.bind(this);
  }

  onChangeFeature(event) {
    this.setState({
      currentFeature: event.target.value,
    });
  }

  renderScale(currentArea, currentFeature, isArray) {
    let reference = {
      price: {
        key: 'price',
        values: [1, 2, 3, 4],
      },
      rating: {
        key: 'rating',
        values: [1, 2, 3, 3.5, 4, 4.5, 5],
      },
      review_count: {
        key: 'review_count',
        values: [10, 50, 100, 500, 1000, 2500, 5000],
      }
    };
    const ele = reference[currentFeature];
    const min = isArray ? findMaxMin(currentArea, currentFeature).MIN : currentArea.ranges[currentFeature].min;
    const max = isArray ? findMaxMin(currentArea, currentFeature).MAX : currentArea.ranges[currentFeature].max;

    const singleScale = ele.values.map((v, i) => {
      // return this.renderSingle(max, min, v, i, currentFeature, isArray);
      return this.renderSingle(max, min, v, i, currentFeature, true);
    });

    if(isArray){
      const {MINAVG, MAXAVG} = findMaxMin(currentArea, currentFeature);
      let sorted = currentArea.sort((a, b) => {return a.ranges[currentFeature].avg-b.ranges[currentFeature].avg})
      const square = currentArea.map((v, i) => {
        return this.renderSingle(MAXAVG, MINAVG, v.ranges[currentFeature].avg, i, currentFeature, isArray, true);
      });
      return <div><div style={{margin: '10px 0'}}>{singleScale}</div><div style={{margin: '10px 0'}}>{square}</div></div>;
    }

    return <div style={{margin: '10px 0', fontSize: "14px"}}>{singleScale}<span style={{display: 'table-cell', fontWeight: "bold"}}>{`Restaurant count: ${currentArea.yelpData.length}. (Click bubble to zoom in)`}</span></div>;
  }

  getRadius(currentFeature, value) {
    return currentFeature === 'review_count' ? Math.pow(value, 0.5) * 30 : (currentFeature === 'price' ? Math.pow(value, 1.5) * 25 : Math.pow(value, 2) * 20)
  }

  renderSingle(max, min, v, i, currentFeature, isArray, isSQ){
    const scale = max - min;
    const sup = v - min;
    if ((sup <= 0 || v > max) && (!isSQ)) return null;
    const r = 2 * (Math.round(this.getRadius(currentFeature, sup/scale)) + 1);
    const s = {
      width: `${isArray ? 20: r}px`,
      height: `${isArray ? 20: r}px`,
      lineHeight: `${isArray ? 20: r}px`,
      borderRadius: `${isSQ ? '0' : '50%'}`,
      border: '1px solid #e0e0e0',
      verticalAlign: 'middle',
      display: 'inline-block',
      textAlign: 'center',
      marginRight: '5px',
      background: `${isArray ? getColor(sup/scale): 'rgb(255, 0, 0)'}`,
      opacity: '0.5',
    }
    return <span style={{display: 'table-cell', minWidth: '20px'}} key={i}>
        {currentFeature==='price' ? (isSQ ? `${v}$ ` : parsePrice(v)) : v}
        <span style={s}></span>
      </span>
  }

  render() {
    const featureList = <form>
      {['price', 'rating', 'review_count'].map((ele, index) => {
        return <span key={index}>
            <input type="radio" name="feature" value={ele} checked={this.state.currentFeature === ele} onChange={this.onChangeFeature} />
            <label style={{paddingRight: "20px", verticalAlign: "text-bottom", textTransform: "capitalize", fontSize: "14px"}}> {ele.replace('_', ' ')} </label>
          </span>;
      })}
    </form>;

    return (
      <div>
        {featureList}
        {this.renderScale(this.props.data, this.state.currentFeature, Array.isArray(this.props.data))}
        <ShowDataMap currentArea={this.props.data} currentFeature={this.state.currentFeature} />
        <Element name={Array.isArray(this.props.data) ? 'ele2' : 'ele3'}></Element>
      </div>
    )
  }
}

export default PanelMap;
