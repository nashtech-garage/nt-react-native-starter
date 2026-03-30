jest.mock('react-native/Libraries/Components/Keyboard/Keyboard', () => ({
  addListener: () => ({ remove: () => {} }),
  removeListener: () => {},
  dismiss: () => {},
}));

jest.mock('@react-navigation/bottom-tabs/lib/commonjs/utils/useIsKeyboardShown', () => ({
  __esModule: true,
  default: () => false,
}));

jest.mock('@react-navigation/native', () => {
  const React = require('react');
  return {
    __esModule: true,
    NavigationContainer: ({ children }) => React.createElement(React.Fragment, null, children),
    useNavigation: () => ({ navigate: jest.fn(), goBack: jest.fn() }),
    useRoute: () => ({ params: {} }),
    useFocusEffect: (cb) => {
      React.useEffect(() => {
        cb();
      }, [cb]);
    },
  };
});

jest.mock('@react-navigation/native-stack', () => ({
  __esModule: true,
  createNativeStackNavigator: () => {
    const React = require('react');
    return {
      Navigator: ({ children }) => React.createElement(React.Fragment, null, children),
      Screen: ({ children }) => React.createElement(React.Fragment, null, children),
    };
  },
}));

jest.mock('@react-navigation/bottom-tabs', () => ({
  __esModule: true,
  createBottomTabNavigator: () => {
    const React = require('react');
    return {
      Navigator: ({ children }) => React.createElement(React.Fragment, null, children),
      Screen: ({ children }) => React.createElement(React.Fragment, null, children),
    };
  },
}));

jest.mock('react-native-keychain', () => ({
  __esModule: true,
  getGenericPassword: jest.fn().mockResolvedValue(false),
  setGenericPassword: jest.fn().mockResolvedValue(true),
  resetGenericPassword: jest.fn().mockResolvedValue(true),
}));

