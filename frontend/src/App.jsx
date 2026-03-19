import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Loader from './components/common/Loader';
import ScrollToTop from './components/common/ScrollToTop';
import EduLumixChatbot from './components/chat/EduLumixChatbot';

// Layout Components (needed for first paint)
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/auth/ProtectedRoute';
import SuperAdminRoute from './components/auth/SuperAdminRoute';

// Critical: Home (load first for landing)
import Home from './pages/Home';

// Lazy load content pages (split chunks - load on demand)
const Jobs = lazy(() => import('./pages/Jobs'));
const JobDetails = lazy(() => import('./pages/JobDetails'));
const Resources = lazy(() => import('./pages/Resources'));
const ResourceDetails = lazy(() => import('./pages/ResourceDetails'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogDetails = lazy(() => import('./pages/BlogDetails'));

// Lazy load rest (split chunks - load on demand)
const Courses = lazy(() => import('./pages/Courses'));
const CourseDetails = lazy(() => import('./pages/CourseDetails'));
const MockTests = lazy(() => import('./pages/MockTests'));
const MockTestDetails = lazy(() => import('./pages/MockTestDetails'));
const DigitalProducts = lazy(() => import('./pages/DigitalProducts'));
const DigitalProductDetails = lazy(() => import('./pages/DigitalProductDetails'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const CookiePolicy = lazy(() => import('./pages/CookiePolicy'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const RefundPolicy = lazy(() => import('./pages/RefundPolicy'));
const Login = lazy(() => import('./pages/auth/Login'));
const Signup = lazy(() => import('./pages/auth/Signup'));
const PendingApproval = lazy(() => import('./pages/auth/PendingApproval'));
const CreateJob = lazy(() => import('./pages/dashboard/CreateJob'));
const CreateResource = lazy(() => import('./pages/dashboard/CreateResource'));
const CreateBlog = lazy(() => import('./pages/dashboard/CreateBlog'));
const CreateProduct = lazy(() => import('./pages/dashboard/CreateProduct'));
const SuperAdminLayout = lazy(() => import('./pages/superadmin/SuperAdminLayout'));
const SuperAdminDashboard = lazy(() => import('./pages/superadmin/SuperAdminDashboard'));
const ContributorManagement = lazy(() => import('./pages/superadmin/ContributorManagement'));
const JobManagement = lazy(() => import('./pages/superadmin/JobManagement'));
const ResourceManagement = lazy(() => import('./pages/superadmin/ResourceManagement'));
const BlogManagement = lazy(() => import('./pages/superadmin/BlogManagement'));
const CourseManagement = lazy(() => import('./pages/superadmin/CourseManagement'));
const DigitalProductManagement = lazy(() => import('./pages/superadmin/DigitalProductManagement'));
const MockTestManagement = lazy(() => import('./pages/superadmin/MockTestManagement'));
const SuperAdminProfile = lazy(() => import('./pages/superadmin/SuperAdminProfile'));
const ClaimsManagement = lazy(() => import('./pages/superadmin/ClaimsManagement'));
const ContributorLayout = lazy(() => import('./pages/contributor/ContributorLayout'));
const ContributorDashboard = lazy(() => import('./pages/contributor/ContributorDashboard'));
const ContributorMyPosts = lazy(() => import('./pages/contributor/ContributorMyPosts'));
const ContributorProfile = lazy(() => import('./pages/contributor/ContributorProfile'));
const ContributorRewards = lazy(() => import('./pages/contributor/ContributorRewards'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Lightweight fallback for lazy routes
const PageLoader = () => (
  <div className="flex justify-center items-center min-h-[40vh]">
    <Loader size="md" text="" />
  </div>
);

function App() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-300 flex flex-col">
      <ScrollToTop />
      <EduLumixChatbot />
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-dark-300">
          <Loader size="lg" text="" />
        </div>
      }>
      <Routes>
        {/* Routes with their own layout (no global Navbar/Footer) */}
        <Route path="/super-admin/*" element={
          <SuperAdminRoute>
            <SuperAdminLayout />
          </SuperAdminRoute>
        }>
          <Route index element={<SuperAdminDashboard />} />
          <Route path="contributors" element={<ContributorManagement />} />
          <Route path="jobs" element={<JobManagement />} />
          <Route path="resources" element={<ResourceManagement />} />
          <Route path="blogs" element={<BlogManagement />} />
          <Route path="courses" element={<CourseManagement />} />
          <Route path="products" element={<DigitalProductManagement />} />
          <Route path="mock-tests" element={<MockTestManagement />} />
          <Route path="claims" element={<ClaimsManagement />} />
          <Route path="profile" element={<SuperAdminProfile />} />
        </Route>

        {/* Contributor Routes with own layout */}
        <Route path="/contributor/*" element={
          <ProtectedRoute>
            <ContributorLayout />
          </ProtectedRoute>
        }>
          <Route index element={<ContributorDashboard />} />
          <Route path="my-posts" element={<ContributorMyPosts />} />
          <Route path="rewards" element={<ContributorRewards />} />
          <Route path="profile" element={<ContributorProfile />} />
          <Route path="create-job" element={<CreateJob />} />
          <Route path="create-resource" element={<CreateResource />} />
          <Route path="create-blog" element={<CreateBlog />} />
          <Route path="create-product" element={<CreateProduct />} />
        </Route>

        {/* Routes with global Navbar and Footer */}
        <Route path="*" element={
          <>
            <Navbar />
            <main className="flex-grow">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/jobs" element={<Jobs />} />
                <Route path="/jobs/:id" element={<JobDetails />} />
                <Route path="/resources" element={<Resources />} />
                <Route path="/resources/:id" element={<ResourceDetails />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogDetails />} />
                <Route path="/courses" element={<Courses />} />
                <Route path="/courses/:slug" element={<CourseDetails />} />
                <Route path="/mock-test" element={<MockTests />} />
                <Route path="/mock-test/:slug" element={<MockTestDetails />} />
                <Route path="/digital-products" element={<DigitalProducts />} />
                <Route path="/digital-products/:id" element={<DigitalProductDetails />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                
                {/* Policy Routes */}
                <Route path="/cookie-policy" element={<CookiePolicy />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms-of-service" element={<TermsOfService />} />
                <Route path="/refund-policy" element={<RefundPolicy />} />
                
                {/* Auth Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/pending-approval" element={<PendingApproval />} />
                
                {/* Legacy dashboard routes redirected to contributor area */}
                <Route path="/dashboard" element={<Navigate to="/contributor" replace />} />
                <Route path="/dashboard/my-posts" element={<Navigate to="/contributor/my-posts" replace />} />
                <Route path="/dashboard/profile" element={<Navigate to="/contributor/profile" replace />} />
                <Route path="/dashboard/create-job" element={<Navigate to="/contributor/create-job" replace />} />
                <Route path="/dashboard/create-resource" element={<Navigate to="/contributor/create-resource" replace />} />
                <Route path="/dashboard/create-blog" element={<Navigate to="/contributor/create-blog" replace />} />
                <Route path="/dashboard/create-product" element={<Navigate to="/contributor/create-product" replace />} />
                
                {/* Legacy admin routes redirected to super-admin workspace */}
                <Route path="/admin" element={<Navigate to="/super-admin" replace />} />
                <Route path="/admin/users" element={<Navigate to="/super-admin/contributors" replace />} />
                <Route path="/admin/pending" element={<Navigate to="/super-admin/contributors" replace />} />
                
                {/* 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </>
        } />
      </Routes>
      </Suspense>
    </div>
  );
}

export default App;
