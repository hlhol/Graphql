import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ element }) => {
  const token = sessionStorage.getItem('hhh');
  
  return token ? element : <Navigate to="/" />;
};

export default PrivateRoute;
