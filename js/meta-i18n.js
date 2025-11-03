/**
 * Meta Tags Internationalization
 * Updates SEO meta tags based on language
 * Part of: implement-full-site-bilingual-support OpenSpec change
 */

const META_I18N = {
  'description': {
    '/': {
      zh: '潮汐的负形 - VULCA艺术展览',
      en: 'Negative Space of the Tide - VULCA Art Exhibition'
    },
    '/index.html': {
      zh: '潮汐的负形 - VULCA艺术展览',
      en: 'Negative Space of the Tide - VULCA Art Exhibition'
    },
    '/pages/about.html': {
      zh: '关于VULCA - AI艺术评论实验系统，探索跨时代评论家视角和RPAIT五维评论框架',
      en: 'About VULCA - AI-powered art criticism experimental system exploring cross-temporal critic perspectives and RPAIT five-dimensional framework'
    },
    '/pages/critics.html': {
      zh: 'VULCA艺术评论家简介 - 了解6位跨越时代的艺术评论家如何评价当代艺术',
      en: 'VULCA Art Critics - Discover how 6 cross-temporal critics evaluate contemporary art'
    },
    '/pages/process.html': {
      zh: 'VULCA系统开发过程 - 研究设计、角色建模、评论生成、数据验证的完整流程',
      en: 'VULCA Development Process - Complete workflow of research design, persona modeling, critique generation, and data validation'
    }
  },
  'og:description': {
    '/': {
      zh: '探索AI艺术评论的实验系统',
      en: 'Explore AI-powered art criticism experimental system'
    },
    '/index.html': {
      zh: '探索AI艺术评论的实验系统',
      en: 'Explore AI-powered art criticism experimental system'
    },
    '/pages/about.html': {
      zh: '了解VULCA系统、研究目标、系统架构和研究意义',
      en: 'Learn about VULCA system, research objectives, architecture, and significance'
    },
    '/pages/critics.html': {
      zh: '认识VULCA展览的6位艺术评论家及其评论维度',
      en: 'Meet 6 art critics of VULCA exhibition and their critique dimensions'
    },
    '/pages/process.html': {
      zh: 'VULCA系统从研究设计到展示应用的完整开发流程',
      en: 'Complete development process from research design to exhibition application'
    }
  }
};

function updateMetaTags(lang) {
  const path = window.location.pathname;

  // Update description
  const descMeta = document.querySelector('meta[name="description"]');
  if (descMeta && META_I18N.description[path]) {
    descMeta.setAttribute('content', META_I18N.description[path][lang]);
  }

  // Update og:description
  const ogDescMeta = document.querySelector('meta[property="og:description"]');
  if (ogDescMeta && META_I18N['og:description'][path]) {
    ogDescMeta.setAttribute('content', META_I18N['og:description'][path][lang]);
  }

  console.log(`[Meta i18n] Meta tags updated to: ${lang}`);
}

// Export for use in other modules
if (typeof window !== 'undefined') {
  window.updateMetaTags = updateMetaTags;
}

console.log('✓ Meta i18n loaded');
