import React, { FC, useMemo, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Background from '../components/Background';
import { styles } from './styles/signin-screen-styles';
import TextInput from '../components/TextInput';
import Button from '../components/Button';
import { ITextInput } from '../types/text-input';
import { useAuth } from '../contexts/auth-context';

interface ISignInScreen {
  navigation: any;
}

export const SignInScreen: FC<ISignInScreen> = ({ navigation }: any) => {
  const { login } = useAuth();
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const isLogin = useMemo(() => activeTab === 'login', [activeTab]);

  const [username, setUsername] = useState<ITextInput>({
    value: 'johndoe123',
    error: '',
  });
  const [password, setPassword] = useState<ITextInput>({
    value: 'cityslicka',
    error: '',
  });
  const [useBiometrics, setUseBiometrics] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  async function onPressSignIn() {
    setSubmitting(true);
    setFormError(null);

    const result = await login(username.value.trim(), password.value);
    setSubmitting(false);

    if (!result.ok) {
      setFormError(result.message);
      return;
    }

    navigation.replace('Main');
  }

  return (
    <Background>
      <View style={styles.container}>
        <View style={styles.card}>
          <View style={styles.iconCircle}>
            <Text style={styles.iconText}>👜</Text>
          </View>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Please enter your details</Text>

          <View style={styles.segmented}>
            <TouchableOpacity
              style={[
                styles.segItem,
                isLogin ? styles.segItemActive : undefined,
              ]}
              onPress={() => setActiveTab('login')}
              activeOpacity={0.85}>
              <Text
                style={[
                  styles.segText,
                  isLogin ? styles.segTextActive : undefined,
                ]}>
                Login
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.segItem,
                !isLogin ? styles.segItemActive : undefined,
              ]}
              onPress={() => setActiveTab('signup')}
              activeOpacity={0.85}>
              <Text
                style={[
                  styles.segText,
                  !isLogin ? styles.segTextActive : undefined,
                ]}>
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.fieldLabel}>Username</Text>
          <TextInput
            placeholder={'johndoe123'}
            returnKeyType="next"
            value={username.value}
            onChangeText={(text: string) =>
              setUsername({ value: text, error: '' })
            }
            error={!!username.error}
            errorText={username.error}
            autoCapitalize="none"
            autoCorrect={false}
            textContentType="username"
          />

          <Text style={styles.fieldLabel}>Password</Text>
          <TextInput
            placeholder={'••••••••'}
            returnKeyType="done"
            value={password.value}
            onChangeText={(text: string) =>
              setPassword({ value: text, error: '' })
            }
            error={!!password.error}
            errorText={password.error}
            secureTextEntry
          />

          <View style={styles.forgotRow}>
            <TouchableOpacity
              onPress={() => console.log('Forgot password')}
              activeOpacity={0.85}>
              <Text style={styles.forgot}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          {formError ? <Text style={styles.subtitle}>{formError}</Text> : null}

          <TouchableOpacity
            style={styles.checkboxRow}
            onPress={() => setUseBiometrics(v => !v)}
            activeOpacity={0.85}>
            <View
              style={[
                styles.checkbox,
                useBiometrics ? styles.checkboxChecked : undefined,
              ]}>
              {useBiometrics ? (
                <Text style={styles.checkboxTick}>✓</Text>
              ) : null}
            </View>
            <Text style={styles.checkboxText}>
              Use biometrics for faster login
            </Text>
          </TouchableOpacity>

          <Button
            style={styles.primaryButton}
            onPress={() => {
              if (isLogin) {
                if (!submitting) {
                  onPressSignIn();
                }
                return;
              }
              console.log('Sign Up pressed (not implemented)');
            }}>
            <Text style={styles.primaryButtonText}>
              {submitting
                ? 'Signing in...'
                : isLogin
                ? 'Sign In'
                : 'Create account'}
            </Text>
          </Button>

          <Button
            style={styles.secondaryButton}
            onPress={() => console.log('Sign in with biometrics')}>
            <Text style={styles.secondaryButtonText}>
              Sign in with Biometrics
            </Text>
          </Button>
        </View>
      </View>
    </Background>
  );
};
