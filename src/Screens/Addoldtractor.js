// import React, {useState, useCallback, useEffect} from 'react';
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
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import axios from 'axios';
// import DateTimePicker from '@react-native-community/datetimepicker';

// const STOCK_OPTIONS = ['sell', 'stock'];

// const Addoldtractor = ({navigation, route}) => {
//   const insets = useSafeAreaInsets();
//   const editData = route.params?.editData;

//   const [showStockDropdown, setShowStockDropdown] = useState(false);
//   const [submitting, setSubmitting] = useState(false);
//   const [showDatePicker, setShowDatePicker] = useState(false);
//   const [selectedDate, setSelectedDate] = useState(new Date());

//   const [formData, setFormData] = useState({
//     enter_by: '',
//     entry_date: '',
//     ledger_no: '',
//     customer_name: '',
//     father_name: '',
//     address: '',
//     mobile_no: '',
//     tractor_model: '',
//     chassis_no: '',
//     year_of_manufacture: '',
//     deal_price: '',
//     selling_price: '',
//     stock: '',
//     payment_received: '',
//     balance_payment: '',
//   });

//   // Image state
//   const [picture, setPicture] = useState(null);
//   const [pictureChanged, setPictureChanged] = useState(false);
//   const [existingPictureUrl, setExistingPictureUrl] = useState(null);

//   // Calculate balance payment whenever selling price or payment received changes
//   useEffect(() => {
//     const calculateBalance = () => {
//       const sellingPrice = parseFloat(formData.selling_price) || 0;
//       const paymentReceived = parseFloat(formData.payment_received) || 0;
//       const balance = sellingPrice - paymentReceived;

//       setFormData(prev => ({
//         ...prev,
//         balance_payment: balance >= 0 ? balance.toString() : '0'
//       }));
//     };

//     calculateBalance();
//   }, [formData.selling_price, formData.payment_received]);

//   // Initialize form data when editData changes
//   useEffect(() => {
//     if (editData) {
//       console.log('Edit Data Received:', editData);

//       // Calculate balance for edit mode
//       const sellingPrice = parseFloat(editData?.sell_price) || 0;
//       const paymentReceived = parseFloat(editData?.payment_received) || 0;
//       const balance = sellingPrice - paymentReceived;

//       // Set form data with proper fallbacks
//       setFormData({
//         enter_by: editData?.entry_by || '',
//         entry_date: editData?.entry_date || '',
//         ledger_no: editData?.ledger_no || '',
//         customer_name: editData?.customer_name || '',
//         father_name: editData?.father_name || '',
//         address: editData?.customer_address || '',
//         mobile_no: editData?.mobile_number || '',
//         tractor_model: editData?.tractor_model || '',
//         chassis_no: editData?.chassis_no || '',
//         year_of_manufacture: editData?.year_of_manufacture || '',
//         deal_price: editData?.deal_price?.toString() || '',
//         selling_price: editData?.sell_price?.toString() || '',
//         stock: editData?.stock_type || '',
//         payment_received: editData?.payment_received?.toString() || '',
//         balance_payment: balance >= 0 ? balance.toString() : (editData?.balance_payment?.toString() || '0'),
//       });

//       // Handle existing picture
//       if (editData?.picture) {
//         const pictureUrl = editData.picture.startsWith('http')
//           ? editData.picture
//           : `https://argosmob.uk/makroo/public/${editData.picture.replace(/^\/+/, '')}`;

//         console.log('Setting existing picture URL:', pictureUrl);
//         setExistingPictureUrl(pictureUrl);
//       }

//       // Set date if available
//       if (editData?.entry_date) {
//         const dateParts = editData.entry_date.split('-');
//         if (dateParts.length === 3) {
//           const year = parseInt(dateParts[0]);
//           const month = parseInt(dateParts[1]) - 1; // Months are 0-indexed
//           const day = parseInt(dateParts[2]);
//           setSelectedDate(new Date(year, month, day));
//         }
//       }
//     }
//   }, [editData]);

//   // ===== Date Picker Functions =====
//   const handleDateChange = (event, date) => {
//     setShowDatePicker(false);
//     if (date) {
//       setSelectedDate(date);
//       // Format date as YYYY-MM-DD for API
//       const year = date.getFullYear();
//       const month = String(date.getMonth() + 1).padStart(2, '0');
//       const day = String(date.getDate()).padStart(2, '0');
//       const formattedDate = `${year}-${month}-${day}`;
//       handleInputChange('entry_date', formattedDate);
//     }
//   };

//   const showDatePickerModal = () => {
//     setShowDatePicker(true);
//   };

//   // ===== Helpers =====
//   const requestCameraPermission = async () => {
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
//             const hasPermission = await requestCameraPermission();
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
//               const hasPermission = await requestCameraPermission();
//               if (hasPermission) handleCamera(setImageFunction);
//             },
//           },
//           {text: 'Choose from Library', onPress: () => handleImageLibrary(setImageFunction)},
//         ],
//         {cancelable: true},
//       );
//     }
//   };

//   const handleCamera = setImageFunction => {
//     launchCamera(
//       {mediaType: 'photo', quality: 0.8, cameraType: 'back', saveToPhotos: true},
//       response => {
//         if (response?.didCancel) return;
//         if (response?.error) {
//           Alert.alert('Error', 'Failed to take photo');
//           return;
//         }
//         if (response?.assets && response.assets.length > 0) {
//           setImageFunction(response.assets[0]);
//           setPictureChanged(true);
//           setExistingPictureUrl(null); // Clear existing URL when new picture is taken
//         }
//       },
//     );
//   };

