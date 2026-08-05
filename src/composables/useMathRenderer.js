import { nextTick, onMounted, onUpdated, ref } from 'vue'
import renderMathInElement from 'katex/contrib/auto-render'

import 'katex/dist/katex.min.css'

export function useMathRenderer() {
  const mathContainer = ref(null)

  function renderMath() {
    if (!mathContainer.value) {
      return
    }

    renderMathInElement(mathContainer.value, {
      delimiters: [
        {
          left: '$$',
          right: '$$',
          display: true,
        },
        {
          left: '$',
          right: '$',
          display: false,
        },
      ],
      throwOnError: false,
    })
  }

  onMounted(() => {
    renderMath()
  })

  onUpdated(async () => {
    await nextTick()
    renderMath()
  })

  return {
    mathContainer,
  }
}