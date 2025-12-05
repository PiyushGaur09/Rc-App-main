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
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  //s.umar.farooq17@gmail.com
  const [password, setPassword] = useState('');

  // India@123
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);

  // Function to save user data to AsyncStorage
  const saveUserData = async (userData) => {
    try {
      await AsyncStorage.setItem('userId', userData.id.toString());
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
      console.log('User data saved successfully');
    } catch (error) {
      console.log('Error saving user data:', error);
    }
  };

  const handleLogin = async () => {
    // Reset errors
    setEmailError('');
    setPasswordError('');

    let isValid = true;

    if (!email.trim()) {
      setEmailError('Kindly fill the Email/Phone');
      isValid = false;
    }

    if (!password.trim()) {
      setPasswordError('Kindly fill the Password');
      isValid = false;
    }

    if (!isValid) return;

    setLoading(true);

    try {
      // Create FormData
      const formData = new FormData();
      formData.append('email_phone', email.trim());
      formData.append('password', password.trim());

      // API configuration
      const config = {
        method: 'post',
        url: 'https://makroomotors.com/makroo-panel/public/api/v1/auth/login',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: formData,
        timeout: 10000, // 10 seconds timeout
      };

      // Make API call
      const response = await axios(config);

      // Handle successful login
      console.log('Login Response:', response.data);
      
      // Check for successful login based on common API response patterns
      if (response.data.success || response.data.token || response.data.user) {
        // Save user data to AsyncStorage
        if (response.data.user) {
          await saveUserData(response.data.user);
        }
        
        // Navigate to Dashboard on successful login
        Alert.alert('Success', 'Login successful!');
        navigation.replace("Dashboard");
      } else {
        // Handle API error response
        const errorMessage = response.data.message || response.data.error || 'Invalid credentials';
        Alert.alert('Login Failed', errorMessage);
      }
    } catch (error) {
      // Handle network or server errors
      console.log('Login Error:', error);
      
      if (error.response) {
        // Server responded with error status
        const errorMessage = error.response.data?.message || error.response.data?.error || 'Login failed. Please try again.';
        Alert.alert('Login Failed', errorMessage);
      } else if (error.request) {
        // Network error
        Alert.alert('Network Error', 'Please check your internet connection and try again.');
      } else {
        // Other errors
        Alert.alert('Error', 'Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Functions to reset errors when user types
  const handleEmailChange = (text) => {
    setEmail(text);
    if (emailError) setEmailError('');
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
    if (passwordError) setPasswordError('');
  };

  return (
    <View style={[styles.container,{ paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      {/* Header with Linear Gradient */}
      <StatusBar backgroundColor="white" barStyle="dark-content" />
      <LinearGradient
        colors={['#7E5EA9', '#20AEBC']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.titleContainer}>
        <Text style={styles.title}>Makroo Motors</Text>
      </LinearGradient>

      <Text style={styles.subtitle}>Welcome Back</Text>

      {/* Email/Phone Input */}
      <View style={styles.inputContainer}>
        <View style={[styles.inputBox, emailError ? styles.inputError : null]}>
          <TextInput
            placeholder="Email/Phone"
            placeholderTextColor="#aaa"
            style={styles.inputText}
            value={email}
            onChangeText={handleEmailChange}
            editable={!loading}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>
        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
      </View>

      {/* Password Input */}
      <View style={styles.inputContainer}>
        <View style={[styles.inputBox, passwordError ? styles.inputError : null]}>
          <TextInput
            placeholder="Password"
            placeholderTextColor="#aaa"
            style={styles.inputText}
            secureTextEntry
            value={password}
            onChangeText={handlePasswordChange}
            editable={!loading}
            autoCapitalize="none"
          />
        </View>
        {passwordError ? (
          <Text style={styles.errorText}>{passwordError}</Text>
        ) : null}
      </View>

      {/* Forgot Password */}
      <TouchableOpacity disabled={loading} onPress={() => navigation.replace("Forgetpassword")}>
        <Text style={[styles.forgotPassword, loading && styles.disabledText]}>
          Forgot Password?
        </Text>
      </TouchableOpacity>

      {/* Login Button */}
      <TouchableOpacity 
        style={[styles.loginButton, loading && styles.disabledButton]} 
        onPress={handleLogin}
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
            <Text style={styles.loginText}>Login</Text>
          )}
        </LinearGradient>
      </TouchableOpacity>

      {/* Sign Up Section */}
      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>Don't have an account? </Text>
        <TouchableOpacity disabled={loading} onPress={() => navigation.replace("Signup")}>
          <Text style={[styles.signupLink, loading && styles.disabledText]}>
            Sign Up
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {  
    padding: 25, 
    flex: 1,
    backgroundColor: 'white',
  },
  titleContainer: {
    marginBottom: '30%',
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
    fontFamily:"Inter_28pt-SemiBold" 
  },
  subtitle: {
    fontSize: 20,
    marginBottom: 30,
    color: '#333',
    alignSelf: 'center',
    fontFamily:"Inter_28pt-Medium"
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
    fontFamily:"Inter_28pt-Regular" 
  },
  errorText: { 
    color: '#ff0000', 
    fontSize: 12, 
    marginLeft: 5, 
    marginBottom: 10,
    fontFamily:"Inter_28pt-Regular" 
  },
  forgotPassword: {
    alignSelf: 'flex-start',
    marginBottom: 30,
    color: 'black',
    fontSize: 14,
    fontFamily:"Inter_28pt-Medium"
  },
  loginButton: {
    width: '100%',
    height: 50,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 10,
  },
  gradientButton: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: { 
    color: '#fff', 
    fontSize: 16,
    fontFamily:"Inter_28pt-Medium"  
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 0,
  },
  signupText: { 
    color: '#666', 
    fontSize: 15,
    fontFamily:"Inter_28pt-Medium" 
  },
  signupLink: { 
    color: '#7E5EA9', 
    fontSize: 15, 
    fontFamily:"Inter_28pt-SemiBold" 
  },
  disabledButton: {
    opacity: 0.6,
  },
  disabledText: {
    opacity: 0.6,
  },
});

export default LoginScreen;