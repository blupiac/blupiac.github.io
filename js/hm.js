var w =  800 //max size of the bubbles
var h = 800 //max size of the bubbles
var dataset = []
var bubbles
var clusters
var hm =[]
var selection=["1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1"]
// var  color  = d3.scale.category20(); //color category

 var color_stroke = d3.scale.ordinal()
 .domain(["", "No", "Yes"])
 .range(["none", "#666", "yellow"]);

 var color = d3.scale.ordinal()
 .domain(["","Comedy", "Action", "Romance", "Drama", "Adventure", "Mystery", "Western", "Music", "Horror", "War", "Crime", "Science Fiction", "Short", "Westerns", "Fantasy"])
 .range(["#999", "#00CED1", "#32CD32", "#FF00FF", "#FF1493", "#FF4500", "#A020F0", "#6495ED", "#f1c40f", "#836FFF", "#FA8072", "#CD853F", "#c39e0d", "#2F4F4F", "#f39c12",  "#d7dbdd" ]);

 var indice = d3.scale.ordinal()
 .domain(["","Comedy", "Action", "Romance", "Drama", "Adventure", "Mystery", "Western", "Music", "Horror", "War", "Crime", "Science fiction", "Short", "War", "Westerns", "Fantasy"])
 .range(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16"]);

 var m = 11
// var clusters = new Array(m)
var lala=[];
 // #FFD700    gold
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
                  cluster: 1,
                  id: i

              };


        })
     .get(function(error, rows) {
          console.log("Loaded " + rows.length + " rows");
          if (rows.length > 0) {
              console.log("First row: ", rows[1])
              console.log("Last  row: ", rows[rows.length-1])
          }

          dataset = rows;

    teste2();

})




function draw2(ar){


var a = 1;
  for (var i=0; i < ar.length; i++){
    add(hm, clusters[ar[i]].values, ar[i]);
  }


  var nodes = bubble.nodes({children:hm}).filter(function(d) { return !d.children; });

  var div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

  //setup the chart
 bubbles = svg.append("g")
      .attr("transform", "translate(0,0)")
      .selectAll(".bubble")
      .data(nodes)
      .enter();
  bubbles.append("circle")
      .attr("r", function(d){ return (d.r); })
      .attr("cx", function(d){ return (d.x); })
      .attr("cy", function(d){ return d.y; })
     .style("fill", function(d) { return color(d.sub); })
      .attr("stroke-width",1.2)
      .attr("stroke-opacity", 0.9)
      // .style("stroke", "black")
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
    }) .on("click", function(d) {
  			location.hash = d.id;
  	});


}


  clusters = d3.nest()
  .key(function(d) { return d.sub; }).sortKeys(d3.ascending)
  .entries(dataset);


  var argg =[];
  var a = 10;

    for (var i=1; i <17; i++){
    if(selection[i]==1){
      argg.push(i);
    }

  }

draw2(argg);

 }

function updateData(i){
var index = i;
diameter = 500 //max size of the bubbles
w =  1000 //max size of the bubbles
h = 800 //max size of the bubbles
clusterPadding = 6 // separation between different-color nodes
dataset = []
bubbles
clusters
hm =[]
x=[]
y=[]
xx =10
yy=10
raio = 10


  if(selection[index] == 1){
     selection[index]=0;
  }else{
    selection[index]=1;
  }


    var rectange =svg.append("rect")
                             .attr("x", 0)
                             .attr("y", 0)
                            .attr("width", w)
                           .attr("height", h)
                           .attr("fill", "white");


    p = d3.scale.linear()
              .domain([0,100])
              .range([1.5, 75]);



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
                  cluster: 1,
                  id:i

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


})


}


// Alert some text if there has been changes to the anchor part
function loadFocus() {
	window.location.href = window.location.href.replace("index", "focus");
}

 function add(argg, test, cle){
   for (var i=0; i< test.length; i++){
     test[i].cluster =cle;
     argg.push(test[i]);

   }

 }

