<script lang="ts" setup>
import {
  MapPinIcon,
  PhoneIcon,
  PrinterIcon,
  EnvelopeIcon
} from '@heroicons/vue/24/outline';

const { t } = useI18n();
const themeStore = useThemeStore();
</script>

<template>
  <footer :class="themeStore.isDark ? 'bg-gray-900 text-gray-300' : 'bg-gray-100 text-gray-700'">
    <div class="mx-auto max-w-6xl px-4 py-12 md:px-6">
      <!-- Main Footer Content -->
      <div class="flex flex-col md:flex-row justify-between gap-8">
        <!-- Left Section: Brand & Quick Links -->
        <div class="flex flex-col md:flex-row gap-8 md:gap-16">
          <!-- Brand Section -->
          <div>
            <NuxtLink to="/" class="inline-block mb-4">
              <img
                :src="themeStore.logo"
                alt="Hauboard Logo"
                class="h-10"
              />
            </NuxtLink>
            <p class="text-sm leading-relaxed">
              {{ t('footer.description') }}
            </p>
          </div>
        </div>

        <!-- Right Section: Contact & Social Media -->
        <div class="flex flex-col md:flex-row gap-8 md:gap-12">
          <!-- Contact Information -->
          <div>
            <ul class="space-y-2 text-sm">
              <li :class="themeStore.isDark ? 'text-gray-300' : 'text-gray-700'" class="font-medium">{{ t('footer.companyName') }}</li>
              <li class="flex items-start gap-2">
                <MapPinIcon :class="themeStore.isDark ? 'text-gray-400' : 'text-gray-500'" class="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span class="whitespace-nowrap">{{ t('footer.address') }}</span>
              </li>
              <li class="flex items-center gap-2">
                <PhoneIcon :class="themeStore.isDark ? 'text-gray-400' : 'text-gray-500'" class="w-5 h-5 flex-shrink-0" />
                <span>{{ t('footer.phone') }}</span>
              </li>
              <li class="flex items-center gap-2">
                <PrinterIcon :class="themeStore.isDark ? 'text-gray-400' : 'text-gray-500'" class="w-5 h-5 flex-shrink-0" />
                <span>{{ t('footer.fax') }}</span>
              </li>
              <li class="flex items-center gap-2">
                <EnvelopeIcon :class="themeStore.isDark ? 'text-gray-400' : 'text-gray-500'" class="w-5 h-5 flex-shrink-0" />
                <a :href="`mailto:${t('footer.email')}`" :class="themeStore.isDark ? 'hover:text-white' : 'hover:text-gray-900'" class="transition-colors">
                  {{ t('footer.email') }}
                </a>
              </li>
            </ul>
          </div>

          <!-- Social Media / Additional Info -->
          <div>
            <div class="flex gap-4">
              <!-- Facebook -->
              <a
                href="https://www.facebook.com/HauBoard1"
                target="_blank"
                rel="noopener noreferrer"
                :class="themeStore.isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'"
                class="w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-200"
                aria-label="Facebook"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
                </svg>
              </a>
              <!-- Instagram -->
              <a
                href="https://www.instagram.com/saviola.ecologicalpanel/"
                target="_blank"
                rel="noopener noreferrer"
                :class="themeStore.isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'"
                class="w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-200"
                aria-label="Instagram"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Divider -->
      <div :class="themeStore.isDark ? 'border-gray-800' : 'border-gray-300'" class="border-t mt-8 pt-8">
        <p :class="themeStore.isDark ? 'text-gray-400' : 'text-gray-500'" class="text-sm text-center">
          &copy; {{ new Date().getFullYear() }} {{ t('footer.companyName') }} All rights reserved.
        </p>
      </div>
    </div>
  </footer>
</template>
