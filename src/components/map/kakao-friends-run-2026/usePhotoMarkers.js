function createPhotoMarker({
  map,
  maps,
  photo,
}) {
  const position = new maps.LatLng(
    photo.latitude,
    photo.longitude,
  )

  const marker = new maps.Marker({
    map,
    position,
    clickable: true,
  })

  const content = document.createElement('button')

  content.type = 'button'
  content.style.border = 'var(--border-default)'
  content.style.borderRadius = 'var(--radius-m)'
  content.style.background = 'var(--color-background)'
  content.style.color = 'var(--color-text-content)'
  content.style.fontFamily = 'var(--font-family-content)'
  content.style.fontSize = 'var(--font-size-s)'
  content.style.fontWeight = 'var(--font-weight-semibold)'
  content.style.boxShadow =
    '0 2px 8px rgb(15 23 42 / 18%)'
  content.style.cursor = 'pointer'
  content.style.overflow = 'hidden'

  const overlay = new maps.CustomOverlay({
    position,
    content,
    xAnchor: 0.5,
    yAnchor: 1.15,
    zIndex: 10,
  })

  let expanded = false

  function renderCaption() {
    content.replaceChildren()
    content.textContent = photo.caption

    content.style.padding =
      'var(--space-s) var(--space-m)'
    content.style.cursor = 'default'
  }

  function renderPhoto() {
    const image = document.createElement('img')

    image.src = photo.src
    image.alt = photo.caption
    image.style.display = 'block'
    image.style.width = '180px'
    image.style.height = 'auto'

    content.replaceChildren(image)

    content.style.padding = '4px'
    content.style.cursor = 'pointer'
  }

  const mouseOverHandler = () => {
    if (expanded) {
      return
    }

    renderCaption()
    overlay.setZIndex(10)
    overlay.setMap(map)
  }

  const mouseOutHandler = () => {
    if (!expanded) {
      overlay.setMap(null)
    }
  }

  const markerClickHandler = () => {
    expanded = true

    renderPhoto()
    overlay.setZIndex(20)
    overlay.setMap(map)
  }

  const photoClickHandler = (event) => {
    event.stopPropagation()

    if (!expanded) {
      return
    }

    expanded = false
    overlay.setMap(null)
  }

  maps.event.addListener(
    marker,
    'mouseover',
    mouseOverHandler,
  )

  maps.event.addListener(
    marker,
    'mouseout',
    mouseOutHandler,
  )

  maps.event.addListener(
    marker,
    'click',
    markerClickHandler,
  )

  content.addEventListener(
    'click',
    photoClickHandler,
  )

  return {
    marker,
    overlay,
    mouseOverHandler,
    mouseOutHandler,
    markerClickHandler,
    content,
    photoClickHandler,
  }
}

export function usePhotoMarkers({
  map,
  maps,
  photos,
}) {
  const photoMarkers = photos.map(photo =>
    createPhotoMarker({
      map,
      maps,
      photo,
    }),
  )

  function destroy() {
    for (const photoMarker of photoMarkers) {
      const {
        marker,
        overlay,
        mouseOverHandler,
        mouseOutHandler,
        markerClickHandler,
        content,
        photoClickHandler,
      } = photoMarker

      maps.event.removeListener(
        marker,
        'mouseover',
        mouseOverHandler,
      )

      maps.event.removeListener(
        marker,
        'mouseout',
        mouseOutHandler,
      )

      maps.event.removeListener(
        marker,
        'click',
        markerClickHandler,
      )

      content.removeEventListener(
        'click',
        photoClickHandler,
      )

      overlay.setMap(null)
      marker.setMap(null)
    }
  }

  return {
    destroy,
  }
}