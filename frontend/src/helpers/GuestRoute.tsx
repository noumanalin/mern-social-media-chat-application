import { Navigate, Outlet } from "react-router-dom";

const GuestRoute = () => {
  // const { user, token } = useSelector((state) => state.auth);
  const user = false;
  const token = false;


  return user && token ? <Navigate to={"/"} /> : <Outlet />;
};

export default GuestRoute;
