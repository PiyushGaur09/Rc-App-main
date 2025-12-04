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
// import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
// import DateTimePicker from '@react-native-community/datetimepicker';
// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import {Camera} from 'react-native-camera-kit';

// const DeliveryChallan = ({navigation, route}) => {
//   const insets = useSafeAreaInsets();

//   const [userId, setUserId] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [existingFormId, setExistingFormId] = useState(null);
//   const [acceptTerms, setAcceptTerms] = useState(false);

//   // QR Scanner States
//   const [showChassisScanner, setShowChassisScanner] = useState(false);
//   const [showEngineScanner, setShowEngineScanner] = useState(false);
//   const [hasCameraPermission, setHasCameraPermission] = useState(false);

//   // Dropdown visibility states
//   const [showTractorModelDropdown, setShowTractorModelDropdown] =
//     useState(false);
//   const [showTiresMakeDropdown, setShowTiresMakeDropdown] = useState(false);
//   const [showFipMakeDropdown, setShowFipMakeDropdown] = useState(false);
//   const [showBatteryMakeDropdown, setShowBatteryMakeDropdown] = useState(false);
//   const [showPaymentStatusDropdown, setShowPaymentStatusDropdown] =
//     useState(false);
//   const [showFinancerDropdown, setShowFinancerDropdown] = useState(false);
//   const [showHypothecationDropdown, setShowHypothecationDropdown] =
//     useState(false);
//   const [showRelationDropdown, setShowRelationDropdown] = useState(false);
//   const [showDatePicker, setShowDatePicker] = useState(false);
//   const [showManufactureDatePicker, setShowManufactureDatePicker] =
//     useState(false);

//   // New states for exchange tractor
//   const [showExchangeTractorDropdown, setShowExchangeTractorDropdown] =
//     useState(false);

//   // New state for tractor delivered option in Branch mode
//   const [tractorDelivered, setTractorDelivered] = useState('');

//   // API fetched data
//   const [tractorModels, setTractorModels] = useState([]);
//   const [loadingModels, setLoadingModels] = useState(false);

//   const [formData, setFormData] = useState({
//     formNo: '',
//     date: null,
//     deliveryMode: 'Self Pickup', // Changed default to match API
//     challanCreatedBy: '',
//     customerName: '',
//     parentage: '',
//     address: '',
//     hypothecation: '',
//     hypothecationOther: '',
//     mobileNo: '',
//     isCustomer: '', // Changed from areYouCustomer to match API
//     tractorName: '',
//     tractorModel: '',
//     chassisNo: '',
//     engineNo: '',
//     yearOfManufacture: '',
//     tyresMake: '', // Changed from tiresMake to match API
//     tyresMakeOther: '', // Changed from tiresMakeOther to match API
//     fipMake: '',
//     fipMakeOther: '',
//     batteryMake: '',
//     batteryMakeOther: '',
//     dealPrice: '',
//     amountPaid: '', // Changed from cashPaid to match API
//     financeAmountPaid: '',
//     totalPaid: '',
//     balanceAmount: '',
//     paymentStatus: '',
//     financierName: '', // Changed from financerName to match API
//     // Branch fields
//     branchName: '',
//     branchPersonName: '',
//     branchAddress: '',
//     branchPhone: '', // Changed from branchMobileNumber to match API
//     // Representative fields
//     relativeName: '', // Changed from representativeName to match API
//     relativeFatherName: '', // Changed from representativeFatherName to match API
//     relativeAddress: '', // Changed from representativeAddress to match API
//     relativePhone: '', // Changed from representativeMobileNumber to match API
//     relativeRelation: '', // Changed from representativeRelation to match API
//     relationOther: '', // Changed from representativeRelationOther to match API
//     // Exchange Tractor fields
//     isExchangeTractor: '',
//     oldTractorName: '',
//     oldTractorChassisNo: '',
//     oldTractorYearOfManufacture: '',
//     exchangeDealAmount: '',
//     oldTractorRemark: '',
//   });

//   // Image states for signatures
//   const [customerSignature, setCustomerSignature] = useState(null);
//   const [managerSignature, setManagerSignature] = useState(null);
//   const [driverSignature, setDriverSignature] = useState(null);

//   const [accessories, setAccessories] = useState({
//     bumper: false,
//     cultivator: false,
//     leveler: false,
//     rallyFenderSeats: false,
//     weightsRear: false,
//     waterTanker: false,
//     trolly: false,
//     weightFront: false,
//     rearTowingHook: false,
//     hood: false,
//     ptoPully: false,
//     drawbar: false,
//     cageWheels: false,
//     tool: false,
//     toplink: false,
//   });

//   // Static data for dropdowns
//   const tiresMakes = [
//     'MRF',
//     'CEAT',
//     'Apollo',
//     'BKT',
//     'Goodyear',
//     'Bridgestone',
//     'Other',
//   ];
//   const fipMakes = [
//     'Bosch',
//     'Delphi',
//     'Denso',
//     'Siemens',
//     'Stanadyne',
//     'Other',
//   ];
//   const batteryMakes = [
//     'Exide',
//     'Amaron',
//     'Luminous',
//     'Su-Kam',
//     'Hankook',
//     'Other',
//   ];
//   const paymentStatuses = ['Paid', 'Pending'];
//   const hypothecationOptions = [
//     'John Deere Financial India Private Limited',
//     'The Jammu and Kashmir Bank Limited',
//     'Nil',
//     'Other',
//   ];
//   const relationOptions = [
//     'Father',
//     'Mother',
//     'Friend',
//     'Spouse',
//     'Brother',
//     'Sister',
//     'Son',
//     'Other',
//   ];
//   const exchangeOptions = ['yes', 'no'];
//   const tractorDeliveredOptions = ['yes', 'no'];


//   // Fetch tractor models from API
//   const fetchTractorModels = async () => {
//     try {
//       setLoadingModels(true);
//       const response = await axios.get(
//         'https://argosmob.uk/makroo/public/api/v1/model/tractor-models',
//       );
//       console.log('API Response for tractor models:', response.data);

//       if (
//         response.data &&
//         response.data.status === true &&
//         response.data.data
//       ) {
//         // Extract tractor_model from each item in the array
//         const models = response.data.data.map(item => item.tractor_model);
//         setTractorModels(models);
//         console.log('Tractor models extracted:', models);
//       } else {
//         console.log('No tractor models found in response');
//         // Set default models if API fails
//         setTractorModels([
//           '3028EN',
//           '3036EN',
//           '3036E',
//           '5105',
//           '5105 4WD',
//           '5050D Gear Pro',
//           '5210 Gear Pro',
//           '5050D 4WD Gear Pro',
//           '5210 4WD Gear Pro',
//           '5310 CRDI',
//           '5310 4WD CRDI',
//           '5405 CRDI',
//           '5405 4WD CRDI',
//           '5075 2WD',
//           '5075 4WD',
//         ]);
//       }
//     } catch (error) {
//       console.log('Error fetching tractor models:', error);
//       // Set default models on error
//       setTractorModels([
//         '3028EN',
//         '3036EN',
//         '3036E',
//         '5105',
//         '5105 4WD',
//         '5050D Gear Pro',
//         '5210 Gear Pro',
//         '5050D 4WD Gear Pro',
//         '5210 4WD Gear Pro',
//         '5310 CRDI',
//         '5310 4WD CRDI',
//         '5405 CRDI',
//         '5405 4WD CRDI',
//         '5075 2WD',
//         '5075 4WD',
//       ]);
//     } finally {
//       setLoadingModels(false);
//     }
//   };

//   // Camera Permission Function for QR Scanner
//   const requestCameraPermission = async () => {
//     if (Platform.OS === 'android') {
//       try {
//         const granted = await PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.CAMERA,
//           {
//             title: 'Camera Permission',
//             message: 'This app needs access to your camera to scan QR codes.',
//             buttonNeutral: 'Ask Me Later',
//             buttonNegative: 'Cancel',
//             buttonPositive: 'OK',
//           },
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
//       Alert.alert(
//         'Permission Denied',
//         'Camera permission is required to scan QR codes.',
//       );
//     }
//   };

//   const handleEngineScanPress = async () => {
//     const hasPermission = await requestCameraPermission();
//     if (hasPermission) {
//       setShowEngineScanner(true);
//     } else {
//       Alert.alert(
//         'Permission Denied',
//         'Camera permission is required to scan QR codes.',
//       );
//     }
//   };

//   const handleQRCodeRead = event => {
//     const scannedValue = event.nativeEvent.codeStringValue;
//     console.log('QR Code Scanned:', scannedValue);

//     if (showChassisScanner) {
//       handleInputChange('chassisNo', scannedValue);
//       setShowChassisScanner(false);
//     } else if (showEngineScanner) {
//       handleInputChange('engineNo', scannedValue);
//       setShowEngineScanner(false);
//     }
//   };

//   const closeScanner = () => {
//     setShowChassisScanner(false);
//     setShowEngineScanner(false);
//   };

//   // QR Scanner Component
//   const renderQRScanner = () => (
//     <Modal
//       visible={showChassisScanner || showEngineScanner}
//       animationType="slide"
//       transparent={false}
//       onRequestClose={closeScanner}>
//       <View style={styles.scannerContainer}>
//         <View style={styles.scannerHeader}>
//           <TouchableOpacity
//             onPress={closeScanner}
//             style={styles.scannerCloseButton}>
//             <Icon name="close" size={24} color="#fff" />
//           </TouchableOpacity>
//           <Text style={styles.scannerTitle}>
//             {showChassisScanner ? 'Scan Chassis Number' : 'Scan Engine Number'}
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

//   // Get user ID from AsyncStorage on component mount and fetch tractor models
//   useEffect(() => {
//     const initializeData = async () => {
//       try {
//         // Fetch user ID
//         const storedUserId = await AsyncStorage.getItem('userId');
//         if (storedUserId) {
//           setUserId(storedUserId);
//           console.log('User ID loaded:', storedUserId);
//         }

//         // Fetch tractor models from API
//         await fetchTractorModels();

//         // Check if we're in edit mode (receiving existing form data)
//         if (route.params?.formData) {
//           const editData = route.params.formData;
//           setIsEditMode(true);
//           setExistingFormId(editData.id);

//           // Pre-populate form data with API field names
//           setFormData({
//             formNo: editData.form_no || '',
//             date: editData.select_date ? new Date(editData.select_date) : null,
//             deliveryMode: editData.delivery_mode || 'Self Pickup',
//             challanCreatedBy: editData.challan_created_by || '',
//             customerName: editData.customer_name || '',
//             parentage: editData.parentage || '',
//             address: editData.address || '',
//             hypothecation: editData.hypothecation || '',
//             mobileNo: editData.mobile_no || '',
//             isCustomer: editData.is_customer?.toString() || '',
//             tractorName: editData.tractor_name || '',
//             tractorModel: editData.tractor_model || '',
//             chassisNo: editData.chassis_no || '',
//             engineNo: editData.engine_no || '',
//             yearOfManufacture: editData.year_of_manufacture || '',
//             tyresMake: editData.tyres_make || '',
//             fipMake: editData.fip_make || '',
//             batteryMake: editData.battery_make || '',
//             dealPrice: editData.deal_price || '',
//             amountPaid: editData.amount_paid || '',
//             financeAmountPaid: editData.finance_amount_paid || '',
//             totalPaid: editData.total_paid || '',
//             balanceAmount: editData.balance_amount || '',
//             paymentStatus: editData.payment_status || '',
//             financierName: editData.financier_name || '',
//             hypothecationOther: editData.hypothecation_other || '',
//             tyresMakeOther: editData.tire_make_other || '',
//             fipMakeOther: editData.fip_make_other || '',
//             batteryMakeOther: editData.battery_make_other || '',
//             branchName: editData.branch_name || '',
//             branchPersonName: editData.branch_person_name || '',
//             branchAddress: editData.branch_address || '',
//             branchPhone: editData.branch_phone || '',
//             relativeName: editData.relative_name || '',
//             relativeFatherName: editData.relative_father_name || '',
//             relativeAddress: editData.relative_address || '',
//             relativePhone: editData.relative_phone || '',
//             relativeRelation: editData.relative_relation || '',
//             relationOther: editData.relation_other || '',
//             isExchangeTractor: editData.is_exchange_tractor || '',
//             oldTractorName: editData.old_tractor_name || '',
//             oldTractorChassisNo: editData.old_tractor_chassis_no || '',
//             oldTractorYearOfManufacture:
//               editData.old_tractor_year_of_manufacture || '',
//             exchangeDealAmount: editData.exchange_deal_amount || '',
//             oldTractorRemark: editData.old_tractor_remark || '',
//           });

//           // Set tractor delivered status for Branch mode
//           if (editData.delivery_mode === 'Branch') {
//             setTractorDelivered(editData.tractor_delivered || '');
//           }

//           // Set accessories from JSON string if available
//           if (editData.accessories) {
//             try {
//               const accessoriesData =
//                 typeof editData.accessories === 'string'
//                   ? JSON.parse(editData.accessories)
//                   : editData.accessories;

//               const updatedAccessories = {...accessories};
//               Object.keys(accessoriesData).forEach(key => {
//                 if (
//                   accessoriesData[key] === 'Yes' ||
//                   accessoriesData[key] === true
//                 ) {
//                   const accessoryKey = key.toLowerCase().replace(/\s+/g, '');
//                   if (updatedAccessories.hasOwnProperty(accessoryKey)) {
//                     updatedAccessories[accessoryKey] = true;
//                   }
//                 }
//               });
//               setAccessories(updatedAccessories);
//             } catch (error) {
//               console.log('Error parsing accessories:', error);
//             }
//           }

//           setAcceptTerms(true);
//         }
//       } catch (error) {
//         console.log('Error loading user data:', error);
//       }
//     };

//     initializeData();
//   }, [route.params]);

//   // Generate form number
//   const generateFormNo = () => {
//     const timestamp = new Date().getTime();
//     return `DC${timestamp}`;
//   };

//   // Calculate total paid and balance amount automatically
//   useEffect(() => {
//     const amountPaid = parseFloat(formData.amountPaid) || 0;
//     const financeAmountPaid = parseFloat(formData.financeAmountPaid) || 0;
//     const totalPaid = amountPaid + financeAmountPaid;
//     const dealPrice = parseFloat(formData.dealPrice) || 0;
//     const balance = dealPrice - totalPaid;

//     handleInputChange('totalPaid', totalPaid.toString());
//     handleInputChange('balanceAmount', balance.toString());
//   }, [formData.amountPaid, formData.financeAmountPaid, formData.dealPrice]);

//   // Camera permissions for image capture
//   const requestCameraPermissionForImage = async () => {
//     if (Platform.OS === 'android') {
//       try {
//         const granted = await PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.CAMERA,
//           {
//             title: 'Camera Permission',
//             message: 'This app needs access to your camera to take photos.',
//             buttonNeutral: 'Ask Me Later',
//             buttonNegative: 'Cancel',
//             buttonPositive: 'OK',
//           },
//         );
//         return granted === PermissionsAndroid.RESULTS.GRANTED;
//       } catch (err) {
//         console.warn(err);
//         return false;
//       }
//     }
//     return true;
//   };

//   const showImagePickerOptions = setImageFunction => {
//     if (Platform.OS === 'ios') {
//       ActionSheetIOS.showActionSheetWithOptions(
//         {
//           options: ['Cancel', 'Take Photo', 'Choose from Library'],
//           cancelButtonIndex: 0,
//         },
//         async buttonIndex => {
//           if (buttonIndex === 1) {
//             const hasPermission = await requestCameraPermissionForImage();
//             if (hasPermission) handleCamera(setImageFunction);
//           } else if (buttonIndex === 2) handleImageLibrary(setImageFunction);
//         },
//       );
//     } else {
//       Alert.alert(
//         'Select Image',
//         'Choose an option',
//         [
//           {text: 'Cancel', style: 'cancel'},
//           {
//             text: 'Take Photo',
//             onPress: async () => {
//               const hasPermission = await requestCameraPermissionForImage();
//               if (hasPermission) handleCamera(setImageFunction);
//             },
//           },
//           {
//             text: 'Choose from Library',
//             onPress: () => handleImageLibrary(setImageFunction),
//           },
//         ],
//         {cancelable: true},
//       );
//     }
//   };

//   const handleCamera = setImageFunction => {
//     launchCamera(
//       {
//         mediaType: 'photo',
//         quality: 0.8,
//         cameraType: 'back',
//         saveToPhotos: true,
//         includeBase64: false,
//       },
//       response => {
//         if (response.didCancel) return;
//         if (response.error) {
//           Alert.alert('Error', 'Failed to capture image');
//           return;
//         }
//         if (response.assets && response.assets.length > 0) {
//           setImageFunction(response.assets[0]);
//         }
//       },
//     );
//   };

//   const handleImageLibrary = setImageFunction => {
//     launchImageLibrary(
//       {
//         mediaType: 'photo',
//         quality: 0.8,
//         includeBase64: false,
//       },
//       response => {
//         if (response.didCancel) return;
//         if (response.error) {
//           Alert.alert('Error', 'Failed to select image');
//           return;
//         }
//         if (response.assets && response.assets.length > 0) {
//           setImageFunction(response.assets[0]);
//         }
//       },
//     );
//   };

//   const handleInputChange = (field, value) => {
//     setFormData(prev => ({
//       ...prev,
//       [field]: value,
//     }));
//   };

//   const handleDeliveryModeSelect = mode => {
//     handleInputChange('deliveryMode', mode);
//     // Reset tractor delivered when changing delivery mode
//     if (mode !== 'Branch') {
//       setTractorDelivered('');
//     }
//   };

//   const handleIsCustomerSelect = value => {
//     handleInputChange('isCustomer', value === 'Yes' ? '1' : '0');
//   };

//   const handleExchangeTractorSelect = value => {
//     handleInputChange('isExchangeTractor', value);
//   };

//   const handleTractorDeliveredSelect = value => {
//     setTractorDelivered(value);
//   };

//   const handleAccessoryToggle = accessory => {
//     setAccessories(prev => ({
//       ...prev,
//       [accessory]: !prev[accessory],
//     }));
//   };

//   const handleTractorModelSelect = model => {
//     handleInputChange('tractorModel', model);
//     setShowTractorModelDropdown(false);
//   };

//   const handleTiresMakeSelect = make => {
//     handleInputChange('tyresMake', make);
//     setShowTiresMakeDropdown(false);
//   };

//   const handleFipMakeSelect = make => {
//     handleInputChange('fipMake', make);
//     setShowFipMakeDropdown(false);
//   };

//   const handleBatteryMakeSelect = make => {
//     handleInputChange('batteryMake', make);
//     setShowBatteryMakeDropdown(false);
//   };

//   const handlePaymentStatusSelect = status => {
//     handleInputChange('paymentStatus', status);
//     setShowPaymentStatusDropdown(false);
//   };

//   const handleFinancierSelect = financier => {
//     handleInputChange('financierName', financier);
//     setShowFinancerDropdown(false);
//   };

//   const handleHypothecationSelect = option => {
//     handleInputChange('hypothecation', option);
//     setShowHypothecationDropdown(false);
//   };

//   const handleRelationSelect = relation => {
//     handleInputChange('relativeRelation', relation);
//     setShowRelationDropdown(false);
//   };

//   const handleDateChange = (event, selectedDate) => {
//     setShowDatePicker(false);
//     if (selectedDate) {
//       handleInputChange('date', selectedDate);
//     }
//   };

//   const handleManufactureDateChange = (event, selectedDate) => {
//     setShowManufactureDatePicker(false);
//     if (selectedDate) {
//       const month = selectedDate.getMonth() + 1;
//       const year = selectedDate.getFullYear();
//       handleInputChange('yearOfManufacture', `${month}/${year}`);
//     }
//   };

//   const handleDateIconPress = () => {
//     setShowDatePicker(true);
//   };

//   const handleManufactureDateIconPress = () => {
//     setShowManufactureDatePicker(true);
//   };

//   const validateForm = () => {
//     const requiredFields = [
//       'customerName',
//       'parentage',
//       'address',
//       'mobileNo',
//       'tractorName',
//       'tractorModel',
//       'chassisNo',
//       'engineNo',
//       'yearOfManufacture',
//       'dealPrice',
//       'paymentStatus',
//     ];

//     for (const field of requiredFields) {
//       if (!formData[field] || formData[field].toString().trim() === '') {
//         Alert.alert(
//           'Validation Error',
//           `Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`,
//         );
//         return false;
//       }
//     }

//     if (!formData.isCustomer) {
//       Alert.alert('Validation Error', 'Please select if you are the customer');
//       return false;
//     }

//     // Branch validation
//     if (formData.deliveryMode === 'Branch') {
//       const branchFields = [
//         'branchName',
//         'branchPersonName',
//         'branchAddress',
//         'branchPhone',
//       ];
//       for (const field of branchFields) {
//         if (!formData[field] || formData[field].toString().trim() === '') {
//           Alert.alert(
//             'Validation Error',
//             `Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`,
//           );
//           return false;
//         }
//       }

//       // Validate tractor delivered option for Branch mode
//       if (!tractorDelivered) {
//         Alert.alert(
//           'Validation Error',
//           'Please select if tractor is delivered',
//         );
//         return false;
//       }

//       // If tractor is delivered, validate customer details
//       if (tractorDelivered === 'yes') {
//         const customerFields = [
//           'customerName',
//           'parentage',
//           'address',
//           'mobileNo',
//         ];
//         for (const field of customerFields) {
//           if (!formData[field] || formData[field].toString().trim() === '') {
//             Alert.alert(
//               'Validation Error',
//               `Please fill in ${field
//                 .replace(/([A-Z])/g, ' $1')
//                 .toLowerCase()}`,
//             );
//             return false;
//           }
//         }
//       }
//     }

//     // Representative validation (only if isCustomer is '0' AND we're showing customer details)
//     if (
//       formData.isCustomer === '0' &&
//       (formData.deliveryMode !== 'Branch' ||
//         (formData.deliveryMode === 'Branch' && tractorDelivered === 'yes'))
//     ) {
//       const representativeFields = [
//         'relativeName',
//         'relativeFatherName',
//         'relativeAddress',
//         'relativePhone',
//         'relativeRelation',
//       ];
//       for (const field of representativeFields) {
//         if (!formData[field] || formData[field].toString().trim() === '') {
//           Alert.alert(
//             'Validation Error',
//             `Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`,
//           );
//           return false;
//         }
//       }
//       if (
//         formData.relativeRelation === 'Other' &&
//         (!formData.relationOther || formData.relationOther.trim() === '')
//       ) {
//         Alert.alert('Validation Error', 'Please specify the relation');
//         return false;
//       }
//     }

