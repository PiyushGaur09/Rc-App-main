// import React, {useRef, useState} from 'react';
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

// const initialFormData = {
//   CustomerName: '',
//   FathersName: '',
//   percentage: '',
//   address: '',
//   mobileNo: '',
//   TractorName: '',
//   tractorModel: '',
//   date: null,
//   YearofManufacture: '',
//   chassisNo: '',       // mapped to tractor_number
//   engineNo: '',
//   DocumentNumber:'',
//   documentType: '',
//   otherDocumentType: '',
// };

// const Form = ({navigation}) => {
//   const insets = useSafeAreaInsets();
//   const scrollRef = useRef(null);

//   const [showModelDropdown, setShowModelDropdown] = useState(false);
//   const [showDocumentTypeDropdown, setShowDocumentTypeDropdown] = useState(false);
//   const [showDatePicker, setShowDatePicker] = useState(false);

//   const [submitting, setSubmitting] = useState(false);
//   const [apiResponse, setApiResponse] = useState(null);
//   const [apiError, setApiError] = useState(null);

//   const [formData, setFormData] = useState(initialFormData);

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

//   const requestCameraPermission = async () => {
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
//             const hasPermission = await requestCameraPermission();
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
//               const hasPermission = await requestCameraPermission();
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
//       { mediaType: 'photo', quality: 1, cameraType: 'back', saveToPhotos: true },
//       (response) => {
//         if (response?.didCancel) return;
//         if (response?.assets?.length > 0) setImageFunction(response.assets[0]);
//       }
//     );
//   };

//   const handleImageLibrary = (setImageFunction) => {
//     launchImageLibrary({ mediaType: 'photo', quality: 1 }, (response) => {
//       if (response?.didCancel) return;
//       if (response?.assets?.length > 0) setImageFunction(response.assets[0]);
//     });
//   };

//   const handleInputChange = (field, value) => {
//     setFormData(prev => ({ ...prev, [field]: value }));
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
//     if (selectedDate) handleInputChange('date', selectedDate);
//   };

//   // === API SUBMIT (uses AsyncStorage userId -> user_id) ===
//   const handleSubmit = async () => {
//     setSubmitting(true);
//     setApiResponse(null);
//     setApiError(null);

//     try {
//       const storedUserId = await AsyncStorage.getItem('userId');
//       const userId = (storedUserId || '').toString().trim();
//       if (!userId) throw new Error('Missing userId in AsyncStorage.');

//       const data = new FormData();
//       data.append('customer_name', (formData.CustomerName || '').trim());
//       data.append('father_name',   (formData.FathersName  || '').trim());
//       data.append('address',       (formData.address      || '').trim());
//       data.append('user_id',       userId);

//       // map chassis -> tractor_number
//       data.append('tractor_number', (formData.chassisNo || '').trim());
//       data.append('engine_number',  (formData.engineNo  || '').trim());

//       const docType = formData.documentType === 'Other'
//         ? (formData.otherDocumentType || '').trim()
//         : (formData.documentType || '').trim();
//       data.append('document_type', docType);
//       data.append('document_number', (formData.DocumentNumber || '').trim());

//       // "YYYY-MM-DD HH:mm:ss"
//       const now = new Date();
//       const submittedAt =
//         `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')} ` +
//         `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`;
//       data.append('submitted_at', submittedAt);

//       if (customerSignature?.uri) {
//         data.append('customer_signature', {
//           uri: customerSignature.uri,
//           type: customerSignature.type || 'image/jpeg',
//           name: customerSignature.fileName || 'customer_signature.jpg',
//         });
//       }
//       if (managerSignature?.uri) {
//         data.append('manager_signature', {
//           uri: managerSignature.uri,
//           type: managerSignature.type || 'image/jpeg',
//           name: managerSignature.fileName || 'manager_signature.jpg',
//         });
//       }

//       const response = await axios.post(
//         'https://argosmob.uk/makroo/public/api/v1/delivery-forms',
//         data,
//         {
//           headers: { 'Content-Type': 'multipart/form-data' },
//           maxBodyLength: Infinity,
//         }
//       );

//       setApiResponse(response.data);

//       // ✅ Clear the form + images
//       setFormData(initialFormData);
//       setCustomerSignature(null);
//       setManagerSignature(null);

//       // Optional: scroll to top so the user sees the cleared form/header
//       if (scrollRef.current?.scrollTo) {
//         scrollRef.current.scrollTo({ y: 0, animated: true });
//       }

//       Alert.alert('Success', 'Form submitted successfully!');
//       console.log('API Response:', JSON.stringify(response.data, null, 2));
//     } catch (error) {
//       const msg = error?.response?.data ?? error?.message ?? 'Unknown error';
//       setApiError(msg);
//       Alert.alert('Error', 'Failed to submit the form. Please try again.');
//       console.error('API Error:', msg);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleHome = () => navigation.navigate('Dashboard');
//   const handleDateIconPress = () => setShowDatePicker(true);

//   const renderModelItem = ({item}) => (
//     <TouchableOpacity style={styles.modelItem} onPress={() => handleModelSelect(item)}>
//       <Text style={styles.modelItemText}>{item}</Text>
//     </TouchableOpacity>
//   );
//   const renderDocumentTypeItem = ({item}) => (
//     <TouchableOpacity style={styles.modelItem} onPress={() => handleDocumentTypeSelect(item)}>
//       <Text style={styles.modelItemText}>{item}</Text>
//     </TouchableOpacity>
//   );

//   return (
//     <View style={{flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom}}>
//       {/* Header */}
//       <LinearGradient colors={['#7E5EA9', '#20AEBC']} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={styles.header}>
//          <View style={styles.headerContent}>
//                                     {/* Left Side: Menu Icon */}
//                                     <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Hamburger')}>
//                                       <Icon name="reorder" size={25} color="#fff" />
//                                     </TouchableOpacity>
                          
//                                     {/* Center: Dashboard Text */}
//                                     <View>
//                                       <Text style={styles.companyName}>Makroo Motor Corp.</Text>
//                                       <Text style={styles.companyName1}>Form</Text>
//                                     </View>
                          
//                                     {/* Right Side: Icon */}
//                                     <TouchableOpacity style={styles.iconButton}>
//                                       <Icon name="notifications-on" size={25} color="#fff" />
//                                     </TouchableOpacity>
//                                   </View>
       
//       </LinearGradient>

//       <ScrollView style={styles.container} ref={scrollRef}>
//         <Text style={styles.Date}>09-08-25</Text>
//         <Text style={styles.formNo}>Form</Text>

//         {/* Form Fields */}
//         <View style={styles.formContainer}>
//           <View style={styles.row}>
//             <View style={styles.inputContainer}>
//               <LinearGradient colors={['#7E5EA9', '#20AEBC']} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={styles.inputGradient}>
//                 <TextInput
//                   style={styles.input}
//                   value={formData.CustomerName}
//                   onChangeText={text => handleInputChange('CustomerName', text)}
//                   placeholder="Customer Name"
//                    placeholderTextColor="#666"

