import '@testing-library/jest-dom'

// jsdom não implementa matchMedia — a uiStore usa-o para detectar o tema
// do sistema quando theme === "system". Sem isto, qualquer teste que
// importe (mesmo indirectamente) a uiStore rebenta ao carregar o módulo.
if (typeof window !== 'undefined' && !window.matchMedia) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  })
}
