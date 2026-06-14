import { TvChannel } from './types';

export const INITIAL_CHANNELS: TvChannel[] = [
  {
    id: 'bein-extra',
    name: 'BeIn Sports Extra',
    url: 'https://bein-esp-xumo.amagi.tv/playlistR1080p.m3u8',
    category: 'BEIN SPORT',
    logo: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=100&auto=format&fit=crop&q=60',
    country: 'USA'
  },
  {
    id: 'real-madrid-tv',
    name: 'Real Madrid TV',
    url: 'https://rmtv.akamaized.net/hls/live/2043153/rmtv-es-web/bitrate_3.m3u8',
    category: 'OTHERS',
    logo: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=100&auto=format&fit=crop&q=60',
    country: 'Spain'
  },
  {
    id: 'red-bull-tv',
    name: 'Red Bull TV Live',
    url: 'https://rbmn-live.akamaized.net/hls/live/590964/BoRB-AT/master.m3u8',
    category: 'OTHERS',
    logo: 'https://images.unsplash.com/photo-1567558061911-83d4c96a7acd?w=100&auto=format&fit=crop&q=60',
    country: 'Global'
  },
  {
    id: 'espn-lat',
    name: 'ESPN LAT',
    url: 'http://181.191.141.7/Live/51334cbb88db0e050c59ef2d28c53491/local-espnlat_720.m3u8',
    category: 'ESPN',
    logo: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=100&auto=format&fit=crop&q=60',
    country: 'Latin America'
  },
  {
    id: 'espn-arg',
    name: 'ESPN Argentina',
    url: 'http://181.191.141.7/Live/51334cbb88db0e050c59ef2d28c53491/local-espnar_lng.m3u8',
    category: 'ESPN',
    logo: 'https://images.unsplash.com/photo-1541252260730-0412e8e2108e?w=100&auto=format&fit=crop&q=60',
    country: 'Argentina'
  },
  {
    id: 'espn-2',
    name: 'ESPN 2',
    url: 'http://181.191.141.7/Live/51334cbb88db0e050c59ef2d28c53491/local-espn2ar_lng.m3u8',
    category: 'ESPN',
    logo: 'https://images.unsplash.com/photo-1594470117754-e347f27a3cb8?w=100&auto=format&fit=crop&q=60',
    country: 'Latin America'
  },
  {
    id: 'espn-3',
    name: 'ESPN 3',
    url: 'http://181.191.141.7/Live/51334cbb88db0e050c59ef2d28c53491/local-espn3ar_lng.m3u8',
    category: 'ESPN',
    logo: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=100&auto=format&fit=crop&q=60',
    country: 'Latin America'
  },
  {
    id: 'tnt-sports-arg',
    name: 'TNT Sports ARG',
    url: 'https://1nyaler.streamhostingcdn.top/stream/30/index.m3u8',
    category: 'OTHERS',
    logo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=100&auto=format&fit=crop&q=60',
    country: 'Argentina'
  },
  {
    id: 'tyc-sports-arg',
    name: 'TyC Sports ARG',
    url: 'https://1nyaler.streamhostingcdn.top/stream/84/index.m3u8',
    category: 'OTHERS',
    logo: 'https://images.unsplash.com/photo-1484482360111-e402c55d1487?w=100&auto=format&fit=crop&q=60',
    country: 'Argentina'
  },
  {
    id: 'fox-sports-1',
    name: 'Fox Sports Argentina',
    url: 'http://181.191.141.7/Live/51334cbb88db0e050c59ef2d28c53491/local-fox1ar_720.m3u8',
    category: 'FOX SPORTS',
    logo: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=100&auto=format&fit=crop&q=60',
    country: 'Argentina'
  },
  {
    id: 'fox-sports-2',
    name: 'Fox Sports 2',
    url: 'http://181.191.141.7/Live/51334cbb88db0e050c59ef2d28c53491/local-fox2ar.playlist.m3u8',
    category: 'FOX SPORTS',
    logo: 'https://images.unsplash.com/photo-1518063319789-7217e6706b04?w=100&auto=format&fit=crop&q=60',
    country: 'Latin America'
  },
  {
    id: 'dazn-1',
    name: 'DAZN 1',
    url: 'http://znty.dyndns.org:5010/hls/eleven1.m3u8',
    category: 'DAZN',
    logo: 'https://images.unsplash.com/photo-1471341971476-ae15ff5dd4ea?w=100&auto=format&fit=crop&q=60',
    country: 'Europe'
  },
  {
    id: 'dazn-2',
    name: 'DAZN 2',
    url: 'http://znty.dyndns.org:5010/hls/eleven2.m3u8',
    category: 'DAZN',
    logo: 'https://images.unsplash.com/photo-1551958219-acbc608c6377?w=100&auto=format&fit=crop&q=60',
    country: 'Europe'
  },
  {
    id: 'eurosport-1',
    name: 'Eurosport 1',
    url: 'https://tv.topmediatv.net:25463/live/TopMediaWeb/bOteTR8ED1/618.m3u8',
    category: 'BEIN SPORT',
    logo: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=100&auto=format&fit=crop&q=60',
    country: 'Europe'
  },
  {
    id: 'eurosport-2',
    name: 'Eurosport 2',
    url: 'https://tv.topmediatv.net:25463/live/TopMediaWeb/bOteTR8ED1/619.m3u8',
    category: 'BEIN SPORT',
    logo: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=100&auto=format&fit=crop&q=60',
    country: 'Europe'
  },
  {
    id: 'win-sports-basic',
    name: 'Win Sports',
    url: 'http://181.78.17.52:8000/play/a0pw/index.m3u8',
    category: 'WIN SPORTS',
    logo: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=100&auto=format&fit=crop&q=60',
    country: 'Colombia'
  },
  {
    id: 'win-sports-plus',
    name: 'Win Sports PLUS',
    url: 'http://190.60.37.154:45000/play/a00q/index.m3u8',
    category: 'WIN SPORTS',
    logo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=100&auto=format&fit=crop&q=60',
    country: 'Colombia'
  },
  {
    id: 'tudn-usa',
    name: 'TUDN USA',
    url: 'http://m3u.tvcluboficial.com/m/m/957.m3u8',
    category: 'OTHERS',
    logo: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=100&auto=format&fit=crop&q=60',
    country: 'USA'
  }
];

