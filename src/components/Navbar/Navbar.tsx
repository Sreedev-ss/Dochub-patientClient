import React from 'react'
import './Navbar.scss'
import SearchIcon from '@mui/icons-material/Search';
import { useSelector } from 'react-redux';

const Navbar = () => {
  const userData = useSelector((state: any) => state.auth)
  return (
    <>
      <div className='body p-4 flex justify-between items-center px-10'>
        <nav className="flex items-center">
          <a
            className="text-3xl font-bold leading-none flex items-center space-x-4"
            href="#"
          >
            <span className="text-black text-lg">
              Doc<span className="text-orange-500 text-lg">Hub</span>
            </span>
          </a>
        </nav>
        <div>
          <div className="flex items-center space-x-2">
            <span className="flex flex-col">
              <span className="text-sm font-medium text-gray-900">
                John Doe
              </span>
            </span>
            <img
              className="inline-block w-10 h-10 rounded-full"
              src={userData?userData.user.data.profileURL:"https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60"}
              alt="John Doe"
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default Navbar
