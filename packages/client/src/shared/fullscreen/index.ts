export const setFullscreenMode = (ref: HTMLElement | null) => {
  const fullscreenContainer = ref

  if (!fullscreenContainer) return

  fullscreenContainer.requestFullscreen()
}

export const exitFullscreenMode = () => {
  document.exitFullscreen?.()
}
