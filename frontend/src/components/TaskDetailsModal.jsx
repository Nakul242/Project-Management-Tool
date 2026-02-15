import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getComments, addComment, deleteComment, clearComments } from '../redux/slices/commentSlice';
import { X, Send, Trash2, User, Clock, Flag, Layout } from 'lucide-react';
import { toast } from 'react-hot-toast';

const TaskDetailsModal = ({ task, onClose }) => {
    const [newComment, setNewComment] = useState('');
    const dispatch = useDispatch();
    const { comments, loading } = useSelector((state) => state.comments);
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        if (task?._id) {
            dispatch(getComments(task._id));
        }
        return () => {
            dispatch(clearComments());
        };
    }, [dispatch, task]);

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            await dispatch(addComment({ taskId: task._id, text: newComment })).unwrap();
            setNewComment('');
            toast.success('Comment posted');
        } catch (err) {
            toast.error('Failed to post comment');
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (window.confirm('Delete this comment?')) {
            try {
                await dispatch(deleteComment(commentId)).unwrap();
                toast.success('Comment deleted');
            } catch (err) {
                toast.error('Failed to delete comment');
            }
        }
    };

    if (!task) return null;

    const priorities = {
        'Low': 'text-green-400 bg-green-500/10 border-green-500/20',
        'Medium': 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
        'High': 'text-red-400 bg-red-500/10 border-red-500/20'
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl border border-gray-700 animate-fade-in flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="flex justify-between items-start p-6 border-b border-gray-700">
                    <div className="flex-1 mr-4">
                        <div className="flex items-center space-x-3 mb-2">
                            <span className={`text-xs px-2 py-0.5 rounded border ${priorities[task.priority]}`}>
                                {task.priority}
                            </span>
                            <span className="text-xs px-2 py-0.5 rounded border border-gray-600 bg-gray-700 text-gray-300">
                                {task.status}
                            </span>
                        </div>
                        <h2 className="text-2xl font-bold text-white break-words">{task.title}</h2>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition">
                        <X size={24} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    {/* Description */}
                    <div className="mb-8">
                        <h3 className="text-sm font-semibold text-gray-400 mb-2 flex items-center">
                            <Layout size={16} className="mr-2" /> Description
                        </h3>
                        <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700/50 text-gray-300 whitespace-pre-wrap">
                            {task.description || <span className="text-gray-500 italic">No description provided.</span>}
                        </div>
                    </div>

                    {/* Meta Info */}
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div>
                            <h3 className="text-sm font-semibold text-gray-400 mb-1">Assignee</h3>
                            <div className="flex items-center space-x-2 text-white">
                                <User size={16} />
                                <span>{task.assignedTo?.username || 'Unassigned'}</span>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-gray-400 mb-1">Created</h3>
                            <div className="flex items-center space-x-2 text-white">
                                <Clock size={16} />
                                <span>{new Date(task.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>

                    {/* Comments Section */}
                    <div>
                        <h3 className="text-lg font-bold text-white mb-4">Comments</h3>

                        {/* Comment Input */}
                        <form onSubmit={handleAddComment} className="mb-6 relative">
                            <input
                                type="text"
                                className="w-full pl-4 pr-12 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                                placeholder="Write a comment..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                            />
                            <button
                                type="submit"
                                disabled={!newComment.trim()}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md disabled:opacity-50 disabled:bg-transparent disabled:text-gray-500 transition"
                            >
                                <Send size={16} />
                            </button>
                        </form>

                        {/* Comments List */}
                        <div className="space-y-4">
                            {loading ? (
                                <div className="text-center py-4 text-gray-500">Loading comments...</div>
                            ) : comments.length === 0 ? (
                                <div className="text-center py-4 text-gray-600 italic">No comments yet.</div>
                            ) : (
                                comments.map(comment => (
                                    <div key={comment._id} className="flex space-x-3">
                                        <img
                                            src={comment.user?.avatar}
                                            alt={comment.user?.username}
                                            className="w-8 h-8 rounded-full border border-gray-600 mt-1"
                                        />
                                        <div className="flex-1 bg-gray-700/50 rounded-lg p-3 border border-gray-700">
                                            <div className="flex justify-between items-start mb-1">
                                                <span className="font-semibold text-white text-sm">
                                                    {comment.user?.username}
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    {new Date(comment.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <p className="text-gray-300 text-sm whitespace-pre-wrap">{comment.text}</p>

                                            {user?.id === comment.user?._id && (
                                                <div className="flex justify-end mt-2">
                                                    <button
                                                        onClick={() => handleDeleteComment(comment._id)}
                                                        className="text-gray-500 hover:text-red-400 transition"
                                                        title="Delete comment"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskDetailsModal;
