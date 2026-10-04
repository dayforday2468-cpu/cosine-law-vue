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
      '대권거리의 출발지와 도착지, 두 지점을 잇는 구면 경로를 3D 지구본으로 표현하는 데 사용했습니다.',
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
