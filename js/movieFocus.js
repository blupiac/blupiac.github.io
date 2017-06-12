var w = 600;
var h = 600;
var x;                        
var y;
var dataset = [];
var currMovie;
var neighbours = [];
/*
var neighboursName = [];
var neighboursRelation = [];
var neighboursTimeDistance = [];
*/

// https://stackoverflow.com/questions/28102089/simple-graph-of-nodes-and-links-without-using-force-layout <- use this?


//Create SVG element
var svg = d3.select("body")
            .append("svg")
            .attr("width", w)
            .attr("height", h);
     
       

//d3.select(window).on("load", loadData);

var neighbours = [];
var currMovie;

function loadData()
{
	currMovie = dataset[10];
	fillNeighbour();
	neighboursToNodes(neighbours);
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

        x = d3.scale.linear()
                .domain(d3.extent(rows, function(row) { return neighbours.timeDistance; }))
                .range([0, w]);
           
        dataset = rows;
		loadData();
        draw();

   });


function draw() 
{
    svg.selectAll("circle")
        .data(neighbours)
        .enter()
        .append("circle")
        .attr("r", function(d) { return d.radius })
        .attr("cx", function(d) { return d.x })
    	.attr("cy", function(d) { return d.y })
    	.attr("fill", function(d) { return "blue" })
}

// 3 functions below are placeholders

function getSameDirector()
{
	var rowNums = [2, 3, 9];
	
	return rowNums;
}

function getSameActor()
{
	var rowNums = [1, 3, 9];
	
	return rowNums;
}

function getSameActress()
{
	var rowNums = [2, 7, 9];
	
	return rowNums;
}

function fillNeighbour()
{
	var sameDirector = getSameDirector();
	var sameActor = getSameActor();
	var sameActress = getSameActress();
	
	insertNeighbours(sameDirector, "director");
	insertNeighbours(sameActor, "actor");
	insertNeighbours(sameActress, "actress");
}

function insertNeighbours(rownums, relation)
{
	var buffer = neighbours.length;

	for(var i = 0 ; i < rownums.length ; i++)
	{
		neighbours[i + buffer] = {
			"name":dataset[rownums[i]].title,
			"relation":relation,
			"timeDistance":dataset[rownums[i]].year - currMovie.year,
			"x":0,
			"y":0,
			"radius":dataset[rownums[i]].popularity
		};
	}	
}

function neighboursToNodes(neighbours)
{
	var neighboursNodes = [];
	var allYears = neighbours.map(function(neighbours) {return neighbours.timeDistance;});
	x = d3.scale.linear()
            .domain(d3.extent(allYears))
            .range([0, w]);
	
	for(var i = 0 ; i < neighbours.length ; i++)
	{
		neighbours[i].x = x(neighbours[i].timeDistance);
		neighbours[i].y = h/2;

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
					"radius":neighbours[i].radius
				};
				
				if(dist < distance(neighbours[i], tempNeighbour))
				{
					mult *= -1;
				}
				
				// -1 helps when distqnce is very small
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

