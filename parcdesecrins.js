// Defaults
const alphiBaseUrl = "https://live.api-server.io/run/v1/66ade5323b53b139de1ea229";
const googleBucketUrl = "https://storage.googleapis.com/parc_des_ecrins";

//const alphiBaseUrl = "https://live.api-server.io/run/v1/644836c7eaebea1ea38e66c9";
const btnDefaultValue = "Search";
let searchterm = ""; // not necessary cause alphi.dev api also has default

// initial data for the Cards component
const initialData = {
  listings: [],
};

// create the cards component and mount it to the html element with the id "cards"
$app.createComponent("cards", initialData).mount("#cards");

// this is using https://shinyobjectlabs.gitbook.io/fetch-js/
// This is being triggered by the x-fetch="get_todos" in <body> and then later by the "Search button"
$fetch.createAction("get_todos", {
  options: {
    method: "get",
    //    "url": alphiBaseUrl + "?endpoint=home&name=" + searchterm,
    url: alphiBaseUrl,
    headers: [
      {
        key: "Content-Type",
        value: "application/json",
      },
    ],
    body: [],
  },
  integrations: {
    authentication: console.log("triggered" + document.getElementById("search").value),
  },
  events: {
    onTrigger: {
      callback: console.log("triggered for :" + document.getElementById("search").value),
    },
    onRequestInit: {
      callback: async (options, triggerEl) => {
        console.log("Initializing alphi request");
        // show/hide some stuff
        document.getElementById("loading-animation").style.display = "block";
        // document.getElementById('results').style.display = "none";

        // Change button text
        document.getElementById("btnSearch").value = document.getElementById("btnSearch").dataset.wait;

        //const id = triggerEl?.parentElement?.querySelector("[airtable-id]")?.textContent
        if (document.getElementById("search").value !== "") {
          console.log("searchterm entered and adding it to the fetch url");
          // set the value dynamically
          options.url = alphiBaseUrl + "?endpoint=home&name=" + document.getElementById("search").value.toLowerCase();

          // return the updated options
          return options;
        }

        // searchterm empty so return all results (from initial options object)
        return options;
      },
    },
    onSuccess: {
      redirectUrl: null,
      showElement: "#results",
      hideElement: "#loading-animation",
      callback: async (response, data) => {
        // Change button text
        document.getElementById("btnSearch").value = btnDefaultValue;

        if (data.length > 0) {
          // we have results, send to component
          console.log("We have " + data.length + " results!");
          console.log(data[0].link);



          // resultaat bar
          let result_text = data.length == 1 ? "result" : "results";
          let result_searchterm =
            document.getElementById("search").value.toLowerCase() == ""
              ? ""
              : ' for <b>"' + document.getElementById("search").value.toLowerCase() + '"</b>';
          $("#totalresults").html("<b>" + data.length + "</b> " + result_text + result_searchterm);

          $app.components.cards.store.listings = data;

          // show/hide
          document.getElementById("no-results").style.display = "none";
          document.getElementById("cards").style.display = "block";
          document.getElementById("toolbar").style.display = "block";

          // this needs to be here cause .tag is dynamic
          $(".tag").on("click", function () {
            $("#search").val($(this).text()).trigger("input"); // trigger is needed to trigger below input trigger function and add has--value class
            $fetch.triggerAction("get_todos");
          });

          // const dataRes = `{"type": "FeatureCollection","crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
          // "features": [
          // { "type": "restaurant", "properties": { "id": "ak16994521", "mag": 2.3, "time": 1507425650893, "felt": null, "tsunami": 0 , "icon" : "restaurantz"}, "geometry": { "type": "Point", "coordinates": [ 6.079625696485338, 45.05582527284327, 0.0 ] } },
          // { "type": "restaurant", "properties": { "id": "ak16994519", "mag": 1.8, "time": 1507425289659, "felt": null, "tsunami": 1 , "icon" : "restaurantz"}, "geometry": { "type": "Point", "coordinates": [ 6.095941226350404, 45.04744472115766, 105.5 ] } },
          // { "type": "restaurant", "properties": { "id": "ak16994517", "mag": 1.6, "time": 1507424832518, "felt": null, "tsunami": 0 , "icon" : "restaurantz"}, "geometry": { "type": "Point", "coordinates": [ -151.3597, 63.0781, 0.0 ] } },
          // { "type": "restaurant", "properties": { "id": "ci38021336", "mag": 1.42, "time": 1507423898710, "felt": null, "tsunami": 0 , "icon" : "restaurantz"}, "geometry": { "type": "Point", "coordinates": [ -118.497, 34.299667, 7.64 ] } },
          // { "type": "walk", "properties": { "id": "ak16994521", "mag": 2.3, "time": 1507425650893, "felt": null, "tsunami": 0 , "icon" : "walk"}, "geometry": { "type": "Point", "coordinates": [ 6.0772347733183345, 45.03854226167686 ] } },
          // { "type": "walk", "properties": { "id": "ak16994519", "mag": 1.8, "time": 1507425289659, "felt": null, "tsunami": 1 , "icon" : "walk"}, "geometry": { "type": "Point", "coordinates": [ 6.044244294506851, 45.042627740693604 ] } },
          // { "type": "walk", "properties": { "id": "ak16994517", "mag": 1.6, "time": 1507424832518, "felt": null, "tsunami": 0 , "icon" : "walk"}, "geometry": { "type": "Point", "coordinates": [ -151.3597, 63.0781, 0.0 ] } },
          // { "type": "walk", "properties": { "id": "ci38021336", "mag": 1.42, "time": 1507423898710, "felt": null, "tsunami": 0 , "icon" : "walk"}, "geometry": { "type": "Point", "coordinates": [ -118.497, 34.299667, 7.64 ] } }
          // ]
          // }`;


          // data.forEach((item) => {
          //   console.log(item.link + " vs " + item.name);
          // });
          // const dataGeoJsonFormatted =

          const dataGeoJsonFormatted = `{"type": "FeatureCollection","crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },` +
          `"features": [${data.map((item) => {
            return `{ "type": "${item.type}", "properties": { "id": "${item.id}", "mag": 1.43, "time": 1507424832518, "felt": null, "tsunami": 1, "icon" : "restaurantz" }, "geometry": { "type": "Point", "coordinates": [ ${item.longitude}, ${item.latitude}, 0.0 ] } }`;
          })}]}`;

          console.log("dataGeoJsonFormatted" + dataGeoJsonFormatted);

          // create static geojson object to feed to MapTiler
          // data.forEach((item) => {
          //   console.log(item.link + " vs " + item.name);
          // });

          initMap(dataGeoJsonFormatted);

        } else {
          // 200 but no results
          console.log("We have " + data.length + " results!");

          // show/hide
          document.getElementById("cards").style.display = "none";
          document.getElementById("no-results").style.display = "block";
          document.getElementById("toolbar").style.display = "none";
        }
      },
    },
    onError: {
      redirectUrl: null,
      showElement: "#error",
      hideElement: "#cards",
      callback: async (response, data) => {
        console.log("Error: " + response);
        document.getElementById("btnSearch").value = document.getElementById("btnSearch").dataset.default;
      }, // callback
    }, // onError
  },
});