//   const handleImageLibrary = setImageFunction => {
//     launchImageLibrary({mediaType: 'photo', quality: 0.8}, response => {
//       if (response?.didCancel) return;
//       if (response?.error) {
//         Alert.alert('Error', 'Failed to select image');
//         return;
//       }
//       if (response?.assets && response.assets.length > 0) {
//         setImageFunction(response.assets[0]);
//         setPictureChanged(true);
//         setExistingPictureUrl(null); // Clear existing URL when new picture is selected
//       }
//     });
//   };

//   const handleInputChange = (field, value) => {
//     setFormData(prev => ({...prev, [field]: value}));
//   };

//   const handleStockSelect = stockOption => {
//     handleInputChange('stock', stockOption);
//     setShowStockDropdown(false);
//   };

//   const validate = () => {
//     const requiredFields = [
//       'enter_by', 'entry_date', 'ledger_no', 'customer_name', 'father_name', 'address',
//       'mobile_no', 'tractor_model', 'chassis_no', 'year_of_manufacture', 'deal_price',
//       'selling_price', 'stock', 'payment_received'
//     ];

//     for (const field of requiredFields) {
//       if (!formData[field]?.trim()) {
//         const fieldName = field.replace(/_/g, ' ');
//         return `Please enter ${fieldName}.`;
//       }
//     }

//     if (!/^\d{10}$/.test(formData.mobile_no.trim())) {
//       return 'Mobile number must be 10 digits.';
//     }

//     if (!/^\d{4}$/.test(formData.year_of_manufacture.trim())) {
//       return 'Year of Manufacture must be a 4-digit number.';
//     }

//     // Validate that payment received is not greater than selling price
//     const sellingPrice = parseFloat(formData.selling_price) || 0;
//     const paymentReceived = parseFloat(formData.payment_received) || 0;

//     if (paymentReceived > sellingPrice) {
//       return 'Payment received cannot be greater than selling price.';
//     }

//     if (!editData && !picture && !existingPictureUrl) {
//       return 'Please add a tractor picture.';
//     }

//     return null;
//   };

//   const pingHost = async () => {
//     try {
//       const res = await fetch('https://argosmob.uk/', {method: 'GET'});
//       return {ok: res.ok, status: res.status};
//     } catch (e) {
//       return {ok: false, status: 0, error: String(e)};
//     }
//   };

//   // ===== Submit =====
//   const handleSubmit = useCallback(async () => {
//     const error = validate();
//     if (error) {
//       Alert.alert('Validation', error);
//       return;
//     }

//     setSubmitting(true);
//     try {
//       // 1) Quick connectivity check
//       const ping = await pingHost();
//       if (!ping.ok) {
//         console.log('Ping host failed:', ping);
//         Alert.alert(
//           'Network',
//           `Cannot reach argosmob.uk (status: ${ping.status}). Check internet connection.`,
//         );
//         return;
//       }

//       // 2) Build multipart payload
//       const userId = await AsyncStorage.getItem('userId');
//       if (!userId) {
//         Alert.alert('Error', 'No userId found in storage.');
//         return;
//       }

//       const body = new FormData();
//       body.append('user_id', String(userId));
//       body.append('entry_by', formData.enter_by.trim());
//       body.append('entry_date', formData.entry_date.trim());
//       body.append('ledger_no', formData.ledger_no.trim());
//       body.append('customer_name', formData.customer_name.trim());
//       body.append('father_name', formData.father_name.trim());
//       body.append('customer_address', formData.address.trim());
//       body.append('mobile_number', formData.mobile_no.trim());
//       body.append('tractor_model', formData.tractor_model.trim());
//       body.append('chassis_no', formData.chassis_no.trim());
//       body.append('year_of_manufacture', formData.year_of_manufacture.trim());
//       body.append('deal_price', formData.deal_price.trim());
//       body.append('sell_price', formData.selling_price.trim());
//       body.append('stock_type', formData.stock.trim());
//       body.append('payment_received', formData.payment_received.trim());
//       body.append('balance_payment', formData.balance_payment.trim());

//       // Add picture if available (for new record or when changed in edit)
//       if (picture && (!editData || pictureChanged)) {
//         const imagePart = {
//           uri: picture.uri,
//           name: picture.fileName || `tractor_${Date.now()}.jpg`,
//           type: picture.type || 'image/jpeg',
//         };
//         body.append('picture', imagePart);
//       }

//       // For update, include the ID
//       if (editData) {
//         body.append('id', editData.id.toString());
//       }

//       console.log('Submitting form data:', {
//         editMode: !!editData,
//         picture: !!picture,
//         pictureChanged,
//         existingPictureUrl: !!existingPictureUrl,
//         balance_payment: formData.balance_payment
//       });

//       // 3) API call with axios
//       const endpoint = editData
//         ? 'https://argosmob.uk/makroo/public/api/v1/tractor-deals/form/update'
//         : 'https://argosmob.uk/makroo/public/api/v1/tractor-deals/form/save';

//       try {
//         const res = await axios.post(endpoint, body, {
//           headers: {
//             'Accept': 'application/json',
//             'Content-Type': 'multipart/form-data',
//           },
//           timeout: 30000,
//         });

//         console.log('AXIOS success:', res.status, res.data);

//         if (res.data && res.data.success) {
//           Alert.alert('Success', editData ? 'Record updated successfully!' : 'Record submitted successfully!');

//           // Reset form if not in edit mode
//           if (!editData) {
//             setFormData({
//               enter_by: '',
//               entry_date: '',
//               ledger_no: '',
//               customer_name: '',
//               father_name: '',
//               address: '',
//               mobile_no: '',
//               tractor_model: '',
//               chassis_no: '',
//               year_of_manufacture: '',
//               deal_price: '',
//               selling_price: '',
//               stock: '',
//               payment_received: '',
//               balance_payment: '',
//             });
//             setPicture(null);
//             setExistingPictureUrl(null);
//           }

