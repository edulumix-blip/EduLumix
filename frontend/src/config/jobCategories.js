import {
  Laptop,
  Building2,
  Users,
  Landmark,
  GraduationCap,
  Clock,
  Home,
  Sparkles,
} from 'lucide-react';

/**
 * Canonical job categories + professional visuals for Fresher Jobs page.
 * External fetch maps unknown types to Non IT Job; "Others" stays in UI for manual / edge cases.
 */
export const JOB_CATEGORIES = [
  {
    key: 'IT Job',
    Icon: Laptop,
    shortTitle: 'IT & Technology',
    subtitle: 'Software, support & tech roles',
    gradient: 'from-violet-600 via-blue-600 to-indigo-700',
    ring: 'ring-violet-500/30',
    image:
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80',
  },
  {
    key: 'Non IT Job',
    Icon: Building2,
    shortTitle: 'Non-IT',
    subtitle: 'Operations, sales, admin & general roles',
    gradient: 'from-slate-600 via-blue-700 to-slate-800',
    ring: 'ring-slate-500/30',
    image:
      'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=900&q=80',
  },
  {
    key: 'Walk In Drive',
    Icon: Users,
    shortTitle: 'Walk-in drives',
    subtitle: 'On-site hiring events',
    gradient: 'from-sky-600 via-blue-600 to-indigo-600',
    ring: 'ring-sky-500/30',
    image:
      'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?auto=format&fit=crop&w=900&q=80',
  },
  {
    key: 'Govt Job',
    Icon: Landmark,
    shortTitle: 'Government',
    subtitle: 'Public sector opportunities',
    gradient: 'from-blue-800 via-indigo-700 to-blue-900',
    ring: 'ring-blue-400/30',
    image:
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=80',
  },
  {
    key: 'Internship',
    Icon: GraduationCap,
    shortTitle: 'Internships',
    subtitle: 'Learn while you work',
    gradient: 'from-cyan-600 via-blue-600 to-blue-700',
    ring: 'ring-cyan-500/30',
    image:
      'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&q=80',
  },
  {
    key: 'Part Time Job',
    Icon: Clock,
    shortTitle: 'Part-time',
    subtitle: 'Flexible hours',
    gradient: 'from-teal-600 via-blue-600 to-indigo-600',
    ring: 'ring-teal-500/30',
    image:
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=900&q=80',
  },
  {
    key: 'Remote Job',
    Icon: Home,
    shortTitle: 'Remote',
    subtitle: 'Work from anywhere',
    gradient: 'from-indigo-600 via-violet-600 to-blue-700',
    ring: 'ring-indigo-500/30',
    image:
      'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=900&q=80',
  },
  {
    key: 'Others',
    Icon: Sparkles,
    shortTitle: 'Others',
    subtitle: 'Miscellaneous & niche roles',
    gradient: 'from-slate-600 via-slate-700 to-slate-800',
    ring: 'ring-slate-500/30',
    image:
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=900&q=80',
  },
];

export const JOB_CATEGORY_KEYS = JOB_CATEGORIES.map((c) => c.key);
