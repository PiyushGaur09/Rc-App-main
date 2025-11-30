// // AddModelStocks.js
// import React, {useEffect, useMemo, useState, useCallback} from 'react';
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
//   ActivityIndicator,
//   Platform,
// } from 'react-native';

// import Icon from 'react-native-vector-icons/MaterialIcons';
// import {useSafeAreaInsets} from 'react-native-safe-area-context';
// import LinearGradient from 'react-native-linear-gradient';
// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const API_BASE = 'https://argosmob.uk/makroo/public/api/v1';

// const numberify = s => String(s ?? '').replace(/[^\d]/g, '');

// const AddModelStocks = ({navigation}) => {
//   const insets = useSafeAreaInsets();

//   // Dropdown state
//   const [showModelDropdown, setShowModelDropdown] = useState(false);
//   const [showLocationDropdown, setShowLocationDropdown] = useState(false);

//   // Data
//   const [models, setModels] = useState([]); // [{id, name}]
//   const [locations, setLocations] = useState([]); // [{id, name}]

//   // Selections
//   const [modelId, setModelId] = useState('');
//   const [modelName, setModelName] = useState('');
//   const [locationId, setLocationId] = useState('');
//   const [locationName, setLocationName] = useState('');

//   // Numeric fields
//   const [locationStock, setLocationStock] = useState('');
//   const [inTransit, setInTransit] = useState('');
//   const [delivered, setDelivered] = useState('');
//   const [billed, setBilled] = useState('');
//   const [depotStock, setDepotStock] = useState('');

//   // Loading & errors
//   const [loadingInit, setLoadingInit] = useState(true);
//   const [submitting, setSubmitting] = useState(false);
//   const [loadError, setLoadError] = useState(null);

//   // ===== Fetch initial lists =====
//   useEffect(() => {
//     let mounted = true;

//     (async () => {
//       try {
//         setLoadingInit(true);
//         setLoadError(null);

//         const userId = await AsyncStorage.getItem('userId');
//         if (!userId) {
//           throw new Error('Missing userId in AsyncStorage (key: "userId").');
//         }

//         const [modelsRes, locationsRes] = await Promise.all([
//           axios.get(`${API_BASE}/model/tractor-models`, {
//             params: {user_id: userId},
//             maxBodyLength: Infinity,
//           }),
//           axios.get(`${API_BASE}/stock-locations`, {maxBodyLength: Infinity}),
//         ]);

//         if (!mounted) return;

//         const modelList = Array.isArray(modelsRes?.data?.data)
//           ? modelsRes.data.data
//           : modelsRes.data;

//         const locationList = Array.isArray(locationsRes?.data?.data)
//           ? locationsRes.data.data
//           : locationsRes.data;

//         const normalizedModels = (modelList || []).map(m => {
//           const id = String(m?.id ?? m?.model_id ?? '');
//           const name =
//             m?.model_name ||
//             m?.name ||
//             m?.title ||
//             `Model ${m?.id ?? m?.model_id ?? ''}`;
//         return {id, name};
//         });

//         const normalizedLocations = (locationList || []).map(loc => {
//           const id = String(loc?.id ?? loc?.location_id ?? '');
//           const name = loc?.name || loc?.location_name || `Location ${loc?.id ?? ''}`;
//           return {id, name};
//         });

//         setModels(normalizedModels);
//         setLocations(normalizedLocations);

//         if (normalizedModels.length > 0) {
//           setModelId(normalizedModels[0].id);
//           setModelName(normalizedModels[0].name);
//         }
//         if (normalizedLocations.length > 0) {
//           setLocationId(normalizedLocations[0].id);
//           setLocationName(normalizedLocations[0].name);
//         }
//       } catch (err) {
//         console.error(err);
//         setLoadError(
//           err?.response?.data?.message ||
//             err?.message ||
//             'Failed to load models/locations.',
//         );
//       } finally {
//         if (mounted) setLoadingInit(false);
//       }
//     })();

//     return () => {
//       mounted = false;
//     };
//   }, []);

//   // ===== Validation =====
//   const valid = useMemo(() => {
//     const requiredNumbers = [locationStock, inTransit, delivered, billed, depotStock];
//     const numbersPresent = requiredNumbers.every(v => v !== '' && /^[0-9]+$/.test(v));
//     return !!modelId && !!locationId && numbersPresent;
//   }, [modelId, locationId, locationStock, inTransit, delivered, billed, depotStock]);

//   // ===== Submit =====
//   const handleSubmit = useCallback(async () => {
//     if (!valid) {
//       Alert.alert('Validation', 'Please fill all fields with valid numbers and selections.');
//       return;
//     }

