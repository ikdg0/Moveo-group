import React, { useMemo, useState } from 'react';
import { Alert, Platform, Pressable, View, Text } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScreenContainer } from '../../components/ScreenContainer';
import { TextField } from '../../components/TextField';
import { PrimaryButton } from '../../components/PrimaryButton';
import { StepBar } from '../../components/StepBar';
import { useTheme } from '../../hooks/useTheme';
import { BookingStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<BookingStackParamList, 'BookingDetails'>;

function pad(n: number) { return n.toString().padStart(2, '0'); }
function isoDate(d: Date) { return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; }
function isoTime(d: Date) { return `${pad(d.getHours())}:${pad(d.getMinutes())}`; }
function fmtDate(d: Date) { return d.toLocaleDateString('fr-BE', { weekday: 'short', day: '2-digit', month: 'short' }); }

export function BookingDetailsScreen({ navigation, route }: Props): React.ReactElement {
  const { color, font, radius, spacing } = useTheme();
  const def = useMemo(() => { const d = new Date(); d.setHours(d.getHours() + 2, 0, 0, 0); return d; }, []);
  const [destination, setDestination] = useState(route.params.destination);
  const [dateStr,     setDateStr]     = useState(isoDate(def));
  const [timeStr,     setTimeStr]     = useState(isoTime(def));
  const [passengers,  setPassengers]  = useState(1);

  const next = () => {
    if (!destination.trim()) { Alert.alert('Destination requise'); return; }
    const parsed = new Date(`${dateStr}T${timeStr}:00`);
    if (Number.isNaN(parsed.getTime())) { Alert.alert('Date invalide'); return; }
    if (parsed.getTime() < Date.now() - 60_000) { Alert.alert('Date passée', 'Choisissez une date à venir.'); return; }
    navigation.navigate('VehicleSelection', { origin: route.params.origin, destination: destination.trim(), scheduledAt: parsed.toISOString(), passengers });
  };

  return (
    <ScreenContainer scroll>
      <StepBar current={2} labels={['Départ', 'Détails', 'Véhicule', 'Confirmation']} />
      <View style={{ paddingTop: spacing.lg, paddingBottom: spacing.lg, gap: spacing.xs }}>
        <Text style={{ color: color.text, fontSize: font.size.xl, fontWeight: font.weight.bold }}>Détails du trajet</Text>
        <Text style={{ color: color.muted, fontSize: font.size.md }}>Quand et où ?</Text>
      </View>

      {/* Itinéraire */}
      <View style={{ backgroundColor: color.surface, borderRadius: radius.lg, borderColor: color.border, borderWidth: 1, padding: spacing.lg, gap: spacing.md, marginBottom: spacing.lg }}>
        <Text style={{ color: color.muted, fontSize: font.size.xs, letterSpacing: 1, textTransform: 'uppercase' }}>Itinéraire</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
          <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: color.gold }} />
          <Text style={{ color: color.text, fontSize: font.size.md, flex: 1 }} numberOfLines={1}>{route.params.origin}</Text>
        </View>
        <View style={{ width: 1, height: 14, backgroundColor: color.border, marginLeft: 5 }} />
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
          <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: color.muted }} />
          <View style={{ flex: 1 }}>
            <TextField placeholder="Destination" value={destination} onChangeText={setDestination} />
          </View>
        </View>
      </View>

      {/* Date / Heure */}
      <View style={{ flexDirection: 'row', gap: spacing.md }}>
        <TextField label="Date (AAAA-MM-JJ)" placeholder="2026-05-25" value={dateStr} onChangeText={setDateStr} containerStyle={{ flex: 1 }} autoCapitalize="none" keyboardType={Platform.OS === 'ios' ? 'numbers-and-punctuation' : 'default'} />
        <TextField label="Heure (HH:MM)"     placeholder="09:00"       value={timeStr} onChangeText={setTimeStr} containerStyle={{ flex: 1 }} autoCapitalize="none" keyboardType={Platform.OS === 'ios' ? 'numbers-and-punctuation' : 'default'} />
      </View>
      <Text style={{ color: color.muted, fontSize: font.size.xs, marginTop: spacing.xs }}>
        {fmtDate(new Date(`${dateStr}T${timeStr || '00:00'}:00`))}
      </Text>

      {/* Passagers */}
      <Text style={{ color: color.muted, fontSize: font.size.xs, letterSpacing: 2, textTransform: 'uppercase', marginTop: spacing.xl, marginBottom: spacing.sm }}>Passagers</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: color.surface, borderColor: color.border, borderWidth: 1, borderRadius: radius.md, paddingHorizontal: spacing.lg, paddingVertical: spacing.md }}>
        <Pressable style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: color.background, borderColor: color.gold, borderWidth: 1, alignItems: 'center', justifyContent: 'center' }} onPress={() => setPassengers((p) => Math.max(1, p - 1))}>
          <Text style={{ color: color.gold, fontSize: font.size.xl, fontWeight: font.weight.bold }}>−</Text>
        </Pressable>
        <Text style={{ color: color.text, fontSize: font.size.xl, fontWeight: font.weight.semibold }}>{passengers}</Text>
        <Pressable style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: color.background, borderColor: color.gold, borderWidth: 1, alignItems: 'center', justifyContent: 'center' }} onPress={() => setPassengers((p) => Math.min(8, p + 1))}>
          <Text style={{ color: color.gold, fontSize: font.size.xl, fontWeight: font.weight.bold }}>+</Text>
        </Pressable>
      </View>

      <PrimaryButton label="Choisir un véhicule" onPress={next} style={{ marginTop: spacing.xl }} />
    </ScreenContainer>
  );
}
