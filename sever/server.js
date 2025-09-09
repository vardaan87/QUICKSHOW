import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./configs/db.js";
import { clerkMiddleware } from "@clerk/express";
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js";

const app = express();

await connectDB();

// Middlewares
app.use(express.json());
app.use(cors());

app.use(clerkMiddleware());

// API Routes
app.get("/", (req, res) => {
  res.send("Hey");
});
app.use("/api/inngest", serve({ client: inngest, functions }));

app.listen(3000, () =>
  console.log("Server is listening to port http://localhost:3000")
);
