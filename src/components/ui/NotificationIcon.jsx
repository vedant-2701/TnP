import { IoIosNotificationsOutline } from "react-icons/io";
import { IoClose } from 'react-icons/io5';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect, useRef } from 'react';

const ringVariants = {
  initial: { scale: 1, rotate: 0 }, // Default state
  hover: {
    scale: 1.2,
    rotate: [0, -15, 15, -15, 15, -15, 15, 0], // Shake animation on hover
    transition: {
      rotate: {
        duration: 0.8, // Total duration for 4 swings
        ease: 'easeInOut',
        times: [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 1], // Timing for each step
      },
    },
  },
  ring: {
    rotate: [0, -15, 15, -15, 15, -15, 15, 0], // Shake animation for new notifications and initial load
    transition: {
      duration: 0.8,
      ease: 'easeInOut',
      times: [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 1],
    },
  },
  tap: { scale: 0.8 }, // Scale down on tap
};

// New shade animation variants
const shadeVariants = {
    initial: { 
      opacity: 0, 
      height: 0, 
      scaleY: 0,
      transformOrigin: 'top',
    },
    animate: { 
      opacity: 1, 
      height: 'auto',
      scaleY: 1,
      transition: {
        duration: 0.4,
        ease: 'linear', // Custom easing for smooth roll
      },
    },
    exit: { 
      opacity: 0, 
      scaleY: 0,
      height: 0,
      transition: {
        duration: 0.3,
        ease: 'linear',
      },
    },
  };
  
// New list item animation variants
const itemVariants = {
    initial: { opacity: 0, x: -20 },
    animate: { 
        opacity: 1, 
        x: 0,
        transition: {
            duration: 0.4,
        },
    },
    exit: { 
        opacity: 0,
        x: 20,
        height: 0,
        marginBottom: 0,
        transition: { 
            duration: 0.4,
            ease: 'easeInOut',
        },
    },
};

export default function NotificationIcon() {

    const [notifications, setNotifications] = useState([
        // Example initial notifications (could come from an API)
        { id: 1, message: 'New message received' },
        { id: 2, message: 'Meeting at 3 PM' },
    ]);

    const [isShadeOpen, setIsShadeOpen] = useState(false);
    const [shouldRing, setShouldRing] = useState(false);
    const shadeRef = useRef(null); // Ref to track the shade element
    const iconRef = useRef(null); // Ref for the icon to exclude it from outside clicks

    // Trigger ring animation on initial load if notifications exist
    useEffect(() => {
        if (notifications.length > 0) {
            setShouldRing(true);
            setTimeout(() => setShouldRing(false), 800); // Match animation duration
        }
    }, []);

    // Simulate a new notification arriving (e.g., after 5 seconds)
    useEffect(() => {
        const timer = setTimeout(() => {
            const newNotification = {
                id: Date.now(),
                message: 'New event added!',
            };
            setNotifications((prev) => [...prev, newNotification]);
            setShouldRing(true);
            setTimeout(() => setShouldRing(false), 800); // Stop ringing after animation
        }, 5000); // New notification after 5s (for demo)

        return () => clearTimeout(timer);
    }, []);

    // Handle clicks outside the shade
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                shadeRef.current && !shadeRef.current.contains(event.target) && 
                iconRef.current && !iconRef.current.contains(event.target)
            ) {
                setIsShadeOpen(false);
            }
        };

        if (isShadeOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isShadeOpen]);
    
    // Toggle notification shade
    const handleClick = (e) => {
        e.stopPropagation(); // Prevent click event from bubbling up
        setIsShadeOpen((prev) => !prev);
        // setIsShadeOpen(!isShadeOpen); 
    };

    // Remove a notification by ID
    const removeNotification = (id) => {
        setNotifications((prev) => prev.filter((notif) => notif.id !== id));
    };

    return (
        <div className="relative">
            {/* Notification Icon */}
            <motion.span
                ref={iconRef} // Attach ref to the icon
                variants={ringVariants}
                initial="initial"
                animate={shouldRing ? 'ring' : 'initial'}
                whileHover="hover"
                whileTap="tap"
                onClick={handleClick}
                className="cursor-pointer inline-block relative"
            >
                <IoIosNotificationsOutline className="w-8 h-8" />
                {/* Notification Dot */}
                {notifications.length > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {notifications.length}
                    </span>
                )}
            </motion.span>

            {/* Notification Shade */}
            <AnimatePresence>
                {isShadeOpen && (
                    <motion.div
                        ref={shadeRef} // Attach ref to the shade
                        variants={shadeVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="absolute top-10 right-0 w-64 bg-white shadow-lg rounded-lg p-4 overflow-hidden"
                    >
                        <h3 className="text-base font-semibold mb-3">Notifications</h3>
                        {notifications.length > 0 ? (
                            <ul className="space-y-3">
                                {notifications.map((notif) => (
                                    <AnimatePresence key={notif.id} mode="wait">
                                        <motion.li
                                            key={notif.id}
                                            variants={itemVariants}
                                            initial="initial"
                                            animate="animate"
                                            exit="exit"
                                            className="text-base text-gray-700 flex justify-between items-center p-2 bg-gray-50 rounded-md cursor-pointer"
                                        >
                                            <span>{notif.message}</span>
                                            <button
                                                onClick={() => removeNotification(notif.id)}
                                                className="text-gray-500 hover:text-red-500"
                                            >
                                                <IoClose className="w-5 h-5" />
                                            </button>
                                        </motion.li>
                                    </AnimatePresence>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-gray-500">No notifications</p>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
};
