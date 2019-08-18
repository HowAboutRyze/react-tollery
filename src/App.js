import React from 'react';
import './App.css';

class App extends React.Component {

  constructor() {
    super();
    this.state = {
      coinList: []
    }
    this.coinRender = this.coinRender.bind(this);
  }
  coinRender() {
    const list = [...new Array(6).keys()];
    this.setState({ coinList: list });
    setTimeout(() => {
      this.setState({ coinList: [] });
    }, 1000);
  }
  renderFly() {
    return (
      <div className="box">
        {
          this.coinList.map(item => <i className={"coin fly coin" + item } key={item}></i>)
        }
      </div>
    )
  }

  render() {
    return (
      <div className="app">
        <header className="header">
          <i className="coin"></i>
          100
        </header>
        <main className="header">
          <button onClick={this.coinRender}>点我</button>
          <div className="box">
            {
              this.state.coinList.map(item => <i className={"coin fly coin" + item } key={item}></i>)
            }
          </div>
        </main>
      </div>
    );
  }
}

export default App;
