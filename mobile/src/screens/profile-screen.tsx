import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../contexts/auth-context';
import TextInput from '../components/TextInput';
import { CARD_BASE, COLORS, HEADER_BASE, RADIUS, SPACING } from '../styles/ui-tokens';

interface ProfileScreenProps {
  navigation: any;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const { user, logout, refreshUser, updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editFirst, setEditFirst] = useState('');
  const [editLast, setEditLast] = useState('');
  const [editAge, setEditAge] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      (async () => {
        const result = await refreshUser();
        if (active && !result.ok && result.message !== 'Not signed in') {
          setFormError(result.message);
        }
      })();
      return () => {
        active = false;
      };
    }, [refreshUser]),
  );

  useEffect(() => {
    if (user && !editing) {
      setEditFirst(user.firstName ?? '');
      setEditLast(user.lastName ?? '');
      setEditAge(user.age != null ? String(user.age) : '');
    }
  }, [user, editing]);

  const displayName =
    user?.firstName || user?.lastName
      ? [user.firstName, user.lastName].filter(Boolean).join(' ')
      : user?.username ?? 'Member';

  const email =
    user?.email ??
    (user?.username
      ? `${user.username.toLowerCase().replace(/\s+/g, '.')}@example.com`
      : '—');

  const handle = user?.username
    ? `@${user.username.toLowerCase().replace(/\s+/g, '_')}`
    : '@—';

  const avatarInitials = useMemo(() => {
    const a = user?.firstName?.trim()?.[0];
    const b = user?.lastName?.trim()?.[0];
    if (a || b) {
      return `${a ?? ''}${b ?? ''}`.toUpperCase().slice(0, 2);
    }
    const u = user?.username?.trim();
    return u ? u.slice(0, 2).toUpperCase() : '?';
  }, [user?.firstName, user?.lastName, user?.username]);

  function startEdit() {
    setFormError(null);
    setEditFirst(user?.firstName ?? '');
    setEditLast(user?.lastName ?? '');
    setEditAge(user?.age != null ? String(user.age) : '');
    setEditing(true);
  }

  function cancelEdit() {
    setEditing(false);
    setFormError(null);
  }

  async function saveEdit() {
    const n = Number.parseInt(editAge, 10);
    if (Number.isNaN(n) || n < 1 || n > 120) {
      setFormError('Enter a valid age');
      return;
    }
    if (!editFirst.trim() || !editLast.trim()) {
      setFormError('First and last name are required');
      return;
    }
    setFormError(null);
    setSaving(true);
    const result = await updateProfile({
      firstName: editFirst.trim(),
      lastName: editLast.trim(),
      age: n,
    });
    setSaving(false);
    if (!result.ok) {
      setFormError(result.message);
      return;
    }
    setEditing(false);
  }

  return (
    <View style={styles.page}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerIconButton}
          onPress={() => navigation.navigate('Home')}
          activeOpacity={0.8}>
          <Text style={styles.headerIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile Settings</Text>
        <TouchableOpacity style={styles.headerIconButton} activeOpacity={0.8}>
          <Text style={styles.headerIcon}>⚙</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <View style={styles.avatarWrap}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>{avatarInitials}</Text>
            </View>
            <View style={styles.avatarEditBadge}>
              <Text style={styles.avatarEditText}>✎</Text>
            </View>
          </View>
          <Text style={styles.name}>{displayName}</Text>
          <Text style={styles.handle}>{handle}</Text>
          <View style={styles.premiumPill}>
            <Text style={styles.premiumText}>PREMIUM MEMBER</Text>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <Text style={styles.sectionTitle}>Account Details</Text>
            {!editing ? (
              <TouchableOpacity onPress={startEdit} activeOpacity={0.8}>
                <Text style={styles.editText}>Edit Details</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.editActions}>
                <TouchableOpacity onPress={cancelEdit} activeOpacity={0.8}>
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    if (!saving) {
                      saveEdit();
                    }
                  }}
                  activeOpacity={0.8}
                  disabled={saving}>
                  <Text style={styles.editText}>
                    {saving ? 'Saving…' : 'Save'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          <Text style={styles.label}>EMAIL ADDRESS</Text>
          {editing ? (
            <View style={styles.emailBox}>
              <Text style={styles.emailHint}>
                Email can’t be changed here (contact support).
              </Text>
              <Text style={styles.emailValue}>{email}</Text>
            </View>
          ) : (
            <View style={styles.emailBox}>
              <Text style={styles.emailValue}>{email}</Text>
            </View>
          )}

          <Text style={styles.label}>FIRST NAME</Text>
          {editing ? (
            <TextInput
              value={editFirst}
              onChangeText={setEditFirst}
              placeholder="First name"
            />
          ) : (
            <Text style={styles.fieldValue}>{user?.firstName ?? '—'}</Text>
          )}

          <Text style={styles.label}>LAST NAME</Text>
          {editing ? (
            <TextInput
              value={editLast}
              onChangeText={setEditLast}
              placeholder="Last name"
            />
          ) : (
            <Text style={styles.fieldValue}>{user?.lastName ?? '—'}</Text>
          )}

          <Text style={styles.label}>AGE</Text>
          {editing ? (
            <TextInput
              value={editAge}
              onChangeText={setEditAge}
              placeholder="Age"
              keyboardType="number-pad"
            />
          ) : (
            <Text style={styles.fieldValue}>
              {user?.age != null ? String(user.age) : '—'}
            </Text>
          )}

          {formError ? <Text style={styles.formError}>{formError}</Text> : null}
        </View>

        <TouchableOpacity
          style={[styles.card, styles.actionRow]}
          activeOpacity={0.85}>
          <View style={styles.actionLeft}>
            <View style={styles.actionIconBox}>
              <Text style={styles.actionIcon}>🛍</Text>
            </View>
            <Text style={styles.actionText}>Order History</Text>
          </View>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.card, styles.actionRow]}
          onPress={() => {
            logout();
            navigation.replace('SignIn');
          }}
          activeOpacity={0.85}>
          <View style={styles.actionLeft}>
            <View style={[styles.actionIconBox, styles.logoutIconBox]}>
              <Text style={styles.logoutIcon}>↪</Text>
            </View>
            <Text style={styles.logoutText}>Logout</Text>
          </View>
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
    fontSize: 30,
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
    fontSize: 24,
    color: COLORS.textPrimary,
  },
  content: {
    padding: SPACING.lg,
    gap: SPACING.lg,
  },
  card: {
    ...CARD_BASE,
  },
  avatarWrap: {
    alignSelf: 'center',
    marginTop: 6,
    marginBottom: 8,
  },
  avatarCircle: {
    width: 96,
    height: 96,
    borderRadius: RADIUS.circle,
    backgroundColor: '#f1ad8e',
    borderWidth: 4,
    borderColor: '#d9d2c9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 30,
    fontWeight: '800',
    color: '#223349',
  },
  avatarEditBadge: {
    position: 'absolute',
    bottom: 2,
    right: -2,
    width: 28,
    height: 28,
    borderRadius: RADIUS.lg,
    backgroundColor: '#14d7e6',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  avatarEditText: {
    color: '#0f2437',
    fontWeight: '800',
    fontSize: 13,
  },
  name: {
    textAlign: 'center',
    fontSize: 35,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  handle: {
    textAlign: 'center',
    color: '#616e82',
    marginTop: 2,
    fontSize: 23,
  },
  premiumPill: {
    alignSelf: 'center',
    marginTop: SPACING.sm,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.lg,
    backgroundColor: '#e6f2f3',
  },
  premiumText: {
    color: COLORS.brand,
    fontWeight: '700',
    fontSize: 14,
    letterSpacing: 0.4,
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  editActions: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
  },
  cancelText: {
    color: COLORS.textSecondary,
    fontWeight: '600',
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 35,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  editText: {
    color: COLORS.brand,
    fontWeight: '600',
    fontSize: 14,
  },
  label: {
    marginTop: 14,
    color: COLORS.textMuted,
    letterSpacing: 0.6,
    fontSize: 13,
    fontWeight: '600',
  },
  emailBox: {
    marginTop: SPACING.sm,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    paddingVertical: 10,
    paddingHorizontal: SPACING.md,
    backgroundColor: COLORS.surfaceSubtle,
  },
  emailHint: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginBottom: 6,
  },
  emailValue: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  fieldValue: {
    marginTop: 6,
    fontSize: 18,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  formError: {
    marginTop: 12,
    color: COLORS.danger,
    fontSize: 14,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  actionIconBox: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.sm,
    backgroundColor: '#f0f3f8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionIcon: {
    fontSize: 16,
  },
  actionText: {
    fontSize: 18,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  chevron: {
    fontSize: 26,
    color: '#c0c8d3',
    lineHeight: 26,
  },
  logoutIconBox: {
    backgroundColor: '#ffeef0',
  },
  logoutIcon: {
    color: '#ff5a5f',
    fontSize: 18,
    fontWeight: '800',
  },
  logoutText: {
    color: COLORS.danger,
    fontSize: 18,
    fontWeight: '500',
  },
});

export { ProfileScreen };
