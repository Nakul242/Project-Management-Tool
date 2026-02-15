const express = require('express');
const {
    getProjects,
    getProject,
    createProject,
    updateProject,
    deleteProject,
    addMember
} = require('../controllers/projectController');

const { protect } = require('../middlewares/authMiddleware');
const taskRouter = require('./taskRoutes');

const router = express.Router();

router.use(protect);

// Task nested routes
router.use('/:projectId/tasks', taskRouter);

router
    .route('/')
    .get(getProjects)
    .post(createProject);

router
    .route('/:id')
    .get(getProject)
    .put(updateProject)
    .delete(deleteProject);

// Add Member Route
router.put('/:id/add-member', addMember);

module.exports = router;
