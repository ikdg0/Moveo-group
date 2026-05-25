import React from 'react';
import { Alert, Linking, Pressable, View, Text } from 'react-native';
import { ScreenContainer } from '../../components/ScreenContainer';
import { useTheme } from '../../hooks/useTheme';
import { contact } from '../../constants/contact';

function open(url: string) {
  Linking.openURL(url).catch(() => Alert.alert('Action impossible', 'Aucune app ne peut ouvrir ce lien.'));
}

export function SupportScreen(): React.ReactElement {
  const { color, font, radius, spacing } = useTheme();

  return (
    <ScreenContainer scroll>
      <View style={{ paddingTop: spacing.lg, paddingBottom: spacing.xl, gap: spacing.xs }}>
        <Text style={{ color: color.text, fontSize: font.size.xxl, fontWeight: font.weight.bold }}>Support 24/7</Text>
        <Text style={{ color: color.muted, fontSize: font.size.md }}>Nous sommes à votre disposition.</Text>
      </View>

      {/* WhatsApp */}
      <Pressable onPress={() => open(`https://wa.me/${contact.whatsapp}`)}
        style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.lg, borderRadius: radius.lg, marginBottom: spacing.md, backgroundColor: color.gold, opacity: pressed ? 0.85 : 1 })}>
        <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: color.onGold === '#FFFFFF' ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: color.onGold, fontSize: 20, fontWeight: font.weight.bold }}>W</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ color: color.onGold, fontSize: font.size.lg, fontWeight: font.weight.bold }}>WhatsApp</Text>
          <Text style={{ color: color.onGold, fontSize: font.size.sm, opacity: 0.8 }}>{contact.whatsappDisplay}</Text>
        </View>
      </Pressable>

      {/* Téléphone */}
      <Pressable onPress={() => open(`tel:${contact.phone}`)}
        style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.lg, borderRadius: radius.lg, marginBottom: spacing.md, backgroundColor: color.surface, borderColor: color.border, borderWidth: 1, opacity: pressed ? 0.85 : 1 })}>
        <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: color.background, borderWidth: 1, borderColor: color.gold, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: color.gold, fontSize: 20, fontWeight: font.weight.bold }}>☎</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ color: color.text, fontSize: font.size.lg, fontWeight: font.weight.semibold }}>Téléphone</Text>
          <Text style={{ color: color.muted, fontSize: font.size.sm }}>{contact.phoneDisplay}</Text>
        </View>
      </Pressable>

      {/* Email */}
      <Pressable onPress={() => open(`mailto:${contact.email}`)}
        style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.lg, borderRadius: radius.lg, marginBottom: spacing.md, backgroundColor: color.surface, borderColor: color.border, borderWidth: 1, opacity: pressed ? 0.85 : 1 })}>
        <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: color.background, borderWidth: 1, borderColor: color.gold, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: color.gold, fontSize: 20, fontWeight: font.weight.bold }}>@</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ color: color.text, fontSize: font.size.lg, fontWeight: font.weight.semibold }}>Email</Text>
          <Text style={{ color: color.muted, fontSize: font.size.sm }}>{contact.email}</Text>
        </View>
      </Pressable>

      <View style={{ marginTop: spacing.xl, gap: spacing.xs }}>
        <Text style={{ color: color.muted, fontSize: font.size.xs, letterSpacing: 2, textTransform: 'uppercase' }}>Moveo Group</Text>
        <Text style={{ color: color.muted, fontSize: font.size.sm }}>Service VTC haut de gamme — Bruxelles</Text>
        <Text style={{ color: color.muted, fontSize: font.size.sm }}>{contact.website}</Text>
      </View>
    </ScreenContainer>
  );
}
