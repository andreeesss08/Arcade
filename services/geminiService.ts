import { GoogleGenAI } from "@google/genai";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- MEMORY HISTORY TO PREVENT REPEATS IN SESSION ---
const HISTORY = {
  bomb: new Set<string>(),
  mostLikely: new Set<string>(),
  never: new Set<string>(),
  confessions: new Set<string>(),
  threeInFive: new Set<string>(),
  wyr: new Set<string>()
};

// Helper to get a random item that hasn't been used yet
const getUniqueItem = (list: string[], historySet: Set<string>): string => {
  // Filter items that are NOT in history
  const available = list.filter(item => !historySet.has(item));
  
  // If we used all items, clear history and start over
  if (available.length === 0) {
    historySet.clear();
    const newItem = list[Math.floor(Math.random() * list.length)];
    historySet.add(newItem);
    return newItem;
  }
  
  // Pick random from available only
  const item = available[Math.floor(Math.random() * available.length)];
  historySet.add(item);
  return item;
};

// --- LISTAS DE RESERVA COMPLETAS ---
const FALLBACK_WORDS: Record<string, string[]> = {
  famous: ['Elon Musk', 'Einstein', 'Shakira', 'Messi', 'Cristiano Ronaldo', 'Donald Trump', 'Will Smith', 'Taylor Swift', 'Picasso', 'Cleopatra', 'Marilyn Monroe', 'Michael Jackson', 'Beyoncé', 'Zendaya', 'Tom Holland', 'Leonardo DiCaprio', 'Frida Kahlo', 'Bad Bunny', 'Rosalía', 'Ibai Llanos', 'Kim Kardashian', 'Brad Pitt', 'Angelina Jolie', 'Freddie Mercury', 'Elvis Presley', 'Gordon Ramsay', 'Steve Jobs', 'Mark Zuckerberg', 'Putin', 'Barack Obama', 'Reina Isabel II', 'Lady Gaga', 'Rihanna', 'Tom Cruise', 'Johnny Depp', 'Jennifer Lawrence'],
  movies: ['Harry Potter', 'Darth Vader', 'Joker', 'Spider-Man', 'Titanic', 'Avatar', 'Shrek', 'Batman', 'Toy Story', 'Matrix', 'El Padrino', 'Star Wars', 'Jurassic Park', 'Frozen', 'Los Vengadores', 'Barbie', 'Oppenheimer', 'Coco', 'El Rey León', 'Buscando a Nemo', 'Piratas del Caribe', 'Indiana Jones', 'Volver al Futuro', 'Pulp Fiction', 'El Señor de los Anillos', 'Forrest Gump', 'Gladiator', 'Iron Man', 'Thor', 'La Sirenita'],
  tv: ['Los Simpson', 'Juego de Tronos', 'Stranger Things', 'La Casa de Papel', 'Bob Esponja', 'Friends', 'Breaking Bad', 'MasterChef', 'El Juego del Calamar', 'Black Mirror', 'The Office', 'Rick y Morty', 'La que se avecina', 'Aquí no hay quien viva', 'El Hormiguero', 'Padre de Familia', 'South Park', 'Futurama', 'Pasapalabra', 'La Isla de las Tentaciones', 'Gran Hermano', 'Operación Triunfo', 'Peaky Blinders', 'The Crown', 'Narcos', 'Gossip Girl', 'Anatomía de Grey', 'Vikingos', 'The Mandalorian'],
  sports: ['Fútbol', 'Baloncesto', 'Tenis', 'Natación', 'Michael Jordan', 'Nadal', 'Estadio', 'Pelota de Golf', 'Fórmula 1', 'Boxeo', 'Karate', 'Surf', 'Voleibol', 'Escalada', 'Ciclismo', 'Fernando Alonso', 'Serena Williams', 'LeBron James', 'Tiger Woods', 'Usain Bolt', 'Maradona', 'Pelé', 'Copa del Mundo', 'Juegos Olímpicos', 'Gym', 'Crossfit', 'Padel', 'Rugby', 'Beisbol', 'Skate', 'Snowboard'],
  food: ['Pizza con piña', 'Sushi', 'Paella', 'Tacos', 'Hamburguesa', 'Helado', 'Chocolate', 'Brocoli', 'Espaguetis', 'Ceviche', 'Cruasán', 'Tortilla de patatas', 'Burrito', 'Ramen', 'Donut', 'Aguacate', 'Queso azul', 'Jamón Serrano', 'Churros', 'Gazpacho', 'Arepa', 'Empanada', 'Curry', 'Kebab', 'Ensalada César', 'Tiramisú', 'Cheesecake', 'Palomitas', 'Salchicha', 'Huevo frito', 'Bacon', 'Café', 'Croqueta', 'Lasaña'],
  places: ['Torre Eiffel', 'Muralla China', 'Machu Picchu', 'Egipto', 'Nueva York', 'Antártida', 'El Coliseo', 'Amazonas', 'Disneyland', 'Triángulo de las Bermudas', 'Monte Everest', 'Gran Cañón', 'Taj Mahal', 'Las Vegas', 'Chernobyl', 'Hollywood', 'Tokio', 'Londres', 'Dubai', 'Hawai', 'Bali', 'Roma', 'París', 'Polo Norte', 'Desierto del Sahara', 'Area 51', 'La Luna', 'Marte', 'Castillo de Drácula', 'Hogwarts'],
  animals: ['Ornitorrinco', 'Dragón de Komodo', 'Ajolote', 'Pingüino', 'Jirafa', 'Elefante', 'Perezoso', 'Tiburón', 'Canguro', 'Koala', 'Panda', 'Camaleón', 'Narval', 'Capibara', 'Nutria', 'Suricata', 'Llama', 'Tigre', 'León', 'Gorila', 'Delfín', 'Ballena Azul', 'Águila', 'Búho', 'Murciélago', 'Cocodrilo', 'Serpiente', 'Rana', 'Pulpo', 'Medusa', 'Caballo de mar', 'Hámster', 'Mapache', 'Zorro'],
  music: ['Guitarra Eléctrica', 'Bad Bunny', 'Beethoven', 'Freddie Mercury', 'Piano', 'Batería', 'Micrófono', 'Violín', 'Reggaeton', 'Rosalía', 'The Beatles', 'K-Pop', 'BTS', 'Saxofón', 'DJ', 'Opera', 'Autotune', 'Shakira', 'Madonna', 'Eminem', 'Tupac', 'Mozart', 'Trompeta', 'Flauta', 'Concierto', 'Festival', 'Spotify', 'Vinilo', 'Auriculares', 'Karol G', 'Daddy Yankee'],
  history: ['Segunda Guerra Mundial', 'Imperio Romano', 'Napoleón', 'Descubrimiento de América', 'Revolución Francesa', 'Vikingos', 'Pirámides', 'Samurái', 'Titanic', 'Aterrizaje en la Luna', 'Muro de Berlín', 'Peste Negra', 'Gladiador', 'Reina Victoria', 'Cristóbal Colón', 'Julio César', 'Cleopatra', 'Guerra Civil', 'Hitler', 'Churchill', 'La Inquisición', 'Edad Media', 'Cavernícola', 'Dinosaurios', 'Revolución Industrial', 'Guerra Fría']
};

