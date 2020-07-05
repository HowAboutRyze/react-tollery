  import React, { Component } from 'react'

export default class Item extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showConter: true,
      height: 'auto',
    };

    this.node = null;
    this.observer = null;
  }

  componentDidMount () {
    this.observer = new IntersectionObserver((entries) => {
      console.log(entries[0])
      if (entries[0]) {
        this.setState({ showConter: entries[0].isIntersecting });
      }
    }, {
      root: document.getElementById('observer-list'),
      rootMargin: `${window.innerHeight * 2}px`, // 上下2屏
    });

    if (this.node) {
      this.setState({ height: this.node.offsetHeight }, () => {
        this.observer.observe(this.node)
      });
    }
  }

  componentWillUnmount() {
    this.observer.unobserve(this.node);
  }

  render () {
    const { height, showConter } = this.state;
    const { index, item } = this.props

    return (
      <div className='list-item' style={{ height }} ref={node => { this.node = node }}>
        {
          showConter ? (
            <>
              <p>#{index} {item.words}说：</p>
              <p>{item.paragraphs}</p>
            </>
          ) : null
        }
      </div>
    )
  }
}