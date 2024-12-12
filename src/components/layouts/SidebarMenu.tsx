import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { cn } from "../../lib/utils";

export const MenuItem = ({
  icon: Icon,
  label,
  path,
  isExpanded,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  path: string;
  isExpanded: boolean;
  onClick?: () => void;
}) => {
  const location = useLocation();
  const isActive = location.pathname === path;

  // Variants for animation
  const labelVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <Link to={path} onClick={onClick}>
      <motion.div
        className={cn(
          "flex items-center rounded-md transition-colors",
          "hover:bg-gray-100",
          isActive ? "bg-primary/10 text-primary" : "text-gray-700",
          "group",
          isExpanded ? "p-2" : "p-2 justify-center"
        )}
        whileHover={{ scale: 1.02 }}>
        <motion.div
          className={cn(
            "flex items-center justify-center",
            isExpanded ? "mr-3" : "mx-auto"
          )}
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{
            opacity: 1,
            scale: 1,
            transition: {
              type: "spring",
              stiffness: 300,
              damping: 20,
            },
          }}>
          <Icon
            className={cn(
              "w-5 h-5",
              isActive
                ? "text-primary"
                : "text-gray-600 group-hover:text-primary"
            )}
          />
        </motion.div>

        {isExpanded && (
          <motion.span
            variants={labelVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.3 }}
            className={cn(
              "text-sm whitespace-nowrap",
              isActive ? "font-semibold" : "font-normal"
            )}>
            {label}
          </motion.span>
        )}
      </motion.div>
    </Link>
  );
};
