var w = 800;
var h = 800;
var graph_UL_x = 50;
var graph_UL_y = 50;
var graph_LR_x = 600;
var graph_LR_y = 600;
var x;                        
var y;
var dataset = [];
var currMovie;
var neighbours = [];
var links = [];
var nodes = [];

var color = d3.scale.ordinal()
			.domain(["","Comedy", "Action", "Drama", "Adventure", "Mystery", "Western", "Music", "Horror", "War", "Crime"])
			.range(["#999", "#00CED1", "#32CD32", "#FF1493", "#FF4500", "#A020F0", "#6495ED", "#2F4F4F", "#836FFF", "#FA8072", "#CD853F"]);

var color_hover = d3.scale.ordinal()
			.domain(["","Comedy", "Action", "Drama", "Adventure", "Mystery", "Western", "Music", "Horror", "War", "Crime"])
			.range(["#999", "#10DEF1", "#42DD42", "#FF24A3", "#FF5510", "#B030F0", "#74A5FD", "#3F5F5F", "#937FFF", "#FA9082", "#DD954F"]);

var color_stroke = d3.scale.ordinal()
					.domain(["No", "Yes"])
					.range(["none", "yellow"]);

// loosely based on https://stackoverflow.com/questions/28102089/simple-graph-of-nodes-and-links-without-using-force-layout

//Create SVG element
var svg = d3.select("body")
            .append("svg")
            .attr("width", w)
            .attr("height", h);


function loadData()
{
	neighbours.length = 0;
	links.length = 0;
	nodes.length = 0;
	
	svg.selectAll("*").remove();
	
	currMovie = parseInt(location.hash.substring(1, location.hash.length));
	
	fillNeighbour();
	neighboursToNodes(neighbours);
	draw();
}

d3.tsv("data/film.tsv")
	.row(function (d, i) 
	{
            return {
                year: +d.Year,
                length: +d.Length,
                title: d.Title,
                subject: d.Subject,
                actor: d.Actor,
                actress: d.Actress,
                director: d.Director,
                popularity: +d.Popularity,
                awards: d.Awards,
            };
      })
   .get(function(error, rows) {
        console.log("Loaded " + rows.length + " rows");
        if (rows.length > 0) {
            console.log("First row: ", rows[1])
            console.log("Last  row: ", rows[rows.length-1])
        }
     
        dataset = rows;
		loadData();
   });


