/**
 * Global Navigation System
 *
 * Provides consistent navigation across all pages (homepage, exhibitions, archive, about)
 * Includes language toggle and responsive hamburger menu
 */

export class GlobalNavigation {
  constructor() {
    this.currentLang = document.documentElement.lang || 'zh-CN';
    this.menuOpen = false;
    this.init();
  }

  init() {
    this.render();
    this.attachEventListeners();
    console.log('[GlobalNavigation] Initialized');
  }

  render() {
    // Create navigation HTML
    const nav = document.createElement('nav');
    nav.className = 'global-nav';
    nav.setAttribute('role', 'navigation');
    nav.setAttribute('aria-label', 'Main navigation');

    nav.innerHTML = `
      <div class="nav-container">
        <a href="/" class="nav-logo" aria-label="VULCA Home">
          <span class="logo-text">VULCA</span>
        </a>

        <button
          class="nav-toggle"
          aria-label="Toggle menu"
          aria-expanded="false"
          id="nav-toggle"
        >
          <span class="hamburger-icon">
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>

        <div class="nav-menu" id="nav-menu">
          <ul class="nav-links">
            <li>
              <a href="/" class="nav-link" data-page="home">
                <span lang="zh">🏠 主页</span>
                <span lang="en">🏠 Home</span>
              </a>
            </li>
            <li>
              <a href="/pages/exhibitions-archive.html" class="nav-link" data-page="archive">
                <span lang="zh">📚 展览归档</span>
                <span lang="en">📚 Archive</span>
              </a>
            </li>
            <li>
              <a href="/pages/critics.html" class="nav-link" data-page="critics">
                <span lang="zh">👥 评论家</span>
                <span lang="en">👥 Critics</span>
              </a>
            </li>
            <li>
              <a href="/pages/about.html" class="nav-link" data-page="about">
                <span lang="zh">ℹ️ 关于</span>
                <span lang="en">ℹ️ About</span>
              </a>
            </li>
            <li>
              <a href="/pages/process.html" class="nav-link" data-page="process">
                <span lang="zh">🎨 过程</span>
                <span lang="en">🎨 Process</span>
              </a>
            </li>
          </ul>

          <div class="nav-actions">
            <button
              class="lang-toggle"
              id="lang-toggle"
              aria-label="Toggle language"
            >
              <span class="lang-current">${this.currentLang === 'zh-CN' ? '中' : 'EN'}</span>
              <span class="lang-icon">🌐</span>
            </button>
          </div>
        </div>
      </div>
    `;

    // Insert at the beginning of body
    document.body.insertBefore(nav, document.body.firstChild);

    // Highlight current page
    this.highlightCurrentPage();
  }

  attachEventListeners() {
    // Toggle menu (mobile)
    const toggle = document.getElementById('nav-toggle');
    const menu = document.getElementById('nav-menu');

    if (toggle && menu) {
      toggle.addEventListener('click', () => {
        this.menuOpen = !this.menuOpen;
        toggle.setAttribute('aria-expanded', this.menuOpen);
        menu.classList.toggle('open', this.menuOpen);
        document.body.classList.toggle('nav-open', this.menuOpen);
      });

      // Close menu when clicking outside
      document.addEventListener('click', (e) => {
        if (this.menuOpen && !e.target.closest('.global-nav')) {
          this.menuOpen = false;
          toggle.setAttribute('aria-expanded', 'false');
          menu.classList.remove('open');
          document.body.classList.remove('nav-open');
        }
      });
    }

    // Language toggle
    const langToggle = document.getElementById('lang-toggle');
    if (langToggle) {
      langToggle.addEventListener('click', () => {
        this.toggleLanguage();
      });
    }

    // Close menu when clicking nav link (mobile)
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        if (this.menuOpen) {
          this.menuOpen = false;
          toggle.setAttribute('aria-expanded', 'false');
          menu.classList.remove('open');
          document.body.classList.remove('nav-open');
        }
      });
    });
  }

  highlightCurrentPage() {
    const path = window.location.pathname;
    let currentPage = 'home';

    if (path.includes('/exhibitions/')) {
      currentPage = 'exhibition';
    } else if (path.includes('/exhibitions-archive')) {
      currentPage = 'archive';
    } else if (path.includes('/critics')) {
      currentPage = 'critics';
    } else if (path.includes('/about')) {
      currentPage = 'about';
    } else if (path.includes('/process')) {
      currentPage = 'process';
    }

    // Add active class to current link
    document.querySelectorAll('.nav-link').forEach(link => {
      if (link.dataset.page === currentPage) {
        link.classList.add('active');
      }
    });
  }

  toggleLanguage() {
    const newLang = this.currentLang === 'zh-CN' ? 'en' : 'zh-CN';
    this.currentLang = newLang;

    // Update HTML lang attribute
    document.documentElement.lang = newLang;

    // Update button text
    const langCurrent = document.querySelector('.lang-current');
    if (langCurrent) {
      langCurrent.textContent = newLang === 'zh-CN' ? '中' : 'EN';
    }

    // Trigger language change event for other components
    const event = new CustomEvent('langchange', { detail: { lang: newLang } });
    window.dispatchEvent(event);

    // Store preference
    localStorage.setItem('preferredLang', newLang);

    console.log('[GlobalNavigation] Language changed to:', newLang);
  }

  // Static method to initialize from HTML
  static init() {
    // Restore language preference
    const savedLang = localStorage.getItem('preferredLang');
    if (savedLang) {
      document.documentElement.lang = savedLang;
    }

    // Create navigation
    new GlobalNavigation();
  }
}

// Auto-initialize when imported as module
if (typeof window !== 'undefined') {
  window.GlobalNavigation = GlobalNavigation;

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => GlobalNavigation.init());
  } else {
    GlobalNavigation.init();
  }
}
