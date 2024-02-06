"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.displayMap = void 0;

var displayMap = function displayMap(locations) {
  mapboxgl.accessToken = 'pk.eyJ1IjoicGFpbmUyNTQ3a3VuZyIsImEiOiJjbHJucXl4M3gwMWIzMmpueDMwNGhhczF2In0.PsuGkbEo9XJEkYtadQl99Q';
  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    scrollZoom: true // center:[-118.113491,34.111745],
    // zoom:10,
    // interactive:false

  });
  var bounds = new mapboxgl.LngLatBounds();
  locations.forEach(function (loc) {
    // Add maker
    var el = document.createElement("div");
    el.classList = 'marker';
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom'
    }).setLngLat(loc.coordinates).addTo(map);
    new mapboxgl.Popup({
      offset: 30
    }).setLngLat(loc.coordinates).setHTML("<p>Day ".concat(loc.day, ": ").concat(loc.description, "</p>")).addTo(map); // Extend map bounds to includes current lacation

    bounds.extend(loc.coordinates);
  });
  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 200,
      left: 100,
      right: 100
    }
  });
};

exports.displayMap = displayMap;