import React, { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { ScreenContainer } from '../../components/ScreenContainer';
import { TextField } from '../../components/TextField';
import { PrimaryButton } from '../../components/PrimaryButton';
import { color, font, radius, spacing } from '../../constants/theme';
import { useAuthStore } from '../../store/authStore';
import { usersApi } from '../../api/users';
import { apiErrorMessage } from '../../api/client';

export function ProfileScreen(): React.ReactElement {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const logout = useAuthStore((s) => s.logout);

  const [firstName, setFirstName] = useState(user?.firstName ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [saving, setSaving] = useState(false);

  const dirty =
    firstName.trim() !== (user?.firstName ?? '') || phone.trim() !== (user?.phone ?? '');

  const save = async () => {
    if (!firstName.trim() || !phone.trim()) {
      Alert.alert('Champs requis', 'Le prénom et le téléphone ne peuvent pas être vides.');
      return;
    }
    setSaving(true);
    try {
      const updated = await usersApi.update({ firstName: firstName.trim(), phone: phone.trim() });
      setUser(updated);
      Alert.alert('Profil mis à jour');
    } catch (e) {
      Alert.alert('Erreur', apiErrorMessage(e));
    } finally {
      setSaving(false);
    }
  };

  const confirmLogout = () => {
    Alert.alert('Se déconnecter', 'Vous devrez vous reconnecter pour réserver.', [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Se déconnecter', style: 'destructive', onPress: logout },
    ]);
  };

  return (
    <ScreenContainer scroll>
      <View style={styles.header}>
        <Text style={styles.title}>Profil</Text>
        <Text style={styles.subtitle}>Vos informations personnelles.</Text>
      </View>

      <View style={styles.avatarWrap}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {(user?.firstName ?? '?').slice(0, 1).toUpperCase()}
          </Text>
        </View>
        <Text style={styles.email}>{user?.email}</Text>
      </View>

      <View style={styles.form}>
        <TextField label="Prénom" value={firstName} onChangeText={setFirstName} />
        <TextField label="Téléphone" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
        <TextField label="Email" value={user?.email ?? ''} editable={false} />
      </View>

      <PrimaryButton
        label="Enregistrer les modifications"
        onPress={save}
        loading={saving}
        disabled={!dirty}
      />
      <PrimaryButton
        label="Se déconnecter"
        variant="outline"
        onPress={confirmLogout}
        style={styles.logout}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: { paddingTop: spacing.lg, paddingBottom: spacing.lg, gap: spacing.xs },
  title: { color: color.text, fontSize: font.size.xxl, fontWeight: font.weight.bold },
  subtitle: { color: color.muted, fontSize: font.size.md },
  avatarWrap: { alignItems: 'center', marginVertical: spacing.lg, gap: spacing.sm },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: color.surface,
    borderColor: color.gold,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: color.gold, fontSize: 36, fontWeight: font.weight.bold },
  email: { color: color.muted, fontSize: font.size.sm },
  form: { gap: spacing.md, marginBottom: spacing.xl },
  logout: { marginTop: spacing.sm },
});
