"use client";

import { motion } from "framer-motion";
import { TrendingUp, DollarSign, Users, Shield } from "lucide-react";

const stats = [
  {
    icon: Shield,
    label: "Active Vaults",
    value: "12",
    change: "+3 this month",
  },
  {
    icon: DollarSign,
    label: "Total Bounties",
    value: "$50K+",
    change: "Locked in contracts",
  },
  {
    icon: Users,
    label: "Researchers",
    value: "200+",
    change: "Active community",
  },
  {
    icon: TrendingUp,
    label: "Success Rate",
    value: "85%",
    change: "Approved submissions",
  },
];

export function Stats() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1, type: "spring", stiffness: 100 }}
              whileHover={{ scale: 1.08, y: -5, rotate: [0, -2, 2, 0] }}
              className="text-center p-8 rounded-2xl glass backdrop-blur-md border-2 border-white/30 dark:border-slate-700/50 shadow-xl hover:shadow-2xl transition-all relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute top-2 right-2 w-16 h-16 bg-gradient-to-br from-indigo-200/20 to-purple-200/20 rounded-full blur-xl"
              />
              <div className="relative z-10">
                <motion.div
                  whileHover={{ scale: 1.2, rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <stat.icon className="h-10 w-10 mx-auto mb-4 text-indigo-600 dark:text-indigo-400 drop-shadow-lg" />
                </motion.div>
                <div className="text-4xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-base font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  {stat.label}
                </div>
                <div className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">
                  {stat.change}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}


