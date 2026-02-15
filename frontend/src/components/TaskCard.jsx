import { useDispatch } from 'react-redux';
import { updateTask, deleteTask } from '../redux/slices/taskSlice';
import { toast } from 'react-hot-toast';
import { FaUser } from 'react-icons/fa';

const TaskCard = ({ task, onClick }) => {
    const dispatch = useDispatch();

    const priorities = {
        'Low': 'bg-green-500/10 text-green-400 border-green-500/20',
        'Medium': 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
        'High': 'bg-red-500/10 text-red-400 border-red-500/20'
    };

    const handleStatusChange = async (newStatus) => {
        try {
            await dispatch(
                updateTask({ taskId: task._id, taskData: { status: newStatus } })
            ).unwrap();
        } catch (err) {
            toast.error('Failed to move task');
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            try {
                await dispatch(deleteTask(task._id)).unwrap();
                toast.success('Task deleted');
            } catch (err) {
                toast.error('Failed to delete task');
            }
        }
    };

    return (
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 shadow-sm hover:border-gray-600 transition group relative">
            <button
                onClick={handleDelete}
                className="absolute top-2 right-2 text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition"
                title="Delete Task"
            >
                &times;
            </button>

            {/* Clickable Area */}
            <div className="cursor-pointer" onClick={() => onClick(task)}>
                <div className="flex justify-between items-start mb-2">
                    <span className={`text-xs px-2 py-0.5 rounded border ${priorities[task.priority]}`}>
                        {task.priority}
                    </span>
                </div>

                <h4 className="text-white font-medium mb-2">{task.title}</h4>

                {task.description && (
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                        {task.description}
                    </p>
                )}

                <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-700">
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <FaUser size={14} />
                        <span>{task.assignedTo?.username || 'Unassigned'}</span>
                    </div>
                </div>
            </div>

            {/* Move Buttons */}
            <div className="flex justify-between mt-3 pt-2 text-xs relative z-10">
                {task.status !== 'To Do' && (
                    <button
                        onClick={() => handleStatusChange('To Do')}
                        className="text-gray-400 hover:text-white"
                    >
                        &larr; To Do
                    </button>
                )}

                {task.status === 'To Do' && (
                    <button
                        onClick={() => handleStatusChange('In Progress')}
                        className="text-blue-400 hover:text-blue-300 ml-auto"
                    >
                        Start &rarr;
                    </button>
                )}

                {task.status === 'In Progress' && (
                    <>
                        <button
                            onClick={() => handleStatusChange('To Do')}
                            className="text-gray-400 hover:text-white"
                        >
                            &larr; Back
                        </button>

                        <button
                            onClick={() => handleStatusChange('Done')}
                            className="text-green-400 hover:text-green-300"
                        >
                            Done &rarr;
                        </button>
                    </>
                )}

                {task.status === 'Done' && (
                    <button
                        onClick={() => handleStatusChange('In Progress')}
                        className="text-gray-400 hover:text-white mr-auto"
                    >
                        &larr; Reopen
                    </button>
                )}
            </div>
        </div>
    );
};

export default TaskCard;
