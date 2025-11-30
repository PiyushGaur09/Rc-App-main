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
// import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
// import DateTimePicker from '@react-native-community/datetimepicker';
// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const Deliveryforminternalpage = ({navigation, route}) => {
//   const insets = useSafeAreaInsets();
//   const [userId, setUserId] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [fetchLoading, setFetchLoading] = useState(true);
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [existingFormId, setExistingFormId] = useState(null);
//   const [status, setStatus] = useState('pending');
//   const [hasBeenUpdated, setHasBeenUpdated] = useState(false);
//   const [acceptedTerms, setAcceptedTerms] = useState(false);

//   // Form states
//   const [showModelDropdown, setShowModelDropdown] = useState(false);
//   const [showDocumentTypeDropdown, setShowDocumentTypeDropdown] = useState(false);
//   const [showDatePicker, setShowDatePicker] = useState(false);

//   const [formData, setFormData] = useState({
//     CustomerName: '',
//     FathersName: '',
//     percentage: '',
//     address: '',
//     mobileNo: '',
//     TractorName: '',
//     tractorModel: '',
//     date: null,
//     YearofManufacture: '',
//     chassisNo: '',
//     engineNo: '',
//     DocumentNumber: '',
//     documentType: '',
//     otherDocumentType: '',
//   });

//   // Image states
//   const [customerSignature, setCustomerSignature] = useState(null);
//   const [managerSignature, setManagerSignature] = useState(null);

//   const tractorModels = [
//     "3028EN","3036EN","3036E","5105","5105 4WD","5050D Gear Pro","5210 Gear Pro",
//     "5050D 4WD Gear Pro","5210 4WD Gear Pro","5310 CRDI","5310 4WD CRDI","5405 CRDI",
//     "5405 4WD CRDI","5075 2WD","5075 4WD"
//   ];

//   const documentTypes = [
//     "Sale Certificate","Insurance","Tax Invoice","Form 21","E-way Bill","Other"
//   ];

//   // Helper function to make absolute URLs
//   const makeAbsoluteUrl = (relativePath) => {
//     if (!relativePath) return null;
//     if (relativePath.startsWith('http')) return relativePath;
//     return `https://argosmob.uk/makroo/public/${relativePath.replace(/^\/+/, '')}`;
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
//     if (formId) {
//       setExistingFormId(formId);
//       fetchFormData(formId);
//     } else {
//       Alert.alert('Error', 'No form ID provided');
//       navigation.goBack();
//     }
//   }, [route.params]);

//   const fetchFormData = async (formId) => {
//     try {
//       setFetchLoading(true);
      
//       const config = {
//         method: 'get',
//         url: `https://argosmob.uk/makroo/public/api/v1/delivery-forms/${formId}`,
//         timeout: 30000,
//       };

//       const response = await axios(config);
      
//       if (response.data.status && response.data.data) {
//         const data = response.data.data;
        
//         // Check if form has been updated before (frontend status management)
//         const storedUpdateStatus = await AsyncStorage.getItem(`delivery_form_updated_${formId}`);
//         if (storedUpdateStatus === 'true') {
//           setStatus('pending');
//           setHasBeenUpdated(true);
//         } else {
//           setStatus(data.status || 'pending');
//           setHasBeenUpdated(false);
//         }
        
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

//   const populateFormData = (data) => {
//     // Map API fields to form fields
//     setFormData({
//       CustomerName: data.customer_name || '',
//       FathersName: data.father_name || '',
//       percentage: '',
//       address: data.address || '',
//       mobileNo: '',
//       TractorName: '',
//       tractorModel: '',
//       date: data.submitted_at ? new Date(data.submitted_at) : null,
//       YearofManufacture: '',
//       chassisNo: data.tractor_number || '',
//       engineNo: data.engine_number || '',
//       DocumentNumber: data.document_number || '',
//       documentType: data.document_type || '',
//       otherDocumentType: '',
//     });

//     // Load existing images
//     if (data.customer_signature) {
//       const customerSignatureUri = makeAbsoluteUrl(data.customer_signature);
//       setCustomerSignature(customerSignatureUri);
//     }
//     if (data.manager_signature) {
//       const managerSignatureUri = makeAbsoluteUrl(data.manager_signature);
//       setManagerSignature(managerSignatureUri);
//     }

//     // Accept terms for viewing
//     setAcceptedTerms(true);
//   };

//   // Image handling functions
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

//   const showImageSourceOptions = (setImageFunction, title = 'Select Image Source') => {
//     if (!isEditMode) {
//       Alert.alert('Cannot Edit', 'This form cannot be edited in its current status.');
//       return;
//     }

//     if (Platform.OS === 'ios') {
//       ActionSheetIOS.showActionSheetWithOptions(
//         {
//           options: ['Cancel', 'Take Photo', 'Choose from Gallery'],
//           cancelButtonIndex: 0,
//         },
//         async (buttonIndex) => {
//           if (buttonIndex === 1) {
//             const hasPermission = await requestCameraPermissionForImage();
//             if (!hasPermission) {
//               Alert.alert('Permission Denied', 'Camera permission is required to take photos.');
//               return;
//             }
//             openCamera(setImageFunction);
//           } else if (buttonIndex === 2) {
//             openGallery(setImageFunction);
//           }
//         }
//       );
//     } else {
//       Alert.alert(
//         title,
//         'Choose how you want to capture the image',
//         [
//           { text: 'Cancel', style: 'cancel' },
//           { 
//             text: 'Take Photo', 
//             onPress: async () => {
//               const hasPermission = await requestCameraPermissionForImage();
//               if (!hasPermission) {
//                 Alert.alert('Permission Denied', 'Camera permission is required to take photos.');
//                 return;
//               }
//               openCamera(setImageFunction);
//             } 
//           },
//           { 
//             text: 'Choose from Gallery', 
//             onPress: () => openGallery(setImageFunction) 
//           },
//         ]
//       );
//     }
//   };

//   const openCamera = (setImageFunction) => {
//     const options = {
//       mediaType: 'photo',
//       quality: 0.8,
//       maxWidth: 800,
//       maxHeight: 800,
//       cameraType: 'back',
//       saveToPhotos: false,
//     };

//     launchCamera(options, (response) => {
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

//   const openGallery = (setImageFunction) => {
//     const options = {
//       mediaType: 'photo',
//       quality: 0.8,
//       maxWidth: 800,
//       maxHeight: 800,
//     };

//     launchImageLibrary(options, (response) => {
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

//   const handleModelSelect = (model) => {
//     handleInputChange('tractorModel', model);
//     setShowModelDropdown(false);
//   };

//   const handleDocumentTypeSelect = (documentType) => {
//     handleInputChange('documentType', documentType);
//     setShowDocumentTypeDropdown(false);
//   };

//   const handleDateChange = (event, selectedDate) => {
//     setShowDatePicker(false);
//     if (selectedDate) {
//       handleInputChange('date', selectedDate);
//     }
//   };

//   // Edit Mode Handler - Only allow editing when backend status is 'edited' and form hasn't been updated before
//   const handleEditPress = () => {
//     const backendStatus = route.params?.backendStatus || 'pending';
    
//     if (backendStatus === 'edited' && !hasBeenUpdated) {
//       setIsEditMode(true);
//     } else if (hasBeenUpdated) {
//       Alert.alert('Cannot Edit', 'This form has already been updated and is pending approval.');
//     } else {
//       Alert.alert('Cannot Edit', 'This form cannot be edited in its current status.');
//     }
//   };

//   const handleCancelEdit = () => {
//     setIsEditMode(false);
//     if (existingFormId) {
//       fetchFormData(existingFormId);
//     }
//   };

//   // Validate Form for Update
//   const validateForm = () => {
//     const requiredFields = [
//       'CustomerName', 'FathersName', 'address', 'chassisNo', 'engineNo'
//     ];

//     for (const field of requiredFields) {
//       if (!formData[field] || formData[field].toString().trim() === '') {
//         Alert.alert('Validation Error', `Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
//         return false;
//       }
//     }

//     if (!formData.documentType || formData.documentType.trim() === '') {
//       Alert.alert('Validation Error', 'Please select document type');
//       return false;
//     }

//     if (formData.documentType === 'Other' && (!formData.otherDocumentType || formData.otherDocumentType.trim() === '')) {
//       Alert.alert('Validation Error', 'Please enter document type details for Other');
//       return false;
//     }

//     if (!customerSignature) {
//       Alert.alert('Validation Error', 'Please add Customer Signature');
//       return false;
//     }
//     if (!managerSignature) {
//       Alert.alert('Validation Error', 'Please add Manager Signature');
//       return false;
//     }

//     if (!acceptedTerms) {
//       Alert.alert('Validation Error', 'Please accept all terms and conditions');
//       return false;
//     }

//     return true;
//   };

//   const prepareFormData = () => {
//     const formDataToSend = new FormData();

//     formDataToSend.append('id', existingFormId.toString());

//     formDataToSend.append('user_id', userId);
//     formDataToSend.append('customer_name', formData.CustomerName);
//     formDataToSend.append('father_name', formData.FathersName);
//     formDataToSend.append('address', formData.address);
//     formDataToSend.append('tractor_number', formData.chassisNo);
//     formDataToSend.append('engine_number', formData.engineNo);

//     const docType = formData.documentType === 'Other'
//       ? (formData.otherDocumentType || '').trim()
//       : (formData.documentType || '').trim();
//     formDataToSend.append('document_type', docType);
//     formDataToSend.append('document_number', formData.DocumentNumber);

//     // "YYYY-MM-DD HH:mm:ss"
//     const now = new Date();
//     const submittedAt =
//       `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')} ` +
//       `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`;
//     formDataToSend.append('submitted_at', submittedAt);

//     if (customerSignature && customerSignature.startsWith('file://')) {
//       formDataToSend.append('customer_signature', {
//         uri: customerSignature,
//         type: 'image/jpeg',
//         name: 'customer_signature.jpg',
//       });
//     }

//     if (managerSignature && managerSignature.startsWith('file://')) {
//       formDataToSend.append('manager_signature', {
//         uri: managerSignature,
//         type: 'image/jpeg',
//         name: 'manager_signature.jpg',
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
//         url: 'https://argosmob.uk/makroo/public/api/v1/delivery-forms/update',
//         headers: {
//           'Content-Type': 'multipart/form-data',
//           'Accept': 'application/json',
//         },
//         data: formDataToSend,
//         timeout: 30000,
//       };

//       const response = await axios(config);

//       if (response.data && response.data.status === true) {
//         // Mark form as updated in AsyncStorage (frontend status management)
//         await AsyncStorage.setItem(`delivery_form_updated_${existingFormId}`, 'true');
        
//         // Update local state
//         setHasBeenUpdated(true);
//         setStatus('pending');
//         setIsEditMode(false);
        
//         Alert.alert(
//           'Success', 
//           response.data.message || 'Form updated successfully! Form is now pending approval.',
//           [
//             {
//               text: 'OK',
//               onPress: () => {
//                 // Refresh data
//                 fetchFormData(existingFormId);
//               }
//             }
//           ]
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
//             errorMessage = firstError ? firstError[0] : 'Please check all required fields';
//           } else {
//             errorMessage = error.response.data.message || 'Validation error occurred';
//           }
//         } else {
//           const serverError = error.response.data;
//           errorMessage = serverError.message || serverError.error || `Server error: ${error.response.status}`;
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
//         url: `https://argosmob.uk/makroo/public/api/v1/delivery-forms/form/generate-pdf/${existingFormId}`,
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

//   const renderModelItem = ({item}) => (
//     <TouchableOpacity
//       style={styles.modelItem}
//       onPress={() => handleModelSelect(item)}>
//       <Text style={styles.modelItemText}>{item}</Text>
//     </TouchableOpacity>
//   );

//   const renderDocumentTypeItem = ({item}) => (
//     <TouchableOpacity
//       style={styles.modelItem}
//       onPress={() => handleDocumentTypeSelect(item)}>
//       <Text style={styles.modelItemText}>{item}</Text>
//     </TouchableOpacity>
//   );

//   const renderInputField = (value, onChange, placeholder, keyboardType = 'default', editable = true) => {
//     if (isEditMode) {
//       return (
//         <TextInput
//           style={styles.input}
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
//         <Text style={[styles.input, styles.readOnlyInput]}>
//           {value || 'Not provided'}
//         </Text>
//       );
//     }
//   };

//   const renderDropdownField = (value, onPress, placeholder) => {
//     if (isEditMode) {
//       return (
//         <TouchableOpacity 
//           style={styles.input}
//           onPress={onPress}
//           disabled={loading}
//         >
//           <Text style={value ? styles.selectedModelText : styles.placeholderText}>
//             {value || placeholder}
//           </Text>
//           <Icon name="keyboard-arrow-down" size={25} color="#666" style={styles.dropdownIcon} />
//         </TouchableOpacity>
//       );
//     } else {
//       return (
//         <Text style={[styles.input, styles.readOnlyInput]}>
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
//             style={[styles.input, styles.inputWithIconField]}
//             onPress={onPress}
//             disabled={loading}
//           >
//             <Text style={date ? styles.selectedModelText : styles.placeholderText}>
//               {date ? date.toLocaleDateString() : placeholder}
//             </Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             onPress={onPress}
//             style={styles.iconButton}
//             disabled={loading}
//           >
//             <Icon name="calendar-today" size={20} color="#666" />
//           </TouchableOpacity>
//         </View>
//       );
//     } else {
//       return (
//         <Text style={[styles.input, styles.readOnlyInput]}>
//           {date ? date.toLocaleDateString() : 'Not provided'}
//         </Text>
//       );
//     }
//   };

//   const renderImageBox = (imageUri, setImageFunction, label) => (
//     <View style={styles.imageContainer}>
//       <Text style={styles.imageLabel}>{label}</Text>
//       {imageUri ? (
//         <View style={styles.photoContainer}>
//           <Image source={{ uri: imageUri }} style={styles.signatureImage} />
//           {isEditMode && (
//             <TouchableOpacity 
//               style={styles.changePhotoButton} 
//               onPress={() => showImageSourceOptions(setImageFunction, `Update ${label}`)}
//             >
//               <Text style={styles.changePhotoText}>Change {label}</Text>
//             </TouchableOpacity>
//           )}
//         </View>
//       ) : (
//         isEditMode && (
//           <View style={styles.photoContainer}>
//             <TouchableOpacity 
//               style={styles.addPhotoButton} 
//               onPress={() => showImageSourceOptions(setImageFunction, `Add ${label}`)}
//             >
//               <Text style={styles.addPhotoText}>Add {label}</Text>
//             </TouchableOpacity>
//           </View>
//         )
//       )}
//     </View>
//   );

//   if (fetchLoading) {
//     return (
//       <View style={{flex: 1, paddingTop: insets.top, justifyContent: 'center', alignItems: 'center'}}>
//         <ActivityIndicator size="large" color="#7E5EA9" />
//         <Text style={{marginTop: 10}}>Loading form data...</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={{flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom}}>
//       <LinearGradient
//         colors={['#7E5EA9', '#20AEBC']}
//         start={{x: 0, y: 0}}
//         end={{x: 1, y: 0}}
//         style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
//           <Icon name="arrow-back" size={24} color="white" />
//         </TouchableOpacity>
//         <View style={styles.headerTitleContainer}>
//           <Text style={styles.companyName}>Makroo Motor Corporation</Text>
//           <Text style={styles.companyName}>Delivery Form</Text>
//         </View>
//       </LinearGradient>

//       <ScrollView style={styles.container}>
//         <View style={styles.formHeader}>
//           {/* <Text style={styles.formNo}>Form ID: {existingFormId}</Text> */}
//           <Text style={styles.Date}>{new Date().toLocaleDateString()}</Text>
//         </View>

//         {isEditMode && (
//           <View style={styles.editModeContainer}>
//             <Text style={styles.editModeText}>Edit Mode - Updating Form ID: {existingFormId}</Text>
//           </View>
//         )}

//         <View style={styles.customerHeader}>
//           <Text style={styles.customerName}>{formData.CustomerName || '—'}</Text>
//           {/* <Text style={styles.customerId}>ID: {existingFormId || '—'}</Text> */}
//           <Text style={[styles.statusText, 
//             status === 'approved' ? styles.statusApproved :
//             status === 'pending' ? styles.statusPending :
//             status === 'rejected' ? styles.statusRejected :
//             styles.statusDefault
//           ]}>
//             Status: {status || '—'}
//           </Text>
//         </View>

//         <View style={styles.formContainer}>
//           {/* Customer Name */}
//           <View style={styles.singleRow}>
//             <Text style={styles.fieldLabel}>Customer Name</Text>
//             <View style={styles.fullWidthContainer}>
//               <LinearGradient
//                 colors={['#7E5EA9', '#20AEBC']}
//                 start={{x: 0, y: 0}}
//                 end={{x: 1, y: 0}}
//                 style={styles.inputGradient}>
//                 {renderInputField(
//                   formData.CustomerName,
//                   (text) => handleInputChange('CustomerName', text),
//                   'Enter customer name'
//                 )}
//               </LinearGradient>
//             </View>
//           </View>

//           {/* Father's Name */}
//           <View style={styles.singleRow}>
//             <Text style={styles.fieldLabel}>Father's Name</Text>
//             <View style={styles.fullWidthContainer}>
//               <LinearGradient
//                 colors={['#7E5EA9', '#20AEBC']}
//                 start={{x: 0, y: 0}}
//                 end={{x: 1, y: 0}}
//                 style={styles.inputGradient}>
//                 {renderInputField(
//                   formData.FathersName,
//                   (text) => handleInputChange('FathersName', text),
//                   'Enter father\'s name'
//                 )}
//               </LinearGradient>
//             </View>
//           </View>

//           {/* Address */}
//           <View style={styles.singleRow}>
//             <Text style={styles.fieldLabel}>Address</Text>
//             <View style={styles.fullWidthContainer}>
//               <LinearGradient
//                 colors={['#7E5EA9', '#20AEBC']}
//                 start={{x: 0, y: 0}}
//                 end={{x: 1, y: 0}}
//                 style={styles.inputGradient}>
//                 {renderInputField(
//                   formData.address,
//                   (text) => handleInputChange('address', text),
//                   'Enter address',
//                   'default',
//                   true
//                 )}
//               </LinearGradient>
//             </View>
//           </View>

//           {/* Mobile Number
//           <View style={styles.singleRow}>
//             <Text style={styles.fieldLabel}>Mobile Number</Text>
//             <View style={styles.fullWidthContainer}>
//               <LinearGradient
//                 colors={['#7E5EA9', '#20AEBC']}
//                 start={{x: 0, y: 0}}
//                 end={{x: 1, y: 0}}
//                 style={styles.inputGradient}>
//                 {renderInputField(
//                   formData.mobileNo,
//                   (text) => handleInputChange('mobileNo', text),
//                   'Enter mobile number',
//                   'phone-pad'
//                 )}
//               </LinearGradient>
//             </View>
//           </View> */}

//           {/* Tractor Name */}
//           {/* <View style={styles.singleRow}>
//             <Text style={styles.fieldLabel}>Tractor Name</Text>
//             <View style={styles.fullWidthContainer}>
//               <LinearGradient
//                 colors={['#7E5EA9', '#20AEBC']}
//                 start={{x: 0, y: 0}}
//                 end={{x: 1, y: 0}}
//                 style={styles.inputGradient}>
//                 {renderInputField(
//                   formData.TractorName,
//                   (text) => handleInputChange('TractorName', text),
//                   'Enter tractor name'
//                 )}
//               </LinearGradient>
//             </View>
//           </View> */}

//           {/* Tractor Model */}
//           {/* <View style={styles.singleRow}>
//             <Text style={styles.fieldLabel}>Tractor Model</Text>
//             <View style={styles.fullWidthContainer}>
//               <LinearGradient
//                 colors={['#7E5EA9', '#20AEBC']}
//                 start={{x: 0, y: 0}}
//                 end={{x: 1, y: 0}}
//                 style={styles.inputGradient}>
//                 {renderDropdownField(
//                   formData.tractorModel,
//                   () => setShowModelDropdown(true),
//                   'Select tractor model'
//                 )}
//               </LinearGradient>
//             </View>
//           </View> */}

