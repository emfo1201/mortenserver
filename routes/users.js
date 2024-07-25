// users.js
import express from 'express';
import { validateToken, signup, signin } from '../controllers/user.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

router.get('/validateToken', validateToken)
router.post('/signin', signin);
router.post('/signup', signup);

// Endpoints som kräver autentisering
router.get('/secure-data', authMiddleware, (req, res) => {
  // Koden här kräver att användaren är inloggad
  res.json({ message: 'This is secure data.' });
});

export default router;
