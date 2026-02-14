import express from 'express'

const router = express.Router();


import {addBook, deleteBook, editBook, showBooks, showBooksId} from '../controllers/bookController.js';
import authenticateToken from '../middleware/auth.js';

router.post('/', authenticateToken,addBook);
router.get('/', authenticateToken, showBooks);
router.put('/:id', authenticateToken, editBook);
router.get('/:id', authenticateToken, showBooksId);
router.delete('/:id', authenticateToken, deleteBook);


export default router;