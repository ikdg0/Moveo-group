import React, { useState } from 'react';
import { Alert, View, Text } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScreenContainer } from '../../components/ScreenContainer';
import { TextField } from '../../components/TextField';
import { PrimaryButton } from '../../components/PrimaryButton';
import { useTheme } from '../../hooks/useTheme';
import { BookingStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<BookingStackParamList, 'BookingOrigin'>;

export function BookingOriginScreen({ navigation, route }: Props): React.ReactElement {
  const { color, font, spacing } = useTheme();
  const [origin,      setOrigin]      = useState(route.params?.origin ?? '');
  const [destination, setDestination] = useState(route.params?.destination ?? '');

  const next = () => {
    if (!origin.trim()) { Alert.alert('Adresse de départ requise'); return; }
    navigation.navigate('BookingDetails', { origin: origin.trim(), destination: destination.trim() });
  };

  return (
    <ScreenContainer scroll>
      <View style={{ paddingTop: spacing.lg, paddingBottom: spacing.xl, gap: spacing.xs }}>
        <Text style={{ color: color.gold, fontSize: font.size.xs, letterSpacing: 2, textTransform: 'uppercase' }}>Étape 1 sur 4</Text>
        <Text style={{ color: color.text, fontSize: font.size.xxl, fontWeight: font.weight.bold }}>Point de départ</Text>
        <Text style={{ color: color.muted, fontSize: font.size.md }}>Saisissez l'adresse complète.</Text>
      </View>
      <View style={{ gap: spacing.md, marginBottom: spacing.xl }}>
        <TextField label="Départ"                   leadingDot="gold"  placeholder="Avenue Louise 200, Bruxelles" value={origin}      onChangeText={setOrigin}      autoFocus />
        <TextField label="Destination (optionnel)"  leadingDot="muted" placeholder="Aéroport BRU"                value={destination} onChangeText={setDestination} />
      </View>
      <PrimaryButton label="Continuer" onPress={next} />
    </ScreenContainer>
  );
}
