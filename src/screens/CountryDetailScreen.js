import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SvgXml } from 'react-native-svg';

import {
    formatCurrencies,
    formatLanguages,
    formatPopulation,
} from '../api/countriesApi';
import { Colors, FontSize, Gradients, Radius, Spacing } from '../theme/colors';

const { width } = Dimensions.get('window');

const InfoTile = ({ icon, label, value }) => (
    <View style={styles.tile}>
        <Text style={styles.tileIcon}>{icon}</Text>
        <Text style={styles.tileLabel}>{label}</Text>
        <Text style={styles.tileValue} numberOfLines={2}>{value}</Text>
    </View>
);

// Main Screen Component
const CountryDetailScreen = ({ route, navigation }) => {
    const { country } = route.params;

    const {
        name,
        flags,
        capital,
        population,
        region,
        subregion,
        languages,
        currencies,
        area,
        borders,
    } = country;

    const countryName = name?.common || 'Unknown';
    const flagPngUrl = flags?.png;
    const flagSvgUrl = flags?.svg;

    const [svgMarkup, setSvgMarkup] = useState(null);
    const [useSvgFallback, setUseSvgFallback] = useState(false);
    const [loadingSvg, setLoadingSvg] = useState(false);

    const loadSvgFallback = async () => {
        if (!flagSvgUrl || loadingSvg) return;

        setLoadingSvg(true);
        try {
            const res = await fetch(flagSvgUrl, {
                headers: {
                    Accept: 'image/svg+xml,image/*,*/*;q=0.8',
                    'User-Agent': 'Mozilla/5.0',
                },
            });

            if (!res.ok) throw new Error(`SVG fetch failed: ${res.status}`);

            let text = await res.text();

            // Remove fixed SVG size
            text = text
                .replace(/width="[^"]*"/gi, '')
                .replace(/height="[^"]*"/gi, '');

            // Fix preserveAspectRatio
            if (!text.includes('preserveAspectRatio')) {
                text = text.replace(
                    '<svg',
                    '<svg preserveAspectRatio="xMidYMid meet"'
                );
            }

            setSvgMarkup(text);
            setUseSvgFallback(true);
        } catch (err) {
            console.error(`[CountryDetailScreen] SVG fallback failed for ${countryName}:`, err);
            setUseSvgFallback(false);
        } finally {
            setLoadingSvg(false);
        }
    };

    return (
        <LinearGradient colors={Gradients.background} style={styles.container}>
            <SafeAreaView style={styles.safeArea}>

                {/* Custom Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons name="arrow-back" size={20} color={Colors.textPrimary} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle} numberOfLines={1}>
                        {name?.common}
                    </Text>
                    <View style={{ width: 40 }} />
                </View>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {/* Hero Flag*/}
                    <View style={styles.flagHero}>
                        {useSvgFallback && svgMarkup ? (
                            loadingSvg ? (
                                <ActivityIndicator size="large" color={Colors.accent} />
                            ) : (
                                <View
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        overflow: 'hidden',
                                        backgroundColor: '#fff',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <View
                                        style={{
                                            transform: [
                                                { translateX: -50 },
                                                { translateY: -10 },
                                                { scale: 0.5 },
                                            ],
                                        }}
                                    >
                                        <SvgXml
                                            xml={svgMarkup}
                                            width={800}
                                            height={400}
                                            preserveAspectRatio="xMidYMid meet"
                                        />
                                    </View>
                                </View>
                            )
                        ) : (
                            <Image
                                source={{ uri: flagPngUrl }}
                                style={styles.flagImage}
                                resizeMode="cover"
                                accessibilityLabel={`Flag of ${countryName}`}
                                onError={() => {
                                    if (flagSvgUrl && !useSvgFallback) {
                                        loadSvgFallback();
                                    }
                                }}
                            />
                        )}
                        <LinearGradient
                            colors={['transparent', Colors.primary]}
                            style={styles.flagGradient}
                        />
                    </View>

                    {/* Country Name & Region */}
                    <View style={styles.titleSection}>
                        <Text style={styles.countryName}>{name?.common}</Text>
                        {name?.official !== name?.common && (
                            <Text style={styles.officialName}>{name?.official}</Text>
                        )}
                        <View style={styles.regionPill}>
                            <Text style={styles.regionPillText}>
                                {region} {subregion ? `· ${subregion}` : ''}
                            </Text>
                        </View>
                    </View>

                    {/* Key Stats Grid */}
                    <View style={styles.tilesGrid}>
                        <InfoTile
                            icon="👥"
                            label="Population"
                            value={formatPopulation(population)}
                        />
                        <InfoTile
                            icon="🏙️"
                            label="Capital"
                            value={capital?.[0] || 'N/A'}
                        />
                        <InfoTile
                            icon="📐"
                            label="Area"
                            value={area ? `${area.toLocaleString()} km²` : 'N/A'}
                        />
                        <InfoTile
                            icon="🌐"
                            label="Region"
                            value={region || 'N/A'}
                        />
                    </View>

                    {/* Detail Rows */}
                    <View style={styles.detailsCard}>
                        <DetailRow
                            label="Languages"
                            value={formatLanguages(languages)}
                            icon="🗣️"
                        />
                        <DetailRow
                            label="Currencies"
                            value={formatCurrencies(currencies)}
                            icon="💰"
                        />
                        <DetailRow
                            label="Subregion"
                            value={subregion || 'N/A'}
                            icon="📍"
                        />
                        {borders && borders.length > 0 && (
                            <DetailRow
                                label="Borders"
                                value={borders.join(' · ')}
                                icon="🗺️"
                            />
                        )}
                    </View>

                </ScrollView>
            </SafeAreaView>
        </LinearGradient>
    );
};

