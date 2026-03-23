import React, { FC, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import TextInput from '../components/TextInput';
import { useAuth } from '../contexts/auth-context';
import { RegisterPayload } from '../services/api-service';
import { CARD_BASE, COLORS, HEADER_BASE, RADIUS, SPACING } from '../styles/ui-tokens';

interface CreateProfileScreenProps {
  navigation: { replace: (name: string) => void; goBack: () => void };
}

const CreateProfileScreen: FC<CreateProfileScreenProps> = ({ navigation }) => {
  const { register } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  function validate(): string | null {
    if (!username.trim()) {
      return 'Username is required';
    }
    if (!password) {
      return 'Password is required';
    }
    if (!email.trim()) {
      return 'Email is required';
    }
    if (!firstName.trim()) {
      return 'First name is required';
    }
    if (!lastName.trim()) {
      return 'Last name is required';
    }
    const n = Number.parseInt(age, 10);
    if (Number.isNaN(n) || n < 1 || n > 120) {
      return 'Enter a valid age';
    }
    return null;
  }

  async function onSubmit() {
    const err = validate();
    if (err) {
      setFormError(err);
      return;
    }
    setFormError(null);
    setSubmitting(true);
    const payload: RegisterPayload = {
      username: username.trim(),
      password,
      email: email.trim(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      age: Number.parseInt(age, 10),
    };
    const result = await register(payload);
    setSubmitting(false);
    if (!result.ok) {
      setFormError(result.message);
      return;
    }
    navigation.replace('Main');
  }

  return (
    <View style={styles.page}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerIconButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}>
          <Text style={styles.headerIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create profile</Text>
        <View style={styles.headerIconButton} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Account</Text>
          <Text style={styles.label}>USERNAME</Text>
          <TextInput
            placeholder="johndoe123"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            autoCorrect={false}
            textContentType="username"
          />
          <Text style={styles.label}>PASSWORD</Text>
          <TextInput
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            textContentType="newPassword"
          />
          <Text style={styles.label}>EMAIL</Text>
          <TextInput
            placeholder="you@example.com"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            textContentType="emailAddress"
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Your details</Text>
          <Text style={styles.label}>FIRST NAME</Text>
          <TextInput
            placeholder="John"
            value={firstName}
            onChangeText={setFirstName}
            textContentType="givenName"
          />
          <Text style={styles.label}>LAST NAME</Text>
          <TextInput
            placeholder="Doe"
            value={lastName}
            onChangeText={setLastName}
            textContentType="familyName"
          />
          <Text style={styles.label}>AGE</Text>
          <TextInput
            placeholder="28"
            value={age}
            onChangeText={setAge}
            keyboardType="number-pad"
            textContentType="none"
          />
        </View>

        {formError ? <Text style={styles.errorText}>{formError}</Text> : null}

        <TouchableOpacity
          style={[styles.primaryBtn, submitting && styles.primaryBtnDisabled]}
          onPress={() => {
            if (!submitting) {
              onSubmit();
            }
          }}
          activeOpacity={0.9}>
          {submitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.primaryBtnText}>Create account</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: COLORS.pageBackground,
  },
  header: HEADER_BASE,
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  headerIconButton: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIcon: {
    fontSize: 28,
    color: COLORS.textPrimary,
  },
  content: {
    padding: SPACING.lg,
    paddingBottom: 32,
  },
  card: {
    ...CARD_BASE,
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  label: {
    marginTop: 10,
    color: COLORS.textMuted,
    letterSpacing: 0.6,
    fontSize: 12,
    fontWeight: '600',
  },
  errorText: {
    color: COLORS.danger,
    marginBottom: SPACING.md,
    fontSize: 14,
  },
  primaryBtn: {
    backgroundColor: COLORS.brand,
    borderRadius: RADIUS.lg,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnDisabled: {
    opacity: 0.7,
  },
  primaryBtnText: {
    color: COLORS.brandDark,
    fontSize: 17,
    fontWeight: '700',
  },
});

export { CreateProfileScreen };
