/**
 * Adsterra Monetization Module
 * 
 * PUBLISHER ID: 5657609
 * 
 * HOW TO CHANGE THE ID:
 * Update the VITE_ADSTERRA_PUBLISHER_ID in your .env file.
 * 
 * HOW TO DISABLE ADS:
 * Set VITE_ENABLE_ADSTERRA=false in your .env file.
 * 
 * HOW TO ADD NEW PLACEMENTS:
 * Use the <AdsterraAd /> component and pass the specific zoneId provided by Adsterra dashboard.
 * Example: <AdsterraAd zoneId="your_zone_id" width={300} height={250} />
 */

export const ADSTERRA_PUBLISHER_ID = (import.meta as any).env.VITE_ADSTERRA_PUBLISHER_ID || '5657609';
export const IS_ADS_ENABLED = (import.meta as any).env.VITE_ENABLE_ADSTERRA !== 'false';

/**
 * Initializes global ad formats like Popunder, Social Bar, or Smartlink.
 * These formats run globally on the page rather than in a specific container.
 * Call this function once at the root of your application.
 */
export const initGlobalAds = () => {
  if (!IS_ADS_ENABLED || typeof window === 'undefined') return;

  // Inject global publisher ID variable as requested
  if (!(window as any).ADSTERRA_PUBLISHER_ID) {
    const pubScript = document.createElement('script');
    pubScript.innerHTML = `const ADSTERRA_PUBLISHER_ID = ${ADSTERRA_PUBLISHER_ID};`;
    document.head.appendChild(pubScript);
    (window as any).ADSTERRA_PUBLISHER_ID = ADSTERRA_PUBLISHER_ID;
  }

  // Example: Initialize Popunder (replace 'YOUR_POPUNDER_ZONE_ID' with actual ID from dashboard)
  // loadGlobalScript('popunder', 'YOUR_POPUNDER_ZONE_ID');
  
  // Example: Initialize Social Bar (replace 'YOUR_SOCIALBAR_ZONE_ID' with actual ID from dashboard)
  // loadGlobalScript('social_bar', 'YOUR_SOCIALBAR_ZONE_ID');
};

/**
 * Helper to load global scripts safely without blocking rendering.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const loadGlobalScript = (format: string, zoneId: string) => {
  const scriptId = `adsterra-${format}`;
  if (document.getElementById(scriptId)) return;

  const script = document.createElement('script');
  script.id = scriptId;
  script.type = 'text/javascript';
  script.async = true;
  script.src = `//pl${zoneId}.puhtml.com/${zoneId}/invoke.js`;
  
  script.onerror = () => {
    console.warn(`[Adsterra] Failed to load ${format} script. AdBlocker might be enabled.`);
  };

  document.head.appendChild(script);
};
