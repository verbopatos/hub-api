// swagger.ts
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "VerboHub API",
      version: "1.0.0",
      description: "API documentation for VerboHub",
    },
    servers: [
      {
        url: `http://${process.env.HOST}:${process.env.PORT}/api`,
      },
    ],
  },
  apis: ["./src/routes/*.ts", "./src/controllers/*.ts"], // files containing annotations
};

const swaggerSpec = swaggerJSDoc(options);

const setupSwagger = (app: Express) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

export default setupSwagger;

// Path: src/app.ts
