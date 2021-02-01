import React from 'react';
import './App.css';
import Navibar from './Components/Navbar/Navibar.tsx';
import 'bootstrap/dist/css/bootstrap.min.css';

import  {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";

import {MainPage} from './Pages/mainPage.tsx';
import {AdvancedSearch} from './Pages/advancedSearch.tsx';
import {LastCard} from './Pages/lastCard.tsx'

function App() {
  return (
    <>
        <Router>
            <Navibar/>
            <Switch>
                <Route exact path="/" component={MainPage}/>
                <Route exact path="/search" component={AdvancedSearch}/>
                <Route exact path="/lc" component={LastCard}/>
            </Switch>
        </Router>
    </>
  );
}

export default App;
