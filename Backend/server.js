require("dotenv").config()
const app = require("./src/app")
const connectToDB = require("./src/config/database")

async function startServer() {
    // Wait for database connection before starting server
    const connected = await connectToDB()
    
    if (!connected) {
        console.error("Failed to connect to database. Server not started.")
        process.exit(1)
    }

    app.listen(3000, () => {
        console.log("Server is running on port 3000")
    })
}

startServer()