const GENERAL_FALLBACKS_STRUCTURED = [
  { word: 'Reloj de arena', hint: 'Medición de tiempo' },
  { word: 'Máquina del tiempo', hint: 'Ciencia Ficción' },
  { word: 'Dron', hint: 'Tecnología' },
  { word: 'Holograma', hint: 'Tecnología' },
  { word: 'Robot', hint: 'Tecnología' },
  { word: 'Imán', hint: 'Física' },
  { word: 'Brújula', hint: 'Navegación' },
  { word: 'Telescopio', hint: 'Astronomía' },
  { word: 'Mochila propulsora', hint: 'Transporte Aéreo' },
  { word: 'Lámpara mágica', hint: 'Fantasía' },
  { word: 'Espejo', hint: 'Objeto de Hogar' },
  { word: 'Caja fuerte', hint: 'Seguridad' },
  { word: 'Paraguas', hint: 'Accesorio' },
  { word: 'Prismáticos', hint: 'Óptica' },
  { word: 'Mapa del tesoro', hint: 'Aventura' },
  { word: 'Caleidoscopio', hint: 'Juguete Óptico' },
  { word: 'Bumerán', hint: 'Deporte/Juguete' },
  { word: 'Walkie-talkie', hint: 'Comunicación' },
  { word: 'Submarino', hint: 'Vehículo Acuático' },
  { word: 'Cuchara', hint: 'Cubierto' },
  { word: 'Microondas', hint: 'Electrodoméstico' },
  { word: 'Silla', hint: 'Mueble' },
  { word: 'Gafas de sol', hint: 'Accesorio' },
  { word: 'Semáforo', hint: 'Tráfico' },
  { word: 'Extintor', hint: 'Seguridad' },
  { word: 'Espada láser', hint: 'Ficción' },
  { word: 'Alfombra voladora', hint: 'Fantasía' },
  { word: 'Bola de cristal', hint: 'Adivinación' },
  { word: 'Detector de metales', hint: 'Herramienta' },
  { word: 'Tijeras', hint: 'Herramienta' },
  { word: 'Cepillo de dientes', hint: 'Higiene' },
  { word: 'Monopatín', hint: 'Transporte' },
  { word: 'Satélite', hint: 'Espacio' },
  { word: 'Momia', hint: 'Historia' },
  { word: 'Vampiro', hint: 'Monstruo' },
  { word: 'Unicornio', hint: 'Mitología' },
  { word: 'Sirena', hint: 'Mitología' }
];

