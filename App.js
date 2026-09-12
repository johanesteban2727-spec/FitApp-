import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ProgresoScreen from './src/screens/ProgresoScreen';
import RutinasScreen from './src/screens/RutinasScreen';
import NutricionScreen from './src/screens/NutricionScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: { backgroundColor: '#1b1e26', borderTopColor: '#2a2e38' },
          tabBarActiveTintColor: '#e0393e',
          tabBarInactiveTintColor: '#888',
        }}
      >
        <Tab.Screen name="Progreso" component={ProgresoScreen} />
        <Tab.Screen name="Rutinas" component={RutinasScreen} />
        <Tab.Screen name="Nutricion" component={NutricionScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
