<script setup lang="ts">
import homeData from '../../i18n/locales/home.json'

const { t, locale } = useI18n()

const home = computed(() => {
  const langData = homeData[locale.value as 'zh' | 'en']
  return {
    ...langData,
    hero: {
      ...langData.hero,
      ...homeData.common.hero
    },
    cta: {
      ...homeData.common.cta
    }
  }
})

useSeoMeta({
  title: computed(() => home.value.seo.title),
  ogTitle: computed(() => home.value.seo.title),
  description: computed(() => home.value.seo.description),
  ogDescription: computed(() => home.value.seo.description),
});

// Track which videos have been activated (clicked to play)
const activeVideos = ref<Set<number>>(new Set())

const playVideo = (index: number) => {
  activeVideos.value.add(index)
}

const isVideoActive = (index: number) => {
  return activeVideos.value.has(index)
}

// Get YouTube thumbnail URL
const getThumbnail = (videoId: string) => {
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
}
</script>

<template>
  <main class="min-h-screen">
    <!-- Hero Section -->
    <section class="relative h-[50vh] md:h-screen bg-cover bg-center bg-no-repeat" :style="{ backgroundImage: `url(${home.hero.backgroundImage})` }">
      <!-- Overlay with 10% opacity (90% background visibility) -->
      <div class="absolute inset-0 bg-black/10"></div>
    </section>

    <!-- Features Section -->
    <section class="py-20 bg-gray-900/50">
      <div class="mx-auto max-w-6xl px-4 md:px-6">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">
            {{ home.features.title }}
          </h2>
          <p class="text-lg text-gray-300 max-w-2xl mx-auto">
            {{ home.features.subtitle }}
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div
            v-for="feature in home.features.items"
            :key="feature.title"
            class="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:border-emerald-500/50 transition-all duration-300 hover:transform hover:-translate-y-1"
          >
            <Icon :name="feature.icon" class="h-12 w-12 text-emerald-400 mb-4" />
            <h3 class="text-xl font-semibold text-white mb-3">{{ feature.title }}</h3>
            <p class="text-gray-300 leading-relaxed">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Video Section -->
    <section class="py-20 bg-gradient-to-b from-gray-900/50 to-gray-950">
      <div class="mx-auto max-w-6xl px-4 md:px-6">
        <!-- Video Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <div
            v-for="(videoId, index) in home.cta.videos"
            :key="index"
            class="group relative overflow-hidden rounded-2xl bg-gray-800/50 border border-gray-700/50 hover:border-emerald-500/30 transition-all duration-300 shadow-xl shadow-black/20 hover:shadow-emerald-500/10"
          >
            <!-- Video Container with 16:9 Aspect Ratio -->
            <div class="relative w-full aspect-video">
              <!-- Thumbnail Preview (before click) -->
              <div
                v-if="!isVideoActive(index)"
                @click="playVideo(index)"
                class="absolute inset-0 cursor-pointer"
              >
                <!-- Thumbnail Image -->
                <img
                  :src="getThumbnail(videoId)"
                  :alt="`Video ${index + 1}`"
                  class="w-full h-full object-cover rounded-2xl"
                />
                <!-- Dark Overlay -->
                <div class="absolute inset-0 bg-black/30 rounded-2xl transition-all duration-300 group-hover:bg-black/20"></div>
                <!-- Play Button -->
                <div class="absolute inset-0 flex items-center justify-center">
                  <div class="flex h-20 w-20 items-center justify-center rounded-full bg-red-600 text-white shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:bg-red-500">
                    <Icon name="ph:play-fill" class="h-8 w-8 ml-1" />
                  </div>
                </div>
              </div>
              <!-- Actual Video (after click) -->
              <iframe
                v-else
                :src="`https://www.youtube.com/embed/${videoId}?autoplay=1`"
                :title="`Video ${index + 1}`"
                class="absolute inset-0 w-full h-full rounded-2xl"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerpolicy="strict-origin-when-cross-origin"
                allowfullscreen
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
