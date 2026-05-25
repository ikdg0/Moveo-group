import React, { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScreenContainer } from '../../components/ScreenContainer';
import { TextField } from '../../components/TextField';
import { PrimaryButton } from '../../components/PrimaryButton';
import { color, font, spacing } from '../../constants/theme';
import { BookingStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<BookingStackParamList, 'BookingOrigin'>;

export function BookingOriginScreen({ navigation, route }: Props): React.ReactElement {
  const [origin, setOrigin] = useState(route.params?.origin ?? '');
  const [destination, setDestination] = useState(route.params?.destination ?? '');

  const next = () => {
    if (!origin.trim()) {
      Alert.alert('Adresse de départ requise', 'Indiquez d’où nous devons venir vous chercher.');
      return;
    }
    navigation.navigate('BookingDetails', {
      origin: origin.trim(),
      destination: destination.trim(),
    });
  };

  return (
    <ScreenContainer scroll>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Étape 1 sur 4</Text>
        <Text style={styles.title}>Point de départ</Text>
        <Text style={styles.subtitle}>
          Saisissez l’adresse complète. Vous pourrez l’ajuster avant confirmation.
        </Text>
      </View>

      <View style={styles.form}>
        <TextField
          label="Départ"
          leadingDot="gold"
          placeholder="Avenue Louise 200, Bruxelles"
          value={origin}
          onChangeText={setOrigin}
          autoFocus
        />
        <TextField
          label="Destination (optionnel ici)"
          leadingDot="muted"
          placeholder="Aéroport BRU"
          value={destination}
          onChangeText={setDestination}
        />
      </View>

      <PrimaryButton label="Continuer" onPress={next} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: { paddingTop: spacing.lg, paddingBottom: spacing.xl, gap: spacing.xs },
  eyebrow: {
    color: color.gold,
    fontSize: font.size.xs,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  title: { color: color.text, fontSize: font.size.xxl, fontWeight: font.weight.bold },
  subtitle: { color: color.muted, fontSize: font.size.md },
  form: { gap: spacing.md, marginBottom: spacing.xl },
});
