// Comprehensive SEO Configuration for EduLumix Platform
// Multiple optimized title tags and meta descriptions for better search ranking

const BASE_URL = 'https://edulumix.in';
const SITE_NAME = 'EduLumix';
const DEFAULT_IMAGE = `${BASE_URL}/og-image.jpg`;

// ============================================
// JOBS SEO - Multiple Variants for A/B Testing
// ============================================
export const JOB_SEO_VARIANTS = {
  titles: [
    'Latest Fresher Jobs 2026 | Apply Now - EduLumix',
    'Fresher Jobs in India | IT & Non-IT Openings 2026',
    '10,000+ Jobs for Freshers | Start Your Career Today',
    'Job Openings 2026 | Freshers & Entry Level Jobs',
    'Find Fresher Jobs Near You | Top Companies Hiring'
  ],
  descriptions: [
    'Apply to 10,000+ fresher jobs in India. Latest IT, Non-IT, Govt & Internship openings. Get hired at top companies. Updated daily. Free job alerts!',
    'Discover fresher jobs from top companies. IT Jobs, Walk-in Drives, Govt Jobs & Remote positions. Free registration. Apply in minutes. Start your career!',
    'Latest job openings for freshers in 2026. Browse IT, Non-IT, Govt jobs, internships & more. Direct company links. Updated hourly. Apply free today!',
    'Find your dream job! 10,000+ fresher job listings across India. IT, Non-IT, Govt & Remote jobs. Free alerts. Quick apply. Join 50,000+ job seekers.',
    'Top fresher jobs in India 2026. IT Jobs, Govt Jobs, Internships, Walk-in Drives. Free job portal. Apply directly. Get hired faster with EduLumix!'
  ],
  keywords: [
    'fresher jobs, jobs for freshers, fresher jobs in india',
    'IT jobs for freshers, software developer jobs',
    'govt jobs, government jobs for freshers',
    'walk in drive, walk in interview today',
    'internship for students, remote jobs for freshers'
  ]
};

export const JOB_DETAIL_SEO = {
  getTitleVariants: (jobTitle, company, location) => [
    `${jobTitle} at ${company} | ${location} - Apply Now`,
    `${company} Hiring ${jobTitle} | ${location} 2026`,
    `${jobTitle} Job Opening | ${company} ${location}`,
    `Apply for ${jobTitle} at ${company} - ${location}`,
    `${jobTitle} Position | ${company} Career Opportunity`
  ],
  getDescriptionVariants: (jobTitle, company, location, salary) => [
    `Apply for ${jobTitle} position at ${company} in ${location}. ${salary}. View full job details, requirements & apply directly. Updated today!`,
    `${company} is hiring ${jobTitle} in ${location}. Salary: ${salary}. Check eligibility, job description & apply now. Free registration!`,
    `${jobTitle} job at ${company}, ${location}. ${salary}. View requirements, responsibilities & benefits. Apply online. Quick & easy process!`,
    `Join ${company} as ${jobTitle} in ${location}. Compensation: ${salary}. Review job details & apply instantly. Start your career journey today!`,
    `${company} ${jobTitle} opening in ${location}. ${salary}. Complete job description, qualifications & application link. Apply before deadline!`
  ]
};

// ============================================
// RESOURCES SEO - Educational Content
// ============================================
export const RESOURCES_SEO_VARIANTS = {
  titles: [
    'Free Study Resources for Students | Notes & eBooks 2026',
    '1000+ Free Resources | Study Materials & Career Guides',
    'Free Career Resources | Interview Prep & Study Notes',
    'Download Free Study Materials | Tech Resources 2026',
    'Free eBooks & Notes for Students | EduLumix Resources'
  ],
  descriptions: [
    'Access 1000+ free study resources, eBooks, notes & career guides. Interview preparation, programming tutorials & more. Download instantly. No signup!',
    'Free study materials for students. Technology notes, interview guides, career resources & eBooks. Updated daily. Download free. Boost your career!',
    'Download free career resources, study notes, programming tutorials & interview guides. 1000+ materials for students & freshers. No payment required!',
    'Get free access to study materials, technical resources, career guides & interview prep. For students & job seekers. Download now. Stay ahead!',
    'Free resources for students: eBooks, study notes, tutorials & career guides. Interview preparation materials. Updated regularly. Start learning today!'
  ],
  keywords: [
    'free study resources, free ebooks for students',
    'programming notes, technical study materials',
    'interview preparation, career resources free',
    'free pdf download, study materials for students',
    'technology resources, free career guides'
  ]
};

