import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProject, clearCurrentProject } from '../redux/slices/projectSlice';
import { getTasks, clearTaskError } from '../redux/slices/taskSlice';
import { ArrowLeft, Calendar, User, Plus, Users } from 'lucide-react';
import KanbanBoard from '../components/KanbanBoard';
import CreateTaskModal from '../components/CreateTaskModal';
import TaskDetailsModal from '../components/TaskDetailsModal';
import AddMemberModal from '../components/AddMembersModal';
import ProjectAnalytics from '../components/ProjectAnalytics';
import { toast } from 'react-hot-toast';

const ProjectDetails = () => {
    const { id } = useParams();
    const dispatch = useDispatch();

    const { project, loading: projectLoading, error: projectError } =
        useSelector((state) => state.projects);

    const { tasks, loading: taskLoading, error: taskError } =
        useSelector((state) => state.tasks);

    const { user } = useSelector((state) => state.auth); // assuming you store logged in user

    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);

    useEffect(() => {
        dispatch(getProject(id));
        dispatch(getTasks(id));
        return () => {
            dispatch(clearCurrentProject());
        };
    }, [dispatch, id]);

    useEffect(() => {
        if (taskError) {
            toast.error(taskError);
            dispatch(clearTaskError());
        }
    }, [taskError, dispatch]);

    if (projectLoading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
                Loading...
            </div>
        );
    }

    if (projectError) {
        return (
            <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white">
                <p className="text-red-500 mb-4">{projectError}</p>
                <Link to="/dashboard" className="text-blue-400 hover:underline">
                    Back to Dashboard
                </Link>
            </div>
        );
    }

    if (!project) return null;

    const isOwner = user?._id === project.owner?._id;

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <Link
                        to="/dashboard"
                        className="flex items-center text-gray-400 hover:text-white transition"
                    >
                        <ArrowLeft size={20} className="mr-2" />
                        Back to Dashboard
                    </Link>
                </div>

                {/* Project Info */}
                <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 shadow-xl mb-8">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-2">
                                {project.title}
                            </h1>
                            <p className="text-gray-400 max-w-2xl">
                                {project.description}
                            </p>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-500 bg-gray-900/50 px-3 py-1.5 rounded-lg border border-gray-700">
                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                            <span>Active Project</span>
                        </div>
                    </div>

                    <div className="flex items-center space-x-6 mt-6 pt-6 border-t border-gray-700 text-sm text-gray-400">
                        <div className="flex items-center space-x-2">
                            <User size={16} />
                            <span>
                                Owner:{' '}
                                <span className="text-white font-medium">
                                    {project.owner?.username}
                                </span>
                            </span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Calendar size={16} />
                            <span>
                                Created:{' '}
                                {new Date(project.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                    </div>

                    {/* Members Section */}
                    <div className="mt-6 pt-6 border-t border-gray-700">
                        <div className="flex justify-between items-center mb-3">
                            <div className="flex items-center space-x-2 text-white font-medium">
                                <Users size={18} />
                                <span>Team Members</span>
                            </div>

                            {isOwner && (
                                <button
                                    onClick={() => setIsMemberModalOpen(true)}
                                    className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-lg text-sm"
                                >
                                    + Add Member
                                </button>
                            )}
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <div className="bg-gray-700 px-3 py-1 rounded-lg text-sm">
                                {project.owner?.username} (Owner)
                            </div>

                            {project.members?.map((member) => (
                                <div
                                    key={member._id}
                                    className="bg-gray-700 px-3 py-1 rounded-lg text-sm"
                                >
                                    {member.username}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Analytics */}
                <ProjectAnalytics tasks={tasks} />

                {/* Kanban Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-white">Task Board</h2>
                    <button
                        onClick={() => setIsTaskModalOpen(true)}
                        className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition shadow-lg shadow-blue-600/20"
                    >
                        <Plus size={20} />
                        <span>Add Task</span>
                    </button>
                </div>

                {/* Kanban */}
                {taskLoading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                ) : (
                    <KanbanBoard tasks={tasks} onTaskClick={setSelectedTask} />
                )}
            </div>

            {/* Create Task Modal */}
            {isTaskModalOpen && (
                <CreateTaskModal
                    projectId={project._id}
                    projectMembers={[
                        project.owner,
                        ...(project.members || [])
                    ]}
                    onClose={() => setIsTaskModalOpen(false)}
                />
            )}

            {/* Task Details Modal */}
            {selectedTask && (
                <TaskDetailsModal
                    task={selectedTask}
                    onClose={() => setSelectedTask(null)}
                />
            )}

            {/* Add Member Modal */}
            {isMemberModalOpen && (
                <AddMemberModal
                    projectId={project._id}
                    onClose={() => setIsMemberModalOpen(false)}
                />
            )}
        </div>
    );
};

export default ProjectDetails;
