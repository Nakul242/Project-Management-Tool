const express = require('express');
const {
    getComments,
    addComment,
    deleteComment
} = require('../controllers/commentController');

const { protect } = require('../middlewares/authMiddleware');

const router = express.Router({ mergeParams: true });

router.use(protect);

router
    .route('/')
    .get(getComments)
    .post(addComment);

router
    .route('/:id')
    .delete(deleteComment);

module.exports = router;
