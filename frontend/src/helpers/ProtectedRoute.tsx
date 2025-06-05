
import { Navigate, Outlet,  } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Widgets from "../components/Widgets";
import { useSelector } from "react-redux"; 
import type { RootState } from "../store/store.js"; 

function ProtectedRoute() {
  const {currentUser, token} = useSelector((state: RootState) => state.user);
  if (!currentUser || !token) return <Navigate to="/login" />;

  return (
    <>
    <Navbar/>

    <section className="container mx-auto pt-[80px] grid grid-cols-1 md:grid-cols-4 lg:grid-cols-8 ">
        
        {/* Left Sidebar */}
        <div className={` dark:bg-gray-900 md:col-span-1 lg:col-span-2`}>
          <Sidebar />
        </div>

        {/* Main Content */}
        <section className="col-span-1 md:col-span-3 lg:col-span-4 p-4 mx h-screen overflow-y-scroll no-scrollbar w-full">
          <Outlet />
        </section>


        <div className="hidden lg:block lg:col-span-2" >
          <Widgets/>
        </div>

      </section>
  </>
  );
}

export default ProtectedRoute;
