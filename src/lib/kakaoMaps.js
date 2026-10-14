let kakaoMapsPromise

export function loadKakaoMaps() {
  if (window.kakao?.maps) {
    return Promise.resolve(window.kakao.maps)
  }

  if (kakaoMapsPromise) {
    return kakaoMapsPromise
  }

  const appKey = import.meta.env.VITE_KAKAO_MAP_KEY

  if (!appKey) {
    return Promise.reject(
      new Error('VITE_KAKAO_MAP_KEY is not configured'),
    )
  }

  kakaoMapsPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script')

    script.src =
      `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&autoload=false`

    script.onload = () => {
      window.kakao.maps.load(() => {
        resolve(window.kakao.maps)
      })
    }

    script.onerror = () => {
      kakaoMapsPromise = undefined
      reject(new Error('Failed to load Kakao Maps SDK'))
    }

    document.head.appendChild(script)
  })

  return kakaoMapsPromise
}
