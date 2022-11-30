const boton = d3.select("#boton")
const tabla = d3.select("#tabla")

const render = async () => {
  const data = await d3.json("https://randomuser.me/api?results=10")
  console.log(data.results)

  let registros = tabla.selectAll("tr").data(data.results)
  registros
    .enter()
    .append("tr")
    .html(
      (d) => `
    <td>
      <img
        src="${d.picture.medium}"
        class="rounded-circle"
        width="75px"
        height="75px"
      />
    </td>
    <td>
      <h3>${d.name.title + " " + d.name.first + " " + d.name.last}</h3>
      <div class="text-muted fs-6">${d.email}</div>
      <div>${d.location.street.number + " " + d.location.street.name}</div>
    </td>
`
    )
}

boton.on("click", () => render())
