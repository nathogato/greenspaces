//endpoint for oregon parks api
const OREGON_PARKS_SEARCH_URL = 'https://oregonstateparks.org/data/index.cfm?endpoint=%2FparkFeatures';

//global variable for map, used in multiple functions
let map;
//initiate google map with portland lat long as center
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 45.5122, lng: -122.6587},
    zoom: 8
  });
}

//gets data from api using search term as query
function getDataFromApi(searchTerm, callback) {
  const query = {
    iconClasses: `${searchTerm}`,
  }
  $.getJSON(OREGON_PARKS_SEARCH_URL, query, callback)
  .fail(function() {
    console.log( "error" );
    $('.js-search-error').html(`<h3><i class="fas fa-exclamation-triangle"></i> No results for that search term, please try a new search.</h3>`);
    initMap();
  })
}

//renders result for Map display
function renderResultMap(result) {
  let infowindow =  new google.maps.InfoWindow({});
  let marker;
  marker = new google.maps.Marker({
      position: new google.maps.LatLng(result.park_latitude,
      result.park_longitude),
      animation: google.maps.Animation.DROP,
      map: map,
      title: result.park_name
    });
  google.maps.event.addListener(marker, 'click', (function (marker) {
      return function () {
        infowindow.setContent(result.park_name);
        infowindow.open(map, marker);
      }
    })(marker));
}

//inserts search result in html
function displaySearchData(data) {
  // clears previous markers
  initMap();
  const results = data.map((item, index) => renderResultMap(item));
  $('.js-search-results').html(results);
}

//event listener for user input then gets data from api
function watchSubmit() {
  $('.js-search-form').submit(event => {
    event.preventDefault();
    $('.js-search-error').html("");
    const queryTarget = $(event.currentTarget).find('.js-query');
    const query = queryTarget.val();
    // clears out the input
    queryTarget.val("");
    getDataFromApi(query, displaySearchData);
  });
}

$(watchSubmit);
