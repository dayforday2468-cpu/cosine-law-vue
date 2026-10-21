const START_POINT_COLOR = '#22c55e'
const END_POINT_COLOR = '#ef4444'

export function useRouteLayer() {
  let mapInstance = null
  let mapsApi = null
  let routeData = null

  let routeSegments = []
  let startPoint = null
  let endPoint = null

  let zoomChangedHandler = null

  function getSegmentSize(level) {
    if (level <= 2) return 2
    if (level === 3) return 5
    if (level === 4) return 10
    if (level === 5) return 20

    return 40
  }

  function chunkRoute(route, size) {
    const chunks = []

    for (
      let i = 0;
      i < route.length - 1;
      i += size
    ) {
      const end = Math.min(
        i + size,
        route.length - 1,
      )

      chunks.push(
        route.slice(i, end + 1),
      )
    }

    return chunks
  }

  function clearRouteSegments() {
    for (const segment of routeSegments) {
      segment.setMap(null)
    }

    routeSegments = []
  }

  function clearEndpointMarkers() {
    startPoint?.setMap(null)
    endPoint?.setMap(null)

    startPoint = null
    endPoint = null
  }

  function createPointOverlay({
    position,
    color,
  }) {
    const element = document.createElement('div')

    element.style.width = '16px'
    element.style.height = '16px'
    element.style.border = '3px solid #ffffff'
    element.style.borderRadius = '50%'
    element.style.backgroundColor = color
    element.style.boxSizing = 'border-box'

    return new mapsApi.CustomOverlay({
      map: mapInstance,
      position,
      content: element,
      xAnchor: 0.5,
      yAnchor: 0.5,
    })
  }

  function drawRouteSegments() {
    if (
      !mapInstance
      || !mapsApi
      || !routeData
      || routeData.length < 2
    ) {
      return
    }

    const level = mapInstance.getLevel()
    const segmentSize = getSegmentSize(level)

    const chunks = chunkRoute(
      routeData,
      segmentSize,
    )

    const segments = []

    for (const chunk of chunks) {
      const path = chunk.map(
        ({ latitude, longitude }) =>
          new mapsApi.LatLng(
            latitude,
            longitude,
          ),
      )

      const outline = new mapsApi.Polyline({
        map: mapInstance,
        path,
        strokeWeight: 8,
        strokeColor: '#333333',
        strokeOpacity: 0.9,
        strokeStyle: 'solid',
      })

      const line = new mapsApi.Polyline({
        map: mapInstance,
        path,
        strokeWeight: 5,
        strokeColor: '#FEE500',
        strokeOpacity: 1,
        strokeStyle: 'solid',
      })

      segments.push(
        outline,
        line,
      )
    }

    routeSegments = segments
  }

  function drawEndpointMarkers() {
    if (
      !mapInstance
      || !mapsApi
      || !routeData
      || routeData.length === 0
    ) {
      return
    }

    const start = routeData[0]
    const end = routeData.at(-1)

    startPoint = createPointOverlay({
      position: new mapsApi.LatLng(
        start.latitude,
        start.longitude,
      ),
      color: START_POINT_COLOR,
    })

    endPoint = createPointOverlay({
      position: new mapsApi.LatLng(
        end.latitude,
        end.longitude,
      ),
      color: END_POINT_COLOR,
    })
  }

  function renderRoute() {
    if (
      !mapInstance
      || !mapsApi
      || !routeData
    ) {
      return
    }

    clearRouteSegments()
    drawRouteSegments()
  }

  function initialize({
    map,
    maps,
    route,
  }) {
    mapInstance = map
    mapsApi = maps
    routeData = route

    renderRoute()
    drawEndpointMarkers()

    zoomChangedHandler = () => {
      renderRoute()
    }

    mapsApi.event.addListener(
      mapInstance,
      'zoom_changed',
      zoomChangedHandler,
    )
  }

  function destroy() {
    clearRouteSegments()
    clearEndpointMarkers()

    if (
      mapsApi
      && mapInstance
      && zoomChangedHandler
    ) {
      mapsApi.event.removeListener(
        mapInstance,
        'zoom_changed',
        zoomChangedHandler,
      )
    }

    mapInstance = null
    mapsApi = null
    routeData = null
    zoomChangedHandler = null
  }

  return {
    initialize,
    destroy,
  }
}