<template>
  <section
    ref="heroRef"
    class="relative h-[30vh] md:h-[80vh] overflow-hidden"
  >
    <!-- Layer 1: Deep Background (slowest parallax) -->
    <div
      class="absolute inset-0 bg-cover bg-center bg-no-repeat scale-125 will-change-transform"
      :style="{
        backgroundImage: `url(${backgroundImage})`,
        transform: `translateY(${parallaxLayers.background}px) scale(1.25)`
      }"
    ></div>

    <!-- Layer 2: Gradient overlay - lighter to show shapes -->
    <div
      class="absolute inset-0"
      :class="themeStore.isDark
        ? 'bg-gradient-to-b from-black/50 via-black/20 to-gray-900/90'
        : 'bg-gradient-to-br from-emerald-50/90 via-white/95 to-teal-50/90'"
    ></div>

    <!-- Layer 3: Floating geometric shapes (medium parallax) -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <!-- Large ring - more visible -->
      <div
        class="geometric-shape"
        :class="themeStore.isDark ? 'ring-shape-dark' : 'ring-shape-light'"
        :style="{ transform: `translate(${parallaxLayers.medium}px, ${parallaxLayers.medium * 0.5}px)` }"
      ></div>

      <!-- Second ring bottom left -->
      <div
        class="geometric-shape"
        :class="themeStore.isDark ? 'ring-shape-2-dark' : 'ring-shape-2-light'"
        :style="{ transform: `translate(${-parallaxLayers.slow}px, ${parallaxLayers.slow * 0.3}px)` }"
      ></div>

      <!-- Diagonal lines - more visible -->
      <svg class="absolute w-full h-full" preserveAspectRatio="none">
        <line
          x1="0%" y1="100%" x2="35%" y2="0%"
          :stroke="themeStore.isDark ? 'rgba(52, 211, 153, 0.4)' : 'rgba(16, 185, 129, 0.2)'"
          stroke-width="1"
        />
        <line
          x1="65%" y1="100%" x2="100%" y2="15%"
          :stroke="themeStore.isDark ? 'rgba(45, 212, 191, 0.3)' : 'rgba(20, 184, 166, 0.15)'"
          stroke-width="1"
        />
        <line
          x1="20%" y1="100%" x2="50%" y2="0%"
          :stroke="themeStore.isDark ? 'rgba(52, 211, 153, 0.15)' : 'rgba(16, 185, 129, 0.1)'"
          stroke-width="1"
        />
      </svg>

      <!-- Floating circles at different depths - more visible -->
      <div
        class="absolute w-40 h-40 md:w-72 md:h-72 rounded-full border-2"
        :class="themeStore.isDark ? 'border-emerald-400/30' : 'border-emerald-500/15 md:border-emerald-500/30'"
        :style="{
          top: '10%',
          right: '5%',
          transform: `translateY(${parallaxLayers.fast}px)`
        }"
      ></div>
      <div
        class="absolute w-24 h-24 md:w-40 md:h-40 rounded-full bg-gradient-to-br"
        :class="themeStore.isDark ? 'from-emerald-400/30 to-teal-400/10' : 'from-emerald-500/10 md:from-emerald-500/20 to-teal-500/5 md:to-teal-500/10'"
        :style="{
          bottom: '20%',
          left: '5%',
          transform: `translateY(${parallaxLayers.medium}px)`
        }"
      ></div>
      <div
        class="absolute w-32 h-32 md:w-56 md:h-56 rounded-full border-2"
        :class="themeStore.isDark ? 'border-teal-400/25' : 'border-teal-500/15 md:border-teal-500/25'"
        :style="{
          top: '45%',
          left: '55%',
          transform: `translateY(${parallaxLayers.slow}px)`
        }"
      ></div>

      <!-- Small filled circles -->
      <div
        class="absolute w-4 h-4 rounded-full"
        :class="themeStore.isDark ? 'bg-emerald-400/50' : 'bg-emerald-500/50'"
        :style="{
          top: '25%',
          left: '20%',
          transform: `translateY(${parallaxLayers.fast}px)`
        }"
      ></div>
      <div
        class="absolute w-3 h-3 rounded-full"
        :class="themeStore.isDark ? 'bg-teal-400/60' : 'bg-teal-500/60'"
        :style="{
          top: '65%',
          right: '25%',
          transform: `translateY(${parallaxLayers.medium}px)`
        }"
      ></div>
      <div
        class="absolute w-2 h-2 rounded-full"
        :class="themeStore.isDark ? 'bg-emerald-300/70' : 'bg-emerald-500/40'"
        :style="{
          top: '40%',
          left: '75%',
          transform: `translateY(${parallaxLayers.slow}px)`
        }"
      ></div>

      <!-- Floating dots - bigger and brighter -->
      <div
        v-for="dot in floatingDots"
        :key="dot.id"
        class="absolute w-2 h-2 rounded-full"
        :class="themeStore.isDark ? 'bg-white/60' : 'bg-emerald-600/30'"
        :style="{
          top: dot.top,
          left: dot.left,
          transform: `translateY(${parallaxLayers[dot.speed]}px)`
        }"
      ></div>

      <!-- Glowing orbs - more vibrant -->
      <div
        class="absolute w-[250px] h-[250px] md:w-[500px] md:h-[500px] rounded-full blur-[60px] md:blur-[120px]"
        :class="themeStore.isDark ? 'bg-emerald-500/40' : 'bg-emerald-400/15 md:bg-emerald-400/30'"
        :style="{
          top: '-15%',
          left: '-15%',
          transform: `translateY(${parallaxLayers.slow * 0.5}px)`
        }"
      ></div>
      <div
        class="absolute w-[200px] h-[200px] md:w-[400px] md:h-[400px] rounded-full blur-[50px] md:blur-[100px]"
        :class="themeStore.isDark ? 'bg-teal-500/35' : 'bg-teal-400/10 md:bg-teal-400/25'"
        :style="{
          bottom: '-10%',
          right: '-10%',
          transform: `translateY(${parallaxLayers.medium * 0.5}px)`
        }"
      ></div>
      <div
        class="absolute w-[150px] h-[150px] md:w-[300px] md:h-[300px] rounded-full blur-[40px] md:blur-[80px]"
        :class="themeStore.isDark ? 'bg-cyan-500/25' : 'bg-cyan-400/5 md:bg-cyan-400/15'"
        :style="{
          top: '40%',
          left: '30%',
          transform: `translateY(${parallaxLayers.fast * 0.5}px)`
        }"
      ></div>
    </div>

    <!-- Layer 4: Grid overlay -->
    <div
      class="absolute inset-0"
      :class="themeStore.isDark ? 'opacity-[0.02] hero-grid-dark' : 'opacity-[0.3] md:opacity-[0.5] hero-grid-light'"
    ></div>

    <!-- Layer 5: Content (fastest parallax - moves with scroll) -->
    <div
      class="relative h-full flex items-center justify-center"
      :style="{ transform: `translateY(${parallaxLayers.content}px)` }"
    >
      <div class="text-center px-4 max-w-5xl mx-auto">
        <!-- Decorative line above title -->
        <div class="flex items-center justify-center gap-3 md:gap-4 mb-4 md:mb-8 animate-fade-in">
          <div
            class="h-px w-8 md:w-12 bg-gradient-to-r from-transparent"
            :class="themeStore.isDark ? 'to-emerald-400/60' : 'to-emerald-500/60'"
          ></div>
          <div
            class="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full"
            :class="themeStore.isDark ? 'bg-emerald-400/60' : 'bg-emerald-500/60'"
          ></div>
          <div
            class="h-px w-8 md:w-12 bg-gradient-to-l from-transparent"
            :class="themeStore.isDark ? 'to-emerald-400/60' : 'to-emerald-500/60'"
          ></div>
        </div>

        <h1 class="text-3xl md:text-6xl lg:text-8xl font-bold mb-4 md:mb-8 leading-none tracking-tight animate-fade-in">
          <span
            class="drop-shadow-2xl"
            :class="themeStore.isDark ? 'text-white' : 'text-gray-900'"
          >
            {{ title }}
          </span>
        </h1>

        <p
          v-if="subtitle"
          class="text-base md:text-2xl max-w-3xl mx-auto leading-relaxed animate-fade-in-delay font-light px-2 md:px-0"
          :class="themeStore.isDark ? 'text-gray-300/90' : 'text-gray-600'"
        >
          {{ subtitle }}
        </p>

        <!-- Optional CTA slot -->
        <div v-if="$slots.default" class="mt-6 md:mt-10 animate-fade-in-delay-2">
          <slot></slot>
        </div>
      </div>
    </div>

    <!-- Scroll indicator - hidden on mobile -->
    <div
      v-if="showScrollIndicator"
      class="hidden md:block absolute bottom-10 left-1/2 -translate-x-1/2"
      :style="{ opacity: scrollIndicatorOpacity }"
    >
      <div
        class="flex flex-col items-center gap-3 transition-colors cursor-pointer group"
        :class="themeStore.isDark
          ? 'text-white/50 hover:text-white/80'
          : 'text-gray-500 hover:text-gray-700'"
        @click="scrollToContent"
      >
        <span class="text-[10px] uppercase tracking-[0.2em] font-medium">Explore</span>
        <div
          class="w-6 h-10 rounded-full border flex justify-center pt-2 transition-colors"
          :class="themeStore.isDark
            ? 'border-white/30 group-hover:border-white/50'
            : 'border-gray-400/50 group-hover:border-gray-500'"
        >
          <div
            class="w-1 h-2 rounded-full animate-scroll-dot"
            :class="themeStore.isDark ? 'bg-white/60' : 'bg-gray-500'"
          ></div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'

