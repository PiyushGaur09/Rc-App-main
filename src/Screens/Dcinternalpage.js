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
//   Linking,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import {useSafeAreaInsets} from 'react-native-safe-area-context';
// import LinearGradient from 'react-native-linear-gradient';
// import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
// import DateTimePicker from '@react-native-community/datetimepicker';
// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import {Camera} from 'react-native-camera-kit';

// const Dcinternalpage = ({navigation, route}) => {
//   const insets = useSafeAreaInsets();
//   const [userId, setUserId] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [fetchLoading, setFetchLoading] = useState(true);
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [existingFormId, setExistingFormId] = useState(null);
//   const [existingFormNo, setExistingFormNo] = useState(null);
//   const [status, setStatus] = useState('pending');
//   const [acceptTerms, setAcceptTerms] = useState(false);

//   // QR Scanner States
//   const [showChassisScanner, setShowChassisScanner] = useState(false);
//   const [showEngineScanner, setShowEngineScanner] = useState(false);
//   const [hasCameraPermission, setHasCameraPermission] = useState(false);

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

//   const [formData, setFormData] = useState({
//     formNo: '',
//     date: null,
//     deliveryMode: 'Customer',
//     challanCreatedBy: '',
//     customerName: '',
//     parentage: '',
//     address: '',
//     hypothecation: '',
//     hypothecationOther: '',
//     mobileNo: '',
//     areYouCustomer: '',
//     tractorName: '',
//     tractorModel: '',
//     chassisNo: '',
//     engineNo: '',
//     yearOfManufacture: '',
//     tiresMake: '',
//     tiresMakeOther: '',
//     fipMake: '',
//     fipMakeOther: '',
//     batteryMake: '',
//     batteryMakeOther: '',
//     dealPrice: '',
//     cashPaid: '',
//     financeAmountPaid: '',
//     totalPaid: '',
//     balanceAmount: '',
//     paymentStatus: '',
//     financerName: '',
//     financerOther: '',
//     // Branch fields
//     branchName: '',
//     branchPersonName: '',
//     branchAddress: '',
//     branchMobileNumber: '',
//     // Representative fields
//     representativeName: '',
//     representativeFatherName: '',
//     representativeAddress: '',
//     representativeMobileNumber: '',
//     representativeRelation: '',
//     representativeRelationOther: '',
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

//   // Helper function to make absolute URLs
//   const makeAbsoluteUrl = relativePath => {
//     if (!relativePath) return null;
//     if (relativePath.startsWith('http')) return relativePath;
//     return `https://argosmob.uk/makroo/public/${relativePath.replace(
//       /^\/+/,
//       '',
//     )}`;
//   };

//   // Get form ID from route params and fetch data
//   useEffect(() => {
//     const getUserData = async () => {
//       try {
//         const storedUserId = await AsyncStorage.getItem('userId');
//         if (storedUserId) {
//           setUserId(storedUserId);
//         }
//       } catch (error) {
//         console.log('Error loading user data:', error);
//       }
//     };

//     getUserData();

//     const formId = route.params?.formId;
//     const formStatus = route.params?.status;

//     if (formId) {
//       setExistingFormId(formId);
//       setStatus(formStatus || 'pending');
//       fetchFormData(formId);
//     } else {
//       Alert.alert('Error', 'No form data provided');
//       navigation.goBack();
//     }
//   }, [route.params]);

//   const fetchFormData = async formId => {
//     try {
//       setFetchLoading(true);
//       const formDataToSend = new FormData();
//       formDataToSend.append('id', formId.toString());

//       console.log('formDataToSend', formDataToSend);

//       const config = {
//         method: 'post',
//         url: 'https://argosmob.uk/makroo/public/api/v1/delivery-challan/form/get',
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//         data: formDataToSend,
//         timeout: 30000,
//       };

//       const response = await axios(config);

//       if (response.data.status && response.data.data) {
//         const data = response.data.data;

//         // Set status from backend
//         setStatus(data.status || 'pending');
//         setExistingFormNo(data.form_no);

//         // Populate all form fields
//         populateFormData(data);
//       } else {
//         Alert.alert('Error', 'Failed to fetch form data');
//       }
//     } catch (error) {
//       console.log('Fetch Error:', error);
//       Alert.alert('Error', 'Failed to load form data');
//     } finally {
//       setFetchLoading(false);
//     }
//   };

//   const populateFormData = data => {
//     // Basic form data
//     setFormData({
//       formNo: data.form_no || '',
//       date: data.select_date ? new Date(data.select_date) : null,
//       deliveryMode:
//         data.delivery_mode === 'Self Pickup' ? 'Customer' : 'Branch',
//       challanCreatedBy: data.challan_created_by || '',
//       customerName: data.customer_name || '',
//       parentage: data.parentage || '',
//       address: data.address || '',
//       hypothecation: data.hypothecation || '',
//       hypothecationOther: data.hypothecation_other || '',
//       mobileNo: data.mobile_no || '',
//       areYouCustomer: data.is_customer?.toString() || '',
//       tractorName: data.tractor_name || '',
//       tractorModel: data.tractor_model || '',
//       chassisNo: data.chassis_no || '',
//       engineNo: data.engine_no || '',
//       yearOfManufacture: data.year_of_manufacture || '',
//       tiresMake: data.tire_make || '',
//       tiresMakeOther: data.tire_make_other || '',
//       fipMake: data.fip_make || '',
//       fipMakeOther: data.fip_make_other || '',
//       batteryMake: data.battery_make || '',
//       batteryMakeOther: data.battery_make_other || '',
//       dealPrice: data.deal_price || '',
//       cashPaid: data.amount_paid || '',
//       financeAmountPaid: data.finance_amount_paid || '',
//       totalPaid: data.total_paid || '',
//       balanceAmount: data.balance_amount || '',
//       paymentStatus: data.payment_status || '',
//       financerName: data.financier_name || '',
//       financerOther: data.financier_other || '',
//       branchName: data.branch_name || '',
//       branchPersonName: data.branch_person_name || '',
//       branchAddress: data.branch_address || '',
//       branchMobileNumber: data.branch_phone || '',
//       representativeName: data.relative_name || '',
//       representativeFatherName: data.relative_father_name || '',
//       representativeAddress: data.relative_address || '',
//       representativeMobileNumber: data.relative_phone || '',
//       representativeRelation: data.relative_relation || '',
//       representativeRelationOther: data.relation_other || '',
//     });

//     // Set accessories from JSON string if available
//     if (data.accessories) {
//       try {
//         const accessoriesData =
//           typeof data.accessories === 'string'
//             ? JSON.parse(data.accessories)
//             : data.accessories;

//         // Convert accessories data to boolean values
//         const updatedAccessories = {...accessories};
//         Object.keys(accessoriesData).forEach(key => {
//           if (accessoriesData[key] === 'Yes' || accessoriesData[key] === true) {
//             const accessoryKey = key.toLowerCase().replace(/\s+/g, '');
//             if (updatedAccessories.hasOwnProperty(accessoryKey)) {
//               updatedAccessories[accessoryKey] = true;
//             }
//           }
//         });
//         setAccessories(updatedAccessories);
//       } catch (error) {
//         console.log('Error parsing accessories:', error);
//       }
//     }

//     // Load existing images
//     if (data.customer_signature) {
//       const customerSignatureUri = makeAbsoluteUrl(data.customer_signature);
//       setCustomerSignature(customerSignatureUri);
//     }
//     if (data.manager_signature) {
//       const managerSignatureUri = makeAbsoluteUrl(data.manager_signature);
//       setManagerSignature(managerSignatureUri);
//     }
//     if (data.driver_signature) {
//       const driverSignatureUri = makeAbsoluteUrl(data.driver_signature);
//       setDriverSignature(driverSignatureUri);
//     }

//     // Accept terms for viewing
//     setAcceptTerms(true);
//   };

//   // Camera Permission Function
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
//     if (!isEditMode) return;
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
//     if (!isEditMode) return;
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

//   // Image handling functions
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

//   const showImageSourceOptions = (
//     setImageFunction,
//     title = 'Select Image Source',
//   ) => {
//     if (!isEditMode) {
//       Alert.alert(
//         'Cannot Edit',
//         'This form cannot be edited in its current status.',
//       );
//       return;
//     }

//     if (Platform.OS === 'ios') {
//       ActionSheetIOS.showActionSheetWithOptions(
//         {
//           options: ['Cancel', 'Take Photo', 'Choose from Gallery'],
//           cancelButtonIndex: 0,
//         },
//         async buttonIndex => {
//           if (buttonIndex === 1) {
//             const hasPermission = await requestCameraPermissionForImage();
//             if (!hasPermission) {
//               Alert.alert(
//                 'Permission Denied',
//                 'Camera permission is required to take photos.',
//               );
//               return;
//             }
//             openCamera(setImageFunction);
//           } else if (buttonIndex === 2) {
//             openGallery(setImageFunction);
//           }
//         },
//       );
//     } else {
//       Alert.alert(title, 'Choose how you want to capture the image', [
//         {text: 'Cancel', style: 'cancel'},
//         {
//           text: 'Take Photo',
//           onPress: async () => {
//             const hasPermission = await requestCameraPermissionForImage();
//             if (!hasPermission) {
//               Alert.alert(
//                 'Permission Denied',
//                 'Camera permission is required to take photos.',
//               );
//               return;
//             }
//             openCamera(setImageFunction);
//           },
//         },
//         {
//           text: 'Choose from Gallery',
//           onPress: () => openGallery(setImageFunction),
//         },
//       ]);
//     }
//   };

//   const openCamera = setImageFunction => {
//     const options = {
//       mediaType: 'photo',
//       quality: 0.8,
//       maxWidth: 800,
//       maxHeight: 800,
//       cameraType: 'back',
//       saveToPhotos: false,
//     };

//     launchCamera(options, response => {
//       if (response.didCancel) {
//         console.log('User cancelled camera');
//       } else if (response.error) {
//         console.log('Camera Error: ', response.error);
//         Alert.alert('Error', 'Failed to capture image');
//       } else if (response.assets && response.assets.length > 0) {
//         const uri = response.assets[0].uri;
//         setImageFunction(uri);
//       }
//     });
//   };

//   const openGallery = setImageFunction => {
//     const options = {
//       mediaType: 'photo',
//       quality: 0.8,
//       maxWidth: 800,
//       maxHeight: 800,
//     };

//     launchImageLibrary(options, response => {
//       if (response.didCancel) {
//         console.log('User cancelled image picker');
//       } else if (response.error) {
//         console.log('ImagePicker Error: ', response.error);
//         Alert.alert('Error', 'Failed to pick image');
//       } else if (response.assets && response.assets.length > 0) {
//         const uri = response.assets[0].uri;
//         setImageFunction(uri);
//       }
//     });
//   };

//   const handleInputChange = (field, value) => {
//     setFormData(prev => ({
//       ...prev,
//       [field]: value,
//     }));
//   };

//   const handleDeliveryModeSelect = mode => {
//     handleInputChange('deliveryMode', mode);
//   };

//   const handleAreYouCustomerSelect = value => {
//     handleInputChange('areYouCustomer', value === 'Yes' ? '1' : '0');
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
//     handleInputChange('tiresMake', make);
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

//   const handleFinancerSelect = financer => {
//     handleInputChange('financerName', financer);
//     setShowFinancerDropdown(false);
//   };

//   const handleHypothecationSelect = option => {
//     handleInputChange('hypothecation', option);
//     setShowHypothecationDropdown(false);
//   };

//   const handleRelationSelect = relation => {
//     handleInputChange('representativeRelation', relation);
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

//   // Edit Mode Handler - Only allow editing when status is 'edited'
//   const handleEditPress = () => {
//     if (status === 'edited') {
//       setIsEditMode(true);
//     } else {
//       Alert.alert(
//         'Cannot Edit',
//         'This form cannot be edited in its current status.',
//       );
//     }
//   };

//   const handleCancelEdit = () => {
//     setIsEditMode(false);
//     if (existingFormId) {
//       fetchFormData(existingFormId);
//     }
//   };

//   // Calculate total paid and balance amount automatically
//   useEffect(() => {
//     if (isEditMode) {
//       const cashPaid = parseFloat(formData.cashPaid) || 0;
//       const financeAmountPaid = parseFloat(formData.financeAmountPaid) || 0;
//       const totalPaid = cashPaid + financeAmountPaid;
//       const dealPrice = parseFloat(formData.dealPrice) || 0;
//       const balance = dealPrice - totalPaid;

//       handleInputChange('totalPaid', totalPaid.toString());
//       handleInputChange('balanceAmount', balance.toString());
//     }
//   }, [
//     formData.cashPaid,
//     formData.financeAmountPaid,
//     formData.dealPrice,
//     isEditMode,
//   ]);

//   // Validate Form for Update
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

//     if (!formData.areYouCustomer) {
//       Alert.alert('Validation Error', 'Please select if you are the customer');
//       return false;
//     }

//     // Branch validation
//     if (formData.deliveryMode === 'Branch') {
//       const branchFields = [
//         'branchName',
//         'branchPersonName',
//         'branchAddress',
//         'branchMobileNumber',
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
//     }

//     // Representative validation
//     if (formData.areYouCustomer === '0') {
//       const representativeFields = [
//         'representativeName',
//         'representativeFatherName',
//         'representativeAddress',
//         'representativeMobileNumber',
//         'representativeRelation',
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
//         formData.representativeRelation === 'Other' &&
//         (!formData.representativeRelationOther ||
//           formData.representativeRelationOther.trim() === '')
//       ) {
//         Alert.alert('Validation Error', 'Please specify the relation');
//         return false;
//       }
//     }

//     if (!customerSignature) {
//       Alert.alert('Validation Error', 'Please add customer signature');
//       return false;
//     }

//     if (!managerSignature) {
//       Alert.alert('Validation Error', 'Please add manager signature');
//       return false;
//     }

//     if (!driverSignature) {
//       Alert.alert('Validation Error', 'Please add driver signature');
//       return false;
//     }

//     if (!acceptTerms) {
//       Alert.alert('Validation Error', 'Please accept the terms and conditions');
//       return false;
//     }

//     return true;
//   };

//   const prepareAccessoriesData = () => {
//     const accessoriesData = {};

//     // Map our state keys to the expected API keys
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

//     // Add empty Other array as shown in API example
//     accessoriesData.Other = [];

//     return JSON.stringify(accessoriesData);
//   };

//   const prepareFormData = () => {
//     const formDataToSend = new FormData();

//     formDataToSend.append('id', existingFormId.toString());
//     formDataToSend.append('form_no', existingFormNo);

//     formDataToSend.append('user_id', userId);
//     formDataToSend.append('form_no', formData.formNo || existingFormNo);
//     formDataToSend.append(
//       'select_date',
//       formData.date
//         ? formData.date.toISOString().split('T')[0]
//         : new Date().toISOString().split('T')[0],
//     );
//     formDataToSend.append(
//       'delivery_mode',
//       formData.deliveryMode === 'Customer' ? 'Self Pickup' : 'Branch',
//     );
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
//     formDataToSend.append(
//       'is_customer',
//       formData.areYouCustomer === '1' ? 1 : 0,
//     );
//     formDataToSend.append('tractor_name', formData.tractorName);
//     formDataToSend.append('tractor_model', formData.tractorModel);
//     formDataToSend.append('chassis_no', formData.chassisNo);
//     formDataToSend.append('engine_no', formData.engineNo);
//     formDataToSend.append('year_of_manufacture', formData.yearOfManufacture);
//     formDataToSend.append('tyres_make', formData.tiresMake || '');
//     formDataToSend.append('fip_make', formData.fipMake || '');
//     formDataToSend.append('battery_make', formData.batteryMake || '');
//     formDataToSend.append('deal_price', formData.dealPrice);
//     formDataToSend.append('amount_paid', formData.cashPaid || '0');
//     formDataToSend.append(
//       'finance_amount_paid',
//       formData.financeAmountPaid || '0',
//     );
//     formDataToSend.append('total_paid', formData.totalPaid || '0');
//     formDataToSend.append('balance_amount', formData.balanceAmount || '0');
//     formDataToSend.append('payment_status', formData.paymentStatus);
//     formDataToSend.append('financier_name', formData.financerName || '');

//     // Add accessories
//     formDataToSend.append('accessories', prepareAccessoriesData());

//     // Add branch fields with correct API field names
//     formDataToSend.append('branch_name', formData.branchName || '');
//     formDataToSend.append(
//       'branch_person_name',
//       formData.branchPersonName || '',
//     );
//     formDataToSend.append('branch_address', formData.branchAddress || '');
//     formDataToSend.append('branch_phone', formData.branchMobileNumber || '');

//     // Add representative fields with correct API field names
//     formDataToSend.append('relative_name', formData.representativeName || '');
//     formDataToSend.append(
//       'relative_father_name',
//       formData.representativeFatherName || '',
//     );
//     formDataToSend.append(
//       'relative_address',
//       formData.representativeAddress || '',
//     );
//     formDataToSend.append(
//       'relative_phone',
//       formData.representativeMobileNumber || '',
//     );
//     formDataToSend.append(
//       'relative_relation',
//       formData.representativeRelation || '',
//     );
//     formDataToSend.append(
//       'relation_other',
//       formData.representativeRelationOther || '',
//     );