//           // Navigate to details screen
//           navigation.navigate('Oldtractordetails');
//         } else {
//           Alert.alert('Error', res.data.message || 'Submission failed');
//         }
//       } catch (err) {
//         console.log('AXIOS ERROR:', err?.response?.status, err?.response?.data);
//         Alert.alert('Error', `Upload failed: ${err.message}`);
//       }
//     } finally {
//       setSubmitting(false);
//     }
//   }, [formData, picture, editData, pictureChanged, existingPictureUrl, navigation]);

//   // ===== UI bits =====
//   const renderStockItem = ({item}) => (
//     <TouchableOpacity style={styles.modelItem} onPress={() => handleStockSelect(item)}>
//       <Text style={styles.modelItemText}>{item}</Text>
//     </TouchableOpacity>
//   );

//   // Function to get placeholder text based on field and whether data exists
//   const getPlaceholderText = (field, value) => {
//     const placeholders = {
//       enter_by: 'Enter By',
//       entry_date: 'Entry Date (YYYY-MM-DD)',
//       ledger_no: 'Ledger No.',
//       customer_name: 'Customer Name',
//       father_name: 'Father\'s Name',
//       address: 'Address',
//       mobile_no: 'Mobile No.',
//       tractor_model: 'Tractor Model',
//       chassis_no: 'Chassis No',
//       year_of_manufacture: 'Year of Manufacture',
//       deal_price: 'Deal Price',
//       selling_price: 'Selling Price',
//       stock: 'Select Stock',
//       payment_received: 'Payment Received',
//       balance_payment: 'Balance Payment (Auto-calculated)',
//     };

//     return value ? '' : placeholders[field];
//   };

//   // Format currency display
//   const formatCurrency = (value) => {
//     if (!value) return '0';
//     const num = parseFloat(value);
//     return isNaN(num) ? '0' : num.toLocaleString('en-IN', {
//       maximumFractionDigits: 2,
//       minimumFractionDigits: 2
//     });
//   };

//   return (
//     <View style={{flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom}}>
//       {/* Header with Gradient */}
//       <LinearGradient
//         colors={['#7E5EA9', '#20AEBC']}
//         start={{x: 0, y: 0}}
//         end={{x: 1, y: 0}}
//         style={styles.header}>
//         <View style={styles.headerContent}>
//           {/* Left Side: Menu Icon */}
//           <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
//             <Icon name="arrow-back" size={25} color="#fff" />
//           </TouchableOpacity>

//           {/* Center: Dashboard Text */}
//           <View style={{flex: 1, alignItems: 'center'}}>
//             <Text style={styles.companyName}>Makroo Motor Corp.</Text>
//             <Text style={styles.companyName1}>
//               {editData ? 'Edit Old Tractor' : 'Add Old Tractor'}
//             </Text>
//           </View>

//           {/* Right side placeholder for alignment */}
//           <View style={styles.iconButton} />
//         </View>
//       </LinearGradient>

//       <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
//         {/* Form Fields */}
//         <View style={styles.formContainer}>
//           {/* Row 1: Enter By */}
//           <View style={styles.row}>
//             <View style={styles.fullWidthInputContainer}>
//               <Text style={styles.fieldLabel}>Enter By</Text>
//               <LinearGradient colors={['#7E5EA9', '#20AEBC']} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={styles.inputGradient}>
//                 <TextInput
//                   style={styles.input}
//                   value={formData.enter_by}
//                   onChangeText={text => handleInputChange('enter_by', text)}
//                   placeholder={getPlaceholderText('enter_by', formData.enter_by)}
//                   placeholderTextColor="#666"
//                   autoCapitalize="words"
//                 />
//               </LinearGradient>
//             </View>
//           </View>

//           {/* Row 2: Entry Date */}
//           <View style={styles.row}>
//             <View style={styles.fullWidthInputContainer}>
//               <Text style={styles.fieldLabel}>Entry Date</Text>
//               <LinearGradient colors={['#7E5EA9', '#20AEBC']} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={styles.inputGradient}>
//                 <TouchableOpacity style={styles.input} onPress={showDatePickerModal}>
//                   <Text style={formData.entry_date ? styles.selectedModelText : styles.placeholderText}>
//                     {formData.entry_date || 'Entry Date (YYYY-MM-DD)'}
//                   </Text>
//                   <Icon name="calendar-today" size={20} color="#666" />
//                 </TouchableOpacity>
//               </LinearGradient>
//             </View>
//           </View>

//           {/* Row 3: Ledger No. */}
//           <View style={styles.row}>
//             <View style={styles.fullWidthInputContainer}>
//               <Text style={styles.fieldLabel}>Ledger No.</Text>
//               <LinearGradient colors={['#7E5EA9', '#20AEBC']} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={styles.inputGradient}>
//                 <TextInput
//                   style={styles.input}
//                   value={formData.ledger_no}
//                   onChangeText={text => handleInputChange('ledger_no', text)}
//                   placeholder={getPlaceholderText('ledger_no', formData.ledger_no)}
//                   placeholderTextColor="#666"
//                 />
//               </LinearGradient>
//             </View>
//           </View>

//           {/* Row 4: Customer Name */}
//           <View style={styles.row}>
//             <View style={styles.fullWidthInputContainer}>
//               <Text style={styles.fieldLabel}>Customer Name</Text>
//               <LinearGradient colors={['#7E5EA9', '#20AEBC']} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={styles.inputGradient}>
//                 <TextInput
//                   style={styles.input}
//                   value={formData.customer_name}
//                   onChangeText={text => handleInputChange('customer_name', text)}
//                   placeholder={getPlaceholderText('customer_name', formData.customer_name)}
//                   placeholderTextColor="#666"
//                   autoCapitalize="words"
//                 />
//               </LinearGradient>
//             </View>
//           </View>