// Helper to display tags
function createTagLink(tag) {
  // if (tags == null) return false;
  // let tagsText = "niks";
  // tags.forEach((tag) => {
  // console.log("tag >>> " + tag);
  //  tagsText += "<a href='" + tag + "'>tagje</a>";
  //});

  return "#";
}

// When the user begins typing, hide the suggestions placeholder text
$("#search").on("input", function () {
  if ($(this).val()) {
    $(this).addClass("has--value");
  } else {
    $(this).removeClass("has--value");
  }
});

// when clicking on CROSS in searchfield or Logo
$("#clearsearch,#brand").on("click", function () {
  $("#search").val("").trigger("input"); // to trigger above function and add has--value class
  $fetch.triggerAction("get_todos");
});

function createShopLink(card) {
  return "/shop-detail?id=" + card.author;
}

// Maptiler

maptilersdk.config.apiKey = "fsCLuIQWGPlRskWhImQz";
var map = new maptilersdk.Map({
  container: "map",
  zoom: 11.5,
  center: [6.079625696485338, 45.05582527284327],
  style: "b80bd75b-379c-45e4-9006-643ba8aa190e", // plastic map : "802d2114-c629-44f6-b50f-987a6253af56",
  //terrain: true,
  // terrainExaggeration: 2,
  antialias: true,
});

