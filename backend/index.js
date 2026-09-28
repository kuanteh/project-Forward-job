const express = require('express')
/* 
express() is Create a Backend Server Application save in variable call "app"
Example : app.get() , app.post() ,app.use() , app.listen()
*/
const app = express()
const mongoose = require('mongoose')
const cors = require('cors')
// import routes ( when Frontend request any API , should 执行什么)
const userRoutes = require("./routes/userRoute")
const inboxRoutes = require("./routes/inboxRoute")
const attendanceRoutes = require("./routes/attendanceRoute")
const missionRoutes = require("./routes/missionRoute")

/* 
    load the ".env" file 
    就可以用：
    - process.env.PORT
    - process.env.MONGODB_URI
*/
require("dotenv").config()

// use postman to test the api
const corsHandler = cors({
    origin: "*",
    methods: "GET,POST,PUT,DELETE,PATCH",
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 200,
    preflightContinue: true
})

app.use(corsHandler)

// connect to mongodb
mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("MongoDB Connected")
    })
    .catch(err => console.log(err))

// test route
app.get("/", (req, res) => {
    res.json({ message: "Forward Job API is running" })
})

// use routes
app.use("/users", userRoutes)
app.use("/inbox", inboxRoutes)
app.use("/attendance", attendanceRoutes)
app.use("/missions", missionRoutes)

// start the server
const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`)
})
