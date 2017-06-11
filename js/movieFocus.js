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
        draw();

   });


function draw() 
{
    svg.selectAll("circle")
        .data(neighbours)
        .enter()
        .append("circle")
        .attr("r", function(d) { return 10 })
        .attr("cx", function(d) { return x(neighbours.timeDistance) })
    	.attr("cy", function(d) { return h/2 })
    	.attr("fill", function(d) { return "blue" })
}



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
	var buffer = neighbours.name.length();

	for(var i = 0 ; i < rownums.length() ; i++)
	{
		var diff = rownums[i].releaseDate - currMovie.releaseDate;
		
		neighbours[i + buffer] = {
			"name":dataset[rownums[i]].name,
			"relation":relation,
			"timeDistance":dataset[rownums[i]].releaseDate - currMovie.releaseDate,
			"x":0,
			"y":0,
			"radius":dataset[rownums[i]].popularity
		};
	}	
}

function neighboursToNodes(neighbours)
{
	var neighboursNodes = [];
	var allYears = objArray.map(function(neighbours) {return neighbours.year;});
	x = d3.scale.linear()
            .domain(d3.extent(allYears))
            .range([0, w]);
	
	for(var i = 0 ; i < neighbours.length() ; i++)
	{
		neighbours[i].x = x(neighbours[i].timeDistance);
		neighbours[i].y = h/2;
		
		// checks collisions
		for(var j = 0 ; j < i ; j++)
		{
			var dist = distance(neighbours[i], neighbours[j])
			
			while(dist < 0)
			{
				// random number, either -1 or 1
				var mult = Math.random()%2 * 2 - 1;
				neighbours[i].y += mult * dist;
			}
		}
		
	}	
	
}

function distance(c1, c2)
{
	var dist = sqrt( (c1.x - c2.x)^2 + (c1.y - c2.y)^2 );
	return dist - (c1.radius + c2.radius);
}

svg.append("text")
         .attr("x", 0)
         .attr("y", w - 50)
         .text("Current movie:")
         .attr("font-family", "sans-serif")
         .attr("font-size", "20px")
         .attr("fill", "blue");