//     // Exchange tractor validation
//     if (formData.isExchangeTractor === 'yes') {
//       const exchangeFields = [
//         'oldTractorName',
//         'oldTractorChassisNo',
//         'oldTractorYearOfManufacture',
//         'exchangeDealAmount',
//       ];
//       for (const field of exchangeFields) {
//         if (!formData[field] || formData[field].toString().trim() === '') {
//           Alert.alert(
//             'Validation Error',
//             `Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`,
//           );
//           return false;
//         }
//       }
//     }

//     // Signature validation (only required if tractor is delivered)
//     const shouldValidateSignatures =
//       formData.deliveryMode !== 'Branch' ||
//       (formData.deliveryMode === 'Branch' && tractorDelivered === 'yes');

//     if (shouldValidateSignatures) {
//       if (!customerSignature) {
//         Alert.alert('Validation Error', 'Please add customer signature');
//         return false;
//       }

//       if (!managerSignature) {
//         Alert.alert('Validation Error', 'Please add manager signature');
//         return false;
//       }

//       if (!driverSignature) {
//         Alert.alert('Validation Error', 'Please add driver signature');
//         return false;
//       }
//     }

//     if (!acceptTerms) {
//       Alert.alert(
//         'Validation Error',
//         'Please accept the terms and conditions by ticking the checkbox',
//       );
//       return false;
//     }

//     return true;
//   };

//   const prepareAccessoriesData = () => {
//     const accessoriesData = {};

//     const accessoryMapping = {
//       bumper: 'Bumper',
//       cultivator: 'Cultivator',
//       leveler: 'Leveler',
//       rallyFenderSeats: 'Rally Fender Seats',
//       weightsRear: 'Weights Rear',
//       waterTanker: 'Water Tanker',
//       trolly: 'Trolly',
//       weightFront: 'Weight Front',
//       rearTowingHook: 'Rear Towing Hook',
//       hood: 'Hood',
//       ptoPully: 'PTO Pully',
//       drawbar: 'Drawbar',
//       cageWheels: 'Cage Wheels',
//       tool: 'Tool',
//       toplink: 'Top Link',
//     };

//     Object.keys(accessories).forEach(key => {
//       if (accessoryMapping[key]) {
//         accessoriesData[accessoryMapping[key]] = accessories[key]
//           ? 'Yes'
//           : 'No';
//       }
//     });

//     accessoriesData.Other = [];

//     return JSON.stringify(accessoriesData);
//   };

//   const prepareFormData = () => {
//     const formDataToSend = new FormData();

//     // Add form data with exact field names as expected by API
//     formDataToSend.append('user_id', userId);
//     formDataToSend.append('form_no', formData.formNo || generateFormNo());
//     formDataToSend.append(
//       'select_date',
//       formData.date
//         ? formData.date.toISOString().split('T')[0]
//         : new Date().toISOString().split('T')[0],
//     );
//     formDataToSend.append('delivery_mode', formData.deliveryMode);
//     formDataToSend.append(
//       'challan_created_by',
//       formData.challanCreatedBy || 'Admin',
//     );
//     formDataToSend.append('customer_name', formData.customerName);
//     formDataToSend.append('parentage', formData.parentage);
//     formDataToSend.append('address', formData.address);
//     formDataToSend.append('hypothecation', formData.hypothecation || '');
//     formDataToSend.append(
//       'hypothecation_other',
//       formData.hypothecationOther || '',
//     );
//     formDataToSend.append('mobile_no', formData.mobileNo);
//     formDataToSend.append('is_customer', formData.isCustomer);
//     formDataToSend.append('tractor_name', formData.tractorName);
//     formDataToSend.append('tractor_model', formData.tractorModel);
//     formDataToSend.append('chassis_no', formData.chassisNo);
//     formDataToSend.append('engine_no', formData.engineNo);
//     formDataToSend.append('year_of_manufacture', formData.yearOfManufacture);
//     formDataToSend.append('tyres_make', formData.tyresMake || '');
//     formDataToSend.append('fip_make', formData.fipMake || '');
//     formDataToSend.append('battery_make', formData.batteryMake || '');
//     formDataToSend.append('deal_price', formData.dealPrice);
//     formDataToSend.append('amount_paid', formData.amountPaid || '0');
//     formDataToSend.append(
//       'finance_amount_paid',
//       formData.financeAmountPaid || '0',
//     );
//     formDataToSend.append('total_paid', formData.totalPaid || '0');
//     formDataToSend.append('balance_amount', formData.balanceAmount || '0');
//     formDataToSend.append('payment_status', formData.paymentStatus);
//     formDataToSend.append('financier_name', formData.financierName || '');
//     formDataToSend.append('accessories', prepareAccessoriesData());

//     // Add tractor delivered status for Branch mode
//     if (formData.deliveryMode === 'Branch') {
//       formDataToSend.append('tractor_delivered', tractorDelivered || '');
//     }

//     // Add branch fields with correct API field names
//     formDataToSend.append('branch_name', formData.branchName || '');
//     formDataToSend.append(
//       'branch_person_name',
//       formData.branchPersonName || '',
//     );
//     formDataToSend.append('branch_address', formData.branchAddress || '');
//     formDataToSend.append('branch_phone', formData.branchPhone || '');

//     // Add representative fields with correct API field names
//     formDataToSend.append('relative_name', formData.relativeName || '');
//     formDataToSend.append(
//       'relative_father_name',
//       formData.relativeFatherName || '',
//     );
//     formDataToSend.append('relative_address', formData.relativeAddress || '');
//     formDataToSend.append('relative_phone', formData.relativePhone || '');
//     formDataToSend.append('relative_relation', formData.relativeRelation || '');
//     formDataToSend.append('relation_other', formData.relationOther || '');

//     // Add exchange tractor fields
//     formDataToSend.append(
//       'is_exchange_tractor',
//       formData.isExchangeTractor || '',
//     );
//     formDataToSend.append('old_tractor_name', formData.oldTractorName || '');
//     formDataToSend.append(
//       'old_tractor_chassis_no',
//       formData.oldTractorChassisNo || '',
//     );
//     formDataToSend.append(
//       'old_tractor_year_of_manufacture',
//       formData.oldTractorYearOfManufacture || '',
//     );
//     formDataToSend.append(
//       'exchange_deal_amount',
//       formData.exchangeDealAmount || '',
//     );
//     formDataToSend.append(
//       'old_tractor_remark',
//       formData.oldTractorRemark || '',
//     );

//     // Add other fields for tires, fip, battery
//     if (formData.tyresMake === 'Other') {
//       formDataToSend.append('tire_make_other', formData.tyresMakeOther || '');
//     }
//     if (formData.fipMake === 'Other') {
//       formDataToSend.append('fip_make_other', formData.fipMakeOther || '');
//     }
//     if (formData.batteryMake === 'Other') {
//       formDataToSend.append(
//         'battery_make_other',
//         formData.batteryMakeOther || '',
//       );
//     }

//     // Add images with proper file names (only if tractor is delivered)
//     const shouldAddSignatures =
//       formData.deliveryMode !== 'Branch' ||
//       (formData.deliveryMode === 'Branch' && tractorDelivered === 'yes');

//     if (shouldAddSignatures) {
//       if (customerSignature) {
//         formDataToSend.append('customer_signature', {
//           uri: customerSignature.uri,
//           type: customerSignature.type || 'image/jpeg',
//           name: `customer_signature_${Date.now()}.jpg`,
//         });
//       }

//       if (managerSignature) {
//         formDataToSend.append('manager_signature', {
//           uri: managerSignature.uri,
//           type: managerSignature.type || 'image/jpeg',
//           name: `manager_signature_${Date.now()}.jpg`,
//         });
//       }

//       if (driverSignature) {
//         formDataToSend.append('driver_signature', {
//           uri: driverSignature.uri,
//           type: driverSignature.type || 'image/jpeg',
//           name: `driver_signature_${Date.now()}.jpg`,
//         });
//       }
//     }

//     // For update, add the form ID
//     if (isEditMode && existingFormId) {
//       formDataToSend.append('id', existingFormId);
//     }

//     return formDataToSend;
//   };

//   const handleSubmit = async () => {
//     if (!userId) {
//       Alert.alert('Error', 'User ID not found. Please login again.');
//       return;
//     }

//     if (!acceptTerms) {
//       Alert.alert(
//         'Terms Not Accepted',
//         'Please accept the terms and conditions by ticking the checkbox before submitting the form.',
//       );
//       return;
//     }

//     if (!validateForm()) {
//       return;
//     }

//     setLoading(true);

//     try {
//       const formDataToSend = prepareFormData();

//       const url = isEditMode
//         ? 'https://argosmob.uk/makroo/public/api/v1/delivery-challan/form/update'
//         : 'https://argosmob.uk/makroo/public/api/v1/delivery-challan/form/save';

//       console.log('Submitting form data...');

//       const response = await axios.post(url, formDataToSend, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//           Accept: 'application/json',
//         },
//         timeout: 30000,
//       });

//       console.log('API Response:', response.data);

//       if (
//         response.data &&
//         (response.data.success === true ||
//           response.data.status === 'success' ||
//           response.data.message?.toLowerCase().includes('success'))
//       ) {
//         Alert.alert(
//           'Success',
//           isEditMode
//             ? 'Delivery Challan updated successfully!'
//             : 'Delivery Challan submitted successfully!',
//           [
//             {
//               text: 'OK',
//               onPress: () => navigation.navigate('Dashboard'),
//             },
//           ],
//         );
//       } else {
//         let errorMessage = 'Submission failed';

//         if (response.data && response.data.message) {
//           errorMessage = response.data.message;
//         } else if (response.data && response.data.error) {
//           errorMessage = response.data.error;
//         } else if (response.data && response.data.errors) {
//           const validationErrors = Object.values(response.data.errors).flat();
//           errorMessage = validationErrors.join(', ');
//         }

//         Alert.alert('Submission Failed', errorMessage);
//       }
//     } catch (error) {
//       console.log('Submission Error:', error);

//       if (error.response) {
//         let errorMessage = 'Submission failed. Please try again.';

//         if (error.response.status === 422) {
//           if (error.response.data.errors) {
//             const validationErrors = Object.values(
//               error.response.data.errors,
//             ).flat();
//             errorMessage = `Validation Error: ${validationErrors.join(', ')}`;
//           } else if (error.response.data.message) {
//             errorMessage = error.response.data.message;
//           }
//         } else if (error.response.data?.message) {
//           errorMessage = error.response.data.message;
//         } else if (error.response.data?.error) {
//           errorMessage = error.response.data.error;
//         }

//         Alert.alert('Submission Failed', errorMessage);
//       } else if (error.request) {
//         Alert.alert(
//           'Network Error',
//           'Please check your internet connection and try again.',
//         );
//       } else {
//         Alert.alert('Error', 'Something went wrong. Please try again.');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleHome = () => {
//     navigation.navigate('Dashboard');
//   };

//   const renderDropdownItem = ({item}) => (
//     <TouchableOpacity
//       style={styles.dropdownItem}
//       onPress={() => {
//         if (showTractorModelDropdown) handleTractorModelSelect(item);
//         else if (showTiresMakeDropdown) handleTiresMakeSelect(item);
//         else if (showFipMakeDropdown) handleFipMakeSelect(item);
//         else if (showBatteryMakeDropdown) handleBatteryMakeSelect(item);
//         else if (showPaymentStatusDropdown) handlePaymentStatusSelect(item);
//         else if (showFinancerDropdown) handleFinancierSelect(item);
//         else if (showHypothecationDropdown) handleHypothecationSelect(item);
//         else if (showRelationDropdown) handleRelationSelect(item);
//         else if (showExchangeTractorDropdown) handleExchangeTractorSelect(item);
//       }}>
//       <Text style={styles.dropdownItemText}>{item}</Text>
//     </TouchableOpacity>
//   );

//   // Determine if customer details should be shown
//   const shouldShowCustomerDetails =
//     formData.deliveryMode !== 'Branch' ||
//     (formData.deliveryMode === 'Branch' && tractorDelivered === 'yes');

//   return (
//     <View
//       style={[
//         styles.container,
//         {paddingTop: insets.top, paddingBottom: insets.bottom},
//       ]}>
//       {/* Header */}
//       <LinearGradient
//         colors={['#7E5EA9', '#20AEBC']}
//         start={{x: 0, y: 0}}
//         end={{x: 1, y: 0}}
//         style={styles.header}>
//         <Text style={styles.headerTitle}>Delivery Challan</Text>
//         {isEditMode && <Text style={styles.editModeText}>Edit Mode</Text>}
//       </LinearGradient>

//       <ScrollView style={styles.scrollView}>
//         {/* Form No */}
//         <Text style={styles.sectionHeading}>Create Delivery Challan</Text>

//         {/* Date */}
//         <View style={styles.inputContainer}>
//           <LinearGradient
//             colors={['#7E5EA9', '#20AEBC']}
//             style={styles.inputGradient}>
//             <View style={styles.inputWithIcon}>
//               <TouchableOpacity
//                 style={[styles.textInput, {flex: 1}]}
//                 onPress={handleDateIconPress}
//                 disabled={loading}>
//                 <Text
//                   style={
//                     formData.date ? styles.selectedText : styles.placeholderText
//                   }>
//                   {formData.date
//                     ? formData.date.toLocaleDateString()
//                     : 'Select Date'}
//                 </Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={styles.iconButton}
//                 onPress={handleDateIconPress}
//                 disabled={loading}>
//                 <Icon name="calendar-today" size={20} color="#666" />
//               </TouchableOpacity>
//               {showDatePicker && (
//                 <DateTimePicker
//                   value={formData.date || new Date()}
//                   mode="date"
//                   display={Platform.OS === 'ios' ? 'spinner' : 'default'}
//                   onChange={handleDateChange}
//                 />
//               )}
//             </View>
//           </LinearGradient>
//         </View>