// DetailRow
const DetailRow = ({ icon, label, value }) => (
    <View style={styles.detailRow}>
        <Text style={styles.detailIcon}>{icon}</Text>
        <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>{label}</Text>
            <Text style={styles.detailValue}>{value}</Text>
        </View>
    </View>
);

// Styles
const styles = StyleSheet.create({
    container: { flex: 1 },
    safeArea: { flex: 1 },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: Radius.md,
        backgroundColor: Colors.primaryCard,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.border,
    },
    headerTitle: {
        flex: 1,
        textAlign: 'center',
        fontSize: FontSize.lg,
        fontWeight: '700',
        color: Colors.textPrimary,
        marginHorizontal: Spacing.sm,
    },

    scrollContent: { paddingBottom: Spacing.xxl },

    // Flag Hero
    flagHero: {
        marginHorizontal: Spacing.md,
        borderRadius: Radius.xl,
        overflow: 'hidden',
        height: 200,
        marginBottom: Spacing.md,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    flagImage: { width: '100%', height: '100%' },
    flagGradient: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 60,
    },

    // Title section
    titleSection: {
        paddingHorizontal: Spacing.md,
        marginBottom: Spacing.lg,
    },
    countryName: {
        fontSize: FontSize.xxl,
        fontWeight: '800',
        color: Colors.textPrimary,
        letterSpacing: -0.5,
    },
    officialName: {
        fontSize: FontSize.sm,
        color: Colors.textSecondary,
        marginTop: 4,
        fontStyle: 'italic',
    },
    regionPill: {
        alignSelf: 'flex-start',
        backgroundColor: Colors.accentGlow,
        borderRadius: Radius.full,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.xs,
        marginTop: Spacing.sm,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    regionPillText: {
        fontSize: FontSize.sm,
        color: Colors.accent,
        fontWeight: '600',
    },

    // Tiles Grid
    tilesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignSelf: 'center',
        marginBottom: Spacing.md,
        gap: Spacing.sm,
    },
    tile: {
        width: (width - Spacing.md * 2 - Spacing.sm * 3) / 2,
        backgroundColor: Colors.primaryCard,
        borderRadius: Radius.lg,
        padding: Spacing.md,
        borderWidth: 1,
        borderColor: Colors.border,
        alignItems: 'center',
    },
    tileIcon: { fontSize: 24, marginBottom: Spacing.xs },
    tileLabel: {
        fontSize: FontSize.xs,
        color: Colors.textMuted,
        fontWeight: '500',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 4,
    },
    tileValue: {
        fontSize: FontSize.lg,
        fontWeight: '700',
        color: Colors.accent,
        textAlign: 'center',
    },

    // Details card
    detailsCard: {
        marginHorizontal: Spacing.md,
        backgroundColor: Colors.primaryCard,
        borderRadius: Radius.xl,
        borderWidth: 1,
        borderColor: Colors.border,
        overflow: 'hidden',
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: Spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: Colors.divider,
    },
    detailIcon: { fontSize: 18, marginRight: Spacing.md, marginTop: 2 },
    detailContent: { flex: 1 },
    detailLabel: {
        fontSize: FontSize.xs,
        color: Colors.textMuted,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 4,
    },
    detailValue: {
        fontSize: FontSize.md,
        color: Colors.textPrimary,
        fontWeight: '500',
        lineHeight: 22,
    },
});

export default CountryDetailScreen;