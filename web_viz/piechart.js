

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
      .value(function(d) { return d.count; })
      .sort(function(a, b) { return d3.ascending(a.key, b.key);} ) // This make sure that group order remains the same in the pie chart

const arc = d3.arc()
    .innerRadius(0)
    .outerRadius(radius);

function arcTween(a) {
    const i = d3.interpolate(this._current, a);
    this._current = i(1);
    return (t) => arc(i(t));
}

d3.json("code/piejson.json").then(dataset => {

  var sel = document.getElementById('ages');
  var category = 'All'

  updatePie(category, sel.value);

  sel.addEventListener("change", function(d) {
    updatePie(category, this.value)
  });

  function updatePie(category, agegroup) {

      //console.log(dataset);

      var data_ready = pie(dataset['ReallyAll'])

      // Join new data
      const path = svg.selectAll("pie")
                      .data(data_ready);

      // Update existing arcs
      path.transition().duration(200).attrTween("d", arcTween);

      // Enter new arcs
      path.enter().append("path")
          .attr('fill', function(d){ console.log(d.data.Risk); return colors[d.data.Risk]})
          .attr("d", arc)
          .attr("stroke", "white")
          .attr("stroke-width", "6px")
          .each(function(d) { this._current = d; });

       path.exit().remove()
      }
});
