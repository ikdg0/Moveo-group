import React, { useCallback, useEffect, useState } from 'react';
import { Pressable, View, Text } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScreenContainer } from '../../components/ScreenContainer';
import { PrimaryButton } from '../../components/PrimaryButton';
import { StepBar } from '../../components/StepBar';
import { Loader } from '../../components/Loader';
import { ErrorState } from '../../components/ErrorState';
import { useTheme } from '../../hooks/useTheme';
import { BookingStackParamList } from '../../navigation/types';
import { VEHICLES, VehicleType } from '../../constants/vehicles';
import { bookingsApi } from '../../api/bookings';
import { EstimateItem } from '../../api/types';
import { apiErrorMessage } from '../../api/client';

type Props = NativeStackScreenProps<BookingStackParamList, 'VehicleSelection'>;

export function VehicleSelectionScreen({ navigation, route }: Props): React.ReactElement {
  const { color, font, radius, spacing } = useTheme();
  const [estimates, setEstimates] = useState<EstimateItem[] | null>(null);
  const [error,     setError]     = useState<string | null>(null);
  const [loading,   setLoading]   = useState(true);
  const [selected,  setSelected]  = useState<VehicleType | null>(null);

  const fetchEstimates = useCallback(async () => {
    setLoading(true); setError(null);
    try { setEstimates(await bookingsApi.estimate({ origin: route.params.origin, destination: route.params.destination, passengers: route.params.passengers })); }
    catch (e) { setError(apiErrorMessage(e)); }
    finally { setLoading(false); }
  }, [route.params.origin, route.params.destination, route.params.passengers]);

  useEffect(() => { fetchEstimates(); }, [fetchEstimates]);

  if (loading) return <Loader />;
  if (error)   return <ScreenContainer><ErrorState message={error} onRetry={fetchEstimates} /></ScreenContainer>;

  const priceOf = (t: VehicleType) => estimates?.find((e) => e.vehicleType === t)?.price ?? 0;

  return (
    <ScreenContainer scroll>
      <StepBar current={3} labels={['Départ', 'Détails', 'Véhicule', 'Confirmation']} />
      <View style={{ paddingTop: spacing.lg, paddingBottom: spacing.lg, gap: spacing.xs }}>
        <Text style={{ color: color.text, fontSize: font.size.xl, fontWeight: font.weight.bold }}>Choisissez votre véhicule</Text>
        <Text style={{ color: color.muted, fontSize: font.size.md }}>Tous prix TTC, estimés selon votre trajet.</Text>
      </View>
      <View style={{ gap: spacing.md }}>
        {VEHICLES.map((v) => {
          const isSelected = selected === v.type;
          const disabled   = route.params.passengers > v.capacity;
          return (
            <Pressable key={v.type} disabled={disabled} onPress={() => setSelected(v.type)}
              style={({ pressed }) => ({
                flexDirection: 'row', backgroundColor: isSelected ? color.surfaceElevated : color.surface,
                borderColor: isSelected ? color.gold : color.border, borderWidth: 1, borderRadius: radius.lg,
                padding: spacing.lg, gap: spacing.md, opacity: disabled ? 0.4 : pressed ? 0.85 : 1,
              })}>
              <View style={{ flex: 1, gap: 2 }}>
                <Text style={{ color: color.text, fontSize: font.size.lg, fontWeight: font.weight.semibold }}>{v.name}</Text>
                <Text style={{ color: color.muted, fontSize: font.size.sm }}>{v.tagline}</Text>
                <Text style={{ color: color.muted, fontSize: font.size.xs, marginTop: spacing.xs }}>{v.examples}</Text>
                <Text style={{ color: color.muted, fontSize: font.size.xs }}>
                  Jusqu'à {v.capacity} passager{v.capacity > 1 ? 's' : ''}{disabled ? ' · capacité insuffisante' : ''}
                </Text>
              </View>
              <View style={{ alignItems: 'flex-end', justifyContent: 'center' }}>
                <Text style={{ color: color.gold, fontSize: font.size.xl, fontWeight: font.weight.bold }}>{priceOf(v.type).toFixed(0)} €</Text>
                <Text style={{ color: color.muted, fontSize: font.size.xs, letterSpacing: 1, textTransform: 'uppercase' }}>estimé</Text>
              </View>
            </Pressable>
          );
        })}
      </View>
      <PrimaryButton label={selected ? 'Continuer' : 'Sélectionnez un véhicule'} disabled={!selected}
        onPress={() => selected && navigation.navigate('BookingConfirm', { ...route.params, vehicleType: selected, estimatedPrice: priceOf(selected) })}
        style={{ marginTop: spacing.xl }} />
    </ScreenContainer>
  );
}
