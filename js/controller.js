'use strict'

let gCurrPage = 1

function init() {
  getPokemons(gPokemonsUrl).then(() => {
    pokemonsToPokemon()
    gPagesCount = countPages()
  })
}

function renderList({ results }) {
  // console.log(results)
  const strHtml = results
    .map(
      (res) => `
        <li>
            <article style="cursor:pointer;" data-pokemon-name="${
              res.name
            }" class="article" onclick="onPokemonClick(this)">
            <div>
                <h2><span class="id"></span>${capitalizeFirstLetter(res.name)}
                </h2>
                <p class="weight">weight</p>
            </div>



            <div class="sprite-container">
            <img class="sprite" src="" alt="">
            <img class="sprite" src="" alt="" title="Shiny">

            <div class="type">

            </div>
            </div>
            </article>
        </li>`
    )
    .join('')

  document.querySelector('.pokemons ul').innerHTML = strHtml
  //   results.forEach((res) => getPokemon(res.url, renderPokemon))
}

function renderSprites() {
  // console.log(gPokemonData)
  const pokemons = gPokemonData.results
  // console.log(pokemons)
  const elPokemons = document.querySelectorAll('article')

  for (var i = 0; i < pokemons.length; i++) {
    let currElImgs = elPokemons[i].querySelectorAll('img')
    const currPokemonData = loadFromStorage(pokemons[i].name)
    // console.log(currPokemonData)
    currElImgs[0].src = currPokemonData.sprites.front_default
    currElImgs[1].src = currPokemonData.sprites.front_shiny
  }
}

function renderWeight() {
  const pokemons = gPokemonData.results

  const elPokemons = document.querySelectorAll('article')

  for (var i = 0; i < pokemons.length; i++) {
    let currElWeight = elPokemons[i].querySelector('.weight')
    const currPokemonData = loadFromStorage(pokemons[i].name)
    currElWeight.innerText = `Weight: ${currPokemonData.weight} lbs`
  }
}

function renderTypes() {
  const pokemons = gPokemonData.results

  const elPokemons = document.querySelectorAll('article')

  for (var i = 0; i < pokemons.length; i++) {
    let currElType = elPokemons[i].querySelector('.type')
    const currPokemonData = loadFromStorage(pokemons[i].name)
    if (currPokemonData.types.length > 1) {
      currElType.innerHTML = `<img class="typing" src="img/${currPokemonData.types[0].type.name}.png" alt=""><img class="typing" src="img/${currPokemonData.types[1].type.name}.png" alt="">`
    } else {
      currElType.innerHTML = `<img class="typing" src="img/${currPokemonData.types[0].type.name}.png" alt="">`
    }
  }
}

// function renderTypeImg(type) {
//   let path
//   switch (type) {
//     case 'normal':
//       path = 'img/'
//       break

//     default:
//       break
//   }
// }

function onCryPlay(elPokemon) {
  const pokemonName = elPokemon.dataset.pokemonName
  console.log(pokemonName)

  const currPokemonData = loadFromStorage(pokemonName)

  const cry = new Audio(currPokemonData.cries.latest)

  cry.play()
}

function renderIds() {
  const elSpans = document.querySelectorAll('.id')

  const elPokemons = document.querySelectorAll('.article')
  for (var i = 0; i < elPokemons.length; i++) {
    const currName = elPokemons[i].dataset

    const currPokemonData = loadFromStorage(currName.pokemonName)
    // console.log(currPokemonData)
    elSpans[i].innerText = `#${currPokemonData.id} `
  }
}

function renderNextPage() {
  gCurrPage++
  // const pokemonData = getPokemons(gPokemonsUrl)
  console.log(gPokemonData)
  gPokemonsUrl = gPokemonData.next
  getPokemons(gPokemonsUrl).then(() => {
    pokemonsToPokemon()
  })
  // document.body.scrollTop = document.documentElement.scrollTop = 0
  const elList = document.querySelector('.pokemons')
  elList.scrollTop = '0'
}

