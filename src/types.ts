export interface TvChannel {
  id: string;
  name: string;
  url: string;
  category: string;
  country?: string;
  logo?: string;
  isFavorite?: boolean;
  isCustom?: boolean;
}

export interface ChatMessage {
  id: string;
  user: string;
  text: string;
  timestamp: string;
  avatarColor: string;
  isUser?: boolean;
}

export type CategoryType = 'ALL' | 'FAVORITES' | 'CUSTOM' | 'ESPN' | 'FOX SPORTS' | 'DAZN' | 'WIN SPORTS' | 'BEIN SPORT' | 'OTHERS';
