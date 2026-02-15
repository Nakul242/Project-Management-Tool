import { Link } from 'react-router-dom';
import { Calendar, User } from 'lucide-react';

const ProjectCard = ({ project }) => {
    return (
        <Link to={`/project/${project._id}`} className="block group">
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-blue-500 transition duration-300 hover:shadow-lg hover:shadow-blue-500/10 h-full flex flex-col">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold text-white group-hover:text-blue-400 transition">
                        {project.title}
                    </h3>
                    <span className="px-2 py-1 text-xs font-medium bg-blue-900/30 text-blue-400 rounded-full border border-blue-800">
                        Active
                    </span>
                </div>

                <p className="text-gray-400 text-sm mb-6 line-clamp-2 flex-grow">
                    {project.description}
                </p>

                <div className="flex items-center justify-between text-xs text-gray-500 mt-auto pt-4 border-t border-gray-700">
                    <div className="flex items-center space-x-2">
                        <User size={14} />
                        <span>{project.owner?.username || 'Owner'}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Calendar size={14} />
                        <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default ProjectCard;