const themeStore = useThemeStore()

const props = withDefaults(defineProps<{
  title: string
  subtitle?: string
  backgroundImage: string
  showScrollIndicator?: boolean
}>(), {
  showScrollIndicator: true
})

const heroRef = ref<HTMLElement | null>(null)

// Multiple parallax layers with different speeds
const parallaxLayers = reactive({
  background: 0,  // slowest
  slow: 0,
  medium: 0,
  fast: 0,
  content: 0      // fastest (moves most)
})

// Fade out scroll indicator as user scrolls
const scrollIndicatorOpacity = ref(1)

// Generate random floating dots
const floatingDots = [
  { id: 1, top: '20%', left: '15%', speed: 'fast' as const, opacity: 0.6 },
  { id: 2, top: '30%', left: '75%', speed: 'medium' as const, opacity: 0.4 },
  { id: 3, top: '60%', left: '25%', speed: 'slow' as const, opacity: 0.5 },
  { id: 4, top: '70%', left: '85%', speed: 'fast' as const, opacity: 0.3 },
  { id: 5, top: '45%', left: '90%', speed: 'medium' as const, opacity: 0.5 },
  { id: 6, top: '80%', left: '45%', speed: 'slow' as const, opacity: 0.4 },
  { id: 7, top: '25%', left: '55%', speed: 'fast' as const, opacity: 0.35 },
  { id: 8, top: '55%', left: '5%', speed: 'medium' as const, opacity: 0.45 },
]