//     // Add other fields for tires, fip, battery
//     if (formData.tiresMake === 'Other') {
//       formDataToSend.append('tire_make_other', formData.tiresMakeOther || '');
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

//     // Add images with proper file names
//     if (customerSignature && customerSignature.startsWith('file://')) {
//       formDataToSend.append('customer_signature', {
//         uri: customerSignature,
//         type: 'image/jpeg',
//         name: `customer_signature_${Date.now()}.jpg`,
//       });
//     }

//     if (managerSignature && managerSignature.startsWith('file://')) {
//       formDataToSend.append('manager_signature', {
//         uri: managerSignature,
//         type: 'image/jpeg',
//         name: `manager_signature_${Date.now()}.jpg`,
//       });
//     }

//     if (driverSignature && driverSignature.startsWith('file://')) {
//       formDataToSend.append('driver_signature', {
//         uri: driverSignature,
//         type: 'image/jpeg',
//         name: `driver_signature_${Date.now()}.jpg`,
//       });
//     }

//     return formDataToSend;
//   };

//   // Save Updated Data
//   const handleUpdate = async () => {
//     if (!validateForm()) {
//       return;
//     }

//     setLoading(true);

//     try {
//       const formDataToSend = prepareFormData();

//       const config = {
//         method: 'post',
//         url: 'https://argosmob.uk/makroo/public/api/v1/delivery-challan/form/update',
//         headers: {
//           'Content-Type': 'multipart/form-data',
//           Accept: 'application/json',
//         },
//         data: formDataToSend,
//         timeout: 30000,
//       };

//       const response = await axios(config);

//       if (
//         response.data &&
//         (response.data.success === true ||
//           response.data.status === 'success' ||
//           response.data.message?.toLowerCase().includes('success'))
//       ) {
//         // Update local state with new status from response
//         setStatus(response.data.data?.status || 'pending');
//         setIsEditMode(false);

//         Alert.alert(
//           'Success',
//           response.data.message ||
//             'Delivery Challan updated successfully! Form is now pending approval.',
//           [
//             {
//               text: 'OK',
//               onPress: () => {
//                 // Refresh data
//                 fetchFormData(existingFormId);
//               },
//             },
//           ],
//         );
//       } else {
//         const errorMessage = response.data?.message || 'Failed to update form';
//         Alert.alert('Update Failed', errorMessage);
//       }
//     } catch (error) {
//       console.log('Update Error:', error);
//       let errorMessage = 'Something went wrong. Please try again.';

//       if (error.response) {
//         if (error.response.status === 422) {
//           const validationErrors = error.response.data.errors;
//           if (validationErrors) {
//             const firstErrorKey = Object.keys(validationErrors)[0];
//             const firstError = validationErrors[firstErrorKey];
//             errorMessage = firstError
//               ? firstError[0]
//               : 'Please check all required fields';
//           } else {
//             errorMessage =
//               error.response.data.message || 'Validation error occurred';
//           }
//         } else {
//           const serverError = error.response.data;
//           errorMessage =
//             serverError.message ||
//             serverError.error ||
//             `Server error: ${error.response.status}`;
//         }
//       } else if (error.request) {
//         errorMessage = 'Network error. Please check your internet connection.';
//       }

//       Alert.alert('Update Failed', errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Download PDF Handler
//   const handleDownloadPDF = async () => {
//     if (!existingFormId) {
//       Alert.alert('Error', 'Form data not available');
//       return;
//     }

//     setLoading(true);

//     try {
//       const config = {
//         method: 'get',
//         url: `https://argosmob.uk/makroo/public/api/v1/delivery-challan/form/generate-pdf/${existingFormId}`,
//         timeout: 30000,
//       };

//       const response = await axios(config);

//       if (response.data.status && response.data.pdf_link) {
//         await Linking.openURL(response.data.pdf_link);
//         Alert.alert('Success', 'PDF opened in browser');
//       } else {
//         Alert.alert('Error', 'Failed to generate PDF');
//       }
//     } catch (error) {
//       console.log('PDF Error:', error);
//       Alert.alert('Error', 'Failed to download PDF. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDateIconPress = () => {
//     if (!isEditMode) return;
//     setShowDatePicker(true);
//   };

//   const handleManufactureDateIconPress = () => {
//     if (!isEditMode) return;
//     setShowManufactureDatePicker(true);
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
//         else if (showFinancerDropdown) handleFinancerSelect(item);
//         else if (showHypothecationDropdown) handleHypothecationSelect(item);
//         else if (showRelationDropdown) handleRelationSelect(item);
//       }}>
//       <Text style={styles.dropdownItemText}>{item}</Text>
//     </TouchableOpacity>
//   );

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

//   const renderInputField = (
//     value,
//     onChange,
//     placeholder,
//     keyboardType = 'default',
//     editable = true,
//   ) => {
//     if (isEditMode) {
//       return (
//         <TextInput
//           style={styles.textInput}
//           value={value}
//           onChangeText={onChange}
//           placeholder={placeholder}
//           placeholderTextColor="#666"
//           editable={editable && !loading}
//           keyboardType={keyboardType}
//         />
//       );
//     } else {
//       return (
//         <Text style={[styles.textInput, styles.readOnlyInput]}>
//           {value || 'Not provided'}
//         </Text>
//       );
//     }
//   };

//   const renderDropdownField = (value, onPress, placeholder) => {
//     if (isEditMode) {
//       return (
//         <TouchableOpacity
//           style={styles.dropdownInput}
//           onPress={onPress}
//           disabled={loading}>
//           <Text style={value ? styles.selectedText : styles.placeholderText}>
//             {value || placeholder}
//           </Text>
//           <Icon name="keyboard-arrow-down" size={24} color="#666" />
//         </TouchableOpacity>
//       );
//     } else {
//       return (
//         <Text style={[styles.textInput, styles.readOnlyInput]}>
//           {value || 'Not provided'}
//         </Text>
//       );
//     }
//   };

//   const renderDateField = (date, onPress, placeholder) => {
//     if (isEditMode) {
//       return (
//         <View style={styles.inputWithIcon}>
//           <TouchableOpacity
//             style={[styles.textInput, {flex: 1}]}
//             onPress={onPress}
//             disabled={loading}>
//             <Text style={date ? styles.selectedText : styles.placeholderText}>
//               {date ? date.toLocaleDateString() : placeholder}
//             </Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={styles.iconButton}
//             onPress={onPress}
//             disabled={loading}>
//             <Icon name="calendar-today" size={20} color="#666" />
//           </TouchableOpacity>
//         </View>
//       );
//     } else {
//       return (
//         <Text style={[styles.textInput, styles.readOnlyInput]}>
//           {date ? date.toLocaleDateString() : 'Not provided'}
//         </Text>
//       );
//     }
//   };

//   const renderManufactureDateField = (value, onPress, placeholder) => {
//     if (isEditMode) {
//       return (
//         <View style={styles.inputWithIcon}>
//           <TouchableOpacity
//             style={[styles.textInput, {flex: 1}]}
//             onPress={onPress}
//             disabled={loading}>
//             <Text style={value ? styles.selectedText : styles.placeholderText}>
//               {value || placeholder}
//             </Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={styles.iconButton}
//             onPress={onPress}
//             disabled={loading}>
//             <Icon name="calendar-today" size={20} color="#666" />
//           </TouchableOpacity>
//         </View>
//       );
//     } else {
//       return (
//         <Text style={[styles.textInput, styles.readOnlyInput]}>
//           {value || 'Not provided'}
//         </Text>
//       );
//     }
//   };

//   const renderSignatureBox = (imageUri, setImageFunction, label) => (
//     <View style={styles.signatureContainer}>
//       <Text style={styles.signatureLabel}>{label}</Text>
//       {imageUri ? (
//         <View style={styles.signatureImageContainer}>
//           <Image source={{uri: imageUri}} style={styles.signatureImage} />
//           {isEditMode && (
//             <TouchableOpacity
//               style={styles.changeSignatureButton}
//               onPress={() =>
//                 showImageSourceOptions(setImageFunction, `Update ${label}`)
//               }>
//               <Text style={styles.changeSignatureText}>Change {label}</Text>
//             </TouchableOpacity>
//           )}
//         </View>
//       ) : (
//         <View style={styles.signatureImageContainer}>
//           {isEditMode && (
//             <TouchableOpacity
//               style={styles.addSignatureButton}
//               onPress={() =>
//                 showImageSourceOptions(setImageFunction, `Add ${label}`)
//               }>
//               <Text style={styles.addSignatureText}>Add {label}</Text>
//             </TouchableOpacity>
//           )}
//         </View>
//       )}
//     </View>
//   );

//   const renderRadioOption = (value, currentValue, label, onPress) => (
//     <TouchableOpacity
//       style={[
//         styles.radioOption,
//         currentValue === value && styles.radioOptionSelected,
//       ]}
//       onPress={onPress}
//       disabled={!isEditMode || loading}>
//       <LinearGradient
//         colors={
//           currentValue === value
//             ? ['#12C857', '#12C857']
//             : ['#f0f0f0', '#f0f0f0']
//         }
//         style={styles.radioGradient}>
//         <View style={styles.radioInner}>
//           {currentValue === value && (
//             <Icon name="check" size={24} color="#fff" />
//           )}
//         </View>
//       </LinearGradient>
//       <Text style={styles.radioText}>{label}</Text>
//     </TouchableOpacity>
//   );

//   const renderAccessoryItem = (accessory, label) => (
//     <TouchableOpacity
//       style={styles.accessoryItem}
//       onPress={() => isEditMode && handleAccessoryToggle(accessory)}
//       disabled={!isEditMode || loading}>
//       <LinearGradient
//         colors={
//           accessories[accessory]
//             ? ['#12C857', '#12C857']
//             : ['#f0f0f0', '#f0f0f0']
//         }
//         style={styles.accessoryCheckbox}>
//         <View style={styles.accessoryCheckboxInner}>
//           {accessories[accessory] && (
//             <Icon name="check" size={22} color="#fff" />
//           )}
//         </View>
//       </LinearGradient>
//       <Text style={styles.accessoryText}>{label}</Text>
//     </TouchableOpacity>
//   );

//   if (fetchLoading) {
//     return (
//       <View
//         style={{
//           flex: 1,
//           paddingTop: insets.top,
//           justifyContent: 'center',
//           alignItems: 'center',
//         }}>
//         <ActivityIndicator size="large" color="#7E5EA9" />
//         <Text style={{marginTop: 10}}>Loading form data...</Text>
//       </View>
//     );
//   }

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
//         <TouchableOpacity
//           onPress={() => navigation.goBack()}
//           style={styles.backButton}>
//           <Icon name="arrow-back" size={24} color="white" />
//         </TouchableOpacity>
//         <View style={styles.headerTitleContainer}>
//           <Text style={styles.headerTitle}>Delivery Challan</Text>
//           {isEditMode && <Text style={styles.editModeText}>Edit Mode</Text>}
//         </View>
//       </LinearGradient>

//       <ScrollView style={styles.scrollView}>
//         {/* Form Header */}
//         <View style={styles.formHeader}>
//           {/* <Text style={styles.formNo}>Form No: {existingFormNo}</Text> */}
//           <Text style={styles.Date}>{new Date().toLocaleDateString()}</Text>
//         </View>

//         {isEditMode && (
//           <View style={styles.editModeContainer}>
//             <Text style={styles.editModeText}>
//               Edit Mode - Updating Form ID: {existingFormId}
//             </Text>
//           </View>
//         )}

//         <View style={styles.customerHeader}>
//           <Text style={styles.customerName}>
//             {formData.customerName || '—'}
//           </Text>
//           {/* <Text style={styles.customerId}>Form: {existingFormNo || '—'}</Text> */}
//           <Text
//             style={[
//               styles.statusText,
//               status === 'approved'
//                 ? styles.statusApproved
//                 : status === 'pending'
//                 ? styles.statusPending
//                 : status === 'rejected'
//                 ? styles.statusRejected
//                 : status === 'edited'
//                 ? styles.statusEdited
//                 : styles.statusDefault,
//             ]}>
//             Status: {status || '—'}
//           </Text>
//         </View>

//         {/* Date */}
//         <View style={styles.inputContainer}>
//           <Text style={styles.fieldLabel}>Date</Text>
//           <LinearGradient
//             colors={['#7E5EA9', '#20AEBC']}
//             start={{x: 0, y: 0}}
//             end={{x: 1, y: 0}}
//             style={styles.inputGradient}>
//             {renderDateField(formData.date, handleDateIconPress, 'Select Date')}
//             {showDatePicker && isEditMode && (
//               <DateTimePicker
//                 value={formData.date || new Date()}
//                 mode="date"
//                 display={Platform.OS === 'ios' ? 'spinner' : 'default'}
//                 onChange={handleDateChange}
//               />
//             )}
//           </LinearGradient>
//         </View>

