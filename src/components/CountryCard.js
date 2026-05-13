import React, { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SvgXml } from 'react-native-svg';
import { Colors, FontSize, Radius, Spacing } from '../theme/colors';

const CountryCard = React.memo(({ country, onPress }) => {

  const {
    name,
    flags,
    capital,
    region,
    population,
  } = country;

  const countryName = name?.common || 'Unknown';
  const flagPngUrl = flags?.png;
  const flagSvgUrl = flags?.svg;

  const [svgMarkup, setSvgMarkup] = useState(null);
  const [useSvgFallback, setUseSvgFallback] = useState(false);
  const [loadingSvg, setLoadingSvg] = useState(false);

  const capitalCity = capital?.[0] || 'N/A';
  const formattedPop = population
    ? population >= 1_000_000
      ? `${(population / 1_000_000).toFixed(1)}M`
      : `${(population / 1_000).toFixed(0)}K`
    : 'N/A';

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
      console.error(`[CountryCard] SVG fallback failed for ${countryName}:`, err);
      setUseSvgFallback(false);
    } finally {
      setLoadingSvg(false);
    }
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.75}
    >
      {/* Flag Image */}
      <View style={styles.flagContainer}>
        {useSvgFallback && svgMarkup ? (
          loadingSvg ? (
            <ActivityIndicator size="small" color={Colors.accent} />
          ) : (
            <View
              style={{
                width: 72,
                height: 48,
                overflow: 'hidden',
                backgroundColor: '#fff',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <View
                style={{
                  transform: [
                    { translateX: -10 },
                    { translateY: -5 },
                    { scale: 0.1 },
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
            style={styles.flag}
            resizeMode="cover"
            accessibilityLabel={`Flag of ${countryName}`}
            onError={() => {
              if (flagSvgUrl && !useSvgFallback) {
                loadSvgFallback();
              }
            }}
          />
        )}
      </View>

      {/* Country Info */}
      <View style={styles.info}>
        <Text style={styles.countryName} numberOfLines={1}>
          {countryName}
        </Text>

        {/* Region Badge */}
        <View style={styles.regionBadge}>
          <Text style={styles.regionText}>{region}</Text>
        </View>

        {/* Capital & Population Row */}
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Capital</Text>
            <Text style={styles.metaValue} numberOfLines={1}>
              {capitalCity}
            </Text>
          </View>
          <View style={styles.metaDivider} />
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Population</Text>
            <Text style={styles.metaValue}>{formattedPop}</Text>
          </View>
        </View>
      </View>

      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryCard,
    borderRadius: Radius.lg,
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.sm,
    padding: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    elevation: 4,
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  flagContainer: {
    borderRadius: Radius.sm,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  flag: {
    width: 72,
    height: 48,
  },
  info: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  countryName: {
    fontSize: FontSize.md,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  regionBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.accentGlow,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  regionText: {
    fontSize: FontSize.xs,
    color: Colors.accent,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaItem: {
    flex: 1,
  },
  metaDivider: {
    width: 1,
    height: 24,
    backgroundColor: Colors.divider,
    marginHorizontal: Spacing.sm,
  },
  metaLabel: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    fontWeight: '500',
  },
  metaValue: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  chevron: {
    fontSize: 24,
    color: Colors.accent,
    marginLeft: Spacing.sm,
    opacity: 0.7,
  },
});

export default CountryCard;