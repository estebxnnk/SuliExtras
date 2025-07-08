import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem('token');
  const userRol = localStorage.getItem('userRol');

  if (!token) {
    // No autenticado
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRol)) {
    // No tiene el rol adecuado
    return <Navigate to="/login" replace />;
  }

  // Autenticado y con rol permitido
  return children;
}

export default ProtectedRoute; 