import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import type { RootState } from "../store/store.js"; 

const GuestRoute = () => {
  const {currentUser, token} = useSelector((state: RootState) => state?.user);

  return currentUser && token ? (
    <Navigate to="/" />
  ) : (
    <div className="bg-gray-200 theme w-full h-screen flex items-center justify-center">
      <Outlet />
    </div>
  );
};


export default GuestRoute;

