import { Router } from 'express';
import { registerUser } from '../controllers/user.controller.js';
import { upload } from '../middlewares/multer.middleware.js';

const router = Router();

// Endpoint: http://localhost:8000/api/v1/users/register
router.route('/register').post(
  // Middleware 1: Multer handles the file incoming stream
  upload.fields([
    {
      name: 'avatar', // Must match the key in Postman/Frontend
      maxCount: 1, // Only 1 file allowed for this field
    },
    {
      name: 'coverImage', // Must match the key in Postman/Frontend
      maxCount: 1,
    },
  ]),
  // Middleware 2: Your controller handles the business logic
  registerUser
);

export default router;