console.log("Are tiles loaded : " + map.areTilesLoaded());

// start: rain layer
// const weatherLayer = new maptilerweather.PrecipitationLayer();
// end: rain layer

// GENERAL SETTINGS
const filterGroup = document.getElementById("filter-group");
const iconSize = 0.6;
let filterForPointLayer = ["any"]; // Use 'any' logical operator for OR conditions
let filterForClusterLayer = ["all", ["has", "point_count"]];

/////////////////////////////
////////////////////////////////////////
///////////////////////////////////////////////////// START: HELPERS

// function createCheckboxWithLabel(layerID, symbol) {
//     // Add checkbox and label elements for the layer.
//     const input = document.createElement('input');
//     input.type = 'checkbox';
//     input.id = layerID;
//     input.checked = true;
//     filterGroup.appendChild(input);

//     const label = document.createElement('label');
//     label.setAttribute('for', layerID);
//     label.textContent = symbol;
//     filterGroup.appendChild(label);

//     // When the checkbox changes, update the visibility of the layer.
//     input.addEventListener('change', (e) => {

//         console.log("changing");
//         // filterBy('restaurants_off');
//         // this is also a way but need to use Style in this case as workaround so the points are also taken out of the clusters
//         map.setLayoutProperty(
//             layerID,
//             'visibility',
//             e.target.checked ? 'visible' : 'none'
//         );
//         const myStyle = map.getStyle();
//         const switcher = e.target.checked ? '==' : '!=';
//         myStyle.sources.earthquakes.filter = ["all",
//             [switcher, ["get", "icon"], symbol]
//         ];
//         map.setStyle(myStyle);
//     });

// }

function updateFilter() {
  console.log("update filter");
  filterForPointLayer.length = 1; // CLEAR the filter array BUT keep the initial operator
  filterForClusterLayer.length = 2; // CLEAR the filterForClusterLayer array BUT keep the initial 2 operators

  const checkboxes = document.querySelectorAll('input[type="checkbox"]');

  checkboxes.forEach((checkbox) => {
    console.log(checkbox.id + " vs " + checkbox.checked);
    if (checkbox.checked) {
      // filter.push(['==', 'type', checkbox.id]);
      filterForPointLayer.push(["==", ["get", "icon"], checkbox.id]);
      filterForClusterLayer.push(["get", `only_${checkbox.id}`]);
    }
  });

  // style workaround to update clusters properly (https://github.com/mapbox/mapbox-gl-js/issues/2613)
  const myStyle = map.getStyle();
  myStyle.sources.earthquakes.filter = filterForPointLayer;
  map.setStyle(myStyle);

  // Apply the filter to the layer
  // map.setFilter('point-layer', filterForPointLayer); // this works tho
  // map.setFilter('cluster-layer', filterForClusterLayer); // this does not work hence we need the style-workaround above
}

function createCheckboxesNew(id) {
  console.log("create checkboxes new");
  // Add checkbox and label elements for the layer.
  const input = document.createElement("input");
  input.type = "checkbox";
  input.id = `${id}`;
  input.checked = true;
  filterGroup.appendChild(input);

  const label = document.createElement("label");
  label.setAttribute("for", `${id}`);
  label.textContent = id;
  filterGroup.appendChild(label);

  // When the checkbox changes, update the visibility of the layer.
  input.addEventListener("change", (e) => {
    console.log("changing");

    updateFilter();
    // e.target.checked ? '==' : '!=';
    // filter.push(['==', ['get', 'icon'], id]);

    // map.setFilter('point-layer', filter);

    // console.log(filter);

    //console.log("changing");
    //updateFilter();
    // filterBy('restaurants_off');
    // this is also a way but need to use Style in this case as workaround so the points are also taken out of the clusters
    // map.setLayoutProperty(
    //     id,
    //     'visibility',
    //     e.target.checked ? 'visible' : 'none'
    // );
    // const myStyle = map.getStyle();
    // const switcher = e.target.checked ? '==' : '!=';
    // myStyle.sources.earthquakes.filter = ["all",
    //     [switcher, ["get", "icon"], id]
    // ];
    // map.setStyle(myStyle);
  });
}

