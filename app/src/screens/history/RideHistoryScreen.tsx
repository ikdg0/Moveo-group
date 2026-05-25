import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, RefreshControl, View, Text } from 'react-native';
import { ScreenContainer } from '../../components/ScreenContainer';
import { ErrorState } from '../../components/ErrorState';
import { Loader } from '../../components/Loader';
import { useTheme } from '../../hooks/useTheme';
import { bookingsApi } from '../../api/bookings';
import { Booking } from '../../api/types';
import { VEHICLES } from '../../constants/vehicles';
import { apiErrorMessage } from '../../api/client';
import { ColorPalette, font as fontTokens, spacing as spacingTokens, radius as radiusTokens } from '../../constants/theme';

export function RideHistoryScreen(): React.ReactElement {
  const { color, font, spacing } = useTheme();
  const [bookings,   setBookings]   = useState<Booking[] | null>(null);
  const [loading,    setLoading]    = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error,      setError]      = useState<string | null>(null);

  const load = useCallback(async () => {
    try { setError(null); setBookings(await bookingsApi.list()); }
    catch (e) { setError(apiErrorMessage(e)); }
    finally { setLoading(false); setRefreshing(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  if (loading) return <Loader />;
  if (error)   return <ScreenContainer><ErrorState message={error} onRetry={() => { setLoading(true); load(); }} /></ScreenContainer>;

  return (
    <ScreenContainer padded={false}>
      <View style={{ paddingHorizontal: spacing.lg, paddingTop: spacing.lg }}>
        <Text style={{ color: color.text, fontSize: font.size.xxl, fontWeight: font.weight.bold }}>Mes courses</Text>
        <Text style={{ color: color.muted, fontSize: font.size.md, marginBottom: spacing.lg }}>Historique de vos réservations.</Text>
      </View>
      <FlatList
        data={bookings ?? []}
        keyExtractor={(b) => b.id}
        contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl, flexGrow: 1 }}
        ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
        refreshControl={<RefreshControl tintColor={color.gold} refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} />}
        ListEmptyComponent={
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: spacing.xxl, gap: spacing.sm }}>
            <Text style={{ color: color.text, fontSize: font.size.lg, fontWeight: font.weight.semibold }}>Aucune course pour l'instant</Text>
            <Text style={{ color: color.muted, fontSize: font.size.md, textAlign: 'center' }}>Vos réservations apparaîtront ici.</Text>
          </View>
        }
        renderItem={({ item }) => <CourseCard booking={item} color={color} />}
      />
    </ScreenContainer>
  );
}

function CourseCard({ booking, color }: { booking: Booking; color: ColorPalette }): React.ReactElement {
  const vehicle = VEHICLES.find((v) => v.type === booking.vehicleType);
  const date    = new Date(booking.scheduledAt);
  const badgeBg = booking.status === 'confirmed' ? 'rgba(63,185,132,0.15)' : booking.status === 'cancelled' ? 'rgba(229,72,77,0.15)' : 'rgba(200,169,106,0.15)';
  const badgeLabel = booking.status === 'confirmed' ? 'Confirmée' : booking.status === 'cancelled' ? 'Annulée' : 'En attente';

  return (
    <View style={{ backgroundColor: color.surface, borderColor: color.border, borderWidth: 1, borderRadius: radiusTokens.lg, padding: spacingTokens.lg, gap: spacingTokens.sm }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacingTokens.xs }}>
        <Text style={{ color: color.muted, fontSize: fontTokens.size.sm }}>
          {date.toLocaleDateString('fr-BE', { day: '2-digit', month: 'short', year: 'numeric' })} · {date.toLocaleTimeString('fr-BE', { hour: '2-digit', minute: '2-digit' })}
        </Text>
        <View style={{ paddingHorizontal: spacingTokens.sm, paddingVertical: 4, borderRadius: radiusTokens.pill, backgroundColor: badgeBg }}>
          <Text style={{ fontSize: fontTokens.size.xs, fontWeight: fontTokens.weight.semibold, letterSpacing: 1, textTransform: 'uppercase', color: color.text }}>{badgeLabel}</Text>
        </View>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacingTokens.md }}>
        <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: color.gold }} />
        <Text style={{ color: color.text, fontSize: fontTokens.size.md, flex: 1 }} numberOfLines={1}>{booking.origin}</Text>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacingTokens.md }}>
        <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: color.muted }} />
        <Text style={{ color: color.text, fontSize: fontTokens.size.md, flex: 1 }} numberOfLines={1}>{booking.destination}</Text>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacingTokens.sm, paddingTop: spacingTokens.sm, borderTopWidth: 1, borderTopColor: color.border }}>
        <Text style={{ color: color.muted, fontSize: fontTokens.size.sm }}>{vehicle?.name ?? booking.vehicleType}</Text>
        <Text style={{ color: color.gold, fontSize: fontTokens.size.lg, fontWeight: fontTokens.weight.bold }}>{booking.estimatedPrice.toFixed(2)} €</Text>
      </View>
    </View>
  );
}
