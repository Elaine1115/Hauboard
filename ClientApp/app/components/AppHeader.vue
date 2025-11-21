<script lang="ts" setup>
const { t, locale, setLocale } = useI18n()

const isOpen = ref(false)
const openDropdown = ref<string | null>(null)
const scrollOpacity = ref(0)

const toggleExpand = (path: string) => {
  if (openDropdown.value === path) {
    openDropdown.value = null
  } else {
    openDropdown.value = path
  }
}

const isDropdownOpen = (path: string) => {
  return computed(() => openDropdown.value === path)
}

const handleScroll = () => {
  if (typeof window !== 'undefined') {
    // Calculate opacity based on scroll position (0 to 1)
    // Full opacity at 200px scroll
    const scrollPosition = window.scrollY
    const maxScroll = 200
    scrollOpacity.value = Math.min(scrollPosition / maxScroll, 1)
  }
}

onMounted(() => {
  if (typeof window !== 'undefined') {
    handleScroll() // Check initial state
    window.addEventListener('scroll', handleScroll, { passive: true })
  }
})

onBeforeUnmount(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('scroll', handleScroll)
  }
})

const menuItems = computed(() => [
  { label: t('nav.aboutUs'), path: '/about-us' },
  { label: t('nav.news'), path: '/news' },
  { label: t('nav.provider'), path: '/vendor-introduction' },
  {
    label: t('nav.product'),
    path: '/products',
    children: [
      { label: t('product.woodGrain'), path: '/products?category=woodgrain' },
      { label: t('product.marble'), path: '/products?category=marble' },
      { label: t('product.solid'), path: '/products?category=solid' },
    ]
  },
  { label: t('nav.quality'), path: '/quality-standards' },
  { label: t('nav.faq'), path: '/faq' },
])
</script>

