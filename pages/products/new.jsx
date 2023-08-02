import Layout from '@/components/Layout'
import Loader from '@/components/Loader'
import axios from 'axios'
import { useRouter } from 'next/router'
import { useState } from 'react'
const initialState = {
  title: '',
  description: '',
  price: '',
}
export default function NewProduct() {
  const router = useRouter()
  const [product, setProduct] = useState(initialState)
  const [images, setImages] = useState([])
  const [isLoading, setLoading] = useState(false)
  const handleSubmit = async (e) => {
    e.preventDefault()
    const { title, description, price } = product
    try {
      console.log(images)
      await axios.post('/api/products', { title, description, price, images })
      router.replace('/products')
    } catch (error) {
      console.log(error)
    }
  }
  const handleChange = (e) => {
    const name = e.target.name
    const value = e.target.value
    setProduct({ ...product, [name]: value })
  }
  const uploadImages = async (e) => {
    const files = e.target?.files
    const data = new FormData()
    if (files?.length > 0) {
      setLoading(true)
      for (const file of files) {
        data.append('file', file)
      }

      const resp = await axios.post('/api/upload', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      setImages((oldImage) => {
        return [...oldImage, ...resp.data]
      })
      setLoading(false)
    }
  }

  return (
    <Layout>
      <h1 className=' text-blue-900 text-[2rem] p-3 text-left ml-1 mb-2'>
        New Product
      </h1>
      <form className='flex flex-col gap-2' onSubmit={handleSubmit}>
        <label htmlFor='name' className='ml-4 '>
          Product Name
        </label>
        <input
          type='text'
          name='title'
          id='name'
          placeholder='product name'
          className='w-auto'
          value={product.title}
          onChange={handleChange}
          required
        />
        <h4 className='ml-4'>Images</h4>
        {!images.length && (
          <div className='ml-4 mb-1'>No photos uploaded for this product</div>
        )}
        <div className='h-24 flex flex-wrap justify-start ml-4 gap-4 mb-3'>
          {images.map((image) => {
            return (
              <img
                key={image}
                src={image}
                alt='product image'
                className=' h-full inline-block object-contain'
              />
            )
          })}
          {isLoading && (
            <div className='h-24 flex items-center justify-center'>
              <Loader />
            </div>
          )}
          <label
            htmlFor='image'
            className='mb-2 w-[8rem] h-14 rounded-lg align-self-start bg-gray-300 flex justify-center items-center gap-2 p-2 text-gray-900 self-end cursor-pointer'
          >
            Upload
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={1.5}
              stroke='currentColor'
              className='w-6 h-6 cursor-pointer'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5'
              />
            </svg>
            <input
              type='file'
              className='opacity-0 absolute w-24 cursor-pointer'
              onChange={uploadImages}
            />
          </label>
        </div>

        <label htmlFor='description' className='ml-4'>
          Description
        </label>
        <textarea
          placeholder='description'
          className='w-auto'
          id='description'
          name='description'
          value={product.description}
          onChange={handleChange}
          required
        ></textarea>
        <label htmlFor='price' className='ml-4'>
          Price (In USD)
        </label>
        <input
          type='number'
          placeholder='price'
          className='w-auto'
          name='price'
          value={product.price}
          onChange={handleChange}
          required
        />
        <button className=' bg-blue-900 mr-auto ml-4  text-white rounded-md px-3 py-1 transition-all ease-linear duration-300 hover:bg-blue-500 '>
          Add Product
        </button>
      </form>
    </Layout>
  )
}
