
function drawSunburst(){

  d3.json("code/sunjson.json").then(function(dataset){

    console.log(dataset)

    // dimenstions of the sunburst
    var width = 500;
    var height = 500;
    var radius = Math.min(width, height) / 2;
    //var color = d3.scaleOrdinal(d3.schemeCategory20b);

    var svg = d3.select("#sunb")
                .append("svg")
                  .attr("width", width)
                  .attr("height", height)
                  .attr("class", "sunburst")
                  .append("g")
                  .attr("id", "container")
                  .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    var partition = d3.partition()  // <-- 1
                      .size([2 * Math.PI, radius]);

    var root = d3.hierarchy(dataset)
      .sum(function (d) { return d.size});

    partition(root);
    var arc = d3.arc()
        .startAngle(function (d) { return d.x0 })
        .endAngle(function (d) { return d.x1 })
        .innerRadius(function (d) { return d.y0 })
        .outerRadius(function (d) { return d.y1 });

    svg.selectAll('path')  // <-- 1
        .data(root.descendants())  // <-- 2
        .enter()  // <-- 3
        .append('path')  // <-- 4
        .attr("display", function (d) { return d.depth ? null : "none"; })  // <-- 5
        .attr("d", arc)  // <-- 6
        .style('stroke', '#fff')  // <-- 7
        .style("fill", '#ababab');  // <-- 8

  })
}

function drawBarChart(){


}

drawSunburst();
