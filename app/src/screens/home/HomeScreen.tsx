import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { ScreenContainer } from '../../components/ScreenContainer';
import { TextField } from '../../components/TextField';
import { PrimaryButton } from '../../components/PrimaryButton';
import { Logo } from '../../components/Logo';
import { color, font, radius, spacing } from '../../constants/theme';
import { useAuthStore } from '../../store/authStore';
import { MainTabsParamList, RootStackParamList } from '../../navigation/types';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabsParamList, 'Home'>,
  NativeStackScreenProps<RootStackParamList>
>;

interface QuickAction {
  key: 'airport' | 'hourly' | 'business' | 'longDistance';
  title: string;
  subtitle: string;
}

const ACTIONS: QuickAction[] = [
  { key: 'airport', title: 'Aéroport BRU', subtitle: 'Transferts garantis 24/7' },
  { key: 'hourly', title: 'Chauffeur à l’heure', subtitle: 'Disposition 3h, 5h, 8h' },
  { key: 'business', title: 'Moveo Business', subtitle: 'Comptes entreprise' },
  { key: 'longDistance', title: 'Longue distance', subtitle: 'Belgique · Europe' },
];

export function HomeScreen({ navigation }: Props): React.ReactElement {
  const user = useAuthStore((s) => s.user);
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');

  const startBooking = () => {
    navigation.navigate('Booking', {
      screen: 'BookingOrigin',
      params: { origin, destination },
    });
  };

  return (
    <ScreenContainer scroll>
      <View style={styles.header}>
        <Logo />
        <Text style={styles.hello}>Bonjour {user?.firstName ?? ''}</Text>
      </View>

      <Text style={styles.title}>Où allons-nous ?</Text>

      <View style={styles.card}>
        <TextField
          leadingDot="gold"
          placeholder="Adresse de départ"
          value={origin}
          onChangeText={setOrigin}
          containerStyle={styles.field}
        />
        <View style={styles.divider} />
        <TextField
          leadingDot="muted"
          placeholder="Destination"
          value={destination}
          onChangeText={setDestination}
          containerStyle={styles.field}
        />
        <PrimaryButton
          label="Calculer le tarif"
          onPress={startBooking}
          style={styles.cta}
        />
      </View>

      <Text style={styles.section}>Nos services</Text>
      <View style={styles.grid}>
        {ACTIONS.map((a) => (
          <Pressable
            key={a.key}
            onPress={startBooking}
            style={({ pressed }) => [styles.tile, pressed && styles.tilePressed]}
          >
            <View style={styles.tileBadge} />
            <Text style={styles.tileTitle}>{a.title}</Text>
            <Text style={styles.tileSubtitle}>{a.subtitle}</Text>
          </Pressable>
        ))}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
  },
  hello: { color: color.muted, fontSize: font.size.sm },
  title: {
    color: color.text,
    fontSize: font.size.xxl,
    fontWeight: font.weight.bold,
    marginBottom: spacing.lg,
  },
  card: {
    backgroundColor: color.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: color.border,
    padding: spacing.lg,
    gap: spacing.md,
  },
  field: { gap: 0 },
  divider: { height: 1, backgroundColor: color.border, marginVertical: spacing.xs },
  cta: { marginTop: spacing.sm },
  section: {
    color: color.muted,
    fontSize: font.size.xs,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginTop: spacing.xxl,
    marginBottom: spacing.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  tile: {
    width: '47.5%',
    flexGrow: 1,
    backgroundColor: color.surface,
    borderColor: color.border,
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.sm,
    minHeight: 120,
  },
  tilePressed: { borderColor: color.gold },
  tileBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: color.primary,
    borderWidth: 1,
    borderColor: color.gold,
  },
  tileTitle: { color: color.text, fontSize: font.size.md, fontWeight: font.weight.semibold },
  tileSubtitle: { color: color.muted, fontSize: font.size.sm },
});
