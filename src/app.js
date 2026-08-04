import express from "express";

import authRoute from "./routes/authRoute.js";
import userProfileRoute from "./routes/userProfileRoute.js";
import productRoute from "./routes/productRoute.js";
import corsMiddleware from "./middleware/cors.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded());
app.use(corsMiddleware);

app.use("/uploads", express.static("public/uploads"));

app.use("/auth", authRoute);
app.use("/profiles", userProfileRoute);
app.use("/products", productRoute);

app.use((err, req, res, next) => {
  if (err) {
    console.error(err);
    return res.status(400).json({
      success: false,
      message: err.message || "Upload error",
    });
  }
  next();
});
export default app;