//           {/* Row 5: Father's Name */}
//           <View style={styles.row}>
//             <View style={styles.fullWidthInputContainer}>
//               <Text style={styles.fieldLabel}>Father's Name</Text>
//               <LinearGradient colors={['#7E5EA9', '#20AEBC']} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={styles.inputGradient}>
//                 <TextInput
//                   style={styles.input}
//                   value={formData.father_name}
//                   onChangeText={text => handleInputChange('father_name', text)}
//                   placeholder={getPlaceholderText('father_name', formData.father_name)}
//                   placeholderTextColor="#666"
//                   autoCapitalize="words"
//                 />
//               </LinearGradient>
//             </View>
//           </View>

//           {/* Row 6: Address */}
//           <View style={styles.row}>
//             <View style={styles.fullWidthInputContainer}>
//               <Text style={styles.fieldLabel}>Address</Text>
//               <LinearGradient colors={['#7E5EA9', '#20AEBC']} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={styles.inputGradient}>
//                 <TextInput
//                   style={[styles.input, styles.multilineInput]}
//                   value={formData.address}
//                   onChangeText={text => handleInputChange('address', text)}
//                   placeholder={getPlaceholderText('address', formData.address)}
//                   placeholderTextColor="#666"
//                   multiline
//                   numberOfLines={3}
//                 />
//               </LinearGradient>
//             </View>
//           </View>

//           {/* Row 7: Mobile No. */}
//           <View style={styles.row}>
//             <View style={styles.fullWidthInputContainer}>
//               <Text style={styles.fieldLabel}>Mobile No.</Text>
//               <LinearGradient colors={['#7E5EA9', '#20AEBC']} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={styles.inputGradient}>
//                 <TextInput
//                   style={styles.input}
//                   value={formData.mobile_no}
//                   onChangeText={text => handleInputChange('mobile_no', text)}
//                   placeholder={getPlaceholderText('mobile_no', formData.mobile_no)}
//                   placeholderTextColor="#666"
//                   keyboardType="phone-pad"
//                   maxLength={10}
//                 />
//               </LinearGradient>
//             </View>
//           </View>

//           {/* Row 8: Tractor Model */}
//           <View style={styles.row}>
//             <View style={styles.fullWidthInputContainer}>
//               <Text style={styles.fieldLabel}>Tractor Model</Text>
//               <LinearGradient colors={['#7E5EA9', '#20AEBC']} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={styles.inputGradient}>
//                 <TextInput
//                   style={styles.input}
//                   value={formData.tractor_model}
//                   onChangeText={text => handleInputChange('tractor_model', text)}
//                   placeholder={getPlaceholderText('tractor_model', formData.tractor_model)}
//                   placeholderTextColor="#666"
//                 />
//               </LinearGradient>
//             </View>
//           </View>

//           {/* Row 9: Chassis No */}
//           <View style={styles.row}>
//             <View style={styles.fullWidthInputContainer}>
//               <Text style={styles.fieldLabel}>Chassis No</Text>
//               <LinearGradient colors={['#7E5EA9', '#20AEBC']} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={styles.inputGradient}>
//                 <TextInput
//                   style={styles.input}
//                   value={formData.chassis_no}
//                   onChangeText={text => handleInputChange('chassis_no', text)}
//                   placeholder={getPlaceholderText('chassis_no', formData.chassis_no)}
//                   placeholderTextColor="#666"
//                 />
//               </LinearGradient>
//             </View>
//           </View>

//           {/* Row 10: Year of Manufacture */}
//           <View style={styles.row}>
//             <View style={styles.fullWidthInputContainer}>
//               <Text style={styles.fieldLabel}>Year of Manufacture</Text>
//               <LinearGradient colors={['#7E5EA9', '#20AEBC']} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={styles.inputGradient}>
//                 <TextInput
//                   style={styles.input}
//                   value={formData.year_of_manufacture}
//                   onChangeText={text => handleInputChange('year_of_manufacture', text)}
//                   placeholder={getPlaceholderText('year_of_manufacture', formData.year_of_manufacture)}
//                   placeholderTextColor="#666"
//                   keyboardType="number-pad"
//                   maxLength={4}
//                 />
//               </LinearGradient>
//             </View>
//           </View>

//           {/* Row 11: Deal Price */}
//           <View style={styles.row}>
//             <View style={styles.fullWidthInputContainer}>
//               <Text style={styles.fieldLabel}>Deal Price</Text>
//               <LinearGradient colors={['#7E5EA9', '#20AEBC']} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={styles.inputGradient}>
//                 <TextInput
//                   style={styles.input}
//                   value={formData.deal_price}
//                   onChangeText={text => handleInputChange('deal_price', text)}
//                   placeholder={getPlaceholderText('deal_price', formData.deal_price)}
//                   placeholderTextColor="#666"
//                   keyboardType="decimal-pad"
//                 />
//               </LinearGradient>
//             </View>
//           </View>

//           {/* Row 12: Selling Price */}
//           <View style={styles.row}>
//             <View style={styles.fullWidthInputContainer}>
//               <Text style={styles.fieldLabel}>Selling Price</Text>
//               <LinearGradient colors={['#7E5EA9', '#20AEBC']} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={styles.inputGradient}>
//                 <TextInput
//                   style={styles.input}
//                   value={formData.selling_price}
//                   onChangeText={text => handleInputChange('selling_price', text)}
//                   placeholder={getPlaceholderText('selling_price', formData.selling_price)}
//                   placeholderTextColor="#666"
//                   keyboardType="decimal-pad"
//                 />
//               </LinearGradient>
//             </View>
//           </View>

