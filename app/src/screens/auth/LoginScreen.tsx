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

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export function LoginScreen({ navigation }: Props): React.ReactElement {
  const login = useAuthStore((s) => s.login);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!email || !password) {
      Alert.alert('Champs requis', 'Veuillez renseigner votre email et votre mot de passe.');
      return;
    }
    setLoading(true);
    try {
      await login(email.trim(), password);
    } catch (e) {
      Alert.alert('Connexion impossible', apiErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer scroll>
      <View style={styles.header}>
        <Logo size="lg" />
      </View>
      <Text style={styles.title}>Bon retour</Text>
      <Text style={styles.subtitle}>Connectez-vous à votre compte Moveo.</Text>

      <View style={styles.form}>
        <TextField
          label="Email"
          autoCapitalize="none"
          autoComplete="email"
          keyboardType="email-address"
          placeholder="vous@exemple.com"
          value={email}
          onChangeText={setEmail}
        />
        <TextField
          label="Mot de passe"
          secureTextEntry
          autoComplete="password"
          placeholder="••••••••"
          value={password}
          onChangeText={setPassword}
        />
        <Text
          style={styles.forgot}
          onPress={() => Alert.alert('Bientôt disponible', 'Cette fonctionnalité arrive en v2.')}
        >
          Mot de passe oublié ?
        </Text>
      </View>

      <PrimaryButton label="Se connecter" onPress={submit} loading={loading} />
      <PrimaryButton
        label="Créer un compte"
        variant="ghost"
        onPress={() => navigation.navigate('Register')}
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
  forgot: { color: color.gold, fontSize: font.size.sm, alignSelf: 'flex-end' },
  secondary: { marginTop: spacing.sm },
});
