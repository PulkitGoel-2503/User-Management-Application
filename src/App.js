import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UsersTable from './Components/UserTable';
import UserForm from './Components/UserForm';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UsersTable />} />
        <Route path="/create" element={<UserForm />} />
        <Route path="/edit/:id" element={<UserForm />} />
      </Routes>
    </Router>
  );
}

export default App;