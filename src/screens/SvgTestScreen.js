import { useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { SvgXml } from 'react-native-svg';
import { Colors, FontSize, Radius, Spacing } from '../theme/colors';

const SvgTestScreen = ({ navigation }) => {
    const [svgUrl, setSvgUrl] = useState(
        'https://upload.wikimedia.org/wikipedia/commons/5/5c/Flag_of_the_Taliban.svg'
    );

    const [svgMarkup, setSvgMarkup] = useState(null);
    const [loading, setLoading] = useState(false);

    // Zoom scale
    const [scale, setScale] = useState(1);

    const { width: screenWidth } = Dimensions.get('window');

    // Bigger preview area
    const previewWidth = screenWidth - 20;
    const previewHeight = 320;

    const loadSvg = async () => {
        setLoading(true);
        setSvgMarkup(null);

        try {
            const res = await fetch(svgUrl, {
                headers: {
                    Accept: 'image/svg+xml,image/*,*/*;q=0.8',
                    'User-Agent': 'Mozilla/5.0',
                },
            });

            if (!res.ok) {
                throw new Error(`Status ${res.status}`);
            }

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
        } catch (err) {
            console.log('[SVG ERROR]', err);
            setSvgMarkup(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.safe}>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.title}>SVG Test</Text>

                <TextInput
                    value={svgUrl}
                    onChangeText={setSvgUrl}
                    style={styles.input}
                    placeholder="Enter SVG URL"
                    placeholderTextColor={Colors.textMuted}
                    autoCapitalize="none"
                    autoCorrect={false}
                />

                {/* Load Button */}
                <TouchableOpacity style={styles.button} onPress={loadSvg}>
                    <Text style={styles.buttonText}>Load SVG</Text>
                </TouchableOpacity>

                {/* Scale Controls */}
                <View style={styles.controlsRow}>
                    <TouchableOpacity
                        style={[
                            styles.sizeButton,
                            scale === 1 && styles.sizeButtonActive,
                        ]}
                        onPress={() => setScale(1)}
                    >
                        <Text
                            style={[
                                styles.sizeButtonText,
                                scale === 1 && styles.sizeButtonTextActive,
                            ]}
                        >
                            Normal
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.sizeButton,
                            scale === 0.5 && styles.sizeButtonActive,
                        ]}
                        onPress={() => setScale(0.5)}
                    >
                        <Text
                            style={[
                                styles.sizeButtonText,
                                scale === 0.5 && styles.sizeButtonTextActive,
                            ]}
                        >
                            Half
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.sizeButton,
                            scale === 0.25 && styles.sizeButtonActive,
                        ]}
                        onPress={() => setScale(0.25)}
                    >
                        <Text
                            style={[
                                styles.sizeButtonText,
                                scale === 0.25 && styles.sizeButtonTextActive,
                            ]}
                        >
                            Quarter
                        </Text>
                    </TouchableOpacity>

                    {/* Zoom In */}
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => setScale((prev) => prev * 1.5)}
                    >
                        <Text style={styles.actionButtonText}>More</Text>
                    </TouchableOpacity>

                    {/* Reset */}
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => setScale(1)}
                    >
                        <Text style={styles.actionButtonText}>Reset</Text>
                    </TouchableOpacity>
                </View>

                {/* Preview */}
                <View style={styles.preview}>
                    {loading ? (
                        <ActivityIndicator size="large" color={Colors.accent} />
                    ) : svgMarkup ? (
                        <View
                            style={{
                                transform: [
                                    { translateX: 0 }, // MORE LEFT
                                    { translateY: 0 }, // MORE UP
                                    { scale },
                                ],
                            }}
                        >
                            <SvgXml
                                xml={svgMarkup}
                                width={previewWidth + 650}
                                height={previewHeight + 200}
                            />
                        </View>
                    ) : (
                        <Text style={styles.note}>No SVG loaded</Text>
                    )}
                </View>

                {/* Back */}
                <TouchableOpacity
                    style={styles.link}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.linkText}>Back</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: Colors.primary,
    },

    container: {
        padding: Spacing.md,
    },

    title: {
        fontSize: FontSize.xl,
        fontWeight: '800',
        color: Colors.textPrimary,
        marginBottom: Spacing.md,
    },

    input: {
        backgroundColor: Colors.primaryCard,
        borderRadius: Radius.md,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        borderWidth: 1,
        borderColor: Colors.border,
        color: Colors.textPrimary,
        marginBottom: Spacing.sm,
    },

    button: {
        backgroundColor: Colors.accent,
        paddingVertical: Spacing.sm,
        borderRadius: Radius.full,
        alignItems: 'center',
        marginBottom: Spacing.md,
    },

    buttonText: {
        color: Colors.primary,
        fontWeight: '700',
    },

    controlsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.sm,
        marginBottom: Spacing.md,
    },

    sizeButton: {
        backgroundColor: Colors.primaryCard,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.xs,
        borderRadius: Radius.full,
    },

    sizeButtonActive: {
        backgroundColor: Colors.accent,
    },

    sizeButtonText: {
        color: Colors.textSecondary,
    },

    sizeButtonTextActive: {
        color: Colors.primary,
        fontWeight: '700',
    },

    actionButton: {
        backgroundColor: Colors.primaryCard,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.xs,
        borderRadius: Radius.full,
    },

    actionButtonText: {
        color: Colors.textSecondary,
        fontWeight: '700',
    },

    preview: {
        height: 320,
        backgroundColor: '#fff',
        borderRadius: Radius.md,
        borderWidth: 1,
        borderColor: Colors.border,

        overflow: 'hidden',

        alignItems: 'center',
        justifyContent: 'center',

        marginBottom: Spacing.md,
    },

    note: {
        color: Colors.textMuted,
    },

    link: {
        alignItems: 'center',
    },

    linkText: {
        color: Colors.accent,
        fontWeight: '700',
    },
});

export default SvgTestScreen;