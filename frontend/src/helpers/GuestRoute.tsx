import { Navigate, Outlet } from "react-router-dom";

const GuestRoute = () => {
  // const { user, token } = useSelector((state) => state.auth);
  const user = false;
  const token = false;


  return user && token ? 
  <Navigate to={"/"} /> 
  : 
  <div className="bg-gray-200 w-full h-screen flex items-center justify-center">
    <Outlet />
  </div> 
};

export default GuestRoute;
