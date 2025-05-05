import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import getIcon from '../utils/iconUtils';

export default function NotFound() {
  const AlertCircle = getIcon('AlertCircle');
  const Home = getIcon('Home');

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="h-[70vh] flex flex-col items-center justify-center text-center px-4"
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ 
          duration: 0.5,
          type: "spring",
          stiffness: 100
        }}
      >
        <AlertCircle className="w-20 h-20 mb-6 text-primary mx-auto" />
      </motion.div>

      <h1 className="text-4xl md:text-5xl font-bold mb-3">Page Not Found</h1>
      
      <p className="text-surface-600 dark:text-surface-400 text-lg md:text-xl max-w-md mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>
      
      <Link 
        to="/"
        className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-medium px-6 py-3 rounded-xl transition duration-300 shadow-md hover:shadow-lg"
      >
        <Home size={20} />
        <span>Back to Home</span>
      </Link>
    </motion.div>
  );
}