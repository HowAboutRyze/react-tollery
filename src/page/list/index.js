import React from 'react';
import './index.scss';
import fakerData from './fakerData'

import Item from './Item'

const estimatedItemHeight = 80
const bufferSize = 5

class List extends React.Component {

  constructor() {
    super();
    this.state = {
      startOffset: 0,
      endOffset: 0,
      visibleData: [],
      listScrollTop: 0,
    }

    this.data = fakerData(0, true);

    this.startIndex = 0
    this.endIndex = 0
    this.scrollTop = 0

    this.listRef = null
    // this.doc = null
    // 缓存已渲染元素的位置信息
    this.cache = []
    // 缓存锚点元素的位置信息
    this.anchorItem = {
      index: 0, // 锚点元素的索引值
      top: 0, // 锚点元素的顶部距离第一个元素的顶部的偏移量(即 startOffset)
      bottom: 0 // 锚点元素的底部距离第一个元素的顶部的偏移量
    }

    this.handleScroll = this.handleScroll.bind(this)
    this.cachePosition = this.cachePosition.bind(this)
  }

  cachePosition (node, index) {
    const rect = node.getBoundingClientRect()
    // const top = rect.top + window.pageYOffset
    const listDom = document.querySelector('#scrolltop-list');
    const top = rect.top + ((listDom && listDom.scrollTop) || 0);
    this.cache.push({
      index,
      top,
      bottom: top + rect.height
    })
  }

  // 滚动事件处理函数
  handleScroll (e) {
    // if (!this.doc) {
    //   // 兼容 iOS Safari/Webview
    //   this.doc = window.document.body.scrollTop ? window.document.body : window.document.documentElement
    // }
    if (!this.listRef) {
      return;
    }

    // const scrollTop = this.doc.scrollTop
    const scrollTop = this.listRef.scrollTop
    if (scrollTop > this.scrollTop) {
      if (scrollTop > this.anchorItem.bottom) {
        this.updateBoundaryIndex(scrollTop)
        this.updateVisibleData()
      }
    } else if (scrollTop < this.scrollTop) {
      if (scrollTop < this.anchorItem.top) {
        this.updateBoundaryIndex(scrollTop)
        this.updateVisibleData()
      }
    }

    this.scrollTop = scrollTop
  }

  // 计算 startIndex 和 endIndex
  updateBoundaryIndex (scrollTop) {
    scrollTop = scrollTop || 0
    // 用户正常滚动下，根据 scrollTop 找到新的锚点元素位置
    const anchorItem = this.cache.find(item => item.bottom >= scrollTop)
    if (!anchorItem) {
      // 滚的太快，找不到锚点元素，这个暂不处理
      return
    }

    this.anchorItem = {
      ...anchorItem
    }

    this.startIndex = this.anchorItem.index
    this.endIndex = this.startIndex + this.visibleCount
  }

  updateVisibleData () {
    const visibleData = this.data.slice(this.startIndex, this.endIndex)

    this.setState({
      startOffset: this.anchorItem.top,
      endOffset: (this.data.length - this.endIndex) * estimatedItemHeight,
      visibleData
    })
  }

  componentDidMount () {
    // 计算可渲染的元素个数
    // this.visibleCount = Math.ceil(window.innerHeight / estimatedItemHeight) + bufferSize
    if (!this.listRef) {
      return;
    }
    this.visibleCount = Math.ceil(this.listRef.offsetHeight / estimatedItemHeight) + bufferSize
    this.endIndex = this.startIndex + this.visibleCount
    this.updateVisibleData()

    this.listRef.addEventListener('scroll', this.handleScroll, false)
  }

  render () {
    const { startOffset, endOffset, visibleData } = this.state

    return (
      <div className="page-list" id="scrolltop-list" ref={dom => { this.listRef = dom; }}>
        <div className='wrapper' ref={node => { this.wrapper = node }}>
          <div style={{ paddingTop: `${startOffset}px`, paddingBottom: `${endOffset}px` }}>
            {
              visibleData.map((item, index) => {
                return (
                  <Item
                    cachePosition={this.cachePosition}
                    key={this.startIndex + index}
                    item={item}
                    index={this.startIndex + index}
                  />
                )
              })
            }
          </div>
        </div>
      </div>
    )
  }
}

export default List;
