// import React, {useState, useEffect, useCallback} from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   StatusBar,
//   ScrollView,
//   TextInput,
//   Alert,
//   Dimensions,
//   Platform,
//   FlatList,
//   Modal,
//   ActivityIndicator,
// } from 'react-native';
// import LinearGradient from 'react-native-linear-gradient';
// import {useSafeAreaInsets} from 'react-native-safe-area-context';
// import Icon from 'react-native-vector-icons/Feather';
// import Icon1 from 'react-native-vector-icons/FontAwesome';
// import Icon2 from 'react-native-vector-icons/MaterialIcons';
// import DateTimePicker from '@react-native-community/datetimepicker';
// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const {width, height} = Dimensions.get('window');

// // Responsive scaling functions
// const scale = size => (width / 375) * size;
// const verticalScale = size => (height / 812) * size;
// const moderateScale = (size, factor = 0.5) =>
//   size + (scale(size) - size) * factor;

// const Addcustomerpayment = ({navigation, route}) => {
//   const insets = useSafeAreaInsets();

//   // Check if we're in edit mode
//   const isEditMode = route.params?.payment ? true : false;
//   const paymentData = route.params?.payment || {};

//   console.log('payment Data', paymentData);

//   // State for form fields - matching Customerpaymentdetails structure
//   const [formData, setFormData] = useState({
//     id: '',
//     user_id: '',
//     entry_by: '',
//     entry_date: new Date(),
//     ledger_no: '',
//     customer_name: '',
//     father_name: '',
//     customer_mobile: '',
//     customer_address: '',
//     tractor_model: '',
//     delivery_date: new Date(),
//     chassis_no: '',
//     opening_balance: '',
//     total_paid: '',
//     status: 'pending',

//     // Payment history arrays - will be populated from API
//     entry_dates: [],
//     entries_by: [],
//     amounts: [],
//     payment_remarks: [],
//   });

//   // Tractor models from API
//   const [tractorModels, setTractorModels] = useState([]);
//   const [loadingTractorModels, setLoadingTractorModels] = useState(false);
//   const [showTractorModelDropdown, setShowTractorModelDropdown] =
//     useState(false);
//   const [hasFetchedTractorModels, setHasFetchedTractorModels] = useState(false);

//   // Payment history states
//   const [showPaymentHistoryModal, setShowPaymentHistoryModal] = useState(false);
//   const [isAddingPaymentHistory, setIsAddingPaymentHistory] = useState(false);
//   const [newPaymentHistory, setNewPaymentHistory] = useState({
//     entry_date: new Date(),
//     entry_by: '',
//     amount: '',
//     payment_remarks: '',
//   });
//   const [showPaymentDatePicker, setShowPaymentDatePicker] = useState(false);

//   // General states
//   const [showDatePicker, setShowDatePicker] = useState(false);
//   const [showDeliveryDatePicker, setShowDeliveryDatePicker] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [isInitialized, setIsInitialized] = useState(false);

//   // API Base URL
//   const API_BASE_URL = 'https://argosmob.uk/makroo/public/api/v1';

//   // Fetch tractor models from API - wrapped in useCallback to prevent recreation
//   const fetchTractorModels = useCallback(async () => {
//     // Don't fetch if already fetched
//     if (hasFetchedTractorModels) {
//       return;
//     }

//     try {
//       setLoadingTractorModels(true);
//       const response = await axios.get(`${API_BASE_URL}/model/tractor-models`);

//       if (response.data && response.data.data) {
//         // Extract model names from response
//         const models = response.data.data.map(
//           item => item.name || item.model_name || item.tractor_model || item,
//         );
//         setTractorModels(models);
//         setHasFetchedTractorModels(true);
//       } else {
//         // Fallback to some common models if API fails
//         setTractorModels([
//           'Swaraj 744 FE',
//           'Swaraj 735 FE',
//           'Swaraj 855 FE',
//           'Mahindra 575 DI',
//           'Mahindra 475 DI',
//           'John Deere 5050D',
//           'John Deere 5310',
//           'Eicher 485',
//         ]);
//         setHasFetchedTractorModels(true);
//       }
//     } catch (error) {
//       console.log('Error fetching tractor models:', error);
//       // Fallback models
//       setTractorModels([
//         'Swaraj 744 FE',
//         'Swaraj 735 FE',
//         'Swaraj 855 FE',
//         'Mahindra 575 DI',
//         'Mahindra 475 DI',
//         'John Deere 5050D',
//         'John Deere 5310',
//         'Eicher 485',
//       ]);
//       setHasFetchedTractorModels(true);
//     } finally {
//       setLoadingTractorModels(false);
//     }
//   }, [hasFetchedTractorModels]);

//   // Update form data
//   const updateFormData = useCallback((field, value) => {
//     setFormData(prev => ({
//       ...prev,
//       [field]: value,
//     }));
//   }, []);

//   // Initialize form with payment data if in edit mode
//   useEffect(() => {
//     // Fetch tractor models on component mount
//     fetchTractorModels();

//     // Prevent infinite re-renders by checking if already initialized
//     if (isInitialized) return;

//     if (isEditMode && paymentData) {
//       setFormData(prev => ({
//         ...prev,
//         id: paymentData.id || '',
//         user_id: paymentData.user_id || '',
//         entry_by: paymentData.entry_by || '',
//         entry_date: paymentData.entry_date
//           ? new Date(paymentData.entry_date)
//           : new Date(),
//         ledger_no: paymentData.ledger_no || '',
//         customer_name: paymentData.customer_name || '',
//         father_name: paymentData.father_name || '',
//         customer_mobile: paymentData.customer_mobile || '',
//         customer_address: paymentData.customer_address || '',
//         tractor_model: paymentData.tractor_model || '',
//         delivery_date: paymentData.delivery_date
//           ? new Date(paymentData.delivery_date)
//           : new Date(),
//         chassis_no: paymentData.chassis_no || '',
//         opening_balance: paymentData.opening_balance || '',
//         total_paid: paymentData.total_paid || '',
//         status: 'pending', // Reset status to pending when editing

//         // Initialize arrays from payment data or empty arrays
//         entry_dates: paymentData.entry_dates || [],
//         entries_by: paymentData.entries_by || [],
//         amounts: paymentData.amounts || [],
//         payment_remarks: paymentData.payment_remarks || [],
//       }));
//     }
//     setIsInitialized(true);
//   }, [isEditMode, paymentData, isInitialized, fetchTractorModels]);

//   // Date change handlers
//   const onDateChange = useCallback(
//     (event, selectedDate) => {
//       setShowDatePicker(false);
//       if (selectedDate) {
//         updateFormData('entry_date', selectedDate);
//       }
//     },
//     [updateFormData],
//   );

//   const onDeliveryDateChange = useCallback(
//     (event, selectedDate) => {
//       setShowDeliveryDatePicker(false);
//       if (selectedDate) {
//         updateFormData('delivery_date', selectedDate);
//       }
//     },
//     [updateFormData],
//   );

//   const onPaymentDateChange = useCallback((event, selectedDate) => {
//     setShowPaymentDatePicker(false);
//     if (selectedDate) {
//       setNewPaymentHistory(prev => ({
//         ...prev,
//         entry_date: selectedDate,
//       }));
//     }
//   }, []);

//   // Format date for display
//   const formatDate = useCallback(date => {
//     if (date instanceof Date) {
//       return date.toLocaleDateString('en-GB');
//     }
//     return date;
//   }, []);

//   // Format date for API (YYYY-MM-DD)
//   const formatDateForAPI = useCallback(date => {
//     if (date instanceof Date) {
//       const year = date.getFullYear();
//       const month = String(date.getMonth() + 1).padStart(2, '0');
//       const day = String(date.getDate()).padStart(2, '0');
//       return `${year}-${month}-${day}`;
//     }
//     return date;
//   }, []);

//   // Calculate remaining payment
//   const remainingPayment =
//     (parseFloat(formData.opening_balance) || 0) -
//     (parseFloat(formData.total_paid) || 0);

//   // Handle tractor model selection
//   const handleTractorModelSelect = useCallback(
//     model => {
//       updateFormData('tractor_model', model);
//       setShowTractorModelDropdown(false);
//     },
//     [updateFormData],
//   );

//   // Handle adding new payment history entry
//   const handleAddPaymentHistory = useCallback(() => {
//     if (!newPaymentHistory.entry_by || !newPaymentHistory.amount) {
//       Alert.alert('Error', 'Please fill Entry By and Amount fields');
//       return;
//     }

//     const amount = parseFloat(newPaymentHistory.amount);
//     if (isNaN(amount) || amount <= 0) {
//       Alert.alert('Error', 'Please enter a valid amount');
//       return;
//     }

//     // Add to form data arrays
//     setFormData(prev => ({
//       ...prev,
//       entry_dates: [
//         ...prev.entry_dates,
//         formatDateForAPI(newPaymentHistory.entry_date),
//       ],
//       entries_by: [...prev.entries_by, newPaymentHistory.entry_by],
//       amounts: [...prev.amounts, amount],
//       payment_remarks: [
//         ...prev.payment_remarks,
//         newPaymentHistory.payment_remarks || '',
//       ],
//       total_paid: (parseFloat(prev.total_paid) + amount).toString(),
//     }));

//     // Reset new payment history form
//     setNewPaymentHistory({
//       entry_date: new Date(),
//       entry_by: '',
//       amount: '',
//       payment_remarks: '',
//     });

//     setIsAddingPaymentHistory(false);
//   }, [newPaymentHistory, formatDateForAPI]);

//   // Remove payment history entry
//   const removePaymentHistoryEntry = useCallback(index => {
//     setFormData(prev => {
//       const removedAmount = prev.amounts[index];
//       return {
//         ...prev,
//         entry_dates: prev.entry_dates.filter((_, i) => i !== index),
//         entries_by: prev.entries_by.filter((_, i) => i !== index),
//         amounts: prev.amounts.filter((_, i) => i !== index),
//         payment_remarks: prev.payment_remarks.filter((_, i) => i !== index),
//         total_paid: (
//           parseFloat(prev.total_paid) - parseFloat(removedAmount)
//         ).toString(),
//       };
//     });
//   }, []);

//   // Handle form submission with API - Save
//   const handleSavePayment = async () => {
//     // Basic validation
//     if (
//       !formData.customer_name ||
//       !formData.opening_balance ||
//       !formData.total_paid
//     ) {
//       Alert.alert('Error', 'Please fill in all required fields');
//       return;
//     }

//     const openingBalance = parseFloat(formData.opening_balance);
//     const totalPaid = parseFloat(formData.total_paid);

//     if (isNaN(openingBalance) || openingBalance <= 0) {
//       Alert.alert('Error', 'Please enter a valid opening balance');
//       return;
//     }

