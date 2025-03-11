import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Shield, LockKeyhole, AlertTriangle, Terminal, ExternalLink } from "lucide-react";
import { ToxicButton } from "@/components/ui/toxic-button";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import Cookies from 'js-cookie';

// Cookie name and expiry
const ACCESS_COOKIE_NAME = 'resistance_terminal_access';
const COOKIE_EXPIRY = 30; // 30 days

interface TerminalLoginProps {
  onLoginSuccess: () => void;
}

export const TerminalLogin: React.FC<TerminalLoginProps> = ({ onLoginSuccess }) => {
  const [accessCode, setAccessCode] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [loginErrors, setLoginErrors] = useState<string[]>([]);
  const [terminalMessages, setTerminalMessages] = useState<string[]>([
    "> RESISTANCE NETWORK TERMINAL v2.31",
    "> SECURE CONNECTION ESTABLISHED",
    "> AWAITING AUTHENTICATION..."
  ]);
  const { connect, isConnected } = useWalletConnection();

  useEffect(() => {
    // Check for existing access cookie on mount
    const hasAccess = Cookies.get(ACCESS_COOKIE_NAME);
    if (hasAccess) {
      addTerminalMessage("> PREVIOUS ACCESS TOKEN FOUND");
      addTerminalMessage("> VALIDATING TOKEN...");
      setTimeout(() => {
        addTerminalMessage("> ACCESS TOKEN VALIDATED");
        handleLoginSuccess();
      }, 1000);
    }
  }, []);

  useEffect(() => {
    if (isConnected) {
      handleLoginSuccess();
    }
  }, [isConnected]);

  const addTerminalMessage = (message: string) => {
    setTerminalMessages(prev => [...prev, message]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!accessCode.trim()) {
      setLoginErrors(["ERROR: ACCESS CODE REQUIRED"]);
      return;
    }

    authenticateWithPassword();
  };

  const authenticateWithPassword = () => {
    setIsAuthenticating(true);
    setLoginErrors([]);
    
    addTerminalMessage(`> VALIDATING ACCESS CODE: ${accessCode.replace(/./g, '*')}`);
    
    if (accessCode === "resistance" || accessCode === "admin") {
      addTerminalMessage("> ACCESS CODE VALIDATED");
      // Set cookie for future access
      Cookies.set(ACCESS_COOKIE_NAME, 'true', { expires: COOKIE_EXPIRY });
      handleLoginSuccess();
    } else {
      setIsAuthenticating(false);
      setLoginErrors(["ERROR: INVALID ACCESS CODE"]);
      addTerminalMessage("> AUTHENTICATION FAILED");
    }
  };

  const handleWalletConnect = () => {
    setIsAuthenticating(true);
    setLoginErrors([]);
    addTerminalMessage("> INITIALIZING WALLET CONNECTION...");
    
    connect();
  };

  const handleLoginSuccess = () => {
    // Set cookie when logging in with wallet too
    if (isConnected) {
      Cookies.set(ACCESS_COOKIE_NAME, 'true', { expires: COOKIE_EXPIRY });
    }
    onLoginSuccess();
  };

  const terminalVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 }
  };

  return (
    <div className="max-w-lg mx-auto">
      <motion.div 
        className="mb-8 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <h1 className="text-5xl md:text-6xl font-mono text-toxic-neon mb-6 toxic-glow">THE RESISTANCE</h1>
        <p className="text-lg text-white/80 mb-8">
          Enter access code to infiltrate the network
        </p>
      </motion.div>

      <motion.div 
        className="bg-black/70 border border-toxic-neon/30 p-6 rounded-lg broken-glass relative overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="scanline"></div>
        
        <div className="flex items-center gap-3 mb-6">
          <Terminal className="h-5 w-5 text-toxic-neon" />
          <h2 className="text-xl font-mono text-toxic-neon">TERMINAL ACCESS</h2>
        </div>

        <motion.div 
          className="terminal-output bg-black/90 p-4 rounded font-mono text-sm text-toxic-neon mb-6 h-48 overflow-y-auto flex flex-col"
          variants={terminalVariants}
          initial="initial"
          animate="animate"
        >
          {terminalMessages.map((message, index) => (
            <motion.div 
              key={`${message}-${index}`}
              variants={itemVariants}
              className="mb-1 terminal-line"
            >
              {message}
            </motion.div>
          ))}
          {loginErrors.map((error, index) => (
            <motion.div 
              key={`error-${index}`}
              variants={itemVariants}
              className="text-apocalypse-red mb-1"
            >
              {error}
            </motion.div>
          ))}
          {isAuthenticating && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-2 flex items-center"
            >
              <span className="animate-pulse mr-2">▋</span>
              <span>Processing...</span>
            </motion.div>
          )}
        </motion.div>

        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <input
                type="password"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                disabled={isAuthenticating}
                placeholder="ENTER ACCESS CODE"
                className="w-full bg-black/80 border-2 border-toxic-neon/60 text-toxic-neon p-3 rounded font-mono focus:outline-none focus:border-toxic-neon focus:shadow-[0_0_12px_rgba(57,255,20,0.4)] transition-all duration-300"
              />
              <span className="absolute top-1/2 -translate-y-1/2 right-3 text-toxic-neon/50 pointer-events-none text-xs">
                [ACCESS]
              </span>
            </div>
            <ToxicButton 
              type="submit" 
              disabled={isAuthenticating}
              variant="primary"
              size="xl"
              className="uppercase font-mono inline-flex items-center justify-center text-base md:w-auto w-full"
            >
              <LockKeyhole className="h-5 w-5 mr-2" />
              AUTHENTICATE
            </ToxicButton>
          </div>
        </form>

        <div className="flex justify-center items-center gap-2 text-white/60 mb-6">
          <span className="border-t border-white/20 flex-grow"></span>
          <span className="text-sm px-2">OR</span>
          <span className="border-t border-white/20 flex-grow"></span>
        </div>

        <ToxicButton 
          onClick={handleWalletConnect} 
          disabled={isAuthenticating}
          variant="secondary"
          size="lg"
          className="w-full uppercase font-mono inline-flex items-center justify-center py-3 text-base mb-8"
        >
          <Shield className="h-5 w-5 mr-2" />
          CONNECT CRYPTO WALLET
        </ToxicButton>

        <div className="flex justify-center items-center gap-2 text-white/60 mb-6">
          <span className="border-t border-white/20 flex-grow"></span>
          <span className="text-sm px-2">OR</span>
          <span className="border-t border-white/20 flex-grow"></span>
        </div>

        <a 
          href="https://www.linkedin.com/groups/12657922/" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="block w-full"
        >
          <ToxicButton
            variant="tertiary"
            size="default"
            className="w-full uppercase font-mono inline-flex items-center justify-center py-2.5 text-sm"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            GAIN ACCESS CODE
          </ToxicButton>
        </a>

        <div className="mt-8 text-center">
          <div className="text-white/40 text-xs flex items-center justify-center gap-2">
            <AlertTriangle className="h-3 w-3" />
            <span>UNAUTHORIZED ACCESS WILL BE TRACED</span>
            <AlertTriangle className="h-3 w-3" />
          </div>
        </div>
      </motion.div>
    </div>
  );
};
