import { connectDB } from '@/lib/mongoose'
import { Product } from '@/models/Product'

export const getAllProducts = async () => {
  await connectDB()
  const allProducts = await Product.find({})
  return allProducts
}
export default async function handler(req, res) {
  if (req.method == 'GET') {
    await connectDB()
    if (req.query.id) {
      try {
        const { id } = req.query

        const singleProductNeeded = await Product.findById(id)
        return res.status(200).json(singleProductNeeded)
      } catch (error) {
        console.log(error)
        throw error
      }
    }
  }
  if (req.method === 'POST') {
    const { title, description, price, images } = req.body
    console.log(images)
    await connectDB()
    try {
      const newProd = await Product.create({
        title,
        description,
        price,
        images: images,
      })
      return res.status(201).json({ message: 'Product Created', newProd })
    } catch (error) {
      console.error(error)
    }
  }
  if (req.method === 'PUT') {
    try {
      const { _id, title, description, price, images } = req.body
      const singleProduct = await Product.findById(_id)
      singleProduct.title = title
      singleProduct.price = price
      singleProduct.description = description
      singleProduct.images = images
      await singleProduct.save()
      return res.status(200).json(singleProduct)
    } catch (error) {
      console.log(error)
      throw error
    }
  }
  if (req.method === 'DELETE') {
    const { id } = req.query
    try {
      const deletedProduct = await Product.findByIdAndDelete(id)
      return res.status(200).json({ message: 'product deleted successfully' })
    } catch (error) {
      console.log(error)
      throw error
    }
  }
}
