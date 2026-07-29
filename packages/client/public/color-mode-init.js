;(function () {
  var stored = localStorage.getItem('color-mode')
  var isDark =
    stored === 'dark' ||
    (stored !== 'light' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches)
  document.documentElement.classList.add(isDark ? 'dark' : 'light')
})()
