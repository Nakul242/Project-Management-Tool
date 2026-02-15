import TaskCard from './TaskCard';

const KanbanBoard = ({ tasks, onTaskClick }) => {
    const columns = {
        'To Do': tasks.filter(t => t.status === 'To Do'),
        'In Progress': tasks.filter(t => t.status === 'In Progress'),
        'Done': tasks.filter(t => t.status === 'Done'),
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 overflow-x-auto pb-4">
            {Object.entries(columns).map(([status, columnTasks]) => (
                <div key={status} className="bg-gray-800/50 rounded-xl p-4 border border-gray-700 h-fit min-h-[500px]">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-200">{status}</h3>
                        <span className="bg-gray-700 text-gray-300 px-2 py-0.5 rounded-full text-xs">
                            {columnTasks.length}
                        </span>
                    </div>

                    <div className="space-y-3">
                        {columnTasks.map(task => (
                            <TaskCard key={task._id} task={task} onClick={onTaskClick} />
                        ))}
                        {columnTasks.length === 0 && (
                            <p className="text-center text-gray-600 text-sm py-8 italic">No tasks</p>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default KanbanBoard;
