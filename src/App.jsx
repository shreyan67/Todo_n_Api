import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import SignUp from './components/SignUp';  // Make sure this is correctly imported
import TodoApp from './components/TodoApp';
import ProtectedRoute from './components/ProtectedRoute';
import { BrowserRouter } from 'react-router-dom';


function App() {
  return (
    
    <Routes>
      <Route path="/signup" element={<SignUp />} /> {/* SignUp route */}
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <TodoApp />
          </ProtectedRoute>
        }
      />
    </Routes>
    
  );
}

export default App;