//     if (isNaN(totalPaid) || totalPaid < 0) {
//       Alert.alert('Error', 'Please enter a valid amount paid');
//       return;
//     }

//     if (totalPaid > openingBalance) {
//       Alert.alert(
//         'Error',
//         'Amount paid cannot be greater than opening balance',
//       );
//       return;
//     }

//     setLoading(true);

//     try {
//       const userId = await AsyncStorage.getItem('userId');
//       if (!userId) {
//         Alert.alert('Error', 'User not logged in. Please login again.');
//         setLoading(false);
//         return;
//       }

//       // Prepare payment history arrays
//       const paymentHistory = {
//         entry_dates: formData.entry_dates,
//         entries_by: formData.entries_by,
//         amounts: formData.amounts,
//         payment_remarks: formData.payment_remarks,
//       };

//       // If this is a new payment and total_paid has value but no history, create initial entry
//       if (!isEditMode && totalPaid > 0 && formData.entry_dates.length === 0) {
//         paymentHistory.entry_dates = [formatDateForAPI(new Date())];
//         paymentHistory.entries_by = [formData.entry_by || 'User'];
//         paymentHistory.amounts = [totalPaid];
//         paymentHistory.payment_remarks = ['Initial payment'];
//       }

//       // Prepare data for API
//       const apiData = {
//         user_id: parseInt(userId),
//         entry_by: formData.entry_by || '',
//         entry_date: formatDateForAPI(formData.entry_date),
//         ledger_no: formData.ledger_no || '',
//         customer_name: formData.customer_name,
//         father_name: formData.father_name || '',
//         customer_mobile: formData.customer_mobile || '',
//         customer_address: formData.customer_address || '',
//         tractor_model: formData.tractor_model || '',
//         delivery_date: formatDateForAPI(formData.delivery_date),
//         chassis_no: formData.chassis_no || '',
//         opening_balance: openingBalance,
//         total_paid: totalPaid,
//         status: 'pending', // Always set to pending for new/edited payments

//         // Include payment history arrays
//         ...paymentHistory,
//       };

//       let response;
//       let endpoint;

//       if (isEditMode) {
//         // Update API call
//         apiData.id = parseInt(formData.id);
//         endpoint = `${API_BASE_URL}/customer-payments/update`;
//       } else {
//         // Add API call
//         endpoint = `${API_BASE_URL}/customer-payments/add`;
//       }

//       response = await axios.post(endpoint, apiData, {
//         timeout: 30000,
//         headers: {
//           Accept: 'application/json',
//           'Content-Type': 'application/json',
//         },
//       });

//       if (response.data && response.data.status === 'success') {
//         Alert.alert(
//           'Success',
//           isEditMode
//             ? 'Customer payment updated successfully! Status reset to pending for admin approval.'
//             : 'Customer payment added successfully!',
//         );

//         // Reset form if not in edit mode
//         if (!isEditMode) {
//           setFormData({
//             user_id: '',
//             entry_by: '',
//             entry_date: new Date(),
//             ledger_no: '',
//             customer_name: '',
//             father_name: '',
//             customer_mobile: '',
//             customer_address: '',
//             tractor_model: '',
//             delivery_date: new Date(),
//             chassis_no: '',
//             opening_balance: '',
//             total_paid: '',
//             status: 'pending',
//             entry_dates: [],
//             entries_by: [],
//             amounts: [],
//             payment_remarks: [],
//           });
//           // Reset the fetched tractor models flag when creating new payment
//           setHasFetchedTractorModels(false);
//         }

//         // Navigate back to payment details with refresh
//         navigation.navigate('Customerpaymentdetails', {
//           refresh: true,
//         });
//       } else {
//         Alert.alert(
//           'Error',
//           response.data.message || 'Failed to process payment',
//         );
//       }
//     } catch (error) {
//       console.log('Error processing payment:', error);

//       if (error.response) {
//         Alert.alert(
//           'Error',
//           error.response.data?.message ||
//             `Server error: ${error.response.status}`,
//         );
//       } else if (error.request) {
//         Alert.alert(
//           'Network Error',
//           'Unable to connect to server. Please check your internet connection.',
//         );
//       } else {
//         Alert.alert('Error', 'An unexpected error occurred.');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Render tractor model dropdown
//   const renderTractorModelDropdown = () => (
//     <Modal
//       visible={showTractorModelDropdown}
//       transparent={true}
//       animationType="slide"
//       onRequestClose={() => setShowTractorModelDropdown(false)}>
//       <View style={styles.modalOverlay}>
//         <View style={styles.modalContent}>
//           <View style={styles.modalHeader}>
//             <Text style={styles.modalTitle}>Select Tractor Model</Text>
//             <TouchableOpacity
//               onPress={() => setShowTractorModelDropdown(false)}
//               style={styles.closeButton}>
//               <Icon2 name="close" size={moderateScale(24)} color="#000" />
//             </TouchableOpacity>
//           </View>

//           {loadingTractorModels ? (
//             <View style={styles.loadingContainer}>
//               <ActivityIndicator size="large" color="#7E5EA9" />
//               <Text style={styles.loadingText}>Loading tractor models...</Text>
//             </View>
//           ) : (
//             <FlatList
//               data={tractorModels}
//               renderItem={({item}) => (
//                 <TouchableOpacity
//                   style={styles.dropdownItem}
//                   onPress={() => handleTractorModelSelect(item)}>
//                   <Text style={styles.dropdownItemText}>{item}</Text>
//                 </TouchableOpacity>
//               )}
//               keyExtractor={(item, index) => index.toString()}
//               style={styles.dropdownList}
//             />
//           )}
//         </View>
//       </View>
//     </Modal>
//   );

//   // Render payment history modal
//   const renderPaymentHistoryModal = () => (
//     <Modal
//       visible={showPaymentHistoryModal}
//       animationType="slide"
//       transparent={true}
//       onRequestClose={() => setShowPaymentHistoryModal(false)}>
//       <View style={styles.paymentHistoryModalOverlay}>
//         <View style={styles.paymentHistoryModalContent}>
//           <View style={styles.paymentHistoryModalHeader}>
//             <Text style={styles.paymentHistoryModalTitle}>Payment History</Text>
//             <TouchableOpacity
//               onPress={() => setShowPaymentHistoryModal(false)}
//               style={styles.paymentHistoryCloseButton}>
//               <Icon2 name="close" size={moderateScale(24)} color="#000" />
//             </TouchableOpacity>
//           </View>

//           {formData.entry_dates && formData.entry_dates.length > 0 ? (
//             <FlatList
//               data={formData.entry_dates.map((date, index) => ({
//                 id: index.toString(),
//                 date,
//                 entry_by: formData.entries_by[index],
//                 amount: formData.amounts[index],
//                 remarks: formData.payment_remarks[index],
//               }))}
//               renderItem={({item, index}) => (
//                 <View style={styles.paymentHistoryItem}>
//                   <View style={styles.paymentHistoryItemHeader}>
//                     <Text style={styles.paymentHistoryAmount}>
//                       ₹{item.amount}
//                     </Text>
//                     <View style={styles.paymentHistoryActions}>
//                       <Text style={styles.paymentHistoryDate}>{item.date}</Text>
//                       <TouchableOpacity
//                         onPress={() => removePaymentHistoryEntry(index)}
//                         style={styles.removePaymentButton}>
//                         <Icon2
//                           name="delete"
//                           size={moderateScale(20)}
//                           color="#F44336"
//                         />
//                       </TouchableOpacity>
//                     </View>
//                   </View>
//                   <View style={styles.paymentHistoryDetails}>
//                     <Text style={styles.paymentHistoryBy}>
//                       By: {item.entry_by}
//                     </Text>
//                     {item.remarks && (
//                       <Text style={styles.paymentHistoryRemarks}>
//                         Remarks: {item.remarks}
//                       </Text>
//                     )}
//                   </View>
//                 </View>
//               )}
//               keyExtractor={item => item.id}
//               ListEmptyComponent={
//                 <Text style={styles.noPaymentHistory}>
//                   No payment history found
//                 </Text>
//               }
//             />
//           ) : (
//             <View style={styles.noPaymentHistoryContainer}>
//               <Icon2 name="history" size={moderateScale(60)} color="#ccc" />
//               <Text style={styles.noPaymentHistory}>
//                 No payment history available
//               </Text>
//             </View>
//           )}

//           {isEditMode && (
//             <TouchableOpacity
//               style={styles.addHistoryButton}
//               onPress={() => {
//                 setShowPaymentHistoryModal(false);
//                 setIsAddingPaymentHistory(true);
//               }}>
//               <LinearGradient
//                 colors={['#7E5EA9', '#20AEBC']}
//                 style={styles.addHistoryGradient}
//                 start={{x: 0, y: 0}}
//                 end={{x: 1, y: 0}}>
//                 <Icon2 name="add" size={moderateScale(20)} color="#FFF" />
//                 <Text style={styles.addHistoryText}>Add Payment History</Text>
//               </LinearGradient>
//             </TouchableOpacity>
//           )}
//         </View>
//       </View>
//     </Modal>
//   );

//   // Render add payment history form
//   const renderAddPaymentHistoryForm = () => (
//     <Modal
//       visible={isAddingPaymentHistory}
//       animationType="slide"
//       transparent={true}
//       onRequestClose={() => setIsAddingPaymentHistory(false)}>
//       <View style={styles.addPaymentModalOverlay}>
//         <View style={styles.addPaymentModalContent}>
//           <View style={styles.addPaymentModalHeader}>
//             <Text style={styles.addPaymentModalTitle}>
//               Add Payment History Entry
//             </Text>
//             <TouchableOpacity
//               onPress={() => setIsAddingPaymentHistory(false)}
//               style={styles.closeButton}>
//               <Icon2 name="close" size={moderateScale(24)} color="#000" />
//             </TouchableOpacity>
//           </View>

//           <ScrollView style={styles.addPaymentFormScroll}>
//             {/* Entry Date */}
//             <View style={styles.inputContainer}>
//               <Text style={styles.fieldLabel}>Entry Date *</Text>
//               <TouchableOpacity onPress={() => setShowPaymentDatePicker(true)}>
//                 <LinearGradient
//                   colors={['#7E5EA9', '#20AEBC']}
//                   style={styles.gradientBorder}
//                   start={{x: 0, y: 0}}
//                   end={{x: 1, y: 0}}>
//                   <View style={styles.dateContainer}>
//                     <Text style={styles.dateText}>
//                       {formatDate(newPaymentHistory.entry_date)}
//                     </Text>
//                     <Icon1
//                       name="calendar-o"
//                       size={moderateScale(20)}
//                       color="grey"
//                     />
//                   </View>
//                 </LinearGradient>
//               </TouchableOpacity>
//             </View>

