const graf = d3.select("#graf")

const anchoTotal = +graf.style("width").slice(0, -2)
const altoTotal = (anchoTotal * 9) / 16

const svg = graf
  .append("svg")
  .attr("width", anchoTotal)
  .attr("height", altoTotal)
  .attr("class", "fig")

var cx = anchoTotal / 2
var cy = altoTotal / 2
var r = altoTotal / 4
var c = "#003049"

const circle = svg
  .append("circle")
  .attr("cx", cx)
  .attr("cy", cy)
  .attr("r", r)
  .attr("fill", c)

const cambia = (dx, dy, dr) => {
  cx += dx
  cy += dy
  r += dr

  circle.transition().duration(1000).attr("cx", cx).attr("cy", cy).attr("r", r)
}

const cambiaColor = (color) => {
  circle.transition().duration(1000).attr("fill", color)
}
