import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ProgresoScreen from './src/screens/ProgresoScreen';
import RutinasScreen from './src/screens/RutinasScreen';
import NutricionScreen from './src/screens/NutricionScreen';
import TabBar from './src/components/TabBar';
import { colors } from './src/theme';

const Tab = createBottomTabNavigator();

const navTheme = {
  ...DarkTheme,
  colors: { ...DarkTheme.colors, background: colors.bg, card: colors.bg },
};

export default function App() {
  return (
    <NavigationContainer theme={navTheme}>
      <StatusBar style="light" />
      <Tab.Navigator
        screenOptions={{ headerShown: false }}
        tabBar={(props) => <TabBar {...props} />}
      >
        <Tab.Screen name="Progreso" component={ProgresoScreen} />
        <Tab.Screen name="Rutinas" component={RutinasScreen} />
        <Tab.Screen name="Nutricion" component={NutricionScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
