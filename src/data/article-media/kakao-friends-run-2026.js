const MEDIA_BASE_URL =
  'https://d2r1gdcfo42wlx.cloudfront.net/articles/kakao-friends-run-2026/photos'

const VIDEO_BASE_URL =
  'https://d2r1gdcfo42wlx.cloudfront.net/articles/kakao-friends-run-2026/videos'

export const bootcampScreenshots = [
  {
    src: `${MEDIA_BASE_URL}/skala_합격.webp`,
    caption: 'SKALA 합격',
  },
  {
    src: `${MEDIA_BASE_URL}/ssafy_합격.webp`,
    caption: 'SSAFY 합격',
  },
  {
    src: `${MEDIA_BASE_URL}/소프티어_합격.webp`,
    caption: '소프티어 합격',
  },
]

export const beforeRunPhotos = [
  {
    src: `${MEDIA_BASE_URL}/20261010_070858.webp`,
    caption: '차에서 내려서 걸어가기',
  },
  {
    src: `${MEDIA_BASE_URL}/20261010_071202.webp`,
    caption: '사람 없을 때 찍은 출발점',
  },
  {
    src: `${MEDIA_BASE_URL}/20261010_071453.webp`,
    caption: '시작 전에도 붐비는 탄천종합운동장',
  },
  {
    src: `${MEDIA_BASE_URL}/20261010_071550.webp`,
    caption: '높은 곳에서 본 탄천종합운동장',
  },
  {
    src: `${MEDIA_BASE_URL}/20261010_073201.webp`,
    caption: '포토존에서 셀카 찰칵',
  },
]

export const duringRunPhotos = [
  {
    src: `${MEDIA_BASE_URL}/20261010_080917.webp`,
    caption: '레이스를 응원하는 악단',
  },
  {
    src: `${MEDIA_BASE_URL}/20261010_082000.webp`,
    caption: '출발선에 모인 참가자들',
  },
  {
    src: `${MEDIA_BASE_URL}/20261010_082044.webp`,
    caption: '출발전 셀카 한방',
  },
  {
    src: `${MEDIA_BASE_URL}/20261010_082739.webp`,
    caption: '출발!',
  },
  {
    src: `${MEDIA_BASE_URL}/20261010_083326.webp`,
    caption: '그림같은 커브길',
  },
  {
    src: `${MEDIA_BASE_URL}/20261010_083829.webp`,
    caption: '꼭 다시 보길 바라요..',
  },
  {
    src: `${MEDIA_BASE_URL}/20261010_084107.webp`,
    caption: '인생 첫 급수: 파워에이드',
  },
  {
    src: `${MEDIA_BASE_URL}/20261010_084247.webp`,
    caption: '쿨링팬 야르~',
  },
  {
    src: `${MEDIA_BASE_URL}/20261010_085504.webp`,
    caption: '완주했습니다.',
  },
]

export const runPhotos = [
  {
    assetKey: '20261010_082739.webp',
    caption: '출발',
  },
  {
    assetKey: '20261010_083326.webp',
    caption: '커브길',
  },
  {
    assetKey: '20261010_083709.webp',
    caption: '반환점',
  },
  {
    assetKey: '20261010_084107.webp',
    caption: '급수대',
  },
  {
    assetKey: '20261010_084247.webp',
    caption: '쿨링존',
  },
]

export const afterRunPhotos = [
  {
    src: `${MEDIA_BASE_URL}/20261010_090529.webp`,
    caption: '완주 기념 포토존에서',
  },
  {
    src: `${MEDIA_BASE_URL}/20261010_091417.webp`,
    caption: '골드바 겟또!',
  },
  {
    src: `${MEDIA_BASE_URL}/20261010_095345.webp`,
    caption: '달리고, 또 달리기',
  },
  {
    src: `${MEDIA_BASE_URL}/20261010_102639.webp`,
    caption: '참치는 못 참치!',
  },
  {
    src: `${MEDIA_BASE_URL}/20261011_094154.webp`,
    caption: '받은 참치로 만든 샌드위치',
  },
]

export const johnParkIntroVideo = {
  src: `${VIDEO_BASE_URL}/20261010_102700.mp4`,
  caption: '존박 오프닝',
}

export const ResceneIntroVideo = {
  src: `${VIDEO_BASE_URL}/20261010_105206.mp4`,
  caption: '리센느 오프닝',
}

export function createRunPhotoSrc(assetKey) {
  return `${MEDIA_BASE_URL}/${assetKey}`
}

export function createRunPhotoData(mapPhotos) {
  const contentByAssetKey = new Map(
    runPhotos.map(photo => [
      photo.assetKey,
      photo,
    ]),
  )

  return mapPhotos.map(photo => ({
    ...photo,
    ...contentByAssetKey.get(photo.assetKey),
    src: createRunPhotoSrc(photo.assetKey),
  }))
}
