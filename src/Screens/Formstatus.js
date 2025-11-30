

import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_URL = 'https://argosmob.uk/makroo/public/api/v1/delivery-records/get';

const Formstatus = ({navigation}) => {
  const insets = useSafeAreaInsets();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeButton, setActiveButton] = useState('RC'); // RC | PDI | Challan
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // API data
  const [deliveryChallans, setDeliveryChallans] = useState([]);
  const [pdiDeliveries, setPdiDeliveries] = useState([]);
  const [rcDeliveries, setRcDeliveries] = useState([]);
console.log("rcDeliveries",rcDeliveries)
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
  try {
    setLoading(true);
    setError(null);

    const userId = await AsyncStorage.getItem('userId');
    if (!userId) {
      setLoading(false);
      Alert.alert('Error', 'No userId found in AsyncStorage (key "userId")');
      return;
    }

    const formData = new FormData();
    formData.append('user_id', userId);

    // Use axios.post — easier to get headers right in RN
    const resp = await axios.post(API_URL, formData, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
      maxBodyLength: Infinity,
      // optional: increase timeout if your server is slow
      timeout: 20000,
    });

    console.log('API response status:', resp.status);
    console.log('API response data:', resp.data);

    if (resp && resp.data && resp.data.status) {
      const body = resp.data;
      setDeliveryChallans(Array.isArray(body.delivery_challans) ? body.delivery_challans : []);
      setPdiDeliveries(Array.isArray(body.pdi_deliveries) ? body.pdi_deliveries : []);
      setRcDeliveries(Array.isArray(body.rc_deliveries) ? body.rc_deliveries : []);
    } else {
      const message = resp?.data?.message || 'Unexpected response from server';
      setError(message);
      Alert.alert('Error', message);
    }
  } catch (err) {
    // Detailed logging to help locate the problem
    console.log('API error - message:', err.message);
    if (err.response) {
      // Server responded with a status outside 2xx
      console.log('API error - response.status:', err.response.status);
      console.log('API error - response.data:', err.response.data);
      const serverMsg = err.response.data?.message || JSON.stringify(err.response.data);
      setError(serverMsg);
      Alert.alert('Server error', serverMsg);
    } else if (err.request) {
      // Request made but no response (network / CORS / SSL / device offline etc)
      console.log('API error - no response. request:', err.request);
      setError('No response from server (network or SSL issue).');
      Alert.alert('Network error', 'No response from server. Check network / SSL / Android permissions.');
    } else {
      // Something else happened
      console.log('API error - other:', err);
      setError('Failed to fetch data');
      Alert.alert('Error', 'Failed to fetch data. ' + err.message);
    }
  } finally {
    setLoading(false);
  }
};


  const handleHome = () => navigation.navigate('Dashboard');

  const handleSearchSubmit = () => {
    // nothing special – list is filtered live by searchQuery
    Alert.alert('Search', `Searching for: ${searchQuery}`);
  };

  const handleRC = () => setActiveButton('RC');
  const handlePDI = () => setActiveButton('PDI');
  const handleChallan = () => setActiveButton('Challan');

  // Helper to style action buttons
  const getButtonStyle = (buttonName) => {
    return activeButton === buttonName ? styles.actionButtonActive : styles.actionButtonInactive;
  };

  const getButtonTextStyle = (buttonName) => {
    return activeButton === buttonName ? styles.actionTextActive : styles.actionTextInactive;
  };

  const getStatusColor = (status) => (status === 'Complete' ? '#149418' : '#FF6B00');
  const getStatusBackground = (status) => (status === 'Complete' ? '#E8F5E8' : '#FFF3E8');

  const buildListForActive = () => {
    const q = searchQuery.trim().toLowerCase();

    if (activeButton === 'RC') {
      return rcDeliveries
        .map((r) => ({
          id: r.id,
          formNo: r.form_no || '',
          chassisNo: r.chassis_no || '',
          date: r.select_date || r.form_date || '',
          status: r.rc_issued === 'Yes' ? 'Complete' : 'Pending',
          formType: 'RC',
          customer: r.customer_name || '',
          raw: r,
        }))
        .filter((it) => {
          if (!q) return true;
          return (
            (it.formNo || '').toLowerCase().includes(q) ||
            (it.chassisNo || '').toLowerCase().includes(q) ||
            (it.customer || '').toLowerCase().includes(q)
          );
        });
    } else if (activeButton === 'PDI') {
      return pdiDeliveries
        .map((p) => ({
          id: p.id,
          formNo: p.form_no || '',
          chassisNo: p.chassis_no || '',
          date: p.select_date || p.form_date || '',
          status: p.tractor_delivered === '1' || p.delivery_date ? 'Complete' : 'Pending',
          formType: 'PDI',
          customer: p.customer_name || '',
          raw: p,
        }))
        .filter((it) => {
          if (!q) return true;
          return (
            (it.formNo || '').toLowerCase().includes(q) ||
            (it.chassisNo || '').toLowerCase().includes(q) ||
            (it.customer || '').toLowerCase().includes(q)
          );
        });
    } else {
      return deliveryChallans
        .map((d) => ({
          id: d.id,
          formNo: d.form_no || '',
          chassisNo: d.chassis_no || '',
          date: d.select_date || '',
          status: d.payment_status || 'Pending',
          formType: 'Challan',
          customer: d.customer_name || '',
          raw: d,
        }))
        .filter((it) => {
          if (!q) return true;
          return (
            (it.formNo || '').toLowerCase().includes(q) ||
            (it.chassisNo || '').toLowerCase().includes(q) ||
            (it.customer || '').toLowerCase().includes(q)
          );
        });
    }
  };

  const dataForList = buildListForActive();

  const renderFormItem = ({item}) => (
    <TouchableOpacity
      style={styles.formItem}
      onPress={() => navigation.navigate('Forminternalpage', {item: item.raw, formType: item.formType})}
    >
      <View style={styles.formHeader}>
        {/* <Text style={styles.formNo}>Form No: {item.formNo}</Text> */}
        {/* <View style={[styles.statusBadge, {backgroundColor: getStatusBackground(item.status)}]}>
          <Text style={[styles.statusText, {color: getStatusColor(item.status)}]}>{item.status}</Text>
        </View> */}
      </View>

      <View style={styles.formDetails}>
        <Text style={styles.detailText}>
          Chassis No: {item.chassisNo || '-'}  •  Date: {item.date || '-'}
        </Text>
        <Text style={styles.detailText}>
          Form Type: {item.formType}  •  Customer: {item.customer || '-'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom}}>
      <LinearGradient
        colors={['#7E5EA9', '#20AEBC']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        style={styles.header}>
        <Text style={styles.screenTitle}>Form Status</Text>
      </LinearGradient>

      <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
        {/* Search Input */}
        <View style={styles.section}>
          <LinearGradient
            colors={['#7E5EA9', '#20AEBC']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={styles.searchInputGradient}>
            <View style={styles.searchInputContainer}>
              <Icon name="search" size={20} color="#666" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Chassis No./ Customer"
                placeholderTextColor="#666"
                returnKeyType="search"
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Icon name="close" size={18} color="#666" />
                </TouchableOpacity>
              )}
            </View>
          </LinearGradient>
        </View>

        {/* Quick Actions Section */}
        <View style={styles.section}>
          <View style={styles.quickActions}>
            <TouchableOpacity style={[styles.actionButton, getButtonStyle('RC')]} onPress={handleRC}>
              <View style={styles.actionButtonContent}>
                <Text style={[styles.actionText, getButtonTextStyle('RC')]}>RC</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.actionButton, getButtonStyle('PDI')]} onPress={handlePDI}>
              <View style={styles.actionButtonContent}>
                <Text style={[styles.actionText, getButtonTextStyle('PDI')]}>PDI</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.actionButton, getButtonStyle('Challan')]} onPress={handleChallan}>
              <View style={styles.actionButtonContent}>
                <Text style={[styles.actionText, getButtonTextStyle('Challan')]}>Challan</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Forms Header
        <View style={styles.section}>
          <View style={styles.formsHeader}>
            <Text style={styles.formsTitle}>Forms</Text>
            <View style={styles.formsSubheader}>
              <View style={[styles.formsSubheaderItem, {flex: 1}]}>
                <Text style={styles.subheaderText}>Date</Text>
                <Icon name="keyboard-arrow-down" size={16} color="white" style={styles.subheaderIcon} />
              </View>
              <View style={[styles.formsSubheaderItem, {flex: 1, marginLeft: 6}]}>
                <Text style={styles.subheaderText}>Customers</Text>
                <Icon name="keyboard-arrow-down" size={16} color="white" style={styles.subheaderIcon} />
              </View>
            </View>
          </View>
        </View> */}

        {/* Loading / Error / List */}
        {loading ? (
          <View style={{padding: 20, alignItems: 'center'}}>
            <ActivityIndicator size="large" />
            <Text style={{marginTop: 10}}>Loading forms...</Text>
          </View>
        ) : error ? (
          <View style={{padding: 20, alignItems: 'center'}}>
            <Text style={{color: 'red'}}>{error}</Text>
            <TouchableOpacity onPress={fetchData} style={{marginTop: 10}}>
              <Text style={{color: '#007AFF'}}>Try again</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.section}>
            {dataForList.length === 0 ? (
              <View style={{padding: 20, alignItems: 'center'}}>
                <Text>No records found.</Text>
              </View>
            ) : (
              <FlatList
                data={dataForList}
                keyExtractor={(item) => String(item.id)}
                renderItem={renderFormItem}
                ItemSeparatorComponent={() => <View style={{height: 8}} />}
                contentContainerStyle={{paddingBottom: 20}}
              />
            )}
          </View>
        )}

        {/* Buttons at bottom */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.searchButton} onPress={handleSearchSubmit}>
            <Text style={styles.searchButtonText}>Apply Search</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.homeButton} onPress={handleHome}>
            <Text style={styles.homeButtonText}>Home</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    backgroundColor: '#f5f5f5',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  screenTitle: {
    fontSize: 20,
    fontFamily: 'Inter_28pt-SemiBold',
    color: 'white',
    textAlign: 'center',
  },
  section: {
    marginBottom: 10,
  },
  searchInputGradient: {
    borderRadius: 10,
    padding: 1,
    marginTop: 15,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 9,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    color: '#333',
    fontFamily: 'Inter_28pt-Medium',
  },
  quickActions: {
    flexDirection: 'row',
    marginTop: 10,
  },
  actionButton: {
    marginHorizontal: 6,
  },
  actionButtonContent: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  actionText: {
    textAlign: 'center',
    fontSize: 14,
    fontFamily: 'Inter_28pt-SemiBold',
  },
  actionButtonActive: {
    // no-op; underline handled on text
  },
  actionButtonInactive: {
    // no-op
  },
  actionTextActive: {
    color: 'black',
    borderBottomWidth: 2,
    borderBottomColor: 'black',
    paddingBottom: 4,
  },
  actionTextInactive: {
    color: '#666',
    borderBottomWidth: 0,
  },
  formsHeader: {
    marginTop: 10,
    marginBottom: 15,
  },
  formsTitle: {
    fontSize: 15,
    color: '#000',
    fontFamily: 'Inter_28pt-SemiBold',
    marginBottom: 10,
  },
  formsSubheader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  formsSubheaderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#20AEBC',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  subheaderText: {
    fontSize: 14.5,
    color: 'white',
    fontFamily: 'Inter_28pt-Medium',
  },
  subheaderIcon: {
    marginLeft: 8,
  },
  formItem: {
    backgroundColor: '#fff',
    padding: 12,
    marginBottom: 6,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    borderWidth:1,
    borderColor:"lightgrey"

  },
  formHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  formNo: {
    fontSize: 14,
    fontFamily: 'Inter_28pt-SemiBold',
    color: '#000',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Inter_28pt-SemiBold',
  },
  formDetails: {
    marginTop: 5,
  },
  detailText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 2,
    fontFamily:"Inter_28pt-Medium"
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 0,
    marginBottom: 30,
    paddingHorizontal: 15,
  },
  searchButton: {
    flex: 1,
    backgroundColor: '#7E5EA9',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 10,
    
  },
  searchButtonText: {
    color: '#fff',
    fontFamily: 'Inter_28pt-SemiBold',
    fontSize: 14,
  },
  homeButton: {
    flex:1,
    backgroundColor: '#20AEBC',
    borderRadius: 10,
    alignItems:"center",
    alignSelf:"center",
    padding:15
  },
  homeButtonText: {
    color: '#fff',
    fontFamily: 'Inter_28pt-SemiBold',
    fontSize: 15,
  
  },
});

export default Formstatus;
