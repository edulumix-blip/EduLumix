import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, Filter, Briefcase, MapPin, Clock, 
  Heart, Eye, Share2,
  IndianRupee, Tag, ChevronRight, Loader2,
  Zap, ArrowRight, LayoutGrid,
} from 'lucide-react';
import { jobService } from '../services/dataService';
import { JOB_CATEGORIES, JOB_CATEGORY_KEYS } from '../config/jobCategories';
import { JobCardSkeleton } from '../components/skeleton';
import toast from 'react-hot-toast';
import SEO from '../components/seo/SEO';
import CompanyAvatar from '../components/common/CompanyAvatar';
import { generateBreadcrumbSchema, generateJobListSchema, generateSearchActionSchema } from '../utils/seoSchemas';
import { getSEOConfig, JOB_CATEGORY_SEO, getRandomVariant } from '../config/seoConfig';
import JobListingFilters from '../components/listing/JobListingFilters';

const PAGE_SIZE = 12;

const DEFAULT_EXPERIENCE_LEVELS = [
  'Fresher',
  '1 Year',
  '2 Years',
  '3 Years',
  '4 Years',
  '5+ Years',
];

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filterCity, setFilterCity] = useState('All');
  const [filterLocation, setFilterLocation] = useState('All');
  const [filterExperience, setFilterExperience] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterOptions, setFilterOptions] = useState({
    locations: [],
    cities: [],
    experiences: [],
  });
  const [optionsLoading, setOptionsLoading] = useState(true);
  /** Mobile: collapse / expand advanced filter panel */
  const [showFilters, setShowFilters] = useState(false);
  const [likedJobs, setLikedJobs] = useState(new Set());
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observerTarget = useRef(null);
  const listingsRef = useRef(null);
  const searchTermRef = useRef(searchTerm);
  searchTermRef.current = searchTerm;
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [listTotal, setListTotal] = useState(0);

  const categorySelectOptions = ['All', ...JOB_CATEGORY_KEYS];

  const scrollToListings = () => {
    listingsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const selectCategory = (cat) => {
    setSelectedCategory(cat);
    setTimeout(scrollToListings, 120);
  };

  const activeFilterCount = useMemo(() => {
    let n = 0;
    if (selectedCategory !== 'All') n += 1;
    if (filterCity !== 'All') n += 1;
    if (filterLocation !== 'All') n += 1;
    if (filterExperience !== 'All') n += 1;
    if (filterStatus !== 'All') n += 1;
    return n;
  }, [selectedCategory, filterCity, filterLocation, filterExperience, filterStatus]);

  const resetListingFilters = () => {
    setSelectedCategory('All');
    setFilterCity('All');
    setFilterLocation('All');
    setFilterExperience('All');
    setFilterStatus('All');
  };

  useEffect(() => {
    const savedLikes = localStorage.getItem('likedJobs');
    if (savedLikes) {
      setLikedJobs(new Set(JSON.parse(savedLikes)));
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setStatsLoading(true);
        const res = await jobService.getStats();
        if (!cancelled && res.data?.success && res.data?.data) {
          setStats(res.data.data);
        }
      } catch {
        if (!cancelled) setStats(null);
      } finally {
        if (!cancelled) setStatsLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setOptionsLoading(true);
        const res = await jobService.getFilterOptions();
        if (!cancelled && res.data?.success && res.data?.data) {
          setFilterOptions({
            locations: res.data.data.locations || [],
            cities: res.data.data.cities || [],
            experiences: res.data.data.experiences || [],
          });
        }
      } catch {
        if (!cancelled) {
          setFilterOptions({ locations: [], cities: [], experiences: [] });
        }
      } finally {
        if (!cancelled) setOptionsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const experienceOptions =
    filterOptions.experiences.length > 0
      ? filterOptions.experiences
      : DEFAULT_EXPERIENCE_LEVELS;

  const fetchJobs = useCallback(async (pageNum = 1, append = false) => {
    try {
      if (pageNum === 1) setLoading(true);
      else setLoadingMore(true);

      const params = { limit: PAGE_SIZE, page: pageNum };
      if (selectedCategory !== 'All') {
        params.category = selectedCategory;
      }
      if (searchTerm) {
        params.search = searchTerm;
      }
      if (filterCity !== 'All') params.city = filterCity;
      if (filterLocation !== 'All') params.location = filterLocation;
      if (filterExperience !== 'All') params.experience = filterExperience;
      if (filterStatus !== 'All') params.status = filterStatus;
      const response = await jobService.getAll(params);
      if (response.data.success) {
        const data = response.data.data || [];
        const totalPages = response.data.totalPages ?? 1;
        setPage(pageNum);
        setHasMore(pageNum < totalPages);

        if (append) {
          setJobs(prev => [...prev, ...data]);
        } else {
          setJobs(data);
          setListTotal(response.data.total ?? data.length);
        }
      }
    } catch (error) {
      toast.error('Failed to fetch jobs');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [selectedCategory, filterCity, filterLocation, filterExperience, filterStatus]);

  useEffect(() => {
    fetchJobs(1);
  }, [fetchJobs]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasMore && !loadingMore && !loading) {
          fetchJobs(page + 1, true);
        }
      },
      { threshold: 0.1 }
    );
    const target = observerTarget.current;
    if (target) observer.observe(target);
    return () => { if (target) observer.unobserve(target); };
  }, [hasMore, loadingMore, loading, page, fetchJobs]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs(1);
  };

  const loadMore = () => {
    if (loadingMore || !hasMore) return;
    fetchJobs(page + 1, true);
  };

  const handleLike = async (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const response = await jobService.like(id);
      
      // Update local state
      const newLikedJobs = new Set(likedJobs);
      if (likedJobs.has(id)) {
        newLikedJobs.delete(id);
      } else {
        newLikedJobs.add(id);
      }
      setLikedJobs(newLikedJobs);
      localStorage.setItem('likedJobs', JSON.stringify([...newLikedJobs]));
      
      // Update job likes count
      setJobs(prev => prev.map(job =>
        job._id === id ? { ...job, likesCount: response.data.likesCount } : job
      ));
    } catch (error) {
      console.error('Failed to like job');
    }
  };

  const handleShare = async (job, e) => {
    e.preventDefault();
    e.stopPropagation();
    const jobUrl = `${window.location.origin}/jobs/${createSlug(job)}`;
    try {
      await navigator.share({
        title: job.title,
        text: `Check out this job: ${job.title} at ${job.company}`,
        url: jobUrl,
      });
    } catch (error) {
      navigator.clipboard.writeText(jobUrl);
      toast.success('Link copied to clipboard!');
    }
  };

  // Create URL-friendly slug
  const createSlug = (job) => {
    const titleSlug = job.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const companySlug = job.company.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    return `${titleSlug}-${companySlug}-${job._id}`;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatJobFreshness = (date) => {
    if (!date) return null;
    try {
      const d = new Date(date);
      const diffMs = Date.now() - d.getTime();
      const diffDays = Math.floor(diffMs / 86400000);
      const diffH = Math.floor(diffMs / 3600000);
      if (diffDays < 0) return formatDate(date);
      if (diffDays === 0) {
        if (diffH < 1) return 'Just now';
        return diffH < 24 ? `${diffH}h ago` : 'Today';
      }
      if (diffDays === 1) return 'Yesterday';
      if (diffDays < 7) return `${diffDays}d ago`;
      if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
      if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo ago`;
      return formatDate(date);
    } catch {
      return null;
    }
  };

  const getCategoryAccent = (category) => {
    const map = {
      'IT Job': 'from-blue-500 to-indigo-600',
      'Non IT Job': 'from-slate-500 to-slate-700',
      'Walk In Drive': 'from-amber-500 to-orange-600',
      'Govt Job': 'from-emerald-500 to-teal-700',
      'Internship': 'from-sky-400 to-blue-600',
      'Part Time Job': 'from-violet-500 to-purple-600',
      'Remote Job': 'from-cyan-500 to-blue-600',
      'Others': 'from-gray-500 to-gray-700',
    };
    return map[category] || map['Non IT Job'];
  };

  // Get category color
  const getCategoryColor = (category) => {
    const colors = {
      'IT Job': 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300',
      'Non IT Job': 'bg-blue-200 dark:bg-blue-600/20 text-blue-800 dark:text-blue-200',
      'Walk In Drive': 'bg-blue-50 dark:bg-blue-400/20 text-blue-600 dark:text-blue-400',
      'Govt Job': 'bg-blue-300 dark:bg-blue-700/20 text-blue-900 dark:text-blue-100',
      'Internship': 'bg-sky-100 dark:bg-sky-500/20 text-sky-700 dark:text-sky-300',
      'Part Time Job': 'bg-sky-200 dark:bg-sky-600/20 text-sky-800 dark:text-sky-200',
      'Remote Job': 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300',
      'Others': 'bg-slate-100 dark:bg-slate-500/20 text-slate-700 dark:text-slate-300',
    };
    return colors[category] || colors['Non IT Job'];
  };

  const breadcrumbs = [
    { name: 'Home', path: '/' },
    { name: 'Jobs', path: '/jobs' }
  ];

  // Get SEO config based on category
  const seoConfig = selectedCategory !== 'All' && JOB_CATEGORY_SEO[selectedCategory]
    ? {
        title: getRandomVariant(JOB_CATEGORY_SEO[selectedCategory].titles),
        description: getRandomVariant(JOB_CATEGORY_SEO[selectedCategory].descriptions)
      }
    : getSEOConfig('jobs');

  // Enhanced structured data with JobPosting schema
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      generateBreadcrumbSchema(breadcrumbs),
      generateSearchActionSchema(),
      generateJobListSchema(jobs.slice(0, 20)), // Top 20 jobs for structured data
      {
        '@type': 'CollectionPage',
        '@id': 'https://edulumix.in/jobs',
        url: 'https://edulumix.in/jobs',
        name: seoConfig.title,
        description: seoConfig.description,
        isPartOf: {
          '@id': 'https://edulumix.in/#website'
        },
        breadcrumb: {
          '@id': 'https://edulumix.in/jobs#breadcrumb'
        }
      }
    ]
  };

  return (
    <div className="min-h-screen py-8 lg:py-12">
      <SEO
        title={seoConfig.title}
        description={seoConfig.description}
        keywords="fresher jobs 2026, jobs for freshers india, entry level jobs, IT jobs freshers, software developer jobs, fresher vacancies, govt jobs, internship opportunities, walk in drive, remote jobs freshers, job openings 2026, campus placement, graduate jobs, first job, fresher recruitment, job portal india, career opportunities, fresher hiring, entry level positions, job search india"
        url="/jobs"
        type="website"
        canonical="https://edulumix.in/jobs"
        structuredData={structuredData}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero + live stats */}
        <section className="relative min-h-[320px] sm:min-h-[380px] overflow-hidden rounded-3xl border border-gray-200/80 dark:border-gray-800 mb-10 shadow-xl shadow-blue-900/5">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=2000&q=85"
              alt=""
              className="h-full w-full object-cover object-[center_30%] sm:object-right"
              loading="eager"
              decoding="async"
            />
            {/* Dark scrim only on the text (left) side; right stays vivid */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'linear-gradient(90deg, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.72) 28%, rgba(0,0,0,0.38) 48%, rgba(0,0,0,0.08) 68%, transparent 82%)',
              }}
              aria-hidden
            />
          </div>
          <div className="relative z-10 px-6 py-10 sm:px-10 sm:py-14 lg:py-16">
            <div className="max-w-3xl">
              <p className="inline-flex items-center gap-2 text-white/95 text-sm font-medium mb-4 drop-shadow-md [text-shadow:0_1px_12px_rgba(0,0,0,0.5)]">
                <Zap className="w-4 h-4 text-amber-300 shrink-0 drop-shadow-md" />
                Freshers or experienced — your next move starts here
              </p>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white font-display tracking-tight mb-4 drop-shadow-md [text-shadow:0_2px_24px_rgba(0,0,0,0.55)]">
                Land the role that fits your story
              </h1>
              <p className="text-white/95 text-base sm:text-lg leading-relaxed mb-8 max-w-2xl [text-shadow:0_1px_16px_rgba(0,0,0,0.45)]">
                From first job to your next big leap — explore IT, government, internships, remote roles and more. Smart categories, zero clutter — find what fits you and apply with confidence.
              </p>
              <div className="flex flex-wrap gap-3 sm:gap-4">
                <div className="flex items-center gap-3 rounded-2xl bg-black/35 backdrop-blur-md border border-white/20 px-5 py-4 min-w-[200px] shadow-lg shadow-black/30">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15">
                    <Briefcase className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-white/80 uppercase tracking-wide font-medium">Total jobs</p>
                    <p className="text-3xl font-bold text-white tabular-nums">
                      {statsLoading ? '—' : (stats?.total ?? 0).toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Category explorer */}
        <section className="mb-10" aria-labelledby="job-categories-heading">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
            <div>
              <h2 id="job-categories-heading" className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white font-display">
                Explore by category
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                Jump in by role type — fresher or experienced, there&apos;s a lane for you
              </p>
            </div>
            <button
              type="button"
              onClick={() => selectCategory('All')}
              className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline self-start sm:self-auto"
            >
              View all jobs
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {JOB_CATEGORIES.map((cat) => {
              const Icon = cat.Icon;
              const active = selectedCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  type="button"
                  onClick={() => selectCategory(cat.key)}
                  className={`group relative text-left overflow-hidden rounded-2xl border transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-dark-300 ${
                    active
                      ? 'border-blue-500 ring-2 ring-blue-500/40 shadow-lg shadow-blue-500/15'
                      : 'border-gray-200 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md'
                  }`}
                >
                  <div className="relative h-24 sm:h-28 overflow-hidden bg-gray-100 dark:bg-dark-100">
                    <img
                      src={cat.image}
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <div className="relative p-3 sm:p-4 bg-white dark:bg-dark-200">
                    <div
                      className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${cat.gradient} text-white shadow-lg ${cat.ring} ring-2`}
                    >
                      <Icon className="w-5 h-5" aria-hidden />
                    </div>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base leading-tight">
                      {cat.shortTitle}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">
                      {cat.subtitle}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Search + quick chips */}
        <div className="mb-8" ref={listingsRef}>
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 mb-5">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by title, company, or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white dark:bg-dark-200 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-colors shadow-sm"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 sm:flex-none px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-semibold transition-colors shadow-lg shadow-blue-600/25"
              >
                Search
              </button>
              <button
                type="button"
                onClick={() => setShowFilters((open) => !open)}
                className="lg:hidden px-4 py-3.5 bg-gray-100 dark:bg-dark-200 border border-gray-200 dark:border-gray-700 rounded-2xl text-gray-600 dark:text-gray-400"
                aria-expanded={showFilters}
                aria-controls="job-advanced-filters"
                title={showFilters ? 'Hide filters' : 'Show filters'}
              >
                <Filter className="w-5 h-5" aria-hidden />
              </button>
            </div>
          </form>

          <div
            id="job-advanced-filters"
            className={showFilters ? 'mt-5 block' : 'mt-5 hidden lg:block'}
          >
            <JobListingFilters
              category={selectedCategory}
              onCategoryChange={(v) => {
                setSelectedCategory(v);
                setTimeout(scrollToListings, 120);
              }}
              city={filterCity}
              onCityChange={setFilterCity}
              location={filterLocation}
              onLocationChange={setFilterLocation}
              experience={filterExperience}
              onExperienceChange={setFilterExperience}
              status={filterStatus}
              onStatusChange={setFilterStatus}
              categories={categorySelectOptions}
              cities={filterOptions.cities}
              locations={filterOptions.locations}
              experiences={experienceOptions}
              optionsLoading={optionsLoading}
              onReset={resetListingFilters}
              activeFilterCount={activeFilterCount}
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-5 mb-2">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {loading ? (
                'Loading listings…'
              ) : (
                <>
                  Showing{' '}
                  <span className="font-semibold text-gray-800 dark:text-gray-200">
                    {jobs.length.toLocaleString('en-IN')}
                  </span>
                  {activeFilterCount > 0 || searchTerm.trim() ? (
                    <>
                      {' '}
                      of{' '}
                      <span className="font-semibold text-gray-800 dark:text-gray-200">
                        {listTotal.toLocaleString('en-IN')}
                      </span>
                      {activeFilterCount > 0 && (
                        <span className="text-gray-400 dark:text-gray-500">
                          {' '}
                          ·{' '}
                          <span className="text-blue-600 dark:text-blue-400">
                            {activeFilterCount} filter{activeFilterCount !== 1 ? 's' : ''} active
                          </span>
                        </span>
                      )}
                    </>
                  ) : (
                    <>
                      {' '}
                      loaded ·{' '}
                      <span className="font-semibold text-gray-800 dark:text-gray-200">
                        {(stats?.total ?? listTotal).toLocaleString('en-IN')}
                      </span>
                      {' '}
                      in database
                    </>
                  )}
                </>
              )}
            </p>
          </div>
        </div>

        {/* Jobs Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <JobCardSkeleton key={i} />
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-20">
            <Briefcase className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">No jobs found</h3>
            <p className="text-gray-500 dark:text-gray-500">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => {
              const jobPath = `/jobs/${createSlug(job)}`;
              const likes = job.likesCount || 0;
              const views = job.views || 0;
              const freshness = formatJobFreshness(job.createdAt);
              return (
                <div
                  key={job._id}
                  className="group/card flex flex-col bg-white dark:bg-dark-200 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-xl hover:shadow-blue-500/10 dark:hover:shadow-black/30 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300"
                >
                  <div className={`h-1 w-full shrink-0 bg-gradient-to-r ${getCategoryAccent(job.category)}`} aria-hidden />

                  <Link
                    to={jobPath}
                    className="block flex-1 p-5 min-w-0 min-h-0 hover:bg-gray-50/70 dark:hover:bg-white/[0.03] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-inset"
                  >
                    <h3 className="text-base sm:text-lg font-bold text-blue-600 dark:text-blue-400 group-hover/card:text-blue-700 dark:group-hover/card:text-blue-300 transition-colors truncate min-w-0 leading-snug tracking-tight mb-3">
                      {job.title}
                    </h3>

                    <div className="flex items-center gap-3 min-w-0 mb-3">
                      <CompanyAvatar company={job.company} logoUrl={job.companyLogo} size="md" rounded="full" />
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate min-w-0">
                        {job.company}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-gray-600 dark:text-gray-400 mb-3 min-w-0">
                      <span className="inline-flex items-center gap-1.5 min-w-0 max-w-[55%] sm:max-w-none">
                        <MapPin className="w-3.5 h-3.5 text-blue-500/85 dark:text-blue-400/90 shrink-0" aria-hidden />
                        <span className="truncate">{job.location}</span>
                      </span>
                      <span className="text-gray-300 dark:text-gray-600 select-none shrink-0" aria-hidden>
                        ·
                      </span>
                      <span className="inline-flex items-center gap-1.5 shrink-0 min-w-0">
                        <Clock className="w-3.5 h-3.5 text-blue-500/85 dark:text-blue-400/90 shrink-0" aria-hidden />
                        <span className="truncate">{job.experience}</span>
                      </span>
                      {job.salary && job.salary !== 'Not Disclosed' && (
                        <>
                          <span className="text-gray-300 dark:text-gray-600 select-none shrink-0" aria-hidden>
                            ·
                          </span>
                          <span className="inline-flex items-center gap-1.5 min-w-0">
                            <IndianRupee className="w-3.5 h-3.5 text-blue-500/85 dark:text-blue-400/90 shrink-0" aria-hidden />
                            <span className="truncate">{job.salary}</span>
                          </span>
                        </>
                      )}
                    </div>

                    <div className="flex items-center gap-2 min-w-0 flex-nowrap overflow-x-auto overscroll-x-contain pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium shrink-0 ${getCategoryColor(job.category)}`}
                      >
                        <Tag className="w-3 h-3 shrink-0" />
                        {job.category}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium shrink-0 ${
                          job.status === 'Closed'
                            ? 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300'
                            : 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300'
                        }`}
                      >
                        {job.status === 'Closed' ? 'Application Closed' : 'Application Open'}
                      </span>
                      {freshness ? (
                        <span className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap shrink-0">
                          Posted {freshness}
                        </span>
                      ) : null}
                    </div>
                  </Link>

                  <div className="px-5 py-3.5 bg-gray-50/90 dark:bg-dark-100 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-1 sm:gap-2 min-w-0">
                      <button
                        type="button"
                        onClick={(e) => handleLike(job._id, e)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                          likedJobs.has(job._id)
                            ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400'
                            : 'hover:bg-gray-200/90 dark:hover:bg-dark-200 text-gray-500 dark:text-gray-400'
                        }`}
                        aria-label={likedJobs.has(job._id) ? 'Unlike job' : 'Like job'}
                      >
                        <Heart className={`w-4 h-4 shrink-0 ${likedJobs.has(job._id) ? 'fill-current' : ''}`} />
                        {likes > 0 ? <span className="tabular-nums">{likes}</span> : null}
                      </button>

                      <button
                        type="button"
                        onClick={(e) => handleShare(job, e)}
                        className="p-2 hover:bg-gray-200/90 dark:hover:bg-dark-200 rounded-lg text-gray-500 dark:text-gray-400 transition-colors shrink-0"
                        aria-label="Share job"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>

                      {views > 0 && (
                        <span className="hidden sm:inline-flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500 tabular-nums shrink-0">
                          <Eye className="w-3.5 h-3.5" aria-hidden />
                          {views}
                        </span>
                      )}
                    </div>

                    {job.status === 'Closed' ? (
                      <span className="inline-flex items-center gap-1 shrink-0 px-3.5 py-2 bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400 text-sm font-medium rounded-xl cursor-not-allowed">
                        Closed
                      </span>
                    ) : (
                      <Link
                        to={jobPath}
                        className="inline-flex items-center gap-1 shrink-0 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm shadow-blue-600/25 whitespace-nowrap"
                      >
                        Apply Now
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Infinite scroll trigger + Load more fallback */}
        {!loading && jobs.length > 0 && hasMore && (
          <div ref={observerTarget} className="flex justify-center mt-10 min-h-[60px]">
            {loadingMore && (
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                <Loader2 className="w-5 h-5 animate-spin" />
                Loading more...
              </div>
            )}
          </div>
        )}
        {!loading && jobs.length > 0 && !hasMore && (
          <p className="text-center text-gray-500 dark:text-gray-400 mt-8">You've seen all jobs</p>
        )}
      </div>
    </div>
  );
};

export default Jobs;
