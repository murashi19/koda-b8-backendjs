import express from "express";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";

import authRoute from "./routes/authRoute.js";
import userProfileRoute from "./routes/userProfileRoute.js";
import productRoute from "./routes/productRoute.js";
import categoryRoute from "./routes/categoryRoute.js";
import tagRoute from "./routes/tagRoute.js";
import adminRoute from "./routes/dashboardRoute.js";
import wishlistRoute from "./routes/wishlistRoute.js";
import addressRoute from "./routes/addressRoute.js";
import orderRoute from "./routes/orderRoute.js";
import cartRoute from "./routes/cartRoute.js";
import userRoute from "./routes/userRoute.js";
import corsMiddleware from "./middleware/cors.js";

const app = express();
app.set("query parser", "extended");

// const BACKEND_URL = process.env.BACKEND_URL;
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Swagger Backend BeliMudah - Open API 3.0",
      version: "1.0.0",
      description: "API documentation with backend application web BeliMudah",
    },
    servers: [
      {
        url: `http://localhost:8081`,
        description: "Server Local",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./src/routes/*.js"],
};
const openapi = swaggerJSDoc(options);
app.use(express.json());
app.use(express.urlencoded());
app.use(corsMiddleware);

app.use("/docs", swaggerUI.serve, swaggerUI.setup(openapi));
app.get("/api-docs.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

app.use("/uploads", express.static("public/uploads"));

app.use("/auth", authRoute);
app.use("/profiles", userProfileRoute);
app.use("/products", productRoute);
app.use("/categories", categoryRoute);
app.use("/tags", tagRoute);
app.use("/admin", adminRoute);
app.use("/wishlist", wishlistRoute);
app.use("/addresses", addressRoute);
app.use("/orders", orderRoute);
app.use("/carts", cartRoute);

app.use("/users", userRoute);

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
