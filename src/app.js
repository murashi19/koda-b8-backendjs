import express from "express";

import authRoute from "./routes/authRoute.js";
import UserProfileRoute from "./routes/userProfileRoute.js";
import corsMiddleware from "./middleware/cors.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded());
app.use(corsMiddleware);

app.use("/auth", authRoute);
app.use("/profile", UserProfileRoute);

export default app;