const handleScroll = () => {
  if (heroRef.value) {
    const rect = heroRef.value.getBoundingClientRect()
    if (rect.bottom > 0) {
      const scrollY = window.scrollY

      // Different speeds for each layer (creates depth)
      parallaxLayers.background = scrollY * 0.5
      parallaxLayers.slow = scrollY * 0.3
      parallaxLayers.medium = scrollY * 0.15
      parallaxLayers.fast = scrollY * 0.08
      parallaxLayers.content = scrollY * 0.1

      // Fade scroll indicator
      scrollIndicatorOpacity.value = Math.max(0, 1 - (scrollY / 200))
    }
  }
}

const scrollToContent = () => {
  if (heroRef.value) {
    const heroHeight = heroRef.value.offsetHeight
    window.scrollTo({
      top: heroHeight - 80,
      behavior: 'smooth'
    })
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
/* Dark mode grid */
.hero-grid-dark {
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.5) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.5) 1px, transparent 1px);
  background-size: 80px 80px;
}

/* Light mode grid - matches home.vue style */
.hero-grid-light {
  background-image:
    linear-gradient(rgba(16, 185, 129, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(16, 185, 129, 0.1) 1px, transparent 1px);
  background-size: 40px 40px;
}

.geometric-shape {
  position: absolute;
  will-change: transform;
}

/* Dark mode ring shapes */
.ring-shape-dark {
  width: 220px;
  height: 220px;
  border: 2px solid rgba(52, 211, 153, 0.25);
  border-radius: 50%;
  top: -60px;
  right: -60px;
}

.ring-shape-dark::before {
  content: '';
  position: absolute;
  inset: 25px;
  border: 2px solid rgba(52, 211, 153, 0.15);
  border-radius: 50%;
}

.ring-shape-dark::after {
  content: '';
  position: absolute;
  inset: 50px;
  border: 1px solid rgba(52, 211, 153, 0.1);
  border-radius: 50%;
}

/* Light mode ring shapes - matches home.vue style */
.ring-shape-light {
  width: 220px;
  height: 220px;
  border: 2px solid rgba(16, 185, 129, 0.3);
  border-radius: 50%;
  top: -60px;
  right: -60px;
}

.ring-shape-light::before {
  content: '';
  position: absolute;
  inset: 25px;
  border: 2px solid rgba(16, 185, 129, 0.2);
  border-radius: 50%;
}

.ring-shape-light::after {
  content: '';
  position: absolute;
  inset: 50px;
  border: 1px solid rgba(16, 185, 129, 0.1);
  border-radius: 50%;
}

/* Dark mode ring shape 2 */
.ring-shape-2-dark {
  width: 180px;
  height: 180px;
  border: 2px solid rgba(45, 212, 191, 0.2);
  border-radius: 50%;
  bottom: -40px;
  left: -40px;
  top: auto;
  right: auto;
}

.ring-shape-2-dark::before {
  content: '';
  position: absolute;
  inset: 20px;
  border: 1px solid rgba(45, 212, 191, 0.12);
  border-radius: 50%;
}

/* Light mode ring shape 2 - matches home.vue style */
.ring-shape-2-light {
  width: 180px;
  height: 180px;
  border: 2px solid rgba(20, 184, 166, 0.25);
  border-radius: 50%;
  bottom: -40px;
  left: -40px;
  top: auto;
  right: auto;
}

.ring-shape-2-light::before {
  content: '';
  position: absolute;
  inset: 20px;
  border: 1px solid rgba(20, 184, 166, 0.15);
  border-radius: 50%;
}

/* Desktop sizes for ring shapes */
@media (min-width: 768px) {
  .ring-shape-dark,
  .ring-shape-light {
    width: 450px;
    height: 450px;
    top: -120px;
    right: -120px;
  }

  .ring-shape-dark::before,
  .ring-shape-light::before {
    inset: 50px;
  }

  .ring-shape-dark::after,
  .ring-shape-light::after {
    inset: 100px;
  }

  .ring-shape-2-dark,
  .ring-shape-2-light {
    width: 350px;
    height: 350px;
    bottom: -80px;
    left: -80px;
  }

  .ring-shape-2-dark::before,
  .ring-shape-2-light::before {
    inset: 40px;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.animate-fade-in-delay {
  opacity: 0;
  animation: fadeIn 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.3s forwards;
}

.animate-fade-in-delay-2 {
  opacity: 0;
  animation: fadeIn 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.5s forwards;
}

@keyframes scrollDot {
  0%, 100% {
    transform: translateY(0);
    opacity: 0.6;
  }
  50% {
    transform: translateY(12px);
    opacity: 0.2;
  }
}

.animate-scroll-dot {
  animation: scrollDot 1.5s ease-in-out infinite;
}
</style>