export const FALLBACK_CHANNELS: TvChannel[] = [
  {
    id: 'test-sintel',
    name: 'Sintel Stream (Stable Testing HLS)',
    url: 'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8',
    category: 'OTHERS',
    logo: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=100&auto=format&fit=crop&q=60',
    country: 'Global'
  },
  {
    id: 'test-big-buck',
    name: 'Big Buck Bunny (Stable Testing HLS)',
    url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    category: 'OTHERS',
    logo: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=100&auto=format&fit=crop&q=60',
    country: 'Global'
  },
  {
    id: 'oceans-hls',
    name: 'Oceans Nature Stream (Stable Testing HLS)',
    url: 'https://playertest.longtailvideo.com/adaptive/oceans/oceans.m3u8',
    category: 'OTHERS',
    logo: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=100&auto=format&fit=crop&q=60',
    country: 'Global'
  }
];

export const ALL_DEFAULT_CHANNELS = [...INITIAL_CHANNELS, ...FALLBACK_CHANNELS];

export const SIMULATED_CHAT_MESSAGES_TEMPLATES = [
  "Wow, clean streaming! 🚀",
  "Is this match live? Who is winning?",
  "GOAL!!!!!! What a shot!",
  "Nice quality, no buffering so far. Thanks!",
  "Anyone else getting lag? Ah wait, refreshed and it's fine.",
  "Which country is this stream broadcasting from?",
  "Visca el Barca! 🔵🔴",
  "Madrid starting strong todaaay!! 🔥",
  "ESPN stream looks beautiful.",
  "Will they show Premier League after this?",
  "Incredible defense right there!",
  "Yellow card!! No way that was a foul!",
  "Commentary in Spanish is super energetic, love it!",
  "Great app layout by the way, love the dark theme.",
  "You can paste your own M3U playlist too, super cool feature!",
  "Does anyone have the schedule of tomorrow matches?",
  "This is a high quality feed for Eurosport.",
  "Vamossss!! 🙌",
  "Wow that was close!! Post saved them!",
  "Messi magic loading... 🐐",
  "Wait, penalty! Let's see if he scores.",
  "M3U stream is real-time, zero lag.",
  "Amazing match, truly unpredictable!",
  "What is the actual resolution? Looks like 1080p."
];

export const CHAT_USERNAMES = [
  "Striker99", "MessiFan_10", "GoalGetter", "SoccerManiac",
  "RonaldoCR7", "SportsLover", "HLS_Viewer", "SuperFan_Arg",
  "TechGuy90", "DaznStreamer", "MatchDayUltra", "PitchPerfect",
  "LiveTVSports", "GoldenBoot", "NetRippa", "TikiTakaElite"
];

export const AVATAR_COLORS = [
  "bg-red-500", "bg-blue-500", "bg-green-500", "bg-yellow-500",
  "bg-purple-500", "bg-pink-500", "bg-indigo-500", "bg-teal-500",
  "bg-orange-500", "bg-cyan-500"
];
