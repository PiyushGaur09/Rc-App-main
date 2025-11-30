import React, { useState } from 'react';
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
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import axios from 'axios';
import Ionicons from 'react-native-vector-icons/Ionicons'; // <-- back arrow icon

const Signup = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
  });
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
    };

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Kindly fill the First Name';
      isValid = false;
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Kindly fill the Last Name';
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Kindly fill the Email';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Kindly fill the Phone Number';
      isValid = false;
    } else if (!/^\d{10}$/.test(formData.phone.trim())) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
      isValid = false;
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Kindly fill the Password';
      isValid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSignup = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      const data = new FormData();
      data.append('first_name', formData.firstName.trim());
      data.append('last_name', formData.lastName.trim());
      data.append('email', formData.email.trim());
      data.append('phone', formData.phone.trim());
      data.append('password', formData.password.trim());

      const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://argosmob.uk/makroo/public/api/v1/auth/register',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: data,
      };

      const response = await axios(config);
      console.log('Signup Response:', response.data);
      
      if (
        response.data.success === true || 
        response.data.status === 'success' || 
        response.data.message?.toLowerCase().includes('success') ||
        response.status === 200 || 
        response.status === 201
      ) {
        Alert.alert(
          'Success',
          'Account created successfully!',
          [
            {
              text: 'OK',
              onPress: () => navigation.replace('LoginScreen')
            }
          ]
        );
      } else {
        const errorMessage = response.data.message || 
                             response.data.error || 
                             'Unable to create account';
        Alert.alert('Signup Failed', errorMessage);
      }
    } catch (error) {
      console.log('Signup Error:', error);
      
      if (error.response) {
        const errorMessage = error.response.data?.message || 
                             error.response.data?.error || 
                             'Signup failed. Please try again.';
        Alert.alert('Signup Failed', errorMessage);
      } else if (error.request) {
        Alert.alert('Network Error', 'Please check your internet connection and try again.');
      } else {
        Alert.alert('Error', 'Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (navigation?.canGoBack?.()) {
      navigation.goBack();
    } else {
      navigation.replace('LoginScreen');
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <StatusBar backgroundColor="white" barStyle="dark-content" />
      
      {/* Header with Linear Gradient + Back Arrow */}
      <LinearGradient
        colors={['#7E5EA9', '#20AEBC']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.titleContainer}>

        {/* Back Button (absolute) */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          disabled={loading}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        {/* Title centered */}
        <Text style={styles.title}>Makroo Motor Corp.</Text>
      </LinearGradient>

      <Text style={styles.subtitle}>Create Account</Text>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {/* First Name Input */}
        <View style={styles.inputContainer}>
          <View style={[styles.inputBox, errors.firstName ? styles.inputError : null]}>
            <TextInput
              placeholder="First Name"
              placeholderTextColor="#aaa"
              style={styles.inputText}
              value={formData.firstName}
              onChangeText={(text) => handleInputChange('firstName', text)}
              editable={!loading}
              autoCapitalize="words"
            />
          </View>
          {errors.firstName ? <Text style={styles.errorText}>{errors.firstName}</Text> : null}
        </View>

        {/* Last Name Input */}
        <View style={styles.inputContainer}>
          <View style={[styles.inputBox, errors.lastName ? styles.inputError : null]}>
            <TextInput
              placeholder="Last Name"
              placeholderTextColor="#aaa"
              style={styles.inputText}
              value={formData.lastName}
              onChangeText={(text) => handleInputChange('lastName', text)}
              editable={!loading}
              autoCapitalize="words"
            />
          </View>
          {errors.lastName ? <Text style={styles.errorText}>{errors.lastName}</Text> : null}
        </View>

        {/* Email Input */}
        <View style={styles.inputContainer}>
          <View style={[styles.inputBox, errors.email ? styles.inputError : null]}>
            <TextInput
              placeholder="Email"
              placeholderTextColor="#aaa"
              style={styles.inputText}
              value={formData.email}
              onChangeText={(text) => handleInputChange('email', text)}
              editable={!loading}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>
          {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
        </View>

        {/* Phone Number Input */}
        <View style={styles.inputContainer}>
          <View style={[styles.inputBox, errors.phone ? styles.inputError : null]}>
            <TextInput
              placeholder="Phone Number"
              placeholderTextColor="#aaa"
              style={styles.inputText}
              value={formData.phone}
              onChangeText={(text) => handleInputChange('phone', text)}
              editable={!loading}
              autoCapitalize="none"
              keyboardType="phone-pad"
              maxLength={10}
            />
          </View>
          {errors.phone ? <Text style={styles.errorText}>{errors.phone}</Text> : null}
        </View>

        {/* Password Input */}
        <View style={styles.inputContainer}>
          <View style={[styles.inputBox, errors.password ? styles.inputError : null]}>
            <TextInput
              placeholder="Password"
              placeholderTextColor="#aaa"
              style={styles.inputText}
              secureTextEntry
              value={formData.password}
              onChangeText={(text) => handleInputChange('password', text)}
              editable={!loading}
              autoCapitalize="none"
            />
          </View>
          {errors.password ? (
            <Text style={styles.errorText}>{errors.password}</Text>
          ) : null}
        </View>

        {/* Sign Up Button */}
        <TouchableOpacity 
          style={[styles.signupButton, loading && styles.disabledButton]} 
          onPress={handleSignup}
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
              <Text style={styles.signupButtonText}>Sign Up</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>

        {/* Login Section */}
        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Already have an account? </Text>
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
    paddingHorizontal: 25, 
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
  },
  // Back button positioned without shifting the centered title
  backButton: {
    position: 'absolute',
    left: 16,
    top: '50%',
    transform: [{ translateY: -12 }], // centers the 24px icon vertically within the header
    padding: 6,
  },
  title: { 
    fontSize: 22, 
    color: '#fff', 
    textAlign: 'center',
    fontFamily: 'Inter_28pt-SemiBold',
  },
  subtitle: {
    fontSize: 20,
    marginBottom: 30,
    color: '#333',
    alignSelf: 'center',
    fontFamily: 'Inter_28pt-Medium',
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
    fontFamily: 'Inter_28pt-Regular',
  },
  errorText: { 
    color: '#ff0000', 
    fontSize: 12, 
    marginLeft: 5, 
    marginBottom: 10,
    fontFamily: 'Inter_28pt-Regular',
  },
  signupButton: {
    width: '100%',
    height: 50,
    borderRadius: 8,
    overflow: 'hidden',
    marginTop: 10,
    marginBottom: 20,
  },
  gradientButton: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupButtonText: { 
    color: '#fff', 
    fontSize: 16,
    fontFamily: 'Inter_28pt-Medium',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 50,
  },
  loginText: { 
    color: '#666', 
    fontSize: 15,
    fontFamily: 'Inter_28pt-Medium',
  },
  loginLink: { 
    color: '#7E5EA9', 
    fontSize: 15, 
    fontFamily: 'Inter_28pt-SemiBold',
  },
  disabledButton: {
    opacity: 0.6,
  },
  disabledText: {
    opacity: 0.6,
  },
});

export default Signup;
