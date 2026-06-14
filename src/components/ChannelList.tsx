import React from 'react';
import { Search, Heart, Tv, Star, Flame, Trophy, PlayCircle, Globe, Film, Music, Baby, Newspaper, Radio } from 'lucide-react';
import { TvChannel, CategoryType } from '../types';

interface ChannelListProps {
  channels: TvChannel[];
  selectedChannel: TvChannel;
  onSelectChannel: (channel: TvChannel) => void;
  onToggleFavorite: (id: string) => void;
  favorites: string[];
  activeCategory: CategoryType;
  setActiveCategory: (cat: CategoryType) => void;
}

const CATEGORIES: { label: string; value: CategoryType; icon: React.ReactNode }[] = [
  { label: 'All Streams', value: 'ALL', icon: <Tv className="w-3.5 h-3.5" /> },
  { label: 'Favorites', value: 'FAVORITES', icon: <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> },
  { label: 'FIFA World Cup', value: 'FIFA', icon: <Globe className="w-3.5 h-3.5 text-emerald-400" /> },
  { label: 'Bengali', value: 'BENGALI', icon: <Star className="w-3.5 h-3.5 text-yellow-400" /> },
  { label: 'Hindi', value: 'HINDI', icon: <Star className="w-3.5 h-3.5 text-orange-400" /> },
  { label: 'Sports', value: 'SPORTS', icon: <Trophy className="w-3.5 h-3.5 text-sky-400" /> },
  { label: 'Kids', value: 'KIDS', icon: <Baby className="w-3.5 h-3.5 text-pink-400" /> },
  { label: 'Movies', value: 'MOVIES', icon: <Film className="w-3.5 h-3.5 text-purple-400" /> },
  { label: 'Music', value: 'MUSICS', icon: <Music className="w-3.5 h-3.5 text-rose-300" /> },
  { label: 'News', value: 'NEWS', icon: <Newspaper className="w-3.5 h-3.5 text-blue-300" /> },
  { label: 'English', value: 'ENGLISH', icon: <Radio className="w-3.5 h-3.5 text-zinc-400" /> },
  { label: 'ESPN Net', value: 'ESPN', icon: <Trophy className="w-3.5 h-3.5 text-yellow-500" /> },
  { label: 'FOX Sports', value: 'FOX SPORTS', icon: <Flame className="w-3.5 h-3.5 text-orange-500" /> },
  { label: 'DAZN Network', value: 'DAZN', icon: <Trophy className="w-3.5 h-3.5 text-blue-500" /> },
  { label: 'Win Sports', value: 'WIN SPORTS', icon: <Flame className="w-3.5 h-3.5 text-emerald-500" /> },
  { label: 'BeIN / Euro', value: 'BEIN SPORT', icon: <Star className="w-3.5 h-3.5 text-pink-500" /> },
  { label: 'Custom M3U', value: 'CUSTOM', icon: <PlayCircle className="w-3.5 h-3.5 text-indigo-400" /> },
  { label: 'Others', value: 'OTHERS', icon: <Tv className="w-3.5 h-3.5" /> },
];

