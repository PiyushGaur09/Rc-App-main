


import React, {useState, useCallback} from 'react';
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

const ENGINE_TYPES = [
  'Single Cylinder',
  'Twin Cylinder',
  'Three Cylinder',
  'Four Cylinder',
  'Six Cylinder',
  'Inline Engine',
  'V-Type Engine',
  'Diesel Engine',
  'Petrol Engine',
  'CRDI Engine',
  'Turbocharged Engine',
  'Naturally Aspirated Engine',
  'Water-Cooled Engine',
  'Air-Cooled Engine',
];

const AddModel = ({navigation}) => {
  const insets = useSafeAreaInsets();

  const [showEngineDropdown, setShowEngineDropdown] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    ModelName: '',
    Year: '',
    EngineType: '',
    Dimension: '',
    Color: '',
    Horsepower: '',
    TractorModel: '', // optional → maps to tractor_model
  });

  // Image state
  const [modelPhoto, setModelPhoto] = useState(null);

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
          {text: 'Choose from Library', onPress: () => handleImageLibrary(setImageFunction)},
        ],
        {cancelable: true},
      );
    }
  };

  const handleCamera = setImageFunction => {
    launchCamera(
      {mediaType: 'photo', quality: 1, cameraType: 'back', saveToPhotos: true},
      response => {
        if (response?.didCancel) return;
        if (response?.assets && response.assets.length > 0) {
          setImageFunction(response.assets[0]);
        }
      },
    );
  };

  const handleImageLibrary = setImageFunction => {
    launchImageLibrary({mediaType: 'photo', quality: 1}, response => {
      if (response?.didCancel) return;
      if (response?.assets && response.assets.length > 0) {
        setImageFunction(response.assets[0]);
      }
    });
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({...prev, [field]: value}));
  };

  const handleEngineSelect = engineType => {
    handleInputChange('EngineType', engineType);
    setShowEngineDropdown(false);
  };

  const validate = () => {
    if (!formData.ModelName?.trim()) return 'Please enter Model Name.';
    if (!formData.Year?.trim()) return 'Please enter Year.';
    if (!/^\d{4}$/.test(formData.Year.trim()))
      return 'Year must be a 4-digit number (e.g., 2024).';
    if (!formData.EngineType?.trim()) return 'Please select Engine Type.';
    if (!formData.Horsepower?.trim()) return 'Please enter Horsepower.';
    if (!formData.Dimension?.trim()) return 'Please enter Dimension.';
    if (!formData.Color?.trim()) return 'Please enter Color.';
    return null;
  };

  const pingHost = async () => {
    try {
      const res = await fetch('https://makroomotors.com/', {method: 'GET'});
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

    if (!modelPhoto?.uri) {
      Alert.alert('Validation', 'Please add a model picture.');
      return;
    }

    setSubmitting(true);
    try {
      // 1) Quick connectivity / TLS sanity check
      const ping = await pingHost();
      if (!ping.ok) {
        console.log('Ping host failed:', ping);
        Alert.alert(
          'Network',
          `Cannot reach argosmob.uk (status: ${ping.status}). Check internet/ATS/TLS.`,
        );
        return;
      }

      // 2) Build multipart payload
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        Alert.alert('Error', 'No userId found in storage.');
        return;
      }

      const imagePart = {
        uri: modelPhoto.uri,
        name: modelPhoto.fileName || `model_${Date.now()}.jpg`,
        type: modelPhoto.type || 'image/jpeg',
      };

      const body = new FormData();
      body.append('user_id', String(userId));
      body.append('model_name', formData.ModelName.trim());
      body.append('engine_type', formData.EngineType.trim());
      body.append('horsepower', formData.Horsepower.trim());
      body.append('dimensions', formData.Dimension.trim());
      body.append('color', formData.Color.trim());
      body.append('year', formData.Year.trim());
      if (formData.TractorModel?.trim()) {
        body.append('tractor_model', formData.TractorModel.trim());
      }
      body.append('model_picture', imagePart);

      // 3) Try axios first
      try {
        const res = await axios.post(
          'https://makroomotors.com/makroo-panel/public/api/v1/model/tractor-models',
          body,
          {
            maxBodyLength: Infinity,
            headers: {Accept: 'application/json'},
            timeout: 30000,
          },
        );
        console.log('AXIOS success:', res.status, res.data);
        Alert.alert('Success', 'Model submitted successfully!');
        setFormData({
          ModelName: '',
          Year: '',
          EngineType: '',
          Dimension: '',
          Color: '',
          Horsepower: '',
          TractorModel: '',
        });
        setModelPhoto(null);
        return;
      } catch (err) {
        // Deep diagnostics
        console.log('AXIOS ERROR name:', err?.name);
        console.log('AXIOS ERROR message:', err?.message);
        console.log('AXIOS ERROR code:', err?.code);
        console.log('AXIOS ERROR config url:', err?.config?.url);
        console.log('AXIOS ERROR response:', err?.response?.status, err?.response?.data);
        // Fall through to fetch
      }

      // 4) Fallback to fetch
      try {
        const fetchRes = await fetch(
          'https://makroomotors.com/makroo-panel/public/api/v1/model/tractor-models',
          {
            method: 'POST',
            // Let fetch set multipart boundary automatically
            body,
          },
        );

        const text = await fetchRes.text();
        if (!fetchRes.ok) {
          console.log('FETCH ERROR status:', fetchRes.status);
          console.log('FETCH ERROR body:', text);
          Alert.alert('Error', `Upload failed (${fetchRes.status}). ${text?.slice(0, 300) || ''}`);
          return;
        }

        console.log('FETCH success body:', text);
        Alert.alert('Success', 'Model submitted successfully!');
        setFormData({
          ModelName: '',
          Year: '',
          EngineType: '',
          Dimension: '',
          Color: '',
          Horsepower: '',
          TractorModel: '',
        });
        setModelPhoto(null);
      } catch (fetchErr) {
        console.log('FETCH threw:', fetchErr);
        Alert.alert('Error', `Network/SSL error: ${String(fetchErr).slice(0, 300)}`);
      }
    } finally {
      setSubmitting(false);
    }
  }, [formData, modelPhoto]);

  // ===== UI bits =====
  const renderEngineItem = ({item}) => (
    <TouchableOpacity style={styles.modelItem} onPress={() => handleEngineSelect(item)}>
      <Text style={styles.modelItemText}>{item}</Text>
    </TouchableOpacity>
  );

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
                                               <Text style={styles.companyName1}>Add Model </Text>
                                             </View>
                                   
                                             {/* Right Side: Icon */}
                                             <TouchableOpacity style={styles.iconButton}>
                                               <Icon name="notifications-on" size={25} color="#fff" />
                                             </TouchableOpacity>
                                           </View>
      </LinearGradient>

      <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
        {/* Form Fields */}
        <View style={styles.formContainer}>
          <View style={styles.row}>
            <View style={styles.inputContainer}>
              <LinearGradient colors={['#7E5EA9', '#20AEBC']} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={styles.inputGradient}>
                <TextInput
                  style={styles.input}
                  value={formData.ModelName}
                  onChangeText={text => handleInputChange('ModelName', text)}
                  placeholder="Model Name"
                   placeholderTextColor="#666"

                  autoCapitalize="words"
                />
              </LinearGradient>
            </View>

            <View style={styles.inputContainer}>
              <LinearGradient colors={['#7E5EA9', '#20AEBC']} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={styles.inputGradient}>
                <TextInput
                  style={styles.input}
                  value={formData.Year}
                  onChangeText={text => handleInputChange('Year', text)}
                  placeholder="Year (e.g. 2024)"
                   placeholderTextColor="#666"

                  keyboardType="number-pad"
                  maxLength={4}
                />
              </LinearGradient>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.inputContainer}>
              <LinearGradient colors={['#7E5EA9', '#20AEBC']} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={styles.inputGradient}>
                <TouchableOpacity style={styles.input} onPress={() => setShowEngineDropdown(true)}>
                  <Text style={formData.EngineType ? styles.selectedModelText : styles.placeholderText}>
                    {formData.EngineType || 'Select Engine Type'}
                  </Text>
                  <Icon name="keyboard-arrow-down" size={25} color="#666" style={styles.dropdownIcon} />
                </TouchableOpacity>
              </LinearGradient>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.inputContainer}>
              <LinearGradient colors={['#7E5EA9', '#20AEBC']} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={styles.inputGradient}>
                <TextInput
                  style={styles.input}
                  value={formData.Horsepower}
                  onChangeText={text => handleInputChange('Horsepower', text)}
                  placeholder="Horsepower (e.g. 40 HP)"
                   placeholderTextColor="#666"

                />
              </LinearGradient>
            </View>

            <View style={styles.inputContainer}>
              <LinearGradient colors={['#7E5EA9', '#20AEBC']} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={styles.inputGradient}>
                <View style={styles.inputWithIcon}>
                  <TextInput
                    style={[styles.input, styles.inputWithIconField]}
                    value={formData.Dimension}
                    onChangeText={text => handleInputChange('Dimension', text)}
                    placeholder="Dimension (L×W×H)"
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
                    value={formData.Color}
                    onChangeText={text => handleInputChange('Color', text)}
                    placeholder="Color"
                   placeholderTextColor="#666"

                  />
                </View>
              </LinearGradient>
            </View>
            <View style={styles.inputContainer}>
              <LinearGradient colors={['#7E5EA9', '#20AEBC']} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={styles.inputGradient}>
                <TextInput
                  style={styles.input}
                  value={formData.TractorModel}
                  onChangeText={text => handleInputChange('TractorModel', text)}
                  placeholder="Tractor Model*"
                   placeholderTextColor="#666"

                />
              </LinearGradient>
            </View>
          </View>
        </View>

        {/* Engine Type Dropdown Modal */}
        <Modal
          visible={showEngineDropdown}
          transparent
          animationType="slide"
          onRequestClose={() => setShowEngineDropdown(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Engine Type</Text>
                <TouchableOpacity onPress={() => setShowEngineDropdown(false)} style={styles.closeButton}>
                  <Icon name="close" size={24} color="#000" />
                </TouchableOpacity>
              </View>
              <FlatList
                data={ENGINE_TYPES}
                renderItem={renderEngineItem}
                keyExtractor={(item, index) => index.toString()}
                style={styles.modelList}
                showsVerticalScrollIndicator
              />
            </View>
          </View>
        </Modal>

        {/* Photo Section */}
        <View style={styles.photoSignatureSection}>
          <TouchableOpacity
            style={styles.photoSignatureBox}
            onPress={() => showImagePickerOptions(setModelPhoto)}>
            {modelPhoto ? (
              <Image source={{uri: modelPhoto.uri}} style={styles.previewImage} resizeMode="cover" />
            ) : (
              <>
                <Icon name="photo-camera" size={35} color="#666" />
                <Text style={styles.photoSignatureText}>Model Picture</Text>
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
            {submitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitButtonText}>Submit</Text>}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {paddingHorizontal: 15},
  header: {paddingHorizontal:15, paddingVertical: 10},
  companyName: {fontSize: 18, fontWeight: '600', color: 'white', textAlign: 'center',fontFamily: 'Inter_28pt-SemiBold'},
  companyName1: {fontSize: 15, fontFamily: 'Inter_28pt-SemiBold', color: 'white', textAlign: 'center'},
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
  inputWithIcon: {flexDirection: 'row', alignItems: 'center'},
  inputWithIconField: {flex: 1},
  modalOverlay: {flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center'},
  modalContent: {backgroundColor: 'white', borderRadius: 10, width: '90%', maxHeight: '70%', overflow: 'hidden'},
  modalHeader: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderBottomColor: '#e0e0e0'},
  modalTitle: {fontSize: 16, fontWeight: 'bold', fontFamily: 'Inter_28pt-SemiBold'},
  closeButton: {padding: 4},
  modelList: {maxHeight: 300},
  modelItem: {padding: 15, borderBottomWidth: 1, borderBottomColor: '#f0f0f0'},
  modelItemText: {fontSize: 14, fontFamily: 'Inter_28pt-Regular', color: '#333'},
  photoSignatureSection: {},
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
  photoSignatureText: {fontSize: 13, textAlign: 'center', marginTop: 2, color: '#00000099', fontFamily: 'Inter_28pt-Medium'},
  previewImage: {width: '100%', height: '100%'},
  buttonContainer: {marginTop: 20, marginBottom: 30},
  submitButton: {flex: 1, backgroundColor: '#7E5EA9', padding: 15, borderRadius: 10, alignItems: 'center', marginBottom: 10},
  submitButtonText: {color: '#fff', fontFamily: 'Inter_28pt-SemiBold', fontSize: 14},
  headerContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
});

export default AddModel;
