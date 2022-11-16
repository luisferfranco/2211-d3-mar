const body = d3.select("body")
const numero = d3.select("#numero")
const menos = d3.select("#menos")
const mas = d3.select("#mas")

var n = 0

const cambio = (color) => {
  body.style("background-color", color)
}

const delta = (i) => {
  n += i
  numero.html(n)

  if (n >= 5) {
    mas.classed("text-success", true)
  }
  if (n <= -5) {
    menos.classed("text-danger", true)
  }
  if (n == 0) {
    mas.classed("text-success", false)
    menos.classed("text-danger", false)
  }
}

menos.on("click", () => delta(-1))
mas.on("click", () => delta(1))
