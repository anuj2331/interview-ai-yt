const mongoose = require("mongoose")

async function connectToDB() {
    const maxRetries = 3;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            await mongoose.connect(process.env.MONGO_URI, {
                serverSelectionTimeoutMS: 15000,
                socketTimeoutMS: 45000,
            })

            console.log("Connected to Database")
            return true
        } catch (err) {
            console.error(`Database connection attempt ${attempt}/${maxRetries} failed:`, err.message)
            if (attempt < maxRetries) {
                console.log("Retrying database connection in 3 seconds...")
                await new Promise(resolve => setTimeout(resolve, 3000))
            }
        }
    }

    return false
}

module.exports = connectToDB