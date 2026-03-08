/**
 * Google AdSense configuration
 * Add your ad unit slot IDs from AdSense dashboard when you create display/in-feed ad units.
 * Until then, Auto Ads will work with just the script + meta in index.html.
 */
export const AD_CLIENT = 'ca-pub-7891482727332744';

// Ad unit slot IDs - add when you create ad units in AdSense
// Get these from: AdSense > Ads > By ad unit > [Your ad unit] > Get code
export const AD_SLOTS = {
  // Banner - footer, between content (e.g. 728x90, 300x250 responsive)
  BANNER: import.meta.env.VITE_ADS_SLOT_BANNER || '',
  // In-article / in-feed - for blog posts, job details, resource details
  IN_ARTICLE: import.meta.env.VITE_ADS_SLOT_IN_ARTICLE || '',
  // Sidebar / multipurpose
  SIDEBAR: import.meta.env.VITE_ADS_SLOT_SIDEBAR || '',
};
