// Creates sunburst visualisation, highly based on Kerry Rodden's example: https://bl.ocks.org/kerryrodden/7090426


function drawSunburst(){

  // Load data
  d3.json("code/sunjson.json").then(function(dataset){

    // Dimenstions of the sunburst
    var width = 400;
    var height = 500;
    var radius = Math.min(width, height) / 2;

    // Breadcrumb dimensions: width, height, spacing, width of tip/tail.
    var b = {
          w: 75, h: 30, s: 3, t: 10
        };

    // Define colors to be used for sunburst parts
    var colors = {
        "male": "#8dd3c7",
        "female": "#fccde5",
        "Heterosexual": "#ffffb3",
        "Homosexual": "#b3de69",
        "bicurious": "#bebada",
        "bisexual": "#d9d9d9",
        "Submisive": "#fdb462",
        "Dominant": "#80b1d3",
        "Switch": "#fb8072",
      };

    // Append SVG element to correct div
    var svg = d3.select("#sunb")
                .append("svg")
                  .attr("width", width)
                  .attr("height", height)
                  .attr("class", "sunburst")
                .append("g")
                  .attr("id", "container")
                  .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    svg.append("text").text("Adult forum user population")
                          .attr("x", -120)
                          .attr("y", -230)
                          .attr("font-family", "Arial")
                          .attr("font-size", 20)

    svg.append("text").text("By gender, sexual orientation and sexual polarity")
                          .attr("x", -145)
                          .attr("y", -210)
                          .attr("font-family", "Arial")
                          .attr("font-size", 14)

    var partition = d3.partition()
                      .size([2 * Math.PI, radius]);

    var root = d3.hierarchy(dataset)
      .sum(function (d) { return d.size});

    partition(root);
    var arc = d3.arc()
        .startAngle(function (d) { return d.x0 })
        .endAngle(function (d) { return d.x1 })
        .innerRadius(function (d) { return d.y0 })
        .outerRadius(function (d) { return d.y1 });

    // Bounding circle underneath sunburst, to make it easier to detect when mouse leaves the parent g
        svg.append("svg:circle")
          .attr("r", radius)
          .style("opacity", 0);

    // Draw path for each datapoint
    var sunbslice = svg.selectAll('path')
        .data(root.descendants())
        .enter()
        .append('path')
          .attr("display", function (d) { return d.depth ? null : "none"; })
          .attr("d", arc)
          .style('stroke', '#fff')
          .style("fill", function(d) { return colors[d.data.name]; })
          .style("opacity", 1)
          .on("mouseover", sunbMouseOver);

  // Add the mouseleave handler to the bounding circle
  d3.select("#container").on("mouseleave", sunbMouseLeave);

  // Initialize legend and breadcrumb trails
  initializeBreadcrumbTrail();
  drawLegend();
  d3.select("#togglelegend").on("click", toggleLegend);

  // Get total size of the tree = value of root node from partition
  totalSize = sunbslice.datum().value;


    // Fade all but the current sequence, and show it in the breadcrumb trail
    function sunbMouseOver(d) {

      var percentage = (100 * d.value / totalSize).toPrecision(3);
      var percentageString = percentage + "%";
      if (percentage < 0.1) {
        percentageString = "< 0.1%";
      }

      d3.select("#percentage")
          .text(percentageString);

      d3.select("#explanation")
          .style("visibility", "");

      try {
        var sequenceArray = d.ancestors().reverse();
        sequenceArray.shift(); // Remove root node from the array
      }
      catch(err){

      }

      updateBreadcrumbs(sequenceArray, percentageString);

      // Fade all the segments
      d3.select("#sunb").selectAll("path")
          .style("opacity", 0.3);

      // Then highlight only those that are an ancestor of the current segment
      svg.selectAll("path")
          .filter(function(node) {
                    return (sequenceArray.indexOf(node) >= 0);
                  })
          .style("opacity", 1);
    };

    // Restore everything to full opacity when moving off the visualization
    function sunbMouseLeave(d) {

      // Hide the breadcrumb trail
      d3.select("#trail")
          .style("visibility", "hidden");

      // Deactivate all segments during transition
      d3.selectAll("path").on("mouseover", null);

      // Transition each segment to full opacity and then reactivate it
      d3.selectAll("path")
          .transition()
          .duration(1000)
          .style("opacity", 1)
          .on("end", function() {
                  d3.select(this).on("mouseover", sunbMouseOver);
                });

      d3.select("#explanation")
          .style("visibility", "hidden");
    };


    function initializeBreadcrumbTrail() {

      // Add the svg area
      var trail = d3.select("#sunb").append("svg:svg")
          .attr("width", width)
          .attr("height", 50)
          .attr("id", "trail");

      // Add the label at the end, for the percentage
      trail.append("svg:text")
        .attr("id", "endlabel")
        .style("fill", "#000");
    };


    // Generate a string that describes the points of a breadcrumb polygon
    function breadcrumbPoints(d, i) {
      var points = [];
      points.push("0,0");
      points.push(b.w + ",0");
      points.push(b.w + b.t + "," + (b.h / 2));
      points.push(b.w + "," + b.h);
      points.push("0," + b.h);
      if (i > 0) { // Leftmost breadcrumb; don't include 6th vertex
        points.push(b.t + "," + (b.h / 2));
      }
      return points.join(" ");
    };


    // Update the breadcrumb trail to show the current sequence and percentage
    function updateBreadcrumbs(nodeArray, percentageString) {

      // Data join; key function combines name and depth (= position in sequence)
      var trail = d3.select("#trail")
          .selectAll("g")
          .data(nodeArray, function(d) { return d.data.name + d.depth; });

      // Remove exiting nodes
      trail.exit().remove();

      // Add breadcrumb and label for entering nodes
      var entering = trail.enter().append("svg:g");

      entering.append("svg:polygon")
          .attr("points", breadcrumbPoints)
          .style("fill", function(d) { return colors[d.data.name]; });

      entering.append("svg:text")
          .attr("x", (b.w + b.t) / 2)
          .attr("y", b.h / 2)
          .attr("dy", "0.35em")
          .attr("text-anchor", "middle")
          .text(function(d) { return d.data.name; });

      // Merge enter and update selections; set position for all nodes
      entering.merge(trail).attr("transform", function(d, i) {
        return "translate(" + i * (b.w + b.s) + ", 0)";
      });

      // Now move and update the percentage at the end
      d3.select("#trail").select("#endlabel")
          .attr("x", (nodeArray.length + 0.5) * (b.w + b.s))
          .attr("y", b.h / 2)
          .attr("dy", "0.35em")
          .attr("text-anchor", "middle")
          .text(percentageString);

      // Make the breadcrumb trail visible, if it's hidden
      d3.select("#trail")
          .style("visibility", "");
    };

    function drawLegend() {

      // Dimensions of legend item: width, height, spacing, radius of rounded rect
      var li = {
        w: 95, h: 30, s: 3, r: 3
      };

      // Select the correct div and append a new SVG
      var legend = d3.select("#legend").append("svg:svg")
          .attr("width", li.w)
          .attr("height", d3.keys(colors).length * (li.h + li.s))
          .attr("class", "legendid");

      // Append a legend element for each data entry
      var g = legend.selectAll("g")
          .data(d3.entries(colors))
          .enter().append("svg:g")
          .attr("transform", function(d, i) {
                  return "translate(0," + i * (li.h + li.s) + ")";
               });

      g.append("svg:rect")
          .attr("rx", li.r)
          .attr("ry", li.r)
          .attr("width", li.w)
          .attr("height", li.h)
          .style("fill", function(d) { return d.value; });

      g.append("svg:text")
          .attr("x", li.w / 2)
          .attr("y", li.h / 2)
          .attr("dy", "0.35em")
          .attr("text-anchor", "middle")
          .text(function(d) { return d.key; });
    };

    // Add the ability to toggle legend visibility
    function toggleLegend() {
        var legend = d3.select("#legend");
        if (legend.style("visibility") == "hidden") {
          legend.style("visibility", "");
        } else {
          legend.style("visibility", "hidden");
        }
      }

  });
};


drawSunburst();