//         {/* Delivery Mode */}
//         <View style={styles.deliveryModeContainer}>
//           <Text style={styles.sectionLabel}>Delivery Mode</Text>
//           <View style={styles.deliveryModeButtons}>
//             <TouchableOpacity
//               style={[
//                 styles.deliveryModeButton,
//                 formData.deliveryMode === 'Customer' &&
//                   styles.deliveryModeSelected,
//               ]}
//               onPress={() => isEditMode && handleDeliveryModeSelect('Customer')}
//               disabled={!isEditMode || loading}>
//               <LinearGradient
//                 colors={
//                   formData.deliveryMode === 'Customer'
//                     ? ['#7E5EA9', '#20AEBC']
//                     : ['#7E5EA9', '#20AEBC']
//                 }
//                 start={{x: 0, y: 0}}
//                 end={{x: 1, y: 0}}
//                 style={styles.deliveryModeGradient}>
//                 <Text
//                   style={[
//                     styles.deliveryModeText,
//                     formData.deliveryMode === 'Customer' &&
//                       styles.deliveryModeTextSelected,
//                   ]}>
//                   Customer
//                 </Text>
//               </LinearGradient>
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={[
//                 styles.deliveryModeButton,
//                 formData.deliveryMode === 'Branch' &&
//                   styles.deliveryModeSelected,
//               ]}
//               onPress={() => isEditMode && handleDeliveryModeSelect('Branch')}
//               disabled={!isEditMode || loading}>
//               <LinearGradient
//                 colors={
//                   formData.deliveryMode === 'Branch'
//                     ? ['#7E5EA9', '#20AEBC']
//                     : ['#7E5EA9', '#20AEBC']
//                 }
//                 start={{x: 0, y: 0}}
//                 end={{x: 1, y: 0}}
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

//             {/* Branch Name */}
//             <View style={styles.inputRow}>
//               <View style={styles.fullWidthInputContainer}>
//                 <Text style={styles.fieldLabel}>Branch Name</Text>
//                 <LinearGradient
//                   colors={['#7E5EA9', '#20AEBC']}
//                   start={{x: 0, y: 0}}
//                   end={{x: 1, y: 0}}
//                   style={styles.inputGradient}>
//                   {renderInputField(
//                     formData.branchName,
//                     text => handleInputChange('branchName', text),
//                     'Branch Name',
//                   )}
//                 </LinearGradient>
//               </View>
//             </View>

//             {/* Branch Person Name */}
//             <View style={styles.inputRow}>
//               <View style={styles.fullWidthInputContainer}>
//                 <Text style={styles.fieldLabel}>Branch Person Name</Text>
//                 <LinearGradient
//                   colors={['#7E5EA9', '#20AEBC']}
//                   start={{x: 0, y: 0}}
//                   end={{x: 1, y: 0}}
//                   style={styles.inputGradient}>
//                   {renderInputField(
//                     formData.branchPersonName,
//                     text => handleInputChange('branchPersonName', text),
//                     'Branch Person Name',
//                   )}
//                 </LinearGradient>
//               </View>
//             </View>

//             {/* Branch Address */}
//             <View style={styles.inputRow}>
//               <View style={styles.fullWidthInputContainer}>
//                 <Text style={styles.fieldLabel}>Branch Address</Text>
//                 <LinearGradient
//                   colors={['#7E5EA9', '#20AEBC']}
//                   start={{x: 0, y: 0}}
//                   end={{x: 1, y: 0}}
//                   style={styles.inputGradient}>
//                   {renderInputField(
//                     formData.branchAddress,
//                     text => handleInputChange('branchAddress', text),
//                     'Branch Address',
//                     'default',
//                     true,
//                   )}
//                 </LinearGradient>
//               </View>
//             </View>

//             {/* Branch Mobile Number */}
//             <View style={styles.inputRow}>
//               <View style={styles.fullWidthInputContainer}>
//                 <Text style={styles.fieldLabel}>Branch Mobile Number</Text>
//                 <LinearGradient
//                   colors={['#7E5EA9', '#20AEBC']}
//                   start={{x: 0, y: 0}}
//                   end={{x: 1, y: 0}}
//                   style={styles.inputGradient}>
//                   {renderInputField(
//                     formData.branchMobileNumber,
//                     text => handleInputChange('branchMobileNumber', text),
//                     'Branch Mobile Number',
//                     'phone-pad',
//                   )}
//                 </LinearGradient>
//               </View>
//             </View>
//           </View>
//         )}

//         {/* Customer Details Heading */}
//         <Text style={styles.sectionHeading}>Customer Details</Text>

//         {/* Challan Created By */}
//         <View style={styles.inputRow}>
//           <View style={styles.inputContainer}>
//             <Text style={styles.fieldLabel}>Challan Created By</Text>
//             <LinearGradient
//               colors={['#7E5EA9', '#20AEBC']}
//               start={{x: 0, y: 0}}
//               end={{x: 1, y: 0}}
//               style={styles.inputGradient}>
//               {renderInputField(
//                 formData.challanCreatedBy,
//                 text => handleInputChange('challanCreatedBy', text),
//                 'Challan Created By',
//               )}
//             </LinearGradient>
//           </View>
//         </View>

//         {/* Customer Name & Parentage */}
//         <View style={styles.inputRow}>
//           <View style={styles.inputContainer}>
//             <Text style={styles.fieldLabel}>Customer Name</Text>
//             <LinearGradient
//               colors={['#7E5EA9', '#20AEBC']}
//               start={{x: 0, y: 0}}
//               end={{x: 1, y: 0}}
//               style={styles.inputGradient}>
//               {renderInputField(
//                 formData.customerName,
//                 text => handleInputChange('customerName', text),
//                 'Customer Name',
//               )}
//             </LinearGradient>
//           </View>
//           <View style={{marginBottom: 15}} />
//           <View style={styles.inputContainer}>
//             <Text style={styles.fieldLabel}>Parentage</Text>
//             <LinearGradient
//               colors={['#7E5EA9', '#20AEBC']}
//               start={{x: 0, y: 0}}
//               end={{x: 1, y: 0}}
//               style={styles.inputGradient}>
//               {renderInputField(
//                 formData.parentage,
//                 text => handleInputChange('parentage', text),
//                 'Parentage',
//               )}
//             </LinearGradient>
//           </View>
//         </View>

//         {/* Address */}
//         <View style={styles.inputRow}>
//           <View style={styles.fullWidthInputContainer}>
//             <Text style={styles.fieldLabel}>Address</Text>
//             <LinearGradient
//               colors={['#7E5EA9', '#20AEBC']}
//               start={{x: 0, y: 0}}
//               end={{x: 1, y: 0}}
//               style={styles.inputGradient}>
//               {renderInputField(
//                 formData.address,
//                 text => handleInputChange('address', text),
//                 'Enter Address',
//                 'default',
//                 true,
//               )}
//             </LinearGradient>
//           </View>
//         </View>

//         {/* Hypothecation */}
//         <View style={styles.inputRow}>
//           <View style={styles.inputContainer}>
//             <Text style={styles.fieldLabel}>Hypothecation</Text>
//             <LinearGradient
//               colors={['#7E5EA9', '#20AEBC']}
//               start={{x: 0, y: 0}}
//               end={{x: 1, y: 0}}
//               style={styles.inputGradient}>
//               {renderDropdownField(
//                 formData.hypothecation,
//                 () => setShowHypothecationDropdown(true),
//                 'Select Hypothecation',
//               )}
//             </LinearGradient>
//           </View>
//         </View>

//         {/* Hypothecation Other - Conditionally Rendered */}
//         {formData.hypothecation === 'Other' && (
//           <View style={styles.inputRow}>
//             <View style={styles.fullWidthInputContainer}>
//               <Text style={styles.fieldLabel}>Hypothecation Details</Text>
//               <LinearGradient
//                 colors={['#7E5EA9', '#20AEBC']}
//                 start={{x: 0, y: 0}}
//                 end={{x: 1, y: 0}}
//                 style={styles.inputGradient}>
//                 {renderInputField(
//                   formData.hypothecationOther,
//                   text => handleInputChange('hypothecationOther', text),
//                   'Enter Other Hypothecation',
//                 )}
//               </LinearGradient>
//             </View>
//           </View>
//         )}

//         {/* Mobile No */}
//         <View style={styles.inputRow}>
//           <View style={styles.inputContainer}>
//             <Text style={styles.fieldLabel}>Mobile No</Text>
//             <LinearGradient
//               colors={['#7E5EA9', '#20AEBC']}
//               start={{x: 0, y: 0}}
//               end={{x: 1, y: 0}}
//               style={styles.inputGradient}>
//               {renderInputField(
//                 formData.mobileNo,
//                 text => handleInputChange('mobileNo', text),
//                 'Mobile No.',
//                 'phone-pad',
//               )}
//             </LinearGradient>
//           </View>
//         </View>

//         {/* Are You Customer? */}
//         <View style={styles.radioSection}>
//           <Text style={styles.radioLabel}>Are You Customer?</Text>
//           <View style={styles.radioOptions}>
//             {renderRadioOption('1', formData.areYouCustomer, 'Yes', () =>
//               handleAreYouCustomerSelect('Yes'),
//             )}
//             {renderRadioOption('0', formData.areYouCustomer, 'No', () =>
//               handleAreYouCustomerSelect('No'),
//             )}
//           </View>
//         </View>

//         {/* Representative Fields - Conditionally Rendered */}
//         {formData.areYouCustomer === '0' && (
//           <View style={styles.representativeSection}>
//             <Text style={styles.sectionHeading}>Representative Details</Text>

//             {/* Representative Name */}
//             <View style={styles.inputRow}>
//               <View style={styles.fullWidthInputContainer}>
//                 <Text style={styles.fieldLabel}>Representative Name</Text>
//                 <LinearGradient
//                   colors={['#7E5EA9', '#20AEBC']}
//                   start={{x: 0, y: 0}}
//                   end={{x: 1, y: 0}}
//                   style={styles.inputGradient}>
//                   {renderInputField(
//                     formData.representativeName,
//                     text => handleInputChange('representativeName', text),
//                     'Representative Name',
//                   )}
//                 </LinearGradient>
//               </View>
//             </View>

//             {/* Representative Father's Name */}
//             <View style={styles.inputRow}>
//               <View style={styles.fullWidthInputContainer}>
//                 <Text style={styles.fieldLabel}>Father's Name</Text>
//                 <LinearGradient
//                   colors={['#7E5EA9', '#20AEBC']}
//                   start={{x: 0, y: 0}}
//                   end={{x: 1, y: 0}}
//                   style={styles.inputGradient}>
//                   {renderInputField(
//                     formData.representativeFatherName,
//                     text => handleInputChange('representativeFatherName', text),
//                     "Father's Name",
//                   )}
//                 </LinearGradient>
//               </View>
//             </View>

//             {/* Representative Address */}
//             <View style={styles.inputRow}>
//               <View style={styles.fullWidthInputContainer}>
//                 <Text style={styles.fieldLabel}>Representative Address</Text>
//                 <LinearGradient
//                   colors={['#7E5EA9', '#20AEBC']}
//                   start={{x: 0, y: 0}}
//                   end={{x: 1, y: 0}}
//                   style={styles.inputGradient}>
//                   {renderInputField(
//                     formData.representativeAddress,
//                     text => handleInputChange('representativeAddress', text),
//                     'Representative Address',
//                     'default',
//                     true,
//                   )}
//                 </LinearGradient>
//               </View>
//             </View>

//             {/* Representative Mobile Number */}
//             <View style={styles.inputRow}>
//               <View style={styles.fullWidthInputContainer}>
//                 <Text style={styles.fieldLabel}>
//                   Representative Mobile Number
//                 </Text>
//                 <LinearGradient
//                   colors={['#7E5EA9', '#20AEBC']}
//                   start={{x: 0, y: 0}}
//                   end={{x: 1, y: 0}}
//                   style={styles.inputGradient}>
//                   {renderInputField(
//                     formData.representativeMobileNumber,
//                     text =>
//                       handleInputChange('representativeMobileNumber', text),
//                     'Representative Mobile Number',
//                     'phone-pad',
//                   )}
//                 </LinearGradient>
//               </View>
//             </View>

//             {/* Relation with Owner */}
//             <View style={styles.inputRow}>
//               <View style={styles.inputContainer}>
//                 <Text style={styles.fieldLabel}>Relation with Owner</Text>
//                 <LinearGradient
//                   colors={['#7E5EA9', '#20AEBC']}
//                   start={{x: 0, y: 0}}
//                   end={{x: 1, y: 0}}
//                   style={styles.inputGradient}>
//                   {renderDropdownField(
//                     formData.representativeRelation,
//                     () => setShowRelationDropdown(true),
//                     'Relation with Owner',
//                   )}
//                 </LinearGradient>
//               </View>
//             </View>

//             {/* Relation Other - Conditionally Rendered */}
//             {formData.representativeRelation === 'Other' && (
//               <View style={styles.inputRow}>
//                 <View style={styles.fullWidthInputContainer}>
//                   <Text style={styles.fieldLabel}>Relation Details</Text>
//                   <LinearGradient
//                     colors={['#7E5EA9', '#20AEBC']}
//                     start={{x: 0, y: 0}}
//                     end={{x: 1, y: 0}}
//                     style={styles.inputGradient}>
//                     {renderInputField(
//                       formData.representativeRelationOther,
//                       text =>
//                         handleInputChange('representativeRelationOther', text),
//                       'Enter Other Relation',
//                     )}
//                   </LinearGradient>
//                 </View>
//               </View>
//             )}
//           </View>
//         )}

//         {/* Tractor Details Heading */}
//         <Text style={styles.sectionHeading}>Tractor Details</Text>

//         {/* Tractor Name & Model */}
//         <View style={styles.inputRow}>
//           <View style={styles.inputContainer}>
//             <Text style={styles.fieldLabel}>Tractor Name</Text>
//             <LinearGradient
//               colors={['#7E5EA9', '#20AEBC']}
//               start={{x: 0, y: 0}}
//               end={{x: 1, y: 0}}
//               style={styles.inputGradient}>
//               {renderInputField(
//                 formData.tractorName,
//                 text => handleInputChange('tractorName', text),
//                 'Tractor Name',
//               )}
//             </LinearGradient>
//           </View>
//           <View style={{marginBottom: 15}} />
//           <View style={styles.inputContainer}>
//             <Text style={styles.fieldLabel}>Tractor Model</Text>
//             <LinearGradient
//               colors={['#7E5EA9', '#20AEBC']}
//               start={{x: 0, y: 0}}
//               end={{x: 1, y: 0}}
//               style={styles.inputGradient}>
//               {renderDropdownField(
//                 formData.tractorModel,
//                 () => setShowTractorModelDropdown(true),
//                 'Select Model',
//               )}
//             </LinearGradient>
//           </View>
//         </View>

//         {/* Chassis No & Engine No */}
//         <View style={styles.inputRow}>
//           <View style={styles.inputContainer}>
//             <Text style={styles.fieldLabel}>Chassis No</Text>
//             <LinearGradient
//               colors={['#7E5EA9', '#20AEBC']}
//               start={{x: 0, y: 0}}
//               end={{x: 1, y: 0}}
//               style={styles.inputGradient}>
//               <View style={styles.inputWithIcon}>
//                 {renderInputField(
//                   formData.chassisNo,
//                   text => handleInputChange('chassisNo', text),
//                   'Chassis No',
//                 )}
//                 {isEditMode && (
//                   <TouchableOpacity
//                     style={styles.iconButton}
//                     onPress={handleChassisScanPress}
//                     disabled={loading}>
//                     <Icon name="qr-code-scanner" size={20} color="#666" />
//                   </TouchableOpacity>
//                 )}
//               </View>
//             </LinearGradient>
//           </View>
//           <View style={{marginBottom: 15}} />
//           <View style={styles.inputContainer}>
//             <Text style={styles.fieldLabel}>Engine No</Text>
//             <LinearGradient
//               colors={['#7E5EA9', '#20AEBC']}
//               start={{x: 0, y: 0}}
//               end={{x: 1, y: 0}}
//               style={styles.inputGradient}>
//               <View style={styles.inputWithIcon}>
//                 {renderInputField(
//                   formData.engineNo,
//                   text => handleInputChange('engineNo', text),
//                   'Engine No',
//                 )}
//                 {isEditMode && (
//                   <TouchableOpacity
//                     style={styles.iconButton}
//                     onPress={handleEngineScanPress}
//                     disabled={loading}>
//                     <Icon name="qr-code-scanner" size={20} color="#666" />
//                   </TouchableOpacity>
//                 )}
//               </View>
//             </LinearGradient>
//           </View>
//         </View>

//         {/* Year of Manufacture */}
//         <View style={styles.inputRow}>
//           <View style={styles.inputContainer}>
//             <Text style={styles.fieldLabel}>Year of Manufacture</Text>
//             <LinearGradient
//               colors={['#7E5EA9', '#20AEBC']}
//               start={{x: 0, y: 0}}
//               end={{x: 1, y: 0}}
//               style={styles.inputGradient}>
//               {renderManufactureDateField(
//                 formData.yearOfManufacture,
//                 handleManufactureDateIconPress,
//                 'Month/Year of Manufacture',
//               )}
//               {showManufactureDatePicker && isEditMode && (
//                 <DateTimePicker
//                   value={new Date()}
//                   mode="date"
//                   display={Platform.OS === 'ios' ? 'spinner' : 'default'}
//                   onChange={handleManufactureDateChange}
//                 />
//               )}
//             </LinearGradient>
//           </View>
//         </View>

//         {/* Tires Make with Other option */}
//         <View style={styles.inputRow}>
//           <View style={styles.inputContainer}>
//             <Text style={styles.fieldLabel}>Tires Make</Text>
//             <LinearGradient
//               colors={['#7E5EA9', '#20AEBC']}
//               start={{x: 0, y: 0}}
//               end={{x: 1, y: 0}}
//               style={styles.inputGradient}>
//               {renderDropdownField(
//                 formData.tiresMake,
//                 () => setShowTiresMakeDropdown(true),
//                 'Select Tires Make',
//               )}
//             </LinearGradient>
//           </View>
//         </View>

//         {/* Tires Make Other - Conditionally Rendered */}
//         {formData.tiresMake === 'Other' && (
//           <View style={styles.inputRow}>
//             <View style={styles.fullWidthInputContainer}>
//               <Text style={styles.fieldLabel}>Tires Make Details</Text>
//               <LinearGradient
//                 colors={['#7E5EA9', '#20AEBC']}
//                 start={{x: 0, y: 0}}
//                 end={{x: 1, y: 0}}
//                 style={styles.inputGradient}>
//                 {renderInputField(
//                   formData.tiresMakeOther,
//                   text => handleInputChange('tiresMakeOther', text),
//                   'Enter Other Tires Make',
//                 )}
//               </LinearGradient>
//             </View>
//           </View>
//         )}

//         {/* FIP Make with Other option */}
//         <View style={styles.inputRow}>
//           <View style={styles.inputContainer}>
//             <Text style={styles.fieldLabel}>FIP Make</Text>
//             <LinearGradient
//               colors={['#7E5EA9', '#20AEBC']}
//               start={{x: 0, y: 0}}
//               end={{x: 1, y: 0}}
//               style={styles.inputGradient}>
//               {renderDropdownField(
//                 formData.fipMake,
//                 () => setShowFipMakeDropdown(true),
//                 'FIP Make',
//               )}
//             </LinearGradient>
//           </View>
//         </View>

//         {/* FIP Make Other - Conditionally Rendered */}
//         {formData.fipMake === 'Other' && (
//           <View style={styles.inputRow}>
//             <View style={styles.fullWidthInputContainer}>
//               <Text style={styles.fieldLabel}>FIP Make Details</Text>
//               <LinearGradient
//                 colors={['#7E5EA9', '#20AEBC']}
//                 start={{x: 0, y: 0}}
//                 end={{x: 1, y: 0}}
//                 style={styles.inputGradient}>
//                 {renderInputField(
//                   formData.fipMakeOther,
//                   text => handleInputChange('fipMakeOther', text),
//                   'Enter Other FIP Make',
//                 )}
//               </LinearGradient>
//             </View>
//           </View>
//         )}

//         {/* Battery Make with Other option */}
//         <View style={styles.inputRow}>
//           <View style={styles.inputContainer}>
//             <Text style={styles.fieldLabel}>Battery Make</Text>
//             <LinearGradient
//               colors={['#7E5EA9', '#20AEBC']}
//               start={{x: 0, y: 0}}
//               end={{x: 1, y: 0}}
//               style={styles.inputGradient}>
//               {renderDropdownField(
//                 formData.batteryMake,
//                 () => setShowBatteryMakeDropdown(true),
//                 'Select Battery Make',
//               )}
//             </LinearGradient>
//           </View>
//         </View>

//         {/* Battery Make Other - Conditionally Rendered */}
//         {formData.batteryMake === 'Other' && (
//           <View style={styles.inputRow}>
//             <View style={styles.fullWidthInputContainer}>
//               <Text style={styles.fieldLabel}>Battery Make Details</Text>
//               <LinearGradient
//                 colors={['#7E5EA9', '#20AEBC']}
//                 start={{x: 0, y: 0}}
//                 end={{x: 1, y: 0}}
//                 style={styles.inputGradient}>
//                 {renderInputField(
//                   formData.batteryMakeOther,
//                   text => handleInputChange('batteryMakeOther', text),
//                   'Enter Other Battery Make',
//                 )}
//               </LinearGradient>
//             </View>
//           </View>
//         )}

//         {/* Payment Details Heading */}
//         <Text style={styles.sectionHeading}>Payment Details</Text>

//         {/* Deal Price */}
//         <View style={styles.inputRow}>
//           <View style={styles.inputContainer}>
//             <Text style={styles.fieldLabel}>Deal Price</Text>
//             <LinearGradient
//               colors={['#7E5EA9', '#20AEBC']}
//               start={{x: 0, y: 0}}
//               end={{x: 1, y: 0}}
//               style={styles.inputGradient}>
//               {renderInputField(
//                 formData.dealPrice,
//                 text => handleInputChange('dealPrice', text),
//                 'Deal Price',
//                 'numeric',
//               )}
//             </LinearGradient>
//           </View>
//         </View>

//         {/* Cash Paid & Finance Amount Paid */}
//         <View style={styles.inputRow}>
//           <View style={styles.inputContainer}>
//             <Text style={styles.fieldLabel}>Cash Paid</Text>
//             <LinearGradient
//               colors={['#7E5EA9', '#20AEBC']}
//               start={{x: 0, y: 0}}
//               end={{x: 1, y: 0}}
//               style={styles.inputGradient}>
//               {renderInputField(
//                 formData.cashPaid,
//                 text => handleInputChange('cashPaid', text),
//                 'Cash Paid',
//                 'numeric',
//               )}
//             </LinearGradient>
//           </View>

//           <View style={styles.inputContainer}>
//             <Text style={styles.fieldLabel}>Finance Amount Paid</Text>
//             <LinearGradient
//               colors={['#7E5EA9', '#20AEBC']}
//               start={{x: 0, y: 0}}
//               end={{x: 1, y: 0}}
//               style={styles.inputGradient}>
//               {renderInputField(
//                 formData.financeAmountPaid,
//                 text => handleInputChange('financeAmountPaid', text),
//                 'Finance Amount Paid',
//                 'numeric',
//               )}
//             </LinearGradient>
//           </View>
//         </View>

//         {/* Total Paid & Balance Amount */}
//         <View style={styles.inputRow}>
//           <View style={styles.inputContainer}>
//             <Text style={styles.fieldLabel}>Total Amount Paid</Text>
//             <LinearGradient
//               colors={['#7E5EA9', '#20AEBC']}
//               start={{x: 0, y: 0}}
//               end={{x: 1, y: 0}}
//               style={styles.inputGradient}>
//               {renderInputField(
//                 formData.totalPaid,
//                 text => handleInputChange('totalPaid', text),
//                 'Total Paid',
//                 'numeric',
//               )}
//             </LinearGradient>
//           </View>
//           <View style={{marginBottom: 15}} />
//           <View style={styles.inputContainer}>
//             <Text style={styles.fieldLabel}>Total Balance Amount</Text>
//             <LinearGradient
//               colors={['#7E5EA9', '#20AEBC']}
//               start={{x: 0, y: 0}}
//               end={{x: 1, y: 0}}
//               style={styles.inputGradient}>
//               {renderInputField(
//                 formData.balanceAmount,
//                 text => handleInputChange('balanceAmount', text),
//                 'Balance Amount',
//                 'numeric',
//               )}
//             </LinearGradient>
//           </View>
//         </View>

//         {/* Payment Status */}
//         <View style={styles.inputRow}>
//           <View style={styles.inputContainer}>
//             <Text style={styles.fieldLabel}>Payment Status</Text>
//             <LinearGradient
//               colors={['#7E5EA9', '#20AEBC']}
//               start={{x: 0, y: 0}}
//               end={{x: 1, y: 0}}
//               style={styles.inputGradient}>
//               {renderDropdownField(
//                 formData.paymentStatus,
//                 () => setShowPaymentStatusDropdown(true),
//                 'Select Payment Status',
//               )}
//             </LinearGradient>
//           </View>
//         </View>

//         {/* Financer Name */}
//         <View style={styles.inputRow}>
//           <View style={styles.inputContainer}>
//             <Text style={styles.fieldLabel}>Hypothecation</Text>
//             <LinearGradient
//               colors={['#7E5EA9', '#20AEBC']}
//               style={styles.inputGradient}>
//               {renderDropdownField(
//                 formData.financerName,
//                 () => setShowFinancerDropdown(true),
//                 'Hypothecation',
//               )}
//             </LinearGradient>
//           </View>
//         </View>

//         {/* Financer Other - Conditionally Rendered */}
//         {formData.financerName === 'Other' && (
//           <View style={styles.inputRow}>
//             <View style={styles.fullWidthInputContainer}>
//               <Text style={styles.fieldLabel}>Hypothecation Details</Text>
//               <LinearGradient
//                 colors={['#7E5EA9', '#20AEBC']}
//                 start={{x: 0, y: 0}}
//                 end={{x: 1, y: 0}}
//                 style={styles.inputGradient}>
//                 {renderInputField(
//                   formData.financerOther,
//                   text => handleInputChange('financerOther', text),
//                   'Enter Other Hypothecation',
//                 )}
//               </LinearGradient>
//             </View>
//           </View>
//         )}

//         {/* Accessories Heading */}
//         <View style={styles.accessoriesHeader}>
//           <Text style={styles.sectionHeading}>
//             Accessories Given With Tractor
//           </Text>
//         </View>

//         {/* Accessories Grid */}
//         <View style={styles.accessoriesGrid}>
//           {renderAccessoryItem('bumper', 'Bumper Issued')}
//           {renderAccessoryItem('cultivator', 'Cultivator Issued')}
//           {renderAccessoryItem('leveler', 'Leveler Issued')}
//           {renderAccessoryItem('rallyFenderSeats', 'Rally Fender Seats Issued')}
//           {renderAccessoryItem('weightsRear', 'Weights Rear Issued')}
//           {renderAccessoryItem('waterTanker', 'Water Tanker Issued')}
//           {renderAccessoryItem('trolly', 'Trolly Issued')}
//           {renderAccessoryItem('weightFront', 'Weight Front Issued')}
//           {renderAccessoryItem('rearTowingHook', 'Rear Towing Hook Issued')}
//           {renderAccessoryItem('hood', 'Hood Issued')}
//           {renderAccessoryItem('ptoPully', 'PTO Pully Issued')}
//           {renderAccessoryItem('drawbar', 'Drawbar Issued')}
//           {renderAccessoryItem('cageWheels', 'Cage Wheels Issued')}
//           {renderAccessoryItem('tool', 'Tool Issued')}
//           {renderAccessoryItem('toplink', 'Top Link Issued')}
//         </View>

//         {/* Terms and Conditions */}
//         <View style={styles.termsSection}>
//           <Text style={styles.termsHeading}>Terms and Conditions</Text>

//           <Text style={styles.termItem}>
//             <Text style={{fontSize: 14, fontFamily: 'Inter_28pt-SemiBold'}}>
//               Delivery Condition :
//             </Text>{' '}
//             The Tractor Has Been Delivered To The Customer In Good Physical
//             Condition And Fully Operational Working Condition. The Customer Has
//             Inspected The Vehicle At The Time Of Delivery And Accepts Its
//             Condition As Satisfactory.
//           </Text>

//           <Text style={styles.termItem}>
//             <Text style={{fontSize: 14, fontFamily: 'Inter_28pt-SemiBold'}}>
//               Ownership And Registration :
//             </Text>{' '}
//             The Ownership Of The Tractor Shall Be Transferred To The Customer
//             Upon Full Payment And Successful Registration With The Relevant
//             Motor Vehicle Authority. The Dealer Will Assist With Documentation
//             If Required.
//           </Text>

//           <Text style={styles.termItem}>
//             <Text style={{fontSize: 14, fontFamily: 'Inter_28pt-SemiBold'}}>
//               Warranty And Service :
//             </Text>{' '}
//             The Tractor Is Covered Under The Manufacturer's Standard Warranty
//             Policy. All Services And Repairs During The Warranty Period Must Be
//             Carried Out At Authorized Service Centers Only.
//           </Text>

//           <Text style={styles.termItem}>
//             <Text style={{fontSize: 14, fontFamily: 'Inter_28pt-SemiBold'}}>
//               Liability :
//             </Text>{' '}
//             The Dealer Shall Not Be Held Liable For Any Damage Or Malfunction
//             Arising Form Misuse, Unauthorized Modifications, Or Failure To
//             Adhere To The Maintenance Schedule After Delivery.
//           </Text>

//           <Text style={styles.termItem}>
//             <Text style={{fontSize: 14, fontFamily: 'Inter_28pt-SemiBold'}}>
//               Payment Terms :
//             </Text>{' '}
//             Full Payment Has Been Made Prior To Or At The Time Of Delivery
//             Unless Otherwise Agreed In Writing. Any Outstanding Amounts Must Be
//             Cleared As Per The Mutually Agreed Timeline.
//           </Text>

//           <Text style={styles.termItem}>
//             <Text style={{fontSize: 14, fontFamily: 'Inter_28pt-SemiBold'}}>
//               Dispute Resolution :
//             </Text>{' '}
//             In Case Of Any Disputes Arising From This Delivery, The Matter Shall
//             Be Resolved Amicably Between Both Parties. If Unresolved, It Will Be
//             Subject To The Jurisdiction Of The Dealer's Location.
//           </Text>

//           <Text style={styles.termItem}>
//             <Text style={{fontSize: 14, fontFamily: 'Inter_28pt-SemiBold'}}>
//               Acknowledgement :
//             </Text>{' '}
//             The Customer Acknowledges And Agrees To The Above Terms And Confirms
//             That The Tractor Was Received In A Good And Working Condition.
//           </Text>

//           {/* Accept Terms Checkbox */}
//           <TouchableOpacity
//             style={styles.termsCheckbox}
//             onPress={() => isEditMode && setAcceptTerms(!acceptTerms)}
//             activeOpacity={0.8}
//             disabled={!isEditMode || loading}>
//             <LinearGradient
//               colors={['grey', 'grey']}
//               style={styles.checkboxGradient}>
//               <View
//                 style={[
//                   styles.checkboxInner,
//                   acceptTerms && styles.checkboxInnerSelected,
//                 ]}>
//                 {acceptTerms && <Icon name="check" size={16} color="#fff" />}
//               </View>
//             </LinearGradient>
//             <Text style={styles.termsCheckboxText}>
//               Accept All Terms And Conditions
//             </Text>
//           </TouchableOpacity>
//         </View>

//         {/* Signatures Section */}
//         <View style={styles.signatureSection}>
//           <Text style={styles.sectionHeading}>Signatures</Text>
//           <View style={styles.signatureRow}>
//             {renderSignatureBox(
//               customerSignature,
//               setCustomerSignature,
//               'Customer Signature',
//             )}
//             {renderSignatureBox(
//               managerSignature,
//               setManagerSignature,
//               'Manager Signature',
//             )}
//             {renderSignatureBox(
//               driverSignature,
//               setDriverSignature,
//               'Driver Signature',
//             )}
//           </View>
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
//             showRelationDropdown
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
//                     : []
//                 }
//                 renderItem={renderDropdownItem}
//                 keyExtractor={(item, index) => index.toString()}
//                 style={styles.dropdownList}
//               />
//             </View>
//           </View>
//         </Modal>

//         {/* Buttons */}
//         <View style={styles.buttonsContainer}>
//           {/* Edit Button - Only show when status is 'edited' */}
//           {status === 'edited' && !isEditMode && (
//             <TouchableOpacity
//               style={styles.editButton}
//               onPress={handleEditPress}>
//               <Text style={styles.editButtonText}>Edit Form</Text>
//             </TouchableOpacity>
//           )}

//           {isEditMode && (
//             <>
//               <TouchableOpacity
//                 style={[
//                   styles.submitButton,
//                   (loading || !acceptTerms) && styles.disabledButton,
//                 ]}
//                 onPress={handleUpdate}
//                 disabled={loading || !acceptTerms}>
//                 {loading ? (
//                   <ActivityIndicator color="#fff" size="small" />
//                 ) : (
//                   <Text style={styles.buttonText}>Update Delivery Challan</Text>
//                 )}
//               </TouchableOpacity>

//               <TouchableOpacity
//                 style={[styles.cancelButton, loading && styles.disabledButton]}
//                 onPress={handleCancelEdit}
//                 disabled={loading}>
//                 <Text style={styles.cancelButtonText}>Cancel</Text>
//               </TouchableOpacity>
//             </>
//           )}

//           {/* PDF Button - Only show when status is 'approved' */}
//           {status === 'approved' && (
//             <TouchableOpacity
//               style={[styles.pdfButton, loading && styles.disabledButton]}
//               onPress={handleDownloadPDF}
//               disabled={loading}>
//               {loading ? (
//                 <ActivityIndicator color="#fff" size="small" />
//               ) : (
//                 <Text style={styles.buttonText}>Download PDF</Text>
//               )}
//             </TouchableOpacity>
//           )}

//           <TouchableOpacity
//             style={[styles.homeButton, loading && styles.disabledButton]}
//             onPress={() => navigation.goBack()}
//             disabled={loading}>
//             <Text style={styles.buttonText}>Back to List</Text>
//           </TouchableOpacity>
//         </View>
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
//     paddingHorizontal: 15,
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   backButton: {
//     padding: 5,
//     marginRight: 10,
//   },
//   headerTitleContainer: {
//     flex: 1,
//     alignItems: 'center',
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
//   formHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   formNo: {
//     fontSize: 14,
//     fontFamily: 'Inter_28pt-SemiBold',
//     color: '#000',
//   },
//   Date: {
//     fontSize: 12,
//     color: '#00000099',
//     fontFamily: 'Inter_28pt-Regular',
//   },
//   editModeContainer: {
//     backgroundColor: '#f0e6ff',
//     padding: 8,
//     borderRadius: 5,
//     marginVertical: 5,
//     alignItems: 'center',
//   },
//   customerHeader: {
//     alignItems: 'center',
//     marginVertical: 10,
//     marginBottom: 20,
//   },
//   customerName: {
//     fontSize: 20,
//     color: '#000',
//     fontFamily: 'Inter_28pt-SemiBold',
//   },
//   customerId: {
//     fontSize: 13,
//     color: '#56616D',
//     fontFamily: 'Inter_28pt-SemiBold',
//   },
//   statusText: {
//     fontSize: 12,
//     fontFamily: 'Inter_28pt-SemiBold',
//     marginTop: 5,
//     paddingHorizontal: 12,
//     paddingVertical: 4,
//     borderRadius: 12,
//   },
//   statusApproved: {
//     backgroundColor: '#4CAF50',
//     color: 'white',
//   },
//   statusPending: {
//     backgroundColor: '#2196F3',
//     color: 'white',
//   },
//   statusRejected: {
//     backgroundColor: '#F44336',
//     color: 'white',
//   },
//   statusEdited: {
//     backgroundColor: '#FF9800',
//     color: 'white',
//   },
//   statusDefault: {
//     backgroundColor: '#9E9E9E',
//     color: 'white',
//   },
//   fieldLabel: {
//     fontSize: 14,
//     fontFamily: 'Inter_28pt-Medium',
//     marginBottom: 5,
//     color: '#000',
//   },
//   inputContainer: {
//     marginBottom: 15,
//   },
//   inputGradient: {
//     borderRadius: 8,
//     padding: 1.2,
//   },
//   textInput: {
//     backgroundColor: '#fff',
//     padding: 15,
//     borderRadius: 8,
//     fontSize: 14,
//     color: '#000',
//     fontFamily: 'Inter_28pt-Regular',
//   },
//   readOnlyInput: {
//     color: '#666',
//     backgroundColor: '#f5f5f5',
//   },
//   iconButton: {
//     padding: 4,
//     marginRight: 10,
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
//     fontFamily: 'Inter_28pt-Regular',
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
//     fontFamily: 'Inter_28pt-Regular',
//   },
//   placeholderText: {
//     fontSize: 14,
//     color: '#666',
//     fontFamily: 'Inter_28pt-Regular',
//   },
//   inputWithIcon: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
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
//     fontFamily: 'Inter_28pt-SemiBold',
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
//   editButton: {
//     backgroundColor: '#FFA000',
//     padding: 15,
//     borderRadius: 8,
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   editButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontFamily: 'Inter_28pt-SemiBold',
//   },
//   submitButton: {
//     backgroundColor: '#7E5EA9',
//     padding: 15,
//     borderRadius: 8,
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   cancelButton: {
//     backgroundColor: '#6c757d',
//     padding: 15,
//     borderRadius: 8,
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   cancelButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontFamily: 'Inter_28pt-SemiBold',
//   },
//   pdfButton: {
//     backgroundColor: '#4CAF50',
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
//     fontFamily: 'Inter_28pt-SemiBold',
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
//     fontFamily: 'Inter_28pt-Regular',
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
//     fontFamily: 'Inter_28pt-SemiBold',
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
//     fontFamily: 'Inter_28pt-Regular',
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
//     fontFamily: 'Inter_28pt-Medium',
//   },
//   signatureSection: {
//     marginBottom: 20,
//   },
//   signatureRow: {
//     marginTop: 20,
//   },
//   signatureContainer: {
//     marginBottom: 20,
//   },
//   signatureLabel: {
//     fontSize: 14,
//     fontFamily: 'Inter_28pt-Medium',
//     marginBottom: 5,
//     color: '#000',
//   },
//   signatureImageContainer: {
//     alignItems: 'center',
//   },
//   signatureImage: {
//     width: '100%',
//     height: 80,
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: '#ccc',
//   },
//   changeSignatureButton: {
//     backgroundColor: '#7E5EA9',
//     padding: 10,
//     borderRadius: 6,
//     marginTop: 8,
//   },
//   changeSignatureText: {
//     color: 'white',
//     fontFamily: 'Inter_28pt-SemiBold',
//     fontSize: 12,
//   },
//   addSignatureButton: {
//     backgroundColor: '#20AEBC',
//     padding: 15,
//     borderRadius: 6,
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderStyle: 'dashed',
//     width: '100%',
//     height: 80,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   addSignatureText: {
//     color: 'white',
//     fontFamily: 'Inter_28pt-SemiBold',
//     textAlign: 'center',
//   },
//   disabledButton: {
//     opacity: 0.6,
//   },
//   branchSection: {
//     marginBottom: 15,
//   },
//   representativeSection: {
//     marginBottom: 15,
//   },
// });

// export default Dcinternalpage;








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

const Dcinternalpage = ({navigation, route}) => {
  const insets = useSafeAreaInsets();
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [existingFormId, setExistingFormId] = useState(null);
  const [existingFormNo, setExistingFormNo] = useState(null);
  const [status, setStatus] = useState('pending');
  const [acceptTerms, setAcceptTerms] = useState(false);

  // QR Scanner States
  const [showChassisScanner, setShowChassisScanner] = useState(false);
  const [showEngineScanner, setShowEngineScanner] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState(false);

  // Dropdown states
  const [showTractorModelDropdown, setShowTractorModelDropdown] = useState(false);
  const [showTiresMakeDropdown, setShowTiresMakeDropdown] = useState(false);
  const [showFipMakeDropdown, setShowFipMakeDropdown] = useState(false);
  const [showBatteryMakeDropdown, setShowBatteryMakeDropdown] = useState(false);
  const [showPaymentStatusDropdown, setShowPaymentStatusDropdown] = useState(false);
  const [showFinancerDropdown, setShowFinancerDropdown] = useState(false);
  const [showHypothecationDropdown, setShowHypothecationDropdown] = useState(false);
  const [showRelationDropdown, setShowRelationDropdown] = useState(false);
  const [showExchangeTractorDropdown, setShowExchangeTractorDropdown] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showManufactureDatePicker, setShowManufactureDatePicker] = useState(false);

  // Payment history entries
  const [paymentEntries, setPaymentEntries] = useState([{ entry_date: '', entry_by: '', amount: '', remarks: '' }]);

  // Form data state with all API fields
  const [formData, setFormData] = useState({
    // Basic form data
    formNo: '',
    date: null,
    deliveryMode: 'Self Pickup',
    challanCreatedBy: '',
    customerName: '',
    parentage: '',
    address: '',
    hypothecation: '',
    hypothecationOther: '',
    mobileNo: '',
    isCustomer: '',
    tractorName: '',
    tractorModel: '',
    chassisNo: '',
    engineNo: '',
    yearOfManufacture: '',
    tiresMake: '',
    tiresMakeOther: '',
    fipMake: '',
    fipMakeOther: '',
    batteryMake: '',
    batteryMakeOther: '',
    dealPrice: '',
    amountPaid: '',
    financeAmountPaid: '',
    totalPaid: '',
    balanceAmount: '',
    paymentStatus: '',
    financierName: '',
    
    // Branch fields
    branchName: '',
    branchPersonName: '',
    branchAddress: '',
    branchPhone: '',
    
    // Representative fields
    relativeName: '',
    relativeFatherName: '',
    relativeAddress: '',
    relativePhone: '',
    relativeRelation: '',
    relationOther: '',
    
    // Exchange tractor fields
    isExchangeTractor: '',
    oldTractorName: '',
    oldTractorChassisNo: '',
    oldTractorYearOfManufacture: '',
    exchangeDealAmount: '',
    oldTractorRemark: '',
    
    // Additional fields from API
    location: '',
    paymentMethod: 'cash',
    remarks: '',
    authId: '',
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

  // Dropdown options
  const tractorModels = [
    '3028EN', '3036EN', '3036E', '5105', '5105 4WD', 
    '5050D Gear Pro', '5210 Gear Pro', '5050D 4WD Gear Pro', 
    '5210 4WD Gear Pro', '5310 CRDI', '5310 4WD CRDI', 
    '5405 CRDI', '5405 4WD CRDI', '5075 2WD', '5075 4WD'
  ];

  const tiresMakes = ['MRF', 'CEAT', 'Apollo', 'BKT', 'Goodyear', 'Bridgestone', 'Other'];
  const fipMakes = ['Bosch', 'Delphi', 'Denso', 'Siemens', 'Stanadyne', 'Other'];
  const batteryMakes = ['Exide', 'Amaron', 'Luminous', 'Su-Kam', 'Hankook', 'Other'];
  const paymentStatuses = ['Paid', 'Pending'];
  const paymentMethods = ['cash', 'finance', 'both'];
  const hypothecationOptions = [
    'John Deere Financial India Private Limited',
    'The Jammu and Kashmir Bank Limited',
    'Nil',
    'Other'
  ];
  const relationOptions = ['Father', 'Mother', 'Friend', 'Spouse', 'Brother', 'Sister', 'Son', 'Other'];
  const exchangeOptions = ['yes', 'no'];

  // Helper function to make absolute URLs
  const makeAbsoluteUrl = relativePath => {
    if (!relativePath) return null;
    if (relativePath.startsWith('http')) return relativePath;
    return `https://argosmob.uk/makroo/public/${relativePath.replace(/^\/+/, '')}`;
  };

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
      setStatus(formStatus || 'pending');
      fetchFormData(formId);
    } else {
      Alert.alert('Error', 'No form data provided');
      navigation.goBack();
    }
  }, [route.params]);

  const fetchFormData = async formId => {
    try {
      setFetchLoading(true);
      const formDataToSend = new FormData();
      formDataToSend.append('id', formId.toString());

      const config = {
        method: 'post',
        url: 'https://argosmob.uk/makroo/public/api/v1/delivery-challan/form/get',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: formDataToSend,
        timeout: 30000,
      };

      const response = await axios(config);

      if (response.data.status && response.data.data) {
        const data = response.data.data;
        setStatus(data.status || 'pending');
        setExistingFormNo(data.form_no);
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
    // Populate all form fields from API response
    setFormData({
      formNo: data.form_no || '',
      date: data.select_date ? new Date(data.select_date) : null,
      deliveryMode: data.delivery_mode || 'Self Pickup',
      challanCreatedBy: data.challan_created_by || '',
      customerName: data.customer_name || '',
      parentage: data.parentage || '',
      address: data.address || '',
      hypothecation: data.hypothecation || '',
      hypothecationOther: data.hypothecation_other || '',
      mobileNo: data.mobile_no || '',
      isCustomer: data.is_customer?.toString() || '',
      tractorName: data.tractor_name || '',
      tractorModel: data.tractor_model || '',
      chassisNo: data.chassis_no || '',
      engineNo: data.engine_no || '',
      yearOfManufacture: data.year_of_manufacture || '',
      tiresMake: data.tire_make || '',
      tiresMakeOther: data.tire_make_other || '',
      fipMake: data.fip_make || '',
      fipMakeOther: data.fip_make_other || '',
      batteryMake: data.battery_make || '',
      batteryMakeOther: data.battery_make_other || '',
      dealPrice: data.deal_price || '',
      amountPaid: data.amount_paid || '',
      financeAmountPaid: data.finance_amount_paid || '',
      totalPaid: data.total_paid || '',
      balanceAmount: data.balance_amount || '',
      paymentStatus: data.payment_status || '',
      financierName: data.financier_name || '',
      branchName: data.branch_name || '',
      branchPersonName: data.branch_person_name || '',
      branchAddress: data.branch_address || '',
      branchPhone: data.branch_phone || '',
      relativeName: data.relative_name || '',
      relativeFatherName: data.relative_father_name || '',
      relativeAddress: data.relative_address || '',
      relativePhone: data.relative_phone || '',
      relativeRelation: data.relative_relation || '',
      relationOther: data.relation_other || '',
      isExchangeTractor: data.is_exchange_tractor || '',
      oldTractorName: data.old_tractor_name || '',
      oldTractorChassisNo: data.old_tractor_chassis_no || '',
      oldTractorYearOfManufacture: data.old_tractor_year_of_manufacture || '',
      exchangeDealAmount: data.exchange_deal_amount || '',
      oldTractorRemark: data.old_tractor_remark || '',
      location: data.location || '',
      paymentMethod: data.payment_method || 'cash',
      remarks: data.remarks || '',
      authId: data.auth_id || '',
    });

    // Set accessories from JSON string
    if (data.accessories) {
      try {
        const accessoriesData = typeof data.accessories === 'string' 
          ? JSON.parse(data.accessories) 
          : data.accessories;

        const updatedAccessories = {...accessories};
        Object.keys(accessoriesData).forEach(key => {
          if (accessoriesData[key] === 'Yes' || accessoriesData[key] === true) {
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

    // Set payment entries from history
    if (data.history && Array.isArray(data.history)) {
      const entries = data.history.map(entry => ({
        entry_date: entry.entry_date || '',
        entry_by: entry.entry_by || '',
        amount: entry.amount || '',
        remarks: entry.remarks || '',
      }));
      setPaymentEntries(entries.length > 0 ? entries : [{ entry_date: '', entry_by: '', amount: '', remarks: '' }]);
    }

    // Load existing images
    if (data.customer_signature) {
      const customerSignatureUri = makeAbsoluteUrl(data.customer_signature);
      setCustomerSignature(customerSignatureUri);
    }
    if (data.manager_signature) {
      const managerSignatureUri = makeAbsoluteUrl(data.manager_signature);
      setManagerSignature(managerSignatureUri);
    }
    if (data.driver_signature) {
      const driverSignatureUri = makeAbsoluteUrl(data.driver_signature);
      setDriverSignature(driverSignatureUri);
    }

    setAcceptTerms(data.terms_accepted || false);
  };

  // Payment entries management
  const addPaymentEntry = () => {
    setPaymentEntries([...paymentEntries, { entry_date: '', entry_by: '', amount: '', remarks: '' }]);
  };

  const removePaymentEntry = (index) => {
    if (paymentEntries.length > 1) {
      const newEntries = [...paymentEntries];
      newEntries.splice(index, 1);
      setPaymentEntries(newEntries);
    }
  };

  const updatePaymentEntry = (index, field, value) => {
    const newEntries = [...paymentEntries];
    newEntries[index][field] = value;
    setPaymentEntries(newEntries);
  };

  // Camera and Image handling functions
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

  const showImageSourceOptions = (setImageFunction, title = 'Select Image Source') => {
    if (!isEditMode) {
      Alert.alert('Cannot Edit', 'This form cannot be edited in its current status.');
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
              Alert.alert('Permission Denied', 'Camera permission is required to take photos.');
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
              Alert.alert('Permission Denied', 'Camera permission is required to take photos.');
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

  // QR Scanner Handlers
  const handleChassisScanPress = async () => {
    if (!isEditMode) return;
    const hasPermission = await requestCameraPermission();
    if (hasPermission) {
      setShowChassisScanner(true);
    } else {
      Alert.alert('Permission Denied', 'Camera permission is required to scan QR codes.');
    }
  };

  const handleEngineScanPress = async () => {
    if (!isEditMode) return;
    const hasPermission = await requestCameraPermission();
    if (hasPermission) {
      setShowEngineScanner(true);
    } else {
      Alert.alert('Permission Denied', 'Camera permission is required to scan QR codes.');
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

  // Form handlers
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDeliveryModeSelect = mode => {
    handleInputChange('deliveryMode', mode);
  };

  const handleIsCustomerSelect = value => {
    handleInputChange('isCustomer', value === 'Yes' ? '1' : '0');
  };

  const handleExchangeTractorSelect = value => {
    handleInputChange('isExchangeTractor', value);
  };

  const handlePaymentMethodSelect = value => {
    handleInputChange('paymentMethod', value);
  };

  const handleAccessoryToggle = accessory => {
    setAccessories(prev => ({
      ...prev,
      [accessory]: !prev[accessory],
    }));
  };

  // Dropdown handlers
  const handleTractorModelSelect = model => {
    handleInputChange('tractorModel', model);
    setShowTractorModelDropdown(false);
  };

  const handleTiresMakeSelect = make => {
    handleInputChange('tiresMake', make);
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

  // Date handlers
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
    if (!isEditMode) return;
    setShowDatePicker(true);
  };

  const handleManufactureDateIconPress = () => {
    if (!isEditMode) return;
    setShowManufactureDatePicker(true);
  };

  // Edit Mode Handler
  const handleEditPress = () => {
    if (status === 'edited') {
      setIsEditMode(true);
    } else {
      Alert.alert('Cannot Edit', 'This form cannot be edited in its current status.');
    }
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    if (existingFormId) {
      fetchFormData(existingFormId);
    }
  };

  // Calculate total paid and balance amount automatically
  useEffect(() => {
    if (isEditMode) {
      const amountPaid = parseFloat(formData.amountPaid) || 0;
      const financeAmountPaid = parseFloat(formData.financeAmountPaid) || 0;
      const totalPaid = amountPaid + financeAmountPaid;
      const dealPrice = parseFloat(formData.dealPrice) || 0;
      const balance = dealPrice - totalPaid;

      handleInputChange('totalPaid', totalPaid.toString());
      handleInputChange('balanceAmount', balance.toString());
    }
  }, [formData.amountPaid, formData.financeAmountPaid, formData.dealPrice, isEditMode]);

  // Validate Form for Update
  const validateForm = () => {
    const requiredFields = [
      'customerName', 'parentage', 'address', 'mobileNo', 
      'tractorName', 'tractorModel', 'chassisNo', 'engineNo', 
      'yearOfManufacture', 'dealPrice', 'paymentStatus'
    ];

    for (const field of requiredFields) {
      if (!formData[field] || formData[field].toString().trim() === '') {
        Alert.alert('Validation Error', `Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }

    if (!formData.isCustomer) {
      Alert.alert('Validation Error', 'Please select if you are the customer');
      return false;
    }

    // Branch validation
    if (formData.deliveryMode === 'Branch') {
      const branchFields = ['branchName', 'branchPersonName', 'branchAddress', 'branchPhone'];
      for (const field of branchFields) {
        if (!formData[field] || formData[field].toString().trim() === '') {
          Alert.alert('Validation Error', `Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
          return false;
        }
      }
    }

    // Representative validation
    if (formData.isCustomer === '0') {
      const representativeFields = ['relativeName', 'relativeFatherName', 'relativeAddress', 'relativePhone', 'relativeRelation'];
      for (const field of representativeFields) {
        if (!formData[field] || formData[field].toString().trim() === '') {
          Alert.alert('Validation Error', `Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
          return false;
        }
      }
      if (formData.relativeRelation === 'Other' && (!formData.relationOther || formData.relationOther.trim() === '')) {
        Alert.alert('Validation Error', 'Please specify the relation');
        return false;
      }
    }

    // Exchange tractor validation
    if (formData.isExchangeTractor === 'yes') {
      const exchangeFields = ['oldTractorName', 'oldTractorChassisNo', 'oldTractorYearOfManufacture', 'exchangeDealAmount'];
      for (const field of exchangeFields) {
        if (!formData[field] || formData[field].toString().trim() === '') {
          Alert.alert('Validation Error', `Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
          return false;
        }
      }
    }

    if (!customerSignature) {
      Alert.alert('Validation Error', 'Please add customer signature');
      return false;
    }

    if (!managerSignature) {
      Alert.alert('Validation Error', 'Please add manager signature');
      return false;
    }

    if (!driverSignature) {
      Alert.alert('Validation Error', 'Please add driver signature');
      return false;
    }

    if (!acceptTerms) {
      Alert.alert('Validation Error', 'Please accept the terms and conditions');
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
        accessoriesData[accessoryMapping[key]] = accessories[key] ? 'Yes' : 'No';
      }
    });

    accessoriesData.Other = [];

    return JSON.stringify(accessoriesData);
  };

  const prepareFormData = () => {
    const formDataToSend = new FormData();

    // Add all form fields with exact API field names
    formDataToSend.append('id', existingFormId.toString());
    formDataToSend.append('user_id', userId);
    formDataToSend.append('form_no', existingFormNo);
    formDataToSend.append('select_date', formData.date ? formData.date.toISOString().split('T')[0] : new Date().toISOString().split('T')[0]);
    formDataToSend.append('delivery_mode', formData.deliveryMode);
    formDataToSend.append('challan_created_by', formData.challanCreatedBy || '');
    formDataToSend.append('customer_name', formData.customerName);
    formDataToSend.append('parentage', formData.parentage);
    formDataToSend.append('address', formData.address);
    formDataToSend.append('hypothecation', formData.hypothecation || '');
    formDataToSend.append('hypothecation_other', formData.hypothecationOther || '');
    formDataToSend.append('mobile_no', formData.mobileNo);
    formDataToSend.append('is_customer', formData.isCustomer);
    formDataToSend.append('tractor_name', formData.tractorName);
    formDataToSend.append('tractor_model', formData.tractorModel);
    formDataToSend.append('chassis_no', formData.chassisNo);
    formDataToSend.append('engine_no', formData.engineNo);
    formDataToSend.append('year_of_manufacture', formData.yearOfManufacture);
    formDataToSend.append('tire_make', formData.tiresMake || '');
    formDataToSend.append('fip_make', formData.fipMake || '');
    formDataToSend.append('battery_make', formData.batteryMake || '');
    formDataToSend.append('deal_price', formData.dealPrice);
    formDataToSend.append('amount_paid', formData.amountPaid || '0');
    formDataToSend.append('finance_amount_paid', formData.financeAmountPaid || '0');
    formDataToSend.append('total_paid', formData.totalPaid || '0');
    formDataToSend.append('balance_amount', formData.balanceAmount || '0');
    formDataToSend.append('payment_status', formData.paymentStatus);
    formDataToSend.append('financier_name', formData.financierName || '');
    formDataToSend.append('accessories', prepareAccessoriesData());
    formDataToSend.append('terms_accepted', acceptTerms ? '1' : '0');

    // Branch fields
    formDataToSend.append('branch_name', formData.branchName || '');
    formDataToSend.append('branch_person_name', formData.branchPersonName || '');
    formDataToSend.append('branch_address', formData.branchAddress || '');
    formDataToSend.append('branch_phone', formData.branchPhone || '');

    // Representative fields
    formDataToSend.append('relative_name', formData.relativeName || '');
    formDataToSend.append('relative_father_name', formData.relativeFatherName || '');
    formDataToSend.append('relative_address', formData.relativeAddress || '');
    formDataToSend.append('relative_phone', formData.relativePhone || '');
    formDataToSend.append('relative_relation', formData.relativeRelation || '');
    formDataToSend.append('relation_other', formData.relationOther || '');

    // Exchange tractor fields
    formDataToSend.append('is_exchange_tractor', formData.isExchangeTractor || '');
    formDataToSend.append('old_tractor_name', formData.oldTractorName || '');
    formDataToSend.append('old_tractor_chassis_no', formData.oldTractorChassisNo || '');
    formDataToSend.append('old_tractor_year_of_manufacture', formData.oldTractorYearOfManufacture || '');
    formDataToSend.append('exchange_deal_amount', formData.exchangeDealAmount || '');
    formDataToSend.append('old_tractor_remark', formData.oldTractorRemark || '');

    // Additional fields
    formDataToSend.append('location', formData.location || '');
    formDataToSend.append('payment_method', formData.paymentMethod || 'cash');
    formDataToSend.append('remarks', formData.remarks || '');
    formDataToSend.append('auth_id', formData.authId || '');

    // Other fields for tires, fip, battery
    if (formData.tiresMake === 'Other') {
      formDataToSend.append('tire_make_other', formData.tiresMakeOther || '');
    }
    if (formData.fipMake === 'Other') {
      formDataToSend.append('fip_make_other', formData.fipMakeOther || '');
    }
    if (formData.batteryMake === 'Other') {
      formDataToSend.append('battery_make_other', formData.batteryMakeOther || '');
    }

    // Add payment entries
    paymentEntries.forEach((entry, index) => {
      if (entry.entry_date && entry.entry_by && entry.amount) {
        formDataToSend.append(`entry_date[${index}]`, entry.entry_date);
        formDataToSend.append(`entry_by[${index}]`, entry.entry_by);
        formDataToSend.append(`amount[${index}]`, entry.amount);
        formDataToSend.append(`payment_remarks[${index}]`, entry.remarks || '');
      }
    });

    // Add images with proper file names
    if (customerSignature && customerSignature.startsWith('file://')) {
      formDataToSend.append('customer_signature', {
        uri: customerSignature,
        type: 'image/jpeg',
        name: `customer_signature_${Date.now()}.jpg`,
      });
    }

    if (managerSignature && managerSignature.startsWith('file://')) {
      formDataToSend.append('manager_signature', {
        uri: managerSignature,
        type: 'image/jpeg',
        name: `manager_signature_${Date.now()}.jpg`,
      });
    }

    if (driverSignature && driverSignature.startsWith('file://')) {
      formDataToSend.append('driver_signature', {
        uri: driverSignature,
        type: 'image/jpeg',
        name: `driver_signature_${Date.now()}.jpg`,
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
        url: 'https://argosmob.uk/makroo/public/api/v1/delivery-challan/form/update',
        headers: {
          'Content-Type': 'multipart/form-data',
          Accept: 'application/json',
        },
        data: formDataToSend,
        timeout: 30000,
      };

      const response = await axios(config);

      if (response.data && (response.data.success === true || response.data.status === 'success' || response.data.message?.toLowerCase().includes('success'))) {
        setStatus(response.data.data?.status || 'pending');
        setIsEditMode(false);

        Alert.alert(
          'Success',
          response.data.message || 'Delivery Challan updated successfully! Form is now pending approval.',
          [
            {
              text: 'OK',
              onPress: () => {
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
            errorMessage = firstError ? firstError[0] : 'Please check all required fields';
          } else {
            errorMessage = error.response.data.message || 'Validation error occurred';
          }
        } else {
          const serverError = error.response.data;
          errorMessage = serverError.message || serverError.error || `Server error: ${error.response.status}`;
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
      const config = {
        method: 'get',
        url: `https://argosmob.uk/makroo/public/api/v1/delivery-challan/form/generate-pdf/${existingFormId}`,
        timeout: 30000,
      };

      const response = await axios(config);

      if (response.data.status && response.data.pdf_link) {
        await Linking.openURL(response.data.pdf_link);
        Alert.alert('Success', 'PDF opened in browser');
      } else {
        Alert.alert('Error', 'Failed to generate PDF');
      }
    } catch (error) {
      console.log('PDF Error:', error);
      Alert.alert('Error', 'Failed to download PDF. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Render helper functions
  const renderInputField = (value, onChange, placeholder, keyboardType = 'default', editable = true) => {
    if (isEditMode) {
      return (
        <TextInput
          style={styles.textInput}
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
        <Text style={[styles.textInput, styles.readOnlyInput]}>
          {value || 'Not provided'}
        </Text>
      );
    }
  };

  const renderDropdownField = (value, onPress, placeholder) => {
    if (isEditMode) {
      return (
        <TouchableOpacity
          style={styles.dropdownInput}
          onPress={onPress}
          disabled={loading}>
          <Text style={value ? styles.selectedText : styles.placeholderText}>
            {value || placeholder}
          </Text>
          <Icon name="keyboard-arrow-down" size={24} color="#666" />
        </TouchableOpacity>
      );
    } else {
      return (
        <Text style={[styles.textInput, styles.readOnlyInput]}>
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
            style={[styles.textInput, {flex: 1}]}
            onPress={onPress}
            disabled={loading}>
            <Text style={date ? styles.selectedText : styles.placeholderText}>
              {date ? date.toLocaleDateString() : placeholder}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={onPress}
            disabled={loading}>
            <Icon name="calendar-today" size={20} color="#666" />
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <Text style={[styles.textInput, styles.readOnlyInput]}>
          {date ? date.toLocaleDateString() : 'Not provided'}
        </Text>
      );
    }
  };

  const renderManufactureDateField = (value, onPress, placeholder) => {
    if (isEditMode) {
      return (
        <View style={styles.inputWithIcon}>
          <TouchableOpacity
            style={[styles.textInput, {flex: 1}]}
            onPress={onPress}
            disabled={loading}>
            <Text style={value ? styles.selectedText : styles.placeholderText}>
              {value || placeholder}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={onPress}
            disabled={loading}>
            <Icon name="calendar-today" size={20} color="#666" />
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <Text style={[styles.textInput, styles.readOnlyInput]}>
          {value || 'Not provided'}
        </Text>
      );
    }
  };

  const renderSignatureBox = (imageUri, setImageFunction, label) => (
    <View style={styles.signatureContainer}>
      <Text style={styles.signatureLabel}>{label}</Text>
      {imageUri ? (
        <View style={styles.signatureImageContainer}>
          <Image source={{uri: imageUri}} style={styles.signatureImage} />
          {isEditMode && (
            <TouchableOpacity
              style={styles.changeSignatureButton}
              onPress={() => showImageSourceOptions(setImageFunction, `Update ${label}`)}>
              <Text style={styles.changeSignatureText}>Change {label}</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <View style={styles.signatureImageContainer}>
          {isEditMode && (
            <TouchableOpacity
              style={styles.addSignatureButton}
              onPress={() => showImageSourceOptions(setImageFunction, `Add ${label}`)}>
              <Text style={styles.addSignatureText}>Add {label}</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );

  const renderRadioOption = (value, currentValue, label, onPress) => (
    <TouchableOpacity
      style={[styles.radioOption, currentValue === value && styles.radioOptionSelected]}
      onPress={onPress}
      disabled={!isEditMode || loading}>
      <LinearGradient
        colors={currentValue === value ? ['#12C857', '#12C857'] : ['#f0f0f0', '#f0f0f0']}
        style={styles.radioGradient}>
        <View style={styles.radioInner}>
          {currentValue === value && <Icon name="check" size={24} color="#fff" />}
        </View>
      </LinearGradient>
      <Text style={styles.radioText}>{label}</Text>
    </TouchableOpacity>
  );

  const renderAccessoryItem = (accessory, label) => (
    <TouchableOpacity
      style={styles.accessoryItem}
      onPress={() => isEditMode && handleAccessoryToggle(accessory)}
      disabled={!isEditMode || loading}>
      <LinearGradient
        colors={accessories[accessory] ? ['#12C857', '#12C857'] : ['#f0f0f0', '#f0f0f0']}
        style={styles.accessoryCheckbox}>
        <View style={styles.accessoryCheckboxInner}>
          {accessories[accessory] && <Icon name="check" size={22} color="#fff" />}
        </View>
      </LinearGradient>
      <Text style={styles.accessoryText}>{label}</Text>
    </TouchableOpacity>
  );

  const renderPaymentEntry = (entry, index) => (
    <View key={index} style={styles.paymentEntryContainer}>
      <View style={styles.paymentEntryHeader}>
        <Text style={styles.paymentEntryTitle}>Payment Entry {index + 1}</Text>
        {paymentEntries.length > 1 && (
          <TouchableOpacity onPress={() => removePaymentEntry(index)} style={styles.removeEntryButton}>
            <Icon name="close" size={20} color="#F44336" />
          </TouchableOpacity>
        )}
      </View>
      
      <View style={styles.inputRow}>
        <View style={styles.inputContainer}>
          <Text style={styles.fieldLabel}>Entry Date</Text>
          <LinearGradient colors={['#7E5EA9', '#20AEBC']} style={styles.inputGradient}>
            {renderInputField(
              entry.entry_date,
              (text) => updatePaymentEntry(index, 'entry_date', text),
              'YYYY-MM-DD',
              'default',
              true
            )}
          </LinearGradient>
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.fieldLabel}>Entered By</Text>
          <LinearGradient colors={['#7E5EA9', '#20AEBC']} style={styles.inputGradient}>
            {renderInputField(
              entry.entry_by,
              (text) => updatePaymentEntry(index, 'entry_by', text),
              'Entered By',
              'default',
              true
            )}
          </LinearGradient>
        </View>
      </View>

      <View style={styles.inputRow}>
        <View style={styles.inputContainer}>
          <Text style={styles.fieldLabel}>Amount</Text>
          <LinearGradient colors={['#7E5EA9', '#20AEBC']} style={styles.inputGradient}>
            {renderInputField(
              entry.amount,
              (text) => updatePaymentEntry(index, 'amount', text),
              'Amount',
              'numeric',
              true
            )}
          </LinearGradient>
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.fieldLabel}>Remarks</Text>
          <LinearGradient colors={['#7E5EA9', '#20AEBC']} style={styles.inputGradient}>
            {renderInputField(
              entry.remarks,
              (text) => updatePaymentEntry(index, 'remarks', text),
              'Remarks',
              'default',
              true
            )}
          </LinearGradient>
        </View>
      </View>
    </View>
  );

  // QR Scanner Component
  const renderQRScanner = () => (
    <Modal
      visible={showChassisScanner || showEngineScanner}
      animationType="slide"
      transparent={false}
      onRequestClose={closeScanner}>
      <View style={styles.scannerContainer}>
        <View style={styles.scannerHeader}>
          <TouchableOpacity onPress={closeScanner} style={styles.scannerCloseButton}>
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

  // Dropdown Modal
  const renderDropdownModal = () => (
    <Modal
      visible={
        showTractorModelDropdown || showTiresMakeDropdown || showFipMakeDropdown ||
        showBatteryMakeDropdown || showPaymentStatusDropdown || showFinancerDropdown ||
        showHypothecationDropdown || showRelationDropdown || showExchangeTractorDropdown
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
              {showFinancerDropdown && 'Select Financier'}
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
              showTractorModelDropdown ? tractorModels :
              showTiresMakeDropdown ? tiresMakes :
              showFipMakeDropdown ? fipMakes :
              showBatteryMakeDropdown ? batteryMakes :
              showPaymentStatusDropdown ? paymentStatuses :
              showFinancerDropdown ? hypothecationOptions :
              showHypothecationDropdown ? hypothecationOptions :
              showRelationDropdown ? relationOptions :
              showExchangeTractorDropdown ? exchangeOptions : []
            }
            renderItem={({item}) => (
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
            )}
            keyExtractor={(item, index) => index.toString()}
            style={styles.dropdownList}
          />
        </View>
      </View>
    </Modal>
  );

  if (fetchLoading) {
    return (
      <View style={{flex: 1, paddingTop: insets.top, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#7E5EA9" />
        <Text style={{marginTop: 10}}>Loading form data...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, {paddingTop: insets.top, paddingBottom: insets.bottom}]}>
      {/* Header */}
      <LinearGradient
        colors={['#7E5EA9', '#20AEBC']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Delivery Challan</Text>
          {isEditMode && <Text style={styles.editModeText}>Edit Mode</Text>}
        </View>
      </LinearGradient>

      <ScrollView style={styles.scrollView}>
        {/* Form Header */}
        <View style={styles.formHeader}>
          <Text style={styles.Date}>{new Date().toLocaleDateString()}</Text>
        </View>

        {isEditMode && (
          <View style={styles.editModeContainer}>
            <Text style={styles.editModeText}>Edit Mode - Updating Form ID: {existingFormId}</Text>
          </View>
        )}

        <View style={styles.customerHeader}>
          <Text style={styles.customerName}>{formData.customerName || '—'}</Text>
          <Text style={[styles.statusText,
            status === 'approved' ? styles.statusApproved :
            status === 'pending' ? styles.statusPending :
            status === 'rejected' ? styles.statusRejected :
            status === 'edited' ? styles.statusEdited : styles.statusDefault
          ]}>
            Status: {status || '—'}
          </Text>
        </View>

        {/* Date */}
        <View style={styles.inputContainer}>
          <Text style={styles.fieldLabel}>Date</Text>
          <LinearGradient
            colors={['#7E5EA9', '#20AEBC']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={styles.inputGradient}>
            {renderDateField(formData.date, handleDateIconPress, 'Select Date')}
            {showDatePicker && isEditMode && (
              <DateTimePicker
                value={formData.date || new Date()}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={handleDateChange}
              />
            )}
          </LinearGradient>
        </View>

        {/* Delivery Mode */}
        <View style={styles.deliveryModeContainer}>
          <Text style={styles.sectionLabel}>Delivery Mode</Text>
          <View style={styles.deliveryModeButtons}>
            <TouchableOpacity
              style={[
                styles.deliveryModeButton,
                formData.deliveryMode === 'Self Pickup' && styles.deliveryModeSelected,
              ]}
              onPress={() => isEditMode && handleDeliveryModeSelect('Self Pickup')}
              disabled={!isEditMode || loading}>
              <LinearGradient
                colors={
                  formData.deliveryMode === 'Self Pickup'
                    ? ['#7E5EA9', '#20AEBC']
                    : ['#7E5EA9', '#20AEBC']
                }
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={styles.deliveryModeGradient}>
                <Text
                  style={[
                    styles.deliveryModeText,
                    formData.deliveryMode === 'Self Pickup' && styles.deliveryModeTextSelected,
                  ]}>
                  Self Pickup
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.deliveryModeButton,
                formData.deliveryMode === 'Branch' && styles.deliveryModeSelected,
              ]}
              onPress={() => isEditMode && handleDeliveryModeSelect('Branch')}
              disabled={!isEditMode || loading}>
              <LinearGradient
                colors={
                  formData.deliveryMode === 'Branch'
                    ? ['#7E5EA9', '#20AEBC']
                    : ['#7E5EA9', '#20AEBC']
                }
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={styles.deliveryModeGradient}>
                <Text
                  style={[
                    styles.deliveryModeText,
                    formData.deliveryMode === 'Branch' && styles.deliveryModeTextSelected,
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

            {/* Branch Name */}
            <View style={styles.inputRow}>
              <View style={styles.fullWidthInputContainer}>
                <Text style={styles.fieldLabel}>Branch Name</Text>
                <LinearGradient
                  colors={['#7E5EA9', '#20AEBC']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  style={styles.inputGradient}>
                  {renderInputField(
                    formData.branchName,
                    text => handleInputChange('branchName', text),
                    'Branch Name',
                  )}
                </LinearGradient>
              </View>
            </View>

            {/* Branch Person Name */}
            <View style={styles.inputRow}>
              <View style={styles.fullWidthInputContainer}>
                <Text style={styles.fieldLabel}>Branch Person Name</Text>
                <LinearGradient
                  colors={['#7E5EA9', '#20AEBC']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  style={styles.inputGradient}>
                  {renderInputField(
                    formData.branchPersonName,
                    text => handleInputChange('branchPersonName', text),
                    'Branch Person Name',
                  )}
                </LinearGradient>
              </View>
            </View>

            {/* Branch Address */}
            <View style={styles.inputRow}>
              <View style={styles.fullWidthInputContainer}>
                <Text style={styles.fieldLabel}>Branch Address</Text>
                <LinearGradient
                  colors={['#7E5EA9', '#20AEBC']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  style={styles.inputGradient}>
                  {renderInputField(
                    formData.branchAddress,
                    text => handleInputChange('branchAddress', text),
                    'Branch Address',
                    'default',
                    true,
                  )}
                </LinearGradient>
              </View>
            </View>

            {/* Branch Phone */}
            <View style={styles.inputRow}>
              <View style={styles.fullWidthInputContainer}>
                <Text style={styles.fieldLabel}>Branch Phone</Text>
                <LinearGradient
                  colors={['#7E5EA9', '#20AEBC']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  style={styles.inputGradient}>
                  {renderInputField(
                    formData.branchPhone,
                    text => handleInputChange('branchPhone', text),
                    'Branch Phone',
                    'phone-pad',
                  )}
                </LinearGradient>
              </View>
            </View>
          </View>
        )}

        {/* Customer Details Heading */}
        <Text style={styles.sectionHeading}>Customer Details</Text>

        {/* Challan Created By */}
        <View style={styles.inputRow}>
          <View style={styles.inputContainer}>
            <Text style={styles.fieldLabel}>Challan Created By</Text>
            <LinearGradient
              colors={['#7E5EA9', '#20AEBC']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={styles.inputGradient}>
              {renderInputField(
                formData.challanCreatedBy,
                text => handleInputChange('challanCreatedBy', text),
                'Challan Created By',
              )}
            </LinearGradient>
          </View>
        </View>

        {/* Customer Name & Parentage */}
        <View style={styles.inputRow}>
          <View style={styles.inputContainer}>
            <Text style={styles.fieldLabel}>Customer Name</Text>
            <LinearGradient
              colors={['#7E5EA9', '#20AEBC']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={styles.inputGradient}>
              {renderInputField(
                formData.customerName,
                text => handleInputChange('customerName', text),
                'Customer Name',
              )}
            </LinearGradient>
          </View>
          <View style={{marginBottom: 15}} />
          <View style={styles.inputContainer}>
            <Text style={styles.fieldLabel}>Parentage</Text>
            <LinearGradient
              colors={['#7E5EA9', '#20AEBC']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={styles.inputGradient}>
              {renderInputField(
                formData.parentage,
                text => handleInputChange('parentage', text),
                'Parentage',
              )}
            </LinearGradient>
          </View>
        </View>

        {/* Address */}
        <View style={styles.inputRow}>
          <View style={styles.fullWidthInputContainer}>
            <Text style={styles.fieldLabel}>Address</Text>
            <LinearGradient
              colors={['#7E5EA9', '#20AEBC']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={styles.inputGradient}>
              {renderInputField(
                formData.address,
                text => handleInputChange('address', text),
                'Enter Address',
                'default',
                true,
              )}
            </LinearGradient>
          </View>
        </View>

        {/* Hypothecation */}
        <View style={styles.inputRow}>
          <View style={styles.inputContainer}>
            <Text style={styles.fieldLabel}>Hypothecation</Text>
            <LinearGradient
              colors={['#7E5EA9', '#20AEBC']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={styles.inputGradient}>
              {renderDropdownField(
                formData.hypothecation,
                () => setShowHypothecationDropdown(true),
                'Select Hypothecation',
              )}
            </LinearGradient>
          </View>
        </View>

        {/* Hypothecation Other - Conditionally Rendered */}
        {formData.hypothecation === 'Other' && (
          <View style={styles.inputRow}>
            <View style={styles.fullWidthInputContainer}>
              <Text style={styles.fieldLabel}>Hypothecation Details</Text>
              <LinearGradient
                colors={['#7E5EA9', '#20AEBC']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={styles.inputGradient}>
                {renderInputField(
                  formData.hypothecationOther,
                  text => handleInputChange('hypothecationOther', text),
                  'Enter Other Hypothecation',
                )}
              </LinearGradient>
            </View>
          </View>
        )}

        {/* Mobile No */}
        <View style={styles.inputRow}>
          <View style={styles.inputContainer}>
            <Text style={styles.fieldLabel}>Mobile No</Text>
            <LinearGradient
              colors={['#7E5EA9', '#20AEBC']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={styles.inputGradient}>
              {renderInputField(
                formData.mobileNo,
                text => handleInputChange('mobileNo', text),
                'Mobile No.',
                'phone-pad',
              )}
            </LinearGradient>
          </View>
        </View>

        {/* Are You Customer? */}
        <View style={styles.radioSection}>
          <Text style={styles.radioLabel}>Are You Customer?</Text>
          <View style={styles.radioOptions}>
            {renderRadioOption('1', formData.isCustomer, 'Yes', () =>
              handleIsCustomerSelect('Yes'),
            )}
            {renderRadioOption('0', formData.isCustomer, 'No', () =>
              handleIsCustomerSelect('No'),
            )}
          </View>
        </View>

        {/* Representative Fields - Conditionally Rendered */}
        {formData.isCustomer === '0' && (
          <View style={styles.representativeSection}>
            <Text style={styles.sectionHeading}>Representative Details</Text>

            {/* Representative Name */}
            <View style={styles.inputRow}>
              <View style={styles.fullWidthInputContainer}>
                <Text style={styles.fieldLabel}>Representative Name</Text>
                <LinearGradient
                  colors={['#7E5EA9', '#20AEBC']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  style={styles.inputGradient}>
                  {renderInputField(
                    formData.relativeName,
                    text => handleInputChange('relativeName', text),
                    'Representative Name',
                  )}
                </LinearGradient>
              </View>
            </View>

            {/* Representative Father's Name */}
            <View style={styles.inputRow}>
              <View style={styles.fullWidthInputContainer}>
                <Text style={styles.fieldLabel}>Father's Name</Text>
                <LinearGradient
                  colors={['#7E5EA9', '#20AEBC']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  style={styles.inputGradient}>
                  {renderInputField(
                    formData.relativeFatherName,
                    text => handleInputChange('relativeFatherName', text),
                    "Father's Name",
                  )}
                </LinearGradient>
              </View>
            </View>

            {/* Representative Address */}
            <View style={styles.inputRow}>
              <View style={styles.fullWidthInputContainer}>
                <Text style={styles.fieldLabel}>Representative Address</Text>
                <LinearGradient
                  colors={['#7E5EA9', '#20AEBC']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  style={styles.inputGradient}>
                  {renderInputField(
                    formData.relativeAddress,
                    text => handleInputChange('relativeAddress', text),
                    'Representative Address',
                    'default',
                    true,
                  )}
                </LinearGradient>
              </View>
            </View>

            {/* Representative Phone */}
            <View style={styles.inputRow}>
              <View style={styles.fullWidthInputContainer}>
                <Text style={styles.fieldLabel}>Representative Phone</Text>
                <LinearGradient
                  colors={['#7E5EA9', '#20AEBC']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  style={styles.inputGradient}>
                  {renderInputField(
                    formData.relativePhone,
                    text => handleInputChange('relativePhone', text),
                    'Representative Phone',
                    'phone-pad',
                  )}
                </LinearGradient>
              </View>
            </View>

            {/* Relation with Owner */}
            <View style={styles.inputRow}>
              <View style={styles.inputContainer}>
                <Text style={styles.fieldLabel}>Relation with Owner</Text>
                <LinearGradient
                  colors={['#7E5EA9', '#20AEBC']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  style={styles.inputGradient}>
                  {renderDropdownField(
                    formData.relativeRelation,
                    () => setShowRelationDropdown(true),
                    'Relation with Owner',
                  )}
                </LinearGradient>
              </View>
            </View>

            {/* Relation Other - Conditionally Rendered */}
            {formData.relativeRelation === 'Other' && (
              <View style={styles.inputRow}>
                <View style={styles.fullWidthInputContainer}>
                  <Text style={styles.fieldLabel}>Relation Details</Text>
                  <LinearGradient
                    colors={['#7E5EA9', '#20AEBC']}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 0}}
                    style={styles.inputGradient}>
                    {renderInputField(
                      formData.relationOther,
                      text => handleInputChange('relationOther', text),
                      'Enter Other Relation',
                    )}
                  </LinearGradient>
                </View>
              </View>
            )}
          </View>
        )}

        {/* Tractor Details Heading */}
        <Text style={styles.sectionHeading}>Tractor Details</Text>

        {/* Tractor Name & Model */}
        <View style={styles.inputRow}>
          <View style={styles.inputContainer}>
            <Text style={styles.fieldLabel}>Tractor Name</Text>
            <LinearGradient
              colors={['#7E5EA9', '#20AEBC']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={styles.inputGradient}>
              {renderInputField(
                formData.tractorName,
                text => handleInputChange('tractorName', text),
                'Tractor Name',
              )}
            </LinearGradient>
          </View>
          <View style={{marginBottom: 15}} />
          <View style={styles.inputContainer}>
            <Text style={styles.fieldLabel}>Tractor Model</Text>
            <LinearGradient
              colors={['#7E5EA9', '#20AEBC']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={styles.inputGradient}>
              {renderDropdownField(
                formData.tractorModel,
                () => setShowTractorModelDropdown(true),
                'Select Model',
              )}
            </LinearGradient>
          </View>
        </View>

        {/* Chassis No & Engine No */}
        <View style={styles.inputRow}>
          <View style={styles.inputContainer}>
            <Text style={styles.fieldLabel}>Chassis No</Text>
            <LinearGradient
              colors={['#7E5EA9', '#20AEBC']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={styles.inputGradient}>
              <View style={styles.inputWithIcon}>
                {renderInputField(
                  formData.chassisNo,
                  text => handleInputChange('chassisNo', text),
                  'Chassis No',
                )}
                {isEditMode && (
                  <TouchableOpacity
                    style={styles.iconButton}
                    onPress={handleChassisScanPress}
                    disabled={loading}>
                    <Icon name="qr-code-scanner" size={20} color="#666" />
                  </TouchableOpacity>
                )}
              </View>
            </LinearGradient>
          </View>
          <View style={{marginBottom: 15}} />
          <View style={styles.inputContainer}>
            <Text style={styles.fieldLabel}>Engine No</Text>
            <LinearGradient
              colors={['#7E5EA9', '#20AEBC']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={styles.inputGradient}>
              <View style={styles.inputWithIcon}>
                {renderInputField(
                  formData.engineNo,
                  text => handleInputChange('engineNo', text),
                  'Engine No',
                )}
                {isEditMode && (
                  <TouchableOpacity
                    style={styles.iconButton}
                    onPress={handleEngineScanPress}
                    disabled={loading}>
                    <Icon name="qr-code-scanner" size={20} color="#666" />
                  </TouchableOpacity>
                )}
              </View>
            </LinearGradient>
          </View>
        </View>

        {/* Year of Manufacture */}
        <View style={styles.inputRow}>
          <View style={styles.inputContainer}>
            <Text style={styles.fieldLabel}>Year of Manufacture</Text>
            <LinearGradient
              colors={['#7E5EA9', '#20AEBC']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={styles.inputGradient}>
              {renderManufactureDateField(
                formData.yearOfManufacture,
                handleManufactureDateIconPress,
                'Month/Year of Manufacture',
              )}
              {showManufactureDatePicker && isEditMode && (
                <DateTimePicker
                  value={new Date()}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={handleManufactureDateChange}
                />
              )}
            </LinearGradient>
          </View>
        </View>

        {/* Tires Make with Other option */}
        <View style={styles.inputRow}>
          <View style={styles.inputContainer}>
            <Text style={styles.fieldLabel}>Tires Make</Text>
            <LinearGradient
              colors={['#7E5EA9', '#20AEBC']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={styles.inputGradient}>
              {renderDropdownField(
                formData.tiresMake,
                () => setShowTiresMakeDropdown(true),
                'Select Tires Make',
              )}
            </LinearGradient>
          </View>
        </View>

        {/* Tires Make Other - Conditionally Rendered */}
        {formData.tiresMake === 'Other' && (
          <View style={styles.inputRow}>
            <View style={styles.fullWidthInputContainer}>
              <Text style={styles.fieldLabel}>Tires Make Details</Text>
              <LinearGradient
                colors={['#7E5EA9', '#20AEBC']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={styles.inputGradient}>
                {renderInputField(
                  formData.tiresMakeOther,
                  text => handleInputChange('tiresMakeOther', text),
                  'Enter Other Tires Make',
                )}
              </LinearGradient>
            </View>
          </View>
        )}

        {/* FIP Make with Other option */}
        <View style={styles.inputRow}>
          <View style={styles.inputContainer}>
            <Text style={styles.fieldLabel}>FIP Make</Text>
            <LinearGradient
              colors={['#7E5EA9', '#20AEBC']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={styles.inputGradient}>
              {renderDropdownField(
                formData.fipMake,
                () => setShowFipMakeDropdown(true),
                'FIP Make',
              )}
            </LinearGradient>
          </View>
        </View>

        {/* FIP Make Other - Conditionally Rendered */}
        {formData.fipMake === 'Other' && (
          <View style={styles.inputRow}>
            <View style={styles.fullWidthInputContainer}>
              <Text style={styles.fieldLabel}>FIP Make Details</Text>
              <LinearGradient
                colors={['#7E5EA9', '#20AEBC']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={styles.inputGradient}>
                {renderInputField(
                  formData.fipMakeOther,
                  text => handleInputChange('fipMakeOther', text),
                  'Enter Other FIP Make',
                )}
              </LinearGradient>
            </View>
          </View>
        )}

        {/* Battery Make with Other option */}
        <View style={styles.inputRow}>
          <View style={styles.inputContainer}>
            <Text style={styles.fieldLabel}>Battery Make</Text>
            <LinearGradient
              colors={['#7E5EA9', '#20AEBC']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={styles.inputGradient}>
              {renderDropdownField(
                formData.batteryMake,
                () => setShowBatteryMakeDropdown(true),
                'Select Battery Make',
              )}
            </LinearGradient>
          </View>
        </View>

        {/* Battery Make Other - Conditionally Rendered */}
        {formData.batteryMake === 'Other' && (
          <View style={styles.inputRow}>
            <View style={styles.fullWidthInputContainer}>
              <Text style={styles.fieldLabel}>Battery Make Details</Text>
              <LinearGradient
                colors={['#7E5EA9', '#20AEBC']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={styles.inputGradient}>
                {renderInputField(
                  formData.batteryMakeOther,
                  text => handleInputChange('batteryMakeOther', text),
                  'Enter Other Battery Make',
                )}
              </LinearGradient>
            </View>
          </View>
        )}

        {/* Payment Details Heading */}
        <Text style={styles.sectionHeading}>Payment Details</Text>

        {/* Deal Price */}
        <View style={styles.inputRow}>
          <View style={styles.inputContainer}>
            <Text style={styles.fieldLabel}>Deal Price</Text>
            <LinearGradient
              colors={['#7E5EA9', '#20AEBC']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={styles.inputGradient}>
              {renderInputField(
                formData.dealPrice,
                text => handleInputChange('dealPrice', text),
                'Deal Price',
                'numeric',
              )}
            </LinearGradient>
          </View>
        </View>

        {/* Amount Paid & Finance Amount Paid */}
        <View style={styles.inputRow}>
          <View style={styles.inputContainer}>
            <Text style={styles.fieldLabel}>Amount Paid</Text>
            <LinearGradient
              colors={['#7E5EA9', '#20AEBC']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={styles.inputGradient}>
              {renderInputField(
                formData.amountPaid,
                text => handleInputChange('amountPaid', text),
                'Amount Paid',
                'numeric',
              )}
            </LinearGradient>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.fieldLabel}>Finance Amount Paid</Text>
            <LinearGradient
              colors={['#7E5EA9', '#20AEBC']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={styles.inputGradient}>
              {renderInputField(
                formData.financeAmountPaid,
                text => handleInputChange('financeAmountPaid', text),
                'Finance Amount Paid',
                'numeric',
              )}
            </LinearGradient>
          </View>
        </View>

        {/* Total Paid & Balance Amount */}
        <View style={styles.inputRow}>
          <View style={styles.inputContainer}>
            <Text style={styles.fieldLabel}>Total Amount Paid</Text>
            <LinearGradient
              colors={['#7E5EA9', '#20AEBC']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={styles.inputGradient}>
              {renderInputField(
                formData.totalPaid,
                text => handleInputChange('totalPaid', text),
                'Total Paid',
                'numeric',
              )}
            </LinearGradient>
          </View>
          <View style={{marginBottom: 15}} />
          <View style={styles.inputContainer}>
            <Text style={styles.fieldLabel}>Total Balance Amount</Text>
            <LinearGradient
              colors={['#7E5EA9', '#20AEBC']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={styles.inputGradient}>
              {renderInputField(
                formData.balanceAmount,
                text => handleInputChange('balanceAmount', text),
                'Balance Amount',
                'numeric',
              )}
            </LinearGradient>
          </View>
        </View>

        {/* Payment Status */}
        <View style={styles.inputRow}>
          <View style={styles.inputContainer}>
            <Text style={styles.fieldLabel}>Payment Status</Text>
            <LinearGradient
              colors={['#7E5EA9', '#20AEBC']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={styles.inputGradient}>
              {renderDropdownField(
                formData.paymentStatus,
                () => setShowPaymentStatusDropdown(true),
                'Select Payment Status',
              )}
            </LinearGradient>
          </View>
        </View>

        {/* Financer Name */}
        <View style={styles.inputRow}>
          <View style={styles.inputContainer}>
            <Text style={styles.fieldLabel}>Financier Name</Text>
            <LinearGradient
              colors={['#7E5EA9', '#20AEBC']}
              style={styles.inputGradient}>
              {renderDropdownField(
                formData.financierName,
                () => setShowFinancerDropdown(true),
                'Financier Name',
              )}
            </LinearGradient>
          </View>
        </View>

        {/* Payment Entries Section */}
        <View style={styles.paymentEntriesSection}>
          <View style={styles.paymentEntriesHeader}>
            <Text style={styles.sectionHeading}>Payment History</Text>
            {isEditMode && (
              <TouchableOpacity onPress={addPaymentEntry} style={styles.addEntryButton}>
                <Icon name="add" size={20} color="#fff" />
                <Text style={styles.addEntryText}>Add Entry</Text>
              </TouchableOpacity>
            )}
          </View>
          {paymentEntries.map((entry, index) => renderPaymentEntry(entry, index))}
        </View>

        {/* Exchange Tractor Section */}
        <View style={styles.exchangeSection}>
          <Text style={styles.sectionHeading}>Exchange Tractor Details</Text>
          
          <View style={styles.radioSection}>
            <Text style={styles.radioLabel}>Is Exchange Tractor?</Text>
            <View style={styles.radioOptions}>
              {renderRadioOption('yes', formData.isExchangeTractor, 'Yes', () => handleExchangeTractorSelect('yes'))}
              {renderRadioOption('no', formData.isExchangeTractor, 'No', () => handleExchangeTractorSelect('no'))}
            </View>
          </View>

          {formData.isExchangeTractor === 'yes' && (
            <>
              <View style={styles.inputRow}>
                <View style={styles.fullWidthInputContainer}>
                  <Text style={styles.fieldLabel}>Old Tractor Name</Text>
                  <LinearGradient colors={['#7E5EA9', '#20AEBC']} style={styles.inputGradient}>
                    {renderInputField(
                      formData.oldTractorName,
                      text => handleInputChange('oldTractorName', text),
                      'Old Tractor Name'
                    )}
                  </LinearGradient>
                </View>
              </View>

              <View style={styles.inputRow}>
                <View style={styles.fullWidthInputContainer}>
                  <Text style={styles.fieldLabel}>Old Tractor Chassis No</Text>
                  <LinearGradient colors={['#7E5EA9', '#20AEBC']} style={styles.inputGradient}>
                    {renderInputField(
                      formData.oldTractorChassisNo,
                      text => handleInputChange('oldTractorChassisNo', text),
                      'Old Tractor Chassis No'
                    )}
                  </LinearGradient>
                </View>
              </View>

              <View style={styles.inputRow}>
                <View style={styles.fullWidthInputContainer}>
                  <Text style={styles.fieldLabel}>Old Tractor Year of Manufacture</Text>
                  <LinearGradient colors={['#7E5EA9', '#20AEBC']} style={styles.inputGradient}>
                    {renderInputField(
                      formData.oldTractorYearOfManufacture,
                      text => handleInputChange('oldTractorYearOfManufacture', text),
                      'Old Tractor Year of Manufacture'
                    )}
                  </LinearGradient>
                </View>
              </View>

              <View style={styles.inputRow}>
                <View style={styles.fullWidthInputContainer}>
                  <Text style={styles.fieldLabel}>Exchange Deal Amount</Text>
                  <LinearGradient colors={['#7E5EA9', '#20AEBC']} style={styles.inputGradient}>
                    {renderInputField(
                      formData.exchangeDealAmount,
                      text => handleInputChange('exchangeDealAmount', text),
                      'Exchange Deal Amount',
                      'numeric'
                    )}
                  </LinearGradient>
                </View>
              </View>

              <View style={styles.inputRow}>
                <View style={styles.fullWidthInputContainer}>
                  <Text style={styles.fieldLabel}>Old Tractor Remark</Text>
                  <LinearGradient colors={['#7E5EA9', '#20AEBC']} style={styles.inputGradient}>
                    {renderInputField(
                      formData.oldTractorRemark,
                      text => handleInputChange('oldTractorRemark', text),
                      'Old Tractor Remark'
                    )}
                  </LinearGradient>
                </View>
              </View>
            </>
          )}
        </View>

        {/* Additional Fields Section */}
        <View style={styles.additionalSection}>
          <Text style={styles.sectionHeading}>Additional Details</Text>
          
          <View style={styles.inputRow}>
            <View style={styles.fullWidthInputContainer}>
              <Text style={styles.fieldLabel}>Location</Text>
              <LinearGradient colors={['#7E5EA9', '#20AEBC']} style={styles.inputGradient}>
                {renderInputField(
                  formData.location,
                  text => handleInputChange('location', text),
                  'Location'
                )}
              </LinearGradient>
            </View>
          </View>

          <View style={styles.inputRow}>
            <View style={styles.fullWidthInputContainer}>
              <Text style={styles.fieldLabel}>Remarks</Text>
              <LinearGradient colors={['#7E5EA9', '#20AEBC']} style={styles.inputGradient}>
                {renderInputField(
                  formData.remarks,
                  text => handleInputChange('remarks', text),
                  'Remarks'
                )}
              </LinearGradient>
            </View>
          </View>

          <View style={styles.inputRow}>
            <View style={styles.fullWidthInputContainer}>
              <Text style={styles.fieldLabel}>Auth ID</Text>
              <LinearGradient colors={['#7E5EA9', '#20AEBC']} style={styles.inputGradient}>
                {renderInputField(
                  formData.authId,
                  text => handleInputChange('authId', text),
                  'Auth ID'
                )}
              </LinearGradient>
            </View>
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
          {renderAccessoryItem('bumper', 'Bumper Issued')}
          {renderAccessoryItem('cultivator', 'Cultivator Issued')}
          {renderAccessoryItem('leveler', 'Leveler Issued')}
          {renderAccessoryItem('rallyFenderSeats', 'Rally Fender Seats Issued')}
          {renderAccessoryItem('weightsRear', 'Weights Rear Issued')}
          {renderAccessoryItem('waterTanker', 'Water Tanker Issued')}
          {renderAccessoryItem('trolly', 'Trolly Issued')}
          {renderAccessoryItem('weightFront', 'Weight Front Issued')}
          {renderAccessoryItem('rearTowingHook', 'Rear Towing Hook Issued')}
          {renderAccessoryItem('hood', 'Hood Issued')}
          {renderAccessoryItem('ptoPully', 'PTO Pully Issued')}
          {renderAccessoryItem('drawbar', 'Drawbar Issued')}
          {renderAccessoryItem('cageWheels', 'Cage Wheels Issued')}
          {renderAccessoryItem('tool', 'Tool Issued')}
          {renderAccessoryItem('toplink', 'Top Link Issued')}
        </View>

        {/* Terms and Conditions */}
        <View style={styles.termsSection}>
          <Text style={styles.termsHeading}>Terms and Conditions</Text>

          <Text style={styles.termItem}>
            <Text style={{fontSize: 14, fontFamily: 'Inter_28pt-SemiBold'}}>
              Delivery Condition :
            </Text>{' '}
            The Tractor Has Been Delivered To The Customer In Good Physical
            Condition And Fully Operational Working Condition. The Customer Has
            Inspected The Vehicle At The Time Of Delivery And Accepts Its
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
            Policy. All Services And Repairs During The Warranty Period Must Be
            Carried Out At Authorized Service Centers Only.
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
            Unless Otherwise Agreed In Writing. Any Outstanding Amounts Must Be
            Cleared As Per The Mutually Agreed Timeline.
          </Text>

          <Text style={styles.termItem}>
            <Text style={{fontSize: 14, fontFamily: 'Inter_28pt-SemiBold'}}>
              Dispute Resolution :
            </Text>{' '}
            In Case Of Any Disputes Arising From This Delivery, The Matter Shall
            Be Resolved Amicably Between Both Parties. If Unresolved, It Will Be
            Subject To The Jurisdiction Of The Dealer's Location.
          </Text>

          <Text style={styles.termItem}>
            <Text style={{fontSize: 14, fontFamily: 'Inter_28pt-SemiBold'}}>
              Acknowledgement :
            </Text>{' '}
            The Customer Acknowledges And Agrees To The Above Terms And Confirms
            That The Tractor Was Received In A Good And Working Condition.
          </Text>

          {/* Accept Terms Checkbox */}
          <TouchableOpacity
            style={styles.termsCheckbox}
            onPress={() => isEditMode && setAcceptTerms(!acceptTerms)}
            activeOpacity={0.8}
            disabled={!isEditMode || loading}>
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

        {/* Signatures Section */}
        <View style={styles.signatureSection}>
          <Text style={styles.sectionHeading}>Signatures</Text>
          <View style={styles.signatureRow}>
            {renderSignatureBox(
              customerSignature,
              setCustomerSignature,
              'Customer Signature',
            )}
            {renderSignatureBox(
              managerSignature,
              setManagerSignature,
              'Manager Signature',
            )}
            {renderSignatureBox(
              driverSignature,
              setDriverSignature,
              'Driver Signature',
            )}
          </View>
        </View>

        {/* Buttons */}
        <View style={styles.buttonsContainer}>
          {status === 'edited' && !isEditMode && (
            <TouchableOpacity style={styles.editButton} onPress={handleEditPress}>
              <Text style={styles.editButtonText}>Edit Form</Text>
            </TouchableOpacity>
          )}

          {isEditMode && (
            <>
              <TouchableOpacity
                style={[styles.submitButton, (loading || !acceptTerms) && styles.disabledButton]}
                onPress={handleUpdate}
                disabled={loading || !acceptTerms}>
                {loading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.buttonText}>Update Delivery Challan</Text>
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

          {status === 'approved' && (
            <TouchableOpacity
              style={[styles.pdfButton, loading && styles.disabledButton]}
              onPress={handleDownloadPDF}
              disabled={loading}>
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.buttonText}>Download PDF</Text>
              )}
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.homeButton, loading && styles.disabledButton]}
            onPress={() => navigation.goBack()}
            disabled={loading}>
            <Text style={styles.buttonText}>Back to List</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* QR Scanner Modal */}
      {renderQRScanner()}

      {/* Dropdown Modal */}
      {renderDropdownModal()}
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
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 5,
    marginRight: 10,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
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
  formHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  formNo: {
    fontSize: 14,
    fontFamily: 'Inter_28pt-SemiBold',
    color: '#000',
  },
  Date: {
    fontSize: 12,
    color: '#00000099',
    fontFamily: 'Inter_28pt-Regular',
  },
  editModeContainer: {
    backgroundColor: '#f0e6ff',
    padding: 8,
    borderRadius: 5,
    marginVertical: 5,
    alignItems: 'center',
  },
  customerHeader: {
    alignItems: 'center',
    marginVertical: 10,
    marginBottom: 20,
  },
  customerName: {
    fontSize: 20,
    color: '#000',
    fontFamily: 'Inter_28pt-SemiBold',
  },
  customerId: {
    fontSize: 13,
    color: '#56616D',
    fontFamily: 'Inter_28pt-SemiBold',
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Inter_28pt-SemiBold',
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
    backgroundColor: '#FF9800',
    color: 'white',
  },
  statusDefault: {
    backgroundColor: '#9E9E9E',
    color: 'white',
  },
  fieldLabel: {
    fontSize: 14,
    fontFamily: 'Inter_28pt-Medium',
    marginBottom: 5,
    color: '#000',
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputGradient: {
    borderRadius: 8,
    padding: 1.2,
  },
  textInput: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    fontSize: 14,
    color: '#000',
    fontFamily: 'Inter_28pt-Regular',
  },
  readOnlyInput: {
    color: '#666',
    backgroundColor: '#f5f5f5',
  },
  iconButton: {
    padding: 4,
    marginRight: 10,
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
    fontFamily: 'Inter_28pt-Regular',
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
  inputRow: {
    marginVertical: 10,
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
    fontFamily: 'Inter_28pt-Regular',
  },
  placeholderText: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Inter_28pt-Regular',
  },
  inputWithIcon: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    fontFamily: 'Inter_28pt-SemiBold',
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
  editButton: {
    backgroundColor: '#FFA000',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter_28pt-SemiBold',
  },
  submitButton: {
    backgroundColor: '#7E5EA9',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  cancelButton: {
    backgroundColor: '#6c757d',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter_28pt-SemiBold',
  },
  pdfButton: {
    backgroundColor: '#4CAF50',
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
    fontFamily: 'Inter_28pt-SemiBold',
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
    fontFamily: 'Inter_28pt-Regular',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
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
    fontFamily: 'Inter_28pt-SemiBold',
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
    fontFamily: 'Inter_28pt-Regular',
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
  checkboxGradient: {borderRadius: 4, padding: 1, marginRight: 10},
  checkboxInner: {
    width: 20,
    height: 20,
    borderRadius: 3,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxInnerSelected: {backgroundColor: '#12C857'},
  termsCheckboxText: {
    fontSize: 14,
    color: '#000',
    fontFamily: 'Inter_28pt-Medium',
  },
  signatureSection: {
    marginBottom: 20,
  },
  signatureRow: {
    marginTop: 20,
  },
  signatureContainer: {
    marginBottom: 20,
  },
  signatureLabel: {
    fontSize: 14,
    fontFamily: 'Inter_28pt-Medium',
    marginBottom: 5,
    color: '#000',
  },
  signatureImageContainer: {
    alignItems: 'center',
  },
  signatureImage: {
    width: '100%',
    height: 80,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  changeSignatureButton: {
    backgroundColor: '#7E5EA9',
    padding: 10,
    borderRadius: 6,
    marginTop: 8,
  },
  changeSignatureText: {
    color: 'white',
    fontFamily: 'Inter_28pt-SemiBold',
    fontSize: 12,
  },
  addSignatureButton: {
    backgroundColor: '#20AEBC',
    padding: 15,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ccc',
    borderStyle: 'dashed',
    width: '100%',
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addSignatureText: {
    color: 'white',
    fontFamily: 'Inter_28pt-SemiBold',
    textAlign: 'center',
  },
  disabledButton: {
    opacity: 0.6,
  },
  branchSection: {
    marginBottom: 15,
  },
  representativeSection: {
    marginBottom: 15,
  },
  paymentEntriesSection: {
    marginBottom: 15,
  },
  paymentEntriesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  addEntryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#7E5EA9',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  addEntryText: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 5,
    fontFamily: 'Inter_28pt-SemiBold',
  },
  paymentEntryContainer: {
    backgroundColor: '#f8f8f8',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  paymentEntryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  paymentEntryTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  removeEntryButton: {
    padding: 4,
  },
  exchangeSection: {
    marginBottom: 15,
  },
  additionalSection: {
    marginBottom: 15,
  },
});

export default Dcinternalpage;