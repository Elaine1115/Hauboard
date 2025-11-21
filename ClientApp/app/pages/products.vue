<script setup lang="ts">
import productsData from '../../i18n/locales/products.json'

const { locale } = useI18n()

const products = computed(() => {
  const langData = productsData[locale.value as 'zh' | 'en']
  return {
    ...langData,
    hero: {
      ...langData.hero,
      ...productsData.common.hero
    }
  }
})

useSeoMeta({
  title: computed(() => products.value.seo.title),
  ogTitle: computed(() => products.value.seo.title),
  description: computed(() => products.value.seo.description),
  ogDescription: computed(() => products.value.seo.description),
})
</script>

<template>
  <main class="min-h-screen">
    <!-- Hero Section -->
    <PageHero
      :title="products.hero.title"
      :subtitle="products.hero.subtitle"
      :background-image="products.hero.backgroundImage"
    />

    <!-- Gallery Section -->
    <SectionContainer
      :title="products.gallery.title"
      :subtitle="products.gallery.subtitle"
      bg-class="bg-gray-900/30"
    >
      <ClientOnly>
        <Gallery
          :images="products.images"
        />
      </ClientOnly>
    </SectionContainer>
  </main>
</template>
