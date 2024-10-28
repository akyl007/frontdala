import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Слушаем все IP-адреса
    port: 5173,      // Убедитесь, что используете тот же порт
  }
});
