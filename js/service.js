'use strict'

let gPokemonsUrl = `https://pokeapi.co/api/v2/pokemon`
const gPokemonUrlAll = `https://pokeapi.co/api/v2/pokemon?offset=0&limit=1302`

let gPokemonData
let gAllPokemonData

let gCurrPokemons

let gPagesCount

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
      console.log(err)
      throw 'Sonething went wrong.. try agin later'
    })
    .finally(() => console.log('Finally...'))
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
      // renderAll()
    })
    .catch((err) => {
      console.log(err)
      throw 'Sonething went wrong.. try agin later'
    })
    .finally(() => console.log('Finally...'))
}

function countPages() {
  let pages = gPokemonData.count / 20
  console.log(Math.ceil(pages))

  return Math.ceil(pages)
}

// function getPokemonss(url, pageNum) {
//   if (loadFromStorage(`pokemonData${pageNum}`)) {
//     gCurrPokemons = loadFromStorage(`pokemonData${pageNum}`)
//     console.log(gCurrPokemons)
//     gPokemonData = gCurrPokemons
//     pokemonsToPokemon()
//     renderAll()
//     return
//   }
//   return axios
//     .get(url)
//     .then((res) => {
//       gCurrPokemons = res.data
//       gPokemonData = gCurrPokemons
//       console.log(gPokemonData)
//       saveToStorage(`pokemonData${pageNum}`, gCurrPokemons)
//       pokemonsToPokemon()
//       renderAll()
//     })
//     .catch((err) => {
//       console.log(err)
//       throw 'Sonething went wrong.. try agin later'
//     })
//     .finally(() => console.log('Finally...'))
// }
