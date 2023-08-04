import Layout from '@/components/Layout'
import axios from 'axios'
import { useEffect, useState } from 'react'
import Loader from '@/components/Loader'
export default function Categories() {
  const [category, setCategory] = useState('')
  const [categories, setCategories] = useState()
  const [parentCategory, setParentCategory] = useState('')
  const [isLoading, setLoading] = useState(false)
  const [editedCategory, setEditedCategory] = useState(null)
  const [properties, setProperties] = useState([])
  const fetchCategories = async () => {
    setLoading(true)
    try {
      const resp = await axios('/api/categories')
      setCategories(resp.data)
    } catch (error) {
      console.log(error)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchCategories()
  }, [])
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (editedCategory) {
      try {
        await axios.put('/api/categories', {
          name: category,
          parent: parentCategory,
          _id: editedCategory._id,
          properties: properties.map((p) => {
            return { name: p.name, values: p.values.split(',') }
          }),
        })
      } catch (error) {
        console.log(error)
      }
    } else {
      try {
        await axios.post('/api/categories', {
          name: category,
          parent: parentCategory,
          properties: properties.map((p) => {
            return { name: p.name, values: p.values.split(',') }
          }),
        })
      } catch (error) {
        console.log(error)
      }
    }
    setCategory('')
    setEditedCategory(null)
    setParentCategory('')
    setProperties([])
    fetchCategories()
  }
  const editCategory = async (categoryToedit) => {
    setEditedCategory(categoryToedit)
    setCategory(categoryToedit.name)
    setProperties(
      categoryToedit.properties.map((property) => {
        return { name: property.name, values: property.values.join(',') }
      })
    )
    if (categoryToedit.parent) {
      setParentCategory(categoryToedit.parent._id)
    } else {
      setParentCategory('')
    }
  }
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this Category?')) {
      try {
        await axios.delete(`/api/categories?id=${id}`)
      } catch (error) {
        console.log(error)
      }
      setEditedCategory(null)
      setCategory('')
      setParentCategory('')
      fetchCategories()
    }
  }

  const addProperty = () => {
    setProperties((oldproperties) => {
      return [...oldproperties, { name: '', values: '' }]
    })
  }

  const handleNameChange = (index, property, newName) => {
    setProperties((prev) => {
      const properties = [...prev]
      properties[index].name = newName
      return properties
    })
  }
  const handleValueChange = (index, property, newValue) => {
    setProperties((prev) => {
      const properties = [...prev]
      properties[index].values = newValue
      return properties
    })
  }

  const removeProperty = (index) => {
    setProperties((prev) => {
      return [...prev].filter((p, pi) => {
        return index !== pi
      })
    })
  }
  return (
    <Layout>
      <h1 className=' text-blue-900 text-[1.5rem] p-3 text-left ml-4 mb-0'>
        Categories Page
      </h1>
      <div className='mt-3 p-3'>
        <label htmlFor='category' className='ml-1 p-3 text-[1.25rem] '>
          {editedCategory
            ? `Edit Category ${editedCategory.name}`
            : 'New Category'}
        </label>
        <form onSubmit={handleSubmit} className='flex flex-col gap-1'>
          <div className='flex flex-row gap-1'>
            <input
              type='text'
              id='category'
              name='category'
              className='mb-0 w-auto'
              placeholder='Category Name'
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
            <select
              className='mb-0 ml-1 w-auto'
              value={parentCategory}
              onChange={(e) => setParentCategory(e.target.value)}
            >
              <option value='' className='p-2 flex justify-center items-center'>
                No parent Category
              </option>
              {categories?.length > 0 &&
                categories.map((singleCategory) => {
                  return (
                    <option
                      key={singleCategory._id}
                      value={singleCategory._id}
                      className='p-2 flex justify-center items-center'
                    >
                      {singleCategory.name}
                    </option>
                  )
                })}
            </select>
          </div>
          <div className='mb-2'>
            <label className='block ml-1 p-3'>Properties</label>
            <button
              type='button'
              className='bg-gray-500 rounded-md py-2 px-3 ml-3 mb-4 text-white transition-all ease-linear duration-300 hover:bg-gray-200 hover:text-gray-800'
              onClick={addProperty}
            >
              Add new Property
            </button>
            {properties.length > 0 &&
              properties.map((property, index) => {
                return (
                  <div className='flex gap-1' key={index}>
                    <input
                      type='text'
                      placeholder='property name'
                      value={property.name}
                      onChange={(e) =>
                        handleNameChange(index, property, e.target.value)
                      }
                      className='w-auto'
                    />
                    <input
                      type='text'
                      placeholder='values comma seperated'
                      value={property.values}
                      className='w-auto'
                      onChange={(e) =>
                        handleValueChange(index, property, e.target.value)
                      }
                    />
                    <button
                      type='button'
                      className='bg-gray-500 rounded-md py-2 px-3 ml-3 mb-4 text-white transition-all ease-linear duration-300 hover:bg-gray-200 hover:text-gray-800'
                      onClick={() => removeProperty(index)}
                    >
                      Remove Property
                    </button>
                  </div>
                )
              })}
          </div>
          <div className='flex gap-2 items-center'>
            <button className=' bg-blue-900  text-white rounded-md px-5 py-1 transition-all ease-linear duration-300 hover:bg-blue-500 ml-4 w-[5rem] '>
              Save
            </button>
            {editedCategory && (
              <button
                type='button'
                className='bg-gray-500 rounded-md py-1 px-5  text-white transition-all ease-linear duration-300 hover:bg-gray-200 hover:text-gray-800'
                onClick={() => {
                  setEditedCategory(null)
                  setCategory('')
                  setParentCategory('')
                  setProperties([])
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
      <div className='flex  justify-center flex-col gap-2'>
        {!editedCategory && (
          <h1 className=' text-blue-900 text-[1.75rem] p-3 text-left ml-4'>
            Categories
          </h1>
        )}
        {isLoading && (
          <div className='self-center'>
            <Loader />
          </div>
        )}
        <div className='flex justify-start items-center  w-[80vw] '>
          {categories?.length === 0 && (
            <h1 className='text-center text-gray-500 text-[1.5rem] p-3 ml-5'>
              No Categories added Please add Categories to view here
            </h1>
          )}
          {categories && categories?.length > 0 && !editedCategory && (
            <table className=' p-3 w-[70vw]  ml-5'>
              <thead className='text-gray-500  transition-all duration-200 ease-linear hover:bg-gray-400 hover:text-white font-semibold '>
                <tr>
                  <td className='p-2'>Category Name</td>
                  <td className='p-2'>Parent Category</td>
                  <td className='p-2'>Edit or Delete</td>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => {
                  return (
                    <tr
                      key={category._id}
                      className='text-gray-800  transition-all duration-200 ease-linear hover:bg-gray-400 hover:text-white '
                    >
                      <td className='p-2'>{category.name}</td>
                      <td className='p-2'>
                        {category.parent && category.parent.name}
                        {!category.parent && 'No Parent Categorty'}
                      </td>
                      <td>
                        <button
                          className='bg-blue-900 text-white px-3 py-1 rounded-md '
                          onClick={() => editCategory(category)}
                        >
                          Edit Category
                        </button>
                        <button
                          className='bg-blue-900 text-white px-3 py-1 rounded-md ml-2'
                          onClick={() => handleDelete(category._id)}
                        >
                          Delete Category
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
    </Layout>
  )
}
