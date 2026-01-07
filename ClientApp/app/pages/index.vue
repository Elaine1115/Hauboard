<script setup lang="ts">
  import homeData from "../contents/home.json";

  const { t, locale } = useI18n();
  const themeStore = useThemeStore();

  // Keep static data (images, videos, icons) from old JSON
  const staticData = {
    hero: {
      cards: homeData.common.hero.cards,
      stats: homeData.common.hero.stats,
    },
    applications: {
      image: homeData.common.applications.image,
    },
    specifications: {
      image: homeData.common.specifications.image,
    },
    gallery: {
      items: homeData.common.gallery.items,
    },
    cta: {
      videos: homeData.common.cta.videos,
    },
    icons: {
      features: [
        "ph:palette-duotone",
        "ph:star-duotone",
        "ph:globe-duotone",
        "ph:wrench-duotone",
        "ph:shield-check-duotone",
        "ph:handshake-duotone",
      ],
      products: [
        "ph:tree-duotone",
        "ph:diamond-duotone",
        "ph:squares-four-duotone",
      ],
      applications: [
        "ph:cooking-pot-duotone",
        "ph:couch-duotone",
        "ph:desk-duotone",
        "ph:wall-duotone",
        "ph:door-duotone",
        "ph:storefront-duotone",
      ],
    },
  };

  // Computed property for specifications uses arrays
  const specificationsUses = computed(() => {
    const usesKey = locale.value === "zh" ? "uses_zh" : "uses_en";
    return {
      "8mm":
        (homeData.specifications.items[0]?.[
          usesKey as keyof (typeof homeData.specifications.items)[0]
        ] as string[]) || [],
      "18mm":
        (homeData.specifications.items[1]?.[
          usesKey as keyof (typeof homeData.specifications.items)[1]
        ] as string[]) || [],
      "25mm":
        (homeData.specifications.items[2]?.[
          usesKey as keyof (typeof homeData.specifications.items)[2]
        ] as string[]) || [],
    };
  });

  useSeoMeta({
    title: computed(() => t("home.seo.title")),
    ogTitle: computed(() => t("home.seo.title")),
    description: computed(() => t("home.seo.description")),
    ogDescription: computed(() => t("home.seo.description")),
  });

  // Track which videos have been activated (clicked to play)
  const activeVideos = ref<Set<number>>(new Set());

  const playVideo = (index: number) => {
    activeVideos.value.add(index);
  };

  const isVideoActive = (index: number) => {
    return activeVideos.value.has(index);
  };

  // Get YouTube thumbnail URL
  const getThumbnail = (videoId: string) => {
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  };
</script>

