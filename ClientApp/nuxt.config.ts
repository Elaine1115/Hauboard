export default defineNuxtConfig({
  ssr: true, // 啟用 SSR 以支援 Open Graph 標籤
  nitro: {
    preset: 'static',
    output: {
      publicDir: 'dist'
    }
  },
  future: {
    compatibilityVersion: 4
  },
  devtools: { enabled: true },
  app: {
    head: {
      title: 'HAU BOARD INDUSTRIAL CO., LTD',
      htmlAttrs: { lang: 'en' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'HAU BOARD INDUSTRIAL CO., LTD - Professional board manufacturing and industrial solutions provider.' },
        { name: 'format-detection', content: 'telephone=no' },

        // Open Graph tags for social media (Line, Facebook, etc.)
        { property: 'og:title', content: 'HAU BOARD INDUSTRIAL CO., LTD' },
        { property: 'og:description', content: 'HAU BOARD INDUSTRIAL CO., LTD - Professional MFC provider.' },
        { property: 'og:image', content: 'https://hauboard.com/assets/images/logo/hauboard_1200X630.webp.webp' },
        { property: 'og:url', content: 'https://hauboard.com' },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'HAU BOARD INDUSTRIAL CO., LTD' },

        // Twitter Card tags
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'HAU BOARD INDUSTRIAL CO., LTD' },
        { name: 'twitter:description', content: 'HAU BOARD INDUSTRIAL CO., LTD - Professional MFC provider.' }
      ],
      link: [
        { rel: 'icon', type: 'image/webp', href: '/assets/images/logo/hauboard_icon.webp' },
        { rel: 'apple-touch-icon', href: '/assets/images/logo/hauboard_icon.webp' }
      ]
    }
  },
  css: ['~/assets/css/main.css'],
  modules: [
    '@nuxt/eslint',
    '@nuxtjs/tailwindcss',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@pinia/nuxt',
    '@nuxtjs/i18n'
  ],
  i18n: {
    locales: [
      { code: 'en', name: 'English', file: 'en.json' },
      { code: 'zh', name: '中文', file: 'zh.json' }
    ],
    defaultLocale: 'zh',
    strategy: 'no_prefix',
    langDir: 'locales'
  },
  routeRules: {
    '/': { prerender: true }
  }
})
