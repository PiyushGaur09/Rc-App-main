// AllLocation.js
import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  TextInput,
  Alert,
  RefreshControl,
  ScrollView,
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const API_BASE = 'https://makroomotors.com/makroo-panel/public/api/v1';

const AllLocation = ({navigation}) => {
  const insets = useSafeAreaInsets();

  // list state
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // add modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm] = useState({location_name: '', address: ''});
  const [submitting, setSubmitting] = useState(false);

  // detail modal state
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [detail, setDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [detailSubmitting, setDetailSubmitting] = useState(false);

  const fetchLocations = useCallback(async () => {
    try {
      setError(null);
      const res = await axios.get(`${API_BASE}/stock-locations`, {maxBodyLength: Infinity});
      // API shape: {status, message, data: [...]}
      const data = Array.isArray(res?.data?.data) ? res.data.data : (Array.isArray(res?.data) ? res.data : []);
      // Normalize
      const list = (data || []).map(x => ({
        id: String(x?.id ?? ''),
        name: x?.location_name || x?.name || `Location ${x?.id ?? ''}`,
        address: x?.address || '',
        created_at: x?.created_at,
      }));
      setLocations(list);
    } catch (err) {
      console.log('Fetch locations error:', err?.response?.data || err?.message);
      setError(err?.response?.data?.message || err?.message || 'Failed to fetch locations.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchLocations();
  }, [fetchLocations]);

  const openAdd = () => {
    setForm({location_name: '', address: ''});
    setShowAddModal(true);
  };

  const validate = () => {
    if (!form.location_name?.trim()) return 'Please enter Location Name.';
    if (!form.address?.trim()) return 'Please enter Address.';
    return null;
  };

  const submitNewLocation = async () => {
    const v = validate();
    if (v) {
      Alert.alert('Validation', v);
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        location_name: form.location_name.trim(),
        address: form.address.trim(),
      };

      const res = await axios.post(
        `${API_BASE}/stock-locations`,
        JSON.stringify(payload),
        {
          headers: {'Content-Type': 'application/json'},
          maxBodyLength: Infinity,
        }
      );

      const ok = res?.status >= 200 && res?.status < 300;
      if (!ok) throw new Error('Unexpected response from server.');

      Alert.alert('Success', 'Location added successfully.');
      setShowAddModal(false);
      // refresh list
      setLoading(true);
      fetchLocations();
    } catch (err) {
      console.log('Add location error:', err?.response?.data || err?.message);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        'Failed to add location.';
      Alert.alert('Error', msg);
    } finally {
      setSubmitting(false);
    }
  };

  // --- DETAIL FETCH / UPDATE / DELETE ---

  const openDetail = async (id) => {
    // open modal and fetch details
    setSelectedId(id);
    setShowDetailModal(true);
    setDetail(null);
    setDetailError(null);
    setEditing(false);
    setDetailLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/stock-locations/${id}`, {maxBodyLength: Infinity});
      // Res shape likely {status, message, data: {...}} or direct object
      const payload = res?.data?.data ?? res?.data;
      const normalized = {
        id: String(payload?.id ?? id),
        location_name: payload?.location_name ?? payload?.name ?? '',
        address: payload?.address ?? '',
        created_at: payload?.created_at ?? null,
      };
      setDetail(normalized);
    } catch (err) {
      console.log('Fetch detail error:', err?.response?.data || err?.message);
      setDetailError(err?.response?.data?.message || err?.message || 'Failed to fetch detail.');
    } finally {
      setDetailLoading(false);
    }
  };

  const onChangeDetailField = (key, value) => {
    setDetail(prev => ({...prev, [key]: value}));
  };

  const updateLocation = async () => {
    if (!detail) return;
    if (!detail.location_name?.trim()) {
      Alert.alert('Validation', 'Please enter Location Name.');
      return;
    }
    if (!detail.address?.trim()) {
      Alert.alert('Validation', 'Please enter Address.');
      return;
    }

    setDetailSubmitting(true);
    try {
      const data = {
        location_name: detail.location_name.trim(),
        address: detail.address.trim(),
      };

      const res = await axios.put(
        `${API_BASE}/stock-locations/${detail.id}`,
        JSON.stringify(data),
        {
          headers: {'Content-Type': 'application/json'},
          maxBodyLength: Infinity,
        }
      );

      const ok = res?.status >= 200 && res?.status < 300;
      if (!ok) throw new Error('Unexpected response from server.');

      Alert.alert('Success', 'Location updated successfully.');
      setEditing(false);
      // refresh list and detail
      fetchLocations();
      // re-fetch detail to ensure authoritative data
      openDetail(detail.id);
    } catch (err) {
      console.log('Update location error:', err?.response?.data || err?.message);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        'Failed to update location.';
      Alert.alert('Error', msg);
    } finally {
      setDetailSubmitting(false);
    }
  };

  const deleteLocation = () => {
    if (!detail) return;
    Alert.alert(
      'Confirm Delete',
      `Are you sure you want to delete "${detail.location_name}"? This action cannot be undone.`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setDetailSubmitting(true);
              const res = await axios.delete(`${API_BASE}/stock-locations/${detail.id}`, {maxBodyLength: Infinity});
              const ok = res?.status >= 200 && res?.status < 300;
              if (!ok) throw new Error('Unexpected response from server.');
              Alert.alert('Deleted', 'Location deleted successfully.');
              setShowDetailModal(false);
              setDetail(null);
              // refresh list
              setLoading(true);
              fetchLocations();
            } catch (err) {
              console.log('Delete error:', err?.response?.data || err?.message);
              const msg =
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                err?.message ||
                'Failed to delete location.';
              Alert.alert('Error', msg);
            } finally {
              setDetailSubmitting(false);
            }
          },
        },
      ],
      {cancelable: true}
    );
  };

  const renderItem = ({item}) => (
    <TouchableOpacity onPress={() => openDetail(item.id)}>
      <View style={styles.card}>
        <View style={{flex: 1}}>
          <Text style={styles.cardTitle}>{item.name}</Text>
          <Text style={styles.cardSub}>{item.address}</Text>
        </View>
        <Icon name="location-on" size={22} color="#7E5EA9" />
      </View>
    </TouchableOpacity>
  );

  // Loading state with the same header vibe
  if (loading && !refreshing) {
    return (
      <View style={[styles.screen, {paddingTop: insets.top, paddingBottom: insets.bottom}]}>
        <LinearGradient colors={['#7E5EA9', '#20AEBC']} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={styles.header}>
           <View style={styles.headerContent}>
                            {/* Left Side: Menu Icon */}
                            <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Hamburger')}>
                              <Icon name="reorder" size={25} color="#fff" />
                            </TouchableOpacity>
                  
                            {/* Center: Dashboard Text */}
                            <View>
                              <Text style={styles.companyName}>Makroo Motor Corp.</Text>
                              <Text style={styles.companyName1}>All Locations</Text>
                            </View>
                  
                            {/* Right Side: Icon */}
                            <TouchableOpacity style={styles.iconButton}>
                              <Icon name="notifications-on" size={25} color="#fff" />
                            </TouchableOpacity>
                          </View>
                
      
        </LinearGradient>
        <View style={styles.center}>
          <ActivityIndicator />
          <Text style={styles.loadingText}>Loading locations…</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.screen, {paddingTop: insets.top, paddingBottom: insets.bottom}]}>
      {/* Header with Gradient */}
      <LinearGradient
        colors={['#7E5EA9', '#20AEBC']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        style={styles.header}
      >
         <View style={styles.headerContent}>
                            {/* Left Side: Menu Icon */}
                            <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Hamburger')}>
                              <Icon name="reorder" size={25} color="#fff" />
                            </TouchableOpacity>
                  
                            {/* Center: Dashboard Text */}
                            <View>
                              <Text style={styles.companyName}>Makroo Motor Corp.</Text>
                              <Text style={styles.companyName1}>All Locations</Text>
                            </View>
                  
                            {/* Right Side: Icon */}
                            <TouchableOpacity style={styles.iconButton}>
                              <Icon name="notifications-on" size={25} color="#fff" />
                            </TouchableOpacity>
                          </View>
                
       
      </LinearGradient>

      {/* Error bar */}
      {error ? (
        <View style={styles.errorBar}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={fetchLocations} style={styles.retryBtn}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      {/* Add button */}
      <View style={styles.topActions}>
        <TouchableOpacity style={styles.addBtn} onPress={openAdd}>
          <Icon name="add-location-alt" size={18} color="#fff" />
          <Text style={styles.addBtnText}>Add New Location</Text>
        </TouchableOpacity>
      </View>

      {/* List */}
      <FlatList
        data={locations}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Icon name="location-off" size={28} color="#00000066" />
            <Text style={styles.emptyText}>No locations found.</Text>
          </View>
        }
      />

      {/* Add Location Modal */}
      <Modal
        visible={showAddModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Modal header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Location</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)} style={styles.closeButton}>
                <Icon name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            {/* Form fields with gradient borders (matching your style) */}
            <View style={{paddingHorizontal: 15, paddingTop: 14, paddingBottom: 18}}>
              <View style={styles.inputContainer}>
                <LinearGradient
                  colors={['#7E5EA9', '#20AEBC']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  style={styles.inputGradient}
                >
                  <TextInput
                    style={styles.input}
                    value={form.location_name}
                    onChangeText={t => setForm(prev => ({...prev, location_name: t}))}
                    placeholder="Location Name"
                   placeholderTextColor="#666"

                  />
                </LinearGradient>
              </View>

              <View style={styles.inputContainer}>
                <LinearGradient
                  colors={['#7E5EA9', '#20AEBC']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  style={styles.inputGradient}
                >
                  <TextInput
                    style={[styles.input, {height: 100, textAlignVertical: 'top'}]}
                    value={form.address}
                    onChangeText={t => setForm(prev => ({...prev, address: t}))}
                    placeholder="Address"
                   placeholderTextColor="#666"

                    multiline
                    numberOfLines={4}
                  />
                </LinearGradient>
              </View>

              <TouchableOpacity
                style={[styles.submitButton, submitting && {opacity: 0.7}]}
                onPress={submitNewLocation}
                disabled={submitting}
              >
                {submitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitButtonText}>Save</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Detail Modal */}
      <Modal
        visible={showDetailModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowDetailModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, {maxHeight: '85%'}]}>
            {/* Modal header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Location Details</Text>
              <TouchableOpacity
                onPress={() => {
                  setShowDetailModal(false);
                  setDetail(null);
                }}
                style={styles.closeButton}
              >
                <Icon name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={{padding: 15}}>
              {detailLoading ? (
                <View style={{alignItems: 'center', paddingVertical: 30}}>
                  <ActivityIndicator />
                  <Text style={{marginTop: 8, color: '#666'}}>Loading detail…</Text>
                </View>
              ) : detailError ? (
                <View style={{paddingVertical: 20}}>
                  <Text style={{color: '#9E2A2B', marginBottom: 10}}>{detailError}</Text>
                  <TouchableOpacity onPress={() => openDetail(selectedId)} style={styles.retryBtn}>
                    <Text style={styles.retryText}>Retry</Text>
                  </TouchableOpacity>
                </View>
              ) : detail ? (
                <>
                  {/* Display or edit fields */}
                  <View style={{marginBottom: 12}}>
                    <Text style={styles.fieldLabel}>Location Name</Text>
                    {editing ? (
                      <View style={styles.inputContainer}>
                        <LinearGradient
                          colors={['#7E5EA9', '#20AEBC']}
                          start={{x: 0, y: 0}}
                          end={{x: 1, y: 0}}
                          style={styles.inputGradient}
                        >
                          <TextInput
                            style={styles.input}
                            value={detail.location_name}
                            onChangeText={(t) => onChangeDetailField('location_name', t)}
                            placeholder="Location Name"
                   placeholderTextColor="#666"

                          />
                        </LinearGradient>
                      </View>
                    ) : (
                      <Text style={styles.fieldValue}>{detail.location_name}</Text>
                    )}
                  </View>

                  <View style={{marginBottom: 12}}>
                    <Text style={styles.fieldLabel}>Address</Text>
                    {editing ? (
                      <View style={styles.inputContainer}>
                        <LinearGradient
                          colors={['#7E5EA9', '#20AEBC']}
                          start={{x: 0, y: 0}}
                          end={{x: 1, y: 0}}
                          style={styles.inputGradient}
                        >
                          <TextInput
                            style={[styles.input, {height: 100, textAlignVertical: 'top'}]}
                            value={detail.address}
                            onChangeText={(t) => onChangeDetailField('address', t)}
                            placeholder="Address"
                   placeholderTextColor="#666"

                            numberOfLines={4}
                            multiline
                          />
                        </LinearGradient>
                      </View>
                    ) : (
                      <Text style={styles.fieldValue}>{detail.address}</Text>
                    )}
                  </View>

                  <View style={{flexDirection: 'row', gap: 10, marginTop: 6}}>
                    {/* Toggle edit / save */}
                    {!editing ? (
                      <TouchableOpacity
                        style={[styles.submitButton, {flex: 1}]}
                        onPress={() => setEditing(true)}
                      >
                        <Text style={styles.submitButtonText}>Edit</Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        style={[styles.submitButton, {flex: 1, opacity: detailSubmitting ? 0.7 : 1}]}
                        onPress={updateLocation}
                        disabled={detailSubmitting}
                      >
                        {detailSubmitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitButtonText}>Save</Text>}
                      </TouchableOpacity>
                    )}

                    {/* Delete */}
                    <TouchableOpacity
                      style={[styles.deleteButton, {flex: 1}]}
                      onPress={deleteLocation}
                      disabled={detailSubmitting}
                    >
                      {detailSubmitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.deleteButtonText}>Delete</Text>}
                    </TouchableOpacity>
                  </View>
                </>
              ) : (
                <Text style={{color: '#666'}}>No detail available.</Text>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {flex: 1, backgroundColor: '#fff'},
  header: {paddingHorizontal:15, paddingVertical: 10},
  companyName: {fontSize: 18, fontWeight: '700', color: 'white', textAlign: 'center',fontFamily: 'Inter_28pt-SemiBold'},
  companyName1: {fontSize: 15, fontWeight: '500', color: 'white', textAlign: 'center',fontFamily: 'Inter_28pt-SemiBold'},

  topActions: {paddingHorizontal: 15, paddingTop: 12},
  addBtn: {
    backgroundColor: '#7E5EA9',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 8,
  },
  addBtnText: {color: '#fff', fontFamily: 'Inter_28pt-SemiBold', fontSize: 14},

  listContent: {paddingHorizontal: 15, paddingTop: 12, paddingBottom: 20},
  card: {
    borderWidth: 1,
    borderColor: '#0000001A',
    borderRadius: 10,
    padding: 14,
    backgroundColor: '#fff',
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  cardTitle: {fontSize: 15, fontFamily: 'Inter_28pt-SemiBold', color: '#000'},
  cardSub: {fontSize: 13, fontFamily: 'Inter_28pt-Regular', color: '#00000099', marginTop: 2},

  center: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  loadingText: {marginTop: 8, color: '#00000099', fontFamily: 'Inter_28pt-Regular'},

  errorBar: {
    marginHorizontal: 15,
    marginTop: 12,
    backgroundColor: '#FDECEC',
    borderColor: '#F5B5B5',
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  errorText: {color: '#9E2A2B', fontFamily: 'Inter_28pt-Regular', flex: 1},
  retryBtn: {paddingVertical: 6, paddingHorizontal: 10, backgroundColor: '#7E5EA9', borderRadius: 8},
  retryText: {color: '#fff', fontFamily: 'Inter_28pt-SemiBold', fontSize: 12},

  // Modal styles (aligned with your AddModel modals)
  modalOverlay: {flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center'},
  modalContent: {backgroundColor: 'white', borderRadius: 10, width: '90%', overflow: 'hidden'},
  modalHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 15, borderBottomWidth: 1, borderBottomColor: '#e0e0e0',
  },
  modalTitle: {fontSize: 16, fontWeight: 'bold', fontFamily: 'Inter_28pt-SemiBold'},
  closeButton: {padding: 4},

  // Inputs w/ gradient border (like your AddModel)
  inputContainer: {marginHorizontal: 0, marginBottom: 10},
  inputGradient: {borderRadius: 10, padding: 1},
  input: {
    borderRadius: 10,
    backgroundColor: '#fff',
    padding: 12,
    fontSize: 14,
    fontFamily: 'Inter_28pt-Regular',
  },

  // Primary button (same as other screens)
  submitButton: {
    backgroundColor: '#7E5EA9',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {color: '#fff', fontFamily: 'Inter_28pt-SemiBold', fontSize: 14},

  deleteButton: {
    backgroundColor: '#D9534F',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    marginLeft: 8,
  },
  deleteButtonText: {color: '#fff', fontFamily: 'Inter_28pt-SemiBold', fontSize: 14},

  emptyWrap: {alignItems: 'center', paddingVertical: 40},
  emptyText: {marginTop: 6, color: '#00000099', fontFamily: 'Inter_28pt-Regular'},

  // Detail fields
  fieldLabel: {fontSize: 13, color: '#333', marginBottom: 6, fontFamily: 'Inter_28pt-SemiBold'},
  fieldValue: {fontSize: 14, color: '#444', fontFamily: 'Inter_28pt-Regular'},
  headerContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
});

export default AllLocation;
