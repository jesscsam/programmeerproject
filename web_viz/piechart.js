
function drawPieChart(){

  d3.json("code/piejson.json").then(function(dataset){

    // set the dimensions and margins of the graph
    var width = 350
    var height = 300
    var margin = 40

    // The radius of the pieplot is half the width or half the height (smallest one). I substract a bit of margin.
    var radius = Math.min(width, height) / 2 - margin

    // append the svg object to the div called 'my_dataviz'
    var svg = d3.select("#pie")
              .append("svg")
                .attr("width", width)
                .attr("height", height)
            .append("g")
              .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    var colors = {
        "Low_risk": "#fdae61",
        "High_risk": "#ce5052",
        "No_risk": "#abdda4",
        "unknown_risk": "#b7acac",
      };


    // Compute the position of each group on the pie:
    var pie = d3.pie()
          .value(function(d) { return d.size; })
          .sort(function(a, b) { return d3.ascending(a.key, b.key);} ) // This make sure that group order remains the same in the pie chart

    // TO DO: USER INPUT TO GET AGE GROUP
    var data_ready = pie(dataset['All'])

    // shape helper to build arcs:
    var arcGenerator = d3.arc()
                        .innerRadius(0)
                        .outerRadius(radius)

    // map to data
    var u = svg.selectAll("mySlices")
              .data(data_ready)
              .enter()
              .append('path')
              .attr('d', arcGenerator)
              .attr('fill', function(d){ return colors[d.data.Risk]})
              .attr("stroke", "white")
              .style("stroke-width", "2px")
              .style("opacity", 1)

    // Now add the annotation. Use the centroid method to get the best coordinates

        svg.selectAll('mySlices')
          .data(data_ready)
          .enter()
          .append('text')
          .text(function(d){ return d.data.Risk})
          .attr("transform", function(d) { return "translate(" + arcGenerator.centroid(d) + ")";  })
          .style("text-anchor", "middle")
          .style("font-size", 17)




  });
}




drawPieChart();