//             {/* Entry By */}
//             <View style={styles.inputContainer}>
//               <Text style={styles.fieldLabel}>Entry By *</Text>
//               <LinearGradient
//                 colors={['#7E5EA9', '#20AEBC']}
//                 style={styles.gradientBorder}
//                 start={{x: 0, y: 0}}
//                 end={{x: 1, y: 0}}>
//                 <TextInput
//                   style={styles.textInput}
//                   placeholder="Enter Entry By"
//                   placeholderTextColor="#666"
//                   value={newPaymentHistory.entry_by}
//                   onChangeText={text =>
//                     setNewPaymentHistory(prev => ({...prev, entry_by: text}))
//                   }
//                 />
//               </LinearGradient>
//             </View>

//             {/* Amount */}
//             <View style={styles.inputContainer}>
//               <Text style={styles.fieldLabel}>Amount *</Text>
//               <LinearGradient
//                 colors={['#7E5EA9', '#20AEBC']}
//                 style={styles.gradientBorder}
//                 start={{x: 0, y: 0}}
//                 end={{x: 1, y: 0}}>
//                 <TextInput
//                   style={styles.textInput}
//                   placeholder="Enter Amount"
//                   placeholderTextColor="#666"
//                   value={newPaymentHistory.amount}
//                   onChangeText={text =>
//                     setNewPaymentHistory(prev => ({...prev, amount: text}))
//                   }
//                   keyboardType="numeric"
//                 />
//               </LinearGradient>
//             </View>

//             {/* Remarks */}
//             <View style={styles.inputContainer}>
//               <Text style={styles.fieldLabel}>Remarks</Text>
//               <LinearGradient
//                 colors={['#7E5EA9', '#20AEBC']}
//                 style={styles.gradientBorder}
//                 start={{x: 0, y: 0}}
//                 end={{x: 1, y: 0}}>
//                 <TextInput
//                   style={[styles.textInput, styles.multilineInput]}
//                   placeholder="Enter Remarks"
//                   placeholderTextColor="#666"
//                   value={newPaymentHistory.payment_remarks}
//                   onChangeText={text =>
//                     setNewPaymentHistory(prev => ({
//                       ...prev,
//                       payment_remarks: text,
//                     }))
//                   }
//                   multiline
//                   numberOfLines={3}
//                   textAlignVertical="top"
//                 />
//               </LinearGradient>
//             </View>
//           </ScrollView>

//           <View style={styles.addPaymentButtons}>
//             <TouchableOpacity
//               style={styles.cancelAddButton}
//               onPress={() => setIsAddingPaymentHistory(false)}>
//               <LinearGradient
//                 colors={['#F44336', '#D32F2F']}
//                 style={styles.cancelAddGradient}
//                 start={{x: 0, y: 0}}
//                 end={{x: 1, y: 0}}>
//                 <Text style={styles.cancelAddText}>Cancel</Text>
//               </LinearGradient>
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={styles.saveAddButton}
//               onPress={handleAddPaymentHistory}>
//               <LinearGradient
//                 colors={['#4CAF50', '#45a049']}
//                 style={styles.saveAddGradient}
//                 start={{x: 0, y: 0}}
//                 end={{x: 1, y: 0}}>
//                 <Text style={styles.saveAddText}>Add Payment</Text>
//               </LinearGradient>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </View>
//     </Modal>
//   );

//   return (
//     <View
//       style={[
//         styles.container,
//         {paddingTop: insets.top, paddingBottom: insets.bottom},
//       ]}>
//       <StatusBar
//         barStyle="dark-content"
//         translucent
//         backgroundColor="transparent"
//       />

//       {/* Header */}
//       <LinearGradient
//         colors={['#7E5EA9', '#20AEBC']}
//         style={styles.header}
//         start={{x: 0, y: 0}}
//         end={{x: 1, y: 0}}>
//         <TouchableOpacity
//           style={styles.backButton}
//           onPress={() => navigation.goBack()}>
//           <Icon name="arrow-left" size={moderateScale(24)} color="#FFF" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>
//           {isEditMode ? 'Edit Customer Payment' : 'Add Customer Payments'}
//         </Text>
//       </LinearGradient>

//       {/* Content */}
//       <ScrollView
//         contentContainerStyle={styles.content}
//         showsVerticalScrollIndicator={false}
//         keyboardShouldPersistTaps="handled">
//         {/* Status Info for Edit Mode */}
//         {isEditMode && (
//           <View style={styles.statusInfoContainer}>
//             <LinearGradient
//               colors={['#FF9800', '#FF5722']}
//               style={styles.statusInfoGradient}
//               start={{x: 0, y: 0}}
//               end={{x: 1, y: 0}}>
//               <View style={styles.statusInfoContent}>
//                 <Icon2 name="info" size={moderateScale(20)} color="#FFF" />
//                 <Text style={styles.statusInfoText}>
//                   After editing, status will reset to "Pending" for admin
//                   approval
//                 </Text>
//               </View>
//             </LinearGradient>
//           </View>
//         )}

//         {/* Entry By */}
//         <View style={styles.inputContainer}>
//           <Text style={styles.fieldLabel}>Entry By</Text>
//           <LinearGradient
//             colors={['#7E5EA9', '#20AEBC']}
//             style={styles.gradientBorder}
//             start={{x: 0, y: 0}}
//             end={{x: 1, y: 0}}>
//             <TextInput
//               style={styles.textInput}
//               placeholder="Enter Entry By"
//               placeholderTextColor="#666"
//               value={formData.entry_by}
//               onChangeText={text => updateFormData('entry_by', text)}
//             />
//           </LinearGradient>
//         </View>

//         {/* Entry Date */}
//         <View style={styles.inputContainer}>
//           <Text style={styles.fieldLabel}>Entry Date</Text>
//           <TouchableOpacity onPress={() => setShowDatePicker(true)}>
//             <LinearGradient
//               colors={['#7E5EA9', '#20AEBC']}
//               style={styles.gradientBorder}
//               start={{x: 0, y: 0}}
//               end={{x: 1, y: 0}}>
//               <View style={styles.dateContainer}>
//                 <Text style={styles.dateText}>
//                   {formatDate(formData.entry_date)}
//                 </Text>
//                 <Icon1
//                   name="calendar-o"
//                   size={moderateScale(20)}
//                   color="grey"
//                 />
//               </View>
//             </LinearGradient>
//           </TouchableOpacity>
//         </View>

//         {/* Ledger No */}
//         <View style={styles.inputContainer}>
//           <Text style={styles.fieldLabel}>Ledger No</Text>
//           <LinearGradient
//             colors={['#7E5EA9', '#20AEBC']}
//             style={styles.gradientBorder}
//             start={{x: 0, y: 0}}
//             end={{x: 1, y: 0}}>
//             <TextInput
//               style={styles.textInput}
//               placeholder="Enter Ledger No"
//               placeholderTextColor="#666"
//               value={formData.ledger_no}
//               onChangeText={text => updateFormData('ledger_no', text)}
//             />
//           </LinearGradient>
//         </View>

//         {/* Customer Name */}
//         <View style={styles.inputContainer}>
//           <Text style={styles.fieldLabel}>Customer Name *</Text>
//           <LinearGradient
//             colors={['#7E5EA9', '#20AEBC']}
//             style={styles.gradientBorder}
//             start={{x: 0, y: 0}}
//             end={{x: 1, y: 0}}>
//             <TextInput
//               style={styles.textInput}
//               placeholder="Enter Customer Name"
//               placeholderTextColor="#666"
//               value={formData.customer_name}
//               onChangeText={text => updateFormData('customer_name', text)}
//             />
//           </LinearGradient>
//         </View>

//         {/* Customer Father Name */}
//         <View style={styles.inputContainer}>
//           <Text style={styles.fieldLabel}>Customer Father Name</Text>
//           <LinearGradient
//             colors={['#7E5EA9', '#20AEBC']}
//             style={styles.gradientBorder}
//             start={{x: 0, y: 0}}
//             end={{x: 1, y: 0}}>
//             <TextInput
//               style={styles.textInput}
//               placeholder="Enter Customer Father Name"
//               placeholderTextColor="#666"
//               value={formData.father_name}
//               onChangeText={text => updateFormData('father_name', text)}
//             />
//           </LinearGradient>
//         </View>

//         {/* Customer Mobile */}
//         <View style={styles.inputContainer}>
//           <Text style={styles.fieldLabel}>Customer Mobile</Text>
//           <LinearGradient
//             colors={['#7E5EA9', '#20AEBC']}
//             style={styles.gradientBorder}
//             start={{x: 0, y: 0}}
//             end={{x: 1, y: 0}}>
//             <TextInput
//               style={styles.textInput}
//               placeholder="Enter Customer Mobile"
//               placeholderTextColor="#666"
//               value={formData.customer_mobile}
//               onChangeText={text => updateFormData('customer_mobile', text)}
//               keyboardType="phone-pad"
//             />
//           </LinearGradient>
//         </View>

//         {/* Customer Address */}
//         <View style={styles.inputContainer}>
//           <Text style={styles.fieldLabel}>Customer Address</Text>
//           <LinearGradient
//             colors={['#7E5EA9', '#20AEBC']}
//             style={styles.gradientBorder}
//             start={{x: 0, y: 0}}
//             end={{x: 1, y: 0}}>
//             <TextInput
//               style={[styles.textInput, styles.multilineInput]}
//               placeholder="Enter Customer Address"
//               placeholderTextColor="#666"
//               value={formData.customer_address}
//               onChangeText={text => updateFormData('customer_address', text)}
//               multiline
//               numberOfLines={3}
//               textAlignVertical="top"
//             />
//           </LinearGradient>
//         </View>

//         {/* Tractor Model */}
//         <View style={styles.inputContainer}>
//           <Text style={styles.fieldLabel}>Tractor Model</Text>
//           <TouchableOpacity onPress={() => setShowTractorModelDropdown(true)}>
//             <LinearGradient
//               colors={['#7E5EA9', '#20AEBC']}
//               style={styles.gradientBorder}
//               start={{x: 0, y: 0}}
//               end={{x: 1, y: 0}}>
//               <View style={styles.dropdownContainer}>
//                 <Text
//                   style={[
//                     styles.dropdownText,
//                     !formData.tractor_model && styles.placeholderText,
//                   ]}>
//                   {formData.tractor_model || 'Select Tractor Model'}
//                 </Text>
//                 <Icon2
//                   name="keyboard-arrow-down"
//                   size={moderateScale(24)}
//                   color="#666"
//                 />
//               </View>
//             </LinearGradient>
//           </TouchableOpacity>
//         </View>

