// src/router/AppRoutes.jsx
import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import PrivateRoute from "../auth/PrivateRoute";
import Loader from "../components/common/Loader";

// Lazy load pages for performance optimization
const HomePage = lazy(() => import("../pages/HomePage"));
const LoginPage = lazy(() => import("../pages/Auth/LoginPage"));
const RegisterPage = lazy(() => import("../pages/Auth/RegisterPage"));
const ForgotPasswordPage = lazy(() =>
  import("../pages/Auth/ForgotPasswordPage")
);
const ResetPasswordPage = lazy(() => import("../pages/Auth/ResetPasswordPage"));
const ChangePasswordPage = lazy(() =>
  import("../pages/Auth/ChangePasswordPage")
);
const JobListingPage = lazy(() => import("../pages/JobListingPage"));
const JobDetailsPage = lazy(() =>
  import("../components/JobListings/JobDetails")
);
const ApplyJobPage = lazy(() =>
  import("../components/JobSeekers/ApplyJobForm")
);
// Use direct import with error handling
const SavedJobsPage = lazy(() => import("../pages/SavedJobsPage").catch(error => {
  console.error('Error loading SavedJobsPage:', error);
  return { default: () => <div>Error loading Saved Jobs page. Please try again later.</div> };
}));
const AppliedJobsPage = lazy(() => import("../pages/AppliedJobsPage").catch(error => {
  console.error('Error loading AppliedJobsPage:', error);
  return { default: () => <div>Error loading Applied Jobs page. Please try again later.</div> };
}));
const RecruitersJobPage = lazy(() => import("../pages/RecruitersJobPage"));
const PostJobForm = lazy(() => import("../components/Recruiters/PostJobForm"));
const EditJobForm = lazy(() => import("../components/Recruiters/EditJobForm"));
const ProfilePage = lazy(() => import("../pages/Profile/ProfilePage"));
const EditProfilePage = lazy(() => import("../pages/Profile/EditProfilePage"));
const RecruiterDashboardPage = lazy(() =>
  import("../pages/RecruiterDashboardPage")
);
const ManageApplicantsPage = lazy(() =>
  import("../pages/ManageApplicantsPage")
);
const DashboardPage = lazy(() => import("../pages/DashboardPage"));
const CompanyPage = lazy(() => import("../pages/CompanyPage"));
const CompanyCreate = lazy(() => import("../components/Company/CompanyCreate"));
const CompanySetup = lazy(() => import("../components/Company/CompanySetup"));
const TermsPage = lazy(() => import("../pages/TermsPage"));
const JobMatchingPage = lazy(() => import("../pages/JobMatchingPage"));
const PrivacyPolicyPage = lazy(() => import("../pages/PrivacyPolicyPage"));
const NotFoundPage = lazy(() => import("../pages/NotFoundPage"));
const UnauthorizedPage = lazy(() => import("../pages/UnauthorizedPage"));

// Custom suspense component with better loading experience
const PageLoader = () => <Loader fullHeight message="Loading page content..." />;

// Group routes by access level
const AppRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/jobs" element={<JobListingPage />} />
        <Route path="/jobs/:id" element={<JobDetailsPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />

        {/* General Authenticated Routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/edit" element={<EditProfilePage />} />
          <Route path="/change-password" element={<ChangePasswordPage />} />
        </Route>

        {/* Job Seeker Routes */}
        <Route element={<PrivateRoute requiredRole="jobSeeker" />}>
          <Route path="/apply-job/:id" element={<ApplyJobPage />} />
          <Route path="/saved-jobs" element={<SavedJobsPage />} />
          <Route path="/applied-jobs" element={<AppliedJobsPage />} />
        </Route>

        {/* Recruiter Routes */}
        <Route element={<PrivateRoute requiredRole="recruiter" />}>
          <Route
            path="/recruiter-dashboard"
            element={<RecruiterDashboardPage />}
          />
          <Route path="/recruiter-job" element={<RecruitersJobPage />} />
          <Route
            path="/recruiter-dashboard/new-job"
            element={<PostJobForm />}
          />
          <Route
            path="/recruiter-dashboard/edit-job/:id"
            element={<EditJobForm />}
          />
          <Route
            path="/manage-applicants/:jobId"
            element={<ManageApplicantsPage />}
          />
          <Route
            path="/recruiter-dashboard/match-applicants" 
            element={<JobMatchingPage />}
          />
        </Route>

        {/* Companies Routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/companies" element={<CompanyPage />} />
          <Route path="/companies/create" element={<CompanyCreate />} />
          <Route path="/companies/edit/:id" element={<CompanySetup />} />
        </Route>

        {/* Error Pages */}
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
