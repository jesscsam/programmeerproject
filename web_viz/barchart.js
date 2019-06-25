
function drawBarChart() {

    // Define width, height and scale
    var w = 500;
    var h = 250;
    var padding = 40;
    var kleinpadding = 20;

    // Initialize SVG within div called 'bardiv'
    var svg = d3.select("#bardiv")
                .append("svg")
                  .attr("width", w)
                  .attr("height", h)
                  .attr("class", "barChart")


    svg.append("text").text("Amount of interactions")
                          .attr("x", 225)
                          .attr("y", 20)
                          .attr("font-family", "Arial")
                          .attr("font-size", 20)

    svg.append("text").text("By gender, type of interaction and age group")
                          .attr("x", 175)
                          .attr("y", 40)
                          .attr("font-family", "Arial")
                          .attr("font-size", 14)

    svg.append("text").text("age group")
                          .attr("x", 400)
                          .attr("y", 240)
                          .attr("font-family", "Arial")
                          .attr("font-size", 12)

    svg.append("text").text("amount of interactions")
                          .attr("x", -170)
                          .attr("y", 160)
                          .attr("transform", "rotate(-90)")
                          .attr("font-family", "Arial")
                          .attr("font-size", 12)

    // Load data
    d3.json("code/barjson.json").then(function(dataset){

      // Get selected values from HTML elements
      var sel = document.getElementById('interactions');
      var agegr = document.getElementById('ages');

      // Draw the first bar chart
      updateBarChart(null, sel.value)

      // If user clicks a path within the sunburst, update the bar chart or update the pie chart
      var gender = d3.select("#sunb").selectAll("path")
                      .on("click", function(d) {
                        if (d.data.name == "female" || d.data.name == "male"){
                          updateBarChart(d.data.name, sel.value);
                        }
                        if (d.data.name == "Dominant" || d.data.name == "Submisive" || d.data.name == "Switch") {
                            drawPieChart.updatePie(agegr.value, d);
                          }
                      });

      // If user selects a different subject in html element, update the bar chart
      sel.addEventListener("change", function(d) {
        updateBarChart(null, this.value)
      });


      function updateBarChart(gender, sel){

        // Check whether a gender is specified by clicking the sunburst
        if (gender == null) {
          var data = dataset['all'][sel]
          var color = '#bebada'
        }
        else if (gender == 'male') {
          var data = dataset[gender][sel]
          var color = '#80b1d3'
        }
        else {
          var data = dataset[gender][sel]
          var color = '#fccde5'
        };

        // Define scales and axes
        var yScale = d3.scaleLinear()
                   .domain([0, d3.max(data, function(d) { return d['mean']; })])
                   .range([h - 100, kleinpadding]);

         var y_axis = d3.axisLeft()
                       .scale(yScale);


         var xScale = d3.scaleBand()
                   .domain(['18-25','25-30', '30-40', '40-50', '50+'])
                   .range([200, w])
                   .paddingInner(0.05)
                   .paddingOuter(0.05)

         var x_axis = d3.axisBottom()
                        .scale(xScale);

        var tip = d3.tip()
                          .attr('class', 'd3-tip')
                           .offset([-10, 0])
                           .html(function(d) {
                             return "<span style='font-family:Arial'>" + Math.round(d['mean'] * 10) / 10 + "</span>";
                           })

        // Add rect for each datapoint
        const rects = svg.selectAll("rect")
                 .data(data)

        // When data is changed, change current rects to new ones
        rects.transition().duration(500)
                          .attr("y", function(d) {
                            return yScale(d['mean']) + 50
                          })
                          .attr("height", function(d) {
                            return (h - padding) - yScale(d['mean']) - 50;
                          })
                          .attr("fill", color);


        rects.enter().append("rect")
                 .attr("class", "bar")
                 .attr("fill", color)
                 .attr("width", function(d) {
                     return xScale.bandwidth()
                   })
                 .attr("y", function(d) {
                     return yScale(d['mean']) + 50
                   })
                 .attr("x", function(d) {
                     return xScale(d['Group']);
                 })
                 .attr("height", function(d) {
                   return (h - padding) - yScale(d['mean']) - 50;
                 })
                 .on('mouseover', tip.show)
                 .on('mouseout', tip.hide);

         svg.call(tip);


          // Draw x axis
           svg.append("g")
              .attr("transform", "translate(0, "+ 210 +")")
              .call(x_axis);

          // Remove current y axis and draw appropriate y axis
          svg.select("#yas").remove()
          svg.append("g")
              .attr("transform", "translate("+ 200 +", "+ 60 +")")
              .attr("id","yas")
              .call(y_axis);
         }
    });
};

drawBarChart();
