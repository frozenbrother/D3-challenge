var svgWidth = 960;
var svgHeight = 500;

var margin = {
    top: 20,
    right:40,
    bottom: 60,
    left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// create svg group to hold the charts
var svg = d3.select("#scatter").append("svg").attr("width", svgWidth).attr("height", svgHeight);

var chartGroup = svg.append("g").attr("transform", `translate(${margin.left}, ${margin.top})` );

d3.csv("assets/data/data.csv").then(function(data){

    // loop data to find poverty and healthcare
    data.forEach(function(health_data){
        health_data.poverty = +health_data.poverty;
        health_data.healthcare = +health_data.healthcare;
    })

    // create scale for x axis
    var xAxisScale = d3.scaleLinear().domain([8, d3.max(data, d => d.poverty)]).range([0, width]);

    // create scale for y axis
    var yAxisScale = d3.scaleLinear().domain([0, d3.max(data, d => d.healthcare)]).range([height, 0]);

    // create axis functions
    var xAxis = d3.axisBottom(xAxisScale)
    var yAxis = d3.axisLeft(yAxisScale)

    // add axis to the chart
    chartGroup.append("g").attr("transform", `translate (0, ${height})`).call(xAxis);
    chartGroup.append("g").call(yAxis);

    // create circles
    var circles = chartGroup.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => xAxisScale(d.poverty))
        .attr("cy", d => yAxisScale(d.healthcare))
        .attr("r", "15")
        .attr("fill", "lightblue")
        .attr("opacity", ".8");

    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function(d){
            return (`${d.state}<br>poverty: ${d.poverty}<br>healthcare: ${d.healthcare}`);
        });

    // add tooltips
    chartGroup.call(toolTip)

    // event listener for the tooltips
    circles.on("mouseover", function(data, index){
        toolTip.show(data, this);
    }).on("mouseout", function(data, index){
        toolTip.hide(data);
    });

    // add state labels
    var circleLabels = chartGroup.selectAll(null).data(data).enter().append("text");

    circleLabels.attr("x", d => xAxisScale(d.poverty) - 9)
        .attr("y", d => yAxisScale(d.healthcare) + 5)
        .text(function(d) { return d.abbr; })
        .attr("font-family", "sans-serif")
        .attr("font-size", "12px")
        .attr("fill", "white");

    // add axis labels
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 40)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Lacks Healthcare (%)");

    chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
        .attr("y", 0 - margin.bottom + 40)
        .attr("class", "axisText")
        .text("In Poverty (%)");
}).catch(function(error){
    console.log(error);
})