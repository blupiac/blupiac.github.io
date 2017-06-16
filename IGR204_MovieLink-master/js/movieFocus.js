var w = 800;
var h = 800;
var x;                        
var y;
var dataset = [];
var currMovie = 10;
var neighbours = [];
var links = [];
var nodes = [];

var color = d3.scale.ordinal()
			.domain(["","Comedy", "Action", "Drama", "Adventure", "Mystery", "Western", "Music", "Horror", "War", "Crime"])
			.range(["#999", "#00CED1", "#32CD32", "#FF1493", "#FF4500", "#A020F0", "#6495ED", "#2F4F4F", "#836FFF", "#FA8072", "#CD853F"]);

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

    svg.selectAll("node")
        .data(neighbours)
        .enter()
        .append("circle")
        .attr("r", function(d) { return d.radius })
        .attr("cx", function(d) { return d.x })
    	.attr("cy", function(d) { return d.y })
    	.attr("fill", function(d) { return color(dataset[d.datasetIdx].year)} )
		.style("stroke", function(d) { return color_stroke(dataset[d.datasetIdx].awards);})
		.on("mouseover", function(d) {
		  d3.select(this).style("opacity", 0.5);
		  svg.select("text#description")
		  	.text("Title: " + d.name + 
					" | Year: " + dataset[d.datasetIdx].year + 
					" | Director: " + dataset[d.datasetIdx].director + 
					" | Length: " + dataset[d.datasetIdx].length + "min" + 
					" | Actor: " + dataset[d.datasetIdx].actor + 
					" | Actress: " + dataset[d.datasetIdx].actress)
		})                  
		.on("mouseout", function(d) {
		  d3.select(this).style("fill", function(d) { return color(dataset[d.datasetIdx].year)});
		  svg.select("text#description")
		  	.text("Pass mouse over a movie for info, click to see its own graph")
		})
		.on("click", function(d) {
		  currMovie = d.datasetIdx;
		  loadData();
		})
		
	svg.append("line")
		.attr("x1", w-120)
		.attr("y1", 100)
		.attr("x2", w-10)
		.attr("y2", 100)
		.attr("style", "stroke:#FFC0CB;stroke-width: 5;fill: none;")

	svg.append("text")
         .attr("x", w-120)
         .attr("y", 120)
         .text("Same actress")
         .attr("font-family", "sans-serif")
         .attr("font-size", "16px")
         .attr("fill", "black");

	svg.append("line")
		.attr("x1", w-120)
		.attr("y1", 140)
		.attr("x2", w-10)
		.attr("y2", 140)
		.attr("style", "stroke:#FF0000;stroke-width: 5;fill: none;")

	svg.append("text")
         .attr("x", w-120)
         .attr("y", 160)
         .text("Same actor")
         .attr("font-family", "sans-serif")
         .attr("font-size", "16px")
         .attr("fill", "black");

	svg.append("line")
		.attr("x1", w-120)
		.attr("y1", 180)
		.attr("x2", w-10)
		.attr("y2", 180)
		.attr("style", "stroke:#0000FF;stroke-width: 5;fill: none;")

	svg.append("text")
         .attr("x", w-120)
         .attr("y", 200)
         .text("Same director")
         .attr("font-family", "sans-serif")
         .attr("font-size", "16px")
         .attr("fill", "black");

	svg.append("line")
		.attr("x1", w-120)
		.attr("y1", 220)
		.attr("x2", w-10)
		.attr("y2", 220)
		.attr("style", "stroke:#0000FF;stroke-width: 5;fill: none;")

	svg.append("line")
		.attr("x1", w-120)
		.attr("y1", 220)
		.attr("x2", w-10)
		.attr("y2", 220)
		.attr("style", "stroke:#FF0000;stroke-width: 5;stroke-dasharray: 5,5")

	svg.append("text")
         .attr("x", w-120)
         .attr("y", 240)
         .text("Same of both")
         .attr("font-family", "sans-serif")
         .attr("font-size", "16px")
         .attr("fill", "black");

	svg.append("text")
         .attr("x", w-120)
         .attr("y", 255)
         .text("colors")
         .attr("font-family", "sans-serif")
         .attr("font-size", "16px")
         .attr("fill", "black");

	svg.append("line")
		.attr("x1", w-120)
		.attr("y1", 270)
		.attr("x2", w-10)
		.attr("y2", 270)
		.attr("style", "stroke:#FFD700;stroke-width: 10;fill: none;")

	svg.append("text")
         .attr("x", w-120)
         .attr("y", 290)
         .text("Same actor,")
         .attr("font-family", "sans-serif")
         .attr("font-size", "16px")
         .attr("fill", "black");

	svg.append("text")
         .attr("x", w-120)
         .attr("y", 305)
         .text("director &")
         .attr("font-family", "sans-serif")
         .attr("font-size", "16px")
         .attr("fill", "black");

	svg.append("text")
         .attr("x", w-120)
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
	
	svg.append("line").attr("x1", w/2)
						.attr("y1", h-100)
						.attr("x2", 50)
						.attr("y2", h-100)
						.attr("stroke-width", 2)
						.attr("stroke", "black")
						.attr("marker-end", "url(#triangle)");
						
	svg.append("line").attr("x1", w/2)
						.attr("y1", h-100)
						.attr("x2", w-50)
						.attr("y2", h-100)
						.attr("stroke-width", 2)
						.attr("stroke", "black")
						.attr("marker-end", "url(#triangle)");
	
	svg.append("text")
         .attr("x", w/2 - 16)
         .attr("y", h-80)
         .text(function(d) { return dataset[currMovie].year })
         .attr("font-family", "sans-serif")
         .attr("font-size", "16px")
         .attr("fill", "black");

	svg.append("text")
         .attr("x", 50)
         .attr("y", h-80)
         .text(function(d) 
				{ 
					var allYears = neighbours.map(function(neighbours) {return neighbours.timeDistance;})
					return dataset[currMovie].year + d3.min(allYears);
				})
         .attr("font-family", "sans-serif")
         .attr("font-size", "16px")
         .attr("fill", "black");

	svg.append("text")
         .attr("x", w-90)
         .attr("y", h-80)
         .text(function(d) 
				{ 
					var allYears = neighbours.map(function(neighbours) {return neighbours.timeDistance;})
					return dataset[currMovie].year + d3.max(allYears);
				})
         .attr("font-family", "sans-serif")
         .attr("font-size", "16px")
         .attr("fill", "black");
	
	svg.append("text")
		 .attr("id", "description")
         .attr("x", 0)
         .attr("y", h-25)
         .text("Pass mouse over a movie for info, click to see its own graph")
         .attr("font-family", "sans-serif")
         .attr("font-size", "16px")
         .attr("fill", "black");

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
		"x":w/2,
		"y":h/2,
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
            .range([100, w/2]);
	xPlus = d3.scale.linear()
            .domain([0,d3.max(allYears)])
            .range([w/2, w-150]);
			
	y = d3.scale.linear()
            .domain([0,1])
            .range([100, h-150]);
	
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