//           {/* Date */}
//           <View style={styles.singleRow}>
//             <Text style={styles.fieldLabel}>Date</Text>
//             <View style={styles.fullWidthContainer}>
//               <LinearGradient
//                 colors={['#7E5EA9', '#20AEBC']}
//                 start={{x: 0, y: 0}}
//                 end={{x: 1, y: 0}}
//                 style={styles.inputGradient}>
//                 {renderDateField(
//                   formData.date,
//                   handleDateIconPress,
//                   'Select date'
//                 )}
//                 {showDatePicker && isEditMode && (
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

//           {/* Year of Manufacture */}
//           {/* <View style={styles.singleRow}>
//             <Text style={styles.fieldLabel}>Year of Manufacture</Text>
//             <View style={styles.fullWidthContainer}>
//               <LinearGradient
//                 colors={['#7E5EA9', '#20AEBC']}
//                 start={{x: 0, y: 0}}
//                 end={{x: 1, y: 0}}
//                 style={styles.inputGradient}>
//                 {renderInputField(
//                   formData.YearofManufacture,
//                   (text) => handleInputChange('YearofManufacture', text),
//                   'Enter year of manufacture'
//                 )}
//               </LinearGradient>
//             </View>
//           </View> */}

//           {/* Chassis Number */}
//           <View style={styles.singleRow}>
//             <Text style={styles.fieldLabel}>Chassis Number</Text>
//             <View style={styles.fullWidthContainer}>
//               <LinearGradient
//                 colors={['#7E5EA9', '#20AEBC']}
//                 start={{x: 0, y: 0}}
//                 end={{x: 1, y: 0}}
//                 style={styles.inputGradient}>
//                 {renderInputField(
//                   formData.chassisNo,
//                   (text) => handleInputChange('chassisNo', text),
//                   'Enter chassis number'
//                 )}
//               </LinearGradient>
//             </View>
//           </View>

//           {/* Engine Number */}
//           <View style={styles.singleRow}>
//             <Text style={styles.fieldLabel}>Engine Number</Text>
//             <View style={styles.fullWidthContainer}>
//               <LinearGradient
//                 colors={['#7E5EA9', '#20AEBC']}
//                 start={{x: 0, y: 0}}
//                 end={{x: 1, y: 0}}
//                 style={styles.inputGradient}>
//                 {renderInputField(
//                   formData.engineNo,
//                   (text) => handleInputChange('engineNo', text),
//                   'Enter engine number'
//                 )}
//               </LinearGradient>
//             </View>
//           </View>

//           {/* Document Type */}
//           <View style={styles.singleRow}>
//             <Text style={styles.fieldLabel}>Document Type</Text>
//             <View style={styles.fullWidthContainer}>
//               <LinearGradient
//                 colors={['#7E5EA9', '#20AEBC']}
//                 start={{x: 0, y: 0}}
//                 end={{x: 1, y: 0}}
//                 style={styles.inputGradient}>
//                 {renderDropdownField(
//                   formData.documentType,
//                   () => setShowDocumentTypeDropdown(true),
//                   'Select document type'
//                 )}
//               </LinearGradient>

//               {formData.documentType === 'Other' && (
//                 <View style={{marginTop: 8}}>
//                   <Text style={styles.fieldLabel}>Document Type Details</Text>
//                   <LinearGradient
//                     colors={['#7E5EA9', '#20AEBC']}
//                     start={{x: 0, y: 0}}
//                     end={{x: 1, y: 0}}
//                     style={styles.inputGradient}>
//                     {renderInputField(
//                       formData.otherDocumentType,
//                       (text) => handleInputChange('otherDocumentType', text),
//                       'Enter document type details'
//                     )}
//                   </LinearGradient>
//                 </View>
//               )}
//             </View>
//           </View>

//           {/* Document Number */}
//           <View style={styles.singleRow}>
//             <Text style={styles.fieldLabel}>Document Number</Text>
//             <View style={styles.fullWidthContainer}>
//               <LinearGradient
//                 colors={['#7E5EA9', '#20AEBC']}
//                 start={{x: 0, y: 0}}
//                 end={{x: 1, y: 0}}
//                 style={styles.inputGradient}>
//                 {renderInputField(
//                   formData.DocumentNumber,
//                   (text) => handleInputChange('DocumentNumber', text),
//                   'Enter document number'
//                 )}
//               </LinearGradient>
//             </View>
//           </View>
//         </View>

//         {/* Tractor Model Dropdown Modal */}
//         <Modal
//           visible={showModelDropdown}
//           transparent={true}
//           animationType="slide"
//           onRequestClose={() => setShowModelDropdown(false)}
//         >
//           <View style={styles.modalOverlay}>
//             <View style={styles.modalContent}>
//               <View style={styles.modalHeader}>
//                 <Text style={styles.modalTitle}>Select Tractor Model</Text>
//                 <TouchableOpacity 
//                   onPress={() => setShowModelDropdown(false)}
//                   style={styles.closeButton}
//                 >
//                   <Icon name="close" size={24} color="#000" />
//                 </TouchableOpacity>
//               </View>
//               <FlatList
//                 data={tractorModels}
//                 renderItem={renderModelItem}
//                 keyExtractor={(item, index) => index.toString()}
//                 style={styles.modelList}
//                 showsVerticalScrollIndicator={true}
//               />
//             </View>
//           </View>
//         </Modal>

//         {/* Document Type Dropdown Modal */}
//         <Modal
//           visible={showDocumentTypeDropdown}
//           transparent={true}
//           animationType="slide"
//           onRequestClose={() => setShowDocumentTypeDropdown(false)}
//         >
//           <View style={styles.modalOverlay}>
//             <View style={styles.modalContent}>
//               <View style={styles.modalHeader}>
//                 <Text style={styles.modalTitle}>Select Document Type</Text>
//                 <TouchableOpacity 
//                   onPress={() => setShowDocumentTypeDropdown(false)}
//                   style={styles.closeButton}
//                 >
//                   <Icon name="close" size={24} color="#000" />
//                 </TouchableOpacity>
//               </View>
//               <FlatList
//                 data={documentTypes}
//                 renderItem={renderDocumentTypeItem}
//                 keyExtractor={(item, index) => index.toString()}
//                 style={styles.modelList}
//                 showsVerticalScrollIndicator={true}
//               />
//             </View>
//           </View>
//         </Modal>

//         {/* Signatures Section */}
//         <View style={{ marginTop: 20 }}>
//           <Text style={styles.sectionTitle}>Signatures</Text>
          
//           {renderImageBox(customerSignature, setCustomerSignature, 'Customer Signature')}
//           {renderImageBox(managerSignature, setManagerSignature, 'Manager Signature')}
//         </View>

//         <View style={styles.termsContainer}>
//           <Text style={styles.termsTitle}>Terms and Conditions:</Text>
//           <View style={styles.termsList}>
//             <Text style={styles.termItem}>1. All information provided must be accurate and complete.</Text>
//             <Text style={styles.termItem}>2. Customer must provide valid identification before delivery.</Text>
//             <Text style={styles.termItem}>3. Delivery requires proper authorization and documentation.</Text>
//             <Text style={styles.termItem}>4. Makroo Motor Corporation reserves the right to verify all details.</Text>
//             <Text style={styles.termItem}>5. Once delivered, the company is not responsible for loss or damage.</Text>
//             <Text style={styles.termItem}>6. All records must be updated in the company database promptly.</Text>
//           </View>

//           <TouchableOpacity 
//             style={styles.checkboxContainer}
//             onPress={() => isEditMode && setAcceptedTerms(!acceptedTerms)}
//             disabled={!isEditMode || loading}
//           >
//             <View style={[styles.checkbox, acceptedTerms && styles.checkboxChecked]}>
//               {acceptedTerms && <Icon name="check" size={16} color="#fff" />}
//             </View>
//             <Text style={styles.checkboxLabel}>Accept All Terms And Conditions</Text>
//           </TouchableOpacity>
//         </View>

//         <View style={styles.buttonContainer}>
//           {/* Edit Button - Only show when backend status is 'edited' and form hasn't been updated before */}
//           {route.params?.backendStatus === 'edited' && !hasBeenUpdated && !isEditMode && (
//             <TouchableOpacity style={styles.editButton} onPress={handleEditPress}>
//               <Text style={styles.editButtonText}>Edit Form</Text>
//             </TouchableOpacity>
//           )}

//           {isEditMode && (
//             <>
//               <TouchableOpacity 
//                 style={[styles.submitButton, (loading || !acceptedTerms) && styles.disabledButton]} 
//                 onPress={handleUpdate}
//                 disabled={loading || !acceptedTerms}
//               >
//                 {loading ? (
//                   <ActivityIndicator color="#fff" size="small" />
//                 ) : (
//                   <Text style={styles.submitButtonText}>Update Form</Text>
//                 )}
//               </TouchableOpacity>

//               <TouchableOpacity 
//                 style={[styles.cancelButton, loading && styles.disabledButton]} 
//                 onPress={handleCancelEdit}
//                 disabled={loading}
//               >
//                 <Text style={styles.cancelButtonText}>Cancel</Text>
//               </TouchableOpacity>
//             </>
//           )}

//           {status === 'approved' && (
//             <TouchableOpacity 
//               style={[styles.pdfButton, loading && styles.disabledButton]} 
//               onPress={handleDownloadPDF}
//               disabled={loading}
//             >
//               {loading ? (
//                 <ActivityIndicator color="#fff" size="small" />
//               ) : (
//                 <Text style={styles.pdfButtonText}>Download PDF</Text>
//               )}
//             </TouchableOpacity>
//           )}

