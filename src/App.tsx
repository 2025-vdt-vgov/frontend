import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ThemeProvider } from "./components/ThemeProvider";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import Projects from "./pages/Projects";
import Employees from "./pages/Employees";
import PMTools from "./pages/PMTools";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import LoginPage from "./pages/LoginPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  // Define restricted routes and their required roles
  const restrictedRoutes = {
    '/projects': ['admin', 'pm'],
    '/employees': ['admin', 'pm'],
    '/pm-tools': ['admin'],
    '/settings': ['admin']
  };

  // Check if current path is restricted and user doesn't have access
  const currentPath = location.pathname;
  const requiredRoles = restrictedRoutes[currentPath as keyof typeof restrictedRoutes];
  
  if (requiredRoles && !requiredRoles.includes(user.role)) {
    return <Navigate to="/\" replace />;
  }

  const DashboardComponent = user.role === 'employee' ? EmployeeDashboard : Dashboard;

  return (
    <Routes>
      <Route path="/" element={<Layout><DashboardComponent /></Layout>} />
      <Route path="/reports" element={<Layout><Reports /></Layout>} />
      {(user.role === 'admin' || user.role === 'pm') && (
        <>
          <Route path="/projects" element={<Layout><Projects /></Layout>} />
          <Route path="/employees" element={<Layout><Employees /></Layout>} />
        </>
      )}
      {user.role === 'admin' && (
        <>
          <Route path="/pm-tools" element={<Layout><PMTools /></Layout>} />
          <Route path="/settings" element={<Layout><Settings /></Layout>} />
        </>
      )}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;