// src/Screens/StockManagement/InternalOverview.js
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const { width } = Dimensions.get('window');

// You can keep these static (or wire later if you get APIs for them)
const LAST_MONTH_DATA = [
  { id: '1', label: 'Sales', value: 3, icon: 'warehouse' },
  { id: '2', label: 'Billing', value: 3, icon: 'receipt' },
];

const API_URL =
  'https://makroomotors.com/makroo-panel/public/api/v1/models-overview/delivered/detail';

export default function Report() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  // Delivered detail state
  const [rows, setRows] = useState([]); // [{ tractor_model, total_qty }]
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchDelivered = useCallback(async (isRefresh = false) => {
    try {
      setError(null);
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      const res = await axios.get(API_URL, {
        maxBodyLength: Infinity,
        timeout: 12000,
        headers: { Accept: 'application/json' },
      });

      const payload = res?.data?.data ?? [];
      if (!Array.isArray(payload)) throw new Error('Invalid response format');

      setRows(payload);
    } catch (err) {
      console.log('Delivered fetch error:', err?.response?.data || err?.message || err);
      setError(err?.response?.data?.message || err?.message || 'Failed to fetch delivered data.');
      setRows([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchDelivered(false);
  }, [fetchDelivered]);

  // Sum of delivered units (used in Current Month → Deliveries and badge)
  const deliveredTotal = useMemo(
    () =>
      rows.reduce((sum, r) => {
        const n = parseInt(r?.total_qty ?? 0, 10);
        return sum + (Number.isFinite(n) ? n : 0);
      }, 0),
    [rows]
  );

  // Build Current Month metrics (Deliveries from API; Billing left as 0 for now)
  const CURRENT_MONTH_DATA = useMemo(
    () => [
      { id: '3', label: 'Deliveries', value: deliveredTotal, icon: 'local-shipping' },
      { id: '4', label: 'Billing', value: 0, icon: 'receipt' }, // replace when you have a billing API
    ],
    [deliveredTotal]
  );

  // Normalize rows for Current Month Details list
  const STATUS_DATA = useMemo(
    () =>
      rows.map((r, idx) => ({
        id: String(idx + 1),
        title: r?.tractor_model ?? '—',
        subtitle: 'Model Wise Delivery And billing Tracking',
        units: `${parseInt(r?.total_qty ?? 0, 10) || 0} Delivered`,
        icon: 'inventory',
      })),
    [rows]
  );

  const onRefresh = () => fetchDelivered(true);

  const renderMetric = ({ item }) => (
    <LinearGradient
      colors={['#7E5EA9', '#20AEBC']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.metricGradientBorder}
    >
      <View style={styles.metricCard}>
        <View
          style={{
            backgroundColor: '#7E5EA9',
            width: (width - 60.5) / 2,
            paddingVertical: 14,
            borderTopRightRadius: 14,
            borderTopLeftRadius: 10,
            marginTop: -3,
          }}
        >
          <Text style={styles.metricLabel}>{item.label}</Text>
        </View>
        <TouchableOpacity >
          <Text style={styles.metricValue}>{item.value}</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );

  const renderStatus = ({ item }) => (
    <LinearGradient
      colors={['#7E5EA9', '#20AEBC']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.gradientBorder}
    >
      <View style={styles.statusCard}>
        <View style={styles.statusHeader}>
          <Text style={styles.statusTitle}>{item.title}</Text>
          <TouchableOpacity>
            <Text style={styles.statusUnits}>{item.units}</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.statusSubtitle}>{item.subtitle}</Text>
      </View>
    </LinearGradient>
  );

  return (
    <SafeAreaView
      style={[styles.safe, { paddingTop: insets.top, paddingBottom: insets.bottom }]}
    >
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
            <Text style={styles.headerText1}>Report</Text>
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
        {/* Monthly Report Section */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: 5,
          }}
        >
          <Text style={styles.sectionTitle}>Monthly Report</Text>
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
              Comparison
            </Text>
          </TouchableOpacity>
        </View>

        {/* Last Month Section (static for now) */}
        <Text style={[styles.subSectionTitle, { marginTop: 20 }]}>Last Month</Text>
        <FlatList
          data={LAST_MONTH_DATA}
          keyExtractor={(i) => i.id}
          renderItem={renderMetric}
          numColumns={2}
          scrollEnabled={false}
          contentContainerStyle={styles.metricsContainer}
          columnWrapperStyle={styles.columnWrapper}
        />

        {/* Current Month Section (Deliveries from API) */}
        <Text style={[styles.subSectionTitle, { marginTop: 10 }]}>Current Month</Text>
        <FlatList
          data={CURRENT_MONTH_DATA}
          keyExtractor={(i) => i.id}
          renderItem={renderMetric}
          numColumns={2}
          scrollEnabled={false}
          contentContainerStyle={styles.metricsContainer}
          columnWrapperStyle={styles.columnWrapper}
          ListFooterComponent={
            loading ? (
              <View style={{ paddingVertical: 10, alignItems: 'center' }}>
                <ActivityIndicator />
              </View>
            ) : null
          }
        />

        {/* Loading / Error for details */}
        {error ? (
          <View style={{ paddingHorizontal: 5, marginTop: 15 }}>
            <Text style={{ color: '#9E2A2B', marginBottom: 8 }}>{error}</Text>
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
        ) : null}

        {/* Current Month Details from API */}
        <Text style={[styles.sectionTitle, { marginTop: 25 }]}>Current Month Details</Text>

        {loading && STATUS_DATA.length === 0 ? (
          <View style={{ paddingVertical: 20, alignItems: 'center' }}>
            <ActivityIndicator size="large" />
          </View>
        ) : (
          <FlatList
            data={STATUS_DATA}
            keyExtractor={(item) => item.id}
            renderItem={renderStatus}
            scrollEnabled={false}
            contentContainerStyle={{ gap: 16, marginTop: 10, marginBottom: 10 }}
            ListEmptyComponent={
              <Text style={{ textAlign: 'center', color: '#666', marginTop: 10 }}>
                No delivered records found.
              </Text>
            }
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    paddingVertical: 8,
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
    fontSize: 15,
    color: '#fff',
    top: -3,
    textAlign: 'center',
    fontFamily: 'Inter_28pt-SemiBold',
  },
  iconButton: { top: -4 },
  sectionTitle: {
    fontSize: 16,
    color: '#000',
    marginBottom: 8,
    fontFamily: 'Inter_28pt-SemiBold',
  },
  subSectionTitle: {
    fontSize: 14.5,
    color: '#000',
    marginBottom: 8,
    fontFamily: 'Inter_28pt-SemiBold',
    marginLeft: 5,
  },
  metricsContainer: {
    marginTop: 10,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    gap: 15,
    marginBottom: 15,
  },
  metricCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    elevation: 0,
    paddingHorizontal: 15,
    alignItems: 'center',
    width: (width - 60) / 2,
    borderWidth: 1,
  },
  metricValue: {
    fontSize: 20,
    fontFamily: 'Inter_28pt-SemiBold',
    color: '#7E5EA9',
    paddingVertical: 17,
  },
  metricLabel: {
    fontSize: 15,
    color: 'white',
    marginTop: 3,
    fontFamily: 'Inter_28pt-SemiBold',
    textAlign: 'center',
  },
  gradientBorder: {
    borderRadius: 12,
    padding: 1.5,
  },
  statusCard: {
    borderRadius: 10,
    padding: 15,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  statusTitle: {
    fontSize: 16,
    color: 'white',
    fontFamily: 'Inter_28pt-SemiBold',
    flexWrap: 'wrap',
    flexShrink: 1,
    width:"64%"
  },
  statusUnits: {
    fontSize: 13,
    fontWeight: '600',
    color: '#20AEBC',
    marginTop: 0,
    fontFamily: 'Inter_28pt-SemiBold',
    backgroundColor: 'white',
    paddingHorizontal: 5,
    borderRadius: 5,
    alignItems: 'center',
  },
  statusSubtitle: {
    fontSize: 13,
    color: 'white',
    marginTop: 8,
    fontFamily: 'Inter_28pt-SemiBold',
  },
  metricGradientBorder: {
    borderRadius: 15,
    padding: 1,
  },
});
