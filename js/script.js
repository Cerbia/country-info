/*reorganize code & create
https://hackernoon.com/observer-vs-pub-sub-pattern-50d3b27f838c
https://gist.github.com/learncodeacademy/777349747d8382bfb722
*/
//TODO: Classes Map and Countries

class Marker {
  constructor(engine) {
    this.engine = engine
    this.markersArray = []
  }

  setUpMarkers() {
    for (let [k, v] of this.engine.countriesMap) {
      this.markersArray.push(new google.maps.Marker({position: v.latlng, map: map}))
    }
  }

  cleanUpMarkers() {
    this.markersArray.forEach(function (item) {
      item.setMap(null)
    })
    this.markersArray = []
  }
}

class Application {
  static prefix = 'https://cryptic-headland-94862.herokuapp.com/'

  constructor() {
    this.countriesButtonContainer = document.querySelector('.countries-container')
    this.templateCountryButton = document.getElementById('template-country').innerHTML
    this.countryInput = document.getElementById('country-name')
    this.countriesMap = new Map()
    this.marker = new Marker(this)
  }

  searchCountries() {
    var countryName = this.countryInput.value
    if (!countryName) countryName = 'Poland'

    fetch(Application.prefix + url + countryName)
      .then(response => response.json())
      .then(showCountriesList)
  }

  clearResult() {
    this.countriesNames = []
    this.countriesMap.clear()
    this.marker.cleanUpMarkers()
  }

}


const url = 'https://restcountries.eu/rest/v2/name/'


const engine = new Application()

document.getElementById('search').addEventListener('click', engine.searchCountries.bind(engine))

engine.countryInput.addEventListener('keyup', function (event) {
  event.preventDefault()
  if (event.keyCode === 13) {
    document.getElementById('search').click()
  }
})


function showCountriesList(resp) {
  engine.clearResult();

  // Czyszczenie buttonów w html
  engine.countriesButtonContainer.innerHTML = ''

  resp.forEach(function (item) {
    engine.countriesMap.set(item.name, {
      latlng: {lat: Number(item.latlng[0]), lng: Number(item.latlng[1])},
      flag: item.flag,
      nativeName: item.nativeName,
      capital: item.capital,
      currencies: item.currencies,
      languages: item.languages,
    })
    engine.countriesNames.push({name: item.name})
  })

  generateCountriesList()
  engine.marker.setUpMarkers()
}

function generateCountriesList() {
  var generateButtonTemplate = ''
  Mustache.parse(engine.templateCountryButton)
  for (var i = 0; i < engine.countriesNames.length; i++) {
    generateButtonTemplate += Mustache.render(engine.templateCountryButton, engine.countriesNames[i])
  }
  engine.countriesButtonContainer.insertAdjacentHTML('afterbegin', generateButtonTemplate)
}

const theParentCountryButtonEl = document.querySelector('.countries-container')

theParentCountryButtonEl.addEventListener('click', centerCountryOnTheMap, false)

function centerCountryOnTheMap(e) {
  if (e.target !== e.currentTarget) {
    map.setCenter(engine.countriesMap.get(e.target.innerHTML).latlng)
    map.setZoom(5)
  }
  e.stopPropagation()
}

window.initMap = function () {
  map = new google.maps.Map(
    document.getElementById('map'), {zoom: 5, center: {lat: 52, lng: 20}},
  )
}