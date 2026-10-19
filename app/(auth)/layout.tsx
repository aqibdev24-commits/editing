import type { ReactNode } from 'react';
import Link from 'next/link';
import { Video, Check, Sparkles, Shield, Zap } from 'lucide-react';
import { APP_NAME } from '@/lib/constants';

interface AuthLayoutProps {
  children: ReactNode;
}

const BENEFITS = [
  { icon: Sparkles, text: 'AI-powered editing tools' },
  { icon: Zap, text: 'Export in 4K — free forever' },
  { icon: Shield, text: 'No watermarks, no paywalls' },
  { icon: Check, text: 'Unlimited projects & storage' },
];

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="relative min-h-screen bg-slate-950">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/4 h-[600px] w-[600px] rounded-full bg-violet-600/15 blur-3xl" />
        <div className="absolute top-1/3 right-0 h-[500px] w-[500px] rounded-full bg-fuchsia-600/15 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-blue-600/10 blur-3xl" />
      </div>

      <div className="relative grid min-h-screen lg:grid-cols-2">
        {/* Left — Branding panel */}
        <div className="relative hidden flex-col justify-between border-r border-white/5 bg-slate-950/50 p-12 backdrop-blur-sm lg:flex">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 shadow-lg shadow-violet-600/30 transition-transform group-hover:scale-105">
              <Video className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">{APP_NAME}</span>
          </Link>

          {/* Middle content */}
          <div className="max-w-md">
            <h2 className="text-4xl font-bold leading-tight text-white">
              Edit videos like a{' '}
              <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
                pro studio
              </span>
            </h2>
            <p className="mt-4 text-lg text-slate-400">
              Join thousands of creators using {APP_NAME} to craft stunning videos with AI tools,
              cinematic effects, and multi-track editing.
            </p>

            <ul className="mt-8 space-y-4">
              {BENEFITS.map((benefit) => (
                <li key={benefit.text} className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-500/10 text-violet-400">
                    <benefit.icon className="h-4 w-4" />
                  </div>
                  <span className="text-slate-300">{benefit.text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Bottom testimonial */}
          <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 backdrop-blur-sm">
            <p className="text-sm italic leading-relaxed text-slate-300">
              &ldquo;{APP_NAME} replaced my $500/year editing software. Same results, zero cost,
              and it runs in my browser.&rdquo;
            </p>
            <div className="mt-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-sm font-bold text-white">
                SK
              </div>
              <div>
                <div className="text-sm font-semibold text-white">Sarah Kim</div>
                <div className="text-xs text-slate-500">YouTuber · 2.4M subscribers</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right — Form panel */}
        <div className="flex items-center justify-center px-4 py-12 sm:px-6 lg:px-12">
          <div className="w-full max-w-md">
            {/* Mobile logo */}
            <div className="mb-8 flex justify-center lg:hidden">
              <Link href="/" className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 shadow-lg shadow-violet-600/30">
                  <Video className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">{APP_NAME}</span>
              </Link>
            </div>

            {children}

            {/* Free badge */}
            <div className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-500">
              <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
              <span>100% free forever — no credit card required</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}