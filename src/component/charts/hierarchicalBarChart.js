import React, { Component } from 'react';
import * as d3 from 'd3';

class HierarchicalBarChart extends Component {
  constructor(props){
    super(props);
    // console.log("barchartdata", this.props);
    this.state = {
      data: null,
      data_avg: null,
      svg: "",
      width: 800,
      height: 450,
      margin: {top: 30, right: 50, bottom: 50, left: 65},
      legendWidth: 200,
      xValue: this.props.value,
      duration: 600,
      delay: 50,
      colorScheme: d3.schemeCategory20,
      returnFlag: this.props.returnFlag,
    };
  }

  componentDidMount() {
    let state = this.state,
      margin = state.margin,
      legendWidth = state.legendWidth,
      width = state.width - margin.left - margin.right - legendWidth,
      height = state.height - margin.top - margin.bottom;

    let plot = d3.select("#hierarchicalbarchart")
            .append("svg")
            .attr("height", height + margin.top + margin.bottom)
            .attr("width", width + margin.left + margin.right + legendWidth)
            .attr("class", "chart")
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    plot.append("g").attr("class", "x_axis");
    plot.append("g").attr("class", "y_axis");

    this.setState({
      svg: plot,
    });
  }

  componentWillReceiveProps(props) {
    console.log("barchart recieve state", this.state)
    console.log("barchart recieve props", props);
    this.setState({
      data: props.data,
      data_avg: props.data_avg,
      xValue: props.value,
      returnFlag: props.returnFlag,
    });

  }

  onClickDown(clickData) {
    // console.log("clickData", clickData);

    let state = this.state,
      svg = state.svg || false,
      margin = state.margin,
      legendWidth = state.legendWidth,
      width = state.width - margin.left - margin.right - legendWidth,
      height = state.height - margin.top - margin.bottom,
      xValue = state.xValue,
      duration = state.duration;

    var exit = svg.selectAll(".enter")
      .attr("class", "exit");

    let yDomain = clickData.map(ele => {return ele.key});

    // axis
    var yScale = d3.scaleBand().domain(yDomain).range([height, 0]).paddingInner([0.1]).paddingOuter([0.05]);
    var yAxis = d3.axisLeft().scale(yScale).ticks(20);

    let maxX = Math.ceil(d3.max(clickData, ele => {return ele.value[xValue]}) * 100) / 100;
    var xScale = d3.scaleLinear().domain([0, maxX]).range([0, width]);
    var xAxis = d3.axisTop().scale(xScale).ticks(10);

    this.generateAxis(xAxis, yAxis);

    var enter = this.generateBars(clickData, xScale, yScale);

    exit.transition()
      .duration(duration / 2)
      .remove();

    this.generateLegend(clickData);

    var newState = !this.state.returnFlag;
    this.setState({returnFlag:newState});
    this.props.callbackParent(newState);

  }

  generateBars(data, xScale, yScale) {
    // console.log("bardata", data);
    let state = this.state,
      svg = state.svg || false,
      xValue = state.xValue,
      duration = state.duration,
      delay = state.delay,
      colorScheme = state.colorScheme;
    var bars = svg.selectAll(".enter").data(data);
    bars.enter()
      .append("rect")
      .attr("class", "enter")
      .merge(bars)
      .transition()
      .duration(duration)
      .attr("x", "0")
      .attr("y", ele => {return yScale(ele.key)})
      .attr("width", ele => {return xScale(ele.value[xValue])})
      .attr("height", yScale.bandwidth())
      .style("fill", (ele,i) => {return colorScheme[i]})
      .style("fill-opacity", 0.8);

    bars.exit()
      .transition()
      .duration(duration)
      .remove();

    return bars;
  }

  generateAxis(xAxis, yAxis) {
    let state = this.state,
      svg = state.svg || false,
      duration = state.duration,
      delay = state.delay;
    console.log("axis", this.state.data)
    if (this.state.data.length === 0) {
      svg.transition()
        .duration(duration).selectAll(".x_axis").remove();
      svg.transition()
        .duration(duration).selectAll(".y_axis").remove();
      svg.append("g").attr("class", "x_axis");
      svg.append("g").attr("class", "y_axis");
      return;
    }
    svg.transition()
      .duration(duration)
      .selectAll(".x_axis")
      .delay((ele, i) => {return i * delay})
      .call(xAxis)
      .style("font-size", "0.9vmax")
    svg.transition()
      .duration(duration)
      .selectAll(".y_axis")
      .delay((ele, i) => {return i * delay})
      .call(yAxis)
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("transform", `rotate(-45)`)
      .attr("dy", "-2em")
      .style("font-size", "0.9vmax")
  }

