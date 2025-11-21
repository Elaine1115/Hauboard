<template>
  <section
    class="relative h-[50vh] md:h-[70vh] bg-cover bg-center bg-no-repeat overflow-hidden"
    :style="{ backgroundImage: `url(${backgroundImage})` }"
  >
    <!-- Gradient overlay for better text readability -->
    <div class="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60"></div>

    <!-- Animated subtle grid overlay -->
    <div class="absolute inset-0 opacity-10 hero-grid"></div>

    <div class="relative h-full flex items-center justify-center">
      <div class="text-center px-4 max-w-5xl mx-auto">
        <h1 class="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight animate-fade-in">
          {{ title }}
        </h1>
        <div v-if="subtitle" class="w-20 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent mx-auto mb-6"></div>
        <p v-if="subtitle" class="text-xl md:text-3xl text-gray-100 max-w-3xl mx-auto leading-relaxed animate-fade-in-delay">
          {{ subtitle }}
        </p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  subtitle?: string
  backgroundImage: string
}>()
</script>

<style scoped>
.hero-grid {
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
  background-size: 50px 50px;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.8s ease-out;
}

.animate-fade-in-delay {
  animation: fadeIn 0.8s ease-out 0.2s both;
}
</style>
