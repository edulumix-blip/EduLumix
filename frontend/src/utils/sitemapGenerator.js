export const generateSitemap = (jobs = [], blogs = [], courses = [], resources = [], products = [], mockTests = []) => {
  const baseUrl = 'https://edulumix.in';
  const today = new Date().toISOString().split('T')[0];

  const staticPages = [
    { url: '/', changefreq: 'daily', priority: '1.0' },
    { url: '/jobs', changefreq: 'hourly', priority: '0.95' },
    { url: '/resources', changefreq: 'daily', priority: '0.9' },
    { url: '/courses', changefreq: 'weekly', priority: '0.9' },
    { url: '/blog', changefreq: 'daily', priority: '0.9' },
    { url: '/mock-tests', changefreq: 'weekly', priority: '0.85' },
    { url: '/digital-products', changefreq: 'weekly', priority: '0.85' },
    { url: '/about', changefreq: 'monthly', priority: '0.6' },
    { url: '/contact', changefreq: 'monthly', priority: '0.6' },
    { url: '/privacy-policy', changefreq: 'yearly', priority: '0.3' },
    { url: '/terms-of-service', changefreq: 'yearly', priority: '0.3' },
    { url: '/refund-policy', changefreq: 'yearly', priority: '0.3' },
    { url: '/cookie-policy', changefreq: 'yearly', priority: '0.3' },
  ];

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" ';
  xml += 'xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" ';
  xml += 'xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">\n';

  // Add static pages
  staticPages.forEach(page => {
    xml += '  <url>\n';
    xml += `    <loc>${baseUrl}${page.url}</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
    xml += `    <priority>${page.priority}</priority>\n`;
    xml += '  </url>\n';
  });

  // Add jobs (highest priority for fresh content)
  jobs.forEach(job => {
    const jobDate = job.updatedAt ? new Date(job.updatedAt).toISOString().split('T')[0] : today;
    xml += '  <url>\n';
    xml += `    <loc>${baseUrl}/jobs/${job.slug}</loc>\n`;
    xml += `    <lastmod>${jobDate}</lastmod>\n`;
    xml += '    <changefreq>daily</changefreq>\n';
    xml += '    <priority>0.9</priority>\n';
    if (job.companyLogo) {
      xml += '    <image:image>\n';
      xml += `      <image:loc>${job.companyLogo}</image:loc>\n`;
      xml += `      <image:title>${job.company} Logo</image:title>\n`;
      xml += `      <image:caption>${job.title} at ${job.company}</image:caption>\n`;
      xml += '    </image:image>\n';
    }
    xml += '  </url>\n';
  });

  // Add blogs
  blogs.forEach(blog => {
    const blogDate = blog.updatedAt ? new Date(blog.updatedAt).toISOString().split('T')[0] : today;
    xml += '  <url>\n';
    xml += `    <loc>${baseUrl}/blog/${blog.slug}</loc>\n`;
    xml += `    <lastmod>${blogDate}</lastmod>\n`;
    xml += '    <changefreq>weekly</changefreq>\n';
    xml += '    <priority>0.8</priority>\n';
    if (blog.image) {
      xml += '    <image:image>\n';
      xml += `      <image:loc>${blog.image}</image:loc>\n`;
      xml += `      <image:title>${blog.title}</image:title>\n`;
      xml += '    </image:image>\n';
    }
    xml += '  </url>\n';
  });

  // Add courses
  courses.forEach(course => {
    const courseDate = course.updatedAt ? new Date(course.updatedAt).toISOString().split('T')[0] : today;
    xml += '  <url>\n';
    xml += `    <loc>${baseUrl}/courses/${course.slug}</loc>\n`;
    xml += `    <lastmod>${courseDate}</lastmod>\n';
    xml += '    <changefreq>monthly</changefreq>\n';
    xml += '    <priority>0.85</priority>\n';
    if (course.thumbnail) {
      xml += '    <image:image>\n';
      xml += `      <image:loc>${course.thumbnail}</image:loc>\n`;
      xml += `      <image:title>${course.title}</image:title>\n`;
      xml += '    </image:image>\n';
    }
    xml += '  </url>\n';
  });

  // Add resources
  resources.forEach(resource => {
    const resourceDate = resource.updatedAt ? new Date(resource.updatedAt).toISOString().split('T')[0] : today;
    xml += '  <url>\n';
    xml += `    <loc>${baseUrl}/resources/${resource.slug}</loc>\n`;
    xml += `    <lastmod>${resourceDate}</lastmod>\n';
    xml += '    <changefreq>monthly</changefreq>\n';
    xml += '    <priority>0.75</priority>\n';
    xml += '  </url>\n';
  });

  // Add products
  products.forEach(product => {
    const productDate = product.updatedAt ? new Date(product.updatedAt).toISOString().split('T')[0] : today;
    xml += '  <url>\n';
    xml += `    <loc>${baseUrl}/digital-products/${product.slug}</loc>\n`;
    xml += `    <lastmod>${productDate}</lastmod>\n`;
    xml += '    <changefreq>weekly</changefreq>\n';
    xml += '    <priority>0.75</priority>\n';
    if (product.image) {
      xml += '    <image:image>\n';
      xml += `      <image:loc>${product.image}</image:loc>\n`;
      xml += `      <image:title>${product.title}</image:title>\n`;
      xml += '    </image:image>\n';
    }
    xml += '  </url>\n';
  });

  // Add mock tests
  mockTests.forEach(test => {
    const testDate = test.updatedAt ? new Date(test.updatedAt).toISOString().split('T')[0] : today;
    xml += '  <url>\n';
    xml += `    <loc>${baseUrl}/mock-tests/${test.slug}</loc>\n`;
    xml += `    <lastmod>${testDate}</lastmod>\n`;
    xml += '    <changefreq>monthly</changefreq>\n';
    xml += '    <priority>0.7</priority>\n';
    xml += '  </url>\n';
  });

  xml += '</urlset>';
  
  return xml;
};
