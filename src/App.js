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
import {OpenCard} from './Pages/OpenCard.tsx'
import {TestForUser} from './Pages/TestForUser'
import {CreateUserTest} from './Components/UserTests/CreateUserTest'

function App() {
  return (
    <>
        <Router>
            <Navibar/>
            <Switch>
                <Route exact path="/" component={MainPage}/>
                <Route exact path="/search" component={AdvancedSearch}/>
                <Route exact path="/lc" component={OpenCard}/>
                <Route exact path="/test" component={TestForUser}/>
                <Route exact path='/test/n' component={CreateUserTest}/>
            </Switch>
        </Router>
    </>
  );
}

export default App;
