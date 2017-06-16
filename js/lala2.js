var diameter = 500 //max size of the bubbles
var w =  900 //max size of the bubbles
var h = 800 //max size of the bubbles
var clusterPadding = 6 // separation between different-color nodes
var dataset = []
 // var  color  = d3.scale.category20c(); //color category

 var color_stroke = d3.scale.ordinal()
 .domain(["No", "Yes"])
 .range(["none", "yellow"]);

 var color = d3.scale.ordinal()
 // #17 Westerns, Short, Romance, Fantasy, CAT, Science Fiction
 .domain(["","Comedy", "Action", "Drama", "Adventure", "Mystery", "Western", "Music", "Horror", "War", "Crime"])
 .range(["#999", "#00CED1", "#32CD32", "#FF1493", "#FF4500", "#A020F0", "#6495ED", "#2F4F4F", "#836FFF", "#FA8072", "#CD853F"]);

 var indice = d3.scale.ordinal()
 .domain(["","Comedy", "Action", "Drama", "Adventure", "Mystery", "Western", "Music", "Horror", "War", "Crime"])
 .range(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]);
 var m = 11
// var clusters = new Array(m)
var lala=[];
 // #FFD700	gold
 // var zoom = d3.behavior.zoom()
 //     .scaleExtent([1, 10])
 //     .on("zoom", zoomed);

var bubble = d3.layout.pack()
    .sort(null)
    .size([w, h])
    .padding(2);

var svg = d3.select("body")
    .append("svg")
    .attr("width", w)
    .attr("height", h)
    .attr("class", "bubble")

    // zoom part
    .call(d3.behavior.zoom().scaleExtent([0.5, 10]).on("zoom", function () {
        svg.attr("transform", "translate(" + d3.event.translate + ")" + " scale(" + d3.event.scale + ")")
      }))
      .append("g")


    p = d3.scale.linear()
              .domain([0,100])
              .range([1.5, 75]);

//d3.dsv(";")("data/a.csv", function(error, data){

  // d3.dsv(";")("data/a.csv", function(error, data) {

    //convert numerical values from strings to numbers
    // data = data.map(function(d){ d.value = +d["Popularity"],
    //                               d.sub = d["Subject"],
    //                               d.duree = +d["Length"],
    //                               d.title = d["Title"],
    //                               d.year = +d["Year"],
    //                               d.actress = d["Actress"],
    //                               d.director = d["Director"],
    //                               d.actor = d["Actor"];
    //                               d.awards = d["Awards"]
    //                               return d; });


    d3.dsv(";")("data/a.csv")

    .row(function (d, i)
    {
              return {
                  year: +d["Year"],
                  length: +d["Length"],
                  title: d["Title"],
                  sub: d["Subject"],
                  actor: d["Actor"],
                  actress: d["Actress"],
                  director: d["Director"],
                  value:  +d["Popularity"],
                  awards: d["Awards"],
              };


        })
     .get(function(error, rows) {
          console.log("Loaded " + rows.length + " rows");
          if (rows.length > 0) {
              console.log("First row: ", rows[1])
              console.log("Last  row: ", rows[rows.length-1])
          }

          dataset = rows;
    //        loadData();

    teste2();

    //bubbles needs very specific format, convert data to this.
    var nodes = bubble.nodes({children:dataset}).filter(function(d) { return !d.children; });


    var div = d3.select("body").append("div")
          .attr("class", "tooltip")
          .style("opacity", 0);

    //setup the chart
    var bubbles = svg.append("g")
        .attr("transform", "translate(0,0)")
        .selectAll(".bubble")
        .data(nodes)
        .enter();

    //     var force = d3.layout.force()
    // .nodes(nodes)
    // .size([w, h])
    // .gravity(.02)
    // .charge(0)
    // .on("tick", tick)
    // .start();


    //create the bubbles
    bubbles.append("circle")
        .attr("r", function(d){ return (d.r); })
        .attr("cx", function(d){ return d.x; })
        .attr("cy", function(d){ return d.y; })
        .style("fill", function(d) { return color(d.sub); })
        .attr("stroke-width", 1.2)
        .attr("stroke-opacity", 0.9)

        .style("stroke", function(d) { return color_stroke(d.awards);})


      .on("mouseover", function(d) {
        d3.select(this).style("fill", "green");

          div.transition()
              .duration(200)
              .style("opacity", .9)

          div.html( "<h1><b>" +(d.title) + ", "+ d.year+ "</b></h1><i>"  + d.sub
          + "</i><br/>"  + d.director + "<br/>"  + d.actress
          + "<br/>"  + d.actor + "<br/><h1>" + d.value + " / 100</h1>" )
              .style("left", (d3.event.pageX + 5) + "px")
              .style("top", (d3.event.pageY - 28) + "px")
              // .style("left", w -100 + "px")
              // .style("top", 50 + "px")
              //mostrar conexoes?

          })
      .on("mouseout", function(d) {
        d3.select(this).style("fill", function(d) { return color(d.sub); });
          div.transition()
              .duration(500)
              .style("opacity", 0);
      })  .on("click", teste);
     // .on("click", loadData());

})

function tick(e) {
  node
      .each(cluster(10 * e.alpha * e.alpha))
      .each(collide(.5))
      .attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; });
}

// Move d to be adjacent to the cluster node.
function cluster(alpha) {
  return function(d) {
    var cluster = d.sub;
    if (cluster === d) return;
    var x = d.x - cluster.x,
        y = d.y - cluster.y,
        l = Math.sqrt(x * x + y * y),
        r = d.radius + cluster.radius;
    if (l != r) {
      l = (l - r) / l * alpha;
      d.x -= x *= l;
      d.y -= y *= l;
      cluster.x += x;
      cluster.y += y;
    }
  };
}

// Resolves collisions between d and all other circles.
function collide(alpha) {
  var quadtree = d3.geom.quadtree(nodes);
  return function(d) {
    var r = d.radius + maxRadius + Math.max(padding, clusterPadding),
        nx1 = d.x - r,
        nx2 = d.x + r,
        ny1 = d.y - r,
        ny2 = d.y + r;
    quadtree.visit(function(quad, x1, y1, x2, y2) {
      if (quad.point && (quad.point !== d)) {
        var x = d.x - quad.point.x,
            y = d.y - quad.point.y,
            l = Math.sqrt(x * x + y * y),
            r = d.radius + quad.point.radius + (d.sub === quad.point.cluster ? padding : clusterPadding);
        if (l < r) {
          l = (l - r) / l * alpha;
          d.x -= x *= l;
          d.y -= y *= l;
          quad.point.x += x;
          quad.point.y += y;
        }
      }
      return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
    });
  };
}

 function teste(d){
   console.log("Tipo", (d.sub));
 }

 function teste2(d){
   console.log("Tipo", "Uma vez");
   for(var i =0; i < dataset.length ; i++){
  //   clusters[indice(dataset[i].sub)].push(dataset[i].title);
  lala.push(dataset[i]);
    // console.log("Tipo", dataset[i].sub);

   }

   var expensesByName = d3.nest()
  .key(function(d) { return d.sub; })
  .entries(dataset);
  for(var i =0; i < expensesByName.length ; i++){
 //   clusters[indice(dataset[i].sub)].push(dataset[i].title);
 //lala.push(dataset[i]);
 console.log("Tipo", expensesByName[i]);

   // console.log("Tipo", dataset[i].sub);

  }
 }

function zoomed() {
  container.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
}
function lala(award){
  if (award = Yes)  return "oi";
}
