const express = require('express');
const {
    getTasks,
    createTask,
    updateTask,
    deleteTask
} = require('../controllers/taskController');

const { protect } = require('../middlewares/authMiddleware');

const commentRouter = require('./commentRoutes');

const router = express.Router({ mergeParams: true }); // Enable merging params from parent router

// Re-route into other resource routers
router.use('/:taskId/comments', commentRouter);

router.use(protect);

router
    .route('/')
    .get(getTasks)
    .post(createTask);

router
    .route('/:id')
    .put(updateTask)
    .delete(deleteTask);

module.exports = router;
