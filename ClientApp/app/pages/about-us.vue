<script setup lang="ts">
import aboutData from '../../i18n/locales/about-us.json'

const { locale } = useI18n()
const themeStore = useThemeStore()

const about = computed(() => {
  const lang = locale.value as 'zh' | 'en'
  const suffix = `_${lang}`

  return {
    seo: {
      title: aboutData.seo[`title${suffix}` as keyof typeof aboutData.seo] as string,
      description: aboutData.seo[`description${suffix}` as keyof typeof aboutData.seo] as string
    },
    hero: {
      title: aboutData.hero[`title${suffix}` as keyof typeof aboutData.hero] as string,
      subtitle: aboutData.hero[`subtitle${suffix}` as keyof typeof aboutData.hero] as string
    },
    introduction: {
      title: aboutData.introduction[`title${suffix}` as keyof typeof aboutData.introduction] as string,
      content: aboutData.introduction[`content${suffix}` as keyof typeof aboutData.introduction] as string[]
    },
    mission: {
      title: aboutData.mission[`title${suffix}` as keyof typeof aboutData.mission] as string,
      content: aboutData.mission[`content${suffix}` as keyof typeof aboutData.mission] as string[]
    },
    values: {
      title: aboutData.values[`title${suffix}` as keyof typeof aboutData.values] as string,
      items: aboutData.values.items.map(item => ({
        title: item[`title${suffix}` as keyof typeof item] as string,
        description: item[`description${suffix}` as keyof typeof item] as string
      }))
    },
    contact: {
      title: aboutData.contact[`title${suffix}` as keyof typeof aboutData.contact] as string,
      description: aboutData.contact[`description${suffix}` as keyof typeof aboutData.contact] as string
    },
    timeline: {
      title: aboutData.timeline[`title${suffix}` as keyof typeof aboutData.timeline] as string,
      subtitle: aboutData.timeline[`subtitle${suffix}` as keyof typeof aboutData.timeline] as string,
      events: aboutData.timeline.events.map(event => ({
        year: event.year,
        title: event[`title${suffix}` as keyof typeof event] as string,
        description: event[`description${suffix}` as keyof typeof event] as string
      }))
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
    />

    <!-- Introduction Section -->
    <SectionContainer
      :title="about.introduction.title"
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
              :class="themeStore.isDark ? 'text-gray-300' : 'text-gray-600'"
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