//         {/* Delivery Mode */}
//         <View style={styles.deliveryModeContainer}>
//           <Text style={styles.sectionLabel}>Delivery Mode</Text>
//           <View style={styles.deliveryModeButtons}>
//             <TouchableOpacity
//               style={[
//                 styles.deliveryModeButton,
//                 formData.deliveryMode === 'Self Pickup' &&
//                   styles.deliveryModeSelected,
//               ]}
//               onPress={() => handleDeliveryModeSelect('Self Pickup')}
//               disabled={loading}>
//               <LinearGradient
//                 colors={
//                   formData.deliveryMode === 'Self Pickup'
//                     ? ['#7E5EA9', '#20AEBC']
//                     : ['#7E5EA9', '#20AEBC']
//                 }
//                 style={styles.deliveryModeGradient}>
//                 <Text
//                   style={[
//                     styles.deliveryModeText,
//                     formData.deliveryMode === 'Self Pickup' &&
//                       styles.deliveryModeTextSelected,
//                   ]}>
//                   Self Pickup
//                 </Text>
//               </LinearGradient>
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={[
//                 styles.deliveryModeButton,
//                 formData.deliveryMode === 'Branch' &&
//                   styles.deliveryModeSelected,
//               ]}
//               onPress={() => handleDeliveryModeSelect('Branch')}
//               disabled={loading}>
//               <LinearGradient
//                 colors={
//                   formData.deliveryMode === 'Branch'
//                     ? ['#7E5EA9', '#20AEBC']
//                     : ['#7E5EA9', '#20AEBC']
//                 }
//                 style={styles.deliveryModeGradient}>
//                 <Text
//                   style={[
//                     styles.deliveryModeText,
//                     formData.deliveryMode === 'Branch' &&
//                       styles.deliveryModeTextSelected,
//                   ]}>
//                   Branch
//                 </Text>
//               </LinearGradient>
//             </TouchableOpacity>
//           </View>
//         </View>

//         {/* Branch Fields - Conditionally Rendered */}
//         {formData.deliveryMode === 'Branch' && (
//           <View style={styles.branchSection}>
//             <Text style={styles.sectionHeading}>Branch Details</Text>

//             {/* Tractor Delivered Option */}
//             <View style={styles.tractorDeliveredSection}>
//               <Text style={styles.radioLabel}>Tractor Delivered?</Text>
//               <View style={styles.radioOptions}>
//                 {tractorDeliveredOptions.map(option => (
//                   <TouchableOpacity
//                     key={option}
//                     style={styles.radioOption}
//                     onPress={() => handleTractorDeliveredSelect(option)}
//                     disabled={loading}>
//                     <LinearGradient
//                       colors={
//                         tractorDelivered === option
//                           ? ['#12C857', '#12C857']
//                           : ['#f0f0f0', '#f0f0f0']
//                       }
//                       style={styles.radioGradient}>
//                       <View style={styles.radioInner}>
//                         {tractorDelivered === option && (
//                           <Icon name="check" size={24} color="#fff" />
//                         )}
//                       </View>
//                     </LinearGradient>
//                     <Text style={styles.radioText}>
//                       {option === 'yes' ? 'Yes' : 'No'}
//                     </Text>
//                   </TouchableOpacity>
//                 ))}
//               </View>
//             </View>

//             {/* Branch Name */}
//             <View style={styles.inputRow}>
//               <View style={styles.fullWidthInputContainer}>
//                 <LinearGradient
//                   colors={['#7E5EA9', '#20AEBC']}
//                   style={styles.inputGradient}>
//                   <TextInput
//                     style={styles.textInput}
//                     value={formData.branchName}
//                     onChangeText={text => handleInputChange('branchName', text)}
//                     placeholder="Branch Name"
//                     placeholderTextColor="#666"
//                     editable={!loading}
//                   />
//                 </LinearGradient>
//               </View>
//             </View>

//             {/* Branch Person Name */}
//             <View style={styles.inputRow}>
//               <View style={styles.fullWidthInputContainer}>
//                 <LinearGradient
//                   colors={['#7E5EA9', '#20AEBC']}
//                   style={styles.inputGradient}>
//                   <TextInput
//                     style={styles.textInput}
//                     value={formData.branchPersonName}
//                     onChangeText={text =>
//                       handleInputChange('branchPersonName', text)
//                     }
//                     placeholder="Branch Person Name"
//                     placeholderTextColor="#666"
//                     editable={!loading}
//                   />
//                 </LinearGradient>
//               </View>
//             </View>

//             {/* Branch Address */}
//             <View style={styles.inputRow}>
//               <View style={styles.fullWidthInputContainer}>
//                 <LinearGradient
//                   colors={['#7E5EA9', '#20AEBC']}
//                   style={styles.inputGradient}>
//                   <TextInput
//                     style={styles.textInput}
//                     value={formData.branchAddress}
//                     onChangeText={text =>
//                       handleInputChange('branchAddress', text)
//                     }
//                     placeholder="Branch Address"
//                     placeholderTextColor="#666"
//                     multiline
//                     numberOfLines={2}
//                     editable={!loading}
//                   />
//                 </LinearGradient>
//               </View>
//             </View>

//             {/* Branch Phone */}
//             <View style={styles.inputRow}>
//               <View style={styles.fullWidthInputContainer}>
//                 <LinearGradient
//                   colors={['#7E5EA9', '#20AEBC']}
//                   style={styles.inputGradient}>
//                   <TextInput
//                     style={styles.textInput}
//                     value={formData.branchPhone}
//                     onChangeText={text =>
//                       handleInputChange('branchPhone', text)
//                     }
//                     placeholder="Branch Phone"
//                     placeholderTextColor="#666"
//                     keyboardType="phone-pad"
//                     editable={!loading}
//                   />
//                 </LinearGradient>
//               </View>
//             </View>
//           </View>
//         )}

//         {/* Customer Details Heading - Conditionally Rendered */}
//         {shouldShowCustomerDetails && (
//           <>
//             <Text style={styles.sectionHeading}>Customer Details</Text>

//             {/* Challan Created By */}
//             <View style={styles.inputRow}>
//               <View style={styles.inputContainer}>
//                 <LinearGradient
//                   colors={['#7E5EA9', '#20AEBC']}
//                   style={styles.inputGradient}>
//                   <TextInput
//                     style={styles.textInput}
//                     value={formData.challanCreatedBy}
//                     onChangeText={text =>
//                       handleInputChange('challanCreatedBy', text)
//                     }
//                     placeholder="Challan Created By"
//                     placeholderTextColor="#666"
//                     editable={!loading}
//                   />
//                 </LinearGradient>
//               </View>
//             </View>

//             {/* Customer Name & Parentage */}
//             <View style={styles.inputRow}>
//               <View style={styles.inputContainer}>
//                 <LinearGradient
//                   colors={['#7E5EA9', '#20AEBC']}
//                   style={styles.inputGradient}>
//                   <TextInput
//                     style={styles.textInput}
//                     value={formData.customerName}
//                     onChangeText={text =>
//                       handleInputChange('customerName', text)
//                     }
//                     placeholder="Customer Name"
//                     placeholderTextColor="#666"
//                     editable={!loading}
//                   />
//                 </LinearGradient>
//               </View>
//               <View style={{marginBottom: 15}} />
//               <View style={styles.inputContainer}>
//                 <LinearGradient
//                   colors={['#7E5EA9', '#20AEBC']}
//                   style={styles.inputGradient}>
//                   <TextInput
//                     style={styles.textInput}
//                     value={formData.parentage}
//                     onChangeText={text => handleInputChange('parentage', text)}
//                     placeholder="Parentage"
//                     placeholderTextColor="#666"
//                     editable={!loading}
//                   />
//                 </LinearGradient>
//               </View>
//             </View>

//             {/* Address */}
//             <View style={styles.inputRow}>
//               <View style={styles.fullWidthInputContainer}>
//                 <LinearGradient
//                   colors={['#7E5EA9', '#20AEBC']}
//                   style={styles.inputGradient}>
//                   <TextInput
//                     style={[styles.textInput]}
//                     value={formData.address}
//                     onChangeText={text => handleInputChange('address', text)}
//                     placeholder="Enter Address"
//                     placeholderTextColor="#666"
//                     multiline
//                     numberOfLines={1}
//                     editable={!loading}
//                   />
//                 </LinearGradient>
//               </View>
//             </View>

//             {/* Hypothecation */}
//             <View style={styles.inputRow}>
//               <View style={styles.inputContainer}>
//                 <LinearGradient
//                   colors={['#7E5EA9', '#20AEBC']}
//                   style={styles.inputGradient}>
//                   <TouchableOpacity
//                     style={styles.dropdownInput}
//                     onPress={() => setShowHypothecationDropdown(true)}
//                     disabled={loading}>
//                     <Text
//                       style={
//                         formData.hypothecation
//                           ? styles.selectedText
//                           : styles.placeholderText
//                       }>
//                       {formData.hypothecation || 'Select Hypothecation'}
//                     </Text>
//                     <Icon name="keyboard-arrow-down" size={24} color="#666" />
//                   </TouchableOpacity>
//                 </LinearGradient>
//               </View>
//             </View>

//             {/* Hypothecation Other */}
//             {formData.hypothecation === 'Other' && (
//               <View style={styles.inputRow}>
//                 <View style={styles.fullWidthInputContainer}>
//                   <LinearGradient
//                     colors={['#7E5EA9', '#20AEBC']}
//                     style={styles.inputGradient}>
//                     <TextInput
//                       style={styles.textInput}
//                       value={formData.hypothecationOther}
//                       onChangeText={text =>
//                         handleInputChange('hypothecationOther', text)
//                       }
//                       placeholder="Enter Other Hypothecation"
//                       placeholderTextColor="#666"
//                       editable={!loading}
//                     />
//                   </LinearGradient>
//                 </View>
//               </View>
//             )}

//             {/* Mobile No */}
//             <View style={styles.inputRow}>
//               <View style={styles.inputContainer}>
//                 <LinearGradient
//                   colors={['#7E5EA9', '#20AEBC']}
//                   style={styles.inputGradient}>
//                   <TextInput
//                     style={styles.textInput}
//                     value={formData.mobileNo}
//                     onChangeText={text => handleInputChange('mobileNo', text)}
//                     placeholder="Mobile No."
//                     placeholderTextColor="#666"
//                     keyboardType="phone-pad"
//                     editable={!loading}
//                   />
//                 </LinearGradient>
//               </View>
//             </View>

//             {/* Are You Customer? */}
//             <View style={styles.radioSection}>
//               <Text style={styles.radioLabel}>Are You Customer?</Text>
//               <View style={styles.radioOptions}>
//                 {['Yes', 'No'].map(option => (
//                   <TouchableOpacity
//                     key={option}
//                     style={styles.radioOption}
//                     onPress={() => handleIsCustomerSelect(option)}
//                     disabled={loading}>
//                     <LinearGradient
//                       colors={
//                         formData.isCustomer === (option === 'Yes' ? '1' : '0')
//                           ? ['#12C857', '#12C857']
//                           : ['#f0f0f0', '#f0f0f0']
//                       }
//                       style={styles.radioGradient}>
//                       <View style={styles.radioInner}>
//                         {formData.isCustomer ===
//                           (option === 'Yes' ? '1' : '0') && (
//                           <Icon name="check" size={24} color="#fff" />
//                         )}
//                       </View>
//                     </LinearGradient>
//                     <Text style={styles.radioText}>{option}</Text>
//                   </TouchableOpacity>
//                 ))}
//               </View>
//             </View>

//             {/* Representative Fields */}
//             {formData.isCustomer === '0' && (
//               <View style={styles.representativeSection}>
//                 <Text style={styles.sectionHeading}>
//                   Representative Details
//                 </Text>

//                 {/* Representative Name */}
//                 <View style={styles.inputRow}>
//                   <View style={styles.fullWidthInputContainer}>
//                     <LinearGradient
//                       colors={['#7E5EA9', '#20AEBC']}
//                       style={styles.inputGradient}>
//                       <TextInput
//                         style={styles.textInput}
//                         value={formData.relativeName}
//                         onChangeText={text =>
//                           handleInputChange('relativeName', text)
//                         }
//                         placeholder="Representative Name"
//                         placeholderTextColor="#666"
//                         editable={!loading}
//                       />
//                     </LinearGradient>
//                   </View>
//                 </View>

//                 {/* Representative Father's Name */}
//                 <View style={styles.inputRow}>
//                   <View style={styles.fullWidthInputContainer}>
//                     <LinearGradient
//                       colors={['#7E5EA9', '#20AEBC']}
//                       style={styles.inputGradient}>
//                       <TextInput
//                         style={styles.textInput}
//                         value={formData.relativeFatherName}
//                         onChangeText={text =>
//                           handleInputChange('relativeFatherName', text)
//                         }
//                         placeholder="Father's Name"
//                         placeholderTextColor="#666"
//                         editable={!loading}
//                       />
//                     </LinearGradient>
//                   </View>
//                 </View>

//                 {/* Representative Address */}
//                 <View style={styles.inputRow}>
//                   <View style={styles.fullWidthInputContainer}>
//                     <LinearGradient
//                       colors={['#7E5EA9', '#20AEBC']}
//                       style={styles.inputGradient}>
//                       <TextInput
//                         style={styles.textInput}
//                         value={formData.relativeAddress}
//                         onChangeText={text =>
//                           handleInputChange('relativeAddress', text)
//                         }
//                         placeholder="Representative Address"
//                         placeholderTextColor="#666"
//                         multiline
//                         numberOfLines={2}
//                         editable={!loading}
//                       />
//                     </LinearGradient>
//                   </View>
//                 </View>

//                 {/* Representative Phone */}
//                 <View style={styles.inputRow}>
//                   <View style={styles.fullWidthInputContainer}>
//                     <LinearGradient
//                       colors={['#7E5EA9', '#20AEBC']}
//                       style={styles.inputGradient}>
//                       <TextInput
//                         style={styles.textInput}
//                         value={formData.relativePhone}
//                         onChangeText={text =>
//                           handleInputChange('relativePhone', text)
//                         }
//                         placeholder="Representative Phone"
//                         placeholderTextColor="#666"
//                         keyboardType="phone-pad"
//                         editable={!loading}
//                       />
//                     </LinearGradient>
//                   </View>
//                 </View>

//                 {/* Relation with Owner */}
//                 <View style={styles.inputRow}>
//                   <View style={styles.inputContainer}>
//                     <LinearGradient
//                       colors={['#7E5EA9', '#20AEBC']}
//                       style={styles.inputGradient}>
//                       <TouchableOpacity
//                         style={styles.dropdownInput}
//                         onPress={() => setShowRelationDropdown(true)}
//                         disabled={loading}>
//                         <Text
//                           style={
//                             formData.relativeRelation
//                               ? styles.selectedText
//                               : styles.placeholderText
//                           }>
//                           {formData.relativeRelation || 'Relation with Owner'}
//                         </Text>
//                         <Icon
//                           name="keyboard-arrow-down"
//                           size={24}
//                           color="#666"
//                         />
//                       </TouchableOpacity>
//                     </LinearGradient>
//                   </View>
//                 </View>

//                 {/* Relation Other */}
//                 {formData.relativeRelation === 'Other' && (
//                   <View style={styles.inputRow}>
//                     <View style={styles.fullWidthInputContainer}>
//                       <LinearGradient
//                         colors={['#7E5EA9', '#20AEBC']}
//                         style={styles.inputGradient}>
//                         <TextInput
//                           style={styles.textInput}
//                           value={formData.relationOther}
//                           onChangeText={text =>
//                             handleInputChange('relationOther', text)
//                           }
//                           placeholder="Enter Other Relation"
//                           placeholderTextColor="#666"
//                           editable={!loading}
//                         />
//                       </LinearGradient>
//                     </View>
//                   </View>
//                 )}
//               </View>
//             )}
//           </>
//         )}

//         {/* Tractor Details Heading */}
//         <Text style={styles.sectionHeading}>Tractor Details</Text>

//         {/* Tractor Name & Model */}
//         <View style={styles.inputRow}>
//           <View style={styles.inputContainer}>
//             <LinearGradient
//               colors={['#7E5EA9', '#20AEBC']}
//               style={styles.inputGradient}>
//               <TextInput
//                 style={styles.textInput}
//                 value={formData.tractorName}
//                 onChangeText={text => handleInputChange('tractorName', text)}
//                 placeholder="Tractor Name"
//                 placeholderTextColor="#666"
//                 editable={!loading}
//               />
//             </LinearGradient>
//           </View>
//           <View style={{marginBottom: 15}} />
//           <View style={styles.inputContainer}>
//             <LinearGradient
//               colors={['#7E5EA9', '#20AEBC']}
//               style={styles.inputGradient}>
//               <TouchableOpacity
//                 style={styles.dropdownInput}
//                 onPress={() => setShowTractorModelDropdown(true)}
//                 disabled={loading}>
//                 <Text
//                   style={
//                     formData.tractorModel
//                       ? styles.selectedText
//                       : styles.placeholderText
//                   }>
//                   {formData.tractorModel || 'Select Model'}
//                 </Text>
//                 <Icon name="keyboard-arrow-down" size={24} color="#666" />
//               </TouchableOpacity>
//               {loadingModels && (
//                 <ActivityIndicator
//                   size="small"
//                   color="#7E5EA9"
//                   style={styles.loadingIndicator}
//                 />
//               )}
//             </LinearGradient>
//           </View>
//         </View>

//         {/* Chassis No & Engine No */}
//         <View style={styles.inputRow}>
//           <View style={styles.inputContainer}>
//             <LinearGradient
//               colors={['#7E5EA9', '#20AEBC']}
//               style={styles.inputGradient}>
//               <View style={styles.inputWithIcon}>
//                 <TextInput
//                   style={[styles.textInput, {flex: 1}]}
//                   value={formData.chassisNo}
//                   onChangeText={text => handleInputChange('chassisNo', text)}
//                   placeholder="Chassis No"
//                   placeholderTextColor="#666"
//                   editable={!loading}
//                 />
//                 <TouchableOpacity
//                   style={styles.iconButton}
//                   onPress={handleChassisScanPress}
//                   disabled={loading}>
//                   <Icon name="qr-code-scanner" size={20} color="#666" />
//                 </TouchableOpacity>
//               </View>
//             </LinearGradient>
//           </View>
//           <View style={{marginBottom: 15}} />
//           <View style={styles.inputContainer}>
//             <LinearGradient
//               colors={['#7E5EA9', '#20AEBC']}
//               style={styles.inputGradient}>
//               <View style={styles.inputWithIcon}>
//                 <TextInput
//                   style={[styles.textInput, {flex: 1}]}
//                   value={formData.engineNo}
//                   onChangeText={text => handleInputChange('engineNo', text)}
//                   placeholder="Engine No"
//                   placeholderTextColor="#666"
//                   editable={!loading}
//                 />
//                 <TouchableOpacity
//                   style={styles.iconButton}
//                   onPress={handleEngineScanPress}
//                   disabled={loading}>
//                   <Icon name="qr-code-scanner" size={20} color="#666" />
//                 </TouchableOpacity>
//               </View>
//             </LinearGradient>
//           </View>
//         </View>

//         {/* Year of Manufacture */}
//         <View style={styles.inputRow}>
//           <View style={styles.inputContainer}>
//             <LinearGradient
//               colors={['#7E5EA9', '#20AEBC']}
//               style={styles.inputGradient}>
//               <View style={styles.inputWithIcon}>
//                 <TouchableOpacity
//                   style={[styles.textInput, {flex: 1}]}
//                   onPress={handleManufactureDateIconPress}
//                   disabled={loading}>
//                   <Text
//                     style={
//                       formData.yearOfManufacture
//                         ? styles.selectedText
//                         : styles.placeholderText
//                     }>
//                     {formData.yearOfManufacture || 'Month/Year of Manufacture'}
//                   </Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                   style={styles.iconButton}
//                   onPress={handleManufactureDateIconPress}
//                   disabled={loading}>
//                   <Icon name="calendar-today" size={20} color="#666" />
//                 </TouchableOpacity>
//                 {showManufactureDatePicker && (
//                   <DateTimePicker
//                     value={new Date()}
//                     mode="date"
//                     display={Platform.OS === 'ios' ? 'spinner' : 'default'}
//                     onChange={handleManufactureDateChange}
//                   />
//                 )}
//               </View>
//             </LinearGradient>
//           </View>
//         </View>

//         {/* Tires Make with Other option */}
//         <View style={styles.inputRow}>
//           <View style={styles.inputContainer}>
//             <LinearGradient
//               colors={['#7E5EA9', '#20AEBC']}
//               style={styles.inputGradient}>
//               <TouchableOpacity
//                 style={styles.dropdownInput}
//                 onPress={() => setShowTiresMakeDropdown(true)}
//                 disabled={loading}>
//                 <Text
//                   style={
//                     formData.tyresMake
//                       ? styles.selectedText
//                       : styles.placeholderText
//                   }>
//                   {formData.tyresMake || 'Select Tires Make'}
//                 </Text>
//                 <Icon name="keyboard-arrow-down" size={24} color="#666" />
//               </TouchableOpacity>
//             </LinearGradient>
//           </View>
//         </View>

//         {/* Tires Make Other */}
//         {formData.tyresMake === 'Other' && (
//           <View style={styles.inputRow}>
//             <View style={styles.fullWidthInputContainer}>
//               <LinearGradient
//                 colors={['#7E5EA9', '#20AEBC']}
//                 style={styles.inputGradient}>
//                 <TextInput
//                   style={styles.textInput}
//                   value={formData.tyresMakeOther}
//                   onChangeText={text =>
//                     handleInputChange('tyresMakeOther', text)
//                   }
//                   placeholder="Enter Other Tires Make"
//                   placeholderTextColor="#666"
//                   editable={!loading}
//                 />
//               </LinearGradient>
//             </View>
//           </View>
//         )}

//         {/* FIP Make with Other option */}
//         <View style={styles.inputRow}>
//           <View style={styles.inputContainer}>
//             <LinearGradient
//               colors={['#7E5EA9', '#20AEBC']}
//               style={styles.inputGradient}>
//               <TouchableOpacity
//                 style={styles.dropdownInput}
//                 onPress={() => setShowFipMakeDropdown(true)}
//                 disabled={loading}>
//                 <Text
//                   style={
//                     formData.fipMake
//                       ? styles.selectedText
//                       : styles.placeholderText
//                   }>
//                   {formData.fipMake || 'FIP Make'}
//                 </Text>
//                 <Icon name="keyboard-arrow-down" size={24} color="#666" />
//               </TouchableOpacity>
//             </LinearGradient>
//           </View>
//         </View>

//         {/* FIP Make Other */}
//         {formData.fipMake === 'Other' && (
//           <View style={styles.inputRow}>
//             <View style={styles.fullWidthInputContainer}>
//               <LinearGradient
//                 colors={['#7E5EA9', '#20AEBC']}
//                 style={styles.inputGradient}>
//                 <TextInput
//                   style={styles.textInput}
//                   value={formData.fipMakeOther}
//                   onChangeText={text => handleInputChange('fipMakeOther', text)}
//                   placeholder="Enter Other FIP Make"
//                   placeholderTextColor="#666"
//                   editable={!loading}
//                 />
//               </LinearGradient>
//             </View>
//           </View>
//         )}

//         {/* Battery Make with Other option */}
//         <View style={styles.inputRow}>
//           <View style={styles.inputContainer}>
//             <LinearGradient
//               colors={['#7E5EA9', '#20AEBC']}
//               style={styles.inputGradient}>
//               <TouchableOpacity
//                 style={styles.dropdownInput}
//                 onPress={() => setShowBatteryMakeDropdown(true)}
//                 disabled={loading}>
//                 <Text
//                   style={
//                     formData.batteryMake
//                       ? styles.selectedText
//                       : styles.placeholderText
//                   }>
//                   {formData.batteryMake || 'Select Battery Make'}
//                 </Text>
//                 <Icon name="keyboard-arrow-down" size={24} color="#666" />
//               </TouchableOpacity>
//             </LinearGradient>
//           </View>
//         </View>

//         {/* Battery Make Other */}
//         {formData.batteryMake === 'Other' && (
//           <View style={styles.inputRow}>
//             <View style={styles.fullWidthInputContainer}>
//               <LinearGradient
//                 colors={['#7E5EA9', '#20AEBC']}
//                 style={styles.inputGradient}>
//                 <TextInput
//                   style={styles.textInput}
//                   value={formData.batteryMakeOther}
//                   onChangeText={text =>
//                     handleInputChange('batteryMakeOther', text)
//                   }
//                   placeholder="Enter Other Battery Make"
//                   placeholderTextColor="#666"
//                   editable={!loading}
//                 />
//               </LinearGradient>
//             </View>
//           </View>
//         )}

//         {/* Exchange Tractor Section */}
//         <View style={styles.exchangeSection}>
//           <Text style={styles.sectionHeading}>Exchange Tractor Details</Text>

//           {/* Is Exchange Tractor */}
//           <View style={styles.radioSection}>
//             <Text style={styles.radioLabel}>Is Exchange Tractor?</Text>
//             <View style={styles.radioOptions}>
//               {exchangeOptions.map(option => (
//                 <TouchableOpacity
//                   key={option}
//                   style={styles.radioOption}
//                   onPress={() => handleExchangeTractorSelect(option)}
//                   disabled={loading}>
//                   <LinearGradient
//                     colors={
//                       formData.isExchangeTractor === option
//                         ? ['#12C857', '#12C857']
//                         : ['#f0f0f0', '#f0f0f0']
//                     }
//                     style={styles.radioGradient}>
//                     <View style={styles.radioInner}>
//                       {formData.isExchangeTractor === option && (
//                         <Icon name="check" size={24} color="#fff" />
//                       )}
//                     </View>
//                   </LinearGradient>
//                   <Text style={styles.radioText}>
//                     {option === 'yes' ? 'Yes' : 'No'}
//                   </Text>
//                 </TouchableOpacity>
//               ))}
//             </View>
//           </View>

//           {/* Exchange Tractor Fields - Conditionally Rendered */}
//           {formData.isExchangeTractor === 'yes' && (
//             <>
//               {/* Old Tractor Name */}
//               <View style={styles.inputRow}>
//                 <View style={styles.fullWidthInputContainer}>
//                   <LinearGradient
//                     colors={['#7E5EA9', '#20AEBC']}
//                     style={styles.inputGradient}>
//                     <TextInput
//                       style={styles.textInput}
//                       value={formData.oldTractorName}
//                       onChangeText={text =>
//                         handleInputChange('oldTractorName', text)
//                       }
//                       placeholder="Old Tractor Name"
//                       placeholderTextColor="#666"
//                       editable={!loading}
//                     />
//                   </LinearGradient>
//                 </View>
//               </View>

//               {/* Old Tractor Chassis No */}
//               <View style={styles.inputRow}>
//                 <View style={styles.fullWidthInputContainer}>
//                   <LinearGradient
//                     colors={['#7E5EA9', '#20AEBC']}
//                     style={styles.inputGradient}>
//                     <TextInput
//                       style={styles.textInput}
//                       value={formData.oldTractorChassisNo}
//                       onChangeText={text =>
//                         handleInputChange('oldTractorChassisNo', text)
//                       }
//                       placeholder="Old Tractor Chassis No"
//                       placeholderTextColor="#666"
//                       editable={!loading}
//                     />
//                   </LinearGradient>
//                 </View>
//               </View>

//               {/* Old Tractor Year of Manufacture */}
//               <View style={styles.inputRow}>
//                 <View style={styles.fullWidthInputContainer}>
//                   <LinearGradient
//                     colors={['#7E5EA9', '#20AEBC']}
//                     style={styles.inputGradient}>
//                     <TextInput
//                       style={styles.textInput}
//                       value={formData.oldTractorYearOfManufacture}
//                       onChangeText={text =>
//                         handleInputChange('oldTractorYearOfManufacture', text)
//                       }
//                       placeholder="Old Tractor Year of Manufacture"
//                       placeholderTextColor="#666"
//                       editable={!loading}
//                     />
//                   </LinearGradient>
//                 </View>
//               </View>

//               {/* Exchange Deal Amount */}
//               <View style={styles.inputRow}>
//                 <View style={styles.fullWidthInputContainer}>
//                   <LinearGradient
//                     colors={['#7E5EA9', '#20AEBC']}
//                     style={styles.inputGradient}>
//                     <TextInput
//                       style={styles.textInput}
//                       value={formData.exchangeDealAmount}
//                       onChangeText={text =>
//                         handleInputChange('exchangeDealAmount', text)
//                       }
//                       placeholder="Exchange Deal Amount"
//                       placeholderTextColor="#666"
//                       keyboardType="numeric"
//                       editable={!loading}
//                     />
//                   </LinearGradient>
//                 </View>
//               </View>

//               {/* Old Tractor Remark */}
//               <View style={styles.inputRow}>
//                 <View style={styles.fullWidthInputContainer}>
//                   <LinearGradient
//                     colors={['#7E5EA9', '#20AEBC']}
//                     style={styles.inputGradient}>
//                     <TextInput
//                       style={styles.textInput}
//                       value={formData.oldTractorRemark}
//                       onChangeText={text =>
//                         handleInputChange('oldTractorRemark', text)
//                       }
//                       placeholder="Old Tractor Remark"
//                       placeholderTextColor="#666"
//                       multiline
//                       numberOfLines={2}
//                       editable={!loading}
//                     />
//                   </LinearGradient>
//                 </View>
//               </View>
//             </>
//           )}
//         </View>

//         {/* Payment Details Heading */}
//         <Text style={styles.sectionHeading}>Payment Details</Text>

//         {/* Deal Price */}
//         <View style={styles.inputRow}>
//           <View style={styles.inputContainer}>
//             <LinearGradient
//               colors={['#7E5EA9', '#20AEBC']}
//               style={styles.inputGradient}>
//               <TextInput
//                 style={styles.textInput}
//                 value={formData.dealPrice}
//                 onChangeText={text => handleInputChange('dealPrice', text)}
//                 placeholder="Deal Price"
//                 placeholderTextColor="#666"
//                 keyboardType="numeric"
//                 editable={!loading}
//               />
//             </LinearGradient>
//           </View>
//         </View>

//         {/* Amount Paid & Finance Amount Paid */}
//         <View style={styles.inputRow}>
//           <View style={styles.inputContainer}>
//             <LinearGradient
//               colors={['#7E5EA9', '#20AEBC']}
//               style={styles.inputGradient}>
//               <TextInput
//                 style={styles.textInput}
//                 value={formData.amountPaid}
//                 onChangeText={text => handleInputChange('amountPaid', text)}
//                 placeholder="Amount Paid"
//                 placeholderTextColor="#666"
//                 keyboardType="numeric"
//                 editable={!loading}
//               />
//             </LinearGradient>
//           </View>

//           <View style={styles.inputContainer}>
//             <View style={{marginBottom: 15}} />
//             <LinearGradient
//               colors={['#7E5EA9', '#20AEBC']}
//               style={styles.inputGradient}>
//               <TextInput
//                 style={styles.textInput}
//                 value={formData.financeAmountPaid}
//                 onChangeText={text =>
//                   handleInputChange('financeAmountPaid', text)
//                 }
//                 placeholder="Finance Amount Paid"
//                 placeholderTextColor="#666"
//                 keyboardType="numeric"
//                 editable={!loading}
//               />
//             </LinearGradient>
//           </View>
//         </View>

//         {/* Total Paid & Balance Amount */}
//         <View style={styles.inputRow}>
//           <View style={styles.inputContainer}>
//             <Text style={{color: '#666', fontFamily: 'Inter_28pt-SemiBold'}}>
//               Total Amount Paid
//             </Text>
//             <LinearGradient
//               colors={['#7E5EA9', '#20AEBC']}
//               style={styles.inputGradient}>
//               <TextInput
//                 style={styles.textInput}
//                 value={formData.totalPaid}
//                 onChangeText={text => handleInputChange('totalPaid', text)}
//                 placeholder="Total Paid"
//                 placeholderTextColor="#666"
//                 keyboardType="numeric"
//                 editable={!loading}
//               />
//             </LinearGradient>
//           </View>
//           <View style={{marginBottom: 15}} />
//           <View style={styles.inputContainer}>
//             <Text style={{color: '#666', fontFamily: 'Inter_28pt-SemiBold'}}>
//               Total Balance Amount
//             </Text>
//             <LinearGradient
//               colors={['#7E5EA9', '#20AEBC']}
//               style={styles.inputGradient}>
//               <TextInput
//                 style={styles.textInput}
//                 value={formData.balanceAmount}
//                 onChangeText={text => handleInputChange('balanceAmount', text)}
//                 placeholder="Balance Amount"
//                 placeholderTextColor="#666"
//                 keyboardType="numeric"
//                 editable={!loading}
//               />
//             </LinearGradient>
//           </View>
//         </View>

//         {/* Payment Status */}
//         <View style={styles.inputRow}>
//           <View style={styles.inputContainer}>
//             <LinearGradient
//               colors={['#7E5EA9', '#20AEBC']}
//               style={styles.inputGradient}>
//               <TouchableOpacity
//                 style={styles.dropdownInput}
//                 onPress={() => setShowPaymentStatusDropdown(true)}
//                 disabled={loading}>
//                 <Text
//                   style={
//                     formData.paymentStatus
//                       ? styles.selectedText
//                       : styles.placeholderText
//                   }>
//                   {formData.paymentStatus || 'Select Payment Status'}
//                 </Text>
//                 <Icon name="keyboard-arrow-down" size={24} color="#666" />
//               </TouchableOpacity>
//             </LinearGradient>
//           </View>
//         </View>

//         {/* Financier Name */}
//         <View style={styles.inputRow}>
//           <View style={styles.inputContainer}>
//             <LinearGradient
//               colors={['#7E5EA9', '#20AEBC']}
//               style={styles.inputGradient}>
//               <TouchableOpacity
//                 style={styles.dropdownInput}
//                 onPress={() => setShowFinancerDropdown(true)}
//                 disabled={loading}>
//                 <Text
//                   style={
//                     formData.financierName
//                       ? styles.selectedText
//                       : styles.placeholderText
//                   }>
//                   {formData.financierName || 'Hypothecation'}
//                 </Text>
//                 <Icon name="keyboard-arrow-down" size={24} color="#666" />
//               </TouchableOpacity>
//             </LinearGradient>
//           </View>
//         </View>

//         {/* Accessories Heading */}
//         <View style={styles.accessoriesHeader}>
//           <Text style={styles.sectionHeading}>
//             Accessories Given With Tractor
//           </Text>
//         </View>

//         {/* Accessories Grid */}
//         <View style={styles.accessoriesGrid}>
//           {Object.keys(accessories).map((accessory, index) => (
//             <TouchableOpacity
//               key={accessory}
//               style={styles.accessoryItem}
//               onPress={() => handleAccessoryToggle(accessory)}
//               disabled={loading}>
//               <LinearGradient
//                 colors={
//                   accessories[accessory]
//                     ? ['#12C857', '#12C857']
//                     : ['#f0f0f0', '#f0f0f0']
//                 }
//                 style={styles.accessoryCheckbox}>
//                 <View style={styles.accessoryCheckboxInner}>
//                   {accessories[accessory] && (
//                     <Icon name="check" size={22} color="#fff" />
//                   )}
//                 </View>
//               </LinearGradient>
//               <Text style={styles.accessoryText}>
//                 {accessory
//                   .replace(/([A-Z])/g, ' $1')
//                   .replace(/^./, str => str.toUpperCase())}{' '}
//                 Issued
//               </Text>
//             </TouchableOpacity>
//           ))}
//         </View>

//         {/* Terms and Conditions - Conditionally Rendered */}
//         {(formData.deliveryMode !== 'Branch' ||
//           (formData.deliveryMode === 'Branch' &&
//             tractorDelivered === 'yes')) && (
//           <View style={styles.termsSection}>
//             <Text style={styles.termsHeading}>Terms and Conditions</Text>

//             <Text style={styles.termItem}>
//               <Text style={{fontSize: 14, fontFamily: 'Inter_28pt-SemiBold'}}>
//                 Delivery Condition :
//               </Text>{' '}
//               The Tractor Has Been Delivered To The Customer In Good Physical
//               Condition And Fully Operational Working Condition. The Customer
//               Has Inspected The Vehicle At The Time Of Delivery And Accepts Its
//               Condition As Satisfactory.
//             </Text>

//             <Text style={styles.termItem}>
//               <Text style={{fontSize: 14, fontFamily: 'Inter_28pt-SemiBold'}}>
//                 Ownership And Registration :
//               </Text>{' '}
//               The Ownership Of The Tractor Shall Be Transferred To The Customer
//               Upon Full Payment And Successful Registration With The Relevant
//               Motor Vehicle Authority. The Dealer Will Assist With Documentation
//               If Required.
//             </Text>

//             <Text style={styles.termItem}>
//               <Text style={{fontSize: 14, fontFamily: 'Inter_28pt-SemiBold'}}>
//                 Warranty And Service :
//               </Text>{' '}
//               The Tractor Is Covered Under The Manufacturer's Standard Warranty
//               Policy. All Services And Repairs During The Warranty Period Must
//               Be Carried Out At Authorized Service Centers Only.
//             </Text>

//             <Text style={styles.termItem}>
//               <Text style={{fontSize: 14, fontFamily: 'Inter_28pt-SemiBold'}}>
//                 Liability :
//               </Text>{' '}
//               The Dealer Shall Not Be Held Liable For Any Damage Or Malfunction
//               Arising Form Misuse, Unauthorized Modifications, Or Failure To
//               Adhere To The Maintenance Schedule After Delivery.
//             </Text>

//             <Text style={styles.termItem}>
//               <Text style={{fontSize: 14, fontFamily: 'Inter_28pt-SemiBold'}}>
//                 Payment Terms :
//               </Text>{' '}
//               Full Payment Has Been Made Prior To Or At The Time Of Delivery
//               Unless Otherwise Agreed In Writing. Any Outstanding Amounts Must
//               Be Cleared As Per The Mutually Agreed Timeline.
//             </Text>

//             <Text style={styles.termItem}>
//               <Text style={{fontSize: 14, fontFamily: 'Inter_28pt-SemiBold'}}>
//                 Dispute Resolution :
//               </Text>{' '}
//               In Case Of Any Disputes Arising From This Delivery, The Matter
//               Shall Be Resolved Amicably Between Both Parties. If Unresolved, It
//               Will Be Subject To The Jurisdiction Of The Dealer's Location.
//             </Text>

//             <Text style={styles.termItem}>
//               <Text style={{fontSize: 14, fontFamily: 'Inter_28pt-SemiBold'}}>
//                 Acknowledgement :
//               </Text>{' '}
//               The Customer Acknowledges And Agrees To The Above Terms And
//               Confirms That The Tractor Was Received In A Good And Working
//               Condition.
//             </Text>

//             {/* Accept Terms Checkbox */}
//             <TouchableOpacity
//               style={styles.termsCheckbox}
//               onPress={() => setAcceptTerms(!acceptTerms)}
//               activeOpacity={0.8}
//               disabled={loading}>
//               <LinearGradient
//                 colors={['grey', 'grey']}
//                 style={styles.checkboxGradient}>
//                 <View
//                   style={[
//                     styles.checkboxInner,
//                     acceptTerms && styles.checkboxInnerSelected,
//                   ]}>
//                   {acceptTerms && <Icon name="check" size={16} color="#fff" />}
//                 </View>
//               </LinearGradient>
//               <Text style={styles.termsCheckboxText}>
//                 Accept All Terms And Conditions
//               </Text>
//             </TouchableOpacity>
//           </View>
//         )}

//         {/* Signatures Section - Conditionally Rendered */}
//         {(formData.deliveryMode !== 'Branch' ||
//           (formData.deliveryMode === 'Branch' &&
//             tractorDelivered === 'yes')) && (
//           <View style={styles.signatureSection}>
//             <View style={styles.signatureRow}>
//               <TouchableOpacity
//                 style={styles.signatureBox}
//                 onPress={() => showImagePickerOptions(setCustomerSignature)}
//                 disabled={loading}>
//                 {customerSignature ? (
//                   <Image
//                     source={{uri: customerSignature.uri}}
//                     style={styles.previewImage}
//                     resizeMode="contain"
//                   />
//                 ) : (
//                   <Text style={styles.signatureText}>Customer Signature</Text>
//                 )}
//               </TouchableOpacity>

//               <TouchableOpacity
//                 style={styles.signatureBox}
//                 onPress={() => showImagePickerOptions(setManagerSignature)}
//                 disabled={loading}>
//                 {managerSignature ? (
//                   <Image
//                     source={{uri: managerSignature.uri}}
//                     style={styles.previewImage}
//                     resizeMode="contain"
//                   />
//                 ) : (
//                   <Text style={styles.signatureText}>Manager Signature</Text>
//                 )}
//               </TouchableOpacity>

//               <TouchableOpacity
//                 style={styles.signatureBox}
//                 onPress={() => showImagePickerOptions(setDriverSignature)}
//                 disabled={loading}>
//                 {driverSignature ? (
//                   <Image
//                     source={{uri: driverSignature.uri}}
//                     style={styles.previewImage}
//                     resizeMode="contain"
//                   />
//                 ) : (
//                   <Text style={styles.signatureText}>Driver Signature</Text>
//                 )}
//               </TouchableOpacity>
//             </View>
//           </View>
//         )}

//         {/* Buttons */}
//         <View style={styles.buttonsContainer}>
//           <TouchableOpacity
//             style={[
//               styles.submitButton,
//               (loading || !acceptTerms) && styles.disabledButton,
//             ]}
//             onPress={handleSubmit}
//             disabled={loading || !acceptTerms}>
//             {loading ? (
//               <ActivityIndicator color="#fff" size="small" />
//             ) : (
//               <Text style={styles.buttonText}>
//                 {isEditMode
//                   ? 'Update Delivery Challan'
//                   : 'Submit Delivery Challan'}
//               </Text>
//             )}
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={[styles.homeButton, loading && styles.disabledButton]}
//             onPress={handleHome}
//             disabled={loading}>
//             <Text style={styles.buttonText}>Home</Text>
//           </TouchableOpacity>
//         </View>

//         {/* QR Scanner Modal */}
//         {renderQRScanner()}

//         {/* Dropdown Modals */}
//         <Modal
//           visible={
//             showTractorModelDropdown ||
//             showTiresMakeDropdown ||
//             showFipMakeDropdown ||
//             showBatteryMakeDropdown ||
//             showPaymentStatusDropdown ||
//             showFinancerDropdown ||
//             showHypothecationDropdown ||
//             showRelationDropdown ||
//             showExchangeTractorDropdown
//           }
//           transparent={true}
//           animationType="slide"
//           onRequestClose={() => {
//             setShowTractorModelDropdown(false);
//             setShowTiresMakeDropdown(false);
//             setShowFipMakeDropdown(false);
//             setShowBatteryMakeDropdown(false);
//             setShowPaymentStatusDropdown(false);
//             setShowFinancerDropdown(false);
//             setShowHypothecationDropdown(false);
//             setShowRelationDropdown(false);
//             setShowExchangeTractorDropdown(false);
//           }}>
//           <View style={styles.modalOverlay}>
//             <View style={styles.modalContent}>
//               <View style={styles.modalHeader}>
//                 <Text style={styles.modalTitle}>
//                   {showTractorModelDropdown && 'Select Tractor Model'}
//                   {showTiresMakeDropdown && 'Select Tires Make'}
//                   {showFipMakeDropdown && 'Select FIP Make'}
//                   {showBatteryMakeDropdown && 'Select Battery Make'}
//                   {showPaymentStatusDropdown && 'Select Payment Status'}
//                   {showFinancerDropdown && 'Select Hypothecation'}
//                   {showHypothecationDropdown && 'Select Hypothecation'}
//                   {showRelationDropdown && 'Select Relation'}
//                   {showExchangeTractorDropdown && 'Select Exchange Option'}
//                 </Text>
//                 <TouchableOpacity
//                   onPress={() => {
//                     setShowTractorModelDropdown(false);
//                     setShowTiresMakeDropdown(false);
//                     setShowFipMakeDropdown(false);
//                     setShowBatteryMakeDropdown(false);
//                     setShowPaymentStatusDropdown(false);
//                     setShowFinancerDropdown(false);
//                     setShowHypothecationDropdown(false);
//                     setShowRelationDropdown(false);
//                     setShowExchangeTractorDropdown(false);
//                   }}
//                   style={styles.closeButton}>
//                   <Icon name="close" size={24} color="#000" />
//                 </TouchableOpacity>
//               </View>
//               <FlatList
//                 data={
//                   showTractorModelDropdown
//                     ? tractorModels
//                     : showTiresMakeDropdown
//                     ? tiresMakes
//                     : showFipMakeDropdown
//                     ? fipMakes
//                     : showBatteryMakeDropdown
//                     ? batteryMakes
//                     : showPaymentStatusDropdown
//                     ? paymentStatuses
//                     : showFinancerDropdown
//                     ? hypothecationOptions
//                     : showHypothecationDropdown
//                     ? hypothecationOptions
//                     : showRelationDropdown
//                     ? relationOptions
//                     : showExchangeTractorDropdown
//                     ? exchangeOptions
//                     : []
//                 }
//                 renderItem={renderDropdownItem}
//                 keyExtractor={(item, index) => index.toString()}
//                 style={styles.dropdownList}
//               />
//             </View>
//           </View>
//         </Modal>
//       </ScrollView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   header: {
//     paddingVertical: 12,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   headerTitle: {
//     fontSize: 20,
//     color: 'white',
//     fontFamily: 'Inter_28pt-SemiBold',
//   },
//   editModeText: {
//     fontSize: 12,
//     color: '#f0e6ff',
//     fontFamily: 'Inter_28pt-SemiBold',
//     marginTop: 5,
//   },
//   scrollView: {
//     flex: 1,
//     padding: 15,
//   },
//   formNoContainer: {
//     marginBottom: 15,
//   },
//   formNoInputContainer: {
//     width: '100%',
//   },
//   inputGradient: {
//     borderRadius: 8,
//     padding: 1.2,
//     position: 'relative',
//   },
//   textInput: {
//     backgroundColor: '#fff',
//     padding: 15,
//     borderRadius: 8,
//     fontSize: 14,
//     color: '#000',
//   },
//   iconButton: {
//     padding: 4,
//     marginRight: 8,
//   },
//   deliveryModeContainer: {
//     marginBottom: 10,
//   },
//   sectionLabel: {
//     fontSize: 17,
//     marginBottom: 10,
//     color: '#000',
//     fontFamily: 'Inter_28pt-SemiBold',
//     marginTop: 15,
//   },
//   deliveryModeButtons: {
//     flexDirection: 'row',
//   },
//   deliveryModeButton: {
//     marginHorizontal: 5,
//     borderRadius: 8,
//   },
//   deliveryModeGradient: {
//     padding: 1,
//     borderRadius: 8,
//   },
//   deliveryModeText: {
//     paddingHorizontal: 15,
//     paddingVertical: 10,
//     textAlign: 'center',
//     backgroundColor: '#fff',
//     color: '#000',
//     borderRadius: 8,
//     fontSize: 14,
//   },
//   deliveryModeTextSelected: {
//     color: '#fff',
//     backgroundColor: 'transparent',
//   },
//   sectionHeading: {
//     fontSize: 17,
//     fontFamily: 'Inter_28pt-SemiBold',
//     color: '#000',
//     marginBottom: 10,
//     marginTop: 10,
//   },
//   inputRow: {
//     marginVertical: 10,
//   },
//   inputContainer: {
//     flex: 1,
//   },
//   fullWidthInputContainer: {
//     width: '100%',
//     marginBottom: 1,
//   },
//   dropdownInput: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     backgroundColor: '#fff',
//     padding: 12,
//     borderRadius: 8,
//   },
//   selectedText: {
//     fontSize: 14,
//     color: '#000',
//   },
//   placeholderText: {
//     fontSize: 14,
//     color: '#666',
//   },
//   inputWithIcon: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//     borderRadius: 8,
//   },
//   radioSection: {
//     marginBottom: 20,
//   },
//   radioLabel: {
//     fontSize: 17,
//     marginBottom: 15,
//     color: '#000',
//     fontWeight: '500',
//     marginTop: 10,
//   },
//   radioOptions: {
//     flexDirection: 'row',
//   },
//   radioOption: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginRight: 20,
//   },
//   radioGradient: {
//     width: 25,
//     height: 25,
//     borderRadius: 3,
//     marginRight: 10,
//   },
//   radioInner: {
//     width: 25,
//     height: 25,
//     borderRadius: 1,
//     backgroundColor: 'transparent',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   radioText: {
//     fontSize: 17,
//     color: '#000',
//     fontFamily: 'Inter_28pt-Regular',
//   },
//   accessoriesHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 5,
//   },
//   accessoriesGrid: {
//     marginBottom: 0,
//   },
//   accessoryItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     width: '70%',
//     marginBottom: 25,
//   },
//   accessoryCheckbox: {
//     width: 25,
//     height: 25,
//     borderRadius: 4,
//     padding: 0,
//     marginRight: 8,
//   },
//   accessoryCheckboxInner: {
//     width: 25,
//     height: 25,
//     borderRadius: 3,
//     backgroundColor: 'transparent',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   accessoryText: {
//     fontSize: 14.5,
//     color: '#000',
//     flex: 1,
//     fontFamily: 'Inter_28pt-Regular',
//   },
//   buttonsContainer: {
//     marginTop: 20,
//     marginBottom: 30,
//   },
//   submitButton: {
//     backgroundColor: '#7E5EA9',
//     padding: 15,
//     borderRadius: 8,
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   homeButton: {
//     backgroundColor: '#20AEBC',
//     padding: 15,
//     borderRadius: 8,
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontFamily: 'Inter_28pt-SemiBold',
//   },
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
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   modalContent: {
//     backgroundColor: 'white',
//     borderRadius: 10,
//     width: '90%',
//     maxHeight: '80%',
//   },
//   modalHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: '#f0f0f0',
//   },
//   modalTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#000',
//   },
//   closeButton: {
//     padding: 4,
//   },
//   dropdownList: {
//     maxHeight: 300,
//   },
//   dropdownItem: {
//     padding: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: '#f0f0f0',
//   },
//   dropdownItemText: {
//     fontSize: 14,
//     color: '#333',
//   },
//   termsSection: {
//     marginBottom: 20,
//     borderRadius: 10,
//     marginTop: 10,
//   },
//   termsHeading: {
//     fontSize: 16,
//     fontFamily: 'Inter_28pt-SemiBold',
//     marginBottom: 10,
//     color: '#000',
//   },
//   termItem: {
//     fontSize: 12,
//     color: '#333',
//     marginBottom: 10,
//     lineHeight: 16,
//     fontFamily: 'Inter_28pt-Medium',
//   },
//   termsCheckbox: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 10,
//     backgroundColor: '#fff',
//     borderRadius: 8,
//   },
//   checkboxGradient: {borderRadius: 4, padding: 1, marginRight: 10},
//   checkboxInner: {
//     width: 20,
//     height: 20,
//     borderRadius: 3,
//     backgroundColor: '#fff',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   checkboxInnerSelected: {backgroundColor: '#12C857'},
//   termsCheckboxText: {
//     fontSize: 14,
//     color: '#000',
//   },
//   signatureSection: {
//     marginBottom: 20,
//   },
//   signatureRow: {
//     marginTop: 20,
//   },
//   signatureBox: {
//     flex: 1,
//     height: 55,
//     borderWidth: 1,
//     borderColor: '#00000080',
//     borderRadius: 10,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginHorizontal: 5,
//     borderStyle: 'dashed',
//     marginBottom: 10,
//   },
//   signatureText: {
//     fontSize: 12,
//     color: '#00000099',
//     textAlign: 'center',
//   },
//   previewImage: {
//     width: '100%',
//     height: '100%',
//     borderRadius: 10,
//   },
//   disabledButton: {
//     opacity: 0.6,
//   },
//   branchSection: {
//     marginBottom: 15,
//   },
//   tractorDeliveredSection: {
//     marginBottom: 15,
//   },
//   representativeSection: {
//     marginBottom: 15,
//   },
//   exchangeSection: {
//     marginBottom: 15,
//   },
//   loadingIndicator: {
//     position: 'absolute',
//     right: 10,
//     top: '50%',
//     marginTop: -8,
//   },
// });

// export default DeliveryChallan;






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
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Camera} from 'react-native-camera-kit';

const DeliveryChallan = ({navigation, route}) => {
  const insets = useSafeAreaInsets();

  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [existingFormId, setExistingFormId] = useState(null);
  const [acceptTerms, setAcceptTerms] = useState(false);

  // QR Scanner States
  const [showChassisScanner, setShowChassisScanner] = useState(false);
  const [showEngineScanner, setShowEngineScanner] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState(false);

  // OTP Verification States
  const [showCustomerOtpModal, setShowCustomerOtpModal] = useState(false);
  const [showManagerOtpModal, setShowManagerOtpModal] = useState(false);
  const [customerOtp, setCustomerOtp] = useState('');
  const [managerOtp, setManagerOtp] = useState('');
  const [customerOtpVerified, setCustomerOtpVerified] = useState(false);
  const [managerOtpVerified, setManagerOtpVerified] = useState(false);
  const [sendingCustomerOtp, setSendingCustomerOtp] = useState(false);
  const [sendingManagerOtp, setSendingManagerOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [customerPhoneForOtp, setCustomerPhoneForOtp] = useState('');
  const [otpResendTimer, setOtpResendTimer] = useState(0);
  const [currentOtpType, setCurrentOtpType] = useState(''); // 'customer' or 'manager'

  // Dropdown visibility states
  const [showTractorModelDropdown, setShowTractorModelDropdown] =
    useState(false);
  const [showTiresMakeDropdown, setShowTiresMakeDropdown] = useState(false);
  const [showFipMakeDropdown, setShowFipMakeDropdown] = useState(false);
  const [showBatteryMakeDropdown, setShowBatteryMakeDropdown] = useState(false);
  const [showPaymentStatusDropdown, setShowPaymentStatusDropdown] =
    useState(false);
  const [showFinancerDropdown, setShowFinancerDropdown] = useState(false);
  const [showHypothecationDropdown, setShowHypothecationDropdown] =
    useState(false);
  const [showRelationDropdown, setShowRelationDropdown] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showManufactureDatePicker, setShowManufactureDatePicker] =
    useState(false);

  // New states for exchange tractor
  const [showExchangeTractorDropdown, setShowExchangeTractorDropdown] =
    useState(false);

  // New state for tractor delivered option in Branch mode
  const [tractorDelivered, setTractorDelivered] = useState('');

  // API fetched data
  const [tractorModels, setTractorModels] = useState([]);
  const [loadingModels, setLoadingModels] = useState(false);

  const [formData, setFormData] = useState({
    formNo: '',
    date: null,
    deliveryMode: 'Self Pickup', // Changed default to match API
    challanCreatedBy: '',
    customerName: '',
    parentage: '',
    address: '',
    hypothecation: '',
    hypothecationOther: '',
    mobileNo: '',
    isCustomer: '', // Changed from areYouCustomer to match API
    tractorName: '',
    tractorModel: '',
    chassisNo: '',
    engineNo: '',
    yearOfManufacture: '',
    tyresMake: '', // Changed from tiresMake to match API
    tyresMakeOther: '', // Changed from tiresMakeOther to match API
    fipMake: '',
    fipMakeOther: '',
    batteryMake: '',
    batteryMakeOther: '',
    dealPrice: '',
    amountPaid: '', // Changed from cashPaid to match API
    financeAmountPaid: '',
    totalPaid: '',
    balanceAmount: '',
    paymentStatus: '',
    financierName: '', // Changed from financerName to match API
    // Branch fields
    branchName: '',
    branchPersonName: '',
    branchAddress: '',
    branchPhone: '', // Changed from branchMobileNumber to match API
    // Representative fields
    relativeName: '', // Changed from representativeName to match API
    relativeFatherName: '', // Changed from representativeFatherName to match API
    relativeAddress: '', // Changed from representativeAddress to match API
    relativePhone: '', // Changed from representativeMobileNumber to match API
    relativeRelation: '', // Changed from representativeRelation to match API
    relationOther: '', // Changed from representativeRelationOther to match API
    // Exchange Tractor fields
    isExchangeTractor: '',
    oldTractorName: '',
    oldTractorChassisNo: '',
    oldTractorYearOfManufacture: '',
    exchangeDealAmount: '',
    oldTractorRemark: '',
  });

  // Image states for signatures
  const [customerSignature, setCustomerSignature] = useState(null);
  const [managerSignature, setManagerSignature] = useState(null);
  const [driverSignature, setDriverSignature] = useState(null);

  const [accessories, setAccessories] = useState({
    bumper: false,
    cultivator: false,
    leveler: false,
    rallyFenderSeats: false,
    weightsRear: false,
    waterTanker: false,
    trolly: false,
    weightFront: false,
    rearTowingHook: false,
    hood: false,
    ptoPully: false,
    drawbar: false,
    cageWheels: false,
    tool: false,
    toplink: false,
  });

  // Static data for dropdowns
  const tiresMakes = [
    'MRF',
    'CEAT',
    'Apollo',
    'BKT',
    'Goodyear',
    'Bridgestone',
    'Other',
  ];
  const fipMakes = [
    'Bosch',
    'Delphi',
    'Denso',
    'Siemens',
    'Stanadyne',
    'Other',
  ];
  const batteryMakes = [
    'Exide',
    'Amaron',
    'Luminous',
    'Su-Kam',
    'Hankook',
    'Other',
  ];
  const paymentStatuses = ['Paid', 'Pending'];
  const hypothecationOptions = [
    'John Deere Financial India Private Limited',
    'The Jammu and Kashmir Bank Limited',
    'Nil',
    'Other',
  ];
  const relationOptions = [
    'Father',
    'Mother',
    'Friend',
    'Spouse',
    'Brother',
    'Sister',
    'Son',
    'Other',
  ];
  const exchangeOptions = ['yes', 'no'];
  const tractorDeliveredOptions = ['yes', 'no'];

  // OTP Timer Effect
  useEffect(() => {
    let timer;
    if (otpResendTimer > 0) {
      timer = setTimeout(() => setOtpResendTimer(otpResendTimer - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [otpResendTimer]);

  // Fetch tractor models from API
  const fetchTractorModels = async () => {
    try {
      setLoadingModels(true);
      const response = await axios.get(
        'https://argosmob.uk/makroo/public/api/v1/model/tractor-models',
      );
      console.log('API Response for tractor models:', response.data);

      if (
        response.data &&
        response.data.status === true &&
        response.data.data
      ) {
        // Extract tractor_model from each item in the array
        const models = response.data.data.map(item => item.tractor_model);
        setTractorModels(models);
        console.log('Tractor models extracted:', models);
      } else {
        console.log('No tractor models found in response');
        // Set default models if API fails
        setTractorModels([
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
        ]);
      }
    } catch (error) {
      console.log('Error fetching tractor models:', error);
      // Set default models on error
      setTractorModels([
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
      ]);
    } finally {
      setLoadingModels(false);
    }
  };

  // OTP Functions
  const sendCustomerOtp = async () => {
    if (!formData.mobileNo || formData.mobileNo.trim() === '') {
      Alert.alert('Error', 'Please enter customer mobile number first');
      return;
    }

    if (!userId) {
      Alert.alert('Error', 'User ID not found. Please login again.');
      return;
    }

    setSendingCustomerOtp(true);
    try {
      const response = await axios.post(
        'https://argosmob.uk/makroo/public/api/v1/otp/send/customer',
        {
          user_id: parseInt(userId),
          phone: formData.mobileNo,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        },
      );

      console.log('Customer OTP Send Response:', response.data);

      if (response.data && response.data.status === true) {
        setCustomerPhoneForOtp(formData.mobileNo);
        setCurrentOtpType('customer');
        setShowCustomerOtpModal(true);
        setOtpResendTimer(60); // 60 seconds timer
        Alert.alert(
          'Success',
          'OTP sent successfully to customer phone number',
        );
      } else {
        Alert.alert('Failed', response.data.message || 'Failed to send OTP');
      }
    } catch (error) {
      console.log('Customer OTP Send Error:', error);
      Alert.alert('Error', 'Failed to send OTP. Please try again.');
    } finally {
      setSendingCustomerOtp(false);
    }
  };

  const verifyCustomerOtp = async () => {
    if (!customerOtp || customerOtp.length !== 6) {
      Alert.alert('Error', 'Please enter a valid 6-digit OTP');
      return;
    }

    setVerifyingOtp(true);
    try {
      const response = await axios.post(
        'https://argosmob.uk/makroo/public/api/v1/otp/verify/customer',
        {
          user_id: parseInt(userId),
          phone: customerPhoneForOtp,
          otp: customerOtp,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        },
      );

      console.log('Customer OTP Verify Response:', response.data);

      if (response.data && response.data.status === true) {
        setCustomerOtpVerified(true);
        setShowCustomerOtpModal(false);
        setCustomerOtp('');
        // Now allow customer signature upload
        showImagePickerOptions(setCustomerSignature);
        Alert.alert('Success', 'OTP verified successfully');
      } else {
        Alert.alert('Failed', response.data.message || 'Invalid OTP');
      }
    } catch (error) {
      console.log('Customer OTP Verify Error:', error);
      Alert.alert('Error', 'Failed to verify OTP. Please try again.');
    } finally {
      setVerifyingOtp(false);
    }
  };

  const sendManagerOtp = async () => {
    if (!userId) {
      Alert.alert('Error', 'User ID not found. Please login again.');
      return;
    }

    setSendingManagerOtp(true);
    try {
      const response = await axios.post(
        'https://argosmob.uk/makroo/public/api/v1/otp/send/admin',
        {
          user_id: parseInt(userId),
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        },
      );

      console.log('Manager OTP Send Response:', response.data);

      if (response.data && response.data.status === true) {
        setCurrentOtpType('manager');
        setShowManagerOtpModal(true);
        setOtpResendTimer(60); // 60 seconds timer
        Alert.alert('Success', 'OTP sent successfully to super admin');
      } else {
        Alert.alert('Failed', response.data.message || 'Failed to send OTP');
      }
    } catch (error) {
      console.log('Manager OTP Send Error:', error);
      Alert.alert('Error', 'Failed to send OTP. Please try again.');
    } finally {
      setSendingManagerOtp(false);
    }
  };

  const verifyManagerOtp = async () => {
    if (!managerOtp || managerOtp.length !== 6) {
      Alert.alert('Error', 'Please enter a valid 6-digit OTP');
      return;
    }

    setVerifyingOtp(true);
    try {
      const response = await axios.post(
        'https://argosmob.uk/makroo/public/api/v1/otp/verify/admin',
        {
          user_id: parseInt(userId),
          otp: managerOtp,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        },
      );

      console.log('Manager OTP Verify Response:', response.data);

      if (response.data && response.data.status === true) {
        setManagerOtpVerified(true);
        setShowManagerOtpModal(false);
        setManagerOtp('');
        // Now allow manager signature upload
        showImagePickerOptions(setManagerSignature);
        Alert.alert('Success', 'OTP verified successfully');
      } else {
        Alert.alert('Failed', response.data.message || 'Invalid OTP');
      }
    } catch (error) {
      console.log('Manager OTP Verify Error:', error);
      Alert.alert('Error', 'Failed to verify OTP. Please try again.');
    } finally {
      setVerifyingOtp(false);
    }
  };

  const resendOtp = () => {
    if (otpResendTimer > 0) {
      Alert.alert(
        'Wait',
        `Please wait ${otpResendTimer} seconds before resending OTP`,
      );
      return;
    }

    if (currentOtpType === 'customer') {
      sendCustomerOtp();
    } else if (currentOtpType === 'manager') {
      sendManagerOtp();
    }
  };

  // Modified image picker functions to include OTP verification
  const handleCustomerSignaturePress = () => {
    if (customerOtpVerified) {
      showImagePickerOptions(setCustomerSignature);
    } else {
      Alert.alert(
        'OTP Verification Required',
        'You need to verify OTP before uploading customer signature.',
        [
          {text: 'Cancel', style: 'cancel'},
          {
            text: 'Send OTP',
            onPress: () => sendCustomerOtp(),
          },
        ],
      );
    }
  };

  const handleManagerSignaturePress = () => {
    if (managerOtpVerified) {
      showImagePickerOptions(setManagerSignature);
    } else {
      Alert.alert(
        'OTP Verification Required',
        'You need to verify OTP from super admin before uploading manager signature.',
        [
          {text: 'Cancel', style: 'cancel'},
          {
            text: 'Send OTP',
            onPress: () => sendManagerOtp(),
          },
        ],
      );
    }
  };

  const handleDriverSignaturePress = () => {
    // No OTP required for driver signature
    showImagePickerOptions(setDriverSignature);
  };

  // Camera Permission Function for QR Scanner
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
  const handleChassisScanPress = async () => {
    const hasPermission = await requestCameraPermission();
    if (hasPermission) {
      setShowChassisScanner(true);
    } else {
      Alert.alert(
        'Permission Denied',
        'Camera permission is required to scan QR codes.',
      );
    }
  };

  const handleEngineScanPress = async () => {
    const hasPermission = await requestCameraPermission();
    if (hasPermission) {
      setShowEngineScanner(true);
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
      handleInputChange('chassisNo', scannedValue);
      setShowChassisScanner(false);
    } else if (showEngineScanner) {
      handleInputChange('engineNo', scannedValue);
      setShowEngineScanner(false);
    }
  };

  const closeScanner = () => {
    setShowChassisScanner(false);
    setShowEngineScanner(false);
  };

  // QR Scanner Component
  const renderQRScanner = () => (
    <Modal
      visible={showChassisScanner || showEngineScanner}
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
            {showChassisScanner ? 'Scan Chassis Number' : 'Scan Engine Number'}
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

  // Get user ID from AsyncStorage on component mount and fetch tractor models
  useEffect(() => {
    const initializeData = async () => {
      try {
        // Fetch user ID
        const storedUserId = await AsyncStorage.getItem('userId');
        if (storedUserId) {
          setUserId(storedUserId);
          console.log('User ID loaded:', storedUserId);
        }

        // Fetch tractor models from API
        await fetchTractorModels();

        // Check if we're in edit mode (receiving existing form data)
        if (route.params?.formData) {
          const editData = route.params.formData;
          setIsEditMode(true);
          setExistingFormId(editData.id);

          // Pre-populate form data with API field names
          setFormData({
            formNo: editData.form_no || '',
            date: editData.select_date ? new Date(editData.select_date) : null,
            deliveryMode: editData.delivery_mode || 'Self Pickup',
            challanCreatedBy: editData.challan_created_by || '',
            customerName: editData.customer_name || '',
            parentage: editData.parentage || '',
            address: editData.address || '',
            hypothecation: editData.hypothecation || '',
            mobileNo: editData.mobile_no || '',
            isCustomer: editData.is_customer?.toString() || '',
            tractorName: editData.tractor_name || '',
            tractorModel: editData.tractor_model || '',
            chassisNo: editData.chassis_no || '',
            engineNo: editData.engine_no || '',
            yearOfManufacture: editData.year_of_manufacture || '',
            tyresMake: editData.tyres_make || '',
            fipMake: editData.fip_make || '',
            batteryMake: editData.battery_make || '',
            dealPrice: editData.deal_price || '',
            amountPaid: editData.amount_paid || '',
            financeAmountPaid: editData.finance_amount_paid || '',
            totalPaid: editData.total_paid || '',
            balanceAmount: editData.balance_amount || '',
            paymentStatus: editData.payment_status || '',
            financierName: editData.financier_name || '',
            hypothecationOther: editData.hypothecation_other || '',
            tyresMakeOther: editData.tire_make_other || '',
            fipMakeOther: editData.fip_make_other || '',
            batteryMakeOther: editData.battery_make_other || '',
            branchName: editData.branch_name || '',
            branchPersonName: editData.branch_person_name || '',
            branchAddress: editData.branch_address || '',
            branchPhone: editData.branch_phone || '',
            relativeName: editData.relative_name || '',
            relativeFatherName: editData.relative_father_name || '',
            relativeAddress: editData.relative_address || '',
            relativePhone: editData.relative_phone || '',
            relativeRelation: editData.relative_relation || '',
            relationOther: editData.relation_other || '',
            isExchangeTractor: editData.is_exchange_tractor || '',
            oldTractorName: editData.old_tractor_name || '',
            oldTractorChassisNo: editData.old_tractor_chassis_no || '',
            oldTractorYearOfManufacture:
              editData.old_tractor_year_of_manufacture || '',
            exchangeDealAmount: editData.exchange_deal_amount || '',
            oldTractorRemark: editData.old_tractor_remark || '',
          });

          // Set tractor delivered status for Branch mode
          if (editData.delivery_mode === 'Branch') {
            setTractorDelivered(editData.tractor_delivered || '');
          }

          // Set accessories from JSON string if available
          if (editData.accessories) {
            try {
              const accessoriesData =
                typeof editData.accessories === 'string'
                  ? JSON.parse(editData.accessories)
                  : editData.accessories;

              const updatedAccessories = {...accessories};
              Object.keys(accessoriesData).forEach(key => {
                if (
                  accessoriesData[key] === 'Yes' ||
                  accessoriesData[key] === true
                ) {
                  const accessoryKey = key.toLowerCase().replace(/\s+/g, '');
                  if (updatedAccessories.hasOwnProperty(accessoryKey)) {
                    updatedAccessories[accessoryKey] = true;
                  }
                }
              });
              setAccessories(updatedAccessories);
            } catch (error) {
              console.log('Error parsing accessories:', error);
            }
          }

          // Check if signatures exist and mark OTP as verified
          if (editData.customer_signature) {
            setCustomerOtpVerified(true);
          }
          if (editData.manager_signature) {
            setManagerOtpVerified(true);
          }

          setAcceptTerms(true);
        }
      } catch (error) {
        console.log('Error loading user data:', error);
      }
    };

    initializeData();
  }, [route.params]);

  // Generate form number
  const generateFormNo = () => {
    const timestamp = new Date().getTime();
    return `DC${timestamp}`;
  };

  // Calculate total paid and balance amount automatically
  useEffect(() => {
    const amountPaid = parseFloat(formData.amountPaid) || 0;
    const financeAmountPaid = parseFloat(formData.financeAmountPaid) || 0;
    const totalPaid = amountPaid + financeAmountPaid;
    const dealPrice = parseFloat(formData.dealPrice) || 0;
    const balance = dealPrice - totalPaid;

    handleInputChange('totalPaid', totalPaid.toString());
    handleInputChange('balanceAmount', balance.toString());
  }, [formData.amountPaid, formData.financeAmountPaid, formData.dealPrice]);

  // Camera permissions for image capture
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

  const showImagePickerOptions = setImageFunction => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', 'Take Photo', 'Choose from Library'],
          cancelButtonIndex: 0,
        },
        async buttonIndex => {
          if (buttonIndex === 1) {
            const hasPermission = await requestCameraPermissionForImage();
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
              const hasPermission = await requestCameraPermissionForImage();
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
        includeBase64: false,
      },
      response => {
        if (response.didCancel) return;
        if (response.error) {
          Alert.alert('Error', 'Failed to capture image');
          return;
        }
        if (response.assets && response.assets.length > 0) {
          setImageFunction(response.assets[0]);
        }
      },
    );
  };

  const handleImageLibrary = setImageFunction => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.8,
        includeBase64: false,
      },
      response => {
        if (response.didCancel) return;
        if (response.error) {
          Alert.alert('Error', 'Failed to select image');
          return;
        }
        if (response.assets && response.assets.length > 0) {
          setImageFunction(response.assets[0]);
        }
      },
    );
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDeliveryModeSelect = mode => {
    handleInputChange('deliveryMode', mode);
    // Reset tractor delivered when changing delivery mode
    if (mode !== 'Branch') {
      setTractorDelivered('');
    }
  };

  const handleIsCustomerSelect = value => {
    handleInputChange('isCustomer', value === 'Yes' ? '1' : '0');
  };

  const handleExchangeTractorSelect = value => {
    handleInputChange('isExchangeTractor', value);
  };

  const handleTractorDeliveredSelect = value => {
    setTractorDelivered(value);
  };

  const handleAccessoryToggle = accessory => {
    setAccessories(prev => ({
      ...prev,
      [accessory]: !prev[accessory],
    }));
  };

  const handleTractorModelSelect = model => {
    handleInputChange('tractorModel', model);
    setShowTractorModelDropdown(false);
  };

  const handleTiresMakeSelect = make => {
    handleInputChange('tyresMake', make);
    setShowTiresMakeDropdown(false);
  };

  const handleFipMakeSelect = make => {
    handleInputChange('fipMake', make);
    setShowFipMakeDropdown(false);
  };

  const handleBatteryMakeSelect = make => {
    handleInputChange('batteryMake', make);
    setShowBatteryMakeDropdown(false);
  };

  const handlePaymentStatusSelect = status => {
    handleInputChange('paymentStatus', status);
    setShowPaymentStatusDropdown(false);
  };

  const handleFinancierSelect = financier => {
    handleInputChange('financierName', financier);
    setShowFinancerDropdown(false);
  };

  const handleHypothecationSelect = option => {
    handleInputChange('hypothecation', option);
    setShowHypothecationDropdown(false);
  };

  const handleRelationSelect = relation => {
    handleInputChange('relativeRelation', relation);
    setShowRelationDropdown(false);
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      handleInputChange('date', selectedDate);
    }
  };

  const handleManufactureDateChange = (event, selectedDate) => {
    setShowManufactureDatePicker(false);
    if (selectedDate) {
      const month = selectedDate.getMonth() + 1;
      const year = selectedDate.getFullYear();
      handleInputChange('yearOfManufacture', `${month}/${year}`);
    }
  };

  const handleDateIconPress = () => {
    setShowDatePicker(true);
  };

  const handleManufactureDateIconPress = () => {
    setShowManufactureDatePicker(true);
  };

  const validateForm = () => {
    const requiredFields = [
      'customerName',
      'parentage',
      'address',
      'mobileNo',
      'tractorName',
      'tractorModel',
      'chassisNo',
      'engineNo',
      'yearOfManufacture',
      'dealPrice',
      'paymentStatus',
    ];

    for (const field of requiredFields) {
      if (!formData[field] || formData[field].toString().trim() === '') {
        Alert.alert(
          'Validation Error',
          `Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`,
        );
        return false;
      }
    }

    if (!formData.isCustomer) {
      Alert.alert('Validation Error', 'Please select if you are the customer');
      return false;
    }

    // Branch validation
    if (formData.deliveryMode === 'Branch') {
      const branchFields = [
        'branchName',
        'branchPersonName',
        'branchAddress',
        'branchPhone',
      ];
      for (const field of branchFields) {
        if (!formData[field] || formData[field].toString().trim() === '') {
          Alert.alert(
            'Validation Error',
            `Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`,
          );
          return false;
        }
      }

      // Validate tractor delivered option for Branch mode
      if (!tractorDelivered) {
        Alert.alert(
          'Validation Error',
          'Please select if tractor is delivered',
        );
        return false;
      }

      // If tractor is delivered, validate customer details
      if (tractorDelivered === 'yes') {
        const customerFields = [
          'customerName',
          'parentage',
          'address',
          'mobileNo',
        ];
        for (const field of customerFields) {
          if (!formData[field] || formData[field].toString().trim() === '') {
            Alert.alert(
              'Validation Error',
              `Please fill in ${field
                .replace(/([A-Z])/g, ' $1')
                .toLowerCase()}`,
            );
            return false;
          }
        }
      }
    }

    // Representative validation (only if isCustomer is '0' AND we're showing customer details)
    if (
      formData.isCustomer === '0' &&
      (formData.deliveryMode !== 'Branch' ||
        (formData.deliveryMode === 'Branch' && tractorDelivered === 'yes'))
    ) {
      const representativeFields = [
        'relativeName',
        'relativeFatherName',
        'relativeAddress',
        'relativePhone',
        'relativeRelation',
      ];
      for (const field of representativeFields) {
        if (!formData[field] || formData[field].toString().trim() === '') {
          Alert.alert(
            'Validation Error',
            `Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`,
          );
          return false;
        }
      }
      if (
        formData.relativeRelation === 'Other' &&
        (!formData.relationOther || formData.relationOther.trim() === '')
      ) {
        Alert.alert('Validation Error', 'Please specify the relation');
        return false;
      }
    }

    // Exchange tractor validation
    if (formData.isExchangeTractor === 'yes') {
      const exchangeFields = [
        'oldTractorName',
        'oldTractorChassisNo',
        'oldTractorYearOfManufacture',
        'exchangeDealAmount',
      ];
      for (const field of exchangeFields) {
        if (!formData[field] || formData[field].toString().trim() === '') {
          Alert.alert(
            'Validation Error',
            `Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`,
          );
          return false;
        }
      }
    }

    // OTP verification check for signatures
    const shouldValidateSignatures =
      formData.deliveryMode !== 'Branch' ||
      (formData.deliveryMode === 'Branch' && tractorDelivered === 'yes');

    if (shouldValidateSignatures) {
      if (!isEditMode) {
        // For new forms, signatures must be uploaded with OTP verification
        if (!customerSignature && !customerOtpVerified) {
          Alert.alert(
            'Verification Required',
            'Please verify customer OTP and upload signature',
          );
          return false;
        }
        if (!managerSignature && !managerOtpVerified) {
          Alert.alert(
            'Verification Required',
            'Please verify manager OTP and upload signature',
          );
          return false;
        }
        if (!driverSignature) {
          Alert.alert('Validation Error', 'Please add driver signature');
          return false;
        }
      } else {
        // For edit mode, if new signatures are being uploaded, they must be OTP verified
        if (customerSignature && !customerOtpVerified) {
          // Check if it's a new signature (has uri property)
          if (customerSignature.uri && !customerOtpVerified) {
            Alert.alert(
              'Verification Required',
              'Customer signature requires OTP verification',
            );
            return false;
          }
        }
        if (managerSignature && !managerOtpVerified) {
          // Check if it's a new signature (has uri property)
          if (managerSignature.uri && !managerOtpVerified) {
            Alert.alert(
              'Verification Required',
              'Manager signature requires OTP verification',
            );
            return false;
          }
        }
        // Driver signature doesn't require OTP verification
        if (!driverSignature) {
          Alert.alert('Validation Error', 'Please add driver signature');
          return false;
        }
      }
    }

    if (!acceptTerms && shouldValidateSignatures) {
      Alert.alert(
        'Validation Error',
        'Please accept the terms and conditions by ticking the checkbox',
      );
      return false;
    }

    return true;
  };

  const prepareAccessoriesData = () => {
    const accessoriesData = {};

    const accessoryMapping = {
      bumper: 'Bumper',
      cultivator: 'Cultivator',
      leveler: 'Leveler',
      rallyFenderSeats: 'Rally Fender Seats',
      weightsRear: 'Weights Rear',
      waterTanker: 'Water Tanker',
      trolly: 'Trolly',
      weightFront: 'Weight Front',
      rearTowingHook: 'Rear Towing Hook',
      hood: 'Hood',
      ptoPully: 'PTO Pully',
      drawbar: 'Drawbar',
      cageWheels: 'Cage Wheels',
      tool: 'Tool',
      toplink: 'Top Link',
    };

    Object.keys(accessories).forEach(key => {
      if (accessoryMapping[key]) {
        accessoriesData[accessoryMapping[key]] = accessories[key]
          ? 'Yes'
          : 'No';
      }
    });

    accessoriesData.Other = [];

    return JSON.stringify(accessoriesData);
  };

  const prepareFormData = () => {
    const formDataToSend = new FormData();

    // Add form data with exact field names as expected by API
    formDataToSend.append('user_id', userId);
    formDataToSend.append('form_no', formData.formNo || generateFormNo());
    formDataToSend.append(
      'select_date',
      formData.date
        ? formData.date.toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0],
    );
    formDataToSend.append('delivery_mode', formData.deliveryMode);
    formDataToSend.append(
      'challan_created_by',
      formData.challanCreatedBy || 'Admin',
    );
    formDataToSend.append('customer_name', formData.customerName);
    formDataToSend.append('parentage', formData.parentage);
    formDataToSend.append('address', formData.address);
    formDataToSend.append('hypothecation', formData.hypothecation || '');
    formDataToSend.append(
      'hypothecation_other',
      formData.hypothecationOther || '',
    );
    formDataToSend.append('mobile_no', formData.mobileNo);
    formDataToSend.append('is_customer', formData.isCustomer);
    formDataToSend.append('tractor_name', formData.tractorName);
    formDataToSend.append('tractor_model', formData.tractorModel);
    formDataToSend.append('chassis_no', formData.chassisNo);
    formDataToSend.append('engine_no', formData.engineNo);
    formDataToSend.append('year_of_manufacture', formData.yearOfManufacture);
    formDataToSend.append('tyres_make', formData.tyresMake || '');
    formDataToSend.append('fip_make', formData.fipMake || '');
    formDataToSend.append('battery_make', formData.batteryMake || '');
    formDataToSend.append('deal_price', formData.dealPrice);
    formDataToSend.append('amount_paid', formData.amountPaid || '0');
    formDataToSend.append(
      'finance_amount_paid',
      formData.financeAmountPaid || '0',
    );
    formDataToSend.append('total_paid', formData.totalPaid || '0');
    formDataToSend.append('balance_amount', formData.balanceAmount || '0');
    formDataToSend.append('payment_status', formData.paymentStatus);
    formDataToSend.append('financier_name', formData.financierName || '');
    formDataToSend.append('accessories', prepareAccessoriesData());

    // Add tractor delivered status for Branch mode
    if (formData.deliveryMode === 'Branch') {
      formDataToSend.append('tractor_delivered', tractorDelivered || '');
    }

    // Add branch fields with correct API field names
    formDataToSend.append('branch_name', formData.branchName || '');
    formDataToSend.append(
      'branch_person_name',
      formData.branchPersonName || '',
    );
    formDataToSend.append('branch_address', formData.branchAddress || '');
    formDataToSend.append('branch_phone', formData.branchPhone || '');

    // Add representative fields with correct API field names
    formDataToSend.append('relative_name', formData.relativeName || '');
    formDataToSend.append(
      'relative_father_name',
      formData.relativeFatherName || '',
    );
    formDataToSend.append('relative_address', formData.relativeAddress || '');
    formDataToSend.append('relative_phone', formData.relativePhone || '');
    formDataToSend.append('relative_relation', formData.relativeRelation || '');
    formDataToSend.append('relation_other', formData.relationOther || '');

    // Add exchange tractor fields
    formDataToSend.append(
      'is_exchange_tractor',
      formData.isExchangeTractor || '',
    );
    formDataToSend.append('old_tractor_name', formData.oldTractorName || '');
    formDataToSend.append(
      'old_tractor_chassis_no',
      formData.oldTractorChassisNo || '',
    );
    formDataToSend.append(
      'old_tractor_year_of_manufacture',
      formData.oldTractorYearOfManufacture || '',
    );
    formDataToSend.append(
      'exchange_deal_amount',
      formData.exchangeDealAmount || '',
    );
    formDataToSend.append(
      'old_tractor_remark',
      formData.oldTractorRemark || '',
    );

    // Add other fields for tires, fip, battery
    if (formData.tyresMake === 'Other') {
      formDataToSend.append('tire_make_other', formData.tyresMakeOther || '');
    }
    if (formData.fipMake === 'Other') {
      formDataToSend.append('fip_make_other', formData.fipMakeOther || '');
    }
    if (formData.batteryMake === 'Other') {
      formDataToSend.append(
        'battery_make_other',
        formData.batteryMakeOther || '',
      );
    }

    // Add images with proper file names (only if tractor is delivered)
    const shouldAddSignatures =
      formData.deliveryMode !== 'Branch' ||
      (formData.deliveryMode === 'Branch' && tractorDelivered === 'yes');

    if (shouldAddSignatures) {
      if (
        customerSignature &&
        customerSignature.uri &&
        !customerSignature.uri.startsWith('http')
      ) {
        formDataToSend.append('customer_signature', {
          uri: customerSignature.uri,
          type: customerSignature.type || 'image/jpeg',
          name: `customer_signature_${Date.now()}.jpg`,
        });
      }

      if (
        managerSignature &&
        managerSignature.uri &&
        !managerSignature.uri.startsWith('http')
      ) {
        formDataToSend.append('manager_signature', {
          uri: managerSignature.uri,
          type: managerSignature.type || 'image/jpeg',
          name: `manager_signature_${Date.now()}.jpg`,
        });
      }

      if (
        driverSignature &&
        driverSignature.uri &&
        !driverSignature.uri.startsWith('http')
      ) {
        formDataToSend.append('driver_signature', {
          uri: driverSignature.uri,
          type: driverSignature.type || 'image/jpeg',
          name: `driver_signature_${Date.now()}.jpg`,
        });
      }
    }

    // For update, add the form ID
    if (isEditMode && existingFormId) {
      formDataToSend.append('id', existingFormId);
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

      const url = isEditMode
        ? 'https://argosmob.uk/makroo/public/api/v1/delivery-challan/form/update'
        : 'https://argosmob.uk/makroo/public/api/v1/delivery-challan/form/save';

      console.log('Submitting form data...');

      const response = await axios.post(url, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Accept: 'application/json',
        },
        timeout: 30000,
      });

      console.log('API Response:', response.data);

      if (
        response.data &&
        (response.data.success === true ||
          response.data.status === 'success' ||
          response.data.message?.toLowerCase().includes('success'))
      ) {
        Alert.alert(
          'Success',
          isEditMode
            ? 'Delivery Challan updated successfully!'
            : 'Delivery Challan submitted successfully!',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('Dashboard'),
            },
          ],
        );
      } else {
        let errorMessage = 'Submission failed';

        if (response.data && response.data.message) {
          errorMessage = response.data.message;
        } else if (response.data && response.data.error) {
          errorMessage = response.data.error;
        } else if (response.data && response.data.errors) {
          const validationErrors = Object.values(response.data.errors).flat();
          errorMessage = validationErrors.join(', ');
        }

        Alert.alert('Submission Failed', errorMessage);
      }
    } catch (error) {
      console.log('Submission Error:', error);

      if (error.response) {
        let errorMessage = 'Submission failed. Please try again.';

        if (error.response.status === 422) {
          if (error.response.data.errors) {
            const validationErrors = Object.values(
              error.response.data.errors,
            ).flat();
            errorMessage = `Validation Error: ${validationErrors.join(', ')}`;
          } else if (error.response.data.message) {
            errorMessage = error.response.data.message;
          }
        } else if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data?.error) {
          errorMessage = error.response.data.error;
        }

        Alert.alert('Submission Failed', errorMessage);
      } else if (error.request) {
        Alert.alert(
          'Network Error',
          'Please check your internet connection and try again.',
        );
      } else {
        Alert.alert('Error', 'Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleHome = () => {
    navigation.navigate('Dashboard');
  };

  const renderDropdownItem = ({item}) => (
    <TouchableOpacity
      style={styles.dropdownItem}
      onPress={() => {
        if (showTractorModelDropdown) handleTractorModelSelect(item);
        else if (showTiresMakeDropdown) handleTiresMakeSelect(item);
        else if (showFipMakeDropdown) handleFipMakeSelect(item);
        else if (showBatteryMakeDropdown) handleBatteryMakeSelect(item);
        else if (showPaymentStatusDropdown) handlePaymentStatusSelect(item);
        else if (showFinancerDropdown) handleFinancierSelect(item);
        else if (showHypothecationDropdown) handleHypothecationSelect(item);
        else if (showRelationDropdown) handleRelationSelect(item);
        else if (showExchangeTractorDropdown) handleExchangeTractorSelect(item);
      }}>
      <Text style={styles.dropdownItemText}>{item}</Text>
    </TouchableOpacity>
  );

  // OTP Modal Component
  const renderOtpModal = () => {
    const isCustomerModal = showCustomerOtpModal;
    const title = isCustomerModal
      ? 'Verify Customer OTP'
      : 'Verify Manager OTP';
    const phoneInfo = isCustomerModal
      ? `OTP sent to: ${customerPhoneForOtp}`
      : 'OTP sent to super admin';
    const otpValue = isCustomerModal ? customerOtp : managerOtp;
    const setOtpValue = isCustomerModal ? setCustomerOtp : setManagerOtp;
    const verifyFunction = isCustomerModal
      ? verifyCustomerOtp
      : verifyManagerOtp;
    const resendFunction = resendOtp;

    return (
      <Modal
        visible={showCustomerOtpModal || showManagerOtpModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => {
          setShowCustomerOtpModal(false);
          setShowManagerOtpModal(false);
          setCustomerOtp('');
          setManagerOtp('');
        }}>
        <View style={styles.modalOverlay}>
          <View style={styles.otpModalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{title}</Text>
              <TouchableOpacity
                onPress={() => {
                  setShowCustomerOtpModal(false);
                  setShowManagerOtpModal(false);
                  setCustomerOtp('');
                  setManagerOtp('');
                }}
                style={styles.closeButton}>
                <Icon name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            <View style={styles.otpContent}>
              <Text style={styles.otpInfoText}>{phoneInfo}</Text>

              <TextInput
                style={styles.otpInput}
                value={otpValue}
                onChangeText={setOtpValue}
                placeholder="Enter 6-digit OTP"
                placeholderTextColor="#666"
                keyboardType="number-pad"
                maxLength={6}
                autoFocus={true}
                editable={!verifyingOtp}
              />

              <View style={styles.otpTimerContainer}>
                {otpResendTimer > 0 ? (
                  <Text style={styles.otpTimerText}>
                    Resend OTP in {otpResendTimer}s
                  </Text>
                ) : (
                  <TouchableOpacity
                    onPress={resendFunction}
                    disabled={sendingCustomerOtp || sendingManagerOtp}
                    style={styles.resendButton}>
                    <Text style={styles.resendButtonText}>
                      {sendingCustomerOtp || sendingManagerOtp
                        ? 'Sending...'
                        : 'Resend OTP'}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              <TouchableOpacity
                style={[
                  styles.verifyButton,
                  (!otpValue ||
                    otpValue.length !== 6 ||
                    verifyingOtp) &&
                    styles.disabledButton,
                ]}
                onPress={verifyFunction}
                disabled={
                  !otpValue || otpValue.length !== 6 || verifyingOtp
                }>
                {verifyingOtp ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.verifyButtonText}>Verify OTP</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  // Render signature boxes in column layout
  const renderSignatureBox = (
    type,
    image,
    setImageFunction,
    otpVerified,
    onPress,
    verifyButtonText,
  ) => {
    const isCustomer = type === 'customer';
    const isManager = type === 'manager';
    const isDriver = type === 'driver';
    const sendingOtp = isCustomer
      ? sendingCustomerOtp
      : isManager
      ? sendingManagerOtp
      : false;
    const sendOtpFunction = isCustomer
      ? sendCustomerOtp
      : isManager
      ? sendManagerOtp
      : null;

    return (
      <View style={styles.signatureColumn}>
        <Text style={styles.signatureLabel}>
          {isCustomer
            ? 'Customer Signature'
            : isManager
            ? 'Manager Signature'
            : 'Driver Signature'}
        </Text>
        
        <TouchableOpacity
          style={styles.photoSignatureBox1}
          onPress={onPress}
          disabled={loading}>
          {image ? (
            <Image
              source={{uri: image.uri}}
              style={styles.previewImage}
              resizeMode="contain"
            />
          ) : (
            <>
              <Icon name="photo-camera" size={30} color="#666" />
              <View style={styles.otpIndicatorContainer}>
                {!isDriver && otpVerified ? (
                  <View style={[styles.otpIndicator, styles.otpVerified]}>
                    <Icon name="check" size={12} color="#fff" />
                    <Text style={styles.otpIndicatorText}>Verified</Text>
                  </View>
                ) : !isDriver ? (
                  <View style={[styles.otpIndicator, styles.otpPending]}>
                    <Icon name="info" size={12} color="#fff" />
                    <Text style={styles.otpIndicatorText}>OTP Required</Text>
                  </View>
                ) : null}
              </View>
              {isEditMode && (
                <Text style={styles.optionalText}>(Optional for update)</Text>
              )}
            </>
          )}
        </TouchableOpacity>

        {/* Verify Button (only for customer and manager, not for driver) */}
        {!isDriver && !otpVerified && (
          <TouchableOpacity
            style={[styles.verifySignatureButton, sendingOtp && styles.disabledButton]}
            onPress={sendOtpFunction}
            disabled={sendingOtp || loading}>
            {sendingOtp ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.verifySignatureButtonText}>
                {verifyButtonText}
              </Text>
            )}
          </TouchableOpacity>
        )}

        {/* Upload Signature Button (only shown when OTP is verified or for driver) */}
        {((!isDriver && otpVerified) || isDriver) && !image && (
          <TouchableOpacity
            style={[styles.uploadSignatureButton, loading && styles.disabledButton]}
            onPress={() => showImagePickerOptions(setImageFunction)}
            disabled={loading}>
            <Text style={styles.uploadSignatureButtonText}>
              Upload Signature
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  // Determine if customer details should be shown
  const shouldShowCustomerDetails =
    formData.deliveryMode !== 'Branch' ||
    (formData.deliveryMode === 'Branch' && tractorDelivered === 'yes');

  return (
    <View
      style={[
        styles.container,
        {paddingTop: insets.top, paddingBottom: insets.bottom},
      ]}>
      {/* Header */}
      <LinearGradient
        colors={['#7E5EA9', '#20AEBC']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        style={styles.header}>
        <Text style={styles.headerTitle}>Delivery Challan</Text>
        {isEditMode && <Text style={styles.editModeText}>Edit Mode</Text>}
      </LinearGradient>

      <ScrollView style={styles.scrollView}>
        {/* Form No */}
        <Text style={styles.sectionHeading}>Create Delivery Challan</Text>

        {/* OTP Verification Status */}
        <View style={styles.otpStatusContainer}>
          <Text style={styles.otpStatusTitle}>OTP Verification Status</Text>
          <View style={styles.otpStatusRow}>
            <Text style={styles.otpStatusLabel}>Customer:</Text>
            <View
              style={[
                styles.otpStatusBadge,
                customerOtpVerified ? styles.otpVerified : styles.otpPending,
              ]}>
              <Text style={styles.otpStatusText}>
                {customerOtpVerified ? 'Verified' : 'Pending'}
              </Text>
            </View>
          </View>

          <View style={styles.otpStatusRow}>
            <Text style={styles.otpStatusLabel}>Manager:</Text>
            <View
              style={[
                styles.otpStatusBadge,
                managerOtpVerified ? styles.otpVerified : styles.otpPending,
              ]}>
              <Text style={styles.otpStatusText}>
                {managerOtpVerified ? 'Verified' : 'Pending'}
              </Text>
            </View>
          </View>
        </View>

        {/* Date */}
        <View style={styles.inputContainer}>
          <LinearGradient
            colors={['#7E5EA9', '#20AEBC']}
            style={styles.inputGradient}>
            <View style={styles.inputWithIcon}>
              <TouchableOpacity
                style={[styles.textInput, {flex: 1}]}
                onPress={handleDateIconPress}
                disabled={loading}>
                <Text
                  style={
                    formData.date ? styles.selectedText : styles.placeholderText
                  }>
                  {formData.date
                    ? formData.date.toLocaleDateString()
                    : 'Select Date'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={handleDateIconPress}
                disabled={loading}>
                <Icon name="calendar-today" size={20} color="#666" />
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={formData.date || new Date()}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={handleDateChange}
                />
              )}
            </View>
          </LinearGradient>
        </View>

        {/* Delivery Mode */}
        <View style={styles.deliveryModeContainer}>
          <Text style={styles.sectionLabel}>Delivery Mode</Text>
          <View style={styles.deliveryModeButtons}>
            <TouchableOpacity
              style={[
                styles.deliveryModeButton,
                formData.deliveryMode === 'Self Pickup' &&
                  styles.deliveryModeSelected,
              ]}
              onPress={() => handleDeliveryModeSelect('Self Pickup')}
              disabled={loading}>
              <LinearGradient
                colors={
                  formData.deliveryMode === 'Self Pickup'
                    ? ['#7E5EA9', '#20AEBC']
                    : ['#7E5EA9', '#20AEBC']
                }
                style={styles.deliveryModeGradient}>
                <Text
                  style={[
                    styles.deliveryModeText,
                    formData.deliveryMode === 'Self Pickup' &&
                      styles.deliveryModeTextSelected,
                  ]}>
                  Self Pickup
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.deliveryModeButton,
                formData.deliveryMode === 'Branch' &&
                  styles.deliveryModeSelected,
              ]}
              onPress={() => handleDeliveryModeSelect('Branch')}
              disabled={loading}>
              <LinearGradient
                colors={
                  formData.deliveryMode === 'Branch'
                    ? ['#7E5EA9', '#20AEBC']
                    : ['#7E5EA9', '#20AEBC']
                }
                style={styles.deliveryModeGradient}>
                <Text
                  style={[
                    styles.deliveryModeText,
                    formData.deliveryMode === 'Branch' &&
                      styles.deliveryModeTextSelected,
                  ]}>
                  Branch
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        {/* Branch Fields - Conditionally Rendered */}
        {formData.deliveryMode === 'Branch' && (
          <View style={styles.branchSection}>
            <Text style={styles.sectionHeading}>Branch Details</Text>

            {/* Tractor Delivered Option */}
            <View style={styles.tractorDeliveredSection}>
              <Text style={styles.radioLabel}>Tractor Delivered?</Text>
              <View style={styles.radioOptions}>
                {tractorDeliveredOptions.map(option => (
                  <TouchableOpacity
                    key={option}
                    style={styles.radioOption}
                    onPress={() => handleTractorDeliveredSelect(option)}
                    disabled={loading}>
                    <LinearGradient
                      colors={
                        tractorDelivered === option
                          ? ['#12C857', '#12C857']
                          : ['#f0f0f0', '#f0f0f0']
                      }
                      style={styles.radioGradient}>
                      <View style={styles.radioInner}>
                        {tractorDelivered === option && (
                          <Icon name="check" size={24} color="#fff" />
                        )}
                      </View>
                    </LinearGradient>
                    <Text style={styles.radioText}>
                      {option === 'yes' ? 'Yes' : 'No'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Branch Name */}
            <View style={styles.inputRow}>
              <View style={styles.fullWidthInputContainer}>
                <LinearGradient
                  colors={['#7E5EA9', '#20AEBC']}
                  style={styles.inputGradient}>
                  <TextInput
                    style={styles.textInput}
                    value={formData.branchName}
                    onChangeText={text => handleInputChange('branchName', text)}
                    placeholder="Branch Name"
                    placeholderTextColor="#666"
                    editable={!loading}
                  />
                </LinearGradient>
              </View>
            </View>

            {/* Branch Person Name */}
            <View style={styles.inputRow}>
              <View style={styles.fullWidthInputContainer}>
                <LinearGradient
                  colors={['#7E5EA9', '#20AEBC']}
                  style={styles.inputGradient}>
                  <TextInput
                    style={styles.textInput}
                    value={formData.branchPersonName}
                    onChangeText={text =>
                      handleInputChange('branchPersonName', text)
                    }
                    placeholder="Branch Person Name"
                    placeholderTextColor="#666"
                    editable={!loading}
                  />
                </LinearGradient>
              </View>
            </View>

            {/* Branch Address */}
            <View style={styles.inputRow}>
              <View style={styles.fullWidthInputContainer}>
                <LinearGradient
                  colors={['#7E5EA9', '#20AEBC']}
                  style={styles.inputGradient}>
                  <TextInput
                    style={styles.textInput}
                    value={formData.branchAddress}
                    onChangeText={text =>
                      handleInputChange('branchAddress', text)
                    }
                    placeholder="Branch Address"
                    placeholderTextColor="#666"
                    multiline
                    numberOfLines={2}
                    editable={!loading}
                  />
                </LinearGradient>
              </View>
            </View>

            {/* Branch Phone */}
            <View style={styles.inputRow}>
              <View style={styles.fullWidthInputContainer}>
                <LinearGradient
                  colors={['#7E5EA9', '#20AEBC']}
                  style={styles.inputGradient}>
                  <TextInput
                    style={styles.textInput}
                    value={formData.branchPhone}
                    onChangeText={text =>
                      handleInputChange('branchPhone', text)
                    }
                    placeholder="Branch Phone"
                    placeholderTextColor="#666"
                    keyboardType="phone-pad"
                    editable={!loading}
                  />
                </LinearGradient>
              </View>
            </View>
          </View>
        )}

        {/* Customer Details Heading - Conditionally Rendered */}
        {shouldShowCustomerDetails && (
          <>
            <Text style={styles.sectionHeading}>Customer Details</Text>

            {/* Challan Created By */}
            <View style={styles.inputRow}>
              <View style={styles.inputContainer}>
                <LinearGradient
                  colors={['#7E5EA9', '#20AEBC']}
                  style={styles.inputGradient}>
                  <TextInput
                    style={styles.textInput}
                    value={formData.challanCreatedBy}
                    onChangeText={text =>
                      handleInputChange('challanCreatedBy', text)
                    }
                    placeholder="Challan Created By"
                    placeholderTextColor="#666"
                    editable={!loading}
                  />
                </LinearGradient>
              </View>
            </View>

            {/* Customer Name & Parentage */}
            <View style={styles.inputRow}>
              <View style={styles.inputContainer}>
                <LinearGradient
                  colors={['#7E5EA9', '#20AEBC']}
                  style={styles.inputGradient}>
                  <TextInput
                    style={styles.textInput}
                    value={formData.customerName}
                    onChangeText={text =>
                      handleInputChange('customerName', text)
                    }
                    placeholder="Customer Name"
                    placeholderTextColor="#666"
                    editable={!loading}
                  />
                </LinearGradient>
              </View>
              <View style={{marginBottom: 15}} />
              <View style={styles.inputContainer}>
                <LinearGradient
                  colors={['#7E5EA9', '#20AEBC']}
                  style={styles.inputGradient}>
                  <TextInput
                    style={styles.textInput}
                    value={formData.parentage}
                    onChangeText={text => handleInputChange('parentage', text)}
                    placeholder="Parentage"
                    placeholderTextColor="#666"
                    editable={!loading}
                  />
                </LinearGradient>
              </View>
            </View>

            {/* Address */}
            <View style={styles.inputRow}>
              <View style={styles.fullWidthInputContainer}>
                <LinearGradient
                  colors={['#7E5EA9', '#20AEBC']}
                  style={styles.inputGradient}>
                  <TextInput
                    style={[styles.textInput]}
                    value={formData.address}
                    onChangeText={text => handleInputChange('address', text)}
                    placeholder="Enter Address"
                    placeholderTextColor="#666"
                    multiline
                    numberOfLines={1}
                    editable={!loading}
                  />
                </LinearGradient>
              </View>
            </View>

            {/* Hypothecation */}
            <View style={styles.inputRow}>
              <View style={styles.inputContainer}>
                <LinearGradient
                  colors={['#7E5EA9', '#20AEBC']}
                  style={styles.inputGradient}>
                  <TouchableOpacity
                    style={styles.dropdownInput}
                    onPress={() => setShowHypothecationDropdown(true)}
                    disabled={loading}>
                    <Text
                      style={
                        formData.hypothecation
                          ? styles.selectedText
                          : styles.placeholderText
                      }>
                      {formData.hypothecation || 'Select Hypothecation'}
                    </Text>
                    <Icon name="keyboard-arrow-down" size={24} color="#666" />
                  </TouchableOpacity>
                </LinearGradient>
              </View>
            </View>

            {/* Hypothecation Other */}
            {formData.hypothecation === 'Other' && (
              <View style={styles.inputRow}>
                <View style={styles.fullWidthInputContainer}>
                  <LinearGradient
                    colors={['#7E5EA9', '#20AEBC']}
                    style={styles.inputGradient}>
                    <TextInput
                      style={styles.textInput}
                      value={formData.hypothecationOther}
                      onChangeText={text =>
                        handleInputChange('hypothecationOther', text)
                      }
                      placeholder="Enter Other Hypothecation"
                      placeholderTextColor="#666"
                      editable={!loading}
                    />
                  </LinearGradient>
                </View>
              </View>
            )}

            {/* Mobile No */}
            <View style={styles.inputRow}>
              <View style={styles.inputContainer}>
                <LinearGradient
                  colors={['#7E5EA9', '#20AEBC']}
                  style={styles.inputGradient}>
                  <TextInput
                    style={styles.textInput}
                    value={formData.mobileNo}
                    onChangeText={text => handleInputChange('mobileNo', text)}
                    placeholder="Mobile No."
                    placeholderTextColor="#666"
                    keyboardType="phone-pad"
                    editable={!loading}
                  />
                </LinearGradient>
              </View>
            </View>

            {/* Are You Customer? */}
            <View style={styles.radioSection}>
              <Text style={styles.radioLabel}>Are You Customer?</Text>
              <View style={styles.radioOptions}>
                {['Yes', 'No'].map(option => (
                  <TouchableOpacity
                    key={option}
                    style={styles.radioOption}
                    onPress={() => handleIsCustomerSelect(option)}
                    disabled={loading}>
                    <LinearGradient
                      colors={
                        formData.isCustomer === (option === 'Yes' ? '1' : '0')
                          ? ['#12C857', '#12C857']
                          : ['#f0f0f0', '#f0f0f0']
                      }
                      style={styles.radioGradient}>
                      <View style={styles.radioInner}>
                        {formData.isCustomer ===
                          (option === 'Yes' ? '1' : '0') && (
                          <Icon name="check" size={24} color="#fff" />
                        )}
                      </View>
                    </LinearGradient>
                    <Text style={styles.radioText}>{option}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Representative Fields */}
            {formData.isCustomer === '0' && (
              <View style={styles.representativeSection}>
                <Text style={styles.sectionHeading}>
                  Representative Details
                </Text>

                {/* Representative Name */}
                <View style={styles.inputRow}>
                  <View style={styles.fullWidthInputContainer}>
                    <LinearGradient
                      colors={['#7E5EA9', '#20AEBC']}
                      style={styles.inputGradient}>
                      <TextInput
                        style={styles.textInput}
                        value={formData.relativeName}
                        onChangeText={text =>
                          handleInputChange('relativeName', text)
                        }
                        placeholder="Representative Name"
                        placeholderTextColor="#666"
                        editable={!loading}
                      />
                    </LinearGradient>
                  </View>
                </View>

                {/* Representative Father's Name */}
                <View style={styles.inputRow}>
                  <View style={styles.fullWidthInputContainer}>
                    <LinearGradient
                      colors={['#7E5EA9', '#20AEBC']}
                      style={styles.inputGradient}>
                      <TextInput
                        style={styles.textInput}
                        value={formData.relativeFatherName}
                        onChangeText={text =>
                          handleInputChange('relativeFatherName', text)
                        }
                        placeholder="Father's Name"
                        placeholderTextColor="#666"
                        editable={!loading}
                      />
                    </LinearGradient>
                  </View>
                </View>

                {/* Representative Address */}
                <View style={styles.inputRow}>
                  <View style={styles.fullWidthInputContainer}>
                    <LinearGradient
                      colors={['#7E5EA9', '#20AEBC']}
                      style={styles.inputGradient}>
                      <TextInput
                        style={styles.textInput}
                        value={formData.relativeAddress}
                        onChangeText={text =>
                          handleInputChange('relativeAddress', text)
                        }
                        placeholder="Representative Address"
                        placeholderTextColor="#666"
                        multiline
                        numberOfLines={2}
                        editable={!loading}
                      />
                    </LinearGradient>
                  </View>
                </View>

                {/* Representative Phone */}
                <View style={styles.inputRow}>
                  <View style={styles.fullWidthInputContainer}>
                    <LinearGradient
                      colors={['#7E5EA9', '#20AEBC']}
                      style={styles.inputGradient}>
                      <TextInput
                        style={styles.textInput}
                        value={formData.relativePhone}
                        onChangeText={text =>
                          handleInputChange('relativePhone', text)
                        }
                        placeholder="Representative Phone"
                        placeholderTextColor="#666"
                        keyboardType="phone-pad"
                        editable={!loading}
                      />
                    </LinearGradient>
                  </View>
                </View>

                {/* Relation with Owner */}
                <View style={styles.inputRow}>
                  <View style={styles.inputContainer}>
                    <LinearGradient
                      colors={['#7E5EA9', '#20AEBC']}
                      style={styles.inputGradient}>
                      <TouchableOpacity
                        style={styles.dropdownInput}
                        onPress={() => setShowRelationDropdown(true)}
                        disabled={loading}>
                        <Text
                          style={
                            formData.relativeRelation
                              ? styles.selectedText
                              : styles.placeholderText
                          }>
                          {formData.relativeRelation || 'Relation with Owner'}
                        </Text>
                        <Icon
                          name="keyboard-arrow-down"
                          size={24}
                          color="#666"
                        />
                      </TouchableOpacity>
                    </LinearGradient>
                  </View>
                </View>

                {/* Relation Other */}
                {formData.relativeRelation === 'Other' && (
                  <View style={styles.inputRow}>
                    <View style={styles.fullWidthInputContainer}>
                      <LinearGradient
                        colors={['#7E5EA9', '#20AEBC']}
                        style={styles.inputGradient}>
                        <TextInput
                          style={styles.textInput}
                          value={formData.relationOther}
                          onChangeText={text =>
                            handleInputChange('relationOther', text)
                          }
                          placeholder="Enter Other Relation"
                          placeholderTextColor="#666"
                          editable={!loading}
                        />
                      </LinearGradient>
                    </View>
                  </View>
                )}
              </View>
            )}
          </>
        )}

        {/* Tractor Details Heading */}
        <Text style={styles.sectionHeading}>Tractor Details</Text>

        {/* Tractor Name & Model */}
        <View style={styles.inputRow}>
          <View style={styles.inputContainer}>
            <LinearGradient
              colors={['#7E5EA9', '#20AEBC']}
              style={styles.inputGradient}>
              <TextInput
                style={styles.textInput}
                value={formData.tractorName}
                onChangeText={text => handleInputChange('tractorName', text)}
                placeholder="Tractor Name"
                placeholderTextColor="#666"
                editable={!loading}
              />
            </LinearGradient>
          </View>
          <View style={{marginBottom: 15}} />
          <View style={styles.inputContainer}>
            <LinearGradient
              colors={['#7E5EA9', '#20AEBC']}
              style={styles.inputGradient}>
              <TouchableOpacity
                style={styles.dropdownInput}
                onPress={() => setShowTractorModelDropdown(true)}
                disabled={loading}>
                <Text
                  style={
                    formData.tractorModel
                      ? styles.selectedText
                      : styles.placeholderText
                  }>
                  {formData.tractorModel || 'Select Model'}
                </Text>
                <Icon name="keyboard-arrow-down" size={24} color="#666" />
              </TouchableOpacity>
              {loadingModels && (
                <ActivityIndicator
                  size="small"
                  color="#7E5EA9"
                  style={styles.loadingIndicator}
                />
              )}
            </LinearGradient>
          </View>
        </View>

        {/* Chassis No & Engine No */}
        <View style={styles.inputRow}>
          <View style={styles.inputContainer}>
            <LinearGradient
              colors={['#7E5EA9', '#20AEBC']}
              style={styles.inputGradient}>
              <View style={styles.inputWithIcon}>
                <TextInput
                  style={[styles.textInput, {flex: 1}]}
                  value={formData.chassisNo}
                  onChangeText={text => handleInputChange('chassisNo', text)}
                  placeholder="Chassis No"
                  placeholderTextColor="#666"
                  editable={!loading}
                />
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={handleChassisScanPress}
                  disabled={loading}>
                  <Icon name="qr-code-scanner" size={20} color="#666" />
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </View>
          <View style={{marginBottom: 15}} />
          <View style={styles.inputContainer}>
            <LinearGradient
              colors={['#7E5EA9', '#20AEBC']}
              style={styles.inputGradient}>
              <View style={styles.inputWithIcon}>
                <TextInput
                  style={[styles.textInput, {flex: 1}]}
                  value={formData.engineNo}
                  onChangeText={text => handleInputChange('engineNo', text)}
                  placeholder="Engine No"
                  placeholderTextColor="#666"
                  editable={!loading}
                />
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={handleEngineScanPress}
                  disabled={loading}>
                  <Icon name="qr-code-scanner" size={20} color="#666" />
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </View>
        </View>

        {/* Year of Manufacture */}
        <View style={styles.inputRow}>
          <View style={styles.inputContainer}>
            <LinearGradient
              colors={['#7E5EA9', '#20AEBC']}
              style={styles.inputGradient}>
              <View style={styles.inputWithIcon}>
                <TouchableOpacity
                  style={[styles.textInput, {flex: 1}]}
                  onPress={handleManufactureDateIconPress}
                  disabled={loading}>
                  <Text
                    style={
                      formData.yearOfManufacture
                        ? styles.selectedText
                        : styles.placeholderText
                    }>
                    {formData.yearOfManufacture || 'Month/Year of Manufacture'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={handleManufactureDateIconPress}
                  disabled={loading}>
                  <Icon name="calendar-today" size={20} color="#666" />
                </TouchableOpacity>
                {showManufactureDatePicker && (
                  <DateTimePicker
                    value={new Date()}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={handleManufactureDateChange}
                  />
                )}
              </View>
            </LinearGradient>
          </View>
        </View>

        {/* Tires Make with Other option */}
        <View style={styles.inputRow}>
          <View style={styles.inputContainer}>
            <LinearGradient
              colors={['#7E5EA9', '#20AEBC']}
              style={styles.inputGradient}>
              <TouchableOpacity
                style={styles.dropdownInput}
                onPress={() => setShowTiresMakeDropdown(true)}
                disabled={loading}>
                <Text
                  style={
                    formData.tyresMake
                      ? styles.selectedText
                      : styles.placeholderText
                  }>
                  {formData.tyresMake || 'Select Tires Make'}
                </Text>
                <Icon name="keyboard-arrow-down" size={24} color="#666" />
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </View>

        {/* Tires Make Other */}
        {formData.tyresMake === 'Other' && (
          <View style={styles.inputRow}>
            <View style={styles.fullWidthInputContainer}>
              <LinearGradient
                colors={['#7E5EA9', '#20AEBC']}
                style={styles.inputGradient}>
                <TextInput
                  style={styles.textInput}
                  value={formData.tyresMakeOther}
                  onChangeText={text =>
                    handleInputChange('tyresMakeOther', text)
                  }
                  placeholder="Enter Other Tires Make"
                  placeholderTextColor="#666"
                  editable={!loading}
                />
              </LinearGradient>
            </View>
          </View>
        )}

        {/* FIP Make with Other option */}
        <View style={styles.inputRow}>
          <View style={styles.inputContainer}>
            <LinearGradient
              colors={['#7E5EA9', '#20AEBC']}
              style={styles.inputGradient}>
              <TouchableOpacity
                style={styles.dropdownInput}
                onPress={() => setShowFipMakeDropdown(true)}
                disabled={loading}>
                <Text
                  style={
                    formData.fipMake
                      ? styles.selectedText
                      : styles.placeholderText
                  }>
                  {formData.fipMake || 'FIP Make'}
                </Text>
                <Icon name="keyboard-arrow-down" size={24} color="#666" />
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </View>

        {/* FIP Make Other */}
        {formData.fipMake === 'Other' && (
          <View style={styles.inputRow}>
            <View style={styles.fullWidthInputContainer}>
              <LinearGradient
                colors={['#7E5EA9', '#20AEBC']}
                style={styles.inputGradient}>
                <TextInput
                  style={styles.textInput}
                  value={formData.fipMakeOther}
                  onChangeText={text => handleInputChange('fipMakeOther', text)}
                  placeholder="Enter Other FIP Make"
                  placeholderTextColor="#666"
                  editable={!loading}
                />
              </LinearGradient>
            </View>
          </View>
        )}

        {/* Battery Make with Other option */}
        <View style={styles.inputRow}>
          <View style={styles.inputContainer}>
            <LinearGradient
              colors={['#7E5EA9', '#20AEBC']}
              style={styles.inputGradient}>
              <TouchableOpacity
                style={styles.dropdownInput}
                onPress={() => setShowBatteryMakeDropdown(true)}
                disabled={loading}>
                <Text
                  style={
                    formData.batteryMake
                      ? styles.selectedText
                      : styles.placeholderText
                  }>
                  {formData.batteryMake || 'Select Battery Make'}
                </Text>
                <Icon name="keyboard-arrow-down" size={24} color="#666" />
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </View>

        {/* Battery Make Other */}
        {formData.batteryMake === 'Other' && (
          <View style={styles.inputRow}>
            <View style={styles.fullWidthInputContainer}>
              <LinearGradient
                colors={['#7E5EA9', '#20AEBC']}
                style={styles.inputGradient}>
                <TextInput
                  style={styles.textInput}
                  value={formData.batteryMakeOther}
                  onChangeText={text =>
                    handleInputChange('batteryMakeOther', text)
                  }
                  placeholder="Enter Other Battery Make"
                  placeholderTextColor="#666"
                  editable={!loading}
                />
              </LinearGradient>
            </View>
          </View>
        )}

        {/* Exchange Tractor Section */}
        <View style={styles.exchangeSection}>
          <Text style={styles.sectionHeading}>Exchange Tractor Details</Text>

          {/* Is Exchange Tractor */}
          <View style={styles.radioSection}>
            <Text style={styles.radioLabel}>Is Exchange Tractor?</Text>
            <View style={styles.radioOptions}>
              {exchangeOptions.map(option => (
                <TouchableOpacity
                  key={option}
                  style={styles.radioOption}
                  onPress={() => handleExchangeTractorSelect(option)}
                  disabled={loading}>
                  <LinearGradient
                    colors={
                      formData.isExchangeTractor === option
                        ? ['#12C857', '#12C857']
                        : ['#f0f0f0', '#f0f0f0']
                    }
                    style={styles.radioGradient}>
                    <View style={styles.radioInner}>
                      {formData.isExchangeTractor === option && (
                        <Icon name="check" size={24} color="#fff" />
                      )}
                    </View>
                  </LinearGradient>
                  <Text style={styles.radioText}>
                    {option === 'yes' ? 'Yes' : 'No'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Exchange Tractor Fields - Conditionally Rendered */}
          {formData.isExchangeTractor === 'yes' && (
            <>
              {/* Old Tractor Name */}
              <View style={styles.inputRow}>
                <View style={styles.fullWidthInputContainer}>
                  <LinearGradient
                    colors={['#7E5EA9', '#20AEBC']}
                    style={styles.inputGradient}>
                    <TextInput
                      style={styles.textInput}
                      value={formData.oldTractorName}
                      onChangeText={text =>
                        handleInputChange('oldTractorName', text)
                      }
                      placeholder="Old Tractor Name"
                      placeholderTextColor="#666"
                      editable={!loading}
                    />
                  </LinearGradient>
                </View>
              </View>

              {/* Old Tractor Chassis No */}
              <View style={styles.inputRow}>
                <View style={styles.fullWidthInputContainer}>
                  <LinearGradient
                    colors={['#7E5EA9', '#20AEBC']}
                    style={styles.inputGradient}>
                    <TextInput
                      style={styles.textInput}
                      value={formData.oldTractorChassisNo}
                      onChangeText={text =>
                        handleInputChange('oldTractorChassisNo', text)
                      }
                      placeholder="Old Tractor Chassis No"
                      placeholderTextColor="#666"
                      editable={!loading}
                    />
                  </LinearGradient>
                </View>
              </View>

              {/* Old Tractor Year of Manufacture */}
              <View style={styles.inputRow}>
                <View style={styles.fullWidthInputContainer}>
                  <LinearGradient
                    colors={['#7E5EA9', '#20AEBC']}
                    style={styles.inputGradient}>
                    <TextInput
                      style={styles.textInput}
                      value={formData.oldTractorYearOfManufacture}
                      onChangeText={text =>
                        handleInputChange('oldTractorYearOfManufacture', text)
                      }
                      placeholder="Old Tractor Year of Manufacture"
                      placeholderTextColor="#666"
                      editable={!loading}
                    />
                  </LinearGradient>
                </View>
              </View>

              {/* Exchange Deal Amount */}
              <View style={styles.inputRow}>
                <View style={styles.fullWidthInputContainer}>
                  <LinearGradient
                    colors={['#7E5EA9', '#20AEBC']}
                    style={styles.inputGradient}>
                    <TextInput
                      style={styles.textInput}
                      value={formData.exchangeDealAmount}
                      onChangeText={text =>
                        handleInputChange('exchangeDealAmount', text)
                      }
                      placeholder="Exchange Deal Amount"
                      placeholderTextColor="#666"
                      keyboardType="numeric"
                      editable={!loading}
                    />
                  </LinearGradient>
                </View>
              </View>

              {/* Old Tractor Remark */}
              <View style={styles.inputRow}>
                <View style={styles.fullWidthInputContainer}>
                  <LinearGradient
                    colors={['#7E5EA9', '#20AEBC']}
                    style={styles.inputGradient}>
                    <TextInput
                      style={styles.textInput}
                      value={formData.oldTractorRemark}
                      onChangeText={text =>
                        handleInputChange('oldTractorRemark', text)
                      }
                      placeholder="Old Tractor Remark"
                      placeholderTextColor="#666"
                      multiline
                      numberOfLines={2}
                      editable={!loading}
                    />
                  </LinearGradient>
                </View>
              </View>
            </>
          )}
        </View>

        {/* Payment Details Heading */}
        <Text style={styles.sectionHeading}>Payment Details</Text>

        {/* Deal Price */}
        <View style={styles.inputRow}>
          <View style={styles.inputContainer}>
            <LinearGradient
              colors={['#7E5EA9', '#20AEBC']}
              style={styles.inputGradient}>
              <TextInput
                style={styles.textInput}
                value={formData.dealPrice}
                onChangeText={text => handleInputChange('dealPrice', text)}
                placeholder="Deal Price"
                placeholderTextColor="#666"
                keyboardType="numeric"
                editable={!loading}
              />
            </LinearGradient>
          </View>
        </View>

        {/* Amount Paid & Finance Amount Paid */}
        <View style={styles.inputRow}>
          <View style={styles.inputContainer}>
            <LinearGradient
              colors={['#7E5EA9', '#20AEBC']}
              style={styles.inputGradient}>
              <TextInput
                style={styles.textInput}
                value={formData.amountPaid}
                onChangeText={text => handleInputChange('amountPaid', text)}
                placeholder="Amount Paid"
                placeholderTextColor="#666"
                keyboardType="numeric"
                editable={!loading}
              />
            </LinearGradient>
          </View>

          <View style={styles.inputContainer}>
            <View style={{marginBottom: 15}} />
            <LinearGradient
              colors={['#7E5EA9', '#20AEBC']}
              style={styles.inputGradient}>
              <TextInput
                style={styles.textInput}
                value={formData.financeAmountPaid}
                onChangeText={text =>
                  handleInputChange('financeAmountPaid', text)
                }
                placeholder="Finance Amount Paid"
                placeholderTextColor="#666"
                keyboardType="numeric"
                editable={!loading}
              />
            </LinearGradient>
          </View>
        </View>

        {/* Total Paid & Balance Amount */}
        <View style={styles.inputRow}>
          <View style={styles.inputContainer}>
            <Text style={{color: '#666', fontFamily: 'Inter_28pt-SemiBold'}}>
              Total Amount Paid
            </Text>
            <LinearGradient
              colors={['#7E5EA9', '#20AEBC']}
              style={styles.inputGradient}>
              <TextInput
                style={styles.textInput}
                value={formData.totalPaid}
                onChangeText={text => handleInputChange('totalPaid', text)}
                placeholder="Total Paid"
                placeholderTextColor="#666"
                keyboardType="numeric"
                editable={!loading}
              />
            </LinearGradient>
          </View>
          <View style={{marginBottom: 15}} />
          <View style={styles.inputContainer}>
            <Text style={{color: '#666', fontFamily: 'Inter_28pt-SemiBold'}}>
              Total Balance Amount
            </Text>
            <LinearGradient
              colors={['#7E5EA9', '#20AEBC']}
              style={styles.inputGradient}>
              <TextInput
                style={styles.textInput}
                value={formData.balanceAmount}
                onChangeText={text => handleInputChange('balanceAmount', text)}
                placeholder="Balance Amount"
                placeholderTextColor="#666"
                keyboardType="numeric"
                editable={!loading}
              />
            </LinearGradient>
          </View>
        </View>

        {/* Payment Status */}
        <View style={styles.inputRow}>
          <View style={styles.inputContainer}>
            <LinearGradient
              colors={['#7E5EA9', '#20AEBC']}
              style={styles.inputGradient}>
              <TouchableOpacity
                style={styles.dropdownInput}
                onPress={() => setShowPaymentStatusDropdown(true)}
                disabled={loading}>
                <Text
                  style={
                    formData.paymentStatus
                      ? styles.selectedText
                      : styles.placeholderText
                  }>
                  {formData.paymentStatus || 'Select Payment Status'}
                </Text>
                <Icon name="keyboard-arrow-down" size={24} color="#666" />
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </View>

        {/* Financier Name */}
        <View style={styles.inputRow}>
          <View style={styles.inputContainer}>
            <LinearGradient
              colors={['#7E5EA9', '#20AEBC']}
              style={styles.inputGradient}>
              <TouchableOpacity
                style={styles.dropdownInput}
                onPress={() => setShowFinancerDropdown(true)}
                disabled={loading}>
                <Text
                  style={
                    formData.financierName
                      ? styles.selectedText
                      : styles.placeholderText
                  }>
                  {formData.financierName || 'Hypothecation'}
                </Text>
                <Icon name="keyboard-arrow-down" size={24} color="#666" />
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </View>

        {/* Accessories Heading */}
        <View style={styles.accessoriesHeader}>
          <Text style={styles.sectionHeading}>
            Accessories Given With Tractor
          </Text>
        </View>

        {/* Accessories Grid */}
        <View style={styles.accessoriesGrid}>
          {Object.keys(accessories).map((accessory, index) => (
            <TouchableOpacity
              key={accessory}
              style={styles.accessoryItem}
              onPress={() => handleAccessoryToggle(accessory)}
              disabled={loading}>
              <LinearGradient
                colors={
                  accessories[accessory]
                    ? ['#12C857', '#12C857']
                    : ['#f0f0f0', '#f0f0f0']
                }
                style={styles.accessoryCheckbox}>
                <View style={styles.accessoryCheckboxInner}>
                  {accessories[accessory] && (
                    <Icon name="check" size={22} color="#fff" />
                  )}
                </View>
              </LinearGradient>
              <Text style={styles.accessoryText}>
                {accessory
                  .replace(/([A-Z])/g, ' $1')
                  .replace(/^./, str => str.toUpperCase())}{' '}
                Issued
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Terms and Conditions - Conditionally Rendered */}
        {(formData.deliveryMode !== 'Branch' ||
          (formData.deliveryMode === 'Branch' &&
            tractorDelivered === 'yes')) && (
          <View style={styles.termsSection}>
            <Text style={styles.termsHeading}>Terms and Conditions</Text>

            <Text style={styles.termItem}>
              <Text style={{fontSize: 14, fontFamily: 'Inter_28pt-SemiBold'}}>
                Delivery Condition :
              </Text>{' '}
              The Tractor Has Been Delivered To The Customer In Good Physical
              Condition And Fully Operational Working Condition. The Customer
              Has Inspected The Vehicle At The Time Of Delivery And Accepts Its
              Condition As Satisfactory.
            </Text>

            <Text style={styles.termItem}>
              <Text style={{fontSize: 14, fontFamily: 'Inter_28pt-SemiBold'}}>
                Ownership And Registration :
              </Text>{' '}
              The Ownership Of The Tractor Shall Be Transferred To The Customer
              Upon Full Payment And Successful Registration With The Relevant
              Motor Vehicle Authority. The Dealer Will Assist With Documentation
              If Required.
            </Text>

            <Text style={styles.termItem}>
              <Text style={{fontSize: 14, fontFamily: 'Inter_28pt-SemiBold'}}>
                Warranty And Service :
              </Text>{' '}
              The Tractor Is Covered Under The Manufacturer's Standard Warranty
              Policy. All Services And Repairs During The Warranty Period Must
              Be Carried Out At Authorized Service Centers Only.
            </Text>

            <Text style={styles.termItem}>
              <Text style={{fontSize: 14, fontFamily: 'Inter_28pt-SemiBold'}}>
                Liability :
              </Text>{' '}
              The Dealer Shall Not Be Held Liable For Any Damage Or Malfunction
              Arising Form Misuse, Unauthorized Modifications, Or Failure To
              Adhere To The Maintenance Schedule After Delivery.
            </Text>

            <Text style={styles.termItem}>
              <Text style={{fontSize: 14, fontFamily: 'Inter_28pt-SemiBold'}}>
                Payment Terms :
              </Text>{' '}
              Full Payment Has Been Made Prior To Or At The Time Of Delivery
              Unless Otherwise Agreed In Writing. Any Outstanding Amounts Must
              Be Cleared As Per The Mutually Agreed Timeline.
            </Text>

            <Text style={styles.termItem}>
              <Text style={{fontSize: 14, fontFamily: 'Inter_28pt-SemiBold'}}>
                Dispute Resolution :
              </Text>{' '}
              In Case Of Any Disputes Arising From This Delivery, The Matter
              Shall Be Resolved Amicably Between Both Parties. If Unresolved, It
              Will Be Subject To The Jurisdiction Of The Dealer's Location.
            </Text>

            <Text style={styles.termItem}>
              <Text style={{fontSize: 14, fontFamily: 'Inter_28pt-SemiBold'}}>
                Acknowledgement :
              </Text>{' '}
              The Customer Acknowledges And Agrees To The Above Terms And
              Confirms That The Tractor Was Received In A Good And Working
              Condition.
            </Text>

            {/* Accept Terms Checkbox */}
            <TouchableOpacity
              style={styles.termsCheckbox}
              onPress={() => setAcceptTerms(!acceptTerms)}
              activeOpacity={0.8}
              disabled={loading}>
              <LinearGradient
                colors={['grey', 'grey']}
                style={styles.checkboxGradient}>
                <View
                  style={[
                    styles.checkboxInner,
                    acceptTerms && styles.checkboxInnerSelected,
                  ]}>
                  {acceptTerms && <Icon name="check" size={16} color="#fff" />}
                </View>
              </LinearGradient>
              <Text style={styles.termsCheckboxText}>
                Accept All Terms And Conditions
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Signatures Section - Conditionally Rendered */}
        {(formData.deliveryMode !== 'Branch' ||
          (formData.deliveryMode === 'Branch' &&
            tractorDelivered === 'yes')) && (
          <View style={styles.signatureSection}>
            <Text style={styles.signatureSectionHeading}>Signatures</Text>
            
            {/* Customer Signature */}
            {renderSignatureBox(
              'customer',
              customerSignature,
              setCustomerSignature,
              customerOtpVerified,
              handleCustomerSignaturePress,
              'Verify Customer OTP',
            )}

            {/* Manager Signature */}
            {renderSignatureBox(
              'manager',
              managerSignature,
              setManagerSignature,
              managerOtpVerified,
              handleManagerSignaturePress,
              'Verify Manager OTP',
            )}

            {/* Driver Signature */}
            {renderSignatureBox(
              'driver',
              driverSignature,
              setDriverSignature,
              true, // No OTP required for driver
              handleDriverSignaturePress,
              '', // No verify button text for driver
            )}
          </View>
        )}

        {/* Buttons */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={[
              styles.submitButton,
              (loading || (!acceptTerms && shouldShowCustomerDetails)) &&
                styles.disabledButton,
            ]}
            onPress={handleSubmit}
            disabled={loading || (!acceptTerms && shouldShowCustomerDetails)}>
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.buttonText}>
                {isEditMode
                  ? 'Update Delivery Challan'
                  : 'Submit Delivery Challan'}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.homeButton, loading && styles.disabledButton]}
            onPress={handleHome}
            disabled={loading}>
            <Text style={styles.buttonText}>Home</Text>
          </TouchableOpacity>
        </View>

        {/* QR Scanner Modal */}
        {renderQRScanner()}

        {/* OTP Verification Modal */}
        {renderOtpModal()}

        {/* Dropdown Modals */}
        <Modal
          visible={
            showTractorModelDropdown ||
            showTiresMakeDropdown ||
            showFipMakeDropdown ||
            showBatteryMakeDropdown ||
            showPaymentStatusDropdown ||
            showFinancerDropdown ||
            showHypothecationDropdown ||
            showRelationDropdown ||
            showExchangeTractorDropdown
          }
          transparent={true}
          animationType="slide"
          onRequestClose={() => {
            setShowTractorModelDropdown(false);
            setShowTiresMakeDropdown(false);
            setShowFipMakeDropdown(false);
            setShowBatteryMakeDropdown(false);
            setShowPaymentStatusDropdown(false);
            setShowFinancerDropdown(false);
            setShowHypothecationDropdown(false);
            setShowRelationDropdown(false);
            setShowExchangeTractorDropdown(false);
          }}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {showTractorModelDropdown && 'Select Tractor Model'}
                  {showTiresMakeDropdown && 'Select Tires Make'}
                  {showFipMakeDropdown && 'Select FIP Make'}
                  {showBatteryMakeDropdown && 'Select Battery Make'}
                  {showPaymentStatusDropdown && 'Select Payment Status'}
                  {showFinancerDropdown && 'Select Hypothecation'}
                  {showHypothecationDropdown && 'Select Hypothecation'}
                  {showRelationDropdown && 'Select Relation'}
                  {showExchangeTractorDropdown && 'Select Exchange Option'}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setShowTractorModelDropdown(false);
                    setShowTiresMakeDropdown(false);
                    setShowFipMakeDropdown(false);
                    setShowBatteryMakeDropdown(false);
                    setShowPaymentStatusDropdown(false);
                    setShowFinancerDropdown(false);
                    setShowHypothecationDropdown(false);
                    setShowRelationDropdown(false);
                    setShowExchangeTractorDropdown(false);
                  }}
                  style={styles.closeButton}>
                  <Icon name="close" size={24} color="#000" />
                </TouchableOpacity>
              </View>
              <FlatList
                data={
                  showTractorModelDropdown
                    ? tractorModels
                    : showTiresMakeDropdown
                    ? tiresMakes
                    : showFipMakeDropdown
                    ? fipMakes
                    : showBatteryMakeDropdown
                    ? batteryMakes
                    : showPaymentStatusDropdown
                    ? paymentStatuses
                    : showFinancerDropdown
                    ? hypothecationOptions
                    : showHypothecationDropdown
                    ? hypothecationOptions
                    : showRelationDropdown
                    ? relationOptions
                    : showExchangeTractorDropdown
                    ? exchangeOptions
                    : []
                }
                renderItem={renderDropdownItem}
                keyExtractor={(item, index) => index.toString()}
                style={styles.dropdownList}
              />
            </View>
          </View>
        </Modal>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    color: 'white',
    fontFamily: 'Inter_28pt-SemiBold',
  },
  editModeText: {
    fontSize: 12,
    color: '#f0e6ff',
    fontFamily: 'Inter_28pt-SemiBold',
    marginTop: 5,
  },
  scrollView: {
    flex: 1,
    padding: 15,
  },
  // OTP Status Styles
  otpStatusContainer: {
    backgroundColor: '#f8f9fa',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  otpStatusTitle: {
    fontSize: 14,
    fontFamily: 'Inter_28pt-SemiBold',
    color: '#000',
    marginBottom: 10,
    textAlign: 'center',
  },
  otpStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  otpStatusLabel: {
    fontSize: 14,
    fontFamily: 'Inter_28pt-Medium',
    color: '#000',
    width: 100,
  },
  otpStatusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 10,
  },
  otpVerified: {
    backgroundColor: '#4CAF50',
  },
  otpPending: {
    backgroundColor: '#FF9800',
  },
  otpStatusText: {
    fontSize: 12,
    color: '#fff',
    fontFamily: 'Inter_28pt-Medium',
  },
  formNoContainer: {
    marginBottom: 15,
  },
  formNoInputContainer: {
    width: '100%',
  },
  inputGradient: {
    borderRadius: 8,
    padding: 1.2,
    position: 'relative',
  },
  textInput: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    fontSize: 14,
    color: '#000',
  },
  iconButton: {
    padding: 4,
    marginRight: 8,
  },
  deliveryModeContainer: {
    marginBottom: 10,
  },
  sectionLabel: {
    fontSize: 17,
    marginBottom: 10,
    color: '#000',
    fontFamily: 'Inter_28pt-SemiBold',
    marginTop: 15,
  },
  deliveryModeButtons: {
    flexDirection: 'row',
  },
  deliveryModeButton: {
    marginHorizontal: 5,
    borderRadius: 8,
  },
  deliveryModeGradient: {
    padding: 1,
    borderRadius: 8,
  },
  deliveryModeText: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    textAlign: 'center',
    backgroundColor: '#fff',
    color: '#000',
    borderRadius: 8,
    fontSize: 14,
  },
  deliveryModeTextSelected: {
    color: '#fff',
    backgroundColor: 'transparent',
  },
  sectionHeading: {
    fontSize: 17,
    fontFamily: 'Inter_28pt-SemiBold',
    color: '#000',
    marginBottom: 10,
    marginTop: 10,
  },
  signatureSectionHeading: {
    fontSize: 17,
    fontFamily: 'Inter_28pt-SemiBold',
    color: '#000',
    marginBottom: 15,
    marginTop: 10,
    textAlign: 'center',
  },
  inputRow: {
    marginVertical: 10,
  },
  inputContainer: {
    flex: 1,
  },
  fullWidthInputContainer: {
    width: '100%',
    marginBottom: 1,
  },
  dropdownInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
  },
  selectedText: {
    fontSize: 14,
    color: '#000',
  },
  placeholderText: {
    fontSize: 14,
    color: '#666',
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  radioSection: {
    marginBottom: 20,
  },
  radioLabel: {
    fontSize: 17,
    marginBottom: 15,
    color: '#000',
    fontWeight: '500',
    marginTop: 10,
  },
  radioOptions: {
    flexDirection: 'row',
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  radioGradient: {
    width: 25,
    height: 25,
    borderRadius: 3,
    marginRight: 10,
  },
  radioInner: {
    width: 25,
    height: 25,
    borderRadius: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioText: {
    fontSize: 17,
    color: '#000',
    fontFamily: 'Inter_28pt-Regular',
  },
  accessoriesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  accessoriesGrid: {
    marginBottom: 0,
  },
  accessoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '70%',
    marginBottom: 25,
  },
  accessoryCheckbox: {
    width: 25,
    height: 25,
    borderRadius: 4,
    padding: 0,
    marginRight: 8,
  },
  accessoryCheckboxInner: {
    width: 25,
    height: 25,
    borderRadius: 3,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  accessoryText: {
    fontSize: 14.5,
    color: '#000',
    flex: 1,
    fontFamily: 'Inter_28pt-Regular',
  },
  buttonsContainer: {
    marginTop: 20,
    marginBottom: 30,
  },
  submitButton: {
    backgroundColor: '#7E5EA9',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  homeButton: {
    backgroundColor: '#20AEBC',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter_28pt-SemiBold',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // OTP Modal Styles
  otpModalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    width: '90%',
    maxHeight: '50%',
    overflow: 'hidden',
  },
  otpContent: {
    padding: 20,
  },
  otpInfoText: {
    fontSize: 14,
    fontFamily: 'Inter_28pt-Regular',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  otpInput: {
    borderWidth: 1,
    borderColor: '#7E5EA9',
    borderRadius: 8,
    padding: 15,
    fontSize: 18,
    textAlign: 'center',
    fontFamily: 'Inter_28pt-Medium',
    color: '#000',
    marginBottom: 15,
    letterSpacing: 5,
  },
  otpTimerContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  otpTimerText: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Inter_28pt-Regular',
  },
  resendButton: {
    padding: 8,
  },
  resendButtonText: {
    fontSize: 14,
    color: '#7E5EA9',
    fontFamily: 'Inter_28pt-Medium',
  },
  verifyButton: {
    backgroundColor: '#7E5EA9',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  verifyButtonText: {
    fontSize: 16,
    color: '#fff',
    fontFamily: 'Inter_28pt-SemiBold',
  },
  // Signature Column Layout
  signatureSection: {
    marginBottom: 20,
  },
  signatureColumn: {
    marginBottom: 20,
  },
  signatureLabel: {
    fontSize: 16,
    fontFamily: 'Inter_28pt-Medium',
    color: '#000',
    marginBottom: 10,
    marginLeft: 5,
  },
  // OTP Indicator in Signature Box
  otpIndicatorContainer: {
    marginTop: 5,
    marginBottom: 5,
  },
  otpIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  otpIndicatorText: {
    fontSize: 10,
    color: '#fff',
    fontFamily: 'Inter_28pt-Medium',
    marginLeft: 4,
  },
  // Verify and Upload Signature Buttons
  verifySignatureButton: {
    backgroundColor: '#7E5EA9',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 5,
  },
  verifySignatureButtonText: {
    fontSize: 14,
    color: '#fff',
    fontFamily: 'Inter_28pt-Medium',
  },
  uploadSignatureButton: {
    backgroundColor: '#20AEBC',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 5,
  },
  uploadSignatureButtonText: {
    fontSize: 14,
    color: '#fff',
    fontFamily: 'Inter_28pt-Medium',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    width: '90%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  closeButton: {
    padding: 4,
  },
  dropdownList: {
    maxHeight: 300,
  },
  dropdownItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dropdownItemText: {
    fontSize: 14,
    color: '#333',
  },
  termsSection: {
    marginBottom: 20,
    borderRadius: 10,
    marginTop: 10,
  },
  termsHeading: {
    fontSize: 16,
    fontFamily: 'Inter_28pt-SemiBold',
    marginBottom: 10,
    color: '#000',
  },
  termItem: {
    fontSize: 12,
    color: '#333',
    marginBottom: 10,
    lineHeight: 16,
    fontFamily: 'Inter_28pt-Medium',
  },
  termsCheckbox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  checkboxGradient: {
    borderRadius: 4,
    padding: 1,
    marginRight: 10,
  },
  checkboxInner: {
    width: 20,
    height: 20,
    borderRadius: 3,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxInnerSelected: {
    backgroundColor: '#12C857',
  },
  termsCheckboxText: {
    fontSize: 14,
    color: '#000',
  },
  photoSignatureBox1: {
    width: '100%',
    height: 80,
    borderWidth: 1,
    borderColor: '#00000080',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderStyle: 'dashed',
    backgroundColor: '#f9f9f9',
  },
  photoSignatureText: {
    fontSize: 13,
    textAlign: 'center',
    color: '#00000099',
    fontFamily: 'Inter_28pt-Medium',
  },
  optionalText: {
    fontSize: 10,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 2,
    fontFamily: 'Inter_28pt-Medium',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  disabledButton: {
    opacity: 0.6,
  },
  branchSection: {
    marginBottom: 15,
  },
  tractorDeliveredSection: {
    marginBottom: 15,
  },
  representativeSection: {
    marginBottom: 15,
  },
  exchangeSection: {
    marginBottom: 15,
  },
  loadingIndicator: {
    position: 'absolute',
    right: 10,
    top: '50%',
    marginTop: -8,
  },
});

export default DeliveryChallan;