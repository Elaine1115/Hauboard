<template>
  <section
    ref="heroRef"
    class="relative h-[40vh] md:h-[80vh] overflow-hidden"
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
    <div class="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-gray-900/90"></div>

    <!-- Layer 3: Floating geometric shapes (medium parallax) -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <!-- Large ring - more visible -->
      <div
        class="geometric-shape ring-shape"
        :style="{ transform: `translate(${parallaxLayers.medium}px, ${parallaxLayers.medium * 0.5}px)` }"
      ></div>

      <!-- Second ring bottom left -->
      <div
        class="geometric-shape ring-shape-2"
        :style="{ transform: `translate(${-parallaxLayers.slow}px, ${parallaxLayers.slow * 0.3}px)` }"
      ></div>

      <!-- Diagonal lines - more visible -->
      <svg class="absolute w-full h-full" preserveAspectRatio="none">
        <line
          x1="0%" y1="100%" x2="35%" y2="0%"
          stroke="rgba(52, 211, 153, 0.4)"
          stroke-width="1"
        />
        <line
          x1="65%" y1="100%" x2="100%" y2="15%"
          stroke="rgba(45, 212, 191, 0.3)"
          stroke-width="1"
        />
        <line
          x1="20%" y1="100%" x2="50%" y2="0%"
          stroke="rgba(52, 211, 153, 0.15)"
          stroke-width="1"
        />
      </svg>

      <!-- Floating circles at different depths - more visible -->
      <div
        class="absolute w-72 h-72 rounded-full border-2 border-emerald-400/30"
        :style="{
          top: '10%',
          right: '5%',
          transform: `translateY(${parallaxLayers.fast}px)`
        }"
      ></div>
      <div
        class="absolute w-40 h-40 rounded-full bg-gradient-to-br from-emerald-400/30 to-teal-400/10"
        :style="{
          bottom: '20%',
          left: '5%',
          transform: `translateY(${parallaxLayers.medium}px)`
        }"
      ></div>
      <div
        class="absolute w-56 h-56 rounded-full border-2 border-teal-400/25"
        :style="{
          top: '45%',
          left: '55%',
          transform: `translateY(${parallaxLayers.slow}px)`
        }"
      ></div>

      <!-- Small filled circles -->
      <div
        class="absolute w-4 h-4 rounded-full bg-emerald-400/50"
        :style="{
          top: '25%',
          left: '20%',
          transform: `translateY(${parallaxLayers.fast}px)`
        }"
      ></div>
      <div
        class="absolute w-3 h-3 rounded-full bg-teal-400/60"
        :style="{
          top: '65%',
          right: '25%',
          transform: `translateY(${parallaxLayers.medium}px)`
        }"
      ></div>
      <div
        class="absolute w-2 h-2 rounded-full bg-emerald-300/70"
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
        class="absolute w-2 h-2 rounded-full bg-white/60"
        :style="{
          top: dot.top,
          left: dot.left,
          transform: `translateY(${parallaxLayers[dot.speed]}px)`
        }"
      ></div>

      <!-- Glowing orbs - more vibrant -->
      <div
        class="absolute w-[500px] h-[500px] rounded-full blur-[120px] bg-emerald-500/40"
        :style="{
          top: '-15%',
          left: '-15%',
          transform: `translateY(${parallaxLayers.slow * 0.5}px)`
        }"
      ></div>
      <div
        class="absolute w-[400px] h-[400px] rounded-full blur-[100px] bg-teal-500/35"
        :style="{
          bottom: '-10%',
          right: '-10%',
          transform: `translateY(${parallaxLayers.medium * 0.5}px)`
        }"
      ></div>
      <div
        class="absolute w-[300px] h-[300px] rounded-full blur-[80px] bg-cyan-500/25"
        :style="{
          top: '40%',
          left: '30%',
          transform: `translateY(${parallaxLayers.fast * 0.5}px)`
        }"
      ></div>
    </div>

    <!-- Layer 4: Grid overlay -->
    <div class="absolute inset-0 opacity-[0.02] hero-grid"></div>

    <!-- Layer 5: Content (fastest parallax - moves with scroll) -->
    <div
      class="relative h-full flex items-center justify-center"
      :style="{ transform: `translateY(${parallaxLayers.content}px)` }"
    >
      <div class="text-center px-4 max-w-5xl mx-auto">
        <!-- Decorative line above title -->
        <div class="flex items-center justify-center gap-4 mb-8 animate-fade-in">
          <div class="h-px w-12 bg-gradient-to-r from-transparent to-emerald-400/60"></div>
          <div class="w-2 h-2 rounded-full bg-emerald-400/60"></div>
          <div class="h-px w-12 bg-gradient-to-l from-transparent to-emerald-400/60"></div>
        </div>

        <h1 class="text-4xl md:text-6xl lg:text-8xl font-bold mb-8 leading-none tracking-tight animate-fade-in">
          <span class="text-white drop-shadow-2xl">
            {{ title }}
          </span>
        </h1>

        <p v-if="subtitle" class="text-lg md:text-2xl text-gray-300/90 max-w-3xl mx-auto leading-relaxed animate-fade-in-delay font-light">
          {{ subtitle }}
        </p>

        <!-- Optional CTA slot -->
        <div v-if="$slots.default" class="mt-10 animate-fade-in-delay-2">
          <slot></slot>
        </div>
      </div>
    </div>

    <!-- Scroll indicator -->
    <div
      v-if="showScrollIndicator"
      class="absolute bottom-10 left-1/2 -translate-x-1/2"
      :style="{ opacity: scrollIndicatorOpacity }"
    >
      <div
        class="flex flex-col items-center gap-3 text-white/50 hover:text-white/80 transition-colors cursor-pointer group"
        @click="scrollToContent"
      >
        <span class="text-[10px] uppercase tracking-[0.2em] font-medium">Explore</span>
        <div class="w-6 h-10 rounded-full border border-white/30 flex justify-center pt-2 group-hover:border-white/50 transition-colors">
          <div class="w-1 h-2 rounded-full bg-white/60 animate-scroll-dot"></div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'

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
.hero-grid {
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.5) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.5) 1px, transparent 1px);
  background-size: 80px 80px;
}

.geometric-shape {
  position: absolute;
  will-change: transform;
}

.ring-shape {
  width: 450px;
  height: 450px;
  border: 2px solid rgba(52, 211, 153, 0.25);
  border-radius: 50%;
  top: -120px;
  right: -120px;
}

.ring-shape::before {
  content: '';
  position: absolute;
  inset: 50px;
  border: 2px solid rgba(52, 211, 153, 0.15);
  border-radius: 50%;
}

.ring-shape::after {
  content: '';
  position: absolute;
  inset: 100px;
  border: 1px solid rgba(52, 211, 153, 0.1);
  border-radius: 50%;
}

.ring-shape-2 {
  width: 350px;
  height: 350px;
  border: 2px solid rgba(45, 212, 191, 0.2);
  border-radius: 50%;
  bottom: -80px;
  left: -80px;
  top: auto;
  right: auto;
}

.ring-shape-2::before {
  content: '';
  position: absolute;
  inset: 40px;
  border: 1px solid rgba(45, 212, 191, 0.12);
  border-radius: 50%;
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
