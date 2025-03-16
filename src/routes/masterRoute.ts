import { Router, Request, Response } from "express";
import serviceRouter from "./serviceRoute/serviceRoute";

const router = Router()

router.use('/googleDriveAPI/service', serviceRouter)

router.get("/", (req: Request, res: Response) => {
    res.json({
      message: "Hello, World!",
    });
  });

export default router