const FALLBACK_PAIRS: Record<string, [string, string][]> = {
  general: [['Avión', 'Helicóptero'], ['Cuchara', 'Tenedor'], ['Zapato', 'Calcetín'], ['Luna', 'Sol'], ['Llave', 'Candado'], ['Silla', 'Sofá'], ['Gafas', 'Lupa'], ['Mesa', 'Escritorio'], ['Bolígrafo', 'Lápiz'], ['Coche', 'Moto'], ['Reloj', 'Pulsera'], ['Libro', 'Revista'], ['Ordenador', 'Tablet'], ['Vaso', 'Taza'], ['Puerta', 'Ventana'], ['Cama', 'Hamaca']],
  animals: [['León', 'Tigre'], ['Águila', 'Halcón'], ['Tiburón', 'Ballena'], ['Perro', 'Lobo'], ['Caballo', 'Burro'], ['Lobo', 'Zorro'], ['Mariposa', 'Abeja'], ['Gato', 'Pantera'], ['Elefante', 'Rinoceronte'], ['Oso', 'Panda']],
  food: [['Pizza', 'Pasta'], ['Manzana', 'Pera'], ['Agua', 'Refresco'], ['Pastel', 'Galleta'], ['Sal', 'Pimienta'], ['Café', 'Chocolate'], ['Limón', 'Lima'], ['Pan', 'Tostada'], ['Arroz', 'Cuscús'], ['Pollo', 'Pavo']],
  sports: [['Fútbol', 'Fútbol Sala'], ['Tenis', 'Padel'], ['Natación', 'Waterpolo'], ['Esquí', 'Snowboard'], ['Golf', 'Minigolf'], ['Baloncesto', 'Voleibol'], ['Rugby', 'Fútbol Americano']],
  default: [['Sol', 'Luna'], ['Libro', 'Cuaderno'], ['Coche', 'Camión'], ['Reloj', 'Cronómetro']]
};

const NEVER_FALLBACKS = {
  soft: ["Yo nunca he fingido estar enfermo.", "Yo nunca he buscado mi nombre en Google.", "Yo nunca he olvidado a qué iba a la cocina."],
  party: ["Yo nunca he besado a alguien en este grupo.", "Yo nunca he vomitado por beber.", "Yo nunca me he colado en una fiesta."],
  spicy: ["Yo nunca he hecho un trío.", "Yo nunca he mandado nudes.", "Yo nunca he tenido sexo en público."]
};

