import React from 'react';
import './index.scss';
import fakerData from './fakerData';

import Item from './Item'


class CardListObserver extends React.Component {

  constructor() {
    super();
    this.children = [];
    this.data = fakerData(0, 1000);
  }

  render () {
    return (
      <div className="card-list card-list-observer">
        {
          this.data.map(item => (
            <Item
              key={item.id}
              item={item}
              index={item.id}
            />
          ))
        }
      </div>
    )
  }
}

export default CardListObserver;
