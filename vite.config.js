import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { handleCommunityApi } from './server/communityApi.js'

function communityApiPlugin() {
  return {
    name: 'indigodle-community-api',
    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        handleCommunityApi(request, response, next)
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), communityApiPlugin()],
})
