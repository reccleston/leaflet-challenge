// Creating map object
var myMap = L.map("mapid", {
    center: [34.0522, -118.2437],
    zoom: 5
  });
  
// Adding tile layer
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/dark-v10",
  accessToken: API_KEY
}).addTo(myMap);

// CHANGE TO CHANGE DATA SET
var start_date = '2021-03-14';
var end_date = '2021-03-26';
var url = `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${start_date}&endtime=${end_date}`;



function plotPoints(resp) {

  // Points
  resp.features.forEach(feat => {
    var radius_scale_factor = 10000;
    var quake_location = [feat.geometry.coordinates[1], feat.geometry.coordinates[0]];
    var pt_color = d3.interpolateRgb('white', 'purple')(feat.geometry.coordinates[2] / 10);

    L.circle(quake_location, {
      color: pt_color,
      fillColor: pt_color,
      fillOpacity: 0.5,
      radius: radius_scale_factor * feat.properties.mag
    }).bindPopup(`An earthquake of magnitude ${feat.properties.mag} and depth of ${feat.geometry.coordinates[2]} occured ${feat.properties.place}`).addTo(myMap);
  });

  const t_resp = Object.assign(...Array.from(
    new Set(resp.features.reduce((keys, o) => keys.concat(Object.keys(o)), [] )),
    key => ({ [key]: resp.features.map( o => o[key] ) })
    )).geometry;
  
    const coords = Object.assign(...Array.from(
      new Set(t_resp.reduce((keys, o) => keys.concat(Object.keys(o)), [] )),
      key => ({ [key]: t_resp.map( o => o[key] ) })
  ));

  // var depths = coords.coordinates.map(c => c[2]).sort(((x,y) => x - y));
  // var step = Math.abs(depths[depths.length - 1] - depths[0]) / 5;
  // var depth_intervals = [];

  // for (i = depths[0]; i < depths[depths.length -1]; i += step) {
  //   depth_intervals.push(i);
  // };

  // console.log(depth_intervals);

  // Legend 
  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function (map) {

  var div = L.DomUtil.create('div', 'info legend');

  var depth_intervals = [-10, 10, 30, 50, 70, 90];
  
  for (var i = 0; i < depth_intervals.length; i++) {
    div.innerHTML +=
      '<i style="background:' + d3.interpolateRgb('white', 'purple')(depth_intervals[i] / 10) + '"></i> ' +
      depth_intervals[i] + (depth_intervals[i + 1] ? '&ndash;' + depth_intervals[i + 1] + '<br>' : '+');
};

  return div;
};

legend.addTo(myMap)
;




};

// console.log(url);
// var link = 'data/march2021_earthquakes.geojson'; 
// var link =

d3.json(url, plotPoints);