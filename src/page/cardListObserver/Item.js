  
import React, { Component } from 'react';
import { throttle } from '../../lib/utils';

export default class Item extends Component {
  constructor(props) {
    super(props);
    this.state = {
      height: 'auto',
      showContent: true,
      isExposed: false,
    }
    this.node = null;
    this.exposedObserver = null;
    this.contentObserver = null;
  }

  componentDidMount() {
    this.exposedObserver = new IntersectionObserver(throttle((entries) => {
      if (entries[0]) {
        const isIntersecting = entries[0].isIntersecting;
        if (isIntersecting && !this.state.isExposed) {
          this.setState({ isExposed: true });
          console.log('曝光打点:', this.props.index);
        }
      }
    }, 500));
    this.contentObserver = new IntersectionObserver(throttle((entries) => {
      if (entries[0]) {
        const isIntersecting = entries[0].isIntersecting;
        this.setState({ showContent: isIntersecting });
      }
    }, 500), {
      rootMargin: `${window.innerHeight * 5}px`, // 上下5屏
    });

    if (this.node) {
      this.setState({ height: this.node.offsetHeight }, () => {
        this.exposedObserver.observe(this.node);
        this.contentObserver.observe(this.node);
      });
    }
  }

  componentWillUnmount() {
    this.exposedObserver.unobserve(this.node);
    this.contentObserver.unobserve(this.node);
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