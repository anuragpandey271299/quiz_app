import React from 'react'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import UserFormPage from './Pages/UserFormPage';
import QuizPage from './Pages/QuizPage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PrivateRoute from './Components/PrivateRoute';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<UserFormPage />} />
      <Route path='/homepage' element={<PrivateRoute Cmp={QuizPage} />} />
    </Routes>
    <ToastContainer position='top-center' />
    </BrowserRouter>
  )
}

export default App