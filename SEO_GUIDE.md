# EduLumix SEO Guide – Google এ দেখা না হলে কি করবে

## ✅ যা করা হয়েছে (Code এ)

1. **Loading ফাস্ট** – Auth আর app block করছে না, এখনই দেখাবে
2. **Lazy loading** – Dashboard/Admin pages অপ্রয়োজনীয় না হলে load হবে না
3. **Font loading** – Font আর render block করবে না
4. **sitemap.xml** – Static sitemap যোগ করা হয়েছে
5. **robots.txt** – Path ঠিক করা হয়েছে
6. **index.html SEO** – Meta tags, JSON-LD (Organization + WebSite) যোগ করা হয়েছে

---

## 🔴 যা তোমাকে করতে হবে (Google Search Console)

### ধাপ ১: Google Search Console এ সাইট যুক্ত করো

1. https://search.google.com/search-console এ যাও  
2. “Add property” → URL prefix দিয়ে **https://edulumix.in** যুক্ত করো  
3. Verification করো (HTML tag বা DNS দিয়ে, যা সুবিধাজনক)

### ধাপ ২: Sitemap জমা দাও

1. Search Console → **Sitemaps**  
2. “Add a new sitemap”  
3. লিখো: `sitemap.xml`  
4. Submit করো

### ধাপ ৩: Indexing Request করো

1. Search Console → **URL Inspection**  
2. লিখো: `https://edulumix.in`  
3. “Request indexing” ক্লিক করো  

প্রয়োজন হলে `/jobs`, `/blog`, `/resources` ইত্যাদি আলাদা করে request করো।

---

## ⏱️ কতদিন লাগে?

- নতুন সাইট হলে index হতে ২–৪ সপ্তাহ লাগতে পারে  
- Sitemap submit করার পর সাধারণত ১–২ দিনেই crawl শুরু হয়  
- “EduLumix” brand search এ আসতে একটু সময় নিতে পারে

---

## 🚀 আরও ভালো করার জন্য

1. **Backlinks** – অন্য সাইটে EduLumix এর লিংক দেওয়াও (LinkedIn, Medium, Quora ইত্যাদি)  
2. **Social** – Facebook/Instagram/Twitter এ পেজ ও লিংক শেয়ার করা  
3. **গুগল মাই বিজনেস** – যদি physical অফিস থাকে  
4. **কনটেন্ট** – নিয়মিত নতুন ব্লগ/জব পোস্ট করা  
5. **Page Speed** – লাইটহাউস দিয়ে টেস্ট করে score 90+ রাখার চেষ্টা করা

---

## সাইট ফাস্ট আছে কিনা যাচাই

- https://pagespeed.web.dev/  
- URL: https://edulumix.in  

---

## সমস্যা হলে

- Search Console → **Coverage** বা **Pages** দেখো কোন URL index হচ্ছে বা error আছে কিনা  
- **Core Web Vitals** চেক করো; LCP 2.5s এর কম রাখার চেষ্টা করো
