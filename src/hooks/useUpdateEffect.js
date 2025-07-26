// Libraries
import { useEffect, useRef } from 'react'

const useUpdateEffect = (effect, dependencies) => {
  const isFirst = useRef(true)

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false
      return
    }

    return effect()
  }, dependencies)
}

export default useUpdateEffect
