export function constructGeoJson(restaurants) {
  return {
    "type": "FeatureCollection",
    "features": restaurants.map(ele => {
      return {
        "type": "Feature",
        "properties": ele,
        "geometry": {
          "type": "Point",
          "coordinates": [
            ele.longitude,
            ele.latitude
          ]
        },
        "id": ele.item_id
      };
    })
  }
}

export function getColor(percentage) {
  const color2 = [255,255,155];
  const color1 = [255,0,0];
  const w1 = percentage;
  const w2 = 1 - percentage;

  return `rgb(${Math.round(color1[0] * w1 + color2[0] * w2)},
      ${Math.round(color1[1] * w1 + color2[1] * w2)},
      ${Math.round(color1[2] * w1 + color2[2] * w2)})`;
}

export function constructInfoToShow(features) {
  return ['name', 'phone', 'category', 'address', 'price', 'rating', 'review_count'].reduce((res, ele) => {
    if (!features[ele]) return res;
    let value = features[ele];
    if (ele === 'address') value = value.replace('"','');
    if (ele === 'price') value = parsePrice(value);
    res += `${ele.replace('_', '')}: ${value}\r\n`;
    return res;
  }, '');
}

export function findMaxMin(areaList, currentFeature) {
  let MAX = areaList[0].ranges[currentFeature].max;
  let MIN = areaList[0].ranges[currentFeature].min;
  let MAXAVG = areaList[0].ranges[currentFeature].avg;
  let MINAVG = areaList[0].ranges[currentFeature].avg;
  let SUM = 0;
  let CNT = 0;
  areaList.forEach(ele => {
    if (ele.ranges[currentFeature].max > MAX) MAX = ele.ranges[currentFeature].max;
    if (ele.ranges[currentFeature].min < MIN) MIN = ele.ranges[currentFeature].min;
    if (ele.ranges[currentFeature].avg > MAXAVG) MAXAVG = ele.ranges[currentFeature].avg;
    if (ele.ranges[currentFeature].avg < MINAVG) MINAVG = ele.ranges[currentFeature].avg;
    SUM += ele.yelpData.length * ele.ranges[currentFeature].avg;
    CNT += ele.yelpData.length;
  });
  return { MAX, MIN, MAXAVG, MINAVG, AVG: SUM/CNT, CNT, SUM };
}

export function isSameArray(arr1, arr2) {
  return arr1.length === arr2.length && arr1.every((ele, index) => { return ele.key === arr2[index].key; });
}

export function parsePrice(price) {
  var dollars = '';
  for (var i=0; i<Math.round(price); i++) {
    dollars += '$';
  };
  if (Math.round(price) == price) {
    return dollars || '<$';
  } else {
    return `${dollars} (${price})`;
  }

}

// reference: https://snazzymaps.com/style/229/simple-and-light
export const mapTheme = [
    {
        "featureType": "administrative",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "geometry",
        "stylers": [
            {
                "visibility": "simplified"
            },
            {
                "color": "#fcfcfc"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [
            {
                "visibility": "simplified"
            },
            {
                "color": "#fcfcfc"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [
            {
                "visibility": "simplified"
            },
            {
                "color": "#dddddd"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "geometry",
        "stylers": [
            {
                "visibility": "simplified"
            },
            {
                "color": "#dddddd"
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "geometry",
        "stylers": [
            {
                "visibility": "simplified"
            },
            {
                "color": "#eeeeee"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
            {
                "visibility": "simplified"
            },
            {
                "color": "#dddddd"
            }
        ]
    }
]

// reference: https://snazzymaps.com/style/60/blue-gray
export const mapTheme2 = [
      {
          "featureType": "water",
          "stylers": [
              {
                  "visibility": "on"
              },
              {
                  "color": "#b5cbe4"
              }
          ]
      },
      {
          "featureType": "landscape",
          "stylers": [
              {
                  "color": "#efefef"
              }
          ]
      },
      {
          "featureType": "road.highway",
          "elementType": "geometry",
          "stylers": [
              {
                  "color": "#83a5b0"
              }
          ]
      },
      {
          "featureType": "road.arterial",
          "elementType": "geometry",
          "stylers": [
              {
                  "color": "#bdcdd3"
              }
          ]
      },
      {
          "featureType": "road.local",
          "elementType": "geometry",
          "stylers": [
              {
                  "color": "#ffffff"
              }
          ]
      },
      {
          "featureType": "poi.park",
          "elementType": "geometry",
          "stylers": [
              {
                  "color": "#e3eed3"
              }
          ]
      },
      {
          "featureType": "administrative",
          "stylers": [
              {
                  "visibility": "on"
              },
              {
                  "lightness": 33
              }
          ]
      },
      {
          "featureType": "road"
      },
      {
          "featureType": "poi.park",
          "elementType": "labels",
          "stylers": [
              {
                  "visibility": "on"
              },
              {
                  "lightness": 20
              }
          ]
      },
      {},
      {
          "featureType": "road",
          "stylers": [
              {
                  "lightness": 20
              }
          ]
      }
  ]
