import React, { Component } from 'react';
import './App.css';
import SnakeGame from './SnakeGame';
import Navbar from './Navbar';
import Description from './Description';
import LeaderBoards from './LeaderBoards';

class App extends Component {
  render() {
    return (
      <div>
        <Navbar />
        <div className="container">
          <div className="row">

            <div className="col-12 col-xs-12 col-sm-12 col-md-12 col-lg-7 col-xl-7">
              <SnakeGame />
            </div>

            <div className="container col-12 col-xs-12 col-sm-12 col-md-12 col-lg-5 col-xl-5">
              <div className="row">
                <LeaderBoards />
              </div>
              <br />
              <div className="row">
                <Description />
              </div>

            </div>

          </div>
        </div>
      </div>
    );
  }
}

export default App;
