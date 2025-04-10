import { CorsOptions } from "cors";

export const corsConfig: CorsOptions = {
    origin: function (origin, callback) {
        const whiteList = [
            process.env.FRONTED_URL,
            "http://localhost:5174", 
        ];

        // Para permitir conexiones desde Postman o Thunder Client
        if (process.argv[2] === '--api') {
            whiteList.push(undefined);
        }

        // Verifica si el origen está en la lista blanca o si es undefined (Postman)
        if (whiteList.includes(origin) || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Error de CORS')); 
        }
    },
};