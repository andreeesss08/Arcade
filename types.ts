
export type GamePhase = 'setup' | 'loading' | 'reveal' | 'discuss' | 'finished';

export type GameModeId = 'classic' | 'chaos' | 'spy';

// Navigation State
export type AppView = 'hub' | 'impostor' | 'never_have_i_ever' | 'most_likely' | 'word_bomb' | 'confessions' | 'three_in_five' | 'would_you_rather';

export interface GameMode {
  id: GameModeId;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export interface Player {
  id: string;
  name: string;
  isImpostor: boolean;
  hasViewedRole: boolean;
  word?: string; // For Spy mode where impostors get a specific word
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  promptKey: string;
}

export interface GameState {
  players: Player[];
  phase: GamePhase;
  secretWord: string;
  fakeWord?: string; // The word for impostors in Spy mode
  gameMode: GameModeId;
  currentCategory: Category | null;
  winner: 'impostor' | 'citizens' | null;
  startingPlayerId?: string;
  roundKey: number;
  impostorHints: boolean; // Toggle for showing category to impostor
  impostorSpecificHint?: string; // Specific sub-category returned by AI for General mode
}

export const GAME_MODES: GameMode[] = [
  { 
    id: 'classic', 
    name: 'Clásico', 
    description: 'Los Impostores saben que lo son. Los ciudadanos tienen la palabra.', 
    icon: '🕵️',
    color: 'from-purple-500 to-indigo-600'
  },
  { 
    id: 'spy', 
    name: 'El Espía', 
    description: 'El Impostor recibe una palabra TOTALMENTE DIFERENTE. ¡A ver cómo disimula!', 
    icon: '🎭',
    color: 'from-pink-500 to-rose-600'
  },
  { 
    id: 'chaos', 
    name: 'Caos Total', 
    description: 'Solo 1 persona sabe la palabra. El resto son impostores intentando fingir.', 
    icon: '🤯',
    color: 'from-orange-500 to-red-600'
  }
];

export const CATEGORIES: Category[] = [
  { id: 'general', name: 'General', icon: '🎲', promptKey: 'objetos cotidianos, conceptos generales o lugares comunes' },
  { id: 'famous', name: 'Famosos', icon: '🌟', promptKey: 'famosos mundialmente conocidos (actores, cantantes, influencers, políticos)' },
  { id: 'movies', name: 'Cine y Series', icon: '🎬', promptKey: 'películas, series de TV o personajes de ficción populares' },
  { id: 'tv', name: 'TV y Shows', icon: '📺', promptKey: 'programas de televisión, reality shows, dibujos animados o concursos' },
  { id: 'sports', name: 'Deportes', icon: '⚽', promptKey: 'deportes, deportistas famosos (fútbol, baloncesto, tenis, etc.) o equipos' },
  { id: 'food', name: 'Comida', icon: '🍔', promptKey: 'comidas, platos típicos, frutas o ingredientes' },
  { id: 'places', name: 'Lugares', icon: '🌍', promptKey: 'países, ciudades turísticas o monumentos famosos' },
  { id: 'animals', name: 'Animales', icon: '🦁', promptKey: 'animales conocidos' },
  { id: 'music', name: 'Música', icon: '🎵', promptKey: 'instrumentos musicales, géneros, bandas o cantantes famosos' },
  { id: 'history', name: 'Historia', icon: '🏛️', promptKey: 'personajes históricos, eventos históricos o imperios antiguos' },
];
