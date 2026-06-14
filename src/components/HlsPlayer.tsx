import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { 
  Play, Pause, Volume2, VolumeX, Maximize2, Minimize2, 
  RotateCcw, AlertCircle, Sparkles, Tv, HelpCircle 
} from 'lucide-react';
import { TvChannel } from '../types';

interface HlsPlayerProps {
  channel: TvChannel;
  onPlayNextFallback?: () => void;
}

export default function HlsPlayer({ channel, onPlayNextFallback }: HlsPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLive, setIsLive] = useState(true);
  const [isBuffering, setIsBuffering] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState<'fit' | 'fill' | 'stretch'>('fit');
  const [showControls, setShowControls] = useState(true);
  const [corsWarning, setCorsWarning] = useState(false);
  
  const hlsRef = useRef<Hls | null>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-hide controls
  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  };

  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, []);

  // Initialize and Load Stream
  const initPlayer = () => {
    const video = videoRef.current;
    if (!video) return;

    // Reset player state
    setErrorMsg(null);
    setCorsWarning(false);
    setIsBuffering(true);

    // Destroy existing Hls instance
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    // Direct url check
    if (!channel.url) {
      setErrorMsg("No stream URL available.");
      setIsBuffering(false);
      return;
    }

    // Check if browser supports HLS natively (Safari / iOS)
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = channel.url;
      video.addEventListener('loadedmetadata', () => {
        setIsBuffering(false);
        video.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
      });
      video.addEventListener('error', (e) => {
        handleNativeError();
      });
    } 
    // Use hls.js
    else if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90,
        maxBufferSize: 30 * 1000 * 1000, // 30MB
        manifestLoadingTimeOut: 10000,
        fragLoadingTimeOut: 10000
      });

      hlsRef.current = hls;
      hls.loadSource(channel.url);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setIsBuffering(false);
        video.play()
          .then(() => setIsPlaying(true))
          .catch((err) => {
            console.log("Autoplay blocked or failed:", err);
            setIsPlaying(false);
          });
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        console.warn('HLS Error details:', data);
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              console.log('Fatal network error, trying to recover...', data);
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.log('Fatal media error, trying to recover...', data);
              hls.recoverMediaError();
              break;
            default:
              // Cannot recover
              hls.destroy();
              hlsRef.current = null;
              
              // CORS check or Offline check
              if (channel.url.startsWith('http://') && window.location.protocol === 'https:') {
                setErrorMsg("Mixed Content Blocked: Cannot play HTTP stream in an HTTPS app. Try an HTTPS stream!");
              } else {
                setErrorMsg("Stream is currently offline, geoblocked, or blocked by CORS headers.");
                setCorsWarning(true);
              }
              setIsBuffering(false);
              setIsPlaying(false);
              break;
          }
        }
      });

      // Buffering state listening
      hls.on(Hls.Events.FRAG_BUFFERED, () => {
        setIsBuffering(false);
      });
      hls.on(Hls.Events.BUFFER_FLUSHING, () => {
        setIsBuffering(true);
      });
    } else {
      setErrorMsg("Your browser does not support HLS streaming.");
      setIsBuffering(false);
    }
  };

  const handleNativeError = () => {
    if (channel.url.startsWith('http://') && window.location.protocol === 'https:') {
      setErrorMsg("Mixed Content Blocked: An HTTP stream cannot be loaded on HTTPS. Try copying the link directly.");
    } else {
      setErrorMsg("Stream failed to load natively in your browser.");
    }
    setIsBuffering(false);
    setIsPlaying(false);
  };

  useEffect(() => {
    initPlayer();

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [channel.url]);

  // Player controls
  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      video.play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    const video = videoRef.current;
    if (video) {
      video.volume = val;
      video.muted = val === 0;
      setIsMuted(val === 0);
    }
  };

  const toggleFullscreen = () => {
    const container = containerRef.current;
    if (!container) return;

    if (!document.fullscreenElement) {
      container.requestFullscreen()
        .then(() => setIsFullscreen(true))
        .catch(err => console.error(err));
    } else {
      document.exitFullscreen()
        .then(() => setIsFullscreen(false))
        .catch(err => console.error(err));
    }
  };

  // Fullscreen change listener to sync state
  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', onFullscreenChange);
    };
  }, []);

  const changeAspectRatio = () => {
    if (aspectRatio === 'fit') setAspectRatio('fill');
    else if (aspectRatio === 'fill') setAspectRatio('stretch');
    else setAspectRatio('fit');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(channel.url);
    alert('Stream URL copied to clipboard! You can paste this in VLC Player or your own player app.');
  };

  // Get Aspect Ratio classes
  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case 'fill':
        return 'w-full h-full object-cover';
      case 'stretch':
        return 'w-full h-full object-fill';
      case 'fit':
      default:
        return 'w-full h-full object-contain';
    }
  };

  return (
    <div 
      className="relative flex flex-col w-full bg-black rounded-2xl overflow-hidden shadow-2xl border border-neutral-800 group"
      id="live-tv-player-container"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      {/* Video Content */}
      <div className="relative flex-1 aspect-video w-full bg-zinc-950 flex items-center justify-center overflow-hidden">
        <video
          ref={videoRef}
          className={`${getAspectRatioClass()} transition-all duration-350`}
          playsInline
          onClick={togglePlay}
        />

        {/* Buffering Indicator Overlay */}
        {isBuffering && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-xs z-20">
            <div className="relative w-16 h-16 flex items-center justify-center">
              <div className="absolute inset-0 border-4 border-dashed border-red-500 rounded-full animate-spin"></div>
              <Tv className="w-6 h-6 text-red-500 animate-pulse" />
            </div>
            <span className="mt-4 font-sans text-sm font-medium text-neutral-300">
              Channelling Stream... Please wait
            </span>
          </div>
        )}

        {/* Error Overlay */}
        {errorMsg && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950/95 backdrop-blur-md p-6 text-center z-30">
            <AlertCircle className="w-14 h-14 text-yellow-500 mb-4 animate-bounce" />
            <h3 className="text-lg font-bold text-white mb-2">Stream Load Interrupted</h3>
            <p className="text-sm font-sans text-neutral-400 max-w-md mb-6 leading-relaxed">
              {errorMsg}
            </p>
            
            {corsWarning && (
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3 mb-6 max-w-md text-left text-xs text-amber-300 leading-normal mb-6 flex gap-2">
                <HelpCircle className="w-5 h-5 shrink-0" />
                <span>
                  Many broadcast streams enforce strict CORS/security frameworks. 
                  Try downloading a <strong>CORS Unblock Extension</strong> for your browser, 
                  load a custom M3U, or choose one of our <strong>Stable Nature Streams</strong> on the side menu!
                </span>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={initPlayer}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 font-sans text-sm font-semibold rounded-xl text-white transition shadow-lg hover:shadow-red-600/20 active:scale-95 cursor-pointer flex items-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4" /> Retry Stream
              </button>
              
              <button
                onClick={handleCopyLink}
                className="px-5 py-2.5 bg-neutral-800 hover:bg-neutral-700 font-sans text-sm rounded-xl text-neutral-200 transition cursor-pointer"
              >
                Copy URL for VLC
              </button>

              {onPlayNextFallback && (
                <button
                  onClick={onPlayNextFallback}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 font-sans text-sm font-semibold rounded-xl text-white transition shadow-lg hover:shadow-emerald-600/20 active:scale-95 cursor-pointer flex items-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4" /> Try Stable Oceans Feed
                </button>
              )}
            </div>
          </div>
        )}

        {/* Live HUD Watermark (Upper Right Corner) */}
        {!errorMsg && (
          <div className="absolute top-4 right-4 flex items-center gap-2 z-10 pointer-events-none select-none">
            {isLive && (
              <span className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold bg-red-600 text-white rounded-full uppercase tracking-wider animate-pulse shadow-md">
                <span className="w-1.5 h-1.5 bg-white rounded-full"></span> Live
              </span>
            )}
            <span className="px-2.5 py-1 text-xs font-mono font-medium bg-black/60 text-neutral-300 rounded-md backdrop-blur-xs">
              M3U Stream
            </span>
          </div>
        )}

        {/* Big Middle Hover Play Button */}
        {!errorMsg && !isBuffering && !isPlaying && (
          <button 
            type="button"
            onClick={togglePlay}
            className="absolute z-10 w-16 h-16 flex items-center justify-center rounded-full bg-red-600 hover:bg-red-700 text-white shadow-xl hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer"
          >
            <Play className="w-7 h-7 fill-white translate-x-0.5" />
          </button>
        )}

        {/* Player Controls Bar */}
        <div className={`absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/95 via-black/80 to-transparent p-4 flex flex-col gap-3 transition-opacity duration-300 z-10 ${showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <div className="flex items-center justify-between gap-4">
            
            {/* Play/Pause & Volume */}
            <div className="flex items-center gap-3">
              <button 
                onClick={togglePlay}
                className="p-2 text-white hover:bg-white/10 rounded-lg transition active:scale-95 cursor-pointer"
              >
                {isPlaying ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white" />}
              </button>

              <button 
                onClick={toggleMute}
                className="p-2 text-white hover:bg-white/10 rounded-lg transition active:scale-95 cursor-pointer"
              >
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>

              <input 
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-16 md:w-24 accent-red-600 h-1 rounded-lg cursor-pointer max-md:hidden"
              />

              <span className="text-[11px] font-mono font-medium text-neutral-400">
                {isLive ? '00:00 / LIVE' : 'STREAM'}
              </span>
            </div>

            {/* Title display */}
            <span className="hidden md:block text-xs font-sans text-neutral-300 font-medium truncate max-w-xs xl:max-w-md">
              Watching: <strong className="text-red-500 font-semibold">{channel.name}</strong>
            </span>

            {/* Quick Actions */}
            <div className="flex items-center gap-1">
              {/* Aspect Ratio Toggle */}
              <button
                onClick={changeAspectRatio}
                title={`Aspect Ratio: ${aspectRatio}`}
                className="p-2 text-neutral-300 hover:text-white hover:bg-white/10 rounded-lg transition active:scale-95 cursor-pointer flex items-center gap-1"
              >
                <Tv className="w-5 h-5" />
                <span className="text-[10px] font-mono uppercase bg-neutral-800 text-neutral-300 px-1 rounded transform scale-90">{aspectRatio}</span>
              </button>

              {/* Refresh / Reconnect */}
              <button 
                onClick={initPlayer}
                title="Reconnect broadcast stream"
                className="p-2 text-neutral-300 hover:text-white hover:bg-white/10 rounded-lg transition active:scale-95 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              {/* Fullscreen Toggle */}
              <button 
                onClick={toggleFullscreen}
                className="p-2 text-white hover:bg-white/10 rounded-lg transition active:scale-95 cursor-pointer"
              >
                {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Under Player info segment */}
      <div className="bg-zinc-900 border-t border-neutral-800 p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-red-600/15 border border-red-500/20 flex items-center justify-center shrink-0">
            <Tv className="w-6 h-6 text-red-500 animate-pulse" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base font-bold text-white truncate max-w-[200px] sm:max-w-xs">{channel.name}</h2>
              {channel.country && (
                <span className="px-1.5 py-0.5 text-[10px] font-medium bg-neutral-800 text-neutral-400 rounded">
                  {channel.country}
                </span>
              )}
            </div>
            <p className="text-xs text-neutral-400 font-sans flex items-center gap-1.5 truncate mt-0.5" title={channel.url}>
              Category: <span className="text-neutral-300 uppercase tracking-wide font-semibold text-[10px] bg-red-950/40 text-red-400 border border-red-900/30 px-1.5 py-0.5 rounded-sm">{channel.category}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-neutral-950 px-3.5 py-2 rounded-xl border border-neutral-800 shrink-0">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></div>
          <span className="text-xs font-sans text-neutral-300">
            Auto-tuning enabled • <span className="font-semibold text-emerald-400">100% active</span>
          </span>
        </div>
      </div>
    </div>
  );
}