function draw() 
{
	// first dashed line for movies that have more than 1 thing in common
	svg.selectAll("link")
		.data(neighbours)
		.enter()
		.append("line")
		.attr("class", "link")
		.attr("x1", function() {
			return neighbours[0].x
		})
		.attr("y1", function() {
			return neighbours[0].y
		})
		.attr("x2", function(n) {
			return n.x
		})
		.attr("y2", function(n) {
			return n.y
		})
	   .attr("style", relationEdgeStyleSolid)
   // second solid line for background, will be same color as 1st line is 
   // movies have only 1 thing in common
	svg.selectAll("link")
		.data(neighbours)
		.enter()
		.append("line")
		.attr("class", "link")
		.attr("x1", function() {
			return neighbours[0].x
		})
		.attr("y1", function() {
			return neighbours[0].y
		})
		.attr("x2", function(n) {
			return n.x
		})
		.attr("y2", function(n) {
			return n.y
		})
	   .attr("style", relationEdgeStyleDashed)

	var div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);
	   
    svg.selectAll("node")
        .data(neighbours)
        .enter()
        .append("circle")
        .attr("r", function(d) { return d.radius })
        .attr("cx", function(d) { return d.x })
    	.attr("cy", function(d) { return d.y })
    	.attr("fill", function(d) { return color(dataset[d.datasetIdx].subject)} )
		.style("stroke", function(d) { return color_stroke(dataset[d.datasetIdx].awards);})
		.on("mouseover", function(d) {
			
			d3.select(this).style("fill", function(d) {
					return color_hover(dataset[d.datasetIdx].subject)});
			
			div.transition()
				.duration(200)
				.style("opacity", .9)
			
			div.html( "<h1><b>" + d.name + ", "+
								dataset[d.datasetIdx].year + "</b></h1><i>"  +
								dataset[d.datasetIdx].subject + "</i><br/>" +
								dataset[d.datasetIdx].director + "<br/>" +
								dataset[d.datasetIdx].actress + "<br/>" +
								dataset[d.datasetIdx].actor + "<br/><h1>" +
								dataset[d.datasetIdx].popularity + " / 100</h1>" )
            .style("left", (d3.event.pageX + 5) + "px")
            .style("top", (d3.event.pageY - 28) + "px");
		})
		.on("mouseout", function(d) {
		  d3.select(this).style("fill", function(d) { return color(dataset[d.datasetIdx].subject)});
		  
		  div.transition()
            .duration(500)
            .style("opacity", 0);
		})
		.on("click", function(d) {
			div.transition()
				.duration(500)
				.style("opacity", 0);
			
			location.hash = d.datasetIdx;
			loadData();
		})
		
	svg.append("line")
		.attr("x1", graph_LR_y + 70)
		.attr("y1", 100)
		.attr("x2", w-10)
		.attr("y2", 100)
		.attr("style", "stroke:#FFC0CB;stroke-width: 5;fill: none;")

	svg.append("text")
         .attr("x", graph_LR_y + 70)
         .attr("y", 120)
         .text("Same actress")
         .attr("font-family", "sans-serif")
         .attr("font-size", "16px")
         .attr("fill", "black");

	svg.append("line")
		.attr("x1", graph_LR_y + 70)
		.attr("y1", 140)
		.attr("x2", w-10)
		.attr("y2", 140)
		.attr("style", "stroke:#FF0000;stroke-width: 5;fill: none;")

	svg.append("text")
         .attr("x", graph_LR_y + 70)
         .attr("y", 160)
         .text("Same actor")
         .attr("font-family", "sans-serif")
         .attr("font-size", "16px")
         .attr("fill", "black");

	svg.append("line")
		.attr("x1", graph_LR_y + 70)
		.attr("y1", 180)
		.attr("x2", w-10)
		.attr("y2", 180)
		.attr("style", "stroke:#0000FF;stroke-width: 5;fill: none;")

	svg.append("text")
         .attr("x", graph_LR_y + 70)
         .attr("y", 200)
         .text("Same director")
         .attr("font-family", "sans-serif")
         .attr("font-size", "16px")
         .attr("fill", "black");

	svg.append("line")
		.attr("x1", graph_LR_y + 70)
		.attr("y1", 220)
		.attr("x2", w-10)
		.attr("y2", 220)
		.attr("style", "stroke:#0000FF;stroke-width: 5;fill: none;")

	svg.append("line")
		.attr("x1", graph_LR_y + 70)
		.attr("y1", 220)
		.attr("x2", w-10)
		.attr("y2", 220)
		.attr("style", "stroke:#FF0000;stroke-width: 5;stroke-dasharray: 5,5")

	svg.append("text")
         .attr("x", graph_LR_y + 70)
         .attr("y", 240)
         .text("Same of both")
         .attr("font-family", "sans-serif")
         .attr("font-size", "16px")
         .attr("fill", "black");

	svg.append("text")
         .attr("x", graph_LR_y + 70)
         .attr("y", 255)
         .text("colors")
         .attr("font-family", "sans-serif")
         .attr("font-size", "16px")
         .attr("fill", "black");

	svg.append("line")
		.attr("x1", graph_LR_y + 70)
		.attr("y1", 270)
		.attr("x2", w-10)
		.attr("y2", 270)
		.attr("style", "stroke:#FFD700;stroke-width: 10;fill: none;")

	svg.append("text")
         .attr("x", graph_LR_y + 70)
         .attr("y", 290)
         .text("Same actor,")
         .attr("font-family", "sans-serif")
         .attr("font-size", "16px")
         .attr("fill", "black");

	svg.append("text")
         .attr("x", graph_LR_y + 70)
         .attr("y", 305)
         .text("director &")
         .attr("font-family", "sans-serif")
         .attr("font-size", "16px")
         .attr("fill", "black");

	svg.append("text")
         .attr("x", graph_LR_y + 70)
         .attr("y", 320)
         .text("actress")
         .attr("font-family", "sans-serif")
         .attr("font-size", "16px")
         .attr("fill", "black");


	svg.append("svg:defs").append("svg:marker")
							.attr("id", "triangle")
							.attr("refX", 0)
							.attr("refY", 5)
							.attr("markerUnits", "strokeWidth")
							.attr("markerWidth", 30)
							.attr("markerHeight", 30)
							.attr("orient", "auto")
							.append("path")
							.attr("d", "M 0 0 L 10 5 L 0 10 z")
							.style("fill", "black");
	
	svg.append("line").attr("x1", graph_LR_x/2)
						.attr("y1", graph_LR_y +100)
						.attr("x2", graph_UL_x)
						.attr("y2", graph_LR_y + 100)
						.attr("stroke-width", 2)
						.attr("stroke", "black")
						.attr("marker-end", "url(#triangle)");
						
	svg.append("line").attr("x1", graph_LR_x/2)
						.attr("y1", h-100)
						.attr("x2", graph_LR_x)
						.attr("y2", h-100)
						.attr("stroke-width", 2)
						.attr("stroke", "black")
						.attr("marker-end", "url(#triangle)");
	
	svg.append("text")
         .attr("x", graph_LR_x/2)
         .attr("y", graph_LR_y + 120)
         .text(function(d) { return dataset[currMovie].year })
         .attr("font-family", "sans-serif")
         .attr("font-size", "16px")
         .attr("fill", "black");

	svg.append("text")
         .attr("x", graph_UL_x)
         .attr("y", graph_LR_y + 120)
         .text(function(d) 
				{ 
					var allYears = neighbours.map(function(neighbours) {return neighbours.timeDistance;})
					return dataset[currMovie].year + d3.min(allYears);
				})
         .attr("font-family", "sans-serif")
         .attr("font-size", "16px")
         .attr("fill", "black");

	svg.append("text")
         .attr("x", graph_LR_x - 40)
         .attr("y", graph_LR_y + 120)
         .text(function(d) 
				{ 
					var allYears = neighbours.map(function(neighbours) {return neighbours.timeDistance;})
					return dataset[currMovie].year + d3.max(allYears);
				})
         .attr("font-family", "sans-serif")
         .attr("font-size", "16px")
         .attr("fill", "black");
		 
	svg.append("text")
        .attr("x", graph_LR_x/2 - 65)
        .attr("y", graph_LR_y + 150)
        .text("Back to movie selection")
        .attr("font-family", "sans-serif")
        .attr("font-size", "16px")
        .attr("fill", "blue")
		.on("mouseover", function(d) {
			d3.select(this).style("cursor", "pointer");
			d3.select(this).style("text-decoration", "underline");
		})
		.on("mouseout", function(d) {
			d3.select(this).style("cursor", "default");
			d3.select(this).style("text-decoration", "none");
		})
		.on("click", function(d) {
			window.location.hash = "";
			window.location.href = window.location.href.replace("focus", "index");
		});
}

