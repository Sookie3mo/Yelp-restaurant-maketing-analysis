export function drawSunburst(root, containerID) {
  var sum;
  var d3 = window.d3;
  var width = 800,
      height = 600,
      radius = (Math.min(width, height) / 2) - 10;
  var svg = d3.select(`#${containerID}`)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", "translate(" + width / 2 + "," + (height / 2) + ")");

  var rad = document.myForm.mode;
  var prev = null;
  var flag;
  for(var i = 0; i < rad.length; i++) {

    rad[i].onclick = function() {
      (prev)? console.log(prev.value):null;
      if(this !== prev) {
          prev = this;
          }
      // console.log('oooooo',this.value)
      flag = this.value;
      // console.log('oooooo',root)
     // new_root = data_modifier(flag,root)
      drawSVG(flag, svg);
      };
    }


  drawSVG(1, svg);

  function drawSVG(flag, svg){
    var width = 700,
        height = 500,
        radius = (Math.min(width, height) / 2) - 10;
    var formatNumber = d3.format(",.1%");
    var b = {
      w: 180, h: 30, s: 3, t: 10
    };
    var x = d3.scaleLinear()
        .range([0, 2 * Math.PI]);
    var y = d3.scaleSqrt()
        .range([0, radius]);
    var color = d3.scaleOrdinal(d3.schemeCategory20);

    var partition = d3.partition();
    var arc = d3.arc()
        .startAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x0))); })
        .endAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x1))); })
        .innerRadius(function(d) { return Math.max(0, y(d.y0)); })
        .outerRadius(function(d) { return Math.max(0, y(d.y1)); });

    ////////////////////////////////////////////
    function compressArray(original) {

      var compressed = [];
      // make a copy of the input array
      var copy = original.slice(0);
      // first loop goes over every element
      for (var i = 0; i < original.length; i++) {
        var myCount = 0;
        // loop over every element in the copy and see if it's the same
        for (var w = 0; w < copy.length; w++) {
          if (original[i] == copy[w]) {
            // increase amount of times duplicate is found
            myCount++;
            // sets item to undefined
            delete copy[w];
          }
        }
        if (myCount > 0) {
          var a = new Object();
          a.price = original[i];
          a.count = myCount;
          compressed.push(a);
        }
      }
      return compressed;
    };


    function category_arrage(flag,data){
    // console.log("zzzzzz",data);
    // console.log("zzzzzz",flag);
      var new_d = [];
      for (var i = 0; i< data.length;i++){

        for (var j = 0; j < data[i].categories.length; j++) {

          if (data.price != 0 && flag == 1){
            console.log("flag == 1")
            new_d.push({"name":data[i].categories[j],"price":data[i].price})}

          if (data.rating != 0 && flag == 2){
            console.log("flag == 2")
            new_d.push({"name":data[i].categories[j],"price":data[i].rating})}

          if (data.review_count != 0 && flag == 3){
            console.log("flag == 3")
            new_d.push({"name":data[i].categories[j],"price":data[i].review_count})}

        }
      }
      // console.log('faaaa' , new_d);
      return new_d
    };
    ///////////////////////////////data modifier/////////////////////////////
    //d3.json('yelp_sample_response.json',function(flag,data) {
    function data_modifier(flag,data){
      //console.log('ffff' + data[0][0]);
      // console.log("zzzzzz",data);

      // console.log("kkkk",flag);
      var reData = category_arrage(flag,data);
      // console.log('ffff' + reData.length);
      // console.log('ffff' + reData);
      // console.log('ffff' + reData[0].price);

     var group_to_values = reData.reduce(function (obj, item) {
          obj[item.name] = obj[item.name] || [];
          obj[item.name].push(item.price);
          return obj;
      }, {});

      var groups = Object.keys(group_to_values).map(function (key) {
          return {name: key, price: group_to_values[key]};
      });
       // console.log(groups.length);
      for (var i = 0; i< groups.length;i++){
       // console.log(groups[i].name);
       //   console.log(groups[i].price.length);
         groups[i].price = compressArray(groups[i].price);
        // console.log(groups[i].price);

      }
      var sorted_groups = groups.sort(function (one, other) {
         //a - b is
         //   0 when elements are the same
         //  >0 when a > b
         //  <0 when a < b
         return one.price.length - other.price.length;
      });

      // console.log(sorted_groups.length);
      sorted_groups = sorted_groups.slice(-20);
      //  console.log(sorted_groups.length);
      for (var i = 0; i< sorted_groups.length;i++){

        //  console.log(sorted_groups[i].price.length);
        sorted_groups[i].price = compressArray(sorted_groups[i].price);
        // console.log(sorted_groups[i].price.length);
        //console.log(sorted_groups[i].price);
      }


      var children = []
      for (var i = 0; i< sorted_groups.length;i++){
        var one_child = {"name": null, "children": null};

        one_child['name'] = sorted_groups[i].name;
        var prices = []
        for (var j = 0; j < sorted_groups[i].price.length;j++){
          let one_price = {'name':null,"size":null}
          if (flag == 1){
            if (sorted_groups[i].price[j].price.price == 0){one_price['name'] = '$'}
            if (sorted_groups[i].price[j].price.price == 1){one_price['name'] = '$$'}
            if (sorted_groups[i].price[j].price.price == 2){one_price['name'] = '$$$'}
            if (sorted_groups[i].price[j].price.price == 3){one_price['name'] = '$$$$'}
            if (sorted_groups[i].price[j].price.price == 4){one_price['name'] = '$$$$$'}
            one_price['size'] = sorted_groups[i].price[j].price.count;
          }
          if (flag == 2){
            one_price['name'] = "rating: "+ sorted_groups[i].price[j].price.price.toString()
            one_price['size'] = sorted_groups[i].price[j].price.count;

          }
          if (flag == 3){
            //one_price['name'] = "review count: "+ sorted_groups[i].price[j].price.price.toString()
            one_price['name'] = "review count: "
            // console.log('uuuuuuu',sorted_groups[i].price[j].price)
            one_price['size'] = sorted_groups[i].price[j].price.price;
          }
        //  one_price['size'] = sorted_groups[i].price[j].price.count;
          prices.push(one_price);
       }
       one_child['children'] = prices;
       children.push(one_child);
     }
      // console.log("bbbbbbbbb")
      // console.log(children.length)
      // console.log(children[1].name)
      // console.log(children[1].children)

      //var root = {"name": "All Categories", "children": children};
      //console.log("ccccccccc")

      //console.log(root.name)

      return children;

    };



    // var new_root = data_modifier(flag,root);

    // initializeBreadcrumbTrail();

    // console.log("new_root" , new_root)

    // // drawLegend2(root.children);


    // new_root = d3.hierarchy(new_root);

    // console.log('iiiiii', sum.value);

    // drawLegend(svg,new_root.children)
    // updateBreadcrumbs(getParents(new_root),new_root.value);
 // console.log('ppp',root)
 var area = []