export const RESOURCE_DETAIL_SEO = {
  getTitleVariants: (resourceTitle, category) => [
    `${resourceTitle} | Free Download - EduLumix`,
    `Download ${resourceTitle} Free | ${category}`,
    `${resourceTitle} - Free ${category} Resource 2026`,
    `${resourceTitle} | ${category} Study Material Free`,
    `Free ${resourceTitle} Download | ${category} Guide`
  ],
  getDescriptionVariants: (resourceTitle, category, description) => [
    `Download ${resourceTitle} for free. ${description}. ${category} resource for students & professionals. No registration required!`,
    `Free ${resourceTitle} - ${category}. ${description}. Instant download. High-quality study material. Get it now!`,
    `${resourceTitle}: ${description}. Free ${category} resource. Download PDF/eBook instantly. Perfect for students & job seekers!`,
    `Get ${resourceTitle} free. ${description}. Best ${category} resource for career growth. Download now, no payment needed!`,
    `${resourceTitle} - ${description}. Free ${category} study material. Instant access. Download and start learning today!`
  ]
};

// ============================================
// TECH BLOG SEO - Articles & Tutorials
// ============================================
export const BLOG_SEO_VARIANTS = {
  titles: [
    'Tech Blog | Career Tips & Programming Tutorials 2026',
    'Technology Articles | Developer Guides & Career Advice',
    'Tech Tutorials | Learn Programming & Career Growth',
    'Developer Blog | Coding Tips & Tech Career Guidance',
    'Tech Articles for Students | Programming & Career Blog'
  ],
  descriptions: [
    'Read latest tech articles, programming tutorials & career tips. For students & developers. Interview guides, coding tips & industry insights. Updated daily!',
    'Tech blog for students: Programming tutorials, career guidance, interview tips & technology trends. Expert articles. Learn & grow your career today!',
    'Latest technology articles & tutorials. Career advice for developers, programming guides & tech trends. For students & professionals. Read & learn!',
    'Developer blog: Coding tutorials, tech career tips, interview preparation & industry news. For freshers & students. Stay updated with technology!',
    'Technology blog for aspiring developers. Programming tutorials, career growth tips & tech insights. Learn from experts. Boost your tech career!'
  ],
  keywords: [
    'tech blog, technology articles, programming tutorials',
    'career advice for developers, coding tips',
    'tech tutorials for students, developer guides',
    'programming blog, software development tips',
    'tech career guidance, interview preparation blog'
  ]
};

export const BLOG_DETAIL_SEO = {
  getTitleVariants: (blogTitle, category) => [
    `${blogTitle} | ${category} - EduLumix Blog`,
    `${blogTitle} - ${category} Guide 2026`,
    `${category}: ${blogTitle} | Tech Tutorial`,
    `${blogTitle} | Complete ${category} Guide`,
    `Learn ${blogTitle} | ${category} Article`
  ],
  getDescriptionVariants: (blogTitle, excerpt, readTime) => [
    `${excerpt}. Complete guide with examples. ${readTime} min read. Learn best practices & tips. Read now for career growth!`,
    `${excerpt}. Step-by-step tutorial for students & developers. ${readTime} min read. Practical tips included. Start learning today!`,
    `Learn ${blogTitle}: ${excerpt}. Detailed ${readTime} min guide. Tips, tricks & expert advice. Perfect for freshers & professionals!`,
    `${excerpt}. In-depth ${readTime} min article. Practical examples & career tips. For students & developers. Read & implement!`,
    `Complete guide: ${excerpt}. ${readTime} min read. Expert insights & real-world examples. Boost your tech knowledge now!`
  ]
};

