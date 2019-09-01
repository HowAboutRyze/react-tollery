import React from 'react';
import './App.css';

import ChineseName from './components/ChineseName';
import TextareaInput from './components/TextareaInput';

class App extends React.Component {

  constructor() {
    super();
    this.state = {
      coinList: []
    }
    this.coinRender = this.coinRender.bind(this);
  }

  componentDidMount() {
    let preventUCDefault = (function() {
      let startX = 0;
      let diffY = 0;
      const bindPreventTouch = function() {
        console.log('bindPreventTouch')
        document.documentElement.addEventListener('touchmove', function(e) {
          e.preventDefault();
        }, false);
      };

      return {
        init : function(ul) {
          console.log(ul)
          const scrollWidth = ul.scrollWidth;

          ul.addEventListener('touchstart', function(e) {
            console.log('touchstart', e)
              startX = e.touches[0].pageX;
          });

          ul.addEventListener('touchmove',function(e) {
            const self = document.querySelector('.xscroll-box');
            diffY = e.touches[0].pageX - startX;
            console.log('touchmove', e, self.scrollLeft, diffY, scrollWidth - self.scrollLeft - ul.offsetWidth)
            if(self.scrollLeft === 0 && diffY > 0) {
              //到最左
              bindPreventTouch();
            }else if((scrollWidth - self.scrollLeft - ul.offsetWidth) < 1 && diffY < 0) {
              //到最右
              bindPreventTouch();
            }
          });

          ul.addEventListener('touchend',function(e) {
            console.log('touchend')
            document.documentElement.removeEventListener('touchmove', function(e) {
              e.preventDefault();
            });
          });
        }
      }
    })();
    
    
    preventUCDefault.init(document.querySelector('.xscroll-box'));
  
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
        <ChineseName />
        <TextareaInput />
        <ul className="xscroll-box">
          <li>112</li>
          <li>112</li>
          <li>112</li>
          <li>112</li>
          <li>112</li>
          <li>112</li>
          <li>112</li>
          <li>112</li>
          <li>112</li>
          <li>112</li>
          <li>112</li>
          <li>112</li>
        </ul>
      </div>
    );
  }
}

export default App;
