import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import VendorOnboarding from './pages/VendorOnboarding'
import AdminDashboard from './pages/AdminDashboard'
import VendorDetail from './pages/VendorDetail'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Routes>
          <Route path="/" element={<VendorOnboarding />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/vendor/:id" element={<VendorDetail />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App

