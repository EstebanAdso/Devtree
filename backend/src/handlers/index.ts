import User from "../models/User"
import { Request, Response } from "express"
import slug from 'slug'
import { v4 as uuid } from 'uuid'
import formidable from 'formidable'
import { checkPassword, hashPassword } from "../utils/auth"
import { generateJWT } from "../utils/jwt";
import cloudinary from "../config/clodinary"


export const createAccount = async (req: Request, res: Response)=> {
    try {
        // Encontrar emails duplicados
        const { email, password, handle } = req.body;
        const userExists = await User.findOne({ email });

        if (userExists) {
            res.status(409).json({ msg: "El correo ya está en uso." });
            return;
        }

        const handleSlug = slug(handle, '');
        const handleExists = await User.findOne({ handle: handleSlug });

        if (handleExists) {
            res.status(409).json({ msg: "El nombre de usuario ya existe" });
            return;
        }

        const user = new User({ ...req.body, handle: handleSlug });
        user.password = await hashPassword(password);

        await user.save();
        res.send('Usuario creado correctamente')
    } catch (error) {
        res.status(500).json({ msg: "Error interno del servidor", error: error.message });
    }
};


export const login = async (req: Request, res: Response) =>{

    // Encontrar Si el usuario esta registrado
    const { email, password} = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
       const error = new Error('El Usuario no existe')
       res.status(404).json({error: error.message});
       return
    }

    //Comprobar el password - password normal - password hash
    const isPasswordCorrect = await checkPassword(password, user.password)
    if (!isPasswordCorrect) {
        const error = new Error('Password incorrecto')
        res.status(401).json({error: error.message});
        return 
     }
 
     //Al pasar las validaciones generaremos un JWT
     const token = generateJWT({id: user._id})
     res.send(token)
}

export const getUser = async (req: Request, res: Response) => {
    res.json(req.user)
};


export const updateProfile = async (req: Request, res: Response) => {
    try {
        const {description, links} = req.body
        const handle = slug(req.body.handle, '')
        const handleSlug = slug(handle, '');
        const handleExists = await User.findOne({ handle: handleSlug });

        if (handleExists && handleExists.email !== req.user.email) {
            res.status(409).json({ msg: "El nombre de usuario ya existe" });
            return;
        }

        //actualizar el usuario
        req.user.description = description
        req.user.handle = handle
        req.user.links = links
        await req.user.save()
        res.send('Perfil actualizo correctamente')
    } catch (e) {
        const error = new Error('Hubo un error')
        res.status(500).json({error: error.message})
    }
};


export const uploadImage = async (req: Request, res: Response) => {
    const form = formidable({multiples: false})
    try {
        form.parse(req, (error, fields, files) =>{
            console.log(files.file[0].filepath) //ubicacion del archivo
            cloudinary.uploader.upload(files.file[0].filepath, {public_id : uuid()}, async function(error, result) {
                if(error){
                    const error = new Error('Hubo un error en la subida de la Imagen')
                    res.status(500).json({error: error.message})
                }
                if(result){
                    req.user.image = result.secure_url
                    await req.user.save()
                    res.json({image: result.secure_url})
                }
            })
        })
    } catch (e) {
        const error = new Error('Hubo un error')
        res.status(500).json({error: error.message})
    }
};