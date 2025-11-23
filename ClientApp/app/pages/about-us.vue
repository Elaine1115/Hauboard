<script setup lang="ts">
import aboutData from '../../i18n/locales/about-us.json'

const { locale } = useI18n()
const themeStore = useThemeStore()

const about = computed(() => {
  const langData = aboutData[locale.value as 'zh' | 'en']
  return {
    ...langData,
    hero: {
      ...langData.hero,
      ...aboutData.common.hero
    }
  }
})

useSeoMeta({
  title: computed(() => about.value.seo.title),
  ogTitle: computed(() => about.value.seo.title),
  description: computed(() => about.value.seo.description),
  ogDescription: computed(() => about.value.seo.description),
})
</script>

<template>
  <main class="min-h-screen">
    <!-- Hero Section -->
    <PageHero
      :title="about.hero.title"
      :subtitle="about.hero.subtitle"
      :background-image="about.hero.backgroundImage"
    />

    <!-- Introduction Section -->
    <SectionContainer
      :title="about.introduction.title"
      :subtitle="about.introduction.subtitle"
    >
      <div class="max-w-4xl mx-auto">
        <div
          class="backdrop-blur-sm rounded-2xl p-8 md:p-12 shadow-2xl"
          :class="themeStore.isDark
            ? 'bg-gradient-to-br from-gray-800/40 to-gray-900/40 border border-gray-700/30'
            : 'bg-white/80 border border-gray-200'"
        >
          <div class="space-y-6 text-lg leading-relaxed">
            <p
              v-for="(paragraph, index) in about.introduction.content"
              :key="index"
              :class="[
                themeStore.isDark ? 'text-gray-300' : 'text-gray-600',
                index === 0 ? (themeStore.isDark ? 'text-xl text-gray-200' : 'text-xl text-gray-700') : ''
              ]"
            >
              {{ paragraph }}
            </p>
          </div>
        </div>
      </div>
    </SectionContainer>

    <!-- Timeline Section -->
    <SectionContainer
      :title="about.timeline.title"
      :subtitle="about.timeline.subtitle"
    >
      <Timeline :events="about.timeline.events" />
    </SectionContainer>

  </main>
</template>
