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
</script>

<style scoped>
.bubble {
  position: absolute;
  bottom: -150px;
  background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.3), rgba(200, 200, 200, 0.15));
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.2);
  animation: bubbleFloat linear infinite;
  opacity: 0.7;
  backdrop-filter: blur(2px);
}

@keyframes bubbleFloat {
  0% {
    transform: translateY(0) translateX(0) scale(1);
    opacity: 0;
  }
  10% {
    opacity: 0.6;
  }
  90% {
    opacity: 0.6;
  }
  100% {
    transform: translateY(-600px) translateX(50px) scale(1.2);
    opacity: 0;
  }
}
</style>

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
            <div class="text-5xl mb-4">{{ feature.icon }}</div>
            <h3 class="text-xl font-semibold text-white mb-3">{{ feature.title }}</h3>
            <p class="text-gray-300 leading-relaxed">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Products Section -->
    <section class="py-20">
      <div class="mx-auto max-w-6xl px-4 md:px-6">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">
            {{ home.products.title }}
          </h2>
          <p class="text-lg text-gray-300 max-w-2xl mx-auto">
            {{ home.products.subtitle }}
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div
            v-for="product in home.products.items"
            :key="product.title"
            class="group relative overflow-hidden rounded-xl bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 hover:border-emerald-500/50 transition-all duration-300"
          >
            <div class="p-8">
              <div class="text-6xl mb-6 text-center">{{ product.image }}</div>
              <h3 class="text-2xl font-semibold text-white mb-3 text-center">{{ product.title }}</h3>
              <p class="text-gray-300 text-center mb-6">{{ product.description }}</p>
              <div class="text-center">
                <NuxtLink
                  :to="`/product/${product.title.toLowerCase().replace(/\s+/g, '-')}`"
                  class="inline-flex items-center text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
                >
                  {{ home.products.learnMore }}
                  <svg class="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                  </svg>
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="relative w-full h-[300px] md:h-[450px] overflow-hidden">
      <img
        :src="home.cta.image"
        alt=""
        class="w-full h-full object-cover"
      />
      <!-- Animated bubbles overlay -->
      <div class="absolute inset-0 overflow-hidden">
        <div class="bubble" v-for="n in 15" :key="n" :style="(() => {
          const size = 60 + Math.random() * 80;
          return {
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 8}s`,
            animationDuration: `${8 + Math.random() * 6}s`,
            width: `${size}px`,
            height: `${size}px`
          };
        })()"></div>
      </div>
    </section>
  </main>
</template>
