<template>
    <div>
      <p>Authentifizierung läuft...</p>
    </div>
  </template>
  
  <script lang="ts">
  import { onMounted } from 'vue';
  
  export default {
    name: 'AuthCallback',
    setup() {
      onMounted(async () => {
        const urlParams = new URLSearchParams(window.location.search);
        const authCode = urlParams.get('code');
  
        if (authCode) {
          try {
            const response = await fetch('https://api.dropboxapi.com/oauth2/token', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
              },
              body: new URLSearchParams({
                code: authCode,
                grant_type: 'authorization_code',
                client_id: 'qo2g4xx2vvgi7z7',
                client_secret: '3144gx0vnd1k9eb',
                redirect_uri: 'http://localhost:3000/auth/callback',
              }),
            });
  
            if (!response.ok) {
              throw new Error('Fehler beim Abrufen des Tokens');
            }
  
            const data = await response.json();
            console.log('Access Token:', data.access_token);
            console.log('Refresh Token:', data.refresh_token);
  
            // Speichere die Tokens (z. B. im LocalStorage oder Vuex/Pinia)
            localStorage.setItem('accessToken', data.access_token);
            localStorage.setItem('refreshToken', data.refresh_token);
          } catch (error) {
            console.error('Fehler beim Verarbeiten des Autorisierungscodes:', error);
          }
        } else {
          console.error('Kein Autorisierungscode in der URL gefunden.');
        }
      });
    },
  };
  </script>