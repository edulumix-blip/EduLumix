/**
 * EduLumix Bot - Chat bubble style design
 * White bot head, oval eyes, antenna with spherical tip
 */
export default function AnimatedBotLogo({ className = 'w-6 h-6' }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Antenna */}
      <line x1="16" y1="6" x2="16" y2="2" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="16" cy="1" r="1.2" fill="white">
        <animate attributeName="opacity" values="1;0.6;1" dur="1s" repeatCount="indefinite" />
      </circle>
      {/* Chat bubble head - rounded top, triangular point bottom */}
      <path
        d="M8 6 C8 4 24 4 24 6 L24 14 C24 18 20 20 16 20 L13 24 L19 24 L16 20 C12 20 8 18 8 14 Z"
        fill="white"
      />
      {/* Left eye - oval */}
      <ellipse cx="11" cy="11" rx="2" ry="2.5" fill="#1e293b">
        <animate attributeName="ry" values="2.5;0.5;2.5" dur="3s" repeatCount="indefinite" />
      </ellipse>
      {/* Right eye - oval */}
      <ellipse cx="21" cy="11" rx="2" ry="2.5" fill="#1e293b">
        <animate attributeName="ry" values="2.5;0.5;2.5" dur="3s" repeatCount="indefinite" />
      </ellipse>
    </svg>
  );
}
