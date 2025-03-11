
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, X, ChevronDown, ChevronUp, Play, Command, ChevronRight, Radiation } from 'lucide-react';
import { ToxicButton } from '@/components/ui/toxic-button';
import { ToxicBadge } from '@/components/ui/toxic-badge';

interface StoryTerminalProps {
  className?: string;
  onClose?: () => void;
  initiallyOpen?: boolean;
}

export function StoryTerminal({ className = "", onClose, initiallyOpen = false }: StoryTerminalProps) {
  const [isOpen, setIsOpen] = useState(initiallyOpen);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [displayText, setDisplayText] = useState("");
  const [commandInput, setCommandInput] = useState("");
  const terminalRef = useRef<HTMLDivElement>(null);
  const [isMicMinimized, setIsMicMinimized] = useState(false);
  const [storySeen, setStorySeen] = useState(false);
  
  const storyEntries = [
    {
      title: "THE FALL",
      content: "The world financial system collapsed in 2030. Markets disintegrated. Currencies became worthless overnight. What followed was chaos - not from the lack of money, but from the realization that the entire system had been an illusion.\n\nBut from these ashes, we rise. The Resistance formed from those who saw opportunity in rebuilding. Not recreating the old systems, but engineering something better. Something decentralized. Something that can't be controlled by the few.",
      style: "text-apocalypse-red"
    },
    {
      title: "THE RESISTANCE",
      content: "We operate in the shadows of what remains. Our network spreads across the wasteland - connecting outposts, sharing resources, and establishing new territories free from centralized control.\n\nOur mission is to rebuild, but differently. The old world created inequality by design. The new world will distribute power across the network, giving everyone a stake in our collective future.",
      style: "text-toxic-neon"
    },
    {
      title: "YOUR ROLE",
      content: "You stand at a crossroads. Will you become a SENTINEL - monitoring territories, directing network resources, and establishing strategic outposts? Or a PIONEER - building settlements, developing innovations, and creating the foundations of our new civilization?\n\nThe choice is yours. The network needs both. Your skills will determine the path you take, but your impact will be felt across the wasteland.",
      style: "text-white"
    },
    {
      title: "THE MISSION",
      content: "We face threats from those who want to recreate the old systems. Former bankers and politicians who believe concentration of wealth and power is the natural order.\n\nWe must secure territories, develop technology, and grow our network faster than they can organize. The wasteland is contested, but with enough of us working together, we can ensure that what rises from the ashes is better than what came before.",
      style: "text-amber-400"
    }
  ];
  
  const commandResponses: Record<string, string> = {
    "help": "Available commands:\n/story - Display the main narrative\n/mission - View current objectives\n/territory - Check territorial status\n/sentinel - Learn about Sentinel roles\n/pioneer - Learn about Pioneer roles\n/clear - Clear terminal display",
    "story": "Replaying the main narrative...",
    "mission": "PRIMARY OBJECTIVE: Establish and secure network nodes across contested territories.\n\nSECONDARY OBJECTIVES:\n- Recruit 50 new Sentinels for network monitoring\n- Complete construction of Medical Outpost Alpha\n- Develop radiation resistance technology\n- Secure supply lines between Northern and Eastern territories",
    "territory": "TERRITORY STATUS:\n\nSECTOR 7 (NORTHERN): SECURED - 85% Resistance control\nSECTOR 12 (EASTERN): CONTESTED - 47% Resistance control\nSECTOR 19 (SOUTHERN): HAZARDOUS - 28% Resistance control\nSECTOR 23 (WESTERN): UNDER DEVELOPMENT - 61% Resistance control\n\nPRIORITY: Reinforce SECTOR 12 against increasing pressure from remnant banking cartels.",
    "sentinel": "SENTINEL PROGRAM:\n\nRole: Network monitors and territory controllers\nResponsibilities:\n- Resource allocation across the network\n- Intelligence gathering on remnant threats\n- Territory security and expansion\n- Network infrastructure maintenance\n\nIdeal candidates have backgrounds in security, logistics, or strategic planning.",
    "pioneer": "PIONEER PROGRAM:\n\nRole: Builders and innovators of the new world\nResponsibilities:\n- Settlement construction and management\n- Technology research and development\n- Medical system implementation\n- Sustainable resource generation\n\nIdeal candidates have backgrounds in engineering, medicine, or agricultural science.",
    "clear": "Terminal cleared."
  };
  
  // Handle the typing animation effect
  useEffect(() => {
    if (currentStoryIndex < storyEntries.length) {
      const content = storyEntries[currentStoryIndex].content;
      let i = 0;
      setIsTyping(true);
      
      const interval = setInterval(() => {
        if (i <= content.length) {
          setDisplayText(content.substring(0, i));
          i++;
        } else {
          clearInterval(interval);
          setIsTyping(false);
          if (currentStoryIndex === storyEntries.length - 1) {
            setStorySeen(true);
          }
        }
      }, 20); // Typing speed - lower number is faster
      
      return () => clearInterval(interval);
    }
  }, [currentStoryIndex]);
  
  // Auto-scroll to the bottom when content changes
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [displayText]);
  
  const handleNextStory = () => {
    if (currentStoryIndex < storyEntries.length - 1) {
      setCurrentStoryIndex(prev => prev + 1);
    }
  };
  
  const handlePrevStory = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(prev => prev - 1);
    }
  };
  
  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!commandInput.trim()) return;
    
    // Process command (remove leading slash if present)
    const cleanCommand = commandInput.startsWith('/') 
      ? commandInput.substring(1).toLowerCase().trim() 
      : commandInput.toLowerCase().trim();
    
    // Handle special commands
    if (cleanCommand === 'clear') {
      setDisplayText("");
    } else if (cleanCommand === 'story') {
      setCurrentStoryIndex(0);
    } else {
      // Add response to the terminal
      const response = commandResponses[cleanCommand] || `Command not recognized: ${commandInput}`;
      setDisplayText(prev => `${prev}\n\n> ${commandInput}\n\n${response}`);
    }
    
    setCommandInput("");
  };
  
  const toggleTerminal = () => {
    setIsOpen(prev => !prev);
  };
  
  const toggleMicrophone = () => {
    setIsMicMinimized(prev => !prev);
  };
  
  return (
    <div className={`relative ${className}`}>
      {/* Minimized indicator when terminal is closed */}
      {!isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/70 border border-toxic-neon/40 text-toxic-neon text-sm cursor-pointer hover:bg-black hover:border-toxic-neon/60 transition-all"
          onClick={toggleTerminal}
        >
          <Terminal className="h-4 w-4 mr-1" />
          <span className="font-mono text-xs">
            {storySeen ? "TERMINAL_AVAILABLE" : "NEW_TRANSMISSION"}
          </span>
          {!storySeen && (
            <span className="w-2 h-2 bg-apocalypse-red rounded-full animate-pulse"></span>
          )}
        </motion.div>
      )}
      
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-8 bg-black/80 border border-toxic-neon/30 rounded-lg overflow-hidden"
          >
            {/* Terminal header */}
            <div className="bg-black/90 border-b border-toxic-neon/20 p-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="h-4 w-4 text-toxic-neon" />
                <span className="text-toxic-neon font-mono text-sm">RESISTANCE_CHRONICLES</span>
                <div className="w-2 h-2 rounded-full bg-toxic-neon/70 animate-pulse"></div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={toggleMicrophone}
                  className="w-5 h-5 rounded flex items-center justify-center text-white/70 hover:text-white/90 transition-colors"
                >
                  {isMicMinimized ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
                </button>
                <button 
                  onClick={toggleTerminal}
                  className="w-5 h-5 rounded flex items-center justify-center text-white/70 hover:text-white/90 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
            
            {/* Story navigation */}
            {!isMicMinimized && (
              <div className="bg-black/70 border-b border-toxic-neon/10 px-3 py-2 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <ToxicBadge variant="outline" className="bg-black/60 border-toxic-neon/30 text-xs">
                    <Radiation className="w-3 h-3 mr-1" /> TRANSMISSION
                  </ToxicBadge>
                  <span className="text-white/80 font-mono text-xs">
                    {currentStoryIndex + 1}/{storyEntries.length}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={handlePrevStory} 
                    disabled={currentStoryIndex === 0 || isTyping}
                    className={`w-6 h-6 rounded flex items-center justify-center ${currentStoryIndex === 0 ? 'text-white/30' : 'text-white/70 hover:text-white hover:bg-white/5'} transition-colors`}
                  >
                    <ChevronUp size={14} />
                  </button>
                  <button 
                    onClick={handleNextStory}
                    disabled={currentStoryIndex === storyEntries.length - 1 || isTyping}
                    className={`w-6 h-6 rounded flex items-center justify-center ${currentStoryIndex === storyEntries.length - 1 ? 'text-white/30' : 'text-white/70 hover:text-white hover:bg-white/5'} transition-colors`}
                  >
                    <ChevronDown size={14} />
                  </button>
                </div>
              </div>
            )}
            
            {/* Terminal content */}
            <div 
              ref={terminalRef}
              className="p-4 max-h-[400px] overflow-y-auto terminal-content"
            >
              {/* Story title */}
              <h3 className={`text-xl font-mono mb-4 ${storyEntries[currentStoryIndex].style}`}>
                {storyEntries[currentStoryIndex].title}
              </h3>
              
              {/* Story content with typing effect */}
              <div className="font-mono text-sm whitespace-pre-line leading-relaxed text-white/90">
                {displayText}
                {isTyping && <span className="typing-cursor">_</span>}
              </div>
            </div>
            
            {/* Command input */}
            <form 
              onSubmit={handleCommandSubmit}
              className="border-t border-toxic-neon/20 p-3 flex items-center gap-2 bg-black/50"
            >
              <div className="w-4 h-4 text-toxic-neon flex-shrink-0">
                <ChevronRight size={16} />
              </div>
              <input
                type="text"
                value={commandInput}
                onChange={(e) => setCommandInput(e.target.value)}
                placeholder="Type a command (try /help)..."
                className="flex-1 bg-transparent border-none text-toxic-neon font-mono text-sm focus:outline-none placeholder:text-toxic-neon/40"
              />
              <button 
                type="submit"
                className="p-1 rounded hover:bg-toxic-neon/10 text-toxic-neon transition-colors"
              >
                <Command size={16} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
