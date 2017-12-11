const google = window.google;

export function initMap( DOMNode, initCenter, DOMNodeForSearchBox, handleSearchCallback, handleCenterChangeCallback, handleBoundsCHangeCallback, mapTheme ) {
  if (!DOMNode) {
    return null;
  }

  var map = new google.maps.Map( DOMNode, {
    center: initCenter || {lat: 34.022, lng: -118.288},
    zoom: 13,
    mapTypeId: 'roadmap',
    styles: mapTheme,
  });


  if (DOMNodeForSearchBox) {
    // // Create the search box and link it to the UI element.
    // var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(DOMNodeForSearchBox);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(DOMNodeForSearchBox);
  }

  // Bias the SearchBox results towards current map's viewport.
  map.addListener('bounds_changed', function() {
    const LatLngBoundsObj = map.getBounds();
    if (searchBox) { searchBox.setBounds( LatLngBoundsObj ); }
    if (handleBoundsCHangeCallback) { handleBoundsCHangeCallback( LatLngBoundsObj ); }
  });

  map.addListener('center_changed', function() {
    const LatLngObj = map.getCenter();
    if (handleCenterChangeCallback) { handleCenterChangeCallback( LatLngObj ); }
  });

  var markers = [];
  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  if (searchBox) {
    searchBox.addListener('places_changed', function() {
      var places = searchBox.getPlaces();

      if (places.length == 0) {
        return;
      }

      // Clear out the old markers.
      markers.forEach(function(marker) {
        marker.setMap(null);
      });
      markers = [];

      // For each place, get the icon, name and location.
      var bounds = new google.maps.LatLngBounds();
      places.forEach(function(place) {
        if (!place.geometry) {
          console.log("Returned place contains no geometry");
          return;
        }
        var icon = {
          url: place.icon,
          size: new google.maps.Size(71, 71),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(17, 34),
          scaledSize: new google.maps.Size(25, 25)
        };

        // Create a marker for each place.
        let curMarker = new google.maps.Marker({
          map: map,
          icon: icon,
          title: place.name,
          position: place.geometry.location
        });

        curMarker.addListener('click', function() {
          map.setZoom(14);
          map.setCenter(curMarker.getPosition());
          if (handleSearchCallback) { handleSearchCallback(curMarker); }
          // Clear out the other markers.
          markers.forEach(function(marker) {
            if(marker !== curMarker) marker.setMap(null);
          });
        });

        markers.push(curMarker);

        if (place.geometry.viewport) {
          // Only geocodes have viewport.
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }
      });

      // if only one place in the search result, suppose the user intend to selecting this place
      if (markers.length === 1) {
        if (handleSearchCallback) { handleSearchCallback(markers[0]); }
      }
      map.fitBounds(bounds);
    });
  }

  function CenterControl(controlDiv, map) {

    // Set CSS for the control border.
    var controlUI = document.createElement('div');
    controlUI.style.backgroundColor = 'rgba(255,255,255,0.6)';
    controlUI.style.border = '1px solid #e0e0e0';
    controlUI.style.cursor = 'pointer';
    controlUI.style.marginBottom = '10px';
    controlUI.style.textAlign = 'center';
    controlUI.title = 'Click to recenter the map';
    controlDiv.appendChild(controlUI);

    // Set CSS for the control interior.
    var controlText = document.createElement('div');
    controlText.style.color = 'rgb(25,25,25)';
    controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
    controlText.style.fontSize = '12px';
    controlText.style.lineHeight = '20px';
    controlText.style.paddingLeft = '5px';
    controlText.style.paddingRight = '5px';
    controlText.innerHTML = 'My Location';
    controlUI.appendChild(controlText);

    // Setup the click event listeners: simply set the map to Chicago.
    controlUI.addEventListener('click', function() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
          var pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          map.setCenter(pos);
        }, function() {

        });
      } else {
        // Browser doesn't support Geolocation

      }
    });

  }
  // Create the DIV to hold the control and call the CenterControl()
  // constructor passing in this DIV.
  var centerControlDiv = document.createElement('div');
  var centerControl = new CenterControl(centerControlDiv, map);

  centerControlDiv.index = 1;
  map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(centerControlDiv);

  return map;
}