//         {/* Date of Delivery */}
//         <View style={styles.inputContainer}>
//           <Text style={styles.fieldLabel}>Date of Delivery</Text>
//           <TouchableOpacity onPress={() => setShowDeliveryDatePicker(true)}>
//             <LinearGradient
//               colors={['#7E5EA9', '#20AEBC']}
//               style={styles.gradientBorder}
//               start={{x: 0, y: 0}}
//               end={{x: 1, y: 0}}>
//               <View style={styles.dateContainer}>
//                 <Text style={styles.dateText}>
//                   {formatDate(formData.delivery_date)}
//                 </Text>
//                 <Icon1
//                   name="calendar-o"
//                   size={moderateScale(20)}
//                   color="grey"
//                 />
//               </View>
//             </LinearGradient>
//           </TouchableOpacity>
//         </View>

//         {/* Chassis No */}
//         <View style={styles.inputContainer}>
//           <Text style={styles.fieldLabel}>Chassis No</Text>
//           <LinearGradient
//             colors={['#7E5EA9', '#20AEBC']}
//             style={styles.gradientBorder}
//             start={{x: 0, y: 0}}
//             end={{x: 1, y: 0}}>
//             <TextInput
//               style={styles.textInput}
//               placeholder="Enter Chassis No"
//               placeholderTextColor="#666"
//               value={formData.chassis_no}
//               onChangeText={text => updateFormData('chassis_no', text)}
//             />
//           </LinearGradient>
//         </View>

//         {/* Opening Balance */}
//         <View style={styles.inputContainer}>
//           <Text style={styles.fieldLabel}>Opening Balance *</Text>
//           <LinearGradient
//             colors={['#7E5EA9', '#20AEBC']}
//             style={styles.gradientBorder}
//             start={{x: 0, y: 0}}
//             end={{x: 1, y: 0}}>
//             <TextInput
//               style={styles.textInput}
//               placeholder="Enter Opening Balance"
//               placeholderTextColor="#666"
//               value={formData.opening_balance}
//               onChangeText={text => updateFormData('opening_balance', text)}
//               keyboardType="numeric"
//               returnKeyType="done"
//             />
//           </LinearGradient>
//         </View>

//         {/* Total Amount Paid */}
//         <View style={styles.inputContainer}>
//           <Text style={styles.fieldLabel}>Total Amount Paid *</Text>
//           <LinearGradient
//             colors={['#7E5EA9', '#20AEBC']}
//             style={styles.gradientBorder}
//             start={{x: 0, y: 0}}
//             end={{x: 1, y: 0}}>
//             <TextInput
//               style={styles.textInput}
//               placeholder="Total Amount Paid"
//               placeholderTextColor="#666"
//               value={formData.total_paid}
//               onChangeText={text => updateFormData('total_paid', text)}
//               keyboardType="numeric"
//             />
//           </LinearGradient>
//         </View>

//         {/* Remaining Payment (Display only) */}
//         <View style={styles.inputContainer}>
//           <Text style={styles.fieldLabel}>Remaining Payment</Text>
//           <LinearGradient
//             colors={['#7E5EA9', '#20AEBC']}
//             style={styles.gradientBorder}
//             start={{x: 0, y: 0}}
//             end={{x: 1, y: 0}}>
//             <View style={styles.displayContainer}>
//               <Text style={styles.displayLabel}>Remaining Payment:</Text>
//               <Text
//                 style={[
//                   styles.displayValue,
//                   remainingPayment < 0 && styles.negativeValue,
//                 ]}>
//                 ₹{remainingPayment.toFixed(2)}
//               </Text>
//             </View>
//           </LinearGradient>
//         </View>

//         {/* Payment History Info and Actions */}
//         <View style={styles.paymentHistoryActionsContainer}>
//           {formData.entry_dates && formData.entry_dates.length > 0 && (
//             <TouchableOpacity
//               style={styles.viewHistoryButton}
//               onPress={() => setShowPaymentHistoryModal(true)}>
//               <LinearGradient
//                 colors={['#20AEBC', '#7E5EA9']}
//                 style={styles.viewHistoryGradient}
//                 start={{x: 0, y: 0}}
//                 end={{x: 1, y: 0}}>
//                 <Icon2 name="history" size={moderateScale(20)} color="#FFF" />
//                 <Text style={styles.viewHistoryText}>
//                   View Payment History ({formData.entry_dates.length} entries)
//                 </Text>
//               </LinearGradient>
//             </TouchableOpacity>
//           )}

//           {isEditMode && (
//             <TouchableOpacity
//               style={styles.addPaymentHistoryButton}
//               onPress={() => setIsAddingPaymentHistory(true)}>
//               <LinearGradient
//                 colors={['#4CAF50', '#45a049']}
//                 style={styles.addPaymentHistoryGradient}
//                 start={{x: 0, y: 0}}
//                 end={{x: 1, y: 0}}>
//                 <Icon2 name="add" size={moderateScale(20)} color="#FFF" />
//                 <Text style={styles.addPaymentHistoryText}>
//                   Add Payment Entry
//                 </Text>
//               </LinearGradient>
//             </TouchableOpacity>
//           )}
//         </View>

//         {/* Save/Update Customer Payment Button */}
//         <TouchableOpacity
//           style={[styles.buttonContainer, loading && styles.buttonDisabled]}
//           onPress={handleSavePayment}
//           activeOpacity={0.8}
//           disabled={loading}>
//           <LinearGradient
//             colors={['#AC62A1', '#20AEBC']}
//             style={styles.gradientButton}
//             start={{x: 0, y: 0}}
//             end={{x: 1, y: 0}}>
//             {loading ? (
//               <ActivityIndicator size="small" color="#FFF" />
//             ) : (
//               <Text style={styles.buttonText}>
//                 {isEditMode
//                   ? 'Update Customer Payment'
//                   : 'Add Customer Payment'}
//               </Text>
//             )}
//           </LinearGradient>
//         </TouchableOpacity>

//         {/* Date Pickers */}
//         {showDatePicker && (
//           <DateTimePicker
//             value={formData.entry_date}
//             mode="date"
//             display={Platform.OS === 'ios' ? 'spinner' : 'default'}
//             onChange={onDateChange}
//           />
//         )}

//         {showDeliveryDatePicker && (
//           <DateTimePicker
//             value={formData.delivery_date}
//             mode="date"
//             display={Platform.OS === 'ios' ? 'spinner' : 'default'}
//             onChange={onDeliveryDateChange}
//           />
//         )}

//         {showPaymentDatePicker && (
//           <DateTimePicker
//             value={newPaymentHistory.entry_date}
//             mode="date"
//             display={Platform.OS === 'ios' ? 'spinner' : 'default'}
//             onChange={onPaymentDateChange}
//           />
//         )}
//       </ScrollView>

//       {/* Modals */}
//       {renderTractorModelDropdown()}
//       {renderPaymentHistoryModal()}
//       {renderAddPaymentHistoryForm()}
//     </View>
//   );
// };

