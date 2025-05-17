const searchInput = document.getElementById("searching");

searchInput.addEventListener("input", function (e) {
  const input = e.target.value;
  if(input.length >= 1){
    debouncedPokemonSearch(input)
  }
  console.log(input);
})

const results = document.getElementById("results");
const dialog = document.getElementById("popup-dialog");
const pokemonTitle = document.getElementById("pokemon-title");
const dialogContent = document.getElementById("dialog-content");
const closeDialogButton = document.getElementById("close-dialog");

function debounce(func, wait) {
  let timeout;

  return function (...args) {
    const context = this;

    clearTimeout(timeout);

    timeout = setTimeout(() => {
      func.apply(context, args);
    }, wait);
  };
}

function openPokemonDialog(pokemonApiUrl) {
  dialog.showModal();

  fetch(pokemonApiUrl).then(resp => resp.json()).then(data => {
    pokemonTitle.innerText = data.name;
    console.log(data);

    const spriteUrl = data.sprites.other["official-artwork"].front_default; //Had to do some research on how to get a picture for each mon.

    dialogContent.innerHTML = `
      <img src="${spriteUrl}" alt="${data.name}" style="width: 150px; height: auto;">
      <p><strong>Height:</strong> ${data.height}</p>
      <p><strong>Weight:</strong> ${data.weight}</p>
      <p><strong>Base Experience:</strong> ${data.base_experience}</p>
      `;

  }).catch(err => {
      dialogContent.innerHTML = 'Uh oh, the Pokédex could not load.';
      displayError();
      console.log(err);
  });  
    
}

dialog.addEventListener('click', (event) => {
  if (event.target === dialog) {
    dialog.close();
  }
});


dialog.addEventListener("close", () => {
  pokemonTitle.innerText = "";
  dialogContent.innerHTML = "Loading...";
})

closeDialogButton.addEventListener('click', () => {
  dialog.close();
});



function displayPokemon(pokemon){
  if(!pokemon || pokemon.length === 0) {
    displayError();
    return;
  }
  const listOfPokemonNames = pokemon.map(pokemon => {
    return `<li><a data-url="${pokemon.url}">${pokemon.name}</a></li>`; 
    }).join(""); 
    results.innerHTML = `<ul class = "pokemon">${listOfPokemonNames}</ul>`;
  
    const links = document.querySelectorAll('.pokemon a');
    links.forEach(link => {
      link.addEventListener('click', () => {
        const pokemonUrl = link.getAttribute('data-url');
        openPokemonDialog(pokemonUrl);
      });
    });
}

function displayError() {
  results.innerHTML = "<ul class='pokemon'><li>You have not found this Pokémon yet.</li></ul>"
}

  async function searchForPokemon(query) {
    const pokemonData = await fetch(`https://pokeapi.co/api/v2/pokemon/?search=${query}`).then(resp => resp.json());

    console.log(pokemonData);
      if (pokemonData.count >= 1) {
        displayPokemon(pokemonData.results)
      } else {
        displayError()
      }
  
  }
  
  const debouncedPokemonSearch = debounce(searchForPokemon, 500)

  document.addEventListener("DOMContentLoaded", function () {
    fetch(`https://pokeapi.co/api/v2/pokemon/`).then(resp => resp.json()).then(data => {
        if (data.count >= 1) {
          displayPokemon(data.results)
        } else {
          displayError();
        }
      console.log(data)
      displayPokemon(data.results);
    }).catch((err) => {
        console.error(err);
        displayError();
    });
  });
