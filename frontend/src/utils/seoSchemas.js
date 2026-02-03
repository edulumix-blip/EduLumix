// Structured Data Schema Generator for SEO

export const generateOrganizationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'EduLumix',
  alternateName: 'EduLumix - Career & Education Platform',
  url: 'https://edulumix.com',
  logo: 'https://edulumix.com/logo.png',
  description: 'EduLumix is your ultimate destination for fresher jobs, free resources, courses, mock tests, and career guidance.',
  email: 'support@edulumix.com',
  telephone: '+91-8272946202',
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'IN',
    addressRegion: 'India'
  },
  sameAs: [
    'https://facebook.com/edulumix',
    'https://twitter.com/edulumix',
    'https://linkedin.com/company/edulumix',
    'https://instagram.com/edulumix',
    'https://youtube.com/@edulumix',
    'https://github.com/edulumix'
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    email: 'support@edulumix.com',
    contactType: 'Customer Service',
    availableLanguage: ['English', 'Hindi']
  }
});

export const generateWebsiteSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'EduLumix',
  url: 'https://edulumix.com',
  description: 'Complete career platform for freshers - Jobs, Resources, Courses, Mock Tests & More',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://edulumix.com/search?q={search_term_string}'
    },
    'query-input': 'required name=search_term_string'
  },
  publisher: {
    '@type': 'Organization',
    name: 'EduLumix',
    logo: {
      '@type': 'ImageObject',
      url: 'https://edulumix.com/logo.png'
    }
  }
});

export const generateJobPostingSchema = (job) => ({
  '@context': 'https://schema.org',
  '@type': 'JobPosting',
  title: job.title,
  description: job.description,
  datePosted: job.createdAt || new Date().toISOString(),
  validThrough: job.deadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  employmentType: job.employmentType || 'FULL_TIME',
  hiringOrganization: {
    '@type': 'Organization',
    name: job.company || 'EduLumix',
    sameAs: 'https://edulumix.com',
    logo: job.companyLogo || 'https://edulumix.com/logo.png'
  },
  jobLocation: {
    '@type': 'Place',
    address: {
      '@type': 'PostalAddress',
      streetAddress: job.location || 'Remote',
      addressLocality: job.city,
      addressRegion: job.state,
      addressCountry: 'IN'
    }
  },
  baseSalary: job.salary ? {
    '@type': 'MonetaryAmount',
    currency: 'INR',
    value: {
      '@type': 'QuantitativeValue',
      value: job.salary,
      unitText: 'YEAR'
    }
  } : undefined,
  qualifications: job.qualifications,
  skills: job.skills,
  experienceRequirements: {
    '@type': 'OccupationalExperienceRequirements',
    monthsOfExperience: job.experience || 0
  },
  educationRequirements: {
    '@type': 'EducationalOccupationalCredential',
    credentialCategory: job.education || 'Bachelor\'s Degree'
  }
});

export const generateCourseSchema = (course) => ({
  '@context': 'https://schema.org',
  '@type': 'Course',
  name: course.title,
  description: course.description,
  provider: {
    '@type': 'Organization',
    name: 'EduLumix',
    sameAs: 'https://edulumix.com'
  },
  courseCode: course.slug,
  educationalLevel: course.level || 'Beginner',
  inLanguage: 'en',
  isAccessibleForFree: course.price === 0 || course.isFree,
  offers: course.price > 0 ? {
    '@type': 'Offer',
    price: course.price,
    priceCurrency: 'INR',
    availability: 'https://schema.org/InStock',
    url: `https://edulumix.com/courses/${course.slug}`
  } : undefined,
  hasCourseInstance: {
    '@type': 'CourseInstance',
    courseMode: 'online',
    courseWorkload: course.duration
  },
  aggregateRating: course.rating ? {
    '@type': 'AggregateRating',
    ratingValue: course.rating,
    ratingCount: course.reviews || 1,
    bestRating: 5,
    worstRating: 1
  } : undefined
});

export const generateBlogSchema = (blog) => ({
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: blog.title,
  description: blog.excerpt || blog.description,
  image: blog.image || 'https://edulumix.com/blog-default.jpg',
  datePublished: blog.publishedAt || blog.createdAt,
  dateModified: blog.updatedAt || blog.createdAt,
  author: {
    '@type': 'Person',
    name: blog.author?.name || 'EduLumix Team',
    url: `https://edulumix.com/author/${blog.author?.slug || 'team'}`
  },
  publisher: {
    '@type': 'Organization',
    name: 'EduLumix',
    logo: {
      '@type': 'ImageObject',
      url: 'https://edulumix.com/logo.png'
    }
  },
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': `https://edulumix.com/blog/${blog.slug}`
  },
  keywords: blog.tags?.join(', '),
  articleSection: blog.category,
  wordCount: blog.content?.split(' ').length || 1000
});

export const generateProductSchema = (product) => ({
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: product.title,
  description: product.description,
  image: product.image || 'https://edulumix.com/product-default.jpg',
  brand: {
    '@type': 'Brand',
    name: product.brand || 'EduLumix'
  },
  offers: {
    '@type': 'Offer',
    url: `https://edulumix.com/digital-products/${product.slug}`,
    priceCurrency: 'INR',
    price: product.price,
    priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    availability: product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    seller: {
      '@type': 'Organization',
      name: 'EduLumix'
    }
  },
  aggregateRating: product.rating ? {
    '@type': 'AggregateRating',
    ratingValue: product.rating,
    reviewCount: product.reviews || 1,
    bestRating: 5,
    worstRating: 1
  } : undefined,
  category: product.category
});

