import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import RoleManagement from './views/rolemanagement/rolemanagement';
import AddRole from './views/rolemanagement/AddRole/AddRole';
import { useSelector } from 'react-redux';
import { RootState } from 'store';

function App() {

  const PaginationReducer = useSelector((state: RootState) => state.RolePaginationSlice);
  const ApiReducer = useSelector((state: RootState) => state.RoleApiSlice);
  const RoleManagementReducer = useSelector((state: RootState) => state.RoleSlice);

  console.log('RoleManagementReducer', RoleManagementReducer);
  console.log('ApiReducer', ApiReducer);
  console.log('PaginationReducer', PaginationReducer);


  return (
    <RoleManagement />
  );
}

export default App;