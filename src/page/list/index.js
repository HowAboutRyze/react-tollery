import React from 'react';
import './index.scss';
import fakerData from './fakerData'

import Item from './Item'

const estimatedItemHeight = 80
const bufferSize = 5
const loadNum = 20; // 一次加载多少条

class List extends React.Component {

  constructor() {
    super();
    this.state = {
      startOffset: 0,
      endOffset: 0,
      visibleData: [],
      prevRenderData: [], // 用于在屏幕外渲染item并测量高度
      listScrollTop: 0,
    }

    this.data = fakerData(0, 200, false);

    this.startIndex = 0
    this.endIndex = 0
    this.scrollTop = 0

    this.listRef = null
    this.scrollTimer = null;
    // this.doc = null
    // 缓存已渲染元素的位置信息
    this.cache = []
    // 缓存锚点元素的位置信息
    this.anchorItem = {
      index: 0, // 锚点元素的索引值
      top: 0, // 锚点元素的顶部距离第一个元素的顶部的偏移量(即 startOffset)
      bottom: 0 // 锚点元素的底部距离第一个元素的顶部的偏移量
    }

    this.indexOffset = 0; // 总数据的第一个index偏移量，由下拉加载更多引起
    this.prevCache = [];
    this.loadPrev = false;
    this.timerLoad = null;

    this.handleTouchStart = this.handleTouchStart.bind(this); // 监听下拉
    this.handleTouchMove = this.handleTouchMove.bind(this); // 监听下拉
    this.handleTouchEnd = this.handleTouchEnd.bind(this); // 监听下拉
    this.handleScroll = this.handleScroll.bind(this)
    this.cachePosition = this.cachePosition.bind(this)
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
    this.listRef.addEventListener('touchstart', this.handleTouchStart, false);
    this.listRef.addEventListener('touchmove', this.handleTouchMove, false);
    this.listRef.addEventListener('touchend', this.handleTouchEnd, false);
  }

  handleTouchStart (e) {
    if (this.listRef.scrollTop !== 0) {
      return
    }
    this.beginPagY = e.touches[0].pageY
  }

  handleTouchMove (e) {
    if (this.listRef.scrollTop !== 0) {
      return
    }
    this.currentPos = e.touches[0].pageY - this.beginPagY;
    if (this.currentPos <= 0) {
      return;
    }
    this.listRef.style.transform = `translateY(${this.currentPos < 30 ? this.currentPos : 30}px)`;
  }

  handleTouchEnd (e) {
    if (this.currentPos > 30 && !this.loadPrev) {
      // 开始加载
      this.loadPrev = true;
      this.setState({
        prevRenderData: fakerData(this.data.length + 1 + loadNum, loadNum, false)
      }, () => {
        this.indexOffset += loadNum;
        this.data = this.state.prevRenderData.concat(this.data);
        // 轮询查看屏幕外测量是否完成
        this.timerLoad = setInterval(() => {
          if (this.prevCache.length >= loadNum) {
            clearInterval(this.timerLoad);
            const bottomOffset = this.prevCache[this.prevCache.length - 1].bottom;
            // 存储偏移后的数据
            this.cache = this.prevCache
              .concat(this.cache.map(item => {
                item.top += bottomOffset;
                item.bottom += bottomOffset;
                return item;
              }));
            // 更新视图
            const scrollTop = this.listRef.scrollTop + bottomOffset + 1;
            this.updateBoundaryIndex(scrollTop);
            this.updateVisibleData();
            this.prevCache = [];
            this.listRef.scrollTo(0, scrollTop - 1);
            this.setState({ prevRenderData: [] }, () => {
              this.listRef.style.transform = 'translateY(0px)';
              this.loadPrev = false;
            });
          }
        }, 300);
      });
    } else {
      this.listRef.style.transform = 'translateY(0px)';
    }
    this.beginPagY = 0;
    this.currentPos = 0;
  }

  cachePosition (node, index) {
    const rect = node.getBoundingClientRect();
    const listDom = document.querySelector('#scrolltop-list');
    const listRect = listDom.getBoundingClientRect();
    const top = rect.top - listRect.top + listDom.scrollTop;
    console.log('itme', index, top, rect.top, listRect.top)
    // 在屏幕外渲染item并测量高度
    if (this.loadPrev) {
      this.prevCache.push({
        index,
        top,
        bottom: top + rect.height,
      });
      return;
    }
    // 已在屏幕外渲染过并进行缓存，不需要再缓存
    if (this.cache.some(item => item.index === index)) {
      return;
    }
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

    // 若滚动太快来不及渲染item，容易导致滚动到白屏部位，进行滚动校正
    if (scrollTop > this.anchorItem.bottom) {
      this.listRef.scrollTo(0, this.anchorItem.top)
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
    const visibleData = this.data.slice(this.startIndex + this.indexOffset, this.endIndex + this.indexOffset)
    this.setState({
      startOffset: this.anchorItem.top,
      endOffset: (this.data.length - (this.endIndex + this.indexOffset)) * estimatedItemHeight,
      visibleData
    })
  }

  render () {
    const { startOffset, endOffset, visibleData, prevRenderData } = this.state

    return (
      <div className="big-page-list" style={{ marginTop: '50px' }}>
        <div style={{ height: '100px', background: 'red' }} ></div>

        {/* 虚拟列表 start */}
        <div className="virtual-list">
          <div className="page-list" id="scrolltop-list" ref={dom => { this.listRef = dom; }}>
            <div className="hidden-list">
              <div className='wrapper'>
                {
                  prevRenderData.map((item, index) => {
                    return (
                      <Item
                        cachePosition={this.cachePosition}
                        key={this.startIndex - prevRenderData.length + index}
                        item={item}
                        index={this.startIndex - prevRenderData.length + index}
                      />
                    )
                  })
                }
              </div>
            </div>
            <div className='wrapper' ref={node => { this.wrapper = node }}>
              <div style={{ paddingTop: `${startOffset}px`, paddingBottom: `${endOffset > 0 ? endOffset : 0}px` }}>
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
        </div>
        {/* 虚拟列表 end */}

        <div style={{ height: '100px', background: 'red' }} ></div>
      </div>
    )
  }
}

export default List;
