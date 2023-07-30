import { useSession } from 'next-auth/react'
import Layout from '@/components/Layout'
export default function Home() {
  const { data: session } = useSession()
  return (
    <Layout>
      <div className='flex justify-between text-blue-900 mr-4 '>
        <h2 className='text-2xl mx-4'>
          Hello, <b>{session?.user?.name}</b>
        </h2>
        <div className='flex gap-2 bg-gray-300 rounded-lg text-black px-4 overflow-hidden  justify-around'>
          <img src={session?.user.image} alt='user-img' className='w-8 h-8' />
          <span className='px-2 font-bold py-1 '>{session?.user.name}</span>
        </div>
      </div>
    </Layout>
  )
}