  generateLegend(data) {
    let state = this.state,
      svg = state.svg || false,
      margin = state.margin,
      legendWidth = state.legendWidth,
      width = state.width - margin.left - margin.right - legendWidth,
      height = state.height - margin.top - margin.bottom,
      duration = state.duration,
      delay = state.delay,
      colorScheme = state.colorScheme;

    // console.log("legendata", data);
    let legend = svg.selectAll(".legend").data(data);
    let legend_text = svg.selectAll(".legend_text").data(data);
    let legend_radius = 5;

    legend.enter()
      .append("circle")
      .attr("class", "legend")
      .merge(legend)
      .transition()
      .duration(duration)
      .attr("r", legend_radius)
      .attr("cx", width + legendWidth / 3.0 - 10)
      .attr("cy", (ele, i) => height * 3 /4.0 + margin.top - i * legend_radius * 3)
      .style("fill", (ele, i) => {return colorScheme[i]})

    legend.exit()
      .transition()
      .duration(duration)
      .remove();

    legend_text.enter()
      .append("text")
      .attr("class", "legend_text")
      .merge(legend_text)
      .transition()
      .duration(duration)
      .text(ele => {return ele.key})
      .attr("x", width + legendWidth / 3.0 + legend_radius * 3.0 - 10)
      .attr("y", (ele, i) => height * 3 /4.0 + margin.top - i * legend_radius * 3 + legend_radius)

    legend_text.exit()
      .transition()
      .duration(duration)
      .remove();
  }

  render() {
    console.log("barchart render");
    console.log(this.state);
    let state = this.state,
      data = state.data,
      data_avg = state.data_avg,
      svg = state.svg || false,
      margin = state.margin,
      legendWidth = state.legendWidth,
      width = state.width - margin.left - margin.right - legendWidth,
      height = state.height - margin.top - margin.bottom,
      xValue = state.xValue,
      // duration = state.duration,
      // delay = state.delay,
      // colorScheme = state.colorScheme,
      returnFlag = state.returnFlag;

    console.log("state.data", this.state.data);
    // if (svg && this.state.data != null && !returnFlag) {
    if (svg && this.state.data != null && !returnFlag) {

      // data process
      var chartData = this.state.data;
      var chartDataAvg = this.state.data_avg;
      var chartDataCategory = chartDataAvg.map(ele => {return ele.key});
      // console.log("state", this.state);
      // console.log("category", chartDataCategory);

      // axis
      var yScale = d3.scaleBand().domain(chartDataCategory).range([height, 0]).paddingInner([0.1]).paddingOuter([0.05]);
      var yAxis = d3.axisLeft().scale(yScale).ticks(20);

      // let minX = Math.floor(d3.min(chartDataAvg, ele => {return ele.value[xValue]}));
      let maxX = Math.ceil(d3.max(chartDataAvg, ele => {return ele.value[xValue]}) * 100) / 100;
      var xScale = d3.scaleLinear().domain([0, maxX]).range([0, width]);
      var xAxis = d3.axisTop().scale(xScale).ticks(10);

      this.generateAxis(xAxis, yAxis);

      // bars
      var bars = this.generateBars(chartDataAvg, xScale, yScale);

      // bars mouse action
      svg.selectAll(".enter")
        .on("click", ele => {
          let filterData = chartData.filter(d => {return d.key == ele.key});
          // console.log(filterData[0].values);
          let clickData = d3.nest()
              .key(ele => {return ele.name})
              .rollup(ele => {return {
                price: d3.mean(ele, d => {return d.price}),
                rating: d3.mean(ele, d => {return d.rating}),
                review_count: d3.mean(ele, d => {return d.review_count}),
              }})
              .entries(filterData[0].values)
              .sort((v1, v2) => {return d3.descending(v1.key, v2.key)});
          this.onClickDown(clickData);
        });

      // legend
      this.generateLegend(chartDataAvg);

      // svg.selectAll(".legend")
      //   .on("mouseover", (ele, i) => this.onMouseOver(ele, i, svg, xScale, yScale, width, xValue, yValue, legend_radius * 1.5))
      //   .on("mouseout", (ele, i) => this.onMouseOut(ele, i, colorScheme, legend_radius));
    }

    return (
      <div id="hierarchicalbarchart"></div>
    );
  }
}



export default HierarchicalBarChart;
