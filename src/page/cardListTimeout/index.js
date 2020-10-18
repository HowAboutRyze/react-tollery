import React from 'react';
import './index.scss';
import fakerData from './fakerData';
import { throttle } from '../../lib/utils';

import Item from './Item'

// TODO: 没完成，想清楚先
class CardListTimeout extends React.Component {

  constructor() {
    super();
    this.children = [];
    this.data = fakerData(0, 1000);
  }

  componentDidMount() {
    window.addEventListener('scroll', this.scrollHandle);
    this.scrollHandle();
  }

  // 滚动执行函数
  scrollHandle = throttle(() => {
    console.log('scroll', this.children);
    this.children.forEach(item => {
      item.scrollHandle();
    })
  }, 500)

  // 记录 Item
  cacheRefs = (item) => {
    this.children.push(item);
  }

  render () {
    return (
      <div className="card-list card-list-event">
        {
          this.data.map(item => (
            <Item
              key={item.id}
              item={item}
              index={item.id}
              ref={this.cacheRefs}
            />
          ))
        }
      </div>
    )
  }
}

export default CardListTimeout;