//           {/* Row 13: Stock Dropdown */}
//           <View style={styles.row}>
//             <View style={styles.fullWidthInputContainer}>
//               <Text style={styles.fieldLabel}>Stock Type</Text>
//               <LinearGradient colors={['#7E5EA9', '#20AEBC']} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={styles.inputGradient}>
//                 <TouchableOpacity style={styles.input} onPress={() => setShowStockDropdown(true)}>
//                   <Text style={formData.stock ? styles.selectedModelText : styles.placeholderText}>
//                     {formData.stock || 'Select Stock'}
//                   </Text>
//                   <Icon name="keyboard-arrow-down" size={25} color="#666" style={styles.dropdownIcon} />
//                 </TouchableOpacity>
//               </LinearGradient>
//             </View>
//           </View>

//           {/* Row 14: Payment Received */}
//           <View style={styles.row}>
//             <View style={styles.fullWidthInputContainer}>
//               <Text style={styles.fieldLabel}>Payment Received</Text>
//               <LinearGradient colors={['#7E5EA9', '#20AEBC']} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={styles.inputGradient}>
//                 <TextInput
//                   style={styles.input}
//                   value={formData.payment_received}
//                   onChangeText={text => handleInputChange('payment_received', text)}
//                   placeholder={getPlaceholderText('payment_received', formData.payment_received)}
//                   placeholderTextColor="#666"
//                   keyboardType="decimal-pad"
//                 />
//               </LinearGradient>
//             </View>
//           </View>

//           {/* Row 15: Balance Payment (Auto-calculated) */}
//           <View style={styles.row}>
//             <View style={styles.fullWidthInputContainer}>
//               <Text style={styles.fieldLabel}>Balance Payment (Auto-calculated)</Text>
//               <LinearGradient colors={['#7E5EA9', '#20AEBC']} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={styles.inputGradient}>
//                 <View style={[styles.input, styles.disabledInput]}>
//                   <Text style={styles.balancePaymentText}>
//                     ₹{formatCurrency(formData.balance_payment)}
//                   </Text>
//                   <Icon name="calculate" size={20} color="#28a745" />
//                 </View>
//               </LinearGradient>
//               <Text style={styles.calculationNote}>
//                 Balance = Selling Price (₹{formatCurrency(formData.selling_price)}) - Payment Received (₹{formatCurrency(formData.payment_received)})
//               </Text>
//             </View>
//           </View>
//         </View>

//         {/* Date Picker */}
//         {showDatePicker && (
//           <DateTimePicker
//             value={selectedDate}
//             mode="date"
//             display={Platform.OS === 'ios' ? 'spinner' : 'default'}
//             onChange={handleDateChange}
//             maximumDate={new Date()}
//           />
//         )}

//         {/* Stock Dropdown Modal */}
//         <Modal
//           visible={showStockDropdown}
//           transparent
//           animationType="slide"
//           onRequestClose={() => setShowStockDropdown(false)}>
//           <View style={styles.modalOverlay}>
//             <View style={styles.modalContent}>
//               <View style={styles.modalHeader}>
//                 <Text style={styles.modalTitle}>Select Stock Option</Text>
//                 <TouchableOpacity onPress={() => setShowStockDropdown(false)} style={styles.closeButton}>
//                   <Icon name="close" size={24} color="#000" />
//                 </TouchableOpacity>
//               </View>
//               <FlatList
//                 data={STOCK_OPTIONS}
//                 renderItem={renderStockItem}
//                 keyExtractor={(item, index) => index.toString()}
//                 style={styles.modelList}
//                 showsVerticalScrollIndicator
//               />
//             </View>
//           </View>
//         </Modal>

//         {/* Photo Section */}
//         <View style={styles.photoSignatureSection}>
//           <Text style={styles.fieldLabel}>Tractor Picture</Text>
//           <TouchableOpacity
//             style={styles.photoSignatureBox}
//             onPress={() => showImagePickerOptions(setPicture)}>
//             {picture ? (
//               <Image source={{uri: picture.uri}} style={styles.previewImage} resizeMode="cover" />
//             ) : existingPictureUrl ? (
//               <Image
//                 source={{uri: existingPictureUrl}}
//                 style={styles.previewImage}
//                 resizeMode="cover"
//                 onError={() => {
//                   console.log('Error loading existing image');
//                   setExistingPictureUrl(null);
//                 }}
//               />
//             ) : (
//               <>
//                 <Icon name="photo-camera" size={35} color="#666" />
//                 <Text style={styles.photoSignatureText}>Tap to add tractor picture</Text>
//               </>
//             )}
//           </TouchableOpacity>
//         </View>