const CONFESSION_PROMPTS = [
  "Mi mayor miedo irracional",
  "Lo más ilegal que he hecho",
  "Mi gusto culposo (guilty pleasure)",
  "Lo más vergonzoso que me ha pasado",
  "Algo que odio y todo el mundo ama",
  "Mi peor cita romántica",
  "Una mentira que dije y nunca confesé",
  "El lugar más raro donde me he dormido",
  "Lo más caro que he roto",
  "Mi sueño frustrado",
  "Algo que robaría si fuera invisible",
  "La comida más rara que he probado",
  "Mi celebrity crush secreto",
  "Lo que haría con 1 millón de euros",
  "Mi hábito más asqueroso"
];

const THREE_IN_FIVE_CATEGORIES = [
  "3 Marcas de coches", "3 Cosas que encuentras en un baño", "3 Animales que vuelan", 
  "3 Nombres de mujer con M", "3 Ingredientes de pizza", "3 Superhéroes", 
  "3 Capitales de Europa", "3 Cosas rojas", "3 Deportes de equipo", 
  "3 Frutas amarillas", "3 Villanos de Disney", "3 Cosas que explotan",
  "3 Marcas de chocolate", "3 Cosas que flotan", "3 Partes del cuerpo",
  "3 Objetos de madera", "3 Cosas que huelen mal", "3 Nombres de perro",
  "3 Países de Asia", "3 Cosas que llevas a la playa"
];

const WYR_SCENARIOS = [
  "¿Perder una mano o perder un pie?",
  "¿Saber cómo vas a morir o cuándo vas a morir?",
  "¿Vivir sin internet o vivir sin música?",
  "¿Ser siempre el más listo de la sala o el más guapo?",
  "¿Tener un botón de rebobinar vida o un botón de pausa?",
  "¿Luchar contra 100 caballos tamaño pato o 1 pato tamaño caballo?",
  "¿Comer solo pizza el resto de tu vida o solo hamburguesas?",
  "¿Poder volar o poder ser invisible?",
  "¿Tener dinero infinito pero estar solo o ser pobre pero muy querido?",
  "¿No poder mentir nunca o no poder hablar nunca?",
  "¿Llegar siempre 1 hora antes o 1 hora tarde?",
  "¿Tener hipo el resto de tu vida o sentir que vas a estornudar y no salga?",
  "¿Vivir en el pasado o en el futuro?"
];

const MOST_LIKELY_FALLBACKS = [
    "¿Quién es más probable que sobreviva a un apocalipsis zombie?",
    "¿Quién es más probable que se haga famoso por accidente?",
    "¿Quién es más probable que acabe en la cárcel?",
    "¿Quién es más probable que se case primero?",
    "¿Quién es más probable que llore en una película?",
    "¿Quién es más probable que olvide el cumpleaños de su pareja?",
    "¿Quién es más probable que se gaste todo el sueldo en un día?",
    "¿Quién es más probable que tropiece en una alfombra roja?",
    "¿Quién es más probable que tenga más hijos?",
    "¿Quién es más probable que se mude a otro país?"
];

const BOMB_CATEGORIES = [
    "Marcas de ropa", "Nombres de países", "Animales mamíferos", "Comidas con A", 
    "Objetos de oficina", "Deportes olímpicos", "Frutas", "Partes del cuerpo", 
    "Marcas de coches", "Nombres de ciudades", "Instrumentos musicales", "Verbos en infinitivo",
    "Cosas que flotan", "Cosas de color rojo", "Palabras en inglés", "Nombres de mujer",
    "Cosas que se enchufan", "Superhéroes", "Villanos", "Sabores de helado"
];

