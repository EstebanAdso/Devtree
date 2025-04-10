import { Router } from "express";
import { body } from "express-validator";
import { createAccount, getUser, login, updateProfile, uploadImage } from "./handlers";
import { handleInputErrors } from "./middleware/validation";
import { authenticate } from "./middleware/auth";
const router = Router();

// Autenticacion y registro
router.post(
  "/auth/register",
  body("handle").notEmpty().withMessage("El handle no puede ir vacio"),
  body("name").notEmpty().withMessage("El nombre no puede ir vacio"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("El password es muy corto, minimo 8 caracteres"),
  body("email").isEmail().withMessage("Email no valido"),
  handleInputErrors,
  createAccount
);

router.post(
  "/auth/login",
  body("password")
    .notEmpty()
    .isLength({ min: 8 })
    .withMessage("El password es obligatorio"),
  body("email").isEmail().withMessage("Email no valido"),
  handleInputErrors,
  login
);

//Rutas autenticadas.
router.get("/user", authenticate, getUser);
router.patch('/user',
  body("handle").notEmpty().withMessage("El handle no puede ir vacio"),
  body("description").notEmpty().withMessage("La descrpción no puede ir vacio"),
  authenticate,
  updateProfile)

router.post('/user/image', authenticate, uploadImage)

export default router;
