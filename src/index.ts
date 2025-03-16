import express, {Request, Response } from "express";
import router from "./routes/masterRoute";
import dotenv from 'dotenv'

const app = express(); // Use `app`, not `apps`
const PORT = 8083; // Define a port

app.use(express.json());
dotenv.config()

app.use(router)

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
