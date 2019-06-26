function drawPieChart() {

    // set the dimensions and margins of the graph
    var width = 350
    var height = 400
    var margin = 40

    // The radius of the pieplot is half the width or half the height (smallest one)
    var radius = Math.min(width, height) / 2 - margin

    // Append the svg object to the div called 'pie'
    var svgPie = d3.select("#pie")
              .append("svg")
                .attr("width", width + 100)
                .attr("height", height)
                .attr("class", "pieid")
            .append("g")
              .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    svgPie.append("text").text("Risk of being drawn into sex work")
                          .attr("x", -90)
                          .attr("y", -180)
                          .attr("font-family", "Arial")
                          .attr("font-size", 20)

    svgPie.append("text").text("By subgroup and/or age group")
                          .attr("x", -40)
                          .attr("y", -155)
                          .attr("font-family", "Arial")
                          .attr("font-size", 14)

    // Define the colors that will be used for the pie parts
    var colors = {
        "Low_risk": "#fdae61",
        "High_risk": "#ce5052",
        "No_risk": "#abdda4",
        "unknown_risk": "#b7acac",
      };

    // Compute the position of each group on the pie:
    var pie = d3.pie()
          .value(function(d) {
            return d.Count })
          .sort(function(a, b) { return d3.ascending(a.key, b.key);} ) // This make sure that group order remains the same in the pie chart

    const arc = d3.arc()
        .innerRadius(0)
        .outerRadius(radius);


    // Store the displayed angles in _current, interpolate from _current to new angles
    function arcTween(a) {
        const i = d3.interpolate(this._current, a);
        this._current = i(1);
        return (t) => arc(i(t));
    }

    // Load data
    d3.json("code/piejson.json").then(dataset => {

      // Get the selected agegroup from HTML element
      var agegr = document.getElementById('ages');

      // Draw the initial pie chart
      updatePie(agegr.value, null);

      // If the user selects a new agegroup, update the pie chart
      agegr.addEventListener("change", function(d) {
        updatePie(this.value, null)
      });



      function updatePie(agegroup, userchar) {

          // Check what variables the user has chosen
          if (agegroup == 'All' && userchar == null) {
            var data_ready = pie(dataset['ReallyAll'])
          }
          else if (agegroup != 'All' && userchar == null) {
            var data_ready = pie(dataset['All'][agegroup])
          }
          else  {
            var data_ready = pie(dataset[userchar.parent.parent.data.name][userchar.parent.data.name][userchar.data.name][agegroup])
          };

          // Join new data
          const slices = svgPie.selectAll("path")
                          .data(data_ready);

          // Update existing arcs
          slices.transition().duration(200).attrTween("d", arcTween);

          // Enter new arcs
          slices.enter().append("path")
              .attr('fill', function(d){ return colors[d.data.Risk]})
              .attr("d", arc)
              .attr("stroke", "white")
              .attr("stroke-width", "6px")
              .each(function(d) { this._current = d.data.Count; })

          // Remove unnecessary arcs
           slices.exit().remove()

          // again rebind for legend
          var legendG = svgPie.selectAll(".legend") // note appending it to mySvg and not svg to make positioning easier
            .data(data_ready)
            .enter().append("g")
            .attr("transform", function(d,i){
              return "translate(" + (width - 175) + "," + (i * 15 - 25) + ")"; // place each legend on the right and bump each one down 15 pixels
            })
            .attr("class", "legend");

          legendG.append("rect") // make a matching color rect
            .attr("width", 10)
            .attr("height", 10)
            .attr("fill", function(d){ return colors[d.data.Risk]
              });

          legendG.append("text") // add the text
            .text(function(d){
              return d.data.Risk;
            })
            .style("font-size", 12)
            .attr("y", 10)
            .attr("x", 11);

          }

          // Declaring function to be used in barchart.js
          drawPieChart.updatePie = updatePie;



        })
    };

drawPieChart();