for (var i = 0; i< root.length;i++){
var cate = data_modifier(flag,root[i].yelpData);
area.push({"name":root[i].yelpData[0].city,"children":cate});

}

  // console.log('area',area)

  var new_root = {"name":"Area","children":area}



  initializeBreadcrumbTrail();
   // console.log("new_root",new_root)

   var new_root1 = d3.hierarchy(new_root);
   // console.log("new_root1",new_root1)
    sum = new_root1.sum(function(d) { return d.size; }).value;
   // console.log('iiiiii', sum.value);

   //drawLegend(svg,new_root1.children)
   updateBreadcrumbs(getParents(new_root1),new_root1.value);


    var arc1 = svg.selectAll("path")
       .data(partition(new_root1).descendants())
  var depth2StartIndex = partition(new_root1).descendants().filter(ele => {
      return ele.depth === 0 || ele.depth === 1
    }).length;

       arc1.enter()
       .append("path")
       .merge(arc1)
    //  .transition()
    // .duration(800)
       .attr("d", arc)
       //.style("fill", function(d) { return color((d.children ? d : d.parent).data.name); })
       .style("fill", function(d, i) {return colorMatch(d, i) } )
       .on("click", click)
       // .append("title")
       // .text(function(d) { return d.data.name + "\n" + formatNumber(d.value/sum.value); })

       arc1.exit()
        .transition()
        .duration(800)
        .remove();

   // console.log("old sum",sum.value)
    svg.selectAll("path")
       .merge(svg)
        .on("mouseover", onMouseOver)
       //.on("mouseover",(ele,i,sum) => onMouseOver(ele, i,sum))
        .on("mouseout", onMouseOut);

     svg.exit()
        .transition()
        .duration(800)
        .remove();


