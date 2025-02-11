import {FaSearch} from 'react-icons/fa'
import { Link } from 'react-router-dom'
import{useSelector} from 'react-redux'
export default function Header() {
  const {currentUser} = useSelector(state => state.user)
  return (
    <header className='bg-slate-200 shadow-md'>
        <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link to='/'>
        <img src='https://res.cloudinary.com/duefzmqm1/image/upload/v1733294283/ss_reality_ticgaq.jpg' className='flex flex-wrap w-32 h-13'/>
            
        </Link>
        <form className='bg-slate-100 p-3 rounded-lg flex items-center'>
            <input type='text' placeholder='Search...' className='bg-transparent focus:outline-none w-24 sm:w-64' />
            <FaSearch className='text-slate-700'/>
        </form>
        <ul className='flex gap-4'>

            <Link to='/'><li className='hidden sm:inline text-slate-700 hover:underline hover:cursor-pointer'>Home</li></Link>
            <Link to='/about'> <li className='hidden sm:inline text-slate-700 hover:underline hover:cursor-pointer'>About</li></Link>
            <Link to='/profile'>
             {currentUser ? (
                   <img  className="rounded-full h-7 w-7 object-cover" src = {currentUser.avatar} alt='profile'/>
             ): (
             <li className=' text-slate-700 hover:underline hover:cursor-pointer'>Sign in</li> 
            )}
             
            </Link> 
        </ul>

        </div>
    </header>
  )
}
