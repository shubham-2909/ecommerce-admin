import Layout from '@/components/Layout'
import Link from 'next/link'
import { getAllProducts } from './api/products'
import { useState } from 'react'
import axios from 'axios'
import Loader from '@/components/Loader'
export default function Products({ products }) {
  const [isLoading, setLoading] = useState(false)
  const [newProducts, setNewProducts] = useState(products)
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product')) {
      setLoading(true)
      try {
        await axios.delete(`/api/products?id=${id}`)
        const updatedProducts = newProducts.filter(
          (product) => product._id !== id
        )
        setNewProducts(updatedProducts)
      } catch (error) {
        console.log(error)
      }

      setLoading(false)
    }
  }
  return (
    <Layout>
      {isLoading && (
        <div className='flex justify-center items-center w-full h-full'>
          <Loader />
        </div>
      )}
      <section className='w-full px-4'>
        <div className='flex justify-center flex-col gap-2'>
          <div className='flex justify-between items-center'>
            <h1 className=' text-blue-900 text-[2rem] p-3 justify-self-start ml-5  text-center '>
              All Products
            </h1>
            <Link
              href={`/products/new`}
              className='bg-blue-900 text-white px-3 py-1 rounded-md  transition-all duration-300 ease-linear hover:bg-blue-700'
            >
              Add New Product
            </Link>
          </div>
          <div className='flex justify-start items-center  w-[80vw] '>
            {products.length === 0 && (
              <h1 className='text-center text-gray-500 text-[2rem] p-3 ml-5'>
                No products added Please add Products to view here
              </h1>
            )}
            {products.length > 0 && (
              <table className=' p-3 w-[70vw] mt-4 ml-5'>
                <thead className='text-gray-500  transition-all duration-200 ease-linear hover:bg-gray-400 hover:text-white font-semibold '>
                  <tr>
                    <td className='p-2'>Product Name</td>
                    <td className='p-2'>Edit or Delete</td>
                  </tr>
                </thead>
                <tbody>
                  {newProducts.map((product) => {
                    return (
                      <tr
                        key={product._id}
                        className='text-gray-800  transition-all duration-200 ease-linear hover:bg-gray-400 hover:text-white '
                      >
                        <td className='p-2'>{product.title}</td>
                        <td className='p-2'>
                          {' '}
                          <Link
                            href={`/products/edit/${product._id}`}
                            className='bg-blue-900 text-white px-3 py-1 rounded-md '
                          >
                            Edit Product
                          </Link>
                          <button
                            className='bg-blue-900 text-white px-3 py-1 rounded-md ml-2'
                            onClick={() => handleDelete(product._id)}
                          >
                            Delete Product
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </section>
    </Layout>
  )
}

export async function getServerSideProps() {
  const allProducts = await getAllProducts()
  const newProducts = allProducts.map((product) => {
    const { title, description, price, _id } = product
    const newId = _id.toString()
    return { title, description, price, _id: newId }
  })
  return { props: { products: newProducts } }
}
