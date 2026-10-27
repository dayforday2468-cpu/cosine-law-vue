export const sources = [
  {
    title: '도시 검색 데이터',
    contribution:
      '대권거리 시각화에서 도시명을 검색하고 도착지의 위도·경도 정보를 가져오는 데 사용했습니다.',
    source: 'Open-Meteo / GeoNames',
    links: [
      {
        label: 'Open-Meteo Geocoding API',
        url: 'https://open-meteo.com/en/docs/geocoding-api',
      },
      {
        label: 'GeoNames',
        url: 'https://www.geonames.org/',
      },
    ],
    license: 'CC BY 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
  },
  {
    title: '3D 지구본 시각화',
    contribution:
      '지구본과 대권 경로를 시각화하고, example의 Blue Marble 이미지를 사용했습니다.',
    source: 'three-globe',
    links: [
      {
        label: 'GitHub',
        url: 'https://github.com/vasturiano/three-globe',
      },
    ],
    license: 'MIT',
    licenseUrl: 'https://github.com/vasturiano/three-globe/blob/master/LICENSE',
  },
]