//                 />
//               </LinearGradient>
//             </View>
//             <View style={styles.inputContainer}>
//               <LinearGradient colors={['#7E5EA9', '#20AEBC']} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={styles.inputGradient}>
//                 <TextInput
//                   style={styles.input}
//                   value={formData.FathersName}
//                   onChangeText={text => handleInputChange('FathersName', text)}
//                   placeholder="Father's Name"
//                    placeholderTextColor="#666"

//                 />
//               </LinearGradient>
//             </View>
//           </View>

//           <View style={styles.row}>
//             <View style={styles.inputContainer}>
//               <LinearGradient colors={['#7E5EA9', '#20AEBC']} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={styles.inputGradient}>
//                 <TextInput
//                   style={styles.input}
//                   value={formData.address}
//                   onChangeText={text => handleInputChange('address', text)}
//                   placeholder="Address"
//                    placeholderTextColor="#666"

//                 />
//               </LinearGradient>
//             </View>
//           </View>

//           <View style={styles.row}>
//             <View style={styles.inputContainer}>
//               <LinearGradient colors={['#7E5EA9', '#20AEBC']} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={styles.inputGradient}>
//                 <TextInput
//                   style={styles.input}
//                   value={formData.mobileNo}
//                   onChangeText={text => handleInputChange('mobileNo', text)}
//                   placeholder="Mobile Number"
//                    placeholderTextColor="#666"

//                   keyboardType="phone-pad"
//                 />
//               </LinearGradient>
//             </View>

//             <View style={styles.inputContainer}>
//               <LinearGradient colors={['#7E5EA9', '#20AEBC']} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={styles.inputGradient}>
//                 <TextInput
//                   style={styles.input}
//                   value={formData.TractorName}
//                   onChangeText={text => handleInputChange('TractorName', text)}
//                   placeholder="Tractor Name"
//                    placeholderTextColor="#666"

//                 />
//               </LinearGradient>
//             </View>
//           </View>

//           <View style={styles.row}>
//             <View style={styles.inputContainer}>
//               <LinearGradient colors={['#7E5EA9', '#20AEBC']} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={styles.inputGradient}>
//                 <TouchableOpacity style={styles.input} onPress={() => setShowModelDropdown(true)}>
//                   <Text style={formData.tractorModel ? styles.selectedModelText : styles.placeholderText}>
//                     {formData.tractorModel || 'Select Tractor Model'}
//                   </Text>
//                   <Icon name="keyboard-arrow-down" size={25} color="#666" style={styles.dropdownIcon}/>
//                 </TouchableOpacity>
//               </LinearGradient>
//             </View>
//           </View>

//           <View style={styles.row}>
//             <View style={styles.inputContainer}>
//               <LinearGradient colors={['#7E5EA9', '#20AEBC']} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={styles.inputGradient}>
//                 <View style={styles.inputWithIcon}>
//                   <TextInput
//                     style={[styles.input, styles.inputWithIconField]}
//                     value={formData.chassisNo}
//                     onChangeText={text => handleInputChange('chassisNo', text)}
//                     placeholder="Chassis Number"
//                    placeholderTextColor="#666"

//                   />
//                 </View>
//               </LinearGradient>
//             </View>
//           </View>

//           <View style={styles.row}>
//             <View style={styles.inputContainer}>
//               <LinearGradient colors={['#7E5EA9', '#20AEBC']} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={styles.inputGradient}>
//                 <View style={styles.inputWithIcon}>
//                   <TextInput
//                     style={[styles.input, styles.inputWithIconField]}
//                     value={formData.engineNo}
//                     onChangeText={text => handleInputChange('engineNo', text)}
//                     placeholder="Engine Number"
//                    placeholderTextColor="#666"

//                   />
//                 </View>
//               </LinearGradient>
//             </View>

//             <View style={styles.inputContainer}>
//               <LinearGradient colors={['#7E5EA9', '#20AEBC']} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={styles.inputGradient}>
//                 <TextInput
//                   style={styles.input}
//                   value={formData.YearofManufacture}
//                   onChangeText={text => handleInputChange('YearofManufacture', text)}
//                   placeholder="Year of Manufacture"
//                    placeholderTextColor="#666"

//                 />
//               </LinearGradient>
//             </View>
//           </View>

//           <View style={styles.row}>
//             <View style={styles.inputContainer}>
//               <LinearGradient colors={['#7E5EA9', '#20AEBC']} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={styles.inputGradient}>
//                 <TouchableOpacity style={styles.input} onPress={() => setShowDocumentTypeDropdown(true)}>
//                   <Text style={formData.documentType ? styles.selectedModelText : styles.placeholderText}>
//                     {formData.documentType || 'Document Type'}
//                   </Text>
//                   <Icon name="keyboard-arrow-down" size={25} color="#666" style={styles.dropdownIcon}/>
//                 </TouchableOpacity>
//               </LinearGradient>
//             </View>

//             <View style={styles.inputContainer}>
//               <LinearGradient colors={['#7E5EA9', '#20AEBC']} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={styles.inputGradient}>
//                 <TextInput
//                   style={styles.input}
//                   value={formData.DocumentNumber}
//                   onChangeText={text => handleInputChange('DocumentNumber', text)}
//                   placeholder="Document Number"
//                    placeholderTextColor="#666"

//                 />
//               </LinearGradient>
//             </View>
//           </View>

//           {formData.documentType === 'Other' && (
//             <View style={styles.row}>
//               <View style={styles.inputContainer}>
//                 <LinearGradient colors={['#7E5EA9', '#20AEBC']} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={styles.inputGradient}>
//                   <TextInput
//                     style={styles.input}
//                     value={formData.otherDocumentType}
//                     onChangeText={text => handleInputChange('otherDocumentType', text)}
//                     placeholder="Specify Document Type"
//                    placeholderTextColor="#666"

//                   />
//                 </LinearGradient>
//               </View>
//             </View>
//           )}
//         </View>

//         {/* Tractor Model Dropdown Modal */}
//         <Modal visible={showModelDropdown} transparent animationType="slide" onRequestClose={() => setShowModelDropdown(false)}>
//           <View style={styles.modalOverlay}>
//             <View style={styles.modalContent}>
//               <View style={styles.modalHeader}>
//                 <Text style={styles.modalTitle}>Select Tractor Model</Text>
//                 <TouchableOpacity onPress={() => setShowModelDropdown(false)} style={styles.closeButton}>
//                   <Icon name="close" size={24} color="#000" />
//                 </TouchableOpacity>
//               </View>
//               <FlatList
//                 data={tractorModels}
//                 renderItem={renderModelItem}
//                 keyExtractor={(item, index) => index.toString()}
//                 style={styles.modelList}
//                 showsVerticalScrollIndicator
//               />
//             </View>
//           </View>
//         </Modal>

//         {/* Document Type Dropdown Modal */}
//         <Modal visible={showDocumentTypeDropdown} transparent animationType="slide" onRequestClose={() => setShowDocumentTypeDropdown(false)}>
//           <View style={styles.modalOverlay}>
//             <View style={styles.modalContent}>
//               <View style={styles.modalHeader}>
//                 <Text style={styles.modalTitle}>Select Document Type</Text>
//                 <TouchableOpacity onPress={() => setShowDocumentTypeDropdown(false)} style={styles.closeButton}>
//                   <Icon name="close" size={24} color="#000" />
//                 </TouchableOpacity>
//               </View>
//               <FlatList
//                 data={documentTypes}
//                 renderItem={renderDocumentTypeItem}
//                 keyExtractor={(item, index) => index.toString()}
//                 style={styles.modelList}
//                 showsVerticalScrollIndicator
//               />
//             </View>
//           </View>
//         </Modal>

