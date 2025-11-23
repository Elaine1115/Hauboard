<script lang="ts" setup>
import { getMenuItems } from '~/config/menu'

const { t, locale, setLocale } = useI18n()
const themeStore = useThemeStore()

// Initialize theme on mount
onMounted(() => {
  themeStore.initTheme()
})

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

const menuItems = computed(() => getMenuItems(locale.value))
</script>

<template>
  <!-- Mobile Nav - Outside header to avoid parent opacity -->
  <div
    class="md:hidden fixed inset-0 flex flex-col px-4 pt-6 pb-6 transition-transform duration-300 ease-in-out"
    :class="[
      isOpen ? 'translate-x-0' : 'translate-x-[100%]',
      themeStore.isDark ? 'bg-gray-950 text-white' : 'bg-white text-gray-900'
    ]"
    style="z-index: 9999;"
  >
    <div class="flex items-center justify-between w-full">
      <h2 class="text-2xl pl-4 font-bold">{{ locale === 'zh' ? '選單' : 'Menu' }}</h2>
      <button
        :aria-expanded="isOpen"
        type="button"
        class="block md:hidden p-2 text-xl"
        @click="isOpen = false"
      >
        <Icon name="ph:x-bold" />
      </button>
    </div>
    <hr :class="themeStore.isDark ? 'border-gray-700' : 'border-gray-300'" class="border-t my-4" />
    <ul class="grid gap-2">
      <li v-for="item in menuItems" :key="item.path" class="w-full">
        <div class="flex items-center justify-between gap-2">
          <!-- Items without children - navigate -->
          <NuxtLink
            v-if="!item.children"
            :to="item.path"
            class="block px-3 py-2 text-lg transition-all hover:text-emerald-500 hover:-translate-y-0.5"
            @click="isOpen = false"
          >
            {{ item.label }}
          </NuxtLink>
          <!-- Items with children - navigate and toggle dropdown -->
          <NuxtLink
            v-else
            :to="item.path"
            class="block px-3 py-2 text-lg transition-colors hover:text-emerald-500 hover:-translate-y-0.5 text-left flex-1"
            :style="{ color: openDropdown === item.path ? '#10b981' : undefined }"
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
              :class="themeStore.isDark ? 'text-gray-400' : 'text-gray-600'"
              class="block px-3 py-1 text-lg hover:text-emerald-500 transition-colors"
              @click="isOpen = false"
            >
              {{ child.label }}
            </NuxtLink>
          </li>
        </ul>
      </li>
    </ul>

    <!-- Theme Toggle & Language Switcher (Mobile) -->
    <div class="mt-auto flex items-center justify-between">
      <!-- Theme Toggle -->
      <button
        type="button"
        class="p-2 rounded-lg transition-colors"
        :class="themeStore.isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-200'"
        @click="themeStore.toggleTheme"
        :aria-label="themeStore.isDark ? 'Switch to light mode' : 'Switch to dark mode'"
      >
        <Icon :name="themeStore.isDark ? 'ph:sun' : 'ph:moon'" class="w-5 h-5" />
      </button>

      <!-- Language Switcher -->
      <div class="flex items-center gap-1 text-sm">
        <button
          type="button"
          class="px-2 py-1 transition-colors"
          :class="locale === 'en' ? 'text-emerald-500' : (themeStore.isDark ? 'text-white hover:text-emerald-500' : 'text-gray-900 hover:text-emerald-500')"
          @click="setLocale('en')"
        >
          En
        </button>
        <span :class="themeStore.isDark ? 'text-gray-500' : 'text-gray-400'">|</span>
        <button
          type="button"
          class="px-2 py-1 transition-colors"
          :class="locale === 'zh' ? 'text-emerald-500' : (themeStore.isDark ? 'text-white hover:text-emerald-500' : 'text-gray-900 hover:text-emerald-500')"
          @click="setLocale('zh')"
        >
          中文
        </button>
      </div>
    </div>
  </div>

  <header
    class="fixed top-0 left-0 right-0 z-50 p-4 md:p-6 overflow-visible transition-all duration-300"
    :style="{
      backgroundColor: themeStore.isDark
        ? `rgba(3, 7, 18, ${scrollOpacity * 0.7})`
        : `rgba(255, 255, 255, ${scrollOpacity * 0.9})`,
      backdropFilter: `blur(${scrollOpacity * 16}px)`,
      boxShadow: scrollOpacity > 0.2
        ? (themeStore.isDark ? '0 4px 6px -1px rgba(0, 0, 0, 0.3)' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)')
        : 'none'
    }"
  >
    <nav
      class="mx-auto flex max-w-6xl flex-col justify-between py-2 md:flex-row md:items-center font-medium overflow-visible"
      :class="themeStore.isDark ? 'text-white' : 'text-gray-900'"
      aria-label="Main"
    >
      <div class="flex items-center justify-between">
        <NuxtLink to="/" class="z-50" @click="isOpen = false">
          <img :src="themeStore.logo" alt="Logo" class="h-8" />
          <span class="sr-only">Home page</span>
        </NuxtLink>

        <button
          type="button"
          class="block md:hidden p-2 text-3xl"
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
            class="inline-flex min-h-11 items-center transition-all hover:text-emerald-500 hover:-translate-y-0.5"
          >
            {{ item.label }}
          </NuxtLink>
          <!-- Items with children - navigate and show dropdown -->
          <NuxtLink
            v-else
            :to="item.path"
            class="inline-flex min-h-11 items-center transition-all hover:text-emerald-500 hover:-translate-y-0.5"
          >
            {{ item.label }}
            <Icon name="ph:caret-down" class="ml-1 text-sm" />
          </NuxtLink>

          <!-- Dropdown -->
          <div
            v-if="item.children"
            class="absolute left-0 top-full pt-2 pb-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50"
          >
          <ul
            class="min-w-40 rounded-lg py-3 shadow-lg pointer-events-auto"
            :class="themeStore.isDark ? 'bg-gray-900' : 'bg-white border border-gray-200'"
          >
            <li v-for="child in item.children" :key="child.path">
              <NuxtLink
                :to="child.path"
                class="block px-4 py-3 text-sm hover:text-emerald-500 transition-colors"
                :class="themeStore.isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'"
              >
                {{ child.label }}
              </NuxtLink>
            </li>
          </ul>
          </div>
        </li>
      </ul>

      <!-- Theme Toggle & Language Switcher (Desktop) -->
      <div class="hidden md:flex items-center gap-3">
        <!-- Theme Toggle -->
        <button
          type="button"
          class="p-2 rounded-lg transition-colors"
          :class="themeStore.isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-200'"
          @click="themeStore.toggleTheme"
          :aria-label="themeStore.isDark ? 'Switch to light mode' : 'Switch to dark mode'"
        >
          <Icon :name="themeStore.isDark ? 'ph:sun' : 'ph:moon'" class="w-5 h-5" />
        </button>

        <!-- Language Switcher -->
        <div class="flex items-center gap-1 text-sm">
          <button
            type="button"
            class="px-2 py-1 transition-colors"
            :class="locale === 'en' ? 'text-emerald-500' : 'hover:text-emerald-500'"
            @click="setLocale('en')"
          >
            En
          </button>
          <span :class="themeStore.isDark ? 'text-gray-500' : 'text-gray-400'">|</span>
          <button
            type="button"
            class="px-2 py-1 transition-colors"
            :class="locale === 'zh' ? 'text-emerald-500' : 'hover:text-emerald-500'"
            @click="setLocale('zh')"
          >
            中文
          </button>
        </div>
      </div>
    </nav>
  </header>
</template>