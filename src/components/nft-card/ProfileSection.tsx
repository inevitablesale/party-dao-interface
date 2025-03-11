
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { UserRound, Sparkles, Atom } from "lucide-react"; // Added new icons

interface ProfileSectionProps {
  image: string;
  name: string;
  governancePower: string;
  Award: React.ElementType;
}

export const ProfileSection = ({ image, name, governancePower, Award }: ProfileSectionProps) => {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.style.display = 'none';
    const fallbackIcon = e.currentTarget.parentElement?.querySelector('.fallback-icon');
    if (fallbackIcon) {
      fallbackIcon.classList.remove('hidden');
    }
  };

  return (
    <>
      {/* Floating Elements */}
      <motion.div
        className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-polygon-primary/20 blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 90, 180, 270, 360],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      <motion.div
        className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-polygon-secondary/20 blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          rotate: [360, 270, 180, 90, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      {/* Main Content */}
      <div className="relative w-full">
        {/* Profile Image Container */}
        <motion.div 
          className="relative w-40 h-40 mx-auto mb-6"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Animated Border */}
          <motion.div 
            className="absolute inset-0 rounded-[30%] border-2 border-polygon-primary"
            animate={{
              rotate: [0, 360],
              borderRadius: ["30%", "40%", "50%", "40%", "30%"],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          
          {/* Dynamic Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-polygon-primary/20 via-transparent to-polygon-secondary/20 rounded-[35%] backdrop-blur-sm" />
          
          {/* Fallback Icon */}
          <div className="fallback-icon hidden relative w-full h-full flex items-center justify-center">
            <UserRound className="w-16 h-16 text-polygon-primary" />
          </div>
          
          {/* Profile Image */}
          <img 
            src={image || '#'}
            alt={name}
            onError={handleImageError}
            className="relative w-full h-full object-cover rounded-[35%] transform transition-all duration-700 hover:scale-105 hover:rounded-[45%]"
          />
          
          {/* Decorative Elements */}
          <motion.div
            className="absolute -top-2 -right-2"
            animate={{
              rotate: [0, 360],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <Sparkles className="w-6 h-6 text-polygon-primary" />
          </motion.div>
        </motion.div>

        {/* Name Section */}
        <motion.div 
          className="text-center space-y-3"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h3 className="text-3xl font-bold">
            <span className="bg-gradient-to-r from-polygon-primary via-white to-polygon-secondary bg-clip-text text-transparent">
              {name}
            </span>
          </h3>
          
          {/* Governance Power Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 border border-polygon-primary/30 backdrop-blur-md">
            <Atom className="w-5 h-5 text-polygon-primary animate-pulse" />
            <span className="bg-gradient-to-r from-polygon-primary to-polygon-secondary bg-clip-text text-transparent font-semibold">
              {governancePower}
            </span>
          </div>
        </motion.div>
      </div>
    </>
  );
};