//         {/* Photo and Signatures */}
//         <View style={styles.photoSignatureSection}>
//           <TouchableOpacity style={styles.photoSignatureBox1} onPress={() => showImagePickerOptions(setCustomerSignature)}>
//             {customerSignature ? (
//               <Image source={{ uri: customerSignature.uri }} style={styles.previewImage} resizeMode="contain" />
//             ) : (
//               <Text style={styles.photoSignatureText}>Customer Signature</Text>
//             )}
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.photoSignatureBox1} onPress={() => showImagePickerOptions(setManagerSignature)}>
//             {managerSignature ? (
//               <Image source={{ uri: managerSignature.uri }} style={styles.previewImage} resizeMode="contain" />
//             ) : (
//               <Text style={styles.photoSignatureText}>Manager Signature</Text>
//             )}
//           </TouchableOpacity>
//         </View>

//         {/* Buttons */}
//         <View style={styles.buttonContainer}>
//           <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={submitting}>
//             {submitting ? <ActivityIndicator /> : <Text style={styles.submitButtonText}>Submit</Text>}
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.homeButton} onPress={() => navigation.navigate('Dashboard')} disabled={submitting}>
//             <Text style={styles.homeButtonText}>Home</Text>
//           </TouchableOpacity>
//         </View>

//         {/* <TouchableOpacity style={styles.pdfButton} onPress={() => navigation.navigate('Pdfpage')} disabled={submitting}>
//           <Text style={styles.pdfButtonText}>Generate PDF</Text>
//         </TouchableOpacity> */}

       
//       </ScrollView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container:{ paddingHorizontal:15 },
//   header:{ paddingHorizontal:15, paddingVertical:10 },
//   companyName:{ fontSize:17, fontWeight:'600', color:'white', textAlign:'center',fontFamily: 'Inter_28pt-SemiBold' },
//   formNo:{ fontSize:13, marginVertical:10, fontFamily:'Inter_28pt-SemiBold', paddingHorizontal:5 },
//   Date:{ fontSize:12, textAlign:'right', marginVertical:5, fontFamily:'Inter_28pt-Regular', color:'#00000099', paddingRight:15 },
//   formContainer:{ marginBottom:15 },
//   row:{ marginBottom:0 },
//   inputContainer:{ flex:1, marginHorizontal:4, marginBottom:10 },
//   inputGradient:{ borderRadius:10, padding:1 },
//   input:{
//     borderRadius:10, backgroundColor:'#fff', padding:12, fontSize:14,
//     fontFamily:'Inter_28pt-Regular', flexDirection:'row', justifyContent:'space-between', alignItems:'center'
//   },
//   selectedModelText:{ fontSize:14, fontFamily:'Inter_28pt-Regular', color:'#000' },
//   placeholderText:{ fontSize:14, fontFamily:'Inter_28pt-Regular', color:'#666' },
//   dropdownIcon:{ marginLeft:8 },
//   inputWithIcon:{ flexDirection:'row', alignItems:'center' },
//   inputWithIconField:{ flex:1 },
//   modalOverlay:{ flex:1, backgroundColor:'rgba(0,0,0,0.5)', justifyContent:'center', alignItems:'center' },
//   modalContent:{ backgroundColor:'white', borderRadius:10, width:'90%', maxHeight:'70%', overflow:'hidden' },
//   modalHeader:{ flexDirection:'row', justifyContent:'space-between', alignItems:'center', padding:15, borderBottomWidth:1, borderBottomColor:'#e0e0e0' },
//   modalTitle:{ fontSize:16, fontWeight:'bold', fontFamily:'Inter_28pt-SemiBold' },
//   closeButton:{ padding:4 },
//   modelList:{ maxHeight:300 },
//   modelItem:{ padding:15, borderBottomWidth:1, borderBottomColor:'#f0f0f0' },
//   modelItemText:{ fontSize:14, fontFamily:'Inter_28pt-Regular', color:'#333' },
//   photoSignatureSection:{},
//   photoSignatureBox1:{
//     width:'100%', height:50, borderWidth:1, borderColor:'#00000080', borderRadius:10,
//     justifyContent:'center', alignItems:'center', marginBottom:20, borderStyle:'dashed'
//   },
//   photoSignatureText:{ fontSize:13, textAlign:'center', marginTop:2, color:'#00000099', fontFamily:'Inter_28pt-Medium' },
//   previewImage:{ width:'100%', height:'100%', borderRadius:10 },
//   buttonContainer:{ marginTop:20 },
//   submitButton:{ backgroundColor:'#7E5EA9', padding:15, borderRadius:10, alignItems:'center', marginBottom:10 },
//   submitButtonText:{ color:'#fff', fontFamily:'Inter_28pt-SemiBold', fontSize:14 },
//   homeButton:{ backgroundColor:'#20AEBC', padding:15, borderRadius:10, alignItems:'center', marginBottom:10 },
//   homeButtonText:{ color:'#fff', fontFamily:'Inter_28pt-SemiBold', fontSize:14 },
//   pdfButton:{ backgroundColor:'#7E5EA9', padding:15, borderRadius:10, alignItems:'center', marginBottom:20 },
//   pdfButtonText:{ color:'#fff', fontFamily:'Inter_28pt-SemiBold', fontSize:14 },
//     headerContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
//      companyName1:{ fontSize:15, fontWeight:'500', color:'white', textAlign:'center',fontFamily: 'Inter_28pt-SemiBold' },
// });

// export default Form;










// import React, {useRef, useState} from 'react';
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

// const initialFormData = {
//   CustomerName: '',
//   FathersName: '',
//   percentage: '',
//   address: '',
//   mobileNo: '',
//   TractorName: '',
//   tractorModel: '',
//   date: null,
//   YearofManufacture: '',
//   chassisNo: '',       // mapped to tractor_number
//   engineNo: '',
//   DocumentNumber:'',
//   documentType: '',
//   otherDocumentType: '',
// };

// const Form = ({navigation}) => {
//   const insets = useSafeAreaInsets();
//   const scrollRef = useRef(null);

//   const [showModelDropdown, setShowModelDropdown] = useState(false);
//   const [showDocumentTypeDropdown, setShowDocumentTypeDropdown] = useState(false);
//   const [showDatePicker, setShowDatePicker] = useState(false);

//   const [submitting, setSubmitting] = useState(false);
//   const [apiResponse, setApiResponse] = useState(null);
//   const [apiError, setApiError] = useState(null);

//   const [formData, setFormData] = useState(initialFormData);

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

//   const requestCameraPermission = async () => {
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
//             const hasPermission = await requestCameraPermission();
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
//               const hasPermission = await requestCameraPermission();
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
//       { mediaType: 'photo', quality: 1, cameraType: 'back', saveToPhotos: true },
//       (response) => {
//         if (response?.didCancel) return;
//         if (response?.assets?.length > 0) setImageFunction(response.assets[0]);
//       }
//     );
//   };

