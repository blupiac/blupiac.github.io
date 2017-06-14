var diameter = 500 //max size of the bubbles
var w =  800 //max size of the bubbles
var h = 800 //max size of the bubbles

 var  color  = d3.scale.category20c(); //color category
 var color_stroke = d3.scale.ordinal()
 .domain(["No", "Yes"])
 .range(["none", "#000"]);

var bubble = d3.layout.pack()
    .sort(null)
    .size([w, h])
    .padding(1.5);

var svg = d3.select("body")
    .append("svg")
    .attr("width", w)
    .attr("height", h)
    .attr("class", "bubble");

//d3.dsv(";")("data/a.csv", function(error, data){

d3.dsv(";")("data/a.csv", function(error, data) {

    //convert numerical values from strings to numbers
    data = data.map(function(d){ d.value = +d["Popularity"],
                                  d.sub = d["Subject"],
                                  d.duree = +d["Length"],
                                  d.title = d["Title"],
                                  d.year = +d["Year"],
                                  d.actress = d["Actress"],
                                  d.director = d["Director"],
                                  d.actor = d["Actor"];
                                  d.awards = d["Awards"]
                                  return d; });

    //bubbles needs very specific format, convert data to this.
    var nodes = bubble.nodes({children:data}).filter(function(d) { return !d.children; });



      var div = d3.select("body").append("div")
          .attr("class", "tooltip")
          .style("opacity", 0);

    //setup the chart
    var bubbles = svg.append("g")
        .attr("transform", "translate(0,0)")
        .selectAll(".bubble")
        .data(nodes)
        .enter();


    //create the bubbles
    bubbles.append("circle")
        .attr("r", function(d){ return d.r; })
        .attr("cx", function(d){ return d.x; })
        .attr("cy", function(d){ return d.y; })
        .style("fill", function(d) { return color(d.sub); })
        .style("stroke", function(d) { return color_stroke(d.awards);})


      .on("mouseover", function(d) {
        d3.select(this).style("fill", "green");
          div.transition()
              .duration(200)
              .style("opacity", .9);
          div	.html("<b>" +(d.title) + ", "+ d.year+ "</b><br/><i>"  + d.sub + "</i><br/>"  + d.director + "<br/>"  + d.actress + "<br/>"  +d.actor)
              .style("left", (d3.event.pageX + 5) + "px")
              .style("top", (d3.event.pageY - 28) + "px");
          })
      .on("mouseout", function(d) {
        d3.select(this).style("fill", function(d) { return color(d.sub); });
          div.transition()
              .duration(500)
              .style("opacity", 0);
      });





})

function getAward(award){
  if (award = Yes) alert("oi");
}
