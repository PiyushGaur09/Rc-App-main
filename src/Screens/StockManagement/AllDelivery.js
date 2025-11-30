// AllDelivery.js
// import React, { useEffect, useState, useCallback } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   FlatList,
//   ActivityIndicator,
//   Image,
//   TouchableOpacity,
//   Modal,
//   TextInput,
//   Alert,
//   ScrollView,
//   RefreshControl,
//   Platform,
// } from 'react-native';
// import LinearGradient from 'react-native-linear-gradient';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';

// // Optional: image picker for selecting new signatures
// // Install: npm install react-native-image-picker
// import { launchImageLibrary } from 'react-native-image-picker';

// const API_BASE = 'https://argosmob.uk/makroo/public/';

// const AllDelivery = ({ navigation }) => {
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [error, setError] = useState(null);
//   const [deliveries, setDeliveries] = useState([]);
//   const insets = useSafeAreaInsets();

//   // Modal & form state
//   const [modalVisible, setModalVisible] = useState(false);
//   const [selected, setSelected] = useState(null); // selected item to edit
//   const [updating, setUpdating] = useState(false);
//   const [deletingId, setDeletingId] = useState(null);

//   // form fields local copy
//   const [formState, setFormState] = useState({
//     id: '',
//     customer_name: '',
//     father_name: '',
//     address: '',
//     user_id: '',
//     tractor_number: '',
//     engine_number: '',
//     document_type: '',
//     document_number: '',
//     submitted_at: '',
//     // signatures can be existing remote path or local uri object {uri, name, type}
//     customer_signature: null,
//     manager_signature: null,
//   });

//   const fetchAll = useCallback(async () => {
//     setError(null);
//     try {
//       const storedUserId = await AsyncStorage.getItem('userId');
//       const userId = (storedUserId || '').toString().trim();
//       if (!userId) {
//         // still attempt to fetch without user_id if required by API; but here we throw
//         throw new Error('Missing userId in AsyncStorage.');
//       }

//       const data = new FormData();
//       data.append('user_id', userId);

//       const res = await axios.post(
//         API_BASE + 'api/v1/delivery-forms/all',
//         data,
//         {
//           headers: { 'Content-Type': 'multipart/form-data' },
//           maxBodyLength: Infinity,
//         }
//       );

//       setDeliveries(Array.isArray(res?.data?.data) ? res.data.data : []);
//     } catch (e) {
//       // prefer API response error when available
//       const err = e?.response?.data?.message ?? e?.response?.data ?? e?.message ?? 'Unknown error';
//       setError(err);
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchAll();
//   }, [fetchAll]);

//   const onRefresh = () => {
//     setRefreshing(true);
//     fetchAll();
//   };

//   // open modal and prefill fields
//   const openEditModal = (item) => {
//     setSelected(item);
//     setFormState({
//       id: item.id,
//       customer_name: item.customer_name ?? '',
//       father_name: item.father_name ?? '',
//       address: item.address ?? '',
//       user_id: item.user_id ?? '',
//       tractor_number: item.tractor_number ?? '',
//       engine_number: item.engine_number ?? '',
//       document_type: item.document_type ?? '',
//       document_number: item.document_number ?? '',
//       submitted_at: item.submitted_at ?? '',
//       // store remote path string so we can display existing image; if user picks new image this becomes an object
//       customer_signature: item.customer_signature ? API_BASE + item.customer_signature : null,
//       manager_signature: item.manager_signature ? API_BASE + item.manager_signature : null,
//     });
//     setModalVisible(true);
//   };

//   // pick image from gallery (for signatures)
//   const pickImage = async (fieldName) => {
//     try {
//       const result = await launchImageLibrary({
//         mediaType: 'photo',
//         quality: 0.8,
//         selectionLimit: 1,
//       });

//       if (result.didCancel) return;
//       if (result.errorCode) {
//         Alert.alert('Image Picker error', result.errorMessage || 'Unknown');
//         return;
//       }

//       const asset = result.assets && result.assets[0];
//       if (!asset) return;

//       // Build an object for RN FormData: { uri, name, type }
//       const name = asset.fileName || `photo_${Date.now()}.jpg`;
//       // On Android the uri is fine; on iOS it might be 'file://'
//       const file = {
//         uri: Platform.OS === 'ios' && asset.uri?.startsWith('file://') ? asset.uri : asset.uri,
//         name,
//         type: asset.type || 'image/jpeg',
//       };

//       setFormState((s) => ({ ...s, [fieldName]: file }));
//     } catch (err) {
//       console.warn('pickImage error', err);
//     }
//   };

//   // Build FormData and call Update API
//   const handleUpdate = async () => {
//     if (!formState.id) {
//       Alert.alert('Missing ID', 'Cannot update: missing form id.');
//       return;
//     }

//     setUpdating(true);
//     try {
//       const data = new FormData();
//       data.append('customer_name', formState.customer_name);
//       data.append('father_name', formState.father_name);
//       data.append('address', formState.address);
//       data.append('user_id', formState.user_id?.toString() ?? '');
//       data.append('tractor_number', formState.tractor_number);
//       data.append('engine_number', formState.engine_number);
//       data.append('document_type', formState.document_type);
//       data.append('document_number', formState.document_number);
//       data.append('submitted_at', formState.submitted_at);
//       data.append('id', String(formState.id));

//       // if user picked a new image object, append it as file; otherwise don't append to keep existing
//       if (formState.manager_signature && typeof formState.manager_signature === 'object') {
//         data.append('manager_signature', {
//           uri: formState.manager_signature.uri,
//           name: formState.manager_signature.name || `manager_${Date.now()}.jpg`,
//           type: formState.manager_signature.type || 'image/jpeg',
//         });
//       }
//       if (formState.customer_signature && typeof formState.customer_signature === 'object') {
//         data.append('customer_signature', {
//           uri: formState.customer_signature.uri,
//           name: formState.customer_signature.name || `customer_${Date.now()}.jpg`,
//           type: formState.customer_signature.type || 'image/jpeg',
//         });
//       }

//       const config = {
//         method: 'post',
//         maxBodyLength: Infinity,
//         url: API_BASE + 'api/v1/delivery-forms/update',
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//         data,
//       };

//       const res = await axios(config);
//       // Expecting { status: 'success', data: {...} }
//       if (res?.data?.status === 'success') {
//         Alert.alert('Updated', 'Form updated successfully.');
//         setModalVisible(false);
//         // refresh list to show updated data
//         fetchAll();
//       } else {
//         Alert.alert('Update failed', JSON.stringify(res?.data ?? 'No response'));
//       }
//     } catch (e) {
//       console.error('update error', e);
//       const err = e?.response?.data ?? e?.message ?? 'Unknown error';
//       Alert.alert('Update error', typeof err === 'string' ? err : JSON.stringify(err));
//     } finally {
//       setUpdating(false);
//     }
//   };

//   // Delete API call
//   const handleDelete = (id) => {
//     Alert.alert(
//       'Confirm delete',
//       `Delete delivery form #${id}? This action cannot be undone.`,
//       [
//         { text: 'Cancel', style: 'cancel' },
//         {
//           text: 'Delete',
//           style: 'destructive',
//           onPress: () => performDelete(id),
//         },
//       ]
//     );
//   };

//   const performDelete = async (id) => {
//     setDeletingId(id);
//     try {
//       const config = {
//         method: 'delete',
//         maxBodyLength: Infinity,
//         url: API_BASE + `api/v1/delivery-forms/${id}`,
//         headers: {},
//       };

//       const res = await axios(config);
//       if (res?.data?.status === 'success' || res?.data?.message) {
//         Alert.alert('Deleted', `Form #${id} deleted.`);
//         fetchAll();
//       } else {
//         Alert.alert('Delete failed', JSON.stringify(res?.data ?? 'No response'));
//       }
//     } catch (e) {
//       console.error('delete error', e);
//       const err = e?.response?.data ?? e?.message ?? 'Unknown error';
//       Alert.alert('Delete error', typeof err === 'string' ? err : JSON.stringify(err));
//     } finally {
//       setDeletingId(null);
//     }
//   };

//   const renderItem = ({ item }) => {
//     // base for remote images
//     const imgBase = API_BASE;
//     return (
//       <View style={styles.cardWrapper}>
//         <LinearGradient
//           colors={['#F6F7FB', '#FFFFFF']}
//           start={{ x: 0, y: 0 }}
//           end={{ x: 1, y: 0 }}
//           style={styles.cardGradient}
//         >
//           <View style={styles.card}>
//             <View style={styles.cardHeader}>
//               <View style={styles.titleBlock}>
//                 <Text style={styles.cardTitle}>{item.customer_name || '-'}</Text>
//                 <Text style={styles.cardSubTitle}>#{item.id}</Text>
//               </View>
//               <View style={styles.metaBlock}>
//                 <Text style={styles.metaText}>{item.document_type || '-'}</Text>
//               </View>
//             </View>

//             <View style={styles.rowBetween}>
//               <View style={styles.pill}>
//                 <Icon name="person" size={14} color="#4B5563" />
//                 <Text style={styles.pillText}>{item.father_name || '-'}</Text>
//               </View>

//               <View style={styles.datePill}>
//                 <Icon name="event" size={14} color="#4B5563" />
//                 <Text style={styles.dateText}>
//                   {item.submitted_at ? item.submitted_at.split(' ')[0] : '-'}
//                 </Text>
//               </View>
//             </View>

//             <View style={styles.kvWrap}>
//               <Text style={styles.kKey}>Address</Text>
//               <Text style={styles.kValSmall}>{item.address || '-'}</Text>
//             </View>

//             <View style={styles.kvRow}>
//               <View style={styles.kvCol}>
//                 <Text style={styles.kKey}>Tractor</Text>
//                 <Text style={styles.kVal}>{item.tractor_number || '-'}</Text>
//               </View>
//               <View style={styles.kvCol}>
//                 <Text style={styles.kKey}>Engine</Text>
//                 <Text style={styles.kVal}>{item.engine_number || '-'}</Text>
//               </View>
//             </View>

//             <View style={styles.sigRow}>
//               <View style={styles.sigBox}>
//                 <Text style={styles.sigLabel}>Customer</Text>
//                 {item.customer_signature ? (
//                   <Image
//                     source={{ uri: imgBase + item.customer_signature }}
//                     style={styles.sigImgRounded}
//                     resizeMode="cover"
//                   />
//                 ) : (
//                   <View style={styles.noSig}>
//                     <Icon name="image-not-supported" size={22} color="#9CA3AF" />
//                     <Text style={styles.sigPlaceholder}>No image</Text>
//                   </View>
//                 )}
//               </View>

//               <View style={styles.sigBox}>
//                 <Text style={styles.sigLabel}>Manager</Text>
//                 {item.manager_signature ? (
//                   <Image
//                     source={{ uri: imgBase + item.manager_signature }}
//                     style={styles.sigImgRounded}
//                     resizeMode="cover"
//                   />
//                 ) : (
//                   <View style={styles.noSig}>
//                     <Icon name="image-not-supported" size={22} color="#9CA3AF" />
//                     <Text style={styles.sigPlaceholder}>No image</Text>
//                   </View>
//                 )}
//               </View>
//             </View>

//             {/* bottom action buttons */}
//             <View style={styles.actionRow}>
//               <TouchableOpacity
//                 style={styles.updateBtn}
//                 onPress={() => openEditModal(item)}
//                 disabled={updating}
//                 activeOpacity={0.8}
//               >
//                 <LinearGradient
//                   colors={['#4F46E5', '#06B6D4']}
//                   start={{ x: 0, y: 0 }}
//                   end={{ x: 1, y: 0 }}
//                   style={styles.updateGradient}
//                 >
//                   <Icon name="edit" size={16} color="#fff" />
//                   <Text style={styles.actionText}>Update</Text>
//                 </LinearGradient>
//               </TouchableOpacity>

//               <TouchableOpacity
//                 style={styles.deleteBtn}
//                 onPress={() => handleDelete(item.id)}
//                 disabled={deletingId === item.id}
//                 activeOpacity={0.8}
//               >
//                 {deletingId === item.id ? (
//                   <ActivityIndicator color="#fff" />
//                 ) : (
//                   <>
//                     <Icon name="delete-outline" size={16} color="#fff" />
//                     <Text style={styles.actionText}>Delete</Text>
//                   </>
//                 )}
//               </TouchableOpacity>
//             </View>
//           </View>
//         </LinearGradient>
//       </View>
//     );
//   };

//   return (
//     <View style={[{ paddingTop: insets.top, paddingBottom: insets.bottom, backgroundColor: '#F3F4F6',}]}>
//       <LinearGradient
//         colors={['#7E5EA9', '#20AEBC']}
//         start={{ x: 0, y: 0 }}
//         end={{ x: 1, y: 0 }}
//         style={styles.header}
//       >
//          <View style={styles.headerContent}>
//                   {/* Left Side: Menu Icon */}
//                   <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Hamburger')}>
//                     <Icon name="reorder" size={25} color="#fff" />
//                   </TouchableOpacity>
        
//                   {/* Center: Dashboard Text */}
//                   <View>
//                     <Text style={styles.companyName}>Makroo Motor Corp.</Text>
//                     <Text style={styles.companyName1}>All Delivery</Text>
//                   </View>
        
