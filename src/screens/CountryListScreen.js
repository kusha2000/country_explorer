import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    Animated,
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { fetchAllCountries } from '../api/countriesApi';
import CountryCard from '../components/CountryCard';
import { Colors, FontSize, Gradients, Radius, Spacing } from '../theme/colors';


const REGIONS = ['All', 'Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];

const CountryListScreen = ({ navigation }) => {

    const [countries, setCountries] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRegion, setSelectedRegion] = useState('All');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [fadeAnim] = useState(new Animated.Value(0));

    // Data Fetching
    useEffect(() => {
        loadCountries();
    }, []);

    const loadCountries = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const data = await fetchAllCountries();
            setCountries(data);

            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 400,
                useNativeDriver: true,
            }).start();

        } catch (err) {
            setError('Failed to load countries. Please check your connection.');
        } finally {
            setIsLoading(false);
        }
    };

    // Filtered List
    const filteredCountries = useMemo(() => {
        return countries.filter(country => {
            const name = country.name?.common?.toLowerCase() || '';
            const matchesSearch = name.includes(searchQuery.toLowerCase().trim());
            const matchesRegion =
                selectedRegion === 'All' || country.region === selectedRegion;
            return matchesSearch && matchesRegion;
        });
    }, [countries, searchQuery, selectedRegion]);

    // Navigation Handler
    const handleCountryPress = useCallback((country) => {
        navigation.navigate('CountryDetail', { country });
    }, [navigation]);


    const keyExtractor = useCallback((item) => item.cca3, []);


    const renderCountry = useCallback(({ item }) => (
        <CountryCard
            country={item}
            onPress={() => handleCountryPress(item)}
        />
    ), [handleCountryPress]);

    if (isLoading) {
        return (
            <LinearGradient colors={Gradients.background} style={styles.centered}>
                <ActivityIndicator size="large" color={Colors.accent} />
                <Text style={styles.loadingText}>Exploring the world...</Text>
            </LinearGradient>
        );
    }

    if (error) {
        return (
            <LinearGradient colors={Gradients.background} style={styles.centered}>
                <Ionicons name="wifi-outline" size={48} color={Colors.error} />
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity style={styles.retryButton} onPress={loadCountries}>
                    <Text style={styles.retryText}>Try Again</Text>
                </TouchableOpacity>
            </LinearGradient>
        );
    }

    return (
        <LinearGradient colors={Gradients.background} style={styles.container}>
            <SafeAreaView style={styles.safeArea}>

                {/* ── Header */}
                <View style={styles.header}>
                    <Text style={styles.headerEmoji}>🌍</Text>
                    <Text style={styles.headerTitle}>Country Explorer</Text>
                </View>

                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <Ionicons
                        name="search-outline"
                        size={18}
                        color={Colors.textMuted}
                        style={styles.searchIcon}
                    />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search countries..."
                        placeholderTextColor={Colors.textMuted}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        autoCorrect={false}
                        clearButtonMode="while-editing"
                    />
                    {/* Clear button */}
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery('')}>
                            <Ionicons name="close-circle" size={18} color={Colors.textMuted} />
                        </TouchableOpacity>
                    )}
                </View>

                {/* Region Filter Tabs*/}
                <FlatList
                    data={REGIONS}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item) => item}
                    contentContainerStyle={styles.regionList}
                    style={styles.regionListWrapper}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={[
                                styles.regionTab,
                                selectedRegion === item && styles.regionTabActive,
                            ]}
                            onPress={() => setSelectedRegion(item)}
                        >
                            <Text style={[
                                styles.regionTabText,
                                selectedRegion === item && styles.regionTabTextActive,
                            ]}>
                                {item}
                            </Text>
                        </TouchableOpacity>
                    )}
                />

                <Text style={styles.countriesCount}>
                    {filteredCountries.length} countries found
                </Text>

                {/*  Country List */}
                <Animated.View style={[styles.listContainer, { opacity: fadeAnim }]}>
                    <FlatList
                        data={filteredCountries}
                        renderItem={renderCountry}
                        keyExtractor={keyExtractor}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.listContent}
                        initialNumToRender={15}
                        maxToRenderPerBatch={10}
                        windowSize={10}
                        ListEmptyComponent={
                            <View style={styles.emptyState}>
                                <Text style={styles.emptyEmoji}>🔍</Text>
                                <Text style={styles.emptyText}>No countries found</Text>
                                <Text style={styles.emptySubtext}>
                                    Try a different search term
                                </Text>
                            </View>
                        }
                    />
                </Animated.View>

            </SafeAreaView>
        </LinearGradient>
    );
};

