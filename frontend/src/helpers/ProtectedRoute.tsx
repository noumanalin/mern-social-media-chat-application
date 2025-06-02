
import { Navigate, Outlet,  } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Widgets from "../components/Widgets";

function ProtectedRoute() {
  
  const user = false;
  const token = false;
  if (!user && !token) return <Navigate to="/login" />;

  return (
    <>
    <Navbar/>
    <main>
      <Sidebar/>
      <Outlet/>
      <Widgets/>
    </main>
  </>
  );
}

export default ProtectedRoute;
