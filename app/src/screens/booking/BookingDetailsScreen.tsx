import React, { useMemo, useState } from 'react';
import { Alert, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScreenContainer } from '../../components/ScreenContainer';
import { TextField } from '../../components/TextField';
import { PrimaryButton } from '../../components/PrimaryButton';
import { StepBar } from '../../components/StepBar';
import { color, font, radius, spacing } from '../../constants/theme';
import { BookingStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<BookingStackParamList, 'BookingDetails'>;

function pad(n: number): string {
  return n.toString().padStart(2, '0');
}

function isoDate(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function isoTime(d: Date): string {
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function fmtDisplayDate(d: Date): string {
  return d.toLocaleDateString('fr-BE', { weekday: 'short', day: '2-digit', month: 'short' });
}

export function BookingDetailsScreen({ navigation, route }: Props): React.ReactElement {
  const defaultDate = useMemo(() => {
    const d = new Date();
    d.setHours(d.getHours() + 2, 0, 0, 0);
    return d;
  }, []);

  const [destination, setDestination] = useState(route.params.destination);
  const [dateStr, setDateStr] = useState(isoDate(defaultDate));
  const [timeStr, setTimeStr] = useState(isoTime(defaultDate));
  const [passengers, setPassengers] = useState(1);

  const next = () => {
    if (!destination.trim()) {
      Alert.alert('Destination requise', 'Précisez où nous devons vous emmener.');
      return;
    }
    const parsed = new Date(`${dateStr}T${timeStr}:00`);
    if (Number.isNaN(parsed.getTime())) {
      Alert.alert('Date invalide', 'Vérifiez le format de la date et de l’heure.');
      return;
    }
    if (parsed.getTime() < Date.now() - 60_000) {
      Alert.alert('Date passée', 'Choisissez une date et heure à venir.');
      return;
    }
    navigation.navigate('VehicleSelection', {
      origin: route.params.origin,
      destination: destination.trim(),
      scheduledAt: parsed.toISOString(),
      passengers,
    });
  };

  return (
    <ScreenContainer scroll>
      <StepBar current={2} labels={['Départ', 'Détails', 'Véhicule', 'Confirmation']} />

      <View style={styles.header}>
        <Text style={styles.title}>Détails du trajet</Text>
        <Text style={styles.subtitle}>Quand et où ? On s’occupe du reste.</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>Itinéraire</Text>
        <View style={styles.row}>
          <View style={[styles.dot, { backgroundColor: color.gold }]} />
          <Text style={styles.routeText} numberOfLines={1}>{route.params.origin}</Text>
        </View>
        <View style={styles.routeDivider} />
        <View style={styles.row}>
          <View style={[styles.dot, { backgroundColor: color.muted }]} />
          <View style={{ flex: 1 }}>
            <TextField
              placeholder="Destination"
              value={destination}
              onChangeText={setDestination}
              containerStyle={styles.inlineField}
            />
          </View>
        </View>
      </View>

      <View style={styles.gridRow}>
        <TextField
          label="Date"
          placeholder="AAAA-MM-JJ"
          value={dateStr}
          onChangeText={setDateStr}
          containerStyle={styles.half}
          autoCapitalize="none"
          keyboardType={Platform.OS === 'ios' ? 'numbers-and-punctuation' : 'default'}
        />
        <TextField
          label="Heure"
          placeholder="HH:MM"
          value={timeStr}
          onChangeText={setTimeStr}
          containerStyle={styles.half}
          autoCapitalize="none"
          keyboardType={Platform.OS === 'ios' ? 'numbers-and-punctuation' : 'default'}
        />
      </View>
      <Text style={styles.hint}>
        Estimation pour {fmtDisplayDate(new Date(`${dateStr}T${timeStr || '00:00'}:00`))}
      </Text>

      <Text style={styles.section}>Passagers</Text>
      <View style={styles.counter}>
        <Pressable
          style={styles.counterBtn}
          onPress={() => setPassengers((p) => Math.max(1, p - 1))}
        >
          <Text style={styles.counterBtnText}>−</Text>
        </Pressable>
        <Text style={styles.counterValue}>{passengers}</Text>
        <Pressable
          style={styles.counterBtn}
          onPress={() => setPassengers((p) => Math.min(8, p + 1))}
        >
          <Text style={styles.counterBtnText}>+</Text>
        </Pressable>
      </View>

      <PrimaryButton label="Choisir un véhicule" onPress={next} style={styles.cta} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: { paddingTop: spacing.lg, paddingBottom: spacing.lg, gap: spacing.xs },
  title: { color: color.text, fontSize: font.size.xl, fontWeight: font.weight.bold },
  subtitle: { color: color.muted, fontSize: font.size.md },
  card: {
    backgroundColor: color.surface,
    borderRadius: radius.lg,
    borderColor: color.border,
    borderWidth: 1,
    padding: spacing.lg,
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  cardLabel: {
    color: color.muted,
    fontSize: font.size.xs,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  dot: { width: 10, height: 10, borderRadius: 5 },
  routeText: { color: color.text, fontSize: font.size.md, flex: 1 },
  routeDivider: { width: 1, height: 14, backgroundColor: color.border, marginLeft: 5 },
  inlineField: { flex: 1 },
  gridRow: { flexDirection: 'row', gap: spacing.md },
  half: { flex: 1 },
  hint: { color: color.muted, fontSize: font.size.xs, marginTop: spacing.xs },
  section: {
    color: color.muted,
    fontSize: font.size.xs,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
  },
  counter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: color.surface,
    borderColor: color.border,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  counterBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: color.primary,
    borderColor: color.gold,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterBtnText: { color: color.gold, fontSize: font.size.xl, fontWeight: font.weight.bold },
  counterValue: { color: color.text, fontSize: font.size.xl, fontWeight: font.weight.semibold },
  cta: { marginTop: spacing.xl },
});
