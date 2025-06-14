import { NavLink } from "react-router-dom"
import { BookmarkCheck, House, Mail, PaintbrushVertical } from 'lucide-react'
import { useState } from "react";
import Modal from "../components/Modal";
import ThemeColorPicker from "./ThemeColorPicker";




const Sidebar = () => {
  const navLinks = [
    { id: 1, name: "home", to: "/", icon: House },
    { id: 2, name: "messages", to: "/messages", icon: Mail },
    { id: 3, name: "bookmarks", to: "/bookmarks", icon: BookmarkCheck },
  ];



    const [isOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
  };



  return (
    <menu className="fixed  bottom-0 right-0 z-50 md:static px-2 py-6 rounded-md shadow-xl w-full bg-white dark:bg-gray-700">
      <div className="flex flex-row md:flex-col items-center md:items-start justify-between gap-6 text-xl">
        {
          navLinks.map((link) => (
            <NavLink
              key={link.id}
              to={link.to}
              className={({ isActive }) => `${isActive ? ' bg-primary font-bold text-gray-100' : ''} capitalize md:w-full flex gap-2 py-3 md:py-6 px-4 rounded-xl hover:bg-primary-variant`}
            >
              <link.icon />
              <span className="hidden md:inline">{link.name}</span>
              
            </NavLink>
          ))
        }   

        <button  onClick={() => openModal()} 
        className={ `capitalize md:w-full flex gap-2 py-6 px-4 rounded-xl hover:bg-primary-variant cursor-pointer`}
        >
        <PaintbrushVertical/>
        <span className="hidden md:inline">Theme</span>
        </button>
      </div>




      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <ThemeColorPicker/>
      </Modal>

    </menu>
  );
};

export default Sidebar;





