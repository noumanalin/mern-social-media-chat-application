import { Route, Routes } from "react-router-dom";
import GuestRoute from "./helpers/GuestRoute";
import { ToastContainer } from 'react-toastify';
import Login from './pages/Login'
import Signup from "./pages/Signup";
import ProtectedRoute from "./helpers/ProtectedRoute";
import SinglePost from "./pages/SinglePost";
import Profile from "./pages/Profile";
import Home from "./pages/Home";
import MessagesList from "./components/MessagesList";
import Logout from './pages/Logout'
import Messages from "./pages/Messages";
import Bookmarks from "./pages/Bookmarks";
import './styles.css'


function App() {

  return (
  <main className="no-scrollbar">
    <Routes>
      <Route element={<GuestRoute />} >
            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<Signup />} /> 
      </Route>

      <Route element={<ProtectedRoute/>}>
        <Route path="/" element={<Home/>} />
        <Route path="/messages" element={<MessagesList/>} />
        <Route path="/messages/:receiverId" element={<Messages/>} />
        <Route path="/bookmarks" element={<Bookmarks/>} />
        <Route path="/user/:id" element={<Profile/>} />
        <Route path="/post/:id" element={<SinglePost/>} />
        <Route path="/logout" element={<Logout />} />
      </Route>
      
     </Routes>
     <ToastContainer  style={{ zIndex: 9999 }}/>
    </main>

  )
}

export default App
