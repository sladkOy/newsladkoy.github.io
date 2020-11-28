//////////////////////////////////////////////////
///////////////// GRAPH creation /////////////////
//////////////////////////////////////////////////

var data = [
  {"date":"1-May-12","close":58.13,"open":34.12},
  {"date":"30-Apr-12","close":53.98,"open":45.56},
  {"date":"27-Apr-12","close":67.00,"open":67.89},
  {"date":"26-Apr-12","close":89.70,"open":78.54},
  {"date":"25-Apr-12","close":99.00,"open":89.23},
  {"date":"24-Apr-12","close":130.28,"open":99.23},
  {"date":"23-Apr-12","close":166.70,"open":101.34},
  {"date":"20-Apr-12","close":234.98,"open":0},
  {"date":"19-Apr-12","close":345.44,"open":134.56},
  {"date":"18-Apr-12","close":443.34,"open":160.45},
];

// Size setting
var	margin = {top: 30, right: 40, bottom: 80, left: 50},
	width = 800 - margin.left - margin.right,
	height = 400 - margin.top - margin.bottom;

// date format setting
var parseDate = d3.time.format("%d-%b-%y").parse;
var formatTime = d3.time.format("%e %B");

// Scale setting
var x = d3.time.scale().range([0, width]);
var y = d3.scale.linear().range([height, 0]);

// Axis setting
var xAxis = d3.svg.axis()
	.scale(x)
	.orient("bottom")
	.ticks(10)
	.tickFormat(d3.time.format("%Y-%m-%d"));
var yAxis = d3.svg.axis()
	.scale(y)
	.orient("left")
	.ticks(10);

// Area of the first line
var area = d3.svg.area()
	.interpolate("linear") // Smoothing out graph lines (can choose between : linear, step-before, step-after, basis, basis-open, basis-closed, bundle, cardinal, cardinal-open, cardinal-closed, monotone)
	.x(function(d) { return x(d.date); })
	.y0(height) // put 0 to fill the over part of the line (out of the area)
	.y1(function(d) { return y(d.close); });

// Area of th second line
var area2 = d3.svg.area()
	.interpolate("linear") // Smoothing out graph lines (can choose between : linear, step-before, step-after, basis, basis-open, basis-closed, bundle, cardinal, cardinal-open, cardinal-closed, monotone)
	.x(function(d) { return x(d.date); })
	.y0(height) // put 0 to fill the over part of the line (out of the area)
	.y1(function(d) { return y(d.open); });

// line 1
var valueline = d3.svg.line()
	.x(function(d) { return x(d.date); })
	.y(function(d) { return y(d.close); });
// line 2
var valueline2 = d3.svg.line()
	.x(function(d) { return x(d.date); })
	.y(function(d) { return y(d.open); });

var svg = d3.select("body").append("svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// add tooltip
var div = d3.select("body").append("div")
	.attr("class", "tooltip")
	.style("opacity", 0);

// add grid in the background of the graph
function make_x_axis() {
	return d3.svg.axis()
	.scale(x)
	.orient("bottom")
	.ticks(5)
}
function make_y_axis() {
	return d3.svg.axis()
	.scale(y)
	.orient("left")
	.ticks(5)
}

	data.forEach(function(d) {
		d.date = parseDate(d.date);
		d.close = +d.close;
		d.open = +d.open; // To correct the grid (need an other line : y.domain([0, d3.max(data, function(d) { return Math.max(d.close, d.open); })]); )
	});
	
	// Scale the range of the data
	x.domain(d3.extent(data, function(d) { return d.date; }));
	y.domain([0, d3.max(data, function(d) { return Math.max(d.close, d.open); })]);
	
	// Add the X Axis
	svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis)
		.selectAll("text")
			.style("text-anchor", "end")
			.attr("dx", "-.8em")
			.attr("dy", ".15em")
			.attr("transform", function(d) {
				return "rotate(-65)"
			});
	
	// text label for the x axis
	svg.append("text")
		.attr("x", width / 2)
		.attr("y", height + margin.bottom)
		.style("text-anchor", "middle")
		.text("Date");
	
	// Add the Y Axis
	svg.append("g")
		.attr("class", "y axis")
		.call(yAxis);
	
	// text label for the y axis
	svg.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", 0 + (-margin.left))
		.attr("x",0 - (height / 2))
		.attr("dy", "1em")
		.style("text-anchor", "middle")
		.text("Value");
	
	// Title of the graph
	svg.append("text")
		.attr("x", (width / 2))
		.attr("y", 0 - (margin.top / 2))
		.attr("text-anchor", "middle")
		.style("font-size", "16px")
		.text("Value vs Date Graph");
	
	// Draw de grid lines
	svg.append("g")
		.attr("id", "gridx")
		.attr("class", "grid")
		.attr("transform", "translate(0," + height + ")")
		.call(make_x_axis()
			.tickSize(-height, 0, 0)
			.tickFormat("")
		);
	svg.append("g")
		.attr("id", "gridy")
		.attr("class", "grid")
		.call(make_y_axis()
			.tickSize(-width, 0, 0)
			.tickFormat("")
		);

    var chart1 = svg.append('g').classed('chart1', true);
    var chart2 = svg.append('g').classed('chart2', true);
	
	// add the area
	chart1.append("path")
		.datum(data)
		.attr("id", "area1")
		.attr("class", "area")
		.attr("d", area)
		.style("fill", "blue");
	
	// Add the line 1
	chart1.append("path")
		.attr("d", valueline(data))
		.attr("id", "line1")
		.style("stroke", "blue");
	
	// add the area
	chart2.append("path")
		.datum(data)
		.attr("id", "area2")
		.attr("class", "area")
		.attr("d", area2)
		.style("fill", "red");
		
	// Add the valueline2 path
	chart2.append("path")
		.attr("d", valueline2(data))
		.attr("id", "line2")
		.style("stroke", "red");
	
	// tooltip	
	var blueCircles = chart1.selectAll("dot")
		.data(data)
		.enter().append("circle")
			.attr("r", 4)
			.attr("cx", function(d) { return x(d.date); })
			.attr("cy", function(d) { return y(d.close); })
			.style("fill", "white")
			.style("stroke", "blue")
			.style("stroke-width", "2px")
			.on("mouseover", function(d) {
				div.transition()
					.duration(200)
					.style("opacity", .9);
				div.html(formatTime(d.date) + "<br/>" + d.close)
					.style("left", (d3.event.pageX) + "px")
					.style("top", (d3.event.pageY - 28) + "px");
			})
			.on("mouseout", function(d) {
				div.transition()
					.duration(400)
					.style("opacity", 0);
			});
	
	var redCircles = chart2.selectAll("dot")
		.data(data)
		.enter().append("circle")
			.attr("r", 4)
			.attr("cx", function(d) { return x(d.date); })
			.attr("cy", function(d) { return y(d.open); })
			.attr("class", "tooltips")
			.style("fill", "white")
			.style("stroke", "red")
			.style("stroke-width", "2px")
			.on("mouseover", function(d) {
				div.transition()
					.duration(200)
					.style("opacity", .9);
				div.html(formatTime(d.date) + "<br/>" + d.close)
					.style("left", (d3.event.pageX) + "px")
					.style("top", (d3.event.pageY - 28) + "px");
			})
			.on("mouseout", function(d) {
				div.transition()
					.duration(400)
					.style("opacity", 0);
			});


