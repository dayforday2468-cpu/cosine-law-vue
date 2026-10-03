<script setup>
import { computed, ref } from 'vue'

import { VerificationCard } from '@/components/visualizations/common'

const props = defineProps({
  origin: {
    type: Object,
    required: true,
  },
})

const destination = defineModel('destination', {
  type: Object,
  required: true,
})

const query = ref('')
const isSearching = ref(false)
const searchError = ref('')

const EARTH_RADIUS_KM = 6371.0088

// --------------------------------------
// 대권거리 계산
// --------------------------------------

const distance = computed(() => {
  const lat1 = (props.origin.lat * Math.PI) / 180
  const lat2 = (destination.value.lat * Math.PI) / 180
  const deltaLat = ((destination.value.lat - props.origin.lat) * Math.PI) / 180
  const deltaLng = ((destination.value.lng - props.origin.lng) * Math.PI) / 180

  const a =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLng / 2) ** 2

  const centralAngle = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return EARTH_RADIUS_KM * centralAngle
})

// --------------------------------------
// 도시 검색
// --------------------------------------

async function searchCity() {
  const keyword = query.value.trim()

  if (!keyword || isSearching.value) {
    return
  }

  isSearching.value = true
  searchError.value = ''

  try {
    const params = new URLSearchParams({
      name: keyword,
      count: '1',
      language: 'ko',
      format: 'json',
    })

    const response = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?${params.toString()}`,
    )

    if (!response.ok) {
      throw new Error('도시 검색 요청에 실패했습니다.')
    }

    const data = await response.json()
    const city = data.results?.[0]

    if (!city) {
      searchError.value = '검색 결과가 없습니다.'
      return
    }

    destination.value = {
      name: city.name,
      country: city.country ?? '',
      lat: Number(city.latitude),
      lng: Number(city.longitude),
    }

    query.value = city.name
  } catch (error) {
    searchError.value =
      error instanceof Error
        ? error.message
        : '도시 검색 중 오류가 발생했습니다.'
  } finally {
    isSearching.value = false
  }
}
</script>

<template>
  <section class="great-circle-controls">
    <div class="location-summary">
      <div class="location-heading">
        <span class="location-label">출발지</span>
        <strong>
          {{ origin.name }}
          <span v-if="origin.country" class="location-country">· {{ origin.country }}</span>
        </strong>
      </div>

      <dl class="coordinate-list">
        <div>
          <dt>위도</dt>
          <dd>{{ origin.lat.toFixed(4) }}°</dd>
        </div>

        <div>
          <dt>경도</dt>
          <dd>{{ origin.lng.toFixed(4) }}°</dd>
        </div>
      </dl>
    </div>

    <form class="city-search" @submit.prevent="searchCity">
      <label class="visualizer-control-label" for="destination-city">
        <span>도착 도시 검색</span>
      </label>

      <div class="search-row">
        <input
          id="destination-city"
          v-model="query"
          type="search"
          placeholder="예: 파리, 런던, 뉴욕"
          autocomplete="off"
        />

        <button type="submit" :disabled="isSearching || !query.trim()">
          {{ isSearching ? '검색 중' : '검색' }}
        </button>
      </div>
    </form>

    <p v-if="searchError" class="search-message">{{ searchError }}</p>

    <div class="location-summary">
      <div class="location-heading">
        <span class="location-label">도착지</span>
        <strong>
          {{ destination.name }}
          <span v-if="destination.country" class="location-country">
            · {{ destination.country }}
          </span>
        </strong>
      </div>

      <dl class="coordinate-list">
        <div>
          <dt>위도</dt>
          <dd>{{ destination.lat.toFixed(4) }}°</dd>
        </div>

        <div>
          <dt>경도</dt>
          <dd>{{ destination.lng.toFixed(4) }}°</dd>
        </div>
      </dl>
    </div>

    <VerificationCard title="대권거리">
      <div class="route-name">{{ origin.name }} → {{ destination.name }}</div>

      <p class="distance-result">
        약 {{ Math.round(distance).toLocaleString('ko-KR') }} km
      </p>
    </VerificationCard>

    <p class="attribution">Open-Meteo · GeoNames</p>
  </section>
</template>

<style scoped>
.great-circle-controls {
  min-width: 0;
  max-width: 100%;
}

.location-summary {
  margin-bottom: var(--space-m);
  padding: var(--space-s) var(--space-m);

  border: var(--border-default);
  border-radius: var(--radius-m);

  background: var(--color-background-sub);
  color: var(--color-text-content);

  font-family: var(--font-family-content);
  font-size: var(--font-size-s);
}

.location-heading {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--space-s);

  margin-bottom: var(--space-s);
}

.location-label {
  flex: 0 0 auto;

  color: var(--color-text-sub);
  font-weight: var(--font-weight-semibold);
}

.location-heading strong {
  min-width: 0;

  color: var(--color-text-main);
  font-size: var(--font-size-m);
  text-align: right;
}

.location-country {
  color: var(--color-text-sub);
  font-size: var(--font-size-s);
  font-weight: var(--font-weight-regular);
}

.coordinate-list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-s);

  margin: 0;
}

.coordinate-list div {
  display: flex;
  align-items: baseline;
  gap: var(--space-xs);

  min-width: 0;
}

.coordinate-list dt {
  color: var(--color-text-sub);
  font-weight: var(--font-weight-semibold);
}

.coordinate-list dd {
  margin: 0;

  color: var(--color-text-content);
  font-variant-numeric: tabular-nums;
}

.city-search {
  margin-bottom: var(--space-s);
}

.city-search label {
  display: block;
  margin-bottom: var(--space-s);
}

.search-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: var(--space-s);
}

.search-row input {
  min-width: 0;
  padding: var(--space-s);

  border: var(--border-default);
  border-radius: var(--radius-s);

  background: var(--color-background);
  color: var(--color-text-content);

  font-family: var(--font-family-content);
  font-size: var(--font-size-m);
}

.search-row button {
  padding: var(--space-s) var(--space-m);

  border: var(--border-default);
  border-radius: var(--radius-s);

  background: var(--color-background);
  color: var(--color-main);

  font-family: var(--font-family-content);
  font-size: var(--font-size-s);
  font-weight: var(--font-weight-semibold);

  cursor: pointer;
}

.search-row button:hover {
  background: var(--color-main-sub);
}

.search-row button:disabled {
  cursor: default;
  opacity: 0.55;
}

.search-message {
  margin: 0 0 var(--space-s);

  color: var(--color-text-sub);
  font-family: var(--font-family-content);
  font-size: var(--font-size-s);
}

.route-name {
  margin-bottom: var(--space-s);

  color: var(--color-text-content);
  font-family: var(--font-family-content);
  font-size: var(--font-size-m);
  text-align: center;
}

.distance-result {
  margin: 0;

  color: var(--color-text-content);
  font-family: var(--font-family-content);
  font-size: var(--font-size-l);
  font-weight: var(--font-weight-semibold);
  text-align: center;
}

.attribution {
  margin: var(--space-s) 0 0;

  color: var(--color-text-sub);
  font-family: var(--font-family-content);
  font-size: var(--font-size-xs);
  line-height: 1.4;
  text-align: right;
}
</style>
