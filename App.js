const bodyParser = require("body-parser");
const express = require("express");
var cors = require('cors');

const dbConnect = require("./config/dbConnect");
// const morgan = require('morgan')

 const userRoute = require("./routes/userRoute");
const menuRoute=require("./routes/menuRoute")
const { notFound, errorHandler } = require("./middlewares/errorHandler");



const app = express();


const dotenv = require("dotenv").config();
 const cookieParser=require("cookie-parser") ;
const PORT = 5000;
dbConnect();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use(express.json());
// app.use(morgan("dev"));
app.use("/api/user", userRoute);
app.use("/api/menu", menuRoute);
app.use('/uploads', express.static('uploads'));

app.use(notFound);
app.use(errorHandler);
app.listen(PORT, () => {
        console.log(`Server is running  at PORT ${PORT}`);
    }
  );


