import express from 'express';
import {
  getUserDocuments,
  createDocument,
  getDocumentById,
  updateDocument,
  shareDocument,
} from '../controllers/documentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply auth middleware to all document routes
router.use(protect);

router.route('/')
  .get(getUserDocuments)
  .post(createDocument);

router.route('/:id')
  .get(getDocumentById)
  .put(updateDocument);

router.route('/:id/share')
  .post(shareDocument);

export default router;
