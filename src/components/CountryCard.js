import React, { useCallback } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Colors, Spacing, FontSize, Radius } from '../theme/colors';

const CountryCard = React.memo(({ country, onPress }) => {

  const {
    name,
    flags,
    capital,
    region,
    population,
  } = country;

  const countryName = name?.common || 'Unknown';
  const flagUrl = flags?.png || flags?.svg;
  const capitalCity = capital?.[0] || 'N/A'; 
  const formattedPop = population
    ? population >= 1_000_000
      ? `${(population / 1_000_000).toFixed(1)}M`
      : `${(population / 1_000).toFixed(0)}K`
    : 'N/A';

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.75}
    >
      {/* Flag Image */}
      <View style={styles.flagContainer}>
        <Image
          source={{ uri: flagUrl }}
          style={styles.flag}
          resizeMode="cover"
          accessibilityLabel={`Flag of ${countryName}`}
        />
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
    flexDirection: 'row',       // Children side by side
    alignItems: 'center',
    backgroundColor: Colors.primaryCard,
    borderRadius: Radius.lg,
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.xs,
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