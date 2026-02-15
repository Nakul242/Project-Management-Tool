import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProjects, clearProjectError } from '../redux/slices/projectSlice';
import { logout } from '../redux/slices/authSlice';
import { Plus, LogOut, Layout } from 'lucide-react';
import ProjectCard from '../components/ProjectCard';
import CreateProjectModal from '../components/CreateProjectModal';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { projects, loading, error } = useSelector((state) => state.projects);
    const { user } = useSelector((state) => state.auth);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        dispatch(getProjects());
    }, [dispatch]);

    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch(clearProjectError());
        }
    }, [error, dispatch]);

    const handleLogout = async () => {
        await dispatch(logout());
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100">
            {/* Header */}
            <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-600 rounded-lg">
                            <Layout className="text-white" size={20} />
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                            TaskFlow
                        </span>
                    </div>

                    <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-3">
                            <img
                                src={user?.avatar}
                                alt="User"
                                className="w-8 h-8 rounded-full border border-gray-600"
                            />
                            <span className="text-sm font-medium text-gray-300 hidden sm:block">
                                {user?.username}
                            </span>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="p-2 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white transition"
                            title="Logout"
                        >
                            <LogOut size={20} />
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-white mb-1">Projects</h1>
                        <p className="text-gray-400 text-sm">Manage your team projects and tasks</p>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition shadow-lg shadow-blue-600/20"
                    >
                        <Plus size={20} />
                        <span>New Project</span>
                    </button>
                </div>

                {loading && projects.length === 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map((n) => (
                            <div key={n} className="bg-gray-800 h-48 rounded-xl animate-pulse"></div>
                        ))}
                    </div>
                ) : projects.length === 0 ? (
                    <div className="text-center py-20 bg-gray-800/50 rounded-2xl border border-gray-700/50 border-dashed">
                        <div className="bg-gray-800 p-4 rounded-full inline-block mb-4">
                            <Layout size={32} className="text-gray-500" />
                        </div>
                        <h3 className="text-lg font-medium text-white mb-2">No projects yet</h3>
                        <p className="text-gray-400 mb-6 max-w-sm mx-auto">Get started by creating your first project to organize tasks and collaborate with your team.</p>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="text-blue-400 hover:text-blue-300 font-medium"
                        >
                            Create a project &rarr;
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.map((project) => (
                            <ProjectCard key={project._id} project={project} />
                        ))}
                    </div>
                )}
            </main>

            {/* Create Project Modal */}
            {isModalOpen && <CreateProjectModal onClose={() => setIsModalOpen(false)} />}
        </div>
    );
};

export default Dashboard;
