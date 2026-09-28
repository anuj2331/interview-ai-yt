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

    const PORT = process.env.PORT || 3000
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`)
    })
}

startServer()