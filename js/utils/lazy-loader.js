/**
 * VULCA Lazy Loader
 *
 * 图片懒加载工具，使用 IntersectionObserver 实现
 */

window.VULCALazyLoader = (function() {
  'use strict';

  const CONFIG = {
    // 预加载距离（像素）
    rootMargin: '200px 0px',
    // 触发阈值
    threshold: 0.01,
    // 占位符 SVG（4:3 宽高比，品牌色背景）
    placeholderSVG: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect fill='%23f5f0eb' width='400' height='300'/%3E%3Ctext x='200' y='150' text-anchor='middle' fill='%23ccc' font-family='sans-serif' font-size='14'%3ELoading...%3C/text%3E%3C/svg%3E`
  };

  let observer = null;
  let preloadQueue = [];

  /**
   * 初始化 IntersectionObserver
   */
  function initObserver() {
    if (observer) return;

    if (!('IntersectionObserver' in window)) {
      console.warn('[LazyLoader] IntersectionObserver not supported, loading all images');
      loadAllImages();
      return;
    }

    observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          loadImage(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: CONFIG.rootMargin,
      threshold: CONFIG.threshold
    });
  }

  /**
   * 加载单张图片
   */
  function loadImage(img) {
    const src = img.dataset.src;
    if (!src) return;

    // 添加加载状态
    img.classList.add('lazy-loading');

    // 创建新图片对象预加载
    const tempImg = new Image();
    tempImg.onload = function() {
      img.src = src;
      img.removeAttribute('data-src');
      img.classList.remove('lazy-loading', 'lazy-placeholder');
      img.classList.add('lazy-loaded');
    };
    tempImg.onerror = function() {
      console.error('[LazyLoader] Failed to load:', src);
      img.classList.remove('lazy-loading');
      img.classList.add('lazy-error');
    };
    tempImg.src = src;
  }

  /**
   * 降级处理：加载所有图片
   */
  function loadAllImages() {
    const images = document.querySelectorAll('img[data-src]');
    images.forEach(loadImage);
  }

  /**
   * 观察图片元素
   */
  function observe(img) {
    if (!observer) initObserver();
    if (observer && img.dataset.src) {
      observer.observe(img);
    }
  }

  /**
   * 预加载指定图片（用于轮播预加载）
   */
  function preload(src) {
    if (!src || preloadQueue.includes(src)) return;

    preloadQueue.push(src);
    const img = new Image();
    img.src = src;
    img.onload = () => {
      const index = preloadQueue.indexOf(src);
      if (index > -1) preloadQueue.splice(index, 1);
    };
  }

  /**
   * 创建带懒加载的图片元素
   */
  function createLazyImage(src, alt, options = {}) {
    const img = document.createElement('img');
    img.alt = alt || '';
    img.classList.add('lazy-placeholder');

    if (options.eager) {
      // 首屏图片：立即加载
      img.src = src;
      img.loading = 'eager';
      if (options.priority) {
        img.fetchPriority = 'high';
      }
    } else {
      // 非首屏：懒加载
      img.src = CONFIG.placeholderSVG;
      img.dataset.src = src;
      img.loading = 'lazy';
      observe(img);
    }

    // 添加可选类名
    if (options.className) {
      img.className += ' ' + options.className;
    }

    return img;
  }

  /**
   * 获取占位符 SVG
   */
  function getPlaceholder() {
    return CONFIG.placeholderSVG;
  }

  // 公共 API
  return {
    init: initObserver,
    observe: observe,
    preload: preload,
    loadImage: loadImage,
    createLazyImage: createLazyImage,
    getPlaceholder: getPlaceholder
  };

})();

// 自动初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', window.VULCALazyLoader.init);
} else {
  window.VULCALazyLoader.init();
}
