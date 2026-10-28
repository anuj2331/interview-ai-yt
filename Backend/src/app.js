const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        const allowed = [
            ...(process.env.FRONTEND_URL || "").split(","),
            "http://localhost:5173",
            "http://localhost:3000"
        ].map(item => item.trim().replace(/\/$/, "")).filter(Boolean);

        return callback(null, allowed.includes(origin));
    },
    credentials: true
}))

app.get("/healthz", (req, res) => {
    res.status(200).json({ status: "ok" })
})

/* require all the routes here */
const authRouter = require("./routes/auth.routes")
const interviewRouter = require("./routes/interview.routes")


/* using all the routes here */
app.use("/api/auth", authRouter)
app.use("/api/interview", interviewRouter)



module.exports = app