let movieURL = "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json";

let canvas = d3.select('#canvas');
let legend = d3.select('#legend');

let movieJSON = {};

document.addEventListener('DOMContentLoaded', function() {
  fetch(movieURL)
    .then(response => response.json())
    .then(data => {
    movieJSON = data;
    showTreemapDiagram();
  });
});

function showTreemapDiagram() {
  let hierarchy = d3.hierarchy(movieJSON, (node) => {
    return node["children"];
  }).sum((node) => {
    return node["value"];
  }).sort((node1, node2) => {
    return node2["value"] - node1["value"];
  });
  
  let createTreemap = d3.treemap().size([1000, 600]);
  createTreemap(hierarchy);
  
  let movieTiles = hierarchy.leaves();
  
  let tooltip = d3.select("body")
    .append("div")
    .attr("id", "tooltip")
    .attr("class", "tooltip")
    .style("opacity", 0);
  
  let block = canvas.selectAll("g")
    .data(movieTiles)
    .enter()
    .append("g")
    .attr("transform", (d) => {
      return "translate(" + d["x0"] + ", " + d["y0"] + ")";
    });
  
  block.append("rect")
    .attr("class", "tile")
    .attr("data-name", (d) => d.data.name)
    .attr("data-category", (d) => d.data.category)
    .attr("data-value", (d) => d.data.value)
    .attr("width", (d) => d["x1"] - d["x0"] - 0.5)
    .attr("height", (d) => d["y1"] - d["y0"] - 0.5)
    .style("fill", (d) => {
    let category = d.data.category;
    if(category == "Action") {
      return "#FF7F50";
    }
    else if(category === "Adventure") {
      return "#5F9EA0";
    }
    else if(category === "Comedy") {
      return "#BDB76B";
    }
    else if(category === "Drama") {
      return "#9932CC";
    }
    else if(category === "Animation") {
      return "#808080";
    }
    else if(category === "Family") {
      return "#F08080";
    }
    else if(category === "Biography") {
      return "#90EE90";
    }
  })
    .on("mouseover", function(event, d) {
    tooltip
      .transition()
      .duration(200)
      .style("opacity", 0.9);
    tooltip
      .html(d.data.name + "</br>" + d.data.category + "</br>" + d.data.value)
      .style("left", event.pageX + 20 + "px")
      .style("top", event.pageY - 40 + "px");
    tooltip.attr("data-value", d.data.value);
  })
  .on("mouseout", function(event, d) {
    tooltip
      .transition()
      .duration(400)
      .style("opacity", 0);
  });
  
  block.append("text")
    .text((d) => d.data.name)
    .attr("x", 5)
    .attr("y", 20)
  
  console.log(movieTiles);
}