import React, { Component } from 'react';
import { Row, Button } from 'antd';
import history from '../../routerHistory';

// var yelpAPI = require('../yelpAPI.js');
// console.log(yelpAPI);
// const members = [
//   {
//     name: 'Yiming Liu',
//     description: 'description',
//     image: 'image'
//   },
//   {
//     name: 'Tianxin Zhao',
//     description: 'description',
//     image: 'image'
//   },
//   {
//     name: 'Dongyu Li',
//     description: 'description',
//     image: 'image'
//   },
// ];

class LandingPage extends Component {

  render(){
    // const memberCards = members.map( (ele, index) => {
    //   return <div className="singleMember" key={index} >
    //             <img src={ ele.image } alt={ ele.image } />
    //             <h3>{ ele.name }</h3>
    //             <p>{ ele.description }</p>
    //          </div>
    // } );
    // var a = yelpAPI.search({term: 'food', location: '90210', limit: 10})
    // .then(function (data) {
    //   console.log(data);
    // })
    // .catch(function (err) {
    //   console.error(err);
    // });
    // console.log(a);
    return (
      <div className="homepage">
        <Row className="homeContent">
          <h1 className="homeTitle">Restaurant Market Analysis</h1>
          <Button type="dashed" size="large" className="homeButton" onClick={()=>{history.push('/analysis')}}>START EXPLORE</Button>
        </Row>
      </div>
    );
  }
}

export default LandingPage;
