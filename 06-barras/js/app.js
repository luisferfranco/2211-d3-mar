const graf = d3.select("#graf")

const margins = { left: 75, top: 40, right: 75, bottom: 50 }
const anchoTotal = +graf.style("width").slice(0, -2)
const altoTotal = (anchoTotal * 9) / 16
const ancho = anchoTotal - margins.left - margins.right
const alto = altoTotal - margins.top - margins.bottom

const svg = graf
  .append("svg")
  .attr("width", anchoTotal)
  .attr("height", altoTotal)
  .attr("class", "fig")

const fondo = svg
  .append("g")
  .attr("transform", `translate(${margins.left}, ${margins.top})`)

fondo
  .append("rect")
  .attr("x", "0")
  .attr("y", "0")
  .attr("width", ancho)
  .attr("height", alto)
  .attr("class", "grupo")

const g = svg
  .append("g")
  .attr("transform", `translate(${margins.left}, ${margins.top})`)

const gVentas = svg
  .append("g")
  .attr("transform", `translate(${margins.left}, ${margins.top})`)

const gCostos = svg
  .append("g")
  .attr("transform", `translate(${margins.left}, ${margins.top})`)

// Data
let data = [
  { tienda: "Cd. Mexico", ventas: 10500, costo: 8500, visitas: 480 },
  { tienda: "Guadalajara", ventas: 9500, costo: 6000, visitas: 500 },
  { tienda: "Monterrey", ventas: 8000, costo: 6750, visitas: 750 },
  { tienda: "Puebla", ventas: 9650, costo: 5740, visitas: 450 },
  { tienda: "Cd. Mexico II", ventas: 2000, costo: 9000, visitas: 520 },
]

// Escaladores
const y = d3
  .scaleLinear()
  .domain([0, d3.max(data, (d) => d.ventas)])
  .range([alto, 0])

const y2 = d3
  .scaleLinear()
  .domain([0, d3.max(data, (d) => d.costo)])
  .range([alto, 0])

const x = d3
  .scaleBand()
  .domain(d3.map(data, (d) => d.tienda))
  .range([0, ancho])
  .paddingInner(0.2)
  .paddingOuter(0.1)

// Ejes
const xAxis = d3.axisBottom(x)
const xAxisGroup = g
  .append("g")
  .attr("class", "ejes")
  .attr("transform", `translate(0, ${alto})`)
  .call(xAxis)

const yAxis = d3.axisLeft(y)
const yAxisGroup = g.append("g").attr("class", "ejes").call(yAxis)

const yAxis2 = d3.axisRight(y2)
const yAxisGroup2 = g
  .append("g")
  .attr("class", "ejes")
  .attr("transform", `translate(${ancho}, 0)`)
  .call(yAxis2)

// Función Render
const render = () => {
  const rectVentas = gVentas
    .selectAll("rect")
    .data(data)
    .join(
      (enter) =>
        enter
          .append("rect")
          .attr("x", (d) => x(d.tienda))
          .attr("y", y(0))
          .attr("width", x.bandwidth() / 2)
          .attr("height", 0)
          .attr("fill", "green")
          .transition()
          .duration(2000)
          .attr("fill", "orange")
          .attr("y", (d) => y(d.ventas))
          .attr("height", (d) => alto - y(d.ventas)),
      (update) => update.attr("fill", "red"),
      (exit) => exit
    )
  const rectCostos = gCostos
    .selectAll("rect")
    .data(data)
    .join(
      (enter) =>
        enter
          .append("rect")
          .attr("x", (d) => x(d.tienda) + x.bandwidth() / 2)
          .attr("y", y(0))
          .attr("width", x.bandwidth() / 2)
          .attr("height", 0)
          .attr("fill", "green")
          .transition()
          .duration(2000)
          .attr("fill", "blue")
          .attr("y", (d) => y2(d.costo))
          .attr("height", (d) => alto - y2(d.costo)),
      (update) => update.attr("fill", "red"),
      (exit) => exit
    )
}

render()
