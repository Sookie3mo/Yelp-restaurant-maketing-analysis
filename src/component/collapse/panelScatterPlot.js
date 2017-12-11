import React, { Component } from 'react';
import { Element } from 'react-scroll';

import { Row, Col, Radio } from 'antd';

import ScatterPlot from '../charts/scatterPlot';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

class PanelScatterPlot extends Component {
  constructor(props) {
    super(props);
    this.state = {
      x: "price",
      y: "rating",
    };
  }

  onChangeX(e) {
    this.setState({
      x: e.target.value,
    });
  }

  onChangeY(e) {
    this.setState({
      y: e.target.value,
    });
  }

  render() {
    let size = window.innerWidth < 900 ? "small" : "";
    return (
      <div>
      <Row>
          <Col xs={{ span: 24, offset: 0 }} lg={{ span: 24, offset: 1 }}>
            <p className="smallText marginBottom">Choose horizontal and vertical Axis to explore more restaurant attributes data; Hover on bubbles to see more detailed information.</p>
            <p className="smallText marginBottom"></p>
          </Col>
      </Row>

        <ScatterPlot data={this.props.data} />

        <Element name="ele2"></Element>
      </div>
    );
  }

}

export default PanelScatterPlot;
