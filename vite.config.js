// Libraries
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// Vite Config
export default defineConfig(({ mode }) => {
  // cwd: current working directory
  const env = loadEnv(mode, process.cwd(), '')

  // Mode
  console.info('Mode:', mode)

  return { plugins: [react()], server: { host: true, port: Number(env.PORT) } }
})
