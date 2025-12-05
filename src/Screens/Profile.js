// ProfileScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Alert,
  ActivityIndicator,
  ScrollView,
  Modal,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [userData, setUserData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    user_id: '',
  });
  const [editData, setEditData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      const userDataString = await AsyncStorage.getItem('userData');

      if (userDataString) {
        const parsedUserData = JSON.parse(userDataString);

        setUserData({
          first_name: parsedUserData.first_name || '',
          last_name: parsedUserData.last_name || '',
          email: parsedUserData.email || '',
          phone: parsedUserData.phone || '',
          user_id: parsedUserData.id ? parsedUserData.id.toString() : (parsedUserData.user_id ? parsedUserData.user_id.toString() : ''),
        });

        setEditData({
          first_name: parsedUserData.first_name || '',
          last_name: parsedUserData.last_name || '',
          email: parsedUserData.email || '',
          phone: parsedUserData.phone || '',
        });

        console.log('User data loaded from AsyncStorage:', parsedUserData);
      } else {
        Alert.alert('Error', 'No user data found. Please login again.');
        navigation.goBack();
      }
    } catch (error) {
      console.log('Error loading user data:', error);
      Alert.alert('Error', 'Failed to load user data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    // Validation
    if (!editData.first_name.trim() || !editData.last_name.trim() ||
        !editData.email.trim() || !editData.phone.trim()) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(editData.email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    // Phone validation (basic)
    if (editData.phone.replace(/\D/g, '').length < 10) {
      Alert.alert('Error', 'Please enter a valid phone number');
      return;
    }

    setUpdateLoading(true);

    try {
      // Get user ID and current stored data
      const storedUserId = await AsyncStorage.getItem('userId');
      const currentUserDataString = await AsyncStorage.getItem('userData');
      const currentUserData = currentUserDataString ? JSON.parse(currentUserDataString) : null;

      // Prepare FormData for API
      const formData = new FormData();
      formData.append('first_name', editData.first_name.trim());
      formData.append('last_name', editData.last_name.trim());
      formData.append('email', editData.email.trim());
      formData.append('phone', editData.phone.trim());
      formData.append('user_id', storedUserId || (currentUserData?.id?.toString ? currentUserData.id.toString() : currentUserData?.user_id || ''));

      const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://makroomotors.com/makroo-panel/public/api/v1/auth/update-profile',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: formData,
        timeout: 10000,
      };

      const response = await axios(config);
      console.log('Update profile response:', response?.data);

      // Determine success robustly
      const successFlag = 
        response?.data?.success === true ||
        response?.data?.status === 'success' ||
        (typeof response?.data?.success === 'string' && response.data.success.toLowerCase() === 'true') ||
        (response?.status === 200 || response?.status === 201);

      if (successFlag) {
        // Prefer server-provided user object if available
        // Common keys used by many APIs: data, user, user_data
        const serverUser =
          response?.data?.data ||
          response?.data?.user ||
          response?.data?.user_data ||
          null;

        // Build the updated object to save to AsyncStorage
        // Priority: serverUser fields > edited fields > existing local fields
        const updatedStorageData = {
          ...(currentUserData || {}),
          ...(serverUser || {}),
          first_name: editData.first_name.trim(),
          last_name: editData.last_name.trim(),
          email: editData.email.trim(),
          phone: editData.phone.trim(),
        };

        // If serverUser contains an 'id', ensure we keep it also in userId key
        const newUserId = serverUser?.id?.toString?.() || updatedStorageData?.id?.toString?.() || storedUserId || updatedStorageData?.user_id?.toString?.();

        // Save updated data to AsyncStorage
        await AsyncStorage.setItem('userData', JSON.stringify(updatedStorageData));

        // Also ensure 'userId' key is set (many parts of app expect it)
        if (newUserId) {
          await AsyncStorage.setItem('userId', newUserId.toString());
        }

        // Update local state so UI reflects changes immediately
        setUserData({
          first_name: updatedStorageData.first_name || '',
          last_name: updatedStorageData.last_name || '',
          email: updatedStorageData.email || '',
          phone: updatedStorageData.phone || '',
          user_id: newUserId ? newUserId.toString() : (updatedStorageData.user_id ? updatedStorageData.user_id.toString() : ''),
        });

        // Close modal and show success
        Alert.alert('Success', response?.data?.message || 'Profile updated successfully');
        setModalVisible(false);
      } else {
        const message = response?.data?.message || response?.data?.error || 'Failed to update profile';
        Alert.alert('Error', message);
      }
    } catch (error) {
      console.log('Update error:', error);
      if (error.response) {
        const errorMessage = error.response.data?.message || error.response.data?.error || 'Update failed. Please try again.';
        Alert.alert('Update Failed', errorMessage);
      } else if (error.request) {
        Alert.alert('Network Error', 'Please check your internet connection and try again.');
      } else {
        Alert.alert('Error', 'Something went wrong. Please try again.');
      }
    } finally {
      setUpdateLoading(false);
    }
  };

  const openEditModal = () => {
    setEditData({
      first_name: userData.first_name,
      last_name: userData.last_name,
      email: userData.email,
      phone: userData.phone,
    });
    setModalVisible(true);
  };

  const closeEditModal = () => {
    setModalVisible(false);
  };

  // Utility functions (optional)
  const getUserId = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      return userId;
    } catch (error) {
      console.log('Error getting user ID:', error);
      return null;
    }
  };

  const getCompleteUserData = async () => {
    try {
      const userDataString = await AsyncStorage.getItem('userData');
      return userDataString ? JSON.parse(userDataString) : null;
    } catch (error) {
      console.log('Error getting user data:', error);
      return null;
    }
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        <StatusBar backgroundColor="white" barStyle="dark-content" />
        <ActivityIndicator size="large" color="#7E5EA9" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <StatusBar backgroundColor="white" barStyle="dark-content" />
      
      {/* Header */}
      <LinearGradient
        colors={['#7E5EA9', '#20AEBC']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.titleContainer}>
        <Text style={styles.title}>Makroo Motor Corp.</Text>
      </LinearGradient>

      <Text style={styles.subtitle}>Profile Information</Text>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>First Name</Text>
          <View style={styles.displayBox}>
            <Text style={styles.displayText}>{userData.first_name}</Text>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Last Name</Text>
          <View style={styles.displayBox}>
            <Text style={styles.displayText}>{userData.last_name}</Text>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <View style={styles.displayBox}>
            <Text style={styles.displayText}>{userData.email}</Text>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Phone Number</Text>
          <View style={styles.displayBox}>
            <Text style={styles.displayText}>{userData.phone}</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.updateButton} 
          onPress={openEditModal}
          disabled={updateLoading}
        >
          <LinearGradient
            colors={['#7E5EA9', '#20AEBC']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientButton}>
            <Text style={styles.updateButtonText}>Update Profile</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.secondaryButton} 
          onPress={() => navigation.goBack()}
          disabled={updateLoading}
        >
          <Text style={styles.secondaryButtonText}>Back to Dashboard</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Edit Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeEditModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <LinearGradient
              colors={['#7E5EA9', '#20AEBC']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Profile</Text>
            </LinearGradient>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>First Name</Text>
                <View style={styles.inputBox}>
                  <TextInput
                    placeholder="First Name"
                    placeholderTextColor="#aaa"
                    style={styles.inputText}
                    value={editData.first_name}
                    onChangeText={(text) => setEditData({...editData, first_name: text})}
                    editable={!updateLoading}
                  />
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Last Name</Text>
                <View style={styles.inputBox}>
                  <TextInput
                    placeholder="Last Name"
                    placeholderTextColor="#aaa"
                    style={styles.inputText}
                    value={editData.last_name}
                    onChangeText={(text) => setEditData({...editData, last_name: text})}
                    editable={!updateLoading}
                  />
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Email</Text>
                <View style={styles.inputBox}>
                  <TextInput
                    placeholder="Email"
                    placeholderTextColor="#aaa"
                    style={styles.inputText}
                    value={editData.email}
                    onChangeText={(text) => setEditData({...editData, email: text})}
                    editable={!updateLoading}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                  />
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Phone Number</Text>
                <View style={styles.inputBox}>
                  <TextInput
                    placeholder="Phone Number"
                    placeholderTextColor="#aaa"
                    style={styles.inputText}
                    value={editData.phone}
                    onChangeText={(text) => setEditData({...editData, phone: text})}
                    editable={!updateLoading}
                    keyboardType="phone-pad"
                    maxLength={15}
                  />
                </View>
              </View>

              <View style={styles.modalButtons}>
                <TouchableOpacity 
                  style={[styles.modalButton, styles.cancelButton]} 
                  onPress={closeEditModal}
                  disabled={updateLoading}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.modalButton, styles.saveButton]} 
                  onPress={handleUpdateProfile}
                  disabled={updateLoading}
                >
                  {updateLoading ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <LinearGradient
                      colors={['#7E5EA9', '#20AEBC']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.gradientButtonSmall}>
                      <Text style={styles.saveButtonText}>Save Changes</Text>
                    </LinearGradient>
                  )}
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {  
    padding: 25, 
    flex: 1,
    backgroundColor: 'white',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 25,
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    fontFamily: "Inter_28pt-Regular",
    color:"#7E5EA9"
  },
  titleContainer: {
    marginBottom: '5%',
    alignSelf: 'center',
    width: '120%',
    padding: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { 
    fontSize: 22, 
    color: '#fff', 
    textAlign: 'center',
    fontFamily: "Inter_28pt-SemiBold" 
  },
  subtitle: {
    fontSize: 20,
    marginBottom: 30,
    color: '#333',
    alignSelf: 'center',
    fontFamily: "Inter_28pt-Medium"
  },
  scrollContent: {
    flexGrow: 1,
  },
  inputContainer: { 
    marginBottom: 20 
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    fontFamily: "Inter_28pt-Medium"
  },
  displayBox: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
    justifyContent: 'center',
    paddingHorizontal: 15,
    backgroundColor: '#f9f9f9',
  },
  displayText: { 
    color: '#333', 
    fontSize: 16,
    fontFamily: "Inter_28pt-Regular" 
  },
  inputBox: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
    justifyContent: 'center',
    paddingHorizontal: 15,
    backgroundColor: 'white',
  },
  inputText: { 
    color: '#333', 
    fontSize: 16,
    fontFamily: "Inter_28pt-Regular" 
  },
  updateButton: {
    width: '100%',
    height: 50,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 15,
    marginTop: 10,
  },
  gradientButton: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  updateButtonText: { 
    color: '#fff', 
    fontSize: 16,
    fontFamily: "Inter_28pt-Medium"  
  },
  secondaryButton: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#7E5EA9',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  secondaryButtonText: { 
    color: '#7E5EA9', 
    fontSize: 16,
    fontFamily: "Inter_28pt-Medium"  
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 20,
    color: '#fff',
    fontFamily: "Inter_28pt-SemiBold"
  },
  modalBody: {
    padding: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 50,
  },
  modalButton: {
    flex: 1,
    height: 50,
    borderRadius: 8,
    overflow: 'hidden',
    marginHorizontal: 5,
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: '#7E5EA9',
    backgroundColor: 'transparent',
  },
  saveButton: {
    backgroundColor: 'transparent',
  },
  cancelButtonText: {
    color: '#7E5EA9',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 48,
    fontFamily: "Inter_28pt-Medium"
  },
  gradientButtonSmall: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: "Inter_28pt-Medium"
  },
});

export default ProfileScreen;
