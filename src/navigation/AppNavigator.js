import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import CountryDetailScreen from '../screens/CountryDetailScreen';
import CountryListScreen from '../screens/CountryListScreen';
import SvgTestScreen from '../screens/SvgTestScreen';
import { Colors } from '../theme/colors';

const Stack = createStackNavigator();

const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="CountryList"

                screenOptions={{
                    headerShown: false,
                    cardStyle: { backgroundColor: Colors.primary },
                    gestureEnabled: true,
                }}
            >
                {/* Screen 1: The country list */}
                <Stack.Screen
                    name="CountryList"
                    component={CountryListScreen}
                />

                {/* Screen 2: Country detail view */}
                <Stack.Screen
                    name="CountryDetail"
                    component={CountryDetailScreen}
                />
                <Stack.Screen
                    name="SvgTest"
                    component={SvgTestScreen}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;