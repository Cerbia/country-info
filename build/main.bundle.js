'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

/*reorganize code & create 
https://hackernoon.com/observer-vs-pub-sub-pattern-50d3b27f838c
https://gist.github.com/learncodeacademy/777349747d8382bfb722
*/

var prefix = "https://cryptic-headland-94862.herokuapp.com/";
var url = 'https://restcountries.eu/rest/v2/name/';
var countriesButtonContainer = document.querySelector('.countries-container');
// mustache template
var templateCountryButton = document.getElementById('template-country').innerHTML;
var countryInput = document.getElementById('country-name');
var map;
var theParentCountryButtonEl;
var countriesMap = new Map();
var countriesNames = [];
var markersArray = [];

document.getElementById('search').addEventListener('click', searchCountries);

countryInput.addEventListener('keyup', function (event) {
    event.preventDefault();
    if (event.keyCode === 13) {
        document.getElementById('search').click();
    }
});

function searchCountries() {
    var countryName = countryInput.value;
    if (!countryName) countryName = 'Poland';

    fetch(prefix + url + countryName).then(function (response) {
        return response.json();
    }).then(showCountriesList);
}

function showCountriesList(resp) {
    //czyszczenie
    countriesNames = [];
    countriesMap.clear();
    cleanUpMarkers();
    // Czyszczenie buttonów w html
    countriesButtonContainer.innerHTML = '';

    resp.forEach(function (item) {
        countriesMap.set(item.name, { latlng: { lat: Number(item.latlng[0]), lng: Number(item.latlng[1]) }, flag: item.flag, nativeName: item.nativeName, capital: item.capital, currencies: item.currencies, languages: item.languages });
        countriesNames.push({ name: item.name });
        //console.log(item.name + 'latlng: {lat: ' + item.latlng[0] + ', lng: ' + item.latlng[1] + '}');
    });

    generateCountriesList();
    setUpMarkers();
}

function generateCountriesList() {
    var generateButtonTemplate = "";
    Mustache.parse(templateCountryButton);
    for (var i = 0; i < countriesNames.length; i++) {
        generateButtonTemplate += Mustache.render(templateCountryButton, countriesNames[i]);
    }
    countriesButtonContainer.insertAdjacentHTML('afterbegin', generateButtonTemplate);
}

theParentCountryButtonEl = document.querySelector('.countries-container');

theParentCountryButtonEl.addEventListener('click', centerCountryOnTheMap, false);

function centerCountryOnTheMap(e) {
    if (e.target !== e.currentTarget) {
        map.setCenter(countriesMap.get(e.target.innerHTML).latlng);
        map.setZoom(5);
    }
    e.stopPropagation();
}

window.initMap = function () {
    map = new google.maps.Map(document.getElementById('map'), { zoom: 5, center: { lat: 52, lng: 20 } });
};

function setUpMarkers() {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = countriesMap[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var _step$value = _slicedToArray(_step.value, 2),
                k = _step$value[0],
                v = _step$value[1];

            //console.log(k, v);
            markersArray.push(new google.maps.Marker({ position: v.latlng, map: map }));
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }
}

function cleanUpMarkers() {
    markersArray.forEach(function (item) {
        item.setMap(null);
    });
    markersArray = [];
    //console.log(markersArray);
}
