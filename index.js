const express = require("express");
const dbConnect = require("./Config/dbConnetct");
const cors = require("cors");
require("dotenv").config();
const bodyParser = require("body-parser");
const { notFound, errorHandler } = require("./middlewares/errorHandle");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");

// Routers
const authRouter = require("./Routes/authRoute");
const productRouter = require("./Routes/productRoute");
const categoryRouter = require("./Routes/categoryRoute");
const blogCatRouter = require("./Routes/blogCatRouter");
const brandRouter = require("./Routes/brandRoute");
const colorRouter = require("./Routes/colorRoute");
const blogRouter = require("./Routes/blogRoute");
const cuponRouter = require("./Routes/cuponRoute");
//const enqRouter = require("./Routes/enqRoute");
const orderRouter = require("./Routes/orderRoute");

const app = express();
const PORT = process.env.PORT || 4000;

// Connect DB
dbConnect();

// CORS debe ir ANTES de las rutas
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Routes
app.use("/api/user", authRouter);
app.use("/api/product", productRouter);
app.use("/api/blog", blogRouter);
app.use("/api/product/cat", categoryRouter);
app.use("/api/blog/cat", blogCatRouter);
app.use("/api/brand", brandRouter);
app.use("/api/color", colorRouter);
app.use("/api/coupon", cuponRouter);
//app.use("/api/inquiry", enqRouter);
app.use("/api/order", orderRouter);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Error handlers
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log("Server running on PORT: " + PORT);
});
