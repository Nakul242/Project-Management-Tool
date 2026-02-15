const Task = require('../models/Task');
const Project = require('../models/Project');

// @desc    Get tasks for a project
// @route   GET /api/projects/:projectId/tasks
// @access  Private
exports.getTasks = async (req, res) => {
    try {
        const project = await Project.findById(req.params.projectId);

        if (!project) {
            return res.status(404).json({ success: false, error: 'Project not found' });
        }

        // Check if user is member/owner
        const isMember = project.members.some(member => member.toString() === req.user.id);
        const isOwner = project.owner.toString() === req.user.id;

        if (!isOwner && !isMember) {
            return res.status(401).json({ success: false, error: 'Not authorized' });
        }

        const tasks = await Task.find({ project: req.params.projectId })
            .populate('assignedTo', 'username avatar');

        res.status(200).json({
            success: true,
            count: tasks.length,
            data: tasks
        });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Add task to project
// @route   POST /api/projects/:projectId/tasks
// @access  Private
exports.createTask = async (req, res) => {
    try {
        req.body.project = req.params.projectId;

        const project = await Project.findById(req.params.projectId);

        if (!project) {
            return res.status(404).json({ success: false, error: 'Project not found' });
        }

        // Check auth
        const isMember = project.members.some(member => member.toString() === req.user.id);
        const isOwner = project.owner.toString() === req.user.id;

        if (!isOwner && !isMember) {
            return res.status(401).json({ success: false, error: 'Not authorized to add tasks to this project' });
        }

        const task = await Task.create(req.body);

        // Populate assignedTo for immediate frontend update
        const populatedTask = await Task.findById(task._id).populate('assignedTo', 'username avatar');

        res.status(201).json({
            success: true,
            data: populatedTask
        });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
exports.updateTask = async (req, res) => {
    try {
        let task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ success: false, error: 'Task not found' });
        }

        const project = await Project.findById(task.project);

        // Check auth (assuming members can update tasks)
        const isMember = project.members.some(member => member.toString() === req.user.id);
        const isOwner = project.owner.toString() === req.user.id;

        if (!isOwner && !isMember) {
            return res.status(401).json({ success: false, error: 'Not authorized' });
        }

        task = await Task.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        }).populate('assignedTo', 'username avatar');

        res.status(200).json({
            success: true,
            data: task
        });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ success: false, error: 'Task not found' });
        }

        const project = await Project.findById(task.project);

        // Check auth
        const isMember = project.members.some(member => member.toString() === req.user.id);
        const isOwner = project.owner.toString() === req.user.id;

        if (!isOwner && !isMember) {
            return res.status(401).json({ success: false, error: 'Not authorized' });
        }

        await task.deleteOne();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};
