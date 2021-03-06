// Constants to store URLs where data is located
const FIFA_URL = "https://raw.githubusercontent.com/jchen2186/fifa-visual/master/data/WorldCups.csv";

// Load data
var files = [FIFA_URL];
var promises = [];

files.forEach(url => {
  promises.push(d3.csv(url));
});

// Call function to display data
Promise.all(promises).then(values => {
  var data = values[0];
  createPlot(data);
});

function createPlot(data) {
  var pArea = [75, 75, 650, 400];

  var xScale = d3.scaleLinear()
    .domain([d3.min(data, row => Number(row["Year"]) - 5),
             d3.max(data, row => Number(row["Year"]) + 6)])
    .rangeRound([pArea[0], pArea[2]]);

  var yScale = d3.scaleLinear()
    .domain([d3.min(data, row => Number(row["GoalsScored"]) - 10),
             d3.max(data, row => Number(row["GoalsScored"]) + 9)])
    .rangeRound([pArea[3], pArea[1]]);

  var svg = d3.select("svg");
  var g = svg.append("g");

  // graph title
  g.append("text")
    .attr("class", "title")
    .attr("x", (xScale.range()[0]+xScale.range()[1])*0.5)
    .attr("y", 30)
    .text("Goals Made During FIFA World Cups (1930-2014)");

  // x-axis
  g.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", `translate(0, ${pArea[3]})`)
    .call(d3.axisBottom(xScale).ticks(10, "d"))
    .append("text")
      .attr("class", "label")
      .attr("x", (xScale.range()[0]+xScale.range()[1])*0.5)
      .attr("y", 35)
      .text("Year");

  // y-axis
  g.append("g")
    .attr("class", "axis axis--y")
    .attr("transform", `translate(${pArea[0]}, 0)`)
    .call(d3.axisLeft(yScale).ticks(5, "d"))
    .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("x", (yScale.range()[0] + yScale.range()[1]) * -0.5)
      .attr("y", -35)
      .text("Goals Made");

  insertLine(g, xScale, yScale, data);
}

function insertLine(g, xScale, yScale, data) {
  var line = d3.line()
    .x(d => xScale(d["Year"]))
    .y(d => yScale(d["GoalsScored"]));

  g.append("path")
    .datum(data)
    .attr("class", "line")
    .attr("d", line);

  var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  var dots = g.selectAll(".dot")
    .data(data, d => [d["Year"], d["GoalsScored"]]);

  dots.enter()
    .append("circle")
    .attr("class", "dot")
    .attr("cx", d => xScale(d["Year"]))
    .attr("cy", d => yScale(d["GoalsScored"]))
    .attr("r", 5)
    .on("mouseover", d => {
    tooltip.transition()
      .duration(200)
      .style("opacity", 0.9);
    tooltip.html(`${d["Country"]}, ${d["Year"]}<br>Goals: ${d["GoalsScored"]}`);
  })
    .on("mouseout", d => {
    tooltip.transition()
      .duration(200)
      .style("opacity", 0);
  })
    .on("mousemove", d => {
    tooltip.style("top", d3.event.pageY - 15 + "px")
      .style("left", d3.event.pageX + 15 + "px")
  });
};