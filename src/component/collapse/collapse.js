
import React, { Component } from 'react';
import Scroll, { Element, scroller } from 'react-scroll';

import { Collapse, Menu, Dropdown, Button, Icon } from 'antd';

// import RatingBarChart from '../charts/rating';
// import PriceBarChart from '../charts/price';
// import PriceByCateBarChart from '../charts/priceByCate';
// import Histogram from '../charts/histogram';
import PanelScatterPlot from './panelScatterPlot';
import PanelHierarchicalBarChart from './panelHierarchicalBarChart';

import PanelSunburst from './PanelSunburst';
import PanelMap from './PanelMap';


const Panel = Collapse.Panel;
class CollapsePad extends Component {
  constructor(props){
    super(props);
    this.state = {
      prevlen: 3,
    }
    this.handleCollapseChange = this.handleCollapseChange.bind(this);
  }

  handleCollapseChange(event) {
    // console.log("====== handleCollapseChange ======", event.length ? `ele${event[event.length-1]}` : '');
    if (event.length && (event.length > this.state.prevlen) && event[event.length-1] !== '1') {
      let newTab = event[event.length-1];
      console.log("====== handleCollapseChange ======", event.length ? `ele${event[event.length-1]}` : '');
      let to = newTab === '3' ? 'ele2' : 'ele1';
      scroller.scrollTo(to, {
        duration: 500,
        delay: 100,
        smooth: true,
        containerId: 'contentWrapper',
        // offset: [event.length-1] === '3' ? 750 : 620, // Scrolls to element + 50 pixels down the page
      });
    }
    this.setState({
      prevlen: event.length,
    });
  }

  render() {
    console.log("Collapse", this.props.data);
    return (
      <Collapse bordered={false} defaultActiveKey={Array.isArray(this.props.data) ? ['1', '2'] : ['1', '2', '3']} onChange={this.handleCollapseChange} >
        {Array.isArray(this.props.data) ?
          <Panel header="Comprehensive Sunburst Diagram" key="1">
            <PanelSunburst data={this.props.data} />
          </Panel> :
          <Panel header="Restaurant Price, Rating and Review Count Information by Categories - Hierarchical Bar Chart" key="1">
            <PanelHierarchicalBarChart data={this.props.data} />
          </Panel>
        }
        {Array.isArray(this.props.data) ? null : <Panel header="Relationships of Average Price, Rating and Review Count Among Categories - Bubble Chart and Histogram" key="2">
          <PanelScatterPlot data={this.props.data} />
        </Panel>
        }
        <Panel header={Array.isArray(this.props.data) ? "Dot Map and Choropleth Map for Restaurants in Multiple Areas" : "Dot Map of Restaurants' Price, Rating and Review Count"} key={Array.isArray(this.props.data) ? '2' : '3'}>
          <PanelMap data={this.props.data} />
        </Panel>
      </Collapse>
    );
    // return (
    //   <Collapse bordered={false} defaultActiveKey={['1']}>
    //     <Panel header="Price" key="1">
    //       <p>price</p>
    //       <PriceBarChart data={areaData}/>
    //     </Panel>
    //     <Panel header="Rating" key="2">
    //       <p>rating</p>
    //       <RatingBarChart data={areaData}/>
    //     </Panel>
    //     <Panel header="Rating Histogram" key="3">
    //       <p>review histogram</p>
    //       <Histogram data={areaData} />
    //     </Panel>
    //   </Collapse>
    // );
  }

}

export default CollapsePad;