//   const handleImageLibrary = (setImageFunction) => {
//     launchImageLibrary({ mediaType: 'photo', quality: 1 }, (response) => {
//       if (response?.didCancel) return;
//       if (response?.assets?.length > 0) setImageFunction(response.assets[0]);
//     });
//   };

//   const handleInputChange = (field, value) => {
//     setFormData(prev => ({ ...prev, [field]: value }));
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
//     if (selectedDate) handleInputChange('date', selectedDate);
//   };

//   // === API SUBMIT (uses AsyncStorage userId -> user_id) ===
//   const handleSubmit = async () => {
//     setSubmitting(true);
//     setApiResponse(null);
//     setApiError(null);

//     try {
//       const storedUserId = await AsyncStorage.getItem('userId');
//       const userId = (storedUserId || '').toString().trim();
//       if (!userId) throw new Error('Missing userId in AsyncStorage.');

//       const data = new FormData();
//       data.append('customer_name', (formData.CustomerName || '').trim());
//       data.append('father_name',   (formData.FathersName  || '').trim());
//       data.append('address',       (formData.address      || '').trim());
//       data.append('user_id',       userId);

//       // map chassis -> tractor_number
//       data.append('tractor_number', (formData.chassisNo || '').trim());
//       data.append('engine_number',  (formData.engineNo  || '').trim());

//       const docType = formData.documentType === 'Other'
//         ? (formData.otherDocumentType || '').trim()
//         : (formData.documentType || '').trim();
//       data.append('document_type', docType);
//       data.append('document_number', (formData.DocumentNumber || '').trim());

//       // "YYYY-MM-DD HH:mm:ss"
//       const now = new Date();
//       const submittedAt =
//         `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')} ` +
//         `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`;
//       data.append('submitted_at', submittedAt);

//       if (customerSignature?.uri) {
//         data.append('customer_signature', {
//           uri: customerSignature.uri,
//           type: customerSignature.type || 'image/jpeg',
//           name: customerSignature.fileName || 'customer_signature.jpg',
//         });
//       }
//       if (managerSignature?.uri) {
//         data.append('manager_signature', {
//           uri: managerSignature.uri,
//           type: managerSignature.type || 'image/jpeg',
//           name: managerSignature.fileName || 'manager_signature.jpg',
//         });
//       }

//       const response = await axios.post(
//         'https://argosmob.uk/makroo/public/api/v1/delivery-forms',
//         data,
//         {
//           headers: { 'Content-Type': 'multipart/form-data' },
//           maxBodyLength: Infinity,
//         }
//       );

//       setApiResponse(response.data);

//       // ✅ Clear the form + images
//       setFormData(initialFormData);
//       setCustomerSignature(null);
//       setManagerSignature(null);

//       // Optional: scroll to top so the user sees the cleared form/header
//       if (scrollRef.current?.scrollTo) {
//         scrollRef.current.scrollTo({ y: 0, animated: true });
//       }

//       Alert.alert('Success', 'Form submitted successfully!');
//       console.log('API Response:', JSON.stringify(response.data, null, 2));
//     } catch (error) {
//       const msg = error?.response?.data ?? error?.message ?? 'Unknown error';
//       setApiError(msg);
//       Alert.alert('Error', 'Failed to submit the form. Please try again.');
//       console.error('API Error:', msg);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleHome = () => navigation.navigate('Dashboard');
//   const handleDateIconPress = () => setShowDatePicker(true);

//   const renderModelItem = ({item}) => (
//     <TouchableOpacity style={styles.modelItem} onPress={() => handleModelSelect(item)}>
//       <Text style={styles.modelItemText}>{item}</Text>
//     </TouchableOpacity>
//   );
//   const renderDocumentTypeItem = ({item}) => (
//     <TouchableOpacity style={styles.modelItem} onPress={() => handleDocumentTypeSelect(item)}>
//       <Text style={styles.modelItemText}>{item}</Text>
//     </TouchableOpacity>
//   );

//   return (
//     <View style={{flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom}}>
//       {/* Header */}
//       <LinearGradient colors={['#7E5EA9', '#20AEBC']} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={styles.header}>
//          <View style={styles.headerContent}>
//                                     {/* Left Side: Menu Icon */}
//                                     <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Hamburger')}>
//                                       <Icon name="reorder" size={25} color="#fff" />
//                                     </TouchableOpacity>
                          
//                                     {/* Center: Dashboard Text */}
//                                     <View>
//                                       <Text style={styles.companyName}>Makroo Motor Corp.</Text>
//                                       <Text style={styles.companyName1}>Form</Text>
//                                     </View>
                          
//                                     {/* Right Side: Icon */}
//                                     <TouchableOpacity style={styles.iconButton}>
//                                       <Icon name="notifications-on" size={25} color="#fff" />
//                                     </TouchableOpacity>
//                                   </View>
       
//       </LinearGradient>

//       <ScrollView style={styles.container} ref={scrollRef}>
//         <Text style={styles.Date}>09-08-25</Text>
//         <Text style={styles.formNo}>Form</Text>

//         {/* Form Fields */}
//         <View style={styles.formContainer}>
//           <View style={styles.row}>
//             <View style={styles.inputContainer}>
//               <LinearGradient colors={['#7E5EA9', '#20AEBC']} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={styles.inputGradient}>
//                 <TextInput
//                   style={styles.input}
//                   value={formData.CustomerName}
//                   onChangeText={text => handleInputChange('CustomerName', text)}
//                   placeholder="Customer Name"
//                    placeholderTextColor="#666"

//                 />
//               </LinearGradient>
//             </View>
//             <View style={styles.inputContainer}>
//               <LinearGradient colors={['#7E5EA9', '#20AEBC']} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={styles.inputGradient}>
//                 <TextInput
//                   style={styles.input}
//                   value={formData.FathersName}
//                   onChangeText={text => handleInputChange('FathersName', text)}
//                   placeholder="Father's Name"
//                    placeholderTextColor="#666"

//                 />
//               </LinearGradient>
//             </View>
//           </View>

//           <View style={styles.row}>
//             <View style={styles.inputContainer}>
//               <LinearGradient colors={['#7E5EA9', '#20AEBC']} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={styles.inputGradient}>
//                 <TextInput
//                   style={styles.input}
//                   value={formData.address}
//                   onChangeText={text => handleInputChange('address', text)}
//                   placeholder="Address"
//                    placeholderTextColor="#666"

//                 />
//               </LinearGradient>
//             </View>
//           </View>

//           <View style={styles.row}>
//             {/* <View style={styles.inputContainer}>
//               <LinearGradient colors={['#7E5EA9', '#20AEBC']} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={styles.inputGradient}>
//                 <TextInput
//                   style={styles.input}
//                   value={formData.mobileNo}
//                   onChangeText={text => handleInputChange('mobileNo', text)}
//                   placeholder="Mobile Number"
//                    placeholderTextColor="#666"

//                   keyboardType="phone-pad"
//                 />
//               </LinearGradient>
//             </View> */}

//             <View style={styles.inputContainer}>
//               <LinearGradient colors={['#7E5EA9', '#20AEBC']} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={styles.inputGradient}>
//                 <TextInput
//                   style={styles.input}
//                   value={formData.TractorName}
//                   onChangeText={text => handleInputChange('TractorNumber', text)}
//                   placeholder="Tractor Name"
//                    placeholderTextColor="#666"

