var w = 1200;
var h = 600;
var x;                        
var y;
var dataset = [];
var currMovie = 10;
var neighbours = [];
var links = [];
var nodes = [];

/*
var neighboursName = [];
var neighboursRelation = [];
var neighboursTimeDistance = [];
*/

// https://stackoverflow.com/questions/28102089/simple-graph-of-nodes-and-links-without-using-force-layout


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
    	.attr("fill", subjectColor)
		.on("mouseover", function(d) {
		  d3.select(this).style("fill", "green");
		  svg.selectAll("text")
		  	.text("Title: " + d.name + 
					" | Year: " + dataset[d.datasetIdx].year + 
					" | Director: " + dataset[d.datasetIdx].director + 
					" | Length: " + dataset[d.datasetIdx].length + "min" + 
					" | Actor: " + dataset[d.datasetIdx].actor + 
					" | Actress: " + dataset[d.datasetIdx].actress)
		})                  
		.on("mouseout", function(d) {
		  d3.select(this).style("fill", subjectColor);
		  svg.selectAll("text")
		  	.text("Pass mouse over a movie for info, click to see its own graph")
		})
		.on("click", function(d) {
		  currMovie = d.datasetIdx;
		  loadData();
		})
		
	svg.append("text")
         .attr("x", 0)
         .attr("y", h-25)
         .text("Pass mouse over a movie for info, click to see its own graph")
         .attr("font-family", "sans-serif")
         .attr("font-size", "16px")
         .attr("fill", "black");
}

function subjectColor(d)
{
	switch(dataset[d.datasetIdx].subject.toLowerCase()) {
		case "comedy":
			return "pink";
		case "action":
			return "red";
		default:
			return "blue";
	}
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
	var current = [currMovie];
	var sameDirector = getSameDirector();
	var sameActor = getSameActor();
	var sameActress = getSameActress();	

	neighbours[0] = {
		"name":dataset[currMovie].title,
		"relation":"current",
		"timeDistance":0,
		"x":w/2,
		"y":h/2,
		"radius":dataset[currMovie].popularity,
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
				"radius":dataset[rownums[i]].popularity,
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
	x = d3.scale.linear()
            .domain(d3.extent(allYears))
            .range([100, w-100]);
			
	y = d3.scale.linear()
            .domain([0,1])
            .range([100, h-150]);
	
	for(var i = 1 ; i < neighbours.length ; i++)
	{
		neighbours[i].x = x(neighbours[i].timeDistance);
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