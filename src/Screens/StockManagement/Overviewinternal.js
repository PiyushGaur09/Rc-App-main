import React, { useEffect, useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  Image,
  Alert,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import axios from 'axios';

const { width, height } = Dimensions.get('window');
const API_MODEL_STOCKS = 'https://argosmob.uk/makroo/public/api/v1/model-stocks';

const alphanumeric = s => String(s ?? '').replace(/[^a-zA-Z0-9]/g, '');

export default function Overviewinternal({ route }) {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  // Accept id from route params. Support both `id` and `modelId` (many screens pass different names).
  const routeId = route?.params?.id ?? route?.params?.modelId ?? route?.params?.stockId ?? null;

  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState(null);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Edit modal state
  const [editVisible, setEditVisible] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    location_id: '',
    location_stock: '',
    in_transit: '',
    delivered: '',
    billed: '',
    depot_stock: '',
    billed_cash: '',
    billed_bank: '',
  });

  const numberOrZero = (v) => {
    const n = Number(String(v).replace(/[^0-9.-]/g, ''));
    return isFinite(n) ? n : 0;
  };

  const openEdit = () => {
    const prefill = {
      location_id: detail?.location?.id ?? detail?.location_id ?? '',
      location_stock: String(detail?.location_stock ?? 0),
      in_transit: String(detail?.in_transit ?? 0),
      delivered: String(detail?.delivered ?? 0),
      billed: String(detail?.billed ?? 0),
      depot_stock: String(detail?.depot_stock ?? 0),
      billed_cash: String(detail?.billed_cash ?? ''),
      billed_bank: String(detail?.billed_bank ?? ''),
    };
    setForm(prefill);
    setEditVisible(true);
  };

  const closeEdit = () => {
    if (!saving) setEditVisible(false);
  };

  const fetchDetail = useCallback(
    async (idToFetch = routeId, isRefresh = false) => {
      if (!idToFetch) {
        setError('Missing stock id');
        setDetail(null);
        setLoading(false);
        setRefreshing(false);
        return;
      }

      try {
        setError(null);
        if (isRefresh) setRefreshing(true);
        else setLoading(true);

        const res = await axios.get(`${API_MODEL_STOCKS}/${idToFetch}`, {
          maxBodyLength: Infinity,
          timeout: 12000,
        });

        // Response shape: {status, message, data: { ... }}
        const payload = res?.data?.data ?? res?.data ?? null;
        if (!payload) {
          throw new Error(res?.data?.message || 'Invalid response from server');
        }

        setDetail(payload);
      } catch (err) {
        console.log('Fetch model-stock detail error:', err?.response?.data || err?.message || err);
        setError(err?.response?.data?.message || err?.message || 'Failed to fetch detail.');
        setDetail(null);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [routeId]
  );

  // initial fetch
  useEffect(() => {
    fetchDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchDetail]);

  // refetch when screen focused (useful if user navigates back)
  useFocusEffect(
    useCallback(() => {
      fetchDetail();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fetchDetail])
  );

  // Build the UI data arrays from fetched detail (fallbacks for empty)
  const makeOverviewData = (d) => {
    if (!d) return [];
    return [
      { id: 'inDepot', label: 'In Depot', value: Number(d.depot_stock ?? 0), icon: 'warehouse' },
      { id: 'inTransit', label: 'In Transit', value: Number(d.in_transit ?? 0), icon: 'swap-horiz' },
      { id: 'delivered', label: 'Delivered', value: Number(d.delivered ?? 0), icon: 'local-shipping' },
      { id: 'billed', label: 'Billed', value: Number(d.billed ?? 0), icon: 'receipt' },
      { id: 'billedCash', label: 'Billed Cash', value: d.billed_cash || 'N/A', icon: 'attach-money' },
      { id: 'billedBank', label: 'Billed Bank', value: d.billed_bank || 'N/A', icon: 'account-balance' },
    ];
  };

  const makeLocationData = (d) => {
    if (!d) return [];
    // This single record corresponds to one location in this endpoint response.
    return [
      {
        id: `loc-${d.location?.id ?? d.location_id ?? '0'}`,
        locationId: d.location?.id ?? d.location_id ?? null,
        location: d.location?.location_name ?? `Location ${d.location_id ?? ''}`,
        units: Number(d.location_stock ?? 0),
      },
    ];
  };

  const makeStatusData = (d) => {
    if (!d) return [];
    return [
      {
        id: 'stockAvailable',
        title: 'Stock Available',
        subtitle: 'Ready for dispatch from this location',
        units: Number(d.location_stock ?? 0),
        icon: 'inventory',
      },
      {
        id: 'inTransit',
        title: 'In Transit',
        subtitle: 'Currently being moved from or to this location',
        units: Number(d.in_transit ?? 0),
        icon: 'swap-horiz',
      },
      {
        id: 'delivered',
        title: 'Successfully Delivered',
        subtitle: 'Completed deliveries for this stock',
        units: Number(d.delivered ?? 0),
        icon: 'check-circle',
      },
    ];
  };

  const onRefresh = () => fetchDetail(routeId, true);

  const renderMetric = ({ item }) => (
    <LinearGradient
      colors={['#7E5EA9', '#20AEBC']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.metricGradientBorder}
    >
      <View style={styles.metricCard}>
        <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between' }}>
          <Icon name={item.icon} size={28} color="#7E5EA9" />
        </View>
        <Text style={styles.metricValue}>{item.value}</Text>
        <Text style={styles.metricLabel}>{item.label}</Text>
      </View>
    </LinearGradient>
  );

  const renderLocation = ({ item }) => (
    <LinearGradient
      colors={['#7E5EA9', '#20AEBC']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.locationGradientBorder}
    >
      <View style={styles.locationRow}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1 }}>
          <Icon name="location-on" size={20} color="#7E5EA9" />
          <Text style={styles.locationText} numberOfLines={2}>{item.location}</Text>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <TouchableOpacity
            onPress={() => Alert.alert('Location stock', `${item.units} units at this location`)}
            style={styles.locationUnitsPill}
          >
            <Text style={styles.locationUnits}>{item.units} Units</Text>
          </TouchableOpacity>
        </View>
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
          <Text style={styles.statusTitle} numberOfLines={2}>{item.title}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <TouchableOpacity>
              <Text style={styles.statusUnits}>{item.units} Units</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Text style={styles.statusSubtitle}>{item.subtitle}</Text>
      </View>
    </LinearGradient>
  );

  // Derived arrays
  const OVERVIEW_DATA = makeOverviewData(detail);
  const LOCATION_DATA = makeLocationData(detail);
  const STATUS_DATA = makeStatusData(detail);

  // Header info (model + location)
  const modelTitle = detail?.model?.tractor_model ?? detail?.model?.model_name ?? 'Model';
  const modelSubtitle = detail?.model
    ? `${detail.model.model_name ?? ''} ${detail.model.year ? `(${detail.model.year})` : ''}`.trim()
    : '';
  const locationName = detail?.location?.location_name ?? '';

  // Save/Confirm handler
  const onConfirmEdit = async () => {
    if (!routeId) {
      Alert.alert('Missing ID', 'Cannot update without a valid stock id.');
      return;
    }

    // Basic sanity
    const payload = {
      location_id: numberOrZero(form.location_id),
      location_stock: numberOrZero(form.location_stock),
      in_transit: numberOrZero(form.in_transit),
      delivered: numberOrZero(form.delivered),
      billed: numberOrZero(form.billed),
      depot_stock: numberOrZero(form.depot_stock),
      billed_cash: form.billed_cash,
      billed_bank: form.billed_bank,
    };

    try {
      setSaving(true);
      const res = await axios.put(`${API_MODEL_STOCKS}/${routeId}`, payload, {
        maxBodyLength: Infinity,
        headers: { 'Content-Type': 'application/json' },
        timeout: 12000,
      });

      // Optional: show API message if present
      const msg = res?.data?.message || 'Updated successfully.';
      Alert.alert('Success', msg);

      // Refresh data then close
      await fetchDetail(routeId, true);
      setEditVisible(false);
    } catch (err) {
      console.log('Update error:', err?.response?.data || err?.message || err);
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        'Failed to update. Please try again.';
      Alert.alert('Update failed', msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
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
            <Text style={styles.headerText1}>Report Overview</Text>
          </View>
          <TouchableOpacity style={styles.iconButton}>
            <Icon name="notifications-on" size={25} color="#fff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 15, paddingVertical: 20 }}>
        {/* Top model + location panel - UPDATED FOR TEXT WRAPPING */}
        <View style={styles.topSectionContainer}>
          <View style={styles.modelInfoContainer}>
            {detail?.model?.model_picture ? (
              <Image
                source={{ uri: `https://argosmob.uk/makroo/public/${detail.model.model_picture}` }}
                style={styles.modelImage}
              />
            ) : (
              <View style={styles.modelImagePlaceholder}>
                <Icon name="agriculture" size={22} color="#fff" />
              </View>
            )}
            <View style={styles.textInfoContainer}>
              <Text style={styles.modelTitle} numberOfLines={3}>{modelTitle}</Text>
              {modelSubtitle ? (
                <Text style={styles.modelSubtitle} numberOfLines={3}>{modelSubtitle}</Text>
              ) : null}
              {locationName ? (
                <Text style={styles.locationName} numberOfLines={3}>{locationName}</Text>
              ) : null}
            </View>
          </View>

          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={styles.refreshButton}
              onPress={onRefresh}
            >
              <Text style={styles.buttonText}>
                {detail ? `Total ${detail.location_stock ?? 0}` : 'Refresh'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.editButton}
              onPress={openEdit}
              disabled={!routeId}
            >
              <Text style={styles.buttonText}>Edit</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Error or loading */}
        {loading ? (
          <View style={{ paddingVertical: 30, alignItems: 'center' }}>
            <ActivityIndicator size="large" />
          </View>
        ) : error ? (
          <View style={{ paddingVertical: 12 }}>
            <Text style={{ color: '#9E2A2B', marginBottom: 8 }}>{error}</Text>
            <TouchableOpacity onPress={() => fetchDetail(routeId)} style={styles.retryBtn}>
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* Metrics grid */}
            <View style={styles.metricsHeader}>
              <Text style={styles.sectionTitle} numberOfLines={3}>
                {detail ? `${detail.model?.tractor_model ?? 'Model'} - Detailed Overview` : 'Detailed Overview'}
              </Text>
              <TouchableOpacity style={styles.totalPill}>
                <Text style={styles.totalText}>
                  Total {detail ? Number(detail.location_stock ?? 0) : 0}
                </Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={makeOverviewData(detail)}
              keyExtractor={(i) => i.id}
              renderItem={renderMetric}
              numColumns={2}
              scrollEnabled={false}
              contentContainerStyle={styles.metricsContainer}
              columnWrapperStyle={styles.columnWrapper}
            />

            {/* Location Distribution */}
            <Text style={styles.sectionTitle}>Location Wise Stock Distribution</Text>
            <FlatList
              data={makeLocationData(detail)}
              keyExtractor={(i) => i.id}
              renderItem={renderLocation}
              scrollEnabled={false}
              contentContainerStyle={{ gap: 10, marginVertical: 5 }}
            />

            {/* Status Overview */}
            <Text style={[styles.sectionTitle, { marginTop: 25 }]}>Stock Status Overview</Text>
            <FlatList
              data={makeStatusData(detail)}
              keyExtractor={(i) => i.id}
              renderItem={renderStatus}
              scrollEnabled={false}
              contentContainerStyle={{ gap: 16, marginTop: 10 }}
            />
          </>
        )}
      </ScrollView>

      {/* IMPROVED EDIT MODAL */}
      <Modal
        transparent
        visible={editVisible}
        animationType="slide"
        onRequestClose={closeEdit}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalWrap}
        >
          <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={closeEdit} />

          <View style={styles.sheet}>
            {/* Header with gradient */}
            <LinearGradient
              colors={['#7E5EA9', '#20AEBC']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.sheetHeader}
            >
              <View style={styles.sheetHeaderContent}>
                <Text style={styles.sheetTitle}>Edit Stock Details</Text>
                <TouchableOpacity onPress={closeEdit} disabled={saving} style={styles.closeButton}>
                  <Icon name="close" size={24} color="#fff" />
                </TouchableOpacity>
              </View>
            </LinearGradient>

            {/* Scrollable Form Content */}
            <ScrollView 
              style={styles.formScrollView}
              contentContainerStyle={styles.formContent}
              showsVerticalScrollIndicator={true}
              keyboardShouldPersistTaps="handled"
            >
              {/* Form Fields in 2-column layout */}
              <View style={styles.formGrid}>
                {/* Column 1 */}
                <View style={styles.formColumn}>
                  <View style={styles.formGroup}>
                    <Text style={styles.label}>Location Stock</Text>
                    <LinearGradient colors={['#7E5EA9', '#20AEBC']} style={styles.inputGradient}>
                      <TextInput
                        style={styles.input}
                        keyboardType="number-pad"
                        value={String(form.location_stock ?? '')}
                        onChangeText={(t) => setForm((s) => ({ ...s, location_stock: t }))}
                        placeholder="e.g. 60"
                        placeholderTextColor="#999"
                      />
                    </LinearGradient>
                  </View>

                  <View style={styles.formGroup}>
                    <Text style={styles.label}>Delivered</Text>
                    <LinearGradient colors={['#7E5EA9', '#20AEBC']} style={styles.inputGradient}>
                      <TextInput
                        style={styles.input}
                        keyboardType="number-pad"
                        value={String(form.delivered ?? '')}
                        onChangeText={(t) => setForm((s) => ({ ...s, delivered: t }))}
                        placeholder="e.g. 12"
                        placeholderTextColor="#999"
                      />
                    </LinearGradient>
                  </View>

                  <View style={styles.formGroup}>
                    <Text style={styles.label}>Billed Cash</Text>
                    <LinearGradient colors={['#7E5EA9', '#20AEBC']} style={styles.inputGradient}>
                      <TextInput
                        style={styles.input}
                        value={String(form.billed_cash ?? '')}
                        onChangeText={(t) => setForm((s) => ({ ...s, billed_cash: alphanumeric(t) }))}
                        placeholder="e.g. ABC123"
                        keyboardType="default"
                        autoCapitalize="characters"
                        placeholderTextColor="#999"
                      />
                    </LinearGradient>
                  </View>

                  <View style={styles.formGroup}>
                    <Text style={styles.label}>Depot Stock</Text>
                    <LinearGradient colors={['#7E5EA9', '#20AEBC']} style={styles.inputGradient}>
                      <TextInput
                        style={styles.input}
                        keyboardType="number-pad"
                        value={String(form.depot_stock ?? '')}
                        onChangeText={(t) => setForm((s) => ({ ...s, depot_stock: t }))}
                        placeholder="e.g. 25"
                        placeholderTextColor="#999"
                      />
                    </LinearGradient>
                  </View>
                </View>

                {/* Column 2 */}
                <View style={styles.formColumn}>
                  <View style={styles.formGroup}>
                    <Text style={styles.label}>In Transit</Text>
                    <LinearGradient colors={['#7E5EA9', '#20AEBC']} style={styles.inputGradient}>
                      <TextInput
                        style={styles.input}
                        keyboardType="number-pad"
                        value={String(form.in_transit ?? '')}
                        onChangeText={(t) => setForm((s) => ({ ...s, in_transit: t }))}
                        placeholder="e.g. 3"
                        placeholderTextColor="#999"
                      />
                    </LinearGradient>
                  </View>

                  <View style={styles.formGroup}>
                    <Text style={styles.label}>Billed</Text>
                    <LinearGradient colors={['#7E5EA9', '#20AEBC']} style={styles.inputGradient}>
                      <TextInput
                        style={styles.input}
                        keyboardType="number-pad"
                        value={String(form.billed ?? '')}
                        onChangeText={(t) => setForm((s) => ({ ...s, billed: t }))}
                        placeholder="e.g. 4"
                        placeholderTextColor="#999"
                      />
                    </LinearGradient>
                  </View>

                  <View style={styles.formGroup}>
                    <Text style={styles.label}>Billed Bank</Text>
                    <LinearGradient colors={['#7E5EA9', '#20AEBC']} style={styles.inputGradient}>
                      <TextInput
                        style={styles.input}
                        value={String(form.billed_bank ?? '')}
                        onChangeText={(t) => setForm((s) => ({ ...s, billed_bank: alphanumeric(t) }))}
                        placeholder="e.g. XYZ456"
                        keyboardType="default"
                        autoCapitalize="characters"
                        placeholderTextColor="#999"
                      />
                    </LinearGradient>
                  </View>
                </View>
              </View>
            </ScrollView>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[styles.cancelBtn, saving && { opacity: 0.7 }]}
                onPress={closeEdit}
                disabled={saving}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.confirmBtn, saving && { opacity: 0.7 }]}
                onPress={onConfirmEdit}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.confirmText}>Save Changes</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
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
    fontSize: 14.5,
    color: '#fff',
    top: -3,
    textAlign: 'center',
    fontFamily: 'Inter_28pt-SemiBold',
  },
  iconButton: { top: -4 },
  sectionTitle: {
    fontSize: 15,
    color: '#000',
    marginBottom: 8,
    fontFamily: 'Inter_28pt-SemiBold',
    width:"70%"
  },

  // Updated top section styles for proper text wrapping
  topSectionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
    width: '100%',
  },
  modelInfoContainer: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
    flex: 1,
    marginRight: 10,
  },
  textInfoContainer: {
    flex: 1,
  },
  modelTitle: {
    fontSize: 14,
    color: '#000',
    fontFamily: 'Inter_28pt-SemiBold',
    marginBottom: 2,
    flexWrap: 'wrap',
  },
  modelSubtitle: {
    fontSize: 12,
    color: 'rgba(0,0,0,0.45)',
    flexWrap: 'wrap',
  },
  locationName: {
    fontSize: 12,
    color: 'rgba(0,0,0,0.45)',
    marginTop: 4,
    flexWrap: 'wrap',
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  refreshButton: {
    backgroundColor: '#7E5EA9',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
  },
  editButton: {
    backgroundColor: '#20AEBC',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
  },
  buttonText: {
    color: 'white',
    fontFamily: 'Inter_28pt-SemiBold',
    fontSize: 12,
  },
  metricsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 5,
    marginBottom: 8,
  },
  totalPill: {
    backgroundColor: '#7E5EA9',
    paddingHorizontal: 6,
    borderRadius: 5,
    paddingVertical: 3,
  },
  totalText: {
    color: 'white',
    fontFamily: 'Inter_28pt-SemiBold',
    fontSize: 12,
  },

  // Metrics grid
  metricsContainer: {
    marginVertical: 20,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    gap: 15,
    marginBottom: 15,
  },
  metricGradientBorder: {
    borderRadius: 15,
    padding: 1,
  },
  metricCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 0,
    padding: 15,
    alignItems: 'center',
    width: (width - 60) / 2,
    borderWidth: 1,
    borderColor: '#0000000f',
  },
  metricValue: {
    fontSize: 20,
    fontFamily: 'Inter_28pt-SemiBold',
    color: '#7E5EA9',
    marginTop: 6,
  },
  metricLabel: {
    fontSize: 13,
    color: '#333',
    marginTop: 3,
    fontFamily: 'Inter_28pt-Regular',
  },

  // Location
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
    fontSize: 13,
    color: '#000',
    fontFamily: 'Inter_28pt-Regular',
    flex: 1,
  },
  locationUnitsPill: {
    backgroundColor: '#7E5EA9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
  },
  locationUnits: {
    fontSize: 12.5,
    color: 'white',
    fontFamily: 'Inter_28pt-SemiBold',
  },

  // Status
  gradientBorder: {
    borderRadius: 12,
    padding: 1.5,
  },
  statusCard: {
    borderRadius: 10,
    padding: 15,
    backgroundColor: 'transparent',
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  statusTitle: {
    fontSize: 16,
    color: 'white',
    fontFamily: 'Inter_28pt-SemiBold',
    flex: 1,
    marginRight: 10,
  },
  statusSubtitle: {
    fontSize: 13,
    color: 'white',
    marginTop: 8,
    fontFamily: 'Inter_28pt-SemiBold',
  },
  statusUnits: {
    fontSize: 14,
    fontWeight: '600',
    color: '#20AEBC',
    marginTop: 8,
    fontFamily: 'Inter_28pt-SemiBold',
    backgroundColor: 'white',
    paddingHorizontal: 5,
    borderRadius: 3,
    alignItems: 'center',
  },

  smallIconBtn: {
    backgroundColor: '#20AEBC',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
  },

  // Model image
  modelImage: { width: 56, height: 56, borderRadius: 8, backgroundColor: '#fff' },
  modelImagePlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.14)',
  },

  retryBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: '#7E5EA9',
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  retryText: { color: '#fff', fontFamily: 'Inter_28pt-SemiBold', fontSize: 12 },

  // IMPROVED Modal / Sheet Styles
  modalWrap: { 
    flex: 1, 
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  backdrop: { 
    ...StyleSheet.absoluteFillObject, 
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: height * 0.9,
    minHeight: height * 0.7,
  },
  sheetHeader: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  sheetHeaderContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sheetTitle: {
    fontSize: 18,
    color: '#fff',
    fontFamily: 'Inter_28pt-SemiBold',
    fontWeight: '600',
  },
  closeButton: {
    padding: 4,
  },
  formScrollView: {
    flex: 1,
  },
  formContent: {
    padding: 20,
  },
  formGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
  },
  formColumn: {
    flex: 1,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
    fontFamily: 'Inter_28pt-SemiBold',
  },
  inputGradient: {
    borderRadius: 10,
    padding: 1.5,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    color: '#000',
    fontFamily: 'Inter_28pt-Regular',
    borderWidth: 0,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    padding: 20,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  cancelText: {
    color: '#6c757d',
    fontFamily: 'Inter_28pt-SemiBold',
    fontSize: 14,
  },
  confirmBtn: {
    flex: 2,
    backgroundColor: '#7E5EA9',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  confirmText: {
    color: '#fff',
    fontFamily: 'Inter_28pt-SemiBold',
    fontSize: 14,
  },
});