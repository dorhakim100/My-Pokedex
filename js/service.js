'use strict'

let gPokemonsUrl = `https://pokeapi.co/api/v2/pokemon`
const gPokemonUrlAll = `https://pokeapi.co/api/v2/pokemon?offset=0&limit=1302`

let gPokemonData
let gAllPokemonData
// let gPokemonData = loadFromStorage('pokemonData')
let gCurrPokemons

let gPagesCount

getPokemons(gPokemonsUrl)

// console.log(getPokemons())

// localStorage.clear('pokemonData')
// console.log(gPokemonData)

function getPokemons(url) {
  // if (loadFromStorage('pokemonData')) {
  //   gPokemonData = loadFromStorage('pokemonData')
  //   gCurrPokemons = loadFromStorage('currPokemons')
  //   return gPokemonData
  // }
  return axios
    .get(url)
    .then((res) => {
      gPokemonData = res.data
      // console.log(gPokemonData)
      saveToStorage('pokemonData', gPokemonData)
      gCurrPokemons = gPokemonData.results
      saveToStorage('currPokemons', gCurrPokemons)
      // console.log(gPokemonData)
      // pokemonsToPokemon()
      // renderAll()
      pokemonsToPokemon()
    })
    .catch((err) => {
      console.log(err)
      throw 'Sonething went wrong.. try agin later'
    })
    .finally(() => console.log('Finally...'))
}

// console.log(getPokemons())

// dataToPokemons(getPokemons())

// function dataToPokemons(data, page) {
//   return data.results
// }

function pokemonsToPokemon(idx) {
  console.log(gPokemonData)
  const pokemons = gPokemonData.results
  console.log(pokemons)

  for (var i = 0; i < pokemons.length; i++) {
    const currPokemon = pokemons[i]
    const currName = pokemons[i].name
    // console.log(currPokemon)
    console.log(currName)

    localStorage.clear(currName)
    console.log(loadFromStorage(currName))
    if (!loadFromStorage(currName)) {
      savePokemon(currName, currPokemon.url)
    }

    // console.log(loadFromStorage(currName))
  }
  //   return pokemons[idx].url
}

function savePokemon(pokemonName, url) {
  return axios
    .get(url)
    .then((res) => {
      const pokemonData = res.data
      console.log(res.data)
      const pokemon = {
        name: pokemonData.name,
        cries: pokemonData.cries,
        height: pokemonData.height,
        id: pokemonData.id,
        sprites: pokemonData.sprites,
        types: pokemonData.types,
        weight: pokemonData.weight,
      }
      saveToStorage(pokemonName, pokemon)
      renderAll()
    })
    .catch((err) => {
      console.log(err)
      throw 'Sonething went wrong.. try agin later'
    })
    .finally(() => console.log('Finally...'))
}

function findPokemon(pokemonName) {
  const pokemons = getPokemons().results

  const selectedPokemon = pokemons.find(
    (pokemon) => pokemon.name === pokemonName
  )
  console.log(selectedPokemon)
  return selectedPokemon
}

function countPages() {
  let pages = gPokemonData.count / 20
  console.log(Math.ceil(pages))
  // gPagesCount = Math.ceil(pages)
  return Math.ceil(pages)
}

function savePokemons(url, pageNum) {
  let pokemonData
  // if (loadFromStorage('pokemonData')) {
  //   gPokemonData = loadFromStorage('pokemonData')
  //   gCurrPokemons = loadFromStorage('currPokemons')
  //   return gPokemonData
  // }
  return axios
    .get(url)
    .then((res) => {
      pokemonData = res.data

      saveToStorage(`page${pageNum}`, pokemonData)
      console.log(pokemonData)
      // gCurrPokemons = gPokemonData.results
      // saveToStorage('currPokemons', gCurrPokemons)
    })
    .catch((err) => {
      console.log(err)
      throw 'Sonething went wrong.. try agin later'
    })
    .finally(() => console.log('Finally...'))
}

function getPokemonss(url, pageNum) {
  // localStorage.clear(`pokemonData${pageNum}`)
  if (loadFromStorage(`pokemonData${pageNum}`)) {
    gCurrPokemons = loadFromStorage(`pokemonData${pageNum}`)
    console.log(gCurrPokemons)
    gPokemonData = gCurrPokemons
    pokemonsToPokemon()
    renderAll()
    return
  }
  return axios
    .get(url)
    .then((res) => {
      gCurrPokemons = res.data
      gPokemonData = gCurrPokemons
      console.log(gPokemonData)
      saveToStorage(`pokemonData${pageNum}`, gCurrPokemons)
      pokemonsToPokemon()
      renderAll()
    })
    .catch((err) => {
      console.log(err)
      throw 'Sonething went wrong.. try agin later'
    })
    .finally(() => console.log('Finally...'))
}