//         {/* Submit */}
//         <View style={styles.buttonContainer}>
//           <TouchableOpacity
//             style={[styles.submitButton, submitting && {opacity: 0.7}]}
//             onPress={handleSubmit}
//             disabled={submitting}>
//             {submitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitButtonText}>
//               {editData ? 'Update Record' : 'Submit Record'}
//             </Text>}
//           </TouchableOpacity>
//         </View>
//       </ScrollView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {paddingHorizontal: 15},
//   header: {paddingHorizontal:15, paddingVertical: 10},
//   companyName: {fontSize: 18, fontWeight: '600', color: 'white', textAlign: 'center',fontFamily: 'Inter_28pt-SemiBold'},
//   companyName1: {fontSize: 15, fontFamily: 'Inter_28pt-SemiBold', color: 'white', textAlign: 'center'},
//   formContainer: {marginBottom: 15, marginTop: 20},
//   row: {marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between'},
//   inputContainer: {flex: 1, marginHorizontal: 4, marginBottom: 10},
//   fullWidthInputContainer: {flex: 1, marginHorizontal: 0, marginBottom: 10},
//   fieldLabel: {
//     fontSize: 14,
//     fontFamily: 'Inter_28pt-Medium',
//     color: '#666',
//     marginBottom: 5,
//     marginLeft: 5,
//   },
//   inputGradient: {borderRadius: 10, padding: 1},
//   input: {
//     borderRadius: 10,
//     backgroundColor: '#fff',
//     padding: 12,
//     fontSize: 14,
//     fontFamily: 'Inter_28pt-Regular',
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     minHeight: 50,
//   },
//   disabledInput: {
//     backgroundColor: '#f8f9fa',
//   },
//   multilineInput: {
//     minHeight: 80,
//     textAlignVertical: 'top',
//   },
//   selectedModelText: {fontSize: 14, fontFamily: 'Inter_28pt-Regular', color: '#000'},
//   placeholderText: {fontSize: 14, fontFamily: 'Inter_28pt-Regular', color: '#666'},
//   balancePaymentText: {
//     fontSize: 14,
//     fontFamily: 'Inter_28pt-SemiBold',
//     color: '#28a745',
//   },
//   calculationNote: {
//     fontSize: 11,
//     fontFamily: 'Inter_28pt-Regular',
//     color: '#666',
//     marginTop: 4,
//     marginLeft: 5,
//     fontStyle: 'italic',
//   },
//   dropdownIcon: {marginLeft: 8},
//   modalOverlay: {flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center'},
//   modalContent: {backgroundColor: 'white', borderRadius: 10, width: '90%', maxHeight: '70%', overflow: 'hidden'},
//   modalHeader: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderBottomColor: '#e0e0e0'},
//   modalTitle: {fontSize: 16, fontWeight: 'bold', fontFamily: 'Inter_28pt-SemiBold'},
//   closeButton: {padding: 4},
//   modelList: {maxHeight: 300},
//   modelItem: {padding: 15, borderBottomWidth: 1, borderBottomColor: '#f0f0f0'},
//   modelItemText: {fontSize: 14, fontFamily: 'Inter_28pt-Regular', color: '#666'},
//   photoSignatureSection: {marginTop: 10},
//   photoSignatureBox: {
//     width: '100%',
//     height: 160,
//     borderWidth: 1,
//     borderColor: '#00000080',
//     borderRadius: 10,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 20,
//     borderStyle: 'dashed',
//     overflow: 'hidden',
//   },
//   photoSignatureText: {fontSize: 13, textAlign: 'center', marginTop: 2, color: '#00000099', fontFamily: 'Inter_28pt-Medium'},
//   previewImage: {width: '100%', height: '100%'},
//   buttonContainer: {marginTop: 20, marginBottom: 30},
//   submitButton: {flex: 1, backgroundColor: '#7E5EA9', padding: 15, borderRadius: 10, alignItems: 'center', marginBottom: 10},
//   submitButtonText: {color: '#fff', fontFamily: 'Inter_28pt-SemiBold', fontSize: 14},
//   headerContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
//   iconButton: { padding: 5, width: 35 },
// });

