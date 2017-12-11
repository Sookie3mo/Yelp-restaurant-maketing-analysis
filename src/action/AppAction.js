import axios from 'axios';

// --- fake data for test only ---
// import { yelp_sample_response_1 } from '../yelp_sample_response';
// import { yelp_sample_response_2 } from '../yelp_sample_response_2';
// --- end ---

export const TOGGLE_AREA = 'TOGGLE_AREA';
export const ADD_AREA = 'ADD_AREA';
export const REMOVE_AREA = 'REMOVE_AREA';
export const ANALYZE_AREA = 'ANALYZE_AREA';
export const DELETE_AREA = 'DELETE_AREA';
export const TOGGLE_COMP = 'TOGGLE_COMP';
export const TOGGLE_LOADING = 'TOGGLE_LOADING';

// actions for map view and select area to add
export function toggleArea(data) {  // data: pass in the "key" of the area whose selected status is to be changed
  console.log("--- action toggleArea called ---", data);
  return {
    type: TOGGLE_AREA,
    payload: data,
  };
}

export function addArea(data) {  // data: pass in the whole area element to be added
  console.log("--- action addArea called ---", data);
  return {
    type: ADD_AREA,
    payload: data,
  };
}

export function removeArea(data) {  // data: pass in the "key" of the area to remove
  console.log("--- action removeArea called ---", data);
  return {
    type: REMOVE_AREA,
    payload: data,
  };
}

export function analyzeArea(data) {  // data: pass in the "key" of the area to analyze
  console.log("--- action analyzeArea called ---", data);
  return {
    type: ANALYZE_AREA,
    payload: data,
  };
}

export function toggleComp(data) {  // take boolean
  return {
    type: TOGGLE_COMP,
    payload: data,
  }
}

function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1);
  var a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ;
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}

export function toggleLoading(data) {
  return {
    type: TOGGLE_LOADING,
    payload: data,
  };
}

// actions for fetch data based on the area selected:
export function fetchYelpData(queryData, cb) {
  // const queryData = {
  //   center: '',
  //   bound: '',
  //   searchInfo: '',
  //   key: new Date().getTime(),  // to ensure it is unique
  //   title: "My title",  // can use the palce name if user used "search", otherwise use the country/state/city/street of the center point?
  //   yelpData: [],  // should fetch the restaurants information inside current area from the server
  // }
  const { center, bound } = queryData;
  let radius = Math.floor(getDistanceFromLatLonInKm(center.lat, center.lng, bound.north, center.lng) * 1000);
  console.log('------- radius --------', radius);


  // send request to fetch data from our server
  // console.log("--- action fetchYelpData called ---", queryData, yelp_sample_response_2);
  return (dispatch) => {
    dispatch(toggleLoading(true));
    var timer = window.setTimeout(() => { dispatch(toggleLoading(false)); }, 8000)
    //axios.get(`http://localhost:8080/RestaurantMarketAnalysis/search?lat=37.38&lon=-122.08`)
    axios.get(`http://ec2-52-15-74-36.us-east-2.compute.amazonaws.com:8080/RestaurantMarketAnalysis/search?lat=${center.lat}&lon=${center.lng}&radius=${radius > 40000 ? 40000 : radius}`) // ----- need to check and add more parameters and explaination
    // axios.get('http://ec2-18-217-97-36.us-east-2.compute.amazonaws.com:8080/RestaurantMarketAnalysis/search?lat=37.38&lon=-122.09&radius=10000&limit=50')
      .then(response => {
        // after fetched the restaurants list (suppose yelp_sample_response_2 is the response data):
        const areaData = {
          ...queryData,
          yelpData: response.data,
        };
        console.log(" * Success! fetchYelpData 0000", response);
        if (!response.data || response.data.length === 0) {
          if (cb) cb(true, 'No restaurants in this area');
          return;
        }
        dispatch(addArea(areaData));
        window.clearTimeout(timer);
        dispatch(toggleLoading(false));
        if (cb) cb(false, areaData);
      })
      .catch(error => {
        console.log('Error fetching and parsing data', error);
        if (cb) cb(true, error);
      });
  }
}
