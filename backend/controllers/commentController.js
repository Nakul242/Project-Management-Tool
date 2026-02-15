const Comment = require('../models/Comment');
const Task = require('../models/Task');
const Project = require('../models/Project');

// @desc    Get comments for a task
// @route   GET /api/tasks/:taskId/comments
// @access  Private
exports.getComments = async (req, res) => {
    try {
        const comments = await Comment.find({ task: req.params.taskId })
            .populate('user', 'username avatar')
            .sort('-createdAt'); // Newest first

        res.status(200).json({
            success: true,
            count: comments.length,
            data: comments
        });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Add comment to task
// @route   POST /api/tasks/:taskId/comments
// @access  Private
exports.addComment = async (req, res) => {
    try {
        req.body.task = req.params.taskId;
        req.body.user = req.user.id;

        const task = await Task.findById(req.params.taskId);

        if (!task) {
            return res.status(404).json({ success: false, error: 'Task not found' });
        }

        // Verify project access
        const project = await Project.findById(task.project);
        const isMember = project.members.some(member => member.toString() === req.user.id);
        const isOwner = project.owner.toString() === req.user.id;

        if (!isOwner && !isMember) {
            return res.status(401).json({ success: false, error: 'Not authorized' });
        }

        const comment = await Comment.create(req.body);

        const populatedComment = await Comment.findById(comment._id).populate('user', 'username avatar');

        res.status(201).json({
            success: true,
            data: populatedComment
        });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Delete comment
// @route   DELETE /api/comments/:id
// @access  Private
exports.deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);

        if (!comment) {
            return res.status(404).json({ success: false, error: 'Comment not found' });
        }

        // Ensure user owns the comment
        if (comment.user.toString() !== req.user.id) {
            return res.status(401).json({ success: false, error: 'Not authorized to delete this comment' });
        }

        await comment.deleteOne();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};