// // ... Keep the same styles object as before (no changes needed) ...

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F5F5F5',
//   },
//   header: {
//     height: verticalScale(60),
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: moderateScale(15),
//   },
//   backButton: {
//     padding: moderateScale(8),
//   },
//   headerTitle: {
//     flex: 1,
//     textAlign: 'center',
//     color: '#FFF',
//     fontSize: moderateScale(18),
//     fontWeight: '600',
//     marginRight: moderateScale(40),
//   },
//   content: {
//     flexGrow: 1,
//     paddingHorizontal: moderateScale(20),
//     paddingVertical: moderateScale(15),
//   },
//   statusInfoContainer: {
//     marginBottom: verticalScale(15),
//   },
//   statusInfoGradient: {
//     borderRadius: moderateScale(10),
//     padding: moderateScale(2),
//   },
//   statusInfoContent: {
//     backgroundColor: '#FF9800',
//     borderRadius: moderateScale(8),
//     paddingHorizontal: moderateScale(15),
//     paddingVertical: moderateScale(12),
//     flexDirection: 'row',
//     alignItems: 'center',
//     minHeight: verticalScale(50),
//   },
//   statusInfoText: {
//     fontSize: moderateScale(14),
//     color: '#FFF',
//     fontWeight: '500',
//     marginLeft: moderateScale(10),
//     flex: 1,
//   },
//   inputContainer: {
//     marginBottom: verticalScale(15),
//   },
//   fieldLabel: {
//     fontSize: moderateScale(16),
//     fontWeight: '600',
//     color: '#333',
//     marginBottom: verticalScale(5),
//     marginLeft: moderateScale(5),
//   },
//   gradientBorder: {
//     borderRadius: moderateScale(10),
//     padding: moderateScale(2),
//   },
//   textInput: {
//     backgroundColor: '#FFF',
//     borderRadius: moderateScale(8),
//     paddingHorizontal: moderateScale(15),
//     paddingVertical: moderateScale(12),
//     fontSize: moderateScale(16),
//     color: '#333',
//     minHeight: verticalScale(50),
//   },
//   multilineInput: {
//     minHeight: verticalScale(80),
//     textAlignVertical: 'top',
//   },
//   dateContainer: {
//     backgroundColor: '#FFF',
//     borderRadius: moderateScale(8),
//     paddingHorizontal: moderateScale(15),
//     paddingVertical: moderateScale(12),
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     minHeight: verticalScale(50),
//   },
//   dateText: {
//     fontSize: moderateScale(16),
//     color: '#333',
//   },
//   dropdownContainer: {
//     backgroundColor: '#FFF',
//     borderRadius: moderateScale(8),
//     paddingHorizontal: moderateScale(15),
//     paddingVertical: moderateScale(12),
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     minHeight: verticalScale(50),
//   },
//   dropdownText: {
//     fontSize: moderateScale(16),
//     color: '#333',
//   },
//   placeholderText: {
//     color: '#666',
//   },
//   displayContainer: {
//     backgroundColor: '#FFF',
//     borderRadius: moderateScale(8),
//     paddingHorizontal: moderateScale(15),
//     paddingVertical: moderateScale(12),
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     minHeight: verticalScale(50),
//   },
//   displayLabel: {
//     fontSize: moderateScale(16),
//     color: '#333',
//     fontWeight: '500',
//   },
//   displayValue: {
//     fontSize: moderateScale(16),
//     color: '#7E5EA9',
//     fontWeight: 'bold',
//   },
//   negativeValue: {
//     color: '#F44336',
//   },
//   paymentHistoryActionsContainer: {
//     marginBottom: verticalScale(15),
//     gap: verticalScale(10),
//   },
//   viewHistoryButton: {
//     borderRadius: moderateScale(10),
//     overflow: 'hidden',
//   },
//   viewHistoryGradient: {
//     paddingHorizontal: moderateScale(15),
//     paddingVertical: verticalScale(12),
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   viewHistoryText: {
//     color: '#FFF',
//     fontSize: moderateScale(16),
//     fontWeight: '600',
//     marginLeft: moderateScale(10),
//   },
//   addPaymentHistoryButton: {
//     borderRadius: moderateScale(10),
//     overflow: 'hidden',
//   },
//   addPaymentHistoryGradient: {
//     paddingHorizontal: moderateScale(15),
//     paddingVertical: verticalScale(12),
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   addPaymentHistoryText: {
//     color: '#FFF',
//     fontSize: moderateScale(16),
//     fontWeight: '600',
//     marginLeft: moderateScale(10),
//   },
//   buttonContainer: {
//     marginTop: verticalScale(10),
//     marginBottom: verticalScale(30),
//     borderRadius: moderateScale(10),
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//     elevation: 5,
//   },
//   buttonDisabled: {
//     opacity: 0.6,
//   },
//   gradientButton: {
//     paddingVertical: verticalScale(15),
//     borderRadius: moderateScale(10),
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   buttonText: {
//     color: '#FFF',
//     fontSize: moderateScale(18),
//     fontWeight: '600',
//   },
//   // Modal Styles
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: moderateScale(20),
//   },
//   modalContent: {
//     backgroundColor: 'white',
//     borderRadius: moderateScale(10),
//     width: '90%',
//     maxHeight: '80%',
//     padding: moderateScale(15),
//   },
//   modalHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: verticalScale(15),
//     borderBottomWidth: 1,
//     borderBottomColor: '#f0f0f0',
//     paddingBottom: verticalScale(10),
//   },
//   modalTitle: {
//     fontSize: moderateScale(18),
//     fontWeight: '600',
//     color: '#000',
//   },
//   closeButton: {
//     padding: moderateScale(5),
//   },
//   loadingContainer: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: verticalScale(40),
//   },
//   loadingText: {
//     fontSize: moderateScale(16),
//     color: '#666',
//     marginTop: verticalScale(10),
//   },
//   dropdownList: {
//     maxHeight: verticalScale(300),
//   },
//   dropdownItem: {
//     paddingVertical: verticalScale(12),
//     paddingHorizontal: moderateScale(15),
//     borderBottomWidth: 1,
//     borderBottomColor: '#f0f0f0',
//   },
//   dropdownItemText: {
//     fontSize: moderateScale(16),
//     color: '#333',
//   },
//   // Payment History Modal Styles
//   paymentHistoryModalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: moderateScale(20),
//   },
//   paymentHistoryModalContent: {
//     backgroundColor: 'white',
//     borderRadius: moderateScale(10),
//     width: '100%',
//     maxHeight: '80%',
//     padding: moderateScale(15),
//   },
//   paymentHistoryModalHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: verticalScale(15),
//     borderBottomWidth: 1,
//     borderBottomColor: '#f0f0f0',
//     paddingBottom: verticalScale(10),
//   },
//   paymentHistoryModalTitle: {
//     fontSize: moderateScale(18),
//     fontWeight: '600',
//     color: '#000',
//   },
//   paymentHistoryCloseButton: {
//     padding: moderateScale(5),
//   },
//   paymentHistoryItem: {
//     backgroundColor: '#f8f9fa',
//     padding: moderateScale(12),
//     borderRadius: moderateScale(8),
//     marginBottom: verticalScale(10),
//     borderLeftWidth: 4,
//     borderLeftColor: '#7E5EA9',
//   },
//   paymentHistoryItemHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: verticalScale(8),
//   },
//   paymentHistoryAmount: {
//     fontSize: moderateScale(18),
//     fontWeight: 'bold',
//     color: '#2E7D32',
//   },
//   paymentHistoryActions: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: moderateScale(10),
//   },
//   paymentHistoryDate: {
//     fontSize: moderateScale(14),
//     color: '#666',
//   },
//   removePaymentButton: {
//     padding: moderateScale(4),
//   },
//   paymentHistoryDetails: {
//     marginTop: verticalScale(5),
//   },
//   paymentHistoryBy: {
//     fontSize: moderateScale(14),
//     color: '#333',
//     fontWeight: '500',
//     marginBottom: verticalScale(4),
//   },
//   paymentHistoryRemarks: {
//     fontSize: moderateScale(13),
//     color: '#666',
//     fontStyle: 'italic',
//   },
//   noPaymentHistoryContainer: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: verticalScale(40),
//   },
//   noPaymentHistory: {
//     fontSize: moderateScale(16),
//     color: '#666',
//     textAlign: 'center',
//     marginTop: verticalScale(10),
//   },
//   addHistoryButton: {
//     marginTop: verticalScale(15),
//     borderRadius: moderateScale(10),
//     overflow: 'hidden',
//   },
//   addHistoryGradient: {
//     paddingHorizontal: moderateScale(15),
//     paddingVertical: verticalScale(12),
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   addHistoryText: {
//     color: '#FFF',
//     fontSize: moderateScale(16),
//     fontWeight: '600',
//     marginLeft: moderateScale(10),
//   },
//   // Add Payment Modal Styles
//   addPaymentModalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: moderateScale(20),
//   },
//   addPaymentModalContent: {
//     backgroundColor: 'white',
//     borderRadius: moderateScale(10),
//     width: '100%',
//     maxHeight: '80%',
//     padding: moderateScale(15),
//   },
//   addPaymentModalHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: verticalScale(15),
//     borderBottomWidth: 1,
//     borderBottomColor: '#f0f0f0',
//     paddingBottom: verticalScale(10),
//   },
//   addPaymentModalTitle: {
//     fontSize: moderateScale(18),
//     fontWeight: '600',
//     color: '#000',
//   },
//   addPaymentFormScroll: {
//     maxHeight: verticalScale(400),
//   },
//   addPaymentButtons: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: verticalScale(20),
//     gap: moderateScale(10),
//   },
//   cancelAddButton: {
//     flex: 1,
//     borderRadius: moderateScale(10),
//     overflow: 'hidden',
//   },
//   cancelAddGradient: {
//     paddingVertical: verticalScale(12),
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   cancelAddText: {
//     color: '#FFF',
//     fontSize: moderateScale(16),
//     fontWeight: '600',
//   },
//   saveAddButton: {
//     flex: 1,
//     borderRadius: moderateScale(10),
//     overflow: 'hidden',
//   },
//   saveAddGradient: {
//     paddingVertical: verticalScale(12),
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   saveAddText: {
//     color: '#FFF',
//     fontSize: moderateScale(16),
//     fontWeight: '600',
//   },
// });

// export default Addcustomerpayment;






import React, {useState, useEffect, useCallback} from 'react';
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
  Platform,
  FlatList,
  Modal,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import Icon1 from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const {width, height} = Dimensions.get('window');

// Responsive scaling functions
const scale = size => (width / 375) * size;
const verticalScale = size => (height / 812) * size;
const moderateScale = (size, factor = 0.5) =>
  size + (scale(size) - size) * factor;

const Addcustomerpayment = ({navigation, route}) => {
  const insets = useSafeAreaInsets();

  // Check if we're in edit mode
  const isEditMode = route.params?.payment ? true : false;
  const paymentData = route.params?.payment || {};

  console.log('payment Data', paymentData);

  // State for form fields - matching Customerpaymentdetails structure
  const [formData, setFormData] = useState({
    id: '',
    user_id: '',
    entry_by: '',
    entry_date: new Date(),
    ledger_no: '',
    customer_name: '',
    father_name: '',
    customer_mobile: '',
    customer_address: '',
    tractor_model: '',
    delivery_date: new Date(),
    chassis_no: '',
    opening_balance: '',
    total_paid: '',
    status: 'pending',

    // Payment history arrays - will be populated from API
    entry_dates: [],
    entries_by: [],
    amounts: [],
    payment_remarks: [],
  });

  // Separate state for payment history to match API structure
  const [paymentHistory, setPaymentHistory] = useState([]);

  // Tractor models from API
  const [tractorModels, setTractorModels] = useState([]);
  const [loadingTractorModels, setLoadingTractorModels] = useState(false);
  const [showTractorModelDropdown, setShowTractorModelDropdown] =
    useState(false);
  const [hasFetchedTractorModels, setHasFetchedTractorModels] = useState(false);

  // Payment history states
  const [showPaymentHistoryModal, setShowPaymentHistoryModal] = useState(false);
  const [isAddingPaymentHistory, setIsAddingPaymentHistory] = useState(false);
  const [newPaymentHistory, setNewPaymentHistory] = useState({
    entry_date: new Date(),
    entry_by: '',
    amount: '',
    payment_remarks: '',
  });
  const [showPaymentDatePicker, setShowPaymentDatePicker] = useState(false);

  // General states
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showDeliveryDatePicker, setShowDeliveryDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // API Base URL
  const API_BASE_URL = 'https://argosmob.uk/makroo/public/api/v1';

  // Fetch tractor models from API - wrapped in useCallback to prevent recreation
  const fetchTractorModels = useCallback(async () => {
    // Don't fetch if already fetched
    if (hasFetchedTractorModels) {
      return;
    }

    try {
      setLoadingTractorModels(true);
      const response = await axios.get(`${API_BASE_URL}/model/tractor-models`);

      if (response.data && response.data.data) {
        // Extract model names from response
        const models = response.data.data.map(
          item => item.name || item.model_name || item.tractor_model || item,
        );
        setTractorModels(models);
        setHasFetchedTractorModels(true);
      } else {
        // Fallback to some common models if API fails
        setTractorModels([
          'Swaraj 744 FE',
          'Swaraj 735 FE',
          'Swaraj 855 FE',
          'Mahindra 575 DI',
          'Mahindra 475 DI',
          'John Deere 5050D',
          'John Deere 5310',
          'Eicher 485',
        ]);
        setHasFetchedTractorModels(true);
      }
    } catch (error) {
      console.log('Error fetching tractor models:', error);
      // Fallback models
      setTractorModels([
        'Swaraj 744 FE',
        'Swaraj 735 FE',
        'Swaraj 855 FE',
        'Mahindra 575 DI',
        'Mahindra 475 DI',
        'John Deere 5050D',
        'John Deere 5310',
        'Eicher 485',
      ]);
      setHasFetchedTractorModels(true);
    } finally {
      setLoadingTractorModels(false);
    }
  }, [hasFetchedTractorModels]);

  // Update form data
  const updateFormData = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  // Initialize form with payment data if in edit mode
  useEffect(() => {
    // Fetch tractor models on component mount
    fetchTractorModels();

    // Prevent infinite re-renders by checking if already initialized
    if (isInitialized) return;

    if (isEditMode && paymentData) {
      // Extract history from paymentData and format it
      const history = paymentData.history || [];
      
      // Convert history array to the format we need
      const entry_dates = history.map(item => item.entry_date);
      const entries_by = history.map(item => item.entry_by);
      const amounts = history.map(item => item.amount);
      const payment_remarks = history.map(item => item.remarks || '');
      
      // Calculate total paid from history
      const totalPaid = amounts.reduce((sum, amount) => sum + parseFloat(amount || 0), 0);

      setFormData(prev => ({
        ...prev,
        id: paymentData.id || '',
        user_id: paymentData.user_id || '',
        entry_by: paymentData.entry_by || '',
        entry_date: paymentData.entry_date
          ? new Date(paymentData.entry_date)
          : new Date(),
        ledger_no: paymentData.ledger_no || '',
        customer_name: paymentData.customer_name || '',
        father_name: paymentData.father_name || '',
        customer_mobile: paymentData.customer_mobile || '',
        customer_address: paymentData.customer_address || '',
        tractor_model: paymentData.tractor_model || '',
        delivery_date: paymentData.delivery_date
          ? new Date(paymentData.delivery_date)
          : new Date(),
        chassis_no: paymentData.chassis_no || '',
        opening_balance: paymentData.opening_balance || '',
        total_paid: totalPaid.toString(),
        status: 'pending', // Reset status to pending when editing

        // Initialize arrays from payment data history
        entry_dates: entry_dates,
        entries_by: entries_by,
        amounts: amounts,
        payment_remarks: payment_remarks,
      }));

      // Also set payment history state
      setPaymentHistory(history);
    }
    setIsInitialized(true);
  }, [isEditMode, paymentData, isInitialized, fetchTractorModels]);

  // Update total paid whenever payment history changes
  useEffect(() => {
    if (paymentHistory.length > 0) {
      const totalPaid = paymentHistory.reduce(
        (sum, item) => sum + parseFloat(item.amount || 0),
        0,
      );
      updateFormData('total_paid', totalPaid.toString());
    }
  }, [paymentHistory, updateFormData]);

  // Date change handlers
  const onDateChange = useCallback(
    (event, selectedDate) => {
      setShowDatePicker(false);
      if (selectedDate) {
        updateFormData('entry_date', selectedDate);
      }
    },
    [updateFormData],
  );

  const onDeliveryDateChange = useCallback(
    (event, selectedDate) => {
      setShowDeliveryDatePicker(false);
      if (selectedDate) {
        updateFormData('delivery_date', selectedDate);
      }
    },
    [updateFormData],
  );

  const onPaymentDateChange = useCallback((event, selectedDate) => {
    setShowPaymentDatePicker(false);
    if (selectedDate) {
      setNewPaymentHistory(prev => ({
        ...prev,
        entry_date: selectedDate,
      }));
    }
  }, []);

  // Format date for display
  const formatDate = useCallback(date => {
    if (date instanceof Date) {
      return date.toLocaleDateString('en-GB');
    }
    return date;
  }, []);

  // Format date for API (YYYY-MM-DD)
  const formatDateForAPI = useCallback(date => {
    if (date instanceof Date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
    return date;
  }, []);

  // Calculate remaining payment
  const remainingPayment =
    (parseFloat(formData.opening_balance) || 0) -
    (parseFloat(formData.total_paid) || 0);

  // Handle tractor model selection
  const handleTractorModelSelect = useCallback(
    model => {
      updateFormData('tractor_model', model);
      setShowTractorModelDropdown(false);
    },
    [updateFormData],
  );

  // Handle adding new payment history entry
  const handleAddPaymentHistory = useCallback(() => {
    if (!newPaymentHistory.entry_by || !newPaymentHistory.amount) {
      Alert.alert('Error', 'Please fill Entry By and Amount fields');
      return;
    }

    const amount = parseFloat(newPaymentHistory.amount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    // Create new history object
    const newHistoryItem = {
      entry_date: formatDateForAPI(newPaymentHistory.entry_date),
      entry_by: newPaymentHistory.entry_by,
      amount: amount.toString(),
      remarks: newPaymentHistory.payment_remarks || '',
    };

    // Add to payment history
    setPaymentHistory(prev => [...prev, newHistoryItem]);

    // Also update form data arrays for backward compatibility
    setFormData(prev => ({
      ...prev,
      entry_dates: [...prev.entry_dates, formatDateForAPI(newPaymentHistory.entry_date)],
      entries_by: [...prev.entries_by, newPaymentHistory.entry_by],
      amounts: [...prev.amounts, amount],
      payment_remarks: [...prev.payment_remarks, newPaymentHistory.payment_remarks || ''],
    }));

    // Reset new payment history form
    setNewPaymentHistory({
      entry_date: new Date(),
      entry_by: '',
      amount: '',
      payment_remarks: '',
    });

    setIsAddingPaymentHistory(false);
  }, [newPaymentHistory, formatDateForAPI]);

  // Remove payment history entry
  const removePaymentHistoryEntry = useCallback(index => {
    setPaymentHistory(prev => {
      const updatedHistory = prev.filter((_, i) => i !== index);
      return updatedHistory;
    });

    // Also update form data arrays for backward compatibility
    setFormData(prev => {
      const removedAmount = prev.amounts[index];
      return {
        ...prev,
        entry_dates: prev.entry_dates.filter((_, i) => i !== index),
        entries_by: prev.entries_by.filter((_, i) => i !== index),
        amounts: prev.amounts.filter((_, i) => i !== index),
        payment_remarks: prev.payment_remarks.filter((_, i) => i !== index),
      };
    });
  }, []);

  // API call to add payment history entry
  const addPaymentHistoryAPI = async (paymentId, historyItem) => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        throw new Error('User not logged in');
      }

      const response = await axios.post(
        `${API_BASE_URL}/customer-payments/add-history`,
        {
          customer_payment_id: paymentId,
          entry_by: historyItem.entry_by,
          entry_date: historyItem.entry_date,
          amount: historyItem.amount,
          remarks: historyItem.remarks || '',
        },
        {
          timeout: 30000,
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        },
      );

      return response.data;
    } catch (error) {
      console.log('Error adding payment history:', error);
      throw error;
    }
  };

  // Handle form submission with API - Save
  const handleSavePayment = async () => {
    // Basic validation
    if (
      !formData.customer_name ||
      !formData.opening_balance ||
      !formData.total_paid
    ) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const openingBalance = parseFloat(formData.opening_balance);
    const totalPaid = parseFloat(formData.total_paid);

    if (isNaN(openingBalance) || openingBalance <= 0) {
      Alert.alert('Error', 'Please enter a valid opening balance');
      return;
    }

    if (isNaN(totalPaid) || totalPaid < 0) {
      Alert.alert('Error', 'Please enter a valid amount paid');
      return;
    }

    if (totalPaid > openingBalance) {
      Alert.alert(
        'Error',
        'Amount paid cannot be greater than opening balance',
      );
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
        entry_by: formData.entry_by || '',
        entry_date: formatDateForAPI(formData.entry_date),
        ledger_no: formData.ledger_no || '',
        customer_name: formData.customer_name,
        father_name: formData.father_name || '',
        customer_mobile: formData.customer_mobile || '',
        customer_address: formData.customer_address || '',
        tractor_model: formData.tractor_model || '',
        delivery_date: formatDateForAPI(formData.delivery_date),
        chassis_no: formData.chassis_no || '',
        opening_balance: openingBalance,
        total_paid: totalPaid,
        status: 'pending', // Always set to pending for new/edited payments

        // Include payment history arrays
        entry_dates: formData.entry_dates,
        entries_by: formData.entries_by,
        amounts: formData.amounts,
        payment_remarks: formData.payment_remarks,
      };

      let response;
      let endpoint;
      let paymentId;

      if (isEditMode) {
        // Update API call
        apiData.id = parseInt(formData.id);
        endpoint = `${API_BASE_URL}/customer-payments/update`;
      } else {
        // Add API call
        endpoint = `${API_BASE_URL}/customer-payments/add`;
      }

      response = await axios.post(endpoint, apiData, {
        timeout: 30000,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (response.data && response.data.status === 'success') {
        paymentId = response.data.data?.id || formData.id;
        
        // If this is edit mode and there are new payment history entries added locally,
        // we need to add them via the separate API endpoint
        if (isEditMode && paymentHistory.length > 0) {
          // Find which history entries are new (don't have an id)
          const newHistoryEntries = paymentHistory.filter(item => !item.id);
          
          if (newHistoryEntries.length > 0) {
            try {
              // Add each new history entry
              for (const historyItem of newHistoryEntries) {
                await addPaymentHistoryAPI(paymentId, historyItem);
              }
            } catch (historyError) {
              console.log('Error adding payment history entries:', historyError);
              // Continue anyway since the main payment was saved
            }
          }
        }

        Alert.alert(
          'Success',
          isEditMode
            ? 'Customer payment updated successfully! Status reset to pending for admin approval.'
            : 'Customer payment added successfully!',
        );

        // Reset form if not in edit mode
        if (!isEditMode) {
          setFormData({
            user_id: '',
            entry_by: '',
            entry_date: new Date(),
            ledger_no: '',
            customer_name: '',
            father_name: '',
            customer_mobile: '',
            customer_address: '',
            tractor_model: '',
            delivery_date: new Date(),
            chassis_no: '',
            opening_balance: '',
            total_paid: '',
            status: 'pending',
            entry_dates: [],
            entries_by: [],
            amounts: [],
            payment_remarks: [],
          });
          setPaymentHistory([]);
          // Reset the fetched tractor models flag when creating new payment
          setHasFetchedTractorModels(false);
        }

        // Navigate back to payment details with refresh
        navigation.navigate('Customerpaymentdetails', {
          refresh: true,
        });
      } else {
        Alert.alert(
          'Error',
          response.data.message || 'Failed to process payment',
        );
      }
    } catch (error) {
      console.log('Error processing payment:', error);

      if (error.response) {
        Alert.alert(
          'Error',
          error.response.data?.message ||
            `Server error: ${error.response.status}`,
        );
      } else if (error.request) {
        Alert.alert(
          'Network Error',
          'Unable to connect to server. Please check your internet connection.',
        );
      } else {
        Alert.alert('Error', 'An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Render tractor model dropdown
  const renderTractorModelDropdown = () => (
    <Modal
      visible={showTractorModelDropdown}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowTractorModelDropdown(false)}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Tractor Model</Text>
            <TouchableOpacity
              onPress={() => setShowTractorModelDropdown(false)}
              style={styles.closeButton}>
              <Icon2 name="close" size={moderateScale(24)} color="#000" />
            </TouchableOpacity>
          </View>

          {loadingTractorModels ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#7E5EA9" />
              <Text style={styles.loadingText}>Loading tractor models...</Text>
            </View>
          ) : (
            <FlatList
              data={tractorModels}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => handleTractorModelSelect(item)}>
                  <Text style={styles.dropdownItemText}>{item}</Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item, index) => index.toString()}
              style={styles.dropdownList}
            />
          )}
        </View>
      </View>
    </Modal>
  );

  // Render payment history modal
  const renderPaymentHistoryModal = () => (
    <Modal
      visible={showPaymentHistoryModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowPaymentHistoryModal(false)}>
      <View style={styles.paymentHistoryModalOverlay}>
        <View style={styles.paymentHistoryModalContent}>
          <View style={styles.paymentHistoryModalHeader}>
            <Text style={styles.paymentHistoryModalTitle}>Payment History</Text>
            <TouchableOpacity
              onPress={() => setShowPaymentHistoryModal(false)}
              style={styles.paymentHistoryCloseButton}>
              <Icon2 name="close" size={moderateScale(24)} color="#000" />
            </TouchableOpacity>
          </View>

          {paymentHistory.length > 0 ? (
            <FlatList
              data={paymentHistory}
              renderItem={({item, index}) => (
                <View style={styles.paymentHistoryItem}>
                  <View style={styles.paymentHistoryItemHeader}>
                    <Text style={styles.paymentHistoryAmount}>
                      ₹{item.amount}
                    </Text>
                    <View style={styles.paymentHistoryActions}>
                      <Text style={styles.paymentHistoryDate}>{item.entry_date}</Text>
                      {!item.id && ( // Only show delete for locally added entries
                        <TouchableOpacity
                          onPress={() => removePaymentHistoryEntry(index)}
                          style={styles.removePaymentButton}>
                          <Icon2
                            name="delete"
                            size={moderateScale(20)}
                            color="#F44336"
                          />
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                  <View style={styles.paymentHistoryDetails}>
                    <Text style={styles.paymentHistoryBy}>
                      By: {item.entry_by}
                    </Text>
                    {item.remarks && (
                      <Text style={styles.paymentHistoryRemarks}>
                        Remarks: {item.remarks}
                      </Text>
                    )}
                  </View>
                </View>
              )}
              keyExtractor={(item, index) => 
                item.id ? item.id.toString() : `local-${index}`
              }
              ListEmptyComponent={
                <Text style={styles.noPaymentHistory}>
                  No payment history found
                </Text>
              }
            />
          ) : (
            <View style={styles.noPaymentHistoryContainer}>
              <Icon2 name="history" size={moderateScale(60)} color="#ccc" />
              <Text style={styles.noPaymentHistory}>
                No payment history available
              </Text>
            </View>
          )}

          {isEditMode && (
            <TouchableOpacity
              style={styles.addHistoryButton}
              onPress={() => {
                setShowPaymentHistoryModal(false);
                setIsAddingPaymentHistory(true);
              }}>
              <LinearGradient
                colors={['#7E5EA9', '#20AEBC']}
                style={styles.addHistoryGradient}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}>
                <Icon2 name="add" size={moderateScale(20)} color="#FFF" />
                <Text style={styles.addHistoryText}>Add Payment History</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );

  // Render add payment history form
  const renderAddPaymentHistoryForm = () => (
    <Modal
      visible={isAddingPaymentHistory}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setIsAddingPaymentHistory(false)}>
      <View style={styles.addPaymentModalOverlay}>
        <View style={styles.addPaymentModalContent}>
          <View style={styles.addPaymentModalHeader}>
            <Text style={styles.addPaymentModalTitle}>
              Add Payment History Entry
            </Text>
            <TouchableOpacity
              onPress={() => setIsAddingPaymentHistory(false)}
              style={styles.closeButton}>
              <Icon2 name="close" size={moderateScale(24)} color="#000" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.addPaymentFormScroll}>
            {/* Entry Date */}
            <View style={styles.inputContainer}>
              <Text style={styles.fieldLabel}>Entry Date *</Text>
              <TouchableOpacity onPress={() => setShowPaymentDatePicker(true)}>
                <LinearGradient
                  colors={['#7E5EA9', '#20AEBC']}
                  style={styles.gradientBorder}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}>
                  <View style={styles.dateContainer}>
                    <Text style={styles.dateText}>
                      {formatDate(newPaymentHistory.entry_date)}
                    </Text>
                    <Icon1
                      name="calendar-o"
                      size={moderateScale(20)}
                      color="grey"
                    />
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {/* Entry By */}
            <View style={styles.inputContainer}>
              <Text style={styles.fieldLabel}>Entry By *</Text>
              <LinearGradient
                colors={['#7E5EA9', '#20AEBC']}
                style={styles.gradientBorder}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter Entry By"
                  placeholderTextColor="#666"
                  value={newPaymentHistory.entry_by}
                  onChangeText={text =>
                    setNewPaymentHistory(prev => ({...prev, entry_by: text}))
                  }
                />
              </LinearGradient>
            </View>

            {/* Amount */}
            <View style={styles.inputContainer}>
              <Text style={styles.fieldLabel}>Amount *</Text>
              <LinearGradient
                colors={['#7E5EA9', '#20AEBC']}
                style={styles.gradientBorder}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter Amount"
                  placeholderTextColor="#666"
                  value={newPaymentHistory.amount}
                  onChangeText={text =>
                    setNewPaymentHistory(prev => ({...prev, amount: text}))
                  }
                  keyboardType="numeric"
                />
              </LinearGradient>
            </View>

            {/* Remarks */}
            <View style={styles.inputContainer}>
              <Text style={styles.fieldLabel}>Remarks</Text>
              <LinearGradient
                colors={['#7E5EA9', '#20AEBC']}
                style={styles.gradientBorder}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}>
                <TextInput
                  style={[styles.textInput, styles.multilineInput]}
                  placeholder="Enter Remarks"
                  placeholderTextColor="#666"
                  value={newPaymentHistory.payment_remarks}
                  onChangeText={text =>
                    setNewPaymentHistory(prev => ({
                      ...prev,
                      payment_remarks: text,
                    }))
                  }
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />
              </LinearGradient>
            </View>
          </ScrollView>

          <View style={styles.addPaymentButtons}>
            <TouchableOpacity
              style={styles.cancelAddButton}
              onPress={() => setIsAddingPaymentHistory(false)}>
              <LinearGradient
                colors={['#F44336', '#D32F2F']}
                style={styles.cancelAddGradient}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}>
                <Text style={styles.cancelAddText}>Cancel</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.saveAddButton}
              onPress={handleAddPaymentHistory}>
              <LinearGradient
                colors={['#4CAF50', '#45a049']}
                style={styles.saveAddGradient}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}>
                <Text style={styles.saveAddText}>Add Payment</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <View
      style={[
        styles.container,
        {paddingTop: insets.top, paddingBottom: insets.bottom},
      ]}>
      <StatusBar
        barStyle="dark-content"
        translucent
        backgroundColor="transparent"
      />

      {/* Header */}
      <LinearGradient
        colors={['#7E5EA9', '#20AEBC']}
        style={styles.header}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
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
        keyboardShouldPersistTaps="handled">
        {/* Status Info for Edit Mode */}
        {isEditMode && (
          <View style={styles.statusInfoContainer}>
            <LinearGradient
              colors={['#FF9800', '#FF5722']}
              style={styles.statusInfoGradient}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}>
              <View style={styles.statusInfoContent}>
                <Icon2 name="info" size={moderateScale(20)} color="#FFF" />
                <Text style={styles.statusInfoText}>
                  After editing, status will reset to "Pending" for admin
                  approval
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
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}>
            <TextInput
              style={styles.textInput}
              placeholder="Enter Entry By"
              placeholderTextColor="#666"
              value={formData.entry_by}
              onChangeText={text => updateFormData('entry_by', text)}
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
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}>
              <View style={styles.dateContainer}>
                <Text style={styles.dateText}>
                  {formatDate(formData.entry_date)}
                </Text>
                <Icon1
                  name="calendar-o"
                  size={moderateScale(20)}
                  color="grey"
                />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Ledger No */}
        <View style={styles.inputContainer}>
          <Text style={styles.fieldLabel}>Ledger No</Text>
          <LinearGradient
            colors={['#7E5EA9', '#20AEBC']}
            style={styles.gradientBorder}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}>
            <TextInput
              style={styles.textInput}
              placeholder="Enter Ledger No"
              placeholderTextColor="#666"
              value={formData.ledger_no}
              onChangeText={text => updateFormData('ledger_no', text)}
            />
          </LinearGradient>
        </View>

        {/* Customer Name */}
        <View style={styles.inputContainer}>
          <Text style={styles.fieldLabel}>Customer Name *</Text>
          <LinearGradient
            colors={['#7E5EA9', '#20AEBC']}
            style={styles.gradientBorder}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}>
            <TextInput
              style={styles.textInput}
              placeholder="Enter Customer Name"
              placeholderTextColor="#666"
              value={formData.customer_name}
              onChangeText={text => updateFormData('customer_name', text)}
            />
          </LinearGradient>
        </View>

        {/* Customer Father Name */}
        <View style={styles.inputContainer}>
          <Text style={styles.fieldLabel}>Customer Father Name</Text>
          <LinearGradient
            colors={['#7E5EA9', '#20AEBC']}
            style={styles.gradientBorder}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}>
            <TextInput
              style={styles.textInput}
              placeholder="Enter Customer Father Name"
              placeholderTextColor="#666"
              value={formData.father_name}
              onChangeText={text => updateFormData('father_name', text)}
            />
          </LinearGradient>
        </View>

        {/* Customer Mobile */}
        <View style={styles.inputContainer}>
          <Text style={styles.fieldLabel}>Customer Mobile</Text>
          <LinearGradient
            colors={['#7E5EA9', '#20AEBC']}
            style={styles.gradientBorder}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}>
            <TextInput
              style={styles.textInput}
              placeholder="Enter Customer Mobile"
              placeholderTextColor="#666"
              value={formData.customer_mobile}
              onChangeText={text => updateFormData('customer_mobile', text)}
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
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}>
            <TextInput
              style={[styles.textInput, styles.multilineInput]}
              placeholder="Enter Customer Address"
              placeholderTextColor="#666"
              value={formData.customer_address}
              onChangeText={text => updateFormData('customer_address', text)}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </LinearGradient>
        </View>

        {/* Tractor Model */}
        <View style={styles.inputContainer}>
          <Text style={styles.fieldLabel}>Tractor Model</Text>
          <TouchableOpacity onPress={() => setShowTractorModelDropdown(true)}>
            <LinearGradient
              colors={['#7E5EA9', '#20AEBC']}
              style={styles.gradientBorder}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}>
              <View style={styles.dropdownContainer}>
                <Text
                  style={[
                    styles.dropdownText,
                    !formData.tractor_model && styles.placeholderText,
                  ]}>
                  {formData.tractor_model || 'Select Tractor Model'}
                </Text>
                <Icon2
                  name="keyboard-arrow-down"
                  size={moderateScale(24)}
                  color="#666"
                />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Date of Delivery */}
        <View style={styles.inputContainer}>
          <Text style={styles.fieldLabel}>Date of Delivery</Text>
          <TouchableOpacity onPress={() => setShowDeliveryDatePicker(true)}>
            <LinearGradient
              colors={['#7E5EA9', '#20AEBC']}
              style={styles.gradientBorder}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}>
              <View style={styles.dateContainer}>
                <Text style={styles.dateText}>
                  {formatDate(formData.delivery_date)}
                </Text>
                <Icon1
                  name="calendar-o"
                  size={moderateScale(20)}
                  color="grey"
                />
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
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}>
            <TextInput
              style={styles.textInput}
              placeholder="Enter Chassis No"
              placeholderTextColor="#666"
              value={formData.chassis_no}
              onChangeText={text => updateFormData('chassis_no', text)}
            />
          </LinearGradient>
        </View>

        {/* Opening Balance */}
        <View style={styles.inputContainer}>
          <Text style={styles.fieldLabel}>Opening Balance *</Text>
          <LinearGradient
            colors={['#7E5EA9', '#20AEBC']}
            style={styles.gradientBorder}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}>
            <TextInput
              style={styles.textInput}
              placeholder="Enter Opening Balance"
              placeholderTextColor="#666"
              value={formData.opening_balance}
              onChangeText={text => updateFormData('opening_balance', text)}
              keyboardType="numeric"
              returnKeyType="done"
            />
          </LinearGradient>
        </View>

        {/* Total Amount Paid */}
        <View style={styles.inputContainer}>
          <Text style={styles.fieldLabel}>Total Amount Paid *</Text>
          <LinearGradient
            colors={['#7E5EA9', '#20AEBC']}
            style={styles.gradientBorder}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}>
            <TextInput
              style={styles.textInput}
              placeholder="Total Amount Paid"
              placeholderTextColor="#666"
              value={formData.total_paid}
              onChangeText={text => updateFormData('total_paid', text)}
              keyboardType="numeric"
            />
          </LinearGradient>
        </View>

        {/* Remaining Payment (Display only) */}
        <View style={styles.inputContainer}>
          <Text style={styles.fieldLabel}>Remaining Payment</Text>
          <LinearGradient
            colors={['#7E5EA9', '#20AEBC']}
            style={styles.gradientBorder}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}>
            <View style={styles.displayContainer}>
              <Text style={styles.displayLabel}>Remaining Payment:</Text>
              <Text
                style={[
                  styles.displayValue,
                  remainingPayment < 0 && styles.negativeValue,
                ]}>
                ₹{remainingPayment.toFixed(2)}
              </Text>
            </View>
          </LinearGradient>
        </View>

        {/* Payment History Info and Actions */}
        <View style={styles.paymentHistoryActionsContainer}>
          {paymentHistory.length > 0 && (
            <TouchableOpacity
              style={styles.viewHistoryButton}
              onPress={() => setShowPaymentHistoryModal(true)}>
              <LinearGradient
                colors={['#20AEBC', '#7E5EA9']}
                style={styles.viewHistoryGradient}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}>
                <Icon2 name="history" size={moderateScale(20)} color="#FFF" />
                <Text style={styles.viewHistoryText}>
                  View Payment History ({paymentHistory.length} entries)
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          )}

          {isEditMode && (
            <TouchableOpacity
              style={styles.addPaymentHistoryButton}
              onPress={() => setIsAddingPaymentHistory(true)}>
              <LinearGradient
                colors={['#4CAF50', '#45a049']}
                style={styles.addPaymentHistoryGradient}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}>
                <Icon2 name="add" size={moderateScale(20)} color="#FFF" />
                <Text style={styles.addPaymentHistoryText}>
                  Add Payment Entry
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>

        {/* Save/Update Customer Payment Button */}
        <TouchableOpacity
          style={[styles.buttonContainer, loading && styles.buttonDisabled]}
          onPress={handleSavePayment}
          activeOpacity={0.8}
          disabled={loading}>
          <LinearGradient
            colors={['#AC62A1', '#20AEBC']}
            style={styles.gradientButton}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}>
            {loading ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <Text style={styles.buttonText}>
                {isEditMode
                  ? 'Update Customer Payment'
                  : 'Add Customer Payment'}
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

        {showPaymentDatePicker && (
          <DateTimePicker
            value={newPaymentHistory.entry_date}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={onPaymentDateChange}
          />
        )}
      </ScrollView>

      {/* Modals */}
      {renderTractorModelDropdown()}
      {renderPaymentHistoryModal()}
      {renderAddPaymentHistoryForm()}
    </View>
  );
};

