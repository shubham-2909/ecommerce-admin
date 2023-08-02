import mongoose from 'mongoose'

export function connectDB() {
  const uri = process.env.MONGODB_URI
  if (mongoose.connection.readyState) {
    return mongoose.connection.asPromise()
  } else {
    return mongoose.connect(uri)
  }
}