//                 />
//               </LinearGradient>
//             </View>
//           </View>

//           {/* <View style={styles.row}>
//             <View style={styles.inputContainer}>
//               <LinearGradient colors={['#7E5EA9', '#20AEBC']} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={styles.inputGradient}>
//                 <TouchableOpacity style={styles.input} onPress={() => setShowModelDropdown(true)}>
//                   <Text style={formData.tractorModel ? styles.selectedModelText : styles.placeholderText}>
//                     {formData.tractorModel || 'Select Tractor Model'}
//                   </Text>
//                   <Icon name="keyboard-arrow-down" size={25} color="#666" style={styles.dropdownIcon}/>
//                 </TouchableOpacity>
//               </LinearGradient>
//             </View>
//           </View> */}

//           <View style={styles.row}>
//             <View style={styles.inputContainer}>
//               <LinearGradient colors={['#7E5EA9', '#20AEBC']} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={styles.inputGradient}>
//                 <View style={styles.inputWithIcon}>
//                   <TextInput
//                     style={[styles.input, styles.inputWithIconField]}
//                     value={formData.chassisNo}
//                     onChangeText={text => handleInputChange('chassisNo', text)}
//                     placeholder="Chassis Number"
//                    placeholderTextColor="#666"

//                   />
//                 </View>
//               </LinearGradient>
//             </View>
//           </View>

//           <View style={styles.row}>
//             <View style={styles.inputContainer}>
//               <LinearGradient colors={['#7E5EA9', '#20AEBC']} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={styles.inputGradient}>
//                 <View style={styles.inputWithIcon}>
//                   <TextInput
//                     style={[styles.input, styles.inputWithIconField]}
//                     value={formData.engineNo}
//                     onChangeText={text => handleInputChange('engineNo', text)}
//                     placeholder="Engine Number"
//                    placeholderTextColor="#666"

//                   />
//                 </View>
//               </LinearGradient>
//             </View>

//             {/* <View style={styles.inputContainer}>
//               <LinearGradient colors={['#7E5EA9', '#20AEBC']} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={styles.inputGradient}>
//                 <TextInput
//                   style={styles.input}
//                   value={formData.YearofManufacture}
//                   onChangeText={text => handleInputChange('YearofManufacture', text)}
//                   placeholder="Year of Manufacture"
//                    placeholderTextColor="#666"

//                 />
//               </LinearGradient>
//             </View> */}
//           </View>

//           <View style={styles.row}>
//             <View style={styles.inputContainer}>
//               <LinearGradient colors={['#7E5EA9', '#20AEBC']} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={styles.inputGradient}>
//                 <TouchableOpacity style={styles.input} onPress={() => setShowDocumentTypeDropdown(true)}>
//                   <Text style={formData.documentType ? styles.selectedModelText : styles.placeholderText}>
//                     {formData.documentType || 'Document Type'}
//                   </Text>
//                   <Icon name="keyboard-arrow-down" size={25} color="#666" style={styles.dropdownIcon}/>
//                 </TouchableOpacity>
//               </LinearGradient>
//             </View>

//             <View style={styles.inputContainer}>
//               <LinearGradient colors={['#7E5EA9', '#20AEBC']} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={styles.inputGradient}>
//                 <TextInput
//                   style={styles.input}
//                   value={formData.DocumentNumber}
//                   onChangeText={text => handleInputChange('DocumentNumber', text)}
//                   placeholder="Document Number"
//                    placeholderTextColor="#666"

//                 />
//               </LinearGradient>
//             </View>
//           </View>

//           {formData.documentType === 'Other' && (
//             <View style={styles.row}>
//               <View style={styles.inputContainer}>
//                 <LinearGradient colors={['#7E5EA9', '#20AEBC']} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={styles.inputGradient}>
//                   <TextInput
//                     style={styles.input}
//                     value={formData.otherDocumentType}
//                     onChangeText={text => handleInputChange('otherDocumentType', text)}
//                     placeholder="Specify Document Type"
//                    placeholderTextColor="#666"

//                   />
//                 </LinearGradient>
//               </View>
//             </View>
//           )}
//         </View>

//         {/* Tractor Model Dropdown Modal */}
//         <Modal visible={showModelDropdown} transparent animationType="slide" onRequestClose={() => setShowModelDropdown(false)}>
//           <View style={styles.modalOverlay}>
//             <View style={styles.modalContent}>
//               <View style={styles.modalHeader}>
//                 <Text style={styles.modalTitle}>Select Tractor Model</Text>
//                 <TouchableOpacity onPress={() => setShowModelDropdown(false)} style={styles.closeButton}>
//                   <Icon name="close" size={24} color="#000" />
//                 </TouchableOpacity>
//               </View>
//               <FlatList
//                 data={tractorModels}
//                 renderItem={renderModelItem}
//                 keyExtractor={(item, index) => index.toString()}
//                 style={styles.modelList}
//                 showsVerticalScrollIndicator
//               />
//             </View>
//           </View>
//         </Modal>

//         {/* Document Type Dropdown Modal */}
//         <Modal visible={showDocumentTypeDropdown} transparent animationType="slide" onRequestClose={() => setShowDocumentTypeDropdown(false)}>
//           <View style={styles.modalOverlay}>
//             <View style={styles.modalContent}>
//               <View style={styles.modalHeader}>
//                 <Text style={styles.modalTitle}>Select Document Type</Text>
//                 <TouchableOpacity onPress={() => setShowDocumentTypeDropdown(false)} style={styles.closeButton}>
//                   <Icon name="close" size={24} color="#000" />
//                 </TouchableOpacity>
//               </View>
//               <FlatList
//                 data={documentTypes}
//                 renderItem={renderDocumentTypeItem}
//                 keyExtractor={(item, index) => index.toString()}
//                 style={styles.modelList}
//                 showsVerticalScrollIndicator
//               />
//             </View>
//           </View>
//         </Modal>

//         {/* Photo and Signatures */}
//         <View style={styles.photoSignatureSection}>
//           <TouchableOpacity style={styles.photoSignatureBox1} onPress={() => showImagePickerOptions(setCustomerSignature)}>
//             {customerSignature ? (
//               <Image source={{ uri: customerSignature.uri }} style={styles.previewImage} resizeMode="contain" />
//             ) : (
//               <Text style={styles.photoSignatureText}>Customer Signature</Text>
//             )}
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.photoSignatureBox1} onPress={() => showImagePickerOptions(setManagerSignature)}>
//             {managerSignature ? (
//               <Image source={{ uri: managerSignature.uri }} style={styles.previewImage} resizeMode="contain" />
//             ) : (
//               <Text style={styles.photoSignatureText}>Manager Signature</Text>
//             )}
//           </TouchableOpacity>
//         </View>

//         {/* Buttons */}
//         <View style={styles.buttonContainer}>
//           <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={submitting}>
//             {submitting ? <ActivityIndicator /> : <Text style={styles.submitButtonText}>Submit</Text>}
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.homeButton} onPress={() => navigation.navigate('Dashboard')} disabled={submitting}>
//             <Text style={styles.homeButtonText}>Home</Text>
//           </TouchableOpacity>
//         </View>

