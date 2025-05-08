import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';
import MainFeature from '../components/MainFeature';

export default function Home() {
  const [taskCount, setTaskCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  
  // Icons
  const ListChecks = getIcon('ListChecks');
  const CheckCircle = getIcon('CheckCircle');
  const Calendar = getIcon('Calendar');
  
  useEffect(() => {
    // Get task stats from localStorage
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const completed = tasks.filter(task => task.completed).length;
    
    setTaskCount(tasks.length);
    setCompletedCount(completed);
  }, []);
  
  // Update stats when tasks change
  const handleTaskChange = () => {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const completed = tasks.filter(task => task.completed).length;
    
    setTaskCount(tasks.length);
    setCompletedCount(completed);
    
    if (completed > completedCount) {
      toast.success("Task completed! Great job! 🎉");
    }
  };

  return (
    <div className="space-y-8">
      <section>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="mb-2">Welcome to TaskFlow RJ And VG</h1>
          <p className="text-surface-600 dark:text-surface-400 max-w-2xl">
            Organize your day, boost your productivity, and never forget a task again.
            TaskFlow helps you stay on top of everything you need to do.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="card flex items-center gap-4"
          >
            <div className="h-12 w-12 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary">
              <ListChecks size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-bold">{taskCount}</h3>
              <p className="text-surface-500 dark:text-surface-400">Total Tasks</p>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="card flex items-center gap-4"
          >
            <div className="h-12 w-12 rounded-lg bg-secondary/10 dark:bg-secondary/20 flex items-center justify-center text-secondary">
              <CheckCircle size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-bold">{completedCount}</h3>
              <p className="text-surface-500 dark:text-surface-400">Completed</p>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="card flex items-center gap-4"
          >
            <div className="h-12 w-12 rounded-lg bg-accent/10 dark:bg-accent/20 flex items-center justify-center text-accent">
              <Calendar size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-bold">{taskCount > 0 ? Math.round((completedCount / taskCount) * 100) : 0}%</h3>
              <p className="text-surface-500 dark:text-surface-400">Completion Rate</p>
            </div>
          </motion.div>
        </div>
      </section>
      
      <MainFeature onTaskChange={handleTaskChange} />
    </div>
  );
}
