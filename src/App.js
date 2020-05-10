import React from 'react';
import { connect } from 'react-redux';
import './App.css';

import Choropleth from './components/Choropleth';

class App extends React.Component {

  render() {

    if (this.props.appReducer.isOK) {
      console.log("IT WORKS!!!");
      // console.table(this.props.appReducer.educationData);
      // console.table(this.props.appReducer.countyData);
    }
    return (
      <div className="App">
        <header>
          <h1 id="title">Education in the USA</h1>
          <p id="description">Percentages of adults aged 25 or older with bachelor's degree or higher.</p>
        </header>
        <article>
          <Choropleth />
        </article>
      </div>
    );
  }
  
}

const mapStateToProps = state => ({
  ...state
});


// const mapDispatchToProps = ({
//   pressedKey: (keycode) => dispatch(pressedKey(keycode))
// });

export default connect(mapStateToProps)(App);
