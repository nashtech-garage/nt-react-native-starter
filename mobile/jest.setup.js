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