export const generateMockTestSchema = (mockTest) => ({
  '@context': 'https://schema.org',
  '@type': 'Quiz',
  name: mockTest.title,
  description: mockTest.description,
  about: {
    '@type': 'Thing',
    name: mockTest.subject || 'Test Preparation'
  },
  educationalLevel: mockTest.level || 'Intermediate',
  inLanguage: 'en',
  typicalAgeRange: '18-35',
  numberOfQuestions: mockTest.questionsCount || 50,
  timeRequired: mockTest.duration || 'PT60M',
  isAccessibleForFree: mockTest.isFree || true,
  provider: {
    '@type': 'Organization',
    name: 'EduLumix',
    url: 'https://edulumix.com'
  }
});

export const generateFAQSchema = (faqs) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(faq => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer
    }
  }))
});

export const generateBreadcrumbSchema = (breadcrumbs) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: breadcrumbs.map((crumb, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: crumb.name,
    item: `https://edulumix.com${crumb.path}`
  }))
});

export const generateVideoSchema = (video) => ({
  '@context': 'https://schema.org',
  '@type': 'VideoObject',
  name: video.title,
  description: video.description,
  thumbnailUrl: video.thumbnail,
  uploadDate: video.uploadDate,
  duration: video.duration,
  contentUrl: video.url,
  embedUrl: video.embedUrl,
  publisher: {
    '@type': 'Organization',
    name: 'EduLumix',
    logo: {
      '@type': 'ImageObject',
      url: 'https://edulumix.com/logo.png'
    }
  }
});

// Enhanced ItemList Schema for Job Listings
export const generateJobListSchema = (jobs) => ({
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  itemListElement: jobs.map((job, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    item: {
      '@type': 'JobPosting',
      title: job.title,
      description: job.description,
      datePosted: job.createdAt,
      hiringOrganization: {
        '@type': 'Organization',
        name: job.company,
        logo: job.companyLogo
      },
      jobLocation: {
        '@type': 'Place',
        address: job.location
      },
      url: `https://edulumix.in/jobs/${job.slug}`
    }
  }))
});

// CollectionPage Schema for Resources
export const generateResourceCollectionSchema = (resources) => ({
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Free Study Resources for Students',
  description: 'Access free educational resources, study materials, eBooks, and career guides',
  url: 'https://edulumix.in/resources',
  mainEntity: {
    '@type': 'ItemList',
    numberOfItems: resources.length,
    itemListElement: resources.slice(0, 10).map((resource, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'CreativeWork',
        name: resource.title,
        description: resource.description,
        url: `https://edulumix.in/resources/${resource.slug}`
      }
    }))
  }
});

// Enhanced Course Collection Schema
export const generateCourseCollectionSchema = (courses) => ({
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Online Courses for Career Growth',
  description: 'Professional online courses with certifications',
  url: 'https://edulumix.in/courses',
  numberOfItems: courses.length,
  itemListElement: courses.map((course, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    item: {
      '@type': 'Course',
      name: course.title,
      description: course.description,
      provider: {
        '@type': 'Organization',
        name: 'EduLumix'
      },
      offers: {
        '@type': 'Offer',
        price: course.price || 0,
        priceCurrency: 'INR'
      }
    }
  }))
});

// Blog Collection Schema
export const generateBlogCollectionSchema = (blogs) => ({
  '@context': 'https://schema.org',
  '@type': 'Blog',
  name: 'EduLumix Tech Blog',
  description: 'Technology articles, programming tutorials and career guidance',
  url: 'https://edulumix.in/blog',
  blogPost: blogs.slice(0, 10).map(blog => ({
    '@type': 'BlogPosting',
    headline: blog.title,
    image: blog.image,
    datePublished: blog.createdAt,
    author: {
      '@type': 'Person',
      name: blog.author?.name || 'EduLumix Team'
    }
  }))
});

// SearchAction Schema for better search appearance
export const generateSearchActionSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  url: 'https://edulumix.in',
  potentialAction: [{
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://edulumix.in/jobs?search={search_term_string}'
    },
    'query-input': 'required name=search_term_string'
  }]
});

// Enhanced Organization Schema with more details
export const generateEnhancedOrganizationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': 'https://edulumix.in/#organization',
  name: 'EduLumix',
  legalName: 'EduLumix Education Platform',
  url: 'https://edulumix.in',
  logo: {
    '@type': 'ImageObject',
    url: 'https://edulumix.in/logo.png',
    width: '200',
    height: '60'
  },
  description: 'Complete career platform for students and freshers offering jobs, resources, courses, mock tests and career guidance',
  foundingDate: '2023',
  founder: {
    '@type': 'Person',
    name: 'Md Mijanur Molla'
  },
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'IN'
  },
  contactPoint: [{
    '@type': 'ContactPoint',
    telephone: '+91-8272946202',
    contactType: 'Customer Service',
    email: 'support@edulumix.in',
    availableLanguage: ['English', 'Hindi']
  }],
  sameAs: [
    'https://facebook.com/edulumix',
    'https://twitter.com/edulumix',
    'https://linkedin.com/company/edulumix',
    'https://instagram.com/edulumix',
    'https://youtube.com/@edulumix'
  ],
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    reviewCount: '5000',
    bestRating: '5',
    worstRating: '1'
  }
});
