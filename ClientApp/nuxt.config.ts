export default defineNuxtConfig({
  ssr: false, // 關閉 SSR，生成靜態網站
  nitro: {
    preset: 'static'
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
        { name: 'description', content: '' },
        { name: 'format-detection', content: 'telephone=no' }
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
    '/': { redirect: '/home' }
  }
})
