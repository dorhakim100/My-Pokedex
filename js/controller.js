'use strict'

let gCurrPage = 1
let gScreenPokemon = 'bulbasaur'

var isTouch = 'ontouchstart' in window

function init() {
  getPokemons(gPokemonsUrl).then(() => {
    pokemonsToPokemon()
    gPagesCount = countPages()

    // renderArtwork(defaultPokemon)
    // renderName(defaultPokemon)
    // renderScreenTypes(defaultPokemon)
  })
  // addTouch()
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

  // const elPokemons = document.querySelectorAll('article')

  // for (var i = 0; i < pokemons.length; i++) {
  //   let currElWeight = elPokemons[i].querySelector('.weight')
  //   const currPokemonData = loadFromStorage(pokemons[i].name)
  //   currElWeight.innerText = `Weight: ${currPokemonData.weight} lbs`
  // }

  const pokemonData = loadFromStorage(gScreenPokemon)

  const elWeight = document.querySelector('.weight')

  elWeight.innerText = `Weight: ${pokemonData.weight} lbs`
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
  // console.log(pokemonName)

  const currPokemonData = loadFromStorage(pokemonName)
  const cry = new Audio(currPokemonData.cries.latest)
  const elAudio = document.querySelector('.audio')
  elAudio.src = cry.src
  elAudio.play()
  console.log(cry)

  // cry.play()
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
  // console.log(gPokemonData)
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
  // console.log(gPokemonData)
  const pokemons = gPokemonData.results
  console.log(pokemons)

  for (var i = 0; i < pokemons.length; i++) {
    const currPokemon = pokemons[i]
    const currName = pokemons[i].name

    console.log(currName)

    // localStorage.clear(currName)
    // if (loadFromStorage('abomasnow') === null) {
    //   savePokemon('abomasnow', 'https://pokeapi.co/api/v2/pokemon/460/')
    // }
    if (!loadFromStorage(currName)) {
      savePokemon(currName, currPokemon.url).then(() => {
        // console.log(loadFromStorage(currName))
        renderAll()
        // renderArtwork(gScreenPokemon)
        renderName(gScreenPokemon)
        renderScreenTypes(gScreenPokemon)
        renderDexEntries()
      })
    } else {
      renderAll()
      // renderArtwork(gScreenPokemon)
      renderName(gScreenPokemon)
      renderScreenTypes(gScreenPokemon)
      renderDexEntries()
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

  gScreenPokemon = pokemon.pokemonName

  // renderArtwork(pokemon.pokemonName)
  onShinyCheckbox()
  renderName(pokemon.pokemonName)
  renderScreenTypes(pokemon.pokemonName)
  renderWeight()
  renderDexEntries()
}

function renderArtwork(pokemonName) {
  const elArtworks = document.querySelector('.artwork')

  const pokemonData = loadFromStorage(pokemonName)
  const elShinyCheckbox = document.querySelector('.shiny-input')

  const elArtwork = document.querySelector('.artwork')

  const elStar = document.querySelector('.star')

  if (elShinyCheckbox.checked) {
    const sound = new Audio('sound/shiny.mp3')
    sound.play()
    elArtwork.src = pokemonData.artwork.front_shiny
    elStar.classList.add('floating')
    elStar.classList.remove('hidden')
  } else {
    elArtwork.src = pokemonData.artwork.front_default
    elStar.classList.remove('floating')
    elStar.classList.add('hidden')
  }
}

function renderName(pokemonName) {
  const elScreen = document.querySelector('.pokemon-screen')
  const elName = elScreen.querySelector('h2')

  // console.log(elName)

  const pokemonData = loadFromStorage(pokemonName)

  // elName.innerText = `${capitalizeFirstLetter(pokemonData.name)}`

  elName.innerHTML = `#${pokemonData.id} ${capitalizeFirstLetter(
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
  renderNextSprites()
}

function renderPrePokemon() {
  setLoader()

  const currPokemonData = loadFromStorage(gScreenPokemon)

  const prePokemonDataID = currPokemonData.id - 1

  gScreenPokemon = findPokemon(prePokemonDataID).name

  renderArtwork(gScreenPokemon)
  renderName(gScreenPokemon)
  renderScreenTypes(gScreenPokemon)
  renderWeight()
  renderNextSprites()
  renderDexEntries()
}

function renderNextPokemon() {
  setLoader()

  const currPokemonData = loadFromStorage(gScreenPokemon)

  console.log(currPokemonData)

  const nextPokemonDataID = currPokemonData.id + 1

  console.log(nextPokemonDataID)

  gScreenPokemon = findPokemon(nextPokemonDataID).name

  renderArtwork(gScreenPokemon)
  renderName(gScreenPokemon)
  renderScreenTypes(gScreenPokemon)
  renderWeight()
  renderNextSprites()
  renderDexEntries()
}

function renderNextSprites() {
  const currPokemonData = loadFromStorage(gScreenPokemon)

  const nextPokemonDataID = currPokemonData.id + 1
  const prePokemonDataID = currPokemonData.id - 1

  let nextPokemonData = findPokemon(nextPokemonDataID)
  let prePokemonData = findPokemon(prePokemonDataID)

  const elScreenSprites = document.querySelectorAll('.screen-sprite')

  if (currPokemonData.id === 1) {
    elScreenSprites[0].src = ''
    elScreenSprites[1].src = nextPokemonData.sprites.front_default
    return
  }

  elScreenSprites[0].src = prePokemonData.sprites.front_default
  elScreenSprites[1].src = nextPokemonData.sprites.front_default
}

function renderDexEntries() {
  const pokemons = gPokemonData.results

  for (var i = 0; i < pokemons.length; i++) {
    // const currPokemon = pokemons[i]
    const currName = pokemons[i].name

    let pokemonData = loadFromStorage(currName)
    // console.log(pokemonData)

    const elDexEntry = document.querySelector('.dex-entry')

    getText(pokemonData.dexUrl, pokemonData.name).then(() => {
      pokemonData = loadFromStorage(gScreenPokemon)
      elDexEntry.innerText = pokemonData.dex
    })
  }
}

function switchArtwork(elBtn) {
  let mode = elBtn.innerText

  const elArtwork = document.querySelector('.artwork')
  const pokemonData = loadFromStorage(gScreenPokemon)
  console.log(pokemonData)

  const elStar = document.querySelector('.star')

  switch (mode) {
    case 'Regular':
      const sound = new Audio('sound/shiny.mp3')
      sound.play()
      elArtwork.src = pokemonData.artwork.front_shiny
      elBtn.innerText = 'Shiny'
      elStar.classList.add('floating')
      elStar.classList.remove('hidden')
      break
    case 'Shiny':
      elArtwork.src = pokemonData.artwork.front_default
      elBtn.innerText = 'Regular'
      elStar.classList.remove('floating')
      elStar.classList.add('hidden')
      break
  }
}

// function addTouch() {
//   const elSwitchBtn = document.querySelector('.shiny-switch-btn')
//   if (isTouch) {
//     elSwitchBtn.addEventListener('touchstart', switchArtwork('Regular'))

//     elSwitchBtn.addEventListener('touchend', switchArtwork('Shiny'))
//   }
// }

function onShinyCheckbox() {
  // const elShinyCheckbox = document.querySelector('.shiny-input')
  // console.log(elShinyCheckbox.checked)
  // const elArtwork = document.querySelector('.artwork')
  // const pokemonData = loadFromStorage(gScreenPokemon)

  // if (elShinyCheckbox.checked) {
  //   const sound = new Audio('sound/shiny.mp3')
  //   sound.play()
  //   elArtwork.src = pokemonData.artwork.front_shiny
  // } else {
  //   elArtwork.src = pokemonData.artwork.front_default
  // }
  renderArtwork(gScreenPokemon)
}
