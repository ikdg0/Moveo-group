import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../hooks/useTheme';

interface Props {
  children: React.ReactNode;
  scroll?: boolean;
  padded?: boolean;
  style?: ViewStyle;
  edges?: Array<'top' | 'bottom' | 'left' | 'right'>;
}

export function ScreenContainer({ children, scroll = false, padded = true, style, edges = ['top', 'left', 'right'] }: Props): React.ReactElement {
  const { color, spacing } = useTheme();
  const inner = (
    <View style={[{ flex: 1 }, padded && { paddingHorizontal: spacing.lg, paddingBottom: spacing.lg }, style]}>
      {children}
    </View>
  );
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: color.background }} edges={edges}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {scroll
          ? <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>{inner}</ScrollView>
          : inner
        }
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