// ============================================
// COURSES SEO - Online Learning
// ============================================
export const COURSES_SEO_VARIANTS = {
  titles: [
    'Online Courses for Students | Free & Paid Courses 2026',
    'Best Online Courses | Learn Programming & Tech Skills',
    '500+ Courses for Career Growth | Certifications 2026',
    'Online Learning Platform | Tech Courses for Students',
    'Professional Courses | Skill Development & Certifications'
  ],
  descriptions: [
    'Explore 500+ online courses. Programming, web development, data science & more. Free & paid options. Expert instructors. Get certified today!',
    'Learn new skills with our online courses. Technology, programming & career development. Video tutorials, projects & certificates. Enroll now!',
    'Best online courses for students & professionals. Tech skills, programming languages & certifications. Affordable pricing. Start learning today!',
    'Online learning platform: 500+ courses in technology, programming & career skills. Interactive lessons. Industry certifications. Join thousands!',
    'Professional development courses. Programming, web dev, data science & more. Expert-led training. Lifetime access. Certificates. Enroll free!'
  ],
  keywords: [
    'online courses, online learning platform',
    'programming courses, web development courses',
    'free online courses, tech courses for students',
    'certification courses, skill development courses',
    'learn programming online, professional courses india'
  ]
};

export const COURSE_DETAIL_SEO = {
  getTitleVariants: (courseTitle, instructor, duration) => [
    `${courseTitle} Online Course | ${duration} - Enroll Now`,
    `Learn ${courseTitle} | ${instructor} | ${duration} Course`,
    `${courseTitle} Complete Course | ${duration} Training`,
    `${courseTitle} - ${duration} Online Course & Certification`,
    `Master ${courseTitle} | ${duration} Course by ${instructor}`
  ],
  getDescriptionVariants: (courseTitle, description, price, students) => [
    `${description}. ${price}. ${students}+ students enrolled. Video lessons, projects & certificate. Lifetime access. Enroll now!`,
    `Learn ${courseTitle}: ${description}. Only ${price}. Join ${students}+ learners. Interactive course with certification. Start today!`,
    `${courseTitle} course: ${description}. Price: ${price}. ${students}+ students. Expert instructor, practical projects & certificate included!`,
    `Complete ${courseTitle} training: ${description}. ${price}. Trusted by ${students}+ students. Certificate of completion. Enroll free!`,
    `${description}. Course fee: ${price}. ${students}+ enrolled. Comprehensive curriculum, hands-on projects & certification. Join now!`
  ]
};

// ============================================
// DIGITAL PRODUCTS SEO - Marketplace
// ============================================
export const PRODUCTS_SEO_VARIANTS = {
  titles: [
    'Digital Products for Students | eBooks & Resources 2026',
    'Buy Career Development Tools | Digital Downloads',
    'Digital Products Store | Study Materials & Tools',
    'Premium Resources | Career Growth Digital Products',
    'Educational Digital Products | Students & Professionals'
  ],
  descriptions: [
    'Buy digital products for career growth. eBooks, templates, guides & tools. Instant download. Premium quality. Affordable prices. Shop now!',
    'Digital marketplace for students: Career guides, interview prep kits, resume templates & more. Instant access. Secure payment. Download today!',
    'Premium digital products: Study materials, career tools, interview guides & templates. Best prices. Instant download. Money-back guarantee!',
    'Shop educational digital products. eBooks, guides, templates & career resources. For students & job seekers. Secure purchase. Download instantly!',
    'Digital products store: Premium career resources, study materials & professional tools. Affordable. Instant access. 100% satisfaction guaranteed!'
  ],
  keywords: [
    'digital products, digital downloads',
    'career development tools, study materials',
    'ebooks for students, interview guide',
    'resume templates, career resources',
    'educational products, digital marketplace'
  ]
};

export const PRODUCT_DETAIL_SEO = {
  getTitleVariants: (productTitle, price) => [
    `${productTitle} | Download @ ₹${price} - EduLumix`,
    `Buy ${productTitle} | ₹${price} - Instant Download`,
    `${productTitle} - Digital Product @ ₹${price}`,
    `${productTitle} | Premium Resource ₹${price} Only`,
    `Download ${productTitle} Now | Just ₹${price}`
  ],
  getDescriptionVariants: (productTitle, description, features) => [
    `${description}. Price: ₹${features}. Instant download. Premium quality. Money-back guarantee. Buy now & boost your career!`,
    `Buy ${productTitle}: ${description}. Only ₹${features}. Digital download. High-quality content. 100% satisfaction. Order today!`,
    `${productTitle} - ${description}. ₹${features}. Instant access after payment. Premium product. Secure checkout. Get it now!`,
    `${description}. Best price: ₹${features}. Instant download. Top-rated product. Limited time offer. Purchase ${productTitle} now!`,
    `Premium ${productTitle}: ${description}. Just ₹${features}. Immediate download. Lifetime access. Trusted by thousands. Buy today!`
  ]
};