const getFallbackByMode = (categoryId: string, mode: string) => {
    if (mode === 'spy') {
        const pairs = FALLBACK_PAIRS[categoryId] || FALLBACK_PAIRS['default'];
        const pair = pairs[Math.floor(Math.random() * pairs.length)];
        return { secretWord: pair[0], fakeWord: pair[1] };
    }
    
    if (categoryId === 'general') {
        const item = GENERAL_FALLBACKS_STRUCTURED[Math.floor(Math.random() * GENERAL_FALLBACKS_STRUCTURED.length)];
        return { secretWord: item.word, relatedCategory: item.hint };
    }
  
    const list = FALLBACK_WORDS[categoryId] || FALLBACK_WORDS['general'];
    const word = list[Math.floor(Math.random() * list.length)];
    return { secretWord: word };
};

export const generateGameWords = async (categoryPrompt: string, categoryId: string, mode: 'classic' | 'spy' | 'chaos') => {
    if (!process.env.API_KEY) {
        return getFallbackByMode(categoryId, mode);
    }
    
    try {
        const seed = Math.floor(Math.random() * 100000);
        let prompt = "";
        
        if (mode === 'spy') {
            prompt = `Genera 2 palabras muy relacionadas pero claramente distintas para el juego "El Espía".
            Categoría: ${categoryPrompt}.
            Formato de respuesta: "PalabraComun|PalabraEspia".
            Ejemplo: "Playa|Piscina" o "Guitarra|Violin".
            Semilla: ${seed}.
            Solo las palabras, separadas por barra vertical.`;
        } else {
            prompt = `Genera una palabra específica y divertida para el juego "Impostor".
            Categoría: ${categoryPrompt}.
            Semilla: ${seed}.
            Si la categoría es "General", devuelve también una subcategoría entre paréntesis. Ej: "Microondas (Electrodoméstico)".
            Respuesta corta.`;
        }
    
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { temperature: 1.5 }
        });
    
        const text = response.text?.trim();
        if (!text) throw new Error("No text");
    
        if (mode === 'spy') {
            const parts = text.split('|');
            if (parts.length >= 2) {
                return { secretWord: parts[0].trim(), fakeWord: parts[1].trim() };
            }
            throw new Error("Invalid spy format");
        }
    
        const match = text.match(/^(.+?)\s*\((.+)\)$/);
        if (match) {
            return { secretWord: match[1].trim(), relatedCategory: match[2].trim() };
        }
    
        return { secretWord: text };
    
    } catch (e) {
        console.error("Gemini Error:", e);
        return getFallbackByMode(categoryId, mode);
    }
};

export const generateNeverHaveIEverPhrase = async (mode: 'soft' | 'party' | 'spicy'): Promise<string> => {
    if (!process.env.API_KEY) {
        const list = NEVER_FALLBACKS[mode] || NEVER_FALLBACKS['party'];
        return getUniqueItem(list, HISTORY.never);
    }
    try {
        const seed = Math.floor(Math.random() * 100000);
        const prompt = `Genera una frase de "Yo nunca" para jugar con amigos.
        Modo: ${mode} (soft = inocente, party = fiesta/alcohol, spicy = atrevido/picante).
        Semilla: ${seed}.
        La frase debe empezar por "Yo nunca...".
        Respuesta corta.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { temperature: 1.6, maxOutputTokens: 30 }
        });

        const text = response.text?.trim();
        if (!text || HISTORY.never.has(text)) throw new Error("Duplicate or empty");
        HISTORY.never.add(text);
        return text;
    } catch (e) {
        const list = NEVER_FALLBACKS[mode] || NEVER_FALLBACKS['party'];
        return getUniqueItem(list, HISTORY.never);
    }
};

export const generateMostLikelyPhrase = async (): Promise<string> => {
    if (!process.env.API_KEY) {
        return getUniqueItem(MOST_LIKELY_FALLBACKS, HISTORY.mostLikely);
    }
    try {
        const seed = Math.floor(Math.random() * 100000);
        const prompt = `Genera una pregunta divertida de "¿Quién es más probable que...?" para un grupo de amigos.
        Semilla: ${seed}.
        Respuesta corta.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { temperature: 1.7, maxOutputTokens: 30 }
        });

        const text = response.text?.trim();
        if (!text || HISTORY.mostLikely.has(text)) throw new Error("Duplicate or empty");
        HISTORY.mostLikely.add(text);
        return text;
    } catch (e) {
        return getUniqueItem(MOST_LIKELY_FALLBACKS, HISTORY.mostLikely);
    }
};

