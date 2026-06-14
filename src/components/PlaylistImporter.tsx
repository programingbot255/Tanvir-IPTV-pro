import React, { useState, useRef } from 'react';
import { Upload, FileText, Clipboard, Trash, RefreshCw, Layers } from 'lucide-react';
import { TvChannel } from '../types';

interface PlaylistImporterProps {
  onImport: (channels: TvChannel[]) => void;
  onClearCustom: () => void;
  customCount: number;
}

export function parseM3uText(text: string): TvChannel[] {
  const lines = text.split('\n');
  const channels: TvChannel[] = [];
  let currentName = '';
  let groupTitle = 'CUSTOM';
  let logoUrl = 'https://images.unsplash.com/photo-1541252260730-0412e8e2108e?w=100&auto=format&fit=crop&q=60';
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    if (line.startsWith('#EXTINF:')) {
      // Extract channel name: find the last occurrence of comma that is not part of tag values
      // Or find the first comma and take the rest
      const commaIdx = line.indexOf(',');
      if (commaIdx !== -1) {
        // Strip out unicode emojis or weird parsed characters if any
        currentName = line.substring(commaIdx + 1).trim();
      } else {
        currentName = 'Stream Channel ' + (channels.length + 1);
      }
      
      // Try to parse group-title / category tag
      const groupMatch = line.match(/group-title="([^"]+)"/i);
      if (groupMatch && groupMatch[1]) {
        const cat = groupMatch[1].toUpperCase();
        if (cat.includes('SPORT') || cat.includes('ESPN') || cat.includes('BEIN') || cat.includes('FOX')) {
          groupTitle = cat;
        } else {
          groupTitle = 'CUSTOM';
        }
      } else {
        groupTitle = 'CUSTOM';
      }

      // Try to parse tvg-logo tag
      const logoMatch = line.match(/tvg-logo="([^"]+)"/i);
      if (logoMatch && logoMatch[1]) {
        logoUrl = logoMatch[1];
      } else {
        logoUrl = 'https://images.unsplash.com/photo-1541252260730-0412e8e2108e?w=100&auto=format&fit=crop&q=60';
      }
    } else if (line.startsWith('http://') || line.startsWith('https://')) {
      channels.push({
        id: 'imported-' + Math.random().toString(36).substring(2, 11),
        name: currentName || 'Imported Stream ' + (channels.length + 1),
        url: line,
        category: 'CUSTOM', // Place imported in CUSTOM category
        isCustom: true,
        logo: logoUrl,
        country: 'User Play'
      });
      // Reset variables for next entry
      currentName = '';
      groupTitle = 'CUSTOM';
      logoUrl = 'https://images.unsplash.com/photo-1541252260730-0412e8e2108e?w=100&auto=format&fit=crop&q=60';
    }
  }
  return channels;
}

export default function PlaylistImporter({ onImport, onClearCustom, customCount }: PlaylistImporterProps) {
  const [inputText, setInputText] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [copiedSuccess, setCopiedSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImport = () => {
    if (!inputText.trim()) return;
    const parsed = parseM3uText(inputText);
    if (parsed.length > 0) {
      onImport(parsed);
      setInputText('');
      alert(`Successfully imported ${parsed.length} channels from your list!`);
    } else {
      alert("No valid streams found. Please make sure your pasted content follows M3U formatting starting with #EXTM3U and containing absolute HLS .m3u8 urls.");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        const parsed = parseM3uText(text);
        if (parsed.length > 0) {
          onImport(parsed);
          alert(`Successfully loaded ${parsed.length} channels from ${file.name}!`);
        } else {
          alert("Could not load any channels. Check if the file is a valid .m3u playlist containing direct http streams.");
        }
      }
    };
    reader.readAsText(file);
  };

  const loadSamplePreset = () => {
    const sampleM3u = `#EXTM3U
#EXTINF:-1 tvg-logo="https://images.unsplash.com/photo-1536440136628-849c177e76a1" group-title="SPORTS",Sintel Live HLS HD
https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8
#EXTINF:-1 tvg-logo="https://images.unsplash.com/photo-1485846234645-a62644f84728" group-title="SPORTS",Big Buck Bunny Test Stream
https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8
#EXTINF:-1 tvg-logo="https://images.unsplash.com/photo-1505118380757-91f5f5632de0" group-title="SPORTS",Tears Of Steel Ultra HLS
https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel-multiple-subtitles.ism/.m3u8`;
    setInputText(sampleM3u);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        const parsed = parseM3uText(text);
        if (parsed.length > 0) {
          onImport(parsed);
          alert(`Successfully dragged & loaded ${parsed.length} channels!`);
        } else {
          alert("No stream channels parsed. Confirm M3U file formatting.");
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="bg-zinc-900 border border-neutral-800 rounded-2xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4 border-b border-neutral-800 pb-3">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-red-500" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">M3U Playlist Importer</h3>
        </div>
        {customCount > 0 && (
          <span className="bg-red-500/10 text-red-400 font-mono text-[11px] font-bold px-2 py-0.5 rounded-full border border-red-500/20">
            {customCount} Custom Loaded
          </span>
        )}
      </div>

      <p className="text-xs text-neutral-400 leading-relaxed mb-4 font-sans">
        Have your own IPTV list or direct sports links? Paste their raw M3U format or drag-and-drop the file below. Custom feeds are added to your local library!
      </p>

      {/* Drag & Drop File Upload Region */}
      <div 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer mb-4 ${isDragging ? 'border-red-500 bg-red-500/5' : 'border-neutral-800 bg-zinc-950 hover:border-neutral-700 hover:bg-neutral-900/40'}`}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileUpload} 
          accept=".m3u,.m3u8,.txt"
          className="hidden" 
        />
        <Upload className="w-8 h-8 text-neutral-500 mx-auto mb-2 animate-pulse" />
        <p className="text-xs font-semibold text-neutral-300">Drag & Drop M3U Playlist here</p>
        <p className="text-[10px] text-neutral-500 mt-1">or click to browse local files (.m3u, .m3u8, .txt)</p>
      </div>

      {/* Manual Paste */}
      <div className="mb-4">
        <label className="block text-[11px] font-bold text-neutral-300 uppercase tracking-widest mb-1.5 flex items-center justify-between">
          <span>Raw M3U String Playback</span>
          <button 
            onClick={loadSamplePreset}
            className="text-[10px] text-red-400 hover:text-red-300 font-semibold underline lowercase transition"
          >
            Load HLS Test Preset
          </button>
        </label>
        <textarea
          rows={4}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={`#EXTM3U\n#EXTINF:-1, Real Madrid TV\nhttps://rmtv.akamaized.net/live/...`}
          className="w-full bg-zinc-950 border border-neutral-800 rounded-xl p-3 text-xs font-mono text-neutral-300 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600/50 resize-y"
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={handleImport}
          disabled={!inputText.trim()}
          className="py-2.5 bg-red-600 hover:bg-red-700 font-sans text-xs font-semibold text-white rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-red-600/10 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Clipboard className="w-3.5 h-3.5" /> Parse Playlist
        </button>

        <button
          onClick={onClearCustom}
          disabled={customCount === 0}
          className="py-2.5 bg-neutral-800 hover:bg-neutral-700 font-sans text-xs font-semibold text-neutral-300 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 border border-neutral-800 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Trash className="w-3.5 h-3.5" /> Reset Custom
        </button>
      </div>
    </div>
  );
}
