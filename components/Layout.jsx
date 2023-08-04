import NavBar from '@/components/Nav'
import { useSession, signIn, signOut } from 'next-auth/react'
import Loader from './Loader'
export default function Layout({ children }) {
  const { data: session, status } = useSession()
  if (status === 'loading') {
    return (
      <div className='bg-blue-900 min-h-screen flex'>
        <NavBar />
        <div className='bg-white flex flex-grow mt-2 mr-2 mb-2 rounded-lg justify-center items-center'>
          <Loader />
        </div>
      </div>
    )
  }
  if (!session) {
    return (
      <div className='bg-blue-900 w-screen h-screen flex justify-center items-center'>
        <div>
          <button
            className='bg-white p-2 px-4 hover:bg-gray-200'
            onClick={() => signIn('google')}
          >
            Login with Google
          </button>
        </div>
      </div>
    )
  }
  return (
    <div className='bg-blue-900 min-h-screen flex'>
      <NavBar />
      <div className='bg-white flex-grow mt-2 mr-2 mb-2 rounded-lg'>
        {children}
      </div>
    </div>
  )
}
