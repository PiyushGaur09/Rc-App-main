// StockLocation.js  (TransitStatus screen)
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const API_URL =
  'https://makroomotors.com/makroo-panel/public/api/v1/models-overview/in_transit/detail';

const TransitStatus = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const [rows, setRows] = useState([]); // normalized rows: { id, code, quantity, status }
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchTransit = useCallback(async (isRefresh = false) => {
    try {
      setError(null);
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      const res = await axios.get(API_URL, {
        maxBodyLength: Infinity,
        timeout: 12000,
        headers: { Accept: 'application/json' },
      });

      // API shape:
      // { status: "success", message: "...", data: [{ tractor_model: "3025E", total_qty: "8" }, ...] }
      const payload = res?.data?.data ?? [];
      if (!Array.isArray(payload)) throw new Error('Invalid response format');

      const normalized = payload.map((r, idx) => ({
        id: String(idx + 1),
        code: r?.tractor_model ?? '—',
        quantity: String(parseInt(r?.total_qty ?? 0, 10) || 0),
        // we don't get per-item location here, so default to In Transit
        status: 'In Transit',
      }));

      setRows(normalized);
    } catch (err) {
      console.log('TransitStatus fetch error:', err?.response?.data || err?.message || err);
      setError(err?.response?.data?.message || err?.message || 'Failed to fetch transit status.');
      setRows([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchTransit(false);
  }, [fetchTransit]);

  const totalInTransit = useMemo(
    () =>
      rows.reduce((sum, r) => {
        const n = parseInt(r.quantity ?? 0, 10);
        return sum + (Number.isFinite(n) ? n : 0);
      }, 0),
    [rows]
  );

  const onRefresh = () => fetchTransit(true);

  const renderTransitItem = ({ item }) => {
    // Keep your special style for known destinations if you ever pass them here
    const isDepotOrHO =
      item.status === 'HO - Ganderbal' || item.status === 'Depot - Budgam';

    return (
      <LinearGradient
        colors={['#7E5EA9', '#20AEBC']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.itemGradientBorder}
      >
        <View style={styles.itemRow}>
          <View style={styles.itemLeft}>
            <View style={styles.itemTextContainer}>
              <Text style={styles.itemCode} numberOfLines={3} >{item.code} </Text>
              <Text style={styles.itemQuantity}>{item.quantity}</Text>
            </View>
          </View>
          <TouchableOpacity
            style={[
              styles.statusContainer,
              isDepotOrHO && {
                backgroundColor: 'white',
                borderWidth: 1,
                borderColor: '#dddd',
              },
            ]}
          >
            <Text style={[styles.statusText, isDepotOrHO && { color: 'grey' }]}>
              {item.status}
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}
    >
      {/* Header with Linear Gradient */}
      <LinearGradient
        colors={['#7E5EA9', '#20AEBC']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          {/* Left Side: Menu Icon */}
          <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Hamburger')}>
            <Icon name="reorder" size={25} color="#fff" />
          </TouchableOpacity>

          {/* Center: Dashboard Text */}
          <View>
            <Text style={styles.headerText}>Makroo Motor Corp.</Text>
            <Text style={styles.headerText1}>Transit Status</Text>
          </View>

          {/* Right Side: Icon */}
          <TouchableOpacity style={styles.iconButton}>
            <Icon name="notifications-on" size={25} color="#fff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 15, paddingVertical: 20 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Transit Status</Text>
          <TouchableOpacity style={styles.inTransitBadge} onPress={onRefresh}>
            <Text style={styles.inTransitText}>{totalInTransit} in Transit</Text>
          </TouchableOpacity>
        </View>

        {/* Loading / Error / List */}
        {loading ? (
          <View style={{ paddingVertical: 24, alignItems: 'center' }}>
            <ActivityIndicator size="large" />
          </View>
        ) : error ? (
          <View style={{ paddingHorizontal: 10 }}>
            <Text style={{ color: '#9E2A2B', marginBottom: 10 }}>{error}</Text>
            <TouchableOpacity
              onPress={onRefresh}
              style={{
                backgroundColor: '#7E5EA9',
                paddingHorizontal: 10,
                paddingVertical: 8,
                borderRadius: 8,
                alignSelf: 'flex-start',
              }}
            >
              <Text style={{ color: '#fff', fontFamily: 'Inter_28pt-SemiBold' }}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={rows}
            keyExtractor={(item) => item.id}
            renderItem={renderTransitItem}
            scrollEnabled={false}
            contentContainerStyle={styles.flatListContent}
            ListEmptyComponent={
              <Text style={{ textAlign: 'center', color: '#666', marginTop: 10 }}>
                No in-transit items found.
              </Text>
            }
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingVertical: 6, paddingHorizontal: 20 },
  headerContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerText: { fontSize: 18.5, color: '#fff', fontFamily: 'Inter_28pt-SemiBold' },
  headerText1: {
    fontSize: 14.5,
    color: '#fff',
    fontFamily: 'Inter_28pt-SemiBold',
    textAlign: 'center',
    top: -4,
  },
  iconButton: { top: -6 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 15,
    color: '#000',
    marginBottom: 8,
    fontFamily: 'Inter_28pt-SemiBold',
    flex: 1,
  },
  inTransitBadge: {
    backgroundColor: '#7E5EA9',
    paddingHorizontal: 6,
    borderRadius: 5,
    paddingVertical: 3,
    alignSelf: 'center',
  },
  inTransitText: { color: 'white', fontFamily: 'Inter_28pt-SemiBold' },
  flatListContent: { gap: 10, marginVertical: 15, paddingHorizontal: 10 },
  itemGradientBorder: { borderRadius: 12, padding: 1.5 },
  itemRow: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  itemTextContainer: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  itemCode: { fontSize: 13, color: '#000', fontFamily: 'Inter_28pt-Regular', flexWrap: 'wrap',
    flexShrink: 1,
    width:"70%" },
  itemQuantity: {
    fontSize: 14,
    color: '#000',
    fontFamily: 'Inter_28pt-Regular',
    backgroundColor: '#ddd',
    paddingHorizontal: 5,
    borderRadius: 3,
  },
  statusContainer: { backgroundColor: '#7E5EA9', paddingHorizontal: 5, paddingVertical: 4, borderRadius: 5, },
  statusText: { fontSize: 12.5, color: 'white', fontFamily: 'Inter_28pt-SemiBold' },
});

export default TransitStatus;
