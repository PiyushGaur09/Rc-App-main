import React, {useState, useEffect, useCallback} from 'react';
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
  Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Camera} from 'react-native-camera-kit';

const Pdiinternalpage = ({navigation, route}) => {
  const insets = useSafeAreaInsets();
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [existingFormId, setExistingFormId] = useState(null);
  const [existingFormNo, setExistingFormNo] = useState(null);
  const [status, setStatus] = useState('pending');
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);

  // QR Scanner States
  const [showChassisScanner, setShowChassisScanner] = useState(false);
  const [showEngineScanner, setShowEngineScanner] = useState(false);
  const [showBatteryScanner, setShowBatteryScanner] = useState(false);
  const [showStarterScanner, setShowStarterScanner] = useState(false);
  const [showFipScanner, setShowFipScanner] = useState(false);
  const [showAlternatorScanner, setShowAlternatorScanner] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState(false);

  // Dropdown states
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [showTireDropdown, setShowTireDropdown] = useState(false);
  const [showBatteryDropdown, setShowBatteryDropdown] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showBatteryDatePicker, setShowBatteryDatePicker] = useState(false);
  const [showHypothecationDropdown, setShowHypothecationDropdown] =
    useState(false);

  // Form data state
  const [formData, setFormData] = useState({
    inspector_name: '',
    tire_make: '',
    tire_make_other: '',
    battery_make: '',
    battery_make_other: '',
    select_date: null,
    battery_date: null,
    chassis_no: '',
    tractor_model: '',
    engine_no: '',
    front_right_serial_no: '',
    rear_right_serial_no: '',
    front_left_serial_no: '',
    rear_left_serial_no: '',
    tractor_starter_serial_no: '',
    tractor_alternator_no: '',
    battery_serial_no: '',
    fip_no: '',
    dealer_name: '',
    customer_name: '',
    customer_father_name: '',
    customer_address: '',
    customer_contact: '',
    pdi_done_by: '',
    remarks: '',
    delivery_customer_name: '',
    delivery_customer_father_name: '',
    delivery_customer_address: '',
    delivery_customer_contact: '',
    hypothecation: '',
    hypothecation_other: '',
    lights_no: '',
    nuts_no: '',
    hydraulic_oil_half: '',
    all_nuts_sealed_no: '',
    engine_oil_level_half: '',
    coolant_level_no: '',
    brake_fluid_level_no: '',
    greasing_done_no: '',
    paint_scratches_no: '',
    toolkit_available_no: '',
    owner_manual_given_no: '',
    reflector_sticker_applied_no: '',
    number_plate_fixed_no: '',
  });

  const [radioValues, setRadioValues] = useState({
    lights_ok: '1',
    nuts_ok: '1',
    tractor_delivered: '1',
    hydraulic_oil: '1',
    all_nuts_sealed: '1',
    engine_oil_level: '1',
    coolant_level: '1',
    brake_fluid_level: '1',
    greasing_done: '1',
    paint_scratches: '1',
    toolkit_available: '1',
    owner_manual_given: '1',
    reflector_sticker_applied: '1',
    number_plate_fixed: '1',
  });

  // Image states
  const [customerPhoto, setCustomerPhoto] = useState(null);
  const [customerSignature, setCustomerSignature] = useState(null);
  const [managerSignature, setManagerSignature] = useState(null);

  // Tractor Models state - dynamically fetched
  const [tractorModels, setTractorModels] = useState([]);

  console.log('tractors Models', tractorModels);
  const [loadingModels, setLoadingModels] = useState(false);

  // Static options data
  const tireMakes = [
    'Michelin',
    'Bridgestone',
    'Goodyear',
    'Continental',
    'Pirelli',
    'Yokohama',
    'MRF',
    'Apollo',
    'CEAT',
    'JK Tyre',
    'Other',
  ];

  const batteryMakes = [
    'Exide',
    'Amaron',
    'Lucas',
    'SF Sonic',
    'Tata Green',
    'Exide Industries',
    'Luminous',
    'Okaya',
    'Su-Kam',
    'Base',
    'Other',
  ];

  const hypothecationOptions = [
    'John Deere Financial India Private Limited',
    'The Jammu and Kashmir Bank Limited',
    'Nil',
    'Other',
  ];

  // Helper function to make absolute URLs
  const makeAbsoluteUrl = relativePath => {
    if (!relativePath) return null;
    if (relativePath.startsWith('http')) return relativePath;
    return `https://makroomotors.com/makroo-panel/public/${relativePath.replace(
      /^\/+/,
      '',
    )}`;
  };

  // Function to fetch tractor models from API
  const fetchTractorModels = useCallback(async () => {
    if (!userId) {
      setTractorModels([]);
      return;
    }

    setLoadingModels(true);
    try {
      const response = await axios.get(
        `https://makroomotors.com/makroo-panel/public/api/v1/model/tractor-models?user_id=${userId}`,
        {
          timeout: 10000,
        },
      );

      if (response.data.status && response.data.data) {
        // Extract tractor_model values from response
        const models = response.data.data.map(item => item.tractor_model);
        setTractorModels(models);
      } else {
        setTractorModels([]);
      }
    } catch (error) {
      console.log('Error fetching tractor models:', error);
      setTractorModels([]);
    } finally {
      setLoadingModels(false);
    }
  }, [userId]);

  // Get form ID from route params and fetch data
  useEffect(() => {
    const getUserData = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        if (storedUserId) {
          setUserId(storedUserId);
        }
      } catch (error) {
        console.log('Error loading user data:', error);
      }
    };

    getUserData();

    const formId = route.params?.formId;
    const formStatus = route.params?.status;

    if (formId) {
      setExistingFormId(formId);
      if (formStatus) {
        setStatus(formStatus);
      }
      fetchFormData(formId);
    } else {
      Alert.alert('Error', 'No form ID provided');
      navigation.goBack();
    }
  }, [route.params]);

  // Fetch tractor models when userId changes
  useEffect(() => {
    if (userId) {
      fetchTractorModels();
    }
  }, [userId, fetchTractorModels]);

  // Auto-fill delivery customer details when tractor is delivered
  useEffect(() => {
    if (isEditMode && radioValues.tractor_delivered === '1') {
      setFormData(prev => ({
        ...prev,
        delivery_customer_name:
          prev.delivery_customer_name || prev.customer_name,
        delivery_customer_father_name:
          prev.delivery_customer_father_name || prev.customer_father_name,
        delivery_customer_address:
          prev.delivery_customer_address || prev.customer_address,
        delivery_customer_contact:
          prev.delivery_customer_contact || prev.customer_contact,
      }));
    }
  }, [radioValues.tractor_delivered, isEditMode]);

  const fetchFormData = async formId => {
    try {
      setFetchLoading(true);
      const formDataToSend = new FormData();
      formDataToSend.append('id', formId.toString());

      const config = {
        method: 'post',
        url: 'https://makroomotors.com/makroo-panel/public/api/v1/pdi-delivery/form/get',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: formDataToSend,
        timeout: 30000,
      };

      const response = await axios(config);

      if (response.data.status && response.data.data) {
        const data = response.data.data;

        // Set status from backend
        setStatus(data.status || 'pending');
        setExistingFormNo(data.form_no);

        // Populate all form fields
        populateFormData(data);
      } else {
        Alert.alert('Error', 'Failed to fetch form data');
      }
    } catch (error) {
      console.log('Fetch Error:', error);
      Alert.alert('Error', 'Failed to load form data');
    } finally {
      setFetchLoading(false);
    }
  };

  const populateFormData = data => {
    // Basic form data
    setFormData({
      inspector_name: data.inspector_name || '',
      tire_make: data.tire_make || '',
      tire_make_other: data.tire_make_other || '',
      battery_make: data.battery_make || '',
      battery_make_other: data.battery_make_other || '',
      select_date: data.select_date ? new Date(data.select_date) : null,
      battery_date: data.battery_date ? new Date(data.battery_date) : null,
      chassis_no: data.chassis_no || '',
      tractor_model: data.tractor_model || '',
      engine_no: data.engine_no || '',
      front_right_serial_no: data.front_right_serial_no || '',
      rear_right_serial_no: data.rear_right_serial_no || '',
      front_left_serial_no: data.front_left_serial_no || '',
      rear_left_serial_no: data.rear_left_serial_no || '',
      tractor_starter_serial_no: data.tractor_starter_serial_no || '',
      tractor_alternator_no: data.tractor_alternator_no || '',
      battery_serial_no: data.battery_serial_no || '',
      fip_no: data.fip_no || '',
      dealer_name: data.dealer_name || '',
      customer_name: data.customer_name || '',
      customer_father_name: data.customer_father_name || '',
      customer_address: data.customer_address || '',
      customer_contact: data.customer_contact || '',
      pdi_done_by: data.pdi_done_by || '',
      remarks: data.remarks || '',
      delivery_customer_name: data.delivery_customer_name || '',
      delivery_customer_father_name: data.delivery_customer_father_name || '',
      delivery_customer_address: data.delivery_customer_address || '',
      delivery_customer_contact: data.delivery_customer_contact || '',
      hypothecation: data.hypothecation || '',
      hypothecation_other: data.hypothecation_other || '',
      lights_no: data.lights_no || '',
      nuts_no: data.nuts_no || '',
      hydraulic_oil_half: data.hydraulic_oil_half || '',
      all_nuts_sealed_no: data.all_nuts_sealed_no || '',
      engine_oil_level_half: data.engine_oil_level_half || '',
      coolant_level_no: data.coolant_level_no || '',
      brake_fluid_level_no: data.brake_fluid_level_no || '',
      greasing_done_no: data.greasing_done_no || '',
      paint_scratches_no: data.paint_scratches_no || '',
      toolkit_available_no: data.toolkit_available_no || '',
      owner_manual_given_no: data.owner_manual_given_no || '',
      reflector_sticker_applied_no: data.reflector_sticker_applied_no || '',
      number_plate_fixed_no: data.number_plate_fixed_no || '',
    });

    // Radio button states
    setRadioValues({
      lights_ok: data.lights_ok?.toString() || '1',
      nuts_ok: data.nuts_ok?.toString() || '1',
      tractor_delivered: data.tractor_delivered?.toString() || '1',
      hydraulic_oil: data.hydraulic_oil?.toString() || '1',
      all_nuts_sealed: data.all_nuts_sealed?.toString() || '1',
      engine_oil_level: data.engine_oil_level?.toString() || '1',
      coolant_level: data.coolant_level?.toString() || '1',
      brake_fluid_level: data.brake_fluid_level?.toString() || '1',
      greasing_done: data.greasing_done?.toString() || '1',
      paint_scratches: data.paint_scratches?.toString() || '0',
      toolkit_available: data.toolkit_available?.toString() || '1',
      owner_manual_given: data.owner_manual_given?.toString() || '1',
      reflector_sticker_applied:
        data.reflector_sticker_applied?.toString() || '1',
      number_plate_fixed: data.number_plate_fixed?.toString() || '0',
    });

    // Load existing images
    if (data.customer_photo) {
      const customerPhotoUri = makeAbsoluteUrl(data.customer_photo);
      setCustomerPhoto(customerPhotoUri);
    }
    if (data.customer_signature) {
      const customerSignatureUri = makeAbsoluteUrl(data.customer_signature);
      setCustomerSignature(customerSignatureUri);
    }
    if (data.manager_signature) {
      const managerSignatureUri = makeAbsoluteUrl(data.manager_signature);
      setManagerSignature(managerSignatureUri);
    }

    // Accept terms for viewing if tractor is delivered
    if (data.tractor_delivered === '1') {
      setIsTermsAccepted(true);
    }
  };

  // Camera Permission Function
  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'This app needs access to your camera to scan QR codes.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        const hasPermission = granted === PermissionsAndroid.RESULTS.GRANTED;
        setHasCameraPermission(hasPermission);
        return hasPermission;
      } catch (err) {
        console.warn(err);
        setHasCameraPermission(false);
        return false;
      }
    }
    setHasCameraPermission(true);
    return true;
  };

  // QR Scanner Handlers
  const handleQRScanPress = async scannerType => {
    if (!isEditMode) return;
    const hasPermission = await requestCameraPermission();
    if (hasPermission) {
      switch (scannerType) {
        case 'chassis':
          setShowChassisScanner(true);
          break;
        case 'engine':
          setShowEngineScanner(true);
          break;
        case 'battery':
          setShowBatteryScanner(true);
          break;
        case 'starter':
          setShowStarterScanner(true);
          break;
        case 'fip':
          setShowFipScanner(true);
          break;
        case 'alternator':
          setShowAlternatorScanner(true);
          break;
      }
    } else {
      Alert.alert(
        'Permission Denied',
        'Camera permission is required to scan QR codes.',
      );
    }
  };

  const handleQRCodeRead = event => {
    const scannedValue = event.nativeEvent.codeStringValue;
    console.log('QR Code Scanned:', scannedValue);

    if (showChassisScanner) {
      handleInputChange('chassis_no', scannedValue);
      setShowChassisScanner(false);
    } else if (showEngineScanner) {
      handleInputChange('engine_no', scannedValue);
      setShowEngineScanner(false);
    } else if (showBatteryScanner) {
      handleInputChange('battery_serial_no', scannedValue);
      setShowBatteryScanner(false);
    } else if (showStarterScanner) {
      handleInputChange('tractor_starter_serial_no', scannedValue);
      setShowStarterScanner(false);
    } else if (showFipScanner) {
      handleInputChange('fip_no', scannedValue);
      setShowFipScanner(false);
    } else if (showAlternatorScanner) {
      handleInputChange('tractor_alternator_no', scannedValue);
      setShowAlternatorScanner(false);
    }
  };

  const closeScanner = () => {
    setShowChassisScanner(false);
    setShowEngineScanner(false);
    setShowBatteryScanner(false);
    setShowStarterScanner(false);
    setShowFipScanner(false);
    setShowAlternatorScanner(false);
  };

  // Image handling functions
  const requestCameraPermissionForImage = async () => {
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

  const showImageSourceOptions = (
    setImageFunction,
    title = 'Select Image Source',
  ) => {
    if (!isEditMode) {
      Alert.alert(
        'Cannot Edit',
        'This form cannot be edited in its current status.',
      );
      return;
    }

    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', 'Take Photo', 'Choose from Gallery'],
          cancelButtonIndex: 0,
        },
        async buttonIndex => {
          if (buttonIndex === 1) {
            const hasPermission = await requestCameraPermissionForImage();
            if (!hasPermission) {
              Alert.alert(
                'Permission Denied',
                'Camera permission is required to take photos.',
              );
              return;
            }
            openCamera(setImageFunction);
          } else if (buttonIndex === 2) {
            openGallery(setImageFunction);
          }
        },
      );
    } else {
      Alert.alert(title, 'Choose how you want to capture the image', [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Take Photo',
          onPress: async () => {
            const hasPermission = await requestCameraPermissionForImage();
            if (!hasPermission) {
              Alert.alert(
                'Permission Denied',
                'Camera permission is required to take photos.',
              );
              return;
            }
            openCamera(setImageFunction);
          },
        },
        {
          text: 'Choose from Gallery',
          onPress: () => openGallery(setImageFunction),
        },
      ]);
    }
  };

  const openCamera = setImageFunction => {
    const options = {
      mediaType: 'photo',
      quality: 0.8,
      maxWidth: 800,
      maxHeight: 800,
      cameraType: 'back',
      saveToPhotos: false,
    };

    launchCamera(options, response => {
      if (response.didCancel) {
        console.log('User cancelled camera');
      } else if (response.error) {
        console.log('Camera Error: ', response.error);
        Alert.alert('Error', 'Failed to capture image');
      } else if (response.assets && response.assets.length > 0) {
        const uri = response.assets[0].uri;
        setImageFunction(uri);
      }
    });
  };

  const openGallery = setImageFunction => {
    const options = {
      mediaType: 'photo',
      quality: 0.8,
      maxWidth: 800,
      maxHeight: 800,
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
        Alert.alert('Error', 'Failed to pick image');
      } else if (response.assets && response.assets.length > 0) {
        const uri = response.assets[0].uri;
        setImageFunction(uri);
      }
    });
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleRadioChange = (field, value) => {
    setRadioValues(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  // Dropdown handlers
  const handleModelSelect = model => {
    handleInputChange('tractor_model', model);
    setShowModelDropdown(false);
  };

  const handleTireSelect = tire => {
    handleInputChange('tire_make', tire);
    if (tire !== 'Other') {
      handleInputChange('tire_make_other', '');
    }
    setShowTireDropdown(false);
  };

  const handleBatterySelect = battery => {
    handleInputChange('battery_make', battery);
    if (battery !== 'Other') {
      handleInputChange('battery_make_other', '');
    }
    setShowBatteryDropdown(false);
  };

  const handleHypothecationSelect = option => {
    handleInputChange('hypothecation', option);
    if (option !== 'Other') {
      handleInputChange('hypothecation_other', '');
    }
    setShowHypothecationDropdown(false);
  };

  // Date handlers
  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      handleInputChange('select_date', selectedDate);
    }
  };

  const handleBatteryDateChange = (event, selectedDate) => {
    setShowBatteryDatePicker(false);
    if (selectedDate) {
      handleInputChange('battery_date', selectedDate);
    }
  };

  // Edit Mode Handler - FIXED BASED ON STATUS
  const handleEditPress = () => {
    if (status === 'edited') {
      setIsEditMode(true);
    } else {
      Alert.alert(
        'Cannot Edit',
        `This form cannot be edited in its current status (${status}).`,
      );
    }
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    if (existingFormId) {
      fetchFormData(existingFormId);
    }
  };

  // Validate Form for Update
  const validateForm = () => {
    const requiredFields = [
      'inspector_name',
      'tractor_model',
      'chassis_no',
      'engine_no',
      'tire_make',
      'front_right_serial_no',
      'front_left_serial_no',
      'rear_right_serial_no',
      'rear_left_serial_no',
      'battery_make',
      'battery_serial_no',
      'tractor_starter_serial_no',
      'fip_no',
      'tractor_alternator_no',
      'dealer_name',
      'customer_name',
      'customer_address',
      'customer_contact',
      'pdi_done_by',
    ];

    for (const field of requiredFields) {
      if (!formData[field] || formData[field].toString().trim() === '') {
        Alert.alert(
          'Validation Error',
          `Please fill in ${field.replace(/_/g, ' ')}`,
        );
        return false;
      }
    }

    // Check if terms are accepted when tractor is delivered
    if (radioValues.tractor_delivered === '1' && !isTermsAccepted) {
      Alert.alert('Validation Error', 'Please accept the Terms and Conditions');
      return false;
    }

    // Check images
    if (!customerPhoto) {
      Alert.alert('Validation Error', 'Please add Customer Photo');
      return false;
    }
    if (!customerSignature) {
      Alert.alert('Validation Error', 'Please add Customer Signature');
      return false;
    }
    if (!managerSignature) {
      Alert.alert('Validation Error', 'Please add Manager Signature');
      return false;
    }

    return true;
  };

  const prepareFormData = () => {
    const formDataToSend = new FormData();

    formDataToSend.append('id', existingFormId.toString());
    formDataToSend.append('form_no', existingFormNo);

    // Common form data
    formDataToSend.append('user_id', userId);
    formDataToSend.append('form_date', new Date().toISOString().split('T')[0]);
    formDataToSend.append('inspector_name', formData.inspector_name);
    formDataToSend.append(
      'select_date',
      formData.select_date
        ? formData.select_date.toISOString().split('T')[0]
        : '',
    );
    formDataToSend.append('tractor_model', formData.tractor_model);
    formDataToSend.append('chassis_no', formData.chassis_no);
    formDataToSend.append('engine_no', formData.engine_no);

    // Tyre and battery
    formDataToSend.append('tire_make', formData.tire_make);
    formDataToSend.append('tire_make_other', formData.tire_make_other || '');
    formDataToSend.append(
      'front_right_serial_no',
      formData.front_right_serial_no,
    );
    formDataToSend.append(
      'front_left_serial_no',
      formData.front_left_serial_no,
    );
    formDataToSend.append(
      'rear_right_serial_no',
      formData.rear_right_serial_no,
    );
    formDataToSend.append('rear_left_serial_no', formData.rear_left_serial_no);
    formDataToSend.append('battery_make', formData.battery_make);
    formDataToSend.append(
      'battery_make_other',
      formData.battery_make_other || '',
    );
    formDataToSend.append(
      'battery_date',
      formData.battery_date
        ? formData.battery_date.toISOString().split('T')[0]
        : '',
    );
    formDataToSend.append('battery_serial_no', formData.battery_serial_no);
    formDataToSend.append(
      'tractor_starter_serial_no',
      formData.tractor_starter_serial_no,
    );
    formDataToSend.append('fip_no', formData.fip_no);
    formDataToSend.append(
      'tractor_alternator_no',
      formData.tractor_alternator_no,
    );

    // Customer details
    formDataToSend.append('dealer_name', formData.dealer_name);
    formDataToSend.append('customer_name', formData.customer_name);
    formDataToSend.append(
      'customer_father_name',
      formData.customer_father_name || '',
    );
    formDataToSend.append('customer_address', formData.customer_address);
    formDataToSend.append('customer_contact', formData.customer_contact);
    formDataToSend.append('pdi_done_by', formData.pdi_done_by);
    formDataToSend.append('remarks', formData.remarks || '');

    // Delivery-specific customer details
    formDataToSend.append(
      'delivery_customer_name',
      formData.delivery_customer_name || '',
    );
    formDataToSend.append(
      'delivery_customer_father_name',
      formData.delivery_customer_father_name || '',
    );
    formDataToSend.append(
      'delivery_customer_address',
      formData.delivery_customer_address || '',
    );
    formDataToSend.append(
      'delivery_customer_contact',
      formData.delivery_customer_contact || '',
    );
    formDataToSend.append('hypothecation', formData.hypothecation || '');
    formDataToSend.append(
      'hypothecation_other',
      formData.hypothecation_other || '',
    );

    // Radio button values
    formDataToSend.append('lights_ok', radioValues.lights_ok);
    formDataToSend.append('nuts_ok', radioValues.nuts_ok);
    formDataToSend.append('hydraulic_oil', radioValues.hydraulic_oil);
    formDataToSend.append('all_nuts_sealed', radioValues.all_nuts_sealed);
    formDataToSend.append('tractor_delivered', radioValues.tractor_delivered);
    formDataToSend.append('engine_oil_level', radioValues.engine_oil_level);
    formDataToSend.append('coolant_level', radioValues.coolant_level);
    formDataToSend.append('brake_fluid_level', radioValues.brake_fluid_level);
    formDataToSend.append('greasing_done', radioValues.greasing_done);
    formDataToSend.append('paint_scratches', radioValues.paint_scratches);
    formDataToSend.append('toolkit_available', radioValues.toolkit_available);
    formDataToSend.append('owner_manual_given', radioValues.owner_manual_given);
    formDataToSend.append(
      'reflector_sticker_applied',
      radioValues.reflector_sticker_applied,
    );
    formDataToSend.append('number_plate_fixed', radioValues.number_plate_fixed);

    // Remarks for "No" selections
    formDataToSend.append('lights_no', formData.lights_no || '');
    formDataToSend.append('nuts_no', formData.nuts_no || '');
    formDataToSend.append(
      'hydraulic_oil_half',
      formData.hydraulic_oil_half || '',
    );
    formDataToSend.append(
      'all_nuts_sealed_no',
      formData.all_nuts_sealed_no || '',
    );
    formDataToSend.append(
      'engine_oil_level_half',
      formData.engine_oil_level_half || '',
    );
    formDataToSend.append('coolant_level_no', formData.coolant_level_no || '');
    formDataToSend.append(
      'brake_fluid_level_no',
      formData.brake_fluid_level_no || '',
    );
    formDataToSend.append('greasing_done_no', formData.greasing_done_no || '');
    formDataToSend.append(
      'paint_scratches_no',
      formData.paint_scratches_no || '',
    );
    formDataToSend.append(
      'toolkit_available_no',
      formData.toolkit_available_no || '',
    );
    formDataToSend.append(
      'owner_manual_given_no',
      formData.owner_manual_given_no || '',
    );
    formDataToSend.append(
      'reflector_sticker_applied_no',
      formData.reflector_sticker_applied_no || '',
    );
    formDataToSend.append(
      'number_plate_fixed_no',
      formData.number_plate_fixed_no || '',
    );

    // Add delivery date if tractor is delivered
    if (radioValues.tractor_delivered === '1') {
      formDataToSend.append(
        'delivery_date',
        new Date().toISOString().split('T')[0],
      );
    }

    // Add images
    if (customerPhoto && customerPhoto.startsWith('file://')) {
      formDataToSend.append('customer_photo', {
        uri: customerPhoto,
        type: 'image/jpeg',
        name: 'customer_photo.jpg',
      });
    }

    if (customerSignature && customerSignature.startsWith('file://')) {
      formDataToSend.append('customer_signature', {
        uri: customerSignature,
        type: 'image/jpeg',
        name: 'customer_signature.jpg',
      });
    }

    if (managerSignature && managerSignature.startsWith('file://')) {
      formDataToSend.append('manager_signature', {
        uri: managerSignature,
        type: 'image/jpeg',
        name: 'manager_signature.jpg',
      });
    }

    return formDataToSend;
  };

  // Save Updated Data
  const handleUpdate = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const formDataToSend = prepareFormData();

      const config = {
        method: 'post',
        url: 'https://makroomotors.com/makroo-panel/public/api/v1/pdi-delivery/form/update',
        headers: {
          'Content-Type': 'multipart/form-data',
          Accept: 'application/json',
        },
        data: formDataToSend,
        timeout: 30000,
      };

      const response = await axios(config);

      if (response.data && response.data.status === true) {
        // Update local state
        setStatus('pending');
        setIsEditMode(false);

        Alert.alert(
          'Success',
          response.data.message ||
            'Form updated successfully! Form is now pending approval.',
          [
            {
              text: 'OK',
              onPress: () => {
                // Refresh data
                fetchFormData(existingFormId);
              },
            },
          ],
        );
      } else {
        const errorMessage = response.data?.message || 'Failed to update form';
        Alert.alert('Update Failed', errorMessage);
      }
    } catch (error) {
      console.log('Update Error:', error);
      let errorMessage = 'Something went wrong. Please try again.';

      if (error.response) {
        if (error.response.status === 422) {
          const validationErrors = error.response.data.errors;
          if (validationErrors) {
            const firstErrorKey = Object.keys(validationErrors)[0];
            const firstError = validationErrors[firstErrorKey];
            errorMessage = firstError
              ? firstError[0]
              : 'Please check all required fields';
          } else {
            errorMessage =
              error.response.data.message || 'Validation error occurred';
          }
        } else {
          const serverError = error.response.data;
          errorMessage =
            serverError.message ||
            serverError.error ||
            `Server error: ${error.response.status}`;
        }
      } else if (error.request) {
        errorMessage = 'Network error. Please check your internet connection.';
      }

      Alert.alert('Update Failed', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Download PDF Handler
  const handleDownloadPDF = async () => {
    if (!existingFormId) {
      Alert.alert('Error', 'Form data not available');
      return;
    }

    setLoading(true);

    try {
      console.log('Generating PDF for form ID:', existingFormId);

      const config = {
        method: 'get',
        url: `https://makroomotors.com/makroo-panel/public/api/v1/pdi-delivery/form/generate-pdf/${existingFormId}`,
        timeout: 60000,
      };

      const response = await axios(config);
      console.log('PDF Response:', response.data);

      if (response.data.status && response.data.pdf_link) {
        const pdfUrl = response.data.pdf_link;
        console.log('PDF URL:', pdfUrl);

        // Try to open the URL directly without checking canOpenURL first
        try {
          await Linking.openURL(pdfUrl);
          Alert.alert('Success', 'PDF opened successfully');
        } catch (error) {
          console.log('Error opening URL:', error);
          // If direct opening fails, show the URL to user
          Alert.alert(
            'PDF Generated',
            `PDF has been generated. If it doesn't open automatically, please copy this URL and open in your browser:\n\n${pdfUrl}`,
            [{text: 'OK', style: 'cancel'}],
          );
        }
      } else {
        const errorMsg =
          response.data?.message || 'PDF generation failed on server';
        console.log('PDF generation failed:', errorMsg);
        Alert.alert('Error', errorMsg);
      }
    } catch (error) {
      console.log('PDF Error:', error);
      console.log('Error response:', error.response?.data);

      let errorMessage = 'Failed to download PDF. Please try again.';

      if (error.response) {
        const serverError = error.response.data;
        errorMessage =
          serverError.message ||
          serverError.error ||
          `Server error: ${error.response.status}`;
      } else if (error.request) {
        errorMessage = 'Network error. Please check your internet connection.';
      } else {
        errorMessage = error.message || 'Unknown error occurred';
      }

      Alert.alert('PDF Download Failed', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Render helper functions
  const renderInputField = (
    value,
    onChange,
    placeholder,
    keyboardType = 'default',
    editable = true,
  ) => {
    if (isEditMode) {
      return (
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChange}
          placeholder={placeholder}
          placeholderTextColor="#666"
          editable={editable && !loading}
          keyboardType={keyboardType}
        />
      );
    } else {
      return (
        <Text style={[styles.input, styles.readOnlyInput]}>
          {value || 'Not provided'}
        </Text>
      );
    }
  };

  const renderDropdownField = (value, onPress, placeholder) => {
    if (isEditMode) {
      return (
        <TouchableOpacity
          style={styles.input}
          onPress={onPress}
          disabled={loading || loadingModels}>
          <Text
            style={value ? styles.selectedModelText : styles.placeholderText}>
            {value || placeholder}
          </Text>
          {loadingModels ? (
            <ActivityIndicator size="small" color="#666" />
          ) : (
            <Icon
              name="keyboard-arrow-down"
              size={25}
              color="#666"
              style={styles.dropdownIcon}
            />
          )}
        </TouchableOpacity>
      );
    } else {
      return (
        <Text style={[styles.input, styles.readOnlyInput]}>
          {value || 'Not provided'}
        </Text>
      );
    }
  };

  const renderDateField = (date, onPress, placeholder) => {
    if (isEditMode) {
      return (
        <View style={styles.inputWithIcon}>
          <TouchableOpacity
            style={[styles.input, styles.inputWithIconField]}
            onPress={onPress}
            disabled={loading}>
            <Text
              style={date ? styles.selectedModelText : styles.placeholderText}>
              {date ? date.toLocaleDateString() : placeholder}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onPress}
            style={styles.iconButton}
            disabled={loading}>
            <Icon name="calendar-today" size={20} color="#666" />
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <Text style={[styles.input, styles.readOnlyInput]}>
          {date ? date.toLocaleDateString() : 'Not provided'}
        </Text>
      );
    }
  };

  const renderRadioOption = (field, value, label) => (
    <TouchableOpacity
      style={[
        styles.radioOptionWrapper,
        radioValues[field] === value && styles.radioOptionSelected,
      ]}
      onPress={() => isEditMode && handleRadioChange(field, value)}
      disabled={!isEditMode || loading}>
      <LinearGradient
        colors={['#7E5EA9', '#20AEBC']}
        style={styles.radioOptionGradient}>
        <View
          style={[
            styles.radioOptionInner,
            radioValues[field] === value && styles.radioOptionInnerSelected,
          ]}>
          <Text
            style={[
              styles.radioOptionText,
              radioValues[field] === value && styles.radioOptionTextSelected,
            ]}>
            {label}
          </Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  // Radio button renderers
  const renderYesNo = field => {
    return (
      <View style={styles.radioOptionsContainer}>
        {renderRadioOption(field, '1', 'YES')}
        {renderRadioOption(field, '0', 'NO')}
      </View>
    );
  };

  const renderFullHalf = field => {
    return (
      <View style={styles.radioOptionsContainer}>
        {renderRadioOption(field, '1', 'FULL')}
        {renderRadioOption(field, '0', 'HALF')}
      </View>
    );
  };

  const renderImageBox = (imageUri, setImageFunction, label, boxStyle) => (
    <View style={styles.imageContainer}>
      <Text style={styles.imageLabel}>{label}</Text>
      {imageUri ? (
        <View style={styles.photoContainer}>
          <Image
            source={{uri: imageUri}}
            style={
              boxStyle === styles.photoSignatureBox
                ? styles.avatar
                : styles.signatureImage
            }
          />
          {isEditMode && (
            <TouchableOpacity
              style={styles.changePhotoButton}
              onPress={() =>
                showImageSourceOptions(setImageFunction, `Update ${label}`)
              }>
              <Text style={styles.changePhotoText}>
                Change {label.includes('Photo') ? 'Photo' : 'Signature'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <View style={styles.photoContainer}>
          {boxStyle === styles.photoSignatureBox ? (
            <Image
              source={require('../Asset/Images/c10.png')}
              style={styles.avatar}
            />
          ) : null}
          {isEditMode && (
            <TouchableOpacity
              style={styles.addPhotoButton}
              onPress={() =>
                showImageSourceOptions(setImageFunction, `Add ${label}`)
              }>
              <Text style={styles.addPhotoText}>
                Add {label.includes('Photo') ? 'Photo' : 'Signature'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );

  // Modal render items
  const renderModelItem = ({item}) => (
    <TouchableOpacity
      style={styles.modelItem}
      onPress={() => handleModelSelect(item)}>
      <Text style={styles.modelItemText}>{item}</Text>
    </TouchableOpacity>
  );

  const renderTireItem = ({item}) => (
    <TouchableOpacity
      style={styles.modelItem}
      onPress={() => handleTireSelect(item)}>
      <Text style={styles.modelItemText}>{item}</Text>
    </TouchableOpacity>
  );

  const renderBatteryItem = ({item}) => (
    <TouchableOpacity
      style={styles.modelItem}
      onPress={() => handleBatterySelect(item)}>
      <Text style={styles.modelItemText}>{item}</Text>
    </TouchableOpacity>
  );

  const renderHypothecationItem = ({item}) => (
    <TouchableOpacity
      style={styles.modelItem}
      onPress={() => handleHypothecationSelect(item)}>
      <Text style={styles.modelItemText}>{item}</Text>
    </TouchableOpacity>
  );

  // QR Scanner Component
  const renderQRScanner = () => (
    <Modal
      visible={
        showChassisScanner ||
        showEngineScanner ||
        showBatteryScanner ||
        showStarterScanner ||
        showFipScanner ||
        showAlternatorScanner
      }
      animationType="slide"
      transparent={false}
      onRequestClose={closeScanner}>
      <View style={styles.scannerContainer}>
        <View style={styles.scannerHeader}>
          <TouchableOpacity
            onPress={closeScanner}
            style={styles.scannerCloseButton}>
            <Icon name="close" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.scannerTitle}>
            {showChassisScanner
              ? 'Scan Chassis Number'
              : showEngineScanner
              ? 'Scan Engine Number'
              : showBatteryScanner
              ? 'Scan Battery Serial Number'
              : showStarterScanner
              ? 'Scan Starter Serial Number'
              : showFipScanner
              ? 'Scan FIP Number'
              : 'Scan Alternator Number'}
          </Text>
        </View>

        <Camera
          style={styles.camera}
          cameraOptions={{
            flashMode: 'auto',
            focusMode: 'on',
            zoomMode: 'on',
          }}
          scanBarcode={true}
          showFrame={true}
          laserColor="red"
          frameColor="white"
          onReadCode={handleQRCodeRead}
        />

        <View style={styles.scannerFooter}>
          <Text style={styles.scannerInstructions}>
            Point your camera at a QR code to scan
          </Text>
        </View>
      </View>
    </Modal>
  );

  if (fetchLoading) {
    return (
      <View
        style={{
          flex: 1,
          paddingTop: insets.top,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <ActivityIndicator size="large" color="#7E5EA9" />
        <Text style={{marginTop: 10}}>Loading form data...</Text>
      </View>
    );
  }

  return (
    <View
      style={{flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom}}>
      <LinearGradient
        colors={['#7E5EA9', '#20AEBC']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.companyName}>Makroo Motor Corporation</Text>
          <Text style={styles.companyName}>Pre Delivery Inspection Form</Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.container}>
        <View style={styles.formHeader}>
          <Text style={styles.Date}>{new Date().toLocaleDateString()}</Text>
        </View>

        {isEditMode && (
          <View style={styles.editModeContainer}>
            <Text style={styles.editModeText}>
              Edit Mode - Updating Form ID: {existingFormId}
            </Text>
          </View>
        )}

        <View style={styles.photoSection}>
          {renderImageBox(
            customerPhoto,
            setCustomerPhoto,
            'Customer Photo',
            styles.photoSignatureBox,
          )}
        </View>

        <View style={styles.customerHeader}>
          <Text style={styles.customerName}>
            {formData.customer_name || '—'}
          </Text>
          <Text
            style={[
              styles.statusText,
              status === 'approved'
                ? styles.statusApproved
                : status === 'pending'
                ? styles.statusPending
                : status === 'rejected'
                ? styles.statusRejected
                : status === 'edited'
                ? styles.statusEdited
                : styles.statusDefault,
            ]}>
            Status: {status || '—'}
          </Text>
        </View>

        {/* Form Fields */}
        <View style={styles.formContainer}>
          {/* Inspector Name */}
          <View style={styles.singleRow}>
            <Text style={styles.fieldLabel}>Inspector Name</Text>
            <View style={styles.fullWidthContainer}>
              <LinearGradient
                colors={['#7E5EA9', '#20AEBC']}
                style={styles.inputGradient}>
                {renderInputField(
                  formData.inspector_name,
                  text => handleInputChange('inspector_name', text),
                  'Enter inspector name',
                )}
              </LinearGradient>
            </View>
          </View>

          {/* Date */}
          <View style={styles.singleRow}>
            <Text style={styles.fieldLabel}>Select Date</Text>
            <View style={styles.fullWidthContainer}>
              <LinearGradient
                colors={['#7E5EA9', '#20AEBC']}
                style={styles.inputGradient}>
                {renderDateField(
                  formData.select_date,
                  () => setShowDatePicker(true),
                  'Select date',
                )}
                {showDatePicker && isEditMode && (
                  <DateTimePicker
                    value={formData.select_date || new Date()}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={handleDateChange}
                  />
                )}
              </LinearGradient>
            </View>
          </View>

          {/* Tractor Model */}
          <View style={styles.singleRow}>
            <Text style={styles.fieldLabel}>Tractor Model</Text>
            <View style={styles.fullWidthContainer}>
              <LinearGradient
                colors={['#7E5EA9', '#20AEBC']}
                style={styles.inputGradient}>
                {renderDropdownField(
                  formData.tractor_model,
                  () => setShowModelDropdown(true),
                  'Select tractor model',
                )}
              </LinearGradient>
            </View>
          </View>

          {/* Chassis No */}
          <View style={styles.singleRow}>
            <Text style={styles.fieldLabel}>Chassis Number</Text>
            <View style={styles.fullWidthContainer}>
              <LinearGradient
                colors={['#7E5EA9', '#20AEBC']}
                style={styles.inputGradient}>
                <View style={[styles.input, styles.inputWithIconField]}>
                  {renderInputField(
                    formData.chassis_no,
                    text => handleInputChange('chassis_no', text),
                    'Enter chassis number',
                  )}
                  {isEditMode && (
                    <TouchableOpacity
                      onPress={() => handleQRScanPress('chassis')}
                      style={styles.iconButton}
                      disabled={loading}>
                      <Icon name="qr-code-scanner" size={20} color="#666" />
                    </TouchableOpacity>
                  )}
                </View>
              </LinearGradient>
            </View>
          </View>

          {/* Engine No */}
          <View style={styles.singleRow}>
            <Text style={styles.fieldLabel}>Engine Number</Text>
            <View style={styles.fullWidthContainer}>
              <LinearGradient
                colors={['#7E5EA9', '#20AEBC']}
                style={styles.inputGradient}>
                <View style={[styles.input, styles.inputWithIconField]}>
                  {renderInputField(
                    formData.engine_no,
                    text => handleInputChange('engine_no', text),
                    'Enter engine number',
                  )}
                  {isEditMode && (
                    <TouchableOpacity
                      onPress={() => handleQRScanPress('engine')}
                      style={styles.iconButton}
                      disabled={loading}>
                      <Icon name="qr-code-scanner" size={20} color="#666" />
                    </TouchableOpacity>
                  )}
                </View>
              </LinearGradient>
            </View>
          </View>

          {/* Customer Details Section */}
          <Text style={styles.sectionHeading}>Customer Details</Text>

          {/* Dealer Name */}
          <View style={styles.singleRow}>
            <Text style={styles.fieldLabel}>Dealer Name</Text>
            <View style={styles.fullWidthContainer}>
              <LinearGradient
                colors={['#7E5EA9', '#20AEBC']}
                style={styles.inputGradient}>
                {renderInputField(
                  formData.dealer_name,
                  text => handleInputChange('dealer_name', text),
                  'Enter dealer name',
                )}
              </LinearGradient>
            </View>
          </View>

          {/* Customer Name */}
          <View style={styles.singleRow}>
            <Text style={styles.fieldLabel}>Customer Name</Text>
            <View style={styles.fullWidthContainer}>
              <LinearGradient
                colors={['#7E5EA9', '#20AEBC']}
                style={styles.inputGradient}>
                {renderInputField(
                  formData.customer_name,
                  text => handleInputChange('customer_name', text),
                  'Enter customer name',
                )}
              </LinearGradient>
            </View>
          </View>

          {/* Customer Father Name */}
          <View style={styles.singleRow}>
            <Text style={styles.fieldLabel}>Father's Name</Text>
            <View style={styles.fullWidthContainer}>
              <LinearGradient
                colors={['#7E5EA9', '#20AEBC']}
                style={styles.inputGradient}>
                {renderInputField(
                  formData.customer_father_name,
                  text => handleInputChange('customer_father_name', text),
                  "Enter father's name",
                )}
              </LinearGradient>
            </View>
          </View>

          {/* Customer Address */}
          <View style={styles.singleRow}>
            <Text style={styles.fieldLabel}>Customer Address</Text>
            <View style={styles.fullWidthContainer}>
              <LinearGradient
                colors={['#7E5EA9', '#20AEBC']}
                style={styles.inputGradient}>
                {renderInputField(
                  formData.customer_address,
                  text => handleInputChange('customer_address', text),
                  'Enter customer address',
                )}
              </LinearGradient>
            </View>
          </View>

          {/* Customer Contact */}
          <View style={styles.singleRow}>
            <Text style={styles.fieldLabel}>Customer Contact</Text>
            <View style={styles.fullWidthContainer}>
              <LinearGradient
                colors={['#7E5EA9', '#20AEBC']}
                style={styles.inputGradient}>
                {renderInputField(
                  formData.customer_contact,
                  text => handleInputChange('customer_contact', text),
                  'Enter customer contact',
                  'phone-pad',
                )}
              </LinearGradient>
            </View>
          </View>

          {/* Tire Details Section */}
          <Text style={styles.sectionHeading}>Tire Details</Text>

          {/* Tire Make */}
          <View style={styles.singleRow}>
            <Text style={styles.fieldLabel}>Tire Make</Text>
            <View style={styles.fullWidthContainer}>
              <LinearGradient
                colors={['#7E5EA9', '#20AEBC']}
                style={styles.inputGradient}>
                {renderDropdownField(
                  formData.tire_make,
                  () => setShowTireDropdown(true),
                  'Select tire make',
                )}
              </LinearGradient>
            </View>
          </View>

          {/* Other Tire Make */}
          {formData.tire_make === 'Other' && (
            <View style={styles.singleRow}>
              <Text style={styles.fieldLabel}>Other Tire Make</Text>
              <View style={styles.fullWidthContainer}>
                <LinearGradient
                  colors={['#7E5EA9', '#20AEBC']}
                  style={styles.inputGradient}>
                  {renderInputField(
                    formData.tire_make_other,
                    text => handleInputChange('tire_make_other', text),
                    'Enter other tire make',
                  )}
                </LinearGradient>
              </View>
            </View>
          )}

          {/* Tire Serial Numbers */}
          <View style={styles.row}>
            <View style={styles.halfWidthContainer}>
              <Text style={styles.fieldLabel}>Front Right Serial</Text>
              <LinearGradient
                colors={['#7E5EA9', '#20AEBC']}
                style={styles.inputGradient}>
                {renderInputField(
                  formData.front_right_serial_no,
                  text => handleInputChange('front_right_serial_no', text),
                  'Front right',
                )}
              </LinearGradient>
            </View>
            <View style={styles.halfWidthContainer}>
              <Text style={styles.fieldLabel}>Front Left Serial</Text>
              <LinearGradient
                colors={['#7E5EA9', '#20AEBC']}
                style={styles.inputGradient}>
                {renderInputField(
                  formData.front_left_serial_no,
                  text => handleInputChange('front_left_serial_no', text),
                  'Front left',
                )}
              </LinearGradient>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.halfWidthContainer}>
              <Text style={styles.fieldLabel}>Rear Right Serial</Text>
              <LinearGradient
                colors={['#7E5EA9', '#20AEBC']}
                style={styles.inputGradient}>
                {renderInputField(
                  formData.rear_right_serial_no,
                  text => handleInputChange('rear_right_serial_no', text),
                  'Rear right',
                )}
              </LinearGradient>
            </View>
            <View style={styles.halfWidthContainer}>
              <Text style={styles.fieldLabel}>Rear Left Serial</Text>
              <LinearGradient
                colors={['#7E5EA9', '#20AEBC']}
                style={styles.inputGradient}>
                {renderInputField(
                  formData.rear_left_serial_no,
                  text => handleInputChange('rear_left_serial_no', text),
                  'Rear left',
                )}
              </LinearGradient>
            </View>
          </View>

          {/* Battery Details Section */}
          <Text style={styles.sectionHeading}>Battery Details</Text>

          {/* Battery Make */}
          <View style={styles.singleRow}>
            <Text style={styles.fieldLabel}>Battery Make</Text>
            <View style={styles.fullWidthContainer}>
              <LinearGradient
                colors={['#7E5EA9', '#20AEBC']}
                style={styles.inputGradient}>
                {renderDropdownField(
                  formData.battery_make,
                  () => setShowBatteryDropdown(true),
                  'Select battery make',
                )}
              </LinearGradient>
            </View>
          </View>

          {/* Other Battery Make */}
          {formData.battery_make === 'Other' && (
            <View style={styles.singleRow}>
              <Text style={styles.fieldLabel}>Other Battery Make</Text>
              <View style={styles.fullWidthContainer}>
                <LinearGradient
                  colors={['#7E5EA9', '#20AEBC']}
                  style={styles.inputGradient}>
                  {renderInputField(
                    formData.battery_make_other,
                    text => handleInputChange('battery_make_other', text),
                    'Enter other battery make',
                  )}
                </LinearGradient>
              </View>
            </View>
          )}

          {/* Battery Date */}
          <View style={styles.singleRow}>
            <Text style={styles.fieldLabel}>Battery Date</Text>
            <View style={styles.fullWidthContainer}>
              <LinearGradient
                colors={['#7E5EA9', '#20AEBC']}
                style={styles.inputGradient}>
                {renderDateField(
                  formData.battery_date,
                  () => setShowBatteryDatePicker(true),
                  'Select battery date',
                )}
                {showBatteryDatePicker && isEditMode && (
                  <DateTimePicker
                    value={formData.battery_date || new Date()}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={handleBatteryDateChange}
                  />
                )}
              </LinearGradient>
            </View>
          </View>

          {/* Battery and Starter Serial Numbers */}
          <View style={styles.row}>
            <View style={styles.halfWidthContainer}>
              <Text style={styles.fieldLabel}>Battery Serial</Text>
              <LinearGradient
                colors={['#7E5EA9', '#20AEBC']}
                style={styles.inputGradient}>
                <View style={[styles.input, styles.inputWithIconField]}>
                  {renderInputField(
                    formData.battery_serial_no,
                    text => handleInputChange('battery_serial_no', text),
                    'Battery serial',
                  )}
                  {isEditMode && (
                    <TouchableOpacity
                      onPress={() => handleQRScanPress('battery')}
                      style={styles.iconButton}
                      disabled={loading}>
                      <Icon name="qr-code-scanner" size={20} color="#666" />
                    </TouchableOpacity>
                  )}
                </View>
              </LinearGradient>
            </View>
            <View style={styles.halfWidthContainer}>
              <Text style={styles.fieldLabel}>Starter Serial</Text>
              <LinearGradient
                colors={['#7E5EA9', '#20AEBC']}
                style={styles.inputGradient}>
                <View style={[styles.input, styles.inputWithIconField]}>
                  {renderInputField(
                    formData.tractor_starter_serial_no,
                    text =>
                      handleInputChange('tractor_starter_serial_no', text),
                    'Starter serial',
                  )}
                  {isEditMode && (
                    <TouchableOpacity
                      onPress={() => handleQRScanPress('starter')}
                      style={styles.iconButton}
                      disabled={loading}>
                      <Icon name="qr-code-scanner" size={20} color="#666" />
                    </TouchableOpacity>
                  )}
                </View>
              </LinearGradient>
            </View>
          </View>

          {/* FIP and Alternator Numbers */}
          <View style={styles.row}>
            <View style={styles.halfWidthContainer}>
              <Text style={styles.fieldLabel}>FIP Number</Text>
              <LinearGradient
                colors={['#7E5EA9', '#20AEBC']}
                style={styles.inputGradient}>
                <View style={[styles.input, styles.inputWithIconField]}>
                  {renderInputField(
                    formData.fip_no,
                    text => handleInputChange('fip_no', text),
                    'FIP number',
                  )}
                  {isEditMode && (
                    <TouchableOpacity
                      onPress={() => handleQRScanPress('fip')}
                      style={styles.iconButton}
                      disabled={loading}>
                      <Icon name="qr-code-scanner" size={20} color="#666" />
                    </TouchableOpacity>
                  )}
                </View>
              </LinearGradient>
            </View>
            <View style={styles.halfWidthContainer}>
              <Text style={styles.fieldLabel}>Alternator Number</Text>
              <LinearGradient
                colors={['#7E5EA9', '#20AEBC']}
                style={styles.inputGradient}>
                <View style={[styles.input, styles.inputWithIconField]}>
                  {renderInputField(
                    formData.tractor_alternator_no,
                    text => handleInputChange('tractor_alternator_no', text),
                    'Alternator number',
                  )}
                  {isEditMode && (
                    <TouchableOpacity
                      onPress={() => handleQRScanPress('alternator')}
                      style={styles.iconButton}
                      disabled={loading}>
                      <Icon name="qr-code-scanner" size={20} color="#666" />
                    </TouchableOpacity>
                  )}
                </View>
              </LinearGradient>
            </View>
          </View>

          {/* PDI Done By and Remarks */}
          <View style={styles.row}>
            <View style={styles.halfWidthContainer}>
              <Text style={styles.fieldLabel}>PDI Done By</Text>
              <LinearGradient
                colors={['#7E5EA9', '#20AEBC']}
                style={styles.inputGradient}>
                {renderInputField(
                  formData.pdi_done_by,
                  text => handleInputChange('pdi_done_by', text),
                  'PDI done by',
                )}
              </LinearGradient>
            </View>
            <View style={styles.halfWidthContainer}>
              <Text style={styles.fieldLabel}>Remarks</Text>
              <LinearGradient
                colors={['#7E5EA9', '#20AEBC']}
                style={styles.inputGradient}>
                {renderInputField(
                  formData.remarks,
                  text => handleInputChange('remarks', text),
                  'Remarks',
                )}
              </LinearGradient>
            </View>
          </View>
        </View>

        {/* Radio Sections */}
        <View style={styles.radioSection}>
          <Text style={styles.radioLabel}>Lights OK:</Text>
          {renderYesNo('lights_ok')}
          {radioValues.lights_ok === '0' && (
            <View style={styles.singleRow}>
              <Text style={styles.fieldLabel}>Remark for Lights</Text>
              <LinearGradient
                colors={['#7E5EA9', '#20AEBC']}
                style={styles.inputGradient}>
                {renderInputField(
                  formData.lights_no,
                  text => handleInputChange('lights_no', text),
                  'Enter remark for lights',
                )}
              </LinearGradient>
            </View>
          )}

          <Text style={styles.radioLabel}>Nuts OK:</Text>
          {renderYesNo('nuts_ok')}
          {radioValues.nuts_ok === '0' && (
            <View style={styles.singleRow}>
              <Text style={styles.fieldLabel}>Remark for Nuts</Text>
              <LinearGradient
                colors={['#7E5EA9', '#20AEBC']}
                style={styles.inputGradient}>
                {renderInputField(
                  formData.nuts_no,
                  text => handleInputChange('nuts_no', text),
                  'Enter remark for nuts',
                )}
              </LinearGradient>
            </View>
          )}

          <Text style={styles.radioLabel}>Hydraulic Oil:</Text>
          {renderFullHalf('hydraulic_oil')}
          {radioValues.hydraulic_oil === '0' && (
            <View style={styles.singleRow}>
              <Text style={styles.fieldLabel}>Remark for Hydraulic Oil</Text>
              <LinearGradient
                colors={['#7E5EA9', '#20AEBC']}
                style={styles.inputGradient}>
                {renderInputField(
                  formData.hydraulic_oil_half,
                  text => handleInputChange('hydraulic_oil_half', text),
                  'Enter remark for hydraulic oil',
                )}
              </LinearGradient>
            </View>
          )}

          <Text style={styles.radioLabel}>All Nuts Are Sealed:</Text>
          {renderYesNo('all_nuts_sealed')}
          {radioValues.all_nuts_sealed === '0' && (
            <View style={styles.singleRow}>
              <Text style={styles.fieldLabel}>Remark for All Nuts Sealed</Text>
              <LinearGradient
                colors={['#7E5EA9', '#20AEBC']}
                style={styles.inputGradient}>
                {renderInputField(
                  formData.all_nuts_sealed_no,
                  text => handleInputChange('all_nuts_sealed_no', text),
                  'Enter remark for all nuts sealed',
                )}
              </LinearGradient>
            </View>
          )}

          <Text style={styles.radioLabel}>Engine Oil Level:</Text>
          {renderFullHalf('engine_oil_level')}
          {radioValues.engine_oil_level === '0' && (
            <View style={styles.singleRow}>
              <Text style={styles.fieldLabel}>Remark for Engine Oil Level</Text>
              <LinearGradient
                colors={['#7E5EA9', '#20AEBC']}
                style={styles.inputGradient}>
                {renderInputField(
                  formData.engine_oil_level_half,
                  text => handleInputChange('engine_oil_level_half', text),
                  'Enter remark for engine oil level',
                )}
              </LinearGradient>
            </View>
          )}

          <Text style={styles.radioLabel}>Coolant Level:</Text>
          {renderYesNo('coolant_level')}
          {radioValues.coolant_level === '0' && (
            <View style={styles.singleRow}>
              <Text style={styles.fieldLabel}>Remark for Coolant Level</Text>
              <LinearGradient
                colors={['#7E5EA9', '#20AEBC']}
                style={styles.inputGradient}>
                {renderInputField(
                  formData.coolant_level_no,
                  text => handleInputChange('coolant_level_no', text),
                  'Enter remark for coolant level',
                )}
              </LinearGradient>
            </View>
          )}

          <Text style={styles.radioLabel}>Brake Fluid Level:</Text>
          {renderYesNo('brake_fluid_level')}
          {radioValues.brake_fluid_level === '0' && (
            <View style={styles.singleRow}>
              <Text style={styles.fieldLabel}>
                Remark for Brake Fluid Level
              </Text>
              <LinearGradient
                colors={['#7E5EA9', '#20AEBC']}
                style={styles.inputGradient}>
                {renderInputField(
                  formData.brake_fluid_level_no,
                  text => handleInputChange('brake_fluid_level_no', text),
                  'Enter remark for brake fluid level',
                )}
              </LinearGradient>
            </View>
          )}

          <Text style={styles.radioLabel}>Greasing Done:</Text>
          {renderYesNo('greasing_done')}
          {radioValues.greasing_done === '0' && (
            <View style={styles.singleRow}>
              <Text style={styles.fieldLabel}>Remark for Greasing Done</Text>
              <LinearGradient
                colors={['#7E5EA9', '#20AEBC']}
                style={styles.inputGradient}>
                {renderInputField(
                  formData.greasing_done_no,
                  text => handleInputChange('greasing_done_no', text),
                  'Enter remark for greasing done',
                )}
              </LinearGradient>
            </View>
          )}

          <Text style={styles.radioLabel}>Paint Scratches:</Text>
          {renderYesNo('paint_scratches')}
          {radioValues.paint_scratches === '0' && (
            <View style={styles.singleRow}>
              <Text style={styles.fieldLabel}>Remark for Paint Scratches</Text>
              <LinearGradient
                colors={['#7E5EA9', '#20AEBC']}
                style={styles.inputGradient}>
                {renderInputField(
                  formData.paint_scratches_no,
                  text => handleInputChange('paint_scratches_no', text),
                  'Enter remark for paint scratches',
                )}
              </LinearGradient>
            </View>
          )}

          <Text style={styles.radioLabel}>Toolkit Available:</Text>
          {renderYesNo('toolkit_available')}
          {radioValues.toolkit_available === '0' && (
            <View style={styles.singleRow}>
              <Text style={styles.fieldLabel}>
                Remark for Toolkit Available
              </Text>
              <LinearGradient
                colors={['#7E5EA9', '#20AEBC']}
                style={styles.inputGradient}>
                {renderInputField(
                  formData.toolkit_available_no,
                  text => handleInputChange('toolkit_available_no', text),
                  'Enter remark for toolkit available',
                )}
              </LinearGradient>
            </View>
          )}

          <Text style={styles.radioLabel}>Owner Manual Given:</Text>
          {renderYesNo('owner_manual_given')}
          {radioValues.owner_manual_given === '0' && (
            <View style={styles.singleRow}>
              <Text style={styles.fieldLabel}>
                Remark for Owner Manual Given
              </Text>
              <LinearGradient
                colors={['#7E5EA9', '#20AEBC']}
                style={styles.inputGradient}>
                {renderInputField(
                  formData.owner_manual_given_no,
                  text => handleInputChange('owner_manual_given_no', text),
                  'Enter remark for owner manual given',
                )}
              </LinearGradient>
            </View>
          )}

          <Text style={styles.radioLabel}>Reflector Sticker Applied:</Text>
          {renderYesNo('reflector_sticker_applied')}
          {radioValues.reflector_sticker_applied === '0' && (
            <View style={styles.singleRow}>
              <Text style={styles.fieldLabel}>
                Remark for Reflector Sticker Applied
              </Text>
              <LinearGradient
                colors={['#7E5EA9', '#20AEBC']}
                style={styles.inputGradient}>
                {renderInputField(
                  formData.reflector_sticker_applied_no,
                  text =>
                    handleInputChange('reflector_sticker_applied_no', text),
                  'Enter remark for reflector sticker applied',
                )}
              </LinearGradient>
            </View>
          )}

          <Text style={styles.radioLabel}>Number Plate Fixed:</Text>
          {renderYesNo('number_plate_fixed')}
          {radioValues.number_plate_fixed === '0' && (
            <View style={styles.singleRow}>
              <Text style={styles.fieldLabel}>
                Remark for Number Plate Fixed
              </Text>
              <LinearGradient
                colors={['#7E5EA9', '#20AEBC']}
                style={styles.inputGradient}>
                {renderInputField(
                  formData.number_plate_fixed_no,
                  text => handleInputChange('number_plate_fixed_no', text),
                  'Enter remark for number plate fixed',
                )}
              </LinearGradient>
            </View>
          )}

          <Text style={styles.radioLabel}>Tractor Delivered:</Text>
          {renderYesNo('tractor_delivered')}
        </View>

        {/* Delivery Customer Details (shown when tractor delivered is YES) */}
        {radioValues.tractor_delivered === '1' && (
          <View style={styles.deliverySection}>
            <Text style={styles.sectionHeading}>Delivery Customer Details</Text>

            <View style={styles.singleRow}>
              <Text style={styles.fieldLabel}>Customer Name</Text>
              <View style={styles.fullWidthContainer}>
                <LinearGradient
                  colors={['#7E5EA9', '#20AEBC']}
                  style={styles.inputGradient}>
                  {renderInputField(
                    formData.delivery_customer_name,
                    text => handleInputChange('delivery_customer_name', text),
                    'Enter customer name',
                  )}
                </LinearGradient>
              </View>
            </View>

            <View style={styles.singleRow}>
              <Text style={styles.fieldLabel}>Father's Name</Text>
              <View style={styles.fullWidthContainer}>
                <LinearGradient
                  colors={['#7E5EA9', '#20AEBC']}
                  style={styles.inputGradient}>
                  {renderInputField(
                    formData.delivery_customer_father_name,
                    text =>
                      handleInputChange('delivery_customer_father_name', text),
                    "Enter father's name",
                  )}
                </LinearGradient>
              </View>
            </View>

            <View style={styles.singleRow}>
              <Text style={styles.fieldLabel}>Customer Address</Text>
              <View style={styles.fullWidthContainer}>
                <LinearGradient
                  colors={['#7E5EA9', '#20AEBC']}
                  style={styles.inputGradient}>
                  {renderInputField(
                    formData.delivery_customer_address,
                    text =>
                      handleInputChange('delivery_customer_address', text),
                    'Enter customer address',
                  )}
                </LinearGradient>
              </View>
            </View>

            <View style={styles.singleRow}>
              <Text style={styles.fieldLabel}>Customer Contact</Text>
              <View style={styles.fullWidthContainer}>
                <LinearGradient
                  colors={['#7E5EA9', '#20AEBC']}
                  style={styles.inputGradient}>
                  {renderInputField(
                    formData.delivery_customer_contact,
                    text =>
                      handleInputChange('delivery_customer_contact', text),
                    'Enter customer contact',
                    'phone-pad',
                  )}
                </LinearGradient>
              </View>
            </View>

            <View style={styles.singleRow}>
              <Text style={styles.fieldLabel}>Hypothecation</Text>
              <LinearGradient
                colors={['#7E5EA9', '#20AEBC']}
                style={styles.inputGradient}>
                {renderDropdownField(
                  formData.hypothecation,
                  () => setShowHypothecationDropdown(true),
                  'Select hypothecation',
                )}
              </LinearGradient>
            </View>

            {formData.hypothecation === 'Other' && (
              <View style={styles.singleRow}>
                <Text style={styles.fieldLabel}>Other Hypothecation</Text>
                <LinearGradient
                  colors={['#7E5EA9', '#20AEBC']}
                  style={styles.inputGradient}>
                  {renderInputField(
                    formData.hypothecation_other,
                    text => handleInputChange('hypothecation_other', text),
                    'Enter other hypothecation',
                  )}
                </LinearGradient>
              </View>
            )}
          </View>
        )}

        {/* Terms and Conditions Section */}
        {radioValues.tractor_delivered === '1' && (
          <View style={styles.termsSection}>
            <Text style={styles.termsTitle}>Terms and Conditions</Text>

            <View style={styles.termsList}>
              <Text style={styles.termItem}>
                1. Tractor Will Be Inspected Only After Full Payment
                Confirmation From The Accounts Department.
              </Text>
              <Text style={styles.termItem}>
                2. PDI Will Be Carried Out Strictly As Per John Deere India Pvt.
                Ltd. Guidelines.
              </Text>
              <Text style={styles.termItem}>
                3. Any Damages Or Discrepancies Found Before Delivery Will Be
                Rectified Prior To Handover.
              </Text>
              <Text style={styles.termItem}>
                4. No Mechanical Or Electrical Modifications Are Allowed During
                Or After Pdi.
              </Text>
              <Text style={styles.termItem}>
                5. Customer Must Be Present During Final Inspection And Sign The
                Pdi Report.
              </Text>
              <Text style={styles.termItem}>
                6. Tractor Delivery Will Be Done Only After Successful
                Completion Of All Inspection Points.
              </Text>
              <Text style={styles.termItem}>
                7. Makroo Motor Corporation Will Not Be Responsible For Any
                Issues Arising After Customer Approval And Delivery.
              </Text>
              <Text style={styles.termItem}>
                8. All Fluids, Oil Levels, And Battery Conditions Will Be
                Checked And Recorded Before Handover.
              </Text>
              <Text style={styles.termItem}>
                9. Tractor Registration And Number Plate Installation Will Be
                Handled Separately As Per Rto Process.
              </Text>
            </View>

            <Text style={styles.declarationTitle}>Customer Declaration</Text>
            <Text style={styles.declarationText}>
              I Have Personally Verified The Tractor After Completion Of The
              Pre-delivery Inspection (Pdi) At Makroo Motor Corporation. All
              Functions, Fittings, And Accessories Have Been Checked In My
              Presence. I Am Satisfied With The Tractor's Condition And Accept
              Delivery In Proper Working Order.
            </Text>

            <View style={styles.checkboxContainer}>
              <TouchableOpacity
                style={[
                  styles.checkbox,
                  isTermsAccepted && styles.checkboxChecked,
                ]}
                onPress={() =>
                  isEditMode && setIsTermsAccepted(!isTermsAccepted)
                }
                disabled={!isEditMode || loading}>
                {isTermsAccepted && (
                  <Icon name="check" size={16} color="#fff" />
                )}
              </TouchableOpacity>
              <Text style={styles.checkboxLabel}>
                Accept All Terms and Conditions
              </Text>
            </View>
          </View>
        )}

        {/* Signatures Section */}
        <View style={{marginTop: 20}}>
          <Text style={styles.sectionTitle}>Signatures</Text>

          {customerSignature ? (
            <View style={{marginVertical: 10}}>
              <Text style={{marginBottom: 6, fontWeight: 'bold'}}>
                Customer Signature
              </Text>
              <Image
                source={{uri: customerSignature}}
                style={{
                  height: 80,
                  width: 220,
                  resizeMode: 'contain',
                  borderWidth: 1,
                  borderColor: '#ccc',
                }}
              />
              {isEditMode && (
                <TouchableOpacity
                  style={styles.changeSignatureButton}
                  onPress={() =>
                    showImageSourceOptions(
                      setCustomerSignature,
                      'Update Customer Signature',
                    )
                  }>
                  <Text style={styles.changeSignatureText}>
                    Change Customer Signature
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            isEditMode && (
              <View style={{marginVertical: 10}}>
                <Text style={{marginBottom: 6, fontWeight: 'bold'}}>
                  Customer Signature
                </Text>
                <TouchableOpacity
                  style={styles.addSignatureButton}
                  onPress={() =>
                    showImageSourceOptions(
                      setCustomerSignature,
                      'Add Customer Signature',
                    )
                  }>
                  <Text style={styles.addSignatureText}>
                    Add Customer Signature
                  </Text>
                </TouchableOpacity>
              </View>
            )
          )}

          {managerSignature ? (
            <View style={{marginVertical: 10}}>
              <Text style={{marginBottom: 6, fontWeight: 'bold'}}>
                Manager Signature
              </Text>
              <Image
                source={{uri: managerSignature}}
                style={{
                  height: 80,
                  width: 220,
                  resizeMode: 'contain',
                  borderWidth: 1,
                  borderColor: '#ccc',
                }}
              />
              {isEditMode && (
                <TouchableOpacity
                  style={styles.changeSignatureButton}
                  onPress={() =>
                    showImageSourceOptions(
                      setManagerSignature,
                      'Update Manager Signature',
                    )
                  }>
                  <Text style={styles.changeSignatureText}>
                    Change Manager Signature
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            isEditMode && (
              <View style={{marginVertical: 10}}>
                <Text style={{marginBottom: 6, fontWeight: 'bold'}}>
                  Manager Signature
                </Text>
                <TouchableOpacity
                  style={styles.addSignatureButton}
                  onPress={() =>
                    showImageSourceOptions(
                      setManagerSignature,
                      'Add Manager Signature',
                    )
                  }>
                  <Text style={styles.addSignatureText}>
                    Add Manager Signature
                  </Text>
                </TouchableOpacity>
              </View>
            )
          )}
        </View>

        {/* Modals */}
        <Modal
          visible={showModelDropdown}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowModelDropdown(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Tractor Model</Text>
                {loadingModels && (
                  <ActivityIndicator
                    size="small"
                    color="#7E5EA9"
                    style={{marginLeft: 10}}
                  />
                )}
                <TouchableOpacity
                  onPress={() => setShowModelDropdown(false)}
                  style={styles.closeButton}>
                  <Icon name="close" size={24} color="#000" />
                </TouchableOpacity>
              </View>
              <FlatList
                data={tractorModels}
                renderItem={renderModelItem}
                keyExtractor={(item, index) => index.toString()}
                style={styles.modelList}
                ListEmptyComponent={
                  loadingModels ? (
                    <View style={styles.loadingContainer}>
                      <ActivityIndicator size="large" color="#7E5EA9" />
                      <Text style={styles.loadingText}>Loading models...</Text>
                    </View>
                  ) : (
                    <View style={styles.emptyContainer}>
                      <Text style={styles.emptyText}>No models available</Text>
                    </View>
                  )
                }
              />
            </View>
          </View>
        </Modal>

        <Modal
          visible={showTireDropdown}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowTireDropdown(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Tire Make</Text>
                <TouchableOpacity
                  onPress={() => setShowTireDropdown(false)}
                  style={styles.closeButton}>
                  <Icon name="close" size={24} color="#000" />
                </TouchableOpacity>
              </View>
              <FlatList
                data={tireMakes}
                renderItem={renderTireItem}
                keyExtractor={(item, index) => index.toString()}
                style={styles.modelList}
              />
            </View>
          </View>
        </Modal>

        <Modal
          visible={showBatteryDropdown}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowBatteryDropdown(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Battery Make</Text>
                <TouchableOpacity
                  onPress={() => setShowBatteryDropdown(false)}
                  style={styles.closeButton}>
                  <Icon name="close" size={24} color="#000" />
                </TouchableOpacity>
              </View>
              <FlatList
                data={batteryMakes}
                renderItem={renderBatteryItem}
                keyExtractor={(item, index) => index.toString()}
                style={styles.modelList}
              />
            </View>
          </View>
        </Modal>

        <Modal
          visible={showHypothecationDropdown}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowHypothecationDropdown(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Hypothecation</Text>
                <TouchableOpacity
                  onPress={() => setShowHypothecationDropdown(false)}
                  style={styles.closeButton}>
                  <Icon name="close" size={24} color="#000" />
                </TouchableOpacity>
              </View>
              <FlatList
                data={hypothecationOptions}
                renderItem={renderHypothecationItem}
                keyExtractor={(item, index) => index.toString()}
                style={styles.modelList}
              />
            </View>
          </View>
        </Modal>

        {/* QR Scanner Modal */}
        {renderQRScanner()}

        {/* Buttons - FIXED BASED ON STATUS */}
        <View style={styles.buttonContainer}>
          {/* Edit Button - Only show when status is 'edited' */}
          {status === 'edited' && !isEditMode && (
            <TouchableOpacity
              style={styles.editButton}
              onPress={handleEditPress}>
              <Text style={styles.editButtonText}>Edit Form</Text>
            </TouchableOpacity>
          )}

          {isEditMode && (
            <>
              <TouchableOpacity
                style={[
                  styles.submitButton,
                  (loading ||
                    (radioValues.tractor_delivered === '1' &&
                      !isTermsAccepted)) &&
                    styles.disabledButton,
                ]}
                onPress={handleUpdate}
                disabled={
                  loading ||
                  (radioValues.tractor_delivered === '1' && !isTermsAccepted)
                }>
                {loading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.submitButtonText}>Update Form</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.cancelButton, loading && styles.disabledButton]}
                onPress={handleCancelEdit}
                disabled={loading}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </>
          )}

          {/* Download PDF Button - Only show when status is 'approved' */}
          {status === 'approved' && (
            <TouchableOpacity
              style={[styles.pdfButton, loading && styles.disabledButton]}
              onPress={handleDownloadPDF}
              disabled={loading}>
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.pdfButtonText}>Download PDF</Text>
              )}
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.homeButton, loading && styles.disabledButton]}
            onPress={() => navigation.goBack()}
            disabled={loading}>
            <Text style={styles.homeButtonText}>Back to List</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  backButton: {
    padding: 5,
    marginRight: 10,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  companyName: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
    textAlign: 'center',
  },
  formHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
    paddingHorizontal: 5,
  },
  formNo: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  Date: {
    fontSize: 12,
    color: '#00000099',
  },
  editModeContainer: {
    backgroundColor: '#f0e6ff',
    padding: 8,
    borderRadius: 5,
    marginVertical: 5,
    alignItems: 'center',
  },
  editModeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#7E5EA9',
  },
  photoSection: {
    alignItems: 'center',
    marginTop: 20,
  },
  photoContainer: {
    alignItems: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  signatureImage: {
    height: 80,
    width: 220,
    resizeMode: 'contain',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  changePhotoButton: {
    backgroundColor: '#7E5EA9',
    padding: 8,
    borderRadius: 6,
    marginTop: 8,
  },
  changePhotoText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  addPhotoButton: {
    backgroundColor: '#20AEBC',
    padding: 10,
    borderRadius: 6,
    marginTop: 8,
  },
  addPhotoText: {
    color: 'white',
    fontWeight: 'bold',
  },
  customerHeader: {
    alignItems: 'center',
    marginVertical: 10,
    marginBottom: 10,
  },
  customerName: {
    fontSize: 20,
    color: '#000',
    fontWeight: 'bold',
  },
  customerId: {
    fontSize: 13,
    color: '#56616D',
    fontWeight: 'bold',
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 5,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusApproved: {
    backgroundColor: '#4CAF50',
    color: 'white',
  },
  statusPending: {
    backgroundColor: '#2196F3',
    color: 'white',
  },
  statusRejected: {
    backgroundColor: '#F44336',
    color: 'white',
  },
  statusEdited: {
    backgroundColor: '#FFA000',
    color: 'white',
  },
  statusDefault: {
    backgroundColor: '#9E9E9E',
    color: 'white',
  },
  formContainer: {
    marginBottom: 15,
  },
  sectionHeading: {
    marginVertical: 10,
    paddingLeft: 5,
  },
  sectionHeadingText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  singleRow: {
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  fullWidthContainer: {
    width: '100%',
    marginBottom: 10,
  },
  halfWidthContainer: {
    width: '48%',
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 5,
    color: '#000',
  },
  inputGradient: {
    borderRadius: 10,
    padding: 1,
  },
  input: {
    borderRadius: 10,
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 15,
    fontSize: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 40,
  },
  readOnlyInput: {
    color: '#666',
    backgroundColor: '#f5f5f5',
  },
  selectedModelText: {
    fontSize: 14,
    color: '#000',
  },
  placeholderText: {
    fontSize: 14,
    color: '#666',
  },
  dropdownIcon: {
    marginLeft: 8,
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputWithIconField: {
    flex: 1,
  },
  iconButton: {
    position: 'absolute',
    right: 12,
    padding: 4,
  },
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
  },
  closeButton: {
    padding: 4,
  },
  modelList: {
    maxHeight: 300,
  },
  modelItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modelItemText: {
    fontSize: 14,
    color: '#333',
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: '#666',
    fontStyle: 'italic',
  },
  scannerContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  scannerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    paddingTop: 50,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  scannerCloseButton: {
    padding: 8,
    marginRight: 15,
  },
  scannerTitle: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  camera: {
    flex: 1,
  },
  scannerFooter: {
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    alignItems: 'center',
  },
  scannerInstructions: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  radioSection: {
    marginBottom: 15,
  },
  radioLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 8,
    color: '#000',
  },
  radioOptionsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  radioOptionWrapper: {
    flex: 1,
    maxWidth: '90%',
    marginHorizontal: 8,
  },
  radioOptionGradient: {
    borderRadius: 6,
    padding: 1,
  },
  radioOptionInner: {
    borderRadius: 5,
    paddingVertical: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  radioOptionInnerSelected: {
    backgroundColor: '#7E5EA9',
  },
  radioOptionSelected: {},
  radioOptionText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#000',
  },
  radioOptionTextSelected: {
    color: '#fff',
  },
  deliverySection: {
    marginBottom: 15,
  },
  termsSection: {
    marginBottom: 15,
    padding: 10,
  },
  termsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  termsList: {
    marginBottom: 15,
  },
  termItem: {
    fontSize: 12,
    color: '#333',
    marginBottom: 8,
    lineHeight: 16,
  },
  declarationTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 10,
    marginBottom: 8,
  },
  declarationText: {
    fontSize: 12,
    color: '#333',
    lineHeight: 16,
    marginBottom: 15,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#666',
    borderRadius: 4,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  checkboxChecked: {
    backgroundColor: '#28a745',
    borderColor: '#28a745',
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#000',
    fontWeight: '500',
  },
  imageContainer: {
    marginBottom: 20,
  },
  imageLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 5,
    color: '#000',
  },
  photoSignatureBox: {
    // Used for customer photo
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
  },
  changeSignatureButton: {
    backgroundColor: '#7E5EA9',
    padding: 10,
    borderRadius: 6,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  changeSignatureText: {
    color: 'white',
    fontWeight: 'bold',
  },
  addSignatureButton: {
    backgroundColor: '#20AEBC',
    padding: 15,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ccc',
    borderStyle: 'dashed',
  },
  addSignatureText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 30,
  },
  editButton: {
    backgroundColor: '#FFA000',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#7E5EA9',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#6c757d',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  pdfButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  pdfButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  homeButton: {
    backgroundColor: '#20AEBC',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  homeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.6,
  },
});

export default Pdiinternalpage;
