import React from 'react';
import './index.scss';

import ChineseName from '../../components/ChineseName';
import TextareaInput from '../../components/TextareaInput';

class Index extends React.Component {

  constructor() {
    super();
    this.state = {
      coinList: []
    }
    this.coinRender = this.coinRender.bind(this);
    this.videoEl = React.createRef();
  }

  componentDidMount() {
    let preventUCDefault = (function() {
      let startX = 0;
      let diffY = 0;
      const bindPreventTouch = function() {
        // console.log('bindPreventTouch')
        document.documentElement.addEventListener('touchmove', function(e) {
          e.preventDefault();
        }, false);
      };

      return {
        init : function(ul) {
          // console.log(ul)
          const scrollWidth = ul.scrollWidth;

          ul.addEventListener('touchstart', function(e) {
            // console.log('touchstart', e)
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
            // console.log('touchend')
            document.documentElement.removeEventListener('touchmove', function(e) {
              e.preventDefault();
            });
          });
        }
      }
    })();
    
    
    preventUCDefault.init(document.querySelector('.xscroll-box'));

    // uc浏览器左右翻页的功能，好像这两句就解决了
    // document.documentElement.addEventListener('touchmove', function(e) {
    //   e.preventDefault();
    // }, false);
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
  playVideo = () => {
    this.videoEl.current.play();
  }

  render() {
    return (
      <div className="page-index">
        <header className="header">
          <i className="coin"></i>
          100
        </header>
        <main className="header-btn">
          <button onClick={this.coinRender}>点我</button>
          <div className="box">
            {
              this.state.coinList.map(item => <i className={"coin fly coin" + item } key={item}></i>)
            }
          </div>
        </main>
        <h2>Router:------------------</h2>
        <ul>
          <li><a href="#/list">List</a></li>
          {/* <li><a href="#/inbox">Inbox</a></li> */}
        </ul>
        <p>router end-----------------<br /><br /></p>
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
        <div className="video-wrap">
          <video
            ref={this.videoEl}
            src="https://www.w3school.com.cn/i/movie.ogg"
            poster="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1574578866003&di=635859f0959d5053392e7f8bef507e60&imgtype=0&src=http%3A%2F%2F5b0988e595225.cdn.sohucs.com%2Fimages%2F20181118%2F506c96391e1d4b7f8a27baf23c902369.gif"
            width="300"
            height="200"
            onClick={this.playVideo}
          ></video>
        </div>
      </div>
    );
  }
}

export default Index;
