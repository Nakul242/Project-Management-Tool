import { CheckCircle, Clock, ListTodo, AlertTriangle } from 'lucide-react';

const ProjectAnalytics = ({ tasks }) => {
    const total = tasks.length;

    const completed = tasks.filter(task => task.status === 'Done').length;
    const inProgress = tasks.filter(task => task.status === 'In Progress').length;
    const todo = tasks.filter(task => task.status === 'To Do').length;

    const overdue = tasks.filter(task =>
        task.dueDate &&
        new Date(task.dueDate) < new Date() &&
        task.status !== 'Done'
    ).length;

    const completionRate = total === 0 ? 0 : Math.round((completed / total) * 100);

    const statCard = (icon, label, value, color) => (
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-5 flex items-center justify-between shadow-lg">
            <div>
                <p className="text-gray-400 text-sm">{label}</p>
                <h3 className="text-2xl font-bold text-white mt-1">{value}</h3>
            </div>
            <div className={`p-3 rounded-lg ${color}`}>
                {icon}
            </div>
        </div>
    );

    return (
        <div className="mb-10">

            <h2 className="text-xl font-bold text-white mb-6">
                Project Analytics
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">

                {statCard(<ListTodo size={22} />, "Total Tasks", total, "bg-blue-600/20 text-blue-400")}
                {statCard(<CheckCircle size={22} />, "Completed", completed, "bg-green-600/20 text-green-400")}
                {statCard(<Clock size={22} />, "In Progress", inProgress, "bg-yellow-600/20 text-yellow-400")}
                {statCard(<AlertTriangle size={22} />, "Overdue", overdue, "bg-red-600/20 text-red-400")}
                {statCard(<ListTodo size={22} />, "To Do", todo, "bg-purple-600/20 text-purple-400")}

            </div>

            {/* Progress Bar */}
            <div className="mt-8 bg-gray-800 border border-gray-700 rounded-xl p-6">
                <div className="flex justify-between items-center mb-3">
                    <span className="text-gray-400 text-sm">Completion Progress</span>
                    <span className="text-white font-semibold">{completionRate}%</span>
                </div>

                <div className="w-full bg-gray-700 rounded-full h-3">
                    <div
                        className="bg-green-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${completionRate}%` }}
                    ></div>
                </div>
            </div>

        </div>
    );
};

export default ProjectAnalytics;
