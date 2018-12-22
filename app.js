var svgWidth = getWindowWidth();
var svgHeight = svgWidth / 2;

var margin = { 
  top: 20, 
  right: 40, 
  bottom: 60, 
  left: 100 
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Append a div to the body to create tooltips, assign it a class
d3.select("#scatter")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

d3.csv("data.csv").then(function(data){
  // console.log(data);
  data.forEach(function(data) {
    // data.hair_length = +data.hair_length;
    // data.num_hits = +data.num_hits;
    data.poverty = +data.poverty;
    data.healthcare = +data.healthcare;
  });

// Create scale functions -  16-D3   3   Activities   09-Stu_Hair_Metal
      var xLinearScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.poverty)])
        .range([0, width]);      

      var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.healthcare)])
        .range([height, 0]);

// Create axis functions
      var bottomAxis = d3.axisBottom(xLinearScale);
      var leftAxis = d3.axisLeft(yLinearScale);

//Append Axes to the chart
      chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);
      
      chartGroup.append("g")
        .call(leftAxis);

//Create Circles
      var circlesGroup = chartGroup.selectAll("g")
      .data(data)
      .enter()
      .append("g")
      .attr("transform", function (data, i) {
        return "translate(" + xLinearScale(data.poverty) + " ," + yLinearScale(data.healthcare) + ")"
        });
      circlesGroup.append("circle")
        .attr("r", "20")
        .attr("fill", "#fd6400")
        .attr("opacity", ".5")

// adding text
      circlesGroup.append("text")
        .attr("dy", function(data, index){return 5;})
        .attr("text-anchor", "middle")
        .text(function(data, index){return data.abbr;})     
        .attr("font-size", 12)  
        .attr('fill', 'white');

//Initialize tool tip
  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
      return (`Poverty Rate: ${d.poverty}<br>Lack of Healthcare: ${d.healthcare}`);
    });

//Create tooltip in the chart
  chartGroup.call(toolTip);

//Create event listeners to display and hide the tooltip
    circlesGroup.on("click", function(data, i) {
        toolTip.show(data, this);
      })

// // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });

  chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2)- 60)
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Lacks Healthcare (%)");

// Append x-axis labels
      chartGroup.append("text")
        .attr("transform", "translate(" + (width / 2 - 25) + " ," + (height + margin.top + 30) + ")")
        .attr("class", "axisText")
        .text("In Poverty (%)");

      // chartGroup.selectAll("circle")
      //   .transition()
      //   .duration(1000)
      //   .attr("cx", (d, i) => xLinearScale(i))
      //   .attr("cy", d => yLinearScale(d));

    });


function getWindowWidth() {
    var chartDiv = document.getElementById("scatter");    
    var w = chartDiv.clientWidth;
    // console.log(w)
    return w;
  }