<template>
  <main class="min-h-screen">
    <!-- Hero Section - Bento Grid -->
    <section
      class="-mt-20 md:-mt-24 pt-20 md:pt-24 relative overflow-hidden"
      :class="
        themeStore.isDark
          ? 'bg-gray-950'
          : 'bg-gradient-to-br from-emerald-50 via-white to-teal-50'
      "
    >
      <div class="max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-24 w-full">
        <!-- Two Column Layout -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5">
          <!-- Left Column: Content + Stats -->
          <div class="flex flex-col gap-4 md:gap-5">
            <!-- Content Card -->
            <div
              class="flex-1 relative rounded-3xl backdrop-blur-sm p-8 md:p-10 flex flex-col justify-center overflow-hidden group"
              :class="
                themeStore.isDark
                  ? 'bg-gradient-to-br from-gray-800/80 to-gray-900/80 border border-gray-700/50'
                  : 'bg-white/80 border border-gray-200 shadow-xl shadow-emerald-500/10'
              "
            >
              <!-- PageHero-style decorative background -->
              <div class="absolute inset-0 overflow-hidden pointer-events-none">
                <!-- Grid pattern -->
                <div
                  class="absolute inset-0"
                  :class="
                    themeStore.isDark ? 'opacity-[0.03]' : 'opacity-[0.5]'
                  "
                  :style="
                    themeStore.isDark
                      ? 'background-image: linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px); background-size: 40px 40px;'
                      : 'background-image: linear-gradient(rgba(16,185,129,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.1) 1px, transparent 1px); background-size: 40px 40px;'
                  "
                ></div>

                <!-- Ring shape top-right -->
                <div
                  :class="
                    themeStore.isDark
                      ? 'border-emerald-400/20'
                      : 'border-emerald-500/30'
                  "
                  class="absolute -top-16 -right-16 w-48 h-48 rounded-full border-2"
                ></div>
                <div
                  :class="
                    themeStore.isDark
                      ? 'border-emerald-400/10'
                      : 'border-emerald-500/20'
                  "
                  class="absolute -top-12 -right-12 w-40 h-40 rounded-full border"
                ></div>

                <!-- Ring shape bottom-left -->
                <div
                  :class="
                    themeStore.isDark
                      ? 'border-teal-400/15'
                      : 'border-teal-500/25'
                  "
                  class="absolute -bottom-20 -left-20 w-56 h-56 rounded-full border-2"
                ></div>
                <div
                  :class="
                    themeStore.isDark
                      ? 'border-teal-400/10'
                      : 'border-teal-500/15'
                  "
                  class="absolute -bottom-16 -left-16 w-48 h-48 rounded-full border"
                ></div>

                <!-- Diagonal lines -->
                <svg
                  class="absolute inset-0 w-full h-full"
                  preserveAspectRatio="none"
                >
                  <line
                    x1="0%"
                    y1="100%"
                    x2="40%"
                    y2="0%"
                    :stroke="
                      themeStore.isDark
                        ? 'rgba(52, 211, 153, 0.15)'
                        : 'rgba(16, 185, 129, 0.2)'
                    "
                    stroke-width="1"
                  />
                  <line
                    x1="60%"
                    y1="100%"
                    x2="100%"
                    y2="20%"
                    :stroke="
                      themeStore.isDark
                        ? 'rgba(45, 212, 191, 0.1)'
                        : 'rgba(20, 184, 166, 0.15)'
                    "
                    stroke-width="1"
                  />
                </svg>

                <!-- Small floating dots -->
                <div
                  :class="
                    themeStore.isDark
                      ? 'bg-emerald-400/40'
                      : 'bg-emerald-500/50'
                  "
                  class="absolute top-[15%] right-[20%] w-2 h-2 rounded-full"
                ></div>
                <div
                  :class="
                    themeStore.isDark ? 'bg-teal-400/50' : 'bg-teal-500/60'
                  "
                  class="absolute top-[60%] right-[15%] w-1.5 h-1.5 rounded-full"
                ></div>
                <div
                  :class="
                    themeStore.isDark
                      ? 'bg-emerald-400/30'
                      : 'bg-emerald-500/40'
                  "
                  class="absolute bottom-[25%] left-[25%] w-2 h-2 rounded-full"
                ></div>
                <div
                  :class="
                    themeStore.isDark ? 'bg-white/40' : 'bg-emerald-600/30'
                  "
                  class="absolute top-[30%] left-[10%] w-1 h-1 rounded-full"
                ></div>

                <!-- Glowing orbs -->
                <div
                  :class="
                    themeStore.isDark
                      ? 'bg-emerald-500/20'
                      : 'bg-emerald-400/30'
                  "
                  class="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl"
                ></div>
                <div
                  :class="
                    themeStore.isDark ? 'bg-teal-500/15' : 'bg-teal-400/25'
                  "
                  class="absolute -bottom-10 -left-10 w-40 h-40 rounded-full blur-3xl"
                ></div>
              </div>

              <div class="relative z-10">
                <div class="flex items-center gap-3 mb-6">
                  <div class="h-px w-8 bg-emerald-500"></div>
                  <span
                    :class="
                      themeStore.isDark
                        ? 'text-emerald-400'
                        : 'text-emerald-600'
                    "
                    class="text-sm font-medium tracking-widest uppercase"
                    >Saviola Group</span
                  >
                </div>
                <h1
                  class="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight"
                  :class="themeStore.isDark ? 'text-white' : 'text-gray-800'"
                >
                  {{ t("home.hero.title") }}
                </h1>
                <p
                  class="text-base md:text-lg mb-8 max-w-md leading-relaxed"
                  :class="themeStore.isDark ? 'text-gray-300' : 'text-gray-600'"
                >
                  {{ t("home.hero.subtitle") }}
                </p>
                <div class="flex flex-wrap gap-3">
                  <NuxtLink
                    to="/products"
                    class="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/30"
                  >
                    {{ t("home.hero.browseProducts") }}
                    <Icon name="ph:arrow-right" class="h-5 w-5" />
                  </NuxtLink>
                </div>
              </div>
              <!-- Hover glow -->
              <div
                :class="
                  themeStore.isDark ? 'bg-emerald-500/20' : 'bg-emerald-400/30'
                "
                class="absolute -bottom-20 -right-20 w-40 h-40 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              ></div>
            </div>

            <!-- Stats Card -->
            <div
              class="relative rounded-3xl backdrop-blur-sm p-6 flex items-center justify-around overflow-hidden"
              :class="
                themeStore.isDark
                  ? 'bg-gradient-to-r from-emerald-900/40 to-teal-900/40 border border-emerald-500/20'
                  : 'bg-gradient-to-r from-emerald-50/60 to-teal-50/60 border border-emerald-200'
              "
            >
              <div class="text-center">
                <div
                  class="text-3xl md:text-4xl font-bold mb-1"
                  :class="themeStore.isDark ? 'text-white' : 'text-gray-800'"
                >
                  {{ staticData.hero.stats[0]?.value }}
                </div>
                <div
                  :class="themeStore.isDark ? 'text-gray-400' : 'text-gray-600'"
                  class="text-sm"
                >
                  {{ t("home.hero.stats.recycledWood") }}
                </div>
              </div>
              <div
                class="w-px h-12"
                :class="themeStore.isDark ? 'bg-gray-700' : 'bg-emerald-300'"
              ></div>
              <div class="text-center">
                <div
                  class="text-3xl md:text-4xl font-bold mb-1"
                  :class="themeStore.isDark ? 'text-white' : 'text-gray-800'"
                >
                  {{ staticData.hero.stats[1]?.value }}
                </div>
                <div
                  :class="themeStore.isDark ? 'text-gray-400' : 'text-gray-600'"
                  class="text-sm"
                >
                  {{ t("home.hero.stats.decorOptions") }}
                </div>
              </div>
              <div
                class="w-px h-12"
                :class="themeStore.isDark ? 'bg-gray-700' : 'bg-emerald-300'"
              ></div>
              <div class="text-center">
                <div
                  class="text-3xl md:text-4xl font-bold mb-1"
                  :class="themeStore.isDark ? 'text-white' : 'text-gray-800'"
                >
                  {{ staticData.hero.stats[2]?.value }}
                </div>
                <div
                  :class="themeStore.isDark ? 'text-gray-400' : 'text-gray-600'"
                  class="text-sm"
                >
                  {{ t("home.hero.stats.emissionClass") }}
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column: Image Cards -->
          <div
            class="grid grid-cols-2 gap-4 md:gap-5 auto-rows-[180px] md:auto-rows-[200px]"
          >
            <!-- Melamine Card -->
            <div
              class="relative rounded-3xl overflow-hidden group cursor-pointer shadow-lg row-span-2"
            >
              <img
                :src="staticData.hero.cards[0]?.image"
                :alt="t('home.hero.cards.melamine.title')"
                class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div
                class="absolute inset-0"
                :class="
                  themeStore.isDark
                    ? 'bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent'
                    : 'bg-gradient-to-t from-gray-900/80 via-transparent to-transparent'
                "
              ></div>
              <div class="absolute inset-0 flex flex-col justify-between p-6">
                <span
                  class="self-start text-white text-xs font-semibold rounded-full px-3 py-1.5 bg-emerald-500/90"
                >
                  {{ t("home.hero.cards.melamine.badge") }}
                </span>
                <div>
                  <h3 class="text-white font-bold text-xl mb-2">
                    {{ t("home.hero.cards.melamine.title") }}
                  </h3>
                  <p
                    class="text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  >
                    {{ t("home.hero.cards.melamine.description") }}
                  </p>
                </div>
              </div>
              <div
                class="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"
              ></div>
            </div>

            <!-- Edges Card -->
            <div
              class="relative rounded-3xl overflow-hidden group cursor-pointer shadow-lg"
            >
              <img
                :src="staticData.hero.cards[1]?.image"
                :alt="t('home.hero.cards.edges.title')"
                class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div
                class="absolute inset-0"
                :class="
                  themeStore.isDark
                    ? 'bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent'
                    : 'bg-gradient-to-t from-gray-900/80 via-transparent to-transparent'
                "
              ></div>
              <div class="absolute inset-0 flex flex-col justify-between p-5">
                <span
                  class="self-start text-white text-xs font-semibold rounded-full px-3 py-1 bg-teal-500/90"
                >
                  {{ t("home.hero.cards.edges.badge") }}
                </span>
                <div>
                  <h3 class="text-white font-bold text-lg">
                    {{ t("home.hero.cards.edges.title") }}
                  </h3>
                </div>
              </div>
            </div>

            <!-- Raw Card -->
            <div
              class="relative rounded-3xl overflow-hidden group cursor-pointer shadow-lg"
            >
              <img
                :src="staticData.hero.cards[2]?.image"
                :alt="t('home.hero.cards.raw.title')"
                class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div
                class="absolute inset-0"
                :class="
                  themeStore.isDark
                    ? 'bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent'
                    : 'bg-gradient-to-t from-gray-900/80 via-transparent to-transparent'
                "
              ></div>
              <div class="absolute inset-0 flex flex-col justify-between p-5">
                <span
                  class="self-start text-white text-xs font-semibold rounded-full px-3 py-1 bg-cyan-500/90"
                >
                  {{ t("home.hero.cards.raw.badge") }}
                </span>
                <div>
                  <h3 class="text-white font-bold text-lg">
                    {{ t("home.hero.cards.raw.title") }}
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-20" :class="themeStore.isDark ? '' : 'bg-gray-50'">
      <div class="mx-auto max-w-6xl px-4 md:px-6">
        <div class="text-center mb-16">
          <h2
            class="text-3xl md:text-4xl font-bold mb-4"
            :class="themeStore.isDark ? 'text-white' : 'text-gray-900'"
          >
            {{ t("home.features.title") }}
          </h2>
          <p
            class="text-lg max-w-2xl mx-auto"
            :class="themeStore.isDark ? 'text-gray-300' : 'text-gray-600'"
          >
            {{ t("home.features.subtitle") }}
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <!-- Diverse Designs -->
          <div
            class="backdrop-blur-sm rounded-xl p-6 hover:border-emerald-500/50 transition-all duration-300 hover:transform hover:-translate-y-1"
            :class="
              themeStore.isDark
                ? 'bg-gray-800/50 border border-gray-700/50'
                : 'bg-white/80 border border-gray-200 shadow-lg'
            "
          >
            <div class="h-12 w-12 mb-4">
              <Icon
                :name="staticData.icons.features[0] || ''"
                class="h-12 w-12 text-emerald-500"
              />
            </div>
            <h3
              class="text-xl font-semibold mb-3"
              :class="themeStore.isDark ? 'text-white' : 'text-gray-900'"
            >
              {{ t("home.features.diverseDesigns.title") }}
            </h3>
            <p
              class="leading-relaxed"
              :class="themeStore.isDark ? 'text-gray-300' : 'text-gray-600'"
            >
              {{ t("home.features.diverseDesigns.description") }}
            </p>
          </div>

          <!-- Superior Quality -->
          <div
            class="backdrop-blur-sm rounded-xl p-6 hover:border-emerald-500/50 transition-all duration-300 hover:transform hover:-translate-y-1"
            :class="
              themeStore.isDark
                ? 'bg-gray-800/50 border border-gray-700/50'
                : 'bg-white/80 border border-gray-200 shadow-lg'
            "
          >
            <div class="h-12 w-12 mb-4">
              <Icon
                :name="staticData.icons.features[1] || ''"
                class="h-12 w-12 text-emerald-500"
              />
            </div>
            <h3
              class="text-xl font-semibold mb-3"
              :class="themeStore.isDark ? 'text-white' : 'text-gray-900'"
            >
              {{ t("home.features.superiorQuality.title") }}
            </h3>
            <p
              class="leading-relaxed"
              :class="themeStore.isDark ? 'text-gray-300' : 'text-gray-600'"
            >
              {{ t("home.features.superiorQuality.description") }}
            </p>
          </div>

          <!-- Eco-Friendly -->
          <div
            class="backdrop-blur-sm rounded-xl p-6 hover:border-emerald-500/50 transition-all duration-300 hover:transform hover:-translate-y-1"
            :class="
              themeStore.isDark
                ? 'bg-gray-800/50 border border-gray-700/50'
                : 'bg-white/80 border border-gray-200 shadow-lg'
            "
          >
            <div class="h-12 w-12 mb-4">
              <Icon
                :name="staticData.icons.features[2] || ''"
                class="h-12 w-12 text-emerald-500"
              />
            </div>
            <h3
              class="text-xl font-semibold mb-3"
              :class="themeStore.isDark ? 'text-white' : 'text-gray-900'"
            >
              {{ t("home.features.ecoFriendly.title") }}
            </h3>
            <p
              class="leading-relaxed"
              :class="themeStore.isDark ? 'text-gray-300' : 'text-gray-600'"
            >
              {{ t("home.features.ecoFriendly.description") }}
            </p>
          </div>

          <!-- Easy Installation -->
          <div
            class="backdrop-blur-sm rounded-xl p-6 hover:border-emerald-500/50 transition-all duration-300 hover:transform hover:-translate-y-1"
            :class="
              themeStore.isDark
                ? 'bg-gray-800/50 border border-gray-700/50'
                : 'bg-white/80 border border-gray-200 shadow-lg'
            "
          >
            <div class="h-12 w-12 mb-4">
              <Icon
                :name="staticData.icons.features[3] || ''"
                class="h-12 w-12 text-emerald-500"
              />
            </div>
            <h3
              class="text-xl font-semibold mb-3"
              :class="themeStore.isDark ? 'text-white' : 'text-gray-900'"
            >
              {{ t("home.features.easyInstallation.title") }}
            </h3>
            <p
              class="leading-relaxed"
              :class="themeStore.isDark ? 'text-gray-300' : 'text-gray-600'"
            >
              {{ t("home.features.easyInstallation.description") }}
            </p>
          </div>

          <!-- Durable & Strong -->
          <div
            class="backdrop-blur-sm rounded-xl p-6 hover:border-emerald-500/50 transition-all duration-300 hover:transform hover:-translate-y-1"
            :class="
              themeStore.isDark
                ? 'bg-gray-800/50 border border-gray-700/50'
                : 'bg-white/80 border border-gray-200 shadow-lg'
            "
          >
            <div class="h-12 w-12 mb-4">
              <Icon
                :name="staticData.icons.features[4] || ''"
                class="h-12 w-12 text-emerald-500"
              />
            </div>
            <h3
              class="text-xl font-semibold mb-3"
              :class="themeStore.isDark ? 'text-white' : 'text-gray-900'"
            >
              {{ t("home.features.durableStrong.title") }}
            </h3>
            <p
              class="leading-relaxed"
              :class="themeStore.isDark ? 'text-gray-300' : 'text-gray-600'"
            >
              {{ t("home.features.durableStrong.description") }}
            </p>
          </div>

          <!-- Professional Service -->
          <div
            class="backdrop-blur-sm rounded-xl p-6 hover:border-emerald-500/50 transition-all duration-300 hover:transform hover:-translate-y-1"
            :class="
              themeStore.isDark
                ? 'bg-gray-800/50 border border-gray-700/50'
                : 'bg-white/80 border border-gray-200 shadow-lg'
            "
          >
            <div class="h-12 w-12 mb-4">
              <Icon
                :name="staticData.icons.features[5] || ''"
                class="h-12 w-12 text-emerald-500"
              />
            </div>
            <h3
              class="text-xl font-semibold mb-3"
              :class="themeStore.isDark ? 'text-white' : 'text-gray-900'"
            >
              {{ t("home.features.professionalService.title") }}
            </h3>
            <p
              class="leading-relaxed"
              :class="themeStore.isDark ? 'text-gray-300' : 'text-gray-600'"
            >
              {{ t("home.features.professionalService.description") }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Applications Section -->
    <section class="py-20" :class="themeStore.isDark ? '' : 'bg-gray-50'">
      <div class="mx-auto max-w-6xl px-4 md:px-6">
        <ClientOnly>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <!-- Image Side -->
            <div class="relative">
              <div
                class="relative aspect-[4/3] rounded-2xl overflow-hidden"
                :class="themeStore.isDark ? 'bg-gray-800' : 'bg-gray-100'"
              >
                <img
                  :src="staticData.applications.image"
                  alt="Melamine Chipboard Applications"
                  class="absolute inset-0 w-full h-full object-cover"
                  loading="eager"
                />
              </div>
              <!-- Decorative Element -->
              <div
                class="absolute -bottom-4 -right-4 w-24 h-24 bg-emerald-500/20 rounded-2xl -z-10"
              ></div>
              <div
                class="absolute -top-4 -left-4 w-16 h-16 bg-emerald-500/10 rounded-xl -z-10"
              ></div>
            </div>

            <!-- Content Side -->
            <div>
              <h2
                class="text-3xl md:text-4xl font-bold mb-4"
                :class="themeStore.isDark ? 'text-white' : 'text-gray-900'"
              >
                {{ t("home.applications.title") }}
              </h2>
              <p
                class="text-lg mb-8"
                :class="themeStore.isDark ? 'text-gray-300' : 'text-gray-600'"
              >
                {{ t("home.applications.subtitle") }}
              </p>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <!-- Kitchen Cabinets -->
                <div
                  class="flex items-center gap-4 p-4 rounded-xl transition-colors hover:border-emerald-500/30"
                  :class="
                    themeStore.isDark
                      ? 'bg-gray-800/30 border border-gray-700/50'
                      : 'bg-white/80 border border-gray-200 shadow'
                  "
                >
                  <div class="flex-shrink-0 h-8 w-8">
                    <Icon
                      :name="staticData.icons.applications[0] || ''"
                      class="h-8 w-8 text-emerald-500"
                    />
                  </div>
                  <div>
                    <h3
                      class="font-semibold mb-1"
                      :class="
                        themeStore.isDark ? 'text-white' : 'text-gray-900'
                      "
                    >
                      {{ t("home.applications.kitchenCabinets.title") }}
                    </h3>
                    <p
                      class="text-sm"
                      :class="
                        themeStore.isDark ? 'text-gray-400' : 'text-gray-500'
                      "
                    >
                      {{ t("home.applications.kitchenCabinets.description") }}
                    </p>
                  </div>
                </div>

                <!-- Wardrobes & Storage -->
                <div
                  class="flex items-center gap-4 p-4 rounded-xl transition-colors hover:border-emerald-500/30"
                  :class="
                    themeStore.isDark
                      ? 'bg-gray-800/30 border border-gray-700/50'
                      : 'bg-white/80 border border-gray-200 shadow'
                  "
                >
                  <div class="flex-shrink-0 h-8 w-8">
                    <Icon
                      :name="staticData.icons.applications[1] || ''"
                      class="h-8 w-8 text-emerald-500"
                    />
                  </div>
                  <div>
                    <h3
                      class="font-semibold mb-1"
                      :class="
                        themeStore.isDark ? 'text-white' : 'text-gray-900'
                      "
                    >
                      {{ t("home.applications.wardrobesStorage.title") }}
                    </h3>
                    <p
                      class="text-sm"
                      :class="
                        themeStore.isDark ? 'text-gray-400' : 'text-gray-500'
                      "
                    >
                      {{ t("home.applications.wardrobesStorage.description") }}
                    </p>
                  </div>
                </div>

                <!-- Office Furniture -->
                <div
                  class="flex items-center gap-4 p-4 rounded-xl transition-colors hover:border-emerald-500/30"
                  :class="
                    themeStore.isDark
                      ? 'bg-gray-800/30 border border-gray-700/50'
                      : 'bg-white/80 border border-gray-200 shadow'
                  "
                >
                  <div class="flex-shrink-0 h-8 w-8">
                    <Icon
                      :name="staticData.icons.applications[2] || ''"
                      class="h-8 w-8 text-emerald-500"
                    />
                  </div>
                  <div>
                    <h3
                      class="font-semibold mb-1"
                      :class="
                        themeStore.isDark ? 'text-white' : 'text-gray-900'
                      "
                    >
                      {{ t("home.applications.officeFurniture.title") }}
                    </h3>
                    <p
                      class="text-sm"
                      :class="
                        themeStore.isDark ? 'text-gray-400' : 'text-gray-500'
                      "
                    >
                      {{ t("home.applications.officeFurniture.description") }}
                    </p>
                  </div>
                </div>

                <!-- Wall Decoration -->
                <div
                  class="flex items-center gap-4 p-4 rounded-xl transition-colors hover:border-emerald-500/30"
                  :class="
                    themeStore.isDark
                      ? 'bg-gray-800/30 border border-gray-700/50'
                      : 'bg-white/80 border border-gray-200 shadow'
                  "
                >
                  <div class="flex-shrink-0 h-8 w-8">
                    <Icon
                      :name="staticData.icons.applications[3] || ''"
                      class="h-8 w-8 text-emerald-500"
                    />
                  </div>
                  <div>
                    <h3
                      class="font-semibold mb-1"
                      :class="
                        themeStore.isDark ? 'text-white' : 'text-gray-900'
                      "
                    >
                      {{ t("home.applications.wallDecoration.title") }}
                    </h3>
                    <p
                      class="text-sm"
                      :class="
                        themeStore.isDark ? 'text-gray-400' : 'text-gray-500'
                      "
                    >
                      {{ t("home.applications.wallDecoration.description") }}
                    </p>
                  </div>
                </div>

                <!-- Doors & Partitions -->
                <div
                  class="flex items-center gap-4 p-4 rounded-xl transition-colors hover:border-emerald-500/30"
                  :class="
                    themeStore.isDark
                      ? 'bg-gray-800/30 border border-gray-700/50'
                      : 'bg-white/80 border border-gray-200 shadow'
                  "
                >
                  <div class="flex-shrink-0 h-8 w-8">
                    <Icon
                      :name="staticData.icons.applications[4] || ''"
                      class="h-8 w-8 text-emerald-500"
                    />
                  </div>
                  <div>
                    <h3
                      class="font-semibold mb-1"
                      :class="
                        themeStore.isDark ? 'text-white' : 'text-gray-900'
                      "
                    >
                      {{ t("home.applications.doorsPartitions.title") }}
                    </h3>
                    <p
                      class="text-sm"
                      :class="
                        themeStore.isDark ? 'text-gray-400' : 'text-gray-500'
                      "
                    >
                      {{ t("home.applications.doorsPartitions.description") }}
                    </p>
                  </div>
                </div>

                <!-- Commercial Spaces -->
                <div
                  class="flex items-center gap-4 p-4 rounded-xl transition-colors hover:border-emerald-500/30"
                  :class="
                    themeStore.isDark
                      ? 'bg-gray-800/30 border border-gray-700/50'
                      : 'bg-white/80 border border-gray-200 shadow'
                  "
                >
                  <div class="flex-shrink-0 h-8 w-8">
                    <Icon
                      :name="staticData.icons.applications[5] || ''"
                      class="h-8 w-8 text-emerald-500"
                    />
                  </div>
                  <div>
                    <h3
                      class="font-semibold mb-1"
                      :class="
                        themeStore.isDark ? 'text-white' : 'text-gray-900'
                      "
                    >
                      {{ t("home.applications.commercialSpaces.title") }}
                    </h3>
                    <p
                      class="text-sm"
                      :class="
                        themeStore.isDark ? 'text-gray-400' : 'text-gray-500'
                      "
                    >
                      {{ t("home.applications.commercialSpaces.description") }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ClientOnly>
      </div>
    </section>

    <!-- Specifications Section -->
    <section class="py-20" :class="themeStore.isDark ? '' : 'bg-gray-50'">
      <div class="mx-auto max-w-6xl px-4 md:px-6">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <!-- Content Side -->
          <div class="order-2 lg:order-1">
            <h2
              class="text-3xl md:text-4xl font-bold mb-4"
              :class="themeStore.isDark ? 'text-white' : 'text-gray-900'"
            >
              {{ t("home.specifications.title") }}
            </h2>
            <p
              class="text-lg mb-8"
              :class="themeStore.isDark ? 'text-gray-300' : 'text-gray-600'"
            >
              {{ t("home.specifications.subtitle") }}
            </p>

            <div class="space-y-6">
              <!-- 8mm Specification -->
              <div
                class="relative p-6 rounded-xl transition-colors hover:border-emerald-500/30"
                :class="
                  themeStore.isDark
                    ? 'bg-gray-800/50 border border-gray-700/50'
                    : 'bg-white/80 border border-gray-200 shadow-lg'
                "
              >
                <div class="absolute -top-3 left-6">
                  <span
                    class="px-4 py-1 bg-emerald-500 text-white text-sm font-bold rounded-full"
                  >
                    8mm
                  </span>
                </div>
                <div class="mt-2">
                  <h3
                    class="text-xl font-semibold mb-2"
                    :class="themeStore.isDark ? 'text-white' : 'text-gray-900'"
                  >
                    {{ t("home.specifications.8mm.title") }}
                  </h3>
                  <p
                    class="mb-4"
                    :class="
                      themeStore.isDark ? 'text-gray-400' : 'text-gray-500'
                    "
                  >
                    {{ t("home.specifications.8mm.description") }}
                  </p>
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="(use, index) in specificationsUses['8mm']"
                      :key="index"
                      class="px-3 py-1 text-sm rounded-full"
                      :class="
                        themeStore.isDark
                          ? 'bg-gray-700/50 text-gray-300'
                          : 'bg-gray-100 text-gray-600'
                      "
                    >
                      {{ use }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- 18mm Specification -->
              <div
                class="relative p-6 rounded-xl transition-colors hover:border-emerald-500/30"
                :class="
                  themeStore.isDark
                    ? 'bg-gray-800/50 border border-gray-700/50'
                    : 'bg-white/80 border border-gray-200 shadow-lg'
                "
              >
                <div class="absolute -top-3 left-6">
                  <span
                    class="px-4 py-1 bg-emerald-500 text-white text-sm font-bold rounded-full"
                  >
                    18mm
                  </span>
                </div>
                <div class="mt-2">
                  <h3
                    class="text-xl font-semibold mb-2"
                    :class="themeStore.isDark ? 'text-white' : 'text-gray-900'"
                  >
                    {{ t("home.specifications.18mm.title") }}
                  </h3>
                  <p
                    class="mb-4"
                    :class="
                      themeStore.isDark ? 'text-gray-400' : 'text-gray-500'
                    "
                  >
                    {{ t("home.specifications.18mm.description") }}
                  </p>
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="(use, index) in specificationsUses['18mm']"
                      :key="index"
                      class="px-3 py-1 text-sm rounded-full"
                      :class="
                        themeStore.isDark
                          ? 'bg-gray-700/50 text-gray-300'
                          : 'bg-gray-100 text-gray-600'
                      "
                    >
                      {{ use }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- 25mm Specification -->
              <div
                class="relative p-6 rounded-xl transition-colors hover:border-emerald-500/30"
                :class="
                  themeStore.isDark
                    ? 'bg-gray-800/50 border border-gray-700/50'
                    : 'bg-white/80 border border-gray-200 shadow-lg'
                "
              >
                <div class="absolute -top-3 left-6">
                  <span
                    class="px-4 py-1 bg-emerald-500 text-white text-sm font-bold rounded-full"
                  >
                    25mm
                  </span>
                </div>
                <div class="mt-2">
                  <h3
                    class="text-xl font-semibold mb-2"
                    :class="themeStore.isDark ? 'text-white' : 'text-gray-900'"
                  >
                    {{ t("home.specifications.25mm.title") }}
                  </h3>
                  <p
                    class="mb-4"
                    :class="
                      themeStore.isDark ? 'text-gray-400' : 'text-gray-500'
                    "
                  >
                    {{ t("home.specifications.25mm.description") }}
                  </p>
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="(use, index) in specificationsUses['25mm']"
                      :key="index"
                      class="px-3 py-1 text-sm rounded-full"
                      :class="
                        themeStore.isDark
                          ? 'bg-gray-700/50 text-gray-300'
                          : 'bg-gray-100 text-gray-600'
                      "
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
            <div
              class="relative aspect-[4/3] rounded-2xl overflow-hidden"
              :class="themeStore.isDark ? 'bg-gray-800' : 'bg-gray-100'"
            >
              <img
                :src="staticData.specifications.image"
                alt="Panel Specifications"
                class="absolute inset-0 w-full h-full object-cover"
                loading="eager"
                @error="
                  ($event.target as HTMLImageElement).src =
                    'https://placehold.co/800x600/1f2937/6b7280?text=Specifications'
                "
              />
            </div>
            <!-- Decorative Element -->
            <div
              class="absolute -bottom-4 -left-4 w-24 h-24 bg-emerald-500/20 rounded-2xl -z-10"
            ></div>
            <div
              class="absolute -top-4 -right-4 w-16 h-16 bg-emerald-500/10 rounded-xl -z-10"
            ></div>
          </div>
        </div>
      </div>
    </section>

    <!-- Design Gallery Section -->
    <section class="py-20" :class="themeStore.isDark ? '' : 'bg-gray-50'">
      <div class="mx-auto max-w-6xl px-4 md:px-6">
        <div class="text-center mb-16">
          <h2
            class="text-3xl md:text-4xl font-bold mb-4"
            :class="themeStore.isDark ? 'text-white' : 'text-gray-900'"
          >
            {{ t("home.gallery.title") }}
          </h2>
          <p
            class="text-lg max-w-2xl mx-auto"
            :class="themeStore.isDark ? 'text-gray-300' : 'text-gray-600'"
          >
            {{ t("home.gallery.subtitle") }}
          </p>
        </div>

        <!-- Gallery Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <!-- Modern Office Space -->
          <div
            class="group overflow-hidden rounded-xl"
            :class="themeStore.isDark ? 'bg-gray-800' : 'bg-white shadow-md'"
          >
            <div class="relative aspect-[4/3] overflow-hidden">
              <img
                :src="staticData.gallery.items[0]?.image"
                :alt="t('home.gallery.modernOfficeSpace.title')"
                class="w-full h-full object-cover"
                @error="
                  ($event.target as HTMLImageElement).src =
                    'https://placehold.co/400x300/1f2937/6b7280?text=Project'
                "
              />
              <div
                v-if="themeStore.isDark"
                class="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300"
              ></div>
            </div>
            <div
              class="px-4 py-3"
              :class="themeStore.isDark ? 'bg-gray-800' : 'bg-white/80'"
            >
              <span
                class="text-xs font-medium"
                :class="
                  themeStore.isDark ? 'text-emerald-400' : 'text-emerald-600'
                "
                >{{ t("home.gallery.modernOfficeSpace.category") }}</span
              >
              <h3
                class="font-semibold text-sm group-hover:text-emerald-500 transition-colors truncate"
                :class="themeStore.isDark ? 'text-white' : 'text-gray-900'"
              >
                {{ t("home.gallery.modernOfficeSpace.title") }}
              </h3>
            </div>
          </div>

          <!-- Luxury Residential Design -->
          <div
            class="group overflow-hidden rounded-xl"
            :class="themeStore.isDark ? 'bg-gray-800' : 'bg-white shadow-md'"
          >
            <div class="relative aspect-[4/3] overflow-hidden">
              <img
                :src="staticData.gallery.items[1]?.image"
                :alt="t('home.gallery.luxuryResidentialDesign.title')"
                class="w-full h-full object-cover"
                @error="
                  ($event.target as HTMLImageElement).src =
                    'https://placehold.co/400x300/1f2937/6b7280?text=Project'
                "
              />
              <div
                v-if="themeStore.isDark"
                class="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300"
              ></div>
            </div>
            <div
              class="px-4 py-3"
              :class="themeStore.isDark ? 'bg-gray-800' : 'bg-white/80'"
            >
              <span
                class="text-xs font-medium"
                :class="
                  themeStore.isDark ? 'text-emerald-400' : 'text-emerald-600'
                "
                >{{ t("home.gallery.luxuryResidentialDesign.category") }}</span
              >
              <h3
                class="font-semibold text-sm group-hover:text-emerald-500 transition-colors truncate"
                :class="themeStore.isDark ? 'text-white' : 'text-gray-900'"
              >
                {{ t("home.gallery.luxuryResidentialDesign.title") }}
              </h3>
            </div>
          </div>

          <!-- Boutique Hotel Lobby -->
          <div
            class="group overflow-hidden rounded-xl"
            :class="themeStore.isDark ? 'bg-gray-800' : 'bg-white shadow-md'"
          >
            <div class="relative aspect-[4/3] overflow-hidden">
              <img
                :src="staticData.gallery.items[2]?.image"
                :alt="t('home.gallery.boutiqueHotelLobby.title')"
                class="w-full h-full object-cover"
                @error="
                  ($event.target as HTMLImageElement).src =
                    'https://placehold.co/400x300/1f2937/6b7280?text=Project'
                "
              />
              <div
                v-if="themeStore.isDark"
                class="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300"
              ></div>
            </div>
            <div
              class="px-4 py-3"
              :class="themeStore.isDark ? 'bg-gray-800' : 'bg-white/80'"
            >
              <span
                class="text-xs font-medium"
                :class="
                  themeStore.isDark ? 'text-emerald-400' : 'text-emerald-600'
                "
                >{{ t("home.gallery.boutiqueHotelLobby.category") }}</span
              >
              <h3
                class="font-semibold text-sm group-hover:text-emerald-500 transition-colors truncate"
                :class="themeStore.isDark ? 'text-white' : 'text-gray-900'"
              >
                {{ t("home.gallery.boutiqueHotelLobby.title") }}
              </h3>
            </div>
          </div>

          <!-- Fashion Retail Store -->
          <div
            class="group overflow-hidden rounded-xl"
            :class="themeStore.isDark ? 'bg-gray-800' : 'bg-white shadow-md'"
          >
            <div class="relative aspect-[4/3] overflow-hidden">
              <img
                :src="staticData.gallery.items[3]?.image"
                :alt="t('home.gallery.fashionRetailStore.title')"
                class="w-full h-full object-cover"
                @error="
                  ($event.target as HTMLImageElement).src =
                    'https://placehold.co/400x300/1f2937/6b7280?text=Project'
                "
              />
              <div
                v-if="themeStore.isDark"
                class="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300"
              ></div>
            </div>
            <div
              class="px-4 py-3"
              :class="themeStore.isDark ? 'bg-gray-800' : 'bg-white/80'"
            >
              <span
                class="text-xs font-medium"
                :class="
                  themeStore.isDark ? 'text-emerald-400' : 'text-emerald-600'
                "
                >{{ t("home.gallery.fashionRetailStore.category") }}</span
              >
              <h3
                class="font-semibold text-sm group-hover:text-emerald-500 transition-colors truncate"
                :class="themeStore.isDark ? 'text-white' : 'text-gray-900'"
              >
                {{ t("home.gallery.fashionRetailStore.title") }}
              </h3>
            </div>
          </div>
        </div>

        <!-- View All Button -->
        <div class="text-center mt-12">
          <NuxtLink
            to="/virtual-design"
            class="inline-flex items-center gap-2 px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/30"
          >
            {{ t("home.gallery.viewAll") }}
            <Icon name="ph:arrow-right" class="h-5 w-5" />
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Video Section -->
    <section class="py-20" :class="themeStore.isDark ? '' : 'bg-gray-50'">
      <div class="mx-auto max-w-6xl px-4 md:px-6">
        <!-- Video Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <div
            v-for="(videoId, index) in staticData.cta.videos"
            :key="index"
            class="group relative overflow-hidden rounded-2xl transition-all duration-300 hover:border-emerald-500/30 shadow-xl hover:shadow-emerald-500/10"
            :class="
              themeStore.isDark
                ? 'bg-gray-800/50 border border-gray-700/50 shadow-black/20'
                : 'bg-white/80 border border-gray-200 shadow-gray-200/50'
            "
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
                <div
                  class="absolute inset-0 bg-black/30 rounded-2xl transition-all duration-300 group-hover:bg-black/20"
                ></div>
                <!-- Play Button -->
                <div class="absolute inset-0 flex items-center justify-center">
                  <div
                    class="flex h-20 w-20 items-center justify-center rounded-full bg-red-600 text-white play-button shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:bg-red-500"
                  >
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
                allow="
                  accelerometer;
                  autoplay;
                  clipboard-write;
                  encrypted-media;
                  gyroscope;
                  picture-in-picture;
                  web-share;
                "
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