//     setSubmitting(true);
//     try {
//       const payload = {
//         model_id: Number(modelId),
//         location_id: Number(locationId),
//         location_stock: Number(locationStock),
//         in_transit: Number(inTransit),
//         delivered: Number(delivered),
//         billed: Number(billed),
//         depot_stock: Number(depotStock),
//       };

//       const res = await axios.post(`${API_BASE}/model-stocks`, JSON.stringify(payload), {
//         headers: {'Content-Type': 'application/json'},
//         maxBodyLength: Infinity,
//       });
// console.log(res)
//       const ok =
//         res?.status >= 200 &&
//         res?.status < 300 &&
//         (res?.data?.success === true || res?.data);

//       if (!ok) throw new Error('Unexpected response from server.');

//       Alert.alert('Success', 'Stock details have been saved.', [
//         {
//           text: 'OK',
//           onPress: () => {
//             setLocationStock('');
//             setInTransit('');
//             setDelivered('');
//             setBilled('');
//             setDepotStock('');
//           },
//         },
//       ]);
//     } catch (err) {
//       console.error(err);
//       const msg =
//         err?.response?.data?.message ||
//         err?.response?.data?.error ||
//         err?.message ||
//         'Failed to save stock details.';
//       Alert.alert('Error', msg);
//     } finally {
//       setSubmitting(false);
//     }
//   }, [valid, modelId, locationId, locationStock, inTransit, delivered, billed, depotStock]);

//   // ===== Renderers for dropdown modals =====
//   const renderModelItem = ({item}) => (
//     <TouchableOpacity
//       style={styles.modelItem}
//       onPress={() => {
//         setModelId(item.id);
//         setModelName(item.name);
//         setShowModelDropdown(false);
//       }}>
//       <Text style={styles.modelItemText}>{item.name}</Text>
//     </TouchableOpacity>
//   );

//   const renderLocationItem = ({item}) => (
//     <TouchableOpacity
//       style={styles.modelItem}
//       onPress={() => {
//         setLocationId(item.id);
//         setLocationName(item.name);
//         setShowLocationDropdown(false);
//       }}>
//       <Text style={styles.modelItemText}>{item.name}</Text>
//     </TouchableOpacity>
//   );

//   // ===== Loading / Error States (styled like the app) =====
//   if (loadingInit) {
//     return (
//       <View style={[styles.centerWrap, {paddingTop: insets.top, paddingBottom: insets.bottom}]}>
//         <LinearGradient colors={['#7E5EA9', '#20AEBC']} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={styles.header}>
//            <View style={styles.headerContent}>
//                                       {/* Left Side: Menu Icon */}
//                                       <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Hamburger')}>
//                                         <Icon name="reorder" size={25} color="#fff" />
//                                       </TouchableOpacity>
                            
//                                       {/* Center: Dashboard Text */}
//                                       <View>
//                                         <Text style={styles.companyName}>Makroo Motor Corp.</Text>
//                                         <Text style={styles.companyName1}>Add Model Stocks</Text>
//                                       </View>
                            
//                                       {/* Right Side: Icon */}
//                                       <TouchableOpacity style={styles.iconButton}>
//                                         <Icon name="notifications-on" size={25} color="#fff" />
//                                       </TouchableOpacity>
//                                     </View>
         
//         </LinearGradient>
//         <View style={styles.centerInner}>
//           <ActivityIndicator />
//           <Text style={styles.loadingText}>Loading data…</Text>
//         </View>
//       </View>
//     );
//   }

//   if (loadError) {
//     return (
//       <View style={[styles.centerWrap, {paddingTop: insets.top, paddingBottom: insets.bottom}]}>
//         <LinearGradient colors={['#7E5EA9', '#20AEBC']} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={styles.header}>
//           <Text style={styles.companyName}>Makroo Motor Corporation</Text>
//           <Text style={styles.companyName1}>Add Model Stocks</Text>
//         </LinearGradient>
//         <View style={styles.centerInner}>
//           <Text style={styles.errorText}>{loadError}</Text>
//           <TouchableOpacity
//             style={[styles.submitButton, {marginTop: 14}]}
//             onPress={() => {
//               // simplest: reload by toggling state via a mini remount pattern
//               setLoadingInit(true);
//               setLoadError(null);
//               // Let useEffect run again naturally through state updates above
//             }}>
//             <Text style={styles.submitButtonText}>Retry</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     );
//   }

