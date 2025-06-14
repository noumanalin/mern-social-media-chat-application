import { useSelector } from "react-redux"
import type { RootState } from "../store/store"
import { Link } from "react-router-dom"
import { CiSearch } from "react-icons/ci" // ✅ Corrected import
import ProtileImage from "./ProtileImage"

const Navbar = () => {
  const currentUser = useSelector((state: RootState) => state.user.currentUser)

  const userId = currentUser?._id
  const profilePhoto = currentUser?.profilePhoto

  return (
    <nav className="fixed w-full z-50 bg-white dark:bg-gray-800">
      <div className="container mx-auto flex justify-between items-center py-3">
        
        <Link to='/' className="text-xl font-bold">
          Guten_<span className="text-blue-500">Tag</span>
        </Link>

        
        <form className="flex items-center justify-between gap-2 sm:w-[450px]  px-2 py-2 rounded-md bg-gray-100 dark:bg-gray-900">
          <input
            type="search"
            placeholder="Search"
            className="outline-none border-none"
          />
          <button type="submit" className="px-2 py-1 text-white font-bold bg-primary rounded-xl web-parymary-btn">
            <CiSearch size={20} />
          </button>
        </form>

        {/* User Area */}
        <div className="flex items-center gap-4">
          {currentUser ? (
            <>
              <Link to={`/profile/${userId}`}>
                <ProtileImage image={profilePhoto}  />
              </Link>
              <Link to='/logout'>Logout</Link>
            </>
          ) : (
            <Link to='/login'>Login</Link>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
