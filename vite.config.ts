import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  const config = {
    plugins: [react()],
    base: '/',
  }

  if (command !== 'serve') {
    // https://blog.devgenius.io/how-to-deploy-your-vite-react-app-to-github-pages-with-and-without-react-router-b060d912b10e
    config.base = '/goit-react-hw-04-phonebook/'
  }

  return config
})