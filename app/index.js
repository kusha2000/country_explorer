import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import { fetchAllCountries, formatPopulation } from "../src/api/countriesApi";

export default function Page() {
    const [countries, setCountries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function loadCountries() {
            try {
                console.log('📍 Fetching countries...');
                const data = await fetchAllCountries();
                setCountries(data);
                setError(null);

                console.log(`✓ Success! Found ${data.length} countries`);
                console.log('First country:', data[0].name.common);

            } catch (error) {
                console.error('✗ API Error:', error.message);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }
        loadCountries();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.main}>
                <Text style={styles.title}>Country Explorer</Text>
                {loading ? (
                    <ActivityIndicator size="large" color="#0000ff" />
                ) : error ? (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorTitle}>❌ Error</Text>
                        <Text style={styles.errorText}>{error}</Text>
                    </View>
                ) : (
                    <>
                        <Text style={styles.subtitle}>Found {countries.length} countries</Text>
                        <ScrollView style={styles.list}>
                            {countries.slice(0, 10).map((country, index) => (
                                <Text key={index} style={styles.item}>
                                    {country.name.common} - {formatPopulation(country.population)}
                                </Text>
                            ))}
                        </ScrollView>
                    </>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        padding: 24,
    },
    main: {
        flex: 1,
        justifyContent: "center",
        maxWidth: 960,
        marginHorizontal: "auto",
        width: "100%",
    },
    title: {
        fontSize: 64,
        fontWeight: "bold",
        marginBottom: 16,
    },
    subtitle: {
        fontSize: 36,
        color: "#38434D",
        marginBottom: 16,
    },
    list: {
        flex: 1,
        width: "100%",
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 10,
    },
    item: {
        fontSize: 16,
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    errorContainer: {
        backgroundColor: "#ffebee",
        borderWidth: 2,
        borderColor: "#c62828",
        borderRadius: 8,
        padding: 16,
        marginTop: 16,
    },
    errorTitle: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#c62828",
        marginBottom: 8,
    },
    errorText: {
        fontSize: 16,
        color: "#c62828",
        lineHeight: 24,
    },
});
