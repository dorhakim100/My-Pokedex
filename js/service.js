'use strict'

let gPokemonsUrl = `https://pokeapi.co/api/v2/pokemon`
const gPokemonUrlAll = `https://pokeapi.co/api/v2/pokemon?offset=0&limit=1302`

let gPokemonData
let gAllPokemonData

let gCurrPokemons

let gPagesCount

let gDexEntry = ''

localStorage.clear()

const gPokemons = []

function getPokemons(url) {
  return axios
    .get(url)
    .then((res) => {
      gPokemonData = res.data

      saveToStorage('pokemonData', gPokemonData)
      gCurrPokemons = gPokemonData.results
      saveToStorage('currPokemons', gCurrPokemons)
    })
    .catch((err) => {
      // console.log(err)
      throw 'Sonething went wrong.. try agin later'
    })
    .finally(() => console.log('Finally...'))
}

function savePokemon(pokemonName, url) {
  // console.log(pokemonName)
  // console.log(loadFromStorage(pokemonName))
  // if (loadFromStorage(pokemonName)) return loadFromStorage(pokemonName)
  return axios
    .get(url)
    .then((res) => {
      const pokemonData = res.data
      // console.log(res.data)
      const pokemon = {
        name: pokemonData.name,
        cries: pokemonData.cries,
        // height: pokemonData.height,
        id: pokemonData.id,
        sprites: pokemonData.sprites,
        artwork: pokemonData.sprites.other['official-artwork'],
        types: pokemonData.types,
        weight: pokemonData.weight,
        dexUrl: pokemonData.species.url,
      }
      gPokemons.push(pokemon)
      // console.log(gPokemons)
      saveToStorage(pokemonName, pokemon)
      // renderAll()
      // getText(pokemonData.species.url, pokemonData.name).then(() => {
      //   console.log(loadFromStorage(pokemonName).dex)
      // })
    })
    .catch((err) => {
      console.log(err)
      throw 'Sonething went wrong.. try agin later'
    })
    .finally(() => console.log('Finally...'))
}

// console.log(loadFromStorage('bulbasaur'))
function countPages() {
  // console.log(gPokemonData)
  let pages = gPokemonData.count / 20
  // console.log(Math.ceil(pages))

  return Math.ceil(pages)
}

function findPokemon(id) {
  const selectedPokemon = gPokemons.find((pokemon) => pokemon.id === id)
  return selectedPokemon
}

function getText(url, pokemonName) {
  const pokemonData = loadFromStorage(pokemonName)

  return axios.get(url).then((res) => {
    console.log(res.data.flavor_text_entries[0].flavor_text)

    pokemonData.dex = res.data.flavor_text_entries[0].flavor_text
    saveToStorage(pokemonName, pokemonData)
  })
}
