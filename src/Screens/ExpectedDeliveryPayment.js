import React, {useState} from 'react';
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
  Platform,
} from 'react-native';
import {RadioButton} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';

const ExpectedDeliveryPayment = ({navigation}) => {
  const insets = useSafeAreaInsets();
  const [showDseDropdown, setShowDseDropdown] = useState(false);
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [showDeliveryModeDropdown, setShowDeliveryModeDropdown] = useState(false);
  const [showFinancerDropdown, setShowFinancerDropdown] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showExchangeOldTractorDropdown, setShowExchangeOldTractorDropdown] = useState(false);
  const [showAmountPaidNewDropdown, setShowAmountPaidNewDropdown] = useState(false);
  
  const [formData, setFormData] = useState({
    dseName: '',
    expectedTractorModel: '',
    addModel: '',
    addQuantity: '',
    exchangeOldTractor: '',
    oldTractorModelName: '',
    yearOfManufacture: '',
    registrationNumber: '',
    oldTractorDealPrice: '',
    amountPaid: '',
    balanceOldTractor: '',
    deliveryMode: '',
    financerName: '',
    financeAmount: '',
    dateOfDelivery: null,
    dealPriceOfNewTractor: '',
    amountPaidNew: '',
    balanceNew: '',
    remarks: '',
  });

  const dseNames = [
    "Danish Nazir",
    "Rastil Bashir", 
    "Akeel Manzoor",
    "Nisar Sangam"
  ];

  const tractorModels = [
    "4 0ctober 2025",
    "5 0ctober 2025",
    "6 0ctober 2025",
    "7 0ctober 2025",
    "8 0ctober 2025",
    "9 0ctober 2025",
    "10 0ctober 2025",
    "11 0ctober 2025",
    "12 0ctober 2025",
    "13 0ctober 2025",
    "14 0ctober 2025",
    "15 0ctober 2025",
    "16 0ctober 2025",
  ];

  const deliveryModes = [
    "Self Pickup",
    "Company Delivery",
    "Third Party Logistics"
  ];

  const financerNames = [
    "HDFC Bank",
    "ICICI Bank", 
    "State Bank of India",
    "Axis Bank",
    "Kotak Mahindra Bank"
  ];

  const yesNoOptions = [
    "YES",
    "NO"
  ];

  const dseData = [
    { name: "Danish Nazir", tractorsDelivered: 12, paymentCollected: "€ 1,200,000" },
    { name: "Rastil Bashir", tractorsDelivered: 8, paymentCollected: "₹ 800,000" },
    { name: "Akeel Manzoor", tractorsDelivered: 15, paymentCollected: "€ 1,500,000" },
    { name: "Nisar Sangam", tractorsDelivered: 10, paymentCollected: "₹ 950,000" },
  ];

  const previousMonthsData = [
    { month: "Previous Month", tractorsDelivered: 25, paymentCollected: "€ 2,500,000" },
    { month: "2 Months Ago", tractorsDelivered: 20, paymentCollected: "3,500,500" },
    { month: "3 Months Ago", tractorsDelivered: 20, paymentCollected: "3,250,600" },
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDseSelect = (dse) => {
    handleInputChange('dseName', dse);
    setShowDseDropdown(false);
  };

  const handleModelSelect = (model) => {
    handleInputChange('expectedTractorModel', model);
    setShowModelDropdown(false);
  };

  const handleDeliveryModeSelect = (mode) => {
    handleInputChange('deliveryMode', mode);
    setShowDeliveryModeDropdown(false);
  };

  const handleFinancerSelect = (financer) => {
    handleInputChange('financerName', financer);
    setShowFinancerDropdown(false);
  };

  const handleExchangeOldTractorSelect = (option) => {
    handleInputChange('exchangeOldTractor', option);
    setShowExchangeOldTractorDropdown(false);
  };

  const handleAmountPaidNewSelect = (option) => {
    handleInputChange('amountPaidNew', option);
    setShowAmountPaidNewDropdown(false);
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      handleInputChange('dateOfDelivery', selectedDate);
    }
  };

  const handleAddModel = () => {
    Alert.alert('Add Model', 'Add model functionality');
  };

  const handleAddQuantity = () => {
    Alert.alert('Add Quantity', 'Add quantity functionality');
  };

  const handleSubmit = () => {
    Alert.alert('Success', 'Form submitted successfully!');
  };

  const handleHome = () => {
    navigation.navigate('Dashboard');
  }

  const handleExcel = () => {
    Alert.alert('Excel', 'Excel export initiated!');
  };

  const handleDateIconPress = () => {
    setShowDatePicker(true);
  };

  const renderDseItem = ({item}) => (
    <TouchableOpacity
      style={styles.modelItem}
      onPress={() => handleDseSelect(item)}>
      <Text style={styles.modelItemText}>{item}</Text>
    </TouchableOpacity>
  );

  const renderModelItem = ({item}) => (
    <TouchableOpacity
      style={styles.modelItem}
      onPress={() => handleModelSelect(item)}>
      <Text style={styles.modelItemText}>{item}</Text>
    </TouchableOpacity>
  );

  const renderDeliveryModeItem = ({item}) => (
    <TouchableOpacity
      style={styles.modelItem}
      onPress={() => handleDeliveryModeSelect(item)}>
      <Text style={styles.modelItemText}>{item}</Text>
    </TouchableOpacity>
  );

  const renderFinancerItem = ({item}) => (
    <TouchableOpacity
      style={styles.modelItem}
      onPress={() => handleFinancerSelect(item)}>
      <Text style={styles.modelItemText}>{item}</Text>
    </TouchableOpacity>
  );

  const renderYesNoItem = ({item}) => (
    <TouchableOpacity
      style={styles.modelItem}
      onPress={() => {
        if (showExchangeOldTractorDropdown) {
          handleExchangeOldTractorSelect(item);
        } else if (showAmountPaidNewDropdown) {
          handleAmountPaidNewSelect(item);
        }
      }}>
      <Text style={styles.modelItemText}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <View
      style={{flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom}}>
      {/* Header with Gradient */}
      <LinearGradient
        colors={['#7E5EA9', '#20AEBC']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        style={styles.header}>
       
        <Text style={styles.companyName}>Expected Delivery & Payment</Text>
      </LinearGradient>

      <ScrollView style={styles.container}>
        {/* Expected Delivery & Payment Section */}
        <View style={styles.section}>
          
          
          <View style={styles.formContainer}>
            {/* Row 1 - DSE Name & Expected Tractor Delivered */}
            <View style={styles.row}>
              <View style={styles.inputContainer}>
                <LinearGradient
                  colors={['#7E5EA9', '#20AEBC']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  style={styles.inputGradient}>
                  <TouchableOpacity 
                    style={styles.input}
                    onPress={() => setShowDseDropdown(true)}
                  >
                    <Text style={
                      formData.dseName ? 
                      styles.selectedModelText : 
                      styles.placeholderText
                    }>
                      {formData.dseName || 'DSE Name'}
                    </Text>
                    <Icon 
                      name="keyboard-arrow-down" 
                      size={25} 
                      color="#666" 
                      style={styles.dropdownIcon}
                    />
                  </TouchableOpacity>
                </LinearGradient>
              </View>

              <View style={styles.inputContainer}>
                <LinearGradient
                  colors={['#7E5EA9', '#20AEBC']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  style={styles.inputGradient}>
                  <TouchableOpacity 
                    style={styles.input}
                    onPress={() => setShowModelDropdown(true)}
                  >
                    <Text style={
                      formData.expectedTractorModel ? 
                      styles.selectedModelText : 
                      styles.placeholderText
                    }>
                      {formData.expectedTractorModel || 'Expected Tractor Delivered'}
                    </Text>
                    <Icon 
                      name="keyboard-arrow-down" 
                      size={25} 
                      color="#666" 
                      style={styles.dropdownIcon}
                    />
                  </TouchableOpacity>
                </LinearGradient>
              </View>
            </View>

            {/* Row 2 - Add Model & Add Quantity */}
            <View style={styles.row}>
              <View style={styles.inputContainer}>
                <LinearGradient
                  colors={['#7E5EA9', '#20AEBC']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  style={styles.inputGradient}>
                  <View style={styles.inputWithIcon}>
                    <TextInput
                      style={[styles.input, styles.inputWithIconField]}
                      value={formData.addModel}
                      onChangeText={text => handleInputChange('addModel', text)}
                      placeholder="Add Model"
                    />
                    <TouchableOpacity
                      onPress={handleAddModel}
                      style={styles.iconButton}>
                      <Icon name="add" size={20} color="#666" />
                    </TouchableOpacity>
                  </View>
                </LinearGradient>
              </View>

              <View style={styles.inputContainer}>
                <LinearGradient
                  colors={['#7E5EA9', '#20AEBC']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  style={styles.inputGradient}>
                  <View style={styles.inputWithIcon}>
                    <TextInput
                      style={[styles.input, styles.inputWithIconField]}
                      value={formData.addQuantity}
                      onChangeText={text => handleInputChange('addQuantity', text)}
                      placeholder="Add Quantity"
                      keyboardType="numeric"
                    />
                    <TouchableOpacity
                      onPress={handleAddQuantity}
                      style={styles.iconButton}>
                      <Icon name="add" size={20} color="#666" />
                    </TouchableOpacity>
                  </View>
                </LinearGradient>
              </View>
            </View>

            {/* Row 3 - Exchange Old Tractor & Old Tractor Model Name */}
            <View style={styles.row}>
              <View style={styles.inputContainer}>
                <LinearGradient
                  colors={['#7E5EA9', '#20AEBC']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  style={styles.inputGradient}>
                  <TouchableOpacity 
                    style={styles.input}
                    onPress={() => setShowExchangeOldTractorDropdown(true)}
                  >
                    <Text style={
                      formData.exchangeOldTractor ? 
                      styles.selectedModelText : 
                      styles.placeholderText
                    }>
                      {formData.exchangeOldTractor || 'Exchange Old Tractor'}
                    </Text>
                    <Icon 
                      name="keyboard-arrow-down" 
                      size={25} 
                      color="#666" 
                      style={styles.dropdownIcon}
                    />
                  </TouchableOpacity>
                </LinearGradient>
              </View>

              <View style={styles.inputContainer}>
                <LinearGradient
                  colors={['#7E5EA9', '#20AEBC']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  style={styles.inputGradient}>
                  <TextInput
                    style={styles.input}
                    value={formData.oldTractorModelName}
                    onChangeText={text => handleInputChange('oldTractorModelName', text)}
                    placeholder="Old Tractor Model Name"
                  />
                </LinearGradient>
              </View>
            </View>

            {/* Row 4 - Year of Manufacture & Registration Number */}
            <View style={styles.row}>
              <View style={styles.inputContainer}>
                <LinearGradient
                  colors={['#7E5EA9', '#20AEBC']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  style={styles.inputGradient}>
                  <TextInput
                    style={styles.input}
                    value={formData.yearOfManufacture}
                    onChangeText={text => handleInputChange('yearOfManufacture', text)}
                    placeholder="Year of Manufacture"
                    keyboardType="numeric"
                  />
                </LinearGradient>
              </View>

              <View style={styles.inputContainer}>
                <LinearGradient
                  colors={['#7E5EA9', '#20AEBC']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  style={styles.inputGradient}>
                  <TextInput
                    style={styles.input}
                    value={formData.registrationNumber}
                    onChangeText={text => handleInputChange('registrationNumber', text)}
                    placeholder="Registration Number"
                  />
                </LinearGradient>
              </View>
            </View>

            {/* Row 5 - Old Tractor Deal Price & Amount Paid */}
            <View style={styles.row}>
              <View style={styles.inputContainer}>
                <LinearGradient
                  colors={['#7E5EA9', '#20AEBC']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  style={styles.inputGradient}>
                  <TextInput
                    style={styles.input}
                    value={formData.oldTractorDealPrice}
                    onChangeText={text => handleInputChange('oldTractorDealPrice', text)}
                    placeholder="Old Tractor Deal Price"
                    keyboardType="numeric"
                  />
                </LinearGradient>
              </View>

              <View style={styles.inputContainer}>
                <LinearGradient
                  colors={['#7E5EA9', '#20AEBC']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  style={styles.inputGradient}>
                  <TextInput
                    style={styles.input}
                    value={formData.amountPaid}
                    onChangeText={text => handleInputChange('amountPaid', text)}
                    placeholder="Amount Paid"
                    keyboardType="numeric"
                  />
                </LinearGradient>
              </View>
            </View>

            {/* Row 6 - Balance Old Tractor & Delivery Mode */}
            <View style={styles.row}>
              <View style={styles.inputContainer}>
                <LinearGradient
                  colors={['#7E5EA9', '#20AEBC']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  style={styles.inputGradient}>
                  <TextInput
                    style={styles.input}
                    value={formData.balanceOldTractor}
                    onChangeText={text => handleInputChange('balanceOldTractor', text)}
                    placeholder="Balance Old Tractor"
                    keyboardType="numeric"
                  />
                </LinearGradient>
              </View>

              <View style={styles.inputContainer}>
                <LinearGradient
                  colors={['#7E5EA9', '#20AEBC']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  style={styles.inputGradient}>
                  <TouchableOpacity 
                    style={styles.input}
                    onPress={() => setShowDeliveryModeDropdown(true)}
                  >
                    <Text style={
                      formData.deliveryMode ? 
                      styles.selectedModelText : 
                      styles.placeholderText
                    }>
                      {formData.deliveryMode || 'Delivery Mode'}
                    </Text>
                    <Icon 
                      name="keyboard-arrow-down" 
                      size={25} 
                      color="#666" 
                      style={styles.dropdownIcon}
                    />
                  </TouchableOpacity>
                </LinearGradient>
              </View>
            </View>

            {/* Row 7 - Financer Name & Finance Amount */}
            <View style={styles.row}>
              <View style={styles.inputContainer}>
                <LinearGradient
                  colors={['#7E5EA9', '#20AEBC']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  style={styles.inputGradient}>
                  <TouchableOpacity 
                    style={styles.input}
                    onPress={() => setShowFinancerDropdown(true)}
                  >
                    <Text style={
                      formData.financerName ? 
                      styles.selectedModelText : 
                      styles.placeholderText
                    }>
                      {formData.financerName || 'Financer Name'}
                    </Text>
                    <Icon 
                      name="keyboard-arrow-down" 
                      size={25} 
                      color="#666" 
                      style={styles.dropdownIcon}
                    />
                  </TouchableOpacity>
                </LinearGradient>
              </View>

              <View style={styles.inputContainer}>
                <LinearGradient
                  colors={['#7E5EA9', '#20AEBC']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  style={styles.inputGradient}>
                  <TextInput
                    style={styles.input}
                    value={formData.financeAmount}
                    onChangeText={text => handleInputChange('financeAmount', text)}
                    placeholder="Finance Amount"
                    keyboardType="numeric"
                  />
                </LinearGradient>
              </View>
            </View>

            {/* Row 8 - Date of Delivery & Deal Price of New Tractor */}
            <View style={styles.row}>
              <View style={styles.inputContainer}>
                <LinearGradient
                  colors={['#7E5EA9', '#20AEBC']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  style={styles.inputGradient}>
                  <View style={styles.inputWithIcon}>
                    <TouchableOpacity
                      style={[styles.input, styles.inputWithIconField]}
                      onPress={handleDateIconPress}
                    >
                      <Text style={
                        formData.dateOfDelivery ? 
                        styles.selectedModelText : 
                        styles.placeholderText
                      }>
                        {formData.dateOfDelivery ? formData.dateOfDelivery.toLocaleDateString() : 'Date of Delivery'}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={handleDateIconPress}
                      style={styles.iconButton}>
                      <Icon name="calendar-today" size={20} color="#666" />
                    </TouchableOpacity>
                  </View>
                </LinearGradient>
                {showDatePicker && (
                  <DateTimePicker
                    value={formData.dateOfDelivery || new Date()}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={handleDateChange}
                  />
                )}
              </View>

              <View style={styles.inputContainer}>
                <LinearGradient
                  colors={['#7E5EA9', '#20AEBC']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  style={styles.inputGradient}>
                  <TextInput
                    style={styles.input}
                    value={formData.dealPriceOfNewTractor}
                    onChangeText={text => handleInputChange('dealPriceOfNewTractor', text)}
                    placeholder="Deal Price of New Tractor"
                    keyboardType="numeric"
                  />
                </LinearGradient>
              </View>
            </View>

            {/* Row 9 - Amount Paid & Balance */}
            <View style={styles.row}>
              <View style={styles.inputContainer}>
                <LinearGradient
                  colors={['#7E5EA9', '#20AEBC']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  style={styles.inputGradient}>
                  <TouchableOpacity 
                    style={styles.input}
                    onPress={() => setShowAmountPaidNewDropdown(true)}
                  >
                    <Text style={
                      formData.amountPaidNew ? 
                      styles.selectedModelText : 
                      styles.placeholderText
                    }>
                      {formData.amountPaidNew || 'Amount Paid'}
                    </Text>
                    <Icon 
                      name="keyboard-arrow-down" 
                      size={25} 
                      color="#666" 
                      style={styles.dropdownIcon}
                    />
                  </TouchableOpacity>
                </LinearGradient>
              </View>

              <View style={styles.inputContainer}>
                <LinearGradient
                  colors={['#7E5EA9', '#20AEBC']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  style={styles.inputGradient}>
                  <TextInput
                    style={styles.input}
                    value={formData.balanceNew}
                    onChangeText={text => handleInputChange('balanceNew', text)}
                    placeholder="Balance"
                    keyboardType="numeric"
                  />
                </LinearGradient>
              </View>
            </View>

            {/* Row 10 - Remarks (Full Width) */}
            <View style={styles.row}>
              <View style={[styles.inputContainer, {flex: 2}]}>
                <LinearGradient
                  colors={['#7E5EA9', '#20AEBC']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  style={styles.inputGradient}>
                  <TextInput
                    style={styles.input}
                    value={formData.remarks}
                    onChangeText={text => handleInputChange('remarks', text)}
                    placeholder="Remarks"
                    multiline
                  />
                </LinearGradient>
              </View>
            </View>
          </View>
        </View>

        {/* Overview Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overview</Text>
          
          {/* Current DSE Data Table */}
          <LinearGradient
            colors={['#7E5EA9', '#20AEBC']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={styles.tableGradient}>
            <View style={styles.table}>
              <View style={styles.tableRow}>
                <Text style={[styles.tableHeader, styles.tableCell]}>DSE Name</Text>
                <Text style={[styles.tableHeader, styles.tableCell]}>Tractors Delivered</Text>
                <Text style={[styles.tableHeader, styles.tableCell]}>Payment Collected</Text>
              </View>
              
              {dseData.map((item, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={[styles.tableCell, styles.dseName]}>{item.name}</Text>
                  <Text style={[styles.tableCell, styles.tractorsCount]}>{item.tractorsDelivered}</Text>
                  <Text style={[styles.tableCell, styles.paymentAmount]}>{item.paymentCollected}</Text>
                </View>
              ))}
            </View>
          </LinearGradient>

          {/* Previous Months Data Table */}
          <LinearGradient
            colors={['#7E5EA9', '#20AEBC']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={[styles.tableGradient, {marginTop: 20}]}>
            <View style={styles.table}>
              {previousMonthsData.map((item, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={[styles.tableCell, styles.previousMonth]}>{item.month}</Text>
                  <Text style={[styles.tableCell, styles.tractorsCount]}>{item.tractorsDelivered}</Text>
                  <Text style={[styles.tableCell, styles.paymentAmount]}>{item.paymentCollected}</Text>
                </View>
              ))}
            </View>
          </LinearGradient>
        </View>

        {/* Modals for Dropdowns */}
        <Modal
          visible={showDseDropdown}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowDseDropdown(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select DSE Name</Text>
                <TouchableOpacity 
                  onPress={() => setShowDseDropdown(false)}
                  style={styles.closeButton}
                >
                  <Icon name="close" size={24} color="#000" />
                </TouchableOpacity>
              </View>
              <FlatList
                data={dseNames}
                renderItem={renderDseItem}
                keyExtractor={(item, index) => index.toString()}
                style={styles.modelList}
                showsVerticalScrollIndicator={true}
              />
            </View>
          </View>
        </Modal>

        <Modal
          visible={showModelDropdown}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowModelDropdown(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Expected Tractor Delivered</Text>
                <TouchableOpacity 
                  onPress={() => setShowModelDropdown(false)}
                  style={styles.closeButton}
                >
                  <Icon name="close" size={24} color="#000" />
                </TouchableOpacity>
              </View>
              <FlatList
                data={tractorModels}
                renderItem={renderModelItem}
                keyExtractor={(item, index) => index.toString()}
                style={styles.modelList}
                showsVerticalScrollIndicator={true}
              />
            </View>
          </View>
        </Modal>

        <Modal
          visible={showDeliveryModeDropdown}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowDeliveryModeDropdown(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Delivery Mode</Text>
                <TouchableOpacity 
                  onPress={() => setShowDeliveryModeDropdown(false)}
                  style={styles.closeButton}
                >
                  <Icon name="close" size={24} color="#000" />
                </TouchableOpacity>
              </View>
              <FlatList
                data={deliveryModes}
                renderItem={renderDeliveryModeItem}
                keyExtractor={(item, index) => index.toString()}
                style={styles.modelList}
                showsVerticalScrollIndicator={true}
              />
            </View>
          </View>
        </Modal>

        <Modal
          visible={showFinancerDropdown}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowFinancerDropdown(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Financer</Text>
                <TouchableOpacity 
                  onPress={() => setShowFinancerDropdown(false)}
                  style={styles.closeButton}
                >
                  <Icon name="close" size={24} color="#000" />
                </TouchableOpacity>
              </View>
              <FlatList
                data={financerNames}
                renderItem={renderFinancerItem}
                keyExtractor={(item, index) => index.toString()}
                style={styles.modelList}
                showsVerticalScrollIndicator={true}
              />
            </View>
          </View>
        </Modal>

        <Modal
          visible={showExchangeOldTractorDropdown}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowExchangeOldTractorDropdown(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Exchange Old Tractor</Text>
                <TouchableOpacity 
                  onPress={() => setShowExchangeOldTractorDropdown(false)}
                  style={styles.closeButton}
                >
                  <Icon name="close" size={24} color="#000" />
                </TouchableOpacity>
              </View>
              <FlatList
                data={yesNoOptions}
                renderItem={renderYesNoItem}
                keyExtractor={(item, index) => index.toString()}
                style={styles.modelList}
                showsVerticalScrollIndicator={true}
              />
            </View>
          </View>
        </Modal>

        <Modal
          visible={showAmountPaidNewDropdown}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowAmountPaidNewDropdown(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Amount Paid</Text>
                <TouchableOpacity 
                  onPress={() => setShowAmountPaidNewDropdown(false)}
                  style={styles.closeButton}
                >
                  <Icon name="close" size={24} color="#000" />
                </TouchableOpacity>
              </View>
              <FlatList
                data={yesNoOptions}
                renderItem={renderYesNoItem}
                keyExtractor={(item, index) => index.toString()}
                style={styles.modelList}
                showsVerticalScrollIndicator={true}
              />
            </View>
          </View>
        </Modal>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.excelButton} onPress={handleExcel}>
            <Text style={styles.excelButtonText}>Excel</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.homeButton} onPress={handleHome}>
            <Text style={styles.homeButtonText}>Home</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  companyName: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
    color: '#000',
    fontFamily: 'Inter_28pt-SemiBold',
  },
  formContainer: {
    marginBottom: 15,
    marginTop: 25,
  },
  row: {
    
    marginBottom: 0,
  },
  inputContainer: {
    flex: 1,
    marginHorizontal: 4,
    marginBottom: 10,
  },
  inputGradient: {
    borderRadius: 10,
    padding: 1,
  },
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
  selectedModelText: {
    fontSize: 14,
    fontFamily: 'Inter_28pt-Regular',
    color: '#000',
  },
  placeholderText: {
    fontSize: 14,
    fontFamily: 'Inter_28pt-Regular',
    color: '#666',
  },
  dropdownIcon: {
    marginLeft: 8,
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputWithIconField: {
    flex: 1,
  },
  iconButton: {
    position: 'absolute',
    right: 12,
    padding: 4,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    width: '90%',
    maxHeight: '70%',
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Inter_28pt-SemiBold',
  },
  closeButton: {
    padding: 4,
  },
  modelList: {
    maxHeight: 300,
  },
  modelItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modelItemText: {
    fontSize: 14,
    fontFamily: 'Inter_28pt-Regular',
    color: '#333',
  },
  // Table Gradient Styles
  tableGradient: {
    borderRadius: 5,
    padding: 1,
  },
  // Table Styles
  table: {
    borderRadius: 4,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
  },
  tableHeader: {
    backgroundColor: '#f0f0f0',
    fontWeight: 'bold',
    fontFamily: 'Inter_28pt-SemiBold',
  },
  tableCell: {
    flex: 1,
    padding: 10,
    fontSize: 12,
    fontFamily: 'Inter_28pt-Regular',
    borderRightWidth: 1,
    borderRightColor: '#000',
  },
  dseName: {
    color: '#000',
  },
  tractorsCount: {
    textAlign: 'center',
    color: '#000',
  },
  paymentAmount: {
    textAlign: 'right',
    color: '#000',
  },
  previousMonth: {
    color: '#000',
  },
  // Button Styles
  buttonContainer: {
    flexDirection: 'column',
    marginTop: 20,
    marginBottom: 20,
  },
  submitButton: {
    flex: 1,
    backgroundColor: '#7E5EA9',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
    marginBottom: 12,
  },
  submitButtonText: {
    color: '#fff',
    fontFamily: 'Inter_28pt-SemiBold',
    fontSize: 14,
  },
  excelButton: {
    flex: 1,
    backgroundColor: '#149418',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
    marginBottom: 12,
  },
  excelButtonText: {
    color: '#fff',
    fontFamily: 'Inter_28pt-SemiBold',
    fontSize: 14,
  },
  homeButton: {
    flex: 1,
    backgroundColor: '#20AEBC',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  homeButtonText: {
    color: '#fff',
    fontFamily: 'Inter_28pt-SemiBold',
    fontSize: 14,
  },
});

export default ExpectedDeliveryPayment;