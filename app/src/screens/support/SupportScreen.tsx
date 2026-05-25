import React from 'react';
import { Alert, Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { ScreenContainer } from '../../components/ScreenContainer';
import { color, font, radius, spacing } from '../../constants/theme';
import { contact } from '../../constants/contact';

function open(url: string): void {
  Linking.openURL(url).catch(() => Alert.alert('Action impossible', 'Aucune app ne peut ouvrir ce lien.'));
}

export function SupportScreen(): React.ReactElement {
  return (
    <ScreenContainer scroll>
      <View style={styles.header}>
        <Text style={styles.title}>Support 24/7</Text>
        <Text style={styles.subtitle}>
          Une question ou une demande urgente ? Nous sommes à votre disposition.
        </Text>
      </View>

      <Pressable
        onPress={() => open(`https://wa.me/${contact.whatsapp}`)}
        style={({ pressed }) => [styles.cta, styles.ctaPrimary, pressed && styles.pressed]}
      >
        <View style={[styles.icon, styles.iconWa]}>
          <Text style={styles.iconGlyph}>W</Text>
        </View>
        <View style={styles.ctaText}>
          <Text style={styles.ctaTitleDark}>WhatsApp</Text>
          <Text style={styles.ctaSubDark}>{contact.whatsappDisplay}</Text>
        </View>
      </Pressable>

      <Pressable
        onPress={() => open(`tel:${contact.phone}`)}
        style={({ pressed }) => [styles.cta, styles.ctaOutline, pressed && styles.pressed]}
      >
        <View style={[styles.icon, styles.iconPhone]}>
          <Text style={[styles.iconGlyph, { color: color.gold }]}>☎</Text>
        </View>
        <View style={styles.ctaText}>
          <Text style={styles.ctaTitleLight}>Téléphone</Text>
          <Text style={styles.ctaSubLight}>{contact.phoneDisplay}</Text>
        </View>
      </Pressable>

      <Pressable
        onPress={() => open(`mailto:${contact.email}`)}
        style={({ pressed }) => [styles.cta, styles.ctaOutline, pressed && styles.pressed]}
      >
        <View style={[styles.icon, styles.iconPhone]}>
          <Text style={[styles.iconGlyph, { color: color.gold }]}>@</Text>
        </View>
        <View style={styles.ctaText}>
          <Text style={styles.ctaTitleLight}>Email</Text>
          <Text style={styles.ctaSubLight}>{contact.email}</Text>
        </View>
      </Pressable>

      <View style={styles.info}>
        <Text style={styles.infoLabel}>Moveo Group</Text>
        <Text style={styles.infoLine}>Service VTC haut de gamme — Bruxelles</Text>
        <Text style={styles.infoLine}>{contact.website}</Text>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: { paddingTop: spacing.lg, paddingBottom: spacing.xl, gap: spacing.xs },
  title: { color: color.text, fontSize: font.size.xxl, fontWeight: font.weight.bold },
  subtitle: { color: color.muted, fontSize: font.size.md },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.lg,
    marginBottom: spacing.md,
  },
  ctaPrimary: { backgroundColor: color.gold },
  ctaOutline: { backgroundColor: color.surface, borderColor: color.border, borderWidth: 1 },
  pressed: { opacity: 0.85 },
  icon: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  iconWa: { backgroundColor: color.primary },
  iconPhone: { backgroundColor: color.primary, borderWidth: 1, borderColor: color.gold },
  iconGlyph: { color: color.gold, fontSize: 20, fontWeight: font.weight.bold },
  ctaText: { flex: 1 },
  ctaTitleDark: { color: color.primary, fontSize: font.size.lg, fontWeight: font.weight.bold },
  ctaSubDark: { color: color.primary, fontSize: font.size.sm, opacity: 0.75 },
  ctaTitleLight: { color: color.text, fontSize: font.size.lg, fontWeight: font.weight.semibold },
  ctaSubLight: { color: color.muted, fontSize: font.size.sm },
  info: { marginTop: spacing.xl, gap: spacing.xs },
  infoLabel: {
    color: color.muted,
    fontSize: font.size.xs,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  infoLine: { color: color.muted, fontSize: font.size.sm },
});
