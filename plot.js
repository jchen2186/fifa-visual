d3.csv("https://raw.githubusercontent.com/jchen2186/fifa-visuals/master/WorldCups.csv",
       function(matches) {
//   console.log(matches[0]);
  var data = matches.map(obj => [
    Number(obj["Year"]),
    Number(obj["GoalsScored"]) / Number(obj["MatchesPlayed"]),
    Number(obj["GoalsScored"]),
    Number(obj["MatchesPlayed"]),
    obj["Country"]
  ]);

  console.log(data);

  createPlot(data);
});

function insertLine(svg, g, xScale, yScale, data) {
    var tooltip = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

    var line = d3.line()
      .x(d => xScale(d[0]))
      .y(d => yScale(d[2]));

    var dataLine = svg.append("path")
      .datum(data)
      .attr("class", "line")
      .attr("d", line);

    var dots = g.selectAll(".dot")
      .data(data, d => [d[0], d[2]]);

    dots.enter()
      .append("circle")
      .attr("class", "dot")
      .attr("cx", d => xScale(d[0]))
      .attr("cy", d => yScale(d[2]))
      .attr("r", 5)
      .on("mouseover", d => {
      tooltip.transition()
        .duration(200)
        .style("opacity", 0.9);
      tooltip.html(d[4] + ", " + d[0] + "<br />Goals: " + d[2]);
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

function createPlot(data) {
  var canvasSize = [700, 450];
  var tickSize = 5;
  var pArea = [75, 75, 650, 400];

  var xScale = d3.scaleLinear()
    .domain([d3.min(data, row => row[0] - 5),
             d3.max(data, row => row[0] + 6)])
    .rangeRound([pArea[0], pArea[2]]);

  var yScale = d3.scaleLinear()
    .domain([d3.min(data, row => row[2] - 10),
             d3.max(data, row => row[2] + 9)])
    .rangeRound([pArea[3], pArea[1]]);

  var svg = d3.select("svg");
  var g = svg.append("g");

//   graph title
  g.append("text")
    .attr("class", "title")
    .attr("x", (xScale.range()[0]+xScale.range()[1])*0.5)
    .attr("y", 30)
    .text("Goals Made During FIFA World Cups (1930-2014)");

//   x-axis
  g.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", `translate(0,${pArea[3]})`)
    .call(d3.axisBottom(xScale).ticks(10, "d"))
    .append("text")
      .attr("class", "label")
      .attr("x", (xScale.range()[0]+xScale.range()[1])*0.5)
      .attr("y", 35)
      .text("Year");

//   y-axis
  g.append("g")
    .attr("class", "axis axis--y")
    .attr("transform", `translate(${pArea[0]},0)`)
    .call(d3.axisLeft(yScale).ticks(5, "d"))
    .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("x", -(yScale.range()[0]+yScale.range()[1])*0.5)
      .attr("y", -35)
      .text("Goals Made");

  insertLine(svg, g, xScale, yScale, data);
}