//                   {/* Right Side: Icon */}
//                   <TouchableOpacity style={styles.iconButton}>
//                     <Icon name="notifications-on" size={25} color="#fff" />
//                   </TouchableOpacity>
//                 </View>
      
//       </LinearGradient>

//       {loading ? (
//         <View style={styles.center}>
//           <ActivityIndicator size="large" />
//           <Text style={styles.loadingText}>Loading deliveries...</Text>
//         </View>
//       ) : error ? (
//         <View style={styles.center}>
//           <Icon name="error-outline" size={28} color="#b00020" />
//           <Text style={styles.errorText}>
//             {typeof error === 'string' ? error : JSON.stringify(error)}
//           </Text>
//           <TouchableOpacity style={styles.retryBtn} onPress={fetchAll}>
//             <Text style={styles.retryBtnText}>Retry</Text>
//           </TouchableOpacity>
//         </View>
//       ) : (
//         <FlatList
//           data={deliveries}
//           keyExtractor={(item) => String(item.id)}
//           renderItem={renderItem}
//           contentContainerStyle={styles.listContent}
//           refreshControl={
//             <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//           }
//           ListEmptyComponent={
//             <View style={styles.center}>
//               <Icon name="inbox" size={36} color="#9CA3AF" />
//               <Text style={styles.emptyText}>No deliveries found.</Text>
//             </View>
//           }
//         />
//       )}

//       {/* Edit Modal */}
//       <Modal
//         visible={modalVisible}
//         animationType="slide"
//         onRequestClose={() => {
//           if (!updating) setModalVisible(false);
//         }}
//       >
//         <View style={styles.modalContainer}>
//           <ScrollView
//             contentContainerStyle={{ padding: 16 }}
//             keyboardShouldPersistTaps="handled"
//           >
//             <View style={styles.modalHeaderRow}>
//               <Text style={styles.modalTitle}>Update Delivery #{formState.id}</Text>
//               <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalClose}>
//                 <Icon name="close" size={22} color="#374151" />
//               </TouchableOpacity>
//             </View>

//             <Text style={styles.inputLabel}>Customer Name</Text>
//             <TextInput
//               style={styles.input}
//               value={formState.customer_name}
//               onChangeText={(t) => setFormState((s) => ({ ...s, customer_name: t }))}
//               placeholder="e.g. Ajay Kumar"
//                    placeholderTextColor="#666"

//             />

//             <Text style={styles.inputLabel}>Father Name</Text>
//             <TextInput
//               style={styles.input}
//               value={formState.father_name}
//               onChangeText={(t) => setFormState((s) => ({ ...s, father_name: t }))}
//               placeholder="e.g. Suresh Kumar"
//               placeholderTextColor="#666"
            
//             />

//             <Text style={styles.inputLabel}>Address</Text>
//             <TextInput
//               style={[styles.input, { minHeight: 70 }]}
//               value={formState.address}
//               onChangeText={(t) => setFormState((s) => ({ ...s, address: t }))}
//               multiline
//               placeholder="Full address"
//               placeholderTextColor="#666"

//             />

//             <View style={styles.inlineRow}>
//               <View style={{ flex: 1, paddingRight: 6 }}>
//                 <Text style={styles.inputLabel}>Tractor No.</Text>
//                 <TextInput
//                   style={styles.input}
//                   value={formState.tractor_number}
//                   onChangeText={(t) => setFormState((s) => ({ ...s, tractor_number: t }))}
//                   placeholder="TR1234"
//                   placeholderTextColor="#666"

//                 />
//               </View>
//               <View style={{ flex: 1, paddingLeft: 6 }}>
//                 <Text style={styles.inputLabel}>Engine No.</Text>
//                 <TextInput
//                   style={styles.input}
//                   value={formState.engine_number}
//                   onChangeText={(t) => setFormState((s) => ({ ...s, engine_number: t }))}
//                   placeholder="EN6789"
//                   placeholderTextColor="#666"

//                 />
//               </View>
//             </View>

//             <View style={styles.inlineRow}>
//               <View style={{ flex: 1, paddingRight: 6 }}>
//                 <Text style={styles.inputLabel}>Doc Type</Text>
//                 <TextInput
//                   style={styles.input}
//                   value={formState.document_type}
//                   onChangeText={(t) => setFormState((s) => ({ ...s, document_type: t }))}
//                   placeholder="Aadhaar / PAN"
//                   placeholderTextColor="#666"

//                 />
//               </View>
//               <View style={{ flex: 1, paddingLeft: 6 }}>
//                 <Text style={styles.inputLabel}>Doc No.</Text>
//                 <TextInput
//                   style={styles.input}
//                   value={formState.document_number}
//                   onChangeText={(t) => setFormState((s) => ({ ...s, document_number: t }))}
//                   placeholder="1234-5678-9012"
//                    placeholderTextColor="#666"

//                 />
//               </View>
//             </View>

//             <Text style={styles.inputLabel}>Submitted At</Text>
//             <TextInput
//               style={styles.input}
//               value={formState.submitted_at}
//               onChangeText={(t) => setFormState((s) => ({ ...s, submitted_at: t }))}
//               placeholder="YYYY-MM-DD HH:mm:ss"
//                    placeholderTextColor="#666"

//             />

//             {/* Signatures */}
//             <View style={{ marginTop: 12 }}>
//               <Text style={styles.inputLabel}>Customer Signature</Text>
//               {formState.customer_signature ? (
//                 typeof formState.customer_signature === 'string' ? (
//                   <Image
//                     source={{ uri: formState.customer_signature }}
//                     style={styles.previewImgRounded}
//                     resizeMode="cover"
//                   />
//                 ) : (
//                   <Image
//                     source={{ uri: formState.customer_signature.uri }}
//                     style={styles.previewImgRounded}
//                     resizeMode="cover"
//                   />
//                 )
//               ) : (
//                 <View style={styles.previewEmpty}>
//                   <Icon name="image" size={28} color="#9CA3AF" />
//                   <Text style={styles.sigSmallPlaceholder}>No image selected</Text>
//                 </View>
//               )}

//               <View style={styles.rowActions}>
//                 <TouchableOpacity
//                   style={styles.smallBtn}
//                   onPress={() => pickImage('customer_signature')}
//                 >
//                   <Icon name="photo" size={14} color="#fff" />
//                   <Text style={styles.smallBtnText}>Pick</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                   style={[styles.smallBtn, styles.smallBtnGray]}
//                   onPress={() => setFormState((s) => ({ ...s, customer_signature: null }))}
//                 >
//                   <Icon name="clear" size={14} color="#fff" />
//                   <Text style={styles.smallBtnText}>Clear</Text>
//                 </TouchableOpacity>
//               </View>
//             </View>

//             <View style={{ marginTop: 12 }}>
//               <Text style={styles.inputLabel}>Manager Signature</Text>
//               {formState.manager_signature ? (
//                 typeof formState.manager_signature === 'string' ? (
//                   <Image
//                     source={{ uri: formState.manager_signature }}
//                     style={styles.previewImgRounded}
//                     resizeMode="cover"
//                   />
//                 ) : (
//                   <Image
//                     source={{ uri: formState.manager_signature.uri }}
//                     style={styles.previewImgRounded}
//                     resizeMode="cover"
//                   />
//                 )
//               ) : (
//                 <View style={styles.previewEmpty}>
//                   <Icon name="image" size={28} color="#9CA3AF" />
//                   <Text style={styles.sigSmallPlaceholder}>No image selected</Text>
//                 </View>
//               )}

//               <View style={styles.rowActions}>
//                 <TouchableOpacity
//                   style={styles.smallBtn}
//                   onPress={() => pickImage('manager_signature')}
//                 >
//                   <Icon name="photo" size={14} color="#fff" />
//                   <Text style={styles.smallBtnText}>Pick</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                   style={[styles.smallBtn, styles.smallBtnGray]}
//                   onPress={() => setFormState((s) => ({ ...s, manager_signature: null }))}
//                 >
//                   <Icon name="clear" size={14} color="#fff" />
//                   <Text style={styles.smallBtnText}>Clear</Text>
//                 </TouchableOpacity>
//               </View>
//             </View>

//             {/* buttons */}
//             <View style={{ marginTop: 22, marginBottom: 30 }}>
//               <TouchableOpacity
//                 style={[styles.saveBtn, updating && { opacity: 0.7 }]}
//                 onPress={handleUpdate}
//                 disabled={updating}
//                 activeOpacity={0.9}
//               >
//                 {updating ? <ActivityIndicator color="#fff" /> : (
//                   <View style={styles.saveInner}>
//                     <Icon name="save" size={16} color="#fff" />
//                     <Text style={styles.saveBtnText}>Save Changes</Text>
//                   </View>
//                 )}
//               </TouchableOpacity>

//               <TouchableOpacity
//                 style={[styles.cancelBtn, { marginTop: 10 }]}
//                 onPress={() => {
//                   if (!updating) setModalVisible(false);
//                 }}
//                 activeOpacity={0.9}
//               >
//                 <Text style={styles.cancelBtnText}>Cancel</Text>
//               </TouchableOpacity>
//             </View>
//           </ScrollView>
//         </View>
//       </Modal>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   header: {  paddingVertical: 10,paddingHorizontal:15 },
//   companyName: {
//     fontSize: 17,
//     fontWeight: '500',
//     color: 'white',
//     textAlign: 'center',
//     fontFamily: 'Inter_28pt-SemiBold'
//   },
//    companyName1: {
//     fontSize: 15,
//     fontFamily: 'Inter_28pt-SemiBold',
//     color: 'white',
//     textAlign: 'center',
//   },

//   // page
//   listContent: {
//     paddingHorizontal: 16,
//     paddingVertical: 14,
//     paddingBottom: 90,
//   },

//   // enhanced card wrapper + subtle shadow
//   cardWrapper: {
//     marginBottom: 14,
//     borderRadius: 14,
//     // small outer padding to create "floating" look
//     padding: 6,
//     marginHorizontal: 2,
//   },
//   cardGradient: {
//     borderRadius: 12,
//     padding: 1,
//   },
//   card: {
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     padding: 14,
//     // elevation / shadow
//     ...Platform.select({
//       ios: {
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 6 },
//         shadowOpacity: 0.06,
//         shadowRadius: 12,
//       },
//       android: {
//         elevation: 3,
//       },
//     }),
//   },

//   cardHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   titleBlock: {
//     flexDirection: 'column',
//   },
//   cardTitle: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: '#0F172A',
//   },
//   cardSubTitle: {
//     fontSize: 12,
//     color: '#6B7280',
//     marginTop: 2,
//   },
//   metaBlock: {
//     backgroundColor: '#EEF2FF',
//     paddingHorizontal: 10,
//     paddingVertical: 6,
//     borderRadius: 20,
//   },
//   metaText: { fontSize: 12, color: '#4338CA', fontWeight: '600' },

//   rowBetween: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 8,
//     alignItems: 'center',
//   },
//   pill: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#F8FAFC',
//     borderRadius: 18,
//     paddingHorizontal: 10,
//     paddingVertical: 6,
//   },
//   pillText: { fontSize: 12, color: '#374151', marginLeft: 6 },

//   datePill: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#FFF7ED',
//     borderRadius: 18,
//     paddingHorizontal: 10,
//     paddingVertical: 6,
//   },
//   dateText: { fontSize: 12, color: '#92400E', marginLeft: 6 },

//   kvWrap: { marginTop: 6, marginBottom: 8 },
//   kvRow: {
//     flexDirection: 'row',
//     marginBottom: 10,
//   },
//   kvCol: {
//     flex: 1,
//     backgroundColor: '#FBFDFF',
//     borderRadius: 8,
//     padding: 10,
//     marginRight: 8,
//   },
//   kKey: { fontSize: 11, color: '#6B7280', marginBottom: 4 },
//   kVal: { fontSize: 14, color: '#0F172A', fontWeight: '600' },
//   kValSmall: { fontSize: 13, color: '#374151' },

//   sigRow: {
//     flexDirection: 'row',
//     marginTop: 8,
//     gap: 12,
//   },
//   sigBox: {
//     flex: 1,
//     borderWidth: 1,
//     borderColor: '#E6EEF8',
//     borderRadius: 10,
//     padding: 8,
//     alignItems: 'center',
//     justifyContent: 'center',
//     minHeight: 90,
//     backgroundColor: '#FAFBFF',
//   },
//   sigLabel: { fontSize: 12, color: '#6B7280', marginBottom: 6 },
//   sigImgRounded: { width: 84, height: 84, borderRadius: 12, backgroundColor: '#fff' },
//   noSig: { alignItems: 'center' },
//   sigPlaceholder: { fontSize: 12, color: '#9CA3AF', marginTop: 6 },

//   center: {
//     paddingTop: 40,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   loadingText: { marginTop: 10, color: '#374151' },
//   errorText: { marginTop: 8, color: '#b00020', textAlign: 'center', paddingHorizontal: 16 },

//   retryBtn: {
//     marginTop: 12,
//     backgroundColor: '#7E5EA9',
//     paddingHorizontal: 14,
//     paddingVertical: 10,
//     borderRadius: 8,
//   },
//   retryBtnText: { color: '#fff', fontWeight: '600' },

