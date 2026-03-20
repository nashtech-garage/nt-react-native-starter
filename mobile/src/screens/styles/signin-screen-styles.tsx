import { StyleSheet, TextStyle, ViewStyle } from 'react-native';

type ISignInStyles = {
  container: ViewStyle;
  card: ViewStyle;
  iconCircle: ViewStyle;
  iconText: TextStyle;
  title: TextStyle;
  subtitle: TextStyle;
  segmented: ViewStyle;
  segItem: ViewStyle;
  segItemActive: ViewStyle;
  segText: TextStyle;
  segTextActive: TextStyle;
  fieldLabel: TextStyle;
  forgotRow: ViewStyle;
  forgot: TextStyle;
  checkboxRow: ViewStyle;
  checkbox: ViewStyle;
  checkboxChecked: ViewStyle;
  checkboxTick: TextStyle;
  checkboxText: TextStyle;
  primaryButton: ViewStyle;
  primaryButtonText: TextStyle;
  secondaryButton: ViewStyle;
  secondaryButtonText: TextStyle;
};

export const styles = StyleSheet.create<ISignInStyles>({
  container: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 18,
    justifyContent: 'center',
  },
  card: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 18,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 2,
  },
  iconCircle: {
    alignSelf: 'center',
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#E7FBF6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  iconText: {
    fontSize: 22,
  },
  title: {
    textAlign: 'center',
    fontSize: 26,
    fontWeight: '800',
    color: '#0B1B2B',
    marginTop: 4,
  },
  subtitle: {
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 16,
    color: '#7C8A97',
  },
  segmented: {
    width: '100%',
    backgroundColor: '#F3F5F7',
    borderRadius: 14,
    padding: 4,
    flexDirection: 'row',
    marginBottom: 14,
  },
  segItem: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segItemActive: {
    backgroundColor: 'white',
  },
  segText: {
    color: '#7C8A97',
    fontWeight: '700',
  },
  segTextActive: {
    color: '#0B1B2B',
  },
  fieldLabel: {
    color: '#5F6E7A',
    fontWeight: '700',
    marginTop: 8,
  },
  forgotRow: {
    width: '100%',
    alignItems: 'flex-end',
    marginTop: 2,
    marginBottom: 14,
  },
  forgot: {
    color: '#09BFAE',
    fontWeight: '700',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#B9C2CA',
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  checkboxChecked: {
    borderColor: '#09BFAE',
    backgroundColor: '#09BFAE',
  },
  checkboxTick: {
    color: 'white',
    fontSize: 12,
    fontWeight: '900',
    lineHeight: 12,
  },
  checkboxText: {
    color: '#5F6E7A',
    fontWeight: '600',
  },
  primaryButton: {
    backgroundColor: '#09BFAE',
    borderRadius: 12,
    paddingVertical: 14,
  },
  primaryButtonText: {
    color: '#0B1B2B',
    fontWeight: '900',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    paddingVertical: 14,
    borderWidth: 1.5,
    borderColor: '#09BFAE',
  },
  secondaryButtonText: {
    color: '#09BFAE',
    fontWeight: '900',
  },
});
