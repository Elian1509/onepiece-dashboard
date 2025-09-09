const container = document.getElementById("personajes-container");
const crewFilter = document.getElementById("crewFilter");

let personajes = [];

function renderPersonajes(lista) {
  container.innerHTML = "";

  lista.slice(0, 12).forEach((personaje) => {
    const card = `
        <div class="col-md-4 mb-4">
            <div class="card h-100">
                    <h5 class="card-title">${personaje.name}</h5>
                <div class="card-body">
                    <p class="card-text">Tripulación: ${personaje.crew?.roman_name || "Desconocida"}</p>
                    <p class="card-text">Recompensa: ${personaje.bounty}</p>
                    <p class="card-text">Fruta: ${personaje.fruit?.name || "Desconocida"}</p>
                </div>
            </div>
        </div>
        `;
    container.innerHTML += card;
  });
}
fetch("https://api.api-onepiece.com/v2/characters/en")
  .then((response) => response.json())
  .then((data) => {
    personajes = data;
    renderPersonajes(personajes);
  })
  .catch((error) => console.error("Error:", error));

crewFilter.addEventListener("change", () => {
  const selectedCrew = crewFilter.value;
  if (selectedCrew === "all") {
    renderPersonajes(personajes);
  } else {
    const filtered = personajes.filter((p) => p.crew?.roman_name === selectedCrew);
    renderPersonajes(filtered);
  }
});
