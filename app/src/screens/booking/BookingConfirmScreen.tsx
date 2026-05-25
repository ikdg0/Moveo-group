import React, { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScreenContainer } from '../../components/ScreenContainer';
import { PrimaryButton } from '../../components/PrimaryButton';
import { StepBar } from '../../components/StepBar';
import { TextField } from '../../components/TextField';
import { color, font, radius, spacing } from '../../constants/theme';
import { BookingStackParamList } from '../../navigation/types';
import { bookingsApi } from '../../api/bookings';
import { VEHICLES } from '../../constants/vehicles';
import { apiErrorMessage } from '../../api/client';

type Props = NativeStackScreenProps<BookingStackParamList, 'BookingConfirm'>;

export function BookingConfirmScreen({ navigation, route }: Props): React.ReactElement {
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const vehicle = VEHICLES.find((v) => v.type === route.params.vehicleType);
  const scheduled = new Date(route.params.scheduledAt);

  const confirm = async () => {
    setSubmitting(true);
    try {
      await bookingsApi.create({
        origin: route.params.origin,
        destination: route.params.destination,
        scheduledAt: route.params.scheduledAt,
        passengers: route.params.passengers,
        vehicleType: route.params.vehicleType,
        notes: notes.trim() || undefined,
      });
      Alert.alert(
        'Réservation confirmée',
        'Un email récapitulatif vient de vous être envoyé.',
        [
          {
            text: 'OK',
            onPress: () => {
              const parent = navigation.getParent();
              parent?.goBack();
              parent?.navigate('Main', { screen: 'History' });
            },
          },
        ],
      );
    } catch (e) {
      Alert.alert('Erreur', apiErrorMessage(e));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScreenContainer scroll>
      <StepBar current={4} labels={['Départ', 'Détails', 'Véhicule', 'Confirmation']} />

      <View style={styles.header}>
        <Text style={styles.title}>Récapitulatif</Text>
        <Text style={styles.subtitle}>Vérifiez les informations avant de confirmer.</Text>
      </View>

      <View style={styles.card}>
        <Row label="Départ" value={route.params.origin} dot="gold" />
        <View style={styles.divider} />
        <Row label="Destination" value={route.params.destination} dot="muted" />
      </View>

      <View style={styles.card}>
        <Row label="Date" value={scheduled.toLocaleDateString('fr-BE', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })} />
        <View style={styles.divider} />
        <Row label="Heure" value={scheduled.toLocaleTimeString('fr-BE', { hour: '2-digit', minute: '2-digit' })} />
        <View style={styles.divider} />
        <Row label="Passagers" value={String(route.params.passengers)} />
        <View style={styles.divider} />
        <Row label="Véhicule" value={vehicle?.name ?? route.params.vehicleType} />
      </View>

      <View style={styles.priceCard}>
        <Text style={styles.priceLabel}>Total estimé</Text>
        <Text style={styles.priceValue}>{route.params.estimatedPrice.toFixed(2)} €</Text>
        <Text style={styles.priceFootnote}>
          Prix indicatif TTC. Le tarif final sera confirmé par votre chauffeur.
        </Text>
      </View>

      <TextField
        label="Notes au chauffeur (facultatif)"
        placeholder="Ex : 3 valises, accès parking…"
        value={notes}
        onChangeText={setNotes}
        multiline
        containerStyle={styles.notes}
      />

      <PrimaryButton
        label="Confirmer la réservation"
        onPress={confirm}
        loading={submitting}
        style={styles.cta}
      />
    </ScreenContainer>
  );
}

function Row({
  label,
  value,
  dot,
}: {
  label: string;
  value: string;
  dot?: 'gold' | 'muted';
}): React.ReactElement {
  return (
    <View style={styles.row}>
      {dot ? (
        <View
          style={[
            styles.rowDot,
            { backgroundColor: dot === 'gold' ? color.gold : color.muted },
          ]}
        />
      ) : null}
      <View style={{ flex: 1 }}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={styles.rowValue} numberOfLines={2}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingTop: spacing.lg, paddingBottom: spacing.lg, gap: spacing.xs },
  title: { color: color.text, fontSize: font.size.xl, fontWeight: font.weight.bold },
  subtitle: { color: color.muted, fontSize: font.size.md },
  card: {
    backgroundColor: color.surface,
    borderColor: color.border,
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  divider: { height: 1, backgroundColor: color.border, marginVertical: spacing.xs },
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md, paddingVertical: 4 },
  rowDot: { width: 10, height: 10, borderRadius: 5, marginTop: 6 },
  rowLabel: {
    color: color.muted,
    fontSize: font.size.xs,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  rowValue: { color: color.text, fontSize: font.size.md, marginTop: 2 },
  priceCard: {
    backgroundColor: color.surfaceElevated,
    borderColor: color.gold,
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginTop: spacing.sm,
    gap: spacing.xs,
  },
  priceLabel: {
    color: color.muted,
    fontSize: font.size.xs,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  priceValue: { color: color.gold, fontSize: font.size.xxl, fontWeight: font.weight.bold },
  priceFootnote: { color: color.muted, fontSize: font.size.xs },
  notes: { marginTop: spacing.lg },
  cta: { marginTop: spacing.xl },
});