function relationEdgeStyleSolid(d)
{
	switch(d.relation[0]) {
		case "actress":
			return "stroke:#FFC0CB;stroke-width: 5;fill: none;";
		case "actor":
			return "stroke:#FF0000;stroke-width: 5;fill: none;";
		default:
			return "stroke:#0000FF;stroke-width: 5;fill: none;";
	}
}

function relationEdgeStyleDashed(d)
{
	if(d.relation.length == 1)
	{
		switch(d.relation[0]) {
			case "actress":
				return "stroke:#FFC0CB;stroke-width: 5";
			case "actor":
				return "stroke:#FF0000;stroke-width: 5";
			default:
				return "stroke:#0000FF;stroke-width: 5";
		}
	}
	else if(d.relation.length == 2)
	{
		switch(d.relation[1]) {
			case "actress":
				return "stroke:#FFC0CB;stroke-width: 5;stroke-dasharray: 5,5";
			case "actor":
				return "stroke:#FF0000;stroke-width: 5;stroke-dasharray: 5,5";
			default:
				return "stroke:#0000FF;stroke-width: 5;stroke-dasharray: 5,5";
		}
	}
	else
	{
		return "stroke:#FFD700;stroke-width: 10;fill: none;"
	}
}
			
// 3 functions below are placeholders

function getSameDirector()
{
	var rowNums = [currMovie+1, currMovie-1, currMovie+2, currMovie-3];
	
	return rowNums;
}