// export default Addoldtractor;

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
  const [submitting, setSubmitting] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [formData, setFormData] = useState({
    enter_by: '',
    entry_date: '',
    ledger_no: '',
    customer_name: '',
    father_name: '',
    address: '',
    mobile_no: '',
    tractor_model: '',
    chassis_no: '',
    year_of_manufacture: '',
    deal_price: '',
    selling_price: '',
    stock: '',
    payment_received: '',
    balance_payment: '',
  });

  // Image state
  const [picture, setPicture] = useState(null);
  const [pictureChanged, setPictureChanged] = useState(false);
  const [existingPictureUrl, setExistingPictureUrl] = useState(null);

  // Calculate balance payment whenever selling price or payment received changes
  useEffect(() => {
    const calculateBalance = () => {
      const sellingPrice = parseFloat(formData.selling_price) || 0;
      const paymentReceived = parseFloat(formData.payment_received) || 0;
      const balance = sellingPrice - paymentReceived;

      setFormData(prev => ({
        ...prev,
        balance_payment: balance >= 0 ? balance.toString() : '0',
      }));
    };

    calculateBalance();
  }, [formData.selling_price, formData.payment_received]);

  // Initialize form data when editData changes
  useEffect(() => {
    if (editData) {
      console.log('Edit Data Received:', editData);

      // Calculate balance for edit mode
      const sellingPrice = parseFloat(editData?.sell_price) || 0;
      const paymentReceived = parseFloat(editData?.payment_received) || 0;
      const balance = sellingPrice - paymentReceived;

      // Set form data with proper fallbacks
      setFormData({
        enter_by: editData?.entry_by || '',
        entry_date: editData?.entry_date || '',
        ledger_no: editData?.ledger_no || '',
        customer_name: editData?.customer_name || '',
        father_name: editData?.father_name || '',
        address: editData?.customer_address || '',
        mobile_no: editData?.mobile_number || '',
        tractor_model: editData?.tractor_model || '',
        chassis_no: editData?.chassis_no || '',
        year_of_manufacture: editData?.year_of_manufacture || '',
        deal_price: editData?.deal_price?.toString() || '',
        selling_price: editData?.sell_price?.toString() || '',
        stock: editData?.stock_type || '',
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
          const month = parseInt(dateParts[1]) - 1; // Months are 0-indexed
          const day = parseInt(dateParts[2]);
          setSelectedDate(new Date(year, month, day));
        }
      }
    }
  }, [editData]);

  // ===== Date Picker Functions =====
  const handleDateChange = (event, date) => {
    setShowDatePicker(false);
    if (date) {
      setSelectedDate(date);
      // Format date as YYYY-MM-DD for API
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
          setExistingPictureUrl(null); // Clear existing URL when new picture is taken
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
        setExistingPictureUrl(null); // Clear existing URL when new picture is selected
      }
    });
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({...prev, [field]: value}));
  };

  const handleStockSelect = stockOption => {
    handleInputChange('stock', stockOption);
    setShowStockDropdown(false);
  };

  const validate = () => {
    const requiredFields = [
      'enter_by',
      'entry_date',
      'ledger_no',
      'customer_name',
      'father_name',
      'address',
      'mobile_no',
      'tractor_model',
      'chassis_no',
      'year_of_manufacture',
      'deal_price',
      'selling_price',
      'stock',
      'payment_received',
    ];

    for (const field of requiredFields) {
      if (!formData[field]?.trim()) {
        const fieldName = field.replace(/_/g, ' ');
        return `Please enter ${fieldName}.`;
      }
    }

    if (!/^\d{10}$/.test(formData.mobile_no.trim())) {
      return 'Mobile number must be 10 digits.';
    }

    if (!/^\d{4}$/.test(formData.year_of_manufacture.trim())) {
      return 'Year of Manufacture must be a 4-digit number.';
    }

    // Validate that payment received is not greater than selling price
    const sellingPrice = parseFloat(formData.selling_price) || 0;
    const paymentReceived = parseFloat(formData.payment_received) || 0;

    if (paymentReceived > sellingPrice) {
      return 'Payment received cannot be greater than selling price.';
    }

    if (!editData && !picture && !existingPictureUrl) {
      return 'Please add a tractor picture.';
    }

    return null;
  };

  const pingHost = async () => {
    try {
      const res = await fetch('https://argosmob.uk/', {method: 'GET'});
      return {ok: res.ok, status: res.status};
    } catch (e) {
      return {ok: false, status: 0, error: String(e)};
    }
  };

  // ===== Submit =====
  const handleSubmit = useCallback(async () => {
    const error = validate();
    if (error) {
      Alert.alert('Validation', error);
      return;
    }

    setSubmitting(true);
    try {
      // 1) Quick connectivity check
      const ping = await pingHost();
      if (!ping.ok) {
        console.log('Ping host failed:', ping);
        Alert.alert(
          'Network',
          `Cannot reach argosmob.uk (status: ${ping.status}). Check internet connection.`,
        );
        return;
      }

      // 2) Build multipart payload - UPDATED FIELD NAMES TO MATCH API
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        Alert.alert('Error', 'No userId found in storage.');
        return;
      }

      const body = new FormData();
      body.append('user_id', String(userId));
      body.append('entry_by', formData.enter_by.trim());
      body.append('entry_date', formData.entry_date.trim());
      body.append('ledger_no', formData.ledger_no.trim());
      body.append('customer_name', formData.customer_name.trim());
      body.append('father_name', formData.father_name.trim());
      body.append('customer_address', formData.address.trim());
      body.append('mobile_number', formData.mobile_no.trim());
      body.append('tractor_model', formData.tractor_model.trim());
      body.append('chassis_no', formData.chassis_no.trim());
      body.append('year_of_manufacture', formData.year_of_manufacture.trim());
      body.append('deal_price', formData.deal_price.trim());
      body.append('sell_price', formData.selling_price.trim()); // Updated field name
      body.append('stock_type', formData.stock.trim()); // Updated field name
      body.append('payment_received', formData.payment_received.trim());
      body.append('balance_payment', formData.balance_payment.trim());

      // Add picture if available (for new record or when changed in edit)
      if (picture && (!editData || pictureChanged)) {
        const imagePart = {
          uri: picture.uri,
          name: picture.fileName || `tractor_${Date.now()}.jpg`,
          type: picture.type || 'image/jpeg',
        };
        body.append('picture', imagePart);
      }

      // For update, include the ID
      if (editData) {
        body.append('id', editData.id.toString());
      }

      console.log('Submitting form data:', {
        editMode: !!editData,
        picture: !!picture,
        pictureChanged,
        existingPictureUrl: !!existingPictureUrl,
        balance_payment: formData.balance_payment,
        formData: {
          ...formData,
          selling_price: formData.selling_price, // This will be sent as 'sell_price'
          stock: formData.stock, // This will be sent as 'stock_type'
        },
      });

      // 3) API call with axios
      const endpoint = editData
        ? 'https://argosmob.uk/makroo/public/api/v1/tractor-deals/form/update'
        : 'https://argosmob.uk/makroo/public/api/v1/tractor-deals/form/save';

      try {
        const res = await axios.post(endpoint, body, {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
          },
          timeout: 30000,
        });

        console.log('AXIOS success:', res.status, res.data);

        if (res.data && res.data.success) {
          Alert.alert(
            'Success',
            editData
              ? 'Record updated successfully!'
              : 'Record submitted successfully!',
          );

          // Reset form if not in edit mode
          if (!editData) {
            setFormData({
              enter_by: '',
              entry_date: '',
              ledger_no: '',
              customer_name: '',
              father_name: '',
              address: '',
              mobile_no: '',
              tractor_model: '',
              chassis_no: '',
              year_of_manufacture: '',
              deal_price: '',
              selling_price: '',
              stock: '',
              payment_received: '',
              balance_payment: '',
            });
            setPicture(null);
            setExistingPictureUrl(null);
          }

          // Navigate to details screen
          navigation.navigate('Oldtractordetails');
        } else {
          Alert.alert('Error', res.data.message || 'Submission failed');
        }
      } catch (err) {
        console.log('AXIOS ERROR:', err?.response?.status, err?.response?.data);
        Alert.alert('Error', `Upload failed: ${err.message}`);
      }
    } finally {
      setSubmitting(false);
    }
  }, [
    formData,
    picture,
    editData,
    pictureChanged,
    existingPictureUrl,
    navigation,
  ]);

  // ===== UI bits =====
  const renderStockItem = ({item}) => (
    <TouchableOpacity
      style={styles.modelItem}
      onPress={() => handleStockSelect(item)}>
      <Text style={styles.modelItemText}>{item}</Text>
    </TouchableOpacity>
  );

  // Function to get placeholder text based on field and whether data exists
  const getPlaceholderText = (field, value) => {
    const placeholders = {
      enter_by: 'Enter By',
      entry_date: 'Entry Date (YYYY-MM-DD)',
      ledger_no: 'Ledger No.',
      customer_name: 'Customer Name',
      father_name: "Father's Name",
      address: 'Address',
      mobile_no: 'Mobile No.',
      tractor_model: 'Tractor Model',
      chassis_no: 'Chassis No',
      year_of_manufacture: 'Year of Manufacture',
      deal_price: 'Deal Price',
      selling_price: 'Selling Price',
      stock: 'Select Stock',
      payment_received: 'Payment Received',
      balance_payment: 'Balance Payment (Auto-calculated)',
    };

    return value ? '' : placeholders[field];
  };

  // Format currency display
  const formatCurrency = value => {
    if (!value) return '0';
    const num = parseFloat(value);
    return isNaN(num)
      ? '0'
      : num.toLocaleString('en-IN', {
          maximumFractionDigits: 2,
          minimumFractionDigits: 2,
        });
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
          {/* Left Side: Menu Icon */}
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={25} color="#fff" />
          </TouchableOpacity>

          {/* Center: Dashboard Text */}
          <View style={{flex: 1, alignItems: 'center'}}>
            <Text style={styles.companyName}>Makroo Motor Corp.</Text>
            <Text style={styles.companyName1}>
              {editData ? 'Edit Old Tractor' : 'Add Old Tractor'}
            </Text>
          </View>

          {/* Right side placeholder for alignment */}
          <View style={styles.iconButton} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
        {/* Form Fields */}
        <View style={styles.formContainer}>
          {/* Row 1: Enter By */}
          <View style={styles.row}>
            <View style={styles.fullWidthInputContainer}>
              <Text style={styles.fieldLabel}>Enter By</Text>
              <LinearGradient
                colors={['#7E5EA9', '#20AEBC']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={styles.inputGradient}>
                <TextInput
                  style={styles.input}
                  value={formData.enter_by}
                  onChangeText={text => handleInputChange('enter_by', text)}
                  placeholder={getPlaceholderText(
                    'enter_by',
                    formData.enter_by,
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
                  value={formData.address}
                  onChangeText={text => handleInputChange('address', text)}
                  placeholder={getPlaceholderText('address', formData.address)}
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
                  value={formData.mobile_no}
                  onChangeText={text => handleInputChange('mobile_no', text)}
                  placeholder={getPlaceholderText(
                    'mobile_no',
                    formData.mobile_no,
                  )}
                  placeholderTextColor="#666"
                  keyboardType="phone-pad"
                  maxLength={10}
                />
              </LinearGradient>
            </View>
          </View>

          {/* Row 8: Tractor Model */}
          <View style={styles.row}>
            <View style={styles.fullWidthInputContainer}>
              <Text style={styles.fieldLabel}>Tractor Model</Text>
              <LinearGradient
                colors={['#7E5EA9', '#20AEBC']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={styles.inputGradient}>
                <TextInput
                  style={styles.input}
                  value={formData.tractor_model}
                  onChangeText={text =>
                    handleInputChange('tractor_model', text)
                  }
                  placeholder={getPlaceholderText(
                    'tractor_model',
                    formData.tractor_model,
                  )}
                  placeholderTextColor="#666"
                />
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
                  value={formData.selling_price}
                  onChangeText={text =>
                    handleInputChange('selling_price', text)
                  }
                  placeholder={getPlaceholderText(
                    'selling_price',
                    formData.selling_price,
                  )}
                  placeholderTextColor="#666"
                  keyboardType="decimal-pad"
                />
              </LinearGradient>
            </View>
          </View>

          {/* Row 13: Stock Dropdown */}
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
                      formData.stock
                        ? styles.selectedModelText
                        : styles.placeholderText
                    }>
                    {formData.stock || 'Select Stock'}
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
                />
              </LinearGradient>
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
                    ₹{formatCurrency(formData.balance_payment)}
                  </Text>
                  <Icon name="calculate" size={20} color="#28a745" />
                </View>
              </LinearGradient>
              <Text style={styles.calculationNote}>
                Balance = Selling Price (₹
                {formatCurrency(formData.selling_price)}) - Payment Received (₹
                {formatCurrency(formData.payment_received)})
              </Text>
            </View>
          </View>
        </View>

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

        {/* Stock Dropdown Modal */}
        <Modal
          visible={showStockDropdown}
          transparent
          animationType="slide"
          onRequestClose={() => setShowStockDropdown(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Stock Option</Text>
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
    fontFamily: 'Inter_28pt-SemiBold',
  },
  closeButton: {padding: 4},
  modelList: {maxHeight: 300},
  modelItem: {padding: 15, borderBottomWidth: 1, borderBottomColor: '#f0f0f0'},
  modelItemText: {
    fontSize: 14,
    fontFamily: 'Inter_28pt-Regular',
    color: '#666',
  },
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
