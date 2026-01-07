<script setup lang="ts">
  import qualityData from "../contents/quality.json";

  const { t } = useI18n();
  const themeStore = useThemeStore();

  // Keep static files data
  const files = qualityData.common.files;

  // SEO
  useSeoMeta({
    title: computed(() => t("quality.seo.title")),
    description: computed(() => t("quality.seo.description")),
  });

  // Function to open PDF in new tab
  const viewDocument = (url: string) => {
    window.open(url, "_blank");
  };

  // Function to download PDF
  const downloadDocument = (url: string, filename: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
  };
</script>

<template>
  <div class="min-h-screen">
    <!-- Hero Section -->
    <PageHero
      :title="t('quality.hero.title')"
      :subtitle="t('quality.hero.subtitle')"
      background-image=""
    />

    <!-- Documents Section -->
    <section
      class="py-16 md:py-24"
      :class="themeStore.isDark ? '' : 'bg-gray-50'"
    >
      <div class="container mx-auto px-4 md:px-6">
        <div class="mx-auto max-w-4xl">
          <!-- Section Header -->
          <div class="mb-12 text-center">
            <h2
              class="mb-4 text-3xl font-bold md:text-4xl"
              :class="themeStore.isDark ? 'text-white' : 'text-gray-900'"
            >
              {{ t("quality.documents.title") }}
            </h2>
            <p :class="themeStore.isDark ? 'text-gray-400' : 'text-gray-600'">
              {{ t("quality.documents.subtitle") }}
            </p>
          </div>

          <!-- Documents List -->
          <div class="space-y-4">
            <div
              v-for="(file, index) in files"
              :key="index"
              class="group relative overflow-hidden rounded-xl p-6 backdrop-blur-sm transition-all duration-300 hover:border-emerald-500/50"
              :class="
                themeStore.isDark
                  ? 'border border-gray-800 bg-gray-900/50 hover:bg-gray-800/50'
                  : 'border border-gray-200 bg-white/80 shadow-lg hover:bg-white'
              "
            >
              <div
                class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
              >
                <!-- File Info -->
                <div class="flex items-start gap-4 flex-1">
                  <!-- PDF Icon -->
                  <div class="flex-shrink-0">
                    <div
                      class="flex h-12 w-12 items-center justify-center rounded-lg bg-red-500/10"
                    >
                      <svg
                        class="h-6 w-6 text-red-500"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"
                        />
                        <path d="M14 2v6h6" />
                        <path d="M10 12h4M10 16h4M10 20h4" />
                      </svg>
                    </div>
                  </div>

                  <!-- File Details -->
                  <div class="flex-1 min-w-0">
                    <h3
                      class="mb-1 text-lg font-semibold transition-colors group-hover:text-emerald-500"
                      :class="
                        themeStore.isDark ? 'text-white' : 'text-gray-900'
                      "
                    >
                      {{ file.title }}
                    </h3>
                    <div
                      class="flex flex-wrap items-center gap-3 text-sm"
                      :class="
                        themeStore.isDark ? 'text-gray-400' : 'text-gray-500'
                      "
                    >
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
                    {{ t("quality.documents.view") }}
                  </button>

                  <!-- Download Button -->
                  <button
                    @click="downloadDocument(file.url, file.filename)"
                    class="flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all hover:border-emerald-500"
                    :class="
                      themeStore.isDark
                        ? 'border border-gray-700 bg-gray-800 text-white hover:bg-gray-700'
                        : 'border border-gray-300 bg-gray-100 text-gray-700 hover:bg-gray-200'
                    "
                  >
                    <Icon name="ph:download-simple" class="h-5 w-5" />
                    {{ t("quality.documents.download") }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty State (if no files) -->
          <div v-if="files.length === 0" class="py-20 text-center">
            <Icon
              name="ph:file-x"
              class="mx-auto mb-4 h-16 w-16"
              :class="themeStore.isDark ? 'text-gray-600' : 'text-gray-400'"
            />
            <p
              class="text-lg"
              :class="themeStore.isDark ? 'text-gray-400' : 'text-gray-500'"
            >
              No documents available
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
