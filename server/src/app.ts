import express from 'express'
import cors from 'cors'
import cookiesParser from 'cookie-parser'

const app = express()

// 1. Middleware 
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true
}))

app.use(express.urlencoded({ extended: true, limit: "20kb" }))
app.use(express.json())
app.use(cookiesParser())

// 2. Routes 
app.get('/', (req, res) => {
  res.json({ status: 'OK', message: 'Server is alive' })
})

// 3. Specific Routes
import interviewRoute from './routes/interview.route' 
app.use("/api/v1/pre-interview", interviewRoute)

export { app }