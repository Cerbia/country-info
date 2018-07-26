'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*reorganize code & create
https://hackernoon.com/observer-vs-pub-sub-pattern-50d3b27f838c
https://gist.github.com/learncodeacademy/777349747d8382bfb722
*/
//TODO: Classes Map and Countries

var Marker = function () {
    function Marker(engine) {
        _classCallCheck(this, Marker);

        this.engine = engine;
        this.markersArray = [];
    }

    _createClass(Marker, [{
        key: 'setUpMarkers',
        value: function setUpMarkers() {
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this.engine.countriesMap[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var _step$value = _slicedToArray(_step.value, 2),
                        k = _step$value[0],
                        v = _step$value[1];

                    this.markersArray.push(new google.maps.Marker({ position: v.latlng, map: engine.map }));
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
    }, {
        key: 'cleanUpMarkers',
        value: function cleanUpMarkers() {
            this.markersArray.forEach(function (item) {
                console.log('item' + item);
                item.setMap(null);
            });
            this.markersArray = [];
        }
    }]);

    return Marker;
}();

var Application = function () {
    function Application() {
        _classCallCheck(this, Application);

        this.countriesButtonContainer = document.querySelector('.countries-container');
        this.templateCountryButton = document.getElementById('template-country').innerHTML;
        this.countryInput = document.getElementById('country-name');
        this.countriesMap = new Map();
        this.marker = new Marker(this);
        this.map = new google.maps.Map(document.getElementById('map'), { zoom: 5, center: { lat: 52, lng: 20 } });
    }

    _createClass(Application, [{
        key: 'searchCountries',
        value: function searchCountries() {
            var countryName = this.countryInput.value;
            if (!countryName) countryName = 'Poland';

            fetch(Application.prefix + Application.url + countryName).then(function (response) {
                return response.json();
            }).then(showCountriesList).catch(function () {
                alert("Country not found, type a different name");
            });
        }
    }, {
        key: 'clearResult',
        value: function clearResult() {
            this.countriesNames = [];
            this.countriesMap.clear();
            this.marker.cleanUpMarkers();
            this.countriesButtonContainer.innerHTML = '';
        }
    }]);

    return Application;
}();

Application.prefix = 'https://cryptic-headland-94862.herokuapp.com/';
Application.url = 'https://restcountries.eu/rest/v2/name/';
Application.enterKeyCode = 13;


var engine = new Application();

document.getElementById('search').addEventListener('click', engine.searchCountries.bind(engine));

engine.countryInput.addEventListener('keyup', function (event) {

    event.preventDefault();

    if (event.keyCode === Application.enterKeyCode) {
        document.getElementById('search').click();
    }
});

function showCountriesList(resp) {
    engine.clearResult();

    resp.forEach(function (item) {
        engine.countriesMap.set(item.name, {
            latlng: { lat: Number(item.latlng[0]), lng: Number(item.latlng[1]) },
            flag: item.flag,
            nativeName: item.nativeName,
            capital: item.capital,
            currencies: item.currencies,
            languages: item.languages
        });
        engine.countriesNames.push({ name: item.name });
    });

    generateCountriesList();
    engine.marker.setUpMarkers();
}

function generateCountriesList() {
    var generateButtonTemplate = '';
    Mustache.parse(engine.templateCountryButton);
    for (var i = 0; i < engine.countriesNames.length; i++) {
        generateButtonTemplate += Mustache.render(engine.templateCountryButton, engine.countriesNames[i]);
    }
    engine.countriesButtonContainer.insertAdjacentHTML('afterbegin', generateButtonTemplate);
}

var theParentCountryButtonEl = document.querySelector('.countries-container');

theParentCountryButtonEl.addEventListener('click', centerCountryOnTheMap, false);

function centerCountryOnTheMap(e) {
    if (e.target !== e.currentTarget) {
        engine.map.setCenter(engine.countriesMap.get(e.target.innerHTML).latlng);
        engine.map.setZoom(5);
    }
    e.stopPropagation();
}
