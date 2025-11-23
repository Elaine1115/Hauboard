<script setup lang="ts">
import qualityData from '../../i18n/locales/quality.json'

const { locale } = useI18n()

const data = computed(() => {
  return locale.value === 'zh' ? qualityData.zh : qualityData.en
})

// SEO
useSeoMeta({
  title: data.value.seo.title,
  description: data.value.seo.description,
})

// Function to open PDF in new tab
const viewDocument = (url: string) => {
  window.open(url, '_blank')
}

// Function to download PDF
const downloadDocument = (url: string, filename: string) => {
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950">
    <!-- Hero Section -->
    <PageHero
      :title="data.hero.title"
      :subtitle="data.hero.subtitle"
      background-image="/assets/gradient.png"
      :show-scroll-indicator="false"
    />

    <!-- Documents Section -->
    <section class="py-16 md:py-24">
      <div class="container mx-auto px-4 md:px-6">
        <div class="mx-auto max-w-4xl">
          <!-- Section Header -->
          <div class="mb-12 text-center">
            <h2 class="mb-4 text-3xl font-bold text-white md:text-4xl">
              {{ data.documents.title }}
            </h2>
            <p class="text-gray-400">
              {{ data.documents.subtitle }}
            </p>
          </div>

          <!-- Documents List -->
          <div class="space-y-4">
            <div
              v-for="(file, index) in data.files"
              :key="index"
              class="group relative overflow-hidden rounded-xl border border-gray-800 bg-gray-900/50 p-6 backdrop-blur-sm transition-all duration-300 hover:border-emerald-500/50 hover:bg-gray-800/50"
            >
              <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <!-- File Info -->
                <div class="flex items-start gap-4 flex-1">
                  <!-- PDF Icon -->
                  <div class="flex-shrink-0">
                    <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-red-500/10">
                      <svg class="h-6 w-6 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
                        <path d="M14 2v6h6"/>
                        <path d="M10 12h4M10 16h4M10 20h4"/>
                      </svg>
                    </div>
                  </div>

                  <!-- File Details -->
                  <div class="flex-1 min-w-0">
                    <h3 class="mb-1 text-lg font-semibold text-white group-hover:text-emerald-400 transition-colors">
                      {{ file.title }}
                    </h3>
                    <div class="flex flex-wrap items-center gap-3 text-sm text-gray-400">
                      <span class="flex items-center gap-1">
                        <Icon name="ph:file-pdf" class="h-4 w-4" />
                        {{ file.filename }}
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Action Buttons -->
                <div class="flex gap-3 md:flex-shrink-0">
                  <!-- View Button -->
                  <button
                    @click="viewDocument(file.url)"
                    class="flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-emerald-600 hover:shadow-lg hover:shadow-emerald-500/50"
                  >
                    <Icon name="ph:eye" class="h-5 w-5" />
                    {{ data.documents.view }}
                  </button>

                  <!-- Download Button -->
                  <button
                    @click="downloadDocument(file.url, file.filename)"
                    class="flex items-center gap-2 rounded-lg border border-gray-700 bg-gray-800 px-4 py-2.5 text-sm font-medium text-white transition-all hover:border-emerald-500 hover:bg-gray-700"
                  >
                    <Icon name="ph:download-simple" class="h-5 w-5" />
                    {{ data.documents.download }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty State (if no files) -->
          <div v-if="data.files.length === 0" class="py-20 text-center">
            <Icon name="ph:file-x" class="mx-auto mb-4 h-16 w-16 text-gray-600" />
            <p class="text-lg text-gray-400">No documents available</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
