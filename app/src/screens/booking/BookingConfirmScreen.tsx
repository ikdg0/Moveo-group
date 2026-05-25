import React, { useState } from 'react';
import { Alert, View, Text } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScreenContainer } from '../../components/ScreenContainer';
import { PrimaryButton } from '../../components/PrimaryButton';
import { StepBar } from '../../components/StepBar';
import { TextField } from '../../components/TextField';
import { useTheme } from '../../hooks/useTheme';
import { ColorPalette, font as fontTokens, spacing as spacingTokens } from '../../constants/theme';
import { BookingStackParamList } from '../../navigation/types';
import { bookingsApi } from '../../api/bookings';
import { VEHICLES } from '../../constants/vehicles';
import { apiErrorMessage } from '../../api/client';

type Props = NativeStackScreenProps<BookingStackParamList, 'BookingConfirm'>;

interface RowProps {
  label: string;
  value: string;
  dot?: 'gold' | 'muted';
  color: ColorPalette;
}

function Row({ label, value, dot, color }: RowProps): React.ReactElement {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: spacingTokens.md, paddingVertical: 4 }}>
      {dot ? <View style={{ width: 10, height: 10, borderRadius: 5, marginTop: 6, backgroundColor: dot === 'gold' ? color.gold : color.muted }} /> : null}
      <View style={{ flex: 1 }}>
        <Text style={{ color: color.muted, fontSize: fontTokens.size.xs, letterSpacing: 1, textTransform: 'uppercase' }}>{label}</Text>
        <Text style={{ color: color.text, fontSize: fontTokens.size.md, marginTop: 2 }} numberOfLines={2}>{value}</Text>
      </View>
    </View>
  );
}

export function BookingConfirmScreen({ navigation, route }: Props): React.ReactElement {
  const { color, font, radius, spacing } = useTheme();
  const [notes,      setNotes]      = useState('');
  const [submitting, setSubmitting] = useState(false);
  const vehicle   = VEHICLES.find((v) => v.type === route.params.vehicleType);
  const scheduled = new Date(route.params.scheduledAt);

  const confirm = async () => {
    setSubmitting(true);
    try {
      await bookingsApi.create({
        origin:      route.params.origin,
        destination: route.params.destination,
        scheduledAt: route.params.scheduledAt,
        passengers:  route.params.passengers,
        vehicleType: route.params.vehicleType,
        notes:       notes.trim() || undefined,
      });
      Alert.alert('Réservation confirmée', 'Un email récapitulatif vient de vous être envoyé.', [{
        text: 'OK',
        onPress: () => {
          navigation.getParent()?.goBack();
          navigation.getParent()?.navigate('Main', { screen: 'History' });
        },
      }]);
    } catch (e) {
      Alert.alert('Erreur', apiErrorMessage(e));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScreenContainer scroll>
      <StepBar current={4} labels={['Départ', 'Détails', 'Véhicule', 'Confirmation']} />
      <View style={{ paddingTop: spacing.lg, paddingBottom: spacing.lg, gap: spacing.xs }}>
        <Text style={{ color: color.text, fontSize: font.size.xl, fontWeight: font.weight.bold }}>Récapitulatif</Text>
        <Text style={{ color: color.muted, fontSize: font.size.md }}>Vérifiez avant de confirmer.</Text>
      </View>

      <View style={{ backgroundColor: color.surface, borderColor: color.border, borderWidth: 1, borderRadius: radius.lg, padding: spacing.lg, marginBottom: spacing.md, gap: spacing.sm }}>
        <Row label="Départ"      value={route.params.origin}      dot="gold"  color={color} />
        <View style={{ height: 1, backgroundColor: color.border }} />
        <Row label="Destination" value={route.params.destination} dot="muted" color={color} />
      </View>

      <View style={{ backgroundColor: color.surface, borderColor: color.border, borderWidth: 1, borderRadius: radius.lg, padding: spacing.lg, marginBottom: spacing.md, gap: spacing.sm }}>
        <Row label="Date"       value={scheduled.toLocaleDateString('fr-BE', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })} color={color} />
        <View style={{ height: 1, backgroundColor: color.border }} />
        <Row label="Heure"      value={scheduled.toLocaleTimeString('fr-BE', { hour: '2-digit', minute: '2-digit' })} color={color} />
        <View style={{ height: 1, backgroundColor: color.border }} />
        <Row label="Passagers"  value={String(route.params.passengers)} color={color} />
        <View style={{ height: 1, backgroundColor: color.border }} />
        <Row label="Véhicule"   value={vehicle?.name ?? route.params.vehicleType} color={color} />
      </View>

      <View style={{ backgroundColor: color.surfaceElevated, borderColor: color.gold, borderWidth: 1, borderRadius: radius.lg, padding: spacing.lg, marginBottom: spacing.lg, gap: spacing.xs }}>
        <Text style={{ color: color.muted, fontSize: font.size.xs, letterSpacing: 2, textTransform: 'uppercase' }}>Total estimé</Text>
        <Text style={{ color: color.gold, fontSize: font.size.xxl, fontWeight: font.weight.bold }}>{route.params.estimatedPrice.toFixed(2)} €</Text>
        <Text style={{ color: color.muted, fontSize: font.size.xs }}>Prix indicatif TTC. Le tarif final sera confirmé par votre chauffeur.</Text>
      </View>

      <TextField label="Notes au chauffeur (facultatif)" placeholder="Ex : 3 valises, accès parking…" value={notes} onChangeText={setNotes} multiline containerStyle={{ marginBottom: spacing.lg }} />
      <PrimaryButton label="Confirmer la réservation" onPress={confirm} loading={submitting} />
    </ScreenContainer>
  );
}
