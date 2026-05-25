import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { ScreenContainer } from '../../components/ScreenContainer';
import { ErrorState } from '../../components/ErrorState';
import { Loader } from '../../components/Loader';
import { color, font, radius, spacing } from '../../constants/theme';
import { bookingsApi } from '../../api/bookings';
import { Booking } from '../../api/types';
import { VEHICLES } from '../../constants/vehicles';
import { apiErrorMessage } from '../../api/client';

export function RideHistoryScreen(): React.ReactElement {
  const [bookings, setBookings] = useState<Booking[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setError(null);
      const data = await bookingsApi.list();
      setBookings(data);
    } catch (e) {
      setError(apiErrorMessage(e));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) return <Loader />;
  if (error)
    return (
      <ScreenContainer>
        <ErrorState message={error} onRetry={() => { setLoading(true); load(); }} />
      </ScreenContainer>
    );

  return (
    <ScreenContainer padded={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Mes courses</Text>
        <Text style={styles.subtitle}>Historique de vos réservations.</Text>
      </View>

      <FlatList
        data={bookings ?? []}
        keyExtractor={(b) => b.id}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
        refreshControl={
          <RefreshControl
            tintColor={color.gold}
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              load();
            }}
          />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>Aucune course pour l’instant</Text>
            <Text style={styles.emptyBody}>
              Vos réservations à venir et passées apparaîtront ici.
            </Text>
          </View>
        }
        renderItem={({ item }) => <CourseCard booking={item} />}
      />
    </ScreenContainer>
  );
}

function CourseCard({ booking }: { booking: Booking }): React.ReactElement {
  const vehicle = VEHICLES.find((v) => v.type === booking.vehicleType);
  const date = new Date(booking.scheduledAt);
  const statusStyle =
    booking.status === 'confirmed'
      ? styles.badgeConfirmed
      : booking.status === 'cancelled'
        ? styles.badgeCancelled
        : styles.badgePending;
  const statusLabel =
    booking.status === 'confirmed'
      ? 'Confirmée'
      : booking.status === 'cancelled'
        ? 'Annulée'
        : 'En attente';

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.date}>
          {date.toLocaleDateString('fr-BE', { day: '2-digit', month: 'short', year: 'numeric' })} ·{' '}
          {date.toLocaleTimeString('fr-BE', { hour: '2-digit', minute: '2-digit' })}
        </Text>
        <View style={[styles.badge, statusStyle]}>
          <Text style={styles.badgeText}>{statusLabel}</Text>
        </View>
      </View>

      <View style={styles.routeRow}>
        <View style={[styles.dot, { backgroundColor: color.gold }]} />
        <Text style={styles.routeText} numberOfLines={1}>{booking.origin}</Text>
      </View>
      <View style={styles.routeRow}>
        <View style={[styles.dot, { backgroundColor: color.muted }]} />
        <Text style={styles.routeText} numberOfLines={1}>{booking.destination}</Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.vehicle}>{vehicle?.name ?? booking.vehicleType}</Text>
        <Text style={styles.price}>{booking.estimatedPrice.toFixed(2)} €</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: spacing.lg, paddingTop: spacing.lg, gap: spacing.xs },
  title: { color: color.text, fontSize: font.size.xxl, fontWeight: font.weight.bold },
  subtitle: { color: color.muted, fontSize: font.size.md, marginBottom: spacing.lg },
  list: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl, flexGrow: 1 },
  card: {
    backgroundColor: color.surface,
    borderColor: color.border,
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  date: { color: color.muted, fontSize: font.size.sm },
  badge: { paddingHorizontal: spacing.sm, paddingVertical: 4, borderRadius: radius.pill },
  badgeText: { fontSize: font.size.xs, fontWeight: font.weight.semibold, letterSpacing: 1, textTransform: 'uppercase' },
  badgeConfirmed: { backgroundColor: 'rgba(63,185,132,0.15)' },
  badgeCancelled: { backgroundColor: 'rgba(229,72,77,0.15)' },
  badgePending: { backgroundColor: 'rgba(200,169,106,0.15)' },
  routeRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  dot: { width: 8, height: 8, borderRadius: 4 },
  routeText: { color: color.text, fontSize: font.size.md, flex: 1 },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: color.border,
  },
  vehicle: { color: color.muted, fontSize: font.size.sm },
  price: { color: color.gold, fontSize: font.size.lg, fontWeight: font.weight.bold },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: spacing.xxl,
    gap: spacing.sm,
  },
  emptyTitle: { color: color.text, fontSize: font.size.lg, fontWeight: font.weight.semibold },
  emptyBody: { color: color.muted, fontSize: font.size.md, textAlign: 'center' },
});
