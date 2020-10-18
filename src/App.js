import React from 'react';
import './App.css';

import Index from './page/index';
import List from './page/list';
import ObserverList from './page/observerList';
import CardListEvent from './page/cardListEvent';
import CardListTimeout from './page/cardListTimeout';
import CardListObserver from './page/cardListObserver';

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
      case 'list': {
        Child = List;
        break;
      }
      case 'observerlist': {
        Child = ObserverList;
        break;
      }
      case 'cardListEvent': {
        Child = CardListEvent;
        break;
      }
      case 'cardListTimeout': {
        Child = CardListTimeout;
        break;
      }
      case 'cardListObserver': {
        Child = CardListObserver;
        break;
      }
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
