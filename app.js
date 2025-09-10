const container = document.getElementById("personajes-container");
const crewFilter = document.getElementById("crewFilter");
const nameSearch = document.getElementById("namesearch");
const bountyFilter = document.getElementById("bountyfilter");
const nextPageButton = document.getElementById("nextPage");
const prevPageButton = document.getElementById("prevPage");

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
  let currentpage = 1;
  const itemsPerPage = 12;

  function renderPage(page) {

    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageItems = personajes.slice(start, end);

    renderPersonajes(pageItems);
}

function changePage(direction) {
  const totalPages = Math.ceil(personajes.length / itemsPerPage);
  if (direction === "nextPage" && (currentpage * itemsPerPage) < personajes.length) {
    currentpage++;
  } else if (direction === "prevPage" && currentpage > 1) {
    currentpage--;
  }
  renderPage(currentpage);
}
fetch("https://api.api-onepiece.com/v2/characters/en")
  .then((response) => response.json())
  .then((data) => {
    personajes = data;

    const crews = personajes.map(p => p.crew?.roman_name).filter(Boolean);
    const uniqueCrews = [...new Set(crews)].sort();
    //console.log("Tripulaciones únicas:", uniqueCrews);
    uniqueCrews.forEach(crew => {
      const option = document.createElement("option");
      option.value = crew;
      option.textContent = crew;
      crewFilter.appendChild(option);
    });
    renderPersonajes(personajes);
    renderPage(currentpage);
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

nameSearch.addEventListener("input", () => {  
  const searchTerm = nameSearch.value.toLowerCase();
  const filtered = personajes.filter((p) =>
    p.name.toLowerCase().includes(searchTerm)
  );
  renderPersonajes(filtered);
});
bountyFilter.addEventListener("change", () => {
  function getBountyValue(personaje) {
    return parseInt(personaje.bounty?.replace(/\D/g, "")) || 0;
  }
  const minBounty = parseInt(bountyFilter.value);

  if (isNaN(minBounty)) {
    renderPersonajes(personajes);
  } else {
    const filtered = personajes
    .filter((p) => getBountyValue(p) >= minBounty)
    .sort((a, b) => getBountyValue(b) - getBountyValue(a));
    renderPersonajes(filtered);
  }
});

nextPageButton.addEventListener("click", () => changePage("nextPage"));
prevPageButton.addEventListener("click", () => changePage("prevPage"));