export default function ChannelList({
  channels,
  selectedChannel,
  onSelectChannel,
  onToggleFavorite,
  favorites,
  activeCategory,
  setActiveCategory,
}: ChannelListProps) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [visibleCount, setVisibleCount] = React.useState(30);

  React.useEffect(() => {
    setVisibleCount(30);
  }, [searchQuery, activeCategory]);

  const filteredChannels = React.useMemo(() => {
    return channels.filter((ch) => {
      // Search query matching
      const matchesSearch = ch.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            (ch.country && ch.country.toLowerCase().includes(searchQuery.toLowerCase())) ||
                            ch.category.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (!matchesSearch) return false;

      // Category matching
      if (activeCategory === 'ALL') return true;
      if (activeCategory === 'FAVORITES') return favorites.includes(ch.id);
      if (activeCategory === 'CUSTOM') return ch.isCustom === true;
      return ch.category === activeCategory;
    });
  }, [channels, searchQuery, activeCategory, favorites]);

  const displayedChannels = filteredChannels.slice(0, visibleCount);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const bottom = e.currentTarget.scrollHeight - e.currentTarget.scrollTop <= e.currentTarget.clientHeight + 200;
    if (bottom && visibleCount < filteredChannels.length) {
      setVisibleCount(prev => prev + 30);
    }
  };

  return (
    <div className="flex flex-col h-full bg-zinc-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-lg">
      
      {/* Search Header */}
      <div className="p-4 bg-zinc-900 border-b border-neutral-800 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-red-500" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">Broadcaster Index ({filteredChannels.length})</h2>
          </div>
          <span className="text-[10px] bg-red-600/10 border border-red-500/20 text-red-400 font-bold px-2 py-0.5 rounded-full uppercase font-mono animate-pulse">
            Active
          </span>
        </div>

        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <input
            type="text"
            placeholder="Search channels, hosts or country..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-950 border border-neutral-800 rounded-xl py-2.5 pl-10 pr-4 text-xs text-neutral-200 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600/50 transition-all font-sans"
          />
        </div>
      </div>

      {/* Categories Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto px-4 py-3 bg-zinc-950/40 border-b border-neutral-800/60 no-scrollbar scroll-smooth">
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.value;
          return (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap cursor-pointer transition-all duration-200 active:scale-95 ${isActive ? 'bg-red-600 text-white shadow-md shadow-red-600/10' : 'bg-zinc-800 hover:bg-neutral-800 text-neutral-400'}`}
            >
              {cat.icon}
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Scrolling List */}
      <div 
        className="flex-1 overflow-y-auto p-3 space-y-1.5 no-scrollbar max-h-[480px] lg:max-h-none"
        onScroll={handleScroll}
      >
        {filteredChannels.length === 0 ? (
          <div className="text-center py-10 px-4">
            <Tv className="w-10 h-10 text-neutral-600 mx-auto mb-3" />
            <p className="text-xs text-neutral-400 font-sans">No streams matched your filters.</p>
            {activeCategory === 'FAVORITES' && (
              <p className="text-[10px] text-neutral-500 mt-1">Tap the heart on any channel card to add favorites.</p>
            )}
          </div>
        ) : (
          displayedChannels.map((ch) => {
            const isSelected = selectedChannel.id === ch.id;
            const isFav = favorites.includes(ch.id);

            // Generate an approximate mock active viewer count based on unique string ID
            const mockViewerCount = (ch.name.charCodeAt(0) * ch.name.length * 17) % 850 + 90;

            return (
              <div
                key={ch.id}
                onClick={() => onSelectChannel(ch)}
                className={`group flex items-center gap-3 p-2.5 rounded-xl transition-all duration-200 cursor-pointer border relative select-none ${isSelected ? 'bg-red-600/10 border-red-500/40 shadow-xs' : 'bg-zinc-950/40 border-transparent hover:bg-neutral-800/40 hover:border-neutral-800'}`}
              >
                {/* Glowing Side Indicator */}
                {isSelected && (
                  <div className="absolute left-0 top-3 bottom-3 w-1 bg-red-600 rounded-r"></div>
                )}
                
                {/* Logo wrapper */}
                <div className="w-10 h-10 rounded-lg overflow-hidden bg-neutral-900 border border-neutral-800 flex items-center justify-center shrink-0">
                  <img
                    loading="lazy"
                    decoding="async"
                    src={ch.logo || 'https://images.unsplash.com/photo-1541252260730-0412e8e2108e?w=100&auto=format&fit=crop&q=60'}
                    alt={ch.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      // Fallback visual
                      (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=100&auto=format&fit=crop&q=60';
                    }}
                  />
                </div>

                {/* Name & metadata */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs font-bold text-neutral-100 truncate group-hover:text-white transition">
                      {ch.name}
                    </h4>
                    {ch.isCustom && (
                      <span className="text-[8px] bg-indigo-600/20 text-indigo-400 font-bold px-1 rounded transform scale-90">M3U</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mt-1 truncate">
                    <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider font-sans">
                      {ch.category}
                    </span>
                    <span className="text-[9px] text-neutral-500 font-sans truncate">
                      • {ch.country || 'Global'}
                    </span>
                  </div>

                  {/* Mock live specs */}
                  <div className="flex items-center gap-1.5 mt-1 font-mono text-[9px] text-neutral-500">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <span>{mockViewerCount} viewing</span>
                  </div>
                </div>

                {/* Favorite Heart action */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(ch.id);
                  }}
                  className="p-1.5 text-neutral-500 hover:text-rose-500 hover:bg-neutral-800 rounded-lg transition shrink-0 cursor-pointer"
                >
                  <Heart className={`w-4 h-4 transition ${isFav ? 'text-rose-500 fill-rose-500 scale-110' : 'text-neutral-500 group-hover:text-neutral-300'}`} />
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* App Guide Footer */}
      <div className="p-3 bg-zinc-950/80 border-t border-neutral-800/80 text-center text-[10px] text-neutral-500 font-sans">
        Double tap player to trigger full-screen mode • React 19 Engine
      </div>

    </div>
  );
}
