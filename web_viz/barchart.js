

//Width, height and scale
var w = 500;
var h = 250;
var padding = 40;
var kleinpadding = 20;

// initialize SVG
var svg = d3.select("#bardiv")
            .append("svg")
              .attr("width", w)
              .attr("height", h)
              .attr("class", "barChart")

d3.json("code/barjson.json").then(function(dataset){

  updateBarChart('all')

  sel = document.getElementById('interactions');
  sel.addEventListener("change", function(d) {
    svg.selectAll('rect').remove()
    svg.selectAll('g').remove()
    updateBarChart('all')
  });

  function updateBarChart(group){

      var sel = document.getElementById('interactions');

      var data = dataset[group][sel.value]

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

      svg.selectAll("rect")
               .data(data)
               .enter()
               .append("rect")
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
               })

       // draw both axes
        svg.append("g")
           .attr("transform", "translate(0, "+ 210 +")")
           .call(x_axis);

        svg.append("g")
           .attr("transform", "translate("+ 200 +", "+ 60 +")")
           .call(y_axis);

     };

});

function set_group(){
  
}
