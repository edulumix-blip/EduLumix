import { AD_CLIENT } from '../config/ads';

/**
 * Defer AdSense until after window load + idle time so main content & API
 * are not competing with adsbygoogle.js on the critical path.
 */
let loadPromise = null;
let scheduleStarted = false;

function injectScript() {
  if (typeof document === 'undefined') return Promise.resolve(false);
  if (!AD_CLIENT) return Promise.resolve(false);

  const existing = document.querySelector('script[data-edulumix-adsense]');
  if (existing) {
    return new Promise((resolve) => {
      if (existing.getAttribute('data-loaded') === '1') {
        resolve(true);
        return;
      }
      existing.addEventListener('load', () => resolve(true), { once: true });
      existing.addEventListener('error', () => resolve(false), { once: true });
    });
  }

  return new Promise((resolve) => {
    const s = document.createElement('script');
    s.async = true;
    s.crossOrigin = 'anonymous';
    s.dataset.edulumixAdsense = '1';
    s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${AD_CLIENT}`;
    s.onload = () => {
      s.setAttribute('data-loaded', '1');
      resolve(true);
    };
    s.onerror = () => resolve(false);
    document.head.appendChild(s);
  });
}

/**
 * Start deferred load: after full page load, wait for idle (or max timeout).
 */
export function scheduleAdsenseLoad() {
  if (typeof window === 'undefined' || scheduleStarted) return;
  scheduleStarted = true;

  loadPromise = new Promise((resolve) => {
    const runInject = () => {
      injectScript().then(resolve);
    };

    const whenIdle = () => {
      const ric = window.requestIdleCallback;
      if (typeof ric === 'function') {
        ric(runInject, { timeout: 4000 });
      } else {
        setTimeout(runInject, 2500);
      }
    };

    if (document.readyState === 'complete') {
      whenIdle();
    } else {
      window.addEventListener('load', whenIdle, { once: true });
    }
  });
}

/**
 * Resolve when AdSense script is ready (or failed). Safe to call from AdSlot.
 */
export function waitForAdsenseScript() {
  if (!scheduleStarted) scheduleAdsenseLoad();
  return loadPromise || Promise.resolve(false);
}
