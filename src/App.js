import React from 'react';
import './App.css';

import Index from './page/index';
import List from './page/list';

class App extends React.Component {

  constructor() {
    super();
    this.state = {
      route: window.location.hash.substr(1),
    }
  }

  componentDidMount() {
    window.addEventListener('hashchange', () => {
      this.setState({
        route: window.location.hash.substr(1)
      });
    })
  }

  render() {
    let Child
    switch (this.state.route) {
      case '/list': Child = List; break;
      default: Child = Index;
    }
    return (
      <div className="app">
        <Child />
      </div>
    );
  }
}

export default App;
