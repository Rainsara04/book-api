import express from 'express'

const router = express.Router();


import {addBook, deleteBook, editBook, showBooks, showBooksId} from '../controllers/bookController.js';

router.post('/', addBook);
router.delete('/:id', deleteBook);
router.get('/', showBooks);
router.put('/:id', editBook);
router.get('/:id', showBooksId);

export default router;