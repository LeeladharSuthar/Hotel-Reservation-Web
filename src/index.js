import { DB_CONNECT } from './db/index.js'
import { app } from './app.js'
import dotenv from 'dotenv'

const port = process.env.PORT || 3000

dotenv.config()

DB_CONNECT()
    .then((res) => {
        console.log(`Connection Successful: ${res.connections[0]._readyState == 1}`)

        //  uncaught error occurs within the Express application or its middleware functions, this event listener will be triggered
        app.on("error", (error) => {
            console.log("EXPRESS ERROR: ", error)
        })

        app.listen(port, () => {
            console.log(`Server Started listening at port : ${port}`)
        })
    })
    .catch((error) => {
        console.log("DB CONNECTION FAILED: ", error);
    })