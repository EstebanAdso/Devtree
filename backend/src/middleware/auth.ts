import type {Request, Response, NextFunction} from 'express'
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';


declare global{
    namespace Express{
        interface Request {
            user?: IUser
        }
    }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Obtener el token desde la cabecera Authorization
        const bearer = req.headers.authorization;

        if (!bearer || !bearer.startsWith("Bearer ")) {
            const error = new Error('No autenticado')
            res.status(401).json({ error: error.message });
            return;
        }

        // Extraer solo el token
        const token = bearer.split(" ")[1];

        if (!token) {
            const error = new Error("Token no válido")
            res.status(401).json({ error: error.message  });
            return;
        }
        try {
            const result = jwt.verify(token, process.env.JWT_SECRET)
            if(typeof result === 'object' && result.id){
                const user =  (await User.findById(result.id).select('-password'))
                if(!user){
                    const error = new Error("El usuario no existe")
                    res.status(404).json({ error: error.message });
                    return;
                }
                req.user = user
                next() //para que siga con la funcion.
                return 

            }
        } catch (error) {
            const error2 = new Error("Token no válido")
            res.status(500).json({error: error2.message})
            return
        }

        console.log("Token:", token);

        res.send("Mensaje registrado en la consola");
    } catch (error) {
        const error3 = new Error("Error interno del servidor")
        res.status(500).json({ error: error3.message });
        return
    }
}
