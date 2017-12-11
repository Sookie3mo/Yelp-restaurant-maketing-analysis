import React, { Component } from 'react';
import * as d3 from 'd3';

import { Row, Col, Radio } from 'antd';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

class ScatterPlot extends Component {
  constructor(props){
    super(props);
    console.log("scatterplotdata", this.props);
    let windowSize = window.innerWidth;
    // if (windowSize > 900) {
    this.state = {
      data: this.props.data.yelpData,
      svg: "",
      svglgd: "",
      svgchs: "",
      svgchlgd: "",
      width: windowSize / 2.5,
      height: 500,
      margin: {top: 40, right: 50, bottom: 80, left: 100},
      legendWidth: 0,
      xValue: "price",
      yValue: "rating",
      selectedData: null,
    };
  }


  componentDidMount() {
    let state = this.state,
      margin = state.margin,
      legendWidth = state.legendWidth,
      width = state.width - margin.left - margin.right - legendWidth,
      height = state.height - margin.top - margin.bottom;

    let plot = d3.select("#scatterplot")
            .append("svg")
            .attr("height", height + margin.top + margin.bottom)
            .attr("width", width + margin.left + margin.right + legendWidth)
            .attr("class", "chart")
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top * 1.4 + ")");

    plot.append("g").attr("class", "x_axis");
    plot.append("g").attr("class", "y_axis");
    plot.append("clipPath")
      .attr("id", "clip-area")
      .append("rect")
      .attr("width", width)
      .attr("height", height);

    let plotlgd = d3.select("#scatterplotlegend")
      .append("svg")
      .attr("height", height + margin.bottom + margin.top)
      .attr("width", width / 3.0)
      .attr("class", "chart")
      .append("g")
      .attr("transform", `translate(0, ${margin.top * 1.6})`)

    let plotchlgd = d3.select("#bubblelegend")
      .append("svg")
      .attr("height", 20)
      .attr("width", width )
      .attr("class", "chart")
      .append("g")
      .attr("transform", `translate(0, ${margin.top})`)

    let plotchs_1 = d3.select("#scatterplotcharts_1")
      .append("svg")
      .attr("height", (height + margin.bottom + margin.top) / 3.0)
      .attr("width", width / 4.0)
      .attr("class", "chart")
      .append("g")
      .attr("transform", `translate(${margin.left / 4.0}, ${margin.top * 2.5})`)
    plotchs_1.append("g").attr("class", "x_axis");
    plotchs_1.append("g").attr("class", "y_axis");

    let plotchs_2 = d3.select("#scatterplotcharts_2")
      .append("svg")
      .attr("height", (height + margin.bottom + margin.top) / 3.0)
      .attr("width", width / 4.0)
      .attr("class", "chart")
      .append("g")
      .attr("transform", `translate(${margin.left / 4.0}, ${margin.top * 2.5})`)
    plotchs_2.append("g").attr("class", "x_axis");
    plotchs_2.append("g").attr("class", "y_axis");

    let plotchs_3 = d3.select("#scatterplotcharts_3")
      .append("svg")
      .attr("height", (height + margin.bottom + margin.top) / 3.0)
      .attr("width", width / 4.0)
      .attr("class", "chart")
      .append("g")
      .attr("transform", `translate(${margin.left / 4.0}, ${margin.top * 3.2})`)
    plotchs_3.append("g").attr("class", "x_axis");
    plotchs_3.append("g").attr("class", "y_axis");

    let plotchs_4 = d3.select("#scatterplotcharts_4")
      .append("svg")
      .attr("height", (height + margin.bottom + margin.top) / 3.0)
      .attr("width", width / 4.0)
      .attr("class", "chart")
      .append("g")
      .attr("transform", `translate(${margin.left / 4.0}, ${margin.top * 3.2})`)
    plotchs_4.append("g").attr("class", "x_axis");
    plotchs_4.append("g").attr("class", "y_axis");

