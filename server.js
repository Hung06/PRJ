const express = require("express");
const server = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const dotenv = require("dotenv");

const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./config/swagger-config");

dotenv.config();
const PORT = process.env.PORT;

// import routes
const userRoutes = require("./routes/user.routes");
const projectRoutes = require("./routes/project.routes");
const authRoutes = require("./routes/auth.routes");

server.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));
server.use(morgan("dev"));
server.use(express.static("public"));
// swaggerDef.js hoặc trong setup swagger-jsdoc
const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "API Documentation",
    version: "1.0.0",
    description: "This is the API documentation",
  },
  components: {
    securitySchemes: {
      BearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  security: [
    {
      BearerAuth: [],
    },
  ],
};

module.exports = swaggerDefinition;

// Routes
server.use("/users", userRoutes);
server.use("/projects", projectRoutes);
server.use("/auth", authRoutes);

/**
 * @openapi
 * /:
 *   get:
 *     description: Introduction
 *     responses:
 *       200:
 *         description: "Hello world !!!!"
 */
server.get("/", (req, res) => {
  res.json({
    message: "Hello world !!!!",
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