//           <TouchableOpacity 
//             style={[styles.homeButton, loading && styles.disabledButton]} 
//             onPress={() => navigation.goBack()}
//             disabled={loading}
//           >
//             <Text style={styles.homeButtonText}>Back to List</Text>
//           </TouchableOpacity>
//         </View>
//       </ScrollView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     paddingHorizontal: 15,
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 10,
//     paddingHorizontal: 15,
//   },
//   backButton: {
//     padding: 5,
//     marginRight: 10,
//   },
//   headerTitleContainer: {
//     flex: 1,
//     alignItems: 'center',
//   },
//   companyName: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: 'white',
//     textAlign: 'center',
//   },
//   formHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginVertical: 10,
//     paddingHorizontal: 5,
//   },
//   formNo: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#000',
//   },
//   Date: {
//     fontSize: 12,
//     color: '#00000099',
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
//     fontWeight: '600',
//     color: '#7E5EA9',
//   },
//   customerHeader: {
//     alignItems: 'center',
//     marginVertical: 10,
//     marginBottom: 10,
//   },
//   customerName: {
//     fontSize: 20,
//     color: '#000',
//     fontWeight: 'bold',
//     marginBottom: 30,
//   },
//   customerId: {
//     fontSize: 13,
//     color: '#56616D',
//     fontWeight: 'bold',
//   },
//   statusText: {
//     fontSize: 12,
//     fontWeight: 'bold',
//     marginTop: 5,
//     paddingHorizontal: 12,
//     paddingVertical: 4,
//     borderRadius: 12,
//     marginBottom: 20,
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
//   statusDefault: {
//     backgroundColor: '#9E9E9E',
//     color: 'white',
//   },
//   formContainer: {
//     marginBottom: 15,
//   },
//   singleRow: {
//     marginBottom: 10,
//   },
//   fullWidthContainer: {
//     width: '100%',
//     marginBottom: 10,
//   },
//   fieldLabel: {
//     fontSize: 14,
//     fontWeight: '500',
//     marginBottom: 5,
//     color: '#000',
//   },
//   inputGradient: {
//     borderRadius: 10,
//     padding: 1,
//   },
//   input: {
//     borderRadius: 10,
//     backgroundColor: '#fff',
//     paddingVertical: 12,
//     paddingHorizontal: 15,
//     fontSize: 14,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     minHeight: 40,
//   },
//   readOnlyInput: {
//     color: '#666',
//     backgroundColor: '#f5f5f5',
//   },
//   selectedModelText: {
//     fontSize: 14,
//     color: '#000',
//   },
//   placeholderText: {
//     fontSize: 14,
//     color: '#666',
//   },
//   dropdownIcon: {
//     marginLeft: 8,
//   },
//   inputWithIcon: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   inputWithIconField: {
//     flex: 1,
//   },
//   iconButton: {
//     position: 'absolute',
//     right: 12,
//     padding: 4,
//   },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   modalContent: {
//     backgroundColor: 'white',
//     borderRadius: 10,
//     width: '90%',
//     maxHeight: '70%',
//     overflow: 'hidden',
//   },
//   modalHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: '#e0e0e0',
//   },
//   modalTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   closeButton: {
//     padding: 4,
//   },
//   modelList: {
//     maxHeight: 300,
//   },
//   modelItem: {
//     padding: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: '#f0f0f0',
//   },
//   modelItemText: {
//     fontSize: 14,
//     color: '#333',
//   },
//   imageContainer: {
//     marginBottom: 20,
//   },
//   imageLabel: {
//     fontSize: 14,
//     fontWeight: '500',
//     marginBottom: 5,
//     color: '#000',
//   },
//   photoContainer: {
//     alignItems: 'center',
//   },
//   signatureImage: {
//     height: 80,
//     width: 220,
//     resizeMode: 'contain',
//     borderWidth: 1,
//     borderColor: '#ccc'
//   },
//   changePhotoButton: { 
//     backgroundColor: '#7E5EA9', 
//     padding: 8, 
//     borderRadius: 6, 
//     marginTop: 8,
//   },
//   changePhotoText: { 
//     color: 'white', 
//     fontWeight: 'bold', 
//     fontSize: 12 
//   },
//   addPhotoButton: { 
//     backgroundColor: '#20AEBC', 
//     padding: 15, 
//     borderRadius: 6, 
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderStyle: 'dashed'
//   },
//   addPhotoText: { 
//     color: 'white', 
//     fontWeight: 'bold' 
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 10,
//     color: '#000',
//   },
//   termsContainer: {
//     marginBottom: 15,
//     padding: 10,
//     borderRadius: 10,
//     marginBottom: 50
//   },
//   termsTitle: {
//     fontSize: 14.5,
//     fontWeight: '600',
//     color: '#000',
//     marginBottom: 10,
//   },
//   termsList: {
//     marginBottom: 15,
//   },
//   termItem: {
//     fontSize: 12.5,
//     color: '#333',
//     marginBottom: 5,
//     lineHeight: 16,
//   },
//   checkboxContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 1,
//   },
//   checkbox: {
//     width: 20,
//     height: 20,
//     borderWidth: 1,
//     borderColor: '#666',
//     borderRadius: 4,
//     marginRight: 10,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//   },
//   checkboxChecked: {
//     backgroundColor: '#4CAF50',
//     borderColor: '#4CAF50',
//   },
//   checkboxLabel: {
//     fontSize: 14,
//     fontWeight: '500',
//     color: '#000',
//   },
//   buttonContainer: {
//     marginTop: 20,
//     marginBottom: 30,
//   },
//   editButton: {
//     backgroundColor: '#FFA000',
//     padding: 15,
//     borderRadius: 10,
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   editButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   submitButton: {
//     backgroundColor: '#7E5EA9',
//     padding: 15,
//     borderRadius: 10,
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   submitButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   cancelButton: {
//     backgroundColor: '#6c757d',
//     padding: 15,
//     borderRadius: 10,
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   cancelButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   pdfButton: {
//     backgroundColor: '#4CAF50',
//     padding: 15,
//     borderRadius: 10,
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   pdfButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   homeButton: {
//     backgroundColor: '#20AEBC',
//     padding: 15,
//     borderRadius: 10,
//     alignItems: 'center',
//   },
//   homeButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   disabledButton: {
//     opacity: 0.6,
//   },
// });

// export default Deliveryforminternalpage;






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
// import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
// import DateTimePicker from '@react-native-community/datetimepicker';
// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const Deliveryforminternalpage = ({navigation, route}) => {
//   const insets = useSafeAreaInsets();
//   const [userId, setUserId] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [fetchLoading, setFetchLoading] = useState(true);
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [existingFormId, setExistingFormId] = useState(null);
//   const [status, setStatus] = useState('pending');
//   const [hasBeenUpdated, setHasBeenUpdated] = useState(false);
//   const [acceptedTerms, setAcceptedTerms] = useState(false);

//   // Form states
//   const [showModelDropdown, setShowModelDropdown] = useState(false);
//   const [showDocumentTypeDropdown, setShowDocumentTypeDropdown] = useState(false);
//   const [showDatePicker, setShowDatePicker] = useState(false);

//   const [formData, setFormData] = useState({
//     CustomerName: '',
//     FathersName: '',
//     percentage: '',
//     address: '',
//     mobileNo: '',
//     TractorName: '',
//     tractorModel: '',
//     date: null,
//     YearofManufacture: '',
//     chassisNo: '',
//     engineNo: '',
//     DocumentNumber: '',
//     documentType: '',
//     otherDocumentType: '',
//   });

//   // Image states
//   const [customerSignature, setCustomerSignature] = useState(null);
//   const [managerSignature, setManagerSignature] = useState(null);

//   const tractorModels = [
//     "3028EN","3036EN","3036E","5105","5105 4WD","5050D Gear Pro","5210 Gear Pro",
//     "5050D 4WD Gear Pro","5210 4WD Gear Pro","5310 CRDI","5310 4WD CRDI","5405 CRDI",
//     "5405 4WD CRDI","5075 2WD","5075 4WD"
//   ];

//   const documentTypes = [
//     "Sale Certificate","Insurance","Tax Invoice","Form 21","E-way Bill","Other"
//   ];

//   // Helper function to make absolute URLs
//   const makeAbsoluteUrl = (relativePath) => {
//     if (!relativePath) return null;
//     if (relativePath.startsWith('http')) return relativePath;
//     return `https://argosmob.uk/makroo/public/${relativePath.replace(/^\/+/, '')}`;
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
//     if (formId) {
//       setExistingFormId(formId);
//       fetchFormData(formId);
//     } else {
//       Alert.alert('Error', 'No form ID provided');
//       navigation.goBack();
//     }
//   }, [route.params]);

//   const fetchFormData = async (formId) => {
//     try {
//       setFetchLoading(true);
      
//       const config = {
//         method: 'get',
//         url: `https://argosmob.uk/makroo/public/api/v1/delivery-forms/${formId}`,
//         timeout: 30000,
//       };

//       const response = await axios(config);
      
//       if (response.data.status && response.data.data) {
//         const data = response.data.data;
        
//         // Check if form has been updated before (frontend status management)
//         const storedUpdateStatus = await AsyncStorage.getItem(`delivery_form_updated_${formId}`);
//         if (storedUpdateStatus === 'true') {
//           setStatus('pending');
//           setHasBeenUpdated(true);
//         } else {
//           setStatus(data.status || 'pending');
//           setHasBeenUpdated(false);
//         }
        
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

//   const populateFormData = (data) => {
//     // Map API fields to form fields
//     setFormData({
//       CustomerName: data.customer_name || '',
//       FathersName: data.father_name || '',
//       percentage: '',
//       address: data.address || '',
//       mobileNo: '',
//       TractorName: '',
//       tractorModel: '',
//       date: data.submitted_at ? new Date(data.submitted_at) : null,
//       YearofManufacture: '',
//       chassisNo: data.tractor_number || '',
//       engineNo: data.engine_number || '',
//       DocumentNumber: data.document_number || '',
//       documentType: data.document_type || '',
//       otherDocumentType: '',
//     });

//     // Load existing images
//     if (data.customer_signature) {
//       const customerSignatureUri = makeAbsoluteUrl(data.customer_signature);
//       setCustomerSignature(customerSignatureUri);
//     }
//     if (data.manager_signature) {
//       const managerSignatureUri = makeAbsoluteUrl(data.manager_signature);
//       setManagerSignature(managerSignatureUri);
//     }

//     // Accept terms for viewing
//     setAcceptedTerms(true);
//   };

//   // Image handling functions
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

//   const showImageSourceOptions = (setImageFunction, title = 'Select Image Source') => {
//     if (!isEditMode) {
//       Alert.alert('Cannot Edit', 'This form cannot be edited in its current status.');
//       return;
//     }

//     if (Platform.OS === 'ios') {
//       ActionSheetIOS.showActionSheetWithOptions(
//         {
//           options: ['Cancel', 'Take Photo', 'Choose from Gallery'],
//           cancelButtonIndex: 0,
//         },
//         async (buttonIndex) => {
//           if (buttonIndex === 1) {
//             const hasPermission = await requestCameraPermissionForImage();
//             if (!hasPermission) {
//               Alert.alert('Permission Denied', 'Camera permission is required to take photos.');
//               return;
//             }
//             openCamera(setImageFunction);
//           } else if (buttonIndex === 2) {
//             openGallery(setImageFunction);
//           }
//         }
//       );
//     } else {
//       Alert.alert(
//         title,
//         'Choose how you want to capture the image',
//         [
//           { text: 'Cancel', style: 'cancel' },
//           { 
//             text: 'Take Photo', 
//             onPress: async () => {
//               const hasPermission = await requestCameraPermissionForImage();
//               if (!hasPermission) {
//                 Alert.alert('Permission Denied', 'Camera permission is required to take photos.');
//                 return;
//               }
//               openCamera(setImageFunction);
//             } 
//           },
//           { 
//             text: 'Choose from Gallery', 
//             onPress: () => openGallery(setImageFunction) 
//           },
//         ]
//       );
//     }
//   };

//   const openCamera = (setImageFunction) => {
//     const options = {
//       mediaType: 'photo',
//       quality: 0.8,
//       maxWidth: 800,
//       maxHeight: 800,
//       cameraType: 'back',
//       saveToPhotos: false,
//     };

//     launchCamera(options, (response) => {
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

//   const openGallery = (setImageFunction) => {
//     const options = {
//       mediaType: 'photo',
//       quality: 0.8,
//       maxWidth: 800,
//       maxHeight: 800,
//     };

//     launchImageLibrary(options, (response) => {
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

//   const handleModelSelect = (model) => {
//     handleInputChange('tractorModel', model);
//     setShowModelDropdown(false);
//   };

//   const handleDocumentTypeSelect = (documentType) => {
//     handleInputChange('documentType', documentType);
//     setShowDocumentTypeDropdown(false);
//   };

//   const handleDateChange = (event, selectedDate) => {
//     setShowDatePicker(false);
//     if (selectedDate) {
//       handleInputChange('date', selectedDate);
//     }
//   };

//   // Edit Mode Handler - Only allow editing when backend status is 'edited' and form hasn't been updated before
//   const handleEditPress = () => {
//     const backendStatus = route.params?.backendStatus || 'pending';
    
//     if (backendStatus === 'edited' && !hasBeenUpdated) {
//       setIsEditMode(true);
//     } else if (hasBeenUpdated) {
//       Alert.alert('Cannot Edit', 'This form has already been updated and is pending approval.');
//     } else {
//       Alert.alert('Cannot Edit', 'This form cannot be edited in its current status.');
//     }
//   };

//   const handleCancelEdit = () => {
//     setIsEditMode(false);
//     if (existingFormId) {
//       fetchFormData(existingFormId);
//     }
//   };

//   // Validate Form for Update
//   const validateForm = () => {
//     const requiredFields = [
//       'CustomerName', 'FathersName', 'address', 'chassisNo', 'engineNo'
//     ];

//     for (const field of requiredFields) {
//       if (!formData[field] || formData[field].toString().trim() === '') {
//         Alert.alert('Validation Error', `Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
//         return false;
//       }
//     }

//     if (!formData.documentType || formData.documentType.trim() === '') {
//       Alert.alert('Validation Error', 'Please select document type');
//       return false;
//     }

//     if (formData.documentType === 'Other' && (!formData.otherDocumentType || formData.otherDocumentType.trim() === '')) {
//       Alert.alert('Validation Error', 'Please enter document type details for Other');
//       return false;
//     }

//     if (!customerSignature) {
//       Alert.alert('Validation Error', 'Please add Customer Signature');
//       return false;
//     }
//     if (!managerSignature) {
//       Alert.alert('Validation Error', 'Please add Manager Signature');
//       return false;
//     }

//     if (!acceptedTerms) {
//       Alert.alert('Validation Error', 'Please accept all terms and conditions');
//       return false;
//     }

//     return true;
//   };

//   const prepareFormData = () => {
//     const formDataToSend = new FormData();

//     formDataToSend.append('id', existingFormId.toString());

//     formDataToSend.append('user_id', userId);
//     formDataToSend.append('customer_name', formData.CustomerName);
//     formDataToSend.append('father_name', formData.FathersName);
//     formDataToSend.append('address', formData.address);
//     formDataToSend.append('tractor_number', formData.chassisNo);
//     formDataToSend.append('engine_number', formData.engineNo);

//     const docType = formData.documentType === 'Other'
//       ? (formData.otherDocumentType || '').trim()
//       : (formData.documentType || '').trim();
//     formDataToSend.append('document_type', docType);
//     formDataToSend.append('document_number', formData.DocumentNumber);

//     // "YYYY-MM-DD HH:mm:ss"
//     const now = new Date();
//     const submittedAt =
//       `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')} ` +
//       `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`;
//     formDataToSend.append('submitted_at', submittedAt);

//     if (customerSignature && customerSignature.startsWith('file://')) {
//       formDataToSend.append('customer_signature', {
//         uri: customerSignature,
//         type: 'image/jpeg',
//         name: 'customer_signature.jpg',
//       });
//     }

//     if (managerSignature && managerSignature.startsWith('file://')) {
//       formDataToSend.append('manager_signature', {
//         uri: managerSignature,
//         type: 'image/jpeg',
//         name: 'manager_signature.jpg',
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
//         url: 'https://argosmob.uk/makroo/public/api/v1/delivery-forms/update',
//         headers: {
//           'Content-Type': 'multipart/form-data',
//           'Accept': 'application/json',
//         },
//         data: formDataToSend,
//         timeout: 30000,
//       };

//       const response = await axios(config);

//       if (response.data && response.data.status === true) {
//         // Mark form as updated in AsyncStorage (frontend status management)
//         await AsyncStorage.setItem(`delivery_form_updated_${existingFormId}`, 'true');
        
//         // Update local state
//         setHasBeenUpdated(true);
//         setStatus('pending');
//         setIsEditMode(false);
        
//         Alert.alert(
//           'Success', 
//           response.data.message || 'Form updated successfully! Form is now pending approval.',
//           [
//             {
//               text: 'OK',
//               onPress: () => {
//                 // Refresh data
//                 fetchFormData(existingFormId);
//               }
//             }
//           ]
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
//             errorMessage = firstError ? firstError[0] : 'Please check all required fields';
//           } else {
//             errorMessage = error.response.data.message || 'Validation error occurred';
//           }
//         } else {
//           const serverError = error.response.data;
//           errorMessage = serverError.message || serverError.error || `Server error: ${error.response.status}`;
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
//         url: `https://argosmob.uk/makroo/public/api/v1/delivery-forms/form/generate-pdf/${existingFormId}`,
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

//   const renderModelItem = ({item}) => (
//     <TouchableOpacity
//       style={styles.modelItem}
//       onPress={() => handleModelSelect(item)}>
//       <Text style={styles.modelItemText}>{item}</Text>
//     </TouchableOpacity>
//   );

//   const renderDocumentTypeItem = ({item}) => (
//     <TouchableOpacity
//       style={styles.modelItem}
//       onPress={() => handleDocumentTypeSelect(item)}>
//       <Text style={styles.modelItemText}>{item}</Text>
//     </TouchableOpacity>
//   );

//   const renderInputField = (value, onChange, placeholder, keyboardType = 'default', editable = true) => {
//     if (isEditMode) {
//       return (
//         <TextInput
//           style={styles.input}
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
//         <Text style={[styles.input, styles.readOnlyInput]}>
//           {value || 'Not provided'}
//         </Text>
//       );
//     }
//   };

//   const renderDropdownField = (value, onPress, placeholder) => {
//     if (isEditMode) {
//       return (
//         <TouchableOpacity 
//           style={styles.input}
//           onPress={onPress}
//           disabled={loading}
//         >
//           <Text style={value ? styles.selectedModelText : styles.placeholderText}>
//             {value || placeholder}
//           </Text>
//           <Icon name="keyboard-arrow-down" size={25} color="#666" style={styles.dropdownIcon} />
//         </TouchableOpacity>
//       );
//     } else {
//       return (
//         <Text style={[styles.input, styles.readOnlyInput]}>
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
//             style={[styles.input, styles.inputWithIconField]}
//             onPress={onPress}
//             disabled={loading}
//           >
//             <Text style={date ? styles.selectedModelText : styles.placeholderText}>
//               {date ? date.toLocaleDateString() : placeholder}
//             </Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             onPress={onPress}
//             style={styles.iconButton}
//             disabled={loading}
//           >
//             <Icon name="calendar-today" size={20} color="#666" />
//           </TouchableOpacity>
//         </View>
//       );
//     } else {
//       return (
//         <Text style={[styles.input, styles.readOnlyInput]}>
//           {date ? date.toLocaleDateString() : 'Not provided'}
//         </Text>
//       );
//     }
//   };

//   const renderImageBox = (imageUri, setImageFunction, label) => (
//     <View style={styles.imageContainer}>
//       <Text style={styles.imageLabel}>{label}</Text>
//       {imageUri ? (
//         <View style={styles.photoContainer}>
//           <Image source={{ uri: imageUri }} style={styles.signatureImage} />
//           {isEditMode && (
//             <TouchableOpacity 
//               style={styles.changePhotoButton} 
//               onPress={() => showImageSourceOptions(setImageFunction, `Update ${label}`)}
//             >
//               <Text style={styles.changePhotoText}>Change {label}</Text>
//             </TouchableOpacity>
//           )}
//         </View>
//       ) : (
//         isEditMode && (
//           <View style={styles.photoContainer}>
//             <TouchableOpacity 
//               style={styles.addPhotoButton} 
//               onPress={() => showImageSourceOptions(setImageFunction, `Add ${label}`)}
//             >
//               <Text style={styles.addPhotoText}>Add {label}</Text>
//             </TouchableOpacity>
//           </View>
//         )
//       )}
//     </View>
//   );

//   if (fetchLoading) {
//     return (
//       <View style={{flex: 1, paddingTop: insets.top, justifyContent: 'center', alignItems: 'center'}}>
//         <ActivityIndicator size="large" color="#7E5EA9" />
//         <Text style={{marginTop: 10}}>Loading form data...</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={{flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom}}>
//       <LinearGradient
//         colors={['#7E5EA9', '#20AEBC']}
//         start={{x: 0, y: 0}}
//         end={{x: 1, y: 0}}
//         style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
//           <Icon name="arrow-back" size={24} color="white" />
//         </TouchableOpacity>
//         <View style={styles.headerTitleContainer}>
//           <Text style={styles.companyName}>Makroo Motor Corporation</Text>
//           <Text style={styles.companyName}>Delivery Form</Text>
//         </View>
//       </LinearGradient>

//       <ScrollView style={styles.container}>
//         <View style={styles.formHeader}>
//           {/* <Text style={styles.formNo}>Form ID: {existingFormId}</Text> */}
//           <Text style={styles.Date}>{new Date().toLocaleDateString()}</Text>
//         </View>

//         {isEditMode && (
//           <View style={styles.editModeContainer}>
//             <Text style={styles.editModeText}>Edit Mode - Updating Form ID: {existingFormId}</Text>
//           </View>
//         )}

//         <View style={styles.customerHeader}>
//           <Text style={styles.customerName}>{formData.CustomerName || '—'}</Text>
//           {/* <Text style={styles.customerId}>ID: {existingFormId || '—'}</Text> */}
//           <Text style={[styles.statusText, 
//             status === 'approved' ? styles.statusApproved :
//             status === 'pending' ? styles.statusPending :
//             status === 'rejected' ? styles.statusRejected :
//             styles.statusDefault
//           ]}>
//             Status: {status || '—'}
//           </Text>
//         </View>

//         <View style={styles.formContainer}>
//           {/* Customer Name */}
//           <View style={styles.singleRow}>
//             <Text style={styles.fieldLabel}>Customer Name</Text>
//             <View style={styles.fullWidthContainer}>
//               <LinearGradient
//                 colors={['#7E5EA9', '#20AEBC']}
//                 start={{x: 0, y: 0}}
//                 end={{x: 1, y: 0}}
//                 style={styles.inputGradient}>
//                 {renderInputField(
//                   formData.CustomerName,
//                   (text) => handleInputChange('CustomerName', text),
//                   'Enter customer name'
//                 )}
//               </LinearGradient>
//             </View>
//           </View>

//           {/* Father's Name */}
//           <View style={styles.singleRow}>
//             <Text style={styles.fieldLabel}>Father's Name</Text>
//             <View style={styles.fullWidthContainer}>
//               <LinearGradient
//                 colors={['#7E5EA9', '#20AEBC']}
//                 start={{x: 0, y: 0}}
//                 end={{x: 1, y: 0}}
//                 style={styles.inputGradient}>
//                 {renderInputField(
//                   formData.FathersName,
//                   (text) => handleInputChange('FathersName', text),
//                   'Enter father\'s name'
//                 )}
//               </LinearGradient>
//             </View>
//           </View>

//           {/* Address */}
//           <View style={styles.singleRow}>
//             <Text style={styles.fieldLabel}>Address</Text>
//             <View style={styles.fullWidthContainer}>
//               <LinearGradient
//                 colors={['#7E5EA9', '#20AEBC']}
//                 start={{x: 0, y: 0}}
//                 end={{x: 1, y: 0}}
//                 style={styles.inputGradient}>
//                 {renderInputField(
//                   formData.address,
//                   (text) => handleInputChange('address', text),
//                   'Enter address',
//                   'default',
//                   true
//                 )}
//               </LinearGradient>
//             </View>
//           </View>

//           {/* Mobile Number
//           <View style={styles.singleRow}>
//             <Text style={styles.fieldLabel}>Mobile Number</Text>
//             <View style={styles.fullWidthContainer}>
//               <LinearGradient
//                 colors={['#7E5EA9', '#20AEBC']}
//                 start={{x: 0, y: 0}}
//                 end={{x: 1, y: 0}}
//                 style={styles.inputGradient}>
//                 {renderInputField(
//                   formData.mobileNo,
//                   (text) => handleInputChange('mobileNo', text),
//                   'Enter mobile number',
//                   'phone-pad'
//                 )}
//               </LinearGradient>
//             </View>
//           </View> */}

//           {/* Tractor Name */}
//           {/* <View style={styles.singleRow}>
//             <Text style={styles.fieldLabel}>Tractor Name</Text>
//             <View style={styles.fullWidthContainer}>
//               <LinearGradient
//                 colors={['#7E5EA9', '#20AEBC']}
//                 start={{x: 0, y: 0}}
//                 end={{x: 1, y: 0}}
//                 style={styles.inputGradient}>
//                 {renderInputField(
//                   formData.TractorName,
//                   (text) => handleInputChange('TractorName', text),
//                   'Enter tractor name'
//                 )}
//               </LinearGradient>
//             </View>
//           </View> */}

//           {/* Tractor Model */}
//           {/* <View style={styles.singleRow}>
//             <Text style={styles.fieldLabel}>Tractor Model</Text>
//             <View style={styles.fullWidthContainer}>
//               <LinearGradient
//                 colors={['#7E5EA9', '#20AEBC']}
//                 start={{x: 0, y: 0}}
//                 end={{x: 1, y: 0}}
//                 style={styles.inputGradient}>
//                 {renderDropdownField(
//                   formData.tractorModel,
//                   () => setShowModelDropdown(true),
//                   'Select tractor model'
//                 )}
//               </LinearGradient>
//             </View>
//           </View> */}

//           {/* Date */}
//           <View style={styles.singleRow}>
//             <Text style={styles.fieldLabel}>Date</Text>
//             <View style={styles.fullWidthContainer}>
//               <LinearGradient
//                 colors={['#7E5EA9', '#20AEBC']}
//                 start={{x: 0, y: 0}}
//                 end={{x: 1, y: 0}}
//                 style={styles.inputGradient}>
//                 {renderDateField(
//                   formData.date,
//                   handleDateIconPress,
//                   'Select date'
//                 )}
//                 {showDatePicker && isEditMode && (
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

//           {/* Year of Manufacture */}
//           {/* <View style={styles.singleRow}>
//             <Text style={styles.fieldLabel}>Year of Manufacture</Text>
//             <View style={styles.fullWidthContainer}>
//               <LinearGradient
//                 colors={['#7E5EA9', '#20AEBC']}
//                 start={{x: 0, y: 0}}
//                 end={{x: 1, y: 0}}
//                 style={styles.inputGradient}>
//                 {renderInputField(
//                   formData.YearofManufacture,
//                   (text) => handleInputChange('YearofManufacture', text),
//                   'Enter year of manufacture'
//                 )}
//               </LinearGradient>
//             </View>
//           </View> */}

//           {/* Chassis Number */}
//           <View style={styles.singleRow}>
//             <Text style={styles.fieldLabel}>Chassis Number</Text>
//             <View style={styles.fullWidthContainer}>
//               <LinearGradient
//                 colors={['#7E5EA9', '#20AEBC']}
//                 start={{x: 0, y: 0}}
//                 end={{x: 1, y: 0}}
//                 style={styles.inputGradient}>
//                 {renderInputField(
//                   formData.chassisNo,
//                   (text) => handleInputChange('chassisNo', text),
//                   'Enter chassis number'
//                 )}
//               </LinearGradient>
//             </View>
//           </View>

//           {/* Engine Number */}
//           <View style={styles.singleRow}>
//             <Text style={styles.fieldLabel}>Engine Number</Text>
//             <View style={styles.fullWidthContainer}>
//               <LinearGradient
//                 colors={['#7E5EA9', '#20AEBC']}
//                 start={{x: 0, y: 0}}
//                 end={{x: 1, y: 0}}
//                 style={styles.inputGradient}>
//                 {renderInputField(
//                   formData.engineNo,
//                   (text) => handleInputChange('engineNo', text),
//                   'Enter engine number'
//                 )}
//               </LinearGradient>
//             </View>
//           </View>

//           {/* Document Type */}
//           <View style={styles.singleRow}>
//             <Text style={styles.fieldLabel}>Document Type</Text>
//             <View style={styles.fullWidthContainer}>
//               <LinearGradient
//                 colors={['#7E5EA9', '#20AEBC']}
//                 start={{x: 0, y: 0}}
//                 end={{x: 1, y: 0}}
//                 style={styles.inputGradient}>
//                 {renderDropdownField(
//                   formData.documentType,
//                   () => setShowDocumentTypeDropdown(true),
//                   'Select document type'
//                 )}
//               </LinearGradient>

//               {formData.documentType === 'Other' && (
//                 <View style={{marginTop: 8}}>
//                   <Text style={styles.fieldLabel}>Document Type Details</Text>
//                   <LinearGradient
//                     colors={['#7E5EA9', '#20AEBC']}
//                     start={{x: 0, y: 0}}
//                     end={{x: 1, y: 0}}
//                     style={styles.inputGradient}>
//                     {renderInputField(
//                       formData.otherDocumentType,
//                       (text) => handleInputChange('otherDocumentType', text),
//                       'Enter document type details'
//                     )}
//                   </LinearGradient>
//                 </View>
//               )}
//             </View>
//           </View>

//           {/* Document Number */}
//           <View style={styles.singleRow}>
//             <Text style={styles.fieldLabel}>Document Number</Text>
//             <View style={styles.fullWidthContainer}>
//               <LinearGradient
//                 colors={['#7E5EA9', '#20AEBC']}
//                 start={{x: 0, y: 0}}
//                 end={{x: 1, y: 0}}
//                 style={styles.inputGradient}>
//                 {renderInputField(
//                   formData.DocumentNumber,
//                   (text) => handleInputChange('DocumentNumber', text),
//                   'Enter document number'
//                 )}
//               </LinearGradient>
//             </View>
//           </View>
//         </View>

//         {/* Tractor Model Dropdown Modal */}
//         <Modal
//           visible={showModelDropdown}
//           transparent={true}
//           animationType="slide"
//           onRequestClose={() => setShowModelDropdown(false)}
//         >
//           <View style={styles.modalOverlay}>
//             <View style={styles.modalContent}>
//               <View style={styles.modalHeader}>
//                 <Text style={styles.modalTitle}>Select Tractor Model</Text>
//                 <TouchableOpacity 
//                   onPress={() => setShowModelDropdown(false)}
//                   style={styles.closeButton}
//                 >
//                   <Icon name="close" size={24} color="#000" />
//                 </TouchableOpacity>
//               </View>
//               <FlatList
//                 data={tractorModels}
//                 renderItem={renderModelItem}
//                 keyExtractor={(item, index) => index.toString()}
//                 style={styles.modelList}
//                 showsVerticalScrollIndicator={true}
//               />
//             </View>
//           </View>
//         </Modal>

//         {/* Document Type Dropdown Modal */}
//         <Modal
//           visible={showDocumentTypeDropdown}
//           transparent={true}
//           animationType="slide"
//           onRequestClose={() => setShowDocumentTypeDropdown(false)}
//         >
//           <View style={styles.modalOverlay}>
//             <View style={styles.modalContent}>
//               <View style={styles.modalHeader}>
//                 <Text style={styles.modalTitle}>Select Document Type</Text>
//                 <TouchableOpacity 
//                   onPress={() => setShowDocumentTypeDropdown(false)}
//                   style={styles.closeButton}
//                 >
//                   <Icon name="close" size={24} color="#000" />
//                 </TouchableOpacity>
//               </View>
//               <FlatList
//                 data={documentTypes}
//                 renderItem={renderDocumentTypeItem}
//                 keyExtractor={(item, index) => index.toString()}
//                 style={styles.modelList}
//                 showsVerticalScrollIndicator={true}
//               />
//             </View>
//           </View>
//         </Modal>

//         {/* Signatures Section */}
//         <View style={{ marginTop: 20 }}>
//           <Text style={styles.sectionTitle}>Signatures</Text>
          
//           {renderImageBox(customerSignature, setCustomerSignature, 'Customer Signature')}
//           {renderImageBox(managerSignature, setManagerSignature, 'Manager Signature')}
//         </View>

//         {/* Updated Terms and Conditions Section */}
//         <View style={styles.termsContainer}>
//           <Text style={styles.termsTitle}>Terms and Conditions:</Text>
//           <View style={styles.termsList}>
//             <Text style={styles.termItem}>1. The Tractor Will Be Delivered Only After Full Payment Clearance.</Text>
//             <Text style={styles.termItem}>2. Customer Must Provide Valid Id Proof Before Receiving The Tractor.</Text>
//             <Text style={styles.termItem}>3. Delivery To Branch Staff Requires Prior Written Authorization From The Head Office.</Text>
//             <Text style={styles.termItem}>4. Branch Personnel Must Verify All Customer Details Before Handover.</Text>
//             <Text style={styles.termItem}>5. Once Delivered, Makroo Motor Corporation Will Not Be Responsible For Loss Or Damage.</Text>
//             <Text style={styles.termItem}>6. Any Correction Or Reissue Request Must Be Submitted In Writing With Valid Reason.</Text>
//             <Text style={styles.termItem}>7. Tractor Will Not Be Handed Over To Any Unauthorized Person.</Text>
//             <Text style={styles.termItem}>8. Customer Or Branch Representative Must Sign And Acknowledge Receipt At The Time Of Delivery.</Text>
//             <Text style={styles.termItem}>9. All Records Of Delivery Must Be Updated In The Company Database The Same Day.</Text>
//             <Text style={styles.termItem}>10. Duplicate Delivery Is Not Allowed Without Written Approval From The Head Office.</Text>
//             <Text style={styles.termItem}>11. If The Customer Fails To Collect The Tractor Within 30 Days, Storage Or Courier Charges May Apply.</Text>
//             <Text style={styles.termItem}>12. In Case Of Dispute, The Decision Of Makroo Motor Corporation Management Will Be Final.</Text>
//           </View>

//           {/* Checkbox for accepting terms */}
//           <TouchableOpacity 
//             style={styles.checkboxContainer}
//             onPress={() => isEditMode && setAcceptedTerms(!acceptedTerms)}
//             disabled={!isEditMode || loading}
//           >
//             <View style={[styles.checkbox, acceptedTerms && styles.checkboxChecked]}>
//               {acceptedTerms && <Icon name="check" size={16} color="#fff" />}
//             </View>
//             <Text style={styles.checkboxLabel}>Accept All Terms And Conditions</Text>
//           </TouchableOpacity>
//         </View>

//         <View style={styles.buttonContainer}>
//           {/* Edit Button - Only show when backend status is 'edited' and form hasn't been updated before */}
//           {route.params?.backendStatus === 'edited' && !hasBeenUpdated && !isEditMode && (
//             <TouchableOpacity style={styles.editButton} onPress={handleEditPress}>
//               <Text style={styles.editButtonText}>Edit Form</Text>
//             </TouchableOpacity>
//           )}

//           {isEditMode && (
//             <>
//               <TouchableOpacity 
//                 style={[styles.submitButton, (loading || !acceptedTerms) && styles.disabledButton]} 
//                 onPress={handleUpdate}
//                 disabled={loading || !acceptedTerms}
//               >
//                 {loading ? (
//                   <ActivityIndicator color="#fff" size="small" />
//                 ) : (
//                   <Text style={styles.submitButtonText}>Update Form</Text>
//                 )}
//               </TouchableOpacity>

//               <TouchableOpacity 
//                 style={[styles.cancelButton, loading && styles.disabledButton]} 
//                 onPress={handleCancelEdit}
//                 disabled={loading}
//               >
//                 <Text style={styles.cancelButtonText}>Cancel</Text>
//               </TouchableOpacity>
//             </>
//           )}

//           {status === 'approved' && (
//             <TouchableOpacity 
//               style={[styles.pdfButton, loading && styles.disabledButton]} 
//               onPress={handleDownloadPDF}
//               disabled={loading}
//             >
//               {loading ? (
//                 <ActivityIndicator color="#fff" size="small" />
//               ) : (
//                 <Text style={styles.pdfButtonText}>Download PDF</Text>
//               )}
//             </TouchableOpacity>
//           )}

//           <TouchableOpacity 
//             style={[styles.homeButton, loading && styles.disabledButton]} 
//             onPress={() => navigation.goBack()}
//             disabled={loading}
//           >
//             <Text style={styles.homeButtonText}>Back to List</Text>
//           </TouchableOpacity>
//         </View>
//       </ScrollView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     paddingHorizontal: 15,
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 10,
//     paddingHorizontal: 15,
//   },
//   backButton: {
//     padding: 5,
//     marginRight: 10,
//   },
//   headerTitleContainer: {
//     flex: 1,
//     alignItems: 'center',
//   },
//   companyName: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: 'white',
//     textAlign: 'center',
//   },
//   formHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginVertical: 10,
//     paddingHorizontal: 5,
//   },
//   formNo: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#000',
//   },
//   Date: {
//     fontSize: 12,
//     color: '#00000099',
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
//     fontWeight: '600',
//     color: '#7E5EA9',
//   },
//   customerHeader: {
//     alignItems: 'center',
//     marginVertical: 10,
//     marginBottom: 10,
//   },
//   customerName: {
//     fontSize: 20,
//     color: '#000',
//     fontWeight: 'bold',
//     marginBottom: 30,
//   },
//   customerId: {
//     fontSize: 13,
//     color: '#56616D',
//     fontWeight: 'bold',
//   },
//   statusText: {
//     fontSize: 12,
//     fontWeight: 'bold',
//     marginTop: 5,
//     paddingHorizontal: 12,
//     paddingVertical: 4,
//     borderRadius: 12,
//     marginBottom: 20,
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
//   statusDefault: {
//     backgroundColor: '#9E9E9E',
//     color: 'white',
//   },
//   formContainer: {
//     marginBottom: 15,
//   },
//   singleRow: {
//     marginBottom: 10,
//   },
//   fullWidthContainer: {
//     width: '100%',
//     marginBottom: 10,
//   },
//   fieldLabel: {
//     fontSize: 14,
//     fontWeight: '500',
//     marginBottom: 5,
//     color: '#000',
//   },
//   inputGradient: {
//     borderRadius: 10,
//     padding: 1,
//   },
//   input: {
//     borderRadius: 10,
//     backgroundColor: '#fff',
//     paddingVertical: 12,
//     paddingHorizontal: 15,
//     fontSize: 14,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     minHeight: 40,
//   },
//   readOnlyInput: {
//     color: '#666',
//     backgroundColor: '#f5f5f5',
//   },
//   selectedModelText: {
//     fontSize: 14,
//     color: '#000',
//   },
//   placeholderText: {
//     fontSize: 14,
//     color: '#666',
//   },
//   dropdownIcon: {
//     marginLeft: 8,
//   },
//   inputWithIcon: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   inputWithIconField: {
//     flex: 1,
//   },
//   iconButton: {
//     position: 'absolute',
//     right: 12,
//     padding: 4,
//   },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   modalContent: {
//     backgroundColor: 'white',
//     borderRadius: 10,
//     width: '90%',
//     maxHeight: '70%',
//     overflow: 'hidden',
//   },
//   modalHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: '#e0e0e0',
//   },
//   modalTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   closeButton: {
//     padding: 4,
//   },
//   modelList: {
//     maxHeight: 300,
//   },
//   modelItem: {
//     padding: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: '#f0f0f0',
//   },
//   modelItemText: {
//     fontSize: 14,
//     color: '#333',
//   },
//   imageContainer: {
//     marginBottom: 20,
//   },
//   imageLabel: {
//     fontSize: 14,
//     fontWeight: '500',
//     marginBottom: 5,
//     color: '#000',
//   },
//   photoContainer: {
//     alignItems: 'center',
//   },
//   signatureImage: {
//     height: 80,
//     width: 220,
//     resizeMode: 'contain',
//     borderWidth: 1,
//     borderColor: '#ccc'
//   },
//   changePhotoButton: { 
//     backgroundColor: '#7E5EA9', 
//     padding: 8, 
//     borderRadius: 6, 
//     marginTop: 8,
//   },
//   changePhotoText: { 
//     color: 'white', 
//     fontWeight: 'bold', 
//     fontSize: 12 
//   },
//   addPhotoButton: { 
//     backgroundColor: '#20AEBC', 
//     padding: 15, 
//     borderRadius: 6, 
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderStyle: 'dashed'
//   },
//   addPhotoText: { 
//     color: 'white', 
//     fontWeight: 'bold' 
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 10,
//     color: '#000',
//   },
//   // Updated Terms and Conditions Styles to match Form screen
//   termsContainer: {
//     marginBottom: 15,
//     padding: 10,
//     borderRadius: 10,
//     backgroundColor: '#f9f9f9',
//     borderWidth: 1,
//     borderColor: '#e0e0e0',
//   },
//   termsTitle: {
//     fontSize: 14.5,
//     fontWeight: '600',
//     color: '#000',
//     marginBottom: 10,
//   },
//   termsList: {
//     marginBottom: 15,
//   },
//   termItem: {
//     fontSize: 12.5,
//     color: '#333',
//     marginBottom: 5,
//     lineHeight: 16,
//   },
//   checkboxContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 10,
//   },
//   checkbox: {
//     width: 20,
//     height: 20,
//     borderWidth: 1,
//     borderColor: '#666',
//     borderRadius: 4,
//     marginRight: 10,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//   },
//   checkboxChecked: {
//     backgroundColor: '#4CAF50',
//     borderColor: '#4CAF50',
//   },
//   checkboxLabel: {
//     fontSize: 14,
//     fontWeight: '500',
//     color: '#000',
//   },
//   buttonContainer: {
//     marginTop: 20,
//     marginBottom: 30,
//   },
//   editButton: {
//     backgroundColor: '#FFA000',
//     padding: 15,
//     borderRadius: 10,
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   editButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   submitButton: {
//     backgroundColor: '#7E5EA9',
//     padding: 15,
//     borderRadius: 10,
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   submitButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   cancelButton: {
//     backgroundColor: '#6c757d',
//     padding: 15,
//     borderRadius: 10,
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   cancelButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   pdfButton: {
//     backgroundColor: '#4CAF50',
//     padding: 15,
//     borderRadius: 10,
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   pdfButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   homeButton: {
//     backgroundColor: '#20AEBC',
//     padding: 15,
//     borderRadius: 10,
//     alignItems: 'center',
//   },
//   homeButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   disabledButton: {
//     opacity: 0.6,
//   },
// });

// export default Deliveryforminternalpage;






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
// import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
// import DateTimePicker from '@react-native-community/datetimepicker';
// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const Deliveryforminternalpage = ({navigation, route}) => {
//   const insets = useSafeAreaInsets();
//   const [userId, setUserId] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [fetchLoading, setFetchLoading] = useState(true);
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [existingFormId, setExistingFormId] = useState(null);
//   const [status, setStatus] = useState('pending');
//   const [acceptedTerms, setAcceptedTerms] = useState(false);

//   // Form states
//   const [showModelDropdown, setShowModelDropdown] = useState(false);
//   const [showDocumentTypeDropdown, setShowDocumentTypeDropdown] = useState(false);
//   const [showDatePicker, setShowDatePicker] = useState(false);

//   const [formData, setFormData] = useState({
//     CustomerName: '',
//     FathersName: '',
//     percentage: '',
//     address: '',
//     mobileNo: '',
//     TractorName: '',
//     tractorModel: '',
//     date: null,
//     YearofManufacture: '',
//     chassisNo: '',
//     engineNo: '',
//     DocumentNumber: '',
//     documentType: '',
//     otherDocumentType: '',
//   });

//   // Image states
//   const [customerSignature, setCustomerSignature] = useState(null);
//   const [managerSignature, setManagerSignature] = useState(null);

//   const tractorModels = [
//     "3028EN","3036EN","3036E","5105","5105 4WD","5050D Gear Pro","5210 Gear Pro",
//     "5050D 4WD Gear Pro","5210 4WD Gear Pro","5310 CRDI","5310 4WD CRDI","5405 CRDI",
//     "5405 4WD CRDI","5075 2WD","5075 4WD"
//   ];

//   const documentTypes = [
//     "Sale Certificate","Insurance","Tax Invoice","Form 21","E-way Bill","Other"
//   ];

//   // Helper function to make absolute URLs
//   const makeAbsoluteUrl = (relativePath) => {
//     if (!relativePath) return null;
//     if (relativePath.startsWith('http')) return relativePath;
//     return `https://argosmob.uk/makroo/public/${relativePath.replace(/^\/+/, '')}`;
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
//       Alert.alert('Error', 'No form ID provided');
//       navigation.goBack();
//     }
//   }, [route.params]);

//   const fetchFormData = async (formId) => {
//     try {
//       setFetchLoading(true);
      
//       const config = {
//         method: 'get',
//         url: `https://argosmob.uk/makroo/public/api/v1/delivery-forms/${formId}`,
//         timeout: 30000,
//       };

//       const response = await axios(config);
      
//       if (response.data.status && response.data.data) {
//         const data = response.data.data;
        
//         // Set status from backend
//         setStatus(data.status || 'pending');
        
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

//   const populateFormData = (data) => {
//     // Map API fields to form fields
//     setFormData({
//       CustomerName: data.customer_name || '',
//       FathersName: data.father_name || '',
//       percentage: '',
//       address: data.address || '',
//       mobileNo: '',
//       TractorName: '',
//       tractorModel: '',
//       date: data.submitted_at ? new Date(data.submitted_at) : null,
//       YearofManufacture: '',
//       chassisNo: data.tractor_number || '',
//       engineNo: data.engine_number || '',
//       DocumentNumber: data.document_number || '',
//       documentType: data.document_type || '',
//       otherDocumentType: '',
//     });

//     // Load existing images
//     if (data.customer_signature) {
//       const customerSignatureUri = makeAbsoluteUrl(data.customer_signature);
//       setCustomerSignature(customerSignatureUri);
//     }
//     if (data.manager_signature) {
//       const managerSignatureUri = makeAbsoluteUrl(data.manager_signature);
//       setManagerSignature(managerSignatureUri);
//     }

//     // Accept terms for viewing
//     setAcceptedTerms(true);
//   };

//   // Image handling functions
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

//   const showImageSourceOptions = (setImageFunction, title = 'Select Image Source') => {
//     if (!isEditMode) {
//       Alert.alert('Cannot Edit', 'This form cannot be edited in its current status.');
//       return;
//     }

//     if (Platform.OS === 'ios') {
//       ActionSheetIOS.showActionSheetWithOptions(
//         {
//           options: ['Cancel', 'Take Photo', 'Choose from Gallery'],
//           cancelButtonIndex: 0,
//         },
//         async (buttonIndex) => {
//           if (buttonIndex === 1) {
//             const hasPermission = await requestCameraPermissionForImage();
//             if (!hasPermission) {
//               Alert.alert('Permission Denied', 'Camera permission is required to take photos.');
//               return;
//             }
//             openCamera(setImageFunction);
//           } else if (buttonIndex === 2) {
//             openGallery(setImageFunction);
//           }
//         }
//       );
//     } else {
//       Alert.alert(
//         title,
//         'Choose how you want to capture the image',
//         [
//           { text: 'Cancel', style: 'cancel' },
//           { 
//             text: 'Take Photo', 
//             onPress: async () => {
//               const hasPermission = await requestCameraPermissionForImage();
//               if (!hasPermission) {
//                 Alert.alert('Permission Denied', 'Camera permission is required to take photos.');
//                 return;
//               }
//               openCamera(setImageFunction);
//             } 
//           },
//           { 
//             text: 'Choose from Gallery', 
//             onPress: () => openGallery(setImageFunction) 
//           },
//         ]
//       );
//     }
//   };

//   const openCamera = (setImageFunction) => {
//     const options = {
//       mediaType: 'photo',
//       quality: 0.8,
//       maxWidth: 800,
//       maxHeight: 800,
//       cameraType: 'back',
//       saveToPhotos: false,
//     };

//     launchCamera(options, (response) => {
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

//   const openGallery = (setImageFunction) => {
//     const options = {
//       mediaType: 'photo',
//       quality: 0.8,
//       maxWidth: 800,
//       maxHeight: 800,
//     };

//     launchImageLibrary(options, (response) => {
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

//   const handleModelSelect = (model) => {
//     handleInputChange('tractorModel', model);
//     setShowModelDropdown(false);
//   };

//   const handleDocumentTypeSelect = (documentType) => {
//     handleInputChange('documentType', documentType);
//     setShowDocumentTypeDropdown(false);
//   };

//   const handleDateChange = (event, selectedDate) => {
//     setShowDatePicker(false);
//     if (selectedDate) {
//       handleInputChange('date', selectedDate);
//     }
//   };

//   // Edit Mode Handler - Only allow editing when status is 'edited'
//   const handleEditPress = () => {
//     if (status === 'edited') {
//       setIsEditMode(true);
//     } else {
//       Alert.alert('Cannot Edit', `This form cannot be edited in its current status (${status}).`);
//     }
//   };

//   const handleCancelEdit = () => {
//     setIsEditMode(false);
//     if (existingFormId) {
//       fetchFormData(existingFormId);
//     }
//   };

//   // Validate Form for Update
//   const validateForm = () => {
//     const requiredFields = [
//       'CustomerName', 'FathersName', 'address', 'chassisNo', 'engineNo'
//     ];

//     for (const field of requiredFields) {
//       if (!formData[field] || formData[field].toString().trim() === '') {
//         Alert.alert('Validation Error', `Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
//         return false;
//       }
//     }

//     if (!formData.documentType || formData.documentType.trim() === '') {
//       Alert.alert('Validation Error', 'Please select document type');
//       return false;
//     }

//     if (formData.documentType === 'Other' && (!formData.otherDocumentType || formData.otherDocumentType.trim() === '')) {
//       Alert.alert('Validation Error', 'Please enter document type details for Other');
//       return false;
//     }

//     if (!customerSignature) {
//       Alert.alert('Validation Error', 'Please add Customer Signature');
//       return false;
//     }
//     if (!managerSignature) {
//       Alert.alert('Validation Error', 'Please add Manager Signature');
//       return false;
//     }

//     if (!acceptedTerms) {
//       Alert.alert('Validation Error', 'Please accept all terms and conditions');
//       return false;
//     }

//     return true;
//   };

//   const prepareFormData = () => {
//     const formDataToSend = new FormData();

//     formDataToSend.append('id', existingFormId.toString());
//     formDataToSend.append('user_id', userId);
//     formDataToSend.append('customer_name', formData.CustomerName);
//     formDataToSend.append('father_name', formData.FathersName);
//     formDataToSend.append('address', formData.address);
//     formDataToSend.append('tractor_number', formData.chassisNo);
//     formDataToSend.append('engine_number', formData.engineNo);

//     const docType = formData.documentType === 'Other'
//       ? (formData.otherDocumentType || '').trim()
//       : (formData.documentType || '').trim();
//     formDataToSend.append('document_type', docType);
//     formDataToSend.append('document_number', formData.DocumentNumber);

//     // "YYYY-MM-DD HH:mm:ss"
//     const now = new Date();
//     const submittedAt =
//       `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')} ` +
//       `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`;
//     formDataToSend.append('submitted_at', submittedAt);

//     if (customerSignature && customerSignature.startsWith('file://')) {
//       formDataToSend.append('customer_signature', {
//         uri: customerSignature,
//         type: 'image/jpeg',
//         name: 'customer_signature.jpg',
//       });
//     }

//     if (managerSignature && managerSignature.startsWith('file://')) {
//       formDataToSend.append('manager_signature', {
//         uri: managerSignature,
//         type: 'image/jpeg',
//         name: 'manager_signature.jpg',
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
//         url: 'https://argosmob.uk/makroo/public/api/v1/delivery-forms/update',
//         headers: {
//           'Content-Type': 'multipart/form-data',
//           'Accept': 'application/json',
//         },
//         data: formDataToSend,
//         timeout: 30000,
//       };

//       const response = await axios(config);

//       if (response.data && response.data.status === true) {
//         // Update local state
//         setStatus('pending'); // After update, status becomes pending
//         setIsEditMode(false);
        
//         Alert.alert(
//           'Success', 
//           response.data.message || 'Form updated successfully! Form is now pending approval.',
//           [
//             {
//               text: 'OK',
//               onPress: () => {
//                 // Refresh data
//                 fetchFormData(existingFormId);
//               }
//             }
//           ]
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
//             errorMessage = firstError ? firstError[0] : 'Please check all required fields';
//           } else {
//             errorMessage = error.response.data.message || 'Validation error occurred';
//           }
//         } else {
//           const serverError = error.response.data;
//           errorMessage = serverError.message || serverError.error || `Server error: ${error.response.status}`;
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
//         url: `https://argosmob.uk/makroo/public/api/v1/delivery-forms/form/generate-pdf/${existingFormId}`,
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

//   const renderModelItem = ({item}) => (
//     <TouchableOpacity
//       style={styles.modelItem}
//       onPress={() => handleModelSelect(item)}>
//       <Text style={styles.modelItemText}>{item}</Text>
//     </TouchableOpacity>
//   );

//   const renderDocumentTypeItem = ({item}) => (
//     <TouchableOpacity
//       style={styles.modelItem}
//       onPress={() => handleDocumentTypeSelect(item)}>
//       <Text style={styles.modelItemText}>{item}</Text>
//     </TouchableOpacity>
//   );

//   const renderInputField = (value, onChange, placeholder, keyboardType = 'default', editable = true) => {
//     if (isEditMode) {
//       return (
//         <TextInput
//           style={styles.input}
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
//         <Text style={[styles.input, styles.readOnlyInput]}>
//           {value || 'Not provided'}
//         </Text>
//       );
//     }
//   };

//   const renderDropdownField = (value, onPress, placeholder) => {
//     if (isEditMode) {
//       return (
//         <TouchableOpacity 
//           style={styles.input}
//           onPress={onPress}
//           disabled={loading}
//         >
//           <Text style={value ? styles.selectedModelText : styles.placeholderText}>
//             {value || placeholder}
//           </Text>
//           <Icon name="keyboard-arrow-down" size={25} color="#666" style={styles.dropdownIcon} />
//         </TouchableOpacity>
//       );
//     } else {
//       return (
//         <Text style={[styles.input, styles.readOnlyInput]}>
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
//             style={[styles.input, styles.inputWithIconField]}
//             onPress={onPress}
//             disabled={loading}
//           >
//             <Text style={date ? styles.selectedModelText : styles.placeholderText}>
//               {date ? date.toLocaleDateString() : placeholder}
//             </Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             onPress={onPress}
//             style={styles.iconButton}
//             disabled={loading}
//           >
//             <Icon name="calendar-today" size={20} color="#666" />
//           </TouchableOpacity>
//         </View>
//       );
//     } else {
//       return (
//         <Text style={[styles.input, styles.readOnlyInput]}>
//           {date ? date.toLocaleDateString() : 'Not provided'}
//         </Text>
//       );
//     }
//   };

//   const renderImageBox = (imageUri, setImageFunction, label) => (
//     <View style={styles.imageContainer}>
//       <Text style={styles.imageLabel}>{label}</Text>
//       {imageUri ? (
//         <View style={styles.photoContainer}>
//           <Image source={{ uri: imageUri }} style={styles.signatureImage} />
//           {isEditMode && (
//             <TouchableOpacity 
//               style={styles.changePhotoButton} 
//               onPress={() => showImageSourceOptions(setImageFunction, `Update ${label}`)}
//             >
//               <Text style={styles.changePhotoText}>Change {label}</Text>
//             </TouchableOpacity>
//           )}
//         </View>
//       ) : (
//         isEditMode && (
//           <View style={styles.photoContainer}>
//             <TouchableOpacity 
//               style={styles.addPhotoButton} 
//               onPress={() => showImageSourceOptions(setImageFunction, `Add ${label}`)}
//             >
//               <Text style={styles.addPhotoText}>Add {label}</Text>
//             </TouchableOpacity>
//           </View>
//         )
//       )}
//     </View>
//   );

//   // Check if form can be edited based on status
//   const canEditForm = status === 'edited';
  
//   // Check if PDF download should be shown
//   const showPDFButton = status === 'approved';

//   if (fetchLoading) {
//     return (
//       <View style={{flex: 1, paddingTop: insets.top, justifyContent: 'center', alignItems: 'center'}}>
//         <ActivityIndicator size="large" color="#7E5EA9" />
//         <Text style={{marginTop: 10}}>Loading form data...</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={{flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom}}>
//       <LinearGradient
//         colors={['#7E5EA9', '#20AEBC']}
//         start={{x: 0, y: 0}}
//         end={{x: 1, y: 0}}
//         style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
//           <Icon name="arrow-back" size={24} color="white" />
//         </TouchableOpacity>
//         <View style={styles.headerTitleContainer}>
//           <Text style={styles.companyName}>Makroo Motor Corporation</Text>
//           <Text style={styles.companyName}>Delivery Form</Text>
//         </View>
//       </LinearGradient>

//       <ScrollView style={styles.container}>
//         <View style={styles.formHeader}>
//           <Text style={styles.Date}>{new Date().toLocaleDateString()}</Text>
//         </View>

//         {isEditMode && (
//           <View style={styles.editModeContainer}>
//             <Text style={styles.editModeText}>Edit Mode - Updating Form ID: {existingFormId}</Text>
//           </View>
//         )}

//         <View style={styles.customerHeader}>
//           <Text style={styles.customerName}>{formData.CustomerName || '—'}</Text>
//           <Text style={[styles.statusText, 
//             status === 'approved' ? styles.statusApproved :
//             status === 'pending' ? styles.statusPending :
//             status === 'rejected' ? styles.statusRejected :
//             status === 'edited' ? styles.statusEdited :
//             styles.statusDefault
//           ]}>
//             Status: {status ? status.toUpperCase() : '—'}
//           </Text>
//         </View>

//         <View style={styles.formContainer}>
//           {/* Customer Name */}
//           <View style={styles.singleRow}>
//             <Text style={styles.fieldLabel}>Customer Name</Text>
//             <View style={styles.fullWidthContainer}>
//               <LinearGradient
//                 colors={['#7E5EA9', '#20AEBC']}
//                 start={{x: 0, y: 0}}
//                 end={{x: 1, y: 0}}
//                 style={styles.inputGradient}>
//                 {renderInputField(
//                   formData.CustomerName,
//                   (text) => handleInputChange('CustomerName', text),
//                   'Enter customer name'
//                 )}
//               </LinearGradient>
//             </View>
//           </View>

//           {/* Father's Name */}
//           <View style={styles.singleRow}>
//             <Text style={styles.fieldLabel}>Father's Name</Text>
//             <View style={styles.fullWidthContainer}>
//               <LinearGradient
//                 colors={['#7E5EA9', '#20AEBC']}
//                 start={{x: 0, y: 0}}
//                 end={{x: 1, y: 0}}
//                 style={styles.inputGradient}>
//                 {renderInputField(
//                   formData.FathersName,
//                   (text) => handleInputChange('FathersName', text),
//                   'Enter father\'s name'
//                 )}
//               </LinearGradient>
//             </View>
//           </View>

//           {/* Address */}
//           <View style={styles.singleRow}>
//             <Text style={styles.fieldLabel}>Address</Text>
//             <View style={styles.fullWidthContainer}>
//               <LinearGradient
//                 colors={['#7E5EA9', '#20AEBC']}
//                 start={{x: 0, y: 0}}
//                 end={{x: 1, y: 0}}
//                 style={styles.inputGradient}>
//                 {renderInputField(
//                   formData.address,
//                   (text) => handleInputChange('address', text),
//                   'Enter address',
//                   'default',
//                   true
//                 )}
//               </LinearGradient>
//             </View>
//           </View>

//           {/* Chassis Number */}
//           <View style={styles.singleRow}>
//             <Text style={styles.fieldLabel}>Chassis Number</Text>
//             <View style={styles.fullWidthContainer}>
//               <LinearGradient
//                 colors={['#7E5EA9', '#20AEBC']}
//                 start={{x: 0, y: 0}}
//                 end={{x: 1, y: 0}}
//                 style={styles.inputGradient}>
//                 {renderInputField(
//                   formData.chassisNo,
//                   (text) => handleInputChange('chassisNo', text),
//                   'Enter chassis number'
//                 )}
//               </LinearGradient>
//             </View>
//           </View>

//           {/* Engine Number */}
//           <View style={styles.singleRow}>
//             <Text style={styles.fieldLabel}>Engine Number</Text>
//             <View style={styles.fullWidthContainer}>
//               <LinearGradient
//                 colors={['#7E5EA9', '#20AEBC']}
//                 start={{x: 0, y: 0}}
//                 end={{x: 1, y: 0}}
//                 style={styles.inputGradient}>
//                 {renderInputField(
//                   formData.engineNo,
//                   (text) => handleInputChange('engineNo', text),
//                   'Enter engine number'
//                 )}
//               </LinearGradient>
//             </View>
//           </View>

//           {/* Document Type */}
//           <View style={styles.singleRow}>
//             <Text style={styles.fieldLabel}>Document Type</Text>
//             <View style={styles.fullWidthContainer}>
//               <LinearGradient
//                 colors={['#7E5EA9', '#20AEBC']}
//                 start={{x: 0, y: 0}}
//                 end={{x: 1, y: 0}}
//                 style={styles.inputGradient}>
//                 {renderDropdownField(
//                   formData.documentType,
//                   () => setShowDocumentTypeDropdown(true),
//                   'Select document type'
//                 )}
//               </LinearGradient>

//               {formData.documentType === 'Other' && (
//                 <View style={{marginTop: 8}}>
//                   <Text style={styles.fieldLabel}>Document Type Details</Text>
//                   <LinearGradient
//                     colors={['#7E5EA9', '#20AEBC']}
//                     start={{x: 0, y: 0}}
//                     end={{x: 1, y: 0}}
//                     style={styles.inputGradient}>
//                     {renderInputField(
//                       formData.otherDocumentType,
//                       (text) => handleInputChange('otherDocumentType', text),
//                       'Enter document type details'
//                     )}
//                   </LinearGradient>
//                 </View>
//               )}
//             </View>
//           </View>

//           {/* Document Number */}
//           <View style={styles.singleRow}>
//             <Text style={styles.fieldLabel}>Document Number</Text>
//             <View style={styles.fullWidthContainer}>
//               <LinearGradient
//                 colors={['#7E5EA9', '#20AEBC']}
//                 start={{x: 0, y: 0}}
//                 end={{x: 1, y: 0}}
//                 style={styles.inputGradient}>
//                 {renderInputField(
//                   formData.DocumentNumber,
//                   (text) => handleInputChange('DocumentNumber', text),
//                   'Enter document number'
//                 )}
//               </LinearGradient>
//             </View>
//           </View>
//         </View>

//         {/* Tractor Model Dropdown Modal */}
//         <Modal
//           visible={showModelDropdown}
//           transparent={true}
//           animationType="slide"
//           onRequestClose={() => setShowModelDropdown(false)}
//         >
//           <View style={styles.modalOverlay}>
//             <View style={styles.modalContent}>
//               <View style={styles.modalHeader}>
//                 <Text style={styles.modalTitle}>Select Tractor Model</Text>
//                 <TouchableOpacity 
//                   onPress={() => setShowModelDropdown(false)}
//                   style={styles.closeButton}
//                 >
//                   <Icon name="close" size={24} color="#000" />
//                 </TouchableOpacity>
//               </View>
//               <FlatList
//                 data={tractorModels}
//                 renderItem={renderModelItem}
//                 keyExtractor={(item, index) => index.toString()}
//                 style={styles.modelList}
//                 showsVerticalScrollIndicator={true}
//               />
//             </View>
//           </View>
//         </Modal>

//         {/* Document Type Dropdown Modal */}
//         <Modal
//           visible={showDocumentTypeDropdown}
//           transparent={true}
//           animationType="slide"
//           onRequestClose={() => setShowDocumentTypeDropdown(false)}
//         >
//           <View style={styles.modalOverlay}>
//             <View style={styles.modalContent}>
//               <View style={styles.modalHeader}>
//                 <Text style={styles.modalTitle}>Select Document Type</Text>
//                 <TouchableOpacity 
//                   onPress={() => setShowDocumentTypeDropdown(false)}
//                   style={styles.closeButton}
//                 >
//                   <Icon name="close" size={24} color="#000" />
//                 </TouchableOpacity>
//               </View>
//               <FlatList
//                 data={documentTypes}
//                 renderItem={renderDocumentTypeItem}
//                 keyExtractor={(item, index) => index.toString()}
//                 style={styles.modelList}
//                 showsVerticalScrollIndicator={true}
//               />
//             </View>
//           </View>
//         </Modal>

//         {/* Signatures Section */}
//         <View style={{ marginTop: 20 }}>
//           <Text style={styles.sectionTitle}>Signatures</Text>
          
//           {renderImageBox(customerSignature, setCustomerSignature, 'Customer Signature')}
//           {renderImageBox(managerSignature, setManagerSignature, 'Manager Signature')}
//         </View>

//         {/* Updated Terms and Conditions Section */}
//         <View style={styles.termsContainer}>
//           <Text style={styles.termsTitle}>Terms and Conditions:</Text>
//           <View style={styles.termsList}>
//             <Text style={styles.termItem}>1. The Tractor Will Be Delivered Only After Full Payment Clearance.</Text>
//             <Text style={styles.termItem}>2. Customer Must Provide Valid Id Proof Before Receiving The Tractor.</Text>
//             <Text style={styles.termItem}>3. Delivery To Branch Staff Requires Prior Written Authorization From The Head Office.</Text>
//             <Text style={styles.termItem}>4. Branch Personnel Must Verify All Customer Details Before Handover.</Text>
//             <Text style={styles.termItem}>5. Once Delivered, Makroo Motor Corporation Will Not Be Responsible For Loss Or Damage.</Text>
//             <Text style={styles.termItem}>6. Any Correction Or Reissue Request Must Be Submitted In Writing With Valid Reason.</Text>
//             <Text style={styles.termItem}>7. Tractor Will Not Be Handed Over To Any Unauthorized Person.</Text>
//             <Text style={styles.termItem}>8. Customer Or Branch Representative Must Sign And Acknowledge Receipt At The Time Of Delivery.</Text>
//             <Text style={styles.termItem}>9. All Records Of Delivery Must Be Updated In The Company Database The Same Day.</Text>
//             <Text style={styles.termItem}>10. Duplicate Delivery Is Not Allowed Without Written Approval From The Head Office.</Text>
//             <Text style={styles.termItem}>11. If The Customer Fails To Collect The Tractor Within 30 Days, Storage Or Courier Charges May Apply.</Text>
//             <Text style={styles.termItem}>12. In Case Of Dispute, The Decision Of Makroo Motor Corporation Management Will Be Final.</Text>
//           </View>

//           {/* Checkbox for accepting terms */}
//           <TouchableOpacity 
//             style={styles.checkboxContainer}
//             onPress={() => isEditMode && setAcceptedTerms(!acceptedTerms)}
//             disabled={!isEditMode || loading}
//           >
//             <View style={[styles.checkbox, acceptedTerms && styles.checkboxChecked]}>
//               {acceptedTerms && <Icon name="check" size={16} color="#fff" />}
//             </View>
//             <Text style={styles.checkboxLabel}>Accept All Terms And Conditions</Text>
//           </TouchableOpacity>
//         </View>

//         <View style={styles.buttonContainer}>
//           {/* Edit Button - Only show when status is 'edited' */}
//           {canEditForm && !isEditMode && (
//             <TouchableOpacity style={styles.editButton} onPress={handleEditPress}>
//               <Text style={styles.editButtonText}>Edit Form</Text>
//             </TouchableOpacity>
//           )}

//           {isEditMode && (
//             <>
//               <TouchableOpacity 
//                 style={[styles.submitButton, (loading || !acceptedTerms) && styles.disabledButton]} 
//                 onPress={handleUpdate}
//                 disabled={loading || !acceptedTerms}
//               >
//                 {loading ? (
//                   <ActivityIndicator color="#fff" size="small" />
//                 ) : (
//                   <Text style={styles.submitButtonText}>Update Form</Text>
//                 )}
//               </TouchableOpacity>

//               <TouchableOpacity 
//                 style={[styles.cancelButton, loading && styles.disabledButton]} 
//                 onPress={handleCancelEdit}
//                 disabled={loading}
//               >
//                 <Text style={styles.cancelButtonText}>Cancel</Text>
//               </TouchableOpacity>
//             </>
//           )}

//           {/* PDF Button - Only show when status is 'approved' */}
//           {showPDFButton && (
//             <TouchableOpacity 
//               style={[styles.pdfButton, loading && styles.disabledButton]} 
//               onPress={handleDownloadPDF}
//               disabled={loading}
//             >
//               {loading ? (
//                 <ActivityIndicator color="#fff" size="small" />
//               ) : (
//                 <Text style={styles.pdfButtonText}>Download PDF</Text>
//               )}
//             </TouchableOpacity>
//           )}

//           <TouchableOpacity 
//             style={[styles.homeButton, loading && styles.disabledButton]} 
//             onPress={() => navigation.goBack()}
//             disabled={loading}
//           >
//             <Text style={styles.homeButtonText}>Back to List</Text>
//           </TouchableOpacity>
//         </View>
//       </ScrollView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     paddingHorizontal: 15,
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 10,
//     paddingHorizontal: 15,
//   },
//   backButton: {
//     padding: 5,
//     marginRight: 10,
//   },
//   headerTitleContainer: {
//     flex: 1,
//     alignItems: 'center',
//   },
//   companyName: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: 'white',
//     textAlign: 'center',
//   },
//   formHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginVertical: 10,
//     paddingHorizontal: 5,
//   },
//   formNo: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#000',
//   },
//   Date: {
//     fontSize: 12,
//     color: '#00000099',
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
//     fontWeight: '600',
//     color: '#7E5EA9',
//   },
//   customerHeader: {
//     alignItems: 'center',
//     marginVertical: 10,
//     marginBottom: 10,
//   },
//   customerName: {
//     fontSize: 20,
//     color: '#000',
//     fontWeight: 'bold',
//     marginBottom: 30,
//   },
//   customerId: {
//     fontSize: 13,
//     color: '#56616D',
//     fontWeight: 'bold',
//   },
//   statusText: {
//     fontSize: 12,
//     fontWeight: 'bold',
//     marginTop: 5,
//     paddingHorizontal: 12,
//     paddingVertical: 4,
//     borderRadius: 12,
//     marginBottom: 20,
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
//   formContainer: {
//     marginBottom: 15,
//   },
//   singleRow: {
//     marginBottom: 10,
//   },
//   fullWidthContainer: {
//     width: '100%',
//     marginBottom: 10,
//   },
//   fieldLabel: {
//     fontSize: 14,
//     fontWeight: '500',
//     marginBottom: 5,
//     color: '#000',
//   },
//   inputGradient: {
//     borderRadius: 10,
//     padding: 1,
//   },
//   input: {
//     borderRadius: 10,
//     backgroundColor: '#fff',
//     paddingVertical: 12,
//     paddingHorizontal: 15,
//     fontSize: 14,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     minHeight: 40,
//   },
//   readOnlyInput: {
//     color: '#666',
//     backgroundColor: '#f5f5f5',
//   },
//   selectedModelText: {
//     fontSize: 14,
//     color: '#000',
//   },
//   placeholderText: {
//     fontSize: 14,
//     color: '#666',
//   },
//   dropdownIcon: {
//     marginLeft: 8,
//   },
//   inputWithIcon: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   inputWithIconField: {
//     flex: 1,
//   },
//   iconButton: {
//     position: 'absolute',
//     right: 12,
//     padding: 4,
//   },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   modalContent: {
//     backgroundColor: 'white',
//     borderRadius: 10,
//     width: '90%',
//     maxHeight: '70%',
//     overflow: 'hidden',
//   },
//   modalHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: '#e0e0e0',
//   },
//   modalTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   closeButton: {
//     padding: 4,
//   },
//   modelList: {
//     maxHeight: 300,
//   },
//   modelItem: {
//     padding: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: '#f0f0f0',
//   },
//   modelItemText: {
//     fontSize: 14,
//     color: '#333',
//   },
//   imageContainer: {
//     marginBottom: 20,
//   },
//   imageLabel: {
//     fontSize: 14,
//     fontWeight: '500',
//     marginBottom: 5,
//     color: '#000',
//   },
//   photoContainer: {
//     alignItems: 'center',
//   },
//   signatureImage: {
//     height: 80,
//     width: 220,
//     resizeMode: 'contain',
//     borderWidth: 1,
//     borderColor: '#ccc'
//   },
//   changePhotoButton: { 
//     backgroundColor: '#7E5EA9', 
//     padding: 8, 
//     borderRadius: 6, 
//     marginTop: 8,
//   },
//   changePhotoText: { 
//     color: 'white', 
//     fontWeight: 'bold', 
//     fontSize: 12 
//   },
//   addPhotoButton: { 
//     backgroundColor: '#20AEBC', 
//     padding: 15, 
//     borderRadius: 6, 
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderStyle: 'dashed'
//   },
//   addPhotoText: { 
//     color: 'white', 
//     fontWeight: 'bold' 
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 10,
//     color: '#000',
//   },
//   // Updated Terms and Conditions Styles to match Form screen
//   termsContainer: {
//     marginBottom: 15,
//     padding: 10,
//     borderRadius: 10,
//     backgroundColor: '#f9f9f9',
//     borderWidth: 1,
//     borderColor: '#e0e0e0',
//   },
//   termsTitle: {
//     fontSize: 14.5,
//     fontWeight: '600',
//     color: '#000',
//     marginBottom: 10,
//   },
//   termsList: {
//     marginBottom: 15,
//   },
//   termItem: {
//     fontSize: 12.5,
//     color: '#333',
//     marginBottom: 5,
//     lineHeight: 16,
//   },
//   checkboxContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 10,
//   },
//   checkbox: {
//     width: 20,
//     height: 20,
//     borderWidth: 1,
//     borderColor: '#666',
//     borderRadius: 4,
//     marginRight: 10,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//   },
//   checkboxChecked: {
//     backgroundColor: '#4CAF50',
//     borderColor: '#4CAF50',
//   },
//   checkboxLabel: {
//     fontSize: 14,
//     fontWeight: '500',
//     color: '#000',
//   },
//   buttonContainer: {
//     marginTop: 20,
//     marginBottom: 30,
//   },
//   editButton: {
//     backgroundColor: '#FFA000',
//     padding: 15,
//     borderRadius: 10,
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   editButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   submitButton: {
//     backgroundColor: '#7E5EA9',
//     padding: 15,
//     borderRadius: 10,
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   submitButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   cancelButton: {
//     backgroundColor: '#6c757d',
//     padding: 15,
//     borderRadius: 10,
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   cancelButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   pdfButton: {
//     backgroundColor: '#4CAF50',
//     padding: 15,
//     borderRadius: 10,
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   pdfButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   homeButton: {
//     backgroundColor: '#20AEBC',
//     padding: 15,
//     borderRadius: 10,
//     alignItems: 'center',
//   },
//   homeButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   disabledButton: {
//     opacity: 0.6,
//   },
// });

// export default Deliveryforminternalpage;




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
// import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
// import DateTimePicker from '@react-native-community/datetimepicker';
// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const Deliveryforminternalpage = ({navigation, route}) => {
//   const insets = useSafeAreaInsets();
//   const [userId, setUserId] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [fetchLoading, setFetchLoading] = useState(true);
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [existingFormId, setExistingFormId] = useState(null);
//   const [status, setStatus] = useState('pending');
//   const [acceptedTerms, setAcceptedTerms] = useState(false);

//   // Form states
//   const [showModelDropdown, setShowModelDropdown] = useState(false);
//   const [showDocumentTypeDropdown, setShowDocumentTypeDropdown] = useState(false);
//   const [showDatePicker, setShowDatePicker] = useState(false);

//   const [formData, setFormData] = useState({
//     CustomerName: '',
//     FathersName: '',
//     percentage: '',
//     address: '',
//     mobileNo: '',
//     TractorName: '',
//     tractorModel: '',
//     date: null,
//     YearofManufacture: '',
//     tractorName: '', // Changed from chassisNo to tractorName
//     engineNo: '',
//     DocumentNumber: '',
//     documentType: '',
//     otherDocumentType: '',
//   });

//   // Image states
//   const [customerSignature, setCustomerSignature] = useState(null);
//   const [managerSignature, setManagerSignature] = useState(null);

//   const tractorModels = [
//     "3028EN","3036EN","3036E","5105","5105 4WD","5050D Gear Pro","5210 Gear Pro",
//     "5050D 4WD Gear Pro","5210 4WD Gear Pro","5310 CRDI","5310 4WD CRDI","5405 CRDI",
//     "5405 4WD CRDI","5075 2WD","5075 4WD"
//   ];

//   const documentTypes = [
//     "Sale Certificate","Insurance","Tax Invoice","Form 21","E-way Bill","Other"
//   ];

//   // Helper function to make absolute URLs
//   const makeAbsoluteUrl = (relativePath) => {
//     if (!relativePath) return null;
//     if (relativePath.startsWith('http')) return relativePath;
//     return `https://argosmob.uk/makroo/public/${relativePath.replace(/^\/+/, '')}`;
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
//       Alert.alert('Error', 'No form ID provided');
//       navigation.goBack();
//     }
//   }, [route.params]);

//   const fetchFormData = async (formId) => {
//     try {
//       setFetchLoading(true);
      
//       const config = {
//         method: 'get',
//         url: `https://argosmob.uk/makroo/public/api/v1/delivery-forms/${formId}`,
//         timeout: 30000,
//       };

//       const response = await axios(config);
      
//       if (response.data.status && response.data.data) {
//         const data = response.data.data;
        
//         // Set status from backend
//         setStatus(data.status || 'pending');
        
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

//   const populateFormData = (data) => {
//     // Map API fields to form fields
//     setFormData({
//       CustomerName: data.customer_name || '',
//       FathersName: data.father_name || '',
//       percentage: '',
//       address: data.address || '',
//       mobileNo: '',
//       TractorName: '',
//       tractorModel: '',
//       date: data.submitted_at ? new Date(data.submitted_at) : null,
//       YearofManufacture: '',
//       tractorName: data.tractor_number || '', // Map tractor_number to tractorName
//       engineNo: data.engine_number || '',
//       DocumentNumber: data.document_number || '',
//       documentType: data.document_type || '',
//       otherDocumentType: '',
//     });

//     // Load existing images
//     if (data.customer_signature) {
//       const customerSignatureUri = makeAbsoluteUrl(data.customer_signature);
//       setCustomerSignature(customerSignatureUri);
//     }
//     if (data.manager_signature) {
//       const managerSignatureUri = makeAbsoluteUrl(data.manager_signature);
//       setManagerSignature(managerSignatureUri);
//     }

//     // Accept terms for viewing
//     setAcceptedTerms(true);
//   };

//   // Image handling functions
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

//   const showImageSourceOptions = (setImageFunction, title = 'Select Image Source') => {
//     if (!isEditMode) {
//       Alert.alert('Cannot Edit', 'This form cannot be edited in its current status.');
//       return;
//     }

//     if (Platform.OS === 'ios') {
//       ActionSheetIOS.showActionSheetWithOptions(
//         {
//           options: ['Cancel', 'Take Photo', 'Choose from Gallery'],
//           cancelButtonIndex: 0,
//         },
//         async (buttonIndex) => {
//           if (buttonIndex === 1) {
//             const hasPermission = await requestCameraPermissionForImage();
//             if (!hasPermission) {
//               Alert.alert('Permission Denied', 'Camera permission is required to take photos.');
//               return;
//             }
//             openCamera(setImageFunction);
//           } else if (buttonIndex === 2) {
//             openGallery(setImageFunction);
//           }
//         }
//       );
//     } else {
//       Alert.alert(
//         title,
//         'Choose how you want to capture the image',
//         [
//           { text: 'Cancel', style: 'cancel' },
//           { 
//             text: 'Take Photo', 
//             onPress: async () => {
//               const hasPermission = await requestCameraPermissionForImage();
//               if (!hasPermission) {
//                 Alert.alert('Permission Denied', 'Camera permission is required to take photos.');
//                 return;
//               }
//               openCamera(setImageFunction);
//             } 
//           },
//           { 
//             text: 'Choose from Gallery', 
//             onPress: () => openGallery(setImageFunction) 
//           },
//         ]
//       );
//     }
//   };

//   const openCamera = (setImageFunction) => {
//     const options = {
//       mediaType: 'photo',
//       quality: 0.8,
//       maxWidth: 800,
//       maxHeight: 800,
//       cameraType: 'back',
//       saveToPhotos: false,
//     };

//     launchCamera(options, (response) => {
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

//   const openGallery = (setImageFunction) => {
//     const options = {
//       mediaType: 'photo',
//       quality: 0.8,
//       maxWidth: 800,
//       maxHeight: 800,
//     };

//     launchImageLibrary(options, (response) => {
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

//   const handleModelSelect = (model) => {
//     handleInputChange('tractorModel', model);
//     setShowModelDropdown(false);
//   };

//   const handleDocumentTypeSelect = (documentType) => {
//     handleInputChange('documentType', documentType);
//     setShowDocumentTypeDropdown(false);
//   };

//   const handleDateChange = (event, selectedDate) => {
//     setShowDatePicker(false);
//     if (selectedDate) {
//       handleInputChange('date', selectedDate);
//     }
//   };

//   // Edit Mode Handler - Only allow editing when status is 'edited'
//   const handleEditPress = () => {
//     if (status === 'edited') {
//       setIsEditMode(true);
//     } else {
//       Alert.alert('Cannot Edit', `This form cannot be edited in its current status (${status}).`);
//     }
//   };

//   const handleCancelEdit = () => {
//     setIsEditMode(false);
//     if (existingFormId) {
//       fetchFormData(existingFormId);
//     }
//   };

//   // Validate Form for Update
//   const validateForm = () => {
//     const requiredFields = [
//       'CustomerName', 'FathersName', 'address', 'tractorName', 'engineNo'
//     ];

//     for (const field of requiredFields) {
//       if (!formData[field] || formData[field].toString().trim() === '') {
//         Alert.alert('Validation Error', `Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
//         return false;
//       }
//     }

//     if (!formData.documentType || formData.documentType.trim() === '') {
//       Alert.alert('Validation Error', 'Please select document type');
//       return false;
//     }

//     if (formData.documentType === 'Other' && (!formData.otherDocumentType || formData.otherDocumentType.trim() === '')) {
//       Alert.alert('Validation Error', 'Please enter document type details for Other');
//       return false;
//     }

//     if (!customerSignature) {
//       Alert.alert('Validation Error', 'Please add Customer Signature');
//       return false;
//     }
//     if (!managerSignature) {
//       Alert.alert('Validation Error', 'Please add Manager Signature');
//       return false;
//     }

//     if (!acceptedTerms) {
//       Alert.alert('Validation Error', 'Please accept all terms and conditions');
//       return false;
//     }

//     return true;
//   };

//   const prepareFormData = () => {
//     const formDataToSend = new FormData();

//     formDataToSend.append('id', existingFormId.toString());
//     formDataToSend.append('user_id', userId);
//     formDataToSend.append('customer_name', formData.CustomerName);
//     formDataToSend.append('father_name', formData.FathersName);
//     formDataToSend.append('address', formData.address);
//     formDataToSend.append('tractor_number', formData.tractorName); // Changed from chassisNo to tractorName
//     formDataToSend.append('engine_number', formData.engineNo);

//     const docType = formData.documentType === 'Other'
//       ? (formData.otherDocumentType || '').trim()
//       : (formData.documentType || '').trim();
//     formDataToSend.append('document_type', docType);
//     formDataToSend.append('document_number', formData.DocumentNumber);

//     // "YYYY-MM-DD HH:mm:ss"
//     const now = new Date();
//     const submittedAt =
//       `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')} ` +
//       `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`;
//     formDataToSend.append('submitted_at', submittedAt);

//     if (customerSignature && customerSignature.startsWith('file://')) {
//       formDataToSend.append('customer_signature', {
//         uri: customerSignature,
//         type: 'image/jpeg',
//         name: 'customer_signature.jpg',
//       });
//     }

//     if (managerSignature && managerSignature.startsWith('file://')) {
//       formDataToSend.append('manager_signature', {
//         uri: managerSignature,
//         type: 'image/jpeg',
//         name: 'manager_signature.jpg',
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
//         url: 'https://argosmob.uk/makroo/public/api/v1/delivery-forms/update',
//         headers: {
//           'Content-Type': 'multipart/form-data',
//           'Accept': 'application/json',
//         },
//         data: formDataToSend,
//         timeout: 30000,
//       };

//       const response = await axios(config);

//       // Check for success based on API response structure
//       if (response.data && response.data.status === "success") {
//         // Update local state
//         setStatus('pending'); // After update, status becomes pending
//         setIsEditMode(false);
        
//         Alert.alert(
//           'Success', 
//           'Form updated successfully! Form is now pending approval.',
//           [
//             {
//               text: 'OK',
//               onPress: () => {
//                 // Refresh data
//                 fetchFormData(existingFormId);
//               }
//             }
//           ]
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
//             errorMessage = firstError ? firstError[0] : 'Please check all required fields';
//           } else {
//             errorMessage = error.response.data.message || 'Validation error occurred';
//           }
//         } else {
//           const serverError = error.response.data;
//           errorMessage = serverError.message || serverError.error || `Server error: ${error.response.status}`;
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
//         url: `https://argosmob.uk/makroo/public/api/v1/delivery-forms/form/generate-pdf/${existingFormId}`,
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

//   const renderModelItem = ({item}) => (
//     <TouchableOpacity
//       style={styles.modelItem}
//       onPress={() => handleModelSelect(item)}>
//       <Text style={styles.modelItemText}>{item}</Text>
//     </TouchableOpacity>
//   );

//   const renderDocumentTypeItem = ({item}) => (
//     <TouchableOpacity
//       style={styles.modelItem}
//       onPress={() => handleDocumentTypeSelect(item)}>
//       <Text style={styles.modelItemText}>{item}</Text>
//     </TouchableOpacity>
//   );

//   const renderInputField = (value, onChange, placeholder, keyboardType = 'default', editable = true) => {
//     if (isEditMode) {
//       return (
//         <TextInput
//           style={styles.input}
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
//         <Text style={[styles.input, styles.readOnlyInput]}>
//           {value || 'Not provided'}
//         </Text>
//       );
//     }
//   };

//   const renderDropdownField = (value, onPress, placeholder) => {
//     if (isEditMode) {
//       return (
//         <TouchableOpacity 
//           style={styles.input}
//           onPress={onPress}
//           disabled={loading}
//         >
//           <Text style={value ? styles.selectedModelText : styles.placeholderText}>
//             {value || placeholder}
//           </Text>
//           <Icon name="keyboard-arrow-down" size={25} color="#666" style={styles.dropdownIcon} />
//         </TouchableOpacity>
//       );
//     } else {
//       return (
//         <Text style={[styles.input, styles.readOnlyInput]}>
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
//             style={[styles.input, styles.inputWithIconField]}
//             onPress={onPress}
//             disabled={loading}
//           >
//             <Text style={date ? styles.selectedModelText : styles.placeholderText}>
//               {date ? date.toLocaleDateString() : placeholder}
//             </Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             onPress={onPress}
//             style={styles.iconButton}
//             disabled={loading}
//           >
//             <Icon name="calendar-today" size={20} color="#666" />
//           </TouchableOpacity>
//         </View>
//       );
//     } else {
//       return (
//         <Text style={[styles.input, styles.readOnlyInput]}>
//           {date ? date.toLocaleDateString() : 'Not provided'}
//         </Text>
//       );
//     }
//   };

//   const renderImageBox = (imageUri, setImageFunction, label) => (
//     <View style={styles.imageContainer}>
//       <Text style={styles.imageLabel}>{label}</Text>
//       {imageUri ? (
//         <View style={styles.photoContainer}>
//           <Image source={{ uri: imageUri }} style={styles.signatureImage} />
//           {isEditMode && (
//             <TouchableOpacity 
//               style={styles.changePhotoButton} 
//               onPress={() => showImageSourceOptions(setImageFunction, `Update ${label}`)}
//             >
//               <Text style={styles.changePhotoText}>Change {label}</Text>
//             </TouchableOpacity>
//           )}
//         </View>
//       ) : (
//         isEditMode && (
//           <View style={styles.photoContainer}>
//             <TouchableOpacity 
//               style={styles.addPhotoButton} 
//               onPress={() => showImageSourceOptions(setImageFunction, `Add ${label}`)}
//             >
//               <Text style={styles.addPhotoText}>Add {label}</Text>
//             </TouchableOpacity>
//           </View>
//         )
//       )}
//     </View>
//   );

//   // Check if form can be edited based on status
//   const canEditForm = status === 'edited';
  
//   // Check if PDF download should be shown
//   const showPDFButton = status === 'approved';

//   if (fetchLoading) {
//     return (
//       <View style={{flex: 1, paddingTop: insets.top, justifyContent: 'center', alignItems: 'center'}}>
//         <ActivityIndicator size="large" color="#7E5EA9" />
//         <Text style={{marginTop: 10}}>Loading form data...</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={{flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom}}>
//       <LinearGradient
//         colors={['#7E5EA9', '#20AEBC']}
//         start={{x: 0, y: 0}}
//         end={{x: 1, y: 0}}
//         style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
//           <Icon name="arrow-back" size={24} color="white" />
//         </TouchableOpacity>
//         <View style={styles.headerTitleContainer}>
//           <Text style={styles.companyName}>Makroo Motor Corporation</Text>
//           <Text style={styles.companyName}>Delivery Form</Text>
//         </View>
//       </LinearGradient>

//       <ScrollView style={styles.container}>
//         <View style={styles.formHeader}>
//           <Text style={styles.Date}>{new Date().toLocaleDateString()}</Text>
//         </View>

//         {isEditMode && (
//           <View style={styles.editModeContainer}>
//             <Text style={styles.editModeText}>Edit Mode - Updating Form ID: {existingFormId}</Text>
//           </View>
//         )}

//         <View style={styles.customerHeader}>
//           <Text style={styles.customerName}>{formData.CustomerName || '—'}</Text>
//           <Text style={[styles.statusText, 
//             status === 'approved' ? styles.statusApproved :
//             status === 'pending' ? styles.statusPending :
//             status === 'rejected' ? styles.statusRejected :
//             status === 'edited' ? styles.statusEdited :
//             styles.statusDefault
//           ]}>
//             Status: {status ? status.toUpperCase() : '—'}
//           </Text>
//         </View>

//         <View style={styles.formContainer}>
//           {/* Customer Name */}
//           <View style={styles.singleRow}>
//             <Text style={styles.fieldLabel}>Customer Name</Text>
//             <View style={styles.fullWidthContainer}>
//               <LinearGradient
//                 colors={['#7E5EA9', '#20AEBC']}
//                 start={{x: 0, y: 0}}
//                 end={{x: 1, y: 0}}
//                 style={styles.inputGradient}>
//                 {renderInputField(
//                   formData.CustomerName,
//                   (text) => handleInputChange('CustomerName', text),
//                   'Enter customer name'
//                 )}
//               </LinearGradient>
//             </View>
//           </View>

//           {/* Father's Name */}
//           <View style={styles.singleRow}>
//             <Text style={styles.fieldLabel}>Father's Name</Text>
//             <View style={styles.fullWidthContainer}>
//               <LinearGradient
//                 colors={['#7E5EA9', '#20AEBC']}
//                 start={{x: 0, y: 0}}
//                 end={{x: 1, y: 0}}
//                 style={styles.inputGradient}>
//                 {renderInputField(
//                   formData.FathersName,
//                   (text) => handleInputChange('FathersName', text),
//                   'Enter father\'s name'
//                 )}
//               </LinearGradient>
//             </View>
//           </View>

//           {/* Address */}
//           <View style={styles.singleRow}>
//             <Text style={styles.fieldLabel}>Address</Text>
//             <View style={styles.fullWidthContainer}>
//               <LinearGradient
//                 colors={['#7E5EA9', '#20AEBC']}
//                 start={{x: 0, y: 0}}
//                 end={{x: 1, y: 0}}
//                 style={styles.inputGradient}>
//                 {renderInputField(
//                   formData.address,
//                   (text) => handleInputChange('address', text),
//                   'Enter address',
//                   'default',
//                   true
//                 )}
//               </LinearGradient>
//             </View>
//           </View>

//           {/* Tractor Name - Replaced Chassis Number */}
//           <View style={styles.singleRow}>
//             <Text style={styles.fieldLabel}>Tractor Name</Text>
//             <View style={styles.fullWidthContainer}>
//               <LinearGradient
//                 colors={['#7E5EA9', '#20AEBC']}
//                 start={{x: 0, y: 0}}
//                 end={{x: 1, y: 0}}
//                 style={styles.inputGradient}>
//                 {renderInputField(
//                   formData.tractorName,
//                   (text) => handleInputChange('tractorName', text),
//                   'Enter tractor name'
//                 )}
//               </LinearGradient>
//             </View>
//           </View>

//           {/* Engine Number */}
//           <View style={styles.singleRow}>
//             <Text style={styles.fieldLabel}>Engine Number</Text>
//             <View style={styles.fullWidthContainer}>
//               <LinearGradient
//                 colors={['#7E5EA9', '#20AEBC']}
//                 start={{x: 0, y: 0}}
//                 end={{x: 1, y: 0}}
//                 style={styles.inputGradient}>
//                 {renderInputField(
//                   formData.engineNo,
//                   (text) => handleInputChange('engineNo', text),
//                   'Enter engine number'
//                 )}
//               </LinearGradient>
//             </View>
//           </View>

//           {/* Document Type */}
//           <View style={styles.singleRow}>
//             <Text style={styles.fieldLabel}>Document Type</Text>
//             <View style={styles.fullWidthContainer}>
//               <LinearGradient
//                 colors={['#7E5EA9', '#20AEBC']}
//                 start={{x: 0, y: 0}}
//                 end={{x: 1, y: 0}}
//                 style={styles.inputGradient}>
//                 {renderDropdownField(
//                   formData.documentType,
//                   () => setShowDocumentTypeDropdown(true),
//                   'Select document type'
//                 )}
//               </LinearGradient>

//               {formData.documentType === 'Other' && (
//                 <View style={{marginTop: 8}}>
//                   <Text style={styles.fieldLabel}>Document Type Details</Text>
//                   <LinearGradient
//                     colors={['#7E5EA9', '#20AEBC']}
//                     start={{x: 0, y: 0}}
//                     end={{x: 1, y: 0}}
//                     style={styles.inputGradient}>
//                     {renderInputField(
//                       formData.otherDocumentType,
//                       (text) => handleInputChange('otherDocumentType', text),
//                       'Enter document type details'
//                     )}
//                   </LinearGradient>
//                 </View>
//               )}
//             </View>
//           </View>

//           {/* Document Number */}
//           <View style={styles.singleRow}>
//             <Text style={styles.fieldLabel}>Document Number</Text>
//             <View style={styles.fullWidthContainer}>
//               <LinearGradient
//                 colors={['#7E5EA9', '#20AEBC']}
//                 start={{x: 0, y: 0}}
//                 end={{x: 1, y: 0}}
//                 style={styles.inputGradient}>
//                 {renderInputField(
//                   formData.DocumentNumber,
//                   (text) => handleInputChange('DocumentNumber', text),
//                   'Enter document number'
//                 )}
//               </LinearGradient>
//             </View>
//           </View>
//         </View>

//         {/* Tractor Model Dropdown Modal */}
//         <Modal
//           visible={showModelDropdown}
//           transparent={true}
//           animationType="slide"
//           onRequestClose={() => setShowModelDropdown(false)}
//         >
//           <View style={styles.modalOverlay}>
//             <View style={styles.modalContent}>
//               <View style={styles.modalHeader}>
//                 <Text style={styles.modalTitle}>Select Tractor Model</Text>
//                 <TouchableOpacity 
//                   onPress={() => setShowModelDropdown(false)}
//                   style={styles.closeButton}
//                 >
//                   <Icon name="close" size={24} color="#000" />
//                 </TouchableOpacity>
//               </View>
//               <FlatList
//                 data={tractorModels}
//                 renderItem={renderModelItem}
//                 keyExtractor={(item, index) => index.toString()}
//                 style={styles.modelList}
//                 showsVerticalScrollIndicator={true}
//               />
//             </View>
//           </View>
//         </Modal>

//         {/* Document Type Dropdown Modal */}
//         <Modal
//           visible={showDocumentTypeDropdown}
//           transparent={true}
//           animationType="slide"
//           onRequestClose={() => setShowDocumentTypeDropdown(false)}
//         >
//           <View style={styles.modalOverlay}>
//             <View style={styles.modalContent}>
//               <View style={styles.modalHeader}>
//                 <Text style={styles.modalTitle}>Select Document Type</Text>
//                 <TouchableOpacity 
//                   onPress={() => setShowDocumentTypeDropdown(false)}
//                   style={styles.closeButton}
//                 >
//                   <Icon name="close" size={24} color="#000" />
//                 </TouchableOpacity>
//               </View>
//               <FlatList
//                 data={documentTypes}
//                 renderItem={renderDocumentTypeItem}
//                 keyExtractor={(item, index) => index.toString()}
//                 style={styles.modelList}
//                 showsVerticalScrollIndicator={true}
//               />
//             </View>
//           </View>
//         </Modal>

//         {/* Signatures Section */}
//         <View style={{ marginTop: 20 }}>
//           <Text style={styles.sectionTitle}>Signatures</Text>
          
//           {renderImageBox(customerSignature, setCustomerSignature, 'Customer Signature')}
//           {renderImageBox(managerSignature, setManagerSignature, 'Manager Signature')}
//         </View>

//         {/* Updated Terms and Conditions Section */}
//         <View style={styles.termsContainer}>
//           <Text style={styles.termsTitle}>Terms and Conditions:</Text>
//           <View style={styles.termsList}>
//             <Text style={styles.termItem}>1. The Tractor Will Be Delivered Only After Full Payment Clearance.</Text>
//             <Text style={styles.termItem}>2. Customer Must Provide Valid Id Proof Before Receiving The Tractor.</Text>
//             <Text style={styles.termItem}>3. Delivery To Branch Staff Requires Prior Written Authorization From The Head Office.</Text>
//             <Text style={styles.termItem}>4. Branch Personnel Must Verify All Customer Details Before Handover.</Text>
//             <Text style={styles.termItem}>5. Once Delivered, Makroo Motor Corporation Will Not Be Responsible For Loss Or Damage.</Text>
//             <Text style={styles.termItem}>6. Any Correction Or Reissue Request Must Be Submitted In Writing With Valid Reason.</Text>
//             <Text style={styles.termItem}>7. Tractor Will Not Be Handed Over To Any Unauthorized Person.</Text>
//             <Text style={styles.termItem}>8. Customer Or Branch Representative Must Sign And Acknowledge Receipt At The Time Of Delivery.</Text>
//             <Text style={styles.termItem}>9. All Records Of Delivery Must Be Updated In The Company Database The Same Day.</Text>
//             <Text style={styles.termItem}>10. Duplicate Delivery Is Not Allowed Without Written Approval From The Head Office.</Text>
//             <Text style={styles.termItem}>11. If The Customer Fails To Collect The Tractor Within 30 Days, Storage Or Courier Charges May Apply.</Text>
//             <Text style={styles.termItem}>12. In Case Of Dispute, The Decision Of Makroo Motor Corporation Management Will Be Final.</Text>
//           </View>

//           {/* Checkbox for accepting terms */}
//           <TouchableOpacity 
//             style={styles.checkboxContainer}
//             onPress={() => isEditMode && setAcceptedTerms(!acceptedTerms)}
//             disabled={!isEditMode || loading}
//           >
//             <View style={[styles.checkbox, acceptedTerms && styles.checkboxChecked]}>
//               {acceptedTerms && <Icon name="check" size={16} color="#fff" />}
//             </View>
//             <Text style={styles.checkboxLabel}>Accept All Terms And Conditions</Text>
//           </TouchableOpacity>
//         </View>

//         <View style={styles.buttonContainer}>
//           {/* Edit Button - Only show when status is 'edited' */}
//           {canEditForm && !isEditMode && (
//             <TouchableOpacity style={styles.editButton} onPress={handleEditPress}>
//               <Text style={styles.editButtonText}>Edit Form</Text>
//             </TouchableOpacity>
//           )}

//           {isEditMode && (
//             <>
//               <TouchableOpacity 
//                 style={[styles.submitButton, (loading || !acceptedTerms) && styles.disabledButton]} 
//                 onPress={handleUpdate}
//                 disabled={loading || !acceptedTerms}
//               >
//                 {loading ? (
//                   <ActivityIndicator color="#fff" size="small" />
//                 ) : (
//                   <Text style={styles.submitButtonText}>Update Form</Text>
//                 )}
//               </TouchableOpacity>

//               <TouchableOpacity 
//                 style={[styles.cancelButton, loading && styles.disabledButton]} 
//                 onPress={handleCancelEdit}
//                 disabled={loading}
//               >
//                 <Text style={styles.cancelButtonText}>Cancel</Text>
//               </TouchableOpacity>
//             </>
//           )}

//           {/* PDF Button - Only show when status is 'approved' */}
//           {showPDFButton && (
//             <TouchableOpacity 
//               style={[styles.pdfButton, loading && styles.disabledButton]} 
//               onPress={handleDownloadPDF}
//               disabled={loading}
//             >
//               {loading ? (
//                 <ActivityIndicator color="#fff" size="small" />
//               ) : (
//                 <Text style={styles.pdfButtonText}>Download PDF</Text>
//               )}
//             </TouchableOpacity>
//           )}

//           <TouchableOpacity 
//             style={[styles.homeButton, loading && styles.disabledButton]} 
//             onPress={() => navigation.goBack()}
//             disabled={loading}
//           >
//             <Text style={styles.homeButtonText}>Back to List</Text>
//           </TouchableOpacity>
//         </View>
//       </ScrollView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     paddingHorizontal: 15,
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 10,
//     paddingHorizontal: 15,
//   },
//   backButton: {
//     padding: 5,
//     marginRight: 10,
//   },
//   headerTitleContainer: {
//     flex: 1,
//     alignItems: 'center',
//   },
//   companyName: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: 'white',
//     textAlign: 'center',
//   },
//   formHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginVertical: 10,
//     paddingHorizontal: 5,
//   },
//   formNo: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#000',
//   },
//   Date: {
//     fontSize: 12,
//     color: '#00000099',
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
//     fontWeight: '600',
//     color: '#7E5EA9',
//   },
//   customerHeader: {
//     alignItems: 'center',
//     marginVertical: 10,
//     marginBottom: 10,
//   },
//   customerName: {
//     fontSize: 20,
//     color: '#000',
//     fontWeight: 'bold',
//     marginBottom: 30,
//   },
//   customerId: {
//     fontSize: 13,
//     color: '#56616D',
//     fontWeight: 'bold',
//   },
//   statusText: {
//     fontSize: 12,
//     fontWeight: 'bold',
//     marginTop: 5,
//     paddingHorizontal: 12,
//     paddingVertical: 4,
//     borderRadius: 12,
//     marginBottom: 20,
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
//   formContainer: {
//     marginBottom: 15,
//   },
//   singleRow: {
//     marginBottom: 10,
//   },
//   fullWidthContainer: {
//     width: '100%',
//     marginBottom: 10,
//   },
//   fieldLabel: {
//     fontSize: 14,
//     fontWeight: '500',
//     marginBottom: 5,
//     color: '#000',
//   },
//   inputGradient: {
//     borderRadius: 10,
//     padding: 1,
//   },
//   input: {
//     borderRadius: 10,
//     backgroundColor: '#fff',
//     paddingVertical: 12,
//     paddingHorizontal: 15,
//     fontSize: 14,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     minHeight: 40,
//   },
//   readOnlyInput: {
//     color: '#666',
//     backgroundColor: '#f5f5f5',
//   },
//   selectedModelText: {
//     fontSize: 14,
//     color: '#000',
//   },
//   placeholderText: {
//     fontSize: 14,
//     color: '#666',
//   },
//   dropdownIcon: {
//     marginLeft: 8,
//   },
//   inputWithIcon: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   inputWithIconField: {
//     flex: 1,
//   },
//   iconButton: {
//     position: 'absolute',
//     right: 12,
//     padding: 4,
//   },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   modalContent: {
//     backgroundColor: 'white',
//     borderRadius: 10,
//     width: '90%',
//     maxHeight: '70%',
//     overflow: 'hidden',
//   },
//   modalHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: '#e0e0e0',
//   },
//   modalTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   closeButton: {
//     padding: 4,
//   },
//   modelList: {
//     maxHeight: 300,
//   },
//   modelItem: {
//     padding: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: '#f0f0f0',
//   },
//   modelItemText: {
//     fontSize: 14,
//     color: '#333',
//   },
//   imageContainer: {
//     marginBottom: 20,
//   },
//   imageLabel: {
//     fontSize: 14,
//     fontWeight: '500',
//     marginBottom: 5,
//     color: '#000',
//   },
//   photoContainer: {
//     alignItems: 'center',
//   },
//   signatureImage: {
//     height: 80,
//     width: 220,
//     resizeMode: 'contain',
//     borderWidth: 1,
//     borderColor: '#ccc'
//   },
//   changePhotoButton: { 
//     backgroundColor: '#7E5EA9', 
//     padding: 8, 
//     borderRadius: 6, 
//     marginTop: 8,
//   },
//   changePhotoText: { 
//     color: 'white', 
//     fontWeight: 'bold', 
//     fontSize: 12 
//   },
//   addPhotoButton: { 
//     backgroundColor: '#20AEBC', 
//     padding: 15, 
//     borderRadius: 6, 
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderStyle: 'dashed'
//   },
//   addPhotoText: { 
//     color: 'white', 
//     fontWeight: 'bold' 
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 10,
//     color: '#000',
//   },
//   // Updated Terms and Conditions Styles to match Form screen
//   termsContainer: {
//     marginBottom: 15,
//     padding: 10,
//     borderRadius: 10,
//     backgroundColor: '#f9f9f9',
//     borderWidth: 1,
//     borderColor: '#e0e0e0',
//   },
//   termsTitle: {
//     fontSize: 14.5,
//     fontWeight: '600',
//     color: '#000',
//     marginBottom: 10,
//   },
//   termsList: {
//     marginBottom: 15,
//   },
//   termItem: {
//     fontSize: 12.5,
//     color: '#333',
//     marginBottom: 5,
//     lineHeight: 16,
//   },
//   checkboxContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 10,
//   },
//   checkbox: {
//     width: 20,
//     height: 20,
//     borderWidth: 1,
//     borderColor: '#666',
//     borderRadius: 4,
//     marginRight: 10,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//   },
//   checkboxChecked: {
//     backgroundColor: '#4CAF50',
//     borderColor: '#4CAF50',
//   },
//   checkboxLabel: {
//     fontSize: 14,
//     fontWeight: '500',
//     color: '#000',
//   },
//   buttonContainer: {
//     marginTop: 20,
//     marginBottom: 30,
//   },
//   editButton: {
//     backgroundColor: '#FFA000',
//     padding: 15,
//     borderRadius: 10,
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   editButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   submitButton: {
//     backgroundColor: '#7E5EA9',
//     padding: 15,
//     borderRadius: 10,
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   submitButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   cancelButton: {
//     backgroundColor: '#6c757d',
//     padding: 15,
//     borderRadius: 10,
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   cancelButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   pdfButton: {
//     backgroundColor: '#4CAF50',
//     padding: 15,
//     borderRadius: 10,
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   pdfButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   homeButton: {
//     backgroundColor: '#20AEBC',
//     padding: 15,
//     borderRadius: 10,
//     alignItems: 'center',
//   },
//   homeButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   disabledButton: {
//     opacity: 0.6,
//   },
// });

// export default Deliveryforminternalpage;













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
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Deliveryforminternalpage = ({navigation, route}) => {
  const insets = useSafeAreaInsets();
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [existingFormId, setExistingFormId] = useState(null);
  const [status, setStatus] = useState('pending');
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  // Form states
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [showDocumentTypeDropdown, setShowDocumentTypeDropdown] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [formData, setFormData] = useState({
    CustomerName: '',
    FathersName: '',
    percentage: '',
    address: '',
    mobileNo: '',
    TractorName: '',
    tractorModel: '',
    date: null,
    YearofManufacture: '',
    tractorName: '',
    engineNo: '',
    DocumentNumber: '',
    documentType: '',
    otherDocumentType: '',
  });

  // Image states
  const [customerSignature, setCustomerSignature] = useState(null);
  const [managerSignature, setManagerSignature] = useState(null);

  const tractorModels = [
    "3028EN","3036EN","3036E","5105","5105 4WD","5050D Gear Pro","5210 Gear Pro",
    "5050D 4WD Gear Pro","5210 4WD Gear Pro","5310 CRDI","5310 4WD CRDI","5405 CRDI",
    "5405 4WD CRDI","5075 2WD","5075 4WD"
  ];

  const documentTypes = [
    "Sale Certificate","Insurance","Tax Invoice","Form 21","E-way Bill","Other"
  ];

  // Helper function to make absolute URLs
  const makeAbsoluteUrl = (relativePath) => {
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
      Alert.alert('Error', 'No form ID provided');
      navigation.goBack();
    }
  }, [route.params]);

  const fetchFormData = async (formId) => {
    try {
      setFetchLoading(true);
      
      const config = {
        method: 'get',
        url: `https://argosmob.uk/makroo/public/api/v1/delivery-forms/${formId}`,
        timeout: 30000,
      };

      const response = await axios(config);
      
      if (response.data.status && response.data.data) {
        const data = response.data.data;
        
        // Set status from backend
        setStatus(data.status || 'pending');
        
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

  const populateFormData = (data) => {
    // Map API fields to form fields
    setFormData({
      CustomerName: data.customer_name || '',
      FathersName: data.father_name || '',
      percentage: '',
      address: data.address || '',
      mobileNo: '',
      TractorName: '',
      tractorModel: '',
      date: data.submitted_at ? new Date(data.submitted_at) : null,
      YearofManufacture: '',
      tractorName: data.tractor_number || '',
      engineNo: data.engine_number || '',
      DocumentNumber: data.document_number || '',
      documentType: data.document_type || '',
      otherDocumentType: '',
    });

    // Load existing images
    if (data.customer_signature) {
      const customerSignatureUri = makeAbsoluteUrl(data.customer_signature);
      setCustomerSignature(customerSignatureUri);
    }
    if (data.manager_signature) {
      const managerSignatureUri = makeAbsoluteUrl(data.manager_signature);
      setManagerSignature(managerSignatureUri);
    }

    // Accept terms for viewing
    setAcceptedTerms(true);
  };

  // Image handling functions
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
        async (buttonIndex) => {
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
        }
      );
    } else {
      Alert.alert(
        title,
        'Choose how you want to capture the image',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Take Photo', 
            onPress: async () => {
              const hasPermission = await requestCameraPermissionForImage();
              if (!hasPermission) {
                Alert.alert('Permission Denied', 'Camera permission is required to take photos.');
                return;
              }
              openCamera(setImageFunction);
            } 
          },
          { 
            text: 'Choose from Gallery', 
            onPress: () => openGallery(setImageFunction) 
          },
        ]
      );
    }
  };

  const openCamera = (setImageFunction) => {
    const options = {
      mediaType: 'photo',
      quality: 0.8,
      maxWidth: 800,
      maxHeight: 800,
      cameraType: 'back',
      saveToPhotos: false,
    };

    launchCamera(options, (response) => {
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

  const openGallery = (setImageFunction) => {
    const options = {
      mediaType: 'photo',
      quality: 0.8,
      maxWidth: 800,
      maxHeight: 800,
    };

    launchImageLibrary(options, (response) => {
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

  const handleModelSelect = (model) => {
    handleInputChange('tractorModel', model);
    setShowModelDropdown(false);
  };

  const handleDocumentTypeSelect = (documentType) => {
    handleInputChange('documentType', documentType);
    setShowDocumentTypeDropdown(false);
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      handleInputChange('date', selectedDate);
    }
  };

  // Edit Mode Handler - Only allow editing when status is 'edited'
  const handleEditPress = () => {
    if (status === 'edited') {
      setIsEditMode(true);
    } else {
      Alert.alert('Cannot Edit', `This form cannot be edited in its current status (${status}).`);
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
      'CustomerName', 'FathersName', 'address', 'tractorName', 'engineNo'
    ];

    for (const field of requiredFields) {
      if (!formData[field] || formData[field].toString().trim() === '') {
        Alert.alert('Validation Error', `Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }

    if (!formData.documentType || formData.documentType.trim() === '') {
      Alert.alert('Validation Error', 'Please select document type');
      return false;
    }

    if (formData.documentType === 'Other' && (!formData.otherDocumentType || formData.otherDocumentType.trim() === '')) {
      Alert.alert('Validation Error', 'Please enter document type details for Other');
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

    if (!acceptedTerms) {
      Alert.alert('Validation Error', 'Please accept all terms and conditions');
      return false;
    }

    return true;
  };

  const prepareFormData = () => {
    const formDataToSend = new FormData();

    formDataToSend.append('id', existingFormId.toString());
    formDataToSend.append('user_id', userId);
    formDataToSend.append('customer_name', formData.CustomerName);
    formDataToSend.append('father_name', formData.FathersName);
    formDataToSend.append('address', formData.address);
    formDataToSend.append('tractor_number', formData.tractorName);
    formDataToSend.append('engine_number', formData.engineNo);

    const docType = formData.documentType === 'Other'
      ? (formData.otherDocumentType || '').trim()
      : (formData.documentType || '').trim();
    formDataToSend.append('document_type', docType);
    formDataToSend.append('document_number', formData.DocumentNumber);

    // "YYYY-MM-DD HH:mm:ss"
    const now = new Date();
    const submittedAt =
      `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')} ` +
      `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`;
    formDataToSend.append('submitted_at', submittedAt);

    // CRITICAL FIX: Add status field to change from "edited" to "pending"
    formDataToSend.append('status', 'pending');

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

    console.log('Sending form data with status:', 'pending');
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
        url: 'https://argosmob.uk/makroo/public/api/v1/delivery-forms/update',
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json',
        },
        data: formDataToSend,
        timeout: 60000, // Increased timeout
      };

      console.log('Making update API call...');
      const response = await axios(config);
      console.log('Update API response:', response.data);

      // Check for success based on API response structure
      if (response.data && response.data.status === "success") {
        // CRITICAL FIX: Force status change to 'pending' immediately
        setStatus('pending');
        setIsEditMode(false);
        
        Alert.alert(
          'Success', 
          'Form updated successfully! Form is now pending approval.',
          [
            {
              text: 'OK',
              onPress: () => {
                // Refresh data to get latest from server
                fetchFormData(existingFormId);
              }
            }
          ]
        );
      } else {
        const errorMessage = response.data?.message || 'Failed to update form';
        Alert.alert('Update Failed', errorMessage);
      }

    } catch (error) {
      console.log('Update Error:', error);
      let errorMessage = 'Something went wrong. Please try again.';
      
      if (error.response) {
        console.log('Error response data:', error.response.data);
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
        url: `https://argosmob.uk/makroo/public/api/v1/delivery-forms/form/generate-pdf/${existingFormId}`,
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

  const handleDateIconPress = () => {
    if (!isEditMode) return;
    setShowDatePicker(true);
  };

  const renderModelItem = ({item}) => (
    <TouchableOpacity
      style={styles.modelItem}
      onPress={() => handleModelSelect(item)}>
      <Text style={styles.modelItemText}>{item}</Text>
    </TouchableOpacity>
  );

  const renderDocumentTypeItem = ({item}) => (
    <TouchableOpacity
      style={styles.modelItem}
      onPress={() => handleDocumentTypeSelect(item)}>
      <Text style={styles.modelItemText}>{item}</Text>
    </TouchableOpacity>
  );

  const renderInputField = (value, onChange, placeholder, keyboardType = 'default', editable = true) => {
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
          disabled={loading}
        >
          <Text style={value ? styles.selectedModelText : styles.placeholderText}>
            {value || placeholder}
          </Text>
          <Icon name="keyboard-arrow-down" size={25} color="#666" style={styles.dropdownIcon} />
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
            disabled={loading}
          >
            <Text style={date ? styles.selectedModelText : styles.placeholderText}>
              {date ? date.toLocaleDateString() : placeholder}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onPress}
            style={styles.iconButton}
            disabled={loading}
          >
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

  const renderImageBox = (imageUri, setImageFunction, label) => (
    <View style={styles.imageContainer}>
      <Text style={styles.imageLabel}>{label}</Text>
      {imageUri ? (
        <View style={styles.photoContainer}>
          <Image source={{ uri: imageUri }} style={styles.signatureImage} />
          {isEditMode && (
            <TouchableOpacity 
              style={styles.changePhotoButton} 
              onPress={() => showImageSourceOptions(setImageFunction, `Update ${label}`)}
            >
              <Text style={styles.changePhotoText}>Change {label}</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        isEditMode && (
          <View style={styles.photoContainer}>
            <TouchableOpacity 
              style={styles.addPhotoButton} 
              onPress={() => showImageSourceOptions(setImageFunction, `Add ${label}`)}
            >
              <Text style={styles.addPhotoText}>Add {label}</Text>
            </TouchableOpacity>
          </View>
        )
      )}
    </View>
  );

  // Check if form can be edited based on status
  const canEditForm = status === 'edited';
  
  // Check if PDF download should be shown
  const showPDFButton = status === 'approved';

  if (fetchLoading) {
    return (
      <View style={{flex: 1, paddingTop: insets.top, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#7E5EA9" />
        <Text style={{marginTop: 10}}>Loading form data...</Text>
      </View>
    );
  }

  return (
    <View style={{flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom}}>
      <LinearGradient
        colors={['#7E5EA9', '#20AEBC']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.companyName}>Makroo Motor Corporation</Text>
          <Text style={styles.companyName}>Delivery Form</Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.container}>
        <View style={styles.formHeader}>
          <Text style={styles.Date}>{new Date().toLocaleDateString()}</Text>
        </View>

        {isEditMode && (
          <View style={styles.editModeContainer}>
            <Text style={styles.editModeText}>Edit Mode - Updating Form ID: {existingFormId}</Text>
          </View>
        )}

        <View style={styles.customerHeader}>
          <Text style={styles.customerName}>{formData.CustomerName || '—'}</Text>
          <Text style={[styles.statusText, 
            status === 'approved' ? styles.statusApproved :
            status === 'pending' ? styles.statusPending :
            status === 'rejected' ? styles.statusRejected :
            status === 'edited' ? styles.statusEdited :
            styles.statusDefault
          ]}>
            Status: {status ? status.toUpperCase() : '—'}
          </Text>
        </View>

        <View style={styles.formContainer}>
          {/* Customer Name */}
          <View style={styles.singleRow}>
            <Text style={styles.fieldLabel}>Customer Name</Text>
            <View style={styles.fullWidthContainer}>
              <LinearGradient
                colors={['#7E5EA9', '#20AEBC']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={styles.inputGradient}>
                {renderInputField(
                  formData.CustomerName,
                  (text) => handleInputChange('CustomerName', text),
                  'Enter customer name'
                )}
              </LinearGradient>
            </View>
          </View>

          {/* Father's Name */}
          <View style={styles.singleRow}>
            <Text style={styles.fieldLabel}>Father's Name</Text>
            <View style={styles.fullWidthContainer}>
              <LinearGradient
                colors={['#7E5EA9', '#20AEBC']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={styles.inputGradient}>
                {renderInputField(
                  formData.FathersName,
                  (text) => handleInputChange('FathersName', text),
                  'Enter father\'s name'
                )}
              </LinearGradient>
            </View>
          </View>

          {/* Address */}
          <View style={styles.singleRow}>
            <Text style={styles.fieldLabel}>Address</Text>
            <View style={styles.fullWidthContainer}>
              <LinearGradient
                colors={['#7E5EA9', '#20AEBC']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={styles.inputGradient}>
                {renderInputField(
                  formData.address,
                  (text) => handleInputChange('address', text),
                  'Enter address',
                  'default',
                  true
                )}
              </LinearGradient>
            </View>
          </View>

          {/* Tractor Name */}
          <View style={styles.singleRow}>
            <Text style={styles.fieldLabel}>Tractor Name</Text>
            <View style={styles.fullWidthContainer}>
              <LinearGradient
                colors={['#7E5EA9', '#20AEBC']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={styles.inputGradient}>
                {renderInputField(
                  formData.tractorName,
                  (text) => handleInputChange('tractorName', text),
                  'Enter tractor name'
                )}
              </LinearGradient>
            </View>
          </View>

          {/* Engine Number */}
          <View style={styles.singleRow}>
            <Text style={styles.fieldLabel}>Engine Number</Text>
            <View style={styles.fullWidthContainer}>
              <LinearGradient
                colors={['#7E5EA9', '#20AEBC']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={styles.inputGradient}>
                {renderInputField(
                  formData.engineNo,
                  (text) => handleInputChange('engineNo', text),
                  'Enter engine number'
                )}
              </LinearGradient>
            </View>
          </View>

          {/* Document Type */}
          <View style={styles.singleRow}>
            <Text style={styles.fieldLabel}>Document Type</Text>
            <View style={styles.fullWidthContainer}>
              <LinearGradient
                colors={['#7E5EA9', '#20AEBC']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={styles.inputGradient}>
                {renderDropdownField(
                  formData.documentType,
                  () => setShowDocumentTypeDropdown(true),
                  'Select document type'
                )}
              </LinearGradient>

              {formData.documentType === 'Other' && (
                <View style={{marginTop: 8}}>
                  <Text style={styles.fieldLabel}>Document Type Details</Text>
                  <LinearGradient
                    colors={['#7E5EA9', '#20AEBC']}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 0}}
                    style={styles.inputGradient}>
                    {renderInputField(
                      formData.otherDocumentType,
                      (text) => handleInputChange('otherDocumentType', text),
                      'Enter document type details'
                    )}
                  </LinearGradient>
                </View>
              )}
            </View>
          </View>

          {/* Document Number */}
          <View style={styles.singleRow}>
            <Text style={styles.fieldLabel}>Document Number</Text>
            <View style={styles.fullWidthContainer}>
              <LinearGradient
                colors={['#7E5EA9', '#20AEBC']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={styles.inputGradient}>
                {renderInputField(
                  formData.DocumentNumber,
                  (text) => handleInputChange('DocumentNumber', text),
                  'Enter document number'
                )}
              </LinearGradient>
            </View>
          </View>
        </View>

        {/* Tractor Model Dropdown Modal */}
        <Modal
          visible={showModelDropdown}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowModelDropdown(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Tractor Model</Text>
                <TouchableOpacity 
                  onPress={() => setShowModelDropdown(false)}
                  style={styles.closeButton}
                >
                  <Icon name="close" size={24} color="#000" />
                </TouchableOpacity>
              </View>
              <FlatList
                data={tractorModels}
                renderItem={renderModelItem}
                keyExtractor={(item, index) => index.toString()}
                style={styles.modelList}
                showsVerticalScrollIndicator={true}
              />
            </View>
          </View>
        </Modal>

        {/* Document Type Dropdown Modal */}
        <Modal
          visible={showDocumentTypeDropdown}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowDocumentTypeDropdown(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Document Type</Text>
                <TouchableOpacity 
                  onPress={() => setShowDocumentTypeDropdown(false)}
                  style={styles.closeButton}
                >
                  <Icon name="close" size={24} color="#000" />
                </TouchableOpacity>
              </View>
              <FlatList
                data={documentTypes}
                renderItem={renderDocumentTypeItem}
                keyExtractor={(item, index) => index.toString()}
                style={styles.modelList}
                showsVerticalScrollIndicator={true}
              />
            </View>
          </View>
        </Modal>

        {/* Signatures Section */}
        <View style={{ marginTop: 20 }}>
          <Text style={styles.sectionTitle}>Signatures</Text>
          
          {renderImageBox(customerSignature, setCustomerSignature, 'Customer Signature')}
          {renderImageBox(managerSignature, setManagerSignature, 'Manager Signature')}
        </View>

        {/* Terms and Conditions Section */}
        <View style={styles.termsContainer}>
          <Text style={styles.termsTitle}>Terms and Conditions:</Text>
          <View style={styles.termsList}>
            <Text style={styles.termItem}>1. The Tractor Will Be Delivered Only After Full Payment Clearance.</Text>
            <Text style={styles.termItem}>2. Customer Must Provide Valid Id Proof Before Receiving The Tractor.</Text>
            <Text style={styles.termItem}>3. Delivery To Branch Staff Requires Prior Written Authorization From The Head Office.</Text>
            <Text style={styles.termItem}>4. Branch Personnel Must Verify All Customer Details Before Handover.</Text>
            <Text style={styles.termItem}>5. Once Delivered, Makroo Motor Corporation Will Not Be Responsible For Loss Or Damage.</Text>
            <Text style={styles.termItem}>6. Any Correction Or Reissue Request Must Be Submitted In Writing With Valid Reason.</Text>
            <Text style={styles.termItem}>7. Tractor Will Not Be Handed Over To Any Unauthorized Person.</Text>
            <Text style={styles.termItem}>8. Customer Or Branch Representative Must Sign And Acknowledge Receipt At The Time Of Delivery.</Text>
            <Text style={styles.termItem}>9. All Records Of Delivery Must Be Updated In The Company Database The Same Day.</Text>
            <Text style={styles.termItem}>10. Duplicate Delivery Is Not Allowed Without Written Approval From The Head Office.</Text>
            <Text style={styles.termItem}>11. If The Customer Fails To Collect The Tractor Within 30 Days, Storage Or Courier Charges May Apply.</Text>
            <Text style={styles.termItem}>12. In Case Of Dispute, The Decision Of Makroo Motor Corporation Management Will Be Final.</Text>
          </View>

          {/* Checkbox for accepting terms */}
          <TouchableOpacity 
            style={styles.checkboxContainer}
            onPress={() => isEditMode && setAcceptedTerms(!acceptedTerms)}
            disabled={!isEditMode || loading}
          >
            <View style={[styles.checkbox, acceptedTerms && styles.checkboxChecked]}>
              {acceptedTerms && <Icon name="check" size={16} color="#fff" />}
            </View>
            <Text style={styles.checkboxLabel}>Accept All Terms And Conditions</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonContainer}>
          {/* Edit Button - Only show when status is 'edited' */}
          {canEditForm && !isEditMode && (
            <TouchableOpacity style={styles.editButton} onPress={handleEditPress}>
              <Text style={styles.editButtonText}>Edit Form</Text>
            </TouchableOpacity>
          )}

          {isEditMode && (
            <>
              <TouchableOpacity 
                style={[styles.submitButton, (loading || !acceptedTerms) && styles.disabledButton]} 
                onPress={handleUpdate}
                disabled={loading || !acceptedTerms}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.submitButtonText}>Update Form</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.cancelButton, loading && styles.disabledButton]} 
                onPress={handleCancelEdit}
                disabled={loading}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </>
          )}

          {/* PDF Button - Only show when status is 'approved' */}
          {showPDFButton && (
            <TouchableOpacity 
              style={[styles.pdfButton, loading && styles.disabledButton]} 
              onPress={handleDownloadPDF}
              disabled={loading}
            >
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
            disabled={loading}
          >
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
  customerHeader: {
    alignItems: 'center',
    marginVertical: 10,
    marginBottom: 10,
  },
  customerName: {
    fontSize: 20,
    color: '#000',
    fontWeight: 'bold',
    marginBottom: 30,
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
    marginBottom: 20,
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
  formContainer: {
    marginBottom: 15,
  },
  singleRow: {
    marginBottom: 10,
  },
  fullWidthContainer: {
    width: '100%',
    marginBottom: 10,
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
  imageContainer: {
    marginBottom: 20,
  },
  imageLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 5,
    color: '#000',
  },
  photoContainer: {
    alignItems: 'center',
  },
  signatureImage: {
    height: 80,
    width: 220,
    resizeMode: 'contain',
    borderWidth: 1,
    borderColor: '#ccc'
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
    fontSize: 12 
  },
  addPhotoButton: { 
    backgroundColor: '#20AEBC', 
    padding: 15, 
    borderRadius: 6, 
    borderWidth: 1,
    borderColor: '#ccc',
    borderStyle: 'dashed'
  },
  addPhotoText: { 
    color: 'white', 
    fontWeight: 'bold' 
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
  },
  termsContainer: {
    marginBottom: 15,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  termsTitle: {
    fontSize: 14.5,
    fontWeight: '600',
    color: '#000',
    marginBottom: 10,
  },
  termsList: {
    marginBottom: 15,
  },
  termItem: {
    fontSize: 12.5,
    color: '#333',
    marginBottom: 5,
    lineHeight: 16,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#666',
    borderRadius: 4,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  checkboxChecked: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  checkboxLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
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

export default Deliveryforminternalpage;