// START: legend filtering
// function filterBy(what) {

//     // var filters = ['==', 'month', month];
//     if (what == "restaurants_on") {
//         map.setFilter('poi-restaurant', ['==', ['get', 'icon'], 'restaurant']);
//     } else {
//         map.setFilter('poi-restaurant', ['!=', ['get', 'icon'], 'restaurant']);
//     }
//     // map.setFilter('earthquake-circles', filters);
//     // map.setFilter('earthquake-labels', filters);

//     // Set the label to the month
//     // document.getElementById('month').textContent = months[month];
// }
// END: legend filtering

// START: get unique icons from geodata
function getUniqueIcons(data) {
  const gfxFolder = googleBucketUrl + "/map"; // Replace with the path to your "gfx" folder

  const uniqueIcons = new Set();

  // Loop through the "features" array and extract "icon" values
  data.features.forEach((feature) => {
    if (feature.properties && feature.properties.icon) {
      uniqueIcons.add(feature.properties.icon);
    }
  });

  const customMarkerArr = [];

  uniqueIcons.forEach((uniqueIcon) => {
    customMarkerArr.push({ name: uniqueIcon, path: `${gfxFolder}/${uniqueIcon}.png` });
  });

  return customMarkerArr;
} // END: get unique icons from geodata

// START : Important function that loads all markers and adds layers accordlingly
async function loadCustomMarkersAndLayers(data) {
  const customMarkers = getUniqueIcons(data);
  console.log(customMarkers.length);

  // Load each custom marker icon using map.loadImage
  customMarkers.forEach((marker) => {
    map.loadImage(marker.path, function (error, image) {
      if (error) throw error;

      // Add the loaded image as a new icon to the map
      console.log("addimagessssss for " + marker.name);
      map.addImage(marker.name, image);

      createCheckboxesNew(marker.name);
    });
  }); // loop for each type of marker

  // after loop
  map.addLayer({
    id: "cluster-layer",
    type: "symbol",
    source: "earthquakes",
    filter: ["has", "point_count"],
    // filter: ['all',['has', 'point_count'],['get','only_restaurant']],
    layout: {
      "icon-image": [
        "case",
        ["all", ["get", "has_restaurant"], ["get", "has_walk"]],
        "restaurant+walk",
        ["get", "only_restaurant"],
        "r-cluster",
        "w-cluster",
      ],
      "icon-size": 0.1,
      "icon-allow-overlap": true,
    },
  });

  map.addLayer({
    id: "cluster-count",
    type: "symbol",
    source: "earthquakes",
    filter: ["has", "point_count"],
    layout: {
      "text-field": "{point_count_abbreviated}",
      "text-font": ["Arial Unicode MS Bold"],
      "text-size": 16,
    },
    paint: {
      "text-color": "#ffffff",
    },
  });
}
// END : Important function that loads all markers and adds layers accordlingly

///////////////////////////////////////////////////// END: HELPERS
////////////////////////////////////////
/////////////////////////////