//   return (
//     <View style={{flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom}}>
//       {/* Header with Gradient */}
//       <LinearGradient
//         colors={['#7E5EA9', '#20AEBC']}
//         start={{x: 0, y: 0}}
//         end={{x: 1, y: 0}}
//         style={styles.header}>
//            <View style={styles.headerContent}>
//                                       {/* Left Side: Menu Icon */}
//                                       <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Hamburger')}>
//                                         <Icon name="reorder" size={25} color="#fff" />
//                                       </TouchableOpacity>
                            
//                                       {/* Center: Dashboard Text */}
//                                       <View>
//                                         <Text style={styles.companyName}>Makroo Motor Corp.</Text>
//                                         <Text style={styles.companyName1}>Add Model Stocks</Text>
//                                       </View>
                            
//                                       {/* Right Side: Icon */}
//                                       <TouchableOpacity style={styles.iconButton}>
//                                         <Icon name="notifications-on" size={25} color="#fff" />
//                                       </TouchableOpacity>
//                                     </View>
                          
       
//       </LinearGradient>

//       <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
//         {/* Form container */}
//         <View style={styles.formContainer}>
//           {/* Row 1: Model, Location */}
//           <View className="row" style={styles.row}>
//             {/* Model */}
//             <View style={styles.inputContainer}>
//               <LinearGradient colors={['#7E5EA9', '#20AEBC']} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={styles.inputGradient}>
//                 <TouchableOpacity style={styles.input} onPress={() => setShowModelDropdown(true)}>
//                   <Text style={modelId ? styles.selectedModelText : styles.placeholderText}>
//                     {modelName || 'Select Model'}
//                   </Text>
//                   <Icon name="keyboard-arrow-down" size={25} color="#666" style={styles.dropdownIcon} />
//                 </TouchableOpacity>
//               </LinearGradient>
//             </View>

//             {/* Location */}
//             <View style={styles.inputContainer}>
//               <LinearGradient colors={['#7E5EA9', '#20AEBC']} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={styles.inputGradient}>
//                 <TouchableOpacity style={styles.input} onPress={() => setShowLocationDropdown(true)}>
//                   <Text style={locationId ? styles.selectedModelText : styles.placeholderText}>
//                     {locationName || 'Select Location'}
//                   </Text>
//                   <Icon name="keyboard-arrow-down" size={25} color="#666" style={styles.dropdownIcon} />
//                 </TouchableOpacity>
//               </LinearGradient>
//             </View>
//           </View>

//           {/* Row 2: Location Stock, In Transit */}
//           <View style={styles.row}>
//             <View style={styles.inputContainer}>
//               <LinearGradient colors={['#7E5EA9', '#20AEBC']} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={styles.inputGradient}>
//                 <TextInput
//                   style={styles.input}
//                   value={locationStock}
//                   onChangeText={t => setLocationStock(numberify(t))}
//                   placeholder="Location Stock"
//                    placeholderTextColor="#666"

//                   keyboardType="number-pad"
//                 />
//               </LinearGradient>
//             </View>
//             <View style={styles.inputContainer}>
//               <LinearGradient colors={['#7E5EA9', '#20AEBC']} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={styles.inputGradient}>
//                 <TextInput
//                   style={styles.input}
//                   value={inTransit}
//                   onChangeText={t => setInTransit(numberify(t))}
//                   placeholder="In Transit"
//                    placeholderTextColor="#666"

//                   keyboardType="number-pad"
//                 />
//               </LinearGradient>
//             </View>
//           </View>

//           {/* Row 3: Delivered, Billed */}
//           <View style={styles.row}>
//             <View style={styles.inputContainer}>
//               <LinearGradient colors={['#7E5EA9', '#20AEBC']} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={styles.inputGradient}>
//                 <TextInput
//                   style={styles.input}
//                   value={delivered}
//                   onChangeText={t => setDelivered(numberify(t))}
//                   placeholder="Delivered"
//                    placeholderTextColor="#666"

//                   keyboardType="number-pad"
//                 />
//               </LinearGradient>
//             </View>
//             <View style={styles.inputContainer}>
//               <LinearGradient colors={['#7E5EA9', '#20AEBC']} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={styles.inputGradient}>
//                 <TextInput
//                   style={styles.input}
//                   value={billed}
//                   onChangeText={t => setBilled(numberify(t))}
//                   placeholder="Billed"
//                    placeholderTextColor="#666"

//                   keyboardType="number-pad"
//                 />
//               </LinearGradient>
//             </View>
//           </View>

//           {/* Row 4: Depot Stock (single) */}
//           <View style={styles.row}>
//             <View style={styles.inputContainer}>
//               <LinearGradient colors={['#7E5EA9', '#20AEBC']} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={styles.inputGradient}>
//                 <TextInput
//                   style={styles.input}
//                   value={depotStock}
//                   onChangeText={t => setDepotStock(numberify(t))}
//                   placeholder="Depot Stock"
//                    placeholderTextColor="#666"

