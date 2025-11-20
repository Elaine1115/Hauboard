export const useLanguageStore = defineStore('language', () => {
  const currentLang = ref<'en' | 'zh'>('en')

  const setLanguage = (lang: 'en' | 'zh') => {
    currentLang.value = lang
  }

  const isEnglish = computed(() => currentLang.value === 'en')
  const isChinese = computed(() => currentLang.value === 'zh')

  return {
    currentLang,
    setLanguage,
    isEnglish,
    isChinese,
  }
})
