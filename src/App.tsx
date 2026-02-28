/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  LayoutGrid, 
  FileCode2, 
  Database, 
  Network, 
  Rocket, 
  CheckCircle2, 
  AlertCircle,
  ChevronRight,
  Cpu,
  Sparkles,
  Send,
  Loader2,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { refineProjectDescription } from './services/gemini';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Bounty {
  id: string;
  title: string;
  description: string;
  reward: string;
  category: 'Storage' | 'Compute' | 'Network' | 'AI';
  tags: string[];
}

const BOUNTIES: Bounty[] = [
  {
    id: '1',
    title: 'IPFS Content Archiver',
    description: 'Build a tool that automatically archives web content to IPFS with verifiable proofs.',
    reward: '$5,000',
    category: 'Storage',
    tags: ['IPFS', 'Filecoin', 'Web3.Storage']
  },
  {
    id: '2',
    title: 'Decentralized Compute Node',
    description: 'Implement a lightweight compute node using Bacalhau for edge processing.',
    reward: '$7,500',
    category: 'Compute',
    tags: ['Bacalhau', 'Docker', 'Wasm']
  },
  {
    id: '3',
    title: 'Libp2p Mesh Chat',
    description: 'A peer-to-peer encrypted chat application built entirely on Libp2p.',
    reward: '$4,000',
    category: 'Network',
    tags: ['Libp2p', 'WebRTC', 'Encryption']
  },
  {
    id: '4',
    title: 'AI Model Pinning Service',
    description: 'A service to pin and version large AI models on Filecoin for decentralized access.',
    reward: '$10,000',
    category: 'AI',
    tags: ['Filecoin', 'AI', 'IPFS']
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'bounties' | 'submit' | 'refine'>('bounties');
  const [submissionType, setSubmissionType] = useState<'fresh' | 'existing' | null>(null);
  const [projectDescription, setProjectDescription] = useState('');
  const [refining, setRefining] = useState(false);
  const [refinedData, setRefinedData] = useState<any>(null);

  const handleRefine = async () => {
    if (!projectDescription) return;
    setRefining(true);
    try {
      const result = await refineProjectDescription(projectDescription, submissionType || 'Fresh Code');
      setRefinedData(result);
    } catch (error) {
      console.error('Refinement failed:', error);
    } finally {
      setRefining(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-zinc-100 font-sans selection:bg-emerald-500/30">
      {/* Background Grid */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-black/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)]">
              <Cpu className="w-5 h-5 text-black" />
            </div>
            <span className="font-bold tracking-tight text-xl">PL GENESIS HUB</span>
          </div>
          <nav className="flex items-center gap-1">
            <NavButton active={activeTab === 'bounties'} onClick={() => setActiveTab('bounties')}>Bounties</NavButton>
            <NavButton active={activeTab === 'submit'} onClick={() => setActiveTab('submit')}>Submission</NavButton>
            <NavButton active={activeTab === 'refine'} onClick={() => setActiveTab('refine')}>AI Refiner</NavButton>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12 relative">
        <AnimatePresence mode="wait">
          {activeTab === 'bounties' && (
            <motion.div
              key="bounties"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">Protocol Lab Bounties</h1>
                <p className="text-zinc-400 max-w-2xl">Explore active challenges and build solutions that integrate Protocol Labs technologies to qualify for the PL_Genesis Accelerator.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {BOUNTIES.map((bounty) => (
                  <BountyCard key={bounty.id} bounty={bounty} />
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'submit' && (
            <motion.div
              key="submit"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-3xl mx-auto space-y-12"
            >
              <div className="text-center space-y-4">
                <h2 className="text-3xl font-bold tracking-tight">Submission Strategy</h2>
                <p className="text-zinc-400">Choose your path. Your selection determines which prize category your project is evaluated under.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <SelectionCard 
                  title="Fresh Code"
                  description="Building a brand new solution from scratch for this hackathon."
                  icon={<Sparkles className="w-6 h-6" />}
                  active={submissionType === 'fresh'}
                  onClick={() => setSubmissionType('fresh')}
                />
                <SelectionCard 
                  title="Existing Code"
                  description="Expanding an existing codebase with meaningful new integrations."
                  icon={<Rocket className="w-6 h-6" />}
                  active={submissionType === 'existing'}
                  onClick={() => setSubmissionType('existing')}
                />
              </div>

              {submissionType && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-8 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 flex items-start gap-4"
                >
                  <div className="p-2 rounded-full bg-emerald-500/20">
                    <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-emerald-400">Strategy Selected: {submissionType === 'fresh' ? 'Fresh Code' : 'Existing Code'}</h3>
                    <p className="text-zinc-400 text-sm mt-1">
                      You are now eligible for the {submissionType === 'fresh' ? 'Fresh Innovation' : 'Ecosystem Expansion'} prize category. Ensure your documentation clearly states this choice.
                    </p>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {activeTab === 'refine' && (
            <motion.div
              key="refine"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto space-y-8"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-violet-500/10 border border-violet-500/20">
                  <Sparkles className="w-8 h-8 text-violet-400" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold tracking-tight">AI Project Refiner</h2>
                  <p className="text-zinc-400">Align your project with the PL_Genesis Accelerator goals.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="text-sm font-medium text-zinc-400 uppercase tracking-wider">Project Pitch</label>
                  <textarea 
                    value={projectDescription}
                    onChange={(e) => setProjectDescription(e.target.value)}
                    placeholder="Describe your project, how it uses IPFS/Filecoin, and why it matters..."
                    className="w-full h-64 bg-zinc-900/50 border border-white/10 rounded-2xl p-6 focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all resize-none font-mono text-sm"
                  />
                  <button 
                    onClick={handleRefine}
                    disabled={refining || !projectDescription}
                    className="w-full py-4 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-violet-600/20"
                  >
                    {refining ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Refine with Gemini
                      </>
                    )}
                  </button>
                </div>

                <div className="space-y-6">
                  <AnimatePresence mode="wait">
                    {refinedData ? (
                      <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                      >
                        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                          <h3 className="font-bold text-violet-400 flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4" />
                            Refined Description
                          </h3>
                          <p className="text-zinc-300 text-sm leading-relaxed">{refinedData.refinedDescription}</p>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                            <h3 className="font-bold text-emerald-400 flex items-center gap-2 mb-3">
                              <LayoutGrid className="w-4 h-4" />
                              Key Innovations
                            </h3>
                            <ul className="space-y-2">
                              {refinedData.keyInnovations.map((item: string, i: number) => (
                                <li key={i} className="text-sm text-zinc-400 flex items-start gap-2">
                                  <span className="text-emerald-500 mt-1">•</span>
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                            <h3 className="font-bold text-blue-400 flex items-center gap-2 mb-3">
                              <Rocket className="w-4 h-4" />
                              Accelerator Alignment
                            </h3>
                            <p className="text-sm text-zinc-400">{refinedData.acceleratorAlignment}</p>
                          </div>
                        </div>
                      </motion.div>
                    ) : (
                      <div className="h-full min-h-[400px] border-2 border-dashed border-white/5 rounded-2xl flex flex-col items-center justify-center text-zinc-500 p-8 text-center">
                        <AlertCircle className="w-12 h-12 mb-4 opacity-20" />
                        <p>Enter your project details and click refine to see AI-powered improvements.</p>
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2 text-zinc-500">
            <Cpu className="w-4 h-4" />
            <span className="text-sm">Built for Protocol Labs Hackathon 2026</span>
          </div>
          <div className="flex gap-6">
            <FooterLink href="#">Documentation</FooterLink>
            <FooterLink href="#">PL_Genesis</FooterLink>
            <FooterLink href="#">IPFS</FooterLink>
            <FooterLink href="#">Filecoin</FooterLink>
          </div>
        </div>
      </footer>
    </div>
  );
}

function NavButton({ children, active, onClick }: { children: React.ReactNode, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "px-4 py-2 rounded-lg text-sm font-medium transition-all",
        active ? "bg-white/10 text-white" : "text-zinc-400 hover:text-white hover:bg-white/5"
      )}
    >
      {children}
    </button>
  );
}

function BountyCard({ bounty }: { bounty: Bounty }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-500/50 transition-all group"
    >
      <div className="flex justify-between items-start mb-4">
        <span className={cn(
          "px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider",
          bounty.category === 'Storage' ? 'bg-blue-500/20 text-blue-400' :
          bounty.category === 'Compute' ? 'bg-emerald-500/20 text-emerald-400' :
          bounty.category === 'Network' ? 'bg-orange-500/20 text-orange-400' :
          'bg-violet-500/20 text-violet-400'
        )}>
          {bounty.category}
        </span>
        <span className="text-emerald-400 font-mono font-bold">{bounty.reward}</span>
      </div>
      <h3 className="text-xl font-bold mb-2 group-hover:text-emerald-400 transition-colors">{bounty.title}</h3>
      <p className="text-zinc-400 text-sm mb-6 line-clamp-2">{bounty.description}</p>
      <div className="flex flex-wrap gap-2 mb-6">
        {bounty.tags.map(tag => (
          <span key={tag} className="text-[10px] font-mono text-zinc-500 bg-white/5 px-2 py-0.5 rounded border border-white/5">
            {tag}
          </span>
        ))}
      </div>
      <button className="w-full py-2 rounded-lg bg-white/5 hover:bg-emerald-500 hover:text-black transition-all text-sm font-semibold flex items-center justify-center gap-2">
        View Details
        <ChevronRight className="w-4 h-4" />
      </button>
    </motion.div>
  );
}

function SelectionCard({ title, description, icon, active, onClick }: { title: string, description: string, icon: React.ReactNode, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "p-8 rounded-3xl border-2 text-left transition-all relative overflow-hidden group",
        active ? "bg-emerald-500/10 border-emerald-500" : "bg-white/5 border-white/10 hover:border-white/20"
      )}
    >
      <div className={cn(
        "w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-all",
        active ? "bg-emerald-500 text-black" : "bg-white/10 text-white group-hover:bg-white/20"
      )}>
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-zinc-400 text-sm leading-relaxed">{description}</p>
      {active && (
        <motion.div 
          layoutId="selection-check"
          className="absolute top-4 right-4"
        >
          <CheckCircle2 className="w-6 h-6 text-emerald-500" />
        </motion.div>
      )}
    </button>
  );
}

function FooterLink({ href, children }: { href: string, children: React.ReactNode }) {
  return (
    <a href={href} className="text-sm text-zinc-500 hover:text-emerald-400 transition-colors flex items-center gap-1">
      {children}
      <ExternalLink className="w-3 h-3" />
    </a>
  );
}
