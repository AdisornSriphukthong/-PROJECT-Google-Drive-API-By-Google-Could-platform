import { Router } from "express";
import { upload } from "../../utils/storage.util";
import googleDriveApiController from "../../controllers/googleDriveApiController";

const router = Router();

router.post('/uploadFileToGoogleDrive', upload.single('file'), googleDriveApiController.uploadFileToGoogleDrive);
router.post('/getUrlImageFromGoogleDrive', googleDriveApiController.getUrlImageFromGoogleDrive);

export default router;
