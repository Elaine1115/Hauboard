<script setup lang="ts">
  import vendorData from "../contents/vendor-introduction.json";

  const { t, tm } = useI18n();
  const themeStore = useThemeStore();

  // Keep static data (images)
  const staticData = {
    story: {
      items: vendorData.story.items, // Contains image URLs
    },
  };

  // Story items with translations
  const storyItems = computed(() => {
    const storyKeys = [
      "largeScaleProduction",
      "advancedProductionLines",
      "rigorousQualityTesting",
      "completeTransportationSystem",
      "internationalExhibitionParticipation",
    ];

    return storyKeys.map((key, index) => ({
      title: t(`vendorIntroduction.story.${key}.title`),
      description: t(`vendorIntroduction.story.${key}.description`),
      image: staticData.story.items[index]?.image || "",
    }));
  });

  // Supplier features with translations
  const supplierFeatures = computed(() => {
    const featuresArray = tm(
      "vendorIntroduction.partners.supplier.features"
    ) as any[];
    // Map over the array and use t() with index to get the actual string
    return featuresArray.map((_, index) =>
      t(`vendorIntroduction.partners.supplier.features.${index}`)
    );
  });

  // Certifications with translations
  const certificationItems = computed(() => {
    const certKeys = ["fsc", "carb", "ce", "iso"];

    return certKeys.map((key) => ({
      title: t(`vendorIntroduction.certifications.${key}.title`),
      description: t(`vendorIntroduction.certifications.${key}.description`),
    }));
  });

  useSeoMeta({
    title: computed(() => t("vendorIntroduction.seo.title")),
    ogTitle: computed(() => t("vendorIntroduction.seo.title")),
    description: computed(() => t("vendorIntroduction.seo.description")),
    ogDescription: computed(() => t("vendorIntroduction.seo.description")),
  });
</script>

<template>
  <main class="min-h-screen">
    <!-- Hero Section -->
    <PageHero
      :title="t('vendorIntroduction.hero.title')"
      :subtitle="t('vendorIntroduction.hero.subtitle')"
    />

    <!-- Partners Section -->
    <SectionContainer :title="t('vendorIntroduction.partners.title')">
      <div class="space-y-8 max-w-6xl mx-auto">
        <!-- Single Supplier -->
        <div
          class="group relative backdrop-blur-sm rounded-2xl p-10 transition-all duration-300 hover:border-emerald-500/50 hover:shadow-2xl hover:shadow-emerald-500/10"
          :class="
            themeStore.isDark
              ? 'bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/40'
              : 'bg-white/80 border border-gray-200 shadow-lg'
          "
        >
          <div
            class="absolute top-0 left-0 w-40 h-40 bg-emerald-500/5 rounded-full blur-3xl group-hover:bg-emerald-500/10 transition-all duration-300"
          ></div>
          <div class="relative">
            <div class="flex items-center gap-4 mb-6">
              <div
                class="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 flex items-center justify-center group-hover:scale-110 transition-transform"
              >
                <span class="text-3xl">🏢</span>
              </div>
              <h3
                class="text-3xl font-bold transition-colors group-hover:text-emerald-500"
                :class="themeStore.isDark ? 'text-white' : 'text-gray-900'"
              >
                {{ t("vendorIntroduction.partners.supplier.name") }}
              </h3>
            </div>
            <p
              class="text-xl mb-8 leading-relaxed"
              :class="themeStore.isDark ? 'text-gray-200' : 'text-gray-600'"
            >
              {{ t("vendorIntroduction.partners.supplier.description") }}
            </p>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div
                v-for="(feature, fIndex) in supplierFeatures"
                :key="fIndex"
                class="flex items-center gap-4 rounded-lg p-4 transition-colors hover:border-emerald-500/30"
                :class="
                  themeStore.isDark
                    ? 'bg-gray-900/40 border border-gray-700/30'
                    : 'bg-gray-50 border border-gray-200'
                "
              >
                <div
                  class="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center"
                >
                  <span class="text-emerald-500 text-lg font-bold">✓</span>
                </div>
                <span
                  class="text-lg"
                  :class="themeStore.isDark ? 'text-gray-200' : 'text-gray-700'"
                  >{{ feature }}</span
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </SectionContainer>

    <!-- Story Section -->
    <SectionContainer
      :title="t('vendorIntroduction.story.title')"
      :subtitle="t('vendorIntroduction.story.subtitle')"
    >
      <StoryContent :stories="storyItems" />
    </SectionContainer>

    <!-- Certifications Section -->
    <SectionContainer :title="t('vendorIntroduction.certifications.title')">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div
          v-for="(cert, index) in certificationItems"
          :key="index"
          class="group relative backdrop-blur-sm rounded-2xl p-8 transition-all duration-300 hover:border-emerald-500/50 hover:transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-emerald-500/10"
          :class="
            themeStore.isDark
              ? 'bg-gradient-to-br from-gray-800/60 to-gray-900/60 border border-gray-700/40'
              : 'bg-white/80 border border-gray-200 shadow-lg'
          "
        >
          <div
            class="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl group-hover:bg-emerald-500/10 transition-all duration-300"
          ></div>
          <div class="relative">
            <div
              class="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
            >
              <span class="text-2xl">{{
                index === 0
                  ? "🌳"
                  : index === 1
                    ? "🌍"
                    : index === 2
                      ? "✅"
                      : "📋"
              }}</span>
            </div>
            <h3
              class="text-2xl font-bold mb-4 transition-colors group-hover:text-emerald-500"
              :class="themeStore.isDark ? 'text-white' : 'text-gray-900'"
            >
              {{ cert.title }}
            </h3>
            <p
              class="leading-relaxed text-lg"
              :class="themeStore.isDark ? 'text-gray-300' : 'text-gray-600'"
            >
              {{ cert.description }}
            </p>
          </div>
        </div>
      </div>
    </SectionContainer>
  </main>
</template>