function getSameActor()
{
	var rowNums = [currMovie+1, currMovie-2, currMovie+2];
	
	return rowNums;
}

function getSameActress()
{
	var rowNums = [currMovie+1, currMovie-3, currMovie+3, currMovie-2,];
	
	return rowNums;
}

function fillNeighbour()
{
	var sameDirector = getSameDirector();
	var sameActor = getSameActor();
	var sameActress = getSameActress();	

	// size <10 is hard to click on
	p = d3.scale.linear()
            .domain([0,100])
            .range([10, 50]);
	
	neighbours[0] = {
		"name":dataset[currMovie].title,
		"relation":"current",
		"timeDistance":0,
		"x":graph_LR_x/2,
		"y":graph_LR_y/2,
		"radius":p(dataset[currMovie].popularity),
		"datasetIdx":currMovie
	};	

	insertNeighbours(sameDirector, "director");
	insertNeighbours(sameActor, "actor");
	insertNeighbours(sameActress, "actress");
}

function insertNeighbours(rownums, relation)
{
	var buffer = neighbours.length;
	var neighIndex = neighbours.length;
	
	// size <10 is hard to click on
	p = d3.scale.linear()
            .domain([0,100])
            .range([10, 50]);
	
	for(var i = 0 ; i < rownums.length ; i++)
	{
		var exists = -1;
		for(var j = 1 ; j < neighbours.length ; j++)
		{
			if( neighbours[j].name === dataset[rownums[i]].title )
			{
				exists = j;
			}
		}

		if(exists != -1)
		{
			neighbours[exists].relation.push(relation);
		}
		else
		{
			neighbours[neighIndex] = {
				"name":dataset[rownums[i]].title,
				"relation":[relation],
				"timeDistance":dataset[rownums[i]].year - dataset[currMovie].year,
				"x":0,
				"y":0,
				"radius":p(dataset[rownums[i]].popularity),
				"datasetIdx":rownums[i]
			};
			neighIndex++;
		}
	}
}

function neighboursToNodes(neighbours)
{	
	var neighboursNodes = [];
	var allYears = neighbours.map(function(neighbours) {return neighbours.timeDistance;});
	xMinus = d3.scale.linear()
            .domain([d3.min(allYears),0])
            .range([graph_UL_x, graph_LR_x/2]);
	xPlus = d3.scale.linear()
            .domain([0,d3.max(allYears)])
            .range([graph_LR_x/2, graph_LR_x]);
			
	y = d3.scale.linear()
            .domain([0,1])
            .range([graph_UL_y, graph_LR_y]);
	
	for(var i = 1 ; i < neighbours.length ; i++)
	{
		if(neighbours[i].timeDistance < 0)
		{	
			neighbours[i].x = xMinus(neighbours[i].timeDistance);
		}
		else
		{
			neighbours[i].x = xPlus(neighbours[i].timeDistance);
		}
		neighbours[i].y = y(Math.random());

		collisionTolerance = 0.1;
		
		// checks collisions
		for(var j = 0 ; j < i ; j++)
		{
			var dist = distance(neighbours[i], neighbours[j]);
			
			// random number, either -1 or 1
			var mult = Math.round(Math.random())%2 * 2 - 1;
			
			while(dist < -collisionTolerance)
			{
				var tempNeighbour = {
					"name":"temp",
					"relation":"temp",
					"timeDistance":0,
					"x":neighbours[i].x,
					"y":neighbours[i].y + mult * (dist-1),
					"radius":neighbours[i].radius,
					"datasetIdx":0
				};
				
				if(dist < distance(neighbours[i], tempNeighbour))
				{
					mult *= -1;
				}
				
				// -1 helps when distance is very small
				neighbours[i].y += mult * (dist-1);
				
				dist = distance(neighbours[i], neighbours[j]);
			}
		}
	}
}

function distance(c1, c2)
{
	var dist = Math.sqrt( Math.pow(c1.x - c2.x, 2) + Math.pow(c1.y - c2.y, 2) );
	return dist - (c1.radius + c2.radius);
}

svg.append("text")
         .attr("x", 0)
         .attr("y", w - 50)
         .text("Current movie:")
         .attr("font-family", "sans-serif")
         .attr("font-size", "20px")
         .attr("fill", "blue");