// ============================================
// MOCK TESTS SEO - Practice Tests
// ============================================
export const MOCKTEST_SEO_VARIANTS = {
  titles: [
    'Free Mock Tests Online | Practice Tests for Students 2026',
    'Online Mock Tests | Aptitude & Technical Tests Free',
    '1000+ Mock Tests | Placement Preparation 2026',
    'Free Practice Tests | Aptitude, Reasoning & Coding',
    'Mock Test Series | Interview Preparation Tests Free'
  ],
  descriptions: [
    'Practice with 1000+ free mock tests. Aptitude, logical reasoning, coding & technical tests. Instant results. Detailed solutions. Start practicing!',
    'Free online mock tests for students. Company-wise, topic-wise practice tests. Placement preparation. Timed tests with explanations. Take test now!',
    'Mock test series for interview preparation. Aptitude, reasoning, programming & technical MCQs. Free access. Performance analytics. Practice daily!',
    'Online practice tests: Aptitude, coding, reasoning & technical. 1000+ questions. Company-specific mock tests. Free. Improve your scores today!',
    'Free mock tests for placement: Quantitative aptitude, logical reasoning, verbal ability & coding. Timed tests. Instant feedback. Start now!'
  ],
  keywords: [
    'mock tests, online mock tests, practice tests',
    'aptitude test online, logical reasoning test',
    'coding test practice, placement preparation',
    'free mock test, technical aptitude test',
    'interview preparation tests, company mock tests'
  ]
};

export const MOCKTEST_DETAIL_SEO = {
  getTitleVariants: (testTitle, category, questions) => [
    `${testTitle} | ${questions} Questions - Free Mock Test`,
    `${testTitle} - ${category} Mock Test | Take Now`,
    `Free ${testTitle} Test | ${questions} MCQs Online`,
    `${testTitle} Practice Test | ${category} - ${questions}Q`,
    `${testTitle} | ${category} Mock Test Free Online`
  ],
  getDescriptionVariants: (testTitle, category, questions, duration) => [
    `Take ${testTitle} mock test free. ${questions} questions, ${duration} time limit. ${category} practice test with solutions. Instant results & analysis!`,
    `Free ${testTitle} test - ${questions} MCQs in ${duration}. ${category} mock test with detailed explanations. Check your preparation level now!`,
    `${testTitle} practice: ${questions} questions, ${duration}. Free ${category} mock test. Timed assessment with instant feedback. Start test!`,
    `${category} mock test: ${testTitle}. ${questions} questions to solve in ${duration}. Free practice test with solutions. Improve your score!`,
    `${testTitle} - ${questions}Q ${category} test. ${duration} duration. Free online mock test. Detailed solutions included. Take test & learn!`
  ]
};

// ============================================
// HOME PAGE SEO
// ============================================
export const HOME_SEO = {
  titles: [
    'EduLumix - Jobs, Resources, Courses & Mock Tests for Students',
    'Complete Career Platform | Jobs, Courses & Free Resources',
    'EduLumix | Your Career Growth Partner - Jobs & Learning',
    'Fresher Jobs, Free Resources & Online Courses | EduLumix',
    'Career Platform for Students | Jobs, Courses, Tests & More'
  ],
  descriptions: [
    'EduLumix: Complete career platform for students. 10,000+ jobs, 1000+ free resources, online courses, mock tests & tech blog. Start your career journey!',
    'Find fresher jobs, free study resources, online courses & mock tests at EduLumix. Join 50,000+ students building successful careers. Register free!',
    'Your ultimate career platform: Latest jobs, free resources, expert courses, practice tests & career guidance. For students & freshers. Join EduLumix!',
    'EduLumix offers jobs for freshers, free educational resources, skill courses, mock tests & career tips. All-in-one platform. Start learning & earning!',
    'Career success starts here! Jobs, resources, courses, mock tests & career guidance for students. Free registration. Join 50,000+ learners at EduLumix!'
  ]
};

