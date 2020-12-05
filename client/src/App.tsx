import React from 'react';
import './App.css';
import { WelcomePage } from './components/welcom_page/WelcomePage';

class App extends React.Component {
  render() {
    return (
      <div className="app">
        <WelcomePage />
      </div>
    );
  }
}

export default App;
