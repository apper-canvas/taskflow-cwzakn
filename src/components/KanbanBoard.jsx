import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';

export default function KanbanBoard({ 
  tasks, 
  onTaskChange, 
  onEditTask, 
  onDeleteTask, 
  onToggleComplete 
}) {
  // Icons
  const Plus = getIcon('Plus');
  const Trash2 = getIcon('Trash2');
  const CheckSquare = getIcon('CheckSquare');
  const Square = getIcon('Square');
  const Clock = getIcon('Clock');
  const Edit = getIcon('Edit');
  const Flag = getIcon('Flag');
  const AlertCircle = getIcon('AlertCircle');
  const ArrowUpCircle = getIcon('ArrowUpCircle');

  // State for drag and drop
  const [draggingTask, setDraggingTask] = useState(null);
  
  // Define the columns
  const columns = [
    { id: 'todo', title: 'To Do', color: 'bg-blue-500' },
    { id: 'inprogress', title: 'In Progress', color: 'bg-amber-500' },
    { id: 'done', title: 'Done', color: 'bg-green-500' }
  ];

  // Get tasks for a specific column
  const getColumnTasks = (columnId) => {
    if (columnId === 'todo') {
      return tasks.filter(task => !task.status || task.status === 'todo');
    }
    return tasks.filter(task => task.status === columnId);
  };

  // Handler for when drag starts
  const handleDragStart = (e, task) => {
    setDraggingTask(task);
    e.dataTransfer.effectAllowed = 'move';
    e.target.classList.add('opacity-50');
    
    // This is needed to enable dragging
    e.dataTransfer.setData('text/plain', task.id);
  };

  // Handler for when drag ends
  const handleDragEnd = (e) => {
    setDraggingTask(null);
    e.target.classList.remove('opacity-50');
  };

  // Handler for when an item is dragged over a column
  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  // Handler for when an item is dropped into a column
  const handleDrop = (e, columnId) => {
    e.preventDefault();
    
    if (draggingTask) {
      const updatedTasks = tasks.map(task => 
        task.id === draggingTask.id 
          ? { ...task, status: columnId, completed: columnId === 'done' } 
          : task
      );
      
      onTaskChange(updatedTasks);
      toast.success(`Task moved to ${columns.find(col => col.id === columnId).title}`);
    }
  };

  // Get priority badge styles (same as in MainFeature)
  const getPriorityBadge = (priority) => {
    switch(priority) {
      case "high":
        return {
          bg: "bg-red-100 dark:bg-red-900/30",
          text: "text-red-800 dark:text-red-300",
          icon: <ArrowUpCircle className="w-4 h-4 mr-1" />
        };
      case "medium":
        return {
          bg: "bg-amber-100 dark:bg-amber-900/30",
          text: "text-amber-800 dark:text-amber-300",
          icon: <Flag className="w-4 h-4 mr-1" />
        };
      case "low":
        return {
          bg: "bg-blue-100 dark:bg-blue-900/30",
          text: "text-blue-800 dark:text-blue-300",
          icon: <AlertCircle className="w-4 h-4 mr-1" />
        };
      default:
        return {
          bg: "bg-gray-100 dark:bg-gray-800",
          text: "text-gray-800 dark:text-gray-300",
          icon: null
        };
    }
  };

  return (
    <div className="bg-surface-100 dark:bg-surface-800 rounded-xl p-4 overflow-x-auto">
      <div className="flex space-x-4 min-w-max">
        {columns.map(column => (
          <div 
            key={column.id}
            className="w-80 flex flex-col flex-shrink-0"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            <div className={`${column.color} rounded-t-lg p-3`}>
              <h3 className="text-white font-semibold text-sm tracking-wide">
                {column.title} ({getColumnTasks(column.id).length})
              </h3>
            </div>
            
            <div className="bg-white dark:bg-surface-700 rounded-b-lg shadow p-2 flex-grow max-h-[65vh] overflow-y-auto scrollbar-hide">
              <AnimatePresence initial={false}>
                {getColumnTasks(column.id).length === 0 ? (
                  <div className="border-2 border-dashed rounded-lg p-4 mt-2 border-surface-200 dark:border-surface-600 text-center">
                    <p className="text-surface-400 dark:text-surface-500 text-sm">
                      No tasks
                    </p>
                  </div>
                ) : (
                  getColumnTasks(column.id).map(task => (
                    <motion.div
                      key={task.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                      className={`p-3 mb-2 rounded-lg border dark:border-surface-600 ${
                        task.completed 
                          ? 'bg-surface-50/50 dark:bg-surface-800/50' 
                          : 'bg-white dark:bg-surface-800'
                      } cursor-grab`}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task)}
                      onDragEnd={handleDragEnd}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-start gap-2 flex-grow">
                          <button
                            onClick={() => onToggleComplete(task.id)}
                            className={`flex-shrink-0 mt-0.5 ${
                              task.completed ? "text-secondary" : "text-surface-400"
                            }`}
                          >
                            {task.completed ? (
                              <CheckSquare className="w-4 h-4" />
                            ) : (
                              <Square className="w-4 h-4" />
                            )}
                          </button>
                          
                          <span className={`break-words ${
                            task.completed
                              ? "line-through text-surface-400 dark:text-surface-500"
                              : "text-surface-800 dark:text-surface-100"
                          }`}>
                            {task.text}
                          </span>
                        </div>
                        
                        <div className="flex gap-1">
                          <button
                            onClick={() => onEditTask(task)}
                            className="p-1 rounded-md hover:bg-surface-100 dark:hover:bg-surface-600 text-surface-500 hover:text-surface-700 dark:text-surface-400 dark:hover:text-surface-200 transition-colors"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          
                          <button
                            onClick={() => onDeleteTask(task.id)}
                            className="p-1 rounded-md hover:bg-surface-100 dark:hover:bg-surface-600 text-surface-500 hover:text-red-600 dark:text-surface-400 dark:hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {task.dueDate && (
                          <span className="inline-flex items-center text-xs px-1.5 py-0.5 rounded-md bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-300">
                            <Clock className="w-3 h-3 mr-1" />
                            {format(new Date(task.dueDate), 'MMM d, yyyy')}
                          </span>
                        )}
                        
                        {task.priority && (
                          <span className={`inline-flex items-center text-xs px-1.5 py-0.5 rounded-md ${
                            getPriorityBadge(task.priority).bg
                          } ${getPriorityBadge(task.priority).text}`}>
                            {getPriorityBadge(task.priority).icon}
                            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                          </span>
                        )}
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}