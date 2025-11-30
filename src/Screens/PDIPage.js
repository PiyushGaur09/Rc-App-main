

// import React, {useState, useEffect} from 'react';
// import {
//   View,
//   Text,
//   ScrollView,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   Alert,
//   Modal,
//   FlatList,
//   Image,
//   ActionSheetIOS,
//   Platform,
//   PermissionsAndroid,
//   ActivityIndicator,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import {useSafeAreaInsets} from 'react-native-safe-area-context';
// import LinearGradient from 'react-native-linear-gradient';
// import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
// import DateTimePicker from '@react-native-community/datetimepicker';
// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { Camera } from 'react-native-camera-kit';

// const PDIpage = ({navigation, route}) => {
//   const insets = useSafeAreaInsets();

//   const [userId, setUserId] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [existingFormId, setExistingFormId] = useState(null);
  
//   const [showModelDropdown, setShowModelDropdown] = useState(false);
//   const [showTireDropdown, setShowTireDropdown] = useState(false);
//   const [showBatteryDropdown, setShowBatteryDropdown] = useState(false);
//   const [showDatePicker, setShowDatePicker] = useState(false);
//   const [showBatteryDatePicker, setShowBatteryDatePicker] = useState(false);
//   const [showHypothecationDropdown, setShowHypothecationDropdown] = useState(false);

//   // QR Scanner States
//   const [showChassisScanner, setShowChassisScanner] = useState(false);
//   const [showEngineScanner, setShowEngineScanner] = useState(false);
//   const [showBatteryScanner, setShowBatteryScanner] = useState(false);
//   const [showStarterScanner, setShowStarterScanner] = useState(false);
//   const [showFipScanner, setShowFipScanner] = useState(false);
//   const [showAlternatorScanner, setShowAlternatorScanner] = useState(false);
//   const [hasCameraPermission, setHasCameraPermission] = useState(false);

//   // Terms and Conditions state
//   const [isTermsAccepted, setIsTermsAccepted] = useState(false);

//   const [formData, setFormData] = useState({
//     inspectorName: '',
//     tireMake: '',
//     otherTireMake: '',
//     batteryMake: '',
//     otherBatteryMake: '',
//     date: null, // select_date
//     batteryDate: null, // battery_date
//     chassisNo: '',
//     tractorModel: '',
//     engineNo: '',
//     frontRight: '',
//     rearRight: '',
//     frontLeft: '',
//     rearLeft: '',
//     starterNo: '',
//     alternatorNo: '',
//     batteryNo: '',
//     fipNo: '',
//     dealerName: '',
//     customerName: '',
//     customerFatherName: '', // NEW: Father's Name under Customer Details (point 1)
//     customerAddress: '',
//     customerContact: '',
//     pdiDoneBy: '',
//     remarks: '',

//     // Delivery-specific customer details (appear when Tractor Delivered = Yes)
//     deliveryCustomerName: '',
//     deliveryCustomerFatherName: '',
//     deliveryCustomerAddress: '',
//     deliveryCustomerContact: '',
//     hypothecation: '', // selected option
//     hypothecationOther: '',

//     // Remarks for "No" selections
//     lightsOkRemark: '',
//     nutsOkRemark: '',
//     hydraulicOilRemark: '',
//     nutsSealedRemark: '',
//     engineOilLevelRemark: '',
//     coolantLevelRemark: '',
//     brakeFluidLevelRemark: '',
//     greasingDoneRemark: '',
//     paintScratchesRemark: '',
//     toolkitAvailableRemark: '',
//     ownerManualGivenRemark: '',
//     reflectorStickerAppliedRemark: '',
//     numberPlateFixedRemark: '',
//   });

//   // Image states
//   const [customerPhoto, setCustomerPhoto] = useState(null);
//   const [customerSignature, setCustomerSignature] = useState(null);
//   const [managerSignature, setManagerSignature] = useState(null);

//   const [radioValues, setRadioValues] = useState({
//     lightsOk: '1',
//     nutsOk: '1',
//     delivered: '1',
//     hydraulicOil: '1',
//     nutsSealed: '1',
//     engineOilLevel: '1',
//     coolantLevel: '1',
//     brakeFluidLevel: '1',
//     greasingDone: '1',
//     paintScratches: '1',
//     toolkitAvailable: '1',
//     ownerManualGiven: '1',
//     reflectorStickerApplied: '1',
//     numberPlateFixed: '1',
//   });

//   const tractorModels = [
//     '3028EN',
//     '3036EN',
//     '3036E',
//     '5105',
//     '5105 4WD',
//     '5050D Gear Pro',
//     '5210 Gear Pro',
//     '5050D 4WD Gear Pro',
//     '5210 4WD Gear Pro',
//     '5310 CRDI',
//     '5310 4WD CRDI',
//     '5405 CRDI',
//     '5405 4WD CRDI',
//     '5075 2WD',
//     '5075 4WD',
//   ];

//   const tireMakes = [
//     'Michelin',
//     'Bridgestone',
//     'Goodyear',
//     'Continental',
//     'Pirelli',
//     'Yokohama',
//     'MRF',
//     'Apollo',
//     'CEAT',
//     'JK Tyre',
//     'Other', // NEW: Other option for tyre make (point 2)
//   ];

//   const batteryMakes = [
//     'Exide',
//     'Amaron',
//     'Lucas',
//     'SF Sonic',
//     'Tata Green',
//     'Exide Industries',
//     'Luminous',
//     'Okaya',
//     'Su-Kam',
//     'Base',
//     'Other', // NEW: Other option for battery make (point 3)
//   ];

//   const hypothecationOptions = [
//     'John Deere Financial India Private Limited',
//     'The Jammu and Kashmir Bank Limited',
//     'Nil',
//     'Other',
//   ];

//   // Camera Permission Function
//   const requestCameraPermission = async () => {
//     if (Platform.OS === 'android') {
//       try {
//         const granted = await PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.CAMERA,
//           {
//             title: "Camera Permission",
//             message: "This app needs access to your camera to scan QR codes.",
//             buttonNeutral: "Ask Me Later",
//             buttonNegative: "Cancel",
//             buttonPositive: "OK"
//           }
//         );
//         const hasPermission = granted === PermissionsAndroid.RESULTS.GRANTED;
//         setHasCameraPermission(hasPermission);
//         return hasPermission;
//       } catch (err) {
//         console.warn(err);
//         setHasCameraPermission(false);
//         return false;
//       }
//     }
//     // iOS handles permissions differently - usually through Info.plist
//     setHasCameraPermission(true);
//     return true;
//   };

//   // QR Scanner Handlers
//   const handleChassisScanPress = async () => {
//     const hasPermission = await requestCameraPermission();
//     if (hasPermission) {
//       setShowChassisScanner(true);
//     } else {
//       Alert.alert('Permission Denied', 'Camera permission is required to scan QR codes.');
//     }
//   };

//   const handleEngineScanPress = async () => {
//     const hasPermission = await requestCameraPermission();
//     if (hasPermission) {
//       setShowEngineScanner(true);
//     } else {
//       Alert.alert('Permission Denied', 'Camera permission is required to scan QR codes.');
//     }
//   };

//   const handleBatteryScanPress = async () => {
//     const hasPermission = await requestCameraPermission();
//     if (hasPermission) {
//       setShowBatteryScanner(true);
//     } else {
//       Alert.alert('Permission Denied', 'Camera permission is required to scan QR codes.');
//     }
//   };

//   const handleStarterScanPress = async () => {
//     const hasPermission = await requestCameraPermission();
//     if (hasPermission) {
//       setShowStarterScanner(true);
//     } else {
//       Alert.alert('Permission Denied', 'Camera permission is required to scan QR codes.');
//     }
//   };

//   const handleFipScanPress = async () => {
//     const hasPermission = await requestCameraPermission();
//     if (hasPermission) {
//       setShowFipScanner(true);
//     } else {
//       Alert.alert('Permission Denied', 'Camera permission is required to scan QR codes.');
//     }
//   };

//   const handleAlternatorScanPress = async () => {
//     const hasPermission = await requestCameraPermission();
//     if (hasPermission) {
//       setShowAlternatorScanner(true);
//     } else {
//       Alert.alert('Permission Denied', 'Camera permission is required to scan QR codes.');
//     }
//   };

//   const handleQRCodeRead = (event) => {
//     const scannedValue = event.nativeEvent.codeStringValue;
//     console.log('QR Code Scanned:', scannedValue);
    
//     if (showChassisScanner) {
//       handleInputChange('chassisNo', scannedValue);
//       setShowChassisScanner(false);
//     } else if (showEngineScanner) {
//       handleInputChange('engineNo', scannedValue);
//       setShowEngineScanner(false);
//     } else if (showBatteryScanner) {
//       handleInputChange('batteryNo', scannedValue);
//       setShowBatteryScanner(false);
//     } else if (showStarterScanner) {
//       handleInputChange('starterNo', scannedValue);
//       setShowStarterScanner(false);
//     } else if (showFipScanner) {
//       handleInputChange('fipNo', scannedValue);
//       setShowFipScanner(false);
//     } else if (showAlternatorScanner) {
//       handleInputChange('alternatorNo', scannedValue);
//       setShowAlternatorScanner(false);
//     }
//   };

//   const closeScanner = () => {
//     setShowChassisScanner(false);
//     setShowEngineScanner(false);
//     setShowBatteryScanner(false);
//     setShowStarterScanner(false);
//     setShowFipScanner(false);
//     setShowAlternatorScanner(false);
//   };

//   // Get user ID from AsyncStorage on component mount
//   useEffect(() => {
//     const getUserData = async () => {
//       try {
//         const storedUserId = await AsyncStorage.getItem('userId');
//         if (storedUserId) {
//           setUserId(storedUserId);
//           console.log('User ID loaded:', storedUserId);
//         }
        
//         // Check if we're in edit mode (receiving existing form data)
//         if (route.params?.formData) {
//           const editData = route.params.formData;
//           setIsEditMode(true);
//           setExistingFormId(editData.id);
          
//           // Pre-populate form data
//           setFormData({
//             inspectorName: editData.inspector_name || '',
//             tireMake: editData.tire_make || '',
//             otherTireMake: editData.tire_make_other || '',
//             batteryMake: editData.battery_make || '',
//             otherBatteryMake: editData.battery_make_other || '',
//             date: editData.select_date ? new Date(editData.select_date) : null,
//             batteryDate: editData.battery_date ? new Date(editData.battery_date) : null,
//             chassisNo: editData.chassis_no || '',
//             tractorModel: editData.tractor_model || '',
//             engineNo: editData.engine_no || '',
//             frontRight: editData.front_right_serial_no || '',
//             rearRight: editData.rear_right_serial_no || '',
//             frontLeft: editData.front_left_serial_no || '',
//             rearLeft: editData.rear_left_serial_no || '',
//             starterNo: editData.tractor_starter_serial_no || '',
//             alternatorNo: editData.tractor_alternator_no || '',
//             batteryNo: editData.battery_serial_no || '',
//             fipNo: editData.fip_no || '',
//             dealerName: editData.dealer_name || '',
//             customerName: editData.customer_name || '',
//             customerFatherName: editData.customer_father_name || '',
//             customerAddress: editData.customer_address || '',
//             customerContact: editData.customer_contact || '',
//             pdiDoneBy: editData.pdi_done_by || '',
//             remarks: editData.remarks || '',
//             deliveryCustomerName: editData.delivery_customer_name || '',
//             deliveryCustomerFatherName: editData.delivery_customer_father_name || '',
//             deliveryCustomerAddress: editData.delivery_customer_address || '',
//             deliveryCustomerContact: editData.delivery_customer_contact || '',
//             hypothecation: editData.hypothecation || '',
//             hypothecationOther: editData.hypothecation_other || '',
//             // Remarks for "No" selections
//             lightsOkRemark: editData.lights_ok_remark || '',
//             nutsOkRemark: editData.nuts_ok_remark || '',
//             hydraulicOilRemark: editData.hydraulic_oil_remark || '',
//             nutsSealedRemark: editData.all_nuts_sealed_remark || '',
//             engineOilLevelRemark: editData.engine_oil_level_remark || '',
//             coolantLevelRemark: editData.coolant_level_remark || '',
//             brakeFluidLevelRemark: editData.brake_fluid_level_remark || '',
//             greasingDoneRemark: editData.greasing_done_remark || '',
//             paintScratchesRemark: editData.paint_scratches_remark || '',
//             toolkitAvailableRemark: editData.toolkit_available_remark || '',
//             ownerManualGivenRemark: editData.owner_manual_given_remark || '',
//             reflectorStickerAppliedRemark: editData.reflector_sticker_applied_remark || '',
//             numberPlateFixedRemark: editData.number_plate_fixed_remark || '',
//           });

//           // Set radio button states
//           setRadioValues({
//             lightsOk: editData.lights_ok?.toString() || '1',
//             nutsOk: editData.nuts_ok?.toString() || '1',
//             delivered: editData.tractor_delivered?.toString() || '1',
//             hydraulicOil: editData.hydraulic_oil?.toString() || '1',
//             nutsSealed: editData.all_nuts_sealed?.toString() || '1',
//             engineOilLevel: editData.engine_oil_level?.toString() || '1',
//             coolantLevel: editData.coolant_level?.toString() || '1',
//             brakeFluidLevel: editData.brake_fluid_level?.toString() || '1',
//             greasingDone: editData.greasing_done?.toString() || '1',
//             paintScratches: editData.paint_scratches?.toString() || '0',
//             toolkitAvailable: editData.toolkit_available?.toString() || '1',
//             ownerManualGiven: editData.owner_manual_given?.toString() || '1',
//             reflectorStickerApplied: editData.reflector_sticker_applied?.toString() || '1',
//             numberPlateFixed: editData.number_plate_fixed?.toString() || '0',
//           });

//           // Note: For images, you might need to handle URLs differently (show remote images)
//         }
//       } catch (error) {
//         console.log('Error loading user data:', error);
//       }
//     };

//     getUserData();
//   }, [route.params]);

//   // Generate form number
//   const generateFormNo = () => {
//     const timestamp = new Date().getTime();
//     return `PDI${timestamp}`;
//   };

//   // Camera permissions for image capture
//   const requestCameraPermissionForImage = async () => {
//     if (Platform.OS === 'android') {
//       try {
//         const granted = await PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.CAMERA,
//           {
//             title: "Camera Permission",
//             message: "This app needs access to your camera to take photos.",
//             buttonNeutral: "Ask Me Later",
//             buttonNegative: "Cancel",
//             buttonPositive: "OK"
//           }
//         );
//         return granted === PermissionsAndroid.RESULTS.GRANTED;
//       } catch (err) {
//         console.warn(err);
//         return false;
//       }
//     }
//     return true;
//   };

//   const showImagePickerOptions = (setImageFunction) => {
//     if (Platform.OS === 'ios') {
//       ActionSheetIOS.showActionSheetWithOptions(
//         {
//           options: ['Cancel', 'Take Photo', 'Choose from Library'],
//           cancelButtonIndex: 0,
//         },
//         async (buttonIndex) => {
//           if (buttonIndex === 1) {
//             const hasPermission = await requestCameraPermissionForImage();
//             if (hasPermission) handleCamera(setImageFunction);
//           } else if (buttonIndex === 2) handleImageLibrary(setImageFunction);
//         }
//       );
//     } else {
//       Alert.alert(
//         'Select Image',
//         'Choose an option',
//         [
//           { text: 'Cancel', style: 'cancel' },
//           { text: 'Take Photo', onPress: async () => {
//               const hasPermission = await requestCameraPermissionForImage();
//               if (hasPermission) handleCamera(setImageFunction);
//             }
//           },
//           { text: 'Choose from Library', onPress: () => handleImageLibrary(setImageFunction) },
//         ],
//         { cancelable: true }
//       );
//     }
//   };

//   const handleCamera = (setImageFunction) => {
//     launchCamera(
//       { 
//         mediaType: 'photo', 
//         quality: 0.8, 
//         cameraType: 'back', 
//         saveToPhotos: true,
//         includeBase64: false 
//       },
//       (response) => {
//         if (response.didCancel) return;
//         if (response.error) {
//           Alert.alert('Error', 'Failed to capture image');
//           return;
//         }
//         if (response.assets && response.assets.length > 0) {
//           setImageFunction(response.assets[0]);
//         }
//       }
//     );
//   };

//   const handleImageLibrary = (setImageFunction) => {
//     launchImageLibrary({ 
//       mediaType: 'photo', 
//       quality: 0.8,
//       includeBase64: false 
//     }, (response) => {
//       if (response.didCancel) return;
//       if (response.error) {
//         Alert.alert('Error', 'Failed to select image');
//         return;
//       }
//       if (response.assets && response.assets.length > 0) {
//         setImageFunction(response.assets[0]);
//       }
//     });
//   };

//   const handleInputChange = (field, value) => {
//     setFormData(prev => ({
//       ...prev,
//       [field]: value,
//     }));
//   };

//   const handleRadioChange = (field, value) => {
//     setRadioValues(prev => ({
//       ...prev,
//       [field]: value,
//     }));
//   };

//   const handleModelSelect = model => {
//     handleInputChange('tractorModel', model);
//     setShowModelDropdown(false);
//   };

//   const handleTireSelect = tire => {
//     handleInputChange('tireMake', tire);
//     // clear other field if not Other
//     if (tire !== 'Other') {
//       handleInputChange('otherTireMake', '');
//     }
//     setShowTireDropdown(false);
//   };

//   const handleBatterySelect = battery => {
//     handleInputChange('batteryMake', battery);
//     // clear other field if not Other
//     if (battery !== 'Other') {
//       handleInputChange('otherBatteryMake', '');
//     }
//     setShowBatteryDropdown(false);
//   };

//   const handleHypothecationSelect = option => {
//     handleInputChange('hypothecation', option);
//     if (option !== 'Other') {
//       handleInputChange('hypothecationOther', '');
//     }
//     setShowHypothecationDropdown(false);
//   };

//   const handleDateChange = (event, selectedDate) => {
//     setShowDatePicker(false);
//     if (selectedDate) {
//       handleInputChange('date', selectedDate);
//     }
//   };

//   const handleBatteryDateChange = (event, selectedDate) => {
//     setShowBatteryDatePicker(false);
//     if (selectedDate) {
//       handleInputChange('batteryDate', selectedDate);
//     }
//   };

//   const validateForm = () => {
//     const requiredFields = [
//       'inspectorName', 'tractorModel', 'chassisNo', 'engineNo',
//       'tireMake', 'frontRight', 'frontLeft', 'rearRight', 'rearLeft',
//       'batteryMake', 'batteryNo', 'starterNo', 'fipNo', 'alternatorNo',
//       'dealerName', 'customerName', 'customerAddress', 'customerContact',
//       'pdiDoneBy'
//     ];

//     for (const field of requiredFields) {
//       if (!formData[field] || formData[field].toString().trim() === '') {
//         Alert.alert('Validation Error', `Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
//         return false;
//       }
//     }

//     // Check if terms are accepted when tractor is delivered
//     if (radioValues.delivered === '1' && !isTermsAccepted) {
//       Alert.alert('Validation Error', 'Please accept the Terms and Conditions');
//       return false;
//     }

//     // Make images optional for updates, required for new forms
//     if (!isEditMode) {
//       if (!customerPhoto) {
//         Alert.alert('Validation Error', 'Please add customer photo');
//         return false;
//       }

//       if (!customerSignature) {
//         Alert.alert('Validation Error', 'Please add customer signature');
//         return false;
//       }

//       if (!managerSignature) {
//         Alert.alert('Validation Error', 'Please add manager signature');
//         return false;
//       }
//     }

//     return true;
//   };

//   const prepareFormData = () => {
//     const formDataToSend = new FormData();

//     // For updates, use PUT method and include ID
//     if (isEditMode && existingFormId) {
//       formDataToSend.append('id', existingFormId.toString());
//       console.log('UPDATE MODE - Form ID:', existingFormId);
//     } else {
//       // For new forms, generate new form number
//       formDataToSend.append('form_no', generateFormNo());
//       console.log('CREATE MODE - New Form No:', generateFormNo());
//     }

//     // Common form data for both create and update
//     formDataToSend.append('user_id', userId);
//     formDataToSend.append('form_date', new Date().toISOString().split('T')[0]);
//     formDataToSend.append('inspector_name', formData.inspectorName);
//     formDataToSend.append('select_date', formData.date ? formData.date.toISOString().split('T')[0] : '');
//     formDataToSend.append('tractor_model', formData.tractorModel);
//     formDataToSend.append('chassis_no', formData.chassisNo);
//     formDataToSend.append('engine_no', formData.engineNo);

//     // Tyre and battery (including "Other" values)
//     formDataToSend.append('tire_make', formData.tireMake);
//     formDataToSend.append('tire_make_other', formData.otherTireMake || '');
//     formDataToSend.append('front_right_serial_no', formData.frontRight);
//     formDataToSend.append('front_left_serial_no', formData.frontLeft);
//     formDataToSend.append('rear_right_serial_no', formData.rearRight);
//     formDataToSend.append('rear_left_serial_no', formData.rearLeft);
//     formDataToSend.append('battery_make', formData.batteryMake);
//     formDataToSend.append('battery_make_other', formData.otherBatteryMake || '');
//     formDataToSend.append('battery_date', formData.batteryDate ? formData.batteryDate.toISOString().split('T')[0] : '');
//     formDataToSend.append('battery_serial_no', formData.batteryNo);
//     formDataToSend.append('tractor_starter_serial_no', formData.starterNo);
//     formDataToSend.append('fip_no', formData.fipNo);
//     formDataToSend.append('tractor_alternator_no', formData.alternatorNo);
    
//     // Customer details
//     formDataToSend.append('dealer_name', formData.dealerName);
//     formDataToSend.append('customer_name', formData.customerName);
//     formDataToSend.append('customer_father_name', formData.customerFatherName || '');
//     formDataToSend.append('customer_address', formData.customerAddress);
//     formDataToSend.append('customer_contact', formData.customerContact);
//     formDataToSend.append('pdi_done_by', formData.pdiDoneBy);
//     formDataToSend.append('remarks', formData.remarks || '');

//     // Delivery-specific customer details (only meaningful if delivered === '1')
//     formDataToSend.append('delivery_customer_name', formData.deliveryCustomerName || '');
//     formDataToSend.append('delivery_customer_father_name', formData.deliveryCustomerFatherName || '');
//     formDataToSend.append('delivery_customer_address', formData.deliveryCustomerAddress || '');
//     formDataToSend.append('delivery_customer_contact', formData.deliveryCustomerContact || '');
//     formDataToSend.append('hypothecation', formData.hypothecation || '');
//     formDataToSend.append('hypothecation_other', formData.hypothecationOther || '');

//     // Radio button values (convert to 1/0 for API)
//     formDataToSend.append('lights_ok', radioValues.lightsOk);
//     formDataToSend.append('nuts_ok', radioValues.nutsOk);
//     formDataToSend.append('hydraulic_oil', radioValues.hydraulicOil);
//     formDataToSend.append('all_nuts_sealed', radioValues.nutsSealed);
//     formDataToSend.append('tractor_delivered', radioValues.delivered);
//     formDataToSend.append('engine_oil_level', radioValues.engineOilLevel);
//     formDataToSend.append('coolant_level', radioValues.coolantLevel);
//     formDataToSend.append('brake_fluid_level', radioValues.brakeFluidLevel);
//     formDataToSend.append('greasing_done', radioValues.greasingDone);
//     formDataToSend.append('paint_scratches', radioValues.paintScratches);
//     formDataToSend.append('toolkit_available', radioValues.toolkitAvailable);
//     formDataToSend.append('owner_manual_given', radioValues.ownerManualGiven);
//     formDataToSend.append('reflector_sticker_applied', radioValues.reflectorStickerApplied);
//     formDataToSend.append('number_plate_fixed', radioValues.numberPlateFixed);

//     // Remarks for "No" selections
//     formDataToSend.append('lights_ok_remark', formData.lightsOkRemark || '');
//     formDataToSend.append('nuts_ok_remark', formData.nutsOkRemark || '');
//     formDataToSend.append('hydraulic_oil_remark', formData.hydraulicOilRemark || '');
//     formDataToSend.append('all_nuts_sealed_remark', formData.nutsSealedRemark || '');
//     formDataToSend.append('engine_oil_level_remark', formData.engineOilLevelRemark || '');
//     formDataToSend.append('coolant_level_remark', formData.coolantLevelRemark || '');
//     formDataToSend.append('brake_fluid_level_remark', formData.brakeFluidLevelRemark || '');
//     formDataToSend.append('greasing_done_remark', formData.greasingDoneRemark || '');
//     formDataToSend.append('paint_scratches_remark', formData.paintScratchesRemark || '');
//     formDataToSend.append('toolkit_available_remark', formData.toolkitAvailableRemark || '');
//     formDataToSend.append('owner_manual_given_remark', formData.ownerManualGivenRemark || '');
//     formDataToSend.append('reflector_sticker_applied_remark', formData.reflectorStickerAppliedRemark || '');
//     formDataToSend.append('number_plate_fixed_remark', formData.numberPlateFixedRemark || '');

//     // Add delivery date if tractor is delivered
//     if (radioValues.delivered === '1') {
//       formDataToSend.append('delivery_date', new Date().toISOString().split('T')[0]);
//     }

//     // Add images only if they are newly selected
//     if (customerPhoto && customerPhoto.uri && !customerPhoto.uri.startsWith('http')) {
//       formDataToSend.append('customer_photo', {
//         uri: customerPhoto.uri,
//         type: customerPhoto.type || 'image/jpeg',
//         name: `customer_photo_${Date.now()}.jpg`,
//       });
//     }

//     if (customerSignature && customerSignature.uri && !customerSignature.uri.startsWith('http')) {
//       formDataToSend.append('customer_signature', {
//         uri: customerSignature.uri,
//         type: customerSignature.type || 'image/jpeg',
//         name: `customer_signature_${Date.now()}.jpg`,
//       });
//     }

//     if (managerSignature && managerSignature.uri && !managerSignature.uri.startsWith('http')) {
//       formDataToSend.append('manager_signature', {
//         uri: managerSignature.uri,
//         type: managerSignature.type || 'image/jpeg',
//         name: `manager_signature_${Date.now()}.jpg`,
//       });
//     }

//     return formDataToSend;
//   };

//   const handleSubmit = async () => {
//     if (!userId) {
//       Alert.alert('Error', 'User ID not found. Please login again.');
//       return;
//     }

//     if (!validateForm()) {
//       return;
//     }

//     setLoading(true);

//     try {
//       const formDataToSend = prepareFormData();
      
//       // Use different endpoints and methods for create vs update
//       let url, method;
      
//       if (isEditMode && existingFormId) {
//         // For update, use PUT method
//         url = `https://argosmob.uk/makroo/public/api/v1/pdi-delivery/form/update`;
//         method = 'put';
//         console.log('UPDATE REQUEST - URL:', url, 'Method:', method, 'Form ID:', existingFormId);
//       } else {
//         // For create, use POST method
//         url = 'https://argosmob.uk/makroo/public/api/v1/pdi-delivery/form/save';
//         method = 'post';
//         console.log('CREATE REQUEST - URL:', url, 'Method:', method);
//       }

//       const config = {
//         method: method,
//         url: url,
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//         data: formDataToSend,
//         timeout: 30000, // 30 seconds timeout
//       };

//       console.log('Sending form data...');
//       const response = await axios(config);
//       console.log('API Response:', response.data);

//       // Enhanced success detection with clear conditions
//       let isSuccess = false;
//       let successMessage = '';
//       let errorMessage = '';

//       if (isEditMode) {
//         // For UPDATE operations
//         successMessage = 'PDI Form updated successfully!';
//         errorMessage = 'Failed to update form. Please try again.';
        
//         if (response.data) {
//           if (response.data.status === true || response.data.success === true) {
//             isSuccess = true;
//           } else if (response.data.message && response.data.message.toLowerCase().includes('success')) {
//             isSuccess = true;
//           } else if (response.data.message && response.data.message.toLowerCase().includes('updated')) {
//             isSuccess = true;
//           }
//         }
//       } else {
//         // For NEW SUBMISSION operations
//         successMessage = 'PDI Form submitted successfully!';
//         errorMessage = 'Failed to submit form. Please try again.';
        
//         if (response.data) {
//           if (response.data.status === true || response.data.success === true) {
//             isSuccess = true;
//           } else if (response.data.message && response.data.message.toLowerCase().includes('success')) {
//             isSuccess = true;
//           } else if (response.data.message && response.data.message.toLowerCase().includes('created')) {
//             isSuccess = true;
//           } else if (response.data.message && response.data.message.toLowerCase().includes('saved')) {
//             isSuccess = true;
//           }
//         }
//       }

//       // Additional success checks based on HTTP status
//       if (response.status === 200 || response.status === 201) {
//         if (!isSuccess) {
//           // If HTTP status is success but our detection failed, still consider it success
//           isSuccess = true;
//           console.log('Success detected from HTTP status');
//         }
//       }

//       if (isSuccess) {
//         Alert.alert(
//           'Success', 
//           successMessage,
//           [
//             {
//               text: 'OK',
//               onPress: () => {
//                 // Navigate back or reset form based on mode
//                 if (isEditMode) {
//                   navigation.goBack();
//                 } else {
//                   // Reset form for new entry
//                   setFormData({
//                     inspectorName: '',
//                     tireMake: '',
//                     otherTireMake: '',
//                     batteryMake: '',
//                     otherBatteryMake: '',
//                     date: null,
//                     batteryDate: null,
//                     chassisNo: '',
//                     tractorModel: '',
//                     engineNo: '',
//                     frontRight: '',
//                     rearRight: '',
//                     frontLeft: '',
//                     rearLeft: '',
//                     starterNo: '',
//                     alternatorNo: '',
//                     batteryNo: '',
//                     fipNo: '',
//                     dealerName: '',
//                     customerName: '',
//                     customerFatherName: '',
//                     customerAddress: '',
//                     customerContact: '',
//                     pdiDoneBy: '',
//                     remarks: '',
//                     deliveryCustomerName: '',
//                     deliveryCustomerFatherName: '',
//                     deliveryCustomerAddress: '',
//                     deliveryCustomerContact: '',
//                     hypothecation: '',
//                     hypothecationOther: '',
//                     // Reset remarks for "No" selections
//                     lightsOkRemark: '',
//                     nutsOkRemark: '',
//                     hydraulicOilRemark: '',
//                     nutsSealedRemark: '',
//                     engineOilLevelRemark: '',
//                     coolantLevelRemark: '',
//                     brakeFluidLevelRemark: '',
//                     greasingDoneRemark: '',
//                     paintScratchesRemark: '',
//                     toolkitAvailableRemark: '',
//                     ownerManualGivenRemark: '',
//                     reflectorStickerAppliedRemark: '',
//                     numberPlateFixedRemark: '',
//                   });
//                   setRadioValues({
//                     lightsOk: '1',
//                     nutsOk: '1',
//                     delivered: '1',
//                     hydraulicOil: '1',
//                     nutsSealed: '1',
//                     engineOilLevel: '1',
//                     coolantLevel: '1',
//                     brakeFluidLevel: '1',
//                     greasingDone: '1',
//                     paintScratches: '0',
//                     toolkitAvailable: '1',
//                     ownerManualGiven: '1',
//                     reflectorStickerApplied: '1',
//                     numberPlateFixed: '0',
//                   });
//                   setCustomerPhoto(null);
//                   setCustomerSignature(null);
//                   setManagerSignature(null);
//                   setIsTermsAccepted(false);
//                 }
//               }
//             }
//           ]
//         );
//       } else {
//         const serverErrorMessage = response.data?.message || response.data?.error || errorMessage;
//         Alert.alert(
//           isEditMode ? 'Update Failed' : 'Submission Failed', 
//           serverErrorMessage
//         );
//       }

//     } catch (error) {
//       console.log('Submission Error:', error);
//       console.log('Error details:', error.response?.data);
      
//       let errorMessage = 'Something went wrong. Please try again.';
      
//       if (error.response) {
//         const serverError = error.response.data;
//         errorMessage = serverError.message || serverError.error || `Server error: ${error.response.status}`;
//       } else if (error.request) {
//         errorMessage = 'Network error. Please check your internet connection.';
//       }
      
//       Alert.alert(
//         isEditMode ? 'Update Failed' : 'Submission Failed', 
//         errorMessage
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleHome = () => {
//     navigation.navigate('Dashboard');
//   };

//   const handleDateIconPress = () => {
//     setShowDatePicker(true);
//   };

//   const handleBatteryDateIconPress = () => {
//     setShowBatteryDatePicker(true);
//   };

//   const renderModelItem = ({item}) => (
//     <TouchableOpacity
//       style={styles.modelItem}
//       onPress={() => handleModelSelect(item)}>
//       <Text style={styles.modelItemText}>{item}</Text>
//     </TouchableOpacity>
//   );

//   const renderTireItem = ({item}) => (
//     <TouchableOpacity
//       style={styles.modelItem}
//       onPress={() => handleTireSelect(item)}>
//       <Text style={styles.modelItemText}>{item}</Text>
//     </TouchableOpacity>
//   );

//   const renderBatteryItem = ({item}) => (
//     <TouchableOpacity
//       style={styles.modelItem}
//       onPress={() => handleBatterySelect(item)}>
//       <Text style={styles.modelItemText}>{item}</Text>
//     </TouchableOpacity>
//   );

//   const renderHypothecationItem = ({item}) => (
//     <TouchableOpacity
//       style={styles.modelItem}
//       onPress={() => handleHypothecationSelect(item)}>
//       <Text style={styles.modelItemText}>{item}</Text>
//     </TouchableOpacity>
//   );

//   // QR Scanner Component
//   const renderQRScanner = () => (
//     <Modal
//       visible={showChassisScanner || showEngineScanner || showBatteryScanner || showStarterScanner || showFipScanner || showAlternatorScanner}
//       animationType="slide"
//       transparent={false}
//       onRequestClose={closeScanner}
//     >
//       <View style={styles.scannerContainer}>
//         <View style={styles.scannerHeader}>
//           <TouchableOpacity onPress={closeScanner} style={styles.scannerCloseButton}>
//             <Icon name="close" size={24} color="#fff" />
//           </TouchableOpacity>
//           <Text style={styles.scannerTitle}>
//             {showChassisScanner ? 'Scan Chassis Number' : 
//              showEngineScanner ? 'Scan Engine Number' :
//              showBatteryScanner ? 'Scan Battery Serial Number' :
//              showStarterScanner ? 'Scan Starter Serial Number' :
//              showFipScanner ? 'Scan FIP Number' :
//              'Scan Alternator Number'}
//           </Text>
//         </View>
        
//         <Camera
//           style={styles.camera}
//           cameraOptions={{
//             flashMode: 'auto',
//             focusMode: 'on',
//             zoomMode: 'on',
//           }}
//           scanBarcode={true}
//           showFrame={true}
//           laserColor="red"
//           frameColor="white"
//           onReadCode={handleQRCodeRead}
//         />
        
//         <View style={styles.scannerFooter}>
//           <Text style={styles.scannerInstructions}>
//             Point your camera at a QR code to scan
//           </Text>
//         </View>
//       </View>
//     </Modal>
//   );

//   return (
//     <View
//       style={{flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom}}>
//       {/* Header */}
//       <LinearGradient
//         colors={['#7E5EA9', '#20AEBC']}
//         start={{x: 0, y: 0}}
//         end={{x: 1, y: 0}}
//         style={styles.header}>
//         <Text style={styles.companyName}>Makroo Motor Corporation</Text>
//         <Text style={styles.companyName}>Pre Delivery Inspection</Text>
//         <Text style={styles.companyName}>Form</Text>
//       </LinearGradient>

//       <ScrollView style={styles.container}>
//         {/* Date and Form No */}
//         <Text style={styles.Date}>{new Date().toLocaleDateString()}</Text>
//         {isEditMode && (
//           <View style={styles.editModeContainer}>
//             <Text style={styles.editModeText}>Edit Mode - Updating Form ID: {existingFormId}</Text>
//           </View>
//         )}

//         {/* Form Fields */}
//         <View style={styles.formContainer}>
//           {/* Inspector + Date */}
//           <View style={styles.row}>
//             <View style={styles.inputContainer}>
//               <LinearGradient
//                 colors={['#7E5EA9', '#20AEBC']}
//                 style={styles.inputGradient}>
//                 <TextInput
//                   style={styles.input}
//                   value={formData.inspectorName}
//                   onChangeText={text =>
//                     handleInputChange('inspectorName', text)
//                   }
//                   placeholder="Inspector Name"
//                    placeholderTextColor="#666"
//                   editable={!loading}
//                 />
//               </LinearGradient>
//             </View>
//             <View style={styles.inputContainer}>
//               <LinearGradient
//                 colors={['#7E5EA9', '#20AEBC']}
//                 style={styles.inputGradient}>
//                 <View style={styles.inputWithIcon}>
//                   <TouchableOpacity
//                     style={[styles.input, styles.inputWithIconField]}
//                     onPress={handleDateIconPress}
//                     disabled={loading}
//                   >
//                     <Text style={ formData.date ? styles.selectedModelText : styles.placeholderText }>
//                       {formData.date ? formData.date.toLocaleDateString() : 'Select Date'}
//                     </Text>
//                   </TouchableOpacity>
//                   <TouchableOpacity
//                     onPress={handleDateIconPress}
//                     style={styles.iconButton}
//                     disabled={loading}
//                   >
//                     <Icon name="calendar-today" size={20} color="#666" />
//                   </TouchableOpacity>
//                 </View>
//                 {showDatePicker && (
//                   <DateTimePicker
//                     value={formData.date || new Date()}
//                     mode="date"
//                     display={Platform.OS === 'ios' ? 'spinner' : 'default'}
//                     onChange={handleDateChange}
//                   />
//                 )}
//               </LinearGradient>
//             </View>
//           </View>

//           {/* Tractor Model + Chassis No */}
//           <View style={styles.row}>
//             <View style={styles.inputContainer}>
//               <LinearGradient
//                 colors={['#7E5EA9', '#20AEBC']}
//                 style={styles.inputGradient}>
//                 <TouchableOpacity
//                   style={styles.input}
//                   onPress={() => setShowModelDropdown(true)}
//                   disabled={loading}
//                 >
//                   <Text
//                     style={
//                       formData.tractorModel
//                         ? styles.selectedModelText
//                         : styles.placeholderText
//                     }>
//                     {formData.tractorModel || 'Select Tractor Model'}
//                   </Text>
//                   <Icon
//                     name="keyboard-arrow-down"
//                     size={25}
//                     color="#666"
//                     style={styles.dropdownIcon}
//                   />
//                 </TouchableOpacity>
//               </LinearGradient>
//             </View>
//             <View style={styles.inputContainer}>
//               <LinearGradient
//                 colors={['#7E5EA9', '#20AEBC']}
//                 style={styles.inputGradient}>
//                 <View style={styles.inputWithIcon}>
//                   <TextInput
//                     style={[styles.input, styles.inputWithIconField]}
//                     value={formData.chassisNo}
//                     onChangeText={text => handleInputChange('chassisNo', text)}
//                     placeholder="Chassis No."
//                      placeholderTextColor="#666"
//                     editable={!loading}
//                   />
//                   <TouchableOpacity
//                     onPress={handleChassisScanPress}
//                     style={styles.iconButton}
//                     disabled={loading}
//                   >
//                     <Icon name="qr-code-scanner" size={20} color="#666" />
//                   </TouchableOpacity>
//                 </View>
//               </LinearGradient>
//             </View>
//           </View>

//           {/* Engine No */}
//           <View style={styles.row}>
//             <View style={styles.inputContainer}>
//               <LinearGradient
//                 colors={['#7E5EA9', '#20AEBC']}
//                 style={styles.inputGradient}>
//                 <View style={styles.inputWithIcon}>
//                   <TextInput
//                     style={[styles.input, styles.inputWithIconField]}
//                     value={formData.engineNo}
//                     onChangeText={text => handleInputChange('engineNo', text)}
//                     placeholder="Engine No."
//                      placeholderTextColor="#666"
//                     editable={!loading}
//                   />
//                   <TouchableOpacity
//                     onPress={handleEngineScanPress}
//                     style={styles.iconButton}
//                     disabled={loading}
//                   >
//                     <Icon name="qr-code-scanner" size={20} color="#666" />
//                   </TouchableOpacity>
//                 </View>
//               </LinearGradient>
//             </View>
//             <View style={styles.inputContainer}></View>
//           </View>

          

//           {/* Customer Details Heading */}
//           <View style={styles.sectionHeading}>
//             <Text style={styles.sectionHeadingText}>Customer Details:</Text>
//           </View>

//           {/* Dealer Name + Customer Name */}
//           <View style={styles.row}>
//             <View style={styles.inputContainer}>
//               <LinearGradient
//                 colors={['#7E5EA9', '#20AEBC']}
//                 style={styles.inputGradient}>
//                 <TextInput
//                   style={styles.input}
//                   value={formData.dealerName}
//                   onChangeText={text => handleInputChange('dealerName', text)}
//                   placeholder="Dealer Name"
//                    placeholderTextColor="#666"
//                   editable={!loading}
//                 />
//               </LinearGradient>
//             </View>
//             <View style={styles.inputContainer}>
//               <LinearGradient
//                 colors={['#7E5EA9', '#20AEBC']}
//                 style={styles.inputGradient}>
//                 <TextInput
//                   style={styles.input}
//                   value={formData.customerName}
//                   onChangeText={text => handleInputChange('customerName', text)}
//                   placeholder="Customer Name"
//                    placeholderTextColor="#666"
//                   editable={!loading}
//                 />
//               </LinearGradient>
//             </View>
//           </View>

//           {/* Customer Father's Name (POINT 1) */}
//           <View style={styles.row}>
//             <View style={styles.inputContainer}>
//               <LinearGradient colors={['#7E5EA9', '#20AEBC']} style={styles.inputGradient}>
//                 <TextInput
//                   style={styles.input}
//                   value={formData.customerFatherName}
//                   onChangeText={text => handleInputChange('customerFatherName', text)}
//                   placeholder="Father's Name"
//                    placeholderTextColor="#666"
//                   editable={!loading}
//                 />
//               </LinearGradient>
//             </View>
          
//           </View>

//           {/* Customer Address */}
//           <View style={styles.row}>
//             <View style={styles.inputContainer}>
//               <LinearGradient
//                 colors={['#7E5EA9', '#20AEBC']}
//                 style={styles.inputGradient}>
//                 <TextInput
//                   style={styles.input}
//                   value={formData.customerAddress}
//                   onChangeText={text => handleInputChange('customerAddress', text)}
//                   placeholder="Customer Address"
//                    placeholderTextColor="#666"
//                   editable={!loading}
//                   multiline
//                 />
//               </LinearGradient>
//             </View>
//             <View style={styles.inputContainer}>
//               <LinearGradient
//                 colors={['#7E5EA9', '#20AEBC']}
//                 style={styles.inputGradient}>
//                 <TextInput
//                   style={styles.input}
//                   value={formData.customerContact}
//                   onChangeText={text => handleInputChange('customerContact', text)}
//                   placeholder="Customer Contact"
//                    placeholderTextColor="#666"
//                   keyboardType="phone-pad"
//                   editable={!loading}
//                 />
//               </LinearGradient>
//             </View>
//           </View>

//           {/* Tyre Details Heading */}
//           <View style={styles.sectionHeading}>
//             <Text style={styles.sectionHeadingText}>Tire Details:</Text>
//           </View>

//           {/* Select Tire Make (with 'Other' option showing input when selected) */}
//           <View style={styles.row}>
//             <View style={styles.inputContainer}>
//               <LinearGradient
//                 colors={['#7E5EA9', '#20AEBC']}
//                 style={styles.inputGradient}>
//                 <TouchableOpacity
//                   style={styles.input}
//                   onPress={() => setShowTireDropdown(true)}
//                   disabled={loading}
//                 >
//                   <Text
//                     style={
//                       formData.tireMake
//                         ? styles.selectedModelText
//                         : styles.placeholderText
//                     }>
//                     {formData.tireMake || 'Select Tyre Make'}
//                   </Text>
//                   <Icon
//                     name="keyboard-arrow-down"
//                     size={25}
//                     color="#666"
//                     style={styles.dropdownIcon}
//                   />
//                 </TouchableOpacity>
//               </LinearGradient>
//             </View>
//             <View style={styles.inputContainer}></View>
//           </View>

//           {/* If "Other" selected for tyre make, show TextInput (point 2) */}
//           {formData.tireMake === 'Other' && (
//             <View style={styles.row}>
//               <View style={styles.inputContainer}>
//                 <LinearGradient colors={['#7E5EA9', '#20AEBC']} style={styles.inputGradient}>
//                   <TextInput
//                     style={styles.input}
//                     value={formData.otherTireMake}
//                     onChangeText={text => handleInputChange('otherTireMake', text)}
//                     placeholder="Enter Other Tire Make"
//                      placeholderTextColor="#666"
//                     editable={!loading}
//                   />
//                 </LinearGradient>
//               </View>
//               <View style={styles.inputContainer}></View>
//             </View>
//           )}

//           {/* Front Right + Front Left */}
//           <View style={styles.row}>
//             <View style={styles.inputContainer}>
//               <LinearGradient
//                 colors={['#7E5EA9', '#20AEBC']}
//                 style={styles.inputGradient}>
//                 <TextInput
//                   style={styles.input}
//                   value={formData.frontRight}
//                   onChangeText={text => handleInputChange('frontRight', text)}
//                   placeholder="Front Right Serial No."
//                    placeholderTextColor="#666"
//                   editable={!loading}
//                 />
//               </LinearGradient>
//             </View>
//             <View style={styles.inputContainer}>
//               <LinearGradient
//                 colors={['#7E5EA9', '#20AEBC']}
//                 style={styles.inputGradient}>
//                 <TextInput
//                   style={styles.input}
//                   value={formData.frontLeft}
//                   onChangeText={text => handleInputChange('frontLeft', text)}
//                   placeholder="Front Left Serial No."
//                    placeholderTextColor="#666"
//                   editable={!loading}
//                 />
//               </LinearGradient>
//             </View>
//           </View>

//           {/* Rear Right + Rear Left */}
//           <View style={styles.row}>
//             <View style={styles.inputContainer}>
//               <LinearGradient
//                 colors={['#7E5EA9', '#20AEBC']}
//                 style={styles.inputGradient}>
//                 <TextInput
//                   style={styles.input}
//                   value={formData.rearRight}
//                   onChangeText={text => handleInputChange('rearRight', text)}
//                   placeholder="Rear Right Serial No."
//                    placeholderTextColor="#666"
//                   editable={!loading}
//                 />
//               </LinearGradient>
//             </View>
//             <View style={styles.inputContainer}>
//               <LinearGradient
//                 colors={['#7E5EA9', '#20AEBC']}
//                 style={styles.inputGradient}>
//                 <TextInput
//                   style={styles.input}
//                   value={formData.rearLeft}
//                   onChangeText={text => handleInputChange('rearLeft', text)}
//                   placeholder="Rear Left Serial No."
//                    placeholderTextColor="#666"

//                   editable={!loading}
//                 />
//               </LinearGradient>
//             </View>
//           </View>

//           {/* Battery Details Heading */}
//           <View style={styles.sectionHeading}>
//             <Text style={styles.sectionHeadingText}>Battery Details:</Text>
//           </View>

//           {/* Select Battery Make (with 'Other' option showing input when selected) */}
//           <View style={styles.row}>
//             <View style={styles.inputContainer}>
//               <LinearGradient
//                 colors={['#7E5EA9', '#20AEBC']}
//                 style={styles.inputGradient}>
//                 <TouchableOpacity
//                   style={styles.input}
//                   onPress={() => setShowBatteryDropdown(true)}
//                   disabled={loading}
//                 >
//                   <Text
//                     style={
//                       formData.batteryMake
//                         ? styles.selectedModelText
//                         : styles.placeholderText
//                     }>
//                     {formData.batteryMake || 'Select Battery Make'}
//                   </Text>
//                   <Icon
//                     name="keyboard-arrow-down"
//                     size={25}
//                     color="#666"
//                     style={styles.dropdownIcon}
//                   />
//                 </TouchableOpacity>
//               </LinearGradient>
//             </View>
//             <View style={styles.inputContainer}></View>
//           </View>

//           {/* If "Other" selected for battery make, show TextInput (point 3) */}
//           {formData.batteryMake === 'Other' && (
//             <View style={styles.row}>
//               <View style={styles.inputContainer}>
//                 <LinearGradient colors={['#7E5EA9', '#20AEBC']} style={styles.inputGradient}>
//                   <TextInput
//                     style={styles.input}
//                     value={formData.otherBatteryMake}
//                     onChangeText={text => handleInputChange('otherBatteryMake', text)}
//                     placeholder="Enter Other Battery Make"
//                    placeholderTextColor="#666"

//                     editable={!loading}
//                   />
//                 </LinearGradient>
//               </View>
//               <View style={styles.inputContainer}></View>
//             </View>
//           )}

//           {/* Battery Date (next line after Select Battery Make) */}
//           <View style={styles.row}>
//             <View style={styles.inputContainer}>
//               <LinearGradient colors={['#7E5EA9', '#20AEBC']} style={styles.inputGradient}>
//                 <View style={styles.inputWithIcon}>
//                   <TouchableOpacity
//                     style={[styles.input, styles.inputWithIconField]}
//                     onPress={handleBatteryDateIconPress}
//                     disabled={loading}
//                   >
//                     <Text style={ formData.batteryDate ? styles.selectedModelText : styles.placeholderText }>
//                       {formData.batteryDate ? formData.batteryDate.toLocaleDateString() : 'Select Battery Date'}
//                     </Text>
//                   </TouchableOpacity>
//                   <TouchableOpacity
//                     onPress={handleBatteryDateIconPress}
//                     style={styles.iconButton}
//                     disabled={loading}
//                   >
//                     <Icon name="calendar-today" size={20} color="#666" />
//                   </TouchableOpacity>
//                 </View>
//                 {showBatteryDatePicker && (
//                   <DateTimePicker
//                     value={formData.batteryDate || new Date()}
//                     mode="date"
//                     display={Platform.OS === 'ios' ? 'spinner' : 'default'}
//                     onChange={handleBatteryDateChange}
//                   />
//                 )}
//               </LinearGradient>
//             </View>
           
//           </View>

//           {/* Battery Serial No + Tractor Starter Serial No */}
//           <View style={styles.row}>
//             <View style={styles.inputContainer}>
//               <LinearGradient
//                 colors={['#7E5EA9', '#20AEBC']}
//                 style={styles.inputGradient}>
//                 <View style={styles.inputWithIcon}>
//                   <TextInput
//                     style={[styles.input, styles.inputWithIconField]}
//                     value={formData.batteryNo}
//                     onChangeText={text => handleInputChange('batteryNo', text)}
//                     placeholder="Battery Serial No."
//                    placeholderTextColor="#666"

//                     editable={!loading}
//                   />
//                   <TouchableOpacity
//                     onPress={handleBatteryScanPress}
//                     style={styles.iconButton}
//                     disabled={loading}
//                   >
//                     <Icon name="qr-code-scanner" size={20} color="#666" />
//                   </TouchableOpacity>
//                 </View>
//               </LinearGradient>
//             </View>
//             <View style={styles.inputContainer}>
//               <LinearGradient
//                 colors={['#7E5EA9', '#20AEBC']}
//                 style={styles.inputGradient}>
//                 <View style={styles.inputWithIcon}>
//                   <TextInput
//                     style={[styles.input, styles.inputWithIconField]}
//                     value={formData.starterNo}
//                     onChangeText={text => handleInputChange('starterNo', text)}
//                     placeholder="Tractor Starter Serial No."
//                    placeholderTextColor="#666"

//                     editable={!loading}
//                   />
//                   <TouchableOpacity
//                     onPress={handleStarterScanPress}
//                     style={styles.iconButton}
//                     disabled={loading}
//                   >
//                     <Icon name="qr-code-scanner" size={20} color="#666" />
//                   </TouchableOpacity>
//                 </View>
//               </LinearGradient>
//             </View>
//           </View>

//           {/* FIP No + Tractor Alternator No */}
//           <View style={styles.row}>
//             <View style={styles.inputContainer}>
//               <LinearGradient
//                 colors={['#7E5EA9', '#20AEBC']}
//                 style={styles.inputGradient}>
//                 <View style={styles.inputWithIcon}>
//                   <TextInput
//                     style={[styles.input, styles.inputWithIconField]}
//                     value={formData.fipNo}
//                     onChangeText={text => handleInputChange('fipNo', text)}
//                     placeholder="FIP No."
//                    placeholderTextColor="#666"

//                     editable={!loading}
//                   />
//                   <TouchableOpacity
//                     onPress={handleFipScanPress}
//                     style={styles.iconButton}
//                     disabled={loading}
//                   >
//                     <Icon name="qr-code-scanner" size={20} color="#666" />
//                   </TouchableOpacity>
//                 </View>
//               </LinearGradient>
//             </View>
//             <View style={styles.inputContainer}>
//               <LinearGradient
//                 colors={['#7E5EA9', '#20AEBC']}
//                 style={styles.inputGradient}>
//                 <View style={styles.inputWithIcon}>
//                   <TextInput
//                     style={[styles.input, styles.inputWithIconField]}
//                     value={formData.alternatorNo}
//                     onChangeText={text => handleInputChange('alternatorNo', text)}
//                     placeholder="Tractor Alternator No."
//                    placeholderTextColor="#666"

//                     editable={!loading}
//                   />
//                   <TouchableOpacity
//                     onPress={handleAlternatorScanPress}
//                     style={styles.iconButton}
//                     disabled={loading}
//                   >
//                     <Icon name="qr-code-scanner" size={20} color="#666" />
//                   </TouchableOpacity>
//                 </View>
//               </LinearGradient>
//             </View>
//           </View>

//           {/* PDI Done By + Remarks */}
//           <View style={styles.row}>
//             <View style={styles.inputContainer}>
//               <LinearGradient
//                 colors={['#7E5EA9', '#20AEBC']}
//                 style={styles.inputGradient}>
//                 <TextInput
//                   style={styles.input}
//                   value={formData.pdiDoneBy}
//                   onChangeText={text => handleInputChange('pdiDoneBy', text)}
//                   placeholder="PDI Done By"
//                    placeholderTextColor="#666"

//                   editable={!loading}
//                 />
//               </LinearGradient>
//             </View>
//             <View style={styles.inputContainer}>
//               <LinearGradient
//                 colors={['#7E5EA9', '#20AEBC']}
//                 style={styles.inputGradient}>
//                 <TextInput
//                   style={styles.input}
//                   value={formData.remarks}
//                   onChangeText={text => handleInputChange('remarks', text)}
//                   placeholder="Remarks"
//                    placeholderTextColor="#666"

//                   editable={!loading}
//                   multiline
//                 />
//               </LinearGradient>
//             </View>
//           </View>
//         </View>

//         {/* Tractor Model Modal */}
//         <Modal
//           visible={showModelDropdown}
//           transparent={true}
//           animationType="slide"
//           onRequestClose={() => setShowModelDropdown(false)}>
//           <View style={styles.modalOverlay}>
//             <View style={styles.modalContent}>
//               <View style={styles.modalHeader}>
//                 <Text style={styles.modalTitle}>Select Tractor Model</Text>
//                 <TouchableOpacity
//                   onPress={() => setShowModelDropdown(false)}
//                   style={styles.closeButton}>
//                   <Icon name="close" size={24} color="#000" />
//                 </TouchableOpacity>
//               </View>
//               <FlatList
//                 data={tractorModels}
//                 renderItem={renderModelItem}
//                 keyExtractor={(item, index) => index.toString()}
//                 style={styles.modelList}
//               />
//             </View>
//           </View>
//         </Modal>

//         {/* Tire Make Modal */}
//         <Modal
//           visible={showTireDropdown}
//           transparent={true}
//           animationType="slide"
//           onRequestClose={() => setShowTireDropdown(false)}>
//           <View style={styles.modalOverlay}>
//             <View style={styles.modalContent}>
//               <View style={styles.modalHeader}>
//                 <Text style={styles.modalTitle}>Select Tire Make</Text>
//                 <TouchableOpacity
//                   onPress={() => setShowTireDropdown(false)}
//                   style={styles.closeButton}>
//                   <Icon name="close" size={24} color="#000" />
//                 </TouchableOpacity>
//               </View>
//               <FlatList
//                 data={tireMakes}
//                 renderItem={renderTireItem}
//                 keyExtractor={(item, index) => index.toString()}
//                 style={styles.modelList}
//               />
//             </View>
//           </View>
//         </Modal>

//         {/* Battery Make Modal */}
//         <Modal
//           visible={showBatteryDropdown}
//           transparent={true}
//           animationType="slide"
//           onRequestClose={() => setShowBatteryDropdown(false)}>
//           <View style={styles.modalOverlay}>
//             <View style={styles.modalContent}>
//               <View style={styles.modalHeader}>
//                 <Text style={styles.modalTitle}>Select Battery Make</Text>
//                 <TouchableOpacity
//                   onPress={() => setShowBatteryDropdown(false)}
//                   style={styles.closeButton}>
//                   <Icon name="close" size={24} color="#000" />
//                 </TouchableOpacity>
//               </View>
//               <FlatList
//                 data={batteryMakes}
//                 renderItem={renderBatteryItem}
//                 keyExtractor={(item, index) => index.toString()}
//                 style={styles.modelList}
//               />
//             </View>
//           </View>
//         </Modal>

//         {/* Hypothecation Modal (for point 4) */}
//         <Modal
//           visible={showHypothecationDropdown}
//           transparent={true}
//           animationType="slide"
//           onRequestClose={() => setShowHypothecationDropdown(false)}>
//           <View style={styles.modalOverlay}>
//             <View style={styles.modalContent}>
//               <View style={styles.modalHeader}>
//                 <Text style={styles.modalTitle}>Select Hypothecation</Text>
//                 <TouchableOpacity
//                   onPress={() => setShowHypothecationDropdown(false)}
//                   style={styles.closeButton}>
//                   <Icon name="close" size={24} color="#000" />
//                 </TouchableOpacity>
//               </View>
//               <FlatList
//                 data={hypothecationOptions}
//                 renderItem={renderHypothecationItem}
//                 keyExtractor={(item, index) => index.toString()}
//                 style={styles.modelList}
//               />
//             </View>
//           </View>
//         </Modal>

//         {/* QR Scanner Modal */}
//         {renderQRScanner()}

//         {/* Radio Sections */}
//         <View style={styles.radioSection}>
//           <Text style={styles.radioLabel}>Lights OK:</Text>
//           {renderYesNo('lightsOk')}
//           {radioValues.lightsOk === '0' && (
//             <View style={styles.remarkInputContainer}>
//               <LinearGradient colors={['#7E5EA9', '#20AEBC']} style={styles.inputGradient}>
//                 <TextInput
//                   style={styles.remarkInput}
//                   value={formData.lightsOkRemark}
//                   onChangeText={text => handleInputChange('lightsOkRemark', text)}
//                   placeholder="Remark for Lights OK ?"
//                   placeholderTextColor="#666"
//                   editable={!loading}
//                   multiline
//                 />
//               </LinearGradient>
//             </View>
//           )}

//           <Text style={styles.radioLabel}>Nuts OK:</Text>
//           {renderYesNo('nutsOk')}
//           {radioValues.nutsOk === '0' && (
//             <View style={styles.remarkInputContainer}>
//               <LinearGradient colors={['#7E5EA9', '#20AEBC']} style={styles.inputGradient}>
//                 <TextInput
//                   style={styles.remarkInput}
//                   value={formData.nutsOkRemark}
//                   onChangeText={text => handleInputChange('nutsOkRemark', text)}
//                   placeholder="Remark for Nuts OK ?"
//                   placeholderTextColor="#666"
//                   editable={!loading}
//                   multiline
//                 />
//               </LinearGradient>
//             </View>
//           )}

//           <Text style={styles.radioLabel}>Hydraulic Oil:</Text>
//           {renderFullHalf('hydraulicOil')}
//           {radioValues.hydraulicOil === '0' && (
//             <View style={styles.remarkInputContainer}>
//               <LinearGradient colors={['#7E5EA9', '#20AEBC']} style={styles.inputGradient}>
//                 <TextInput
//                   style={styles.remarkInput}
//                   value={formData.hydraulicOilRemark}
//                   onChangeText={text => handleInputChange('hydraulicOilRemark', text)}
//                   placeholder="Remark for Hydraulic Oil ?"
//                   placeholderTextColor="#666"
//                   editable={!loading}
//                   multiline
//                 />
//               </LinearGradient>
//             </View>
//           )}

//           <Text style={styles.radioLabel}>All Nuts Are Sealed:</Text>
//           {renderYesNo('nutsSealed')}
//           {radioValues.nutsSealed === '0' && (
//             <View style={styles.remarkInputContainer}>
//               <LinearGradient colors={['#7E5EA9', '#20AEBC']} style={styles.inputGradient}>
//                 <TextInput
//                   style={styles.remarkInput}
//                   value={formData.nutsSealedRemark}
//                   onChangeText={text => handleInputChange('nutsSealedRemark', text)}
//                   placeholder="Remark for All Nuts Are Sealed ?"
//                   placeholderTextColor="#666"
//                   editable={!loading}
//                   multiline
//                 />
//               </LinearGradient>
//             </View>
//           )}

//           <Text style={styles.radioLabel}>Engine Oil Level:</Text>
//           {renderYesNo('engineOilLevel')}
//           {radioValues.engineOilLevel === '0' && (
//             <View style={styles.remarkInputContainer}>
//               <LinearGradient colors={['#7E5EA9', '#20AEBC']} style={styles.inputGradient}>
//                 <TextInput
//                   style={styles.remarkInput}
//                   value={formData.engineOilLevelRemark}
//                   onChangeText={text => handleInputChange('engineOilLevelRemark', text)}
//                   placeholder="Remark for Engine Oil Level ?"
//                   placeholderTextColor="#666"
//                   editable={!loading}
//                   multiline
//                 />
//               </LinearGradient>
//             </View>
//           )}

//           <Text style={styles.radioLabel}>Coolant Level:</Text>
//           {renderYesNo('coolantLevel')}
//           {radioValues.coolantLevel === '0' && (
//             <View style={styles.remarkInputContainer}>
//               <LinearGradient colors={['#7E5EA9', '#20AEBC']} style={styles.inputGradient}>
//                 <TextInput
//                   style={styles.remarkInput}
//                   value={formData.coolantLevelRemark}
//                   onChangeText={text => handleInputChange('coolantLevelRemark', text)}
//                   placeholder="Remark for Coolant Level ?"
//                   placeholderTextColor="#666"
//                   editable={!loading}
//                   multiline
//                 />
//               </LinearGradient>
//             </View>
//           )}

//           <Text style={styles.radioLabel}>Brake Fluid Level:</Text>
//           {renderYesNo('brakeFluidLevel')}
//           {radioValues.brakeFluidLevel === '0' && (
//             <View style={styles.remarkInputContainer}>
//               <LinearGradient colors={['#7E5EA9', '#20AEBC']} style={styles.inputGradient}>
//                 <TextInput
//                   style={styles.remarkInput}
//                   value={formData.brakeFluidLevelRemark}
//                   onChangeText={text => handleInputChange('brakeFluidLevelRemark', text)}
//                   placeholder="Remark for Brake Fluid Level ?"
//                   placeholderTextColor="#666"
//                   editable={!loading}
//                   multiline
//                 />
//               </LinearGradient>
//             </View>
//           )}

//           <Text style={styles.radioLabel}>Greasing Done</Text>
//           {renderYesNo('greasingDone')}
//           {radioValues.greasingDone === '0' && (
//             <View style={styles.remarkInputContainer}>
//               <LinearGradient colors={['#7E5EA9', '#20AEBC']} style={styles.inputGradient}>
//                 <TextInput
//                   style={styles.remarkInput}
//                   value={formData.greasingDoneRemark}
//                   onChangeText={text => handleInputChange('greasingDoneRemark', text)}
//                   placeholder="Remark for Greasing Done ?"
//                   placeholderTextColor="#666"
//                   editable={!loading}
//                   multiline
//                 />
//               </LinearGradient>
//             </View>
//           )}

//           <Text style={styles.radioLabel}>Paint Scratches</Text>
//           {renderYesNo('paintScratches')}
//           {radioValues.paintScratches === '0' && (
//             <View style={styles.remarkInputContainer}>
//               <LinearGradient colors={['#7E5EA9', '#20AEBC']} style={styles.inputGradient}>
//                 <TextInput
//                   style={styles.remarkInput}
//                   value={formData.paintScratchesRemark}
//                   onChangeText={text => handleInputChange('paintScratchesRemark', text)}
//                   placeholder="Remark for Paint Scratches ?"
//                   placeholderTextColor="#666"
//                   editable={!loading}
//                   multiline
//                 />
//               </LinearGradient>
//             </View>
//           )}

//           <Text style={styles.radioLabel}>Toolkit Available</Text>
//           {renderYesNo('toolkitAvailable')}
//           {radioValues.toolkitAvailable === '0' && (
//             <View style={styles.remarkInputContainer}>
//               <LinearGradient colors={['#7E5EA9', '#20AEBC']} style={styles.inputGradient}>
//                 <TextInput
//                   style={styles.remarkInput}
//                   value={formData.toolkitAvailableRemark}
//                   onChangeText={text => handleInputChange('toolkitAvailableRemark', text)}
//                   placeholder="Remark for Toolkit Available ?"
//                   placeholderTextColor="#666"
//                   editable={!loading}
//                   multiline
//                 />
//               </LinearGradient>
//             </View>
//           )}

//           <Text style={styles.radioLabel}>Owner Manual Given</Text>
//           {renderYesNo('ownerManualGiven')}
//           {radioValues.ownerManualGiven === '0' && (
//             <View style={styles.remarkInputContainer}>
//               <LinearGradient colors={['#7E5EA9', '#20AEBC']} style={styles.inputGradient}>
//                 <TextInput
//                   style={styles.remarkInput}
//                   value={formData.ownerManualGivenRemark}
//                   onChangeText={text => handleInputChange('ownerManualGivenRemark', text)}
//                   placeholder="Remark for Owner Manual Given ?"
//                   placeholderTextColor="#666"
//                   editable={!loading}
//                   multiline
//                 />
//               </LinearGradient>
//             </View>
//           )}

//           <Text style={styles.radioLabel}>Reflector Sticker Applied</Text>
//           {renderYesNo('reflectorStickerApplied')}
//           {radioValues.reflectorStickerApplied === '0' && (
//             <View style={styles.remarkInputContainer}>
//               <LinearGradient colors={['#7E5EA9', '#20AEBC']} style={styles.inputGradient}>
//                 <TextInput
//                   style={styles.remarkInput}
//                   value={formData.reflectorStickerAppliedRemark}
//                   onChangeText={text => handleInputChange('reflectorStickerAppliedRemark', text)}
//                   placeholder="Remark for Reflector Sticker Applied ?"
//                   placeholderTextColor="#666"
//                   editable={!loading}
//                   multiline
//                 />
//               </LinearGradient>
//             </View>
//           )}

//           <Text style={styles.radioLabel}>Number Plate Fixed</Text>
//           {renderYesNo('numberPlateFixed')}
//           {radioValues.numberPlateFixed === '0' && (
//             <View style={styles.remarkInputContainer}>
//               <LinearGradient colors={['#7E5EA9', '#20AEBC']} style={styles.inputGradient}>
//                 <TextInput
//                   style={styles.remarkInput}
//                   value={formData.numberPlateFixedRemark}
//                   onChangeText={text => handleInputChange('numberPlateFixedRemark', text)}
//                   placeholder="Remark for Number Plate Fixed ?"
//                   placeholderTextColor="#666"
//                   editable={!loading}
//                   multiline
//                 />
//               </LinearGradient>
//             </View>
//           )}

//           <Text style={styles.radioLabel}>Tractor Delivered:</Text>
//           {renderYesNo('delivered')}
//         </View>

//         {/* Delivery Customer Details (POINT 4)
//             This block appears only when Tractor Delivered = YES (radioValues.delivered === '1')
//             It contains: Customer Name, Father's Name, Address, Mobile Number, Hypothecation (dropdown)
//             If Hypothecation == 'Other', an editable input appears.
//         */}
//         {radioValues.delivered === '1' && (
//           <View style={styles.sectionHeading}>
//             <Text style={styles.sectionHeadingText}>Delivery Customer Details:</Text>

//             {/* Delivery Customer Name + Father's Name */}
//             <View style={[styles.row, {marginTop: 8}]}>
//               <View style={styles.inputContainer}>
//                 <LinearGradient colors={['#7E5EA9', '#20AEBC']} style={styles.inputGradient}>
//                   <TextInput
//                     style={styles.input}
//                     value={formData.deliveryCustomerName}
//                     onChangeText={text => handleInputChange('deliveryCustomerName', text)}
//                     placeholder="Customer Name"
//                    placeholderTextColor="#666"

//                     editable={!loading}
//                   />
//                 </LinearGradient>
//               </View>
//               <View style={styles.inputContainer}>
//                 <LinearGradient colors={['#7E5EA9', '#20AEBC']} style={styles.inputGradient}>
//                   <TextInput
//                     style={styles.input}
//                     value={formData.deliveryCustomerFatherName}
//                     onChangeText={text => handleInputChange('deliveryCustomerFatherName', text)}
//                     placeholder="Father's Name"
//                    placeholderTextColor="#666"

//                     editable={!loading}
//                   />
//                 </LinearGradient>
//               </View>
//             </View>

//             {/* Delivery Address + Mobile */}
//             <View style={styles.row}>
//               <View style={styles.inputContainer}>
//                 <LinearGradient colors={['#7E5EA9', '#20AEBC']} style={styles.inputGradient}>
//                   <TextInput
//                     style={styles.input}
//                     value={formData.deliveryCustomerAddress}
//                     onChangeText={text => handleInputChange('deliveryCustomerAddress', text)}
//                     placeholder="Address"
//                    placeholderTextColor="#666"

//                     editable={!loading}
//                     multiline
//                   />
//                 </LinearGradient>
//               </View>
//               <View style={styles.inputContainer}>
//                 <LinearGradient colors={['#7E5EA9', '#20AEBC']} style={styles.inputGradient}>
//                   <TextInput
//                     style={styles.input}
//                     value={formData.deliveryCustomerContact}
//                     onChangeText={text => handleInputChange('deliveryCustomerContact', text)}
//                     placeholder="Mobile Number"
//                    placeholderTextColor="#666"

//                     keyboardType="phone-pad"
//                     editable={!loading}
//                   />
//                 </LinearGradient>
//               </View>
//             </View>

//             {/* Hypothecation dropdown + 'Other' input if selected */}
//             <View style={styles.row}>
//               <View style={styles.inputContainer}>
//                 <LinearGradient colors={['#7E5EA9', '#20AEBC']} style={styles.inputGradient}>
//                   <TouchableOpacity
//                     style={styles.input}
//                     onPress={() => setShowHypothecationDropdown(true)}
//                     disabled={loading}
//                   >
//                     <Text style={ formData.hypothecation ? styles.selectedModelText : styles.placeholderText }>
//                       {formData.hypothecation || 'Select Hypothecation'}
//                     </Text>
//                     <Icon
//                       name="keyboard-arrow-down"
//                       size={25}
//                       color="#666"
//                       style={styles.dropdownIcon}
//                     />
//                   </TouchableOpacity>
//                 </LinearGradient>
//               </View>
//               <View style={styles.inputContainer}></View>
//             </View>

//             {formData.hypothecation === 'Other' && (
//               <View style={styles.row}>
//                 <View style={styles.inputContainer}>
//                   <LinearGradient colors={['#7E5EA9', '#20AEBC']} style={styles.inputGradient}>
//                     <TextInput
//                       style={styles.input}
//                       value={formData.hypothecationOther}
//                       onChangeText={text => handleInputChange('hypothecationOther', text)}
//                       placeholder="Enter Other Hypothecation"
//                    placeholderTextColor="#666"

//                       editable={!loading}
//                     />
//                   </LinearGradient>
//                 </View>
//                 <View style={styles.inputContainer}></View>
//               </View>
//             )}
//           </View>
//         )}

//         {/* Terms and Conditions Section - Added between Delivery Customer Details and Photo & Signature */}
//         {radioValues.delivered === '1' && (
//           <View style={styles.termsSection}>
//             <Text style={styles.termsTitle}>Terms and Conditions</Text>
            
//             <View style={styles.termsList}>
//               <Text style={styles.termItem}>1. Tractor Will Be Inspected Only After Full Payment Confirmation From The Accounts Department.</Text>
//               <Text style={styles.termItem}>2. PDI Will Be Carried Out Strictly As Per John Deere India Pvt. Ltd. Guidelines.</Text>
//               <Text style={styles.termItem}>3. Any Damages Or Discrepancies Found Before Delivery Will Be Rectified Prior To Handover.</Text>
//               <Text style={styles.termItem}>4. No Mechanical Or Electrical Modifications Are Allowed During Or After Pdi.</Text>
//               <Text style={styles.termItem}>5. Customer Must Be Present During Final Inspection And Sign The Pdi Report.</Text>
//               <Text style={styles.termItem}>6. Tractor Delivery Will Be Done Only After Successful Completion Of All Inspection Points.</Text>
//               <Text style={styles.termItem}>7. Makroo Motor Corporation Will Not Be Responsible For Any Issues Arising After Customer Approval And Delivery.</Text>
//               <Text style={styles.termItem}>8. All Fluids, Oil Levels, And Battery Conditions Will Be Checked And Recorded Before Handover.</Text>
//               <Text style={styles.termItem}>9. Tractor Registration And Number Plate Installation Will Be Handled Separately As Per Rto Process.</Text>
//             </View>

//             <Text style={styles.declarationTitle}>Customer Declaration</Text>
//             <Text style={styles.declarationText}>
//               I Have Personally Verified The Tractor After Completion Of The Pre-delivery Inspection (Pdi) At Makroo Motor Corporation. All Functions, Fittings, And Accessories Have Been Checked In My Presence. I Am Satisfied With The Tractor's Condition And Accept Delivery In Proper Working Order.
//             </Text>

//             <View style={styles.checkboxContainer}>
//               <TouchableOpacity 
//                 style={[styles.checkbox, isTermsAccepted && styles.checkboxChecked]} 
//                 onPress={() => setIsTermsAccepted(!isTermsAccepted)}
//                 disabled={loading}
//               >
//                 {isTermsAccepted && <Icon name="check" size={16} color="#fff" />}
//               </TouchableOpacity>
//               <Text style={styles.checkboxLabel}>Accept All Terms and Conditions</Text>
//             </View>
//           </View>
//         )}

//         {/* Photo & Signature */}
//         <View style={styles.photoSignatureSection}>
//           <TouchableOpacity 
//             style={styles.photoSignatureBox} 
//             onPress={() => showImagePickerOptions(setCustomerPhoto)}
//             disabled={loading}
//           >
//             {customerPhoto ? (
//               <Image 
//                 source={{ uri: customerPhoto.uri }} 
//                 style={styles.previewImage}
//                 resizeMode="contain"
//               />
//             ) : (
//               <>
//                 <Icon name="photo-camera" size={35} color="#666" />
//                 <Text style={styles.photoSignatureText}>Customer Photo</Text>
//                 {isEditMode && <Text style={styles.optionalText}>(Optional for update)</Text>}
//               </>
//             )}
//           </TouchableOpacity>

//           <TouchableOpacity 
//             style={styles.photoSignatureBox1} 
//             onPress={() => showImagePickerOptions(setCustomerSignature)}
//             disabled={loading}
//           >
//             {customerSignature ? (
//               <Image 
//                 source={{ uri: customerSignature.uri }} 
//                 style={styles.previewImage}
//                 resizeMode="contain"
//               />
//             ) : (
//               <>
//                 <Text style={styles.photoSignatureText}>Customer Signature</Text>
//                 {isEditMode && <Text style={styles.optionalText}>(Optional for update)</Text>}
//               </>
//             )}
//           </TouchableOpacity>

//           <TouchableOpacity 
//             style={styles.photoSignatureBox1} 
//             onPress={() => showImagePickerOptions(setManagerSignature)}
//             disabled={loading}
//           >
//             {managerSignature ? (
//               <Image 
//                 source={{ uri: managerSignature.uri }} 
//                 style={styles.previewImage}
//                 resizeMode="contain"
//               />
//             ) : (
//               <>
//                 <Text style={styles.photoSignatureText}>Manager Signature</Text>
//                 {isEditMode && <Text style={styles.optionalText}>(Optional for update)</Text>}
//               </>
//             )}
//           </TouchableOpacity>
//         </View>

//         {/* Buttons */}
//         <View style={styles.buttonContainer}>
//           <TouchableOpacity 
//             style={[
//               styles.submitButton, 
//               loading && styles.disabledButton,
//               (radioValues.delivered === '1' && !isTermsAccepted) && styles.disabledButton
//             ]} 
//             onPress={handleSubmit}
//             disabled={loading || (radioValues.delivered === '1' && !isTermsAccepted)}
//           >
//             {loading ? (
//               <ActivityIndicator color="#fff" size="small" />
//             ) : (
//               <Text style={styles.submitButtonText}>
//                 {isEditMode ? 'Update Form' : 'Submit Form'}
//               </Text>
//             )}
//           </TouchableOpacity>

//           <TouchableOpacity 
//             style={[styles.homeButton, loading && styles.disabledButton]} 
//             onPress={handleHome}
//             disabled={loading}
//           >
//             <Text style={styles.homeButtonText}>Home</Text>
//           </TouchableOpacity>
//         </View>
//       </ScrollView>
//     </View>
//   );

//   // === Render Radio Helpers ===
//   function renderYesNo(field) {
//     return (
//       <View style={styles.radioOptionsContainer}>
//         {[
//           {label: 'YES', value: '1'},
//           {label: 'NO', value: '0'}
//         ].map(({label, value}) => (
//           <TouchableOpacity
//             key={value}
//             style={[
//               styles.radioOptionWrapper,
//               radioValues[field] === value && styles.radioOptionSelected,
//             ]}
//             onPress={() => {
//               handleRadioChange(field, value);
//             }}
//             disabled={loading}
//           >
//             <LinearGradient
//               colors={['#7E5EA9', '#20AEBC']}
//               style={styles.radioOptionGradient}>
//               <View
//                 style={[
//                   styles.radioOptionInner,
//                   radioValues[field] === value &&
//                     styles.radioOptionInnerSelected,
//                 ]}>
//                 <Text
//                   style={[
//                     styles.radioOptionText,
//                     radioValues[field] === value &&
//                       styles.radioOptionTextSelected,
//                   ]}>
//                   {label}
//                 </Text>
//               </View>
//             </LinearGradient>
//           </TouchableOpacity>
//         ))}
//       </View>
//     );
//   }

//   function renderFullHalf(field) {
//     return (
//       <View style={styles.radioOptionsContainer}>
//         {[
//           {label: 'YES', value: '1'},
//           {label: 'NO', value: '0'}
//         ].map(({label, value}) => (
//           <TouchableOpacity
//             key={value}
//             style={[
//               styles.radioOptionWrapper,
//               radioValues[field] === value && styles.radioOptionSelected,
//             ]}
//             onPress={() => handleRadioChange(field, value)}
//             disabled={loading}
//           >
//             <LinearGradient
//               colors={['#7E5EA9', '#20AEBC']}
//               style={styles.radioOptionGradient}>
//               <View
//                 style={[
//                   styles.radioOptionInner,
//                   radioValues[field] === value &&
//                     styles.radioOptionInnerSelected,
//                 ]}>
//                 <Text
//                   style={[
//                     styles.radioOptionText,
//                     radioValues[field] === value &&
//                       styles.radioOptionTextSelected,
//                   ]}>
//                   {label}
//                 </Text>
//               </View>
//             </LinearGradient>
//           </TouchableOpacity>
//         ))}
//       </View>
//     );
//   }
// };

// const styles = StyleSheet.create({
//   container: {paddingHorizontal: 15},
//   header: {alignItems: 'center', paddingVertical: 10},
//   companyName: {fontSize: 16,  color: 'white',fontFamily: 'Inter_28pt-SemiBold'},
//   formNo: {fontSize: 14, marginVertical: 10,fontFamily: 'Inter_28pt-SemiBold', color: '#000'},
//   Date: {
//     fontSize: 12,
//     textAlign: 'right',
//     marginVertical: 5,
//     color: '#00000099',
//     fontFamily: 'Inter_28pt-Medium',
//   },
//   editModeContainer: {
//     backgroundColor: '#f0e6ff',
//     padding: 8,
//     borderRadius: 5,
//     marginVertical: 5,
//     alignItems: 'center',
//   },
//   editModeText: {
//     fontSize: 12,
//     fontFamily: 'Inter_28pt-SemiBold',
//     color: '#7E5EA9',
//   },
//   sectionHeading: {
//     marginVertical: 10,
//     paddingLeft: 5,
//   },
//   sectionHeadingText: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#000',
//     fontFamily: 'Inter_28pt-SemiBold',
//   },
//   formContainer: {marginBottom: 15},
//   row: {},
//   inputContainer: {
//     flex: 1, 
//     marginHorizontal: 4, 
//     marginBottom: 12
//   },
//   inputGradient: {borderRadius: 10, padding: 1},
//   input: {
//     borderRadius: 10,
//     backgroundColor: '#fff',
//     padding: 12,
//     fontSize: 14,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   selectedModelText: {fontSize: 14, color: '#000', fontFamily: 'Inter_28pt-Medium'},
//   placeholderText: {fontSize: 14, color: '#666', fontFamily: 'Inter_28pt-Medium'},
//   dropdownIcon: {marginLeft: 8},
//   inputWithIcon: {flexDirection: 'row', alignItems: 'center'},
//   inputWithIconField: {flex: 1},
//   iconButton: {position: 'absolute', right: 12, padding: 4},
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   modalContent: {backgroundColor: 'white', borderRadius: 10, width: '90%'},
//   modalHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     padding: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: '#f0f0f0',
//   },
//   modalTitle: {fontSize: 16, fontWeight: 'bold', fontFamily: 'Inter_28pt-SemiBold'},
//   closeButton: {padding: 4},
//   modelList: {maxHeight: 300},
//   modelItem: {padding: 15, borderBottomWidth: 1, borderBottomColor: '#f0f0f0'},
//   modelItemText: {fontSize: 14, color: '#333',fontFamily: 'Inter_28pt-Medium'},
//   // QR Scanner Styles
//   scannerContainer: {
//     flex: 1,
//     backgroundColor: '#000',
//   },
//   scannerHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 15,
//     paddingTop: 50,
//     backgroundColor: 'rgba(0,0,0,0.7)',
//   },
//   scannerCloseButton: {
//     padding: 8,
//     marginRight: 15,
//   },
//   scannerTitle: {
//     fontSize: 18,
//     color: '#fff',
//     fontWeight: 'bold',
//   },
//   camera: {
//     flex: 1,
//   },
//   scannerFooter: {
//     padding: 20,
//     backgroundColor: 'rgba(0,0,0,0.7)',
//     alignItems: 'center',
//   },
//   scannerInstructions: {
//     color: '#fff',
//     fontSize: 16,
//     textAlign: 'center',
//   },
//   radioSection: {marginBottom: 15},
//   radioLabel: {fontSize: 12, marginBottom: 6, color: '#000',fontFamily: 'Inter_28pt-Medium',marginTop:0},
//   radioOptionsContainer: {flexDirection: 'row'},
//   radioOptionWrapper: {flex: 1, marginHorizontal: 8, marginBottom: 15},
//   radioOptionGradient: {borderRadius: 6, padding: 1},
//   radioOptionInner: {
//     borderRadius: 5,
//     paddingVertical: 10,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//   },
//   radioOptionInnerSelected: {backgroundColor: '#7E5EA9'},
//   radioOptionText: {fontSize: 12, color: '#000',fontFamily: 'Inter_28pt-Medium'},
//   radioOptionTextSelected: {color: '#fff'},
//   // Remark Input Styles
//   remarkInputContainer: {
//     marginHorizontal: 8,
//     marginBottom: 15,
//   },
//   remarkInput: {
//     borderRadius: 10,
//     backgroundColor: '#fff',
//     padding: 12,
//     fontSize: 14,
//     minHeight: 50,
//     textAlignVertical: 'top',
//   },
//   // Terms and Conditions Styles
//   termsSection: {
//     marginBottom: 15,
//     padding: 10,
    
//   },
//   termsTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#000',
//     marginBottom: 10,
//     fontFamily: 'Inter_28pt-SemiBold',
    
//   },
//   termsList: {
//     marginBottom: 15,
//   },
//   termItem: {
//     fontSize: 12,
//     color: '#333',
//     marginBottom: 8,
//     lineHeight: 16,
//     fontFamily: 'Inter_28pt-Medium',
//   },
//   declarationTitle: {
//     fontSize: 15,
//     fontWeight: 'bold',
//     color: '#000',
//     marginTop: 10,
//     marginBottom: 8,
//     fontFamily: 'Inter_28pt-SemiBold',
//   },
//   declarationText: {
//     fontSize: 12,
//     color: '#333',
//     lineHeight: 16,
//     marginBottom: 15,
//     fontFamily: 'Inter_28pt-Medium',
//   },
//   checkboxContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 10,
//   },
//   checkbox: {
//     width: 20,
//     height: 20,
//     borderWidth: 2,
//     borderColor: '#666',
//     borderRadius: 4,
//     marginRight: 10,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//   },
//   checkboxChecked: {
//     backgroundColor: '#28a745', // Green background when checked
//     borderColor: '#28a745',
//   },
//   checkboxLabel: {
//     fontSize: 14,
//     color: '#000',
//     fontFamily: 'Inter_28pt-Medium',
//   },
//   photoSignatureSection: {marginTop: 20},
//   photoSignatureBox: {
//     width: '100%',
//     height: 95,
//     borderWidth: 1,
//     borderColor: '#00000080',
//     borderRadius: 10,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 20,
//     borderStyle: 'dashed',
//   },
//   photoSignatureBox1: {
//     width: '100%',
//     height: 50,
//     borderWidth: 1,
//     borderColor: '#00000080',
//     borderRadius: 10,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 20,
//     borderStyle: 'dashed',
//   },
//   photoSignatureText: {fontSize: 13, textAlign: 'center', color: '#00000099',fontFamily: 'Inter_28pt-Medium'},
//   optionalText: {
//     fontSize: 10,
//     color: '#666',
//     fontStyle: 'italic',
//     marginTop: 2,
//   },
//   previewImage: {
//     width: '100%',
//     height: '100%',
//     borderRadius: 10,
//   },
//   buttonContainer: {marginTop: 20},
//   submitButton: {
//     backgroundColor: '#7E5EA9',
//     padding: 15,
//     borderRadius: 10,
//     alignItems: 'center',
//     marginBottom: 15,
//   },
//   submitButtonText: {color: '#fff', fontSize: 14,fontFamily: 'Inter_28pt-SemiBold'},
//   homeButton: {
//     backgroundColor: '#20AEBC',
//     padding: 15,
//     borderRadius: 10,
//     alignItems: 'center',
//     marginBottom: 35,
//   },
//   homeButtonText: {color: '#fff', fontSize: 14,fontFamily: 'Inter_28pt-SemiBold'},
//   pdfButton: {
//     backgroundColor: '#7E5EA9',
//     padding: 15,
//     borderRadius: 10,
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   pdfButtonText: {color: '#fff', fontSize: 14,fontFamily: 'Inter_28pt-SemiBold'},
//   disabledButton: {
//     opacity: 0.6,
//   },
// });

// export default PDIpage;









// import React, {useState, useEffect} from 'react';
// import {
//   View,
//   Text,
//   ScrollView,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   Alert,
//   Modal,
//   FlatList,
//   Image,
//   ActionSheetIOS,
//   Platform,
//   PermissionsAndroid,
//   ActivityIndicator,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import {useSafeAreaInsets} from 'react-native-safe-area-context';
// import LinearGradient from 'react-native-linear-gradient';
// import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
// import DateTimePicker from '@react-native-community/datetimepicker';
// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { Camera } from 'react-native-camera-kit';

// const PDIpage = ({navigation, route}) => {
//   const insets = useSafeAreaInsets();

//   const [userId, setUserId] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [existingFormId, setExistingFormId] = useState(null);
  
//   const [showModelDropdown, setShowModelDropdown] = useState(false);
//   const [showTireDropdown, setShowTireDropdown] = useState(false);
//   const [showBatteryDropdown, setShowBatteryDropdown] = useState(false);
//   const [showDatePicker, setShowDatePicker] = useState(false);
//   const [showBatteryDatePicker, setShowBatteryDatePicker] = useState(false);
//   const [showHypothecationDropdown, setShowHypothecationDropdown] = useState(false);

//   // QR Scanner States
//   const [showChassisScanner, setShowChassisScanner] = useState(false);
//   const [showEngineScanner, setShowEngineScanner] = useState(false);
//   const [showBatteryScanner, setShowBatteryScanner] = useState(false);
//   const [showStarterScanner, setShowStarterScanner] = useState(false);
//   const [showFipScanner, setShowFipScanner] = useState(false);
//   const [showAlternatorScanner, setShowAlternatorScanner] = useState(false);
//   const [hasCameraPermission, setHasCameraPermission] = useState(false);

//   // Terms and Conditions state
//   const [isTermsAccepted, setIsTermsAccepted] = useState(false);

//   const [formData, setFormData] = useState({
//     inspector_name: '',
//     tire_make: '',
//     tire_make_other: '',
//     battery_make: '',
//     battery_make_other: '',
//     select_date: null,
//     battery_date: null,
//     chassis_no: '',
//     tractor_model: '',
//     engine_no: '',
//     front_right_serial_no: '',
//     rear_right_serial_no: '',
//     front_left_serial_no: '',
//     rear_left_serial_no: '',
//     tractor_starter_serial_no: '',
//     tractor_alternator_no: '',
//     battery_serial_no: '',
//     fip_no: '',
//     dealer_name: '',
//     customer_name: '',
//     customer_father_name: '',
//     customer_address: '',
//     customer_contact: '',
//     pdi_done_by: '',
//     remarks: '',

//     // Delivery-specific customer details
//     delivery_customer_name: '',
//     delivery_customer_father_name: '',
//     delivery_customer_address: '',
//     delivery_customer_contact: '',
//     hypothecation: '',
//     hypothecation_other: '',

//     // Remarks for "No" selections - matching API field names
//     lights_no: '',
//     nuts_no: '',
//     hydraulic_oil_half: '',
//     all_nuts_sealed_no: '',
//     engine_oil_level_half: '',
//     coolant_level_no: '',
//     brake_fluid_level_no: '',
//     greasing_done_no: '',
//     paint_scratches_no: '',
//     toolkit_available_no: '',
//     owner_manual_given_no: '',
//     reflector_sticker_applied_no: '',
//     number_plate_fixed_no: '',
//   });

//   // Image states
//   const [customer_photo, setCustomerPhoto] = useState(null);
//   const [customer_signature, setCustomerSignature] = useState(null);
//   const [manager_signature, setManagerSignature] = useState(null);

//   const [radioValues, setRadioValues] = useState({
//     lights_ok: '1',
//     nuts_ok: '1',
//     tractor_delivered: '1',
//     hydraulic_oil: '1',
//     all_nuts_sealed: '1',
//     engine_oil_level: '1',
//     coolant_level: '1',
//     brake_fluid_level: '1',
//     greasing_done: '1',
//     paint_scratches: '0',
//     toolkit_available: '1',
//     owner_manual_given: '1',
//     reflector_sticker_applied: '1',
//     number_plate_fixed: '0',
//   });

//   const tractorModels = [
//     '3028EN',
//     '3036EN',
//     '3036E',
//     '5105',
//     '5105 4WD',
//     '5050D Gear Pro',
//     '5210 Gear Pro',
//     '5050D 4WD Gear Pro',
//     '5210 4WD Gear Pro',
//     '5310 CRDI',
//     '5310 4WD CRDI',
//     '5405 CRDI',
//     '5405 4WD CRDI',
//     '5075 2WD',
//     '5075 4WD',
//   ];

//   const tireMakes = [
//     'Michelin',
//     'Bridgestone',
//     'Goodyear',
//     'Continental',
//     'Pirelli',
//     'Yokohama',
//     'MRF',
//     'Apollo',
//     'CEAT',
//     'JK Tyre',
//     'Other',
//   ];

//   const batteryMakes = [
//     'Exide',
//     'Amaron',
//     'Lucas',
//     'SF Sonic',
//     'Tata Green',
//     'Exide Industries',
//     'Luminous',
//     'Okaya',
//     'Su-Kam',
//     'Base',
//     'Other',
//   ];

//   const hypothecationOptions = [
//     'John Deere Financial India Private Limited',
//     'The Jammu and Kashmir Bank Limited',
//     'Nil',
//     'Other',
//   ];

//   // Camera Permission Function
//   const requestCameraPermission = async () => {
//     if (Platform.OS === 'android') {
//       try {
//         const granted = await PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.CAMERA,
//           {
//             title: "Camera Permission",
//             message: "This app needs access to your camera to scan QR codes.",
//             buttonNeutral: "Ask Me Later",
//             buttonNegative: "Cancel",
//             buttonPositive: "OK"
//           }
//         );
//         const hasPermission = granted === PermissionsAndroid.RESULTS.GRANTED;
//         setHasCameraPermission(hasPermission);
//         return hasPermission;
//       } catch (err) {
//         console.warn(err);
//         setHasCameraPermission(false);
//         return false;
//       }
//     }
//     setHasCameraPermission(true);
//     return true;
//   };

//   // QR Scanner Handlers
//   const handleChassisScanPress = async () => {
//     const hasPermission = await requestCameraPermission();
//     if (hasPermission) {
//       setShowChassisScanner(true);
//     } else {
//       Alert.alert('Permission Denied', 'Camera permission is required to scan QR codes.');
//     }
//   };

//   const handleEngineScanPress = async () => {
//     const hasPermission = await requestCameraPermission();
//     if (hasPermission) {
//       setShowEngineScanner(true);
//     } else {
//       Alert.alert('Permission Denied', 'Camera permission is required to scan QR codes.');
//     }
//   };

//   const handleBatteryScanPress = async () => {
//     const hasPermission = await requestCameraPermission();
//     if (hasPermission) {
//       setShowBatteryScanner(true);
//     } else {
//       Alert.alert('Permission Denied', 'Camera permission is required to scan QR codes.');
//     }
//   };

//   const handleStarterScanPress = async () => {
//     const hasPermission = await requestCameraPermission();
//     if (hasPermission) {
//       setShowStarterScanner(true);
//     } else {
//       Alert.alert('Permission Denied', 'Camera permission is required to scan QR codes.');
//     }
//   };

//   const handleFipScanPress = async () => {
//     const hasPermission = await requestCameraPermission();
//     if (hasPermission) {
//       setShowFipScanner(true);
//     } else {
//       Alert.alert('Permission Denied', 'Camera permission is required to scan QR codes.');
//     }
//   };

//   const handleAlternatorScanPress = async () => {
//     const hasPermission = await requestCameraPermission();
//     if (hasPermission) {
//       setShowAlternatorScanner(true);
//     } else {
//       Alert.alert('Permission Denied', 'Camera permission is required to scan QR codes.');
//     }
//   };

//   const handleQRCodeRead = (event) => {
//     const scannedValue = event.nativeEvent.codeStringValue;
//     console.log('QR Code Scanned:', scannedValue);
    
//     if (showChassisScanner) {
//       handleInputChange('chassis_no', scannedValue);
//       setShowChassisScanner(false);
//     } else if (showEngineScanner) {
//       handleInputChange('engine_no', scannedValue);
//       setShowEngineScanner(false);
//     } else if (showBatteryScanner) {
//       handleInputChange('battery_serial_no', scannedValue);
//       setShowBatteryScanner(false);
//     } else if (showStarterScanner) {
//       handleInputChange('tractor_starter_serial_no', scannedValue);
//       setShowStarterScanner(false);
//     } else if (showFipScanner) {
//       handleInputChange('fip_no', scannedValue);
//       setShowFipScanner(false);
//     } else if (showAlternatorScanner) {
//       handleInputChange('tractor_alternator_no', scannedValue);
//       setShowAlternatorScanner(false);
//     }
//   };

//   const closeScanner = () => {
//     setShowChassisScanner(false);
//     setShowEngineScanner(false);
//     setShowBatteryScanner(false);
//     setShowStarterScanner(false);
//     setShowFipScanner(false);
//     setShowAlternatorScanner(false);
//   };

//   // Get user ID from AsyncStorage on component mount
//   useEffect(() => {
//     const getUserData = async () => {
//       try {
//         const storedUserId = await AsyncStorage.getItem('userId');
//         if (storedUserId) {
//           setUserId(storedUserId);
//           console.log('User ID loaded:', storedUserId);
//         }
        
//         // Check if we're in edit mode (receiving existing form data)
//         if (route.params?.formData) {
//           const editData = route.params.formData;
//           setIsEditMode(true);
//           setExistingFormId(editData.id);
          
//           // Pre-populate form data with exact API field names
//           setFormData({
//             inspector_name: editData.inspector_name || '',
//             tire_make: editData.tire_make || '',
//             tire_make_other: editData.tire_make_other || '',
//             battery_make: editData.battery_make || '',
//             battery_make_other: editData.battery_make_other || '',
//             select_date: editData.select_date ? new Date(editData.select_date) : null,
//             battery_date: editData.battery_date ? new Date(editData.battery_date) : null,
//             chassis_no: editData.chassis_no || '',
//             tractor_model: editData.tractor_model || '',
//             engine_no: editData.engine_no || '',
//             front_right_serial_no: editData.front_right_serial_no || '',
//             rear_right_serial_no: editData.rear_right_serial_no || '',
//             front_left_serial_no: editData.front_left_serial_no || '',
//             rear_left_serial_no: editData.rear_left_serial_no || '',
//             tractor_starter_serial_no: editData.tractor_starter_serial_no || '',
//             tractor_alternator_no: editData.tractor_alternator_no || '',
//             battery_serial_no: editData.battery_serial_no || '',
//             fip_no: editData.fip_no || '',
//             dealer_name: editData.dealer_name || '',
//             customer_name: editData.customer_name || '',
//             customer_father_name: editData.customer_father_name || '',
//             customer_address: editData.customer_address || '',
//             customer_contact: editData.customer_contact || '',
//             pdi_done_by: editData.pdi_done_by || '',
//             remarks: editData.remarks || '',
//             delivery_customer_name: editData.delivery_customer_name || '',
//             delivery_customer_father_name: editData.delivery_customer_father_name || '',
//             delivery_customer_address: editData.delivery_customer_address || '',
//             delivery_customer_contact: editData.delivery_customer_contact || '',
//             hypothecation: editData.hypothecation || '',
//             hypothecation_other: editData.hypothecation_other || '',
//             // Remarks for "No" selections with exact API field names
//             lights_no: editData.lights_no || '',
//             nuts_no: editData.nuts_no || '',
//             hydraulic_oil_half: editData.hydraulic_oil_half || '',
//             all_nuts_sealed_no: editData.all_nuts_sealed_no || '',
//             engine_oil_level_half: editData.engine_oil_level_half || '',
//             coolant_level_no: editData.coolant_level_no || '',
//             brake_fluid_level_no: editData.brake_fluid_level_no || '',
//             greasing_done_no: editData.greasing_done_no || '',
//             paint_scratches_no: editData.paint_scratches_no || '',
//             toolkit_available_no: editData.toolkit_available_no || '',
//             owner_manual_given_no: editData.owner_manual_given_no || '',
//             reflector_sticker_applied_no: editData.reflector_sticker_applied_no || '',
//             number_plate_fixed_no: editData.number_plate_fixed_no || '',
//           });

//           // Set radio button states with exact API field names
//           setRadioValues({
//             lights_ok: editData.lights_ok?.toString() || '1',
//             nuts_ok: editData.nuts_ok?.toString() || '1',
//             tractor_delivered: editData.tractor_delivered?.toString() || '1',
//             hydraulic_oil: editData.hydraulic_oil?.toString() || '1',
//             all_nuts_sealed: editData.all_nuts_sealed?.toString() || '1',
//             engine_oil_level: editData.engine_oil_level?.toString() || '1',
//             coolant_level: editData.coolant_level?.toString() || '1',
//             brake_fluid_level: editData.brake_fluid_level?.toString() || '1',
//             greasing_done: editData.greasing_done?.toString() || '1',
//             paint_scratches: editData.paint_scratches?.toString() || '0',
//             toolkit_available: editData.toolkit_available?.toString() || '1',
//             owner_manual_given: editData.owner_manual_given?.toString() || '1',
//             reflector_sticker_applied: editData.reflector_sticker_applied?.toString() || '1',
//             number_plate_fixed: editData.number_plate_fixed?.toString() || '0',
//           });

//         }
//       } catch (error) {
//         console.log('Error loading user data:', error);
//       }
//     };

//     getUserData();
//   }, [route.params]);

//   // Generate form number
//   const generateFormNo = () => {
//     const timestamp = new Date().getTime();
//     return `PDI${timestamp}`;
//   };

//   // Camera permissions for image capture
//   const requestCameraPermissionForImage = async () => {
//     if (Platform.OS === 'android') {
//       try {
//         const granted = await PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.CAMERA,
//           {
//             title: "Camera Permission",
//             message: "This app needs access to your camera to take photos.",
//             buttonNeutral: "Ask Me Later",
//             buttonNegative: "Cancel",
//             buttonPositive: "OK"
//           }
//         );
//         return granted === PermissionsAndroid.RESULTS.GRANTED;
//       } catch (err) {
//         console.warn(err);
//         return false;
//       }
//     }
//     return true;
//   };

//   const showImagePickerOptions = (setImageFunction) => {
//     if (Platform.OS === 'ios') {
//       ActionSheetIOS.showActionSheetWithOptions(
//         {
//           options: ['Cancel', 'Take Photo', 'Choose from Library'],
//           cancelButtonIndex: 0,
//         },
//         async (buttonIndex) => {
//           if (buttonIndex === 1) {
//             const hasPermission = await requestCameraPermissionForImage();
//             if (hasPermission) handleCamera(setImageFunction);
//           } else if (buttonIndex === 2) handleImageLibrary(setImageFunction);
//         }
//       );
//     } else {
//       Alert.alert(
//         'Select Image',
//         'Choose an option',
//         [
//           { text: 'Cancel', style: 'cancel' },
//           { text: 'Take Photo', onPress: async () => {
//               const hasPermission = await requestCameraPermissionForImage();
//               if (hasPermission) handleCamera(setImageFunction);
//             }
//           },
//           { text: 'Choose from Library', onPress: () => handleImageLibrary(setImageFunction) },
//         ],
//         { cancelable: true }
//       );
//     }
//   };

//   const handleCamera = (setImageFunction) => {
//     launchCamera(
//       { 
//         mediaType: 'photo', 
//         quality: 0.8, 
//         cameraType: 'back', 
//         saveToPhotos: true,
//         includeBase64: false 
//       },
//       (response) => {
//         if (response.didCancel) return;
//         if (response.error) {
//           Alert.alert('Error', 'Failed to capture image');
//           return;
//         }
//         if (response.assets && response.assets.length > 0) {
//           setImageFunction(response.assets[0]);
//         }
//       }
//     );
//   };

//   const handleImageLibrary = (setImageFunction) => {
//     launchImageLibrary({ 
//       mediaType: 'photo', 
//       quality: 0.8,
//       includeBase64: false 
//     }, (response) => {
//       if (response.didCancel) return;
//       if (response.error) {
//         Alert.alert('Error', 'Failed to select image');
//         return;
//       }
//       if (response.assets && response.assets.length > 0) {
//         setImageFunction(response.assets[0]);
//       }
//     });
//   };

//   const handleInputChange = (field, value) => {
//     setFormData(prev => ({
//       ...prev,
//       [field]: value,
//     }));
//   };

//   const handleRadioChange = (field, value) => {
//     setRadioValues(prev => ({
//       ...prev,
//       [field]: value,
//     }));
//   };

//   const handleModelSelect = model => {
//     handleInputChange('tractor_model', model);
//     setShowModelDropdown(false);
//   };

//   const handleTireSelect = tire => {
//     handleInputChange('tire_make', tire);
//     if (tire !== 'Other') {
//       handleInputChange('tire_make_other', '');
//     }
//     setShowTireDropdown(false);
//   };

//   const handleBatterySelect = battery => {
//     handleInputChange('battery_make', battery);
//     if (battery !== 'Other') {
//       handleInputChange('battery_make_other', '');
//     }
//     setShowBatteryDropdown(false);
//   };

//   const handleHypothecationSelect = option => {
//     handleInputChange('hypothecation', option);
//     if (option !== 'Other') {
//       handleInputChange('hypothecation_other', '');
//     }
//     setShowHypothecationDropdown(false);
//   };

//   const handleDateChange = (event, selectedDate) => {
//     setShowDatePicker(false);
//     if (selectedDate) {
//       handleInputChange('select_date', selectedDate);
//     }
//   };

//   const handleBatteryDateChange = (event, selectedDate) => {
//     setShowBatteryDatePicker(false);
//     if (selectedDate) {
//       handleInputChange('battery_date', selectedDate);
//     }
//   };

//   const validateForm = () => {
//     const requiredFields = [
//       'inspector_name', 'tractor_model', 'chassis_no', 'engine_no',
//       'tire_make', 'front_right_serial_no', 'front_left_serial_no', 'rear_right_serial_no', 'rear_left_serial_no',
//       'battery_make', 'battery_serial_no', 'tractor_starter_serial_no', 'fip_no', 'tractor_alternator_no',
//       'dealer_name', 'customer_name', 'customer_address', 'customer_contact',
//       'pdi_done_by'
//     ];

//     for (const field of requiredFields) {
//       if (!formData[field] || formData[field].toString().trim() === '') {
//         Alert.alert('Validation Error', `Please fill in ${field.replace(/_/g, ' ')}`);
//         return false;
//       }
//     }

//     // Check if terms are accepted when tractor is delivered
//     if (radioValues.tractor_delivered === '1' && !isTermsAccepted) {
//       Alert.alert('Validation Error', 'Please accept the Terms and Conditions');
//       return false;
//     }

//     // Make images optional for updates, required for new forms
//     if (!isEditMode) {
//       if (!customer_photo) {
//         Alert.alert('Validation Error', 'Please add customer photo');
//         return false;
//       }

//       if (!customer_signature) {
//         Alert.alert('Validation Error', 'Please add customer signature');
//         return false;
//       }

//       if (!manager_signature) {
//         Alert.alert('Validation Error', 'Please add manager signature');
//         return false;
//       }
//     }

//     return true;
//   };

//   const prepareFormData = () => {
//     const formDataToSend = new FormData();

//     // For updates, use PUT method and include ID
//     if (isEditMode && existingFormId) {
//       formDataToSend.append('id', existingFormId.toString());
//       console.log('UPDATE MODE - Form ID:', existingFormId);
//     } else {
//       // For new forms, generate new form number
//       formDataToSend.append('form_no', generateFormNo());
//       console.log('CREATE MODE - New Form No:', generateFormNo());
//     }

//     // Common form data for both create and update - EXACT API FIELD NAMES
//     formDataToSend.append('user_id', userId);
//     formDataToSend.append('form_date', new Date().toISOString().split('T')[0]);
//     formDataToSend.append('inspector_name', formData.inspector_name);
//     formDataToSend.append('select_date', formData.select_date ? formData.select_date.toISOString().split('T')[0] : '');
//     formDataToSend.append('tractor_model', formData.tractor_model);
//     formDataToSend.append('chassis_no', formData.chassis_no);
//     formDataToSend.append('engine_no', formData.engine_no);

//     // Tyre and battery (including "Other" values)
//     formDataToSend.append('tire_make', formData.tire_make);
//     formDataToSend.append('tire_make_other', formData.tire_make_other || '');
//     formDataToSend.append('front_right_serial_no', formData.front_right_serial_no);
//     formDataToSend.append('front_left_serial_no', formData.front_left_serial_no);
//     formDataToSend.append('rear_right_serial_no', formData.rear_right_serial_no);
//     formDataToSend.append('rear_left_serial_no', formData.rear_left_serial_no);
//     formDataToSend.append('battery_make', formData.battery_make);
//     formDataToSend.append('battery_make_other', formData.battery_make_other || '');
//     formDataToSend.append('battery_date', formData.battery_date ? formData.battery_date.toISOString().split('T')[0] : '');
//     formDataToSend.append('battery_serial_no', formData.battery_serial_no);
//     formDataToSend.append('tractor_starter_serial_no', formData.tractor_starter_serial_no);
//     formDataToSend.append('fip_no', formData.fip_no);
//     formDataToSend.append('tractor_alternator_no', formData.tractor_alternator_no);
    
//     // Customer details
//     formDataToSend.append('dealer_name', formData.dealer_name);
//     formDataToSend.append('customer_name', formData.customer_name);
//     formDataToSend.append('customer_father_name', formData.customer_father_name || '');
//     formDataToSend.append('customer_address', formData.customer_address);
//     formDataToSend.append('customer_contact', formData.customer_contact);
//     formDataToSend.append('pdi_done_by', formData.pdi_done_by);
//     formDataToSend.append('remarks', formData.remarks || '');

//     // Delivery-specific customer details
//     formDataToSend.append('delivery_customer_name', formData.delivery_customer_name || '');
//     formDataToSend.append('delivery_customer_father_name', formData.delivery_customer_father_name || '');
//     formDataToSend.append('delivery_customer_address', formData.delivery_customer_address || '');
//     formDataToSend.append('delivery_customer_contact', formData.delivery_customer_contact || '');
//     formDataToSend.append('hypothecation', formData.hypothecation || '');
//     formDataToSend.append('hypothecation_other', formData.hypothecation_other || '');

//     // Radio button values (convert to 1/0 for API) - EXACT API FIELD NAMES
//     formDataToSend.append('lights_ok', radioValues.lights_ok);
//     formDataToSend.append('nuts_ok', radioValues.nuts_ok);
//     formDataToSend.append('hydraulic_oil', radioValues.hydraulic_oil);
//     formDataToSend.append('all_nuts_sealed', radioValues.all_nuts_sealed);
//     formDataToSend.append('tractor_delivered', radioValues.tractor_delivered);
//     formDataToSend.append('engine_oil_level', radioValues.engine_oil_level);
//     formDataToSend.append('coolant_level', radioValues.coolant_level);
//     formDataToSend.append('brake_fluid_level', radioValues.brake_fluid_level);
//     formDataToSend.append('greasing_done', radioValues.greasing_done);
//     formDataToSend.append('paint_scratches', radioValues.paint_scratches);
//     formDataToSend.append('toolkit_available', radioValues.toolkit_available);
//     formDataToSend.append('owner_manual_given', radioValues.owner_manual_given);
//     formDataToSend.append('reflector_sticker_applied', radioValues.reflector_sticker_applied);
//     formDataToSend.append('number_plate_fixed', radioValues.number_plate_fixed);

//     // Remarks for "No" selections - EXACT API FIELD NAMES
//     formDataToSend.append('lights_no', formData.lights_no || '');
//     formDataToSend.append('nuts_no', formData.nuts_no || '');
//     formDataToSend.append('hydraulic_oil_half', formData.hydraulic_oil_half || '');
//     formDataToSend.append('all_nuts_sealed_no', formData.all_nuts_sealed_no || '');
//     formDataToSend.append('engine_oil_level_half', formData.engine_oil_level_half || '');
//     formDataToSend.append('coolant_level_no', formData.coolant_level_no || '');
//     formDataToSend.append('brake_fluid_level_no', formData.brake_fluid_level_no || '');
//     formDataToSend.append('greasing_done_no', formData.greasing_done_no || '');
//     formDataToSend.append('paint_scratches_no', formData.paint_scratches_no || '');
//     formDataToSend.append('toolkit_available_no', formData.toolkit_available_no || '');
//     formDataToSend.append('owner_manual_given_no', formData.owner_manual_given_no || '');
//     formDataToSend.append('reflector_sticker_applied_no', formData.reflector_sticker_applied_no || '');
//     formDataToSend.append('number_plate_fixed_no', formData.number_plate_fixed_no || '');

//     // Add delivery date if tractor is delivered
//     if (radioValues.tractor_delivered === '1') {
//       formDataToSend.append('delivery_date', new Date().toISOString().split('T')[0]);
//     }

//     // Add images only if they are newly selected
//     if (customer_photo && customer_photo.uri && !customer_photo.uri.startsWith('http')) {
//       formDataToSend.append('customer_photo', {
//         uri: customer_photo.uri,
//         type: customer_photo.type || 'image/jpeg',
//         name: `customer_photo_${Date.now()}.jpg`,
//       });
//     }

//     if (customer_signature && customer_signature.uri && !customer_signature.uri.startsWith('http')) {
//       formDataToSend.append('customer_signature', {
//         uri: customer_signature.uri,
//         type: customer_signature.type || 'image/jpeg',
//         name: `customer_signature_${Date.now()}.jpg`,
//       });
//     }

//     if (manager_signature && manager_signature.uri && !manager_signature.uri.startsWith('http')) {
//       formDataToSend.append('manager_signature', {
//         uri: manager_signature.uri,
//         type: manager_signature.type || 'image/jpeg',
//         name: `manager_signature_${Date.now()}.jpg`,
//       });
//     }

//     return formDataToSend;
//   };

//   const handleSubmit = async () => {
//     if (!userId) {
//       Alert.alert('Error', 'User ID not found. Please login again.');
//       return;
//     }

//     if (!validateForm()) {
//       return;
//     }

//     setLoading(true);

//     try {
//       const formDataToSend = prepareFormData();
      
//       // Use different endpoints and methods for create vs update
//       let url, method;
      
//       if (isEditMode && existingFormId) {
//         url = `https://argosmob.uk/makroo/public/api/v1/pdi-delivery/form/update`;
//         method = 'post'; // Your API uses POST for update
//         console.log('UPDATE REQUEST - URL:', url, 'Method:', method, 'Form ID:', existingFormId);
//       } else {
//         url = 'https://argosmob.uk/makroo/public/api/v1/pdi-delivery/form/save';
//         method = 'post';
//         console.log('CREATE REQUEST - URL:', url, 'Method:', method);
//       }

//       const config = {
//         method: method,
//         url: url,
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//         data: formDataToSend,
//         timeout: 30000,
//       };

//       console.log('Sending form data...');
//       const response = await axios(config);
//       console.log('API Response:', response.data);

//       let isSuccess = false;
//       let successMessage = '';
//       let errorMessage = '';

//       if (isEditMode) {
//         successMessage = 'PDI Form updated successfully!';
//         errorMessage = 'Failed to update form. Please try again.';
        
//         if (response.data) {
//           if (response.data.status === true || response.data.success === true) {
//             isSuccess = true;
//           } else if (response.data.message && response.data.message.toLowerCase().includes('success')) {
//             isSuccess = true;
//           } else if (response.data.message && response.data.message.toLowerCase().includes('updated')) {
//             isSuccess = true;
//           }
//         }
//       } else {
//         successMessage = 'PDI Form submitted successfully!';
//         errorMessage = 'Failed to submit form. Please try again.';
        
//         if (response.data) {
//           if (response.data.status === true || response.data.success === true) {
//             isSuccess = true;
//           } else if (response.data.message && response.data.message.toLowerCase().includes('success')) {
//             isSuccess = true;
//           } else if (response.data.message && response.data.message.toLowerCase().includes('created')) {
//             isSuccess = true;
//           } else if (response.data.message && response.data.message.toLowerCase().includes('saved')) {
//             isSuccess = true;
//           }
//         }
//       }

//       if (response.status === 200 || response.status === 201) {
//         if (!isSuccess) {
//           isSuccess = true;
//           console.log('Success detected from HTTP status');
//         }
//       }

//       if (isSuccess) {
//         Alert.alert(
//           'Success', 
//           successMessage,
//           [
//             {
//               text: 'OK',
//               onPress: () => {
//                 if (isEditMode) {
//                   navigation.goBack();
//                 } else {
//                   // Reset form for new entry
//                   setFormData({
//                     inspector_name: '',
//                     tire_make: '',
//                     tire_make_other: '',
//                     battery_make: '',
//                     battery_make_other: '',
//                     select_date: null,
//                     battery_date: null,
//                     chassis_no: '',
//                     tractor_model: '',
//                     engine_no: '',
//                     front_right_serial_no: '',
//                     rear_right_serial_no: '',
//                     front_left_serial_no: '',
//                     rear_left_serial_no: '',
//                     tractor_starter_serial_no: '',
//                     tractor_alternator_no: '',
//                     battery_serial_no: '',
//                     fip_no: '',
//                     dealer_name: '',
//                     customer_name: '',
//                     customer_father_name: '',
//                     customer_address: '',
//                     customer_contact: '',
//                     pdi_done_by: '',
//                     remarks: '',
//                     delivery_customer_name: '',
//                     delivery_customer_father_name: '',
//                     delivery_customer_address: '',
//                     delivery_customer_contact: '',
//                     hypothecation: '',
//                     hypothecation_other: '',
//                     lights_no: '',
//                     nuts_no: '',
//                     hydraulic_oil_half: '',
//                     all_nuts_sealed_no: '',
//                     engine_oil_level_half: '',
//                     coolant_level_no: '',
//                     brake_fluid_level_no: '',
//                     greasing_done_no: '',
//                     paint_scratches_no: '',
//                     toolkit_available_no: '',
//                     owner_manual_given_no: '',
//                     reflector_sticker_applied_no: '',
//                     number_plate_fixed_no: '',
//                   });
//                   setRadioValues({
//                     lights_ok: '1',
//                     nuts_ok: '1',
//                     tractor_delivered: '1',
//                     hydraulic_oil: '1',
//                     all_nuts_sealed: '1',
//                     engine_oil_level: '1',
//                     coolant_level: '1',
//                     brake_fluid_level: '1',
//                     greasing_done: '1',
//                     paint_scratches: '',
//                     toolkit_available: '1',
//                     owner_manual_given: '1',
//                     reflector_sticker_applied: '1',
//                     number_plate_fixed: '1',
//                   });
//                   setCustomerPhoto(null);
//                   setCustomerSignature(null);
//                   setManagerSignature(null);
//                   setIsTermsAccepted(false);
//                 }
//               }
//             }
//           ]
//         );
//       } else {
//         const serverErrorMessage = response.data?.message || response.data?.error || errorMessage;
//         Alert.alert(
//           isEditMode ? 'Update Failed' : 'Submission Failed', 
//           serverErrorMessage
//         );
//       }

//     } catch (error) {
//       console.log('Submission Error:', error);
//       console.log('Error details:', error.response?.data);
      
//       let errorMessage = 'Something went wrong. Please try again.';
      
//       if (error.response) {
//         const serverError = error.response.data;
//         errorMessage = serverError.message || serverError.error || `Server error: ${error.response.status}`;
//       } else if (error.request) {
//         errorMessage = 'Network error. Please check your internet connection.';
//       }
      
//       Alert.alert(
//         isEditMode ? 'Update Failed' : 'Submission Failed', 
//         errorMessage
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleHome = () => {
//     navigation.navigate('Dashboard');
//   };

//   const handleDateIconPress = () => {
//     setShowDatePicker(true);
//   };

//   const handleBatteryDateIconPress = () => {
//     setShowBatteryDatePicker(true);
//   };

//   const renderModelItem = ({item}) => (
//     <TouchableOpacity
//       style={styles.modelItem}
//       onPress={() => handleModelSelect(item)}>
//       <Text style={styles.modelItemText}>{item}</Text>
//     </TouchableOpacity>
//   );

//   const renderTireItem = ({item}) => (
//     <TouchableOpacity
//       style={styles.modelItem}
//       onPress={() => handleTireSelect(item)}>
//       <Text style={styles.modelItemText}>{item}</Text>
//     </TouchableOpacity>
//   );

//   const renderBatteryItem = ({item}) => (
//     <TouchableOpacity
//       style={styles.modelItem}
//       onPress={() => handleBatterySelect(item)}>
//       <Text style={styles.modelItemText}>{item}</Text>
//     </TouchableOpacity>
//   );

//   const renderHypothecationItem = ({item}) => (
//     <TouchableOpacity
//       style={styles.modelItem}
//       onPress={() => handleHypothecationSelect(item)}>
//       <Text style={styles.modelItemText}>{item}</Text>
//     </TouchableOpacity>
//   );

//   // QR Scanner Component
//   const renderQRScanner = () => (
//     <Modal
//       visible={showChassisScanner || showEngineScanner || showBatteryScanner || showStarterScanner || showFipScanner || showAlternatorScanner}
//       animationType="slide"
//       transparent={false}
//       onRequestClose={closeScanner}
//     >
//       <View style={styles.scannerContainer}>
//         <View style={styles.scannerHeader}>
//           <TouchableOpacity onPress={closeScanner} style={styles.scannerCloseButton}>
//             <Icon name="close" size={24} color="#fff" />
//           </TouchableOpacity>
//           <Text style={styles.scannerTitle}>
//             {showChassisScanner ? 'Scan Chassis Number' : 
//              showEngineScanner ? 'Scan Engine Number' :
//              showBatteryScanner ? 'Scan Battery Serial Number' :
//              showStarterScanner ? 'Scan Starter Serial Number' :
//              showFipScanner ? 'Scan FIP Number' :
//              'Scan Alternator Number'}
//           </Text>
//         </View>
        
//         <Camera
//           style={styles.camera}
//           cameraOptions={{
//             flashMode: 'auto',
//             focusMode: 'on',
//             zoomMode: 'on',
//           }}
//           scanBarcode={true}
//           showFrame={true}
//           laserColor="red"
//           frameColor="white"
//           onReadCode={handleQRCodeRead}
//         />
        
//         <View style={styles.scannerFooter}>
//           <Text style={styles.scannerInstructions}>
//             Point your camera at a QR code to scan
//           </Text>
//         </View>
//       </View>
//     </Modal>
//   );

//   return (
//     <View
//       style={{flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom}}>
//       {/* Header */}
//       <LinearGradient
//         colors={['#7E5EA9', '#20AEBC']}
//         start={{x: 0, y: 0}}
//         end={{x: 1, y: 0}}
//         style={styles.header}>
//         <Text style={styles.companyName}>Makroo Motor Corporation</Text>
//         <Text style={styles.companyName}>Pre Delivery Inspection</Text>
//         <Text style={styles.companyName}>Form</Text>
//       </LinearGradient>

//       <ScrollView style={styles.container}>
//         {/* Date and Form No */}
//         <Text style={styles.Date}>{new Date().toLocaleDateString()}</Text>
//         {isEditMode && (
//           <View style={styles.editModeContainer}>
//             <Text style={styles.editModeText}>Edit Mode - Updating Form ID: {existingFormId}</Text>
//           </View>
//         )}

//         {/* Form Fields */}
//         <View style={styles.formContainer}>
//           {/* Inspector + Date */}
//           <View style={styles.row}>
//             <View style={styles.inputContainer}>
//               <LinearGradient
//                 colors={['#7E5EA9', '#20AEBC']}
//                 style={styles.inputGradient}>
//                 <TextInput
//                   style={styles.input}
//                   value={formData.inspector_name}
//                   onChangeText={text =>
//                     handleInputChange('inspector_name', text)
//                   }
//                   placeholder="Inspector Name"
//                   placeholderTextColor="#666"
//                   editable={!loading}
//                 />
//               </LinearGradient>
//             </View>
//             <View style={styles.inputContainer}>
//               <LinearGradient
//                 colors={['#7E5EA9', '#20AEBC']}
//                 style={styles.inputGradient}>
//                 <View style={styles.inputWithIcon}>
//                   <TouchableOpacity
//                     style={[styles.input, styles.inputWithIconField]}
//                     onPress={handleDateIconPress}
//                     disabled={loading}
//                   >
//                     <Text style={ formData.select_date ? styles.selectedModelText : styles.placeholderText }>
//                       {formData.select_date ? formData.select_date.toLocaleDateString() : 'Select Date'}
//                     </Text>
//                   </TouchableOpacity>
//                   <TouchableOpacity
//                     onPress={handleDateIconPress}
//                     style={styles.iconButton}
//                     disabled={loading}
//                   >
//                     <Icon name="calendar-today" size={20} color="#666" />
//                   </TouchableOpacity>
//                 </View>
//                 {showDatePicker && (
//                   <DateTimePicker
//                     value={formData.select_date || new Date()}
//                     mode="date"
//                     display={Platform.OS === 'ios' ? 'spinner' : 'default'}
//                     onChange={handleDateChange}
//                   />
//                 )}
//               </LinearGradient>
//             </View>
//           </View>

//           {/* Tractor Model + Chassis No */}
//           <View style={styles.row}>
//             <View style={styles.inputContainer}>
//               <LinearGradient
//                 colors={['#7E5EA9', '#20AEBC']}
//                 style={styles.inputGradient}>
//                 <TouchableOpacity
//                   style={styles.input}
//                   onPress={() => setShowModelDropdown(true)}
//                   disabled={loading}
//                 >
//                   <Text
//                     style={
//                       formData.tractor_model
//                         ? styles.selectedModelText
//                         : styles.placeholderText
//                     }>
//                     {formData.tractor_model || 'Select Tractor Model'}
//                   </Text>
//                   <Icon
//                     name="keyboard-arrow-down"
//                     size={25}
//                     color="#666"
//                     style={styles.dropdownIcon}
//                   />
//                 </TouchableOpacity>
//               </LinearGradient>
//             </View>
//             <View style={styles.inputContainer}>
//               <LinearGradient
//                 colors={['#7E5EA9', '#20AEBC']}
//                 style={styles.inputGradient}>
//                 <View style={styles.inputWithIcon}>
//                   <TextInput
//                     style={[styles.input, styles.inputWithIconField]}
//                     value={formData.chassis_no}
//                     onChangeText={text => handleInputChange('chassis_no', text)}
//                     placeholder="Chassis No."
//                     placeholderTextColor="#666"
//                     editable={!loading}
//                   />
//                   <TouchableOpacity
//                     onPress={handleChassisScanPress}
//                     style={styles.iconButton}
//                     disabled={loading}
//                   >
//                     <Icon name="qr-code-scanner" size={20} color="#666" />
//                   </TouchableOpacity>
//                 </View>
//               </LinearGradient>
//             </View>
//           </View>

//           {/* Engine No */}
//           <View style={styles.row}>
//             <View style={styles.inputContainer}>
//               <LinearGradient
//                 colors={['#7E5EA9', '#20AEBC']}
//                 style={styles.inputGradient}>
//                 <View style={styles.inputWithIcon}>
//                   <TextInput
//                     style={[styles.input, styles.inputWithIconField]}
//                     value={formData.engine_no}
//                     onChangeText={text => handleInputChange('engine_no', text)}
//                     placeholder="Engine No."
//                     placeholderTextColor="#666"
//                     editable={!loading}
//                   />
//                   <TouchableOpacity
//                     onPress={handleEngineScanPress}
//                     style={styles.iconButton}
//                     disabled={loading}
//                   >
//                     <Icon name="qr-code-scanner" size={20} color="#666" />
//                   </TouchableOpacity>
//                 </View>
//               </LinearGradient>
//             </View>
//             <View style={styles.inputContainer}></View>
//           </View>

//           {/* Customer Details Heading */}
//           <View style={styles.sectionHeading}>
//             <Text style={styles.sectionHeadingText}>Customer Details:</Text>
//           </View>

//           {/* Dealer Name + Customer Name */}
//           <View style={styles.row}>
//             <View style={styles.inputContainer}>
//               <LinearGradient
//                 colors={['#7E5EA9', '#20AEBC']}
//                 style={styles.inputGradient}>
//                 <TextInput
//                   style={styles.input}
//                   value={formData.dealer_name}
//                   onChangeText={text => handleInputChange('dealer_name', text)}
//                   placeholder="Dealer Name"
//                   placeholderTextColor="#666"
//                   editable={!loading}
//                 />
//               </LinearGradient>
//             </View>
//             <View style={styles.inputContainer}>
//               <LinearGradient
//                 colors={['#7E5EA9', '#20AEBC']}
//                 style={styles.inputGradient}>
//                 <TextInput
//                   style={styles.input}
//                   value={formData.customer_name}
//                   onChangeText={text => handleInputChange('customer_name', text)}
//                   placeholder="Customer Name"
//                   placeholderTextColor="#666"
//                   editable={!loading}
//                 />
//               </LinearGradient>
//             </View>
//           </View>

//           {/* Customer Father's Name */}
//           <View style={styles.row}>
//             <View style={styles.inputContainer}>
//               <LinearGradient colors={['#7E5EA9', '#20AEBC']} style={styles.inputGradient}>
//                 <TextInput
//                   style={styles.input}
//                   value={formData.customer_father_name}
//                   onChangeText={text => handleInputChange('customer_father_name', text)}
//                   placeholder="Father's Name"
//                   placeholderTextColor="#666"
//                   editable={!loading}
//                 />
//               </LinearGradient>
//             </View>
//           </View>

//           {/* Customer Address */}
//           <View style={styles.row}>
//             <View style={styles.inputContainer}>
//               <LinearGradient
//                 colors={['#7E5EA9', '#20AEBC']}
//                 style={styles.inputGradient}>
//                 <TextInput
//                   style={styles.input}
//                   value={formData.customer_address}
//                   onChangeText={text => handleInputChange('customer_address', text)}
//                   placeholder="Customer Address"
//                   placeholderTextColor="#666"
//                   editable={!loading}
//                   multiline
//                 />
//               </LinearGradient>
//             </View>
//             <View style={styles.inputContainer}>
//               <LinearGradient
//                 colors={['#7E5EA9', '#20AEBC']}
//                 style={styles.inputGradient}>
//                 <TextInput
//                   style={styles.input}
//                   value={formData.customer_contact}
//                   onChangeText={text => handleInputChange('customer_contact', text)}
//                   placeholder="Customer Contact"
//                   placeholderTextColor="#666"
//                   keyboardType="phone-pad"
//                   editable={!loading}
//                 />
//               </LinearGradient>
//             </View>
//           </View>

//           {/* Tyre Details Heading */}
//           <View style={styles.sectionHeading}>
//             <Text style={styles.sectionHeadingText}>Tire Details:</Text>
//           </View>

//           {/* Select Tire Make */}
//           <View style={styles.row}>
//             <View style={styles.inputContainer}>
//               <LinearGradient
//                 colors={['#7E5EA9', '#20AEBC']}
//                 style={styles.inputGradient}>
//                 <TouchableOpacity
//                   style={styles.input}
//                   onPress={() => setShowTireDropdown(true)}
//                   disabled={loading}
//                 >
//                   <Text
//                     style={
//                       formData.tire_make
//                         ? styles.selectedModelText
//                         : styles.placeholderText
//                     }>
//                     {formData.tire_make || 'Select Tyre Make'}
//                   </Text>
//                   <Icon
//                     name="keyboard-arrow-down"
//                     size={25}
//                     color="#666"
//                     style={styles.dropdownIcon}
//                   />
//                 </TouchableOpacity>
//               </LinearGradient>
//             </View>
//             <View style={styles.inputContainer}></View>
//           </View>

//           {/* If "Other" selected for tyre make, show TextInput */}
//           {formData.tire_make === 'Other' && (
//             <View style={styles.row}>
//               <View style={styles.inputContainer}>
//                 <LinearGradient colors={['#7E5EA9', '#20AEBC']} style={styles.inputGradient}>
//                   <TextInput
//                     style={styles.input}
//                     value={formData.tire_make_other}
//                     onChangeText={text => handleInputChange('tire_make_other', text)}
//                     placeholder="Enter Other Tire Make"
//                     placeholderTextColor="#666"
//                     editable={!loading}
//                   />
//                 </LinearGradient>
//               </View>
//               <View style={styles.inputContainer}></View>
//             </View>
//           )}

//           {/* Front Right + Front Left */}
//           <View style={styles.row}>
//             <View style={styles.inputContainer}>
//               <LinearGradient
//                 colors={['#7E5EA9', '#20AEBC']}
//                 style={styles.inputGradient}>
//                 <TextInput
//                   style={styles.input}
//                   value={formData.front_right_serial_no}
//                   onChangeText={text => handleInputChange('front_right_serial_no', text)}
//                   placeholder="Front Right Serial No."
//                   placeholderTextColor="#666"
//                   editable={!loading}
//                 />
//               </LinearGradient>
//             </View>
//             <View style={styles.inputContainer}>
//               <LinearGradient
//                 colors={['#7E5EA9', '#20AEBC']}
//                 style={styles.inputGradient}>
//                 <TextInput
//                   style={styles.input}
//                   value={formData.front_left_serial_no}
//                   onChangeText={text => handleInputChange('front_left_serial_no', text)}
//                   placeholder="Front Left Serial No."
//                   placeholderTextColor="#666"
//                   editable={!loading}
//                 />
//               </LinearGradient>
//             </View>
//           </View>

//           {/* Rear Right + Rear Left */}
//           <View style={styles.row}>
//             <View style={styles.inputContainer}>
//               <LinearGradient
//                 colors={['#7E5EA9', '#20AEBC']}
//                 style={styles.inputGradient}>
//                 <TextInput
//                   style={styles.input}
//                   value={formData.rear_right_serial_no}
//                   onChangeText={text => handleInputChange('rear_right_serial_no', text)}
//                   placeholder="Rear Right Serial No."
//                   placeholderTextColor="#666"
//                   editable={!loading}
//                 />
//               </LinearGradient>
//             </View>
//             <View style={styles.inputContainer}>
//               <LinearGradient
//                 colors={['#7E5EA9', '#20AEBC']}
//                 style={styles.inputGradient}>
//                 <TextInput
//                   style={styles.input}
//                   value={formData.rear_left_serial_no}
//                   onChangeText={text => handleInputChange('rear_left_serial_no', text)}
//                   placeholder="Rear Left Serial No."
//                   placeholderTextColor="#666"
//                   editable={!loading}
//                 />
//               </LinearGradient>
//             </View>
//           </View>

//           {/* Battery Details Heading */}
//           <View style={styles.sectionHeading}>
//             <Text style={styles.sectionHeadingText}>Battery Details:</Text>
//           </View>

//           {/* Select Battery Make */}
//           <View style={styles.row}>
//             <View style={styles.inputContainer}>
//               <LinearGradient
//                 colors={['#7E5EA9', '#20AEBC']}
//                 style={styles.inputGradient}>
//                 <TouchableOpacity
//                   style={styles.input}
//                   onPress={() => setShowBatteryDropdown(true)}
//                   disabled={loading}
//                 >
//                   <Text
//                     style={
//                       formData.battery_make
//                         ? styles.selectedModelText
//                         : styles.placeholderText
//                     }>
//                     {formData.battery_make || 'Select Battery Make'}
//                   </Text>
//                   <Icon
//                     name="keyboard-arrow-down"
//                     size={25}
//                     color="#666"
//                     style={styles.dropdownIcon}
//                   />
//                 </TouchableOpacity>
//               </LinearGradient>
//             </View>
//             <View style={styles.inputContainer}></View>
//           </View>

//           {/* If "Other" selected for battery make, show TextInput */}
//           {formData.battery_make === 'Other' && (
//             <View style={styles.row}>
//               <View style={styles.inputContainer}>
//                 <LinearGradient colors={['#7E5EA9', '#20AEBC']} style={styles.inputGradient}>
//                   <TextInput
//                     style={styles.input}
//                     value={formData.battery_make_other}
//                     onChangeText={text => handleInputChange('battery_make_other', text)}
//                     placeholder="Enter Other Battery Make"
//                     placeholderTextColor="#666"
//                     editable={!loading}
//                   />
//                 </LinearGradient>
//               </View>
//               <View style={styles.inputContainer}></View>
//             </View>
//           )}

//           {/* Battery Date */}
//           <View style={styles.row}>
//             <View style={styles.inputContainer}>
//               <LinearGradient colors={['#7E5EA9', '#20AEBC']} style={styles.inputGradient}>
//                 <View style={styles.inputWithIcon}>
//                   <TouchableOpacity
//                     style={[styles.input, styles.inputWithIconField]}
//                     onPress={handleBatteryDateIconPress}
//                     disabled={loading}
//                   >
//                     <Text style={ formData.battery_date ? styles.selectedModelText : styles.placeholderText }>
//                       {formData.battery_date ? formData.battery_date.toLocaleDateString() : 'Select Battery Date'}
//                     </Text>
//                   </TouchableOpacity>
//                   <TouchableOpacity
//                     onPress={handleBatteryDateIconPress}
//                     style={styles.iconButton}
//                     disabled={loading}
//                   >
//                     <Icon name="calendar-today" size={20} color="#666" />
//                   </TouchableOpacity>
//                 </View>
//                 {showBatteryDatePicker && (
//                   <DateTimePicker
//                     value={formData.battery_date || new Date()}
//                     mode="date"
//                     display={Platform.OS === 'ios' ? 'spinner' : 'default'}
//                     onChange={handleBatteryDateChange}
//                   />
//                 )}
//               </LinearGradient>
//             </View>
//           </View>

//           {/* Battery Serial No + Tractor Starter Serial No */}
//           <View style={styles.row}>
//             <View style={styles.inputContainer}>
//               <LinearGradient
//                 colors={['#7E5EA9', '#20AEBC']}
//                 style={styles.inputGradient}>
//                 <View style={styles.inputWithIcon}>
//                   <TextInput
//                     style={[styles.input, styles.inputWithIconField]}
//                     value={formData.battery_serial_no}
//                     onChangeText={text => handleInputChange('battery_serial_no', text)}
//                     placeholder="Battery Serial No."
//                     placeholderTextColor="#666"
//                     editable={!loading}
//                   />
//                   <TouchableOpacity
//                     onPress={handleBatteryScanPress}
//                     style={styles.iconButton}
//                     disabled={loading}
//                   >
//                     <Icon name="qr-code-scanner" size={20} color="#666" />
//                   </TouchableOpacity>
//                 </View>
//               </LinearGradient>
//             </View>
//             <View style={styles.inputContainer}>
//               <LinearGradient
//                 colors={['#7E5EA9', '#20AEBC']}
//                 style={styles.inputGradient}>
//                 <View style={styles.inputWithIcon}>
//                   <TextInput
//                     style={[styles.input, styles.inputWithIconField]}
//                     value={formData.tractor_starter_serial_no}
//                     onChangeText={text => handleInputChange('tractor_starter_serial_no', text)}
//                     placeholder="Tractor Starter Serial No."
//                     placeholderTextColor="#666"
//                     editable={!loading}
//                   />
//                   <TouchableOpacity
//                     onPress={handleStarterScanPress}
//                     style={styles.iconButton}
//                     disabled={loading}
//                   >
//                     <Icon name="qr-code-scanner" size={20} color="#666" />
//                   </TouchableOpacity>
//                 </View>
//               </LinearGradient>
//             </View>
//           </View>

//           {/* FIP No + Tractor Alternator No */}
//           <View style={styles.row}>
//             <View style={styles.inputContainer}>
//               <LinearGradient
//                 colors={['#7E5EA9', '#20AEBC']}
//                 style={styles.inputGradient}>
//                 <View style={styles.inputWithIcon}>
//                   <TextInput
//                     style={[styles.input, styles.inputWithIconField]}
//                     value={formData.fip_no}
//                     onChangeText={text => handleInputChange('fip_no', text)}
//                     placeholder="FIP No."
//                     placeholderTextColor="#666"
//                     editable={!loading}
//                   />
//                   <TouchableOpacity
//                     onPress={handleFipScanPress}
//                     style={styles.iconButton}
//                     disabled={loading}
//                   >
//                     <Icon name="qr-code-scanner" size={20} color="#666" />
//                   </TouchableOpacity>
//                 </View>
//               </LinearGradient>
//             </View>
//             <View style={styles.inputContainer}>
//               <LinearGradient
//                 colors={['#7E5EA9', '#20AEBC']}
//                 style={styles.inputGradient}>
//                 <View style={styles.inputWithIcon}>
//                   <TextInput
//                     style={[styles.input, styles.inputWithIconField]}
//                     value={formData.tractor_alternator_no}
//                     onChangeText={text => handleInputChange('tractor_alternator_no', text)}
//                     placeholder="Tractor Alternator No."
//                     placeholderTextColor="#666"
//                     editable={!loading}
//                   />
//                   <TouchableOpacity
//                     onPress={handleAlternatorScanPress}
//                     style={styles.iconButton}
//                     disabled={loading}
//                   >
//                     <Icon name="qr-code-scanner" size={20} color="#666" />
//                   </TouchableOpacity>
//                 </View>
//               </LinearGradient>
//             </View>
//           </View>

//           {/* PDI Done By + Remarks */}
//           <View style={styles.row}>
//             <View style={styles.inputContainer}>
//               <LinearGradient
//                 colors={['#7E5EA9', '#20AEBC']}
//                 style={styles.inputGradient}>
//                 <TextInput
//                   style={styles.input}
//                   value={formData.pdi_done_by}
//                   onChangeText={text => handleInputChange('pdi_done_by', text)}
//                   placeholder="PDI Done By"
//                   placeholderTextColor="#666"
//                   editable={!loading}
//                 />
//               </LinearGradient>
//             </View>
//             <View style={styles.inputContainer}>
//               <LinearGradient
//                 colors={['#7E5EA9', '#20AEBC']}
//                 style={styles.inputGradient}>
//                 <TextInput
//                   style={styles.input}
//                   value={formData.remarks}
//                   onChangeText={text => handleInputChange('remarks', text)}
//                   placeholder="Remarks"
//                   placeholderTextColor="#666"
//                   editable={!loading}
//                   multiline
//                 />
//               </LinearGradient>
//             </View>
//           </View>
//         </View>

//         {/* Tractor Model Modal */}
//         <Modal
//           visible={showModelDropdown}
//           transparent={true}
//           animationType="slide"
//           onRequestClose={() => setShowModelDropdown(false)}>
//           <View style={styles.modalOverlay}>
//             <View style={styles.modalContent}>
//               <View style={styles.modalHeader}>
//                 <Text style={styles.modalTitle}>Select Tractor Model</Text>
//                 <TouchableOpacity
//                   onPress={() => setShowModelDropdown(false)}
//                   style={styles.closeButton}>
//                   <Icon name="close" size={24} color="#000" />
//                 </TouchableOpacity>
//               </View>
//               <FlatList
//                 data={tractorModels}
//                 renderItem={renderModelItem}
//                 keyExtractor={(item, index) => index.toString()}
//                 style={styles.modelList}
//               />
//             </View>
//           </View>
//         </Modal>

//         {/* Tire Make Modal */}
//         <Modal
//           visible={showTireDropdown}
//           transparent={true}
//           animationType="slide"
//           onRequestClose={() => setShowTireDropdown(false)}>
//           <View style={styles.modalOverlay}>
//             <View style={styles.modalContent}>
//               <View style={styles.modalHeader}>
//                 <Text style={styles.modalTitle}>Select Tire Make</Text>
//                 <TouchableOpacity
//                   onPress={() => setShowTireDropdown(false)}
//                   style={styles.closeButton}>
//                   <Icon name="close" size={24} color="#000" />
//                 </TouchableOpacity>
//               </View>
//               <FlatList
//                 data={tireMakes}
//                 renderItem={renderTireItem}
//                 keyExtractor={(item, index) => index.toString()}
//                 style={styles.modelList}
//               />
//             </View>
//           </View>
//         </Modal>

//         {/* Battery Make Modal */}
//         <Modal
//           visible={showBatteryDropdown}
//           transparent={true}
//           animationType="slide"
//           onRequestClose={() => setShowBatteryDropdown(false)}>
//           <View style={styles.modalOverlay}>
//             <View style={styles.modalContent}>
//               <View style={styles.modalHeader}>
//                 <Text style={styles.modalTitle}>Select Battery Make</Text>
//                 <TouchableOpacity
//                   onPress={() => setShowBatteryDropdown(false)}
//                   style={styles.closeButton}>
//                   <Icon name="close" size={24} color="#000" />
//                 </TouchableOpacity>
//               </View>
//               <FlatList
//                 data={batteryMakes}
//                 renderItem={renderBatteryItem}
//                 keyExtractor={(item, index) => index.toString()}
//                 style={styles.modelList}
//               />
//             </View>
//           </View>
//         </Modal>

//         {/* Hypothecation Modal */}
//         <Modal
//           visible={showHypothecationDropdown}
//           transparent={true}
//           animationType="slide"
//           onRequestClose={() => setShowHypothecationDropdown(false)}>
//           <View style={styles.modalOverlay}>
//             <View style={styles.modalContent}>
//               <View style={styles.modalHeader}>
//                 <Text style={styles.modalTitle}>Select Hypothecation</Text>
//                 <TouchableOpacity
//                   onPress={() => setShowHypothecationDropdown(false)}
//                   style={styles.closeButton}>
//                   <Icon name="close" size={24} color="#000" />
//                 </TouchableOpacity>
//               </View>
//               <FlatList
//                 data={hypothecationOptions}
//                 renderItem={renderHypothecationItem}
//                 keyExtractor={(item, index) => index.toString()}
//                 style={styles.modelList}
//               />
//             </View>
//           </View>
//         </Modal>

//         {/* QR Scanner Modal */}
//         {renderQRScanner()}

//         {/* Radio Sections */}
//         <View style={styles.radioSection}>
//           <Text style={styles.radioLabel}>Lights OK:</Text>
//           {renderYesNo('lights_ok')}
//           {radioValues.lights_ok === '0' && (
//             <View style={styles.remarkInputContainer}>
//               <LinearGradient colors={['#7E5EA9', '#20AEBC']} style={styles.inputGradient}>
//                 <TextInput
//                   style={styles.remarkInput}
//                   value={formData.lights_no}
//                   onChangeText={text => handleInputChange('lights_no', text)}
//                   placeholder="Remark for Lights OK ?"
//                   placeholderTextColor="#666"
//                   editable={!loading}
//                   multiline
//                 />
//               </LinearGradient>
//             </View>
//           )}

//           <Text style={styles.radioLabel}>Nuts OK:</Text>
//           {renderYesNo('nuts_ok')}
//           {radioValues.nuts_ok === '0' && (
//             <View style={styles.remarkInputContainer}>
//               <LinearGradient colors={['#7E5EA9', '#20AEBC']} style={styles.inputGradient}>
//                 <TextInput
//                   style={styles.remarkInput}
//                   value={formData.nuts_no}
//                   onChangeText={text => handleInputChange('nuts_no', text)}
//                   placeholder="Remark for Nuts OK ?"
//                   placeholderTextColor="#666"
//                   editable={!loading}
//                   multiline
//                 />
//               </LinearGradient>
//             </View>
//           )}

//           <Text style={styles.radioLabel}>Hydraulic Oil:</Text>
//           {renderFullHalf('hydraulic_oil')}
//           {radioValues.hydraulic_oil === '0' && (
//             <View style={styles.remarkInputContainer}>
//               <LinearGradient colors={['#7E5EA9', '#20AEBC']} style={styles.inputGradient}>
//                 <TextInput
//                   style={styles.remarkInput}
//                   value={formData.hydraulic_oil_half}
//                   onChangeText={text => handleInputChange('hydraulic_oil_half', text)}
//                   placeholder="Remark for Hydraulic Oil ?"
//                   placeholderTextColor="#666"
//                   editable={!loading}
//                   multiline
//                 />
//               </LinearGradient>
//             </View>
//           )}

//           <Text style={styles.radioLabel}>All Nuts Are Sealed:</Text>
//           {renderYesNo('all_nuts_sealed')}
//           {radioValues.all_nuts_sealed === '0' && (
//             <View style={styles.remarkInputContainer}>
//               <LinearGradient colors={['#7E5EA9', '#20AEBC']} style={styles.inputGradient}>
//                 <TextInput
//                   style={styles.remarkInput}
//                   value={formData.all_nuts_sealed_no}
//                   onChangeText={text => handleInputChange('all_nuts_sealed_no', text)}
//                   placeholder="Remark for All Nuts Are Sealed ?"
//                   placeholderTextColor="#666"
//                   editable={!loading}
//                   multiline
//                 />
//               </LinearGradient>
//             </View>
//           )}

//           <Text style={styles.radioLabel}>Engine Oil Level:</Text>
//           {renderYesNo('engine_oil_level')}
//           {radioValues.engine_oil_level === '0' && (
//             <View style={styles.remarkInputContainer}>
//               <LinearGradient colors={['#7E5EA9', '#20AEBC']} style={styles.inputGradient}>
//                 <TextInput
//                   style={styles.remarkInput}
//                   value={formData.engine_oil_level_half}
//                   onChangeText={text => handleInputChange('engine_oil_level_half', text)}
//                   placeholder="Remark for Engine Oil Level ?"
//                   placeholderTextColor="#666"
//                   editable={!loading}
//                   multiline
//                 />
//               </LinearGradient>
//             </View>
//           )}

//           <Text style={styles.radioLabel}>Coolant Level:</Text>
//           {renderYesNo('coolant_level')}
//           {radioValues.coolant_level === '0' && (
//             <View style={styles.remarkInputContainer}>
//               <LinearGradient colors={['#7E5EA9', '#20AEBC']} style={styles.inputGradient}>
//                 <TextInput
//                   style={styles.remarkInput}
//                   value={formData.coolant_level_no}
//                   onChangeText={text => handleInputChange('coolant_level_no', text)}
//                   placeholder="Remark for Coolant Level ?"
//                   placeholderTextColor="#666"
//                   editable={!loading}
//                   multiline
//                 />
//               </LinearGradient>
//             </View>
//           )}

//           <Text style={styles.radioLabel}>Brake Fluid Level:</Text>
//           {renderYesNo('brake_fluid_level')}
//           {radioValues.brake_fluid_level === '0' && (
//             <View style={styles.remarkInputContainer}>
//               <LinearGradient colors={['#7E5EA9', '#20AEBC']} style={styles.inputGradient}>
//                 <TextInput
//                   style={styles.remarkInput}
//                   value={formData.brake_fluid_level_no}
//                   onChangeText={text => handleInputChange('brake_fluid_level_no', text)}
//                   placeholder="Remark for Brake Fluid Level ?"
//                   placeholderTextColor="#666"
//                   editable={!loading}
//                   multiline
//                 />
//               </LinearGradient>
//             </View>
//           )}

//           <Text style={styles.radioLabel}>Greasing Done</Text>
//           {renderYesNo('greasing_done')}
//           {radioValues.greasing_done === '0' && (
//             <View style={styles.remarkInputContainer}>
//               <LinearGradient colors={['#7E5EA9', '#20AEBC']} style={styles.inputGradient}>
//                 <TextInput
//                   style={styles.remarkInput}
//                   value={formData.greasing_done_no}
//                   onChangeText={text => handleInputChange('greasing_done_no', text)}
//                   placeholder="Remark for Greasing Done ?"
//                   placeholderTextColor="#666"
//                   editable={!loading}
//                   multiline
//                 />
//               </LinearGradient>
//             </View>
//           )}

//           <Text style={styles.radioLabel}>Paint Scratches</Text>
//           {renderYesNo('paint_scratches')}
//           {radioValues.paint_scratches === '0' && (
//             <View style={styles.remarkInputContainer}>
//               <LinearGradient colors={['#7E5EA9', '#20AEBC']} style={styles.inputGradient}>
//                 <TextInput
//                   style={styles.remarkInput}
//                   value={formData.paint_scratches_no}
//                   onChangeText={text => handleInputChange('paint_scratches_no', text)}
//                   placeholder="Remark for Paint Scratches ?"
//                   placeholderTextColor="#666"
//                   editable={!loading}
//                   multiline
//                 />
//               </LinearGradient>
//             </View>
//           )}

//           <Text style={styles.radioLabel}>Toolkit Available</Text>
//           {renderYesNo('toolkit_available')}
//           {radioValues.toolkit_available === '0' && (
//             <View style={styles.remarkInputContainer}>
//               <LinearGradient colors={['#7E5EA9', '#20AEBC']} style={styles.inputGradient}>
//                 <TextInput
//                   style={styles.remarkInput}
//                   value={formData.toolkit_available_no}
//                   onChangeText={text => handleInputChange('toolkit_available_no', text)}
//                   placeholder="Remark for Toolkit Available ?"
//                   placeholderTextColor="#666"
//                   editable={!loading}
//                   multiline
//                 />
//               </LinearGradient>
//             </View>
//           )}

//           <Text style={styles.radioLabel}>Owner Manual Given</Text>
//           {renderYesNo('owner_manual_given')}
//           {radioValues.owner_manual_given === '0' && (
//             <View style={styles.remarkInputContainer}>
//               <LinearGradient colors={['#7E5EA9', '#20AEBC']} style={styles.inputGradient}>
//                 <TextInput
//                   style={styles.remarkInput}
//                   value={formData.owner_manual_given_no}
//                   onChangeText={text => handleInputChange('owner_manual_given_no', text)}
//                   placeholder="Remark for Owner Manual Given ?"
//                   placeholderTextColor="#666"
//                   editable={!loading}
//                   multiline
//                 />
//               </LinearGradient>
//             </View>
//           )}

//           <Text style={styles.radioLabel}>Reflector Sticker Applied</Text>
//           {renderYesNo('reflector_sticker_applied')}
//           {radioValues.reflector_sticker_applied === '0' && (
//             <View style={styles.remarkInputContainer}>
//               <LinearGradient colors={['#7E5EA9', '#20AEBC']} style={styles.inputGradient}>
//                 <TextInput
//                   style={styles.remarkInput}
//                   value={formData.reflector_sticker_applied_no}
//                   onChangeText={text => handleInputChange('reflector_sticker_applied_no', text)}
//                   placeholder="Remark for Reflector Sticker Applied ?"
//                   placeholderTextColor="#666"
//                   editable={!loading}
//                   multiline
//                 />
//               </LinearGradient>
//             </View>
//           )}

//           <Text style={styles.radioLabel}>Number Plate Fixed</Text>
//           {renderYesNo('number_plate_fixed')}
//           {radioValues.number_plate_fixed === '0' && (
//             <View style={styles.remarkInputContainer}>
//               <LinearGradient colors={['#7E5EA9', '#20AEBC']} style={styles.inputGradient}>
//                 <TextInput
//                   style={styles.remarkInput}
//                   value={formData.number_plate_fixed_no}
//                   onChangeText={text => handleInputChange('number_plate_fixed_no', text)}
//                   placeholder="Remark for Number Plate Fixed ?"
//                   placeholderTextColor="#666"
//                   editable={!loading}
//                   multiline
//                 />
//               </LinearGradient>
//             </View>
//           )}

//           <Text style={styles.radioLabel}>Tractor Delivered:</Text>
//           {renderYesNo('tractor_delivered')}
//         </View>

//         {/* Delivery Customer Details */}
//         {radioValues.tractor_delivered === '1' && (
//           <View style={styles.sectionHeading}>
//             <Text style={styles.sectionHeadingText}>Delivery Customer Details:</Text>

//             {/* Delivery Customer Name + Father's Name */}
//             <View style={[styles.row, {marginTop: 8}]}>
//               <View style={styles.inputContainer}>
//                 <LinearGradient colors={['#7E5EA9', '#20AEBC']} style={styles.inputGradient}>
//                   <TextInput
//                     style={styles.input}
//                     value={formData.delivery_customer_name}
//                     onChangeText={text => handleInputChange('delivery_customer_name', text)}
//                     placeholder="Customer Name"
//                     placeholderTextColor="#666"
//                     editable={!loading}
//                   />
//                 </LinearGradient>
//               </View>
//               <View style={styles.inputContainer}>
//                 <LinearGradient colors={['#7E5EA9', '#20AEBC']} style={styles.inputGradient}>
//                   <TextInput
//                     style={styles.input}
//                     value={formData.delivery_customer_father_name}
//                     onChangeText={text => handleInputChange('delivery_customer_father_name', text)}
//                     placeholder="Father's Name"
//                     placeholderTextColor="#666"
//                     editable={!loading}
//                   />
//                 </LinearGradient>
//               </View>
//             </View>

//             {/* Delivery Address + Mobile */}
//             <View style={styles.row}>
//               <View style={styles.inputContainer}>
//                 <LinearGradient colors={['#7E5EA9', '#20AEBC']} style={styles.inputGradient}>
//                   <TextInput
//                     style={styles.input}
//                     value={formData.delivery_customer_address}
//                     onChangeText={text => handleInputChange('delivery_customer_address', text)}
//                     placeholder="Address"
//                     placeholderTextColor="#666"
//                     editable={!loading}
//                     multiline
//                   />
//                 </LinearGradient>
//               </View>
//               <View style={styles.inputContainer}>
//                 <LinearGradient colors={['#7E5EA9', '#20AEBC']} style={styles.inputGradient}>
//                   <TextInput
//                     style={styles.input}
//                     value={formData.delivery_customer_contact}
//                     onChangeText={text => handleInputChange('delivery_customer_contact', text)}
//                     placeholder="Mobile Number"
//                     placeholderTextColor="#666"
//                     keyboardType="phone-pad"
//                     editable={!loading}
//                   />
//                 </LinearGradient>
//               </View>
//             </View>

//             {/* Hypothecation dropdown + 'Other' input if selected */}
//             <View style={styles.row}>
//               <View style={styles.inputContainer}>
//                 <LinearGradient colors={['#7E5EA9', '#20AEBC']} style={styles.inputGradient}>
//                   <TouchableOpacity
//                     style={styles.input}
//                     onPress={() => setShowHypothecationDropdown(true)}
//                     disabled={loading}
//                   >
//                     <Text style={ formData.hypothecation ? styles.selectedModelText : styles.placeholderText }>
//                       {formData.hypothecation || 'Select Hypothecation'}
//                     </Text>
//                     <Icon
//                       name="keyboard-arrow-down"
//                       size={25}
//                       color="#666"
//                       style={styles.dropdownIcon}
//                     />
//                   </TouchableOpacity>
//                 </LinearGradient>
//               </View>
//               <View style={styles.inputContainer}></View>
//             </View>

//             {formData.hypothecation === 'Other' && (
//               <View style={styles.row}>
//                 <View style={styles.inputContainer}>
//                   <LinearGradient colors={['#7E5EA9', '#20AEBC']} style={styles.inputGradient}>
//                     <TextInput
//                       style={styles.input}
//                       value={formData.hypothecation_other}
//                       onChangeText={text => handleInputChange('hypothecation_other', text)}
//                       placeholder="Enter Other Hypothecation"
//                       placeholderTextColor="#666"
//                       editable={!loading}
//                     />
//                   </LinearGradient>
//                 </View>
//                 <View style={styles.inputContainer}></View>
//               </View>
//             )}
//           </View>
//         )}

//         {/* Terms and Conditions Section */}
//         {radioValues.tractor_delivered === '1' && (
//           <View style={styles.termsSection}>
//             <Text style={styles.termsTitle}>Terms and Conditions</Text>
            
//             <View style={styles.termsList}>
//               <Text style={styles.termItem}>1. Tractor Will Be Inspected Only After Full Payment Confirmation From The Accounts Department.</Text>
//               <Text style={styles.termItem}>2. PDI Will Be Carried Out Strictly As Per John Deere India Pvt. Ltd. Guidelines.</Text>
//               <Text style={styles.termItem}>3. Any Damages Or Discrepancies Found Before Delivery Will Be Rectified Prior To Handover.</Text>
//               <Text style={styles.termItem}>4. No Mechanical Or Electrical Modifications Are Allowed During Or After Pdi.</Text>
//               <Text style={styles.termItem}>5. Customer Must Be Present During Final Inspection And Sign The Pdi Report.</Text>
//               <Text style={styles.termItem}>6. Tractor Delivery Will Be Done Only After Successful Completion Of All Inspection Points.</Text>
//               <Text style={styles.termItem}>7. Makroo Motor Corporation Will Not Be Responsible For Any Issues Arising After Customer Approval And Delivery.</Text>
//               <Text style={styles.termItem}>8. All Fluids, Oil Levels, And Battery Conditions Will Be Checked And Recorded Before Handover.</Text>
//               <Text style={styles.termItem}>9. Tractor Registration And Number Plate Installation Will Be Handled Separately As Per Rto Process.</Text>
//             </View>

//             <Text style={styles.declarationTitle}>Customer Declaration</Text>
//             <Text style={styles.declarationText}>
//               I Have Personally Verified The Tractor After Completion Of The Pre-delivery Inspection (Pdi) At Makroo Motor Corporation. All Functions, Fittings, And Accessories Have Been Checked In My Presence. I Am Satisfied With The Tractor's Condition And Accept Delivery In Proper Working Order.
//             </Text>

//             <View style={styles.checkboxContainer}>
//               <TouchableOpacity 
//                 style={[styles.checkbox, isTermsAccepted && styles.checkboxChecked]} 
//                 onPress={() => setIsTermsAccepted(!isTermsAccepted)}
//                 disabled={loading}
//               >
//                 {isTermsAccepted && <Icon name="check" size={16} color="#fff" />}
//               </TouchableOpacity>
//               <Text style={styles.checkboxLabel}>Accept All Terms and Conditions</Text>
//             </View>
//           </View>
//         )}

//         {/* Photo & Signature */}
//         <View style={styles.photoSignatureSection}>
//           <TouchableOpacity 
//             style={styles.photoSignatureBox} 
//             onPress={() => showImagePickerOptions(setCustomerPhoto)}
//             disabled={loading}
//           >
//             {customer_photo ? (
//               <Image 
//                 source={{ uri: customer_photo.uri }} 
//                 style={styles.previewImage}
//                 resizeMode="contain"
//               />
//             ) : (
//               <>
//                 <Icon name="photo-camera" size={35} color="#666" />
//                 <Text style={styles.photoSignatureText}>Customer Photo</Text>
//                 {isEditMode && <Text style={styles.optionalText}>(Optional for update)</Text>}
//               </>
//             )}
//           </TouchableOpacity>

//           <TouchableOpacity 
//             style={styles.photoSignatureBox1} 
//             onPress={() => showImagePickerOptions(setCustomerSignature)}
//             disabled={loading}
//           >
//             {customer_signature ? (
//               <Image 
//                 source={{ uri: customer_signature.uri }} 
//                 style={styles.previewImage}
//                 resizeMode="contain"
//               />
//             ) : (
//               <>
//                 <Text style={styles.photoSignatureText}>Customer Signature</Text>
//                 {isEditMode && <Text style={styles.optionalText}>(Optional for update)</Text>}
//               </>
//             )}
//           </TouchableOpacity>

//           <TouchableOpacity 
//             style={styles.photoSignatureBox1} 
//             onPress={() => showImagePickerOptions(setManagerSignature)}
//             disabled={loading}
//           >
//             {manager_signature ? (
//               <Image 
//                 source={{ uri: manager_signature.uri }} 
//                 style={styles.previewImage}
//                 resizeMode="contain"
//               />
//             ) : (
//               <>
//                 <Text style={styles.photoSignatureText}>Manager Signature</Text>
//                 {isEditMode && <Text style={styles.optionalText}>(Optional for update)</Text>}
//               </>
//             )}
//           </TouchableOpacity>
//         </View>

//         {/* Buttons */}
//         <View style={styles.buttonContainer}>
//           <TouchableOpacity 
//             style={[
//               styles.submitButton, 
//               loading && styles.disabledButton,
//               (radioValues.tractor_delivered === '1' && !isTermsAccepted) && styles.disabledButton
//             ]} 
//             onPress={handleSubmit}
//             disabled={loading || (radioValues.tractor_delivered === '1' && !isTermsAccepted)}
//           >
//             {loading ? (
//               <ActivityIndicator color="#fff" size="small" />
//             ) : (
//               <Text style={styles.submitButtonText}>
//                 {isEditMode ? 'Update Form' : 'Submit Form'}
//               </Text>
//             )}
//           </TouchableOpacity>

//           <TouchableOpacity 
//             style={[styles.homeButton, loading && styles.disabledButton]} 
//             onPress={handleHome}
//             disabled={loading}
//           >
//             <Text style={styles.homeButtonText}>Home</Text>
//           </TouchableOpacity>
//         </View>
//       </ScrollView>
//     </View>
//   );

//   // === Render Radio Helpers ===
//   function renderYesNo(field) {
//     return (
//       <View style={styles.radioOptionsContainer}>
//         {[
//           {label: 'YES', value: '1'},
//           {label: 'NO', value: '0'}
//         ].map(({label, value}) => (
//           <TouchableOpacity
//             key={value}
//             style={[
//               styles.radioOptionWrapper,
//               radioValues[field] === value && styles.radioOptionSelected,
//             ]}
//             onPress={() => {
//               handleRadioChange(field, value);
//             }}
//             disabled={loading}
//           >
//             <LinearGradient
//               colors={['#7E5EA9', '#20AEBC']}
//               style={styles.radioOptionGradient}>
//               <View
//                 style={[
//                   styles.radioOptionInner,
//                   radioValues[field] === value &&
//                     styles.radioOptionInnerSelected,
//                 ]}>
//                 <Text
//                   style={[
//                     styles.radioOptionText,
//                     radioValues[field] === value &&
//                       styles.radioOptionTextSelected,
//                   ]}>
//                   {label}
//                 </Text>
//               </View>
//             </LinearGradient>
//           </TouchableOpacity>
//         ))}
//       </View>
//     );
//   }

//   function renderFullHalf(field) {
//     return (
//       <View style={styles.radioOptionsContainer}>
//         {[
//           {label: 'YES', value: '1'},
//           {label: 'NO', value: '0'}
//         ].map(({label, value}) => (
//           <TouchableOpacity
//             key={value}
//             style={[
//               styles.radioOptionWrapper,
//               radioValues[field] === value && styles.radioOptionSelected,
//             ]}
//             onPress={() => handleRadioChange(field, value)}
//             disabled={loading}
//           >
//             <LinearGradient
//               colors={['#7E5EA9', '#20AEBC']}
//               style={styles.radioOptionGradient}>
//               <View
//                 style={[
//                   styles.radioOptionInner,
//                   radioValues[field] === value &&
//                     styles.radioOptionInnerSelected,
//                 ]}>
//                 <Text
//                   style={[
//                     styles.radioOptionText,
//                     radioValues[field] === value &&
//                       styles.radioOptionTextSelected,
//                   ]}>
//                   {label}
//                 </Text>
//               </View>
//             </LinearGradient>
//           </TouchableOpacity>
//         ))}
//       </View>
//     );
//   }
// };

// const styles = StyleSheet.create({
//   container: {paddingHorizontal: 15},
//   header: {alignItems: 'center', paddingVertical: 10},
//   companyName: {fontSize: 16,  color: 'white',fontFamily: 'Inter_28pt-SemiBold'},
//   formNo: {fontSize: 14, marginVertical: 10,fontFamily: 'Inter_28pt-SemiBold', color: '#000'},
//   Date: {
//     fontSize: 12,
//     textAlign: 'right',
//     marginVertical: 5,
//     color: '#00000099',
//     fontFamily: 'Inter_28pt-Medium',
//   },
//   editModeContainer: {
//     backgroundColor: '#f0e6ff',
//     padding: 8,
//     borderRadius: 5,
//     marginVertical: 5,
//     alignItems: 'center',
//   },
//   editModeText: {
//     fontSize: 12,
//     fontFamily: 'Inter_28pt-SemiBold',
//     color: '#7E5EA9',
//   },
//   sectionHeading: {
//     marginVertical: 10,
//     paddingLeft: 5,
//   },
//   sectionHeadingText: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#000',
//     fontFamily: 'Inter_28pt-SemiBold',
//   },
//   formContainer: {marginBottom: 15},
//   row: {},
//   inputContainer: {
//     flex: 1, 
//     marginHorizontal: 4, 
//     marginBottom: 12
//   },
//   inputGradient: {borderRadius: 10, padding: 1},
//   input: {
//     borderRadius: 10,
//     backgroundColor: '#fff',
//     padding: 12,
//     fontSize: 14,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   selectedModelText: {fontSize: 14, color: '#000', fontFamily: 'Inter_28pt-Medium'},
//   placeholderText: {fontSize: 14, color: '#666', fontFamily: 'Inter_28pt-Medium'},
//   dropdownIcon: {marginLeft: 8},
//   inputWithIcon: {flexDirection: 'row', alignItems: 'center'},
//   inputWithIconField: {flex: 1},
//   iconButton: {position: 'absolute', right: 12, padding: 4},
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   modalContent: {backgroundColor: 'white', borderRadius: 10, width: '90%'},
//   modalHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     padding: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: '#f0f0f0',
//   },
//   modalTitle: {fontSize: 16, fontWeight: 'bold', fontFamily: 'Inter_28pt-SemiBold'},
//   closeButton: {padding: 4},
//   modelList: {maxHeight: 300},
//   modelItem: {padding: 15, borderBottomWidth: 1, borderBottomColor: '#f0f0f0'},
//   modelItemText: {fontSize: 14, color: '#333',fontFamily: 'Inter_28pt-Medium'},
//   // QR Scanner Styles
//   scannerContainer: {
//     flex: 1,
//     backgroundColor: '#000',
//   },
//   scannerHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 15,
//     paddingTop: 50,
//     backgroundColor: 'rgba(0,0,0,0.7)',
//   },
//   scannerCloseButton: {
//     padding: 8,
//     marginRight: 15,
//   },
//   scannerTitle: {
//     fontSize: 18,
//     color: '#fff',
//     fontWeight: 'bold',
//   },
//   camera: {
//     flex: 1,
//   },
//   scannerFooter: {
//     padding: 20,
//     backgroundColor: 'rgba(0,0,0,0.7)',
//     alignItems: 'center',
//   },
//   scannerInstructions: {
//     color: '#fff',
//     fontSize: 16,
//     textAlign: 'center',
//   },
//   radioSection: {marginBottom: 15},
//   radioLabel: {fontSize: 12, marginBottom: 6, color: '#000',fontFamily: 'Inter_28pt-Medium',marginTop:0},
//   radioOptionsContainer: {flexDirection: 'row'},
//   radioOptionWrapper: {flex: 1, marginHorizontal: 8, marginBottom: 15},
//   radioOptionGradient: {borderRadius: 6, padding: 1},
//   radioOptionInner: {
//     borderRadius: 5,
//     paddingVertical: 10,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//   },
//   radioOptionInnerSelected: {backgroundColor: '#7E5EA9'},
//   radioOptionText: {fontSize: 12, color: '#000',fontFamily: 'Inter_28pt-Medium'},
//   radioOptionTextSelected: {color: '#fff'},
//   // Remark Input Styles
//   remarkInputContainer: {
//     marginHorizontal: 8,
//     marginBottom: 15,
//   },
//   remarkInput: {
//     borderRadius: 10,
//     backgroundColor: '#fff',
//     padding: 12,
//     fontSize: 14,
//     minHeight: 50,
//     textAlignVertical: 'top',
//   },
//   // Terms and Conditions Styles
//   termsSection: {
//     marginBottom: 15,
//     padding: 10,
//   },
//   termsTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#000',
//     marginBottom: 10,
//     fontFamily: 'Inter_28pt-SemiBold',
//   },
//   termsList: {
//     marginBottom: 15,
//   },
//   termItem: {
//     fontSize: 12,
//     color: '#333',
//     marginBottom: 8,
//     lineHeight: 16,
//     fontFamily: 'Inter_28pt-Medium',
//   },
//   declarationTitle: {
//     fontSize: 15,
//     fontWeight: 'bold',
//     color: '#000',
//     marginTop: 10,
//     marginBottom: 8,
//     fontFamily: 'Inter_28pt-SemiBold',
//   },
//   declarationText: {
//     fontSize: 12,
//     color: '#333',
//     lineHeight: 16,
//     marginBottom: 15,
//     fontFamily: 'Inter_28pt-Medium',
//   },
//   checkboxContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 10,
//   },
//   checkbox: {
//     width: 20,
//     height: 20,
//     borderWidth: 2,
//     borderColor: '#666',
//     borderRadius: 4,
//     marginRight: 10,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//   },
//   checkboxChecked: {
//     backgroundColor: '#28a745',
//     borderColor: '#28a745',
//   },
//   checkboxLabel: {
//     fontSize: 14,
//     color: '#000',
//     fontFamily: 'Inter_28pt-Medium',
//   },
//   photoSignatureSection: {marginTop: 20},
//   photoSignatureBox: {
//     width: '100%',
//     height: 95,
//     borderWidth: 1,
//     borderColor: '#00000080',
//     borderRadius: 10,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 20,
//     borderStyle: 'dashed',
//   },
//   photoSignatureBox1: {
//     width: '100%',
//     height: 50,
//     borderWidth: 1,
//     borderColor: '#00000080',
//     borderRadius: 10,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 20,
//     borderStyle: 'dashed',
//   },
//   photoSignatureText: {fontSize: 13, textAlign: 'center', color: '#00000099',fontFamily: 'Inter_28pt-Medium'},
//   optionalText: {
//     fontSize: 10,
//     color: '#666',
//     fontStyle: 'italic',
//     marginTop: 2,
//   },
//   previewImage: {
//     width: '100%',
//     height: '100%',
//     borderRadius: 10,
//   },
//   buttonContainer: {marginTop: 20},
//   submitButton: {
//     backgroundColor: '#7E5EA9',
//     padding: 15,
//     borderRadius: 10,
//     alignItems: 'center',
//     marginBottom: 15,
//   },
//   submitButtonText: {color: '#fff', fontSize: 14,fontFamily: 'Inter_28pt-SemiBold'},
//   homeButton: {
//     backgroundColor: '#20AEBC',
//     padding: 15,
//     borderRadius: 10,
//     alignItems: 'center',
//     marginBottom: 35,
//   },
//   homeButtonText: {color: '#fff', fontSize: 14,fontFamily: 'Inter_28pt-SemiBold'},
//   disabledButton: {
//     opacity: 0.6,
//   },
// });

// export default PDIpage;







// import React, {useState, useEffect} from 'react';
// import {
//   View,
//   Text,
//   ScrollView,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   Alert,
//   Modal,
//   FlatList,
//   Image,
//   ActionSheetIOS,
//   Platform,
//   PermissionsAndroid,
//   ActivityIndicator,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import {useSafeAreaInsets} from 'react-native-safe-area-context';
// import LinearGradient from 'react-native-linear-gradient';
// import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
// import DateTimePicker from '@react-native-community/datetimepicker';
// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { Camera } from 'react-native-camera-kit';

// const PDIpage = ({navigation, route}) => {
//   const insets = useSafeAreaInsets();

//   const [userId, setUserId] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [existingFormId, setExistingFormId] = useState(null);
  
//   const [showModelDropdown, setShowModelDropdown] = useState(false);
//   const [showTireDropdown, setShowTireDropdown] = useState(false);
//   const [showBatteryDropdown, setShowBatteryDropdown] = useState(false);
//   const [showDatePicker, setShowDatePicker] = useState(false);
//   const [showBatteryDatePicker, setShowBatteryDatePicker] = useState(false);
//   const [showHypothecationDropdown, setShowHypothecationDropdown] = useState(false);

//   // QR Scanner States
//   const [showChassisScanner, setShowChassisScanner] = useState(false);
//   const [showEngineScanner, setShowEngineScanner] = useState(false);
//   const [showBatteryScanner, setShowBatteryScanner] = useState(false);
//   const [showStarterScanner, setShowStarterScanner] = useState(false);
//   const [showFipScanner, setShowFipScanner] = useState(false);
//   const [showAlternatorScanner, setShowAlternatorScanner] = useState(false);
//   const [hasCameraPermission, setHasCameraPermission] = useState(false);

//   // Terms and Conditions state
//   const [isTermsAccepted, setIsTermsAccepted] = useState(false);

//   const [formData, setFormData] = useState({
//     inspector_name: '',
//     tire_make: '',
//     tire_make_other: '',
//     battery_make: '',
//     battery_make_other: '',
//     select_date: null,
//     battery_date: null,
//     chassis_no: '',
//     tractor_model: '',
//     engine_no: '',
//     front_right_serial_no: '',
//     rear_right_serial_no: '',
//     front_left_serial_no: '',
//     rear_left_serial_no: '',
//     tractor_starter_serial_no: '',
//     tractor_alternator_no: '',
//     battery_serial_no: '',
//     fip_no: '',
//     dealer_name: '',
//     customer_name: '',
//     customer_father_name: '',
//     customer_address: '',
//     customer_contact: '',
//     pdi_done_by: '',
//     remarks: '',

//     // Delivery-specific customer details
//     delivery_customer_name: '',
//     delivery_customer_father_name: '',
//     delivery_customer_address: '',
//     delivery_customer_contact: '',
//     hypothecation: '',
//     hypothecation_other: '',

//     // Remarks for "No" selections - matching API field names
//     lights_no: '',
//     nuts_no: '',
//     hydraulic_oil_half: '',
//     all_nuts_sealed_no: '',
//     engine_oil_level_half: '',
//     coolant_level_no: '',
//     brake_fluid_level_no: '',
//     greasing_done_no: '',
//     paint_scratches_no: '',
//     toolkit_available_no: '',
//     owner_manual_given_no: '',
//     reflector_sticker_applied_no: '',
//     number_plate_fixed_no: '',
//   });

//   // Image states
//   const [customer_photo, setCustomerPhoto] = useState(null);
//   const [customer_signature, setCustomerSignature] = useState(null);
//   const [manager_signature, setManagerSignature] = useState(null);

//   const [radioValues, setRadioValues] = useState({
//     lights_ok: '1',
//     nuts_ok: '1',
//     tractor_delivered: '1',
//     hydraulic_oil: '1',
//     all_nuts_sealed: '1',
//     engine_oil_level: '1',
//     coolant_level: '1',
//     brake_fluid_level: '1',
//     greasing_done: '1',
//     paint_scratches: '0',
//     toolkit_available: '1',
//     owner_manual_given: '1',
//     reflector_sticker_applied: '1',
//     number_plate_fixed: '0',
//   });

//   const tractorModels = [
//     '3028EN',
//     '3036EN',
//     '3036E',
//     '5105',
//     '5105 4WD',
//     '5050D Gear Pro',
//     '5210 Gear Pro',
//     '5050D 4WD Gear Pro',
//     '5210 4WD Gear Pro',
//     '5310 CRDI',
//     '5310 4WD CRDI',
//     '5405 CRDI',
//     '5405 4WD CRDI',
//     '5075 2WD',
//     '5075 4WD',
//   ];

//   const tireMakes = [
//     'Michelin',
//     'Bridgestone',
//     'Goodyear',
//     'Continental',
//     'Pirelli',
//     'Yokohama',
//     'MRF',
//     'Apollo',
//     'CEAT',
//     'JK Tyre',
//     'Other',
//   ];

//   const batteryMakes = [
//     'Exide',
//     'Amaron',
//     'Lucas',
//     'SF Sonic',
//     'Tata Green',
//     'Exide Industries',
//     'Luminous',
//     'Okaya',
//     'Su-Kam',
//     'Base',
//     'Other',
//   ];

//   const hypothecationOptions = [
//     'John Deere Financial India Private Limited',
//     'The Jammu and Kashmir Bank Limited',
//     'Nil',
//     'Other',
//   ];

//   // Auto-fill delivery customer details when tractor is delivered
//   useEffect(() => {
//     if (radioValues.tractor_delivered === '1') {
//       // Auto-fill delivery customer details from customer details
//       setFormData(prev => ({
//         ...prev,
//         delivery_customer_name: prev.delivery_customer_name || prev.customer_name,
//         delivery_customer_father_name: prev.delivery_customer_father_name || prev.customer_father_name,
//         delivery_customer_address: prev.delivery_customer_address || prev.customer_address,
//         delivery_customer_contact: prev.delivery_customer_contact || prev.customer_contact,
//       }));
//     }
//   }, [radioValues.tractor_delivered, formData.customer_name, formData.customer_father_name, formData.customer_address, formData.customer_contact]);

//   // Camera Permission Function
//   const requestCameraPermission = async () => {
//     if (Platform.OS === 'android') {
//       try {
//         const granted = await PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.CAMERA,
//           {
//             title: "Camera Permission",
//             message: "This app needs access to your camera to scan QR codes.",
//             buttonNeutral: "Ask Me Later",
//             buttonNegative: "Cancel",
//             buttonPositive: "OK"
//           }
//         );
//         const hasPermission = granted === PermissionsAndroid.RESULTS.GRANTED;
//         setHasCameraPermission(hasPermission);
//         return hasPermission;
//       } catch (err) {
//         console.warn(err);
//         setHasCameraPermission(false);
//         return false;
//       }
//     }
//     setHasCameraPermission(true);
//     return true;
//   };

//   // QR Scanner Handlers
//   const handleChassisScanPress = async () => {
//     const hasPermission = await requestCameraPermission();
//     if (hasPermission) {
//       setShowChassisScanner(true);
//     } else {
//       Alert.alert('Permission Denied', 'Camera permission is required to scan QR codes.');
//     }
//   };

//   const handleEngineScanPress = async () => {
//     const hasPermission = await requestCameraPermission();
//     if (hasPermission) {
//       setShowEngineScanner(true);
//     } else {
//       Alert.alert('Permission Denied', 'Camera permission is required to scan QR codes.');
//     }
//   };

//   const handleBatteryScanPress = async () => {
//     const hasPermission = await requestCameraPermission();
//     if (hasPermission) {
//       setShowBatteryScanner(true);
//     } else {
//       Alert.alert('Permission Denied', 'Camera permission is required to scan QR codes.');
//     }
//   };

//   const handleStarterScanPress = async () => {
//     const hasPermission = await requestCameraPermission();
//     if (hasPermission) {
//       setShowStarterScanner(true);
//     } else {
//       Alert.alert('Permission Denied', 'Camera permission is required to scan QR codes.');
//     }
//   };

//   const handleFipScanPress = async () => {
//     const hasPermission = await requestCameraPermission();
//     if (hasPermission) {
//       setShowFipScanner(true);
//     } else {
//       Alert.alert('Permission Denied', 'Camera permission is required to scan QR codes.');
//     }
//   };

//   const handleAlternatorScanPress = async () => {
//     const hasPermission = await requestCameraPermission();
//     if (hasPermission) {
//       setShowAlternatorScanner(true);
//     } else {
//       Alert.alert('Permission Denied', 'Camera permission is required to scan QR codes.');
//     }
//   };

//   const handleQRCodeRead = (event) => {
//     const scannedValue = event.nativeEvent.codeStringValue;
//     console.log('QR Code Scanned:', scannedValue);
    
//     if (showChassisScanner) {
//       handleInputChange('chassis_no', scannedValue);
//       setShowChassisScanner(false);
//     } else if (showEngineScanner) {
//       handleInputChange('engine_no', scannedValue);
//       setShowEngineScanner(false);
//     } else if (showBatteryScanner) {
//       handleInputChange('battery_serial_no', scannedValue);
//       setShowBatteryScanner(false);
//     } else if (showStarterScanner) {
//       handleInputChange('tractor_starter_serial_no', scannedValue);
//       setShowStarterScanner(false);
//     } else if (showFipScanner) {
//       handleInputChange('fip_no', scannedValue);
//       setShowFipScanner(false);
//     } else if (showAlternatorScanner) {
//       handleInputChange('tractor_alternator_no', scannedValue);
//       setShowAlternatorScanner(false);
//     }
//   };

//   const closeScanner = () => {
//     setShowChassisScanner(false);
//     setShowEngineScanner(false);
//     setShowBatteryScanner(false);
//     setShowStarterScanner(false);
//     setShowFipScanner(false);
//     setShowAlternatorScanner(false);
//   };

//   // Get user ID from AsyncStorage on component mount
//   useEffect(() => {
//     const getUserData = async () => {
//       try {
//         const storedUserId = await AsyncStorage.getItem('userId');
//         if (storedUserId) {
//           setUserId(storedUserId);
//           console.log('User ID loaded:', storedUserId);
//         }
        
//         // Check if we're in edit mode (receiving existing form data)
//         if (route.params?.formData) {
//           const editData = route.params.formData;
//           setIsEditMode(true);
//           setExistingFormId(editData.id);
          
//           // Pre-populate form data with exact API field names
//           setFormData({
//             inspector_name: editData.inspector_name || '',
//             tire_make: editData.tire_make || '',
//             tire_make_other: editData.tire_make_other || '',
//             battery_make: editData.battery_make || '',
//             battery_make_other: editData.battery_make_other || '',
//             select_date: editData.select_date ? new Date(editData.select_date) : null,
//             battery_date: editData.battery_date ? new Date(editData.battery_date) : null,
//             chassis_no: editData.chassis_no || '',
//             tractor_model: editData.tractor_model || '',
//             engine_no: editData.engine_no || '',
//             front_right_serial_no: editData.front_right_serial_no || '',
//             rear_right_serial_no: editData.rear_right_serial_no || '',
//             front_left_serial_no: editData.front_left_serial_no || '',
//             rear_left_serial_no: editData.rear_left_serial_no || '',
//             tractor_starter_serial_no: editData.tractor_starter_serial_no || '',
//             tractor_alternator_no: editData.tractor_alternator_no || '',
//             battery_serial_no: editData.battery_serial_no || '',
//             fip_no: editData.fip_no || '',
//             dealer_name: editData.dealer_name || '',
//             customer_name: editData.customer_name || '',
//             customer_father_name: editData.customer_father_name || '',
//             customer_address: editData.customer_address || '',
//             customer_contact: editData.customer_contact || '',
//             pdi_done_by: editData.pdi_done_by || '',
//             remarks: editData.remarks || '',
//             delivery_customer_name: editData.delivery_customer_name || '',
//             delivery_customer_father_name: editData.delivery_customer_father_name || '',
//             delivery_customer_address: editData.delivery_customer_address || '',
//             delivery_customer_contact: editData.delivery_customer_contact || '',
//             hypothecation: editData.hypothecation || '',
//             hypothecation_other: editData.hypothecation_other || '',
//             // Remarks for "No" selections with exact API field names
//             lights_no: editData.lights_no || '',
//             nuts_no: editData.nuts_no || '',
//             hydraulic_oil_half: editData.hydraulic_oil_half || '',
//             all_nuts_sealed_no: editData.all_nuts_sealed_no || '',
//             engine_oil_level_half: editData.engine_oil_level_half || '',
//             coolant_level_no: editData.coolant_level_no || '',
//             brake_fluid_level_no: editData.brake_fluid_level_no || '',
//             greasing_done_no: editData.greasing_done_no || '',
//             paint_scratches_no: editData.paint_scratches_no || '',
//             toolkit_available_no: editData.toolkit_available_no || '',
//             owner_manual_given_no: editData.owner_manual_given_no || '',
//             reflector_sticker_applied_no: editData.reflector_sticker_applied_no || '',
//             number_plate_fixed_no: editData.number_plate_fixed_no || '',
//           });

//           // Set radio button states with exact API field names
//           setRadioValues({
//             lights_ok: editData.lights_ok?.toString() || '1',
//             nuts_ok: editData.nuts_ok?.toString() || '1',
//             tractor_delivered: editData.tractor_delivered?.toString() || '1',
//             hydraulic_oil: editData.hydraulic_oil?.toString() || '1',
//             all_nuts_sealed: editData.all_nuts_sealed?.toString() || '1',
//             engine_oil_level: editData.engine_oil_level?.toString() || '1',
//             coolant_level: editData.coolant_level?.toString() || '1',
//             brake_fluid_level: editData.brake_fluid_level?.toString() || '1',
//             greasing_done: editData.greasing_done?.toString() || '1',
//             paint_scratches: editData.paint_scratches?.toString() || '0',
//             toolkit_available: editData.toolkit_available?.toString() || '1',
//             owner_manual_given: editData.owner_manual_given?.toString() || '1',
//             reflector_sticker_applied: editData.reflector_sticker_applied?.toString() || '1',
//             number_plate_fixed: editData.number_plate_fixed?.toString() || '0',
//           });

//         }
//       } catch (error) {
//         console.log('Error loading user data:', error);
//       }
//     };

//     getUserData();
//   }, [route.params]);

//   // Generate form number
//   const generateFormNo = () => {
//     const timestamp = new Date().getTime();
//     return `PDI${timestamp}`;
//   };

//   // Camera permissions for image capture
//   const requestCameraPermissionForImage = async () => {
//     if (Platform.OS === 'android') {
//       try {
//         const granted = await PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.CAMERA,
//           {
//             title: "Camera Permission",
//             message: "This app needs access to your camera to take photos.",
//             buttonNeutral: "Ask Me Later",
//             buttonNegative: "Cancel",
//             buttonPositive: "OK"
//           }
//         );
//         return granted === PermissionsAndroid.RESULTS.GRANTED;
//       } catch (err) {
//         console.warn(err);
//         return false;
//       }
//     }
//     return true;
//   };

//   const showImagePickerOptions = (setImageFunction) => {
//     if (Platform.OS === 'ios') {
//       ActionSheetIOS.showActionSheetWithOptions(
//         {
//           options: ['Cancel', 'Take Photo', 'Choose from Library'],
//           cancelButtonIndex: 0,
//         },
//         async (buttonIndex) => {
//           if (buttonIndex === 1) {
//             const hasPermission = await requestCameraPermissionForImage();
//             if (hasPermission) handleCamera(setImageFunction);
//           } else if (buttonIndex === 2) handleImageLibrary(setImageFunction);
//         }
//       );
//     } else {
//       Alert.alert(
//         'Select Image',
//         'Choose an option',
//         [
//           { text: 'Cancel', style: 'cancel' },
//           { text: 'Take Photo', onPress: async () => {
//               const hasPermission = await requestCameraPermissionForImage();
//               if (hasPermission) handleCamera(setImageFunction);
//             }
//           },
//           { text: 'Choose from Library', onPress: () => handleImageLibrary(setImageFunction) },
//         ],
//         { cancelable: true }
//       );
//     }
//   };

//   const handleCamera = (setImageFunction) => {
//     launchCamera(
//       { 
//         mediaType: 'photo', 
//         quality: 0.8, 
//         cameraType: 'back', 
//         saveToPhotos: true,
//         includeBase64: false 
//       },
//       (response) => {
//         if (response.didCancel) return;
//         if (response.error) {
//           Alert.alert('Error', 'Failed to capture image');
//           return;
//         }
//         if (response.assets && response.assets.length > 0) {
//           setImageFunction(response.assets[0]);
//         }
//       }
//     );
//   };

//   const handleImageLibrary = (setImageFunction) => {
//     launchImageLibrary({ 
//       mediaType: 'photo', 
//       quality: 0.8,
//       includeBase64: false 
//     }, (response) => {
//       if (response.didCancel) return;
//       if (response.error) {
//         Alert.alert('Error', 'Failed to select image');
//         return;
//       }
//       if (response.assets && response.assets.length > 0) {
//         setImageFunction(response.assets[0]);
//       }
//     });
//   };

//   const handleInputChange = (field, value) => {
//     setFormData(prev => ({
//       ...prev,
//       [field]: value,
//     }));
//   };

//   const handleRadioChange = (field, value) => {
//     setRadioValues(prev => ({
//       ...prev,
//       [field]: value,
//     }));
//   };

//   const handleModelSelect = model => {
//     handleInputChange('tractor_model', model);
//     setShowModelDropdown(false);
//   };

//   const handleTireSelect = tire => {
//     handleInputChange('tire_make', tire);
//     if (tire !== 'Other') {
//       handleInputChange('tire_make_other', '');
//     }
//     setShowTireDropdown(false);
//   };

//   const handleBatterySelect = battery => {
//     handleInputChange('battery_make', battery);
//     if (battery !== 'Other') {
//       handleInputChange('battery_make_other', '');
//     }
//     setShowBatteryDropdown(false);
//   };

//   const handleHypothecationSelect = option => {
//     handleInputChange('hypothecation', option);
//     if (option !== 'Other') {
//       handleInputChange('hypothecation_other', '');
//     }
//     setShowHypothecationDropdown(false);
//   };

//   const handleDateChange = (event, selectedDate) => {
//     setShowDatePicker(false);
//     if (selectedDate) {
//       handleInputChange('select_date', selectedDate);
//     }
//   };

//   const handleBatteryDateChange = (event, selectedDate) => {
//     setShowBatteryDatePicker(false);
//     if (selectedDate) {
//       handleInputChange('battery_date', selectedDate);
//     }
//   };

//   const validateForm = () => {
//     const requiredFields = [
//       'inspector_name', 'tractor_model', 'chassis_no', 'engine_no',
//       'tire_make', 'front_right_serial_no', 'front_left_serial_no', 'rear_right_serial_no', 'rear_left_serial_no',
//       'battery_make', 'battery_serial_no', 'tractor_starter_serial_no', 'fip_no', 'tractor_alternator_no',
//       'dealer_name', 'customer_name', 'customer_address', 'customer_contact',
//       'pdi_done_by'
//     ];

//     for (const field of requiredFields) {
//       if (!formData[field] || formData[field].toString().trim() === '') {
//         Alert.alert('Validation Error', `Please fill in ${field.replace(/_/g, ' ')}`);
//         return false;
//       }
//     }

//     // Check if terms are accepted when tractor is delivered
//     if (radioValues.tractor_delivered === '1' && !isTermsAccepted) {
//       Alert.alert('Validation Error', 'Please accept the Terms and Conditions');
//       return false;
//     }

//     // Make images optional for updates, required for new forms
//     if (!isEditMode) {
//       if (!customer_photo) {
//         Alert.alert('Validation Error', 'Please add customer photo');
//         return false;
//       }

//       if (!customer_signature) {
//         Alert.alert('Validation Error', 'Please add customer signature');
//         return false;
//       }

//       if (!manager_signature) {
//         Alert.alert('Validation Error', 'Please add manager signature');
//         return false;
//       }
//     }

//     return true;
//   };

//   const prepareFormData = () => {
//     const formDataToSend = new FormData();

//     // For updates, use PUT method and include ID
//     if (isEditMode && existingFormId) {
//       formDataToSend.append('id', existingFormId.toString());
//       console.log('UPDATE MODE - Form ID:', existingFormId);
//     } else {
//       // For new forms, generate new form number
//       formDataToSend.append('form_no', generateFormNo());
//       console.log('CREATE MODE - New Form No:', generateFormNo());
//     }

//     // Common form data for both create and update - EXACT API FIELD NAMES
//     formDataToSend.append('user_id', userId);
//     formDataToSend.append('form_date', new Date().toISOString().split('T')[0]);
//     formDataToSend.append('inspector_name', formData.inspector_name);
//     formDataToSend.append('select_date', formData.select_date ? formData.select_date.toISOString().split('T')[0] : '');
//     formDataToSend.append('tractor_model', formData.tractor_model);
//     formDataToSend.append('chassis_no', formData.chassis_no);
//     formDataToSend.append('engine_no', formData.engine_no);

//     // Tyre and battery (including "Other" values)
//     formDataToSend.append('tire_make', formData.tire_make);
//     formDataToSend.append('tire_make_other', formData.tire_make_other || '');
//     formDataToSend.append('front_right_serial_no', formData.front_right_serial_no);
//     formDataToSend.append('front_left_serial_no', formData.front_left_serial_no);
//     formDataToSend.append('rear_right_serial_no', formData.rear_right_serial_no);
//     formDataToSend.append('rear_left_serial_no', formData.rear_left_serial_no);
//     formDataToSend.append('battery_make', formData.battery_make);
//     formDataToSend.append('battery_make_other', formData.battery_make_other || '');
//     formDataToSend.append('battery_date', formData.battery_date ? formData.battery_date.toISOString().split('T')[0] : '');
//     formDataToSend.append('battery_serial_no', formData.battery_serial_no);
//     formDataToSend.append('tractor_starter_serial_no', formData.tractor_starter_serial_no);
//     formDataToSend.append('fip_no', formData.fip_no);
//     formDataToSend.append('tractor_alternator_no', formData.tractor_alternator_no);
    
//     // Customer details
//     formDataToSend.append('dealer_name', formData.dealer_name);
//     formDataToSend.append('customer_name', formData.customer_name);
//     formDataToSend.append('customer_father_name', formData.customer_father_name || '');
//     formDataToSend.append('customer_address', formData.customer_address);
//     formDataToSend.append('customer_contact', formData.customer_contact);
//     formDataToSend.append('pdi_done_by', formData.pdi_done_by);
//     formDataToSend.append('remarks', formData.remarks || '');

//     // Delivery-specific customer details
//     formDataToSend.append('delivery_customer_name', formData.delivery_customer_name || '');
//     formDataToSend.append('delivery_customer_father_name', formData.delivery_customer_father_name || '');
//     formDataToSend.append('delivery_customer_address', formData.delivery_customer_address || '');
//     formDataToSend.append('delivery_customer_contact', formData.delivery_customer_contact || '');
//     formDataToSend.append('hypothecation', formData.hypothecation || '');
//     formDataToSend.append('hypothecation_other', formData.hypothecation_other || '');

//     // Radio button values (convert to 1/0 for API) - EXACT API FIELD NAMES
//     formDataToSend.append('lights_ok', radioValues.lights_ok);
//     formDataToSend.append('nuts_ok', radioValues.nuts_ok);
//     formDataToSend.append('hydraulic_oil', radioValues.hydraulic_oil);
//     formDataToSend.append('all_nuts_sealed', radioValues.all_nuts_sealed);
//     formDataToSend.append('tractor_delivered', radioValues.tractor_delivered);
//     formDataToSend.append('engine_oil_level', radioValues.engine_oil_level);
//     formDataToSend.append('coolant_level', radioValues.coolant_level);
//     formDataToSend.append('brake_fluid_level', radioValues.brake_fluid_level);
//     formDataToSend.append('greasing_done', radioValues.greasing_done);
//     formDataToSend.append('paint_scratches', radioValues.paint_scratches);
//     formDataToSend.append('toolkit_available', radioValues.toolkit_available);
//     formDataToSend.append('owner_manual_given', radioValues.owner_manual_given);
//     formDataToSend.append('reflector_sticker_applied', radioValues.reflector_sticker_applied);
//     formDataToSend.append('number_plate_fixed', radioValues.number_plate_fixed);

//     // Remarks for "No" selections - EXACT API FIELD NAMES
//     formDataToSend.append('lights_no', formData.lights_no || '');
//     formDataToSend.append('nuts_no', formData.nuts_no || '');
//     formDataToSend.append('hydraulic_oil_half', formData.hydraulic_oil_half || '');
//     formDataToSend.append('all_nuts_sealed_no', formData.all_nuts_sealed_no || '');
//     formDataToSend.append('engine_oil_level_half', formData.engine_oil_level_half || '');
//     formDataToSend.append('coolant_level_no', formData.coolant_level_no || '');
//     formDataToSend.append('brake_fluid_level_no', formData.brake_fluid_level_no || '');
//     formDataToSend.append('greasing_done_no', formData.greasing_done_no || '');
//     formDataToSend.append('paint_scratches_no', formData.paint_scratches_no || '');
//     formDataToSend.append('toolkit_available_no', formData.toolkit_available_no || '');
//     formDataToSend.append('owner_manual_given_no', formData.owner_manual_given_no || '');
//     formDataToSend.append('reflector_sticker_applied_no', formData.reflector_sticker_applied_no || '');
//     formDataToSend.append('number_plate_fixed_no', formData.number_plate_fixed_no || '');

//     // Add delivery date if tractor is delivered
//     if (radioValues.tractor_delivered === '1') {
//       formDataToSend.append('delivery_date', new Date().toISOString().split('T')[0]);
//     }

//     // Add images only if they are newly selected
//     if (customer_photo && customer_photo.uri && !customer_photo.uri.startsWith('http')) {
//       formDataToSend.append('customer_photo', {
//         uri: customer_photo.uri,
//         type: customer_photo.type || 'image/jpeg',
//         name: `customer_photo_${Date.now()}.jpg`,
//       });
//     }

//     if (customer_signature && customer_signature.uri && !customer_signature.uri.startsWith('http')) {
//       formDataToSend.append('customer_signature', {
//         uri: customer_signature.uri,
//         type: customer_signature.type || 'image/jpeg',
//         name: `customer_signature_${Date.now()}.jpg`,
//       });
//     }

//     if (manager_signature && manager_signature.uri && !manager_signature.uri.startsWith('http')) {
//       formDataToSend.append('manager_signature', {
//         uri: manager_signature.uri,
//         type: manager_signature.type || 'image/jpeg',
//         name: `manager_signature_${Date.now()}.jpg`,
//       });
//     }

//     return formDataToSend;
//   };

//   const handleSubmit = async () => {
//     if (!userId) {
//       Alert.alert('Error', 'User ID not found. Please login again.');
//       return;
//     }

//     if (!validateForm()) {
//       return;
//     }

//     setLoading(true);

//     try {
//       const formDataToSend = prepareFormData();
      
//       // Use different endpoints and methods for create vs update
//       let url, method;
      
//       if (isEditMode && existingFormId) {
//         url = `https://argosmob.uk/makroo/public/api/v1/pdi-delivery/form/update`;
//         method = 'post'; // Your API uses POST for update
//         console.log('UPDATE REQUEST - URL:', url, 'Method:', method, 'Form ID:', existingFormId);
//       } else {
//         url = 'https://argosmob.uk/makroo/public/api/v1/pdi-delivery/form/save';
//         method = 'post';
//         console.log('CREATE REQUEST - URL:', url, 'Method:', method);
//       }

//       const config = {
//         method: method,
//         url: url,
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//         data: formDataToSend,
//         timeout: 30000,
//       };

//       console.log('Sending form data...');
//       const response = await axios(config);
//       console.log('API Response:', response.data);

//       let isSuccess = false;
//       let successMessage = '';
//       let errorMessage = '';

//       if (isEditMode) {
//         successMessage = 'PDI Form updated successfully!';
//         errorMessage = 'Failed to update form. Please try again.';
        
//         if (response.data) {
//           if (response.data.status === true || response.data.success === true) {
//             isSuccess = true;
//           } else if (response.data.message && response.data.message.toLowerCase().includes('success')) {
//             isSuccess = true;
//           } else if (response.data.message && response.data.message.toLowerCase().includes('updated')) {
//             isSuccess = true;
//           }
//         }
//       } else {
//         successMessage = 'PDI Form submitted successfully!';
//         errorMessage = 'Failed to submit form. Please try again.';
        
//         if (response.data) {
//           if (response.data.status === true || response.data.success === true) {
//             isSuccess = true;
//           } else if (response.data.message && response.data.message.toLowerCase().includes('success')) {
//             isSuccess = true;
//           } else if (response.data.message && response.data.message.toLowerCase().includes('created')) {
//             isSuccess = true;
//           } else if (response.data.message && response.data.message.toLowerCase().includes('saved')) {
//             isSuccess = true;
//           }
//         }
//       }

//       if (response.status === 200 || response.status === 201) {
//         if (!isSuccess) {
//           isSuccess = true;
//           console.log('Success detected from HTTP status');
//         }
//       }

//       if (isSuccess) {
//         Alert.alert(
//           'Success', 
//           successMessage,
//           [
//             {
//               text: 'OK',
//               onPress: () => {
//                 if (isEditMode) {
//                   navigation.goBack();
//                 } else {
//                   // Reset form for new entry
//                   setFormData({
//                     inspector_name: '',
//                     tire_make: '',
//                     tire_make_other: '',
//                     battery_make: '',
//                     battery_make_other: '',
//                     select_date: null,
//                     battery_date: null,
//                     chassis_no: '',
//                     tractor_model: '',
//                     engine_no: '',
//                     front_right_serial_no: '',
//                     rear_right_serial_no: '',
//                     front_left_serial_no: '',
//                     rear_left_serial_no: '',
//                     tractor_starter_serial_no: '',
//                     tractor_alternator_no: '',
//                     battery_serial_no: '',
//                     fip_no: '',
//                     dealer_name: '',
//                     customer_name: '',
//                     customer_father_name: '',
//                     customer_address: '',
//                     customer_contact: '',
//                     pdi_done_by: '',
//                     remarks: '',
//                     delivery_customer_name: '',
//                     delivery_customer_father_name: '',
//                     delivery_customer_address: '',
//                     delivery_customer_contact: '',
//                     hypothecation: '',
//                     hypothecation_other: '',
//                     lights_no: '',
//                     nuts_no: '',
//                     hydraulic_oil_half: '',
//                     all_nuts_sealed_no: '',
//                     engine_oil_level_half: '',
//                     coolant_level_no: '',
//                     brake_fluid_level_no: '',
//                     greasing_done_no: '',
//                     paint_scratches_no: '',
//                     toolkit_available_no: '',
//                     owner_manual_given_no: '',
//                     reflector_sticker_applied_no: '',
//                     number_plate_fixed_no: '',
//                   });
//                   setRadioValues({
//                     lights_ok: '1',
//                     nuts_ok: '1',
//                     tractor_delivered: '1',
//                     hydraulic_oil: '1',
//                     all_nuts_sealed: '1',
//                     engine_oil_level: '1',
//                     coolant_level: '1',
//                     brake_fluid_level: '1',
//                     greasing_done: '1',
//                     paint_scratches: '1',
//                     toolkit_available: '1',
//                     owner_manual_given: '1',
//                     reflector_sticker_applied: '1',
//                     number_plate_fixed: '1',
//                   });
//                   setCustomerPhoto(null);
//                   setCustomerSignature(null);
//                   setManagerSignature(null);
//                   setIsTermsAccepted(false);
//                 }
//               }
//             }
//           ]
//         );
//       } else {
//         const serverErrorMessage = response.data?.message || response.data?.error || errorMessage;
//         Alert.alert(
//           isEditMode ? 'Update Failed' : 'Submission Failed', 
//           serverErrorMessage
//         );
//       }

//     } catch (error) {
//       console.log('Submission Error:', error);
//       console.log('Error details:', error.response?.data);
      
//       let errorMessage = 'Something went wrong. Please try again.';
      
//       if (error.response) {
//         const serverError = error.response.data;
//         errorMessage = serverError.message || serverError.error || `Server error: ${error.response.status}`;
//       } else if (error.request) {
//         errorMessage = 'Network error. Please check your internet connection.';
//       }
      
//       Alert.alert(
//         isEditMode ? 'Update Failed' : 'Submission Failed', 
//         errorMessage
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleHome = () => {
//     navigation.navigate('Dashboard');
//   };

//   const handleDateIconPress = () => {
//     setShowDatePicker(true);
//   };

//   const handleBatteryDateIconPress = () => {
//     setShowBatteryDatePicker(true);
//   };

//   const renderModelItem = ({item}) => (
//     <TouchableOpacity
//       style={styles.modelItem}
//       onPress={() => handleModelSelect(item)}>
//       <Text style={styles.modelItemText}>{item}</Text>
//     </TouchableOpacity>
//   );

//   const renderTireItem = ({item}) => (
//     <TouchableOpacity
//       style={styles.modelItem}
//       onPress={() => handleTireSelect(item)}>
//       <Text style={styles.modelItemText}>{item}</Text>
//     </TouchableOpacity>
//   );

//   const renderBatteryItem = ({item}) => (
//     <TouchableOpacity
//       style={styles.modelItem}
//       onPress={() => handleBatterySelect(item)}>
//       <Text style={styles.modelItemText}>{item}</Text>
//     </TouchableOpacity>
//   );

//   const renderHypothecationItem = ({item}) => (
//     <TouchableOpacity
//       style={styles.modelItem}
//       onPress={() => handleHypothecationSelect(item)}>
//       <Text style={styles.modelItemText}>{item}</Text>
//     </TouchableOpacity>
//   );

//   // QR Scanner Component
//   const renderQRScanner = () => (
//     <Modal
//       visible={showChassisScanner || showEngineScanner || showBatteryScanner || showStarterScanner || showFipScanner || showAlternatorScanner}
//       animationType="slide"
//       transparent={false}
//       onRequestClose={closeScanner}
//     >
//       <View style={styles.scannerContainer}>
//         <View style={styles.scannerHeader}>
//           <TouchableOpacity onPress={closeScanner} style={styles.scannerCloseButton}>
//             <Icon name="close" size={24} color="#fff" />
//           </TouchableOpacity>
//           <Text style={styles.scannerTitle}>
//             {showChassisScanner ? 'Scan Chassis Number' : 
//              showEngineScanner ? 'Scan Engine Number' :
//              showBatteryScanner ? 'Scan Battery Serial Number' :
//              showStarterScanner ? 'Scan Starter Serial Number' :
//              showFipScanner ? 'Scan FIP Number' :
//              'Scan Alternator Number'}
//           </Text>
//         </View>
        
//         <Camera
//           style={styles.camera}
//           cameraOptions={{
//             flashMode: 'auto',
//             focusMode: 'on',
//             zoomMode: 'on',
//           }}
//           scanBarcode={true}
//           showFrame={true}
//           laserColor="red"
//           frameColor="white"
//           onReadCode={handleQRCodeRead}
//         />
        
//         <View style={styles.scannerFooter}>
//           <Text style={styles.scannerInstructions}>
//             Point your camera at a QR code to scan
//           </Text>
//         </View>
//       </View>
//     </Modal>
//   );

//   return (
//     <View
//       style={{flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom}}>
//       {/* Header */}
//       <LinearGradient
//         colors={['#7E5EA9', '#20AEBC']}
//         start={{x: 0, y: 0}}
//         end={{x: 1, y: 0}}
//         style={styles.header}>
//         <Text style={styles.companyName}>Makroo Motor Corporation</Text>
//         <Text style={styles.companyName}>Pre Delivery Inspection</Text>
//         <Text style={styles.companyName}>Form</Text>
//       </LinearGradient>

//       <ScrollView style={styles.container}>
//         {/* Date and Form No */}
//         <Text style={styles.Date}>{new Date().toLocaleDateString()}</Text>
//         {isEditMode && (
//           <View style={styles.editModeContainer}>
//             <Text style={styles.editModeText}>Edit Mode - Updating Form ID: {existingFormId}</Text>
//           </View>
//         )}

//         {/* Form Fields */}
//         <View style={styles.formContainer}>
//           {/* Inspector + Date */}
//           <View style={styles.row}>
//             <View style={styles.inputContainer}>
//               <LinearGradient
//                 colors={['#7E5EA9', '#20AEBC']}
//                 style={styles.inputGradient}>
//                 <TextInput
//                   style={styles.input}
//                   value={formData.inspector_name}
//                   onChangeText={text =>
//                     handleInputChange('inspector_name', text)
//                   }
//                   placeholder="Inspector Name"
//                   placeholderTextColor="#666"
//                   editable={!loading}
//                 />
//               </LinearGradient>
//             </View>
//             <View style={styles.inputContainer}>
//               <LinearGradient
//                 colors={['#7E5EA9', '#20AEBC']}
//                 style={styles.inputGradient}>
//                 <View style={styles.inputWithIcon}>
//                   <TouchableOpacity
//                     style={[styles.input, styles.inputWithIconField]}
//                     onPress={handleDateIconPress}
//                     disabled={loading}
//                   >
//                     <Text style={ formData.select_date ? styles.selectedModelText : styles.placeholderText }>
//                       {formData.select_date ? formData.select_date.toLocaleDateString() : 'Select Date'}
//                     </Text>
//                   </TouchableOpacity>
//                   <TouchableOpacity
//                     onPress={handleDateIconPress}
//                     style={styles.iconButton}
//                     disabled={loading}
//                   >
//                     <Icon name="calendar-today" size={20} color="#666" />
//                   </TouchableOpacity>
//                 </View>
//                 {showDatePicker && (
//                   <DateTimePicker
//                     value={formData.select_date || new Date()}
//                     mode="date"
//                     display={Platform.OS === 'ios' ? 'spinner' : 'default'}
//                     onChange={handleDateChange}
//                   />
//                 )}
//               </LinearGradient>
//             </View>
//           </View>

//           {/* Tractor Model + Chassis No */}
//           <View style={styles.row}>
//             <View style={styles.inputContainer}>
//               <LinearGradient
//                 colors={['#7E5EA9', '#20AEBC']}
//                 style={styles.inputGradient}>
//                 <TouchableOpacity
//                   style={styles.input}
//                   onPress={() => setShowModelDropdown(true)}
//                   disabled={loading}
//                 >
//                   <Text
//                     style={
//                       formData.tractor_model
//                         ? styles.selectedModelText
//                         : styles.placeholderText
//                     }>
//                     {formData.tractor_model || 'Select Tractor Model'}
//                   </Text>
//                   <Icon
//                     name="keyboard-arrow-down"
//                     size={25}
//                     color="#666"
//                     style={styles.dropdownIcon}
//                   />
//                 </TouchableOpacity>
//               </LinearGradient>
//             </View>
//             <View style={styles.inputContainer}>
//               <LinearGradient
//                 colors={['#7E5EA9', '#20AEBC']}
//                 style={styles.inputGradient}>
//                 <View style={styles.inputWithIcon}>
//                   <TextInput
//                     style={[styles.input, styles.inputWithIconField]}
//                     value={formData.chassis_no}
//                     onChangeText={text => handleInputChange('chassis_no', text)}
//                     placeholder="Chassis No."
//                     placeholderTextColor="#666"
//                     editable={!loading}
//                   />
//                   <TouchableOpacity
//                     onPress={handleChassisScanPress}
//                     style={styles.iconButton}
//                     disabled={loading}
//                   >
//                     <Icon name="qr-code-scanner" size={20} color="#666" />
//                   </TouchableOpacity>
//                 </View>
//               </LinearGradient>
//             </View>
//           </View>

//           {/* Engine No */}
//           <View style={styles.row}>
//             <View style={styles.inputContainer}>
//               <LinearGradient
//                 colors={['#7E5EA9', '#20AEBC']}
//                 style={styles.inputGradient}>
//                 <View style={styles.inputWithIcon}>
//                   <TextInput
//                     style={[styles.input, styles.inputWithIconField]}
//                     value={formData.engine_no}
//                     onChangeText={text => handleInputChange('engine_no', text)}
//                     placeholder="Engine No."
//                     placeholderTextColor="#666"
//                     editable={!loading}
//                   />
//                   <TouchableOpacity
//                     onPress={handleEngineScanPress}
//                     style={styles.iconButton}
//                     disabled={loading}
//                   >
//                     <Icon name="qr-code-scanner" size={20} color="#666" />
//                   </TouchableOpacity>
//                 </View>
//               </LinearGradient>
//             </View>
//             <View style={styles.inputContainer}></View>
//           </View>

//           {/* Customer Details Heading */}
//           <View style={styles.sectionHeading}>
//             <Text style={styles.sectionHeadingText}>Customer Details:</Text>
//           </View>

//           {/* Dealer Name + Customer Name */}
//           <View style={styles.row}>
//             <View style={styles.inputContainer}>
//               <LinearGradient
//                 colors={['#7E5EA9', '#20AEBC']}
//                 style={styles.inputGradient}>
//                 <TextInput
//                   style={styles.input}
//                   value={formData.dealer_name}
//                   onChangeText={text => handleInputChange('dealer_name', text)}
//                   placeholder="Dealer Name"
//                   placeholderTextColor="#666"
//                   editable={!loading}
//                 />
//               </LinearGradient>
//             </View>
//             <View style={styles.inputContainer}>
//               <LinearGradient
//                 colors={['#7E5EA9', '#20AEBC']}
//                 style={styles.inputGradient}>
//                 <TextInput
//                   style={styles.input}
//                   value={formData.customer_name}
//                   onChangeText={text => handleInputChange('customer_name', text)}
//                   placeholder="Customer Name"
//                   placeholderTextColor="#666"
//                   editable={!loading}
//                 />
//               </LinearGradient>
//             </View>
//           </View>

//           {/* Customer Father's Name */}
//           <View style={styles.row}>
//             <View style={styles.inputContainer}>
//               <LinearGradient colors={['#7E5EA9', '#20AEBC']} style={styles.inputGradient}>
//                 <TextInput
//                   style={styles.input}
//                   value={formData.customer_father_name}
//                   onChangeText={text => handleInputChange('customer_father_name', text)}
//                   placeholder="Father's Name"
//                   placeholderTextColor="#666"
//                   editable={!loading}
//                 />
//               </LinearGradient>
//             </View>
//           </View>

//           {/* Customer Address */}
//           <View style={styles.row}>
//             <View style={styles.inputContainer}>
//               <LinearGradient
//                 colors={['#7E5EA9', '#20AEBC']}
//                 style={styles.inputGradient}>
//                 <TextInput
//                   style={styles.input}
//                   value={formData.customer_address}
//                   onChangeText={text => handleInputChange('customer_address', text)}
//                   placeholder="Customer Address"
//                   placeholderTextColor="#666"
//                   editable={!loading}
//                   multiline
//                 />
//               </LinearGradient>
//             </View>
//             <View style={styles.inputContainer}>
//               <LinearGradient
//                 colors={['#7E5EA9', '#20AEBC']}
//                 style={styles.inputGradient}>
//                 <TextInput
//                   style={styles.input}
//                   value={formData.customer_contact}
//                   onChangeText={text => handleInputChange('customer_contact', text)}
//                   placeholder="Customer Contact"
//                   placeholderTextColor="#666"
//                   keyboardType="phone-pad"
//                   editable={!loading}
//                 />
//               </LinearGradient>
//             </View>
//           </View>

//           {/* Tyre Details Heading */}
//           <View style={styles.sectionHeading}>
//             <Text style={styles.sectionHeadingText}>Tire Details:</Text>
//           </View>

//           {/* Select Tire Make */}
//           <View style={styles.row}>
//             <View style={styles.inputContainer}>
//               <LinearGradient
//                 colors={['#7E5EA9', '#20AEBC']}
//                 style={styles.inputGradient}>
//                 <TouchableOpacity
//                   style={styles.input}
//                   onPress={() => setShowTireDropdown(true)}
//                   disabled={loading}
//                 >
//                   <Text
//                     style={
//                       formData.tire_make
//                         ? styles.selectedModelText
//                         : styles.placeholderText
//                     }>
//                     {formData.tire_make || 'Select Tyre Make'}
//                   </Text>
//                   <Icon
//                     name="keyboard-arrow-down"
//                     size={25}
//                     color="#666"
//                     style={styles.dropdownIcon}
//                   />
//                 </TouchableOpacity>
//               </LinearGradient>
//             </View>
//             <View style={styles.inputContainer}></View>
//           </View>

//           {/* If "Other" selected for tyre make, show TextInput */}
//           {formData.tire_make === 'Other' && (
//             <View style={styles.row}>
//               <View style={styles.inputContainer}>
//                 <LinearGradient colors={['#7E5EA9', '#20AEBC']} style={styles.inputGradient}>
//                   <TextInput
//                     style={styles.input}
//                     value={formData.tire_make_other}
//                     onChangeText={text => handleInputChange('tire_make_other', text)}
//                     placeholder="Enter Other Tire Make"
//                     placeholderTextColor="#666"
//                     editable={!loading}
//                   />
//                 </LinearGradient>
//               </View>
//               <View style={styles.inputContainer}></View>
//             </View>
//           )}

//           {/* Front Right + Front Left */}
//           <View style={styles.row}>
//             <View style={styles.inputContainer}>
//               <LinearGradient
//                 colors={['#7E5EA9', '#20AEBC']}
//                 style={styles.inputGradient}>
//                 <TextInput
//                   style={styles.input}
//                   value={formData.front_right_serial_no}
//                   onChangeText={text => handleInputChange('front_right_serial_no', text)}
//                   placeholder="Front Right Serial No."
//                   placeholderTextColor="#666"
//                   editable={!loading}
//                 />
//               </LinearGradient>
//             </View>
//             <View style={styles.inputContainer}>
//               <LinearGradient
//                 colors={['#7E5EA9', '#20AEBC']}
//                 style={styles.inputGradient}>
//                 <TextInput
//                   style={styles.input}
//                   value={formData.front_left_serial_no}
//                   onChangeText={text => handleInputChange('front_left_serial_no', text)}
//                   placeholder="Front Left Serial No."
//                   placeholderTextColor="#666"
//                   editable={!loading}
//                 />
//               </LinearGradient>
//             </View>
//           </View>

//           {/* Rear Right + Rear Left */}
//           <View style={styles.row}>
//             <View style={styles.inputContainer}>
//               <LinearGradient
//                 colors={['#7E5EA9', '#20AEBC']}
//                 style={styles.inputGradient}>
//                 <TextInput
//                   style={styles.input}
//                   value={formData.rear_right_serial_no}
//                   onChangeText={text => handleInputChange('rear_right_serial_no', text)}
//                   placeholder="Rear Right Serial No."
//                   placeholderTextColor="#666"
//                   editable={!loading}
//                 />
//               </LinearGradient>
//             </View>
//             <View style={styles.inputContainer}>
//               <LinearGradient
//                 colors={['#7E5EA9', '#20AEBC']}
//                 style={styles.inputGradient}>
//                 <TextInput
//                   style={styles.input}
//                   value={formData.rear_left_serial_no}
//                   onChangeText={text => handleInputChange('rear_left_serial_no', text)}
//                   placeholder="Rear Left Serial No."
//                   placeholderTextColor="#666"
//                   editable={!loading}
//                 />
//               </LinearGradient>
//             </View>
//           </View>

//           {/* Battery Details Heading */}
//           <View style={styles.sectionHeading}>
//             <Text style={styles.sectionHeadingText}>Battery Details:</Text>
//           </View>

//           {/* Select Battery Make */}
//           <View style={styles.row}>
//             <View style={styles.inputContainer}>
//               <LinearGradient
//                 colors={['#7E5EA9', '#20AEBC']}
//                 style={styles.inputGradient}>
//                 <TouchableOpacity
//                   style={styles.input}
//                   onPress={() => setShowBatteryDropdown(true)}
//                   disabled={loading}
//                 >
//                   <Text
//                     style={
//                       formData.battery_make
//                         ? styles.selectedModelText
//                         : styles.placeholderText
//                     }>
//                     {formData.battery_make || 'Select Battery Make'}
//                   </Text>
//                   <Icon
//                     name="keyboard-arrow-down"
//                     size={25}
//                     color="#666"
//                     style={styles.dropdownIcon}
//                   />
//                 </TouchableOpacity>
//               </LinearGradient>
//             </View>
//             <View style={styles.inputContainer}></View>
//           </View>

//           {/* If "Other" selected for battery make, show TextInput */}
//           {formData.battery_make === 'Other' && (
//             <View style={styles.row}>
//               <View style={styles.inputContainer}>
//                 <LinearGradient colors={['#7E5EA9', '#20AEBC']} style={styles.inputGradient}>
//                   <TextInput
//                     style={styles.input}
//                     value={formData.battery_make_other}
//                     onChangeText={text => handleInputChange('battery_make_other', text)}
//                     placeholder="Enter Other Battery Make"
//                     placeholderTextColor="#666"
//                     editable={!loading}
//                   />
//                 </LinearGradient>
//               </View>
//               <View style={styles.inputContainer}></View>
//             </View>
//           )}

//           {/* Battery Date */}
//           <View style={styles.row}>
//             <View style={styles.inputContainer}>
//               <LinearGradient colors={['#7E5EA9', '#20AEBC']} style={styles.inputGradient}>
//                 <View style={styles.inputWithIcon}>
//                   <TouchableOpacity
//                     style={[styles.input, styles.inputWithIconField]}
//                     onPress={handleBatteryDateIconPress}
//                     disabled={loading}
//                   >
//                     <Text style={ formData.battery_date ? styles.selectedModelText : styles.placeholderText }>
//                       {formData.battery_date ? formData.battery_date.toLocaleDateString() : 'Select Battery Date'}
//                     </Text>
//                   </TouchableOpacity>
//                   <TouchableOpacity
//                     onPress={handleBatteryDateIconPress}
//                     style={styles.iconButton}
//                     disabled={loading}
//                   >
//                     <Icon name="calendar-today" size={20} color="#666" />
//                   </TouchableOpacity>
//                 </View>
//                 {showBatteryDatePicker && (
//                   <DateTimePicker
//                     value={formData.battery_date || new Date()}
//                     mode="date"
//                     display={Platform.OS === 'ios' ? 'spinner' : 'default'}
//                     onChange={handleBatteryDateChange}
//                   />
//                 )}
//               </LinearGradient>
//             </View>
//           </View>

//           {/* Battery Serial No + Tractor Starter Serial No */}
//           <View style={styles.row}>
//             <View style={styles.inputContainer}>
//               <LinearGradient
//                 colors={['#7E5EA9', '#20AEBC']}
//                 style={styles.inputGradient}>
//                 <View style={styles.inputWithIcon}>
//                   <TextInput
//                     style={[styles.input, styles.inputWithIconField]}
//                     value={formData.battery_serial_no}
//                     onChangeText={text => handleInputChange('battery_serial_no', text)}
//                     placeholder="Battery Serial No."
//                     placeholderTextColor="#666"
//                     editable={!loading}
//                   />
//                   <TouchableOpacity
//                     onPress={handleBatteryScanPress}
//                     style={styles.iconButton}
//                     disabled={loading}
//                   >
//                     <Icon name="qr-code-scanner" size={20} color="#666" />
//                   </TouchableOpacity>
//                 </View>
//               </LinearGradient>
//             </View>
//             <View style={styles.inputContainer}>
//               <LinearGradient
//                 colors={['#7E5EA9', '#20AEBC']}
//                 style={styles.inputGradient}>
//                 <View style={styles.inputWithIcon}>
//                   <TextInput
//                     style={[styles.input, styles.inputWithIconField]}
//                     value={formData.tractor_starter_serial_no}
//                     onChangeText={text => handleInputChange('tractor_starter_serial_no', text)}
//                     placeholder="Tractor Starter Serial No."
//                     placeholderTextColor="#666"
//                     editable={!loading}
//                   />
//                   <TouchableOpacity
//                     onPress={handleStarterScanPress}
//                     style={styles.iconButton}
//                     disabled={loading}
//                   >
//                     <Icon name="qr-code-scanner" size={20} color="#666" />
//                   </TouchableOpacity>
//                 </View>
//               </LinearGradient>
//             </View>
//           </View>

//           {/* FIP No + Tractor Alternator No */}
//           <View style={styles.row}>
//             <View style={styles.inputContainer}>
//               <LinearGradient
//                 colors={['#7E5EA9', '#20AEBC']}
//                 style={styles.inputGradient}>
//                 <View style={styles.inputWithIcon}>
//                   <TextInput
//                     style={[styles.input, styles.inputWithIconField]}
//                     value={formData.fip_no}
//                     onChangeText={text => handleInputChange('fip_no', text)}
//                     placeholder="FIP No."
//                     placeholderTextColor="#666"
//                     editable={!loading}
//                   />
//                   <TouchableOpacity
//                     onPress={handleFipScanPress}
//                     style={styles.iconButton}
//                     disabled={loading}
//                   >
//                     <Icon name="qr-code-scanner" size={20} color="#666" />
//                   </TouchableOpacity>
//                 </View>
//               </LinearGradient>
//             </View>
//             <View style={styles.inputContainer}>
//               <LinearGradient
//                 colors={['#7E5EA9', '#20AEBC']}
//                 style={styles.inputGradient}>
//                 <View style={styles.inputWithIcon}>
//                   <TextInput
//                     style={[styles.input, styles.inputWithIconField]}
//                     value={formData.tractor_alternator_no}
//                     onChangeText={text => handleInputChange('tractor_alternator_no', text)}
//                     placeholder="Tractor Alternator No."
//                     placeholderTextColor="#666"
//                     editable={!loading}
//                   />
//                   <TouchableOpacity
//                     onPress={handleAlternatorScanPress}
//                     style={styles.iconButton}
//                     disabled={loading}
//                   >
//                     <Icon name="qr-code-scanner" size={20} color="#666" />
//                   </TouchableOpacity>
//                 </View>
//               </LinearGradient>
//             </View>
//           </View>

//           {/* PDI Done By + Remarks */}
//           <View style={styles.row}>
//             <View style={styles.inputContainer}>
//               <LinearGradient
//                 colors={['#7E5EA9', '#20AEBC']}
//                 style={styles.inputGradient}>
//                 <TextInput
//                   style={styles.input}
//                   value={formData.pdi_done_by}
//                   onChangeText={text => handleInputChange('pdi_done_by', text)}
//                   placeholder="PDI Done By"
//                   placeholderTextColor="#666"
//                   editable={!loading}
//                 />
//               </LinearGradient>
//             </View>
//             <View style={styles.inputContainer}>
//               <LinearGradient
//                 colors={['#7E5EA9', '#20AEBC']}
//                 style={styles.inputGradient}>
//                 <TextInput
//                   style={styles.input}
//                   value={formData.remarks}
//                   onChangeText={text => handleInputChange('remarks', text)}
//                   placeholder="Remarks"
//                   placeholderTextColor="#666"
//                   editable={!loading}
//                   multiline
//                 />
//               </LinearGradient>
//             </View>
//           </View>
//         </View>

//         {/* Tractor Model Modal */}
//         <Modal
//           visible={showModelDropdown}
//           transparent={true}
//           animationType="slide"
//           onRequestClose={() => setShowModelDropdown(false)}>
//           <View style={styles.modalOverlay}>
//             <View style={styles.modalContent}>
//               <View style={styles.modalHeader}>
//                 <Text style={styles.modalTitle}>Select Tractor Model</Text>
//                 <TouchableOpacity
//                   onPress={() => setShowModelDropdown(false)}
//                   style={styles.closeButton}>
//                   <Icon name="close" size={24} color="#000" />
//                 </TouchableOpacity>
//               </View>
//               <FlatList
//                 data={tractorModels}
//                 renderItem={renderModelItem}
//                 keyExtractor={(item, index) => index.toString()}
//                 style={styles.modelList}
//               />
//             </View>
//           </View>
//         </Modal>

//         {/* Tire Make Modal */}
//         <Modal
//           visible={showTireDropdown}
//           transparent={true}
//           animationType="slide"
//           onRequestClose={() => setShowTireDropdown(false)}>
//           <View style={styles.modalOverlay}>
//             <View style={styles.modalContent}>
//               <View style={styles.modalHeader}>
//                 <Text style={styles.modalTitle}>Select Tire Make</Text>
//                 <TouchableOpacity
//                   onPress={() => setShowTireDropdown(false)}
//                   style={styles.closeButton}>
//                   <Icon name="close" size={24} color="#000" />
//                 </TouchableOpacity>
//               </View>
//               <FlatList
//                 data={tireMakes}
//                 renderItem={renderTireItem}
//                 keyExtractor={(item, index) => index.toString()}
//                 style={styles.modelList}
//               />
//             </View>
//           </View>
//         </Modal>

//         {/* Battery Make Modal */}
//         <Modal
//           visible={showBatteryDropdown}
//           transparent={true}
//           animationType="slide"
//           onRequestClose={() => setShowBatteryDropdown(false)}>
//           <View style={styles.modalOverlay}>
//             <View style={styles.modalContent}>
//               <View style={styles.modalHeader}>
//                 <Text style={styles.modalTitle}>Select Battery Make</Text>
//                 <TouchableOpacity
//                   onPress={() => setShowBatteryDropdown(false)}
//                   style={styles.closeButton}>
//                   <Icon name="close" size={24} color="#000" />
//                 </TouchableOpacity>
//               </View>
//               <FlatList
//                 data={batteryMakes}
//                 renderItem={renderBatteryItem}
//                 keyExtractor={(item, index) => index.toString()}
//                 style={styles.modelList}
//               />
//             </View>
//           </View>
//         </Modal>

//         {/* Hypothecation Modal */}
//         <Modal
//           visible={showHypothecationDropdown}
//           transparent={true}
//           animationType="slide"
//           onRequestClose={() => setShowHypothecationDropdown(false)}>
//           <View style={styles.modalOverlay}>
//             <View style={styles.modalContent}>
//               <View style={styles.modalHeader}>
//                 <Text style={styles.modalTitle}>Select Hypothecation</Text>
//                 <TouchableOpacity
//                   onPress={() => setShowHypothecationDropdown(false)}
//                   style={styles.closeButton}>
//                   <Icon name="close" size={24} color="#000" />
//                 </TouchableOpacity>
//               </View>
//               <FlatList
//                 data={hypothecationOptions}
//                 renderItem={renderHypothecationItem}
//                 keyExtractor={(item, index) => index.toString()}
//                 style={styles.modelList}
//               />
//             </View>
//           </View>
//         </Modal>

//         {/* QR Scanner Modal */}
//         {renderQRScanner()}

//         {/* Radio Sections */}
//         <View style={styles.radioSection}>
//           <Text style={styles.radioLabel}>Lights OK:</Text>
//           {renderYesNo('lights_ok')}
//           {radioValues.lights_ok === '0' && (
//             <View style={styles.remarkInputContainer}>
//               <LinearGradient colors={['#7E5EA9', '#20AEBC']} style={styles.inputGradient}>
//                 <TextInput
//                   style={styles.remarkInput}
//                   value={formData.lights_no}
//                   onChangeText={text => handleInputChange('lights_no', text)}
//                   placeholder="Remark for Lights OK ?"
//                   placeholderTextColor="#666"
//                   editable={!loading}
//                   multiline
//                 />
//               </LinearGradient>
//             </View>
//           )}

//           <Text style={styles.radioLabel}>Nuts OK:</Text>
//           {renderYesNo('nuts_ok')}
//           {radioValues.nuts_ok === '0' && (
//             <View style={styles.remarkInputContainer}>
//               <LinearGradient colors={['#7E5EA9', '#20AEBC']} style={styles.inputGradient}>
//                 <TextInput
//                   style={styles.remarkInput}
//                   value={formData.nuts_no}
//                   onChangeText={text => handleInputChange('nuts_no', text)}
//                   placeholder="Remark for Nuts OK ?"
//                   placeholderTextColor="#666"
//                   editable={!loading}
//                   multiline
//                 />
//               </LinearGradient>
//             </View>
//           )}

//           <Text style={styles.radioLabel}>Hydraulic Oil:</Text>
//           {renderFullHalf('hydraulic_oil')}
//           {radioValues.hydraulic_oil === '0' && (
//             <View style={styles.remarkInputContainer}>
//               <LinearGradient colors={['#7E5EA9', '#20AEBC']} style={styles.inputGradient}>
//                 <TextInput
//                   style={styles.remarkInput}
//                   value={formData.hydraulic_oil_half}
//                   onChangeText={text => handleInputChange('hydraulic_oil_half', text)}
//                   placeholder="Remark for Hydraulic Oil ?"
//                   placeholderTextColor="#666"
//                   editable={!loading}
//                   multiline
//                 />
//               </LinearGradient>
//             </View>
//           )}

//           <Text style={styles.radioLabel}>All Nuts Are Sealed:</Text>
//           {renderYesNo('all_nuts_sealed')}
//           {radioValues.all_nuts_sealed === '0' && (
//             <View style={styles.remarkInputContainer}>
//               <LinearGradient colors={['#7E5EA9', '#20AEBC']} style={styles.inputGradient}>
//                 <TextInput
//                   style={styles.remarkInput}
//                   value={formData.all_nuts_sealed_no}
//                   onChangeText={text => handleInputChange('all_nuts_sealed_no', text)}
//                   placeholder="Remark for All Nuts Are Sealed ?"
//                   placeholderTextColor="#666"
//                   editable={!loading}
//                   multiline
//                 />
//               </LinearGradient>
//             </View>
//           )}

//           <Text style={styles.radioLabel}>Engine Oil Level:</Text>
//           {renderYesNo('engine_oil_level')}
//           {radioValues.engine_oil_level === '0' && (
//             <View style={styles.remarkInputContainer}>
//               <LinearGradient colors={['#7E5EA9', '#20AEBC']} style={styles.inputGradient}>
//                 <TextInput
//                   style={styles.remarkInput}
//                   value={formData.engine_oil_level_half}
//                   onChangeText={text => handleInputChange('engine_oil_level_half', text)}
//                   placeholder="Remark for Engine Oil Level ?"
//                   placeholderTextColor="#666"
//                   editable={!loading}
//                   multiline
//                 />
//               </LinearGradient>
//             </View>
//           )}

//           <Text style={styles.radioLabel}>Coolant Level:</Text>
//           {renderYesNo('coolant_level')}
//           {radioValues.coolant_level === '0' && (
//             <View style={styles.remarkInputContainer}>
//               <LinearGradient colors={['#7E5EA9', '#20AEBC']} style={styles.inputGradient}>
//                 <TextInput
//                   style={styles.remarkInput}
//                   value={formData.coolant_level_no}
//                   onChangeText={text => handleInputChange('coolant_level_no', text)}
//                   placeholder="Remark for Coolant Level ?"
//                   placeholderTextColor="#666"
//                   editable={!loading}
//                   multiline
//                 />
//               </LinearGradient>
//             </View>
//           )}

//           <Text style={styles.radioLabel}>Brake Fluid Level:</Text>
//           {renderYesNo('brake_fluid_level')}
//           {radioValues.brake_fluid_level === '0' && (
//             <View style={styles.remarkInputContainer}>
//               <LinearGradient colors={['#7E5EA9', '#20AEBC']} style={styles.inputGradient}>
//                 <TextInput
//                   style={styles.remarkInput}
//                   value={formData.brake_fluid_level_no}
//                   onChangeText={text => handleInputChange('brake_fluid_level_no', text)}
//                   placeholder="Remark for Brake Fluid Level ?"
//                   placeholderTextColor="#666"
//                   editable={!loading}
//                   multiline
//                 />
//               </LinearGradient>
//             </View>
//           )}

//           <Text style={styles.radioLabel}>Greasing Done</Text>
//           {renderYesNo('greasing_done')}
//           {radioValues.greasing_done === '0' && (
//             <View style={styles.remarkInputContainer}>
//               <LinearGradient colors={['#7E5EA9', '#20AEBC']} style={styles.inputGradient}>
//                 <TextInput
//                   style={styles.remarkInput}
//                   value={formData.greasing_done_no}
//                   onChangeText={text => handleInputChange('greasing_done_no', text)}
//                   placeholder="Remark for Greasing Done ?"
//                   placeholderTextColor="#666"
//                   editable={!loading}
//                   multiline
//                 />
//               </LinearGradient>
//             </View>
//           )}

//           <Text style={styles.radioLabel}>Paint Scratches</Text>
//           {renderYesNo('paint_scratches')}
//           {radioValues.paint_scratches === '0' && (
//             <View style={styles.remarkInputContainer}>
//               <LinearGradient colors={['#7E5EA9', '#20AEBC']} style={styles.inputGradient}>
//                 <TextInput
//                   style={styles.remarkInput}
//                   value={formData.paint_scratches_no}
//                   onChangeText={text => handleInputChange('paint_scratches_no', text)}
//                   placeholder="Remark for Paint Scratches ?"
//                   placeholderTextColor="#666"
//                   editable={!loading}
//                   multiline
//                 />
//               </LinearGradient>
//             </View>
//           )}

//           <Text style={styles.radioLabel}>Toolkit Available</Text>
//           {renderYesNo('toolkit_available')}
//           {radioValues.toolkit_available === '0' && (
//             <View style={styles.remarkInputContainer}>
//               <LinearGradient colors={['#7E5EA9', '#20AEBC']} style={styles.inputGradient}>
//                 <TextInput
//                   style={styles.remarkInput}
//                   value={formData.toolkit_available_no}
//                   onChangeText={text => handleInputChange('toolkit_available_no', text)}
//                   placeholder="Remark for Toolkit Available ?"
//                   placeholderTextColor="#666"
//                   editable={!loading}
//                   multiline
//                 />
//               </LinearGradient>
//             </View>
//           )}

//           <Text style={styles.radioLabel}>Owner Manual Given</Text>
//           {renderYesNo('owner_manual_given')}
//           {radioValues.owner_manual_given === '0' && (
//             <View style={styles.remarkInputContainer}>
//               <LinearGradient colors={['#7E5EA9', '#20AEBC']} style={styles.inputGradient}>
//                 <TextInput
//                   style={styles.remarkInput}
//                   value={formData.owner_manual_given_no}
//                   onChangeText={text => handleInputChange('owner_manual_given_no', text)}
//                   placeholder="Remark for Owner Manual Given ?"
//                   placeholderTextColor="#666"
//                   editable={!loading}
//                   multiline
//                 />
//               </LinearGradient>
//             </View>
//           )}

//           <Text style={styles.radioLabel}>Reflector Sticker Applied</Text>
//           {renderYesNo('reflector_sticker_applied')}
//           {radioValues.reflector_sticker_applied === '0' && (
//             <View style={styles.remarkInputContainer}>
//               <LinearGradient colors={['#7E5EA9', '#20AEBC']} style={styles.inputGradient}>
//                 <TextInput
//                   style={styles.remarkInput}
//                   value={formData.reflector_sticker_applied_no}
//                   onChangeText={text => handleInputChange('reflector_sticker_applied_no', text)}
//                   placeholder="Remark for Reflector Sticker Applied ?"
//                   placeholderTextColor="#666"
//                   editable={!loading}
//                   multiline
//                 />
//               </LinearGradient>
//             </View>
//           )}

//           <Text style={styles.radioLabel}>Number Plate Fixed</Text>
//           {renderYesNo('number_plate_fixed')}
//           {radioValues.number_plate_fixed === '0' && (
//             <View style={styles.remarkInputContainer}>
//               <LinearGradient colors={['#7E5EA9', '#20AEBC']} style={styles.inputGradient}>
//                 <TextInput
//                   style={styles.remarkInput}
//                   value={formData.number_plate_fixed_no}
//                   onChangeText={text => handleInputChange('number_plate_fixed_no', text)}
//                   placeholder="Remark for Number Plate Fixed ?"
//                   placeholderTextColor="#666"
//                   editable={!loading}
//                   multiline
//                 />
//               </LinearGradient>
//             </View>
//           )}

//           <Text style={styles.radioLabel}>Tractor Delivered:</Text>
//           {renderYesNo('tractor_delivered')}
//         </View>

//         {/* Delivery Customer Details */}
//         {radioValues.tractor_delivered === '1' && (
//           <View style={styles.sectionHeading}>
//             <Text style={styles.sectionHeadingText}>Delivery Customer Details:</Text>

//             {/* Delivery Customer Name + Father's Name */}
//             <View style={[styles.row, {marginTop: 8}]}>
//               <View style={styles.inputContainer}>
//                 <LinearGradient colors={['#7E5EA9', '#20AEBC']} style={styles.inputGradient}>
//                   <TextInput
//                     style={styles.input}
//                     value={formData.delivery_customer_name}
//                     onChangeText={text => handleInputChange('delivery_customer_name', text)}
//                     placeholder="Customer Name"
//                     placeholderTextColor="#666"
//                     editable={!loading}
//                   />
//                 </LinearGradient>
//               </View>
//               <View style={styles.inputContainer}>
//                 <LinearGradient colors={['#7E5EA9', '#20AEBC']} style={styles.inputGradient}>
//                   <TextInput
//                     style={styles.input}
//                     value={formData.delivery_customer_father_name}
//                     onChangeText={text => handleInputChange('delivery_customer_father_name', text)}
//                     placeholder="Father's Name"
//                     placeholderTextColor="#666"
//                     editable={!loading}
//                   />
//                 </LinearGradient>
//               </View>
//             </View>

//             {/* Delivery Address + Mobile */}
//             <View style={styles.row}>
//               <View style={styles.inputContainer}>
//                 <LinearGradient colors={['#7E5EA9', '#20AEBC']} style={styles.inputGradient}>
//                   <TextInput
//                     style={styles.input}
//                     value={formData.delivery_customer_address}
//                     onChangeText={text => handleInputChange('delivery_customer_address', text)}
//                     placeholder="Address"
//                     placeholderTextColor="#666"
//                     editable={!loading}
//                     multiline
//                   />
//                 </LinearGradient>
//               </View>
//               <View style={styles.inputContainer}>
//                 <LinearGradient colors={['#7E5EA9', '#20AEBC']} style={styles.inputGradient}>
//                   <TextInput
//                     style={styles.input}
//                     value={formData.delivery_customer_contact}
//                     onChangeText={text => handleInputChange('delivery_customer_contact', text)}
//                     placeholder="Mobile Number"
//                     placeholderTextColor="#666"
//                     keyboardType="phone-pad"
//                     editable={!loading}
//                   />
//                 </LinearGradient>
//               </View>
//             </View>

//             {/* Hypothecation dropdown + 'Other' input if selected */}
//             <View style={styles.row}>
//               <View style={styles.inputContainer}>
//                 <LinearGradient colors={['#7E5EA9', '#20AEBC']} style={styles.inputGradient}>
//                   <TouchableOpacity
//                     style={styles.input}
//                     onPress={() => setShowHypothecationDropdown(true)}
//                     disabled={loading}
//                   >
//                     <Text style={ formData.hypothecation ? styles.selectedModelText : styles.placeholderText }>
//                       {formData.hypothecation || 'Select Hypothecation'}
//                     </Text>
//                     <Icon
//                       name="keyboard-arrow-down"
//                       size={25}
//                       color="#666"
//                       style={styles.dropdownIcon}
//                     />
//                   </TouchableOpacity>
//                 </LinearGradient>
//               </View>
//               <View style={styles.inputContainer}></View>
//             </View>

//             {formData.hypothecation === 'Other' && (
//               <View style={styles.row}>
//                 <View style={styles.inputContainer}>
//                   <LinearGradient colors={['#7E5EA9', '#20AEBC']} style={styles.inputGradient}>
//                     <TextInput
//                       style={styles.input}
//                       value={formData.hypothecation_other}
//                       onChangeText={text => handleInputChange('hypothecation_other', text)}
//                       placeholder="Enter Other Hypothecation"
//                       placeholderTextColor="#666"
//                       editable={!loading}
//                     />
//                   </LinearGradient>
//                 </View>
//                 <View style={styles.inputContainer}></View>
//               </View>
//             )}
//           </View>
//         )}

//         {/* Terms and Conditions Section */}
//         {radioValues.tractor_delivered === '1' && (
//           <View style={styles.termsSection}>
//             <Text style={styles.termsTitle}>Terms and Conditions</Text>
            
//             <View style={styles.termsList}>
//               <Text style={styles.termItem}>1. Tractor Will Be Inspected Only After Full Payment Confirmation From The Accounts Department.</Text>
//               <Text style={styles.termItem}>2. PDI Will Be Carried Out Strictly As Per John Deere India Pvt. Ltd. Guidelines.</Text>
//               <Text style={styles.termItem}>3. Any Damages Or Discrepancies Found Before Delivery Will Be Rectified Prior To Handover.</Text>
//               <Text style={styles.termItem}>4. No Mechanical Or Electrical Modifications Are Allowed During Or After Pdi.</Text>
//               <Text style={styles.termItem}>5. Customer Must Be Present During Final Inspection And Sign The Pdi Report.</Text>
//               <Text style={styles.termItem}>6. Tractor Delivery Will Be Done Only After Successful Completion Of All Inspection Points.</Text>
//               <Text style={styles.termItem}>7. Makroo Motor Corporation Will Not Be Responsible For Any Issues Arising After Customer Approval And Delivery.</Text>
//               <Text style={styles.termItem}>8. All Fluids, Oil Levels, And Battery Conditions Will Be Checked And Recorded Before Handover.</Text>
//               <Text style={styles.termItem}>9. Tractor Registration And Number Plate Installation Will Be Handled Separately As Per Rto Process.</Text>
//             </View>

//             <Text style={styles.declarationTitle}>Customer Declaration</Text>
//             <Text style={styles.declarationText}>
//               I Have Personally Verified The Tractor After Completion Of The Pre-delivery Inspection (Pdi) At Makroo Motor Corporation. All Functions, Fittings, And Accessories Have Been Checked In My Presence. I Am Satisfied With The Tractor's Condition And Accept Delivery In Proper Working Order.
//             </Text>

//             <View style={styles.checkboxContainer}>
//               <TouchableOpacity 
//                 style={[styles.checkbox, isTermsAccepted && styles.checkboxChecked]} 
//                 onPress={() => setIsTermsAccepted(!isTermsAccepted)}
//                 disabled={loading}
//               >
//                 {isTermsAccepted && <Icon name="check" size={16} color="#fff" />}
//               </TouchableOpacity>
//               <Text style={styles.checkboxLabel}>Accept All Terms and Conditions</Text>
//             </View>
//           </View>
//         )}

//         {/* Photo & Signature */}
//         <View style={styles.photoSignatureSection}>
//           <TouchableOpacity 
//             style={styles.photoSignatureBox} 
//             onPress={() => showImagePickerOptions(setCustomerPhoto)}
//             disabled={loading}
//           >
//             {customer_photo ? (
//               <Image 
//                 source={{ uri: customer_photo.uri }} 
//                 style={styles.previewImage}
//                 resizeMode="contain"
//               />
//             ) : (
//               <>
//                 <Icon name="photo-camera" size={35} color="#666" />
//                 <Text style={styles.photoSignatureText}>Customer Photo</Text>
//                 {isEditMode && <Text style={styles.optionalText}>(Optional for update)</Text>}
//               </>
//             )}
//           </TouchableOpacity>

//           <TouchableOpacity 
//             style={styles.photoSignatureBox1} 
//             onPress={() => showImagePickerOptions(setCustomerSignature)}
//             disabled={loading}
//           >
//             {customer_signature ? (
//               <Image 
//                 source={{ uri: customer_signature.uri }} 
//                 style={styles.previewImage}
//                 resizeMode="contain"
//               />
//             ) : (
//               <>
//                 <Text style={styles.photoSignatureText}>Customer Signature</Text>
//                 {isEditMode && <Text style={styles.optionalText}>(Optional for update)</Text>}
//               </>
//             )}
//           </TouchableOpacity>

//           <TouchableOpacity 
//             style={styles.photoSignatureBox1} 
//             onPress={() => showImagePickerOptions(setManagerSignature)}
//             disabled={loading}
//           >
//             {manager_signature ? (
//               <Image 
//                 source={{ uri: manager_signature.uri }} 
//                 style={styles.previewImage}
//                 resizeMode="contain"
//               />
//             ) : (
//               <>
//                 <Text style={styles.photoSignatureText}>Manager Signature</Text>
//                 {isEditMode && <Text style={styles.optionalText}>(Optional for update)</Text>}
//               </>
//             )}
//           </TouchableOpacity>
//         </View>

//         {/* Buttons */}
//         <View style={styles.buttonContainer}>
//           <TouchableOpacity 
//             style={[
//               styles.submitButton, 
//               loading && styles.disabledButton,
//               (radioValues.tractor_delivered === '1' && !isTermsAccepted) && styles.disabledButton
//             ]} 
//             onPress={handleSubmit}
//             disabled={loading || (radioValues.tractor_delivered === '1' && !isTermsAccepted)}
//           >
//             {loading ? (
//               <ActivityIndicator color="#fff" size="small" />
//             ) : (
//               <Text style={styles.submitButtonText}>
//                 {isEditMode ? 'Update Form' : 'Submit Form'}
//               </Text>
//             )}
//           </TouchableOpacity>

//           <TouchableOpacity 
//             style={[styles.homeButton, loading && styles.disabledButton]} 
//             onPress={handleHome}
//             disabled={loading}
//           >
//             <Text style={styles.homeButtonText}>Home</Text>
//           </TouchableOpacity>
//         </View>
//       </ScrollView>
//     </View>
//   );

//   // === Render Radio Helpers ===
//   function renderYesNo(field) {
//     return (
//       <View style={styles.radioOptionsContainer}>
//         {[
//           {label: 'YES', value: '1'},
//           {label: 'NO', value: '0'}
//         ].map(({label, value}) => (
//           <TouchableOpacity
//             key={value}
//             style={[
//               styles.radioOptionWrapper,
//               radioValues[field] === value && styles.radioOptionSelected,
//             ]}
//             onPress={() => {
//               handleRadioChange(field, value);
//             }}
//             disabled={loading}
//           >
//             <LinearGradient
//               colors={['#7E5EA9', '#20AEBC']}
//               style={styles.radioOptionGradient}>
//               <View
//                 style={[
//                   styles.radioOptionInner,
//                   radioValues[field] === value &&
//                     styles.radioOptionInnerSelected,
//                 ]}>
//                 <Text
//                   style={[
//                     styles.radioOptionText,
//                     radioValues[field] === value &&
//                       styles.radioOptionTextSelected,
//                   ]}>
//                   {label}
//                 </Text>
//               </View>
//             </LinearGradient>
//           </TouchableOpacity>
//         ))}
//       </View>
//     );
//   }

//   function renderFullHalf(field) {
//     return (
//       <View style={styles.radioOptionsContainer}>
//         {[
//           {label: 'FULL', value: '1'},
//           {label: 'HALF', value: '0'}
//         ].map(({label, value}) => (
//           <TouchableOpacity
//             key={value}
//             style={[
//               styles.radioOptionWrapper,
//               radioValues[field] === value && styles.radioOptionSelected,
//             ]}
//             onPress={() => handleRadioChange(field, value)}
//             disabled={loading}
//           >
//             <LinearGradient
//               colors={['#7E5EA9', '#20AEBC']}
//               style={styles.radioOptionGradient}>
//               <View
//                 style={[
//                   styles.radioOptionInner,
//                   radioValues[field] === value &&
//                     styles.radioOptionInnerSelected,
//                 ]}>
//                 <Text
//                   style={[
//                     styles.radioOptionText,
//                     radioValues[field] === value &&
//                       styles.radioOptionTextSelected,
//                   ]}>
//                   {label}
//                 </Text>
//               </View>
//             </LinearGradient>
//           </TouchableOpacity>
//         ))}
//       </View>
//     );
//   }
// };

// const styles = StyleSheet.create({
//   container: {paddingHorizontal: 15},
//   header: {alignItems: 'center', paddingVertical: 10},
//   companyName: {fontSize: 16,  color: 'white',fontFamily: 'Inter_28pt-SemiBold'},
//   formNo: {fontSize: 14, marginVertical: 10,fontFamily: 'Inter_28pt-SemiBold', color: '#000'},
//   Date: {
//     fontSize: 12,
//     textAlign: 'right',
//     marginVertical: 5,
//     color: '#00000099',
//     fontFamily: 'Inter_28pt-Medium',
//   },
//   editModeContainer: {
//     backgroundColor: '#f0e6ff',
//     padding: 8,
//     borderRadius: 5,
//     marginVertical: 5,
//     alignItems: 'center',
//   },
//   editModeText: {
//     fontSize: 12,
//     fontFamily: 'Inter_28pt-SemiBold',
//     color: '#7E5EA9',
//   },
//   sectionHeading: {
//     marginVertical: 10,
//     paddingLeft: 5,
//   },
//   sectionHeadingText: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#000',
//     fontFamily: 'Inter_28pt-SemiBold',
//   },
//   formContainer: {marginBottom: 15},
//   row: {},
//   inputContainer: {
//     flex: 1, 
//     marginHorizontal: 4, 
//     marginBottom: 12
//   },
//   inputGradient: {borderRadius: 10, padding: 1},
//   input: {
//     borderRadius: 10,
//     backgroundColor: '#fff',
//     padding: 12,
//     fontSize: 14,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   selectedModelText: {fontSize: 14, color: '#000', fontFamily: 'Inter_28pt-Medium'},
//   placeholderText: {fontSize: 14, color: '#666', fontFamily: 'Inter_28pt-Medium'},
//   dropdownIcon: {marginLeft: 8},
//   inputWithIcon: {flexDirection: 'row', alignItems: 'center'},
//   inputWithIconField: {flex: 1},
//   iconButton: {position: 'absolute', right: 12, padding: 4},
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   modalContent: {backgroundColor: 'white', borderRadius: 10, width: '90%'},
//   modalHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     padding: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: '#f0f0f0',
//   },
//   modalTitle: {fontSize: 16, fontWeight: 'bold', fontFamily: 'Inter_28pt-SemiBold'},
//   closeButton: {padding: 4},
//   modelList: {maxHeight: 300},
//   modelItem: {padding: 15, borderBottomWidth: 1, borderBottomColor: '#f0f0f0'},
//   modelItemText: {fontSize: 14, color: '#333',fontFamily: 'Inter_28pt-Medium'},
//   // QR Scanner Styles
//   scannerContainer: {
//     flex: 1,
//     backgroundColor: '#000',
//   },
//   scannerHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 15,
//     paddingTop: 50,
//     backgroundColor: 'rgba(0,0,0,0.7)',
//   },
//   scannerCloseButton: {
//     padding: 8,
//     marginRight: 15,
//   },
//   scannerTitle: {
//     fontSize: 18,
//     color: '#fff',
//     fontWeight: 'bold',
//   },
//   camera: {
//     flex: 1,
//   },
//   scannerFooter: {
//     padding: 20,
//     backgroundColor: 'rgba(0,0,0,0.7)',
//     alignItems: 'center',
//   },
//   scannerInstructions: {
//     color: '#fff',
//     fontSize: 16,
//     textAlign: 'center',
//   },
//   radioSection: {marginBottom: 15},
//   radioLabel: {fontSize: 12, marginBottom: 6, color: '#000',fontFamily: 'Inter_28pt-Medium',marginTop:0},
//   radioOptionsContainer: {flexDirection: 'row'},
//   radioOptionWrapper: {flex: 1, marginHorizontal: 8, marginBottom: 15},
//   radioOptionGradient: {borderRadius: 6, padding: 1},
//   radioOptionInner: {
//     borderRadius: 5,
//     paddingVertical: 10,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//   },
//   radioOptionInnerSelected: {backgroundColor: '#7E5EA9'},
//   radioOptionText: {fontSize: 12, color: '#000',fontFamily: 'Inter_28pt-Medium'},
//   radioOptionTextSelected: {color: '#fff'},
//   // Remark Input Styles
//   remarkInputContainer: {
//     marginHorizontal: 8,
//     marginBottom: 15,
//   },
//   remarkInput: {
//     borderRadius: 10,
//     backgroundColor: '#fff',
//     padding: 12,
//     fontSize: 14,
//     minHeight: 50,
//     textAlignVertical: 'top',
//   },
//   // Terms and Conditions Styles
//   termsSection: {
//     marginBottom: 15,
//     padding: 10,
//   },
//   termsTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#000',
//     marginBottom: 10,
//     fontFamily: 'Inter_28pt-SemiBold',
//   },
//   termsList: {
//     marginBottom: 15,
//   },
//   termItem: {
//     fontSize: 12,
//     color: '#333',
//     marginBottom: 8,
//     lineHeight: 16,
//     fontFamily: 'Inter_28pt-Medium',
//   },
//   declarationTitle: {
//     fontSize: 15,
//     fontWeight: 'bold',
//     color: '#000',
//     marginTop: 10,
//     marginBottom: 8,
//     fontFamily: 'Inter_28pt-SemiBold',
//   },
//   declarationText: {
//     fontSize: 12,
//     color: '#333',
//     lineHeight: 16,
//     marginBottom: 15,
//     fontFamily: 'Inter_28pt-Medium',
//   },
//   checkboxContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 10,
//   },
//   checkbox: {
//     width: 20,
//     height: 20,
//     borderWidth: 2,
//     borderColor: '#666',
//     borderRadius: 4,
//     marginRight: 10,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//   },
//   checkboxChecked: {
//     backgroundColor: '#28a745',
//     borderColor: '#28a745',
//   },
//   checkboxLabel: {
//     fontSize: 14,
//     color: '#000',
//     fontFamily: 'Inter_28pt-Medium',
//   },
//   photoSignatureSection: {marginTop: 20},
//   photoSignatureBox: {
//     width: '100%',
//     height: 95,
//     borderWidth: 1,
//     borderColor: '#00000080',
//     borderRadius: 10,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 20,
//     borderStyle: 'dashed',
//   },
//   photoSignatureBox1: {
//     width: '100%',
//     height: 50,
//     borderWidth: 1,
//     borderColor: '#00000080',
//     borderRadius: 10,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 20,
//     borderStyle: 'dashed',
//   },
//   photoSignatureText: {fontSize: 13, textAlign: 'center', color: '#00000099',fontFamily: 'Inter_28pt-Medium'},
//   optionalText: {
//     fontSize: 10,
//     color: '#666',
//     fontStyle: 'italic',
//     marginTop: 2,
//   },
//   previewImage: {
//     width: '100%',
//     height: '100%',
//     borderRadius: 10,
//   },
//   buttonContainer: {marginTop: 20},
//   submitButton: {
//     backgroundColor: '#7E5EA9',
//     padding: 15,
//     borderRadius: 10,
//     alignItems: 'center',
//     marginBottom: 15,
//   },
//   submitButtonText: {color: '#fff', fontSize: 14,fontFamily: 'Inter_28pt-SemiBold'},
//   homeButton: {
//     backgroundColor: '#20AEBC',
//     padding: 15,
//     borderRadius: 10,
//     alignItems: 'center',
//     marginBottom: 35,
//   },
//   homeButtonText: {color: '#fff', fontSize: 14,fontFamily: 'Inter_28pt-SemiBold'},
//   disabledButton: {
//     opacity: 0.6,
//   },
// });

// export default PDIpage;








import React, {useState, useEffect} from 'react';
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
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Camera } from 'react-native-camera-kit';

const PDIpage = ({navigation, route}) => {
  const insets = useSafeAreaInsets();

  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [existingFormId, setExistingFormId] = useState(null);
  
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [showTireDropdown, setShowTireDropdown] = useState(false);
  const [showBatteryDropdown, setShowBatteryDropdown] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showBatteryDatePicker, setShowBatteryDatePicker] = useState(false);
  const [showHypothecationDropdown, setShowHypothecationDropdown] = useState(false);

  // QR Scanner States
  const [showChassisScanner, setShowChassisScanner] = useState(false);
  const [showEngineScanner, setShowEngineScanner] = useState(false);
  const [showBatteryScanner, setShowBatteryScanner] = useState(false);
  const [showStarterScanner, setShowStarterScanner] = useState(false);
  const [showFipScanner, setShowFipScanner] = useState(false);
  const [showAlternatorScanner, setShowAlternatorScanner] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState(false);

  // Terms and Conditions state
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);

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

    // Delivery-specific customer details
    delivery_customer_name: '',
    delivery_customer_father_name: '',
    delivery_customer_address: '',
    delivery_customer_contact: '',
    hypothecation: '',
    hypothecation_other: '',

    // Remarks for "No" selections - matching API field names
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

  // Image states
  const [customer_photo, setCustomerPhoto] = useState(null);
  const [customer_signature, setCustomerSignature] = useState(null);
  const [manager_signature, setManagerSignature] = useState(null);

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
    paint_scratches: '0',
    toolkit_available: '1',
    owner_manual_given: '1',
    reflector_sticker_applied: '1',
    number_plate_fixed: '0',
  });

  const tractorModels = [
    '3028EN',
    '3036EN',
    '3036E',
    '5105',
    '5105 4WD',
    '5050D Gear Pro',
    '5210 Gear Pro',
    '5050D 4WD Gear Pro',
    '5210 4WD Gear Pro',
    '5310 CRDI',
    '5310 4WD CRDI',
    '5405 CRDI',
    '5405 4WD CRDI',
    '5075 2WD',
    '5075 4WD',
  ];

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

  // Camera Permission Function
  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: "Camera Permission",
            message: "This app needs access to your camera to scan QR codes.",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK"
          }
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
  const handleChassisScanPress = async () => {
    const hasPermission = await requestCameraPermission();
    if (hasPermission) {
      setShowChassisScanner(true);
    } else {
      Alert.alert('Permission Denied', 'Camera permission is required to scan QR codes.');
    }
  };

  const handleEngineScanPress = async () => {
    const hasPermission = await requestCameraPermission();
    if (hasPermission) {
      setShowEngineScanner(true);
    } else {
      Alert.alert('Permission Denied', 'Camera permission is required to scan QR codes.');
    }
  };

  const handleBatteryScanPress = async () => {
    const hasPermission = await requestCameraPermission();
    if (hasPermission) {
      setShowBatteryScanner(true);
    } else {
      Alert.alert('Permission Denied', 'Camera permission is required to scan QR codes.');
    }
  };

  const handleStarterScanPress = async () => {
    const hasPermission = await requestCameraPermission();
    if (hasPermission) {
      setShowStarterScanner(true);
    } else {
      Alert.alert('Permission Denied', 'Camera permission is required to scan QR codes.');
    }
  };

  const handleFipScanPress = async () => {
    const hasPermission = await requestCameraPermission();
    if (hasPermission) {
      setShowFipScanner(true);
    } else {
      Alert.alert('Permission Denied', 'Camera permission is required to scan QR codes.');
    }
  };

  const handleAlternatorScanPress = async () => {
    const hasPermission = await requestCameraPermission();
    if (hasPermission) {
      setShowAlternatorScanner(true);
    } else {
      Alert.alert('Permission Denied', 'Camera permission is required to scan QR codes.');
    }
  };

  const handleQRCodeRead = (event) => {
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

  // Get user ID from AsyncStorage on component mount
  useEffect(() => {
    const getUserData = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        if (storedUserId) {
          setUserId(storedUserId);
          console.log('User ID loaded:', storedUserId);
        }
        
        // Check if we're in edit mode (receiving existing form data)
        if (route.params?.formData) {
          const editData = route.params.formData;
          setIsEditMode(true);
          setExistingFormId(editData.id);
          
          // Pre-populate form data with exact API field names
          setFormData({
            inspector_name: editData.inspector_name || '',
            tire_make: editData.tire_make || '',
            tire_make_other: editData.tire_make_other || '',
            battery_make: editData.battery_make || '',
            battery_make_other: editData.battery_make_other || '',
            select_date: editData.select_date ? new Date(editData.select_date) : null,
            battery_date: editData.battery_date ? new Date(editData.battery_date) : null,
            chassis_no: editData.chassis_no || '',
            tractor_model: editData.tractor_model || '',
            engine_no: editData.engine_no || '',
            front_right_serial_no: editData.front_right_serial_no || '',
            rear_right_serial_no: editData.rear_right_serial_no || '',
            front_left_serial_no: editData.front_left_serial_no || '',
            rear_left_serial_no: editData.rear_left_serial_no || '',
            tractor_starter_serial_no: editData.tractor_starter_serial_no || '',
            tractor_alternator_no: editData.tractor_alternator_no || '',
            battery_serial_no: editData.battery_serial_no || '',
            fip_no: editData.fip_no || '',
            dealer_name: editData.dealer_name || '',
            customer_name: editData.customer_name || '',
            customer_father_name: editData.customer_father_name || '',
            customer_address: editData.customer_address || '',
            customer_contact: editData.customer_contact || '',
            pdi_done_by: editData.pdi_done_by || '',
            remarks: editData.remarks || '',
            delivery_customer_name: editData.delivery_customer_name || '',
            delivery_customer_father_name: editData.delivery_customer_father_name || '',
            delivery_customer_address: editData.delivery_customer_address || '',
            delivery_customer_contact: editData.delivery_customer_contact || '',
            hypothecation: editData.hypothecation || '',
            hypothecation_other: editData.hypothecation_other || '',
            // Remarks for "No" selections with exact API field names
            lights_no: editData.lights_no || '',
            nuts_no: editData.nuts_no || '',
            hydraulic_oil_half: editData.hydraulic_oil_half || '',
            all_nuts_sealed_no: editData.all_nuts_sealed_no || '',
            engine_oil_level_half: editData.engine_oil_level_half || '',
            coolant_level_no: editData.coolant_level_no || '',
            brake_fluid_level_no: editData.brake_fluid_level_no || '',
            greasing_done_no: editData.greasing_done_no || '',
            paint_scratches_no: editData.paint_scratches_no || '',
            toolkit_available_no: editData.toolkit_available_no || '',
            owner_manual_given_no: editData.owner_manual_given_no || '',
            reflector_sticker_applied_no: editData.reflector_sticker_applied_no || '',
            number_plate_fixed_no: editData.number_plate_fixed_no || '',
          });

          // Set radio button states with exact API field names
          setRadioValues({
            lights_ok: editData.lights_ok?.toString() || '1',
            nuts_ok: editData.nuts_ok?.toString() || '1',
            tractor_delivered: editData.tractor_delivered?.toString() || '1',
            hydraulic_oil: editData.hydraulic_oil?.toString() || '1',
            all_nuts_sealed: editData.all_nuts_sealed?.toString() || '1',
            engine_oil_level: editData.engine_oil_level?.toString() || '1',
            coolant_level: editData.coolant_level?.toString() || '1',
            brake_fluid_level: editData.brake_fluid_level?.toString() || '1',
            greasing_done: editData.greasing_done?.toString() || '1',
            paint_scratches: editData.paint_scratches?.toString() || '0',
            toolkit_available: editData.toolkit_available?.toString() || '1',
            owner_manual_given: editData.owner_manual_given?.toString() || '1',
            reflector_sticker_applied: editData.reflector_sticker_applied?.toString() || '1',
            number_plate_fixed: editData.number_plate_fixed?.toString() || '0',
          });

        }
      } catch (error) {
        console.log('Error loading user data:', error);
      }
    };

    getUserData();
  }, [route.params]);

  // Generate form number
  const generateFormNo = () => {
    const timestamp = new Date().getTime();
    return `PDI${timestamp}`;
  };

  // Camera permissions for image capture
  const requestCameraPermissionForImage = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: "Camera Permission",
            message: "This app needs access to your camera to take photos.",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK"
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  const showImagePickerOptions = (setImageFunction) => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', 'Take Photo', 'Choose from Library'],
          cancelButtonIndex: 0,
        },
        async (buttonIndex) => {
          if (buttonIndex === 1) {
            const hasPermission = await requestCameraPermissionForImage();
            if (hasPermission) handleCamera(setImageFunction);
          } else if (buttonIndex === 2) handleImageLibrary(setImageFunction);
        }
      );
    } else {
      Alert.alert(
        'Select Image',
        'Choose an option',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Take Photo', onPress: async () => {
              const hasPermission = await requestCameraPermissionForImage();
              if (hasPermission) handleCamera(setImageFunction);
            }
          },
          { text: 'Choose from Library', onPress: () => handleImageLibrary(setImageFunction) },
        ],
        { cancelable: true }
      );
    }
  };

  const handleCamera = (setImageFunction) => {
    launchCamera(
      { 
        mediaType: 'photo', 
        quality: 0.8, 
        cameraType: 'back', 
        saveToPhotos: true,
        includeBase64: false 
      },
      (response) => {
        if (response.didCancel) return;
        if (response.error) {
          Alert.alert('Error', 'Failed to capture image');
          return;
        }
        if (response.assets && response.assets.length > 0) {
          setImageFunction(response.assets[0]);
        }
      }
    );
  };

  const handleImageLibrary = (setImageFunction) => {
    launchImageLibrary({ 
      mediaType: 'photo', 
      quality: 0.8,
      includeBase64: false 
    }, (response) => {
      if (response.didCancel) return;
      if (response.error) {
        Alert.alert('Error', 'Failed to select image');
        return;
      }
      if (response.assets && response.assets.length > 0) {
        setImageFunction(response.assets[0]);
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

  const validateForm = () => {
    const requiredFields = [
      'inspector_name', 'tractor_model', 'chassis_no', 'engine_no',
      'tire_make', 'front_right_serial_no', 'front_left_serial_no', 'rear_right_serial_no', 'rear_left_serial_no',
      'battery_make', 'battery_serial_no', 'tractor_starter_serial_no', 'fip_no', 'tractor_alternator_no',
      'dealer_name', 'customer_name', 'customer_address', 'customer_contact',
      'pdi_done_by'
    ];

    for (const field of requiredFields) {
      if (!formData[field] || formData[field].toString().trim() === '') {
        Alert.alert('Validation Error', `Please fill in ${field.replace(/_/g, ' ')}`);
        return false;
      }
    }

    // Check if terms are accepted when tractor is delivered
    if (radioValues.tractor_delivered === '1' && !isTermsAccepted) {
      Alert.alert('Validation Error', 'Please accept the Terms and Conditions');
      return false;
    }

    // Make images optional for updates, required for new forms
    if (!isEditMode) {
      if (!customer_photo) {
        Alert.alert('Validation Error', 'Please add customer photo');
        return false;
      }

      if (!customer_signature) {
        Alert.alert('Validation Error', 'Please add customer signature');
        return false;
      }

      if (!manager_signature) {
        Alert.alert('Validation Error', 'Please add manager signature');
        return false;
      }
    }

    return true;
  };

  const prepareFormData = () => {
    const formDataToSend = new FormData();

    // For updates, use PUT method and include ID
    if (isEditMode && existingFormId) {
      formDataToSend.append('id', existingFormId.toString());
      console.log('UPDATE MODE - Form ID:', existingFormId);
    } else {
      // For new forms, generate new form number
      formDataToSend.append('form_no', generateFormNo());
      console.log('CREATE MODE - New Form No:', generateFormNo());
    }

    // Common form data for both create and update - EXACT API FIELD NAMES
    formDataToSend.append('user_id', userId);
    formDataToSend.append('form_date', new Date().toISOString().split('T')[0]);
    formDataToSend.append('inspector_name', formData.inspector_name);
    formDataToSend.append('select_date', formData.select_date ? formData.select_date.toISOString().split('T')[0] : '');
    formDataToSend.append('tractor_model', formData.tractor_model);
    formDataToSend.append('chassis_no', formData.chassis_no);
    formDataToSend.append('engine_no', formData.engine_no);

    // Tyre and battery (including "Other" values)
    formDataToSend.append('tire_make', formData.tire_make);
    formDataToSend.append('tire_make_other', formData.tire_make_other || '');
    formDataToSend.append('front_right_serial_no', formData.front_right_serial_no);
    formDataToSend.append('front_left_serial_no', formData.front_left_serial_no);
    formDataToSend.append('rear_right_serial_no', formData.rear_right_serial_no);
    formDataToSend.append('rear_left_serial_no', formData.rear_left_serial_no);
    formDataToSend.append('battery_make', formData.battery_make);
    formDataToSend.append('battery_make_other', formData.battery_make_other || '');
    formDataToSend.append('battery_date', formData.battery_date ? formData.battery_date.toISOString().split('T')[0] : '');
    formDataToSend.append('battery_serial_no', formData.battery_serial_no);
    formDataToSend.append('tractor_starter_serial_no', formData.tractor_starter_serial_no);
    formDataToSend.append('fip_no', formData.fip_no);
    formDataToSend.append('tractor_alternator_no', formData.tractor_alternator_no);
    
    // Customer details
    formDataToSend.append('dealer_name', formData.dealer_name);
    formDataToSend.append('customer_name', formData.customer_name);
    formDataToSend.append('customer_father_name', formData.customer_father_name || '');
    formDataToSend.append('customer_address', formData.customer_address);
    formDataToSend.append('customer_contact', formData.customer_contact);
    formDataToSend.append('pdi_done_by', formData.pdi_done_by);
    formDataToSend.append('remarks', formData.remarks || '');

    // Delivery-specific customer details
    formDataToSend.append('delivery_customer_name', formData.delivery_customer_name || '');
    formDataToSend.append('delivery_customer_father_name', formData.delivery_customer_father_name || '');
    formDataToSend.append('delivery_customer_address', formData.delivery_customer_address || '');
    formDataToSend.append('delivery_customer_contact', formData.delivery_customer_contact || '');
    formDataToSend.append('hypothecation', formData.hypothecation || '');
    formDataToSend.append('hypothecation_other', formData.hypothecation_other || '');

    // Radio button values (convert to 1/0 for API) - EXACT API FIELD NAMES
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
    formDataToSend.append('reflector_sticker_applied', radioValues.reflector_sticker_applied);
    formDataToSend.append('number_plate_fixed', radioValues.number_plate_fixed);

    // Remarks for "No" selections - EXACT API FIELD NAMES
    formDataToSend.append('lights_no', formData.lights_no || '');
    formDataToSend.append('nuts_no', formData.nuts_no || '');
    formDataToSend.append('hydraulic_oil_half', formData.hydraulic_oil_half || '');
    formDataToSend.append('all_nuts_sealed_no', formData.all_nuts_sealed_no || '');
    formDataToSend.append('engine_oil_level_half', formData.engine_oil_level_half || '');
    formDataToSend.append('coolant_level_no', formData.coolant_level_no || '');
    formDataToSend.append('brake_fluid_level_no', formData.brake_fluid_level_no || '');
    formDataToSend.append('greasing_done_no', formData.greasing_done_no || '');
    formDataToSend.append('paint_scratches_no', formData.paint_scratches_no || '');
    formDataToSend.append('toolkit_available_no', formData.toolkit_available_no || '');
    formDataToSend.append('owner_manual_given_no', formData.owner_manual_given_no || '');
    formDataToSend.append('reflector_sticker_applied_no', formData.reflector_sticker_applied_no || '');
    formDataToSend.append('number_plate_fixed_no', formData.number_plate_fixed_no || '');

    // Add delivery date if tractor is delivered
    if (radioValues.tractor_delivered === '1') {
      formDataToSend.append('delivery_date', new Date().toISOString().split('T')[0]);
    }

    // Add images only if they are newly selected
    if (customer_photo && customer_photo.uri && !customer_photo.uri.startsWith('http')) {
      formDataToSend.append('customer_photo', {
        uri: customer_photo.uri,
        type: customer_photo.type || 'image/jpeg',
        name: `customer_photo_${Date.now()}.jpg`,
      });
    }

    if (customer_signature && customer_signature.uri && !customer_signature.uri.startsWith('http')) {
      formDataToSend.append('customer_signature', {
        uri: customer_signature.uri,
        type: customer_signature.type || 'image/jpeg',
        name: `customer_signature_${Date.now()}.jpg`,
      });
    }

    if (manager_signature && manager_signature.uri && !manager_signature.uri.startsWith('http')) {
      formDataToSend.append('manager_signature', {
        uri: manager_signature.uri,
        type: manager_signature.type || 'image/jpeg',
        name: `manager_signature_${Date.now()}.jpg`,
      });
    }

    return formDataToSend;
  };

  const handleSubmit = async () => {
    if (!userId) {
      Alert.alert('Error', 'User ID not found. Please login again.');
      return;
    }

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const formDataToSend = prepareFormData();
      
      // Use different endpoints and methods for create vs update
      let url, method;
      
      if (isEditMode && existingFormId) {
        url = `https://argosmob.uk/makroo/public/api/v1/pdi-delivery/form/update`;
        method = 'post'; // Your API uses POST for update
        console.log('UPDATE REQUEST - URL:', url, 'Method:', method, 'Form ID:', existingFormId);
      } else {
        url = 'https://argosmob.uk/makroo/public/api/v1/pdi-delivery/form/save';
        method = 'post';
        console.log('CREATE REQUEST - URL:', url, 'Method:', method);
      }

      const config = {
        method: method,
        url: url,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: formDataToSend,
        timeout: 30000,
      };

      console.log('Sending form data...');
      const response = await axios(config);
      console.log('API Response:', response.data);

      let isSuccess = false;
      let successMessage = '';
      let errorMessage = '';

      if (isEditMode) {
        successMessage = 'PDI Form updated successfully!';
        errorMessage = 'Failed to update form. Please try again.';
        
        if (response.data) {
          if (response.data.status === true || response.data.success === true) {
            isSuccess = true;
          } else if (response.data.message && response.data.message.toLowerCase().includes('success')) {
            isSuccess = true;
          } else if (response.data.message && response.data.message.toLowerCase().includes('updated')) {
            isSuccess = true;
          }
        }
      } else {
        successMessage = 'PDI Form submitted successfully!';
        errorMessage = 'Failed to submit form. Please try again.';
        
        if (response.data) {
          if (response.data.status === true || response.data.success === true) {
            isSuccess = true;
          } else if (response.data.message && response.data.message.toLowerCase().includes('success')) {
            isSuccess = true;
          } else if (response.data.message && response.data.message.toLowerCase().includes('created')) {
            isSuccess = true;
          } else if (response.data.message && response.data.message.toLowerCase().includes('saved')) {
            isSuccess = true;
          }
        }
      }

      if (response.status === 200 || response.status === 201) {
        if (!isSuccess) {
          isSuccess = true;
          console.log('Success detected from HTTP status');
        }
      }

      if (isSuccess) {
        Alert.alert(
          'Success', 
          successMessage,
          [
            {
              text: 'OK',
              onPress: () => {
                if (isEditMode) {
                  navigation.goBack();
                } else {
                  // Reset form for new entry
                  setFormData({
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
                  setRadioValues({
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
                  setCustomerPhoto(null);
                  setCustomerSignature(null);
                  setManagerSignature(null);
                  setIsTermsAccepted(false);
                }
              }
            }
          ]
        );
      } else {
        const serverErrorMessage = response.data?.message || response.data?.error || errorMessage;
        Alert.alert(
          isEditMode ? 'Update Failed' : 'Submission Failed', 
          serverErrorMessage
        );
      }

    } catch (error) {
      console.log('Submission Error:', error);
      console.log('Error details:', error.response?.data);
      
      let errorMessage = 'Something went wrong. Please try again.';
      
      if (error.response) {
        const serverError = error.response.data;
        errorMessage = serverError.message || serverError.error || `Server error: ${error.response.status}`;
      } else if (error.request) {
        errorMessage = 'Network error. Please check your internet connection.';
      }
      
      Alert.alert(
        isEditMode ? 'Update Failed' : 'Submission Failed', 
        errorMessage
      );
    } finally {
      setLoading(false);
    }
  };

  const handleHome = () => {
    navigation.navigate('Dashboard');
  };

  const handleDateIconPress = () => {
    setShowDatePicker(true);
  };

  const handleBatteryDateIconPress = () => {
    setShowBatteryDatePicker(true);
  };

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
      visible={showChassisScanner || showEngineScanner || showBatteryScanner || showStarterScanner || showFipScanner || showAlternatorScanner}
      animationType="slide"
      transparent={false}
      onRequestClose={closeScanner}
    >
      <View style={styles.scannerContainer}>
        <View style={styles.scannerHeader}>
          <TouchableOpacity onPress={closeScanner} style={styles.scannerCloseButton}>
            <Icon name="close" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.scannerTitle}>
            {showChassisScanner ? 'Scan Chassis Number' : 
             showEngineScanner ? 'Scan Engine Number' :
             showBatteryScanner ? 'Scan Battery Serial Number' :
             showStarterScanner ? 'Scan Starter Serial Number' :
             showFipScanner ? 'Scan FIP Number' :
             'Scan Alternator Number'}
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

  return (
    <View
      style={{flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom}}>
      {/* Header */}
      <LinearGradient
        colors={['#7E5EA9', '#20AEBC']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        style={styles.header}>
        <Text style={styles.companyName}>Makroo Motor Corporation</Text>
        <Text style={styles.companyName}>Pre Delivery Inspection</Text>
        <Text style={styles.companyName}>Form</Text>
      </LinearGradient>

      <ScrollView style={styles.container}>
        {/* Date and Form No */}
        <Text style={styles.Date}>{new Date().toLocaleDateString()}</Text>
        {isEditMode && (
          <View style={styles.editModeContainer}>
            <Text style={styles.editModeText}>Edit Mode - Updating Form ID: {existingFormId}</Text>
          </View>
        )}

        {/* Form Fields */}
        <View style={styles.formContainer}>
          {/* Inspector + Date */}
          <View style={styles.row}>
            <View style={styles.inputContainer}>
              <LinearGradient
                colors={['#7E5EA9', '#20AEBC']}
                style={styles.inputGradient}>
                <TextInput
                  style={styles.input}
                  value={formData.inspector_name}
                  onChangeText={text =>
                    handleInputChange('inspector_name', text)
                  }
                  placeholder="Inspector Name"
                  placeholderTextColor="#666"
                  editable={!loading}
                />
              </LinearGradient>
            </View>
            <View style={styles.inputContainer}>
              <LinearGradient
                colors={['#7E5EA9', '#20AEBC']}
                style={styles.inputGradient}>
                <View style={styles.inputWithIcon}>
                  <TouchableOpacity
                    style={[styles.input, styles.inputWithIconField]}
                    onPress={handleDateIconPress}
                    disabled={loading}
                  >
                    <Text style={ formData.select_date ? styles.selectedModelText : styles.placeholderText }>
                      {formData.select_date ? formData.select_date.toLocaleDateString() : 'Select Date'}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleDateIconPress}
                    style={styles.iconButton}
                    disabled={loading}
                  >
                    <Icon name="calendar-today" size={20} color="#666" />
                  </TouchableOpacity>
                </View>
                {showDatePicker && (
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

          {/* Tractor Model + Chassis No */}
          <View style={styles.row}>
            <View style={styles.inputContainer}>
              <LinearGradient
                colors={['#7E5EA9', '#20AEBC']}
                style={styles.inputGradient}>
                <TouchableOpacity
                  style={styles.input}
                  onPress={() => setShowModelDropdown(true)}
                  disabled={loading}
                >
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
            <View style={styles.inputContainer}>
              <LinearGradient
                colors={['#7E5EA9', '#20AEBC']}
                style={styles.inputGradient}>
                <View style={styles.inputWithIcon}>
                  <TextInput
                    style={[styles.input, styles.inputWithIconField]}
                    value={formData.chassis_no}
                    onChangeText={text => handleInputChange('chassis_no', text)}
                    placeholder="Chassis No."
                    placeholderTextColor="#666"
                    editable={!loading}
                  />
                  <TouchableOpacity
                    onPress={handleChassisScanPress}
                    style={styles.iconButton}
                    disabled={loading}
                  >
                    <Icon name="qr-code-scanner" size={20} color="#666" />
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </View>
          </View>

          {/* Engine No */}
          <View style={styles.row}>
            <View style={styles.inputContainer}>
              <LinearGradient
                colors={['#7E5EA9', '#20AEBC']}
                style={styles.inputGradient}>
                <View style={styles.inputWithIcon}>
                  <TextInput
                    style={[styles.input, styles.inputWithIconField]}
                    value={formData.engine_no}
                    onChangeText={text => handleInputChange('engine_no', text)}
                    placeholder="Engine No."
                    placeholderTextColor="#666"
                    editable={!loading}
                  />
                  <TouchableOpacity
                    onPress={handleEngineScanPress}
                    style={styles.iconButton}
                    disabled={loading}
                  >
                    <Icon name="qr-code-scanner" size={20} color="#666" />
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </View>
            <View style={styles.inputContainer}></View>
          </View>

          {/* Customer Details Heading */}
          <View style={styles.sectionHeading}>
            <Text style={styles.sectionHeadingText}>Customer Details:</Text>
          </View>

          {/* Dealer Name + Customer Name */}
          <View style={styles.row}>
            <View style={styles.inputContainer}>
              <LinearGradient
                colors={['#7E5EA9', '#20AEBC']}
                style={styles.inputGradient}>
                <TextInput
                  style={styles.input}
                  value={formData.dealer_name}
                  onChangeText={text => handleInputChange('dealer_name', text)}
                  placeholder="Dealer Name"
                  placeholderTextColor="#666"
                  editable={!loading}
                />
              </LinearGradient>
            </View>
            <View style={styles.inputContainer}>
              <LinearGradient
                colors={['#7E5EA9', '#20AEBC']}
                style={styles.inputGradient}>
                <TextInput
                  style={styles.input}
                  value={formData.customer_name}
                  onChangeText={text => handleInputChange('customer_name', text)}
                  placeholder="Customer Name"
                  placeholderTextColor="#666"
                  editable={!loading}
                />
              </LinearGradient>
            </View>
          </View>

          {/* Customer Father's Name */}
          <View style={styles.row}>
            <View style={styles.inputContainer}>
              <LinearGradient colors={['#7E5EA9', '#20AEBC']} style={styles.inputGradient}>
                <TextInput
                  style={styles.input}
                  value={formData.customer_father_name}
                  onChangeText={text => handleInputChange('customer_father_name', text)}
                  placeholder="Father's Name"
                  placeholderTextColor="#666"
                  editable={!loading}
                />
              </LinearGradient>
            </View>
          </View>

          {/* Customer Address */}
          <View style={styles.row}>
            <View style={styles.inputContainer}>
              <LinearGradient
                colors={['#7E5EA9', '#20AEBC']}
                style={styles.inputGradient}>
                <TextInput
                  style={styles.input}
                  value={formData.customer_address}
                  onChangeText={text => handleInputChange('customer_address', text)}
                  placeholder="Customer Address"
                  placeholderTextColor="#666"
                  editable={!loading}
                  multiline
                />
              </LinearGradient>
            </View>
            <View style={styles.inputContainer}>
              <LinearGradient
                colors={['#7E5EA9', '#20AEBC']}
                style={styles.inputGradient}>
                <TextInput
                  style={styles.input}
                  value={formData.customer_contact}
                  onChangeText={text => handleInputChange('customer_contact', text)}
                  placeholder="Customer Contact"
                  placeholderTextColor="#666"
                  keyboardType="phone-pad"
                  editable={!loading}
                />
              </LinearGradient>
            </View>
            {/* Hypothecation dropdown + 'Other' input if selected */}
            <View style={styles.row}>
              <View style={styles.inputContainer}>
                <LinearGradient colors={['#7E5EA9', '#20AEBC']} style={styles.inputGradient}>
                  <TouchableOpacity
                    style={styles.input}
                    onPress={() => setShowHypothecationDropdown(true)}
                    disabled={loading}
                  >
                    <Text style={ formData.hypothecation ? styles.selectedModelText : styles.placeholderText }>
                      {formData.hypothecation || 'Select Hypothecation'}
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
              <View style={styles.inputContainer}></View>
            </View>

            {formData.hypothecation === 'Other' && (
              <View style={styles.row}>
                <View style={styles.inputContainer}>
                  <LinearGradient colors={['#7E5EA9', '#20AEBC']} style={styles.inputGradient}>
                    <TextInput
                      style={styles.input}
                      value={formData.hypothecation_other}
                      onChangeText={text => handleInputChange('hypothecation_other', text)}
                      placeholder="Enter Other Hypothecation"
                      placeholderTextColor="#666"
                      editable={!loading}
                    />
                  </LinearGradient>
                </View>
                <View style={styles.inputContainer}></View>
              </View>
            )}
          </View>

          {/* Tyre Details Heading */}
          <View style={styles.sectionHeading}>
            <Text style={styles.sectionHeadingText}>Tire Details:</Text>
          </View>

          {/* Select Tire Make */}
          <View style={styles.row}>
            <View style={styles.inputContainer}>
              <LinearGradient
                colors={['#7E5EA9', '#20AEBC']}
                style={styles.inputGradient}>
                <TouchableOpacity
                  style={styles.input}
                  onPress={() => setShowTireDropdown(true)}
                  disabled={loading}
                >
                  <Text
                    style={
                      formData.tire_make
                        ? styles.selectedModelText
                        : styles.placeholderText
                    }>
                    {formData.tire_make || 'Select Tyre Make'}
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
            <View style={styles.inputContainer}></View>
          </View>

          {/* If "Other" selected for tyre make, show TextInput */}
          {formData.tire_make === 'Other' && (
            <View style={styles.row}>
              <View style={styles.inputContainer}>
                <LinearGradient colors={['#7E5EA9', '#20AEBC']} style={styles.inputGradient}>
                  <TextInput
                    style={styles.input}
                    value={formData.tire_make_other}
                    onChangeText={text => handleInputChange('tire_make_other', text)}
                    placeholder="Enter Other Tire Make"
                    placeholderTextColor="#666"
                    editable={!loading}
                  />
                </LinearGradient>
              </View>
              <View style={styles.inputContainer}></View>
            </View>
          )}

          {/* Front Right + Front Left */}
          <View style={styles.row}>
            <View style={styles.inputContainer}>
              <LinearGradient
                colors={['#7E5EA9', '#20AEBC']}
                style={styles.inputGradient}>
                <TextInput
                  style={styles.input}
                  value={formData.front_right_serial_no}
                  onChangeText={text => handleInputChange('front_right_serial_no', text)}
                  placeholder="Front Right Serial No."
                  placeholderTextColor="#666"
                  editable={!loading}
                />
              </LinearGradient>
            </View>
            <View style={styles.inputContainer}>
              <LinearGradient
                colors={['#7E5EA9', '#20AEBC']}
                style={styles.inputGradient}>
                <TextInput
                  style={styles.input}
                  value={formData.front_left_serial_no}
                  onChangeText={text => handleInputChange('front_left_serial_no', text)}
                  placeholder="Front Left Serial No."
                  placeholderTextColor="#666"
                  editable={!loading}
                />
              </LinearGradient>
            </View>
          </View>

          {/* Rear Right + Rear Left */}
          <View style={styles.row}>
            <View style={styles.inputContainer}>
              <LinearGradient
                colors={['#7E5EA9', '#20AEBC']}
                style={styles.inputGradient}>
                <TextInput
                  style={styles.input}
                  value={formData.rear_right_serial_no}
                  onChangeText={text => handleInputChange('rear_right_serial_no', text)}
                  placeholder="Rear Right Serial No."
                  placeholderTextColor="#666"
                  editable={!loading}
                />
              </LinearGradient>
            </View>
            <View style={styles.inputContainer}>
              <LinearGradient
                colors={['#7E5EA9', '#20AEBC']}
                style={styles.inputGradient}>
                <TextInput
                  style={styles.input}
                  value={formData.rear_left_serial_no}
                  onChangeText={text => handleInputChange('rear_left_serial_no', text)}
                  placeholder="Rear Left Serial No."
                  placeholderTextColor="#666"
                  editable={!loading}
                />
              </LinearGradient>
            </View>
          </View>

          {/* Battery Details Heading */}
          <View style={styles.sectionHeading}>
            <Text style={styles.sectionHeadingText}>Battery Details:</Text>
          </View>

          {/* Select Battery Make */}
          <View style={styles.row}>
            <View style={styles.inputContainer}>
              <LinearGradient
                colors={['#7E5EA9', '#20AEBC']}
                style={styles.inputGradient}>
                <TouchableOpacity
                  style={styles.input}
                  onPress={() => setShowBatteryDropdown(true)}
                  disabled={loading}
                >
                  <Text
                    style={
                      formData.battery_make
                        ? styles.selectedModelText
                        : styles.placeholderText
                    }>
                    {formData.battery_make || 'Select Battery Make'}
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
            <View style={styles.inputContainer}></View>
          </View>

          {/* If "Other" selected for battery make, show TextInput */}
          {formData.battery_make === 'Other' && (
            <View style={styles.row}>
              <View style={styles.inputContainer}>
                <LinearGradient colors={['#7E5EA9', '#20AEBC']} style={styles.inputGradient}>
                  <TextInput
                    style={styles.input}
                    value={formData.battery_make_other}
                    onChangeText={text => handleInputChange('battery_make_other', text)}
                    placeholder="Enter Other Battery Make"
                    placeholderTextColor="#666"
                    editable={!loading}
                  />
                </LinearGradient>
              </View>
              <View style={styles.inputContainer}></View>
            </View>
          )}

          {/* Battery Date */}
          <View style={styles.row}>
            <View style={styles.inputContainer}>
              <LinearGradient colors={['#7E5EA9', '#20AEBC']} style={styles.inputGradient}>
                <View style={styles.inputWithIcon}>
                  <TouchableOpacity
                    style={[styles.input, styles.inputWithIconField]}
                    onPress={handleBatteryDateIconPress}
                    disabled={loading}
                  >
                    <Text style={ formData.battery_date ? styles.selectedModelText : styles.placeholderText }>
                      {formData.battery_date ? formData.battery_date.toLocaleDateString() : 'Select Battery Date'}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleBatteryDateIconPress}
                    style={styles.iconButton}
                    disabled={loading}
                  >
                    <Icon name="calendar-today" size={20} color="#666" />
                  </TouchableOpacity>
                </View>
                {showBatteryDatePicker && (
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

          {/* Battery Serial No + Tractor Starter Serial No */}
          <View style={styles.row}>
            <View style={styles.inputContainer}>
              <LinearGradient
                colors={['#7E5EA9', '#20AEBC']}
                style={styles.inputGradient}>
                <View style={styles.inputWithIcon}>
                  <TextInput
                    style={[styles.input, styles.inputWithIconField]}
                    value={formData.battery_serial_no}
                    onChangeText={text => handleInputChange('battery_serial_no', text)}
                    placeholder="Battery Serial No."
                    placeholderTextColor="#666"
                    editable={!loading}
                  />
                  <TouchableOpacity
                    onPress={handleBatteryScanPress}
                    style={styles.iconButton}
                    disabled={loading}
                  >
                    <Icon name="qr-code-scanner" size={20} color="#666" />
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </View>
            <View style={styles.inputContainer}>
              <LinearGradient
                colors={['#7E5EA9', '#20AEBC']}
                style={styles.inputGradient}>
                <View style={styles.inputWithIcon}>
                  <TextInput
                    style={[styles.input, styles.inputWithIconField]}
                    value={formData.tractor_starter_serial_no}
                    onChangeText={text => handleInputChange('tractor_starter_serial_no', text)}
                    placeholder="Tractor Starter Serial No."
                    placeholderTextColor="#666"
                    editable={!loading}
                  />
                  <TouchableOpacity
                    onPress={handleStarterScanPress}
                    style={styles.iconButton}
                    disabled={loading}
                  >
                    <Icon name="qr-code-scanner" size={20} color="#666" />
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </View>
          </View>

          {/* FIP No + Tractor Alternator No */}
          <View style={styles.row}>
            <View style={styles.inputContainer}>
              <LinearGradient
                colors={['#7E5EA9', '#20AEBC']}
                style={styles.inputGradient}>
                <View style={styles.inputWithIcon}>
                  <TextInput
                    style={[styles.input, styles.inputWithIconField]}
                    value={formData.fip_no}
                    onChangeText={text => handleInputChange('fip_no', text)}
                    placeholder="FIP No."
                    placeholderTextColor="#666"
                    editable={!loading}
                  />
                  <TouchableOpacity
                    onPress={handleFipScanPress}
                    style={styles.iconButton}
                    disabled={loading}
                  >
                    <Icon name="qr-code-scanner" size={20} color="#666" />
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </View>
            <View style={styles.inputContainer}>
              <LinearGradient
                colors={['#7E5EA9', '#20AEBC']}
                style={styles.inputGradient}>
                <View style={styles.inputWithIcon}>
                  <TextInput
                    style={[styles.input, styles.inputWithIconField]}
                    value={formData.tractor_alternator_no}
                    onChangeText={text => handleInputChange('tractor_alternator_no', text)}
                    placeholder="Tractor Alternator No."
                    placeholderTextColor="#666"
                    editable={!loading}
                  />
                  <TouchableOpacity
                    onPress={handleAlternatorScanPress}
                    style={styles.iconButton}
                    disabled={loading}
                  >
                    <Icon name="qr-code-scanner" size={20} color="#666" />
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </View>
          </View>

          {/* PDI Done By + Remarks */}
          <View style={styles.row}>
            <View style={styles.inputContainer}>
              <LinearGradient
                colors={['#7E5EA9', '#20AEBC']}
                style={styles.inputGradient}>
                <TextInput
                  style={styles.input}
                  value={formData.pdi_done_by}
                  onChangeText={text => handleInputChange('pdi_done_by', text)}
                  placeholder="PDI Done By"
                  placeholderTextColor="#666"
                  editable={!loading}
                />
              </LinearGradient>
            </View>
            <View style={styles.inputContainer}>
              <LinearGradient
                colors={['#7E5EA9', '#20AEBC']}
                style={styles.inputGradient}>
                <TextInput
                  style={styles.input}
                  value={formData.remarks}
                  onChangeText={text => handleInputChange('remarks', text)}
                  placeholder="Remarks"
                  placeholderTextColor="#666"
                  editable={!loading}
                  multiline
                />
              </LinearGradient>
            </View>
          </View>
        </View>

        {/* Tractor Model Modal */}
        <Modal
          visible={showModelDropdown}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowModelDropdown(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Tractor Model</Text>
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
              />
            </View>
          </View>
        </Modal>

        {/* Tire Make Modal */}
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

        {/* Battery Make Modal */}
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

        {/* Hypothecation Modal */}
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

        {/* Radio Sections */}
        <View style={styles.radioSection}>
          <Text style={styles.radioLabel}>Lights OK:</Text>
          {renderYesNo('lights_ok')}
          {radioValues.lights_ok === '0' && (
            <View style={styles.remarkInputContainer}>
              <LinearGradient colors={['#7E5EA9', '#20AEBC']} style={styles.inputGradient}>
                <TextInput
                  style={styles.remarkInput}
                  value={formData.lights_no}
                  onChangeText={text => handleInputChange('lights_no', text)}
                  placeholder="Remark for Lights OK ?"
                  placeholderTextColor="#666"
                  editable={!loading}
                  multiline
                />
              </LinearGradient>
            </View>
          )}

          <Text style={styles.radioLabel}>Nuts OK:</Text>
          {renderYesNo('nuts_ok')}
          {radioValues.nuts_ok === '0' && (
            <View style={styles.remarkInputContainer}>
              <LinearGradient colors={['#7E5EA9', '#20AEBC']} style={styles.inputGradient}>
                <TextInput
                  style={styles.remarkInput}
                  value={formData.nuts_no}
                  onChangeText={text => handleInputChange('nuts_no', text)}
                  placeholder="Remark for Nuts OK ?"
                  placeholderTextColor="#666"
                  editable={!loading}
                  multiline
                />
              </LinearGradient>
            </View>
          )}

          <Text style={styles.radioLabel}>Hydraulic Oil:</Text>
          {renderFullHalf('hydraulic_oil')}
          {radioValues.hydraulic_oil === '0' && (
            <View style={styles.remarkInputContainer}>
              <LinearGradient colors={['#7E5EA9', '#20AEBC']} style={styles.inputGradient}>
                <TextInput
                  style={styles.remarkInput}
                  value={formData.hydraulic_oil_half}
                  onChangeText={text => handleInputChange('hydraulic_oil_half', text)}
                  placeholder="Remark for Hydraulic Oil ?"
                  placeholderTextColor="#666"
                  editable={!loading}
                  multiline
                />
              </LinearGradient>
            </View>
          )}

          <Text style={styles.radioLabel}>All Nuts Are Sealed:</Text>
          {renderYesNo('all_nuts_sealed')}
          {radioValues.all_nuts_sealed === '0' && (
            <View style={styles.remarkInputContainer}>
              <LinearGradient colors={['#7E5EA9', '#20AEBC']} style={styles.inputGradient}>
                <TextInput
                  style={styles.remarkInput}
                  value={formData.all_nuts_sealed_no}
                  onChangeText={text => handleInputChange('all_nuts_sealed_no', text)}
                  placeholder="Remark for All Nuts Are Sealed ?"
                  placeholderTextColor="#666"
                  editable={!loading}
                  multiline
                />
              </LinearGradient>
            </View>
          )}

          <Text style={styles.radioLabel}>Engine Oil Level:</Text>
          {renderFullHalf('engine_oil_level')}
          {radioValues.engine_oil_level === '0' && (
            <View style={styles.remarkInputContainer}>
              <LinearGradient colors={['#7E5EA9', '#20AEBC']} style={styles.inputGradient}>
                <TextInput
                  style={styles.remarkInput}
                  value={formData.engine_oil_level_half}
                  onChangeText={text => handleInputChange('engine_oil_level_half', text)}
                  placeholder="Remark for Engine Oil Level ?"
                  placeholderTextColor="#666"
                  editable={!loading}
                  multiline
                />
              </LinearGradient>
            </View>
          )}

          <Text style={styles.radioLabel}>Coolant Level:</Text>
          {renderYesNo('coolant_level')}
          {radioValues.coolant_level === '0' && (
            <View style={styles.remarkInputContainer}>
              <LinearGradient colors={['#7E5EA9', '#20AEBC']} style={styles.inputGradient}>
                <TextInput
                  style={styles.remarkInput}
                  value={formData.coolant_level_no}
                  onChangeText={text => handleInputChange('coolant_level_no', text)}
                  placeholder="Remark for Coolant Level ?"
                  placeholderTextColor="#666"
                  editable={!loading}
                  multiline
                />
              </LinearGradient>
            </View>
          )}

          <Text style={styles.radioLabel}>Brake Fluid Level:</Text>
          {renderYesNo('brake_fluid_level')}
          {radioValues.brake_fluid_level === '0' && (
            <View style={styles.remarkInputContainer}>
              <LinearGradient colors={['#7E5EA9', '#20AEBC']} style={styles.inputGradient}>
                <TextInput
                  style={styles.remarkInput}
                  value={formData.brake_fluid_level_no}
                  onChangeText={text => handleInputChange('brake_fluid_level_no', text)}
                  placeholder="Remark for Brake Fluid Level ?"
                  placeholderTextColor="#666"
                  editable={!loading}
                  multiline
                />
              </LinearGradient>
            </View>
          )}

          <Text style={styles.radioLabel}>Greasing Done</Text>
          {renderYesNo('greasing_done')}
          {radioValues.greasing_done === '0' && (
            <View style={styles.remarkInputContainer}>
              <LinearGradient colors={['#7E5EA9', '#20AEBC']} style={styles.inputGradient}>
                <TextInput
                  style={styles.remarkInput}
                  value={formData.greasing_done_no}
                  onChangeText={text => handleInputChange('greasing_done_no', text)}
                  placeholder="Remark for Greasing Done ?"
                  placeholderTextColor="#666"
                  editable={!loading}
                  multiline
                />
              </LinearGradient>
            </View>
          )}

          <Text style={styles.radioLabel}>Paint Scratches</Text>
          {renderYesNo('paint_scratches')}
          {radioValues.paint_scratches === '0' && (
            <View style={styles.remarkInputContainer}>
              <LinearGradient colors={['#7E5EA9', '#20AEBC']} style={styles.inputGradient}>
                <TextInput
                  style={styles.remarkInput}
                  value={formData.paint_scratches_no}
                  onChangeText={text => handleInputChange('paint_scratches_no', text)}
                  placeholder="Remark for Paint Scratches ?"
                  placeholderTextColor="#666"
                  editable={!loading}
                  multiline
                />
              </LinearGradient>
            </View>
          )}

          <Text style={styles.radioLabel}>Toolkit Available</Text>
          {renderYesNo('toolkit_available')}
          {radioValues.toolkit_available === '0' && (
            <View style={styles.remarkInputContainer}>
              <LinearGradient colors={['#7E5EA9', '#20AEBC']} style={styles.inputGradient}>
                <TextInput
                  style={styles.remarkInput}
                  value={formData.toolkit_available_no}
                  onChangeText={text => handleInputChange('toolkit_available_no', text)}
                  placeholder="Remark for Toolkit Available ?"
                  placeholderTextColor="#666"
                  editable={!loading}
                  multiline
                />
              </LinearGradient>
            </View>
          )}

          <Text style={styles.radioLabel}>Owner Manual Given</Text>
          {renderYesNo('owner_manual_given')}
          {radioValues.owner_manual_given === '0' && (
            <View style={styles.remarkInputContainer}>
              <LinearGradient colors={['#7E5EA9', '#20AEBC']} style={styles.inputGradient}>
                <TextInput
                  style={styles.remarkInput}
                  value={formData.owner_manual_given_no}
                  onChangeText={text => handleInputChange('owner_manual_given_no', text)}
                  placeholder="Remark for Owner Manual Given ?"
                  placeholderTextColor="#666"
                  editable={!loading}
                  multiline
                />
              </LinearGradient>
            </View>
          )}

          <Text style={styles.radioLabel}>Reflector Sticker Applied</Text>
          {renderYesNo('reflector_sticker_applied')}
          {radioValues.reflector_sticker_applied === '0' && (
            <View style={styles.remarkInputContainer}>
              <LinearGradient colors={['#7E5EA9', '#20AEBC']} style={styles.inputGradient}>
                <TextInput
                  style={styles.remarkInput}
                  value={formData.reflector_sticker_applied_no}
                  onChangeText={text => handleInputChange('reflector_sticker_applied_no', text)}
                  placeholder="Remark for Reflector Sticker Applied ?"
                  placeholderTextColor="#666"
                  editable={!loading}
                  multiline
                />
              </LinearGradient>
            </View>
          )}

          <Text style={styles.radioLabel}>Number Plate Fixed</Text>
          {renderYesNo('number_plate_fixed')}
          {radioValues.number_plate_fixed === '0' && (
            <View style={styles.remarkInputContainer}>
              <LinearGradient colors={['#7E5EA9', '#20AEBC']} style={styles.inputGradient}>
                <TextInput
                  style={styles.remarkInput}
                  value={formData.number_plate_fixed_no}
                  onChangeText={text => handleInputChange('number_plate_fixed_no', text)}
                  placeholder="Remark for Number Plate Fixed ?"
                  placeholderTextColor="#666"
                  editable={!loading}
                  multiline
                />
              </LinearGradient>
            </View>
          )}

          <Text style={styles.radioLabel}>Tractor Delivered:</Text>
          {renderYesNo('tractor_delivered')}
        </View>

        {/* Delivery Customer Details */}
        {radioValues.tractor_delivered === '1' && (
          <View style={styles.sectionHeading}>
            <Text style={styles.sectionHeadingText}>Delivery Customer Details:</Text>

            {/* Delivery Customer Name + Father's Name */}
            <View style={[styles.row, {marginTop: 8}]}>
              <View style={styles.inputContainer}>
                <LinearGradient colors={['#7E5EA9', '#20AEBC']} style={styles.inputGradient}>
                  <TextInput
                    style={styles.input}
                    value={formData.delivery_customer_name}
                    onChangeText={text => handleInputChange('delivery_customer_name', text)}
                    placeholder="Customer Name"
                    placeholderTextColor="#666"
                    editable={!loading}
                  />
                </LinearGradient>
              </View>
              <View style={styles.inputContainer}>
                <LinearGradient colors={['#7E5EA9', '#20AEBC']} style={styles.inputGradient}>
                  <TextInput
                    style={styles.input}
                    value={formData.delivery_customer_father_name}
                    onChangeText={text => handleInputChange('delivery_customer_father_name', text)}
                    placeholder="Father's Name"
                    placeholderTextColor="#666"
                    editable={!loading}
                  />
                </LinearGradient>
              </View>
            </View>

            {/* Delivery Address + Mobile */}
            <View style={styles.row}>
              <View style={styles.inputContainer}>
                <LinearGradient colors={['#7E5EA9', '#20AEBC']} style={styles.inputGradient}>
                  <TextInput
                    style={styles.input}
                    value={formData.delivery_customer_address}
                    onChangeText={text => handleInputChange('delivery_customer_address', text)}
                    placeholder="Address"
                    placeholderTextColor="#666"
                    editable={!loading}
                    multiline
                  />
                </LinearGradient>
              </View>
              <View style={styles.inputContainer}>
                <LinearGradient colors={['#7E5EA9', '#20AEBC']} style={styles.inputGradient}>
                  <TextInput
                    style={styles.input}
                    value={formData.delivery_customer_contact}
                    onChangeText={text => handleInputChange('delivery_customer_contact', text)}
                    placeholder="Mobile Number"
                    placeholderTextColor="#666"
                    keyboardType="phone-pad"
                    editable={!loading}
                  />
                </LinearGradient>
              </View>
            </View>

            {/* Hypothecation dropdown + 'Other' input if selected */}
            <View style={styles.row}>
              <View style={styles.inputContainer}>
                <LinearGradient colors={['#7E5EA9', '#20AEBC']} style={styles.inputGradient}>
                  <TouchableOpacity
                    style={styles.input}
                    onPress={() => setShowHypothecationDropdown(true)}
                    disabled={loading}
                  >
                    <Text style={ formData.hypothecation ? styles.selectedModelText : styles.placeholderText }>
                      {formData.hypothecation || 'Select Hypothecation'}
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
              <View style={styles.inputContainer}></View>
            </View>

            {formData.hypothecation === 'Other' && (
              <View style={styles.row}>
                <View style={styles.inputContainer}>
                  <LinearGradient colors={['#7E5EA9', '#20AEBC']} style={styles.inputGradient}>
                    <TextInput
                      style={styles.input}
                      value={formData.hypothecation_other}
                      onChangeText={text => handleInputChange('hypothecation_other', text)}
                      placeholder="Enter Other Hypothecation"
                      placeholderTextColor="#666"
                      editable={!loading}
                    />
                  </LinearGradient>
                </View>
                <View style={styles.inputContainer}></View>
              </View>
            )}
          </View>
        )}

        {/* Terms and Conditions Section */}
        {radioValues.tractor_delivered === '1' && (
          <View style={styles.termsSection}>
            <Text style={styles.termsTitle}>Terms and Conditions</Text>
            
            <View style={styles.termsList}>
              <Text style={styles.termItem}>1. Tractor Will Be Inspected Only After Full Payment Confirmation From The Accounts Department.</Text>
              <Text style={styles.termItem}>2. PDI Will Be Carried Out Strictly As Per John Deere India Pvt. Ltd. Guidelines.</Text>
              <Text style={styles.termItem}>3. Any Damages Or Discrepancies Found Before Delivery Will Be Rectified Prior To Handover.</Text>
              <Text style={styles.termItem}>4. No Mechanical Or Electrical Modifications Are Allowed During Or After Pdi.</Text>
              <Text style={styles.termItem}>5. Customer Must Be Present During Final Inspection And Sign The Pdi Report.</Text>
              <Text style={styles.termItem}>6. Tractor Delivery Will Be Done Only After Successful Completion Of All Inspection Points.</Text>
              <Text style={styles.termItem}>7. Makroo Motor Corporation Will Not Be Responsible For Any Issues Arising After Customer Approval And Delivery.</Text>
              <Text style={styles.termItem}>8. All Fluids, Oil Levels, And Battery Conditions Will Be Checked And Recorded Before Handover.</Text>
              <Text style={styles.termItem}>9. Tractor Registration And Number Plate Installation Will Be Handled Separately As Per Rto Process.</Text>
            </View>

            <Text style={styles.declarationTitle}>Customer Declaration</Text>
            <Text style={styles.declarationText}>
              I Have Personally Verified The Tractor After Completion Of The Pre-delivery Inspection (Pdi) At Makroo Motor Corporation. All Functions, Fittings, And Accessories Have Been Checked In My Presence. I Am Satisfied With The Tractor's Condition And Accept Delivery In Proper Working Order.
            </Text>

            <View style={styles.checkboxContainer}>
              <TouchableOpacity 
                style={[styles.checkbox, isTermsAccepted && styles.checkboxChecked]} 
                onPress={() => setIsTermsAccepted(!isTermsAccepted)}
                disabled={loading}
              >
                {isTermsAccepted && <Icon name="check" size={16} color="#fff" />}
              </TouchableOpacity>
              <Text style={styles.checkboxLabel}>Accept All Terms and Conditions</Text>
            </View>
          </View>
        )}

        {/* Photo & Signature */}
        <View style={styles.photoSignatureSection}>
          <TouchableOpacity 
            style={styles.photoSignatureBox} 
            onPress={() => showImagePickerOptions(setCustomerPhoto)}
            disabled={loading}
          >
            {customer_photo ? (
              <Image 
                source={{ uri: customer_photo.uri }} 
                style={styles.previewImage}
                resizeMode="contain"
              />
            ) : (
              <>
                <Icon name="photo-camera" size={35} color="#666" />
                <Text style={styles.photoSignatureText}>Customer Photo</Text>
                {isEditMode && <Text style={styles.optionalText}>(Optional for update)</Text>}
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.photoSignatureBox1} 
            onPress={() => showImagePickerOptions(setCustomerSignature)}
            disabled={loading}
          >
            {customer_signature ? (
              <Image 
                source={{ uri: customer_signature.uri }} 
                style={styles.previewImage}
                resizeMode="contain"
              />
            ) : (
              <>
                <Text style={styles.photoSignatureText}>Customer Signature</Text>
                {isEditMode && <Text style={styles.optionalText}>(Optional for update)</Text>}
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.photoSignatureBox1} 
            onPress={() => showImagePickerOptions(setManagerSignature)}
            disabled={loading}
          >
            {manager_signature ? (
              <Image 
                source={{ uri: manager_signature.uri }} 
                style={styles.previewImage}
                resizeMode="contain"
              />
            ) : (
              <>
                <Text style={styles.photoSignatureText}>Manager Signature</Text>
                {isEditMode && <Text style={styles.optionalText}>(Optional for update)</Text>}
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[
              styles.submitButton, 
              loading && styles.disabledButton,
              (radioValues.tractor_delivered === '1' && !isTermsAccepted) && styles.disabledButton
            ]} 
            onPress={handleSubmit}
            disabled={loading || (radioValues.tractor_delivered === '1' && !isTermsAccepted)}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.submitButtonText}>
                {isEditMode ? 'Update Form' : 'Submit Form'}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.homeButton, loading && styles.disabledButton]} 
            onPress={handleHome}
            disabled={loading}
          >
            <Text style={styles.homeButtonText}>Home</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );

  // === Render Radio Helpers ===
  function renderYesNo(field) {
    return (
      <View style={styles.radioOptionsContainer}>
        {[
          {label: 'YES', value: '1'},
          {label: 'NO', value: '0'}
        ].map(({label, value}) => (
          <TouchableOpacity
            key={value}
            style={[
              styles.radioOptionWrapper,
              radioValues[field] === value && styles.radioOptionSelected,
            ]}
            onPress={() => {
              handleRadioChange(field, value);
            }}
            disabled={loading}
          >
            <LinearGradient
              colors={['#7E5EA9', '#20AEBC']}
              style={styles.radioOptionGradient}>
              <View
                style={[
                  styles.radioOptionInner,
                  radioValues[field] === value &&
                    styles.radioOptionInnerSelected,
                ]}>
                <Text
                  style={[
                    styles.radioOptionText,
                    radioValues[field] === value &&
                      styles.radioOptionTextSelected,
                  ]}>
                  {label}
                </Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </View>
    );
  }

  function renderFullHalf(field) {
    return (
      <View style={styles.radioOptionsContainer}>
        {[
          {label: 'FULL', value: '1'},
          {label: 'HALF', value: '0'}
        ].map(({label, value}) => (
          <TouchableOpacity
            key={value}
            style={[
              styles.radioOptionWrapper,
              radioValues[field] === value && styles.radioOptionSelected,
            ]}
            onPress={() => handleRadioChange(field, value)}
            disabled={loading}
          >
            <LinearGradient
              colors={['#7E5EA9', '#20AEBC']}
              style={styles.radioOptionGradient}>
              <View
                style={[
                  styles.radioOptionInner,
                  radioValues[field] === value &&
                    styles.radioOptionInnerSelected,
                ]}>
                <Text
                  style={[
                    styles.radioOptionText,
                    radioValues[field] === value &&
                      styles.radioOptionTextSelected,
                  ]}>
                  {label}
                </Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {paddingHorizontal: 15},
  header: {alignItems: 'center', paddingVertical: 10},
  companyName: {fontSize: 16,  color: 'white',fontFamily: 'Inter_28pt-SemiBold'},
  formNo: {fontSize: 14, marginVertical: 10,fontFamily: 'Inter_28pt-SemiBold', color: '#000'},
  Date: {
    fontSize: 12,
    textAlign: 'right',
    marginVertical: 5,
    color: '#00000099',
    fontFamily: 'Inter_28pt-Medium',
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
    fontFamily: 'Inter_28pt-SemiBold',
    color: '#7E5EA9',
  },
  sectionHeading: {
    marginVertical: 10,
    paddingLeft: 5,
  },
  sectionHeadingText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    fontFamily: 'Inter_28pt-SemiBold',
  },
  formContainer: {marginBottom: 15},
  row: {},
  inputContainer: {
    flex: 1, 
    marginHorizontal: 4, 
    marginBottom: 12
  },
  inputGradient: {borderRadius: 10, padding: 1},
  input: {
    borderRadius: 10,
    backgroundColor: '#fff',
    padding: 12,
    fontSize: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedModelText: {fontSize: 14, color: '#000', fontFamily: 'Inter_28pt-Medium'},
  placeholderText: {fontSize: 14, color: '#666', fontFamily: 'Inter_28pt-Medium'},
  dropdownIcon: {marginLeft: 8},
  inputWithIcon: {flexDirection: 'row', alignItems: 'center'},
  inputWithIconField: {flex: 1},
  iconButton: {position: 'absolute', right: 12, padding: 4},
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {backgroundColor: 'white', borderRadius: 10, width: '90%'},
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {fontSize: 16, fontWeight: 'bold', fontFamily: 'Inter_28pt-SemiBold'},
  closeButton: {padding: 4},
  modelList: {maxHeight: 300},
  modelItem: {padding: 15, borderBottomWidth: 1, borderBottomColor: '#f0f0f0'},
  modelItemText: {fontSize: 14, color: '#333',fontFamily: 'Inter_28pt-Medium'},
  // QR Scanner Styles
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
  radioSection: {marginBottom: 15},
  radioLabel: {fontSize: 12, marginBottom: 6, color: '#000',fontFamily: 'Inter_28pt-Medium',marginTop:0},
  radioOptionsContainer: {flexDirection: 'row'},
  radioOptionWrapper: {flex: 1, marginHorizontal: 8, marginBottom: 15},
  radioOptionGradient: {borderRadius: 6, padding: 1},
  radioOptionInner: {
    borderRadius: 5,
    paddingVertical: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  radioOptionInnerSelected: {backgroundColor: '#7E5EA9'},
  radioOptionText: {fontSize: 12, color: '#000',fontFamily: 'Inter_28pt-Medium'},
  radioOptionTextSelected: {color: '#fff'},
  // Remark Input Styles
  remarkInputContainer: {
    marginHorizontal: 8,
    marginBottom: 15,
  },
  remarkInput: {
    borderRadius: 10,
    backgroundColor: '#fff',
    padding: 12,
    fontSize: 14,
    minHeight: 50,
    textAlignVertical: 'top',
  },
  // Terms and Conditions Styles
  termsSection: {
    marginBottom: 15,
    padding: 10,
  },
  termsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
    fontFamily: 'Inter_28pt-SemiBold',
  },
  termsList: {
    marginBottom: 15,
  },
  termItem: {
    fontSize: 12,
    color: '#333',
    marginBottom: 8,
    lineHeight: 16,
    fontFamily: 'Inter_28pt-Medium',
  },
  declarationTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 10,
    marginBottom: 8,
    fontFamily: 'Inter_28pt-SemiBold',
  },
  declarationText: {
    fontSize: 12,
    color: '#333',
    lineHeight: 16,
    marginBottom: 15,
    fontFamily: 'Inter_28pt-Medium',
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
    fontFamily: 'Inter_28pt-Medium',
  },
  photoSignatureSection: {marginTop: 20},
  photoSignatureBox: {
    width: '100%',
    height: 95,
    borderWidth: 1,
    borderColor: '#00000080',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderStyle: 'dashed',
  },
  photoSignatureBox1: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#00000080',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderStyle: 'dashed',
  },
  photoSignatureText: {fontSize: 13, textAlign: 'center', color: '#00000099',fontFamily: 'Inter_28pt-Medium'},
  optionalText: {
    fontSize: 10,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 2,
  },
  previewImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  buttonContainer: {marginTop: 20},
  submitButton: {
    backgroundColor: '#7E5EA9',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  submitButtonText: {color: '#fff', fontSize: 14,fontFamily: 'Inter_28pt-SemiBold'},
  homeButton: {
    backgroundColor: '#20AEBC',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 35,
  },
  homeButtonText: {color: '#fff', fontSize: 14,fontFamily: 'Inter_28pt-SemiBold'},
  disabledButton: {
    opacity: 0.6,
  },
});

export default PDIpage;