import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import ReportForm from './pages/ReportForm';
import AdminPanel from './pages/AdminPanel';
import UserProfile from './pages/UserProfile';

const App = () => {
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/report" element={<ReportForm />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/profile" element={<UserProfile />} />
        </Routes>
        <footer className="bg-dark text-white text-center py-3 mt-auto">
          <p>&copy; 2024 Taza Dala. Все права защищены.</p>
          <p>Контакты: <a href="mailto:support@tazadala.kz" className="text-white">support@tazadala.kz</a></p>
        </footer>
      </div>
    </Router>
  );
};

export default App;
