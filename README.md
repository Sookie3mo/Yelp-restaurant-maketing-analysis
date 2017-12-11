# INF 554 project

## Topic: Restaurant Marketing Analysis

### Group members:
* Yiming Liu
* Tianxin Zhao
* Dongyu Li

### Website:
  * http://18.217.55.107:3000/
### Paper:
  * https://github.com/INF554Fall17/project-404/blob/master/presentation_final/inf554-project-report.pdf (PDF version in this repo)
  * https://www.overleaf.com/read/zrkkmfffrjgt (Read Only)
  * https://www.overleaf.com/12516143ncstwftgdctt#/47676482/ (Read and Edit)
### Video:
  * https://youtu.be/ve10OtEXpmQ
### Presentation PDF:
  * https://github.com/INF554Fall17/project-404/blob/master/presentation_final/404_RMA.pdf

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
