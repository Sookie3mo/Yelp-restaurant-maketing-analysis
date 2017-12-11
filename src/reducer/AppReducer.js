
// --- fake data for test only ---
// import { yelp_sample_response_1 } from '../yelp_sample_response';
// import { yelp_sample_response_2 } from '../yelp_sample_response_2';
// --- end ---

import { TOGGLE_AREA, ADD_AREA, REMOVE_AREA, ANALYZE_AREA, TOGGLE_COMP, TOGGLE_LOADING } from '../action/AppAction';

const initAppState = {
  // areaList: [
  //   {key: "test1", title:"Test 1", yelpData: yelp_sample_response_1, selected: true},
  //   {key: "test2", title:"Test 2", yelpData: yelp_sample_response_2},
  // ],
  areaList: [
  ],
  areaToShow: '', // store key of the area to show
  comprehensive: false,
  loading: false,
};

function AppReducer(state = initAppState, action) {
  switch (action.type) {
    case TOGGLE_AREA:
      const newList = state.areaList.map(ele => {
        // console.log("===ele.key===", ele.key);
        // console.log("===action.payload===", action.payload);
        if (ele.key === action.payload) ele.selected = !ele.selected;
        return ele;
      });
      return {
        ...state,
        areaList: newList,
      };
    case ADD_AREA:
      let extendedList = state.areaList.map(ele =>  ele);
      // selected set to true when add the map data
      action.payload["selected"] = true;
      action.payload.ranges = ['price', 'rating', 'review_count'].reduce((res, feature) => {
        let min = Math.min.apply(Math, action.payload.yelpData.map(function(o){return o[feature];}));
        let avg = action.payload.yelpData.reduce((res, ele) => res+ele[feature], 0) / action.payload.yelpData.length;
        let max = Math.max.apply(Math, action.payload.yelpData.map(function(o){return o[feature];}));
        res[feature] = {min, avg, max};
        return res;
      }, {});
      extendedList.push(action.payload);
      return {
        ...state,
        areaList: extendedList,
        areaToShow: action.payload.key,
      };
    case REMOVE_AREA:
      let removedList = state.areaList.filter(ele => ele.key !== action.payload);
      let newAreaToShow = state.areaToShow === action.payload ? (removedList.length ? removedList[0].key : '') : state.areaToShow;
      return {
        ...state,
        areaList: removedList,
        areaToShow: newAreaToShow,
      };
    case ANALYZE_AREA:
      return {
        ...state,
        areaToShow: action.payload,
        comprehensive: false,
      };
    case TOGGLE_COMP:
      return {
        ...state,
        comprehensive: action.payload,
      };
    case TOGGLE_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    default:
      return state;
  }
}

export default AppReducer;

export const getAreaList = state => state.app.areaList;
export const getAreaToShow = state => state.app.areaToShow;
export const getComprehensive = state => state.app.comprehensive;
export const getLoading = state => state.app.loading;
