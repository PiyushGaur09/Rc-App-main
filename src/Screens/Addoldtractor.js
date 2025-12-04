import React, {useState, useCallback, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  FlatList,
  Image,
  ActionSheetIOS,
  Platform,
  PermissionsAndroid,
  ActivityIndicator,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import DateTimePicker from '@react-native-community/datetimepicker';

const STOCK_OPTIONS = ['sell', 'stock'];

const Addoldtractor = ({navigation, route}) => {
  const insets = useSafeAreaInsets();
  const editData = route.params?.editData;

  const [showStockDropdown, setShowStockDropdown] = useState(false);
  const [showTractorModelDropdown, setShowTractorModelDropdown] =
    useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Payment history states
  const [showPaymentHistoryModal, setShowPaymentHistoryModal] = useState(false);
  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [loadingPaymentHistory, setLoadingPaymentHistory] = useState(false);

  // Tractor models state
  const [tractorModels, setTractorModels] = useState([]);
  const [loadingTractorModels, setLoadingTractorModels] = useState(false);

  // New payment entry state
  const [newPayment, setNewPayment] = useState({
    entry_date: '',
    entry_by: '',
    amount: '',
    remarks: '',
  });
  const [showNewPaymentDatePicker, setShowNewPaymentDatePicker] =
    useState(false);

  const [formData, setFormData] = useState({
    entry_by: '',
    entry_date: '',
    ledger_no: '',
    customer_name: '',
    father_name: '',
    customer_address: '',
    mobile_number: '',
    tractor_model: '',
    chassis_no: '',
    year_of_manufacture: '',
    deal_price: '',
    sell_price: '',
    stock_type: '',
    payment_received: '',
    balance_payment: '',
  });

  // Image state
  const [picture, setPicture] = useState(null);
  const [pictureChanged, setPictureChanged] = useState(false);
  const [existingPictureUrl, setExistingPictureUrl] = useState(null);

  // Calculate balance payment whenever sell_price or payment_received changes
  useEffect(() => {
    const calculateBalance = () => {
      const sellPrice = parseFloat(formData.sell_price) || 0;
      const paymentReceived = parseFloat(formData.payment_received) || 0;
      const balance = sellPrice - paymentReceived;

      setFormData(prev => ({
        ...prev,
        balance_payment: balance >= 0 ? balance.toString() : '0',
      }));
    };

    calculateBalance();
  }, [formData.sell_price, formData.payment_received]);

  // Fetch tractor models on component mount
  useEffect(() => {
    fetchTractorModels();
  }, []);

  // Initialize form data when editData changes
  useEffect(() => {
    if (editData) {
      console.log('Edit Data Received:', editData);

      // Calculate balance for edit mode
      const sellPrice = parseFloat(editData?.sell_price) || 0;
      const paymentReceived = parseFloat(editData?.payment_received) || 0;
      const balance = sellPrice - paymentReceived;

      // Set form data with API field names
      setFormData({
        entry_by: editData?.entry_by || '',
        entry_date: editData?.entry_date || '',
        ledger_no: editData?.ledger_no || '',
        customer_name: editData?.customer_name || '',
        father_name: editData?.father_name || '',
        customer_address: editData?.customer_address || '',
        mobile_number: editData?.mobile_number || '',
        tractor_model: editData?.tractor_model || '',
        chassis_no: editData?.chassis_no || '',
        year_of_manufacture: editData?.year_of_manufacture || '',
        deal_price: editData?.deal_price?.toString() || '',
        sell_price: editData?.sell_price?.toString() || '',
        stock_type: editData?.stock_type || '',
        payment_received: editData?.payment_received?.toString() || '',
        balance_payment:
          balance >= 0
            ? balance.toString()
            : editData?.balance_payment?.toString() || '0',
      });

      // Handle existing picture
      if (editData?.picture) {
        const pictureUrl = editData.picture.startsWith('http')
          ? editData.picture
          : `https://argosmob.uk/makroo/public/${editData.picture.replace(
              /^\/+/,
              '',
            )}`;

        console.log('Setting existing picture URL:', pictureUrl);
        setExistingPictureUrl(pictureUrl);
      }

      // Set date if available
      if (editData?.entry_date) {
        const dateParts = editData.entry_date.split('-');
        if (dateParts.length === 3) {
          const year = parseInt(dateParts[0]);
          const month = parseInt(dateParts[1]) - 1;
          const day = parseInt(dateParts[2]);
          setSelectedDate(new Date(year, month, day));
        }
      }

      // Set payment history from editData
      if (editData?.history && Array.isArray(editData.history)) {
        const formattedHistory = editData.history.map(item => ({
          id: item.id.toString(),
          entry_date: item.entry_date,
          entry_by: item.entry_by,
          amount: item.amount,
          remarks: item.remarks || '',
        }));
        setPaymentHistory(formattedHistory);
      }
    }
  }, [editData]);

  // ===== Tractor Models Functions =====
  const fetchTractorModels = async () => {
    setLoadingTractorModels(true);
    try {
      const response = await axios.get(
        'https://argosmob.uk/makroo/public/api/v1/model/tractor-models',
        {
          headers: {
            Accept: 'application/json',
          },
          timeout: 15000,
        },
      );

      console.log('response', response);

      if (response.data) {
        setTractorModels(response.data.data || []);
      } else {
        console.log('No tractor models found');
        setTractorModels([]);
      }
    } catch (error) {
      console.log('Error fetching tractor models:', error.message);
      setTractorModels([]);
    } finally {
      setLoadingTractorModels(false);
    }
  };

  const handleTractorModelSelect = model => {
    handleInputChange('tractor_model', model);
    setShowTractorModelDropdown(false);
  };

  // ===== Payment History Functions =====
  const handleAddNewPayment = () => {
    // Validate new payment
    if (!newPayment.entry_date || !newPayment.entry_by || !newPayment.amount) {
      Alert.alert(
        'Validation Error',
        'Please fill all required fields (Date, Entry By, Amount)',
      );
      return;
    }

    const newPaymentEntry = {
      id: Date.now().toString(), // Temporary ID
      entry_date: newPayment.entry_date,
      entry_by: newPayment.entry_by,
      amount: newPayment.amount,
      remarks: newPayment.remarks || '',
    };

    // Add to payment history
    setPaymentHistory(prev => [...prev, newPaymentEntry]);

    // Update payment received in form data
    const currentPaymentReceived = parseFloat(formData.payment_received) || 0;
    const newAmount = parseFloat(newPayment.amount) || 0;
    const updatedPaymentReceived = currentPaymentReceived + newAmount;

    setFormData(prev => ({
      ...prev,
      payment_received: updatedPaymentReceived.toString(),
    }));

    // Reset new payment form
    setNewPayment({
      entry_date: '',
      entry_by: '',
      amount: '',
      remarks: '',
    });

    // Close modal
    setShowAddPaymentModal(false);

    Alert.alert('Success', 'Payment entry added successfully');
  };

  const handleNewPaymentDateChange = (event, date) => {
    setShowNewPaymentDatePicker(false);
    if (date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;
      setNewPayment(prev => ({...prev, entry_date: formattedDate}));
    }
  };

  const formatCurrency = value => {
    if (!value) return '₹0';
    const num = parseFloat(value);
    return isNaN(num)
      ? '₹0'
      : '₹' +
          num.toLocaleString('en-IN', {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2,
          });
  };

  // ===== Date Picker Functions =====
  const handleDateChange = (event, date) => {
    setShowDatePicker(false);
    if (date) {
      setSelectedDate(date);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;
      handleInputChange('entry_date', formattedDate);
    }
  };

  const showDatePickerModal = () => {
    setShowDatePicker(true);
  };

  // ===== Helpers =====
  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'This app needs access to your camera to take photos.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  const showImagePickerOptions = setImageFunction => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', 'Take Photo', 'Choose from Library'],
          cancelButtonIndex: 0,
        },
        async buttonIndex => {
          if (buttonIndex === 1) {
            const hasPermission = await requestCameraPermission();
            if (hasPermission) handleCamera(setImageFunction);
          } else if (buttonIndex === 2) handleImageLibrary(setImageFunction);
        },
      );
    } else {
      Alert.alert(
        'Select Image',
        'Choose an option',
        [
          {text: 'Cancel', style: 'cancel'},
          {
            text: 'Take Photo',
            onPress: async () => {
              const hasPermission = await requestCameraPermission();
              if (hasPermission) handleCamera(setImageFunction);
            },
          },
          {
            text: 'Choose from Library',
            onPress: () => handleImageLibrary(setImageFunction),
          },
        ],
        {cancelable: true},
      );
    }
  };

  const handleCamera = setImageFunction => {
    launchCamera(
      {
        mediaType: 'photo',
        quality: 0.8,
        cameraType: 'back',
        saveToPhotos: true,
      },
      response => {
        if (response?.didCancel) return;
        if (response?.error) {
          Alert.alert('Error', 'Failed to take photo');
          return;
        }
        if (response?.assets && response.assets.length > 0) {
          setImageFunction(response.assets[0]);
          setPictureChanged(true);
          setExistingPictureUrl(null);
        }
      },
    );
  };

  const handleImageLibrary = setImageFunction => {
    launchImageLibrary({mediaType: 'photo', quality: 0.8}, response => {
      if (response?.didCancel) return;
      if (response?.error) {
        Alert.alert('Error', 'Failed to select image');
        return;
      }
      if (response?.assets && response.assets.length > 0) {
        setImageFunction(response.assets[0]);
        setPictureChanged(true);
        setExistingPictureUrl(null);
      }
    });
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({...prev, [field]: value}));
  };

  const handleStockSelect = stockOption => {
    handleInputChange('stock_type', stockOption);
    setShowStockDropdown(false);
  };

  const validate = () => {
    const requiredFields = [
      'entry_by',
      'entry_date',
      'ledger_no',
      'customer_name',
      'father_name',
      'customer_address',
      'mobile_number',
      'tractor_model',
      'chassis_no',
      'year_of_manufacture',
      'deal_price',
      'sell_price',
      'stock_type',
      'payment_received',
    ];

    for (const field of requiredFields) {
      if (!formData[field]?.trim()) {
        const fieldName = field.replace(/_/g, ' ');
        return `Please enter ${fieldName}.`;
      }
    }

    if (!/^\d{10}$/.test(formData.mobile_number.trim())) {
      return 'Mobile number must be 10 digits.';
    }

    if (!/^\d{4}$/.test(formData.year_of_manufacture.trim())) {
      return 'Year of Manufacture must be a 4-digit number.';
    }

    const sellPrice = parseFloat(formData.sell_price) || 0;
    const paymentReceived = parseFloat(formData.payment_received) || 0;

    if (paymentReceived > sellPrice) {
      return 'Payment received cannot be greater than selling price.';
    }

    if (!editData && !picture && !existingPictureUrl) {
      return 'Please add a tractor picture.';
    }

    return null;
  };

  // ===== Submit =====
  const handleSubmit = useCallback(async () => {
    console.log('Submit button pressed');

    const error = validate();
    if (error) {
      Alert.alert('Validation Error', error);
      return;
    }

    setSubmitting(true);

    try {
      // Get user ID from storage
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        Alert.alert('Error', 'No userId found in storage.');
        setSubmitting(false);
        return;
      }

      console.log('User ID:', userId);
      console.log('Form data:', formData);

      // Create FormData
      const formDataToSend = new FormData();

      // Append all required fields
      formDataToSend.append('user_id', userId);
      formDataToSend.append('entry_by', formData.entry_by.trim());
      formDataToSend.append('entry_date', formData.entry_date.trim());
      formDataToSend.append('ledger_no', formData.ledger_no.trim());
      formDataToSend.append('customer_name', formData.customer_name.trim());
      formDataToSend.append('father_name', formData.father_name.trim());
      formDataToSend.append(
        'customer_address',
        formData.customer_address.trim(),
      );
      formDataToSend.append('mobile_number', formData.mobile_number.trim());
      formDataToSend.append('tractor_model', formData.tractor_model.trim());
      formDataToSend.append('chassis_no', formData.chassis_no.trim());
      formDataToSend.append(
        'year_of_manufacture',
        formData.year_of_manufacture.trim(),
      );
      formDataToSend.append('deal_price', formData.deal_price.trim());
      formDataToSend.append('sell_price', formData.sell_price.trim());
      formDataToSend.append('stock_type', formData.stock_type.trim());
      formDataToSend.append(
        'payment_received',
        formData.payment_received.trim(),
      );
      formDataToSend.append('balance_payment', formData.balance_payment.trim());

      // Append payment history as arrays
      paymentHistory.forEach((payment, index) => {
        formDataToSend.append(`entry_dates[${index}]`, payment.entry_date);
        formDataToSend.append(`entries_by[${index}]`, payment.entry_by);
        formDataToSend.append(`amounts[${index}]`, payment.amount);
        formDataToSend.append(`payment_remarks[${index}]`, payment.remarks);
      });

      // Handle picture upload
      if (picture && (!editData || pictureChanged)) {
        console.log('Adding picture to form data:', picture);
        formDataToSend.append('picture', {
          uri: picture.uri,
          type: picture.type || 'image/jpeg',
          name: picture.fileName || `tractor_${Date.now()}.jpg`,
        });
      } else if (editData && !pictureChanged && existingPictureUrl) {
        console.log('Using existing picture');
      } else if (!editData && !picture) {
        Alert.alert('Error', 'Please add a tractor picture');
        setSubmitting(false);
        return;
      }

      // Add ID for edit mode
      if (editData && editData.id) {
        formDataToSend.append('id', editData.id.toString());
        console.log('Edit mode with ID:', editData.id);
      }

      // Log what we're sending
      // console.log('FormData entries to send:');
      // for (let pair of formDataToSend.entries()) {
      //   console.log(pair[0] + ': ' + pair[1]);
      // }

      // Determine endpoint
      const endpoint = editData
        ? 'https://argosmob.uk/makroo/public/api/v1/tractor-deals/form/update'
        : 'https://argosmob.uk/makroo/public/api/v1/tractor-deals/form/save';

      console.log('Sending to endpoint:', endpoint);

      // Make API call
      try {
        const response = await axios.post(endpoint, formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Accept: 'application/json',
          },
          timeout: 30000,
        });

        console.log('API Response:', response.data);

        if (response.data && response.data.success) {
          Alert.alert(
            'Success',
            editData
              ? 'Record updated successfully!'
              : 'Record submitted successfully!',
            [
              {
                text: 'OK',
                onPress: () => {
                  // Reset form if not in edit mode
                  if (!editData) {
                    setFormData({
                      entry_by: '',
                      entry_date: '',
                      ledger_no: '',
                      customer_name: '',
                      father_name: '',
                      customer_address: '',
                      mobile_number: '',
                      tractor_model: '',
                      chassis_no: '',
                      year_of_manufacture: '',
                      deal_price: '',
                      sell_price: '',
                      stock_type: '',
                      payment_received: '',
                      balance_payment: '',
                    });
                    setPicture(null);
                    setExistingPictureUrl(null);
                    setPaymentHistory([]);
                  }
                  // Navigate back
                  navigation.navigate('Oldtractordetails');
                },
              },
            ],
          );
        } else {
          Alert.alert(
            'Error',
            response.data.message || 'Submission failed. Please try again.',
          );
        }
      } catch (axiosError) {
        console.log('Axios error details:', axiosError);

        if (axiosError.response) {
          // The request was made and the server responded with a status code
          console.log('Response data:', axiosError.response.data);
          console.log('Response status:', axiosError.response.status);
          console.log('Response headers:', axiosError.response.headers);

          Alert.alert(
            'Server Error',
            `Error ${axiosError.response.status}: ${JSON.stringify(
              axiosError.response.data,
            )}`,
          );
        } else if (axiosError.request) {
          // The request was made but no response was received
          console.log('No response received:', axiosError.request);
          Alert.alert(
            'Network Error',
            'No response from server. Please check your internet connection.',
          );
        } else {
          // Something happened in setting up the request
          console.log('Error setting up request:', axiosError.message);
          Alert.alert('Request Error', axiosError.message);
        }
      }
    } catch (error) {
      console.log('General error in handleSubmit:', error);
      Alert.alert(
        'Unexpected Error',
        error.message || 'Something went wrong. Please try again.',
      );
    } finally {
      setSubmitting(false);
    }
  }, [
    formData,
    picture,
    editData,
    pictureChanged,
    existingPictureUrl,
    paymentHistory,
    navigation,
  ]);

  // ===== Render Functions =====
  const renderStockItem = ({item}) => (
    <TouchableOpacity
      style={styles.modelItem}
      onPress={() => handleStockSelect(item)}>
      <Text style={styles.modelItemText}>{item}</Text>
    </TouchableOpacity>
  );

  const renderTractorModelItem = ({item}) => {
    console.log('tractorModel', item);
    return (
      <TouchableOpacity
        style={styles.modelItem}
        onPress={() => handleTractorModelSelect(item.model_name)}>
        <Text style={styles.modelItemText}>{item.tractor_model}</Text>
      </TouchableOpacity>
    );
  };

  const renderPaymentHistoryItem = ({item, index}) => (
    <View style={styles.paymentHistoryItem}>
      <View style={styles.paymentHistoryHeader}>
        <Text style={styles.paymentHistoryIndex}>#{index + 1}</Text>
        <Text style={styles.paymentHistoryDate}>{item.entry_date}</Text>
        <Text style={styles.paymentHistoryAmount}>
          {formatCurrency(item.amount)}
        </Text>
      </View>
      <View style={styles.paymentHistoryDetails}>
        <Text style={styles.paymentHistoryBy}>By: {item.entry_by}</Text>
        {item.remarks ? (
          <Text style={styles.paymentHistoryRemark}>
            Remark: {item.remarks}
          </Text>
        ) : null}
      </View>
    </View>
  );

  const renderAddedPaymentItem = ({item, index}) => (
    <View style={styles.addedPaymentItem}>
      <View style={styles.addedPaymentHeader}>
        <Text style={styles.addedPaymentIndex}>#{index + 1}</Text>
        {/* <TouchableOpacity 
          onPress={() => {
            // Remove payment entry
            const updatedHistory = paymentHistory.filter(p => p.id !== item.id);
            setPaymentHistory(updatedHistory);
            
            // Update payment received
            const removedAmount = parseFloat(item.amount) || 0;
            const currentPaymentReceived = parseFloat(formData.payment_received) || 0;
            const updatedPaymentReceived = Math.max(0, currentPaymentReceived - removedAmount);
            
            setFormData(prev => ({
              ...prev,
              payment_received: updatedPaymentReceived.toString(),
            }));
          }}
          style={styles.removePaymentButton}
        >
          <Icon name="delete" size={18} color="#dc3545" />
        </TouchableOpacity> */}
      </View>
      <View style={styles.addedPaymentDetails}>
        <Text style={styles.addedPaymentText}>Date: {item.entry_date}</Text>
        <Text style={styles.addedPaymentText}>By: {item.entry_by}</Text>
        <Text style={styles.addedPaymentText}>
          Amount: {formatCurrency(item.amount)}
        </Text>
        {item.remarks ? (
          <Text style={styles.addedPaymentText}>Remark: {item.remarks}</Text>
        ) : null}
      </View>
    </View>
  );

  // Function to get placeholder text
  const getPlaceholderText = (field, value) => {
    const placeholders = {
      entry_by: 'Entry By',
      entry_date: 'Entry Date (YYYY-MM-DD)',
      ledger_no: 'Ledger No.',
      customer_name: 'Customer Name',
      father_name: "Father's Name",
      customer_address: 'Address',
      mobile_number: 'Mobile No.',
      tractor_model: 'Tractor Model',
      chassis_no: 'Chassis No',
      year_of_manufacture: 'Year of Manufacture',
      deal_price: 'Deal Price',
      sell_price: 'Selling Price',
      stock_type: 'Select Stock Type',
      payment_received: 'Payment Received',
      balance_payment: 'Balance Payment (Auto-calculated)',
    };

    return value ? '' : placeholders[field];
  };

  return (
    <View
      style={{flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom}}>
      {/* Header with Gradient */}
      <LinearGradient
        colors={['#7E5EA9', '#20AEBC']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={25} color="#fff" />
          </TouchableOpacity>

          <View style={{flex: 1, alignItems: 'center'}}>
            <Text style={styles.companyName}>Makroo Motor Corp.</Text>
            <Text style={styles.companyName1}>
              {editData ? 'Edit Old Tractor' : 'Add Old Tractor'}
            </Text>
          </View>

          <View style={styles.iconButton} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
        {/* Form Fields */}
        <View style={styles.formContainer}>
          {/* Row 1: Entry By */}
          <View style={styles.row}>
            <View style={styles.fullWidthInputContainer}>
              <Text style={styles.fieldLabel}>Entry By</Text>
              <LinearGradient
                colors={['#7E5EA9', '#20AEBC']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={styles.inputGradient}>
                <TextInput
                  style={styles.input}
                  value={formData.entry_by}
                  onChangeText={text => handleInputChange('entry_by', text)}
                  placeholder={getPlaceholderText(
                    'entry_by',
                    formData.entry_by,
                  )}
                  placeholderTextColor="#666"
                  autoCapitalize="words"
                />
              </LinearGradient>
            </View>
          </View>

          {/* Row 2: Entry Date */}
          <View style={styles.row}>
            <View style={styles.fullWidthInputContainer}>
              <Text style={styles.fieldLabel}>Entry Date</Text>
              <LinearGradient
                colors={['#7E5EA9', '#20AEBC']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={styles.inputGradient}>
                <TouchableOpacity
                  style={styles.input}
                  onPress={showDatePickerModal}>
                  <Text
                    style={
                      formData.entry_date
                        ? styles.selectedModelText
                        : styles.placeholderText
                    }>
                    {formData.entry_date || 'Entry Date (YYYY-MM-DD)'}
                  </Text>
                  <Icon name="calendar-today" size={20} color="#666" />
                </TouchableOpacity>
              </LinearGradient>
            </View>
          </View>

          {/* Row 3: Ledger No. */}
          <View style={styles.row}>
            <View style={styles.fullWidthInputContainer}>
              <Text style={styles.fieldLabel}>Ledger No.</Text>
              <LinearGradient
                colors={['#7E5EA9', '#20AEBC']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={styles.inputGradient}>
                <TextInput
                  style={styles.input}
                  value={formData.ledger_no}
                  onChangeText={text => handleInputChange('ledger_no', text)}
                  placeholder={getPlaceholderText(
                    'ledger_no',
                    formData.ledger_no,
                  )}
                  placeholderTextColor="#666"
                />
              </LinearGradient>
            </View>
          </View>

          {/* Row 4: Customer Name */}
          <View style={styles.row}>
            <View style={styles.fullWidthInputContainer}>
              <Text style={styles.fieldLabel}>Customer Name</Text>
              <LinearGradient
                colors={['#7E5EA9', '#20AEBC']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={styles.inputGradient}>
                <TextInput
                  style={styles.input}
                  value={formData.customer_name}
                  onChangeText={text =>
                    handleInputChange('customer_name', text)
                  }
                  placeholder={getPlaceholderText(
                    'customer_name',
                    formData.customer_name,
                  )}
                  placeholderTextColor="#666"
                  autoCapitalize="words"
                />
              </LinearGradient>
            </View>
          </View>

          {/* Row 5: Father's Name */}
          <View style={styles.row}>
            <View style={styles.fullWidthInputContainer}>
              <Text style={styles.fieldLabel}>Father's Name</Text>
              <LinearGradient
                colors={['#7E5EA9', '#20AEBC']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={styles.inputGradient}>
                <TextInput
                  style={styles.input}
                  value={formData.father_name}
                  onChangeText={text => handleInputChange('father_name', text)}
                  placeholder={getPlaceholderText(
                    'father_name',
                    formData.father_name,
                  )}
                  placeholderTextColor="#666"
                  autoCapitalize="words"
                />
              </LinearGradient>
            </View>
          </View>

          {/* Row 6: Address */}
          <View style={styles.row}>
            <View style={styles.fullWidthInputContainer}>
              <Text style={styles.fieldLabel}>Address</Text>
              <LinearGradient
                colors={['#7E5EA9', '#20AEBC']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={styles.inputGradient}>
                <TextInput
                  style={[styles.input, styles.multilineInput]}
                  value={formData.customer_address}
                  onChangeText={text =>
                    handleInputChange('customer_address', text)
                  }
                  placeholder={getPlaceholderText(
                    'customer_address',
                    formData.customer_address,
                  )}
                  placeholderTextColor="#666"
                  multiline
                  numberOfLines={3}
                />
              </LinearGradient>
            </View>
          </View>

          {/* Row 7: Mobile No. */}
          <View style={styles.row}>
            <View style={styles.fullWidthInputContainer}>
              <Text style={styles.fieldLabel}>Mobile No.</Text>
              <LinearGradient
                colors={['#7E5EA9', '#20AEBC']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={styles.inputGradient}>
                <TextInput
                  style={styles.input}
                  value={formData.mobile_number}
                  onChangeText={text =>
                    handleInputChange('mobile_number', text)
                  }
                  placeholder={getPlaceholderText(
                    'mobile_number',
                    formData.mobile_number,
                  )}
                  placeholderTextColor="#666"
                  keyboardType="phone-pad"
                  maxLength={10}
                />
              </LinearGradient>
            </View>
          </View>

          {/* Row 8: Tractor Model Dropdown */}
          <View style={styles.row}>
            <View style={styles.fullWidthInputContainer}>
              <Text style={styles.fieldLabel}>Tractor Model</Text>
              <LinearGradient
                colors={['#7E5EA9', '#20AEBC']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={styles.inputGradient}>
                <TouchableOpacity
                  style={styles.input}
                  onPress={() => setShowTractorModelDropdown(true)}>
                  <Text
                    style={
                      formData.tractor_model
                        ? styles.selectedModelText
                        : styles.placeholderText
                    }>
                    {formData.tractor_model || 'Select Tractor Model'}
                  </Text>
                  <Icon
                    name="keyboard-arrow-down"
                    size={25}
                    color="#666"
                    style={styles.dropdownIcon}
                  />
                </TouchableOpacity>
              </LinearGradient>
            </View>
          </View>

          {/* Row 9: Chassis No */}
          <View style={styles.row}>
            <View style={styles.fullWidthInputContainer}>
              <Text style={styles.fieldLabel}>Chassis No</Text>
              <LinearGradient
                colors={['#7E5EA9', '#20AEBC']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={styles.inputGradient}>
                <TextInput
                  style={styles.input}
                  value={formData.chassis_no}
                  onChangeText={text => handleInputChange('chassis_no', text)}
                  placeholder={getPlaceholderText(
                    'chassis_no',
                    formData.chassis_no,
                  )}
                  placeholderTextColor="#666"
                />
              </LinearGradient>
            </View>
          </View>

          {/* Row 10: Year of Manufacture */}
          <View style={styles.row}>
            <View style={styles.fullWidthInputContainer}>
              <Text style={styles.fieldLabel}>Year of Manufacture</Text>
              <LinearGradient
                colors={['#7E5EA9', '#20AEBC']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={styles.inputGradient}>
                <TextInput
                  style={styles.input}
                  value={formData.year_of_manufacture}
                  onChangeText={text =>
                    handleInputChange('year_of_manufacture', text)
                  }
                  placeholder={getPlaceholderText(
                    'year_of_manufacture',
                    formData.year_of_manufacture,
                  )}
                  placeholderTextColor="#666"
                  keyboardType="number-pad"
                  maxLength={4}
                />
              </LinearGradient>
            </View>
          </View>

          {/* Row 11: Deal Price */}
          <View style={styles.row}>
            <View style={styles.fullWidthInputContainer}>
              <Text style={styles.fieldLabel}>Deal Price</Text>
              <LinearGradient
                colors={['#7E5EA9', '#20AEBC']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={styles.inputGradient}>
                <TextInput
                  style={styles.input}
                  value={formData.deal_price}
                  onChangeText={text => handleInputChange('deal_price', text)}
                  placeholder={getPlaceholderText(
                    'deal_price',
                    formData.deal_price,
                  )}
                  placeholderTextColor="#666"
                  keyboardType="decimal-pad"
                />
              </LinearGradient>
            </View>
          </View>

          {/* Row 12: Selling Price */}
          <View style={styles.row}>
            <View style={styles.fullWidthInputContainer}>
              <Text style={styles.fieldLabel}>Selling Price</Text>
              <LinearGradient
                colors={['#7E5EA9', '#20AEBC']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={styles.inputGradient}>
                <TextInput
                  style={styles.input}
                  value={formData.sell_price}
                  onChangeText={text => handleInputChange('sell_price', text)}
                  placeholder={getPlaceholderText(
                    'sell_price',
                    formData.sell_price,
                  )}
                  placeholderTextColor="#666"
                  keyboardType="decimal-pad"
                />
              </LinearGradient>
            </View>
          </View>

          {/* Row 13: Stock Type Dropdown */}
          <View style={styles.row}>
            <View style={styles.fullWidthInputContainer}>
              <Text style={styles.fieldLabel}>Stock Type</Text>
              <LinearGradient
                colors={['#7E5EA9', '#20AEBC']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={styles.inputGradient}>
                <TouchableOpacity
                  style={styles.input}
                  onPress={() => setShowStockDropdown(true)}>
                  <Text
                    style={
                      formData.stock_type
                        ? styles.selectedModelText
                        : styles.placeholderText
                    }>
                    {formData.stock_type || 'Select Stock Type'}
                  </Text>
                  <Icon
                    name="keyboard-arrow-down"
                    size={25}
                    color="#666"
                    style={styles.dropdownIcon}
                  />
                </TouchableOpacity>
              </LinearGradient>
            </View>
          </View>

          {/* Row 14: Payment Received */}
          <View style={styles.row}>
            <View style={styles.fullWidthInputContainer}>
              <Text style={styles.fieldLabel}>Payment Received</Text>
              <LinearGradient
                colors={['#7E5EA9', '#20AEBC']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={styles.inputGradient}>
                <TextInput
                  style={styles.input}
                  value={formData.payment_received}
                  onChangeText={text =>
                    handleInputChange('payment_received', text)
                  }
                  placeholder={getPlaceholderText(
                    'payment_received',
                    formData.payment_received,
                  )}
                  placeholderTextColor="#666"
                  keyboardType="decimal-pad"
                  editable={paymentHistory.length === 0} // Only editable if no payment history added
                />
              </LinearGradient>
              {paymentHistory.length > 0 && (
                <Text style={styles.calculationNote}>
                  This field is auto-calculated from payment history entries
                  below.
                </Text>
              )}
            </View>
          </View>

          {/* Row 15: Balance Payment (Auto-calculated) */}
          <View style={styles.row}>
            <View style={styles.fullWidthInputContainer}>
              <Text style={styles.fieldLabel}>
                Balance Payment (Auto-calculated)
              </Text>
              <LinearGradient
                colors={['#7E5EA9', '#20AEBC']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={styles.inputGradient}>
                <View style={[styles.input, styles.disabledInput]}>
                  <Text style={styles.balancePaymentText}>
                    {formatCurrency(formData.balance_payment)}
                  </Text>
                  <Icon name="calculate" size={20} color="#28a745" />
                </View>
              </LinearGradient>
              <Text style={styles.calculationNote}>
                Balance = Selling Price ({formatCurrency(formData.sell_price)})
                - Payment Received ({formatCurrency(formData.payment_received)})
              </Text>
            </View>
          </View>
        </View>

        {/* Payment History Section - Only show in edit mode */}
        {editData && (
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Payment History</Text>
              <View style={styles.sectionButtons}>
                <TouchableOpacity
                  style={styles.viewHistoryButton}
                  onPress={() => setShowPaymentHistoryModal(true)}>
                  <Icon name="history" size={18} color="#fff" />
                  <Text style={styles.viewHistoryButtonText}>View History</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.addPaymentButton}
                  onPress={() => setShowAddPaymentModal(true)}>
                  <Icon name="add" size={18} color="#fff" />
                  <Text style={styles.addPaymentButtonText}>Add Payment</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Added Payments List */}
            {/* {paymentHistory.length > 0 ? (
              <View style={styles.addedPaymentsContainer}>
                <Text style={styles.addedPaymentsTitle}>Payment History ({paymentHistory.length})</Text>
                <FlatList
                  data={paymentHistory}
                  renderItem={renderAddedPaymentItem}
                  keyExtractor={(item) => item.id}
                  scrollEnabled={false}
                  style={styles.addedPaymentsList}
                />
                <Text style={styles.totalPaymentsText}>
                  Total Received: {formatCurrency(paymentHistory.reduce((sum, payment) => sum + (parseFloat(payment.amount) || 0), 0))}
                </Text>
              </View>
            ) : (
              <View style={styles.noPaymentsContainer}>
                <Icon name="payment" size={40} color="#ccc" />
                <Text style={styles.noPaymentsText}>No payment history found</Text>
                <Text style={styles.noPaymentsSubtext}>
                  Click "Add Payment" to add payment entries
                </Text>
              </View>
            )} */}
          </View>
        )}

        {/* Date Picker */}
        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleDateChange}
            maximumDate={new Date()}
          />
        )}

        {/* Stock Type Dropdown Modal */}
        <Modal
          visible={showStockDropdown}
          transparent
          animationType="slide"
          onRequestClose={() => setShowStockDropdown(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Stock Type</Text>
                <TouchableOpacity
                  onPress={() => setShowStockDropdown(false)}
                  style={styles.closeButton}>
                  <Icon name="close" size={24} color="#000" />
                </TouchableOpacity>
              </View>
              <FlatList
                data={STOCK_OPTIONS}
                renderItem={renderStockItem}
                keyExtractor={(item, index) => index.toString()}
                style={styles.modelList}
                showsVerticalScrollIndicator
              />
            </View>
          </View>
        </Modal>

        {/* Tractor Model Dropdown Modal */}
        <Modal
          visible={showTractorModelDropdown}
          transparent
          animationType="slide"
          onRequestClose={() => setShowTractorModelDropdown(false)}>
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, styles.tractorModelModal]}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Tractor Model</Text>
                <TouchableOpacity
                  onPress={() => setShowTractorModelDropdown(false)}
                  style={styles.closeButton}>
                  <Icon name="close" size={24} color="#000" />
                </TouchableOpacity>
              </View>

              {loadingTractorModels ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#7E5EA9" />
                  <Text style={styles.loadingText}>
                    Loading tractor models...
                  </Text>
                </View>
              ) : tractorModels.length > 0 ? (
                <FlatList
                  data={tractorModels}
                  renderItem={renderTractorModelItem}
                  keyExtractor={item => item.id.toString()}
                  style={styles.tractorModelList}
                  showsVerticalScrollIndicator
                  ListHeaderComponent={() => (
                    <View style={styles.modelSummary}>
                      <Text style={styles.modelSummaryText}>
                        Available Models: {tractorModels.length}
                      </Text>
                    </View>
                  )}
                />
              ) : (
                <View style={styles.noDataContainer}>
                  <Icon name="agriculture" size={60} color="#ccc" />
                  <Text style={styles.noDataText}>No tractor models found</Text>
                  <Text style={styles.noDataSubtext}>
                    Please check your internet connection
                  </Text>
                </View>
              )}
            </View>
          </View>
        </Modal>

        {/* Payment History Modal */}
        <Modal
          visible={showPaymentHistoryModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowPaymentHistoryModal(false)}>
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, styles.paymentHistoryModal]}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Payment History</Text>
                <TouchableOpacity
                  onPress={() => setShowPaymentHistoryModal(false)}
                  style={styles.closeButton}>
                  <Icon name="close" size={24} color="#000" />
                </TouchableOpacity>
              </View>

              {paymentHistory.length > 0 ? (
                <FlatList
                  data={paymentHistory}
                  renderItem={renderPaymentHistoryItem}
                  keyExtractor={item => item.id}
                  style={styles.paymentHistoryList}
                  showsVerticalScrollIndicator
                  ListHeaderComponent={() => (
                    <View style={styles.paymentHistorySummary}>
                      <Text style={styles.paymentHistorySummaryText}>
                        Total Entries: {paymentHistory.length}
                      </Text>
                      <Text style={styles.paymentHistorySummaryText}>
                        Total Amount:{' '}
                        {formatCurrency(
                          paymentHistory.reduce(
                            (sum, payment) =>
                              sum + (parseFloat(payment.amount) || 0),
                            0,
                          ),
                        )}
                      </Text>
                    </View>
                  )}
                />
              ) : (
                <View style={styles.noDataContainer}>
                  <Icon name="receipt" size={60} color="#ccc" />
                  <Text style={styles.noDataText}>
                    No payment history found
                  </Text>
                </View>
              )}
            </View>
          </View>
        </Modal>

        {/* Add Payment Modal */}
        <Modal
          visible={showAddPaymentModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowAddPaymentModal(false)}>
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, styles.addPaymentModal]}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Add New Payment</Text>
                <TouchableOpacity
                  onPress={() => setShowAddPaymentModal(false)}
                  style={styles.closeButton}>
                  <Icon name="close" size={24} color="#000" />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.addPaymentForm}>
                <View style={styles.addPaymentField}>
                  <Text style={styles.addPaymentLabel}>Payment Date *</Text>
                  <LinearGradient
                    colors={['#7E5EA9', '#20AEBC']}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 0}}
                    style={styles.inputGradient}>
                    <TouchableOpacity
                      style={styles.input}
                      onPress={() => setShowNewPaymentDatePicker(true)}>
                      <Text
                        style={
                          newPayment.entry_date
                            ? styles.selectedModelText
                            : styles.placeholderText
                        }>
                        {newPayment.entry_date || 'Select Date (YYYY-MM-DD)'}
                      </Text>
                      <Icon name="calendar-today" size={20} color="#666" />
                    </TouchableOpacity>
                  </LinearGradient>
                </View>

                <View style={styles.addPaymentField}>
                  <Text style={styles.addPaymentLabel}>Entry By *</Text>
                  <LinearGradient
                    colors={['#7E5EA9', '#20AEBC']}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 0}}
                    style={styles.inputGradient}>
                    <TextInput
                      style={styles.input}
                      value={newPayment.entry_by}
                      onChangeText={text =>
                        setNewPayment(prev => ({...prev, entry_by: text}))
                      }
                      placeholder="Enter name"
                      placeholderTextColor="#666"
                      autoCapitalize="words"
                    />
                  </LinearGradient>
                </View>

                <View style={styles.addPaymentField}>
                  <Text style={styles.addPaymentLabel}>Amount *</Text>
                  <LinearGradient
                    colors={['#7E5EA9', '#20AEBC']}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 0}}
                    style={styles.inputGradient}>
                    <TextInput
                      style={styles.input}
                      value={newPayment.amount}
                      onChangeText={text =>
                        setNewPayment(prev => ({...prev, amount: text}))
                      }
                      placeholder="Enter amount"
                      placeholderTextColor="#666"
                      keyboardType="decimal-pad"
                    />
                  </LinearGradient>
                </View>

                <View style={styles.addPaymentField}>
                  <Text style={styles.addPaymentLabel}>Remarks (Optional)</Text>
                  <LinearGradient
                    colors={['#7E5EA9', '#20AEBC']}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 0}}
                    style={styles.inputGradient}>
                    <TextInput
                      style={[styles.input, styles.multilineInput]}
                      value={newPayment.remarks}
                      onChangeText={text =>
                        setNewPayment(prev => ({...prev, remarks: text}))
                      }
                      placeholder="Enter remarks"
                      placeholderTextColor="#666"
                      multiline
                      numberOfLines={3}
                    />
                  </LinearGradient>
                </View>

                <View style={styles.addPaymentButtons}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => setShowAddPaymentModal(false)}>
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.savePaymentButton}
                    onPress={handleAddNewPayment}>
                    <Text style={styles.savePaymentButtonText}>
                      Add Payment
                    </Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* New Payment Date Picker */}
        {showNewPaymentDatePicker && (
          <DateTimePicker
            value={new Date()}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleNewPaymentDateChange}
            maximumDate={new Date()}
          />
        )}

        {/* Photo Section */}
        <View style={styles.photoSignatureSection}>
          <Text style={styles.fieldLabel}>Tractor Picture</Text>
          <TouchableOpacity
            style={styles.photoSignatureBox}
            onPress={() => showImagePickerOptions(setPicture)}>
            {picture ? (
              <Image
                source={{uri: picture.uri}}
                style={styles.previewImage}
                resizeMode="cover"
              />
            ) : existingPictureUrl ? (
              <Image
                source={{uri: existingPictureUrl}}
                style={styles.previewImage}
                resizeMode="cover"
                onError={() => {
                  console.log('Error loading existing image');
                  setExistingPictureUrl(null);
                }}
              />
            ) : (
              <>
                <Icon name="photo-camera" size={35} color="#666" />
                <Text style={styles.photoSignatureText}>
                  Tap to add tractor picture
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Submit */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.submitButton, submitting && {opacity: 0.7}]}
            onPress={handleSubmit}
            disabled={submitting}>
            {submitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>
                {editData ? 'Update Record' : 'Submit Record'}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

// Updated styles
const styles = StyleSheet.create({
  container: {paddingHorizontal: 15},
  header: {paddingHorizontal: 15, paddingVertical: 10},
  companyName: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
    fontFamily: 'Inter_28pt-SemiBold',
  },
  companyName1: {
    fontSize: 15,
    fontFamily: 'Inter_28pt-SemiBold',
    color: 'white',
    textAlign: 'center',
  },
  formContainer: {marginBottom: 15, marginTop: 20},
  row: {
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputContainer: {flex: 1, marginHorizontal: 4, marginBottom: 10},
  fullWidthInputContainer: {flex: 1, marginHorizontal: 0, marginBottom: 10},
  fieldLabel: {
    fontSize: 14,
    fontFamily: 'Inter_28pt-Medium',
    color: '#666',
    marginBottom: 5,
    marginLeft: 5,
  },
  inputGradient: {borderRadius: 10, padding: 1},
  input: {
    borderRadius: 10,
    backgroundColor: '#fff',
    padding: 12,
    fontSize: 14,
    fontFamily: 'Inter_28pt-Regular',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 50,
  },
  disabledInput: {
    backgroundColor: '#f8f9fa',
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  selectedModelText: {
    fontSize: 14,
    fontFamily: 'Inter_28pt-Regular',
    color: '#000',
  },
  placeholderText: {
    fontSize: 14,
    fontFamily: 'Inter_28pt-Regular',
    color: '#666',
  },
  balancePaymentText: {
    fontSize: 14,
    fontFamily: 'Inter_28pt-SemiBold',
    color: '#28a745',
  },
  calculationNote: {
    fontSize: 11,
    fontFamily: 'Inter_28pt-Regular',
    color: '#666',
    marginTop: 4,
    marginLeft: 5,
    fontStyle: 'italic',
  },
  dropdownIcon: {marginLeft: 8},

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    width: '90%',
    maxHeight: '70%',
    overflow: 'hidden',
  },
  paymentHistoryModal: {
    maxHeight: '80%',
  },
  addPaymentModal: {
    maxHeight: '80%',
  },
  tractorModelModal: {
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Inter_28pt-SemiBold',
  },
  closeButton: {padding: 4},
  modelList: {maxHeight: 300},
  tractorModelList: {maxHeight: 400},
  modelItem: {padding: 15, borderBottomWidth: 1, borderBottomColor: '#f0f0f0'},
  modelItemText: {
    fontSize: 14,
    fontFamily: 'Inter_28pt-Regular',
    color: '#666',
  },

  // Payment History Section
  sectionContainer: {
    marginTop: 20,
    marginBottom: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  sectionHeader: {
    // flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter_28pt-SemiBold',
    color: '#333',
  },
  sectionButtons: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 10,
  },
  viewHistoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#20AEBC',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 5,
  },
  viewHistoryButtonText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'Inter_28pt-Medium',
  },
  addPaymentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#7E5EA9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 5,
  },
  addPaymentButtonText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'Inter_28pt-Medium',
  },

  // Added Payments
  addedPaymentsContainer: {
    marginTop: 10,
  },
  addedPaymentsTitle: {
    fontSize: 14,
    fontFamily: 'Inter_28pt-SemiBold',
    color: '#333',
    marginBottom: 10,
  },
  addedPaymentsList: {
    maxHeight: 200,
  },
  addedPaymentItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  addedPaymentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  addedPaymentIndex: {
    fontSize: 13,
    fontFamily: 'Inter_28pt-SemiBold',
    color: '#7E5EA9',
  },
  removePaymentButton: {
    padding: 4,
  },
  addedPaymentDetails: {
    gap: 4,
  },
  addedPaymentText: {
    fontSize: 12,
    fontFamily: 'Inter_28pt-Regular',
    color: '#666',
  },
  totalPaymentsText: {
    fontSize: 13,
    fontFamily: 'Inter_28pt-SemiBold',
    color: '#28a745',
    marginTop: 10,
    textAlign: 'right',
  },

  // No Payments
  noPaymentsContainer: {
    alignItems: 'center',
    padding: 30,
  },
  noPaymentsText: {
    fontSize: 14,
    fontFamily: 'Inter_28pt-Medium',
    color: '#666',
    marginTop: 10,
  },
  noPaymentsSubtext: {
    fontSize: 12,
    fontFamily: 'Inter_28pt-Regular',
    color: '#999',
    marginTop: 5,
  },

  // Loading and No Data
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    fontFamily: 'Inter_28pt-Regular',
    color: '#666',
  },
  noDataContainer: {
    padding: 40,
    alignItems: 'center',
  },
  noDataText: {
    fontSize: 14,
    fontFamily: 'Inter_28pt-Medium',
    color: '#666',
    marginTop: 10,
  },
  noDataSubtext: {
    fontSize: 12,
    fontFamily: 'Inter_28pt-Regular',
    color: '#999',
    marginTop: 5,
  },

  // Model Summary
  modelSummary: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    marginVertical: 10,
  },
  modelSummaryText: {
    fontSize: 13,
    fontFamily: 'Inter_28pt-Medium',
    color: '#333',
  },

  // Payment History Modal Content
  paymentHistoryList: {
    paddingHorizontal: 15,
  },
  paymentHistorySummary: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    marginVertical: 10,
  },
  paymentHistorySummaryText: {
    fontSize: 13,
    fontFamily: 'Inter_28pt-Medium',
    color: '#333',
    marginBottom: 4,
  },
  paymentHistoryItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  paymentHistoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  paymentHistoryIndex: {
    fontSize: 12,
    fontFamily: 'Inter_28pt-SemiBold',
    color: '#7E5EA9',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  paymentHistoryDate: {
    fontSize: 13,
    fontFamily: 'Inter_28pt-Medium',
    color: '#333',
  },
  paymentHistoryAmount: {
    fontSize: 13,
    fontFamily: 'Inter_28pt-SemiBold',
    color: '#28a745',
  },
  paymentHistoryDetails: {
    gap: 4,
  },
  paymentHistoryBy: {
    fontSize: 12,
    fontFamily: 'Inter_28pt-Regular',
    color: '#666',
  },
  paymentHistoryRemark: {
    fontSize: 11,
    fontFamily: 'Inter_28pt-Regular',
    color: '#888',
    fontStyle: 'italic',
  },

  // Add Payment Modal
  addPaymentForm: {
    padding: 15,
  },
  addPaymentField: {
    marginBottom: 15,
  },
  addPaymentLabel: {
    fontSize: 14,
    fontFamily: 'Inter_28pt-Medium',
    color: '#666',
    marginBottom: 5,
    marginLeft: 5,
  },
  addPaymentButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 10,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#dc3545',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Inter_28pt-SemiBold',
  },
  savePaymentButton: {
    flex: 1,
    backgroundColor: '#28a745',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  savePaymentButtonText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Inter_28pt-SemiBold',
  },

  // Photo Section
  photoSignatureSection: {marginTop: 10},
  photoSignatureBox: {
    width: '100%',
    height: 160,
    borderWidth: 1,
    borderColor: '#00000080',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderStyle: 'dashed',
    overflow: 'hidden',
  },
  photoSignatureText: {
    fontSize: 13,
    textAlign: 'center',
    marginTop: 2,
    color: '#00000099',
    fontFamily: 'Inter_28pt-Medium',
  },
  previewImage: {width: '100%', height: '100%'},

  // Submit Button
  buttonContainer: {marginTop: 20, marginBottom: 30},
  submitButton: {
    flex: 1,
    backgroundColor: '#7E5EA9',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  submitButtonText: {
    color: '#fff',
    fontFamily: 'Inter_28pt-SemiBold',
    fontSize: 14,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconButton: {padding: 5, width: 35},
});

export default Addoldtractor;
