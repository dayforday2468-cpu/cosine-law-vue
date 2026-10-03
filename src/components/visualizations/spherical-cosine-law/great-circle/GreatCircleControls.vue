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
const searchResults = ref([])
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
  searchResults.value = []

  try {
    const params = new URLSearchParams({
      q: keyword,
      format: 'jsonv2',
      addressdetails: '1',
      limit: '5',
    })

    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?${params.toString()}`,
      {
        headers: {
          'Accept-Language': 'ko',
        },
      },
    )

    if (!response.ok) {
      throw new Error('도시 검색 요청에 실패했습니다.')
    }

    const data = await response.json()

    searchResults.value = data
      .filter((result) => Number.isFinite(Number(result.lat)) && Number.isFinite(Number(result.lon)))
      .map((result) => ({
        name:
          result.address?.city ||
          result.address?.town ||
          result.address?.village ||
          result.name ||
          result.display_name.split(',')[0],
        displayName: result.display_name,
        lat: Number(result.lat),
        lng: Number(result.lon),
      }))

    if (searchResults.value.length === 0) {
      searchError.value = '검색 결과가 없습니다.'
    }
  } catch (error) {
    searchError.value = error instanceof Error ? error.message : '도시 검색 중 오류가 발생했습니다.'
  } finally {
    isSearching.value = false
  }
}

function selectDestination(city) {
  destination.value = {
    name: city.name,
    lat: city.lat,
    lng: city.lng,
  }

  query.value = city.name
  searchResults.value = []
  searchError.value = ''
}
</script>

<template>
  <section class="great-circle-controls">
    <div class="location-summary">
      <span class="location-label">출발지</span>
      <strong>{{ origin.name }}</strong>
      <span>{{ origin.lat.toFixed(4) }}°, {{ origin.lng.toFixed(4) }}°</span>
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
          placeholder="예: 런던, 뉴욕, 파리"
          autocomplete="off"
        />

        <button type="submit" :disabled="isSearching || !query.trim()">
          {{ isSearching ? '검색 중' : '검색' }}
        </button>
      </div>
    </form>

    <p v-if="searchError" class="search-message">{{ searchError }}</p>

    <ul v-if="searchResults.length > 0" class="search-results">
      <li v-for="city in searchResults" :key="`${city.lat}-${city.lng}`">
        <button type="button" @click="selectDestination(city)">
          <strong>{{ city.name }}</strong>
          <span>{{ city.displayName }}</span>
        </button>
      </li>
    </ul>

    <div class="location-summary">
      <span class="location-label">도착지</span>
      <strong>{{ destination.name }}</strong>
      <span>{{ destination.lat.toFixed(4) }}°, {{ destination.lng.toFixed(4) }}°</span>
    </div>

    <VerificationCard title="대권거리">
      <div class="route-name">{{ origin.name }} → {{ destination.name }}</div>

      <p class="distance-result">
        약 {{ Math.round(distance).toLocaleString('ko-KR') }} km
      </p>
    </VerificationCard>

    <p class="data-source">
      도시 검색 데이터: OpenStreetMap Nominatim
    </p>
  </section>
</template>

<style scoped>
.great-circle-controls {
  min-width: 0;
  max-width: 100%;
}

.location-summary {
  display: grid;
  gap: var(--space-xs);

  margin-bottom: var(--space-m);
  padding: var(--space-s);

  border: var(--border-default);
  border-radius: var(--radius-m);

  background: var(--color-background-sub);
  color: var(--color-text-content);

  font-family: var(--font-family-content);
  font-size: var(--font-size-s);
  line-height: 1.5;
}

.location-label {
  color: var(--color-text-sub);
  font-weight: var(--font-weight-semibold);
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

.search-row button,
.search-results button {
  border: var(--border-default);
  border-radius: var(--radius-s);

  background: var(--color-background);
  color: var(--color-main);

  font-family: var(--font-family-content);

  cursor: pointer;
}

.search-row button {
  padding: var(--space-s) var(--space-m);

  font-size: var(--font-size-s);
  font-weight: var(--font-weight-semibold);
}

.search-row button:hover,
.search-results button:hover {
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

.search-results {
  display: grid;
  gap: var(--space-xs);

  margin: 0 0 var(--space-m);
  padding: 0;

  list-style: none;
}

.search-results button {
  display: grid;
  gap: var(--space-xs);

  width: 100%;
  padding: var(--space-s);

  text-align: left;
}

.search-results button strong {
  font-size: var(--font-size-s);
}

.search-results button span {
  color: var(--color-text-sub);
  font-size: var(--font-size-xs);
  line-height: 1.4;
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

.data-source {
  margin: var(--space-s) 0 0;

  color: var(--color-text-sub);
  font-family: var(--font-family-content);
  font-size: var(--font-size-xs);
  line-height: 1.5;
  text-align: center;
}
</style>
