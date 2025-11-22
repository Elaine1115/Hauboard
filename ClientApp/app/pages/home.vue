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
            <div class="h-12 w-12 mb-4">
              <Icon :name="feature.icon" class="h-12 w-12 text-emerald-400" />
            </div>
            <h3 class="text-xl font-semibold text-white mb-3">{{ feature.title }}</h3>
            <p class="text-gray-300 leading-relaxed">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Applications Section -->
    <section class="py-20">
      <div class="mx-auto max-w-6xl px-4 md:px-6">
        <ClientOnly>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <!-- Image Side -->
            <div class="relative">
              <div class="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-800">
                <img
                  :src="home.applications.image"
                  alt="Melamine Chipboard Applications"
                  class="absolute inset-0 w-full h-full object-cover"
                  loading="eager"
                />
              </div>
              <!-- Decorative Element -->
              <div class="absolute -bottom-4 -right-4 w-24 h-24 bg-emerald-500/20 rounded-2xl -z-10"></div>
              <div class="absolute -top-4 -left-4 w-16 h-16 bg-emerald-500/10 rounded-xl -z-10"></div>
            </div>

            <!-- Content Side -->
            <div>
              <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">
                {{ home.applications.title }}
              </h2>
              <p class="text-lg text-gray-300 mb-8">
                {{ home.applications.subtitle }}
              </p>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div
                  v-for="app in home.applications.items"
                  :key="app.title"
                  class="flex items-center gap-4 p-4 rounded-xl bg-gray-800/30 border border-gray-700/50 hover:border-emerald-500/30 transition-colors"
                >
                  <div class="flex-shrink-0 h-8 w-8">
                    <Icon :name="app.icon" class="h-8 w-8 text-emerald-400" />
                  </div>
                  <div>
                    <h3 class="text-white font-semibold mb-1">{{ app.title }}</h3>
                    <p class="text-gray-400 text-sm">{{ app.description }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ClientOnly>
      </div>
    </section>

    <!-- Specifications Section -->
    <section class="py-20 bg-gray-900/50">
      <div class="mx-auto max-w-6xl px-4 md:px-6">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <!-- Content Side -->
          <div class="order-2 lg:order-1">
            <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">
              {{ home.specifications.title }}
            </h2>
            <p class="text-lg text-gray-300 mb-8">
              {{ home.specifications.subtitle }}
            </p>

            <div class="space-y-6">
              <div
                v-for="spec in home.specifications.items"
                :key="spec.thickness"
                class="relative p-6 rounded-xl bg-gray-800/50 border border-gray-700/50 hover:border-emerald-500/30 transition-colors"
              >
                <!-- Thickness Badge -->
                <div class="absolute -top-3 left-6">
                  <span class="px-4 py-1 bg-emerald-500 text-white text-sm font-bold rounded-full">
                    {{ spec.thickness }}
                  </span>
                </div>

                <div class="mt-2">
                  <h3 class="text-xl font-semibold text-white mb-2">{{ spec.title }}</h3>
                  <p class="text-gray-400 mb-4">{{ spec.description }}</p>

                  <!-- Use Cases Tags -->
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="use in spec.uses"
                      :key="use"
                      class="px-3 py-1 bg-gray-700/50 text-gray-300 text-sm rounded-full"
                    >
                      {{ use }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Image Side -->
          <div class="relative order-1 lg:order-2">
            <div class="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-800">
              <img
                :src="home.specifications.image"
                alt="Panel Specifications"
                class="absolute inset-0 w-full h-full object-cover"
                loading="eager"
                @error="($event.target as HTMLImageElement).src = 'https://placehold.co/800x600/1f2937/6b7280?text=Specifications'"
              />
            </div>
            <!-- Decorative Element -->
            <div class="absolute -bottom-4 -left-4 w-24 h-24 bg-emerald-500/20 rounded-2xl -z-10"></div>
            <div class="absolute -top-4 -right-4 w-16 h-16 bg-emerald-500/10 rounded-xl -z-10"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- Design Gallery Section -->
    <section class="py-20">
      <div class="mx-auto max-w-6xl px-4 md:px-6">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">
            {{ home.gallery.title }}
          </h2>
          <p class="text-lg text-gray-300 max-w-2xl mx-auto">
            {{ home.gallery.subtitle }}
          </p>
        </div>

        <!-- Gallery Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            v-for="(project, index) in home.gallery.items"
            :key="index"
            class="group relative overflow-hidden rounded-xl"
          >
            <!-- Design Image -->
            <div class="aspect-[4/3] overflow-hidden bg-gray-800">
              <img
                :src="project.image"
                :alt="project.title"
                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                @error="($event.target as HTMLImageElement).src = 'https://placehold.co/400x300/1f2937/6b7280?text=Project'"
              />
            </div>
            <!-- Overlay -->
            <div class="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300"></div>
            <!-- Content -->
            <div class="absolute inset-0 flex flex-col justify-end p-4">
              <span class="text-emerald-400 text-sm font-medium mb-1">{{ project.category }}</span>
              <h3 class="text-white font-semibold text-lg group-hover:text-emerald-300 transition-colors">{{ project.title }}</h3>
            </div>
          </div>
        </div>

        <!-- View All Button -->
        <div class="text-center mt-12">
          <NuxtLink
            to="/virtual-design"
            class="inline-flex items-center gap-2 px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/30"
          >
            {{ home.gallery.viewAll }}
            <Icon name="ph:arrow-right" class="h-5 w-5" />
          </NuxtLink>
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