//   actionRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 14,
//   },
//   updateBtn: {
//     flex: 1,
//     marginRight: 8,
//     borderRadius: 10,
//     overflow: 'hidden',
//   },
//   updateGradient: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 10,
//     borderRadius: 10,
//   },
//   deleteBtn: {
//     flex: 1,
//     backgroundColor: '#EF4444',
//     paddingVertical: 10,
//     borderRadius: 10,
//     alignItems: 'center',
//     flexDirection: 'row',
//     justifyContent: 'center',
//     gap: 8,
//   },
//   actionText: {
//     color: '#fff',
//     marginLeft: 8,
//     fontWeight: '700',
//     fontSize: 14,
//   },

//   // page footer / home (unused currently)
//   bottomBar: {
//     position: 'absolute',
//     left: 0,
//     right: 0,
//     bottom: 12,
//     paddingHorizontal: 15,
//   },
//   homeButton: {
//     backgroundColor: '#20AEBC',
//     padding: 15,
//     borderRadius: 10,
//     alignItems: 'center',
//   },
//   homeButtonText: { color: '#fff', fontWeight: '700' },

//   // Modal styles (refined)
//   modalContainer: { flex: 1, backgroundColor: '#F8FAFC' , paddingTop: Platform.OS === 'android' ? 12 : 0},
//   modalHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
//   modalTitle: { fontSize: 18, fontWeight: '800', color: '#0F172A' },
//   modalClose: { padding: 6 },

//   inputLabel: { fontSize: 13, color: '#475569', marginBottom: 6 },
//   input: {
//     borderWidth: 1,
//     borderColor: '#E6EEF8',
//     borderRadius: 10,
//     padding: 12,
//     marginBottom: 10,
//     backgroundColor: '#fff',
//     fontSize: 14,
//     color: '#0F172A',
//   },
//   previewImgRounded: { width: '100%', height: 160, borderRadius: 10, marginBottom: 8 },
//   previewEmpty: {
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: '#E6EEF8',
//     padding: 18,
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#fff',
//     marginBottom: 8,
//   },
//   sigSmallPlaceholder: { color: '#9CA3AF', marginTop: 6 },

//   rowActions: { flexDirection: 'row', marginTop: 6 },
//   smallBtn: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#06B6D4',
//     paddingVertical: 10,
//     paddingHorizontal: 14,
//     borderRadius: 10,
//     marginRight: 10,
//   },
//   smallBtnGray: { backgroundColor: '#6B7280' },
//   smallBtnText: { color: '#fff', fontWeight: '700', marginLeft: 8 },

//   saveBtn: {
//     backgroundColor: '#111827',
//     paddingVertical: 14,
//     alignItems: 'center',
//     borderRadius: 12,
//   },
//   saveInner: { flexDirection: 'row', alignItems: 'center', gap: 10 },
//   saveBtnText: { color: '#fff', fontWeight: '800', marginLeft: 6 },

//   cancelBtn: {
//     backgroundColor: '#fff',
//     paddingVertical: 12,
//     alignItems: 'center',
//     borderRadius: 12,
//     marginTop: 6,
//     borderWidth: 1,
//     borderColor: '#E6EEF8',
//   },
//   cancelBtnText: { color: '#0F172A', fontWeight: '700' },

//   emptyText: { marginTop: 8, color: '#6B7280', fontSize: 15 },
//   inlineRow: { flexDirection: 'row', justifyContent: 'space-between' },
//    headerContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
// });

// export default AllDelivery;











// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   ScrollView,
//   TouchableOpacity,
//   StyleSheet,
//   TextInput,
//   ActivityIndicator,
//   Alert,
//   RefreshControl,
//   Image,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import LinearGradient from 'react-native-linear-gradient';
// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const AllDelivery = ({ navigation }) => {
//   const insets = useSafeAreaInsets();
//   const [deliveryData, setDeliveryData] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [userId, setUserId] = useState('');

//   const API_BASE = 'https://argosmob.uk/makroo/public/';

//   const handleBack = () => navigation.goBack();

//   useEffect(() => {
//     const fetchUserIdAndData = async () => {
//       try {
//         const storedUserId = await AsyncStorage.getItem('userId');
//         if (storedUserId) {
//           setUserId(storedUserId);
//           fetchDeliveryData(storedUserId);
//         } else {
//           setLoading(false);
//           Alert.alert('Error', 'User ID not found. Please login again.');
//         }
//       } catch (error) {
//         console.log('Error fetching user ID:', error);
//         setLoading(false);
//         Alert.alert('Error', 'Failed to load user data.');
//       }
//     };

//     fetchUserIdAndData();
//   }, []);

//   const fetchDeliveryData = async (userId, isRefresh = false) => {
//     try {
//       if (isRefresh) {
//         setRefreshing(true);
//       } else {
//         setLoading(true);
//       }

//       const formData = new FormData();
//       formData.append('user_id', userId);

//       const config = {
//         method: 'post',
//         maxBodyLength: Infinity,
//         url: API_BASE + 'api/v1/delivery-forms/all',
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//         data: formData,
//         timeout: 10000,
//       };

//       const response = await axios(config);
      
