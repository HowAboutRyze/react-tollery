import React from 'react';
import './index.scss';
import fakerData from '../list/fakerData';
import Item from './item';

/**
 * 使用 IntersectionObserver API 监听列表单元是否进入目标区域进行展示的列表
 * 优化长列表性能
 */

export default class ObserverList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: fakerData(0, 200, false),
    };
  }

  render() {
    const { list } = this.state;
    return (
      <div className="page-observer-list" style={{ marginTop: '50px' }}>
        <div style={{ height: '100px', background: 'red' }}></div>

        <div className="observer-list" id="observer-list">
          {
            list.map(item => <Item key={item.id} item={item} index={item.id}/>)
          }
        </div>

        <div style={{ height: '100px', background: 'red' }} ></div>
      </div>
    );
  }
}