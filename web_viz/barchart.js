
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

    // Load data
    d3.json("code/barjson.json").then(function(dataset){

      // Get selected value from HTML element
      var sel = document.getElementById('interactions');

      var agegr = document.getElementById('ages');

      // Draw the first bar chart
      updateBarChart(null, sel.value)

      // If the user clicks a path within the sunburst, update the bar chart
      var gender = d3.select("#sunb").selectAll("path")
                      .on("click", function(d) {
                        if (d.data.name == "female" || d.data.name == "male"){
                          updateBarChart(d.data.name, sel.value);
                        }
                        // if (d.data.name == "Dominant" || d.data.name == "Submisive" || d.data.name == "Switch") {
                        //   drawPieChart();
                        //   drawPieChart().then().updatePie(agegr.value, d.data.name);
                      //}
                      });

      // If user selects a different subject, update the bar chart
      sel.addEventListener("change", function(d) {
        updateBarChart(null, this.value)
      });


      function updateBarChart(gender, sel){


        if (gender == null) {
          var data = dataset['all'][sel]
        }
        else {
          var data = dataset[gender][sel]
        };

          var yScale = d3.scaleLinear()
                     .domain([0, d3.max(data, function(d) { return d['mean']; })])
                     .range([h - 100, 0]);

           var y_axis = d3.axisLeft()
                         .scale(yScale);


           var xScale = d3.scaleBand()
                     .domain(['18-25','25-30', '30-40', '40-50', '50+'])
                     .range([200, w])
                     .paddingInner(0.05)
                     .paddingOuter(0.05)

           var x_axis = d3.axisBottom()
                          .scale(xScale);


          const rects = svg.selectAll("rect")
                   .data(data)

          rects.transition().duration(500)
                            .attr("y", function(d) {
                              return yScale(d['mean']) + 50
                            })
                            .attr("height", function(d) {
                              return (h - padding) - yScale(d['mean']) - 50;
                            })

          rects.enter().append("rect")
                   .attr("class", "bar")
                   .attr("fill", "#f9dd6b")
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
                   });

            // draw both axes
             svg.append("g")
                .attr("transform", "translate(0, "+ 210 +")")
                .call(x_axis);

            svg.select("#yas").remove()

             svg.append("g")
                .attr("transform", "translate("+ 200 +", "+ 60 +")")
                .attr("id","yas")
                .call(y_axis);



         }

    });
};

drawBarChart();
