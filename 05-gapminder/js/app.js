const graf = d3.select("#graf")
const tooltip = d3.select("#tooltip")
const country = d3.select("#country")
const population = d3.select("#population")
const btnAnimando = d3.select("#btnAnimando")

const margins = { left: 75, top: 40, right: 10, bottom: 50 }
const anchoTotal = +graf.style("width").slice(0, -2)
const altoTotal = (anchoTotal * 9) / 16
const ancho = anchoTotal - margins.left - margins.right
const alto = altoTotal - margins.top - margins.bottom

const svg = graf
  .append("svg")
  .attr("width", anchoTotal)
  .attr("height", altoTotal)
  .attr("class", "fig")

const g = svg
  .append("g")
  .attr("transform", `translate(${margins.left}, ${margins.top})`)

const clip = g
  .append("clipPath")
  .attr("id", "clip")
  .append("rect")
  .attr("width", ancho)
  .attr("height", alto)

const yearLabel = g
  .append("text")
  .attr("x", ancho / 2)
  .attr("y", alto / 2)
  .attr("class", "year")

g.append("rect")
  .attr("x", "0")
  .attr("y", "0")
  .attr("width", ancho)
  .attr("height", alto)
  .attr("class", "grupo")

const x = d3.scaleLog().range([0, ancho])
const y = d3.scaleLinear().range([alto, 0])
const A = d3.scaleLinear().range([5, 70600])
const continente = d3.scaleOrdinal().range(d3.schemeSet2)

const xAxis = d3.axisBottom(x).tickSize(-alto)
const yAxis = d3.axisLeft(y).tickSize(-ancho)

let iy, maxy, miny
let animando = false
let intervalo
let showT = undefined

const load = async () => {
  data = await d3.csv("data/gapminder.csv", d3.autoType)
  data = d3.filter(data, (d) => d.income !== null)

  x.domain(d3.extent(data, (d) => d.income))
  y.domain(d3.extent(data, (d) => d.life_exp))
  A.domain(d3.extent(data, (d) => d.population))
  continente.domain(Array.from(new Set(data.map((d) => d.continent))))

  miny = d3.min(data, (d) => d.year)
  maxy = d3.max(data, (d) => d.year)
  iy = miny

  g.append("g")
    .attr("transform", `translate(0, ${alto})`)
    .attr("class", "ejes")
    .call(xAxis)
  g.append("g").attr("class", "ejes").call(yAxis)

  g.append("text")
    .attr("x", ancho / 2)
    .attr("y", alto + 40)
    .attr("text-anchor", "middle")
    .attr("class", "labels")
    .text("Ingreso per cápita (USD)")

  g.append("g")
    .attr("transform", `translate(0, ${alto / 2})`)
    .append("text")
    .attr("y", -35)
    .attr("transform", "rotate(-90)")
    .attr("text-anchor", "middle")
    .attr("class", "labels")
    .text("Expectativa de Vida (años)")

  render(data)
}

const render = (data) => {
  let newData = d3.filter(data, (d) => d.year == iy)
  console.log(newData)

  // Join-Enter-Update-Exit

  const circle = g.selectAll("circle").data(newData, (d) => d.country)

  circle
    .enter()
    .append("circle")
    .attr("cx", (d) => x(d.income))
    .attr("cy", (d) => y(d.life_exp))
    .attr("r", 0)
    .attr("fill", "#00ff0088")
    .attr("clip-path", "url(#clip)")
    .attr("stroke", "#00000088")
    .on("click", (e, d) => showTooltip(d))
    // .on("mouseout", (e, d) => hideTooltip())
    .merge(circle)
    .transition()
    .duration(200)
    .attr("cx", (d) => x(d.income))
    .attr("cy", (d) => y(d.life_exp))
    .attr("r", (d) => Math.sqrt(A(d.population) / Math.PI))
    .attr("fill", (d) => continente(d.continent) + "88")

  circle
    .exit()
    .transition()
    .duration(200)
    .attr("r", 0)
    .attr("fill", "#ff000088")
    .remove()

  yearLabel.text(iy)
}

const delta = (d) => {
  iy += d
  if (iy > maxy) iy = maxy
  if (iy < miny) iy = miny

  datum = data.filter((d) => d.country == showT && d.year == iy)[0]
  tooltip
    .style(
      "left",
      x(datum.income) - Math.sqrt(A(datum.population) / Math.PI) + "px"
    )
    .style(
      "top",
      y(datum.life_exp) - Math.sqrt(A(datum.population) / Math.PI) + "px"
    )
  country.text(datum.country)
  population.text(datum.population.toLocaleString("en-US"))

  render(data)
}

const showTooltip = (d) => {
  tooltip.style("display", "block")
  tooltip
    .style("left", x(d.income) - Math.sqrt(A(d.population) / Math.PI) + "px")
    .style("top", y(d.life_exp) - Math.sqrt(A(d.population) / Math.PI) + "px")
  country.text(d.country)
  population.text(d.population.toLocaleString("en-US"))
  showT = d.country
}

const hideTooltip = () => {
  tooltip.style("display", "none")
}

// let intervalo

const toggleAnimando = () => {
  animando = !animando
  if (animando) {
    btnAnimando.classed("btn-success", false)
    btnAnimando.classed("btn-danger", true)
    btnAnimando.html("<i class='fas fa-stop fa-3x'></i>")

    intervalo = setInterval(() => {
      delta(1)
    }, 200)
  } else {
    btnAnimando.classed("btn-success", true)
    btnAnimando.classed("btn-danger", false)
    btnAnimando.html("<i class='fas fa-play fa-3x'></i>")
    clearInterval(intervalo)
  }
}

load()
