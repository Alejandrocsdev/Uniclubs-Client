// Envieonment Variables
const { MODE, VITE_SERVER_URL, VITE_SERVER_PORT, VITE_WIFI, VITE_WIFI_URL } =
  import.meta.env;

const isProduction = MODE === 'production';
const isWifi = VITE_WIFI === 'true';
const localhost = isWifi ? VITE_WIFI_URL : 'localhost';

// Server Url
export const serverUrl = isProduction
  ? VITE_SERVER_URL
  : `http://${localhost}:${VITE_SERVER_PORT}`;
