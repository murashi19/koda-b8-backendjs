import express from "express";

import authRoute from "./routes/authRoute.js";
import UserProfileRoute from "./routes/userProfileRoute.js";
import corsMiddleware from "./middleware/cors.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded());
app.use(corsMiddleware);

app.use("/uploads", express.static("public/uploads"));

app.use("/auth", authRoute);
app.use("/profile", UserProfileRoute);

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
