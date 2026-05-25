import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { color, spacing } from '../constants/theme';

interface Props {
  children: React.ReactNode;
  scroll?: boolean;
  padded?: boolean;
  style?: ViewStyle;
  edges?: Array<'top' | 'bottom' | 'left' | 'right'>;
}

export function ScreenContainer({
  children,
  scroll = false,
  padded = true,
  style,
  edges = ['top', 'left', 'right'],
}: Props): React.ReactElement {
  const inner = (
    <View
      style={[
        styles.inner,
        padded ? styles.padded : null,
        style,
      ]}
    >
      {children}
    </View>
  );
  return (
    <SafeAreaView style={styles.safe} edges={edges}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {scroll ? (
          <ScrollView
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {inner}
          </ScrollView>
        ) : (
          inner
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: color.primary },
  flex: { flex: 1 },
  scroll: { flexGrow: 1 },
  inner: { flex: 1 },
  padded: { paddingHorizontal: spacing.lg, paddingBottom: spacing.lg },
});
