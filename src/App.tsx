import React from 'react';
import { Route, Routes } from 'react-router-dom';
import RoleManagement from './views/rolemanagement/rolemanagement';
import AddRole from './views/rolemanagement/AddRole/AddRole';

function App() {
  return (
    <Routes>
      <Route path="/" element={<RoleManagement />} />
      <Route path="/addrole/:id" element={<AddRole />} />
    </Routes>
  );
}

export default App;