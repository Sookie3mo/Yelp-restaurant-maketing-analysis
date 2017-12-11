
## Topic: Restaurant Marketing Analysis

### Introduction
The restaurant information presented in the system is derived from Yelp Fusion API, which provides a wealth of data from over 50 million businesses. The Apache Tomcat Server is deployed as back end to fetch data from Yelp Fusion API as well as preprocess and format data. The React.JS framework is built as user interfaces to visualize information
and present graphs and charts implemented via D3.JS and Google Map API.

The final system receives location and area information as input chosen by users, and automatically shows multiple corresponding charts with interactive effects. In addition, the system also generates comprehensive analysis graphs to help comparisons of restaurant markets among various areas. These helps to find out areas with higher dinning consuming level, areas with higher rating on restaurants of specific categories, areas with higher people density and so on for investment decision making.

### Group members:
* Yiming Liu
* Tianxin Zhao
* Dongyu Li

### Website:
  * http://18.217.55.107:3000/
### Paper:
  * https://github.com/Sookie3mo/Yelp-restaurant-maketing-analysis/presentation_final/inf554-project-report.pdf  (PDF version in this repo)
  * https://www.overleaf.com/read/zrkkmfffrjgt (Read Only)

### Video:
  * https://youtu.be/ve10OtEXpmQ

### Development:
  * We used React.js for the web app; Dependencies and versions can be found in 'package.json'.
    package.json:
    {
      "name": "project-404",
      "version": "0.1.0",
      "private": true,
      "dependencies": {
        "antd": "^2.13.9",
        "axios": "^0.17.1",
        "d3": "^4.11.0",
        "react": "^15.6.2",
        "react-app-rewire-less": "^2.1.0",
        "react-app-rewired": "^1.3.5",
        "react-dom": "^15.6.2",
        "react-redux": "^5.0.6",
        "react-router": "^4.2.0",
        "react-scripts": "1.0.17",
        "react-scroll": "^1.6.7",
        "redux": "^3.7.2",
        "redux-thunk": "^2.2.0"
      },
      "scripts": {
        "start": "react-scripts start",
        "build": "react-scripts build",
        "test": "react-scripts test --env=jsdom",
        "eject": "react-scripts eject"
      },
      "theme": {
        "primary-color": "#CD4F39"
      }
    }
  * To run our application on local:
    * checkout our repository:
      ```
      > git clone https://github.com/INF554Fall17/project-404.git
      > cd project-404
      > npm install
      > npm start
      ```
    * open your browser, go to `localhost:3000`
