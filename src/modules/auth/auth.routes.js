import express from 'express'
import {  protectedRoutes,  signIn, signOut} from './auth.controller.js'


const authRoutes = express.Router()

authRoutes.post('/signin', signIn)

authRoutes.get('/signout/:id', protectedRoutes, signOut)


export default authRoutes
