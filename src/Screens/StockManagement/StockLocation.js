// StockLocation.js
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

const API_BASE = 'https://argosmob.uk/makroo/public/api/v1/models-overview';

const StockLocation = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  // If you need this dynamic later, read from route params.
  const statusParam = 'location_stock';

  const [rawData, setRawData] = useState([]); // API rows: [{ tractor_model, total_qty }]
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(
    async (isRefresh = false) => {
      try {
        setError(null);
        if (isRefresh) setRefreshing(true);
        else setLoading(true);

        const url = `${API_BASE}/${encodeURIComponent(statusParam)}/detail`;
        const res = await axios.get(url, {
          maxBodyLength: Infinity,
          timeout: 12000,
          headers: { Accept: 'application/json' },
        });

        const payload = res?.data?.data ?? [];
        if (!Array.isArray(payload)) throw new Error('Invalid response format');

        setRawData(payload);
      } catch (err) {
        console.log('StockLocation fetch error:', err?.response?.data || err?.message || err);
        setError(err?.response?.data?.message || err?.message || 'Failed to fetch stock.');
        setRawData([]);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [statusParam]
  );

  useEffect(() => {
    fetchData(false);
  }, [fetchData]);

  // Normalize API -> UI: { id, location, units }
  const listData = useMemo(
    () =>
      rawData.map((row, idx) => ({
        id: String(idx + 1),
        location: row?.tractor_model ?? '—',
        units: Number.parseInt(row?.total_qty ?? 0, 10) || 0,
      })),
    [rawData]
  );

  const totalUnits = useMemo(
    () => listData.reduce((sum, item) => sum + (Number.isFinite(item.units) ? item.units : 0), 0),
    [listData]
  );

  const onRefresh = () => fetchData(true);

  const renderLocation = ({ item }) => {
    const locationLabel = item.location;
    const units = item.units;

    return (
      <LinearGradient
        colors={['#7E5EA9', '#20AEBC']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.locationGradientBorder}
      >
        <View style={styles.locationRow}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Icon name="location-on" size={20} color="#7E5EA9" />
            <Text style={styles.locationText} numberOfLines={3}>{locationLabel}</Text>
          </View>

          <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
            <TouchableOpacity
             
              style={{
                backgroundColor: '#7E5EA9',
                paddingHorizontal: 6,
                paddingVertical: 2,
                borderRadius: 5,
              }}
            >
              <Text style={styles.locationUnits}>{units} Units</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}
    >
      {/* Header */}
      <LinearGradient
        colors={['#7E5EA9', '#20AEBC']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Hamburger')}>
            <Icon name="reorder" size={25} color="#fff" />
          </TouchableOpacity>

          <View>
            <Text style={styles.headerText}>Makroo Motor Corp.</Text>
            <Text style={styles.headerText1}>Stock Location</Text>
          </View>

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
          <Text style={styles.sectionTitle}>Opening Stock - HO And Branches</Text>

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
            data={listData}
            keyExtractor={(item) => item.id}
            renderItem={renderLocation}
            scrollEnabled={false}
            contentContainerStyle={{ gap: 10, marginVertical: 15, paddingHorizontal: 10 }}
            ListEmptyComponent={
              <Text style={{ textAlign: 'center', color: '#666', marginTop: 10 }}>
                No data found.
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
  header: {
    paddingVertical: 6,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerText: {
    fontSize: 18.5,
    color: '#fff',
    fontFamily: 'Inter_28pt-SemiBold',
  },
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
  locationGradientBorder: {
    borderRadius: 12,
    padding: 1.5,
  },
  locationRow: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 13.5,
    color: '#000',
    fontFamily: 'Inter_28pt-Regular',
     flexWrap: 'wrap',
    flexShrink: 1,
    width:"70%"
  },
  locationUnits: {
    fontSize: 12.5,
    color: 'white',
    fontFamily: 'Inter_28pt-SemiBold',
  },
});

export default StockLocation;