export const generateBombCategory = async (): Promise<string> => {
    if (!process.env.API_KEY) {
        return getUniqueItem(BOMB_CATEGORIES, HISTORY.bomb);
    }
    try {
        const seed = Math.floor(Math.random() * 100000);
        const prompt = `Genera una categoría para un juego de palabras rápidas (tipo "Word Bomb" o "Patata Caliente").
        Ejemplos: "Marcas de coches", "Cosas que encuentras en el baño", "Frutas rojas".
        Semilla: ${seed}.
        Respuesta muy corta (2-5 palabras).`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { temperature: 1.6, maxOutputTokens: 15 }
        });

        const text = response.text?.trim();
        if (!text || HISTORY.bomb.has(text)) throw new Error("Duplicate or empty");
        HISTORY.bomb.add(text);
        return text;
    } catch (e) {
        return getUniqueItem(BOMB_CATEGORIES, HISTORY.bomb);
    }
};

export const generateConfessionPrompt = async (): Promise<string> => {
  if (!process.env.API_KEY) {
    return getUniqueItem(CONFESSION_PROMPTS, HISTORY.confessions);
  }
  try {
    const seed = Math.floor(Math.random() * 100000);
    const prompt = `Genera un tema para "Confesiones Anónimas" en grupo. Ej: "Mi mayor miedo". Semilla: ${seed}. Respuesta corta.`;
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { temperature: 1.7, maxOutputTokens: 20 }
    });
    const text = response.text?.trim();
    if (!text || HISTORY.confessions.has(text)) throw new Error("Duplicate");
    HISTORY.confessions.add(text);
    return text;
  } catch (e) {
    return getUniqueItem(CONFESSION_PROMPTS, HISTORY.confessions);
  }
};

export const generateThreeInFiveCategory = async (): Promise<string> => {
  if (!process.env.API_KEY) {
    return getUniqueItem(THREE_IN_FIVE_CATEGORIES, HISTORY.threeInFive);
  }
  try {
    const seed = Math.floor(Math.random() * 100000);
    const prompt = `Genera una categoría simple para el juego "Di 3 cosas en 5 segundos". Ej: "3 cosas verdes". Semilla: ${seed}. Respuesta corta.`;
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { temperature: 1.7, maxOutputTokens: 20 }
    });
    const text = response.text?.trim();
    if (!text || HISTORY.threeInFive.has(text)) throw new Error("Duplicate");
    HISTORY.threeInFive.add(text);
    return text;
  } catch (e) {
    return getUniqueItem(THREE_IN_FIVE_CATEGORIES, HISTORY.threeInFive);
  }
};

export const generateWouldYouRather = async (): Promise<[string, string]> => {
  if (!process.env.API_KEY) {
    const item = getUniqueItem(WYR_SCENARIOS, HISTORY.wyr);
    const parts = item.split(' o ');
    if (parts.length === 2) {
        return [parts[0].replace('¿', '').trim(), parts[1].replace('?', '').trim()];
    }
    return ["Ser invisible", "Poder volar"]; // Super fallback
  }
  try {
    const seed = Math.floor(Math.random() * 100000);
    const prompt = `Genera un dilema "Qué preferirías" difícil. Formato: "Opción A|Opción B". Semilla: ${seed}.`;
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { temperature: 1.8, maxOutputTokens: 40 }
    });
    const text = response.text?.trim();
    const parts = text?.split('|');
    if (!parts || parts.length !== 2) throw new Error("Format error");
    
    if (HISTORY.wyr.has(text)) throw new Error("Duplicate");
    HISTORY.wyr.add(text);
    return [parts[0].trim(), parts[1].trim()];
  } catch (e) {
    const item = getUniqueItem(WYR_SCENARIOS, HISTORY.wyr);
    const parts = item.split(' o ');
    return [parts[0].replace('¿', '').trim(), parts[1].replace('?', '').trim()];
  }
};
