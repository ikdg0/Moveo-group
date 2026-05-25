import { create } from 'zustand';
import { MMKV } from 'react-native-mmkv';
import { Appearance } from 'react-native';
import { ThemeMode } from '../constants/theme';

const storage = new MMKV({ id: 'moveo-prefs' });
const THEME_KEY = 'theme.mode';

function getInitialMode(): ThemeMode {
  const saved = storage.getString(THEME_KEY) as ThemeMode | undefined;
  if (saved === 'dark' || saved === 'light') return saved;
  return Appearance.getColorScheme() === 'light' ? 'light' : 'dark';
}

interface ThemeState {
  mode: ThemeMode;
  toggle: () => void;
  setMode: (mode: ThemeMode) => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  mode: getInitialMode(),
  toggle: () =>
    set((s) => {
      const next: ThemeMode = s.mode === 'dark' ? 'light' : 'dark';
      storage.set(THEME_KEY, next);
      return { mode: next };
    }),
  setMode: (mode) => {
    storage.set(THEME_KEY, mode);
    set({ mode });
  },
}));
