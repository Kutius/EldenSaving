import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'
import { presetUno, presetAttributify, presetIcons } from 'unocss'
import unocss from 'unocss/vite'

// https://vitejs.dev/config/
export default defineConfig(async () => ({
  plugins: [unocss({ presets: [presetUno(), presetAttributify(), presetIcons()] }), solid()],

  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  //
  // 1. prevent vite from obscuring rust errors
  clearScreen: false,
  // 2. tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1420,
    strictPort: true,
    watch: {
      // 3. tell vite to ignore watching `src-tauri`
      ignored: ['**/src-tauri/**'],
    },
  },
}))
