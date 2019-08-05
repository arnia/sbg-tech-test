import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import './App.scss';
import Home from '../../routes/Home';

function App() {
  return (
    <Router>
      <Route path="/" exact component={Home} />
    </Router>
  );
}

export default App;
