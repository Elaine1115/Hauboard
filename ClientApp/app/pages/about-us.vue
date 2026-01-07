<script setup lang="ts">
  import aboutData from "../contents/about-us.json";

  const { t, tm } = useI18n();
  const themeStore = useThemeStore();
  const showImageModal = ref(false);

  // Keep static data from old JSON
  const staticData = {
    founder: {
      image: aboutData.founder.image,
    },
  };

  // Timeline events with translations
  const timelineEvents = computed(() => {
    return aboutData.timeline.events.map((event) => ({
      year: event.year,
      title: t(`aboutUs.timeline.${event.year}.title`),
      description: t(`aboutUs.timeline.${event.year}.description`),
    }));
  });

  useSeoMeta({
    title: computed(() => t("aboutUs.seo.title")),
    ogTitle: computed(() => t("aboutUs.seo.title")),
    description: computed(() => t("aboutUs.seo.description")),
    ogDescription: computed(() => t("aboutUs.seo.description")),
  });
</script>

<template>
  <main class="min-h-screen">
    <!-- Hero Section -->
    <PageHero
      :title="t('aboutUs.hero.title')"
      :subtitle="t('aboutUs.hero.subtitle')"
    />

    <!-- Introduction Section -->
    <SectionContainer :title="t('aboutUs.introduction.title')">
      <div class="max-w-4xl mx-auto">
        <div
          class="backdrop-blur-sm rounded-2xl p-8 md:p-12 shadow-2xl"
          :class="
            themeStore.isDark
              ? 'bg-gradient-to-br from-gray-800/40 to-gray-900/40 border border-gray-700/30'
              : 'bg-white/80 border border-gray-200'
          "
        >
          <div class="space-y-6 text-lg leading-relaxed">
            <p class="whitespace-pre-line">
              {{ t("aboutUs.introduction.content") }}
            </p>
          </div>
        </div>
      </div>
    </SectionContainer>

    <!-- Founder Section -->
    <SectionContainer :title="t('aboutUs.founder.subtitle')">
      <div class="max-w-7xl mx-auto">
        <div class="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center">
          <!-- Image Column (Smaller - 40% width on large screens) -->
          <div class="order-2 lg:order-1 w-full lg:w-[40%]">
            <!-- Image -->
            <div
              class="rounded-2xl overflow-hidden shadow-2xl cursor-pointer transition-transform hover:scale-105"
              :class="
                themeStore.isDark
                  ? 'border border-gray-700/30'
                  : 'border border-gray-200'
              "
              @click="showImageModal = true"
            >
              <img
                :src="staticData.founder.image"
                :alt="t('aboutUs.founder.title')"
                class="w-full h-auto object-cover"
              />
            </div>
          </div>

          <!-- Text Column (Larger - 60% width on large screens) -->
          <div class="order-1 lg:order-2 w-full lg:w-[60%]">
            <div
              class="backdrop-blur-sm rounded-2xl p-8 md:p-10 shadow-2xl"
              :class="
                themeStore.isDark
                  ? 'bg-gradient-to-br from-gray-800/40 to-gray-900/40 border border-gray-700/30'
                  : 'bg-white/80 border border-gray-200'
              "
            >
              <!-- Founder Title -->
              <h3
                class="text-2xl md:text-3xl font-bold mb-6"
                :class="themeStore.isDark ? 'text-gray-100' : 'text-gray-800'"
              >
                {{ t("aboutUs.founder.title") }}
              </h3>

              <div class="space-y-5 text-base md:text-lg leading-relaxed">
                <p class="whitespace-pre-line">
                  {{ t("aboutUs.founder.content") }}
                </p>
              </div>

              <!-- Signature Image -->
              <div class="flex justify-end mt-6">
                <img
                  src="/assets/images/about-us/signature.webp"
                  alt="Founder Signature"
                  class="w-40 md:w-48 lg:w-56 h-auto opacity-80 transition-all duration-300"
                  :class="themeStore.isDark ? 'invert brightness-0' : ''"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </SectionContainer>

    <!-- Timeline Section -->
    <SectionContainer
      :title="t('aboutUs.timeline.title')"
      :subtitle="t('aboutUs.timeline.subtitle')"
    >
      <Timeline :events="timelineEvents" />
    </SectionContainer>

    <!-- Image Modal -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition-opacity duration-300"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity duration-300"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="showImageModal"
          class="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/85 backdrop-blur-md"
          @click="showImageModal = false"
        >
          <div class="relative max-w-6xl w-full">
            <!-- Image Container with Styling -->
            <div
              class="relative rounded-xl overflow-hidden shadow-2xl"
              :class="
                themeStore.isDark
                  ? 'bg-gray-900 border-2 border-gray-700'
                  : 'bg-gray-100 border-2 border-gray-400'
              "
              @click.stop
            >
              <!-- Close Button -->
              <button
                class="absolute top-3 right-3 z-10 p-2 rounded-full transition-all duration-200"
                :class="
                  themeStore.isDark
                    ? 'bg-gray-800/90 hover:bg-gray-700 text-white'
                    : 'bg-white/90 hover:bg-gray-100 text-gray-800'
                "
                @click="showImageModal = false"
                aria-label="Close"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              <!-- Enlarged Image with Padding -->
              <div class="p-4 md:p-6">
                <img
                  :src="staticData.founder.image"
                  :alt="t('aboutUs.founder.title')"
                  class="w-full h-auto max-h-[80vh] object-contain rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </main>
</template>