function colorMatch(d, i){
  let index2 = depth2StartIndex;
  var color_city = d3.schemeCategory20;
  var colorb = d3.schemeCategory20b;
 const colorScheme = [
        '#1f77b4', '#17becf', '#9edae5', '#aec7e8', '#ff7f0e',
        '#ffbb78', '#fcf407', '#dbdb8d', '#bcbd22', '#637939', '#2ca02c',
        '#98df8a', '#393b79', '#9467bd', '#c5b0d5', '#8c564b',
        '#c49c94', '#7b4173', '#e377c2', '#f7b6d2', ];
  var color_map =
{"$":"#ffcccc","$$":"#ff8080","$$$":"#ff3333","$$$$":"#e60000", "$$$$$":"#b30000",
"rating: 3": "#ffcccc","rating: 3.5": "#ff8080",
"rating: 4": "#ff3333","rating: 4.5": "#e60000",
"rating: 5": "#990000","rating: 2.5": "#ffe6e6"}

  if(d.depth == 0){return "white"}

  else if (d.depth == 1){
  return ("hsl(0, 0%,"+ (100-i*10)+"%)")}
  else if (d.depth == 2){
  return (colorScheme[(i-index2) % 20])}

  else if (d.depth == 3 & d.data.name != "review count: ")
    { return(color_map[d.data.name])}
    else if (d.depth == 3 & d.data.name == "review count: ")
    {
      if (d.value <500 &d.value >=0){return("#ffcccc")}
      if ( d.value <1000 &d.value >=500){return("#ff8080")}
      if ( d.value <1500 &d.value >=1000){return("#ff3333")}
      if (d.value <2000 &d.value >=1500){return("#e60000")}
      if ( d.value <2500 &d.value >=2000){return("#990000")}
      if (d.value >= 2500){return("#ffe6e6")}
    }
}

 function onMouseOver(d,i) {
   //console.log('parent',d.parent.data);
   console.log("summmmm",sum)
   if(d.parent == null)
   { //var sum = d.sum(function(d) { return d.size; })
     var word = " "
    //  console.log("sum1",sum.value)
   }
   else if(d.parent != null & d.parent.parent == null)
   {//var sum = d.parent.sum(function(d) { return d.size; })
    //var sum = d.sum(function(d) { return d.size; })
    //console.log("sum2",sum.value)
    var word = "City:"
   }
   else if(d.parent.parent != null & d.parent.parent.parent == null )
   {//var sum = d.parent.parent.sum(function(d) { return d.size; })
    //var sum = d.sum(function(d) { return d.size; })
    var word = "Category:"
     //console.log("sum3",sum.value)
   }
   else if(d.parent.parent.parent != null & d.parent.parent.parent.parent == null )
   {//var sum = d.parent.parent.parent.sum(function(d) { return d.size; })
    //var sum = d.sum(function(d) { return d.size; })
    var word = " "
     //console.log("sum4",sum.value)
   }
  //console.log('sum',sum.value);
  // d3.select(d3.event.target)
    let text = svg.append("text")
    .attr("id", "t" + d.data.name.replace(/[^a-z]/gi, ''))
    .attr("fill", "grey")
    .attr("font-size",16)

    .attr("fill-opacity", 1.0)
    .attr("x",-400)
    .attr("y",-300 )


    // .text(function(d) { return d.data.name + "\n" + formatNumber(d.value/sum.value);})
    .text(word + "  " + d.data.name )
  //console.log("t" + d.data.name);
  // text.append("tspan")
  //   .attr("x",-400)
  //   .attr("y",-260 )
  //    .text("Percentage: ")
   text.append("tspan")
    .attr("x",-400)
    .attr("y",-280 )
    .text(`Number of Restaurants: ${d.value} (Percentage: ${formatNumber(d.value/sum)})`)
 }
 function onMouseOut(d,i){
    // d3.select(d3.event.target)
      d3.select("#t" + d.data.name.replace(/[^a-z]/gi, '')).remove();
    }







function getParents(a){
  var nodeArray = [a];
  while(a.parent){
    nodeArray.push(a.parent);
    a = a.parent
  }
  return nodeArray.reverse();
}



