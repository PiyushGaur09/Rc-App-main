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
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';

const Forgetpassword = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [formData, setFormData] = useState({
    email_phone: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({
    email_phone: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);

  // store user id loaded from AsyncStorage (key: 'userId')
  const [storedUserId, setStoredUserId] = useState('');

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      // Load stored userData (if any) to pre-fill email/phone
      const userDataString = await AsyncStorage.getItem('userData');
      if (userDataString) {
        const parsedUserData = JSON.parse(userDataString);
        setUserData(parsedUserData);

        // Pre-fill email/phone using server fields if available
        const userIdentifier = parsedUserData.email || parsedUserData.phone || '';
        if (userIdentifier) {
          setFormData(prev => ({ ...prev, email_phone: userIdentifier }));
        }
      }

      // Load userId using the canonical key 'userId'
      const id = await AsyncStorage.getItem('userId');
      if (id) setStoredUserId(id);
    } catch (error) {
      console.log('Error loading user data or id:', error);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      email_phone: '',
      password: '',
      confirmPassword: '',
    };

    if (!formData.email_phone.trim()) {
      newErrors.email_phone = 'Kindly fill the Email/Phone';
      isValid = false;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phoneRegex = /^[0-9]{10,15}$/;

      if (!emailRegex.test(formData.email_phone) && !phoneRegex.test(formData.email_phone)) {
        newErrors.email_phone = 'Please enter a valid email or phone number';
        isValid = false;
      }
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Kindly fill the New Password';
      isValid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
      isValid = false;
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Kindly confirm your password';
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleResetPassword = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      // Ensure we have the userId; if not present, try to read again
      let userIdToSend = storedUserId;
      if (!userIdToSend) {
        try {
          const freshId = await AsyncStorage.getItem('userId');
          userIdToSend = freshId || '';
        } catch (e) {
          console.log('Error retrieving userId at submit time:', e);
        }
      }

      // Create FormData and append user_id (if available)
      const data = new FormData();
      data.append('email_phone', formData.email_phone.trim());
      data.append('password', formData.password.trim());
      if (userIdToSend) {
        // append using the server-expected key
        data.append('user_id', userIdToSend);
      }

      const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://argosmob.uk/makroo/public/api/v1/auth/change-password',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data,
        timeout: 10000,
      };

      const response = await axios(config);
      console.log('Password Change Response:', response.data);

      const success =
        response?.data?.success === true ||
        response?.data?.status === 'success' ||
        (typeof response?.data?.message === 'string' && response.data.message.toLowerCase().includes('success')) ||
        response?.status === 200;

      if (success) {
        // Do NOT store the password anywhere on client side
        setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));

        // If server returns updated user data, sanitize and merge it into AsyncStorage
        const serverUser = response?.data?.data || response?.data?.user || null;
        if (serverUser) {
          const sanitized = { ...serverUser };
          if ('password' in sanitized) delete sanitized.password;
          if ('pwd' in sanitized) delete sanitized.pwd;

          try {
            const existing = await AsyncStorage.getItem('userData');
            const merged = existing ? { ...JSON.parse(existing), ...sanitized } : sanitized;
            await AsyncStorage.setItem('userData', JSON.stringify(merged));
            setUserData(merged);
          } catch (e) {
            console.log('Error updating stored userData:', e);
          }
        }

        Alert.alert('Success', 'Password changed successfully!', [
          { text: 'OK', onPress: () => navigation.navigate('LoginScreen') },
        ]);
      } else {
        const errorMessage = response?.data?.message || response?.data?.error || 'Unable to change password. Please try again.';
        Alert.alert('Password Change Failed', errorMessage);
      }
    } catch (error) {
      console.log('Password Change Error:', error);

      if (error.response) {
        const errorMessage = error.response.data?.message || error.response.data?.error || `Password change failed (${error.response.status}). Please try again.`;
        Alert.alert('Password Change Failed', errorMessage);
      } else if (error.request) {
        Alert.alert('Network Error', 'Please check your internet connection and try again.');
      } else {
        Alert.alert('Error', 'Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const clearPrefilledData = () => {
    setFormData(prev => ({ ...prev, email_phone: '' }));
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <StatusBar backgroundColor="white" barStyle="dark-content" />

      <LinearGradient
        colors={['#7E5EA9', '#20AEBC']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.titleContainer}>
        {/* Back Icon */}
        <TouchableOpacity
          onPress={() => navigation.replace("LoginScreen")}
          style={styles.backButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Icon name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.title}>Makroo Motor Corp.</Text>
      </LinearGradient>

      <Text style={styles.subtitle}>Reset Password</Text>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {userData && formData.email_phone ? (
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>
              Using your account email/phone.{' '}
              <Text style={styles.clearText} onPress={clearPrefilledData}>
                Clear
              </Text>
            </Text>
          </View>
        ) : null}

        <View style={styles.inputContainer}>
          <View style={[styles.inputBox, errors.email_phone ? styles.inputError : null]}>
            <TextInput
              placeholder="Email or Phone Number"
              placeholderTextColor="#aaa"
              style={styles.inputText}
              value={formData.email_phone}
              onChangeText={(text) => handleInputChange('email_phone', text)}
              editable={!loading}
              autoCapitalize="none"
              keyboardType="default"
              autoComplete="email"
            />
          </View>
          {errors.email_phone ? <Text style={styles.errorText}>{errors.email_phone}</Text> : null}
        </View>

        <View style={styles.inputContainer}>
          <View style={[styles.inputBox, errors.password ? styles.inputError : null]}>
            <TextInput
              placeholder="New Password"
              placeholderTextColor="#aaa"
              style={styles.inputText}
              secureTextEntry
              value={formData.password}
              onChangeText={(text) => handleInputChange('password', text)}
              editable={!loading}
              autoCapitalize="none"
            />
          </View>
          {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
        </View>

        <View style={styles.inputContainer}>
          <View style={[styles.inputBox, errors.confirmPassword ? styles.inputError : null]}>
            <TextInput
              placeholder="Confirm New Password"
              placeholderTextColor="#aaa"
              style={styles.inputText}
              secureTextEntry
              value={formData.confirmPassword}
              onChangeText={(text) => handleInputChange('confirmPassword', text)}
              editable={!loading}
              autoCapitalize="none"
            />
          </View>
          {errors.confirmPassword ? <Text style={styles.errorText}>{errors.confirmPassword}</Text> : null}
        </View>

        <View style={styles.requirementsContainer}>
          <Text style={styles.requirementsTitle}>Password Requirements:</Text>
          <Text style={styles.requirementItem}>• At least 8 characters long</Text>
          <Text style={styles.requirementItem}>• Use a combination of letters and numbers</Text>
          <Text style={styles.requirementItem}>• Avoid common words</Text>
        </View>

        <TouchableOpacity
          style={[styles.resetButton, loading && styles.disabledButton]}
          onPress={handleResetPassword}
          disabled={loading}
        >
          <LinearGradient
            colors={['#7E5EA9', '#20AEBC']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientButton}>
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.resetButtonText}>Reset Password</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Remember your password? </Text>
          <TouchableOpacity
            onPress={() => navigation.replace('LoginScreen')}
            disabled={loading}
          >
            <Text style={[styles.loginLink, loading && styles.disabledText]}>
              Login
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 25,
    flex: 1,
    backgroundColor: 'white',
  },
  scrollView: {
    flex: 1,
  },
  titleContainer: {
    marginBottom: '5%',
    alignSelf: 'center',
    width: '120%',
    padding: 25,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 16,
    // place slightly lower on Android to visually center with title
    top: Platform.OS === 'android' ? 18 : 20,
    zIndex: 10,
  },
  title: {
    fontSize: 22,
    color: '#fff',
    textAlign: 'center',
    fontFamily: "Inter_28pt-SemiBold"
  },
  subtitle: {
    fontSize: 20,
    marginBottom: 15,
    color: '#333',
    alignSelf: 'center',
    fontFamily: "Inter_28pt-Medium"
  },
  infoContainer: {
    backgroundColor: '#e8f4fd',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#20AEBC',
  },
  infoText: {
    color: '#333',
    fontSize: 14,
    fontFamily: "Inter_28pt-Regular"
  },
  clearText: {
    color: '#7E5EA9',
    fontWeight: 'bold',
    fontFamily: "Inter_28pt-SemiBold"
  },
  inputContainer: {
    marginBottom: 5
  },
  inputBox: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
    justifyContent: 'center',
    paddingHorizontal: 15,
    marginBottom: 5,
    backgroundColor: 'white',
  },
  inputError: {
    borderColor: '#ff0000',
    borderWidth: 1.5
  },
  inputText: {
    color: '#333',
    fontSize: 16,
    fontFamily: "Inter_28pt-Regular"
  },
  errorText: {
    color: '#ff0000',
    fontSize: 12,
    marginLeft: 5,
    marginBottom: 10,
    fontFamily: "Inter_28pt-Regular"
  },
  requirementsContainer: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  requirementsTitle: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
    fontFamily: "Inter_28pt-SemiBold"
  },
  requirementItem: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
    fontFamily: "Inter_28pt-Regular"
  },
  resetButton: {
    width: '100%',
    height: 50,
    borderRadius: 8,
    overflow: 'hidden',
    marginTop: 10,
    marginBottom: 10,
  },
  gradientButton: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: "Inter_28pt-Medium"
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 50
  },
  loginText: {
    color: '#666',
    fontSize: 15,
    fontFamily: "Inter_28pt-Medium"
  },
  loginLink: {
    color: '#7E5EA9',
    fontSize: 15,
    fontFamily: "Inter_28pt-SemiBold"
  },
  disabledButton: {
    opacity: 0.6,
  },
  disabledText: {
    opacity: 0.6,
  },
});

export default Forgetpassword;
