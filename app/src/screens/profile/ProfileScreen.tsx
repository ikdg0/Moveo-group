import React, { useState } from 'react';
import { Alert, View, Text, Switch, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenContainer } from '../../components/ScreenContainer';
import { TextField } from '../../components/TextField';
import { PrimaryButton } from '../../components/PrimaryButton';
import { useTheme } from '../../hooks/useTheme';
import { useThemeStore } from '../../store/themeStore';
import { useAuthStore } from '../../store/authStore';
import { usersApi } from '../../api/users';
import { apiErrorMessage } from '../../api/client';

export function ProfileScreen(): React.ReactElement {
  const { color, font, radius, spacing } = useTheme();
  const { mode, toggle } = useThemeStore();
  const user    = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const logout  = useAuthStore((s) => s.logout);

  const [firstName, setFirstName] = useState(user?.firstName ?? '');
  const [lastName,  setLastName]  = useState(user?.lastName  ?? '');
  const [phone,     setPhone]     = useState(user?.phone ?? '');
  const [saving,    setSaving]    = useState(false);

  const dirty =
    firstName.trim() !== (user?.firstName ?? '') ||
    lastName.trim()  !== (user?.lastName  ?? '') ||
    phone.trim()     !== (user?.phone     ?? '');

  const save = async () => {
    if (!firstName.trim() || !phone.trim()) { Alert.alert('Champs requis'); return; }
    setSaving(true);
    try {
      const updated = await usersApi.update({ firstName: firstName.trim(), lastName: lastName.trim(), phone: phone.trim() });
      setUser(updated);
      Alert.alert('Profil mis à jour');
    } catch (e) {
      Alert.alert('Erreur', apiErrorMessage(e));
    } finally {
      setSaving(false);
    }
  };

  const confirmLogout = () =>
    Alert.alert('Se déconnecter', 'Vous devrez vous reconnecter pour réserver.', [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Se déconnecter', style: 'destructive', onPress: logout },
    ]);

  const initials = `${(user?.firstName ?? '?')[0] ?? ''}${(user?.lastName ?? '')[0] ?? ''}`.toUpperCase();

  return (
    <ScreenContainer scroll>
      {/* En-tête profil */}
      <View style={{ paddingTop: spacing.lg, paddingBottom: spacing.lg, gap: spacing.xs }}>
        <Text style={{ color: color.text, fontSize: font.size.xxl, fontWeight: font.weight.bold }}>Profil</Text>
        <Text style={{ color: color.muted, fontSize: font.size.md }}>Vos informations personnelles.</Text>
      </View>

      {/* Avatar */}
      <View style={{ alignItems: 'center', marginVertical: spacing.lg, gap: spacing.sm }}>
        <View style={{ width: 84, height: 84, borderRadius: 42, backgroundColor: color.surface, borderColor: color.gold, borderWidth: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: color.gold, fontSize: 32, fontWeight: font.weight.bold }}>{initials}</Text>
        </View>
        <Text style={{ color: color.text, fontSize: font.size.lg, fontWeight: font.weight.semibold }}>{user?.firstName} {user?.lastName}</Text>
        <Text style={{ color: color.muted, fontSize: font.size.sm }}>{user?.email}</Text>
      </View>

      {/* Formulaire */}
      <View style={{ gap: spacing.md, marginBottom: spacing.xl }}>
        <View style={{ flexDirection: 'row', gap: spacing.md }}>
          <TextField label="Prénom" value={firstName} onChangeText={setFirstName} containerStyle={{ flex: 1 }} />
          <TextField label="Nom"    value={lastName}  onChangeText={setLastName}  containerStyle={{ flex: 1 }} />
        </View>
        <TextField label="Téléphone" value={phone}        onChangeText={setPhone} keyboardType="phone-pad" />
        <TextField label="Email"     value={user?.email ?? ''} editable={false} />
      </View>

      <PrimaryButton label="Enregistrer les modifications" onPress={save} loading={saving} disabled={!dirty} />

      {/* Thème */}
      <View style={{ backgroundColor: color.surface, borderColor: color.border, borderWidth: 1, borderRadius: radius.lg, padding: spacing.lg, marginTop: spacing.xl, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ gap: 2 }}>
          <Text style={{ color: color.text, fontSize: font.size.md, fontWeight: font.weight.semibold }}>
            {mode === 'dark' ? '🌙  Mode sombre' : '☀️  Mode clair'}
          </Text>
          <Text style={{ color: color.muted, fontSize: font.size.sm }}>Apparence de l'application</Text>
        </View>
        <Switch
          value={mode === 'dark'}
          onValueChange={toggle}
          trackColor={{ false: color.border, true: color.gold }}
          thumbColor={color.surface}
        />
      </View>

      {/* Déconnexion — bien visible */}
      <View style={{ marginTop: spacing.xl, backgroundColor: color.surface, borderColor: color.danger, borderWidth: 1, borderRadius: radius.lg, overflow: 'hidden' }}>
        <PrimaryButton label="Se déconnecter" variant="ghost" onPress={confirmLogout}
          style={{ borderRadius: 0 }} />
        <Text style={{ color: color.muted, fontSize: font.size.xs, textAlign: 'center', paddingBottom: spacing.md }}>
          Votre session sera supprimée de cet appareil
        </Text>
      </View>
    </ScreenContainer>
  );
}
