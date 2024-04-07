'use strict'

let gCurrPage

function init() {
  getPokemons(gPokemonsUrl).then(() => {
    pokemonsToPokemon()
  })

  // renderAll()
  gPagesCount = countPages()
  gCurrPage = 1
}

function renderList({ results }) {
  // console.log(results)
  const strHtml = results
    .map(
      (res) => `
        <li>
            <article data-pokemon-name="${res.name}" class="article">
            <div>
                <h2><span class="id"></span>${capitalizeFirstLetter(res.name)}
                </h2><i class="fa-regular fa-circle-play" data-pokemon-name="${
                  res.name
                }" class="play-btn" onclick="onCryPlay(this)" style="cursor:pointer;" title="Play cry"></i>
                <p class="weight">weight</p>
            </div>

            <div>
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
  console.log(gPokemonData)
  const pokemons = gPokemonData.results
  console.log(pokemons)
  const elPokemons = document.querySelectorAll('article')

  for (var i = 0; i < pokemons.length; i++) {
    let currElImgs = elPokemons[i].querySelectorAll('img')
    const currPokemonData = loadFromStorage(pokemons[i].name)
    console.log(currPokemonData)
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

function renderTypeImg(type) {
  let path
  switch (type) {
    case 'normal':
      path = 'img/'
      break

    default:
      break
  }
}

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

// function savePages() {
//   gPokemonData = loadFromStorage('pokemonData')

//   gPokemonData.page = 1
//   let pokemonData = gPokemonData

//   let nextDataUrl
//   let currPage = 1
//   nextDataUrl = pokemonData.next
//   for (var i = 0; i < gPagesCount; i++) {
//     // console.log(pokemonData)
//     // console.log(pokemonData)
//     // console.log(nextPage)
//     // console.log(loadFromStorage(`page${currPage}`))
//     // if (loadFromStorage(`page${currPage}`)) continue
//     axios
//       .get(nextDataUrl)
//       .then((res) => {
//         currPage++
//         console.log(currPage)
//         pokemonData = res.data
//         saveToStorage(`page${currPage}`, pokemonData)
//         nextDataUrl = pokemonData.next
//       })
//       .catch((err) => {
//         console.log(err)
//         throw 'Sonething went wrong.. try agin later'
//       })
//       .finally(() => console.log('Finally...'))
//   }
// }
// gPagesCount = countPages()
// for (var i = 0; i < gPagesCount; i++) {
//   console.log(loadFromStorage(`page${i + 1}`))
//   localStorage.clear(`page${i + 1}`)
// }

function renderNextPage() {
  gCurrPage++
  // const pokemonData = getPokemons(gPokemonsUrl)
  console.log(gPokemonData)
  gPokemonsUrl = gPokemonData.next
  getPokemons(gPokemonsUrl).then(() => {
    pokemonsToPokemon()
  })
  document.body.scrollTop = document.documentElement.scrollTop = 0
}

function renderPrePage() {
  gCurrPage--
  // const pokemonData = getPokemons(gPokemonsUrl)
  console.log(gPokemonData)
  gPokemonsUrl = gPokemonData.previous
  getPokemons(gPokemonsUrl).then(() => {
    pokemonsToPokemon()
  })
  window.scrollTo(0, document.body.scrollHeight)
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
  console.log(elLoader)
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

    console.log(currName)

    localStorage.clear(currName)
    console.log(loadFromStorage(currName))
    if (!loadFromStorage(currName)) {
      savePokemon(currName, currPokemon.url).then(() => {
        renderAll()
      })
    }
  }
}

function addTouchEvent() {
  const elBtn = document.querySelector('.play-btn')

  let touchEvent = 'ontouchstart' in window ? 'touchstart' : 'click'
  elBtn.addEventListener(touchEvent, onCryPlay(this))
}