// ============================================
// CATEGORY-WISE JOB PAGES
// ============================================
export const JOB_CATEGORY_SEO = {
  'IT Job': {
    titles: [
      'IT Jobs for Freshers 2026 | Software Developer Jobs',
      'Latest IT Jobs in India | Tech Jobs for Freshers',
      'Software Jobs | IT Openings for Freshers 2026',
      'Tech Jobs for Freshers | IT Career Opportunities',
      'IT Jobs India | Programming Jobs for Freshers'
    ],
    descriptions: [
      'Browse 5000+ IT jobs for freshers. Software developer, programmer, web developer positions. Top tech companies. Apply now & start your IT career!',
      'Latest IT jobs in India 2026. Fresher openings in software development, programming & tech. Direct company apply. Updated daily. Get hired fast!',
      'IT job openings for freshers: Software engineer, developer, programmer roles. Top companies hiring. Free job alerts. Apply online today!',
      'Find your dream IT job! Fresher positions in tech companies. Software development, web dev, app dev jobs. Apply directly. Join tech industry!',
      'Tech jobs for freshers 2026. IT companies hiring software developers, programmers. Remote & office jobs. Free registration. Start your IT career!'
    ]
  },
  'Govt Job': {
    titles: [
      'Government Jobs 2026 | Sarkari Naukri for Freshers',
      'Latest Govt Jobs in India | Sarkari Jobs 2026',
      'Govt Job Vacancies | Public Sector Jobs for Freshers',
      'Sarkari Naukri 2026 | Central & State Govt Jobs',
      'Government Job Alerts | Sarkari Jobs in India'
    ],
    descriptions: [
      'Latest government jobs 2026. Sarkari Naukri, PSU, SSC, Railways, Banking & more. Central & state govt vacancies. Free job alerts. Apply now!',
      'Govt jobs for freshers: SSC, Banking, Railways, UPSC, State PSC. Latest vacancies. Exam dates, syllabus & apply links. Get govt job today!',
      'Sarkari Naukri 2026: Government job vacancies in India. PSU, SSC, Banking, Railway jobs. Free notifications. Apply before deadline!',
      'Government job openings: Central & state govt vacancies. Banking, Railways, PSU, SSC jobs. Eligibility, exam dates & forms. Apply free!',
      'Latest Sarkari jobs in India. Govt vacancies for freshers: SSC, Banking, Railways, UPSC. Free job alerts. Start your govt career now!'
    ]
  },
  'Internship': {
    titles: [
      'Internships for Students 2026 | Paid Internships India',
      'Latest Internship Opportunities | Students & Freshers',
      'Paid Internships 2026 | Summer Internships for Students',
      'Internship Jobs | Work from Home & Office 2026',
      'Student Internships India | Gain Work Experience'
    ],
    descriptions: [
      'Find paid internships for students. IT, Marketing, HR, Finance internships. Work from home & office. Stipend offered. Apply now & gain experience!',
      'Latest internship opportunities 2026. Paid internships for students & freshers. Top companies. Remote & on-site. Build your resume. Apply today!',
      'Internship jobs for students: IT, Engineering, MBA, Marketing. Paid opportunities. Summer internships 2026. Certificate provided. Start interning!',
      'Student internships in India. Paid & unpaid opportunities. Work experience at top companies. Remote internships available. Apply online now!',
      'Get internship with leading companies. Paid positions for students. IT, Marketing, Finance, HR internships. Certificate & stipend. Apply free!'
    ]
  },
  'Remote Job': {
    titles: [
      'Remote Jobs for Freshers 2026 | Work from Home Jobs',
      'Work from Home Jobs India | Remote Opportunities',
      'Online Jobs for Freshers | Remote Work 2026',
      'Remote Jobs India | Flexible Work Opportunities',
      'Work from Home | Remote Positions for Freshers'
    ],
    descriptions: [
      'Remote jobs for freshers 2026. Work from home opportunities in IT, Content Writing, Marketing & more. Flexible hours. Apply & work remotely!',
      'Find work from home jobs. Remote positions for freshers in tech, writing, design, marketing. Flexible timing. Earn from home. Apply now!',
      'Online jobs for freshers: Remote work opportunities. IT jobs, content writing, digital marketing. Work from anywhere. Join remote teams today!',
      'Remote jobs in India 2026. Work from home positions for freshers. Tech, non-tech, freelance opportunities. Flexible work. Start earning now!',
      'Work from home jobs for freshers. Remote positions across India. IT, Marketing, Writing, Design roles. Flexible hours. Apply online today!'
    ]
  }
};

