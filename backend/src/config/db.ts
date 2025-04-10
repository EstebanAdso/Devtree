import mongoose from "mongoose";
import colors from 'colors'

export const connectDB = async () =>{
    try {
        const {connection} = await mongoose.connect(process.env.MONGO_URI)
        const url = `${connection.host}:${connection.port}`
        console.log(`MondoDB conectado en ${url}`)
    } catch (error) {
        console.log(colors.bgRed.bold(error.message))
        process.exit(1)
    }
}