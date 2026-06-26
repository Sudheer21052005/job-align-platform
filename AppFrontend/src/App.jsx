// App.js
import React, { Suspense, lazy } from "react";
import { BrowserRouter } from "react-router-dom";
import { Box } from "@mui/material";
import ThemeProvider from "./styles/ThemeProvider";
import { AuthProvider } from "./auth/AuthContext";
import { SnackbarProvider } from "./contexts/SnackbarContext";
import { JobFiltersProvider } from "./contexts/JobFiltersContext";
import ErrorBoundary from "./components/common/ErrorBoundary";
import Layout from "./components/common/layout";
import Loader from "./components/common/Loader";
import JobAssistantWrapper from "./components/JobSeekers/JobAssistantWrapper";

// Lazy load routes for better performance
const AppRoutes = lazy(() => import("./router/AppRoutes"));

const AppContent = () => {
  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh', 
      bgcolor: 'background.default',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <Layout>
        <Suspense fallback={<Loader fullHeight message="Loading application..." />}>
          <AppRoutes />
        </Suspense>
      </Layout>
      
      {/* JobAssistantWrapper handles conditional rendering based on user role */}
      <JobAssistantWrapper />
    </Box>
  );
};

const App = () => {
  return (
    <React.StrictMode>
      <AuthProvider>
        <ThemeProvider>
          <SnackbarProvider>
            <JobFiltersProvider>
              <BrowserRouter>
                <ErrorBoundary>
                  <AppContent />
                </ErrorBoundary>
              </BrowserRouter>
            </JobFiltersProvider>
          </SnackbarProvider>
        </ThemeProvider>
      </AuthProvider>
    </React.StrictMode>
  );
};

export default App;