// CRUX
function initMap(dataGeoJsonFormatted) {

  map.on("load", async () => {
    console.log("map on load");

    // THIS WORKS IF YOU HAVE THE GEOJSON ON GOOGLE BUCKET
    //const dataRes = await fetch(googleBucketUrl + '/map/data.geojson');
    //const data = await dataRes.json();

    // BUT WE'RE GOING TO FORM A GEOJSON ON THE FLY FROM THE ALPHI DATA INSTEAD (SEE ABOVE)

    // const dataRes = `{"type": "FeatureCollection","crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
    //   "features": [
    //   { "type": "restaurant", "properties": { "id": "ak16994521", "mag": 2.3, "time": 1507425650893, "felt": null, "tsunami": 0 , "icon" : "restaurantz"}, "geometry": { "type": "Point", "coordinates": [ 6.079625696485338, 45.05582527284327, 0.0 ] } },
    //   { "type": "restaurant", "properties": { "id": "ak16994519", "mag": 1.8, "time": 1507425289659, "felt": null, "tsunami": 1 , "icon" : "restaurantz"}, "geometry": { "type": "Point", "coordinates": [ 6.095941226350404, 45.04744472115766, 105.5 ] } },
    //   { "type": "restaurant", "properties": { "id": "ak16994517", "mag": 1.6, "time": 1507424832518, "felt": null, "tsunami": 0 , "icon" : "restaurantz"}, "geometry": { "type": "Point", "coordinates": [ -151.3597, 63.0781, 0.0 ] } },
    //   { "type": "restaurant", "properties": { "id": "ci38021336", "mag": 1.42, "time": 1507423898710, "felt": null, "tsunami": 0 , "icon" : "restaurantz"}, "geometry": { "type": "Point", "coordinates": [ -118.497, 34.299667, 7.64 ] } },
    //   { "type": "walk", "properties": { "id": "ak16994521", "mag": 2.3, "time": 1507425650893, "felt": null, "tsunami": 0 , "icon" : "walk"}, "geometry": { "type": "Point", "coordinates": [ 6.0772347733183345, 45.03854226167686 ] } },
    //   { "type": "walk", "properties": { "id": "ak16994519", "mag": 1.8, "time": 1507425289659, "felt": null, "tsunami": 1 , "icon" : "walk"}, "geometry": { "type": "Point", "coordinates": [ 6.044244294506851, 45.042627740693604 ] } },
    //   { "type": "walk", "properties": { "id": "ak16994517", "mag": 1.6, "time": 1507424832518, "felt": null, "tsunami": 0 , "icon" : "walk"}, "geometry": { "type": "Point", "coordinates": [ -151.3597, 63.0781, 0.0 ] } },
    //   { "type": "walk", "properties": { "id": "ci38021336", "mag": 1.42, "time": 1507423898710, "felt": null, "tsunami": 0 , "icon" : "walk"}, "geometry": { "type": "Point", "coordinates": [ -118.497, 34.299667, 7.64 ] } }
    //   ]
    //   }`;
    // const data =  dataRes.json();

    const data = JSON.parse(dataRes);



    map.loadImage(googleBucketUrl + "/map/restaurant+walk.png", (error, image) => {
      if (error) throw error;

      map.addImage("restaurant+walk", image);

      map.loadImage(googleBucketUrl + "/map/r-cluster.png", (error, image) => {
        if (error) throw error;

        map.addImage("r-cluster", image);

        map.loadImage(
          googleBucketUrl + "/map/w-cluster.png", // Replace with your image URL
          (error, image) => {
            if (error) throw error;

            map.addImage("w-cluster", image);
            loadCustomMarkersAndLayers(data);
          }
        );
      });
    });

    // add a clustered GeoJSON source for a sample set of earthquakes
    map.addSource("earthquakes", {
      type: "geojson",
      data: data,
      cluster: true,
      clusterMaxZoom: 14, // Max zoom to cluster points on
      clusterRadius: 50,
      clusterProperties: {
        has_restaurant: ["any", ["==", ["get", "icon"], "restaurantz"], "false"],
        has_walk: ["any", ["==", ["get", "icon"], "walk"], "false"],
        only_restaurant: ["all", ["==", ["get", "icon"], "restaurantz"], "false"],
        only_walk: ["all", ["==", ["get", "icon"], "walk"], "false"],
      },
    });

    // this adds cluster CIRCLES on map

    // map.addLayer({
    //     id: 'clusters',
    //     type: 'circle',
    //     source: 'earthquakes',
    //     filter: ['has', 'point_count'], // Filter for restaurants
    //     paint: {
    //         // Use step expressions (https://docs.maptiler.com/gl-style-specification/expressions/#step)
    //         // with three steps to implement three types of circles:
    //         //   * Blue, 20px circles when point count is less than 100
    //         //   * Yellow, 30px circles when point count is between 100 and 750
    //         //   * Pink, 40px circles when point count is greater than or equal to 750
    //         'circle-color': [
    //             'step',
    //             ['get', 'point_count'],
    //             '#51bbd6', // color when less than 100 points
    //             100,
    //             '#f1f075', // color between 100 and 750 points
    //             750,
    //             '#f28cb1' // color for more than 750 points
    //         ],
    //         'circle-radius': [
    //             'step',
    //             ['get', 'point_count'],
    //             20, // size when less than 100 points
    //             100,
    //             30, // size between 100 and 750 points
    //             750,
    //             40 // size for more than 750 points
    //         ]
    //     }
    // });

    // When a click event occurs on a feature in
    // the unclustered-point layer, open a popup at
    // the location of the feature, with
    // description HTML from its properties.
    map.on("click", "point-layer", function (e) {
      var coordinates = e.features[0].geometry.coordinates.slice();
      var mag = e.features[0].properties.mag;
      var tsunami;

      if (e.features[0].properties.tsunami === 1) {
        tsunami = "yes";
      } else {
        tsunami = "no";
      }

      // Ensure that if the map is zoomed out such that
      // multiple copies of the feature are visible, the
      // popup appears over the copy being pointed to.
      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }

      new maptilersdk.Popup()
        .setLngLat(coordinates)
        .setHTML("magnitude: " + mag + "<br>Was there a tsunami?: " + tsunami)
        .addTo(map);
    });

    // start :rain layer
    // map.addLayer(weatherLayer, 'Water');
    // weatherLayer.animateByFactor(3600);
    // end : rain layer

    // /* start: if you want circles in stead of icons
    map.addLayer({
      id: "point-layer",
      type: "symbol",
      source: "earthquakes",
      filter: ["!", ["has", "point_count"]],
      layout: {
        "icon-image": [
          "case",
          ["==", ["get", "icon"], "restaurantz"],
          "restaurantz",
          ["==", ["get", "icon"], "walk"],
          "walk",
          "walk", // default cause 'case'
        ],
        "icon-size": iconSize,
        "icon-allow-overlap": true,
        "icon-ignore-placement": true, // icon will not push away underlaying village names.
      },
    });
    // end: if you want circles */

    // inspect a cluster on click
    map.on("click", "cluster-layer", function (e) {
      var features = map.queryRenderedFeatures(e.point, {
        layers: ["cluster-layer"],
      });

      var clusterId = features[0].properties.cluster_id;
      map.getSource("earthquakes").getClusterExpansionZoom(clusterId, function (err, zoom) {
        if (err) return;

        map.easeTo({
          center: features[0].geometry.coordinates,
          zoom: zoom,
        });
      });
    });

    map.on("mouseenter", "cluster-layer", function () {
      map.getCanvas().style.cursor = "pointer";
    });

    map.on("mouseleave", "cluster-layer", function () {
      map.getCanvas().style.cursor = "";
    });

    const mapStyle = map.getStyle();

    // // start: click on legend items
    // document
    //     .getElementById('kaka')
    //     .addEventListener('change', function (e) {
    //         if (e.target.checked) {
    //             console.log("Checkbox is checked..");
    //             filterBy("restaurants_on");
    //         } else {
    //             console.log("Checkbox is not checked..");
    //             filterBy("restaurants_off");
    //         }
    //         console.log("changed " + parseInt(e.target.value))
    //         // var month = parseInt(e.target.value, 10);
    //         // filterBy(month);
    //     });
    // // end: click on legend items
  }); // map load
} // initMap

// When the user begins typing, hide the suggestions placeholder text
$("#search").on("input", function () {
  if ($(this).val()) {
    $(this).addClass("has--value");
  } else {
    $(this).removeClass("has--value");
  }
});

// when clicking on CROSS in searchfield or Logo
$("#clearsearch,#brand").on("click", function () {
  $("#search").val("").trigger("input"); // to trigger above function and add has--value class
  $fetch.triggerAction("get_todos");
});

function createShopLink(card) {
  return "/shop-detail?id=" + card.author;
}

/*window.addEventListener('resize', function(event) {
    //make sure searchbox stickies when intro scales responsiveness
    console.log($( "#intro" ).height());
    $("#intro-wrapper").css({ top: $( "#navbar" ).height() - $( "#intro" ).height()  });
}, true);
*/
