import React, { useState, useEffect } from 'react';
import { 
  Tv, Heart, Radio, Plus, Settings, AlertTriangle, Sparkles, 
  HelpCircle, MessageSquare, ListVideo, Layers, Globe, ShieldAlert, Cpu 
} from 'lucide-react';

import { TvChannel, CategoryType } from './types';
import { ALL_DEFAULT_CHANNELS, FALLBACK_CHANNELS } from './channelsData';
import HlsPlayer from './components/HlsPlayer';
import ChannelList from './components/ChannelList';
import PlaylistImporter from './components/PlaylistImporter';
import LiveChat from './components/LiveChat';

export default function App() {
  // Favorites storage keys
  const FAVORITES_KEY = 'live_tv_fav_ids';
  const CUSTOM_CHANNELS_KEY = 'live_tv_custom_list';

  // Load favorites from localStorage
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(FAVORITES_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Load custom channels from localStorage
  const [customChannels, setCustomChannels] = useState<TvChannel[]>(() => {
    try {
      const saved = localStorage.getItem(CUSTOM_CHANNELS_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Master channel list
  const [channels, setChannels] = useState<TvChannel[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<TvChannel | null>(null);
  const [activeCategory, setActiveCategory] = useState<CategoryType>('ALL');
  
  // App tabs & view layouts
  const [activeTab, setActiveTab] = useState<'chat' | 'importer'>('chat');
  const [currentTime, setCurrentTime] = useState<string>('');

  // Combine static and custom channels on mount / update
  useEffect(() => {
    const combined = [...customChannels, ...ALL_DEFAULT_CHANNELS];
    setChannels(combined);

    // Default selection
    if (!selectedChannel) {
      // Prefer BeIn Sports Extra as default or fallback
      const defaultChan = combined.find(c => c.id === 'bein-extra') || combined[0];
      setSelectedChannel(defaultChan);
    } else {
      // Sync selected in case it was deleted
      const stillExists = combined.find(c => c.id === selectedChannel.id);
      if (!stillExists) {
        setSelectedChannel(combined[0]);
      }
    }
  }, [customChannels]);

  // Sync favorites with LocalStorage
  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites]);

  // Sync custom channels with LocalStorage
  const syncCustomChannels = (newCustomList: TvChannel[]) => {
    setCustomChannels(newCustomList);
    localStorage.setItem(CUSTOM_CHANNELS_KEY, JSON.stringify(newCustomList));
  };

  // Clock in local timezone
  useEffect(() => {
    const updateClock = () => {
      const d = new Date();
      setCurrentTime(d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSelectChannel = (channel: TvChannel) => {
    setSelectedChannel(channel);
  };

  const handleToggleFavorite = (id: string) => {
    setFavorites((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleImportChannels = (importedList: TvChannel[]) => {
    const updated = [...importedList, ...customChannels];
    syncCustomChannels(updated);
    
    // Auto select first newly imported list item
    if (importedList.length > 0) {
      setSelectedChannel(importedList[0]);
    }
    setActiveCategory('CUSTOM');
  };

  const handleClearCustomChannels = () => {
    if (window.confirm("Are you sure you want to delete all custom imported playlist channels?")) {
      syncCustomChannels([]);
      setActiveCategory('ALL');
    }
  };

  const handlePlayNextFallback = () => {
    if (FALLBACK_CHANNELS.length > 0) {
      setSelectedChannel(FALLBACK_CHANNELS[0]);
      alert("Tuning to Stable Nature Stream. These have 100% video-on-demand uptime and will bypass geoblocking rules!");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-neutral-100 flex flex-col font-sans selection:bg-red-600 selection:text-white">
      
      {/* Premium Header */}
      <header className="bg-zinc-900 border-b border-neutral-800 sticky top-0 z-40 px-4 md:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4 shadow-md">
        
        {/* Brand Logo & localized Bengali details */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 to-amber-500 flex items-center justify-center shadow-lg shadow-red-500/20">
            <Radio className="w-5.5 h-5.5 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black tracking-wider text-white uppercase font-sans">
                Tanvir IPTV <span className="text-red-500 font-extrabold text-xs bg-red-500/10 border border-red-500/30 px-2 py-0.5 rounded ml-1 animate-pulse">PRO</span>
              </h1>
            </div>
            {/* Soft Bengali touch of responsiveness from guidelines on human readable names */}
            <p className="text-[10px] text-neutral-400 font-medium">
              রিয়েল-টাইম স্ট্রিমিং ও স্পোর্টস ওয়াচ পার্টি
            </p>
          </div>
        </div>

        {/* Global Live Info Status Monitors */}
        <div className="flex items-center gap-2 md:gap-4 flex-wrap">
          
          {/* Active stats */}
          <div className="hidden lg:flex items-center gap-2 bg-zinc-950 px-3 py-1.5 rounded-lg border border-neutral-800 text-[11px] font-mono">
            <Layers className="w-3.5 h-3.5 text-neutral-500" />
            <span className="text-neutral-400">INDEXED STREAMS:</span>
            <span className="text-red-400 font-bold">{channels.length}</span>
          </div>

          <div className="hidden sm:flex items-center gap-2 bg-zinc-950 px-3 py-1.5 rounded-lg border border-neutral-800 text-[11px] font-mono">
            <Globe className="w-3.5 h-3.5 text-neutral-500" />
            <span className="text-neutral-400">SYS TIME:</span>
            <span className="text-neutral-200 font-bold">{currentTime}</span>
          </div>

          <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-lg text-emerald-400 text-xs font-semibold">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></div>
            <span>LIVE INTERACTIVE SERVER</span>
          </div>

        </div>
      </header>

      {/* Main Layout Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 lg:p-8 flex flex-col gap-6">
        
        {/* Upper Feature: Banner & App Notification */}
        <div className="bg-gradient-to-r from-red-950/20 via-zinc-900 to-zinc-900 border border-neutral-800 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm animate-fade-in">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-600/15 flex items-center justify-center text-red-500 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Advanced IPTV HLS Broadcaster & Streaming App</h3>
              <p className="text-xs text-neutral-400 font-sans mt-0.5">
                We pre-loaded your PDF sports channels. Use our built-in M3U Playlist parser up next to paste any custom list link and test without limits!
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <a 
              href="#live-tv-player-container"
              className="px-4 py-2 bg-red-600 hover:bg-red-700 font-sans text-xs font-semibold text-white rounded-xl transition cursor-pointer active:scale-95 text-center min-w-[120px]"
            >
              Tune Player
            </a>
            <a 
              href="#m3u-importer"
              onClick={() => {
                setActiveTab('importer');
                const element = document.getElementById('m3u-importer');
                if (element) element.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 font-sans text-xs text-neutral-300 rounded-xl transition cursor-pointer text-center"
            >
              Import M3U List
            </a>
          </div>
        </div>

        {/* Dynamic Split Grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* Main Left - player and catalog indexes */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Live TV Video Player */}
            {selectedChannel ? (
              <HlsPlayer 
                channel={selectedChannel} 
                onPlayNextFallback={handlePlayNextFallback}
              />
            ) : (
              <div className="aspect-video w-full rounded-2xl bg-zinc-900 border border-neutral-800 flex flex-col items-center justify-center p-8 text-center">
                <Tv className="w-16 h-16 text-neutral-600 mb-4 animate-bounce" />
                <h4 className="text-lg font-bold text-white">No Stream Selected</h4>
                <p className="text-xs text-neutral-500 mt-1">Select a broadcast server channel from below to start viewing.</p>
              </div>
            )}

            {/* Segment Controls: Desktop Channels Display */}
            <div className="mt-2">
              <ChannelList 
                channels={channels}
                selectedChannel={selectedChannel || ALL_DEFAULT_CHANNELS[0]}
                onSelectChannel={handleSelectChannel}
                onToggleFavorite={handleToggleFavorite}
                favorites={favorites}
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
              />
            </div>

          </div>

          {/* Right Sidebar - Live Chat / Playlist setup panels */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Side Controller Tabs */}
            <div className="bg-zinc-900 p-1.5 rounded-xl border border-neutral-800 flex gap-2">
              <button
                onClick={() => setActiveTab('chat')}
                className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg cursor-pointer transition flex items-center justify-center gap-1.5 ${activeTab === 'chat' ? 'bg-red-600 text-white shadow-md shadow-red-600/10' : 'text-neutral-400 hover:text-white'}`}
              >
                <MessageSquare className="w-4 h-4" /> WATCH CHAT
              </button>
              <button
                onClick={() => setActiveTab('importer')}
                className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg cursor-pointer transition flex items-center justify-center gap-1.5 ${activeTab === 'importer' ? 'bg-red-600 text-white shadow-md shadow-red-600/10' : 'text-neutral-400 hover:text-white'}`}
                id="tab-open-importer"
              >
                <Layers className="w-4 h-4" /> ADD PLAYLIST
              </button>
            </div>

            {/* Side panels display */}
            {activeTab === 'chat' && selectedChannel && (
              <LiveChat activeChannel={selectedChannel} />
            )}

            {/* Importer tab widget */}
            <div id="m3u-importer" className={activeTab === 'importer' ? 'block' : 'hidden md:block'}>
              <PlaylistImporter 
                onImport={handleImportChannels}
                onClearCustom={handleClearCustomChannels}
                customCount={customChannels.length}
              />
            </div>

            {/* Quick security / CORS guidelines card block */}
            <div className="bg-zinc-900/40 border border-neutral-800 rounded-2xl p-5 shadow-sm space-y-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4.5 h-4.5 text-yellow-500" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">CORS & GEOBLOCK BRIEF</h4>
              </div>
              <p className="text-[11px] text-neutral-400 font-sans leading-relaxed">
                Live IPTV streams are pulled directly from original regional broadcasters. If a channel fails to buffer or shows "Blocked", it usually indicates the server requires CORS access or is offline in the browser environment.
                <br /><br />
                <strong>Simple Solution:</strong> Use our <strong>"HLS Test Presets"</strong> in the Add List tab to test player features with 100% active, unlocked streams!
              </p>
              
              <div className="pt-2 border-t border-neutral-800 flex items-center justify-between text-[10px] text-neutral-500 font-mono">
                <span>Secure HTTPS Environment</span>
                <span className="text-red-500 font-bold">● RESTRICTED</span>
              </div>
            </div>

          </div>

        </div>

      </main>

      {/* Decorative Brand Footer */}
      <footer className="bg-zinc-950 border-t border-neutral-800 py-6 px-4 text-center mt-12">
        <div className="max-w-2xl mx-auto space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Radio className="w-4 h-4 text-red-500" />
            <span className="text-xs font-bold tracking-widest text-neutral-400 uppercase">Tanvir IPTV - Live Player Suite</span>
          </div>
          <p className="text-[11px] text-neutral-500 font-sans leading-relaxed">
            Designed for fluid low-latency streaming in React Vite. Custom M3U playlists uploaded locally remain private inside browser localStorage context. Use of live streams is subject to standard network terms and original content providers.
          </p>
          <div className="pt-4 text-[10px] text-neutral-600 font-mono">
            BUILD RE-STABLE VERSION v3.250-ENGINED
          </div>
        </div>
      </footer>

    </div>
  );
}
