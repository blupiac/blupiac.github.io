var w = 800 //max size of the bubbles
var h = 800 //max size of the bubbles
var dataset = []
var bubbles
var clusters
var clusterBubbles = []
var selection = ["1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1"]

var color_stroke = d3.scale.ordinal()
    .domain(["", "No", "Yes"])
    .range(["none", "#666", "yellow"]);

var color = d3.scale.ordinal()
    .domain(["", "Comedy", "Action", "Romance", "Drama", "Adventure", "Mystery", "Western", "Music", "Horror", "War", "Crime", "Science Fiction", "Short", "Westerns", "Fantasy"])
    .range(["#999", "#00CED1", "#32CD32", "#FF00FF", "#FF1493", "#FF4500", "#A020F0", "#6495ED", "#f1c40f", "#836FFF", "#FA8072", "#CD853F", "#c39e0d", "#2F4F4F", "#f39c12", "#d7dbdd"]);

var indice = d3.scale.ordinal()
    .domain(["", "Comedy", "Action", "Romance", "Drama", "Adventure", "Mystery", "Western", "Music", "Horror", "War", "Crime", "Science fiction", "Short", "War", "Westerns", "Fantasy"])
    .range(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16"]);

var m = 11
var bubble = d3.layout.pack()
    .sort(null)
    .size([w, h])
    .padding(2);


var svg = d3.select("body")
    .append("svg")
    .attr("width", w)
    .attr("height", h)
    .attr("class", "bubble")

    // zoom part based on : https://coderwall.com/p/psogia/simplest-way-to-add-zoom-pan-on-d3-js
    .call(d3.behavior.zoom().scaleExtent([0.5, 10]).on("zoom", function() {
        svg.attr("transform", "translate(" + d3.event.translate + ")" + " scale(" + d3.event.scale + ")")
    }))
    .append("g")


p = d3.scale.linear()
    .domain([0, 100])
    .range([1.5, 75]);


d3.tsv("data/film.tsv")
    .row(function(d, i) {
        return {
            year: +d["Year"],
            length: +d["Length"],
            title: d["Title"],
            sub: d["Subject"],
            actor: d["Actor"],
            actress: d["Actress"],
            director: d["Director"],
            value: +d["Popularity"],
            awards: d["Awards"],
            cluster: 1,
            id: i
        };

    })
    .get(function(error, rows) {
        dataset = rows;
        defineClusters();
    })

function checkHref()
{
	var currHref = window.location.href;

	if(currHref.indexOf("index.html") === -1)
	{
		if(currHref.charAt(currHref.length - 1) === "/")
		{
			window.location.href += "index.html";
		}
		else
		{
			window.location.href += "/index.html";
		}
	}
}

// bubbles chart base on: https://jrue.github.io/coding/2014/exercises/basicbubblepackchart/
function drawBubbles(clustersInd) {

    for (var i = 0; i < clustersInd.length; i++) {
        add(clusterBubbles, clusters[clustersInd[i]].values, clustersInd[i]);
    }

    var nodes = bubble.nodes({
        children: clusterBubbles
    }).filter(function(d) {
        return !d.children;
    });

    // tooltips based on: http://bl.ocks.org/d3noob/a22c42db65eb00d4e369
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
        .attr("r", function(d) {
            return (d.r);
        })
        .attr("cx", function(d) {
            return (d.x);
        })
        .attr("cy", function(d) {
            return d.y;
        })
        .style("fill", function(d) {
            return color(d.sub);
        })
        .attr("stroke-width", 1.2)
        .attr("stroke-opacity", 0.9)
        .style("stroke", function(d) {
            return color_stroke(d.awards);
        })

        .on("mouseover", function(d) {
            d3.select(this).style("fill", "green");

            div.transition()
                .duration(200)
                .style("opacity", .9)

            div.html("<h1><b>" + (d.title) + ", " + d.year + "</b></h1><i>" + d.sub +
                    "</i>, <small>"+d.length+" min</small><br/>" + d.director + "<br/>" + d.actress +
                    "<br/>" + d.actor + "<br/><h1>" + d.value + " / 100</h1>")
                .style("left", (d3.event.pageX + 5) + "px")
                .style("top", (d3.event.pageY - 28) + "px")

        })
        .on("mouseout", function(d) {
            d3.select(this).style("fill", function(d) {
                return color(d.sub);
            });
            div.transition()
                .duration(500)
                .style("opacity", 0);
        }).on("click", function(d) {
            location.hash = d.id;
        });
}

function defineClusters(d) {

    clusters = d3.nest()
        .key(function(d) {
            return d.sub;
        }).sortKeys(d3.ascending)
        .entries(dataset);


    var clustersInd = [];

    for (var i = 1; i < 17; i++) {
        if (selection[i] == 1) {
            clustersInd.push(i);
        }
    }
    drawBubbles(clustersInd);
}

function updateData(i) {
    var index = i;
    diameter = 500 //max size of the bubbles
    w = 1000 //max size of the bubbles
    h = 800 //max size of the bubbles
    clusterPadding = 6 // separation between different-color nodes
    dataset = []
    bubbles
    clusters
    clusterBubbles = []



    if (selection[index] == 1) {
        selection[index] = 0;
    } else {
        selection[index] = 1;
    }


    var rectange = svg.append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", w)
        .attr("height", h)
        .attr("fill", "white");


    p = d3.scale.linear()
        .domain([0, 100])
        .range([1.5, 75]);


    d3.tsv("data/film.tsv")
        .row(function(d, i) {
            return {
                year: +d["Year"],
                length: +d["Length"],
                title: d["Title"],
                sub: d["Subject"],
                actor: d["Actor"],
                actress: d["Actress"],
                director: d["Director"],
                value: +d["Popularity"],
                awards: d["Awards"],
                cluster: 1,
                id: i
            };
        })
        .get(function(error, rows) {
            dataset = rows;
            defineClusters();

        })
}


function loadFocus() {
    window.location.href = window.location.href.replace("index", "focus");
}

function add(clusterBubbles, obj, cle) {
    for (var i = 0; i < obj.length; i++) {
        obj[i].cluster = cle;
        clusterBubbles.push(obj[i]);
    }

}