function renderPrePage() {
  if (gCurrPage === 1) return
  gCurrPage--
  // const pokemonData = getPokemons(gPokemonsUrl)
  console.log(gPokemonData)
  gPokemonsUrl = gPokemonData.previous
  getPokemons(gPokemonsUrl).then(() => {
    pokemonsToPokemon()
  })

  const elList = document.querySelector('.pokemons')
  // elList.scrollTo(0, document.body.scrollHeight)
  elList.scrollTop = elList.scrollHeight
}

function renderAll() {
  setLoader()
  renderList(gPokemonData)
  renderSprites()
  renderWeight()
  renderTypes()
  renderIds()
}

function setLoader() {
  const elLoader = document.querySelector('.loader')
  const elScreen = document.querySelector('.screen')
  // console.log(elLoader)
  elLoader.classList.remove('hidden')
  elScreen.classList.remove('hidden')
  setTimeout(() => {
    elLoader.classList.add('hidden')
    elScreen.classList.add('hidden')
  }, 500)
}

function pokemonsToPokemon(idx) {
  console.log(gPokemonData)
  const pokemons = gPokemonData.results
  console.log(pokemons)

  for (var i = 0; i < pokemons.length; i++) {
    const currPokemon = pokemons[i]
    const currName = pokemons[i].name

    // console.log(currName)

    // localStorage.clear(currName)
    // console.log(loadFromStorage(currName))
    if (!loadFromStorage(currName)) {
      savePokemon(currName, currPokemon.url).then(() => {
        console.log(loadFromStorage(currName))
        renderAll()
      })
    } else {
      renderAll()
    }
  }
}

function addTouchEvent() {
  const elBtn = document.querySelector('.play-btn')

  let touchEvent = 'ontouchstart' in window ? 'touchstart' : 'click'
  elBtn.addEventListener(touchEvent, onCryPlay(this))
}

function onPokemonClick(elPokemon) {
  setLoader()

  const pokemon = elPokemon.dataset
  renderArtwork(pokemon.pokemonName)
  renderName(pokemon.pokemonName)
  renderScreenTypes(pokemon.pokemonName)
}

function renderArtwork(pokemonName) {
  const elArtworks = document.querySelectorAll('.artwork')
  console.log(elArtworks)
  console.log(pokemonName)
  const pokemonData = loadFromStorage(pokemonName)
  console.log(pokemonData)
  elArtworks[0].src = pokemonData.artwork.front_default
  elArtworks[1].src = pokemonData.artwork.front_shiny
}

function renderName(pokemonName) {
  const elScreen = document.querySelector('.pokemon-screen')
  const elName = elScreen.querySelector('h2')

  console.log(elName)

  const pokemonData = loadFromStorage(pokemonName)

  // elName.innerText = `${capitalizeFirstLetter(pokemonData.name)}`

  elName.innerHTML = `${capitalizeFirstLetter(
    pokemonData.name
  )}<i class="fa-regular fa-circle-play" data-pokemon-name="${pokemonName}" class="play-btn" onclick="onCryPlay(this)" style="cursor:pointer;" title="Play cry"></i>`
}

function renderScreenTypes(pokemonName) {
  const elScreen = document.querySelector('.pokemon-screen')
  const elType = elScreen.querySelector('.type')

  const pokemonData = loadFromStorage(pokemonName)

  // let currElType = elPokemons[i].querySelector('.type')
  // const currPokemonData = loadFromStorage(pokemons[i].name)
  if (pokemonData.types.length > 1) {
    elType.innerHTML = `<img class="screen-type ${pokemonData.types[0].type.name}" src="icons/${pokemonData.types[0].type.name}.svg" alt=""><img class="screen-type ${pokemonData.types[1].type.name}" src="icons/${pokemonData.types[1].type.name}.svg" alt="">`
  } else {
    elType.innerHTML = `<img class="screen-type ${pokemonData.types[0].type.name}" src="icons/${pokemonData.types[0].type.name}.svg" alt="">`
  }
}
