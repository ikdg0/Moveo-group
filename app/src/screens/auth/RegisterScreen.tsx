import React, { useState } from 'react';
import { Alert, View, Text } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Logo } from '../../components/Logo';
import { TextField } from '../../components/TextField';
import { PrimaryButton } from '../../components/PrimaryButton';
import { useTheme } from '../../hooks/useTheme';
import { useAuthStore } from '../../store/authStore';
import { apiErrorMessage } from '../../api/client';
import { AuthStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

export function RegisterScreen({ navigation }: Props): React.ReactElement {
  const { color, font, spacing } = useTheme();
  const register = useAuthStore((s) => s.register);
  const [firstName, setFirstName] = useState('');
  const [lastName,  setLastName]  = useState('');
  const [email,     setEmail]     = useState('');
  const [phone,     setPhone]     = useState('');
  const [password,  setPassword]  = useState('');
  const [loading,   setLoading]   = useState(false);

  const submit = async () => {
    if (!firstName || !lastName || !email || !phone || password.length < 8) {
      Alert.alert('Champs incomplets', 'Renseignez tous les champs. Mot de passe : 8 caractères minimum.');
      return;
    }
    setLoading(true);
    try {
      await register({ firstName: firstName.trim(), lastName: lastName.trim(), email: email.trim(), phone: phone.trim(), password });
    } catch (e) {
      Alert.alert('Inscription impossible', apiErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer scroll>
      <View style={{ paddingTop: spacing.xxl, paddingBottom: spacing.xl }}>
        <Logo size="lg" />
      </View>
      <Text style={{ color: color.text, fontSize: font.size.xxl, fontWeight: font.weight.bold }}>Créer mon compte</Text>
      <Text style={{ color: color.muted, fontSize: font.size.md, marginTop: spacing.xs, marginBottom: spacing.xl }}>Rejoignez Moveo en quelques secondes.</Text>

      <View style={{ gap: spacing.md, marginBottom: spacing.xl }}>
        <View style={{ flexDirection: 'row', gap: spacing.md }}>
          <TextField label="Prénom"       autoCapitalize="words"  placeholder="Alexandre" value={firstName} onChangeText={setFirstName} containerStyle={{ flex: 1 }} />
          <TextField label="Nom"          autoCapitalize="words"  placeholder="Dupont"    value={lastName}  onChangeText={setLastName}  containerStyle={{ flex: 1 }} />
        </View>
        <TextField label="Email"          autoCapitalize="none"   keyboardType="email-address" autoComplete="email" placeholder="vous@exemple.com" value={email} onChangeText={setEmail} />
        <TextField label="Téléphone"      keyboardType="phone-pad" autoComplete="tel"   placeholder="+32 470 12 34 56" value={phone} onChangeText={setPhone} />
        <TextField label="Mot de passe"   secureTextEntry         placeholder="8 caractères minimum" value={password} onChangeText={setPassword} />
      </View>

      <PrimaryButton label="Créer mon compte" onPress={submit} loading={loading} />
      <PrimaryButton label="J'ai déjà un compte" variant="ghost" onPress={() => navigation.navigate('Login')} style={{ marginTop: spacing.sm }} />
    </ScreenContainer>
  );
}
