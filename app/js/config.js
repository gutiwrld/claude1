// Configuración de la app.
//
// SUPABASE: rellena url y anonKey con tu proyecto (Project Settings → API)
// y ejecuta app/supabase/schema.sql en el SQL Editor.
//
// MODO DEMO: si url/anonKey se dejan vacíos, la app funciona sin backend:
// los avisos se guardan en este navegador y el panel de sala (sala.html)
// puede confirmarlos desde otra pestaña del mismo dispositivo. Perfecto
// para enseñar el flujo completo a un restaurante piloto sin montar nada.
window.APP_CONFIG = {
  appName: 'Aliva',
  tagline: 'Come tranquilo',
  supabaseUrl: '',
  supabaseAnonKey: '',
  // Minutos sin confirmación de sala antes de pedir al usuario
  // que avise en persona (requisito anti-falsa-seguridad).
  confirmTimeoutMin: 5,
};
