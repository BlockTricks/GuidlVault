"use client";

import { motion } from "framer-motion";
import { Shield, Menu, X } from "lucide-react";
import { useAppKit } from "@reown/appkit/react";
import { useAccount, useDisconnect } from "wagmi";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Link from "next/link";

export function Navbar() {
  const { open } = useAppKit();
  const { address, isConnected } = useAccount();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 w-full z-50 glass backdrop-blur-xl border-b border-white/20 dark:border-slate-800/50 shadow-lg"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-3 group">
            <motion.div
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-indigo-500 rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
              <Shield className="h-9 w-9 text-indigo-600 dark:text-indigo-400 relative z-10 drop-shadow-lg" />
            </motion.div>
            <span className="text-2xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent group-hover:scale-105 transition-transform">
              VaultGuard
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/vaults"
              className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              Vaults
            </Link>
            <Link
              href="/create"
              className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              Create Vault
            </Link>
            <Link
              href="/submit"
              className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              Submit
            </Link>
            <Button
              onClick={() => open()}
              variant={isConnected ? "outline" : "default"}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            >
              {isConnected
                ? `${address?.slice(0, 6)}...${address?.slice(-4)}`
                : "Connect Wallet"}
            </Button>
          </div>

          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden border-t border-slate-200 dark:border-slate-800"
        >
          <div className="px-4 py-4 space-y-4">
            <Link
              href="/vaults"
              className="block text-slate-600 dark:text-slate-300"
            >
              Vaults
            </Link>
            <Link
              href="/create"
              className="block text-slate-600 dark:text-slate-300"
            >
              Create Vault
            </Link>
            <Link
              href="/submit"
              className="block text-slate-600 dark:text-slate-300"
            >
              Submit
            </Link>
            <Button onClick={() => open()} className="w-full">
              {isConnected ? "Disconnect" : "Connect Wallet"}
            </Button>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}