//                   keyboardType="number-pad"
//                 />
//               </LinearGradient>
//             </View>
//             <View style={[styles.inputContainer, {opacity: 0}]}>
//               {/* Spacer to keep grid feel like AddModel two-columns */}
//               <LinearGradient colors={['transparent', 'transparent']} style={[styles.inputGradient, {backgroundColor: 'transparent'}]}>
//                 <View style={[styles.input, {backgroundColor: 'transparent'}]} />
//               </LinearGradient>
//             </View>
//           </View>
//         </View>

//         {/* Submit */}
//         <View style={styles.buttonContainer}>
//           <TouchableOpacity
//             style={[styles.submitButton, (!valid || submitting) && {opacity: 0.7}]}
//             onPress={handleSubmit}
//             disabled={!valid || submitting}>
//             {submitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitButtonText}>Save</Text>}
//           </TouchableOpacity>
//         </View>
//       </ScrollView>

//       {/* Model Dropdown Modal */}
//       <Modal
//         visible={showModelDropdown}
//         transparent
//         animationType="slide"
//         onRequestClose={() => setShowModelDropdown(false)}>
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContent}>
//             <View style={styles.modalHeader}>
//               <Text style={styles.modalTitle}>Select Model</Text>
//               <TouchableOpacity onPress={() => setShowModelDropdown(false)} style={styles.closeButton}>
//                 <Icon name="close" size={24} color="#000" />
//               </TouchableOpacity>
//             </View>
//             <FlatList
//               data={models}
//               renderItem={renderModelItem}
//               keyExtractor={(item, index) => item.id || String(index)}
//               style={styles.modelList}
//               showsVerticalScrollIndicator
//             />
//           </View>
//         </View>
//       </Modal>

//       {/* Location Dropdown Modal */}
//       <Modal
//         visible={showLocationDropdown}
//         transparent
//         animationType="slide"
//         onRequestClose={() => setShowLocationDropdown(false)}>
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContent}>
//             <View style={styles.modalHeader}>
//               <Text style={styles.modalTitle}>Select Location</Text>
//               <TouchableOpacity onPress={() => setShowLocationDropdown(false)} style={styles.closeButton}>
//                 <Icon name="close" size={24} color="#000" />
//               </TouchableOpacity>
//             </View>
//             <FlatList
//               data={locations}
//               renderItem={renderLocationItem}
//               keyExtractor={(item, index) => item.id || String(index)}
//               style={styles.modelList}
//               showsVerticalScrollIndicator
//             />
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {paddingHorizontal: 15},
//   header: {paddingHorizontal:15, paddingVertical: 10},
//   companyName: {fontSize: 18, fontWeight: '500', color: 'white', textAlign: 'center',fontFamily: 'Inter_28pt-SemiBold'},
//   companyName1: {fontSize: 14,  color: 'white', textAlign: 'center',fontFamily: 'Inter_28pt-SemiBold'},

//   formContainer: {marginBottom: 15, marginTop: 40},
//   row: {marginBottom: 0,},
//   inputContainer: {flex: 1, marginHorizontal: 4, marginBottom: 10},
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
//   },
//   selectedModelText: {fontSize: 14, fontFamily: 'Inter_28pt-Regular', color: '#000'},
//   placeholderText: {fontSize: 14, fontFamily: 'Inter_28pt-Regular', color: '#666'},
//   dropdownIcon: {marginLeft: 8},

//   // Modal styles — mirroring your AddModel
//   modalOverlay: {flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center'},
//   modalContent: {backgroundColor: 'white', borderRadius: 10, width: '90%', maxHeight: '70%', overflow: 'hidden'},
//   modalHeader: {
//     flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
//     padding: 15, borderBottomWidth: 1, borderBottomColor: '#e0e0e0',
//   },
//   modalTitle: {fontSize: 16, fontWeight: 'bold', fontFamily: 'Inter_28pt-SemiBold'},
//   closeButton: {padding: 4},
//   modelList: {maxHeight: 300},
//   modelItem: {padding: 15, borderBottomWidth: 1, borderBottomColor: '#f0f0f0'},
//   modelItemText: {fontSize: 14, fontFamily: 'Inter_28pt-Regular', color: '#333'},

//   // Button section (match AddModel)
//   buttonContainer: {marginTop: 20, marginBottom: 30},
//   submitButton: {flex: 1, backgroundColor: '#7E5EA9', padding: 15, borderRadius: 10, alignItems: 'center', marginBottom: 10},
//   submitButtonText: {color: '#fff', fontFamily: 'Inter_28pt-SemiBold', fontSize: 14},