//       if (response.data.status && response.data.data) {
//         setDeliveryData(response.data.data);
//         setFilteredData(response.data.data);
//       } else {
//         Alert.alert('Info', 'No delivery forms found.');
//       }
//     } catch (error) {
//       console.log('API Error:', error);
//       if (error.response) {
//         Alert.alert('Error', error.response.data?.message || 'Failed to fetch data.');
//       } else if (error.request) {
//         Alert.alert('Network Error', 'Please check your internet connection.');
//       } else {
//         Alert.alert('Error', 'Something went wrong. Please try again.');
//       }
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   const onRefresh = () => {
//     if (userId) {
//       fetchDeliveryData(userId, true);
//     }
//   };

//   const handleSearch = (query) => {
//     setSearchQuery(query);
//     if (query.trim() === '') {
//       setFilteredData(deliveryData);
//     } else {
//       const filtered = deliveryData.filter(item =>
//         item.customer_name?.toLowerCase().includes(query.toLowerCase()) ||
//         item.tractor_number?.toLowerCase().includes(query.toLowerCase()) ||
//         item.engine_number?.toLowerCase().includes(query.toLowerCase()) ||
//         item.document_number?.toLowerCase().includes(query.toLowerCase()) ||
//         item.father_name?.toLowerCase().includes(query.toLowerCase())
//       );
//       setFilteredData(filtered);
//     }
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-IN', {
//       day: '2-digit',
//       month: '2-digit',
//       year: 'numeric'
//     });
//   };

//   const getStatusColor = (status) => {
//     switch (status?.toLowerCase()) {
//       case 'approved':
//         return '#4CAF50';
//       case 'rejected':
//         return '#F44336';
//       case 'completed':
//         return '#4CAF50';
//       case 'pending':
//         return '#2196F3';
//       default:
//         return '#2196F3';
//     }
//   };

//   const getStatusText = (status) => {
//     if (!status) return 'Pending';
//     return status.charAt(0).toUpperCase() + status.slice(1);
//   };

//   const handleFormPress = (formId, formData) => {
//     navigation.navigate('DeliveryDetailPage', { 
//       formId,
//       formData
//     });
//   };

//   if (loading) {
//     return (
//       <View style={[styles.loadingContainer, { paddingTop: insets.top }]}>
//         <LinearGradient
//           colors={['#7E5EA9', '#20AEBC']}
//           start={{ x: 0, y: 0 }}
//           end={{ x: 1, y: 0 }}
//           style={styles.header}>
//           <View style={styles.headerContent}>
//             <TouchableOpacity onPress={handleBack} style={styles.backButton}>
//               <Icon name="arrow-back" size={24} color="white" />
//             </TouchableOpacity>
//             <Text style={styles.screenTitle}>All Delivery Forms</Text>
//             <View style={styles.placeholder} />
//           </View>
//         </LinearGradient>
//         <View style={styles.loader}>
//           <ActivityIndicator size="large" color="#7E5EA9" />
//           <Text style={styles.loadingText}>Loading Delivery Forms...</Text>
//         </View>
//       </View>
//     );
//   }

//   return (
//     <View style={{ flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom }}>
//       <LinearGradient
//         colors={['#7E5EA9', '#20AEBC']}
//         start={{ x: 0, y: 0 }}
//         end={{ x: 1, y: 0 }}
//         style={styles.header}>
//         <View style={styles.headerContent}>
//           <TouchableOpacity onPress={handleBack} style={styles.backButton}>
//             <Icon name="arrow-back" size={24} color="white" />
//           </TouchableOpacity>
//           <Text style={styles.screenTitle}>All Delivery Forms</Text>
//           <View style={styles.placeholder} />
//         </View>
//       </LinearGradient>

//       <ScrollView 
//         style={styles.container} 
//         contentContainerStyle={styles.scrollContent}
//         refreshControl={
//           <RefreshControl
//             refreshing={refreshing}
//             onRefresh={onRefresh}
//             colors={['#7E5EA9']}
//             tintColor="#7E5EA9"
//           />
//         }
//       >
//         <View style={styles.searchContainer}>
//           <View style={styles.searchBox}>
//             <Icon name="search" size={20} color="#666" style={styles.searchIcon} />
//             <TextInput
//               placeholder="Customer\Tractor No\Engine No."
//               placeholderTextColor="#999"
//               style={styles.searchInput}
//               value={searchQuery}
//               onChangeText={handleSearch}
//             />
//             {searchQuery !== '' && (
//               <TouchableOpacity onPress={() => handleSearch('')} style={styles.clearButton}>
//                 <Icon name="close" size={18} color="#666" />
//               </TouchableOpacity>
//             )}
//           </View>
//         </View>

//         <View style={styles.resultsContainer}>
//           <Text style={styles.resultsText}>
//             {filteredData.length} Delivery Form{filteredData.length !== 1 ? 's' : ''} found
//           </Text>
//           <TouchableOpacity onPress={onRefresh} style={styles.refreshButton}>
//             <Icon name="refresh" size={20} color="#7E5EA9" />
//           </TouchableOpacity>
//         </View>

//         {filteredData.length === 0 ? (
//           <View style={styles.emptyContainer}>
//             <Icon name="local-shipping" size={60} color="#ccc" />
//             <Text style={styles.emptyText}>
//               {searchQuery ? 'No matching delivery forms found' : 'No delivery forms available'}
//             </Text>
//             {searchQuery ? (
//               <TouchableOpacity onPress={() => handleSearch('')} style={styles.clearSearchButton}>
//                 <Text style={styles.clearSearchText}>Clear Search</Text>
//               </TouchableOpacity>
//             ) : (
//               <TouchableOpacity onPress={onRefresh} style={styles.refreshActionButton}>
//                 <Text style={styles.refreshActionText}>Refresh</Text>
//               </TouchableOpacity>
//             )}
//           </View>
//         ) : (
//           filteredData.map((item) => (
//             <TouchableOpacity 
//               key={item.id} 
//               style={styles.formCard}
//               onPress={() => handleFormPress(item.id, item)}
//             >
//               <View style={styles.formHeader}>
//                 <View style={styles.formNumberContainer}>
//                   {/* <Text style={styles.formNumber}>#{item.id}</Text> */}
//                   <Text style={styles.formDate}>{formatDate(item.submitted_at)}</Text>
//                 </View>
//                 <View style={[
//                   styles.statusBadge,
//                   { backgroundColor: getStatusColor(item.status) }
//                 ]}>
//                   <Text style={styles.statusText}>
//                     {getStatusText(item.status)}
//                   </Text>
//                 </View>
//               </View>
              
//               <View style={styles.formDetails}>
//                 <View style={styles.detailRow}>
//                   <Icon name="person" size={16} color="#666" />
//                   <Text style={styles.detailLabel}>Customer Name : </Text>
//                   <Text style={styles.detailValue} numberOfLines={1}>
//                     {item.customer_name || 'N/A'}
//                   </Text>
//                 </View>
                
//                 <View style={styles.detailRow}>
//                   <Icon name="people" size={16} color="#666" />
//                   <Text style={styles.detailLabel}>Father Name : </Text>
//                   <Text style={styles.detailValue} numberOfLines={1}>
//                     {item.father_name || 'N/A'}
//                   </Text>
//                 </View>

//                 <View style={styles.detailRow}>
//                   <Icon name="fingerprint" size={16} color="#666" />
//                   <Text style={styles.detailLabel}>Tractor No : </Text>
//                   <Text style={styles.detailValue} numberOfLines={1}>
//                     {item.tractor_number || 'N/A'}
//                   </Text>
//                 </View>

//                 <View style={styles.detailRow}>
//                   <Icon name="build" size={16} color="#666" />
//                   <Text style={styles.detailLabel}>Engine No : </Text>
//                   <Text style={styles.detailValue} numberOfLines={1}>
//                     {item.engine_number || 'N/A'}
//                   </Text>
//                 </View>

//                 <View style={styles.detailRow}>
//                   <Icon name="description" size={16} color="#666" />
//                   <Text style={styles.detailLabel}>Document : </Text>
//                   <Text style={styles.detailValue} numberOfLines={1}>
//                     {item.document_type || 'N/A'} - {item.document_number || 'N/A'}
//                   </Text>
//                 </View>

//                 {item.address && (
//                   <View style={styles.detailRow}>
//                     <Icon name="location-on" size={16} color="#666" />
//                     <Text style={styles.detailLabel}>Address : </Text>
//                     <Text style={styles.detailValue} numberOfLines={2}>
//                       {item.address}
//                     </Text>
//                   </View>
//                 )}
//               </View>

//               {/* Signature Previews */}
//               <View style={styles.signatureContainer}>
//                 <View style={styles.signatureBox}>
//                   <Text style={styles.signatureLabel}>Customer Signature</Text>
//                   {item.customer_signature ? (
//                     <Image 
//                       source={{ uri: API_BASE + item.customer_signature }} 
//                       style={styles.signatureImage}
//                       resizeMode="contain"
//                     />
//                   ) : (
//                     <Text style={styles.noSignature}>No Signature</Text>
//                   )}
//                 </View>
//                 <View style={styles.signatureBox}>
//                   <Text style={styles.signatureLabel}>Manager Signature</Text>
//                   {item.manager_signature ? (
//                     <Image 
//                       source={{ uri: API_BASE + item.manager_signature }} 
//                       style={styles.signatureImage}
//                       resizeMode="contain"
//                     />
//                   ) : (
//                     <Text style={styles.noSignature}>No Signature</Text>
//                   )}
//                 </View>
//               </View>
              
//               <View style={styles.formFooter}>
//                 <Text style={styles.footerText}>Tap to view details</Text>
//                 <View style={styles.footerRight}>
//                   <Icon name="chevron-right" size={16} color="#7E5EA9" />
//                 </View>
//               </View>
//             </TouchableOpacity>
//           ))
//         )}

//         {filteredData.length > 0 && (
//           <View style={styles.listFooter}>
//             <Text style={styles.listFooterText}>
//               {filteredData.length === deliveryData.length 
//                 ? 'All forms loaded' 
//                 : `${filteredData.length} of ${deliveryData.length} forms shown`}
//             </Text>
//           </View>
//         )}
//       </ScrollView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f5f5f5',
//   },
//   scrollContent: {
//     flexGrow: 1,
//     paddingBottom: 20,
//   },
//   header: {
//     paddingVertical: 15,
//     paddingHorizontal: 20,
//   },
//   headerContent: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },
//   backButton: {
//     padding: 5,
//   },
//   screenTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: 'white',
//     textAlign: 'center',
//     flex: 1,
//   },
//   placeholder: {
//     width: 24,
//   },
//   loadingContainer: {
//     flex: 1,
//     backgroundColor: '#f5f5f5',
//   },
//   loader: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   loadingText: {
//     marginTop: 10,
//     fontSize: 16,
//     color: '#666',
//   },
//   searchContainer: {
//     padding: 15,
//     backgroundColor: 'white',
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//   },
//   searchBox: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#f8f8f8',
//     borderRadius: 10,
//     paddingHorizontal: 15,
//     height: 50,
//     borderWidth: 1,
//     borderColor: '#ddd',
//   },
//   searchIcon: {
//     marginRight: 10,
//   },
//   searchInput: {
//     flex: 1,
//     fontSize: 16,
//     color: '#666',
//   },
//   clearButton: {
//     padding: 5,
//   },
//   resultsContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 15,
//     paddingBottom: 5,
//   },
//   resultsText: {
//     fontSize: 14,
//     color: '#666',
//     fontWeight: '500',
//   },
//   refreshButton: {
//     padding: 5,
//   },
//   formCard: {
//     backgroundColor: 'white',
//     marginHorizontal: 15,
//     marginVertical: 8,
//     borderRadius: 12,
//     padding: 16,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//     borderLeftWidth: 4,
//     borderLeftColor: '#20AEBC',
//   },
//   formHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'flex-start',
//     marginBottom: 12,
//   },
//   formNumberContainer: {
//     flex: 1,
//   },
//   formNumber: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#333',
//     marginBottom: 4,
//   },
//   formDate: {
//     fontSize: 12,
//     color: '#666',
//   },
//   statusBadge: {
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderRadius: 12,
//     marginLeft: 10,
//   },
//   statusText: {
//     fontSize: 12,
//     fontWeight: '500',
//     color: 'white',
//   },
//   formDetails: {
//     marginBottom: 12,
//   },
//   detailRow: {
//     flexDirection: 'row',
//     alignItems: 'flex-start',
//     marginBottom: 6,
//   },
//   detailLabel: {
//     fontSize: 14,
//     fontWeight: '500',
//     color: '#666',
//     marginLeft: 6,
//     width: 100,
//   },
//   detailValue: {
//     fontSize: 14,
//     color: '#333',
//     flex: 1,
//   },
//   signatureContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 12,
//     paddingTop: 8,
//     borderTopWidth: 1,
//     borderTopColor: '#f0f0f0',
//   },
//   signatureBox: {
//     flex: 1,
//     alignItems: 'center',
//     paddingHorizontal: 5,
//   },
//   signatureLabel: {
//     fontSize: 12,
//     color: '#666',
//     marginBottom: 4,
//     fontWeight: '500',
//   },
//   signatureImage: {
//     width: 60,
//     height: 40,
//     borderRadius: 4,
//     borderWidth: 1,
//     borderColor: '#ddd',
//   },
//   noSignature: {
//     fontSize: 11,
//     color: '#999',
//     fontStyle: 'italic',
//   },
//   formFooter: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     borderTopWidth: 1,
//     borderTopColor: '#f0f0f0',
//     paddingTop: 12,
//   },
//   footerText: {
//     fontSize: 12,
//     color: '#20AEBC',
//   },
//   footerRight: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingVertical: 60,
//     paddingHorizontal: 40,
//   },
//   emptyText: {
//     fontSize: 16,
//     fontWeight: '500',
//     color: '#999',
//     marginTop: 10,
//     textAlign: 'center',
//     lineHeight: 22,
//   },
//   clearSearchButton: {
//     marginTop: 15,
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//     backgroundColor: '#20AEBC',
//     borderRadius: 6,
//   },
//   clearSearchText: {
//     color: 'white',
//     fontSize: 14,
//     fontWeight: '500',
//   },
//   refreshActionButton: {
//     marginTop: 15,
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//     backgroundColor: '#7E5EA9',
//     borderRadius: 6,
//   },
//   refreshActionText: {
//     color: 'white',
//     fontSize: 14,
//     fontWeight: '500',
//   },
//   listFooter: {
//     padding: 15,
//     alignItems: 'center',
//   },
//   listFooterText: {
//     fontSize: 12,
//     color: '#999',
//     textAlign: 'center',
//   },
// });

// export default AllDelivery;








// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   ScrollView,
//   TouchableOpacity,
//   StyleSheet,
//   TextInput,
//   ActivityIndicator,
//   Alert,
//   RefreshControl,
//   Image,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import LinearGradient from 'react-native-linear-gradient';
// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const AllDelivery = ({ navigation }) => {
//   const insets = useSafeAreaInsets();
//   const [deliveryData, setDeliveryData] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [userId, setUserId] = useState('');

//   const API_BASE = 'https://argosmob.uk/makroo/public/';

//   const handleBack = () => navigation.goBack();

//   useEffect(() => {
//     const fetchUserIdAndData = async () => {
//       try {
//         const storedUserId = await AsyncStorage.getItem('userId');
//         if (storedUserId) {
//           setUserId(storedUserId);
//           fetchDeliveryData(storedUserId);
//         } else {
//           setLoading(false);
//           Alert.alert('Error', 'User ID not found. Please login again.');
//         }
//       } catch (error) {
//         console.log('Error fetching user ID:', error);
//         setLoading(false);
//         Alert.alert('Error', 'Failed to load user data.');
//       }
//     };

//     fetchUserIdAndData();
//   }, []);

//   const fetchDeliveryData = async (userId, isRefresh = false) => {
//     try {
//       if (isRefresh) {
//         setRefreshing(true);
//       } else {
//         setLoading(true);
//       }

//       const formData = new FormData();
//       formData.append('user_id', userId);

//       const config = {
//         method: 'post',
//         maxBodyLength: Infinity,
//         url: API_BASE + 'api/v1/delivery-forms/all',
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//         data: formData,
//         timeout: 10000,
//       };

//       const response = await axios(config);
      
//       if (response.data.status && response.data.data) {
//         setDeliveryData(response.data.data);
//         setFilteredData(response.data.data);
//       } else {
//         Alert.alert('Info', 'No delivery forms found.');
//       }
//     } catch (error) {
//       console.log('API Error:', error);
//       if (error.response) {
//         Alert.alert('Error', error.response.data?.message || 'Failed to fetch data.');
//       } else if (error.request) {
//         Alert.alert('Network Error', 'Please check your internet connection.');
//       } else {
//         Alert.alert('Error', 'Something went wrong. Please try again.');
//       }
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   const onRefresh = () => {
//     if (userId) {
//       fetchDeliveryData(userId, true);
//     }
//   };

//   const handleSearch = (query) => {
//     setSearchQuery(query);
//     if (query.trim() === '') {
//       setFilteredData(deliveryData);
//     } else {
//       const filtered = deliveryData.filter(item =>
//         item.customer_name?.toLowerCase().includes(query.toLowerCase()) ||
//         item.tractor_number?.toLowerCase().includes(query.toLowerCase()) ||
//         item.engine_number?.toLowerCase().includes(query.toLowerCase()) ||
//         item.document_number?.toLowerCase().includes(query.toLowerCase()) ||
//         item.father_name?.toLowerCase().includes(query.toLowerCase())
//       );
//       setFilteredData(filtered);
//     }
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-IN', {
//       day: '2-digit',
//       month: '2-digit',
//       year: 'numeric'
//     });
//   };

//   const getStatusColor = (status) => {
//     switch (status?.toLowerCase()) {
//       case 'approved':
//         return '#4CAF50';
//       case 'rejected':
//         return '#F44336';
//       case 'completed':
//         return '#4CAF50';
//       case 'pending':
//         return '#2196F3';
//       default:
//         return '#2196F3';
//     }
//   };

//   const getStatusText = (status) => {
//     if (!status) return 'Pending';
//     return status.charAt(0).toUpperCase() + status.slice(1);
//   };

//   const handleFormPress = (formId, formData) => {
//     navigation.navigate('Deliveryforminternalpage', { 
//       formId,
//       formData
//     });
//   };

//   if (loading) {
//     return (
//       <View style={[styles.loadingContainer, { paddingTop: insets.top }]}>
//         <LinearGradient
//           colors={['#7E5EA9', '#20AEBC']}
//           start={{ x: 0, y: 0 }}
//           end={{ x: 1, y: 0 }}
//           style={styles.header}>
//           <View style={styles.headerContent}>
//             <TouchableOpacity onPress={handleBack} style={styles.backButton}>
//               <Icon name="arrow-back" size={24} color="white" />
//             </TouchableOpacity>
//             <Text style={styles.screenTitle}>All Delivery Forms</Text>
//             <View style={styles.placeholder} />
//           </View>
//         </LinearGradient>
//         <View style={styles.loader}>
//           <ActivityIndicator size="large" color="#7E5EA9" />
//           <Text style={styles.loadingText}>Loading Delivery Forms...</Text>
//         </View>
//       </View>
//     );
//   }

//   return (
//     <View style={{ flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom }}>
//       <LinearGradient
//         colors={['#7E5EA9', '#20AEBC']}
//         start={{ x: 0, y: 0 }}
//         end={{ x: 1, y: 0 }}
//         style={styles.header}>
//         <View style={styles.headerContent}>
//           <TouchableOpacity onPress={handleBack} style={styles.backButton}>
//             <Icon name="arrow-back" size={24} color="white" />
//           </TouchableOpacity>
//           <Text style={styles.screenTitle}>All Delivery Forms</Text>
//           <View style={styles.placeholder} />
//         </View>
//       </LinearGradient>

//       <ScrollView 
//         style={styles.container} 
//         contentContainerStyle={styles.scrollContent}
//         refreshControl={
//           <RefreshControl
//             refreshing={refreshing}
//             onRefresh={onRefresh}
//             colors={['#7E5EA9']}
//             tintColor="#7E5EA9"
//           />
//         }
//       >
//         <View style={styles.searchContainer}>
//           <View style={styles.searchBox}>
//             <Icon name="search" size={20} color="#666" style={styles.searchIcon} />
//             <TextInput
//               placeholder="Customer\Tractor No\Engine No."
//               placeholderTextColor="#999"
//               style={styles.searchInput}
//               value={searchQuery}
//               onChangeText={handleSearch}
//             />
//             {searchQuery !== '' && (
//               <TouchableOpacity onPress={() => handleSearch('')} style={styles.clearButton}>
//                 <Icon name="close" size={18} color="#666" />
//               </TouchableOpacity>
//             )}
//           </View>
//         </View>

//         <View style={styles.resultsContainer}>
//           <Text style={styles.resultsText}>
//             {filteredData.length} Delivery Form{filteredData.length !== 1 ? 's' : ''} found
//           </Text>
//           <TouchableOpacity onPress={onRefresh} style={styles.refreshButton}>
//             <Icon name="refresh" size={20} color="#7E5EA9" />
//           </TouchableOpacity>
//         </View>

//         {filteredData.length === 0 ? (
//           <View style={styles.emptyContainer}>
//             <Icon name="local-shipping" size={60} color="#ccc" />
//             <Text style={styles.emptyText}>
//               {searchQuery ? 'No matching delivery forms found' : 'No delivery forms available'}
//             </Text>
//             {searchQuery ? (
//               <TouchableOpacity onPress={() => handleSearch('')} style={styles.clearSearchButton}>
//                 <Text style={styles.clearSearchText}>Clear Search</Text>
//               </TouchableOpacity>
//             ) : (
//               <TouchableOpacity onPress={onRefresh} style={styles.refreshActionButton}>
//                 <Text style={styles.refreshActionText}>Refresh</Text>
//               </TouchableOpacity>
//             )}
//           </View>
//         ) : (
//           filteredData.map((item) => (
//             <TouchableOpacity 
//               key={item.id} 
//               style={styles.formCard}
//               onPress={() => handleFormPress(item.id, item)}
//             >
//               <View style={styles.formHeader}>
//                 <View style={styles.formNumberContainer}>
//                   <Text style={styles.formDate}>{formatDate(item.submitted_at)}</Text>
//                 </View>
//                 <View style={[
//                   styles.statusBadge,
//                   { backgroundColor: getStatusColor(item.status) }
//                 ]}>
//                   <Text style={styles.statusText}>
//                     {getStatusText(item.status)}
//                   </Text>
//                 </View>
//               </View>
              
//               <View style={styles.formDetails}>
//                 <View style={styles.detailRow}>
//                   <Icon name="person" size={16} color="#666" />
//                   <Text style={styles.detailLabel}>Customer Name : </Text>
//                   <Text style={styles.detailValue} numberOfLines={1}>
//                     {item.customer_name || 'N/A'}
//                   </Text>
//                 </View>
                
//                 <View style={styles.detailRow}>
//                   <Icon name="people" size={16} color="#666" />
//                   <Text style={styles.detailLabel}>Father Name : </Text>
//                   <Text style={styles.detailValue} numberOfLines={1}>
//                     {item.father_name || 'N/A'}
//                   </Text>
//                 </View>

//                 <View style={styles.detailRow}>
//                   <Icon name="fingerprint" size={16} color="#666" />
//                   <Text style={styles.detailLabel}>Tractor No : </Text>
//                   <Text style={styles.detailValue} numberOfLines={1}>
//                     {item.tractor_number || 'N/A'}
//                   </Text>
//                 </View>

//                 <View style={styles.detailRow}>
//                   <Icon name="build" size={16} color="#666" />
//                   <Text style={styles.detailLabel}>Engine No : </Text>
//                   <Text style={styles.detailValue} numberOfLines={1}>
//                     {item.engine_number || 'N/A'}
//                   </Text>
//                 </View>

//                 <View style={styles.detailRow}>
//                   <Icon name="description" size={16} color="#666" />
//                   <Text style={styles.detailLabel}>Document : </Text>
//                   <Text style={styles.detailValue} numberOfLines={1}>
//                     {item.document_type || 'N/A'} - {item.document_number || 'N/A'}
//                   </Text>
//                 </View>

//                 {item.address && (
//                   <View style={styles.detailRow}>
//                     <Icon name="location-on" size={16} color="#666" />
//                     <Text style={styles.detailLabel}>Address : </Text>
//                     <Text style={styles.detailValue} numberOfLines={2}>
//                       {item.address}
//                     </Text>
//                   </View>
//                 )}
//               </View>

//               <View style={styles.signatureContainer}>
//                 <View style={styles.signatureBox}>
//                   <Text style={styles.signatureLabel}>Customer Signature</Text>
//                   {item.customer_signature ? (
//                     <Image 
//                       source={{ uri: API_BASE + item.customer_signature }} 
//                       style={styles.signatureImage}
//                       resizeMode="contain"
//                     />
//                   ) : (
//                     <Text style={styles.noSignature}>No Signature</Text>
//                   )}
//                 </View>
//                 <View style={styles.signatureBox}>
//                   <Text style={styles.signatureLabel}>Manager Signature</Text>
//                   {item.manager_signature ? (
//                     <Image 
//                       source={{ uri: API_BASE + item.manager_signature }} 
//                       style={styles.signatureImage}
//                       resizeMode="contain"
//                     />
//                   ) : (
//                     <Text style={styles.noSignature}>No Signature</Text>
//                   )}
//                 </View>
//               </View>
              
//               <View style={styles.formFooter}>
//                 <Text style={styles.footerText}>Tap to view details</Text>
//                 <View style={styles.footerRight}>
//                   <Icon name="chevron-right" size={16} color="#7E5EA9" />
//                 </View>
//               </View>
//             </TouchableOpacity>
//           ))
//         )}

//         {filteredData.length > 0 && (
//           <View style={styles.listFooter}>
//             <Text style={styles.listFooterText}>
//               {filteredData.length === deliveryData.length 
//                 ? 'All forms loaded' 
//                 : `${filteredData.length} of ${deliveryData.length} forms shown`}
//             </Text>
//           </View>
//         )}
//       </ScrollView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f5f5f5',
//   },
//   scrollContent: {
//     flexGrow: 1,
//     paddingBottom: 20,
//   },
//   header: {
//     paddingVertical: 15,
//     paddingHorizontal: 20,
//   },
//   headerContent: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },
//   backButton: {
//     padding: 5,
//   },
//   screenTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: 'white',
//     textAlign: 'center',
//     flex: 1,
//   },
//   placeholder: {
//     width: 24,
//   },
//   loadingContainer: {
//     flex: 1,
//     backgroundColor: '#f5f5f5',
//   },
//   loader: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   loadingText: {
//     marginTop: 10,
//     fontSize: 16,
//     color: '#666',
//   },
//   searchContainer: {
//     padding: 15,
//     backgroundColor: 'white',
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//   },
//   searchBox: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#f8f8f8',
//     borderRadius: 10,
//     paddingHorizontal: 15,
//     height: 50,
//     borderWidth: 1,
//     borderColor: '#ddd',
//   },
//   searchIcon: {
//     marginRight: 10,
//   },
//   searchInput: {
//     flex: 1,
//     fontSize: 16,
//     color: '#666',
//   },
//   clearButton: {
//     padding: 5,
//   },
//   resultsContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 15,
//     paddingBottom: 5,
//   },
//   resultsText: {
//     fontSize: 14,
//     color: '#666',
//     fontWeight: '500',
//   },
//   refreshButton: {
//     padding: 5,
//   },
//   formCard: {
//     backgroundColor: 'white',
//     marginHorizontal: 15,
//     marginVertical: 8,
//     borderRadius: 12,
//     padding: 16,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//     borderLeftWidth: 4,
//     borderLeftColor: '#20AEBC',
//   },
//   formHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'flex-start',
//     marginBottom: 12,
//   },
//   formNumberContainer: {
//     flex: 1,
//   },
//   formNumber: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#333',
//     marginBottom: 4,
//   },
//   formDate: {
//     fontSize: 12,
//     color: '#666',
//   },
//   statusBadge: {
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderRadius: 12,
//     marginLeft: 10,
//   },
//   statusText: {
//     fontSize: 12,
//     fontWeight: '500',
//     color: 'white',
//   },
//   formDetails: {
//     marginBottom: 12,
//   },
//   detailRow: {
//     flexDirection: 'row',
//     alignItems: 'flex-start',
//     marginBottom: 6,
//   },
//   detailLabel: {
//     fontSize: 14,
//     fontWeight: '500',
//     color: '#666',
//     marginLeft: 6,
//     width: 100,
//   },
//   detailValue: {
//     fontSize: 14,
//     color: '#333',
//     flex: 1,
//   },
//   signatureContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 12,
//     paddingTop: 8,
//     borderTopWidth: 1,
//     borderTopColor: '#f0f0f0',
//   },
//   signatureBox: {
//     flex: 1,
//     alignItems: 'center',
//     paddingHorizontal: 5,
//   },
//   signatureLabel: {
//     fontSize: 12,
//     color: '#666',
//     marginBottom: 4,
//     fontWeight: '500',
//   },
//   signatureImage: {
//     width: 60,
//     height: 40,
//     borderRadius: 4,
//     borderWidth: 1,
//     borderColor: '#ddd',
//   },
//   noSignature: {
//     fontSize: 11,
//     color: '#999',
//     fontStyle: 'italic',
//   },
//   formFooter: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     borderTopWidth: 1,
//     borderTopColor: '#f0f0f0',
//     paddingTop: 12,
//   },
//   footerText: {
//     fontSize: 12,
//     color: '#20AEBC',
//   },
//   footerRight: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingVertical: 60,
//     paddingHorizontal: 40,
//   },
//   emptyText: {
//     fontSize: 16,
//     fontWeight: '500',
//     color: '#999',
//     marginTop: 10,
//     textAlign: 'center',
//     lineHeight: 22,
//   },
//   clearSearchButton: {
//     marginTop: 15,
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//     backgroundColor: '#20AEBC',
//     borderRadius: 6,
//   },
//   clearSearchText: {
//     color: 'white',
//     fontSize: 14,
//     fontWeight: '500',
//   },
//   refreshActionButton: {
//     marginTop: 15,
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//     backgroundColor: '#7E5EA9',
//     borderRadius: 6,
//   },
//   refreshActionText: {
//     color: 'white',
//     fontSize: 14,
//     fontWeight: '500',
//   },
//   listFooter: {
//     padding: 15,
//     alignItems: 'center',
//   },
//   listFooterText: {
//     fontSize: 12,
//     color: '#999',
//     textAlign: 'center',
//   },
// });

// export default AllDelivery;





// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   ScrollView,
//   TouchableOpacity,
//   StyleSheet,
//   TextInput,
//   ActivityIndicator,
//   Alert,
//   RefreshControl,
//   Image,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import LinearGradient from 'react-native-linear-gradient';
// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const AllDelivery = ({ navigation }) => {
//   const insets = useSafeAreaInsets();
//   const [deliveryData, setDeliveryData] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [userId, setUserId] = useState('');

//   const API_BASE = 'https://argosmob.uk/makroo/public/';

//   const handleBack = () => navigation.goBack();

//   useEffect(() => {
//     const fetchUserIdAndData = async () => {
//       try {
//         const storedUserId = await AsyncStorage.getItem('userId');
//         if (storedUserId) {
//           setUserId(storedUserId);
//           fetchDeliveryData(storedUserId);
//         } else {
//           setLoading(false);
//           Alert.alert('Error', 'User ID not found. Please login again.');
//         }
//       } catch (error) {
//         console.log('Error fetching user ID:', error);
//         setLoading(false);
//         Alert.alert('Error', 'Failed to load user data.');
//       }
//     };

//     fetchUserIdAndData();
//   }, []);

//   const fetchDeliveryData = async (userId, isRefresh = false) => {
//     try {
//       if (isRefresh) {
//         setRefreshing(true);
//       } else {
//         setLoading(true);
//       }

//       const formData = new FormData();
//       formData.append('user_id', userId);

//       const config = {
//         method: 'post',
//         maxBodyLength: Infinity,
//         url: API_BASE + 'api/v1/delivery-forms/all',
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//         data: formData,
//         timeout: 10000,
//       };

//       const response = await axios(config);
      
//       if (response.data.status && response.data.data) {
//         // Process data to handle frontend status management
//         const processedData = await processDeliveryData(response.data.data);
//         setDeliveryData(processedData);
//         setFilteredData(processedData);
//       } else {
//         Alert.alert('Info', 'No delivery forms found.');
//       }
//     } catch (error) {
//       console.log('API Error:', error);
//       if (error.response) {
//         Alert.alert('Error', error.response.data?.message || 'Failed to fetch data.');
//       } else if (error.request) {
//         Alert.alert('Network Error', 'Please check your internet connection.');
//       } else {
//         Alert.alert('Error', 'Something went wrong. Please try again.');
//       }
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   // Process delivery data to handle frontend status management
//   const processDeliveryData = async (data) => {
//     const processedData = await Promise.all(
//       data.map(async (item) => {
//         // Check if form has been updated in frontend
//         const hasBeenUpdated = await AsyncStorage.getItem(`delivery_form_updated_${item.id}`);
        
//         let displayStatus = item.status;
        
//         // If backend status is 'edited' but form has been updated, show as 'pending'
//         if (item.status === 'edited' && hasBeenUpdated === 'true') {
//           displayStatus = 'pending';
//         }
        
//         return {
//           ...item,
//           displayStatus: displayStatus,
//           backendStatus: item.status // Keep original backend status for reference
//         };
//       })
//     );
    
//     return processedData;
//   };

//   const onRefresh = () => {
//     if (userId) {
//       fetchDeliveryData(userId, true);
//     }
//   };

//   const handleSearch = (query) => {
//     setSearchQuery(query);
//     if (query.trim() === '') {
//       setFilteredData(deliveryData);
//     } else {
//       const filtered = deliveryData.filter(item =>
//         item.customer_name?.toLowerCase().includes(query.toLowerCase()) ||
//         item.tractor_number?.toLowerCase().includes(query.toLowerCase()) ||
//         item.engine_number?.toLowerCase().includes(query.toLowerCase()) ||
//         item.document_number?.toLowerCase().includes(query.toLowerCase()) ||
//         item.father_name?.toLowerCase().includes(query.toLowerCase())
//       );
//       setFilteredData(filtered);
//     }
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-IN', {
//       day: '2-digit',
//       month: '2-digit',
//       year: 'numeric'
//     });
//   };

//   const getStatusColor = (item) => {
//     // Use displayStatus for color, but check backend status for edit capability
//     const status = item.displayStatus;
    
//     switch (status?.toLowerCase()) {
//       case 'approved':
//         return '#4CAF50';
//       case 'rejected':
//         return '#F44336';
//       case 'pending':
//         return '#2196F3';
//       case 'edited':
//         // If backend status is 'edited', check if it can still be edited
//         return '#FF9800'; // Orange for editable forms
//       default:
//         return '#2196F3';
//     }
//   };

//   const getStatusText = (item) => {
//     const status = item.displayStatus;
    
//     if (!status) return 'Pending';
    
//     // Never show 'edited' status to user - show as 'pending' instead
//     if (status === 'edited') {
//       return 'Pending';
//     }
    
//     return status.charAt(0).toUpperCase() + status.slice(1);
//   };

//   const handleFormPress = async (formId, backendStatus) => {
//     navigation.navigate('Deliveryforminternalpage', { 
//       formId,
//       backendStatus // Pass backend status to determine edit capability
//     });
//   };

//   if (loading) {
//     return (
//       <View style={[styles.loadingContainer, { paddingTop: insets.top }]}>
//         <LinearGradient
//           colors={['#7E5EA9', '#20AEBC']}
//           start={{ x: 0, y: 0 }}
//           end={{ x: 1, y: 0 }}
//           style={styles.header}>
//           <View style={styles.headerContent}>
//             <TouchableOpacity onPress={handleBack} style={styles.backButton}>
//               <Icon name="arrow-back" size={24} color="white" />
//             </TouchableOpacity>
//             <Text style={styles.screenTitle}>All Delivery Forms</Text>
//             <View style={styles.placeholder} />
//           </View>
//         </LinearGradient>
//         <View style={styles.loader}>
//           <ActivityIndicator size="large" color="#7E5EA9" />
//           <Text style={styles.loadingText}>Loading Delivery Forms...</Text>
//         </View>
//       </View>
//     );
//   }

//   return (
//     <View style={{ flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom }}>
//       <LinearGradient
//         colors={['#7E5EA9', '#20AEBC']}
//         start={{ x: 0, y: 0 }}
//         end={{ x: 1, y: 0 }}
//         style={styles.header}>
//         <View style={styles.headerContent}>
//           <TouchableOpacity onPress={handleBack} style={styles.backButton}>
//             <Icon name="arrow-back" size={24} color="white" />
//           </TouchableOpacity>
//           <Text style={styles.screenTitle}>All Delivery Forms</Text>
//           <View style={styles.placeholder} />
//         </View>
//       </LinearGradient>

//       <ScrollView 
//         style={styles.container} 
//         contentContainerStyle={styles.scrollContent}
//         refreshControl={
//           <RefreshControl
//             refreshing={refreshing}
//             onRefresh={onRefresh}
//             colors={['#7E5EA9']}
//             tintColor="#7E5EA9"
//           />
//         }
//       >
//         <View style={styles.searchContainer}>
//           <View style={styles.searchBox}>
//             <Icon name="search" size={20} color="#666" style={styles.searchIcon} />
//             <TextInput
//               placeholder="Customer\Tractor No\Engine No."
//               placeholderTextColor="#999"
//               style={styles.searchInput}
//               value={searchQuery}
//               onChangeText={handleSearch}
//             />
//             {searchQuery !== '' && (
//               <TouchableOpacity onPress={() => handleSearch('')} style={styles.clearButton}>
//                 <Icon name="close" size={18} color="#666" />
//               </TouchableOpacity>
//             )}
//           </View>
//         </View>

//         <View style={styles.resultsContainer}>
//           <Text style={styles.resultsText}>
//             {filteredData.length} Delivery Form{filteredData.length !== 1 ? 's' : ''} found
//           </Text>
//           <TouchableOpacity onPress={onRefresh} style={styles.refreshButton}>
//             <Icon name="refresh" size={20} color="#7E5EA9" />
//           </TouchableOpacity>
//         </View>

//         {filteredData.length === 0 ? (
//           <View style={styles.emptyContainer}>
//             <Icon name="local-shipping" size={60} color="#ccc" />
//             <Text style={styles.emptyText}>
//               {searchQuery ? 'No matching delivery forms found' : 'No delivery forms available'}
//             </Text>
//             {searchQuery ? (
//               <TouchableOpacity onPress={() => handleSearch('')} style={styles.clearSearchButton}>
//                 <Text style={styles.clearSearchText}>Clear Search</Text>
//               </TouchableOpacity>
//             ) : (
//               <TouchableOpacity onPress={onRefresh} style={styles.refreshActionButton}>
//                 <Text style={styles.refreshActionText}>Refresh</Text>
//               </TouchableOpacity>
//             )}
//           </View>
//         ) : (
//           filteredData.map((item) => (
//             <TouchableOpacity 
//               key={item.id} 
//               style={styles.formCard}
//               onPress={() => handleFormPress(item.id, item.backendStatus)}
//             >
//               <View style={styles.formHeader}>
//                 <View style={styles.formNumberContainer}>
//                   <Text style={styles.formDate}>{formatDate(item.submitted_at)}</Text>
//                 </View>
//                 <View style={[
//                   styles.statusBadge,
//                   { backgroundColor: getStatusColor(item) }
//                 ]}>
//                   <Text style={styles.statusText}>
//                     {getStatusText(item)}
//                   </Text>
//                 </View>
//               </View>
              
//               <View style={styles.formDetails}>
//                 <View style={styles.detailRow}>
//                   <Icon name="person" size={16} color="#666" />
//                   <Text style={styles.detailLabel}>Customer Name : </Text>
//                   <Text style={styles.detailValue} numberOfLines={1}>
//                     {item.customer_name || 'N/A'}
//                   </Text>
//                 </View>
                
//                 <View style={styles.detailRow}>
//                   <Icon name="people" size={16} color="#666" />
//                   <Text style={styles.detailLabel}>Father Name : </Text>
//                   <Text style={styles.detailValue} numberOfLines={1}>
//                     {item.father_name || 'N/A'}
//                   </Text>
//                 </View>

//                 <View style={styles.detailRow}>
//                   <Icon name="fingerprint" size={16} color="#666" />
//                   <Text style={styles.detailLabel}>Chassis No : </Text>
//                   <Text style={styles.detailValue} numberOfLines={1}>
//                     {item.tractor_number || 'N/A'}
//                   </Text>
//                 </View>

//                 <View style={styles.detailRow}>
//                   <Icon name="build" size={16} color="#666" />
//                   <Text style={styles.detailLabel}>Engine No : </Text>
//                   <Text style={styles.detailValue} numberOfLines={1}>
//                     {item.engine_number || 'N/A'}
//                   </Text>
//                 </View>

//                 <View style={styles.detailRow}>
//                   <Icon name="description" size={16} color="#666" />
//                   <Text style={styles.detailLabel}>Document : </Text>
//                   <Text style={styles.detailValue} numberOfLines={1}>
//                     {item.document_type || 'N/A'} - {item.document_number || 'N/A'}
//                   </Text>
//                 </View>

//                 {item.address && (
//                   <View style={styles.detailRow}>
//                     <Icon name="location-on" size={16} color="#666" />
//                     <Text style={styles.detailLabel}>Address : </Text>
//                     <Text style={styles.detailValue} numberOfLines={2}>
//                       {item.address}
//                     </Text>
//                   </View>
//                 )}
//               </View>

//               <View style={styles.signatureContainer}>
//                 <View style={styles.signatureBox}>
//                   <Text style={styles.signatureLabel}>Customer Signature</Text>
//                   {item.customer_signature ? (
//                     <Image 
//                       source={{ uri: API_BASE + item.customer_signature }} 
//                       style={styles.signatureImage}
//                       resizeMode="contain"
//                     />
//                   ) : (
//                     <Text style={styles.noSignature}>No Signature</Text>
//                   )}
//                 </View>
//                 <View style={styles.signatureBox}>
//                   <Text style={styles.signatureLabel}>Manager Signature</Text>
//                   {item.manager_signature ? (
//                     <Image 
//                       source={{ uri: API_BASE + item.manager_signature }} 
//                       style={styles.signatureImage}
//                       resizeMode="contain"
//                     />
//                   ) : (
//                     <Text style={styles.noSignature}>No Signature</Text>
//                   )}
//                 </View>
//               </View>
              
//               <View style={styles.formFooter}>
//                 <Text style={styles.footerText}>Tap to view details</Text>
//                 <View style={styles.footerRight}>
//                   <Icon name="chevron-right" size={16} color="#7E5EA9" />
//                 </View>
//               </View>
//             </TouchableOpacity>
//           ))
//         )}

//         {filteredData.length > 0 && (
//           <View style={styles.listFooter}>
//             <Text style={styles.listFooterText}>
//               {filteredData.length === deliveryData.length 
//                 ? 'All forms loaded' 
//                 : `${filteredData.length} of ${deliveryData.length} forms shown`}
//             </Text>
//           </View>
//         )}
//       </ScrollView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f5f5f5',
//   },
//   scrollContent: {
//     flexGrow: 1,
//     paddingBottom: 20,
//   },
//   header: {
//     paddingVertical: 15,
//     paddingHorizontal: 20,
//   },
//   headerContent: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },
//   backButton: {
//     padding: 5,
//   },
//   screenTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: 'white',
//     textAlign: 'center',
//     flex: 1,
//   },
//   placeholder: {
//     width: 24,
//   },
//   loadingContainer: {
//     flex: 1,
//     backgroundColor: '#f5f5f5',
//   },
//   loader: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   loadingText: {
//     marginTop: 10,
//     fontSize: 16,
//     color: '#666',
//   },
//   searchContainer: {
//     padding: 15,
//     backgroundColor: 'white',
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//   },
//   searchBox: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#f8f8f8',
//     borderRadius: 10,
//     paddingHorizontal: 15,
//     height: 50,
//     borderWidth: 1,
//     borderColor: '#ddd',
//   },
//   searchIcon: {
//     marginRight: 10,
//   },
//   searchInput: {
//     flex: 1,
//     fontSize: 16,
//     color: '#666',
//   },
//   clearButton: {
//     padding: 5,
//   },
//   resultsContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 15,
//     paddingBottom: 5,
//   },
//   resultsText: {
//     fontSize: 14,
//     color: '#666',
//     fontWeight: '500',
//   },
//   refreshButton: {
//     padding: 5,
//   },
//   formCard: {
//     backgroundColor: 'white',
//     marginHorizontal: 15,
//     marginVertical: 8,
//     borderRadius: 12,
//     padding: 16,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//     borderLeftWidth: 4,
//     borderLeftColor: '#20AEBC',
//   },
//   formHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'flex-start',
//     marginBottom: 12,
//   },
//   formNumberContainer: {
//     flex: 1,
//   },
//   formNumber: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#333',
//     marginBottom: 4,
//   },
//   formDate: {
//     fontSize: 12,
//     color: '#666',
//   },
//   statusBadge: {
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderRadius: 12,
//     marginLeft: 10,
//   },
//   statusText: {
//     fontSize: 12,
//     fontWeight: '500',
//     color: 'white',
//   },
//   formDetails: {
//     marginBottom: 12,
//   },
//   detailRow: {
//     flexDirection: 'row',
//     alignItems: 'flex-start',
//     marginBottom: 6,
//   },
//   detailLabel: {
//     fontSize: 14,
//     fontWeight: '500',
//     color: '#666',
//     marginLeft: 6,
//     width: 100,
//   },
//   detailValue: {
//     fontSize: 14,
//     color: '#333',
//     flex: 1,
//   },
//   signatureContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 12,
//     paddingTop: 8,
//     borderTopWidth: 1,
//     borderTopColor: '#f0f0f0',
//   },
//   signatureBox: {
//     flex: 1,
//     alignItems: 'center',
//     paddingHorizontal: 5,
//   },
//   signatureLabel: {
//     fontSize: 12,
//     color: '#666',
//     marginBottom: 4,
//     fontWeight: '500',
//   },
//   signatureImage: {
//     width: 60,
//     height: 40,
//     borderRadius: 4,
//     borderWidth: 1,
//     borderColor: '#ddd',
//   },
//   noSignature: {
//     fontSize: 11,
//     color: '#999',
//     fontStyle: 'italic',
//   },
//   formFooter: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     borderTopWidth: 1,
//     borderTopColor: '#f0f0f0',
//     paddingTop: 12,
//   },
//   footerText: {
//     fontSize: 12,
//     color: '#20AEBC',
//   },
//   footerRight: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingVertical: 60,
//     paddingHorizontal: 40,
//   },
//   emptyText: {
//     fontSize: 16,
//     fontWeight: '500',
//     color: '#999',
//     marginTop: 10,
//     textAlign: 'center',
//     lineHeight: 22,
//   },
//   clearSearchButton: {
//     marginTop: 15,
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//     backgroundColor: '#20AEBC',
//     borderRadius: 6,
//   },
//   clearSearchText: {
//     color: 'white',
//     fontSize: 14,
//     fontWeight: '500',
//   },
//   refreshActionButton: {
//     marginTop: 15,
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//     backgroundColor: '#7E5EA9',
//     borderRadius: 6,
//   },
//   refreshActionText: {
//     color: 'white',
//     fontSize: 14,
//     fontWeight: '500',
//   },
//   listFooter: {
//     padding: 15,
//     alignItems: 'center',
//   },
//   listFooterText: {
//     fontSize: 12,
//     color: '#999',
//     textAlign: 'center',
//   },
// });

// export default AllDelivery;











// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   ScrollView,
//   TouchableOpacity,
//   StyleSheet,
//   TextInput,
//   ActivityIndicator,
//   Alert,
//   RefreshControl,
//   Image,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import LinearGradient from 'react-native-linear-gradient';
// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const AllDelivery = ({ navigation }) => {
//   const insets = useSafeAreaInsets();
//   const [deliveryData, setDeliveryData] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [userId, setUserId] = useState('');

//   const API_BASE = 'https://argosmob.uk/makroo/public/';

//   const handleBack = () => navigation.goBack();

//   useEffect(() => {
//     const fetchUserIdAndData = async () => {
//       try {
//         const storedUserId = await AsyncStorage.getItem('userId');
//         if (storedUserId) {
//           setUserId(storedUserId);
//           fetchDeliveryData(storedUserId);
//         } else {
//           setLoading(false);
//           Alert.alert('Error', 'User ID not found. Please login again.');
//         }
//       } catch (error) {
//         console.log('Error fetching user ID:', error);
//         setLoading(false);
//         Alert.alert('Error', 'Failed to load user data.');
//       }
//     };

//     fetchUserIdAndData();
//   }, []);

//   const fetchDeliveryData = async (userId, isRefresh = false) => {
//     try {
//       if (isRefresh) {
//         setRefreshing(true);
//       } else {
//         setLoading(true);
//       }

//       const formData = new FormData();
//       formData.append('user_id', userId);

//       const config = {
//         method: 'post',
//         maxBodyLength: Infinity,
//         url: API_BASE + 'api/v1/delivery-forms/all',
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//         data: formData,
//         timeout: 10000,
//       };

//       const response = await axios(config);
      
//       if (response.data.status && response.data.data) {
//         setDeliveryData(response.data.data);
//         setFilteredData(response.data.data);
//       } else {
//         Alert.alert('Info', 'No delivery forms found.');
//       }
//     } catch (error) {
//       console.log('API Error:', error);
//       if (error.response) {
//         Alert.alert('Error', error.response.data?.message || 'Failed to fetch data.');
//       } else if (error.request) {
//         Alert.alert('Network Error', 'Please check your internet connection.');
//       } else {
//         Alert.alert('Error', 'Something went wrong. Please try again.');
//       }
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   const onRefresh = () => {
//     if (userId) {
//       fetchDeliveryData(userId, true);
//     }
//   };

//   const handleSearch = (query) => {
//     setSearchQuery(query);
//     if (query.trim() === '') {
//       setFilteredData(deliveryData);
//     } else {
//       const filtered = deliveryData.filter(item =>
//         item.customer_name?.toLowerCase().includes(query.toLowerCase()) ||
//         item.tractor_number?.toLowerCase().includes(query.toLowerCase()) ||
//         item.engine_number?.toLowerCase().includes(query.toLowerCase()) ||
//         item.document_number?.toLowerCase().includes(query.toLowerCase()) ||
//         item.father_name?.toLowerCase().includes(query.toLowerCase())
//       );
//       setFilteredData(filtered);
//     }
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-IN', {
//       day: '2-digit',
//       month: '2-digit',
//       year: 'numeric'
//     });
//   };

//   const getStatusColor = (status) => {
//     switch (status?.toLowerCase()) {
//       case 'approved':
//         return '#4CAF50';
//       case 'rejected':
//         return '#F44336';
//       case 'pending':
//         return '#2196F3';
//       case 'edited':
//         return '#FF9800';
//       default:
//         return '#2196F3';
//     }
//   };

//   const getStatusText = (status) => {
//     if (!status) return 'Pending';
//     return status.charAt(0).toUpperCase() + status.slice(1);
//   };

//   const handleFormPress = (formId, status) => {
//     navigation.navigate('Deliveryforminternalpage', { 
//       formId,
//       status
//     });
//   };

//   if (loading) {
//     return (
//       <View style={[styles.loadingContainer, { paddingTop: insets.top }]}>
//         <LinearGradient
//           colors={['#7E5EA9', '#20AEBC']}
//           start={{ x: 0, y: 0 }}
//           end={{ x: 1, y: 0 }}
//           style={styles.header}>
//           <View style={styles.headerContent}>
//             <TouchableOpacity onPress={handleBack} style={styles.backButton}>
//               <Icon name="arrow-back" size={24} color="white" />
//             </TouchableOpacity>
//             <Text style={styles.screenTitle}>All Delivery Forms</Text>
//             <View style={styles.placeholder} />
//           </View>
//         </LinearGradient>
//         <View style={styles.loader}>
//           <ActivityIndicator size="large" color="#7E5EA9" />
//           <Text style={styles.loadingText}>Loading Delivery Forms...</Text>
//         </View>
//       </View>
//     );
//   }

//   return (
//     <View style={{ flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom }}>
//       <LinearGradient
//         colors={['#7E5EA9', '#20AEBC']}
//         start={{ x: 0, y: 0 }}
//         end={{ x: 1, y: 0 }}
//         style={styles.header}>
//         <View style={styles.headerContent}>
//           <TouchableOpacity onPress={handleBack} style={styles.backButton}>
//             <Icon name="arrow-back" size={24} color="white" />
//           </TouchableOpacity>
//           <Text style={styles.screenTitle}>All Delivery Forms</Text>
//           <View style={styles.placeholder} />
//         </View>
//       </LinearGradient>

//       <ScrollView 
//         style={styles.container} 
//         contentContainerStyle={styles.scrollContent}
//         refreshControl={
//           <RefreshControl
//             refreshing={refreshing}
//             onRefresh={onRefresh}
//             colors={['#7E5EA9']}
//             tintColor="#7E5EA9"
//           />
//         }
//       >
//         <View style={styles.searchContainer}>
//           <View style={styles.searchBox}>
//             <Icon name="search" size={20} color="#666" style={styles.searchIcon} />
//             <TextInput
//               placeholder="Customer\Tractor No\Engine No."
//               placeholderTextColor="#999"
//               style={styles.searchInput}
//               value={searchQuery}
//               onChangeText={handleSearch}
//             />
//             {searchQuery !== '' && (
//               <TouchableOpacity onPress={() => handleSearch('')} style={styles.clearButton}>
//                 <Icon name="close" size={18} color="#666" />
//               </TouchableOpacity>
//             )}
//           </View>
//         </View>

//         <View style={styles.resultsContainer}>
//           <Text style={styles.resultsText}>
//             {filteredData.length} Delivery Form{filteredData.length !== 1 ? 's' : ''} found
//           </Text>
//           <TouchableOpacity onPress={onRefresh} style={styles.refreshButton}>
//             <Icon name="refresh" size={20} color="#7E5EA9" />
//           </TouchableOpacity>
//         </View>

//         {filteredData.length === 0 ? (
//           <View style={styles.emptyContainer}>
//             <Icon name="local-shipping" size={60} color="#ccc" />
//             <Text style={styles.emptyText}>
//               {searchQuery ? 'No matching delivery forms found' : 'No delivery forms available'}
//             </Text>
//             {searchQuery ? (
//               <TouchableOpacity onPress={() => handleSearch('')} style={styles.clearSearchButton}>
//                 <Text style={styles.clearSearchText}>Clear Search</Text>
//               </TouchableOpacity>
//             ) : (
//               <TouchableOpacity onPress={onRefresh} style={styles.refreshActionButton}>
//                 <Text style={styles.refreshActionText}>Refresh</Text>
//               </TouchableOpacity>
//             )}
//           </View>
//         ) : (
//           filteredData.map((item) => (
//             <TouchableOpacity 
//               key={item.id} 
//               style={styles.formCard}
//               onPress={() => handleFormPress(item.id, item.status)}
//             >
//               <View style={styles.formHeader}>
//                 <View style={styles.formNumberContainer}>
//                   <Text style={styles.formDate}>{formatDate(item.submitted_at)}</Text>
//                 </View>
//                 <View style={[
//                   styles.statusBadge,
//                   { backgroundColor: getStatusColor(item.status) }
//                 ]}>
//                   <Text style={styles.statusText}>
//                     {getStatusText(item.status)}
//                   </Text>
//                 </View>
//               </View>
              
//               <View style={styles.formDetails}>
//                 <View style={styles.detailRow}>
//                   <Icon name="person" size={16} color="#666" />
//                   <Text style={styles.detailLabel}>Customer Name : </Text>
//                   <Text style={styles.detailValue} numberOfLines={1}>
//                     {item.customer_name || 'N/A'}
//                   </Text>
//                 </View>
                
//                 <View style={styles.detailRow}>
//                   <Icon name="people" size={16} color="#666" />
//                   <Text style={styles.detailLabel}>Father Name : </Text>
//                   <Text style={styles.detailValue} numberOfLines={1}>
//                     {item.father_name || 'N/A'}
//                   </Text>
//                 </View>

//                 <View style={styles.detailRow}>
//                   <Icon name="fingerprint" size={16} color="#666" />
//                   <Text style={styles.detailLabel}>Tractor Name : </Text>
//                   <Text style={styles.detailValue} numberOfLines={1}>
//                     {item.tractor_number || 'N/A'}
//                   </Text>
//                 </View>

//                 <View style={styles.detailRow}>
//                   <Icon name="build" size={16} color="#666" />
//                   <Text style={styles.detailLabel}>Engine No : </Text>
//                   <Text style={styles.detailValue} numberOfLines={1}>
//                     {item.engine_number || 'N/A'}
//                   </Text>
//                 </View>

//                 <View style={styles.detailRow}>
//                   <Icon name="description" size={16} color="#666" />
//                   <Text style={styles.detailLabel}>Document : </Text>
//                   <Text style={styles.detailValue} numberOfLines={1}>
//                     {item.document_type || 'N/A'} - {item.document_number || 'N/A'}
//                   </Text>
//                 </View>

//                 {item.address && (
//                   <View style={styles.detailRow}>
//                     <Icon name="location-on" size={16} color="#666" />
//                     <Text style={styles.detailLabel}>Address : </Text>
//                     <Text style={styles.detailValue} numberOfLines={2}>
//                       {item.address}
//                     </Text>
//                   </View>
//                 )}
//               </View>

//               <View style={styles.signatureContainer}>
//                 <View style={styles.signatureBox}>
//                   <Text style={styles.signatureLabel}>Customer Signature</Text>
//                   {item.customer_signature ? (
//                     <Image 
//                       source={{ uri: API_BASE + item.customer_signature }} 
//                       style={styles.signatureImage}
//                       resizeMode="contain"
//                     />
//                   ) : (
//                     <Text style={styles.noSignature}>No Signature</Text>
//                   )}
//                 </View>
//                 <View style={styles.signatureBox}>
//                   <Text style={styles.signatureLabel}>Manager Signature</Text>
//                   {item.manager_signature ? (
//                     <Image 
//                       source={{ uri: API_BASE + item.manager_signature }} 
//                       style={styles.signatureImage}
//                       resizeMode="contain"
//                     />
//                   ) : (
//                     <Text style={styles.noSignature}>No Signature</Text>
//                   )}
//                 </View>
//               </View>
              
//               <View style={styles.formFooter}>
//                 <Text style={styles.footerText}>Tap to view details</Text>
//                 <View style={styles.footerRight}>
//                   <Icon name="chevron-right" size={16} color="#7E5EA9" />
//                 </View>
//               </View>
//             </TouchableOpacity>
//           ))
//         )}

//         {filteredData.length > 0 && (
//           <View style={styles.listFooter}>
//             <Text style={styles.listFooterText}>
//               {filteredData.length === deliveryData.length 
//                 ? 'All forms loaded' 
//                 : `${filteredData.length} of ${deliveryData.length} forms shown`}
//             </Text>
//           </View>
//         )}
//       </ScrollView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f5f5f5',
//   },
//   scrollContent: {
//     flexGrow: 1,
//     paddingBottom: 20,
//   },
//   header: {
//     paddingVertical: 15,
//     paddingHorizontal: 20,
//   },
//   headerContent: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },
//   backButton: {
//     padding: 5,
//   },
//   screenTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: 'white',
//     textAlign: 'center',
//     flex: 1,
//   },
//   placeholder: {
//     width: 24,
//   },
//   loadingContainer: {
//     flex: 1,
//     backgroundColor: '#f5f5f5',
//   },
//   loader: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   loadingText: {
//     marginTop: 10,
//     fontSize: 16,
//     color: '#666',
//   },
//   searchContainer: {
//     padding: 15,
//     backgroundColor: 'white',
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//   },
//   searchBox: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#f8f8f8',
//     borderRadius: 10,
//     paddingHorizontal: 15,
//     height: 50,
//     borderWidth: 1,
//     borderColor: '#ddd',
//   },
//   searchIcon: {
//     marginRight: 10,
//   },
//   searchInput: {
//     flex: 1,
//     fontSize: 16,
//     color: '#666',
//   },
//   clearButton: {
//     padding: 5,
//   },
//   resultsContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 15,
//     paddingBottom: 5,
//   },
//   resultsText: {
//     fontSize: 14,
//     color: '#666',
//     fontWeight: '500',
//   },
//   refreshButton: {
//     padding: 5,
//   },
//   formCard: {
//     backgroundColor: 'white',
//     marginHorizontal: 15,
//     marginVertical: 8,
//     borderRadius: 12,
//     padding: 16,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//     borderLeftWidth: 4,
//     borderLeftColor: '#20AEBC',
//   },
//   formHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'flex-start',
//     marginBottom: 12,
//   },
//   formNumberContainer: {
//     flex: 1,
//   },
//   formNumber: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#333',
//     marginBottom: 4,
//   },
//   formDate: {
//     fontSize: 12,
//     color: '#666',
//   },
//   statusBadge: {
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderRadius: 12,
//     marginLeft: 10,
//   },
//   statusText: {
//     fontSize: 12,
//     fontWeight: '500',
//     color: 'white',
//   },
//   formDetails: {
//     marginBottom: 12,
//   },
//   detailRow: {
//     flexDirection: 'row',
//     alignItems: 'flex-start',
//     marginBottom: 6,
//   },
//   detailLabel: {
//     fontSize: 14,
//     fontWeight: '500',
//     color: '#666',
//     marginLeft: 6,
//     width: 100,
//   },
//   detailValue: {
//     fontSize: 14,
//     color: '#333',
//     flex: 1,
//   },
//   signatureContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 12,
//     paddingTop: 8,
//     borderTopWidth: 1,
//     borderTopColor: '#f0f0f0',
//   },
//   signatureBox: {
//     flex: 1,
//     alignItems: 'center',
//     paddingHorizontal: 5,
//   },
//   signatureLabel: {
//     fontSize: 12,
//     color: '#666',
//     marginBottom: 4,
//     fontWeight: '500',
//   },
//   signatureImage: {
//     width: 60,
//     height: 40,
//     borderRadius: 4,
//     borderWidth: 1,
//     borderColor: '#ddd',
//   },
//   noSignature: {
//     fontSize: 11,
//     color: '#999',
//     fontStyle: 'italic',
//   },
//   formFooter: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     borderTopWidth: 1,
//     borderTopColor: '#f0f0f0',
//     paddingTop: 12,
//   },
//   footerText: {
//     fontSize: 12,
//     color: '#20AEBC',
//   },
//   footerRight: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingVertical: 60,
//     paddingHorizontal: 40,
//   },
//   emptyText: {
//     fontSize: 16,
//     fontWeight: '500',
//     color: '#999',
//     marginTop: 10,
//     textAlign: 'center',
//     lineHeight: 22,
//   },
//   clearSearchButton: {
//     marginTop: 15,
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//     backgroundColor: '#20AEBC',
//     borderRadius: 6,
//   },
//   clearSearchText: {
//     color: 'white',
//     fontSize: 14,
//     fontWeight: '500',
//   },
//   refreshActionButton: {
//     marginTop: 15,
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//     backgroundColor: '#7E5EA9',
//     borderRadius: 6,
//   },
//   refreshActionText: {
//     color: 'white',
//     fontSize: 14,
//     fontWeight: '500',
//   },
//   listFooter: {
//     padding: 15,
//     alignItems: 'center',
//   },
//   listFooterText: {
//     fontSize: 12,
//     color: '#999',
//     textAlign: 'center',
//   },
// });

// export default AllDelivery;










import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  Alert,
  RefreshControl,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AllDelivery = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [deliveryData, setDeliveryData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userId, setUserId] = useState('');

  const API_BASE = 'https://argosmob.uk/makroo/public/';

  const handleBack = () => navigation.goBack();

  useEffect(() => {
    const fetchUserIdAndData = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        if (storedUserId) {
          setUserId(storedUserId);
          fetchDeliveryData(storedUserId);
        } else {
          setLoading(false);
          Alert.alert('Error', 'User ID not found. Please login again.');
        }
      } catch (error) {
        console.log('Error fetching user ID:', error);
        setLoading(false);
        Alert.alert('Error', 'Failed to load user data.');
      }
    };

    fetchUserIdAndData();
  }, []);

  const fetchDeliveryData = async (userId, isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const formData = new FormData();
      formData.append('user_id', userId);

      const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: API_BASE + 'api/v1/delivery-forms/all',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: formData,
        timeout: 10000,
      };

      const response = await axios(config);
      
      if (response.data.status && response.data.data) {
        setDeliveryData(response.data.data);
        setFilteredData(response.data.data);
      } else {
        Alert.alert('Info', 'No delivery forms found.');
      }
    } catch (error) {
      console.log('API Error:', error);
      if (error.response) {
        Alert.alert('Error', error.response.data?.message || 'Failed to fetch data.');
      } else if (error.request) {
        Alert.alert('Network Error', 'Please check your internet connection.');
      } else {
        Alert.alert('Error', 'Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    if (userId) {
      fetchDeliveryData(userId, true);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredData(deliveryData);
    } else {
      const filtered = deliveryData.filter(item =>
        item.customer_name?.toLowerCase().includes(query.toLowerCase()) ||
        item.tractor_number?.toLowerCase().includes(query.toLowerCase()) ||
        item.engine_number?.toLowerCase().includes(query.toLowerCase()) ||
        item.document_number?.toLowerCase().includes(query.toLowerCase()) ||
        item.father_name?.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredData(filtered);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return '#4CAF50';
      case 'rejected':
        return '#F44336';
      case 'pending':
        return '#2196F3';
      case 'edited':
        return '#FF9800';
      default:
        return '#2196F3';
    }
  };

  const getStatusText = (status) => {
    if (!status) return 'Pending';
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const handleFormPress = (formId, status) => {
    navigation.navigate('Deliveryforminternalpage', { 
      formId,
      status
    });
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { paddingTop: insets.top }]}>
        <LinearGradient
          colors={['#7E5EA9', '#20AEBC']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.header}>
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <Icon name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.screenTitle}>All Delivery Forms</Text>
            <View style={styles.placeholder} />
          </View>
        </LinearGradient>
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#7E5EA9" />
          <Text style={styles.loadingText}>Loading Delivery Forms...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom }}>
      <LinearGradient
        colors={['#7E5EA9', '#20AEBC']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Icon name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.screenTitle}>All Delivery Forms</Text>
          <View style={styles.placeholder} />
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.container} 
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#7E5EA9']}
            tintColor="#7E5EA9"
          />
        }
      >
        <View style={styles.searchContainer}>
          <View style={styles.searchBox}>
            <Icon name="search" size={20} color="#666" style={styles.searchIcon} />
            <TextInput
              placeholder="Customer\Tractor No\Engine No."
              placeholderTextColor="#999"
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={handleSearch}
            />
            {searchQuery !== '' && (
              <TouchableOpacity onPress={() => handleSearch('')} style={styles.clearButton}>
                <Icon name="close" size={18} color="#666" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.resultsContainer}>
          <Text style={styles.resultsText}>
            {filteredData.length} Delivery Form{filteredData.length !== 1 ? 's' : ''} found
          </Text>
          <TouchableOpacity onPress={onRefresh} style={styles.refreshButton}>
            <Icon name="refresh" size={20} color="#7E5EA9" />
          </TouchableOpacity>
        </View>

        {filteredData.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Icon name="local-shipping" size={60} color="#ccc" />
            <Text style={styles.emptyText}>
              {searchQuery ? 'No matching delivery forms found' : 'No delivery forms available'}
            </Text>
            {searchQuery ? (
              <TouchableOpacity onPress={() => handleSearch('')} style={styles.clearSearchButton}>
                <Text style={styles.clearSearchText}>Clear Search</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={onRefresh} style={styles.refreshActionButton}>
                <Text style={styles.refreshActionText}>Refresh</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          filteredData.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              style={styles.formCard}
              onPress={() => handleFormPress(item.id, item.status)}
            >
              <View style={styles.formHeader}>
                <View style={styles.formNumberContainer}>
                  <Text style={styles.formDate}>{formatDate(item.submitted_at)}</Text>
                </View>
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(item.status) }
                ]}>
                  <Text style={styles.statusText}>
                    {getStatusText(item.status)}
                  </Text>
                </View>
              </View>
              
              <View style={styles.formDetails}>
                <View style={styles.detailRow}>
                  <Icon name="person" size={16} color="#666" />
                  <Text style={styles.detailLabel}>Customer Name : </Text>
                  <Text style={styles.detailValue} numberOfLines={1}>
                    {item.customer_name || 'N/A'}
                  </Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Icon name="people" size={16} color="#666" />
                  <Text style={styles.detailLabel}>Father Name : </Text>
                  <Text style={styles.detailValue} numberOfLines={1}>
                    {item.father_name || 'N/A'}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Icon name="fingerprint" size={16} color="#666" />
                  <Text style={styles.detailLabel}>Tractor Name : </Text>
                  <Text style={styles.detailValue} numberOfLines={1}>
                    {item.tractor_number || 'N/A'}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Icon name="build" size={16} color="#666" />
                  <Text style={styles.detailLabel}>Engine No : </Text>
                  <Text style={styles.detailValue} numberOfLines={1}>
                    {item.engine_number || 'N/A'}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Icon name="description" size={16} color="#666" />
                  <Text style={styles.detailLabel}>Document : </Text>
                  <Text style={styles.detailValue} numberOfLines={1}>
                    {item.document_type || 'N/A'} - {item.document_number || 'N/A'}
                  </Text>
                </View>

                {item.address && (
                  <View style={styles.detailRow}>
                    <Icon name="location-on" size={16} color="#666" />
                    <Text style={styles.detailLabel}>Address : </Text>
                    <Text style={styles.detailValue} numberOfLines={2}>
                      {item.address}
                    </Text>
                  </View>
                )}
              </View>

              <View style={styles.signatureContainer}>
                <View style={styles.signatureBox}>
                  <Text style={styles.signatureLabel}>Customer Signature</Text>
                  {item.customer_signature ? (
                    <Image 
                      source={{ uri: API_BASE + item.customer_signature }} 
                      style={styles.signatureImage}
                      resizeMode="contain"
                    />
                  ) : (
                    <Text style={styles.noSignature}>No Signature</Text>
                  )}
                </View>
                <View style={styles.signatureBox}>
                  <Text style={styles.signatureLabel}>Manager Signature</Text>
                  {item.manager_signature ? (
                    <Image 
                      source={{ uri: API_BASE + item.manager_signature }} 
                      style={styles.signatureImage}
                      resizeMode="contain"
                    />
                  ) : (
                    <Text style={styles.noSignature}>No Signature</Text>
                  )}
                </View>
              </View>
              
              <View style={styles.formFooter}>
                <Text style={styles.footerText}>Tap to view details</Text>
                <View style={styles.footerRight}>
                  <Icon name="chevron-right" size={16} color="#7E5EA9" />
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}

        {filteredData.length > 0 && (
          <View style={styles.listFooter}>
            <Text style={styles.listFooterText}>
              {filteredData.length === deliveryData.length 
                ? 'All forms loaded' 
                : `${filteredData.length} of ${deliveryData.length} forms shown`}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  header: {
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 5,
  },
  screenTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    flex: 1,
  },
  placeholder: {
    width: 24,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  searchContainer: {
    padding: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#666',
  },
  clearButton: {
    padding: 5,
  },
  resultsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    paddingBottom: 5,
  },
  resultsText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  refreshButton: {
    padding: 5,
  },
  formCard: {
    backgroundColor: 'white',
    marginHorizontal: 15,
    marginVertical: 8,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: '#20AEBC',
  },
  formHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  formNumberContainer: {
    flex: 1,
  },
  formNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  formDate: {
    fontSize: 12,
    color: '#666',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 10,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    color: 'white',
  },
  formDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginLeft: 6,
    width: 100,
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  signatureContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  signatureBox: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  signatureLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
    fontWeight: '500',
  },
  signatureImage: {
    width: 60,
    height: 40,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  noSignature: {
    fontSize: 11,
    color: '#999',
    fontStyle: 'italic',
  },
  formFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
  },
  footerText: {
    fontSize: 12,
    color: '#20AEBC',
  },
  footerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#999',
    marginTop: 10,
    textAlign: 'center',
    lineHeight: 22,
  },
  clearSearchButton: {
    marginTop: 15,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#20AEBC',
    borderRadius: 6,
  },
  clearSearchText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  refreshActionButton: {
    marginTop: 15,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#7E5EA9',
    borderRadius: 6,
  },
  refreshActionText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  listFooter: {
    padding: 15,
    alignItems: 'center',
  },
  listFooterText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
});

export default AllDelivery;