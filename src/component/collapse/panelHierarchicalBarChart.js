import React, { Component } from 'react';
import * as d3 from 'd3';
import { Element } from 'react-scroll';

import { Row, Col, Button, Icon, Radio, Select } from 'antd';

import HierarchicalBarChart from '../charts/hierarchicalBarChart';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const Option = Select.Option;

class PanelHierarchicalBarChart extends Component {
  constructor(props) {
    super(props);
    const cate20 = this.getCategoryList(props.data.yelpData);
    const defaultSelectedAll = cate20.map((ele, index) => { return `${index}`; });
    this.state = {
      value: "price",
      data: this.props.data.yelpData,
      selectedData: null,
      selectedDataAvg: null,
      selectedCategory: defaultSelectedAll,  // select all
      returnFlag: false,
      categoryList: cate20,
    };
    this.updateData(defaultSelectedAll);
    this.isInclude = this.isInclude.bind(this);
  }
  //
  componentDidMount() {
    this.updateData(this.state.selectedCategory);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.data.key !== nextProps.data.key) {
      const cate20 = this.getCategoryList(nextProps.data.yelpData);
      const defaultSelectedAll = cate20.map((ele, index) => { return `${index}`; });
      this.setState({
        data: nextProps.data.yelpData,
        categorySelect: null,
        selectedData: null,
        selectedDataAvg: null,
        selectedCategory: defaultSelectedAll,  //select all
        returnFlag: false,
        categoryList: cate20,
      }, ()=>{ this.updateData(defaultSelectedAll); });
    }
  }


  getCategoryList(data) {
    var categoryList = {};
    data.map(ele => {
      ele.categories.map(d => {
        if (!categoryList[d]) {
          categoryList[d] = {name: d, cnt: 0};
        };
        categoryList[d].cnt += 1;
      })
    });
    let arrayVersion = Object.values(categoryList);
    arrayVersion.sort(function(a, b){return b.cnt - a.cnt;});
    arrayVersion = arrayVersion.length <= 20 ? arrayVersion : arrayVersion.slice(0, 20).map(ele => ele.name);
    arrayVersion.sort();
    return arrayVersion;
  }

  handleChangeRadio(e) {
    this.setState({
      value: e.target.value,
      returnFlag: false,
    });
  }

  handleSelect(e) {
    let newList = this.state.selectedCategory;
    newList.push(e);
    this.setState({
      selectedCategory: newList,
    });
    this.updateData(newList);
  }

  handleDeselect(e) {
    let newList = this.state.selectedCategory.filter(ele => {
      return ele != e;
    });
    this.setState({
      selectedCategory: newList,
    })
    this.updateData(newList);
  }

  updateData(newList) {
    let data = this.state.data;
    let selectedCategory = newList;

    let newDataList = [];
    data.map(ele => {
      ele.categories.map(d => {
        const flag = this.isInclude(d); //this.isInclude(d)
      	if (flag) {
      	  let object = Object.assign({}, ele);
          object["category"] = d;
          newDataList.push(object);
      	}
      })
    });
    var selectedDataAvg = d3.nest()
      .key(ele => {return ele.category})
      .rollup(ele => {return {
        count: ele.length,
        price: d3.mean(ele, d => {return d.price}),
        rating: d3.mean(ele, d => {return d.rating}),
        review_count: d3.mean(ele, d => {return d.review_count}),
      }})
      .entries(newDataList)
      .sort((v1, v2) => {return d3.descending(v1.key, v2.key)});
    var selectedData = d3.nest()
      .key(ele => {return ele.category})
      .entries(newDataList)
      .sort((v1, v2) => {return d3.descending(v1.key, v2.key)});

    this.setState({
      selectedData: selectedData,
      selectedDataAvg: selectedDataAvg,
    })
  }

  isInclude(ctg) {
    const allCategory = this.state.categoryList;
    return this.state.selectedCategory.find(i => { return allCategory[i] === ctg; });
  }

  handleClick(e) {
    this.setState({
      returnFlag: false,
    });
  }

  onChildChange(newState) {
    console.log("newState", newState);
    this.setState({returnFlag: newState})
  }

  render() {
  	console.log(" ----- avg",this.state);
    let returnButton = <Button onClick={e => this.handleClick(e)}><Icon type="left" />BACK TO SELECTED CATEGORIES</Button>;
    // var renderSelect = this.changeSelect();
    let size = window.innerWidth < 900 ? "small" : "";

    return (
      <div>
      <Row>
        <Col span={24} offset={1} className="marginTop">
          <p>Choose attributes and category to explore more restaurants Information; Click on bars to see detailed information of the selected category.</p>
        </Col>
        <Col span={15} offset={1} className="marginTop">
          <p className="blackText marginBottom">Category </p>
          <Select
            mode="multiple"
            placeholder="multi select category"
            style={{width:"calc(100% - 20px)", marginBottom: "20px"}}
            value={this.state.selectedCategory}
            onSelect={e => this.handleSelect(e)}
            onDeselect={e => this.handleDeselect(e)}>
            {this.state.categoryList.map((ele, index) => {
              return <Option key={`${index}`} title={ele}>{ele}</Option>
            })}
          </Select>
        </Col>
        <Col span={7} offset={0} className="marginTop">
          <p className="blackText marginBottom">Attributes </p>
          <RadioGroup onChange={(e) => this.handleChangeRadio(e)} defaultValue={this.state.value} size={size}>
            <RadioButton value="price" className="smallText">Price</RadioButton>
            <RadioButton value="rating" className="smallText">Rating</RadioButton>
            <RadioButton value="review_count" className="smallText">Review Count</RadioButton>
          </RadioGroup>
          {this.state.returnFlag ? <div style={{marginTop: "20px"}}>{returnButton}</div> : null}
        </Col>
      </Row>
      <Row>
        <Col span={22} offset={0} style={{overflow: "visible"}}>
          <div style={{'marginLeft': '10%'}}><HierarchicalBarChart
            data={this.state.selectedData}
            data_avg={this.state.selectedDataAvg}
            value={this.state.value}
            returnFlag={this.state.returnFlag}
            callbackParent={(newState) => this.onChildChange(newState)}
          /></div>
        </Col>
      </Row>
      </div>
    );
  }

}

export default PanelHierarchicalBarChart;