<template>
  <!-- Mobile Nav - Outside header to avoid parent opacity -->
  <div
    class="md:hidden fixed inset-0 flex flex-col bg-gray-950 px-4 pt-6 pb-6 transition-transform duration-300 ease-in-out"
    :class="isOpen ? 'translate-x-0' : 'translate-x-[100%]'"
    style="z-index: 9999;"
  >
    <div class="flex items-center justify-between w-full">
      <h2 class="text-2xl pl-4 font-bold text-white">{{ locale === 'zh' ? '選單' : 'Menu' }}</h2>
      <button
        :aria-expanded="isOpen"
        type="button"
        class="block md:hidden p-2 text-xl text-white"
        @click="isOpen = false"
      >
        <Icon name="ph:x-bold" />
      </button>
    </div>
    <hr class="border-t border-gray-700 my-4" />
    <ul class="grid gap-2">
      <li v-for="item in menuItems" :key="item.path" class="w-full">
        <div class="flex items-center justify-between gap-2">
          <!-- Items without children - navigate -->
          <NuxtLink
            v-if="!item.children"
            :to="item.path"
            class="block px-3 py-2 text-lg transition-all hover:text-emerald-400 hover:-translate-y-0.5"
            @click="isOpen = false"
          >
            {{ item.label }}
          </NuxtLink>
          <!-- Items with children - navigate and toggle dropdown -->
          <NuxtLink
            v-else
            :to="item.path"
            class="block px-3 py-2 text-lg transition-colors hover:text-emerald-400 hover:-translate-y-0.5 text-left flex-1"
            :style="{ color: openDropdown === item.path ? '#34d399' : '#ffffff' }"
            @click="isOpen = false"
          >
            {{ item.label }}
          </NuxtLink>
          <button
            v-if="item.children"
            type="button"
            class="p-2 text-lg transition-transform shrink-0"
            :class="openDropdown === item.path ? 'rotate-180' : ''"
            @click="toggleExpand(item.path)"
          >
            <Icon name="ph:caret-down" />
          </button>
        </div>
        <!-- Mobile submenu -->
        <ul
          v-if="item.children && openDropdown === item.path"
          class="ml-6 space-y-1"
        >
          <li v-for="child in item.children" :key="child.path">
            <NuxtLink
              :to="child.path"
              class="block px-3 py-1 text-lg text-gray-400 hover:text-emerald-400 transition-colors"
              @click="isOpen = false"
            >
              {{ child.label }}
            </NuxtLink>
          </li>
        </ul>
      </li>
    </ul>

    <!-- Language Switcher (Mobile) -->
    <div class="mt-auto flex items-center gap-1 text-sm">
      <button
        type="button"
        class="px-2 py-1 transition-colors"
        :class="locale === 'en' ? 'text-emerald-400' : 'text-white hover:text-emerald-400'"
        @click="setLocale('en')"
      >
        En
      </button>
      <span class="text-gray-500">|</span>
      <button
        type="button"
        class="px-2 py-1 transition-colors"
        :class="locale === 'zh' ? 'text-emerald-400' : 'text-white hover:text-emerald-400'"
        @click="setLocale('zh')"
      >
        中文
      </button>
    </div>
  </div>

  <header
    class="fixed top-0 left-0 right-0 z-50 p-4 md:p-6 overflow-visible transition-all duration-300"
    :style="{
      backgroundColor: `rgba(3, 7, 18, ${scrollOpacity * 0.7})`,
      backdropFilter: `blur(${scrollOpacity * 16}px)`,
      boxShadow: scrollOpacity > 0.2 ? '0 4px 6px -1px rgba(0, 0, 0, 0.3)' : 'none'
    }"
  >
    <nav
      class="mx-auto flex max-w-6xl flex-col justify-between py-2 md:flex-row md:items-center font-medium text-white overflow-visible"
      aria-label="Main"
    >
      <div class="flex items-center justify-between">
        <NuxtLink to="/" class="z-50" @click="isOpen = false">
          <img src="/assets/hauboard_logo.png" alt="Logo" class="h-8" />
          <span class="sr-only">Home page</span>
        </NuxtLink>

        <button
          type="button"
          class="block md:hidden p-2 text-3xl text-white"
          :aria-expanded="isOpen"
          @click="isOpen = true"
        >
          <Icon name="ph:list-bold" />
        </button>
      </div>

      <!-- Desktop Nav -->
      <ul class="hidden gap-10 md:flex">
        <li v-for="item in menuItems" :key="item.path" class="relative group">
          <!-- Items without children - navigate -->
          <NuxtLink
            v-if="!item.children"
            :to="item.path"
            class="inline-flex min-h-11 items-center transition-all hover:text-emerald-400 hover:-translate-y-0.5"
          >
            {{ item.label }}
          </NuxtLink>
          <!-- Items with children - navigate and show dropdown -->
          <NuxtLink
            v-else
            :to="item.path"
            class="inline-flex min-h-11 items-center transition-all hover:text-emerald-400 hover:-translate-y-0.5"
          >
            {{ item.label }}
            <Icon name="ph:caret-down" class="ml-1 text-sm" />
          </NuxtLink>

          <!-- Dropdown -->
          <div
            v-if="item.children"
            class="absolute left-0 top-full pt-2 pb-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50"
          >
          <ul class="min-w-40 rounded-lg bg-gray-900 py-3 shadow-lg pointer-events-auto">
            <li v-for="child in item.children" :key="child.path">
              <NuxtLink
                :to="child.path"
                class="block px-4 py-3 text-sm hover:bg-gray-800 hover:text-emerald-400 transition-colors"
              >
                {{ child.label }}
              </NuxtLink>
            </li>
          </ul>
          </div>
        </li>
      </ul>

      <!-- Language Switcher (Desktop) -->
      <div class="hidden md:flex items-center gap-1 text-sm">
        <button
          type="button"
          class="px-2 py-1 transition-colors"
          :class="locale === 'en' ? 'text-emerald-400' : 'text-white hover:text-emerald-400'"
          @click="setLocale('en')"
        >
          En
        </button>
        <span class="text-gray-500">|</span>
        <button
          type="button"
          class="px-2 py-1 transition-colors"
          :class="locale === 'zh' ? 'text-emerald-400' : 'text-white hover:text-emerald-400'"
          @click="setLocale('zh')"
        >
          中文
        </button>
      </div>
    </nav>
  </header>
</template>