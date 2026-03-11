/**
 * LazyImage - Thin wrapper adding loading="lazy" and decoding="async" for performance.
 * Use for images below the fold (thumbnails, cards, etc).
 */
const LazyImage = (props) => (
  <img loading="lazy" decoding="async" {...props} />
);

export default LazyImage;
