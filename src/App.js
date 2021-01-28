import React from 'react';
import './App.css';
import Navibar from './Components/Navbar/Navibar.tsx';
import 'bootstrap/dist/css/bootstrap.min.css';

import  {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";

import {mainPage} from './Pages/mainPage.tsx';
import {advancedSearch} from './Pages/advancedSearch.tsx';
import {lastCard} from './Pages/lastCard.tsx'

function App() {
  return (
    <>
        <Router>
            <Navibar/>
            <Switch>
                <Route exact path="/" component={mainPage}/>
                <Route exact path="/search" component={advancedSearch}/>
                <Route exact path="/lc" component={lastCard}/>
            </Switch>
        </Router>
    </>
  );
}

export default App;