//   // Loading/Error wrappers in same vibe
//   centerWrap: {flex: 1},
//   centerInner: {flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24},
//   loadingText: {marginTop: 10, color: '#00000099', fontFamily: 'Inter_28pt-Regular'},
//   errorText: {textAlign: 'center', color: '#000', fontFamily: 'Inter_28pt-Regular'},
//  headerContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
// });

// export default AddModelStocks;





// AddModelStocks.js
import React, {useEffect, useMemo, useState, useCallback} from 'react';
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
  ActivityIndicator,
  Platform,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE = 'https://argosmob.uk/makroo/public/api/v1';

const numberify = s => String(s ?? '').replace(/[^\d]/g, '');
const alphanumeric = s => String(s ?? '').replace(/[^a-zA-Z0-9]/g, '');

const AddModelStocks = ({navigation}) => {
  const insets = useSafeAreaInsets();

  // Dropdown state
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);

  // Data
  const [models, setModels] = useState([]); // [{id, name}]
  const [locations, setLocations] = useState([]); // [{id, name}]

  // Selections
  const [modelId, setModelId] = useState('');
  const [modelName, setModelName] = useState('');
  const [locationId, setLocationId] = useState('');
  const [locationName, setLocationName] = useState('');

  // Numeric fields
  const [locationStock, setLocationStock] = useState('');
  const [inTransit, setInTransit] = useState('');
  const [delivered, setDelivered] = useState('');
  const [billed, setBilled] = useState('');
  const [depotStock, setDepotStock] = useState('');
  const [billedCash, setBilledCash] = useState('');
  const [billedBank, setBilledBank] = useState('');

  // Loading & errors
  const [loadingInit, setLoadingInit] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [loadError, setLoadError] = useState(null);

  // ===== Fetch initial lists =====
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoadingInit(true);
        setLoadError(null);

        const userId = await AsyncStorage.getItem('userId');
        if (!userId) {
          throw new Error('Missing userId in AsyncStorage (key: "userId").');
        }

        const [modelsRes, locationsRes] = await Promise.all([
          axios.get(`${API_BASE}/model/tractor-models`, {
            params: {user_id: userId},
            maxBodyLength: Infinity,
          }),
          axios.get(`${API_BASE}/stock-locations`, {maxBodyLength: Infinity}),
        ]);

        if (!mounted) return;

        const modelList = Array.isArray(modelsRes?.data?.data)
          ? modelsRes.data.data
          : modelsRes.data;

        const locationList = Array.isArray(locationsRes?.data?.data)
          ? locationsRes.data.data
          : locationsRes.data;

        const normalizedModels = (modelList || []).map(m => {
          const id = String(m?.id ?? m?.model_id ?? '');
          const name =
            m?.model_name ||
            m?.name ||
            m?.title ||
            `Model ${m?.id ?? m?.model_id ?? ''}`;
        return {id, name};
        });

        const normalizedLocations = (locationList || []).map(loc => {
          const id = String(loc?.id ?? loc?.location_id ?? '');
          const name = loc?.name || loc?.location_name || `Location ${loc?.id ?? ''}`;
          return {id, name};
        });

        setModels(normalizedModels);
        setLocations(normalizedLocations);

        if (normalizedModels.length > 0) {
          setModelId(normalizedModels[0].id);
          setModelName(normalizedModels[0].name);
        }
        if (normalizedLocations.length > 0) {
          setLocationId(normalizedLocations[0].id);
          setLocationName(normalizedLocations[0].name);
        }
      } catch (err) {
        console.error(err);
        setLoadError(
          err?.response?.data?.message ||
            err?.message ||
            'Failed to load models/locations.',
        );
      } finally {
        if (mounted) setLoadingInit(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  // ===== Validation =====
  const valid = useMemo(() => {
    const requiredNumbers = [locationStock, inTransit, delivered, billed, depotStock];
    const numbersPresent = requiredNumbers.every(v => v !== '' && /^[0-9]+$/.test(v));
    
    const requiredAlphanumeric = [billedCash, billedBank];
    const alphanumericPresent = requiredAlphanumeric.every(v => v !== '' && /^[a-zA-Z0-9]+$/.test(v));
    
    return !!modelId && !!locationId && numbersPresent && alphanumericPresent;
  }, [modelId, locationId, locationStock, inTransit, delivered, billed, depotStock, billedCash, billedBank]);

  // ===== Submit =====
  const handleSubmit = useCallback(async () => {
    if (!valid) {
      Alert.alert('Validation', 'Please fill all fields correctly. Numeric fields require numbers only, and billed fields require alphanumeric characters.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        model_id: Number(modelId),
        location_id: Number(locationId),
        location_stock: Number(locationStock),
        in_transit: Number(inTransit),
        delivered: Number(delivered),
        billed: Number(billed),
        depot_stock: Number(depotStock),
        billed_cash: billedCash,
        billed_bank: billedBank,
      };

      const res = await axios.post(`${API_BASE}/model-stocks`, JSON.stringify(payload), {
        headers: {'Content-Type': 'application/json'},
        maxBodyLength: Infinity,
      });
      
      console.log(res);

      const ok =
        res?.status >= 200 &&
        res?.status < 300 &&
        (res?.data?.success === true || res?.data);

      if (!ok) throw new Error('Unexpected response from server.');

      Alert.alert('Success', 'Stock details have been saved.', [
        {
          text: 'OK',
          onPress: () => {
            setLocationStock('');
            setInTransit('');
            setDelivered('');
            setBilled('');
            setDepotStock('');
            setBilledCash('');
            setBilledBank('');
          },
        },
      ]);
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        'Failed to save stock details.';
      Alert.alert('Error', msg);
    } finally {
      setSubmitting(false);
    }
  }, [valid, modelId, locationId, locationStock, inTransit, delivered, billed, depotStock, billedCash, billedBank]);

  // ===== Renderers for dropdown modals =====
  const renderModelItem = ({item}) => (
    <TouchableOpacity
      style={styles.modelItem}
      onPress={() => {
        setModelId(item.id);
        setModelName(item.name);
        setShowModelDropdown(false);
      }}>
      <Text style={styles.modelItemText}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderLocationItem = ({item}) => (
    <TouchableOpacity
      style={styles.modelItem}
      onPress={() => {
        setLocationId(item.id);
        setLocationName(item.name);
        setShowLocationDropdown(false);
      }}>
      <Text style={styles.modelItemText}>{item.name}</Text>
    </TouchableOpacity>
  );

  // ===== Loading / Error States (styled like the app) =====
  if (loadingInit) {
    return (
      <View style={[styles.centerWrap, {paddingTop: insets.top, paddingBottom: insets.bottom}]}>
        <LinearGradient colors={['#7E5EA9', '#20AEBC']} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={styles.header}>
           <View style={styles.headerContent}>
              {/* Left Side: Menu Icon */}
              <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Hamburger')}>
                <Icon name="reorder" size={25} color="#fff" />
              </TouchableOpacity>
    
              {/* Center: Dashboard Text */}
              <View>
                <Text style={styles.companyName}>Makroo Motor Corp.</Text>
                <Text style={styles.companyName1}>Add Model Stocks</Text>
              </View>
    
              {/* Right Side: Icon */}
              <TouchableOpacity style={styles.iconButton}>
                <Icon name="notifications-on" size={25} color="#fff" />
              </TouchableOpacity>
            </View>
        </LinearGradient>
        <View style={styles.centerInner}>
          <ActivityIndicator />
          <Text style={styles.loadingText}>Loading data…</Text>
        </View>
      </View>
    );
  }

  if (loadError) {
    return (
      <View style={[styles.centerWrap, {paddingTop: insets.top, paddingBottom: insets.bottom}]}>
        <LinearGradient colors={['#7E5EA9', '#20AEBC']} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={styles.header}>
          <View style={styles.headerContent}>
            {/* Left Side: Menu Icon */}
            <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Hamburger')}>
              <Icon name="reorder" size={25} color="#fff" />
            </TouchableOpacity>
  
            {/* Center: Dashboard Text */}
            <View>
              <Text style={styles.companyName}>Makroo Motor Corp.</Text>
              <Text style={styles.companyName1}>Add Model Stocks</Text>
            </View>
  
            {/* Right Side: Icon */}
            <TouchableOpacity style={styles.iconButton}>
              <Icon name="notifications-on" size={25} color="#fff" />
            </TouchableOpacity>
          </View>
        </LinearGradient>
        <View style={styles.centerInner}>
          <Text style={styles.errorText}>{loadError}</Text>
          <TouchableOpacity
            style={[styles.submitButton, {marginTop: 14}]}
            onPress={() => {
              // simplest: reload by toggling state via a mini remount pattern
              setLoadingInit(true);
              setLoadError(null);
              // Let useEffect run again naturally through state updates above
            }}>
            <Text style={styles.submitButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={{flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom}}>
      {/* Header with Gradient */}
      <LinearGradient
        colors={['#7E5EA9', '#20AEBC']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        style={styles.header}>
           <View style={styles.headerContent}>
              {/* Left Side: Menu Icon */}
              <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Hamburger')}>
                <Icon name="reorder" size={25} color="#fff" />
              </TouchableOpacity>
    
              {/* Center: Dashboard Text */}
              <View>
                <Text style={styles.companyName}>Makroo Motor Corp.</Text>
                <Text style={styles.companyName1}>Add Model Stocks</Text>
              </View>
    
              {/* Right Side: Icon */}
              <TouchableOpacity style={styles.iconButton}>
                <Icon name="notifications-on" size={25} color="#fff" />
              </TouchableOpacity>
            </View>
      </LinearGradient>

      <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
        {/* Form container */}
        <View style={styles.formContainer}>
          {/* Row 1: Model, Location */}
          <View className="row" style={styles.row}>
            {/* Model */}
            <View style={styles.inputContainer}>
              <LinearGradient colors={['#7E5EA9', '#20AEBC']} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={styles.inputGradient}>
                <TouchableOpacity style={styles.input} onPress={() => setShowModelDropdown(true)}>
                  <Text style={modelId ? styles.selectedModelText : styles.placeholderText}>
                    {modelName || 'Select Model'}
                  </Text>
                  <Icon name="keyboard-arrow-down" size={25} color="#666" style={styles.dropdownIcon} />
                </TouchableOpacity>
              </LinearGradient>
            </View>

            {/* Location */}
            <View style={styles.inputContainer}>
              <LinearGradient colors={['#7E5EA9', '#20AEBC']} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={styles.inputGradient}>
                <TouchableOpacity style={styles.input} onPress={() => setShowLocationDropdown(true)}>
                  <Text style={locationId ? styles.selectedModelText : styles.placeholderText}>
                    {locationName || 'Select Location'}
                  </Text>
                  <Icon name="keyboard-arrow-down" size={25} color="#666" style={styles.dropdownIcon} />
                </TouchableOpacity>
              </LinearGradient>
            </View>
          </View>

          {/* Row 2: Location Stock, In Transit */}
          <View style={styles.row}>
            <View style={styles.inputContainer}>
              <LinearGradient colors={['#7E5EA9', '#20AEBC']} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={styles.inputGradient}>
                <TextInput
                  style={styles.input}
                  value={locationStock}
                  onChangeText={t => setLocationStock(numberify(t))}
                  placeholder="Location Stock"
                  placeholderTextColor="#666"
                  keyboardType="number-pad"
                />
              </LinearGradient>
            </View>
            <View style={styles.inputContainer}>
              <LinearGradient colors={['#7E5EA9', '#20AEBC']} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={styles.inputGradient}>
                <TextInput
                  style={styles.input}
                  value={inTransit}
                  onChangeText={t => setInTransit(numberify(t))}
                  placeholder="In Transit"
                  placeholderTextColor="#666"
                  keyboardType="number-pad"
                />
              </LinearGradient>
            </View>
          </View>

          {/* Row 3: Delivered, Billed */}
          <View style={styles.row}>
            <View style={styles.inputContainer}>
              <LinearGradient colors={['#7E5EA9', '#20AEBC']} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={styles.inputGradient}>
                <TextInput
                  style={styles.input}
                  value={delivered}
                  onChangeText={t => setDelivered(numberify(t))}
                  placeholder="Delivered"
                  placeholderTextColor="#666"
                  keyboardType="number-pad"
                />
              </LinearGradient>
            </View>
            <View style={styles.inputContainer}>
              <LinearGradient colors={['#7E5EA9', '#20AEBC']} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={styles.inputGradient}>
                <TextInput
                  style={styles.input}
                  value={billed}
                  onChangeText={t => setBilled(numberify(t))}
                  placeholder="Billed"
                  placeholderTextColor="#666"
                  keyboardType="number-pad"
                />
              </LinearGradient>
            </View>
          </View>

          {/* Row 4: Billed Cash, Billed Bank */}
          <View style={styles.row}>
            <View style={styles.inputContainer}>
              <LinearGradient colors={['#7E5EA9', '#20AEBC']} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={styles.inputGradient}>
                <TextInput
                  style={styles.input}
                  value={billedCash}
                  onChangeText={t => setBilledCash(alphanumeric(t))}
                  placeholder="Billed Cash"
                  placeholderTextColor="#666"
                  keyboardType="default"
                  autoCapitalize="characters"
                />
              </LinearGradient>
            </View>
            <View style={styles.inputContainer}>
              <LinearGradient colors={['#7E5EA9', '#20AEBC']} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={styles.inputGradient}>
                <TextInput
                  style={styles.input}
                  value={billedBank}
                  onChangeText={t => setBilledBank(alphanumeric(t))}
                  placeholder="Billed Bank"
                  placeholderTextColor="#666"
                  keyboardType="default"
                  autoCapitalize="characters"
                />
              </LinearGradient>
            </View>
          </View>

          {/* Row 5: Depot Stock (single) */}
          <View style={styles.row}>
            <View style={styles.inputContainer}>
              <LinearGradient colors={['#7E5EA9', '#20AEBC']} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={styles.inputGradient}>
                <TextInput
                  style={styles.input}
                  value={depotStock}
                  onChangeText={t => setDepotStock(numberify(t))}
                  placeholder="Depot Stock"
                  placeholderTextColor="#666"
                  keyboardType="number-pad"
                />
              </LinearGradient>
            </View>
            <View style={[styles.inputContainer, {opacity: 0}]}>
              {/* Spacer to keep grid feel like AddModel two-columns */}
              <LinearGradient colors={['transparent', 'transparent']} style={[styles.inputGradient, {backgroundColor: 'transparent'}]}>
                <View style={[styles.input, {backgroundColor: 'transparent'}]} />
              </LinearGradient>
            </View>
          </View>
        </View>

        {/* Submit */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.submitButton, (!valid || submitting) && {opacity: 0.7}]}
            onPress={handleSubmit}
            disabled={!valid || submitting}>
            {submitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitButtonText}>Save</Text>}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Model Dropdown Modal */}
      <Modal
        visible={showModelDropdown}
        transparent
        animationType="slide"
        onRequestClose={() => setShowModelDropdown(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Model</Text>
              <TouchableOpacity onPress={() => setShowModelDropdown(false)} style={styles.closeButton}>
                <Icon name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={models}
              renderItem={renderModelItem}
              keyExtractor={(item, index) => item.id || String(index)}
              style={styles.modelList}
              showsVerticalScrollIndicator
            />
          </View>
        </View>
      </Modal>

      {/* Location Dropdown Modal */}
      <Modal
        visible={showLocationDropdown}
        transparent
        animationType="slide"
        onRequestClose={() => setShowLocationDropdown(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Location</Text>
              <TouchableOpacity onPress={() => setShowLocationDropdown(false)} style={styles.closeButton}>
                <Icon name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={locations}
              renderItem={renderLocationItem}
              keyExtractor={(item, index) => item.id || String(index)}
              style={styles.modelList}
              showsVerticalScrollIndicator
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {paddingHorizontal: 15},
  header: {paddingHorizontal:15, paddingVertical: 10},
  companyName: {fontSize: 18, fontWeight: '500', color: 'white', textAlign: 'center',fontFamily: 'Inter_28pt-SemiBold'},
  companyName1: {fontSize: 14,  color: 'white', textAlign: 'center',fontFamily: 'Inter_28pt-SemiBold'},

  formContainer: {marginBottom: 15, marginTop: 40},
  row: {marginBottom: 0,},
  inputContainer: {flex: 1, marginHorizontal: 4, marginBottom: 10},
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
  },
  selectedModelText: {fontSize: 14, fontFamily: 'Inter_28pt-Regular', color: '#000'},
  placeholderText: {fontSize: 14, fontFamily: 'Inter_28pt-Regular', color: '#666'},
  dropdownIcon: {marginLeft: 8},

  // Modal styles — mirroring your AddModel
  modalOverlay: {flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center'},
  modalContent: {backgroundColor: 'white', borderRadius: 10, width: '90%', maxHeight: '70%', overflow: 'hidden'},
  modalHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 15, borderBottomWidth: 1, borderBottomColor: '#e0e0e0',
  },
  modalTitle: {fontSize: 16, fontWeight: 'bold', fontFamily: 'Inter_28pt-SemiBold'},
  closeButton: {padding: 4},
  modelList: {maxHeight: 300},
  modelItem: {padding: 15, borderBottomWidth: 1, borderBottomColor: '#f0f0f0'},
  modelItemText: {fontSize: 14, fontFamily: 'Inter_28pt-Regular', color: '#333'},

  // Button section (match AddModel)
  buttonContainer: {marginTop: 20, marginBottom: 30},
  submitButton: {flex: 1, backgroundColor: '#7E5EA9', padding: 15, borderRadius: 10, alignItems: 'center', marginBottom: 10},
  submitButtonText: {color: '#fff', fontFamily: 'Inter_28pt-SemiBold', fontSize: 14},

  // Loading/Error wrappers in same vibe
  centerWrap: {flex: 1},
  centerInner: {flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24},
  loadingText: {marginTop: 10, color: '#00000099', fontFamily: 'Inter_28pt-Regular'},
  errorText: {textAlign: 'center', color: '#000', fontFamily: 'Inter_28pt-Regular'},
  headerContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
});

export default AddModelStocks;