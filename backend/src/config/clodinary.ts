import { v2 as cloudinary } from 'cloudinary';

// Configuración con variables de entorno
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

// Exporta SOLO la instancia configurada de Cloudinary
export default cloudinary;