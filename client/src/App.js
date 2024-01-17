import React from 'react'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import UserFormPage from './Pages/UserFormPage';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<UserFormPage />} />
    </Routes>
    </BrowserRouter>
  )
}

export default App