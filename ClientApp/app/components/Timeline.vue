<template>
  <div class="timeline-container">
    <div class="timeline-wrapper" :class="themeStore.isDark ? 'timeline-dark' : 'timeline-light'">
      <!-- Timeline events -->
      <div
        v-for="(event, index) in events"
        :key="index"
        :class="['timeline-event', index % 2 === 0 ? 'timeline-event-left' : 'timeline-event-right']"
      >
        <!-- Timeline connector line (vertical line between events) -->
        <div v-if="index < events.length - 1" class="timeline-connector"></div>

        <!-- Event marker (dot) -->
        <div class="timeline-marker">
          <span class="timeline-marker-icon" :class="themeStore.isDark ? 'marker-dark' : 'marker-light'"></span>
        </div>

        <!-- Event content card -->
        <div class="timeline-content">
          <div class="timeline-card" :class="themeStore.isDark ? 'card-dark' : 'card-light'">
            <div v-if="event.year || event.date" class="timeline-date">
              {{ event.year || event.date }}
            </div>
            <h3 class="timeline-title" :class="themeStore.isDark ? 'text-white' : 'text-gray-900'">{{ event.title }}</h3>
            <p class="timeline-description" :class="themeStore.isDark ? 'text-gray-300' : 'text-gray-600'">{{ event.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const themeStore = useThemeStore()

interface TimelineEvent {
  title: string
  description: string
  year?: string
  date?: string
  icon?: string
}

defineProps<{
  events: TimelineEvent[]
}>()
</script>

<style scoped>
.timeline-container {
  position: relative;
  max-width: 1200px;
  margin: 0 auto;
}

.timeline-wrapper {
  position: relative;
  padding: 2rem 0;
}

/* Vertical center line - only on desktop */
.timeline-wrapper::before {
  content: '';
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 2px;
  background: linear-gradient(to bottom,
    rgba(16, 185, 129, 0.2) 0%,
    rgba(16, 185, 129, 0.5) 50%,
    rgba(16, 185, 129, 0.2) 100%
  );
  transform: translateX(-50%);
}

.timeline-event {
  position: relative;
  display: flex;
  margin-bottom: 3rem;
  width: 100%;
}

/* Desktop layout - alternate sides */
@media (min-width: 768px) {
  .timeline-event-left {
    justify-content: flex-end;
    padding-right: calc(50% + 2rem);
  }

  .timeline-event-right {
    justify-content: flex-start;
    padding-left: calc(50% + 2rem);
  }
}

/* Mobile layout - all on right */
@media (max-width: 767px) {
  .timeline-wrapper::before {
    left: 1rem;
  }

  .timeline-event {
    padding-left: 3.5rem;
  }

  .timeline-marker {
    left: 0 !important;
    transform: translateX(0) !important;
  }
}

/* Timeline marker (dot) */
.timeline-marker {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
}

.timeline-marker-icon {
  display: block;
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2);
  transition: all 0.3s ease;
}

.timeline-marker-icon.marker-dark {
  border: 3px solid #111827;
}

.timeline-marker-icon.marker-light {
  border: 3px solid #ffffff;
}

.timeline-marker-icon:hover {
  transform: scale(1.3);
  box-shadow: 0 0 0 6px rgba(16, 185, 129, 0.3);
}

/* Connector line between events */
.timeline-connector {
  position: absolute;
  top: 1rem;
  left: 50%;
  transform: translateX(-50%);
  width: 2px;
  height: calc(100% + 2rem);
  background: linear-gradient(to bottom, rgba(16, 185, 129, 0.5), rgba(16, 185, 129, 0.2));
}

@media (max-width: 767px) {
  .timeline-connector {
    left: 1rem;
    transform: translateX(0);
  }
}

/* Event content */
.timeline-content {
  flex: 1;
  max-width: 500px;
}

.timeline-card {
  backdrop-filter: blur(10px);
  border-radius: 1rem;
  padding: 2rem;
  transition: all 0.3s ease;
}

.timeline-card.card-dark {
  background: linear-gradient(135deg, rgba(31, 41, 55, 0.6) 0%, rgba(17, 24, 39, 0.6) 100%);
  border: 1px solid rgba(75, 85, 99, 0.4);
}

.timeline-card.card-light {
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(229, 231, 235, 1);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.timeline-card:hover {
  border-color: rgba(16, 185, 129, 0.5);
  box-shadow: 0 20px 50px rgba(16, 185, 129, 0.1);
  transform: translateY(-4px);
}

.timeline-date {
  color: #10b981;
  font-weight: 600;
  font-size: 0.875rem;
  margin-bottom: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.timeline-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
  transition: color 0.3s ease;
}

.timeline-card:hover .timeline-title {
  color: #10b981;
}

.timeline-description {
  line-height: 1.7;
  font-size: 1.125rem;
}

/* Mobile specific styles */
@media (max-width: 767px) {
  .timeline-marker-icon {
    width: 0.75rem;
    height: 0.75rem;
    border-width: 2px;
  }

  .timeline-card {
    padding: 1.5rem;
  }

  .timeline-title {
    font-size: 1.25rem;
  }

  .timeline-description {
    font-size: 1rem;
  }
}
</style>
