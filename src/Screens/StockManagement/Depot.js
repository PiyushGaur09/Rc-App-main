// StockLocation.js (Depot screen)
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
  'https://makroomotors.com/makroo-panel/public/api/v1/models-overview/depot_stock/detail';

const Depot = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const [rows, setRows] = useState([]); // normalized: { id, location, units }
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchDepot = useCallback(async (isRefresh = false) => {
    try {
      setError(null);
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      const res = await axios.get(API_URL, {
        maxBodyLength: Infinity,
        timeout: 12000,
        headers: { Accept: 'application/json' },
      });

      // Response:
      // { status: "success", message: "...", data: [{ tractor_model: "3025E", total_qty: "8" }, ...] }
      const payload = res?.data?.data ?? [];
      if (!Array.isArray(payload)) throw new Error('Invalid response format');

      const normalized = payload.map((r, idx) => ({
        id: String(idx + 1),
        location: r?.tractor_model ?? '—',
        units: parseInt(r?.total_qty ?? 0, 10) || 0,
      }));

      setRows(normalized);
    } catch (err) {
      console.log('Depot fetch error:', err?.response?.data || err?.message || err);
      setError(err?.response?.data?.message || err?.message || 'Failed to fetch depot stock.');
      setRows([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchDepot(false);
  }, [fetchDepot]);

  const totalUnits = useMemo(
    () => rows.reduce((sum, r) => sum + (Number.isFinite(r.units) ? r.units : 0), 0),
    [rows]
  );

  const onRefresh = () => fetchDepot(true);

  const renderLocation = ({ item }) => (
    <LinearGradient
      colors={['#7E5EA9', '#20AEBC']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.locationGradientBorder}
    >
      <View style={styles.locationRow}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Text style={styles.locationText} numberOfLines={3} >{item.location}</Text>
        </View>
        <TouchableOpacity
          
          style={{
            backgroundColor: '#7E5EA9',
            paddingHorizontal: 10,
            paddingVertical: 2,
            borderRadius: 5,
          }}
        >
          <Text style={styles.locationUnits}>{item.units} QTY</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );

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
            <Text style={styles.headerText1}>Depot</Text>
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
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: 5,
            marginBottom: 15,
          }}
        >
          <Text style={styles.sectionTitle}>Depot Inventory</Text>
          <TouchableOpacity
            style={{
              backgroundColor: '#7E5EA9',
              paddingHorizontal: 6,
              borderRadius: 5,
              paddingVertical: 3,
              alignSelf: 'center',
            }}
            onPress={onRefresh}
          >
            <Text style={{ color: 'white', fontFamily: 'Inter_28pt-SemiBold' }}>
              Total- {totalUnits}
            </Text>
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
            renderItem={renderLocation}
            scrollEnabled={false}
            contentContainerStyle={{ gap: 10, marginVertical: 15, paddingHorizontal: 10 }}
            ListEmptyComponent={
              <Text style={{ textAlign: 'center', color: '#666', marginTop: 10 }}>
                No depot stock found.
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
  sectionTitle: {
    fontSize: 15,
    color: '#000',
    marginBottom: 8,
    fontFamily: 'Inter_28pt-SemiBold',
    flex: 1,
  },
  locationGradientBorder: { borderRadius: 12, padding: 1.5 },
  locationRow: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationText: { fontSize: 13, color: '#000', fontFamily: 'Inter_28pt-Regular', flexWrap: 'wrap',
    flexShrink: 1,
    width:"79%" },
  locationUnits: { fontSize: 12.5, color: 'white', fontFamily: 'Inter_28pt-SemiBold' },
});

export default Depot;
