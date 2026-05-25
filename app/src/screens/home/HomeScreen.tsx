import React, { useState } from 'react';
import { Pressable, View, Text } from 'react-native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScreenContainer } from '../../components/ScreenContainer';
import { TextField } from '../../components/TextField';
import { PrimaryButton } from '../../components/PrimaryButton';
import { Logo } from '../../components/Logo';
import { useTheme } from '../../hooks/useTheme';
import { useAuthStore } from '../../store/authStore';
import { MainTabsParamList, RootStackParamList } from '../../navigation/types';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabsParamList, 'Home'>,
  NativeStackScreenProps<RootStackParamList>
>;

const ACTIONS = [
  { key: 'airport',      title: 'Aéroport BRU',       subtitle: 'Transferts garantis 24/7' },
  { key: 'hourly',       title: 'Chauffeur à l\'heure', subtitle: 'Disposition 3h, 5h, 8h' },
  { key: 'business',     title: 'Moveo Business',      subtitle: 'Comptes entreprise' },
  { key: 'longDistance', title: 'Longue distance',     subtitle: 'Belgique · Europe' },
] as const;

export function HomeScreen({ navigation }: Props): React.ReactElement {
  const { color, font, radius, spacing } = useTheme();
  const user = useAuthStore((s) => s.user);
  const [origin,      setOrigin]      = useState('');
  const [destination, setDestination] = useState('');

  const startBooking = () => navigation.navigate('Booking', { screen: 'BookingOrigin', params: { origin, destination } });

  return (
    <ScreenContainer scroll>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: spacing.md, paddingBottom: spacing.xl }}>
        <Logo />
        <Text style={{ color: color.muted, fontSize: font.size.sm }}>Bonjour {user?.firstName ?? ''}</Text>
      </View>

      <Text style={{ color: color.text, fontSize: font.size.xxl, fontWeight: font.weight.bold, marginBottom: spacing.lg }}>Où allons-nous ?</Text>

      <View style={{ backgroundColor: color.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: color.border, padding: spacing.lg, gap: spacing.md }}>
        <TextField leadingDot="gold" placeholder="Adresse de départ" value={origin} onChangeText={setOrigin} />
        <View style={{ height: 1, backgroundColor: color.border }} />
        <TextField leadingDot="muted" placeholder="Destination" value={destination} onChangeText={setDestination} />
        <PrimaryButton label="Calculer le tarif" onPress={startBooking} style={{ marginTop: spacing.sm }} />
      </View>

      <Text style={{ color: color.muted, fontSize: font.size.xs, letterSpacing: 2, textTransform: 'uppercase', marginTop: spacing.xxl, marginBottom: spacing.md }}>Nos services</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md }}>
        {ACTIONS.map((a) => (
          <Pressable key={a.key} onPress={startBooking}
            style={({ pressed }) => ({
              width: '47.5%', flexGrow: 1,
              backgroundColor: color.surface, borderColor: pressed ? color.gold : color.border,
              borderWidth: 1, borderRadius: radius.lg, padding: spacing.lg,
              gap: spacing.sm, minHeight: 120, opacity: pressed ? 0.9 : 1,
            })}>
            <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: color.background, borderWidth: 1, borderColor: color.gold }} />
            <Text style={{ color: color.text, fontSize: font.size.md, fontWeight: font.weight.semibold }}>{a.title}</Text>
            <Text style={{ color: color.muted, fontSize: font.size.sm }}>{a.subtitle}</Text>
          </Pressable>
        ))}
      </View>
    </ScreenContainer>
  );
}
