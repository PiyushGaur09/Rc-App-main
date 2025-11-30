import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  TextInput,
  Alert,
  Dimensions,
  Platform
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import Icon1 from 'react-native-vector-icons/FontAwesome';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

// Responsive scaling functions
const scale = (size) => (width / 375) * size;
const verticalScale = (size) => (height / 812) * size;
const moderateScale = (size, factor = 0.5) => size + (scale(size) - size) * factor;

const Addcustomerpayment = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  
  // Check if we're in edit mode
  const isEditMode = route.params?.payment ? true : false;
  const paymentData = route.params?.payment || {};

  // State for form fields - matching Customerpaymentdetails structure
  const [formData, setFormData] = useState({
    id: '',
    entry_by: '',
    entry_date: new Date(),
    customer_name: '',
    father_name: '',
    customer_mobile: '',
    customer_address: '',
    tractor_model: '',
    delivery_date: new Date(),
    chassis_no: '',
    opening_balance: '',
    total_paid: '',
    status: 'pending' // Default status for new payments
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showDeliveryDatePicker, setShowDeliveryDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  // API Base URL
  const API_BASE_URL = 'https://argosmob.uk/makroo/public/api/v1';

  // Update form data
  const updateFormData = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Initialize form with payment data if in edit mode
  useEffect(() => {
    if (isEditMode && paymentData) {
      setFormData({
        id: paymentData.id || '',
        entry_by: paymentData.entry_by || '',
        entry_date: paymentData.entry_date ? new Date(paymentData.entry_date) : new Date(),
        customer_name: paymentData.customer_name || '',
        father_name: paymentData.father_name || '',
        customer_mobile: paymentData.customer_mobile || '',
        customer_address: paymentData.customer_address || '',
        tractor_model: paymentData.tractor_model || '',
        delivery_date: paymentData.delivery_date ? new Date(paymentData.delivery_date) : new Date(),
        chassis_no: paymentData.chassis_no || '',
        opening_balance: paymentData.opening_balance || '',
        total_paid: paymentData.total_paid || '',
        status: 'pending' // Reset status to pending when editing
      });
    }
  }, [isEditMode, paymentData]);

  // Date change handlers
  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      updateFormData('entry_date', selectedDate);
    }
  };

  const onDeliveryDateChange = (event, selectedDate) => {
    setShowDeliveryDatePicker(false);
    if (selectedDate) {
      updateFormData('delivery_date', selectedDate);
    }
  };

  // Format date for display
  const formatDate = (date) => {
    if (date instanceof Date) {
      return date.toLocaleDateString('en-GB');
    }
    return date;
  };

  // Format date for API (YYYY-MM-DD)
  const formatDateForAPI = (date) => {
    if (date instanceof Date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
    return date;
  };

  // Calculate remaining payment
  const remainingPayment = (parseFloat(formData.opening_balance) || 0) - (parseFloat(formData.total_paid) || 0);

  // Handle form submission with API - Save
  const handleSavePayment = async () => {
    // Basic validation
    if (!formData.customer_name || !formData.opening_balance || !formData.total_paid) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (parseFloat(formData.total_paid) > parseFloat(formData.opening_balance)) {
      Alert.alert('Error', 'Amount paid cannot be greater than opening balance');
      return;
    }

    setLoading(true);

    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        Alert.alert('Error', 'User not logged in. Please login again.');
        setLoading(false);
        return;
      }

      // Prepare data for API
      const apiData = {
        user_id: parseInt(userId),
        entry_by: formData.entry_by,
        entry_date: formatDateForAPI(formData.entry_date),
        customer_name: formData.customer_name,
        father_name: formData.father_name,
        customer_mobile: formData.customer_mobile,
        customer_address: formData.customer_address,
        tractor_model: formData.tractor_model,
        delivery_date: formatDateForAPI(formData.delivery_date),
        chassis_no: formData.chassis_no,
        opening_balance: parseFloat(formData.opening_balance),
        total_paid: parseFloat(formData.total_paid),
        status: formData.status // Include status in API data
      };

      let response;

      if (isEditMode) {
        // Update API call - when editing, status should be set to pending
        apiData.id = parseInt(formData.id);
        apiData.status = 'pending'; // Reset status to pending when user edits
        
        response = await axios.post(
          `${API_BASE_URL}/customer-payments/update`,
          apiData,
          {
            timeout: 30000,
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            }
          }
        );
      } else {
        // Add API call - new payments start as pending
        apiData.status = 'pending';
        
        response = await axios.post(
          `${API_BASE_URL}/customer-payments/add`,
          apiData,
          {
            timeout: 30000,
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            }
          }
        );
      }

      if (response.data && response.data.status === 'success') {
        Alert.alert('Success', 
          isEditMode 
            ? 'Customer payment updated successfully! Status reset to pending for admin approval.' 
            : 'Customer payment added successfully!'
        );
        
        // Reset form if not in edit mode
        if (!isEditMode) {
          setFormData({
            entry_by: '',
            entry_date: new Date(),
            customer_name: '',
            father_name: '',
            customer_mobile: '',
            customer_address: '',
            tractor_model: '',
            delivery_date: new Date(),
            chassis_no: '',
            opening_balance: '',
            total_paid: '',
            status: 'pending'
          });
        }

        // Navigate back to payment details with refresh
        navigation.navigate('Customerpaymentdetails', { 
          refresh: true 
        });
      } else {
        Alert.alert('Error', response.data.message || 'Failed to process payment');
      }
    } catch (error) {
      console.log('Error processing payment:', error);
      
      if (error.response) {
        Alert.alert('Error', 
          error.response.data?.message || 
          `Server error: ${error.response.status}`
        );
      } else if (error.request) {
        Alert.alert('Network Error', 
          'Unable to connect to server. Please check your internet connection.'
        );
      } else {
        Alert.alert('Error', 'An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[
      styles.container,
      { paddingTop: insets.top, paddingBottom: insets.bottom }
    ]}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
      
      {/* Header */}
      <LinearGradient
        colors={['#7E5EA9', '#20AEBC']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-left" size={moderateScale(24)} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isEditMode ? 'Edit Customer Payment' : 'Add Customer Payments'}
        </Text>
      </LinearGradient>

      {/* Content */}
      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Status Info for Edit Mode */}
        {isEditMode && (
          <View style={styles.statusInfoContainer}>
            <LinearGradient
              colors={['#FF9800', '#FF5722']}
              style={styles.statusInfoGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <View style={styles.statusInfoContent}>
                <Icon name="info" size={moderateScale(20)} color="red" />
                <Text style={styles.statusInfoText}>
                  After editing, status will reset to "Pending" for admin approval
                </Text>
              </View>
            </LinearGradient>
          </View>
        )}

        {/* Entry By */}
        <View style={styles.inputContainer}>
          <Text style={styles.fieldLabel}>Entry By</Text>
          <LinearGradient
            colors={['#7E5EA9', '#20AEBC']}
            style={styles.gradientBorder}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <TextInput
              style={styles.textInput}
              placeholder="Enter Entry By"
              placeholderTextColor="#666"
              value={formData.entry_by}
              onChangeText={(text) => updateFormData('entry_by', text)}
            />
          </LinearGradient>
        </View>

        {/* Entry Date */}
        <View style={styles.inputContainer}>
          <Text style={styles.fieldLabel}>Entry Date</Text>
          <TouchableOpacity onPress={() => setShowDatePicker(true)}>
            <LinearGradient
              colors={['#7E5EA9', '#20AEBC']}
              style={styles.gradientBorder}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <View style={styles.dateContainer}>
                <Text style={styles.dateText}>
                  {formatDate(formData.entry_date)}
                </Text>
                <Icon1 name="calendar-o" size={moderateScale(20)} color="grey" />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Customer Name */}
        <View style={styles.inputContainer}>
          <Text style={styles.fieldLabel}>Customer Name *</Text>
          <LinearGradient
            colors={['#7E5EA9', '#20AEBC']}
            style={styles.gradientBorder}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <TextInput
              style={styles.textInput}
              placeholder="Enter Customer Name"
              placeholderTextColor="#666"
              value={formData.customer_name}
              onChangeText={(text) => updateFormData('customer_name', text)}
            />
          </LinearGradient>
        </View>

        {/* Customer Father Name */}
        <View style={styles.inputContainer}>
          <Text style={styles.fieldLabel}>Customer Father Name</Text>
          <LinearGradient
            colors={['#7E5EA9', '#20AEBC']}
            style={styles.gradientBorder}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <TextInput
              style={styles.textInput}
              placeholder="Enter Customer Father Name"
              placeholderTextColor="#666"
              value={formData.father_name}
              onChangeText={(text) => updateFormData('father_name', text)}
            />
          </LinearGradient>
        </View>

        {/* Customer Mobile */}
        <View style={styles.inputContainer}>
          <Text style={styles.fieldLabel}>Customer Mobile</Text>
          <LinearGradient
            colors={['#7E5EA9', '#20AEBC']}
            style={styles.gradientBorder}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <TextInput
              style={styles.textInput}
              placeholder="Enter Customer Mobile"
              placeholderTextColor="#666"
              value={formData.customer_mobile}
              onChangeText={(text) => updateFormData('customer_mobile', text)}
              keyboardType="phone-pad"
            />
          </LinearGradient>
        </View>

        {/* Customer Address */}
        <View style={styles.inputContainer}>
          <Text style={styles.fieldLabel}>Customer Address</Text>
          <LinearGradient
            colors={['#7E5EA9', '#20AEBC']}
            style={styles.gradientBorder}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <TextInput
              style={[styles.textInput, styles.multilineInput]}
              placeholder="Enter Customer Address"
              placeholderTextColor="#666"
              value={formData.customer_address}
              onChangeText={(text) => updateFormData('customer_address', text)}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </LinearGradient>
        </View>

        {/* Tractor Model */}
        <View style={styles.inputContainer}>
          <Text style={styles.fieldLabel}>Tractor Model</Text>
          <LinearGradient
            colors={['#7E5EA9', '#20AEBC']}
            style={styles.gradientBorder}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <TextInput
              style={styles.textInput}
              placeholder="Enter Tractor Model"
              placeholderTextColor="#666"
              value={formData.tractor_model}
              onChangeText={(text) => updateFormData('tractor_model', text)}
            />
          </LinearGradient>
        </View>

        {/* Date of Delivery */}
        <View style={styles.inputContainer}>
          <Text style={styles.fieldLabel}>Date of Delivery</Text>
          <TouchableOpacity onPress={() => setShowDeliveryDatePicker(true)}>
            <LinearGradient
              colors={['#7E5EA9', '#20AEBC']}
              style={styles.gradientBorder}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <View style={styles.dateContainer}>
                <Text style={styles.dateText}>
                  {formatDate(formData.delivery_date)}
                </Text>
                <Icon1 name="calendar-o" size={moderateScale(20)} color="grey" />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Chassis No */}
        <View style={styles.inputContainer}>
          <Text style={styles.fieldLabel}>Chassis No</Text>
          <LinearGradient
            colors={['#7E5EA9', '#20AEBC']}
            style={styles.gradientBorder}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <TextInput
              style={styles.textInput}
              placeholder="Enter Chassis No"
              placeholderTextColor="#666"
              value={formData.chassis_no}
              onChangeText={(text) => updateFormData('chassis_no', text)}
            />
          </LinearGradient>
        </View>

        {/* Opening Balance */}
        <View style={styles.inputContainer}>
          <Text style={styles.fieldLabel}>Opening Balance *</Text>
          <LinearGradient
            colors={['#7E5EA9', '#20AEBC']}
            style={styles.gradientBorder}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <TextInput
              style={styles.textInput}
              placeholder="Enter Opening Balance"
              placeholderTextColor="#666"
              value={formData.opening_balance}
              onChangeText={(text) => updateFormData('opening_balance', text)}
              keyboardType="numeric"
              returnKeyType="done"
            />
          </LinearGradient>
        </View>

        {/* Amount Paid */}
        <View style={styles.inputContainer}>
          <Text style={styles.fieldLabel}>Amount Paid (initial) *</Text>
          <LinearGradient
            colors={['#7E5EA9', '#20AEBC']}
            style={styles.gradientBorder}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <TextInput
              style={styles.textInput}
              placeholder="Enter Amount Paid"
              placeholderTextColor="#666"
              value={formData.total_paid}
              onChangeText={(text) => updateFormData('total_paid', text)}
              keyboardType="numeric"
              returnKeyType="done"
            />
          </LinearGradient>
        </View>

        {/* Remaining Payment (Display only) */}
        <View style={styles.inputContainer}>
          <Text style={styles.fieldLabel}>Remaining Payment</Text>
          <LinearGradient
            colors={['#7E5EA9', '#20AEBC']}
            style={styles.gradientBorder}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <View style={styles.displayContainer}>
              <Text style={styles.displayLabel}>Remaining Payment:</Text>
              <Text style={styles.displayValue}>
                ₹{remainingPayment.toFixed(2)}
              </Text>
            </View>
          </LinearGradient>
        </View>

        {/* Save/Update Customer Payment Button */}
        <TouchableOpacity 
          style={[styles.buttonContainer, loading && styles.buttonDisabled]}
          onPress={handleSavePayment}
          activeOpacity={0.8}
          disabled={loading}
        >
          <LinearGradient
            colors={['#AC62A1', '#20AEBC']}
            style={styles.gradientButton}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            {loading ? (
              <Text style={styles.buttonText}>
                {isEditMode ? 'Updating Payment...' : 'Adding Payment...'}
              </Text>
            ) : (
              <Text style={styles.buttonText}>
                {isEditMode ? 'Update Customer Payment' : 'Add Customer Payment'}
              </Text>
            )}
          </LinearGradient>
        </TouchableOpacity>

        {/* Date Pickers */}
        {showDatePicker && (
          <DateTimePicker
            value={formData.entry_date}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={onDateChange}
          />
        )}

        {showDeliveryDatePicker && (
          <DateTimePicker
            value={formData.delivery_date}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={onDeliveryDateChange}
          />
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    height: verticalScale(60),
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: moderateScale(15),
  },
  backButton: {
    padding: moderateScale(8),
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    color: '#FFF',
    fontSize: moderateScale(18),
    fontWeight: '600',
    marginRight: moderateScale(40),
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: moderateScale(20),
    paddingVertical: moderateScale(15),
  },
  statusInfoContainer: {
    marginBottom: verticalScale(15),
  },
  statusInfoGradient: {
    borderRadius: moderateScale(10),
    padding: moderateScale(2),
  },
  statusInfoContent: {
    backgroundColor: '#FFF5F5',
    borderRadius: moderateScale(8),
    paddingHorizontal: moderateScale(15),
    paddingVertical: moderateScale(12),
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: verticalScale(50),
  },
  statusInfoText: {
    fontSize: moderateScale(14),
    color: '#D32F2F',
    fontWeight: '500',
    marginLeft: moderateScale(10),
    flex: 1,
  },
  inputContainer: {
    marginBottom: verticalScale(15),
  },
  fieldLabel: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: '#333',
    marginBottom: verticalScale(5),
    marginLeft: moderateScale(5),
  },
  gradientBorder: {
    borderRadius: moderateScale(10),
    padding: moderateScale(2),
  },
  textInput: {
    backgroundColor: '#FFF',
    borderRadius: moderateScale(8),
    paddingHorizontal: moderateScale(15),
    paddingVertical: moderateScale(12),
    fontSize: moderateScale(16),
    color: '#333',
    minHeight: verticalScale(50),
  },
  multilineInput: {
    minHeight: verticalScale(80),
    textAlignVertical: 'top',
  },
  dateContainer: {
    backgroundColor: '#FFF',
    borderRadius: moderateScale(8),
    paddingHorizontal: moderateScale(15),
    paddingVertical: moderateScale(12),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: verticalScale(50),
  },
  dateText: {
    fontSize: moderateScale(16),
    color: '#333',
  },
  displayContainer: {
    backgroundColor: '#FFF',
    borderRadius: moderateScale(8),
    paddingHorizontal: moderateScale(15),
    paddingVertical: moderateScale(12),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: verticalScale(50),
  },
  displayLabel: {
    fontSize: moderateScale(16),
    color: '#333',
    fontWeight: '500',
  },
  displayValue: {
    fontSize: moderateScale(16),
    color: '#7E5EA9',
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginTop: verticalScale(20),
    marginBottom: verticalScale(30),
    borderRadius: moderateScale(10),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  gradientButton: {
    paddingVertical: verticalScale(15),
    borderRadius: moderateScale(10),
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: moderateScale(18),
    fontWeight: '600',
  },
});

export default Addcustomerpayment;