    this.setState({
      svg: plot,
      svglgd: plotlgd,
      svgchs_1: plotchs_1,
      svgchs_2: plotchs_2,
      svgchs_3: plotchs_3,
      svgchs_4: plotchs_4,
      svgchlgd: plotchlgd,
    });
  }

  componentWillReceiveProps(props) {
    // console.log("props", props);
    this.setState({
      data: props.data.yelpData,
    });

  }

  onChangeX(e) {
    this.setState({
      xValue: e.target.value,
    });
  }

  onChangeY(e) {
    this.setState({
      yValue: e.target.value,
    });
  }

  onMouseOver(ele, i, xScale, yScale, circle_radius) {
    console.log("select", d3.event.target)
    console.log("select", ele)
    let state = this.state,
      svg = state.svg || false,
      margin = state.margin,
      legendWidth = state.legendWidth,
      width = state.width - margin.left - margin.right - legendWidth,
      xValue = state.xValue,
      yValue = state.yValue;
    let x = ele.value.x_avg.toFixed(2);
    let y = ele.value.y_avg.toFixed(2);
    let r = circle_radius;

    console.log("ele", ele);
    this.setState({
      selectedData: ele.key,
    })

    if (this.state.selectedData !== null) {

      let text = svg.append("text")
        .attr("class", "scatterplot_text")
        .attr("id", `t${i}`)
        .attr("x", xScale(x))
        .attr("y", yScale(y));
      text.append("tspan")
        .text(`category: ${ele.key}`)
        .attr("y", yScale(y) < width/2.0 ? `${yScale(y) + r + 15}` : `${yScale(y) - r - 40}`)
        .attr("dx", ele => "1.0em")
      text.append("tspan")
        .text(ele => {
          return xValue == "price" ? `${xValue.replace("_", " ")}: ${x}$` : `${xValue.replace("_", " ")}: ${x}`;
        })
        .attr("x", xScale(x))
        .attr("dx", "1.0em")
        .attr("dy", "1.2em")
      text.append("tspan")
        .text(ele => {
          return yValue == "price" ? `${yValue.replace("_", " ")}: ${y}$` : `${yValue.replace("_", " ")}: ${y}`
        })
        .attr("x", xScale(x))
        .attr("dx", "1.0em")
        .attr("dy", "1.2em")
      text.append("tspan")
        .text(`count: ${ele.value.count}`)
        .attr("x", xScale(x))
        .attr("dx", "1.0em")
        .attr("dy", "1.2em")

      var bbox = text.node().getBBox();
      svg.append("rect")
        .attr("id", `r${i}`)
        .attr("x", bbox.x)
        .attr("y", bbox.y)
        .attr("width", bbox.width)
        .attr("height", bbox.height)
        .style("fill", "white")
        .style("fill-opacity", 0.2)
      svg.selectAll("tspan")
        .style("fill-opacity", 1.0)
    }

    
  }

  onMouseOut(ele, i, colorScheme, circle_radius) {
    let x = ele.value.x_avg.toFixed(2);
    let y = ele.value.y_avg.toFixed(2);
    let r = circle_radius;
    d3.select(d3.event.target)
      .attr("r", r)
      .style("fill", colorScheme[i])
      .style("fill-opacity", 0.8);
    d3.select(`#t${i}`).remove();
    d3.select(`#r${i}`).remove();
    this.setState({
      selectedData: null,
    })
  }

  processData(label) {
    // console.log(this.state.selectedData);
    // let list;
    // if (this.state.selectedData == null) {
    //   list = this.state.data;
    // } else {
    //   list = this.state.data.filter(ele => {
    //     return ele.categories.includes(this.state.selectedData);
    //   })
    // }
    // return list;
    var categoryList = [];
      this.state.data.map(ele => {
        ele.categories.map(d => {
          let listEle = Object.assign({}, ele);
          listEle["category"] = d;
          categoryList.push(listEle);
        })
      });
    var countCateData
    if (label == "count") {
      countCateData = d3.nest()
        .key(ele => {return ele.category})
        .rollup(ele => {return {
          count: ele.length,
          label: ele.length,
        };})
        .entries(categoryList)
        .sort((v1, v2) => {return d3.descending(v1.value.count, v2.value.count)});
    } else {
      countCateData = d3.nest()
        .key(ele => {return ele.category})
        .rollup(ele => {return {
          count: ele.length,
          label: d3.mean(ele, d => {return d[label];}),
        };})
        .entries(categoryList)
        .sort((v1, v2) => {return d3.descending(v1.value.count, v2.value.count)});
        // .filter(ele => {return ele.value.count > 1});
    }
      countCateData = countCateData.slice(0, 20)
        .sort((v1, v2) => {return d3.ascending(v1.key, v2.key)});
    return countCateData;
  }

  drawHistogram(data, label, domain, id) {
    var svgchs = this.state[`svgchs_${id}`],
    xValue = this.state.xValue,
    width = this.state.width / 5.0,
    height = this.state.height / 4.0,
    selectedData = this.state.selectedData;

    console.log(this.state.selectedData);

    var duration = 800;

    var specificBin;

    var chartData = data.map(d => {
      if (selectedData !== null) {
        if (selectedData == d.key) {
          console.log("d", d)
          specificBin = d.value.label;
        }
      }
      return d.value.label;
    })

    var color = "grey";

    if (svgchs) {
      var xScale = d3.scaleLinear()
        .domain(domain)
        .range([0, width]);

      var bins = d3.histogram()
        .domain(xScale.domain())
        // .range(domain)
        .thresholds(xScale.ticks(4))
        (chartData);


      // var bins = histogram(numbers);
      let dollarSign = ["", "$", "$$", "$$$", "$$$$", "$$$$$"]
      var xAxis;
      if (label == "price") {
        xAxis = d3.axisBottom().scale(xScale).ticks(4).tickFormat(d => { return dollarSign[d]; });
      } else {
        xAxis = d3.axisBottom().scale(xScale).ticks(4);
      }

      var maxY = d3.max(bins, (d) => {return d.length;});
      var yScale = d3.scaleLinear().domain([0, maxY]).range([height, 0]);

      var colorScale = d3.scaleLinear().domain([0, 4]).range([d3.rgb(color).brighter(), "#A9A9A9"]);

      var formatCount = d3.format(",.0f");

      // var chart = svgchs.append("g")
        // .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
      // var exit = svgchs.selectAll(".bar").attr("class", "exit");
      // exit.exit().remove();

      var bar = svgchs.selectAll(".bar")
        .data(bins)

      bar.enter()
        .append("rect")
        .attr("class", "bar")
        .merge(bar)
        .transition()
        .duration(duration)
        .attr("transform", (d) => {
          return "translate(" + xScale(d.x0) + "," + yScale(d.length) + ")";
        })
        .attr("x", 0.8)
        .attr("width", xScale(bins[0].x1) - xScale(bins[0].x0) - 1)
        .attr("height", (d) => {return height - yScale(d.length)})
        .attr("fill", (d, i) => {
          // console.log("specificBin", specificBin);
          // console.log("selected data",d);
          if (d.includes(specificBin)) {
            return "#CD4F39";
          }
          return colorScale(d.length);
          //return color;
        });

      var bar_text = svgchs.selectAll(".bar_text")
        .data(bins)

      bar_text.enter()
        .append("text")
        .attr("class", "bar_text")
        .merge(bar_text)
        .transition()
        .duration(duration)
        .attr("transform", (d) => {
          return "translate(" + xScale(d.x0) + "," + yScale(d.length) + ")";
        })
        .attr("dy", "1vw")
        .attr("y", -18)
        .attr("x", (xScale(bins[0].x1) - xScale(bins[0].x0)) / 2 )
        .attr("text-anchor", "middle")
        .text((d) => {return formatCount(d.length)})
        .attr("font-size", "0.75vmax")

      bar.exit().transition().duration(duration).remove();

      bar_text.exit().transition().duration(duration).remove();

      svgchs.selectAll(".x_axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
        // .style("text-anchor", "end")
        .attr("transform", `rotate(-25)`)
        .attr("dx", "-1em")

      let xAxisText = svgchs.selectAll(`.xAxisTextchs${id}`).data(label)
      xAxisText.enter()
        .append("text")
        .attr("class", `xAxisTextchs${id}`)
        .merge(xAxisText)
        .transition()
        .duration(600)
        .text(label.replace("_", " "))
        .attr("x", width / 4.0)
        .attr("y", height * 1.3)
        .attr("font-size", "14")
      xAxisText.exit().transition().duration(600).remove();
    }
  }


  render() {
    console.log("scatterplot render");
    console.log("scatterplot state", this.state);

    let state = this.state,
      data = state.data,
      svg = state.svg || false,
      svglgd = state.svglgd || false,
      svgchlgd = state.svgchlgd || false,
      margin = state.margin,
      legendWidth = state.legendWidth,
      width = state.width - margin.left - margin.right - legendWidth,
      height = state.height - margin.top - margin.bottom,
      xValue = state.xValue,
      yValue = state.yValue;
      // selectedData = state.selectedData;

    if (svg) {
      // circle radius represent the count of different category
      // delete the categories that only have 1 restaurant
      // at most 20 categories

      // data process
      var chartData = this.state.data;
      let selectedData = this.state.selectedData;

      var categoryList = [];
      chartData.map(ele => {
        ele.categories.map(d => {
          let listEle = Object.assign({}, ele);
          listEle["category"] = d;
          categoryList.push(listEle);
        })
      });
      var countCateData = d3.nest()
        .key(ele => {return ele.category})
        .rollup(ele => {return {
          count: ele.length,
          x_avg: d3.mean(ele, d => {return d[xValue];}),
          // y_avg: Math.round(d3.mean(ele, d => {return d[yValue];}) * 100) / 100,
          y_avg: d3.mean(ele, d => {return d[yValue];}),
        };})
        .entries(categoryList)
        .sort((v1, v2) => {return d3.descending(v1.value.count, v2.value.count)})
        .filter(ele => {return ele.value.count > 1});
      countCateData = countCateData.slice(0, 20)
        .sort((v1, v2) => {return d3.ascending(v1.key, v2.key)});

      // color scheme
      const colorScheme = [
        '#1f77b4', '#17becf', '#9edae5', '#aec7e8', '#ff7f0e',
        '#ffbb78', '#fcf407', '#dbdb8d', '#bcbd22', '#637939', '#2ca02c',
        '#98df8a', '#393b79', '#9467bd', '#c5b0d5', '#8c564b',
        '#c49c94', '#7b4173', '#e377c2', '#f7b6d2', ];

      // axis
      let minX = Math.floor(d3.min(countCateData, ele => {return ele.value.x_avg}));
      let maxX = Math.ceil(d3.max(countCateData, ele => {return ele.value.x_avg}));
      var xScale = d3.scaleLinear().domain([minX, maxX]).range([0, width]);
      var xAxis = d3.axisBottom().scale(xScale).ticks(10);

      let minY = Math.floor(d3.min(countCateData, ele => {return ele.value.y_avg}));
      let maxY = Math.ceil(d3.max(countCateData, ele => {return ele.value.y_avg}));
      var yScale = d3.scaleLinear().domain([minY, maxY]).range([height, 0]);
      var yAxis = d3.axisLeft().scale(yScale).ticks(10);

      svg.transition()
        .duration(600)
        .selectAll(".x_axis")
        .delay((ele, i) => {return i * 50})
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .attr("font-size", "12")

      svg.transition()
        .duration(600)
        .selectAll(".y_axis")
        .delay((ele, i) => {return i * 50})
        .call(yAxis)
        .attr("font-size", "12")

      var xAxisText = svg.selectAll(".xAxisText").data([xValue])
      xAxisText.enter()
        .append("text")
        .attr("class", "xAxisText")
        .merge(xAxisText)
        .transition()
        .duration(600)
        .text(xValue.replace("_", " "))
        .attr("x", width / 2.0)
        .attr("y", height + margin.bottom / 2.0)
        .attr("font-size", "16")
      xAxisText.exit().transition().duration(600).remove();

      var yAxisText = svg.selectAll(".yAxisText").data([yValue])
      yAxisText.enter()
        .append("text")
        .attr("class", "yAxisText")
        .merge(yAxisText)
        .transition()
        .duration(600)
        .text(yValue.replace("_", " "))
        .attr("x", -1 * margin.left / 2.0)
        .attr("y", height / 2.0 )
        .attr('transform', `rotate(-90, ${-1 * margin.left / 2.0}, ${height/ 2.0})`)
        .attr("font-size", "16")
      xAxisText.exit().transition().duration(600).remove();

      // circles
      var circles_3 = svg.selectAll(".circle").data(countCateData);
      circles_3.enter()
        .append("circle")
        .attr("class", "circle")
        .merge(circles_3)
        .transition()
        .duration(600)
        .attr("r", ele => {
          // console.log(this.state.selectedData);
          // console.log("ele", ele);
          return ele.key == this.state.selectedData ? ele.value.count * 4.0 : ele.value.count * 3.2;
        })
        .attr("cx", ele => {return xScale(ele.value.x_avg.toFixed(2))})
        .attr("cy", ele => {return yScale(ele.value.y_avg.toFixed(2))})
        .style("fill", (ele,i) => {
          // if (ele.key == this.state.selectedData) {
          //   return "#CD4F39";
          // }
          return colorScheme[i]})
        .style("fill-opacity", ele => {
          ele.key == this.state.selectedData ? 1.0 : 0.8;
        })
        .style("stroke", (ele, i) => {return ele.key == this.state.selectedData ? "#CD4F39" : colorScheme[i]})
        .style("stroke-width", ele => {return ele.key == this.state.selectedData ? 10.0 : 0})
        .attr("clip-path", "url(#clip-area)");

            // d3.select(d3.event.target)
      // .attr("r", r)
      // .style("fill", "black")
      // .style("fill-opacity", 1.0);

      circles_3.exit()
        .transition()
        .duration(600)
        .remove();

      // circle mouse action
      svg.selectAll(".circle")
        // .on("mouseover", (ele, i) => this.onMouseOver(ele, i, xScale, yScale, ele.value.count * 4.0))
        .on("mouseover", (ele, i) => this.onMouseOver(ele, i, xScale, yScale, ele.value.count * 4.0))
        .on("mouseout", (ele, i) => this.onMouseOut(ele, i, colorScheme, ele.value.count * 3.2));

      // legend
      var legend = svglgd.selectAll(".legend").data(countCateData);
      var legend_text = svglgd.selectAll(".legend_text").data(countCateData);
      let legend_radius = 20;

      legend.enter()
        .append("rect")
        .attr("class", "legend")
        .merge(legend)
        .transition()
        .duration(600)
        .attr("x", legendWidth / 3.0)
        .attr("y", (ele, i) => i * legend_radius )
        .attr("width", 26)
        .attr("height", 14)
        .style("fill", (ele, i) => {return colorScheme[i]})

      legend.exit()
        .transition()
        .duration(600)
        .remove();

      legend_text.enter()
        .append("text")
        .attr("class", "legend_text")
        .merge(legend_text)
        .transition()
        .duration(600)
        .text(ele => {return ele.key})
        .attr("x", legendWidth / 3.0 + legend_radius * 2.0)
        .attr("y", (ele, i) => i * legend_radius + legend_radius / 2.0)
        .style("font-size", "14")

      legend_text.exit()
        .transition()
        .duration(600)
        .remove();

      console.log("svgchlgd", this.state.svgchlgd);
      let radiusdata = [{r: 1, cx: 3.5}, {r: 5, cx: 69.5}, {r:10, cx: 167}];
      var bubbleLegend = svgchlgd.selectAll(".bubblelegend").data(radiusdata);
      bubbleLegend.enter()
        .append("circle")
        .attr("class", "bubblelegend")
        .merge(bubbleLegend)
        .transition()
        .duration(600)
        .attr('cx', (ele, i) => {return ele.cx})
        .attr('cy', legendWidth / 12.0)
        .attr('r', ele => {return ele.r * 3.2})
        .style('fill-opacity', 0)
        .style('stroke', '#CD4F39')
        .style('stroke-width', 1.0)
      var bubbleLegendText = svgchlgd.selectAll(".bubblelegendtext").data(radiusdata);
      bubbleLegendText.enter()
        .append("text")
        .attr("class", "bubblelegendtext")
        .merge(bubbleLegendText)
        .transition()
        .duration(600)
        .attr('x', (ele, i) => {return ele.cx + ele.r * 3.2 + 5})
        .attr('y', legendWidth / 10.0)
        .attr('dy', ele => {return ele.r / 2.0})
        .text(ele => {return ele.r})

      var dataRenderPrice = this.processData("price");
      var dataRenderRating = this.processData("rating");
      var dataRenderCount = this.processData("count");
      this.drawHistogram(this.processData("count"), "count", [0,24.9999999], "1");
      this.drawHistogram(this.processData("price"), "price", [1,3.9999999], "2");
      this.drawHistogram(this.processData("rating"), "rating", [1,4.9999999], "3");
      this.drawHistogram(this.processData("review_count"), "review_count", [0,4999.99999], "4");


    }

    return (
      <div>
      <Row>
        <Col span={12} offset={0}>
          <Col xs={{ span: 12, offset: 0 }} lg={{ span: 10, offset: 2 }}>
          <span className="blackText">Horizontal Attributes </span>
          <RadioGroup onChange={(e) => this.onChangeX(e)} defaultValue={this.state.xValue} size="small">
            <RadioButton value="price" disabled={this.state.yValue === "price"}>Price</RadioButton>
            <RadioButton value="rating" disabled={this.state.yValue === "rating"}>Rating</RadioButton>
            <RadioButton value="review_count" disabled={this.state.yValue === "review_count"}>Review Count</RadioButton>
          </RadioGroup>
          </Col>
          <Col xs={{ span: 12, offset: 0 }} lg={{ span: 10, offset: 0 }}>
          <span className="blackText">Vertical Attributes </span>
          <RadioGroup onChange={(e) => this.onChangeY(e)} defaultValue={this.state.yValue} size="small">
            <RadioButton value="price" disabled={this.state.xValue === "price"}>Price</RadioButton>
            <RadioButton value="rating" disabled={this.state.xValue === "rating"}>Rating</RadioButton>
            <RadioButton value="review_count" disabled={this.state.xValue === "review_count"}>Review Count</RadioButton>
          </RadioGroup>
          </Col>
      </Col>
      <Col span={12}>
        <span className="blackText">Radius of Bubble (Numbers of Restaurants)</span>
        <div id="bubblelegend"></div>
      </Col>
    </Row>
    <Row>
      <Col span={12}>
        <div id="scatterplot"></div>
      </Col>
      <Col span={4} offset={0}>
        <div id="scatterplotlegend"></div>
      </Col>
      <Col span={6} offset={0}>
        <Col span={12} offset={0}>
          <div id="scatterplotcharts_1"></div>
        </Col>
        <Col span={12} offset={0}>
          <div id="scatterplotcharts_2"></div>
        </Col>
        <Col span={12} offset={0}>
          <div id="scatterplotcharts_3"></div>
        </Col>
        <Col span={12} offset={0}>
          <div id="scatterplotcharts_4"></div>
        </Col>
      </Col>
    </Row>
    </div>
    );
  }
}



export default ScatterPlot;
