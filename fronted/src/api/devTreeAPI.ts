import { isAxiosError } from "axios";
import api from "../config/axios";
import {User } from "../types";

export async function getUser() {
    try {
        const {data} = await api<User>('/api/user')
        return data //el usuario autenticado
      } catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error)
        }
      }
    
}

export async function updateProfile(formData: User) {
  try {
      const {data} = await api.patch<string>('/api/user', formData)
      return data //el usuario autenticado
    } catch (error) {
      if(isAxiosError(error) && error.response){
        console.log(error.response.data.error)
          throw new Error(error.response.data.error)
      }
    }
  
}

export async function uploadImage(file: File) {
  let formData = new FormData()
  formData.append('file', file)
    try {
        const {data: {image}} : {data: {image:string}} = await api.post('/api/user/image', formData)
        return image //el usuario autenticado
    } catch (error) {
      if(isAxiosError(error) && error.response){
        console.log(error.response.data.error)
          throw new Error(error.response.data.error)
      }
    }
  
}
