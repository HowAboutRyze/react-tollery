/**
 * 节流函数
 * @param {function} fn 执行函数
 * @param {number} wait 等待时间
 */
export function throttle(fn, wait) {
  let timer = null;
  return function () {
    const context = this;
    const args = arguments;
    if (!timer) {
      timer = setTimeout(() => {
        fn.apply(context, args);
        timer = null;
      }, wait);
    }
  }
}