function click(d) {
  updateBreadcrumbs(getParents(d), d.value);
    svg
    .transition()
    .duration(900)
    .tween("scale", function() {
        var xd = d3.interpolate(x.domain(), [d.x0, d.x1]),
            yd = d3.interpolate(y.domain(), [d.y0, 1]),
            yr = d3.interpolate(y.range(), [d.y0 ? 20 : 0, radius]);
        return function(t) { x.domain(xd(t)); y.domain(yd(t)).range(yr(t)); };
      })
    .selectAll("path")
    .attrTween("d", function(d) { return function() { return arc(d); }; });
    console.log("clickd",d)
    console.log("clickdval",d.value)

    sum = d.value;
}


function initializeBreadcrumbTrail() {
  // Add the svg area.
  var trail = d3.select("#sequence")
     .append("svg:svg")
     .attr("width", width)
     .attr("height", width/10)
     .attr("id", "trail");
  // Add the label at the end, for the percentage.
  trail.append("svg:text")
    .attr("id", "endlabel")
    .style("fill", "#000");


}

function updateBreadcrumbs(nodeArray, percentageString) {
  // Data join; key function combines name and depth (= position in sequence).
  console.log('yyyyy',nodeArray,percentageString)
  var g = d3.select("#trail")
    .selectAll("g")
    .data(nodeArray, function(x) { return percentageString + x.data.name + x.depth; });
  // Add breadcrumb and label for entering nodes.
  var entering = g.enter().append("svg:g");
  entering.append("svg:polygon")
   // .merge(entering)
    .attr("points", breadcrumbPoints)
    .style("fill", function(x) { return color(x.data.name); });


  entering.append("svg:text")
    .attr("x", (b.w + b.t) / 2)
    .attr("y", b.h / 2)
    .attr("dy", "0.35em")
    .attr("text-anchor", "middle")
    .text(function(x) { return x.data.name; });
  entering.attr("transform", function(x, i) { return "translate(" + i* (b.w + b.s) + ", 0)"; });
  // Remove exiting nodes.
  entering.exit()
      .transition()
      .duration(700)
      .remove();
        g.exit().remove();

  // Now move and update the percentage at the end.

  d3.select("#trail")
    .select("#endlabel")
    .attr("x", (nodeArray.length + 0.5) * (b.w + b.s))
    .attr("y", b.h / 2)
    .attr("dy", "0.35em")
    .attr("text-anchor", "middle")
    //.text(percentageString);
  // Make the breadcrumb trail visible, if it's hidden.
  d3.select("#trail")
    .style("visibility", "");
}

function breadcrumbPoints(x, i) {
  var points = [];
  points.push("0,0");
  points.push(b.w + ",0");
  points.push(b.w + b.t + "," + (b.h / 2));
  points.push(b.w + "," + b.h);
  points.push("0," + b.h);
  if (i > 0) { // Leftmost breadcrumb; don't include 6th vertex.
    points.push(b.t + "," + (b.h / 2));
  }
  return points.join(" ");
}

      function drawLegend(svg,labels) {
            var width =  200
             var height =  500
              var legendWidth = 300

              var legend_rect = svg
                   .selectAll('.legend_rect')
                   .attr("width", width).attr("height", height)
                   .data(labels)
               var legend_text = svg
                   .selectAll('.legend_text')
                   .attr("width", width).attr("height", height)
                   .data(labels)


              legend_rect.enter()
                  .append('rect')
                  .attr("class", "legend_rect")
                  .merge(legend_rect)
                  .transition()
                  .duration(200)
                  .attr("x", -600)
                  .attr("y", (d, i)=>{return 14 *i})
                  .attr("width", 173)
                  .attr("height", 18)
                  .style("fill", function (d, i) {
                  return color(i)
              })

              legend_text.enter()
                   .append('text')
                   .attr("class", "legend_text")
                   .merge(legend_text)
                   .transition()
                   .duration(200)
                  .attr("x", -600)
                  .attr("y", (d, i) => {return 14 * i + 12})
              //.attr("dy", ".35em")
                  .text(ele => {console.log(ele); return ele.data.name})
                  //  .attr("class", "textselected")
                  // .style("text-anchor", "start")
                  // .style("font-size", 14)

                legend_rect.exit()
                 .transition()
                 .duration(100)
                 .remove();
                 legend_text.exit()
                 .transition()
                 .duration(100)
                 .remove();
      }
    //d3.select(self.frameElement).style("height", height + "px");
  }
}
