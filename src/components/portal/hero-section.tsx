"use client";

import { motion } from "framer-motion";
import { ArrowRight, HardHat, Shield, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-amber-900 px-4 py-20 text-white sm:py-28">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1600&q=80')] bg-cover bg-center opacity-20" />
      <div className="relative mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="mb-4 inline-block rounded-full bg-amber-500/20 px-4 py-1 text-sm font-medium text-amber-300">
            Trusted by 500+ homeowners
          </span>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Get a Professional Estimate for Your Project
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300">
            Tell us about your project and receive a customized quote from licensed contractors in your area.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="gap-2">
              <a href="#request-form">
                Request Estimate <ArrowRight className="h-5 w-5" />
              </a>
            </Button>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-16 grid gap-6 sm:grid-cols-3"
        >
          {[
            { icon: HardHat, label: "Licensed Pros", desc: "Vetted contractors" },
            { icon: Shield, label: "Insured Work", desc: "Peace of mind" },
            { icon: Clock, label: "Fast Response", desc: "Within 24 hours" },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
            >
              <item.icon className="mx-auto h-8 w-8 text-amber-400" />
              <p className="mt-3 font-semibold">{item.label}</p>
              <p className="text-sm text-slate-400">{item.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
