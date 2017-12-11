import React, { Component } from 'react';

import { drawSunburst } from './drawSunburst';

// import { yelp_sample_response_1 } from '../../yelp_sample_response';

export default class Sunburst extends Component {
  componentDidMount() {
    if (this.props.data && this.props.data.length) drawSunburst(this.props.data, 'sunburstContainer');
  }

  componentWillReceiveProps(nextProps) {
    const { data } = nextProps;
    if( !data || data.length === 0 ) return;

    if(!this.props.data || this.props.data.length !== data.length) {
      window.d3.select('#sunburstContainer').select('svg').remove();
      drawSunburst(data, 'sunburstContainer');

    }
  }

  render() {
    const { data } = this.props;
    console.log('===== data sunburst ====', data);
    return (
      <div className="sunburstWrapper">
      <p> Click on any arc to zoom in, and click on the center circle to zoom out.</p>
            <p> To see details, move the mouse pointer on each arc. </p>
        <form name="myForm">
          <label id="label1"><input type="radio"  name="mode" value="1" id="price" defaultChecked />&nbsp;Price&nbsp; &nbsp;</label>


          <label id="label2"><input type="radio"  name="mode" value="2" id="rating" /> &nbsp;Rating&nbsp; &nbsp;</label>

           <label id="label3"><input type="radio" name="mode" value="3" id="review_count" />&nbsp;Review Count&nbsp; &nbsp;</label>
           <br/>
           <br/>
        </form>
        <div id="sequence"></div>
        <div id="legend_rect"></div>
        <div id="legend_text"></div>
        <div id="sunburstContainer"></div>
      </div>
    )
  }
}
