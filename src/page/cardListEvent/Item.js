  
import React, { Component } from 'react'

export default class Item extends Component {
  constructor(props) {
    super(props);
    this.state = {
      height: 'auto',
      showContent: true,
      isExposed: false,
    }
    this.node = null;
  }

  componentDidMount() {
    if (this.node) {
      this.setState({ height: this.node.offsetHeight });
    }
  }

  scrollHandle = () => {
    const viewHeight = window.innerHeight || document.documentElement.clientHeight;
    const viewHeightDouble = viewHeight * 5;
    const {
      top,
      bottom,
    } = this.node.getBoundingClientRect();
    if (bottom >= 0 && top <= viewHeight && !this.state.isExposed) {
      this.setState({ isExposed: true });
      console.log('曝光打点:', this.props.index);
    }
    if (bottom >= -viewHeightDouble && top <= viewHeightDouble) {
      if (!this.state.showContent) {
        this.setState({ showContent: true });
      }
    } else {
      if (this.state.showContent) {
        this.setState({ showContent: false });
      }
    }
  }

  render () {
    const { height, showContent, isExposed } = this.state;
    const { index, item } = this.props;

    return (
      <div className='list-item' style={{ height }} ref={node => { this.node = node }}>
        {
          showContent ? (
            <>
              <p>#{index} {item.words}说：</p>
              <p>{item.paragraphs}</p>
              <div className={`img-wrap ${isExposed ? '' : 'gray-bg'}`}>
                {isExposed ? <img src={item.image} alt="img" /> : null}
              </div>
            </>
          ) : null
        }
      </div>
    )
  }
}