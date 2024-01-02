import dotenv from 'dotenv'
dotenv.config({})
import express from 'express'
import { dbConnection } from './database/dbConnection.js'
import { allRoutes } from './src/modules/index.js'
import morgan from 'morgan'
import cors from 'cors'

const app = express()
const port = 3000

app.use(express.json())
app.use(cors())
app.use(express.static("uploads"))
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))

allRoutes(app)
dbConnection()

app.listen(port, () => console.log(`Example app listening on port ${port}!`))