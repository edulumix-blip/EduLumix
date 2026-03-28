import { useState } from 'react';
import { getCompanyInitial, getCompanyAvatarColorClasses } from '../../utils/companyAvatar';

const SIZE_CLASSES = {
  sm: 'w-8 h-8 min-w-8 min-h-8 text-xs',
  md: 'w-11 h-11 min-w-11 min-h-11 text-sm',
  table: 'w-10 h-10 min-w-10 min-h-10 text-sm',
  lg: 'w-16 h-16 min-w-16 min-h-16 text-xl',
  xl: 'w-20 h-20 min-w-20 min-h-20 text-2xl',
};

const ROUNDED_CLASSES = {
  full: 'rounded-full',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
  lg: 'rounded-lg',
};

/**
 * Company logo or deterministic colored initial when missing / broken URL.
 */
export default function CompanyAvatar({
  company,
  logoUrl,
  size = 'md',
  rounded = 'full',
  className = '',
  imgClassName = 'w-full h-full object-contain',
}) {
  const [broken, setBroken] = useState(false);
  const showImg = Boolean(logoUrl && String(logoUrl).trim() && !broken);
  const initial = getCompanyInitial(company);
  const colorClasses = getCompanyAvatarColorClasses(company);
  const sizeCls = SIZE_CLASSES[size] || SIZE_CLASSES.md;
  const roundCls = ROUNDED_CLASSES[rounded] || ROUNDED_CLASSES.full;

  return (
    <div
      className={[
        'overflow-hidden flex shrink-0 items-center justify-center font-bold leading-none select-none',
        sizeCls,
        roundCls,
        showImg
          ? 'bg-white dark:bg-dark-100 border border-gray-200/90 dark:border-gray-700 p-1 shadow-sm'
          : `${colorClasses} border border-black/10 dark:border-white/10`,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      aria-hidden={showImg ? undefined : true}
    >
      {showImg ? (
        <img
          src={logoUrl}
          alt=""
          className={[imgClassName, roundCls].join(' ')}
          loading="lazy"
          decoding="async"
          onError={() => setBroken(true)}
        />
      ) : (
        <span className="tracking-tight">{initial}</span>
      )}
    </div>
  );
}
