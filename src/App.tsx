import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import Navbar from './components/NavBar/Navbar';
import Sidebar from './components/SideBar/Sidebar';
import Login from './components/Login/Login';
import EventManagments from './components/EventManagments/EventManagments';
import Analytics from './components/Analytics/Analytics';
import CreateEvent from './components/CreateEvent/CreateEvent';
import EventDetails from './components/EventManagments/EventDetails/EventDetails';
import Tables from './components/Table/Tables';
import CreateTable from './components/Table/CreateTable';
import ForgotPassword from './components/ForgotPassword/ForgotPassword';
import Orders from './components/Orders/Orders';
import Testimonials from './components/Testimonials/Testimonials';

const App: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthenticated, setAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });
  const username = "Awtel";
  const userInitials = "A";

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const handleLogin = () => {
    setAuthenticated(true);
    localStorage.setItem('isAuthenticated', 'true');
  };

  const handleLogout = () => {
    setAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
  };

  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.removeItem('isAuthenticated');
    }
  }, [isAuthenticated]);

  return (
    <Router>
      <div className={`app ${isSidebarOpen ? 'no-scroll' : ''}`}>
        {isAuthenticated ? (
          <>
            <Navbar username={username} toggleSidebar={toggleSidebar} onLogout={handleLogout} />
            <Sidebar username={username} userInitials={userInitials} isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            {isSidebarOpen && <div className="overlay" onClick={closeSidebar}></div>}
            <Routes>
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/event-managments" element={<EventManagments />} />
              <Route path="/event-managments/create" element={<CreateEvent />} />
              <Route path="/event-managments/:id" element={<EventDetails />} />
              <Route path='/tables' element={<Tables />} />
              <Route path='/tables-create' element={<CreateTable />} />
              <Route path='/orders' element={<Orders />} />
              <Route path="/testimonials" element={<Testimonials />} />
              <Route path="*" element={<Navigate to="/analytics" />} />
            </Routes>
          </>
        ) : (
          <Routes>
            <Route path="/login" element={<Login onLoginSuccess={handleLogin} />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        )}
      </div>
    </Router>
  );
};

export default App;