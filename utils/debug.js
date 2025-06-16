// Environment Variables
const { MODE } = import.meta.env

const isDev = MODE === 'development'

export const devLog = (...args) => {
  if (isDev) {
    console.log(...args)
  }
}

export const devErr = (...args) => {
  if (isDev) {
    console.error(...args)
  }
}
