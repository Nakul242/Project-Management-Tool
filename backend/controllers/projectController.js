const Project = require('../models/Project');
const User = require('../models/User');

// @desc    Get all projects (that belong to user or user is a member of)
// @route   GET /api/projects
// @access  Private
exports.getProjects = async (req, res) => {
    try {
        const projects = await Project.find({
            $or: [{ owner: req.user.id }, { members: req.user.id }]
        }).populate('owner', 'username avatar');

        res.status(200).json({
            success: true,
            count: projects.length,
            data: projects
        });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Private
exports.getProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id)
            .populate('owner', 'username email avatar')
            .populate('members', 'username email avatar');

        if (!project) {
            return res.status(404).json({ success: false, error: 'Project not found' });
        }

        // Check if user is owner or member
        const isMember = project.members.some(member => member._id.toString() === req.user.id);
        const isOwner = project.owner._id.toString() === req.user.id;

        if (!isOwner && !isMember) {
            return res.status(401).json({ success: false, error: 'Not authorized to view this project' });
        }

        res.status(200).json({
            success: true,
            data: project
        });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Create new project
// @route   POST /api/projects
// @access  Private
exports.createProject = async (req, res) => {
    try {
        req.body.owner = req.user.id;

        const project = await Project.create(req.body);

        res.status(201).json({
            success: true,
            data: project
        });
    } catch (err) {
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);
            return res.status(400).json({ success: false, error: messages.join(', ') });
        }
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
exports.updateProject = async (req, res) => {
    try {
        let project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ success: false, error: 'Project not found' });
        }

        // Make sure user is project owner
        if (project.owner.toString() !== req.user.id) {
            return res.status(401).json({ success: false, error: 'Not authorized to update this project' });
        }

        project = await Project.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: project
        });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
exports.deleteProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ success: false, error: 'Project not found' });
        }

        // Make sure user is project owner
        if (project.owner.toString() !== req.user.id) {
            return res.status(401).json({ success: false, error: 'Not authorized to delete this project' });
        }

        await project.deleteOne();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Add member to project
// @route   PUT /api/projects/:id/add-member
// @access  Private (Owner only)
exports.addMember = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                error: 'Email is required'
            });
        }

        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({
                success: false,
                error: 'Project not found'
            });
        }

        // Only owner can add members
        if (project.owner.toString() !== req.user.id) {
            return res.status(401).json({
                success: false,
                error: 'Only project owner can add members'
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        // Prevent duplicates
        if (
            project.members.includes(user._id) ||
            project.owner.toString() === user._id.toString()
        ) {
            return res.status(400).json({
                success: false,
                error: 'User already part of project'
            });
        }

        project.members.push(user._id);
        await project.save();

        const updatedProject = await Project.findById(project._id)
            .populate('owner', 'username email avatar')
            .populate('members', 'username email avatar');

        res.status(200).json({
            success: true,
            data: updatedProject
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};