// Helper function to get random variant
export const getRandomVariant = (variants) => {
  return variants[Math.floor(Math.random() * variants.length)];
};

// Helper function to get SEO config for page
export const getSEOConfig = (pageType, data = {}) => {
  const seoConfig = {
    url: BASE_URL,
    siteName: SITE_NAME,
    image: DEFAULT_IMAGE,
    twitterHandle: '@edulumix'
  };

  switch (pageType) {
    case 'home':
      return {
        ...seoConfig,
        title: getRandomVariant(HOME_SEO.titles),
        description: getRandomVariant(HOME_SEO.descriptions),
        url: BASE_URL
      };

    case 'jobs':
      return {
        ...seoConfig,
        title: getRandomVariant(JOB_SEO_VARIANTS.titles),
        description: getRandomVariant(JOB_SEO_VARIANTS.descriptions),
        keywords: JOB_SEO_VARIANTS.keywords.join(', '),
        url: `${BASE_URL}/jobs`
      };

    case 'job-detail':
      const jobTitles = JOB_DETAIL_SEO.getTitleVariants(
        data.title,
        data.company,
        data.location
      );
      const jobDescs = JOB_DETAIL_SEO.getDescriptionVariants(
        data.title,
        data.company,
        data.location,
        data.salary || 'Competitive salary'
      );
      return {
        ...seoConfig,
        title: getRandomVariant(jobTitles),
        description: getRandomVariant(jobDescs),
        url: `${BASE_URL}/jobs/${data.slug}`,
        type: 'article'
      };

    case 'resources':
      return {
        ...seoConfig,
        title: getRandomVariant(RESOURCES_SEO_VARIANTS.titles),
        description: getRandomVariant(RESOURCES_SEO_VARIANTS.descriptions),
        keywords: RESOURCES_SEO_VARIANTS.keywords.join(', '),
        url: `${BASE_URL}/resources`
      };

    case 'blog':
      return {
        ...seoConfig,
        title: getRandomVariant(BLOG_SEO_VARIANTS.titles),
        description: getRandomVariant(BLOG_SEO_VARIANTS.descriptions),
        keywords: BLOG_SEO_VARIANTS.keywords.join(', '),
        url: `${BASE_URL}/blog`
      };

    case 'courses':
      return {
        ...seoConfig,
        title: getRandomVariant(COURSES_SEO_VARIANTS.titles),
        description: getRandomVariant(COURSES_SEO_VARIANTS.descriptions),
        keywords: COURSES_SEO_VARIANTS.keywords.join(', '),
        url: `${BASE_URL}/courses`
      };

    case 'products':
      return {
        ...seoConfig,
        title: getRandomVariant(PRODUCTS_SEO_VARIANTS.titles),
        description: getRandomVariant(PRODUCTS_SEO_VARIANTS.descriptions),
        keywords: PRODUCTS_SEO_VARIANTS.keywords.join(', '),
        url: `${BASE_URL}/digital-products`
      };

    case 'mock-tests':
      return {
        ...seoConfig,
        title: getRandomVariant(MOCKTEST_SEO_VARIANTS.titles),
        description: getRandomVariant(MOCKTEST_SEO_VARIANTS.descriptions),
        keywords: MOCKTEST_SEO_VARIANTS.keywords.join(', '),
        url: `${BASE_URL}/mock-tests`
      };

    default:
      return seoConfig;
  }
};

export default {
  BASE_URL,
  SITE_NAME,
  getSEOConfig,
  getRandomVariant
};
