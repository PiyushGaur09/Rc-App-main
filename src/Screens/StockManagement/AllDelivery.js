import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  Alert,
  RefreshControl,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AllDelivery = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [deliveryData, setDeliveryData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userId, setUserId] = useState('');

  const API_BASE = 'https://makroomotors.com/makroo-panel/public/';

  const handleBack = () => navigation.goBack();

  useEffect(() => {
    const fetchUserIdAndData = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        if (storedUserId) {
          setUserId(storedUserId);
          fetchDeliveryData(storedUserId);
        } else {
          setLoading(false);
          Alert.alert('Error', 'User ID not found. Please login again.');
        }
      } catch (error) {
        console.log('Error fetching user ID:', error);
        setLoading(false);
        Alert.alert('Error', 'Failed to load user data.');
      }
    };

    fetchUserIdAndData();
  }, []);

  const fetchDeliveryData = async (userId, isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const formData = new FormData();
      formData.append('user_id', userId);

      const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: API_BASE + 'api/v1/delivery-forms/all',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: formData,
        timeout: 10000,
      };

      const response = await axios(config);
      
      if (response.data.status && response.data.data) {
        setDeliveryData(response.data.data);
        setFilteredData(response.data.data);
      } else {
        Alert.alert('Info', 'No delivery forms found.');
      }
    } catch (error) {
      console.log('API Error:', error);
      if (error.response) {
        Alert.alert('Error', error.response.data?.message || 'Failed to fetch data.');
      } else if (error.request) {
        Alert.alert('Network Error', 'Please check your internet connection.');
      } else {
        Alert.alert('Error', 'Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    if (userId) {
      fetchDeliveryData(userId, true);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredData(deliveryData);
    } else {
      const filtered = deliveryData.filter(item =>
        item.customer_name?.toLowerCase().includes(query.toLowerCase()) ||
        item.tractor_number?.toLowerCase().includes(query.toLowerCase()) ||
        item.engine_number?.toLowerCase().includes(query.toLowerCase()) ||
        item.document_number?.toLowerCase().includes(query.toLowerCase()) ||
        item.father_name?.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredData(filtered);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return '#4CAF50';
      case 'rejected':
        return '#F44336';
      case 'pending':
        return '#2196F3';
      case 'edited':
        return '#FF9800';
      default:
        return '#2196F3';
    }
  };

  const getStatusText = (status) => {
    if (!status) return 'Pending';
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const handleFormPress = (formId, status) => {
    navigation.navigate('Deliveryforminternalpage', { 
      formId,
      status
    });
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { paddingTop: insets.top }]}>
        <LinearGradient
          colors={['#7E5EA9', '#20AEBC']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.header}>
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <Icon name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.screenTitle}>All Delivery Forms</Text>
            <View style={styles.placeholder} />
          </View>
        </LinearGradient>
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#7E5EA9" />
          <Text style={styles.loadingText}>Loading Delivery Forms...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom }}>
      <LinearGradient
        colors={['#7E5EA9', '#20AEBC']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Icon name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.screenTitle}>All Delivery Forms</Text>
          <View style={styles.placeholder} />
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.container} 
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#7E5EA9']}
            tintColor="#7E5EA9"
          />
        }
      >
        <View style={styles.searchContainer}>
          <View style={styles.searchBox}>
            <Icon name="search" size={20} color="#666" style={styles.searchIcon} />
            <TextInput
              placeholder="Customer\Tractor No\Engine No."
              placeholderTextColor="#999"
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={handleSearch}
            />
            {searchQuery !== '' && (
              <TouchableOpacity onPress={() => handleSearch('')} style={styles.clearButton}>
                <Icon name="close" size={18} color="#666" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.resultsContainer}>
          <Text style={styles.resultsText}>
            {filteredData.length} Delivery Form{filteredData.length !== 1 ? 's' : ''} found
          </Text>
          <TouchableOpacity onPress={onRefresh} style={styles.refreshButton}>
            <Icon name="refresh" size={20} color="#7E5EA9" />
          </TouchableOpacity>
        </View>

        {filteredData.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Icon name="local-shipping" size={60} color="#ccc" />
            <Text style={styles.emptyText}>
              {searchQuery ? 'No matching delivery forms found' : 'No delivery forms available'}
            </Text>
            {searchQuery ? (
              <TouchableOpacity onPress={() => handleSearch('')} style={styles.clearSearchButton}>
                <Text style={styles.clearSearchText}>Clear Search</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={onRefresh} style={styles.refreshActionButton}>
                <Text style={styles.refreshActionText}>Refresh</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          filteredData.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              style={styles.formCard}
              onPress={() => handleFormPress(item.id, item.status)}
            >
              <View style={styles.formHeader}>
                <View style={styles.formNumberContainer}>
                  <Text style={styles.formDate}>{formatDate(item.submitted_at)}</Text>
                </View>
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(item.status) }
                ]}>
                  <Text style={styles.statusText}>
                    {getStatusText(item.status)}
                  </Text>
                </View>
              </View>
              
              <View style={styles.formDetails}>
                <View style={styles.detailRow}>
                  <Icon name="person" size={16} color="#666" />
                  <Text style={styles.detailLabel}>Customer Name : </Text>
                  <Text style={styles.detailValue} numberOfLines={1}>
                    {item.customer_name || 'N/A'}
                  </Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Icon name="people" size={16} color="#666" />
                  <Text style={styles.detailLabel}>Father Name : </Text>
                  <Text style={styles.detailValue} numberOfLines={1}>
                    {item.father_name || 'N/A'}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Icon name="fingerprint" size={16} color="#666" />
                  <Text style={styles.detailLabel}>Tractor Name : </Text>
                  <Text style={styles.detailValue} numberOfLines={1}>
                    {item.tractor_number || 'N/A'}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Icon name="build" size={16} color="#666" />
                  <Text style={styles.detailLabel}>Engine No : </Text>
                  <Text style={styles.detailValue} numberOfLines={1}>
                    {item.engine_number || 'N/A'}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Icon name="description" size={16} color="#666" />
                  <Text style={styles.detailLabel}>Document : </Text>
                  <Text style={styles.detailValue} numberOfLines={1}>
                    {item.document_type || 'N/A'} - {item.document_number || 'N/A'}
                  </Text>
                </View>

                {item.address && (
                  <View style={styles.detailRow}>
                    <Icon name="location-on" size={16} color="#666" />
                    <Text style={styles.detailLabel}>Address : </Text>
                    <Text style={styles.detailValue} numberOfLines={2}>
                      {item.address}
                    </Text>
                  </View>
                )}
              </View>

              <View style={styles.signatureContainer}>
                <View style={styles.signatureBox}>
                  <Text style={styles.signatureLabel}>Customer Signature</Text>
                  {item.customer_signature ? (
                    <Image 
                      source={{ uri: API_BASE + item.customer_signature }} 
                      style={styles.signatureImage}
                      resizeMode="contain"
                    />
                  ) : (
                    <Text style={styles.noSignature}>No Signature</Text>
                  )}
                </View>
                <View style={styles.signatureBox}>
                  <Text style={styles.signatureLabel}>Manager Signature</Text>
                  {item.manager_signature ? (
                    <Image 
                      source={{ uri: API_BASE + item.manager_signature }} 
                      style={styles.signatureImage}
                      resizeMode="contain"
                    />
                  ) : (
                    <Text style={styles.noSignature}>No Signature</Text>
                  )}
                </View>
              </View>
              
              <View style={styles.formFooter}>
                <Text style={styles.footerText}>Tap to view details</Text>
                <View style={styles.footerRight}>
                  <Icon name="chevron-right" size={16} color="#7E5EA9" />
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}

        {filteredData.length > 0 && (
          <View style={styles.listFooter}>
            <Text style={styles.listFooterText}>
              {filteredData.length === deliveryData.length 
                ? 'All forms loaded' 
                : `${filteredData.length} of ${deliveryData.length} forms shown`}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  header: {
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 5,
  },
  screenTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    flex: 1,
  },
  placeholder: {
    width: 24,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  searchContainer: {
    padding: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#666',
  },
  clearButton: {
    padding: 5,
  },
  resultsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    paddingBottom: 5,
  },
  resultsText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  refreshButton: {
    padding: 5,
  },
  formCard: {
    backgroundColor: 'white',
    marginHorizontal: 15,
    marginVertical: 8,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: '#20AEBC',
  },
  formHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  formNumberContainer: {
    flex: 1,
  },
  formNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  formDate: {
    fontSize: 12,
    color: '#666',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 10,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    color: 'white',
  },
  formDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginLeft: 6,
    width: 100,
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  signatureContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  signatureBox: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  signatureLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
    fontWeight: '500',
  },
  signatureImage: {
    width: 60,
    height: 40,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  noSignature: {
    fontSize: 11,
    color: '#999',
    fontStyle: 'italic',
  },
  formFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
  },
  footerText: {
    fontSize: 12,
    color: '#20AEBC',
  },
  footerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#999',
    marginTop: 10,
    textAlign: 'center',
    lineHeight: 22,
  },
  clearSearchButton: {
    marginTop: 15,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#20AEBC',
    borderRadius: 6,
  },
  clearSearchText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  refreshActionButton: {
    marginTop: 15,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#7E5EA9',
    borderRadius: 6,
  },
  refreshActionText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  listFooter: {
    padding: 15,
    alignItems: 'center',
  },
  listFooterText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
});

export default AllDelivery;