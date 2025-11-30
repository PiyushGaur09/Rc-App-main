import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';

const Formstatus1 = ({navigation}) => {
  const insets = useSafeAreaInsets();

  const handleBack = () => navigation.goBack();
  const handleRcForm = () => navigation.navigate('Rcformscreen');
  const handlePdiForm = () => navigation.navigate('Pdiformscreen');
  const handleDeliveryChallanForm = () => navigation.navigate('Dcformscreen');

  return (
    <View style={{flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom}}>
      {/* Header with Back Arrow and Title */}
      <LinearGradient
        colors={['#7E5EA9', '#20AEBC']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Icon name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.screenTitle}>Form Status</Text>
          <View style={styles.placeholder} /> {/* For balanced spacing */}
        </View>
      </LinearGradient>

      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        {/* Form Buttons Section */}
        <View style={styles.buttonsContainer}>
          {/* RC Form Button */}
          <TouchableOpacity style={styles.gradientButton} onPress={handleRcForm}>
            <LinearGradient
              colors={['#7E5EA9', '#20AEBC']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={styles.buttonGradient}>
              <View style={styles.buttonContent}>
                <Text style={styles.buttonText}>RC Form</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>

          {/* PDI Form Button */}
          <TouchableOpacity style={styles.gradientButton} onPress={handlePdiForm}>
            <LinearGradient
              colors={['#7E5EA9', '#20AEBC']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={styles.buttonGradient}>
              <View style={styles.buttonContent}>
                <Text style={styles.buttonText}>PDI Form</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>

          {/* Delivery Challan Form Button */}
          <TouchableOpacity style={styles.gradientButton} onPress={handleDeliveryChallanForm}>
            <LinearGradient
              colors={['#7E5EA9', '#20AEBC']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={styles.buttonGradient}>
              <View style={styles.buttonContent}>
                <Text style={styles.buttonText}>Delivery Challan Form</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>
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
    justifyContent: 'center',
    paddingHorizontal: 20,
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
    fontFamily: 'Inter_28pt-SemiBold',
    color: 'white',
    textAlign: 'center',
    flex: 1,
  },
  placeholder: {
    width: 24, // Same as back button for balanced spacing
  },
  buttonsContainer: {
    gap: 20,
    marginVertical: 20,
    paddingHorizontal: 10,
  },
  gradientButton: {
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonGradient: {
    borderRadius: 10,
    padding: 1.8,
  },
  buttonContent: {
    backgroundColor: 'white',
    paddingVertical: 20,
    alignItems: 'center',
    borderRadius: 8.5, // Slightly less than parent to maintain border effect
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'Inter_28pt-SemiBold',
    color: '#666',
  },
});

export default Formstatus1;