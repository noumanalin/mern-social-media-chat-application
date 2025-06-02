
import { Navigate, Outlet,  } from "react-router-dom";

function ProtectedRoute() {
  
  const user = false;
  const token = false;
  if (!user && !token) return <Navigate to="/login" />;

  return (
    <>
    <Outlet/>
  </>
  );
}

export default ProtectedRoute;
