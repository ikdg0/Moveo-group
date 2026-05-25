import React, { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Logo } from '../../components/Logo';
import { TextField } from '../../components/TextField';
import { PrimaryButton } from '../../components/PrimaryButton';
import { color, font, spacing } from '../../constants/theme';
import { useAuthStore } from '../../store/authStore';
import { apiErrorMessage } from '../../api/client';
import { AuthStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

export function RegisterScreen({ navigation }: Props): React.ReactElement {
  const register = useAuthStore((s) => s.register);
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!firstName || !email || !phone || password.length < 8) {
      Alert.alert(
        'Champs incomplets',
        'Merci de renseigner tous les champs. Le mot de passe doit faire au moins 8 caractères.',
      );
      return;
    }
    setLoading(true);
    try {
      await register({ firstName: firstName.trim(), email: email.trim(), phone: phone.trim(), password });
    } catch (e) {
      Alert.alert('Inscription impossible', apiErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer scroll>
      <View style={styles.header}>
        <Logo size="lg" />
      </View>
      <Text style={styles.title}>Créer mon compte</Text>
      <Text style={styles.subtitle}>Rejoignez Moveo en quelques secondes.</Text>

      <View style={styles.form}>
        <TextField
          label="Prénom"
          autoCapitalize="words"
          placeholder="Alexandre"
          value={firstName}
          onChangeText={setFirstName}
        />
        <TextField
          label="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          autoComplete="email"
          placeholder="vous@exemple.com"
          value={email}
          onChangeText={setEmail}
        />
        <TextField
          label="Téléphone"
          keyboardType="phone-pad"
          autoComplete="tel"
          placeholder="+32 470 12 34 56"
          value={phone}
          onChangeText={setPhone}
        />
        <TextField
          label="Mot de passe"
          secureTextEntry
          placeholder="8 caractères minimum"
          value={password}
          onChangeText={setPassword}
        />
      </View>

      <PrimaryButton label="Créer mon compte" onPress={submit} loading={loading} />
      <PrimaryButton
        label="J’ai déjà un compte"
        variant="ghost"
        onPress={() => navigation.navigate('Login')}
        style={styles.secondary}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: { paddingTop: spacing.xxl, paddingBottom: spacing.xl },
  title: { color: color.text, fontSize: font.size.xxl, fontWeight: font.weight.bold },
  subtitle: { color: color.muted, fontSize: font.size.md, marginTop: spacing.xs, marginBottom: spacing.xl },
  form: { gap: spacing.md, marginBottom: spacing.xl },
  secondary: { marginTop: spacing.sm },
});