// Styles
const styles = StyleSheet.create({
    container: { flex: 1 },
    safeArea: { flex: 1 },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: Spacing.md,
    },

    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: Spacing.md,
        paddingTop: Spacing.sm,
        paddingBottom: Spacing.md,
        gap: Spacing.sm,
    },
    headerEmoji: {
        fontSize: 64,
        lineHeight: 72,
    },
    headerTitle: {
        fontSize: FontSize.xl,
        fontWeight: '800',
        color: Colors.textPrimary,
        letterSpacing: -0.5,
    },
    headerSubtitle: {
        fontSize: FontSize.sm,
        color: Colors.textSecondary,
        marginTop: 2,
        textAlign: 'center',
    },
    countriesCount: {
        fontSize: FontSize.sm,
        color: Colors.textSecondary,
        textAlign: 'center',
        paddingBottom: Spacing.sm,
    },
    // Search
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.primaryCard,
        marginHorizontal: Spacing.md,
        borderRadius: Radius.lg,
        paddingHorizontal: Spacing.md,
        borderWidth: 1,
        borderColor: Colors.border,
        marginBottom: Spacing.sm,
    },
    searchIcon: { marginRight: Spacing.sm },
    searchInput: {
        flex: 1,
        height: 46,
        color: Colors.textPrimary,
        fontSize: FontSize.md,
    },

    // Region Tabs
    regionListWrapper: {
        flexGrow: 0,
        flexShrink: 0,
        height: 60,
    },
    regionList: {
        paddingHorizontal: Spacing.md,
        paddingTop: Spacing.sm,
        paddingBottom: Spacing.md,
        gap: Spacing.sm,
    },
    regionTab: {
        paddingHorizontal: Spacing.md,
        paddingVertical: 0,
        height: 30,
        borderRadius: Radius.full,
        backgroundColor: Colors.primaryCard,
        borderWidth: 1,
        borderColor: Colors.border,
        justifyContent: 'center',
    },
    regionTabActive: {
        backgroundColor: Colors.accent,
        borderColor: Colors.accent,
    },
    regionTabText: {
        fontSize: FontSize.sm,
        color: Colors.textSecondary,
        fontWeight: '600',
    },
    regionTabTextActive: {
        color: Colors.primary,
    },

    // List
    listContainer: { flex: 1, marginTop: 0 },
    listContent: { paddingBottom: Spacing.xl },

    // States
    loadingText: {
        color: Colors.textSecondary,
        fontSize: FontSize.md,
        marginTop: Spacing.sm,
    },
    errorText: {
        color: Colors.textSecondary,
        fontSize: FontSize.md,
        textAlign: 'center',
        paddingHorizontal: Spacing.xl,
    },
    retryButton: {
        backgroundColor: Colors.accent,
        paddingHorizontal: Spacing.xl,
        paddingVertical: Spacing.sm,
        borderRadius: Radius.full,
    },
    retryText: {
        color: Colors.primary,
        fontWeight: '700',
        fontSize: FontSize.md,
    },
    emptyState: {
        alignItems: 'center',
        paddingTop: Spacing.xxl,
    },
    emptyEmoji: { fontSize: 48 },
    emptyText: {
        color: Colors.textPrimary,
        fontSize: FontSize.lg,
        fontWeight: '700',
        marginTop: Spacing.md,
    },
    emptySubtext: {
        color: Colors.textSecondary,
        fontSize: FontSize.sm,
        marginTop: Spacing.xs,
    },
});

export default CountryListScreen;