// ... Keep the same styles object as before (no changes needed) ...

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
    backgroundColor: '#FF9800',
    borderRadius: moderateScale(8),
    paddingHorizontal: moderateScale(15),
    paddingVertical: moderateScale(12),
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: verticalScale(50),
  },
  statusInfoText: {
    fontSize: moderateScale(14),
    color: '#FFF',
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
  dropdownContainer: {
    backgroundColor: '#FFF',
    borderRadius: moderateScale(8),
    paddingHorizontal: moderateScale(15),
    paddingVertical: moderateScale(12),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: verticalScale(50),
  },
  dropdownText: {
    fontSize: moderateScale(16),
    color: '#333',
  },
  placeholderText: {
    color: '#666',
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
  negativeValue: {
    color: '#F44336',
  },
  paymentHistoryActionsContainer: {
    marginBottom: verticalScale(15),
    gap: verticalScale(10),
  },
  viewHistoryButton: {
    borderRadius: moderateScale(10),
    overflow: 'hidden',
  },
  viewHistoryGradient: {
    paddingHorizontal: moderateScale(15),
    paddingVertical: verticalScale(12),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewHistoryText: {
    color: '#FFF',
    fontSize: moderateScale(16),
    fontWeight: '600',
    marginLeft: moderateScale(10),
  },
  addPaymentHistoryButton: {
    borderRadius: moderateScale(10),
    overflow: 'hidden',
  },
  addPaymentHistoryGradient: {
    paddingHorizontal: moderateScale(15),
    paddingVertical: verticalScale(12),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addPaymentHistoryText: {
    color: '#FFF',
    fontSize: moderateScale(16),
    fontWeight: '600',
    marginLeft: moderateScale(10),
  },
  buttonContainer: {
    marginTop: verticalScale(10),
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
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: moderateScale(20),
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: moderateScale(10),
    width: '90%',
    maxHeight: '80%',
    padding: moderateScale(15),
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(15),
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: verticalScale(10),
  },
  modalTitle: {
    fontSize: moderateScale(18),
    fontWeight: '600',
    color: '#000',
  },
  closeButton: {
    padding: moderateScale(5),
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: verticalScale(40),
  },
  loadingText: {
    fontSize: moderateScale(16),
    color: '#666',
    marginTop: verticalScale(10),
  },
  dropdownList: {
    maxHeight: verticalScale(300),
  },
  dropdownItem: {
    paddingVertical: verticalScale(12),
    paddingHorizontal: moderateScale(15),
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dropdownItemText: {
    fontSize: moderateScale(16),
    color: '#333',
  },
  // Payment History Modal Styles
  paymentHistoryModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: moderateScale(20),
  },
  paymentHistoryModalContent: {
    backgroundColor: 'white',
    borderRadius: moderateScale(10),
    width: '100%',
    maxHeight: '80%',
    padding: moderateScale(15),
  },
  paymentHistoryModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(15),
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: verticalScale(10),
  },
  paymentHistoryModalTitle: {
    fontSize: moderateScale(18),
    fontWeight: '600',
    color: '#000',
  },
  paymentHistoryCloseButton: {
    padding: moderateScale(5),
  },
  paymentHistoryItem: {
    backgroundColor: '#f8f9fa',
    padding: moderateScale(12),
    borderRadius: moderateScale(8),
    marginBottom: verticalScale(10),
    borderLeftWidth: 4,
    borderLeftColor: '#7E5EA9',
  },
  paymentHistoryItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(8),
  },
  paymentHistoryAmount: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  paymentHistoryActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(10),
  },
  paymentHistoryDate: {
    fontSize: moderateScale(14),
    color: '#666',
  },
  removePaymentButton: {
    padding: moderateScale(4),
  },
  paymentHistoryDetails: {
    marginTop: verticalScale(5),
  },
  paymentHistoryBy: {
    fontSize: moderateScale(14),
    color: '#333',
    fontWeight: '500',
    marginBottom: verticalScale(4),
  },
  paymentHistoryRemarks: {
    fontSize: moderateScale(13),
    color: '#666',
    fontStyle: 'italic',
  },
  noPaymentHistoryContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: verticalScale(40),
  },
  noPaymentHistory: {
    fontSize: moderateScale(16),
    color: '#666',
    textAlign: 'center',
    marginTop: verticalScale(10),
  },
  addHistoryButton: {
    marginTop: verticalScale(15),
    borderRadius: moderateScale(10),
    overflow: 'hidden',
  },
  addHistoryGradient: {
    paddingHorizontal: moderateScale(15),
    paddingVertical: verticalScale(12),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addHistoryText: {
    color: '#FFF',
    fontSize: moderateScale(16),
    fontWeight: '600',
    marginLeft: moderateScale(10),
  },
  // Add Payment Modal Styles
  addPaymentModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: moderateScale(20),
  },
  addPaymentModalContent: {
    backgroundColor: 'white',
    borderRadius: moderateScale(10),
    width: '100%',
    maxHeight: '80%',
    padding: moderateScale(15),
  },
  addPaymentModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(15),
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: verticalScale(10),
  },
  addPaymentModalTitle: {
    fontSize: moderateScale(18),
    fontWeight: '600',
    color: '#000',
  },
  addPaymentFormScroll: {
    maxHeight: verticalScale(400),
  },
  addPaymentButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: verticalScale(20),
    gap: moderateScale(10),
  },
  cancelAddButton: {
    flex: 1,
    borderRadius: moderateScale(10),
    overflow: 'hidden',
  },
  cancelAddGradient: {
    paddingVertical: verticalScale(12),
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelAddText: {
    color: '#FFF',
    fontSize: moderateScale(16),
    fontWeight: '600',
  },
  saveAddButton: {
    flex: 1,
    borderRadius: moderateScale(10),
    overflow: 'hidden',
  },
  saveAddGradient: {
    paddingVertical: verticalScale(12),
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveAddText: {
    color: '#FFF',
    fontSize: moderateScale(16),
    fontWeight: '600',
  },
});

export default Addcustomerpayment;