d3.selectAll('.messageCheckbox').on('click', function () {
    var value = this.value,
        checked = this.checked;
    d3.select('.' + value).classed('hidden', !checked);
});

var inter = setInterval(function() {
	updateData();
}, 5000);


//////////////////////////////////////////////////	
///////////////// Update function ////////////////
//////////////////////////////////////////////////

function updateData () {
    
var data = [
  {"date":"1-May-12","close":Math.random()*568.13,"open":Math.random()*35.12},
  {"date":"30-Apr-12","close":Math.random()*354.98,"open":Math.random()*424.56},
  {"date":"27-Apr-12","close":Math.random()*24.00,"open":Math.random()*253.89},
  {"date":"26-Apr-12","close":Math.random()*490.70,"open":Math.random()*215.54},
  {"date":"25-Apr-12","close":Math.random()*42.00,"open":Math.random()*351.23},
  {"date":"24-Apr-12","close":Math.random()*210.28,"open":Math.random()*20.23},
  {"date":"23-Apr-12","close":Math.random()*20.70,"open":Math.random()*368.34},
  {"date":"20-Apr-12","close":Math.random()*412.98,"open":Math.random()*42},
  {"date":"19-Apr-12","close":Math.random()*26.44,"open":Math.random()*20.56},
  {"date":"18-Apr-12","close":Math.random()*48.34,"open":Math.random()*356.45},
];
    
    // Get the data
    data.forEach(function(d) {
        d.date = parseDate(d.date);
        d.close = +d.close;
        d.open = +d.open; // To correct the grid (need an other line : y.domain([0, d3.max(data, function(d) { return Math.max(d.close, d.open); })]); )
    });
    
    // Scale the range of the data
    x.domain(d3.extent(data, function(d) { return d.date; }));
    y.domain([0, d3.max(data, function(d) { return Math.max(d.close, d.open); })]);
    
    // Select the section we want to apply our changes to
    var svg = d3.select("body").transition();
    
    // change the x axis
    svg.select(".x.axis")
    .duration(750)
    .call(xAxis)
    .selectAll("text")
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", ".15em")
    .attr("transform", function(d) {
        return "rotate(-65)"
    });
    
    // change the y axis
    svg.select(".y.axis")
    .duration(750)
    .call(yAxis);
    
    // change the grid lines
    svg.select("#gridx")
    .duration(750)
    .call(make_x_axis()
          .tickSize(-height, 0, 0)
          .tickFormat("")
         );
    svg.select("#gridy")
    .duration(750)
    .call(make_y_axis()
          .tickSize(-width, 0, 0)
          .tickFormat("")
         );
    
    // change the area
    svg.select("#area1")
    .duration(750)
    .attr("d", area(data));
    
    // change the line 1
    svg.select("#line1")
    .duration(750)
    .attr("d", valueline(data));
    
    // change the area
    svg.select("#area2")
    .duration(750)
    .attr("d", area2(data));
    
    // change the valueline2 path
    svg.select("#line2")
    .duration(750)
    .attr("d", valueline2(data));
    
    // tooltip
    
    blueCircles.data(data)
    .transition()
    .duration(750)
    .attr("cx", function(d) { return x(d.date); })
    .attr("cy", function(d) { return y(d.close); });
    
    redCircles.data(data)
    .transition()
    .duration(750)
    .attr("cx", function(d) { return x(d.date); })
    .attr("cy", function(d) { return y(d.open); })
}
