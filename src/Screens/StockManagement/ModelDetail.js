import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { launchImageLibrary } from 'react-native-image-picker';

const ModelDetail = ({ route }) => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const model = route?.params?.model ?? {};

  // Local editable state initialized from route params
  const [modelName, setModelName] = useState(model.model_name ?? model.model ?? '');
  const [tractorModel, setTractorModel] = useState(model.tractor_model ?? '');
  const [engineType, setEngineType] = useState(model.engine_type ?? model.engineType ?? '');
  const [horsepower, setHorsepower] = useState(model.horsepower ?? '');
  const [dimensions, setDimensions] = useState(model.dimensions ?? '');
  const [color, setColor] = useState(model.color ?? '');
  const [year, setYear] = useState(model.year ?? '');
  const [imageUri, setImageUri] = useState(
    model.model_picture && model.model_picture.startsWith('http')
      ? model.model_picture
      : model.model_picture ? `https://argosmob.uk/makroo/public/${model.model_picture}` : null
  );
  const [localImage, setLocalImage] = useState(null); // object from image-picker
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Change BASE_URL if your server uses a different base path for relative images
  const BASE_URL = 'https://argosmob.uk/makroo/public/';

  const pickImage = async () => {
    try {
      const options = {
        mediaType: 'photo',
        quality: 0.8,
      };
      const result = await launchImageLibrary(options);

      if (result.didCancel) return;
      if (result.errorCode) {
        Alert.alert('Image error', result.errorMessage || 'Unknown error selecting image');
        return;
      }

      // Newer versions return assets array
      const asset = result.assets && result.assets[0];
      if (!asset) {
        Alert.alert('Image error', 'No image selected');
        return;
      }

      // asset: { uri, fileName, type, ... }
      setLocalImage(asset);
      setImageUri(asset.uri);
    } catch (err) {
      console.warn('pickImage err', err);
      Alert.alert('Image picker error', err.message || String(err));
    }
  };

  // Build and send multipart/form-data
  const handleUpdate = async () => {
    if (!model.id) {
      Alert.alert('Missing model id', 'Cannot update: model id is missing.');
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();

      // append text fields
      formData.append('user_id', model.user_id ? String(model.user_id) : ''); // keep existing user_id if available
      formData.append('model_name', modelName);
      formData.append('tractor_model', tractorModel);
      formData.append('engine_type', engineType);
      formData.append('horsepower', horsepower);
      formData.append('dimensions', dimensions);
      formData.append('color', color);
      formData.append('year', year);

      // Append image only if user selected a new local image
      if (localImage) {
        // On Android the uri may start with content://; on iOS with file://
        // name/type may be provided by the picker, otherwise fallback
        const fileName = localImage.fileName ?? `photo_${Date.now()}.jpg`;
        const fileType = localImage.type ?? 'image/jpeg';
        // For React Native axios / fetch, append a blob-like object:
        formData.append('model_picture', {
          uri: Platform.OS === 'android' && localImage.uri && !localImage.uri.startsWith('file://')
            ? localImage.uri
            : localImage.uri,
          name: fileName,
          type: fileType,
        });
      }

      // Build URL - using pattern you supplied. If your API expects PUT or PATCH, change method below.
      const url = `https://argosmob.uk/makroo/public/api/v1/model/tractor-models/${model.id}`;

      // Axios config
      const config = {
        method: 'post', // using POST like your example; change to 'put' if required by your backend
        url,
        headers: {
          // Let axios set the correct multipart header including boundary
          'Accept': 'application/json',
          // If you need authorization, add it here:
          // 'Authorization': 'Bearer <TOKEN>',
          'Content-Type': 'multipart/form-data',
        },
        maxBodyLength: Infinity,
        data: formData,
      };

      const response = await axios(config);

      setUploading(false);

      // handle response
      if (response && response.data) {
        Alert.alert('Success', 'Model updated successfully.');
        // Optionally pass updated model back to previous screen
        navigation.goBack();
      } else {
        Alert.alert('Unexpected response', 'Server returned an unexpected response.');
      }
    } catch (error) {
      console.warn('upload error', error?.response ?? error);
      setUploading(false);
      // If axios error with server response, try to show server message
      const serverMessage = error?.response?.data?.message || error?.message || 'Update failed';
      Alert.alert('Update failed', serverMessage);
    }
  };

  const handleDelete = async () => {
    if (!model.id) {
      Alert.alert('Missing model id', 'Cannot delete: model id is missing.');
      return;
    }

    // Confirmation alert before deletion
    Alert.alert(
      'Delete Model',
      'Are you sure you want to delete this model? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setDeleting(true);

            try {
              const url = `https://argosmob.uk/makroo/public/api/v1/model/tractor-models/${model.id}`;

              const config = {
                method: 'delete',
                maxBodyLength: Infinity,
                url: url,
                headers: {}
              };

              const response = await axios(config);

              setDeleting(false);

              if (response && response.data) {
                Alert.alert('Success', 'Model deleted successfully.');
                navigation.goBack();
              } else {
                Alert.alert('Unexpected response', 'Server returned an unexpected response.');
              }
            } catch (error) {
              console.warn('delete error', error?.response ?? error);
              setDeleting(false);
              const serverMessage = error?.response?.data?.message || error?.message || 'Delete failed';
              Alert.alert('Delete failed', serverMessage);
            }
          },
        },
      ]
    );
  };

  const DetailInput = ({ label, value, onChangeText, editable = true }) => (
    <View style={styles.detailInputContainer}>
      <Text style={styles.detailLabel}>{label}</Text>
      <TextInput
        style={[styles.detailInput, !editable && { backgroundColor: '#f8f8f8' }]}
        value={value}
        onChangeText={onChangeText}
        editable={editable}
        placeholder="—"
        placeholderTextColor="#666"
        
      />
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <LinearGradient
        colors={['#7E5EA9', '#20AEBC']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={25} color="#fff" />
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Text style={styles.headerText}>Makroo Motor Corp.</Text>
            <Text style={styles.headerText1}>Model Details</Text>
          </View>

          <TouchableOpacity style={styles.iconButton}>
            <Icon name="notifications-on" size={25} color="#fff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.imageContainer}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.modelImage} />
          ) : (
            <View style={[styles.modelImage, { alignItems: 'center', justifyContent: 'center' }]}>
              <Text>No image</Text>
            </View>
          )}

          <TouchableOpacity style={styles.pickButton} onPress={pickImage}>
            <Text style={styles.pickButtonText}>Pick Image</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.detailsCard}>
          <DetailInput label="Model Name" value={modelName} onChangeText={setModelName} />
          <DetailInput label="Tractor Model" value={tractorModel} onChangeText={setTractorModel} />
          <DetailInput label="Engine Type" value={engineType} onChangeText={setEngineType} />
          <DetailInput label="Horsepower" value={horsepower} onChangeText={setHorsepower} />
          <DetailInput label="Dimensions" value={dimensions} onChangeText={setDimensions} />
          <DetailInput label="Color" value={color} onChangeText={setColor} />
          <DetailInput label="Year" value={year} onChangeText={setYear} />
        </View>

        {/* Update button */}
        <View style={{ marginTop: 20, marginBottom: 15 }}>
          <TouchableOpacity style={styles.updateButton} onPress={handleUpdate} disabled={uploading}>
            {uploading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.updateButtonText}>Update Model</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Delete button */}
        <View style={{ marginBottom: 40 }}>
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete} disabled={deleting}>
            {deleting ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.deleteButtonText}>Delete Model</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { paddingVertical: 10, paddingHorizontal: 15 },
  headerContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerCenter: { alignItems: 'center' },
  headerText: { fontSize: 18.5, color: '#fff',fontFamily: 'Inter_28pt-SemiBold' },
  headerText1: { fontSize: 14.5, color: '#fff', marginTop: -4,fontFamily: 'Inter_28pt-SemiBold' },
  iconButton: { padding: 6 },
  scrollContent: { paddingHorizontal: 20, paddingVertical: 20 },
  imageContainer: { alignItems: 'center', marginBottom: 15 },
  modelImage: { width: 220, height: 220, resizeMode: 'cover', borderRadius: 8, backgroundColor: '#eee' },
  pickButton: { marginTop: 10, backgroundColor: '#efefef', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8 },
  pickButtonText: { color: '#333' },
  detailsCard: { backgroundColor: '#fff', borderRadius: 13, padding: 20, marginTop: 10 },
  detailInputContainer: { marginBottom: 12 },
  detailLabel: { fontSize: 14, color: 'grey', marginBottom: 6 },
  detailInput: { fontSize: 14, color: 'black', borderBottomWidth: 1, borderBottomColor: '#7E5EA9', paddingVertical: 6 },
  updateButton: { backgroundColor: '#20AEBC', paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  updateButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  deleteButton: { backgroundColor: '#FF3B30', paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  deleteButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});

export default ModelDetail;
