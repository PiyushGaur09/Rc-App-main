import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
  Image,
  TextInput
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Customerinternalpage = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  
  // Get customer data from route params
  const { customer } = route.params;
  
  const [selectedOption, setSelectedOption] = useState('Yes');
  const [formType, setFormType] = useState('Type A');
  const [customerName, setCustomerName] = useState(customer.name);
  const [registrationNo, setRegistrationNo] = useState('REG12345');
  const [chassisNo, setChassisNo] = useState('CHAS67980');
  const [date, setDate] = useState('2025-08-15');
  const [status, setStatus] = useState('Active');

  const handleEdit = () => {
    Alert.alert('Edit', 'Edit functionality would go here');
  };

  const handleExport = () => {
    Alert.alert('Export', 'Export to Excel functionality');
  };

  const handleBackup = () => {
    Alert.alert('Backup', 'Backup Data functionality');
  };

  const handleRestore = () => {
    Alert.alert('Restore', 'Restore Data functionality');
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Entry',
      'Are you sure you want to delete this entry?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => console.log('Entry deleted') }
      ]
    );
  };

  const handleHome = () => {
    navigation.goBack();
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar backgroundColor="#7E5EA9" barStyle="dark-content" />
      
      {/* Header with Gradient */}
      <LinearGradient 
        colors={['#7E5EA9', '#20AEBC']} 
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Customer Profile</Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>

        {/* Customer Image - Using route data */}
        <Image source={customer.image} style={{width:100,height:100,borderRadius:50,alignSelf:"center",marginTop:20}} />

        {/* Customer Header Section - Using route data */}
        <View style={styles.customerHeader}>
          <Text style={styles.customerName}>{customer.name}</Text>
          <Text style={styles.customerId}>ID: 123456</Text>
        </View>

        {/* Form Fields */}
        <View style={styles.formSection}>
          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>Select</Text>
            <View style={styles.inputField}>
              <TextInput 
                style={styles.inputText}
                value={selectedOption}
                onChangeText={setSelectedOption}
              />
            </View>
          </View>

          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>Form Type</Text>
            <View style={styles.inputField}>
              <TextInput 
                style={styles.inputText}
                value={formType}
                onChangeText={setFormType}
              />
            </View>
          </View>

          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>Customer Name</Text>
            <View style={styles.inputField}>
              <TextInput 
                style={styles.inputText}
                value={customerName}
                onChangeText={setCustomerName}
              />
            </View>
          </View>

          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>Registration No</Text>
            <View style={styles.inputField}>
              <TextInput 
                style={styles.inputText}
                value={registrationNo}
                onChangeText={setRegistrationNo}
              />
            </View>
          </View>

          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>Chassis No</Text>
            <View style={styles.inputField}>
              <TextInput 
                style={styles.inputText}
                value={chassisNo}
                onChangeText={setChassisNo}
              />
            </View>
          </View>

          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>Date</Text>
            <View style={styles.inputField}>
              <TextInput 
                style={styles.inputText}
                value={date}
                onChangeText={setDate}
              />
            </View>
          </View>

          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>Status</Text>
            <View style={[styles.inputField, styles.activeStatus]}>
              <TextInput 
                style={[styles.inputText, styles.activeText]}
                value={status}
                onChangeText={setStatus}
              />
            </View>
          </View>
        </View>

        {/* Divider Line */}
        <View style={styles.divider} />

        {/* Action Buttons with Icons */}
        <View style={styles.actionsSection}>
          <TouchableOpacity style={styles.actionButton} onPress={handleEdit}>
            <LinearGradient
              colors={['#7E5EA9', '#7E5EA9']}
              style={styles.gradientButton}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <View style={styles.buttonWithIcon}>
                <Text style={styles.actionButtonText}>Edit</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleExport}>
            <View style={[styles.secondaryButton, styles.buttonWithIcon]}>
              <Text style={styles.secondaryButtonText}>Export To Exl</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleBackup}>
            <View style={[styles.secondaryButtonbackup, styles.buttonWithIcon]}>
              <Text style={styles.secondaryButtonText}>Backup Data</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleRestore}>
            <View style={[styles.secondaryButtonRestore, styles.buttonWithIcon]}>
              <Text style={styles.secondaryButtonText}>Restore Data</Text>
            </View>
          </TouchableOpacity>

          {/* Delete + Home in same row */}
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <TouchableOpacity style={[styles.actionButton, {flex: 0.48}]} onPress={handleDelete}>
              <View style={[styles.deleteButton, styles.buttonWithIcon]}>
                <Text style={styles.deleteButtonText}>Delete Entry</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.actionButton, {flex: 0.48}]} onPress={handleHome}>
              <View style={[styles.secondaryButtonHome, styles.buttonWithIcon]}>
                <Text style={styles.secondaryButtonText}>Home</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    width: '100%',
    paddingVertical: 12,
  },
  headerContent: {
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 20,
    color: '#fff',
    textAlign: 'center',
    fontFamily:"Inter_28pt-SemiBold"
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  customerHeader: {
    alignItems: 'center',
    marginVertical: 10,
    marginBottom: 25,
  },
  customerName: {
    fontSize: 22,
    fontFamily:"Inter_28pt-SemiBold",
    color: '#000',
    marginBottom: 0,
  },
  customerId: {
    fontSize: 14,
    color: '#56616D',
    fontFamily:"Inter_28pt-Regular",
  },
  formSection: {
    marginBottom: 20,
  },
  fieldRow: {
    marginBottom: 15,
  },
  fieldLabel: {
    fontSize: 14,
    color: '#505C68',
    width: '40%',
    fontFamily:"Inter_28pt-Medium"
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '60%',
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#7E5EA9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  radioSelected: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#7E5EA9',
  },
  radioLabel: {
    fontSize: 16.5,
    color: '#000',
  },
  inputField: {
    width: '100%',
    borderBottomWidth: 0.6,
    borderColor: '#000000',
    paddingVertical: 1,
    paddingHorizontal: 1,
  },
  inputText: {
    fontSize: 16.5,
    color: '#000',
    fontFamily:"Inter_28pt-Medium"
  },
  activeStatus: {},
  activeText: {
    fontFamily:"Inter_28pt-Medium"
  },
  actionsSection: {
    marginBottom: 35,
    marginTop:25
  },
  actionButton: {
    marginBottom: 12,
    borderRadius: 8,
    overflow: 'hidden',
  },
  gradientButton: {
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily:"Inter_28pt-SemiBold"
  },
  secondaryButton: {
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: '#149418',
  },
  secondaryButtonbackup: {
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: '#20AEBC',
  },
  secondaryButtonRestore: {
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: '#7E5EA9',
  },
  secondaryButtonHome: {
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: '#20AEBC',
  },
  secondaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily:"Inter_28pt-SemiBold"
  },
  deleteButton: {
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: '#B00E0E',
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily:"Inter_28pt-SemiBold"
  },
});

export default Customerinternalpage;