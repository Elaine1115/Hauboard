<script setup lang="ts">
import vendorData from '../../i18n/locales/vendor-introduction.json'

const { locale } = useI18n()

const vendor = computed(() => {
  const langData = vendorData[locale.value as 'zh' | 'en']
  return {
    ...langData,
    hero: {
      ...langData.hero,
      ...vendorData.common.hero
    }
  }
})

useSeoMeta({
  title: computed(() => vendor.value.seo.title),
  ogTitle: computed(() => vendor.value.seo.title),
  description: computed(() => vendor.value.seo.description),
  ogDescription: computed(() => vendor.value.seo.description),
})
</script>

<template>
  <main class="min-h-screen">
    <!-- Hero Section -->
    <PageHero
      :title="vendor.hero.title"
      :subtitle="vendor.hero.subtitle"
      :background-image="vendor.hero.backgroundImage"
    />

    <!-- Introduction Section -->
    <SectionContainer
      :title="vendor.introduction.title"
      :subtitle="vendor.introduction.subtitle"
      bg-class="bg-gray-900/30"
    >
      <div class="max-w-4xl mx-auto">
        <div class="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm border border-gray-700/30 rounded-2xl p-8 md:p-12 shadow-2xl">
          <div class="space-y-6 text-gray-300 text-lg leading-relaxed">
            <p v-for="(paragraph, index) in vendor.introduction.content" :key="index" class="first:text-xl first:text-gray-200">
              {{ paragraph }}
            </p>
          </div>
        </div>
      </div>
    </SectionContainer>

    <!-- Partners Section -->
    <SectionContainer
      :title="vendor.partners.title"
      bg-class="bg-gray-900/20"
    >
      <div class="space-y-8 max-w-6xl mx-auto">
        <div
          v-for="(partner, index) in vendor.partners.items"
          :key="index"
          class="group relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/40 rounded-2xl p-10 hover:border-emerald-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/10"
        >
          <div class="absolute top-0 left-0 w-40 h-40 bg-emerald-500/5 rounded-full blur-3xl group-hover:bg-emerald-500/10 transition-all duration-300"></div>
          <div class="relative">
            <div class="flex items-center gap-4 mb-6">
              <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <span class="text-3xl">{{ index === 0 ? '🏢' : '🎨' }}</span>
              </div>
              <h3 class="text-3xl font-bold text-white group-hover:text-emerald-400 transition-colors">{{ partner.name }}</h3>
            </div>
            <p class="text-gray-200 text-xl mb-8 leading-relaxed">{{ partner.description }}</p>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div
                v-for="(feature, fIndex) in partner.features"
                :key="fIndex"
                class="flex items-center gap-4 bg-gray-900/40 rounded-lg p-4 border border-gray-700/30 hover:border-emerald-500/30 transition-colors"
              >
                <div class="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <span class="text-emerald-400 text-lg font-bold">✓</span>
                </div>
                <span class="text-gray-200 text-lg">{{ feature }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SectionContainer>

    <!-- Story Section -->
    <SectionContainer
      :title="vendor.story.title"
      :subtitle="vendor.story.subtitle"
      bg-class="bg-gray-900/30"
    >
      <StoryContent :stories="vendor.story.items" />
    </SectionContainer>

    <!-- Certifications Section -->
    <SectionContainer
      :title="vendor.certifications.title"
      bg-class="bg-gray-900/20"
    >
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div
          v-for="(cert, index) in vendor.certifications.items"
          :key="index"
          class="group relative bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm border border-gray-700/40 rounded-2xl p-8 hover:border-emerald-500/50 transition-all duration-300 hover:transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-emerald-500/10"
        >
          <div class="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl group-hover:bg-emerald-500/10 transition-all duration-300"></div>
          <div class="relative">
            <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <span class="text-2xl">{{ index === 0 ? '🌳' : index === 1 ? '🌍' : index === 2 ? '✅' : '📋' }}</span>
            </div>
            <h3 class="text-2xl font-bold text-white mb-4 group-hover:text-emerald-400 transition-colors">{{ cert.title }}</h3>
            <p class="text-gray-300 leading-relaxed text-lg">{{ cert.description }}</p>
          </div>
        </div>
      </div>
    </SectionContainer>
  </main>
</template>
