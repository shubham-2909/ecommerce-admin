import { connectDB } from '@/lib/mongoose'
import { Category } from '@/models/Category'
import { isAdmin } from './auth/[...nextauth]'

export default async function handler(req, res) {
  const { method } = req
  await connectDB()
  await isAdmin(req, res)
  if (method === 'GET') {
    const categories = await Category.find().populate('parent')
    res.status(200).json(categories)
  }
  if (method === 'POST') {
    let newCategoryDoc
    try {
      const { name, parent, properties } = req.body
      if (parent !== '') {
        newCategoryDoc = await Category.create({ name, parent, properties })
      } else {
        newCategoryDoc = await Category.create({ name, properties })
      }
      res.status(201).json(newCategoryDoc)
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  if (method === 'PUT') {
    const { _id, name, parent, properties } = req.body
    try {
      const categoryToUpdate = await Category.findById(_id)
      categoryToUpdate.name = name
      categoryToUpdate.properties = properties
      if (parent !== '') {
        categoryToUpdate.parent = parent
      } else {
        categoryToUpdate.parent = undefined
      }
      await categoryToUpdate.save()
      res
        .status(200)
        .json({ message: 'Updated Successfully' }, categoryToUpdate)
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  if (method === 'DELETE') {
    const { id } = req.query
    try {
      const deletedCategory = await Category.findByIdAndDelete(id)
      res.status(200).json({ message: 'Deleted successfully', deletedCategory })
    } catch (error) {
      console.log(error)
      throw error
    }
  }
}
