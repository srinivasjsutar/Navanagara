import { BrowserRouter, Route, Routes, useLocation, Navigate } from "react-router-dom";
import "./App.css";
import { LoginHeader } from "./components/LoginHeader";
import { AdminLogin } from "./components/AdminLogin";
// import { MemberLogin } from "./components/MemberLogin";
import { Dashboard } from "./pages/Dashboard";
import { Receipt } from "./pages/Receipts";
import { AddAdmin } from "./components/AddAdmin";
import { AddMember } from "./components/AddMember";
import { SideBar } from "./components/sidebar"; 
import { Report } from "./pages/report";
import { MemberList } from "./components/MemberList";
import { SiteBookingList } from "./components/SiteBookingList";
import { ReceiptList } from "./components/ReceiptsList";
import Payments from "./components/Payments";
import { SiteBookingForm } from "./components/SiteBookingForm";
import ReceiptForm from "./components/ReceiptForm";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ProtectedRoute } from "./components/ProtectedRoute";

const MainApp = () => {
  const location = useLocation();

  const noSidebarRoutes = ['/adminlogin', '/memberlogin', '/'];

  return (
    <div className="flex h-screen overflow-hidden">
      {!noSidebarRoutes.includes(location.pathname) && <SideBar />}

      <div className="flex-1 overflow-y-auto">
        <Routes>
          {/* Public Routes - No Authentication Required */}
          <Route path="/" element={<Navigate to="/adminlogin" replace />} />
          <Route path="/adminlogin" element={<AdminLogin />} />
          <Route path="/loginheader" element={<LoginHeader />} />
          {/* <Route path="/memberlogin" element={<MemberLogin />} /> */}

          {/* Protected Routes - Authentication Required */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/addadmin" 
            element={
              <ProtectedRoute>
                <AddAdmin />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/receiptform" 
            element={
              <ProtectedRoute>
                <ReceiptForm />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/addmember" 
            element={
              <ProtectedRoute>
                <AddMember />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/report" 
            element={
              <ProtectedRoute>
                <Report />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/sitebookingform" 
            element={
              <ProtectedRoute>
                <SiteBookingForm />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/memberlist" 
            element={
              <ProtectedRoute>
                <MemberList />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/sitebookinglist" 
            element={
              <ProtectedRoute>
                <SiteBookingList />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/receiptlist" 
            element={
              <ProtectedRoute>
                <ReceiptList />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/receipts" 
            element={
              <ProtectedRoute>
                <Receipt />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/payments" 
            element={
              <ProtectedRoute>
                <Payments />
              </ProtectedRoute>
            } 
          />

          {/* Catch-all route - redirect to login */}
          <Route path="*" element={<Navigate to="/adminlogin" replace />} />
        </Routes>

        {/* Toast Container */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          theme="colored"
        />
      </div>
    </div>
  );
};

function App() {
  return (  
    <BrowserRouter>
      <MainApp />
    </BrowserRouter>
  );
}

export default App;