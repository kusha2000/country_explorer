import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import CountryListScreen from '../screens/CountryListScreen';
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
                {/* Screen: The country list */}
                <Stack.Screen
                    name="CountryList"
                    component={CountryListScreen}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;