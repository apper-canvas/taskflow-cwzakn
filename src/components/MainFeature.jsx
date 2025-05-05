import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';

export default function MainFeature({ onTaskChange }) {
  // Icons
  const Plus = getIcon('Plus');
  const Trash2 = getIcon('Trash2');
  const CheckSquare = getIcon('CheckSquare');
  const Square = getIcon('Square');
  const Clock = getIcon('Clock');
  const AlertCircle = getIcon('AlertCircle');
  const CheckCircle = getIcon('CheckCircle');
  const ArrowUpCircle = getIcon('ArrowUpCircle');
  const Flag = getIcon('Flag');
  const Edit = getIcon('Edit');
  const Save = getIcon('Save');
  const X = getIcon('X');
  const GripVertical = getIcon('GripVertical');

  // States
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [newTaskDueDate, setNewTaskDueDate] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState("medium");
  const [filter, setFilter] = useState("all");
  const [editingTask, setEditingTask] = useState(null);
  const [editText, setEditText] = useState("");
  const [editDueDate, setEditDueDate] = useState("");
  const [editPriority, setEditPriority] = useState("");
  
  // Load tasks from localStorage
  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    setTasks(savedTasks);
  }, []);
  
  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    if (onTaskChange) onTaskChange();
  }, [tasks, onTaskChange]);
  
  // Add new task
  const handleAddTask = (e) => {
    e.preventDefault();
    
    if (newTask.trim() === "") {
      toast.error("Task cannot be empty");
      return;
    }
    
    const newTaskObj = {
      id: Date.now(),
      text: newTask,
      completed: false,
      createdAt: new Date().toISOString(),
      dueDate: newTaskDueDate ? new Date(newTaskDueDate).toISOString() : null,
      priority: newTaskPriority
    };
    
    setTasks([...tasks, newTaskObj]);
    setNewTask("");
    setNewTaskDueDate("");
    setNewTaskPriority("medium");
    
    toast.success("Task added successfully");
  };
  
  // Delete task
  const handleDeleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
    toast.info("Task deleted");
  };
  
  // Toggle task completion
  const handleToggleComplete = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };
  
  // Start editing task
  const handleStartEdit = (task) => {
    setEditingTask(task.id);
    setEditText(task.text);
    setEditDueDate(task.dueDate ? format(new Date(task.dueDate), 'yyyy-MM-dd') : '');
    setEditPriority(task.priority);
  };
  
  // Save edited task
  const handleSaveEdit = () => {
    if (editText.trim() === "") {
      toast.error("Task cannot be empty");
      return;
    }
    
    setTasks(tasks.map(task => 
      task.id === editingTask ? {
        ...task,
        text: editText,
        dueDate: editDueDate ? new Date(editDueDate).toISOString() : null,
        priority: editPriority
      } : task
    ));
    
    setEditingTask(null);
    toast.success("Task updated");
  };
  
  // Cancel editing
  const handleCancelEdit = () => {
    setEditingTask(null);
  };
  
  // Handle drag end event
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    
    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;
    
    if (sourceIndex === destinationIndex) return;
    
    const filteredTasksCopy = [...filteredTasks];
    const [removed] = filteredTasksCopy.splice(sourceIndex, 1);
    filteredTasksCopy.splice(destinationIndex, 0, removed);
    
    // Create a new array with all tasks, maintaining the order of non-filtered tasks
    const newTasksOrder = [...tasks];
    
    // Map the filtered tasks back to their original indices in the complete tasks array
    filteredTasks.forEach((task, index) => {
      const originalIndex = newTasksOrder.findIndex(t => t.id === task.id);
      if (originalIndex !== -1) {
        newTasksOrder[originalIndex] = filteredTasksCopy[index];
      }
    });
    
    setTasks(newTasksOrder);
    toast.success("Task order updated");
  };
  
  // Filter tasks based on filter state
  const filteredTasks = tasks.filter(task => {
    if (filter === "all") return true;
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });
  
  // Get priority badge styles
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
    <div className="space-y-6">
      <section className="card">
        <h2 className="text-xl font-semibold mb-4">Add New Task</h2>
        
        <form onSubmit={handleAddTask} className="space-y-4">
          <div>
            <label htmlFor="task" className="block text-sm font-medium mb-1">
              Task
            </label>
            <input
              type="text"
              id="task"
              className="input"
              placeholder="What needs to be done?"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium mb-1">
                Due Date (Optional)
              </label>
              <input
                type="date"
                id="dueDate"
                className="input"
                value={newTaskDueDate}
                onChange={(e) => setNewTaskDueDate(e.target.value)}
              />
            </div>
            
            <div>
              <label htmlFor="priority" className="block text-sm font-medium mb-1">
                Priority
              </label>
              <select
                id="priority"
                className="input"
                value={newTaskPriority}
                onChange={(e) => setNewTaskPriority(e.target.value)}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
          
          <button
            type="submit"
            className="w-full md:w-auto btn btn-primary flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Task
          </button>
        </form>
      </section>
      
      <section className="card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-xl font-semibold">Your Tasks</h2>
          
          <div className="bg-surface-100 dark:bg-surface-700 rounded-lg p-1 flex">
            <button
              className={`px-3 py-1.5 text-sm rounded-md transition ${
                filter === "all" 
                  ? "bg-white dark:bg-surface-600 shadow-sm" 
                  : "hover:bg-white/50 dark:hover:bg-surface-600/50"
              }`}
              onClick={() => setFilter("all")}
            >
              All
            </button>
            <button
              className={`px-3 py-1.5 text-sm rounded-md transition ${
                filter === "active" 
                  ? "bg-white dark:bg-surface-600 shadow-sm" 
                  : "hover:bg-white/50 dark:hover:bg-surface-600/50"
              }`}
              onClick={() => setFilter("active")}
            >
              Active
            </button>
            <button
              className={`px-3 py-1.5 text-sm rounded-md transition ${
                filter === "completed" 
                  ? "bg-white dark:bg-surface-600 shadow-sm" 
                  : "hover:bg-white/50 dark:hover:bg-surface-600/50"
              }`}
              onClick={() => setFilter("completed")}
            >
              Completed
            </button>
          </div>
        </div>
        
        {filteredTasks.length === 0 ? (
          <div className="text-center py-10 border-2 border-dashed border-surface-200 dark:border-surface-700 rounded-lg">
            <CheckCircle className="w-12 h-12 mx-auto text-surface-400 mb-3" />
            <h3 className="text-xl font-medium mb-1">No tasks here</h3>
            <p className="text-surface-500 dark:text-surface-400">
              {filter === "all" 
                ? "Add your first task to get started" 
                : filter === "active"
                  ? "No active tasks found"
                  : "No completed tasks yet"}
            </p>
          </div>
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="tasks">
              {(provided) => (
                <div 
                  className="space-y-3"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  <AnimatePresence initial={false}>
                    {filteredTasks.map((task, index) => (
                      <Draggable 
                        key={task.id} 
                        draggableId={task.id.toString()} 
                        index={index}
                        isDragDisabled={editingTask === task.id}
                      >
                        {(provided, snapshot) => (
                          <motion.div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className={`relative p-4 border dark:border-surface-700 rounded-xl ${
                              snapshot.isDragging
                                ? "shadow-lg bg-surface-50/80 dark:bg-surface-700/80 border-primary/20 dark:border-primary/20"
                                : task.completed
                                  ? "bg-surface-100/50 dark:bg-surface-800/50"
                                  : "bg-white dark:bg-surface-800"
                            }`}
                          >
                            {editingTask === task.id ? (
                              <div className="space-y-3">
                                <input
                                  type="text"
                                  className="input"
                                  value={editText}
                                  onChange={(e) => setEditText(e.target.value)}
                                  autoFocus
                                />
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  <input
                                    type="date"
                                    className="input"
                                    value={editDueDate}
                                    onChange={(e) => setEditDueDate(e.target.value)}
                                  />
                                  
                                  <select
                                    className="input"
                                    value={editPriority}
                                    onChange={(e) => setEditPriority(e.target.value)}
                                  >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                  </select>
                                </div>
                                
                                <div className="flex gap-2 mt-3">
                                  <button
                                    onClick={handleSaveEdit}
                                    className="btn btn-primary flex items-center gap-1 text-sm"
                                  >
                                    <Save className="w-4 h-4" />
                                    Save
                                  </button>
                                  
                                  <button
                                    onClick={handleCancelEdit}
                                    className="btn btn-outline flex items-center gap-1 text-sm"
                                  >
                                    <X className="w-4 h-4" />
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <div className="flex items-start gap-3">
                                  <div 
                                    className="flex-shrink-0 mr-1 cursor-grab text-surface-400 hover:text-surface-600 dark:hover:text-surface-300" 
                                    {...provided.dragHandleProps}
                                  >
                                    <GripVertical className="w-5 h-5" />
                                  </div>
                                
                                  <button
                                    onClick={() => handleToggleComplete(task.id)}
                                    className={`flex-shrink-0 mt-0.5 ${
                                      task.completed ? "text-secondary" : "text-surface-400"
                                    }`}
                                  >
                                    {task.completed ? (
                                      <CheckSquare className="w-5 h-5" />
                                    ) : (
                                      <Square className="w-5 h-5" />
                                    )}
                                  </button>
                                  
                                  <div className="flex-grow min-w-0">
                                    <p className={`${
                                      task.completed
                                        ? "line-through text-surface-400 dark:text-surface-500"
                                        : "text-surface-800 dark:text-surface-100"
                                    }`}>
                                      {task.text}
                                    </p>
                                    
                                    <div className="flex flex-wrap gap-2 mt-2">
                                      {task.dueDate && (
                                        <span className="inline-flex items-center text-xs px-2 py-1 rounded-md bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-300">
                                          <Clock className="w-3 h-3 mr-1" />
                                          {format(new Date(task.dueDate), 'MMM d, yyyy')}
                                        </span>
                                      )}
                                      
                                      {task.priority && (
                                        <span className={`inline-flex items-center text-xs px-2 py-1 rounded-md ${
                                          getPriorityBadge(task.priority).bg
                                        } ${getPriorityBadge(task.priority).text}`}>
                                          {getPriorityBadge(task.priority).icon}
                                          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  
                                  <div className="flex flex-shrink-0 gap-1">
                                    <button
                                      onClick={() => handleStartEdit(task)}
                                      className="p-1.5 rounded-md hover:bg-surface-100 dark:hover:bg-surface-700 text-surface-500 hover:text-surface-700 dark:text-surface-400 dark:hover:text-surface-200 transition-colors"
                                    >
                                      <Edit className="w-4 h-4" />
                                    </button>
                                    
                                    <button
                                      onClick={() => handleDeleteTask(task.id)}
                                      className="p-1.5 rounded-md hover:bg-surface-100 dark:hover:bg-surface-700 text-surface-500 hover:text-red-600 dark:text-surface-400 dark:hover:text-red-400 transition-colors"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>
                              </>
                            )}
                          </motion.div>
                        )}
                      </Draggable>
                    ))}
                  </AnimatePresence>
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}
        
        {tasks.length > 0 && (
          <div className="mt-4 text-sm text-surface-500 dark:text-surface-400">
            {tasks.filter(t => t.completed).length} of {tasks.length} tasks completed
          </div>
        )}
      </section>
    </div>
  );
}