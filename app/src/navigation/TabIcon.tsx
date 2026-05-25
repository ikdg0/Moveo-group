import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { color, font } from '../constants/theme';
import { MainTabsParamList } from './types';

const GLYPHS: Record<keyof MainTabsParamList, string> = {
  Home: '⌂',
  History: '◷',
  Support: '✱',
  Profile: '◉',
};

interface Props {
  name: keyof MainTabsParamList;
  focused: boolean;
}

export function TabIcon({ name, focused }: Props): React.ReactElement {
  return (
    <View style={styles.wrap}>
      <Text style={[styles.glyph, { color: focused ? color.gold : color.muted }]}>
        {GLYPHS[name]}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center', height: 28 },
  glyph: { fontSize: 22, fontWeight: font.weight.semibold },
});