//         {/* <TouchableOpacity style={styles.pdfButton} onPress={() => navigation.navigate('Pdfpage')} disabled={submitting}>
//           <Text style={styles.pdfButtonText}>Generate PDF</Text>
//         </TouchableOpacity> */}

       
//       </ScrollView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container:{ paddingHorizontal:15 },
//   header:{ paddingHorizontal:15, paddingVertical:10 },
//   companyName:{ fontSize:17, fontWeight:'600', color:'white', textAlign:'center',fontFamily: 'Inter_28pt-SemiBold' },
//   formNo:{ fontSize:13, marginVertical:10, fontFamily:'Inter_28pt-SemiBold', paddingHorizontal:5 },
//   Date:{ fontSize:12, textAlign:'right', marginVertical:5, fontFamily:'Inter_28pt-Regular', color:'#00000099', paddingRight:15 },
//   formContainer:{ marginBottom:15 },
//   row:{ marginBottom:0 },
//   inputContainer:{ flex:1, marginHorizontal:4, marginBottom:10 },
//   inputGradient:{ borderRadius:10, padding:1 },
//   input:{
//     borderRadius:10, backgroundColor:'#fff', padding:12, fontSize:14,
//     fontFamily:'Inter_28pt-Regular', flexDirection:'row', justifyContent:'space-between', alignItems:'center'
//   },
//   selectedModelText:{ fontSize:14, fontFamily:'Inter_28pt-Regular', color:'#000' },
//   placeholderText:{ fontSize:14, fontFamily:'Inter_28pt-Regular', color:'#666' },
//   dropdownIcon:{ marginLeft:8 },
//   inputWithIcon:{ flexDirection:'row', alignItems:'center' },
//   inputWithIconField:{ flex:1 },
//   modalOverlay:{ flex:1, backgroundColor:'rgba(0,0,0,0.5)', justifyContent:'center', alignItems:'center' },
//   modalContent:{ backgroundColor:'white', borderRadius:10, width:'90%', maxHeight:'70%', overflow:'hidden' },
//   modalHeader:{ flexDirection:'row', justifyContent:'space-between', alignItems:'center', padding:15, borderBottomWidth:1, borderBottomColor:'#e0e0e0' },
//   modalTitle:{ fontSize:16, fontWeight:'bold', fontFamily:'Inter_28pt-SemiBold' },
//   closeButton:{ padding:4 },
//   modelList:{ maxHeight:300 },
//   modelItem:{ padding:15, borderBottomWidth:1, borderBottomColor:'#f0f0f0' },
//   modelItemText:{ fontSize:14, fontFamily:'Inter_28pt-Regular', color:'#333' },
//   photoSignatureSection:{},
//   photoSignatureBox1:{
//     width:'100%', height:50, borderWidth:1, borderColor:'#00000080', borderRadius:10,
//     justifyContent:'center', alignItems:'center', marginBottom:20, borderStyle:'dashed'
//   },
//   photoSignatureText:{ fontSize:13, textAlign:'center', marginTop:2, color:'#00000099', fontFamily:'Inter_28pt-Medium' },
//   previewImage:{ width:'100%', height:'100%', borderRadius:10 },
//   buttonContainer:{ marginTop:20 },
//   submitButton:{ backgroundColor:'#7E5EA9', padding:15, borderRadius:10, alignItems:'center', marginBottom:10 },
//   submitButtonText:{ color:'#fff', fontFamily:'Inter_28pt-SemiBold', fontSize:14 },
//   homeButton:{ backgroundColor:'#20AEBC', padding:15, borderRadius:10, alignItems:'center', marginBottom:10 },
//   homeButtonText:{ color:'#fff', fontFamily:'Inter_28pt-SemiBold', fontSize:14 },
//   pdfButton:{ backgroundColor:'#7E5EA9', padding:15, borderRadius:10, alignItems:'center', marginBottom:20 },
//   pdfButtonText:{ color:'#fff', fontFamily:'Inter_28pt-SemiBold', fontSize:14 },
//     headerContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
//      companyName1:{ fontSize:15, fontWeight:'500', color:'white', textAlign:'center',fontFamily: 'Inter_28pt-SemiBold' },
// });

// export default Form;






import React, {useRef, useState} from 'react';
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

const initialFormData = {
  CustomerName: '',
  FathersName: '',
  percentage: '',
  address: '',
  mobileNo: '',
  TractorName: '',
  tractorModel: '',
  date: null,
  YearofManufacture: '',
  chassisNo: '',       // mapped to tractor_number
  engineNo: '',
  DocumentNumber:'',
  documentType: '',
  otherDocumentType: '',
};

