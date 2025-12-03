"use client";

import { motion } from "framer-motion";
import {
  Shield,
  Zap,
  Users,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { Features } from "@/components/features";
import { Stats } from "@/components/stats";
import { CTA } from "@/components/cta";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 via-indigo-50/50 to-purple-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 relative overflow-hidden">
      {/* Animated grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] opacity-40" />
      <div className="relative z-10">
        <Navbar />
        <Hero />
        <Stats />
        <Features />
        <CTA />
      </div>
    </div>
  );
}
