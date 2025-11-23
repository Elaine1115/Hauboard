<script setup lang="ts">
import homeData from '../../i18n/locales/home.json'

const { locale } = useI18n()

const home = computed(() => {
  const langData = homeData[locale.value as 'zh' | 'en']
  return {
    ...langData,
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
    <!-- Hero Section - Bento Grid -->
    <section class="-mt-20 md:-mt-24 pt-20 md:pt-24 relative overflow-hidden bg-gray-950">
      <div class="max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-24 w-full">
        <!-- Two Column Layout -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5">
          <!-- Left Column: Content + Stats -->
          <div class="flex flex-col gap-4 md:gap-5">
            <!-- Content Card -->
            <div class="flex-1 relative rounded-3xl bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm border border-gray-700/50 p-8 md:p-10 flex flex-col justify-center overflow-hidden group">
              <!-- PageHero-style decorative background -->
              <div class="absolute inset-0 overflow-hidden pointer-events-none">
                <!-- Grid pattern -->
                <div class="absolute inset-0 opacity-[0.03]" style="background-image: linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px); background-size: 40px 40px;"></div>

                <!-- Ring shape top-right -->
                <div class="absolute -top-16 -right-16 w-48 h-48 rounded-full border-2 border-emerald-400/20"></div>
                <div class="absolute -top-12 -right-12 w-40 h-40 rounded-full border border-emerald-400/10"></div>

                <!-- Ring shape bottom-left -->
                <div class="absolute -bottom-20 -left-20 w-56 h-56 rounded-full border-2 border-teal-400/15"></div>
                <div class="absolute -bottom-16 -left-16 w-48 h-48 rounded-full border border-teal-400/10"></div>

                <!-- Diagonal lines -->
                <svg class="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                  <line x1="0%" y1="100%" x2="40%" y2="0%" stroke="rgba(52, 211, 153, 0.15)" stroke-width="1" />
                  <line x1="60%" y1="100%" x2="100%" y2="20%" stroke="rgba(45, 212, 191, 0.1)" stroke-width="1" />
                </svg>

                <!-- Small floating dots -->
                <div class="absolute top-[15%] right-[20%] w-2 h-2 rounded-full bg-emerald-400/40"></div>
                <div class="absolute top-[60%] right-[15%] w-1.5 h-1.5 rounded-full bg-teal-400/50"></div>
                <div class="absolute bottom-[25%] left-[25%] w-2 h-2 rounded-full bg-emerald-400/30"></div>
                <div class="absolute top-[30%] left-[10%] w-1 h-1 rounded-full bg-white/40"></div>

                <!-- Glowing orbs -->
                <div class="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-emerald-500/20 blur-3xl"></div>
                <div class="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-teal-500/15 blur-3xl"></div>
              </div>

              <div class="relative z-10">
                <div class="flex items-center gap-3 mb-6">
                  <div class="h-px w-8 bg-emerald-500"></div>
                  <span class="text-emerald-400 text-sm font-medium tracking-widest uppercase">Saviola Group</span>
                </div>
                <h1 class="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                  {{ home.hero.title }}
                </h1>
                <p class="text-base md:text-lg text-gray-300 mb-8 max-w-md leading-relaxed">
                  {{ home.hero.subtitle }}
                </p>
                <div class="flex flex-wrap gap-3">
                  <NuxtLink
                    to="/products"
                    class="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/30"
                  >
                    {{ home.hero.buttons.browseProducts }}
                    <Icon name="ph:arrow-right" class="h-5 w-5" />
                  </NuxtLink>
                </div>
              </div>
              <!-- Hover glow -->
              <div class="absolute -bottom-20 -right-20 w-40 h-40 bg-emerald-500/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>

            <!-- Stats Card -->
            <div class="relative rounded-3xl bg-gradient-to-r from-emerald-900/40 to-teal-900/40 backdrop-blur-sm border border-emerald-500/20 p-6 flex items-center justify-around overflow-hidden">
              <template v-for="(stat, index) in home.hero.stats" :key="stat.value">
                <div class="text-center">
                  <div class="text-3xl md:text-4xl font-bold text-white mb-1">{{ stat.value }}</div>
                  <div class="text-sm text-gray-400">{{ stat.label }}</div>
                </div>
                <div v-if="index < home.hero.stats.length - 1" class="w-px h-12 bg-gray-700"></div>
              </template>
            </div>
          </div>

          <!-- Right Column: Image Cards -->
          <div class="grid grid-cols-2 gap-4 md:gap-5 auto-rows-[180px] md:auto-rows-[200px]">
            <div
              v-for="(card, index) in home.hero.cards"
              :key="card.title"
              :class="[
                'relative rounded-3xl overflow-hidden group cursor-pointer',
                index === 0 ? 'row-span-2' : ''
              ]"
            >
              <img
                :src="card.image"
                :alt="card.title"
                class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent"></div>
              <div :class="['absolute inset-0 flex flex-col justify-between', index === 0 ? 'p-6' : 'p-5']">
                <span
                  :class="[
                    'self-start backdrop-blur-sm text-white text-xs font-semibold rounded-full',
                    index === 0 ? 'px-3 py-1.5 bg-emerald-500/90' : 'px-3 py-1',
                    index === 1 ? 'bg-teal-500/90' : '',
                    index === 2 ? 'bg-cyan-500/90' : ''
                  ]"
                >
                  {{ card.badge }}
                </span>
                <div>
                  <h3 :class="['text-white font-bold', index === 0 ? 'text-xl mb-2' : 'text-lg']">{{ card.title }}</h3>
                  <p v-if="index === 0" class="text-gray-300 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">{{ card.description }}</p>
                </div>
              </div>
              <div v-if="index === 0" class="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            </div>
          </div>
        </div>
      </div>
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
