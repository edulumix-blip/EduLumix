import { useEffect, useRef } from 'react';
import { AD_CLIENT } from '../../config/ads';

/**
 * Google AdSense ad slot component.
 * Renders nothing when slotId is empty (Auto Ads will still work via index.html script).
 * When slotId is set, renders a display ad unit.
 */
const AdSlot = ({ slotId, format = 'auto', className = '', style = {} }) => {
  const adRef = useRef(null);

  useEffect(() => {
    if (!slotId || !AD_CLIENT) return;

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.warn('AdSense push error:', e);
    }
  }, [slotId]);

  if (!slotId) return null;

  return (
    <div className={`adsense-slot min-h-[90px] flex items-center justify-center ${className}`} style={style}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={AD_CLIENT}
        data-ad-slot={slotId}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
};

export default AdSlot;