const Form = ({navigation}) => {
  const insets = useSafeAreaInsets();
  const scrollRef = useRef(null);

  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [showDocumentTypeDropdown, setShowDocumentTypeDropdown] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [apiResponse, setApiResponse] = useState(null);
  const [apiError, setApiError] = useState(null);

  const [formData, setFormData] = useState(initialFormData);

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

  const requestCameraPermission = async () => {
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
            const hasPermission = await requestCameraPermission();
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
              const hasPermission = await requestCameraPermission();
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
      { mediaType: 'photo', quality: 1, cameraType: 'back', saveToPhotos: true },
      (response) => {
        if (response?.didCancel) return;
        if (response?.assets?.length > 0) setImageFunction(response.assets[0]);
      }
    );
  };

  const handleImageLibrary = (setImageFunction) => {
    launchImageLibrary({ mediaType: 'photo', quality: 1 }, (response) => {
      if (response?.didCancel) return;
      if (response?.assets?.length > 0) setImageFunction(response.assets[0]);
    });
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
    if (selectedDate) handleInputChange('date', selectedDate);
  };

  // === API SUBMIT (uses AsyncStorage userId -> user_id) ===
  const handleSubmit = async () => {
    // Check if terms are accepted
    if (!acceptedTerms) {
      Alert.alert('Validation Error', 'Please accept all terms and conditions before submitting.');
      return;
    }

    setSubmitting(true);
    setApiResponse(null);
    setApiError(null);

    try {
      const storedUserId = await AsyncStorage.getItem('userId');
      const userId = (storedUserId || '').toString().trim();
      if (!userId) throw new Error('Missing userId in AsyncStorage.');

      const data = new FormData();
      data.append('customer_name', (formData.CustomerName || '').trim());
      data.append('father_name',   (formData.FathersName  || '').trim());
      data.append('address',       (formData.address      || '').trim());
      data.append('user_id',       userId);

      // map chassis -> tractor_number
      data.append('tractor_number', (formData.chassisNo || '').trim());
      data.append('engine_number',  (formData.engineNo  || '').trim());

      const docType = formData.documentType === 'Other'
        ? (formData.otherDocumentType || '').trim()
        : (formData.documentType || '').trim();
      data.append('document_type', docType);
      data.append('document_number', (formData.DocumentNumber || '').trim());

      // "YYYY-MM-DD HH:mm:ss"
      const now = new Date();
      const submittedAt =
        `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')} ` +
        `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`;
      data.append('submitted_at', submittedAt);

      if (customerSignature?.uri) {
        data.append('customer_signature', {
          uri: customerSignature.uri,
          type: customerSignature.type || 'image/jpeg',
          name: customerSignature.fileName || 'customer_signature.jpg',
        });
      }
      if (managerSignature?.uri) {
        data.append('manager_signature', {
          uri: managerSignature.uri,
          type: managerSignature.type || 'image/jpeg',
          name: managerSignature.fileName || 'manager_signature.jpg',
        });
      }

      const response = await axios.post(
        'https://argosmob.uk/makroo/public/api/v1/delivery-forms',
        data,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          maxBodyLength: Infinity,
        }
      );

      setApiResponse(response.data);

      // ✅ Clear the form + images
      setFormData(initialFormData);
      setCustomerSignature(null);
      setManagerSignature(null);
      setAcceptedTerms(false);

      // Optional: scroll to top so the user sees the cleared form/header
      if (scrollRef.current?.scrollTo) {
        scrollRef.current.scrollTo({ y: 0, animated: true });
      }

      Alert.alert('Success', 'Form submitted successfully!');
      console.log('API Response:', JSON.stringify(response.data, null, 2));
    } catch (error) {
      const msg = error?.response?.data ?? error?.message ?? 'Unknown error';
      setApiError(msg);
      Alert.alert('Error', 'Failed to submit the form. Please try again.');
      console.error('API Error:', msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleHome = () => navigation.navigate('Dashboard');
  const handleDateIconPress = () => setShowDatePicker(true);

  const renderModelItem = ({item}) => (
    <TouchableOpacity style={styles.modelItem} onPress={() => handleModelSelect(item)}>
      <Text style={styles.modelItemText}>{item}</Text>
    </TouchableOpacity>
  );
  const renderDocumentTypeItem = ({item}) => (
    <TouchableOpacity style={styles.modelItem} onPress={() => handleDocumentTypeSelect(item)}>
      <Text style={styles.modelItemText}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={{flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom}}>
      {/* Header */}
      <LinearGradient colors={['#7E5EA9', '#20AEBC']} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={styles.header}>
         <View style={styles.headerContent}>
           {/* Left Side: Menu Icon */}
           <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Hamburger')}>
             <Icon name="reorder" size={25} color="#fff" />
           </TouchableOpacity>
 
           {/* Center: Dashboard Text */}
           <View>
             <Text style={styles.companyName}>Makroo Motor Corp.</Text>
             <Text style={styles.companyName1}>Form</Text>
           </View>
 
           {/* Right Side: Icon */}
           <TouchableOpacity style={styles.iconButton}>
             <Icon name="notifications-on" size={25} color="#fff" />
           </TouchableOpacity>
         </View>
      </LinearGradient>

      <ScrollView style={styles.container} ref={scrollRef}>
        <Text style={styles.Date}>{new Date().toLocaleDateString()}</Text>
        <Text style={styles.formNo}>Delivery Form</Text>

        {/* Form Fields */}
        <View style={styles.formContainer}>
          <View style={styles.row}>
            <View style={styles.inputContainer}>
              <LinearGradient colors={['#7E5EA9', '#20AEBC']} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={styles.inputGradient}>
                <TextInput
                  style={styles.input}
                  value={formData.CustomerName}
                  onChangeText={text => handleInputChange('CustomerName', text)}
                  placeholder="Customer Name"
                  placeholderTextColor="#666"
                />
              </LinearGradient>
            </View>
            <View style={styles.inputContainer}>
              <LinearGradient colors={['#7E5EA9', '#20AEBC']} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={styles.inputGradient}>
                <TextInput
                  style={styles.input}
                  value={formData.FathersName}
                  onChangeText={text => handleInputChange('FathersName', text)}
                  placeholder="Father's Name"
                  placeholderTextColor="#666"
                />
              </LinearGradient>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.inputContainer}>
              <LinearGradient colors={['#7E5EA9', '#20AEBC']} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={styles.inputGradient}>
                <TextInput
                  style={styles.input}
                  value={formData.address}
                  onChangeText={text => handleInputChange('address', text)}
                  placeholder="Address"
                  placeholderTextColor="#666"
                />
              </LinearGradient>
            </View>
          </View>

          {/* <View style={styles.row}>
            <View style={styles.inputContainer}>
              <LinearGradient colors={['#7E5EA9', '#20AEBC']} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={styles.inputGradient}>
                <TextInput
                  style={styles.input}
                  value={formData.TractorName}
                  onChangeText={text => handleInputChange('TractorName', text)}
                  placeholder="Tractor Name"
                  placeholderTextColor="#666"
                />
              </LinearGradient>
            </View>
          </View> */}

          <View style={styles.row}>
            <View style={styles.inputContainer}>
              <LinearGradient colors={['#7E5EA9', '#20AEBC']} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={styles.inputGradient}>
                <View style={styles.inputWithIcon}>
                  <TextInput
                    style={[styles.input, styles.inputWithIconField]}
                    value={formData.chassisNo}
                    onChangeText={text => handleInputChange('chassisNo', text)}
                    placeholder="Tractor Name"
                    placeholderTextColor="#666"
                  />
                </View>
              </LinearGradient>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.inputContainer}>
              <LinearGradient colors={['#7E5EA9', '#20AEBC']} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={styles.inputGradient}>
                <View style={styles.inputWithIcon}>
                  <TextInput
                    style={[styles.input, styles.inputWithIconField]}
                    value={formData.engineNo}
                    onChangeText={text => handleInputChange('engineNo', text)}
                    placeholder="Engine Number"
                    placeholderTextColor="#666"
                  />
                </View>
              </LinearGradient>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.inputContainer}>
              <LinearGradient colors={['#7E5EA9', '#20AEBC']} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={styles.inputGradient}>
                <TouchableOpacity style={styles.input} onPress={() => setShowDocumentTypeDropdown(true)}>
                  <Text style={formData.documentType ? styles.selectedModelText : styles.placeholderText}>
                    {formData.documentType || 'Document Type'}
                  </Text>
                  <Icon name="keyboard-arrow-down" size={25} color="#666" style={styles.dropdownIcon}/>
                </TouchableOpacity>
              </LinearGradient>
            </View>

            <View style={styles.inputContainer}>
              <LinearGradient colors={['#7E5EA9', '#20AEBC']} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={styles.inputGradient}>
                <TextInput
                  style={styles.input}
                  value={formData.DocumentNumber}
                  onChangeText={text => handleInputChange('DocumentNumber', text)}
                  placeholder="Document Number"
                  placeholderTextColor="#666"
                />
              </LinearGradient>
            </View>
          </View>

          {formData.documentType === 'Other' && (
            <View style={styles.row}>
              <View style={styles.inputContainer}>
                <LinearGradient colors={['#7E5EA9', '#20AEBC']} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={styles.inputGradient}>
                  <TextInput
                    style={styles.input}
                    value={formData.otherDocumentType}
                    onChangeText={text => handleInputChange('otherDocumentType', text)}
                    placeholder="Specify Document Type"
                    placeholderTextColor="#666"
                  />
                </LinearGradient>
              </View>
            </View>
          )}
        </View>

        {/* Tractor Model Dropdown Modal */}
        <Modal visible={showModelDropdown} transparent animationType="slide" onRequestClose={() => setShowModelDropdown(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Tractor Model</Text>
                <TouchableOpacity onPress={() => setShowModelDropdown(false)} style={styles.closeButton}>
                  <Icon name="close" size={24} color="#000" />
                </TouchableOpacity>
              </View>
              <FlatList
                data={tractorModels}
                renderItem={renderModelItem}
                keyExtractor={(item, index) => index.toString()}
                style={styles.modelList}
                showsVerticalScrollIndicator
              />
            </View>
          </View>
        </Modal>

        {/* Document Type Dropdown Modal */}
        <Modal visible={showDocumentTypeDropdown} transparent animationType="slide" onRequestClose={() => setShowDocumentTypeDropdown(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Document Type</Text>
                <TouchableOpacity onPress={() => setShowDocumentTypeDropdown(false)} style={styles.closeButton}>
                  <Icon name="close" size={24} color="#000" />
                </TouchableOpacity>
              </View>
              <FlatList
                data={documentTypes}
                renderItem={renderDocumentTypeItem}
                keyExtractor={(item, index) => index.toString()}
                style={styles.modelList}
                showsVerticalScrollIndicator
              />
            </View>
          </View>
        </Modal>

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
            onPress={() => setAcceptedTerms(!acceptedTerms)}
            disabled={submitting}
          >
            <View style={[styles.checkbox, acceptedTerms && styles.checkboxChecked]}>
              {acceptedTerms && <Icon name="check" size={16} color="#fff" />}
            </View>
            <Text style={styles.checkboxLabel}>Accept All Terms And Conditions</Text>
          </TouchableOpacity>
        </View>

        {/* Photo and Signatures */}
        <View style={styles.photoSignatureSection}>
          <TouchableOpacity style={styles.photoSignatureBox1} onPress={() => showImagePickerOptions(setCustomerSignature)}>
            {customerSignature ? (
              <Image source={{ uri: customerSignature.uri }} style={styles.previewImage} resizeMode="contain" />
            ) : (
              <Text style={styles.photoSignatureText}>Customer Signature</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.photoSignatureBox1} onPress={() => showImagePickerOptions(setManagerSignature)}>
            {managerSignature ? (
              <Image source={{ uri: managerSignature.uri }} style={styles.previewImage} resizeMode="contain" />
            ) : (
              <Text style={styles.photoSignatureText}>Manager Signature</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.submitButton, (!acceptedTerms || submitting) && styles.disabledButton]} 
            onPress={handleSubmit} 
            disabled={!acceptedTerms || submitting}
          >
            {submitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>Submit</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.homeButton} onPress={() => navigation.navigate('Dashboard')} disabled={submitting}>
            <Text style={styles.homeButtonText}>Home</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    paddingHorizontal: 15 
  },
  header: { 
    paddingHorizontal: 15, 
    paddingVertical: 10 
  },
  companyName: { 
    fontSize: 17, 
    fontWeight: '600', 
    color: 'white', 
    textAlign: 'center', 
    fontFamily: 'Inter_28pt-SemiBold' 
  },
  formNo: { 
    fontSize: 13, 
    marginVertical: 10, 
    fontFamily: 'Inter_28pt-SemiBold', 
    paddingHorizontal: 5 
  },
  Date: { 
    fontSize: 12, 
    textAlign: 'right', 
    marginVertical: 5, 
    fontFamily: 'Inter_28pt-Regular', 
    color: '#00000099', 
    paddingRight: 15 
  },
  formContainer: { 
    marginBottom: 15 
  },
  row: { 
    marginBottom: 0 
  },
  inputContainer: { 
    flex: 1, 
    marginHorizontal: 4, 
    marginBottom: 10 
  },
  inputGradient: { 
    borderRadius: 10, 
    padding: 1 
  },
  input: {
    borderRadius: 10, 
    backgroundColor: '#fff', 
    padding: 12, 
    fontSize: 14,
    fontFamily: 'Inter_28pt-Regular', 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center'
  },
  selectedModelText: { 
    fontSize: 14, 
    fontFamily: 'Inter_28pt-Regular', 
    color: '#000' 
  },
  placeholderText: { 
    fontSize: 14, 
    fontFamily: 'Inter_28pt-Regular', 
    color: '#666' 
  },
  dropdownIcon: { 
    marginLeft: 8 
  },
  inputWithIcon: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  inputWithIconField: { 
    flex: 1 
  },
  modalOverlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.5)', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  modalContent: { 
    backgroundColor: 'white', 
    borderRadius: 10, 
    width: '90%', 
    maxHeight: '70%', 
    overflow: 'hidden' 
  },
  modalHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: 15, 
    borderBottomWidth: 1, 
    borderBottomColor: '#e0e0e0' 
  },
  modalTitle: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    fontFamily: 'Inter_28pt-SemiBold' 
  },
  closeButton: { 
    padding: 4 
  },
  modelList: { 
    maxHeight: 300 
  },
  modelItem: { 
    padding: 15, 
    borderBottomWidth: 1, 
    borderBottomColor: '#f0f0f0' 
  },
  modelItemText: { 
    fontSize: 14, 
    fontFamily: 'Inter_28pt-Regular', 
    color: '#333' 
  },
  // Terms and Conditions Styles
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
    fontFamily: 'Inter_28pt-SemiBold',
    color: '#000',
    marginBottom: 10,
  },
  termsList: {
    marginBottom: 15,
  },
  termItem: {
    fontSize: 12.5,
    fontFamily: 'Inter_28pt-Regular',
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
    fontFamily: 'Inter_28pt-Medium',
    color: '#000',
  },
  photoSignatureSection: {},
  photoSignatureBox1: {
    width: '100%', 
    height: 50, 
    borderWidth: 1, 
    borderColor: '#00000080', 
    borderRadius: 10,
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: 20, 
    borderStyle: 'dashed'
  },
  photoSignatureText: { 
    fontSize: 13, 
    textAlign: 'center', 
    marginTop: 2, 
    color: '#00000099', 
    fontFamily: 'Inter_28pt-Medium' 
  },
  previewImage: { 
    width: '100%', 
    height: '100%', 
    borderRadius: 10 
  },
  buttonContainer: { 
    marginTop: 20 
  },
  submitButton: { 
    backgroundColor: '#7E5EA9', 
    padding: 15, 
    borderRadius: 10, 
    alignItems: 'center', 
    marginBottom: 10 
  },
  submitButtonText: { 
    color: '#fff', 
    fontFamily: 'Inter_28pt-SemiBold', 
    fontSize: 14 
  },
  homeButton: { 
    backgroundColor: '#20AEBC', 
    padding: 15, 
    borderRadius: 10, 
    alignItems: 'center', 
    marginBottom: 10 
  },
  homeButtonText: { 
    color: '#fff', 
    fontFamily: 'Inter_28pt-SemiBold', 
    fontSize: 14 
  },
  disabledButton: {
    opacity: 0.6,
  },
  headerContent: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between' 
  },
  companyName1: { 
    fontSize: 15, 
    fontWeight: '500', 
    color: 'white', 
    textAlign: 'center', 
    fontFamily: 'Inter_28pt-SemiBold' 
  },
});

export default Form;