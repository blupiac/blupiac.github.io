var diameter = 500 //max size of the bubbles
var w =  900 //max size of the bubbles
var h = 800 //max size of the bubbles
var clusterPadding = 6 // separation between different-color nodes
var dataset = []
var bubbles
var clusters
var hm =[]
// var  color  = d3.scale.category20(); //color category

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


              d3.select("bubbles")
  .append("div")
  .attr("class","bubbles")
  .each(function(d) {

for (var i = 1; i < 4; i++) {
    d3.select("#bubbles")
      .append("button")
      .attr("type","button")
      .attr("class","btn-btn")
      .attr("id",function(d) { return 'button '+i;})
      .append("div")
      .attr("class","label")
      .text(function(d) { return 'button '+i;})

    }
  })

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
    //        loadData();

    teste2();

    //bubbles needs very specific format, convert data to this.
    // var nodes = bubble.nodes({children:dataset}).filter(function(d) { return !d.children; });


    // var div = d3.select("body").append("div")
    //       .attr("class", "tooltip")
    //       .style("opacity", 0);
    //
    // //setup the chart
    // var bubbles = svg.append("g")
    //     .attr("transform", "translate(0,0)")
    //     .selectAll(".bubble")
    //     .data(nodes)
    //     .enter();

    //     var force = d3.layout.force()
    // .nodes(nodes)
    // .size([w, h])
    // .gravity(.02)
    // .charge(0)
    // .on("tick", tick)
    // .start();


    //create the bubbles

  //  draw();
    // bubbles.append("circle")
    //     .attr("r", function(d){ return (d.r); })
    //     .attr("cx", function(d){ return d.x; })
    //     .attr("cy", function(d){ return d.y; })
    //     .style("fill", function(d) { return color(d.sub); })
    //     .attr("stroke-width", 1.2)
    //     .attr("stroke-opacity", 0.9)
    //
    //     .style("stroke", function(d) { return color_stroke(d.awards);})
    //
    //
    //   .on("mouseover", function(d) {
    //     d3.select(this).style("fill", "green");
    //
    //       div.transition()
    //           .duration(200)
    //           .style("opacity", .9)
    //
    //       div.html( "<h1><b>" +(d.title) + ", "+ d.year+ "</b></h1><i>"  + d.sub
    //       + "</i><br/>"  + d.director + "<br/>"  + d.actress
    //       + "<br/>"  + d.actor + "<br/><h1>" + d.value + " / 100</h1>" )
    //           .style("left", (d3.event.pageX + 5) + "px")
    //           .style("top", (d3.event.pageY - 28) + "px")
    //           // .style("left", w -100 + "px")
    //           // .style("top", 50 + "px")
    //           //mostrar conexoes?
    //
    //       })
    //   .on("mouseout", function(d) {
    //     d3.select(this).style("fill", function(d) { return color(d.sub); });
    //       div.transition()
    //           .duration(500)
    //           .style("opacity", 0);
    //   })  .on("click", teste);
     // .on("click", loadData());

})

function draw(){
  var nodes = bubble.nodes({children:dataset}).filter(function(d) { return !d.children; });

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
    })
	.on("click", function(d) {
			alert("hi");
			location.href += "#" + d.id;
			var x = location.hash;
			document.getElementById("demo").innerHTML = "The anchor part is now: " + x;
	});

}

// Alert some text if there has been changes to the anchor part
function loadFocus() {
	
	window.location.href = window.location.href.replace("index2", "index");
}
	
function draw2(ar){
  // console.log("Tidsadspo", ar);

  var nodes = bubble.nodes({children:ar}).filter(function(d) { return !d.children; });
//console.log("Tidsadspo", nodes);

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
    })
	.on("click", function(d) {
			location.hash = d.id;
	});

}

 function teste(d){
  //  console.log("Tipo", (d.sub));
 }

 function teste2(d){
   console.log("Tipo", "Uma vez");
   for(var i =0; i < dataset.length ; i++){
  //   clusters[indice(dataset[i].sub)].push(dataset[i].title);
  //lala.push(dataset[i]);
    // console.log("Tipo", dataset[i].sub);

   }

    clusters = d3.nest()
  .key(function(d) { return d.sub; }).sortKeys(d3.ascending)

//  .key(function(d) { return d.priority; }).sortKeys(function(d) { return )

  //.rollup(function(v) { return v.length; })
  //.rollup(function(v) { return d3.sum(v, function(d) { return d.value; }); })
  .entries(dataset);
  for(var i =0; i < clusters.length ; i++){
 //   clusters[indice(dataset[i].sub)].push(dataset[i].title);
 //lala.push(dataset[i]);
// console.log("Tipo", clusters[i]);

    // console.log("Tipo", clusters[i].key);

  }

  //console.log("Tipo", clusters[1].values)


  var argg =[];

  for (var i=0; i < clusters.length; i++){
  add(argg, clusters[i].values);

  console.log("test", clusters[i].key)

//   draw2(clusters[5].values);
  //send.push(clusters[10].values);
}
// add(hm, clusters[2].values);
// add(hm, clusters[0].values);
// add(hm, clusters[4].values);
//
// add(hm, clusters[6].values);
// add(hm, clusters[8].values);

// add(hm,clusters[5].values);
// console.log("test", clusters[1].key)



draw2(argg);
//desenha(hm)

 }

function select(n){

  // d3.select("body").selectAll("div.h-bar") // <-B
  //     //     .data(data.filter(function(d){return d.category == category;}))
  //    .enter()
  //          .append("div")
  //          .attr("class", "h-bar")
  //    .append("span");

  add(hm, clusters[n].values);
  console.log("aa",hm);
  draw2(hm);
}

 function desenha(cl){

   var nodes = bubble.nodes({children:cl}).filter(function(d) { return !d.children; });
   console.log("ndes", nodes);

var n = cl.length
var m = clusters.length

 nodes = d3.range(n).map(function() {
   var i = Math.floor(Math.random() * m),
      r = Math.sqrt((i + 1) / m * -Math.log(Math.random())) * 12,
      d = {
        cluster: i,
        radius: r,
        x: Math.cos(i / m * 2 * Math.PI) * 200 + w / 2 + Math.random(),
        y: Math.sin(i / m * 2 * Math.PI) * 200 + h / 2 + Math.random()
      };
      console.log("bubbles", i);

  if (!cl[i] || (r > cl[i].radius)) cl[i] = d;
  return d;
});




bubbles = svg.append("g")
     .attr("transform", "translate(0,0)")
     .selectAll(".bubble")
     .data(nodes)
     .enter();
 bubbles.append("circle")
     .attr("r", function(d){ return (d.r); })
     .attr("cx", function(d){ return d.x; })
     .attr("cy", function(d){ return d.y; })
     .style("fill", function(d) { return color(d.sub); })
     .attr("stroke-width", 1.2)
     .attr("stroke-opacity", 0.9)

     .style("stroke", function(d) { return color_stroke(d.awards);})



    console.log("bubbles", m);


 }

 function add(argg, test){
   for (var i=0; i< test.length; i++){
     argg.push(test[i]);

   }

 }

function zoomed() {
  container.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
}
function lala(award){
  if (award = Yes)  return "oi";
}
