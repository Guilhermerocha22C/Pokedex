
const pokemonName = document.querySelector('.pokemon_name');
const pokemonNumber = document.querySelector('.pokemon_number'); 
const pokemonImage = document.querySelector('.pokemon_image');
const form = document.querySelector('.form');
const input = document.querySelector('.input_search');
const buttonPrev = document.querySelector('.btn-prev');
const buttonNext = document.querySelector('.btn-next');
const buttonMoreInfo = document.querySelector('.btn-more-info');
const modal = document.querySelector('#modal');
const spanClose = document.querySelector('.close');
const modalPokemonName = document.querySelector('.modal-pokemon-name');
const modalPokemonAbilities = document.querySelector('.modal-pokemon-abilities');
const modalPokemonStats = document.querySelector('.modal-pokemon-stats');

let searchPokemon = 1;

const fetchPokemon = async (pokemon) => {
    const APIResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`); 
    if(APIResponse.status === 200) {
        const data = await APIResponse.json();
        return data;
    } else {
        return null;
    }
}

const renderPokemon = async (pokemon) => {
    const data = await fetchPokemon(pokemon);
    if(data) {
        pokemonImage.style.display = 'block';
        pokemonName.innerHTML = data.name;
        pokemonNumber.innerHTML = data.id;
        pokemonImage.src = data['sprites']['versions']['generation-v']['black-white']['animated']['front_default'];
        input.value = '';
        searchPokemon = data.id;
    } else {
        pokemonImage.style.display = 'none';
        pokemonName.innerHTML = 'Não encontrado :c';
        pokemonNumber.innerHTML = '';
    }
}

const fetchPokemonAbilitiesAndStats = async (pokemon) => {
    const data = await fetchPokemon(pokemon);
    if(data) {
        modalPokemonName.innerHTML = data.name;
        modalPokemonAbilities.innerHTML = '';
        modalPokemonStats.innerHTML = '';

        for (const ability of data.abilities) {
            const abilityData = await fetchAbility(ability.ability.url);
            const translatedAbility = abilityData.names.find(name => name.language.name === 'es').name; // change to 'pt-br' when available

            const listItem = document.createElement('li');
            listItem.textContent = translatedAbility;
            modalPokemonAbilities.appendChild(listItem);
        }

        const stats = data.stats.map(stat => `${stat.stat.name}: ${stat.base_stat}`).join(', ');
        modalPokemonStats.innerHTML = stats;
    }
}

const fetchAbility = async (url) => {
    const APIResponse = await fetch(url);
    if (APIResponse.status === 200) {
        const data = await APIResponse.json();
        return data;
    } else {
        return null;
    }
}

form.addEventListener('submit', (event) => {
    event.preventDefault();
    renderPokemon(input.value.toLowerCase());
});

buttonPrev.addEventListener('click', () => {
    if (searchPokemon > 1) {
        searchPokemon -= 1;
        renderPokemon(searchPokemon);
    }
});

buttonNext.addEventListener('click', () => {
    searchPokemon += 1;
    renderPokemon(searchPokemon);
});

buttonMoreInfo.addEventListener('click', () => {
    fetchPokemonAbilitiesAndStats(searchPokemon);
    modal.style.display = 'flex';
});

spanClose.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

renderPokemon(searchPokemon);


