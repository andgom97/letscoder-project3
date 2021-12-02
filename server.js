require("dotenv").config();
const express = require("express")
const mongoose = require("mongoose")
const UserRouter = require("./api/UserRouter")
const port = 5000

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/api", UserRouter)


const URI = process.env.MONGODB_URL
mongoose.connect(URI, {
}).then(()=>{
    console.log("BBDD is now connected!")
}).catch(err =>{
    console.log(err);
})

app.listen(port, () => console.log(`Server is running on port ${port}`))