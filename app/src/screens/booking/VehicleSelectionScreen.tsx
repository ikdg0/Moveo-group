import React, { useCallback, useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScreenContainer } from '../../components/ScreenContainer';
import { PrimaryButton } from '../../components/PrimaryButton';
import { StepBar } from '../../components/StepBar';
import { Loader } from '../../components/Loader';
import { ErrorState } from '../../components/ErrorState';
import { color, font, radius, spacing } from '../../constants/theme';
import { BookingStackParamList } from '../../navigation/types';
import { VEHICLES, VehicleType } from '../../constants/vehicles';
import { bookingsApi } from '../../api/bookings';
import { EstimateItem } from '../../api/types';
import { apiErrorMessage } from '../../api/client';

type Props = NativeStackScreenProps<BookingStackParamList, 'VehicleSelection'>;

export function VehicleSelectionScreen({ navigation, route }: Props): React.ReactElement {
  const [estimates, setEstimates] = useState<EstimateItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<VehicleType | null>(null);

  const fetchEstimates = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await bookingsApi.estimate({
        origin: route.params.origin,
        destination: route.params.destination,
        passengers: route.params.passengers,
      });
      setEstimates(data);
    } catch (e) {
      setError(apiErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }, [route.params.origin, route.params.destination, route.params.passengers]);

  useEffect(() => {
    fetchEstimates();
  }, [fetchEstimates]);

  if (loading) return <Loader />;
  if (error) return <ScreenContainer><ErrorState message={error} onRetry={fetchEstimates} /></ScreenContainer>;

  const priceOf = (t: VehicleType): number =>
    estimates?.find((e) => e.vehicleType === t)?.price ?? 0;

  const next = () => {
    if (!selected) return;
    navigation.navigate('BookingConfirm', {
      ...route.params,
      vehicleType: selected,
      estimatedPrice: priceOf(selected),
    });
  };

  return (
    <ScreenContainer scroll>
      <StepBar current={3} labels={['Départ', 'Détails', 'Véhicule', 'Confirmation']} />

      <View style={styles.header}>
        <Text style={styles.title}>Choisissez votre véhicule</Text>
        <Text style={styles.subtitle}>Tous prix TTC, estimés selon votre trajet.</Text>
      </View>

      <View style={styles.list}>
        {VEHICLES.map((v) => {
          const isSelected = selected === v.type;
          const disabled = route.params.passengers > v.capacity;
          return (
            <Pressable
              key={v.type}
              disabled={disabled}
              onPress={() => setSelected(v.type)}
              style={({ pressed }) => [
                styles.card,
                isSelected && styles.cardSelected,
                disabled && styles.cardDisabled,
                pressed && !disabled && styles.cardPressed,
              ]}
            >
              <View style={styles.cardLeft}>
                <Text style={styles.cardName}>{v.name}</Text>
                <Text style={styles.cardTag}>{v.tagline}</Text>
                <Text style={styles.cardExamples}>{v.examples}</Text>
                <Text style={styles.cardCapacity}>
                  Jusqu’à {v.capacity} passager{v.capacity > 1 ? 's' : ''}
                  {disabled ? ' · capacité insuffisante' : ''}
                </Text>
              </View>
              <View style={styles.cardRight}>
                <Text style={styles.price}>{priceOf(v.type).toFixed(0)} €</Text>
                <Text style={styles.priceLabel}>estimé</Text>
              </View>
            </Pressable>
          );
        })}
      </View>

      <PrimaryButton
        label={selected ? 'Continuer' : 'Sélectionnez un véhicule'}
        disabled={!selected}
        onPress={next}
        style={styles.cta}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: { paddingTop: spacing.lg, paddingBottom: spacing.lg, gap: spacing.xs },
  title: { color: color.text, fontSize: font.size.xl, fontWeight: font.weight.bold },
  subtitle: { color: color.muted, fontSize: font.size.md },
  list: { gap: spacing.md },
  card: {
    flexDirection: 'row',
    backgroundColor: color.surface,
    borderColor: color.border,
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.md,
  },
  cardSelected: { borderColor: color.gold, backgroundColor: color.surfaceElevated },
  cardDisabled: { opacity: 0.4 },
  cardPressed: { opacity: 0.85 },
  cardLeft: { flex: 1, gap: 2 },
  cardName: { color: color.text, fontSize: font.size.lg, fontWeight: font.weight.semibold },
  cardTag: { color: color.muted, fontSize: font.size.sm },
  cardExamples: { color: color.muted, fontSize: font.size.xs, marginTop: spacing.xs },
  cardCapacity: { color: color.muted, fontSize: font.size.xs, marginTop: 2 },
  cardRight: { alignItems: 'flex-end', justifyContent: 'center' },
  price: { color: color.gold, fontSize: font.size.xl, fontWeight: font.weight.bold },
  priceLabel: {
    color: color.muted,
    fontSize: font.size.xs,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  cta: { marginTop: spacing.xl },
});
