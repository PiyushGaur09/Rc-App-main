import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  TextInput,
  Alert,
  Dimensions,
  Platform,
  ActivityIndicator,
  RefreshControl,
  Linking,
  Modal,
  FlatList
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const {width, height} = Dimensions.get('window');

// Responsive scaling functions
const scale = size => (width / 375) * size;
const verticalScale = size => (height / 812) * size;
const moderateScale = (size, factor = 0.5) =>
  size + (scale(size) - size) * factor;

const Customerpaymentdetails = ({navigation, route}) => {
  const insets = useSafeAreaInsets();

  // State for payments data and search
  const [payments, setPayments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [generatingPdf, setGeneratingPdf] = useState(false);

  // History modal state
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedPaymentHistory, setSelectedPaymentHistory] = useState([]);
  const [selectedPaymentDetails, setSelectedPaymentDetails] = useState(null);

  // API Base URL
  const API_BASE_URL = 'https://argosmob.uk/makroo/public/api/v1';

  // Fetch payments from API
  const fetchPayments = useCallback(async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');

      if (!userId) {
        Alert.alert('Error', 'User not logged in. Please login again.');
        setPayments([]);
        setFilteredPayments([]);
        setLoading(false);
        setRefreshing(false);
        return;
      }

      const formData = new FormData();
      formData.append('user_id', userId);

      const response = await axios.post(
        `${API_BASE_URL}/customer-payments/get-by-user`,
        formData,
        {
          timeout: 30000,
          headers: {
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      if (response.data && response.data.status === 'success') {
        const paymentData = response.data.data || [];
        setPayments(paymentData);
        setFilteredPayments(paymentData);
      } else {
        setPayments([]);
        setFilteredPayments([]);
      }
    } catch (error) {
      console.log('Error fetching payments:', error);
      setPayments([]);
      setFilteredPayments([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // View payment history
  const handleViewHistory = payment => {
    const history = payment.history || [];
    if (history.length === 0) {
      Alert.alert(
        'No History',
        'No payment history available for this record.',
      );
      return;
    }
    setSelectedPaymentHistory(history);
    setSelectedPaymentDetails(payment);
    setShowHistoryModal(true);
  };

  // Generate PDF function
  const generatePDF = async paymentId => {
    setGeneratingPdf(true);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/customer-payments/generate-pdf/${paymentId}`,
        {
          timeout: 30000,
          headers: {
            Accept: 'application/json',
          },
        },
      );

      if (response.data && response.data.status) {
        const pdfLink = response.data.pdf_link;
        // Open PDF in browser
        await Linking.openURL(pdfLink);
        Alert.alert('Success', 'PDF opened in browser');
      } else {
        Alert.alert('Error', response.data.message || 'Failed to generate PDF');
      }
    } catch (error) {
      console.log('Error generating PDF:', error);
      Alert.alert('Error', 'Failed to generate PDF. Please try again.');
    } finally {
      setGeneratingPdf(false);
    }
  };

  // Delete payment record
  const deletePayment = async paymentId => {
    try {
      const userId = await AsyncStorage.getItem('userId');

      if (!userId) {
        Alert.alert('Error', 'User not logged in.');
        return;
      }

      Alert.alert(
        'Confirm Delete',
        'Are you sure you want to delete this payment record?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: async () => {
              try {
                const response = await axios.delete(
                  `${API_BASE_URL}/customer-payments/${paymentId}`,
                  {
                    data: {user_id: userId},
                    headers: {
                      Accept: 'application/json',
                      'Content-Type': 'application/json',
                    },
                  },
                );

                if (response.data && response.data.success) {
                  Alert.alert(
                    'Success',
                    'Payment record deleted successfully.',
                  );
                  fetchPayments();
                } else {
                  Alert.alert(
                    'Error',
                    response.data.message || 'Failed to delete record.',
                  );
                }
              } catch (error) {
                console.log('Error deleting payment:', error);
                Alert.alert('Error', 'Failed to delete payment record.');
              }
            },
          },
        ],
      );
    } catch (error) {
      console.log('Error in delete confirmation:', error);
    }
  };

  // Handle edit payment - Only allow editing when status is 'edited'
  const handleEditPayment = payment => {
    if (payment.status === 'edited') {
      navigation.navigate('Addcustomerpayment', {payment});
    } else {
      Alert.alert(
        'Cannot Edit',
        `This payment has status "${getStatusText(
          payment.status,
        )}" and cannot be edited. Only payments with "Edited" status can be modified.`,
      );
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  // Refresh when coming from Addcustomerpayment
  useEffect(() => {
    if (route.params?.refresh) {
      fetchPayments();
    }
  }, [route.params?.refresh]);

  // Filter payments based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredPayments(payments);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = payments.filter(
        payment =>
          payment.chassis_no?.toLowerCase().includes(query) ||
          payment.customer_name?.toLowerCase().includes(query) ||
          formatDate(payment.entry_date)?.toLowerCase().includes(query) ||
          payment.tractor_model?.toLowerCase().includes(query),
      );
      setFilteredPayments(filtered);
    }
  }, [searchQuery, payments]);

  // Format date for display
  const formatDate = dateString => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-GB');
    } catch (error) {
      return 'Invalid Date';
    }
  };

  // Format currency
  const formatCurrency = amount => {
    return `₹${parseFloat(amount || 0).toLocaleString('en-IN')}`;
  };

  // Get status color
  const getStatusColor = status => {
    switch (status) {
      case 'approved':
        return '#4CAF50';
      case 'pending':
        return '#FF9800';
      case 'edited':
        return '#2196F3';
      case 'rejected':
        return '#F44336';
      default:
        return '#666';
    }
  };

  // Get status display text
  const getStatusText = status => {
    switch (status) {
      case 'approved':
        return 'Approved';
      case 'pending':
        return 'Pending';
      case 'edited':
        return 'Edited';
      case 'rejected':
        return 'Rejected';
      default:
        return status;
    }
  };

  // Get status icon
  const getStatusIcon = status => {
    switch (status) {
      case 'approved':
        return 'check-circle';
      case 'pending':
        return 'clock';
      case 'edited':
        return 'edit';
      case 'rejected':
        return 'x-circle';
      default:
        return 'help-circle';
    }
  };

  // Calculate summary statistics
  const totalPayments = payments.reduce(
    (sum, payment) => sum + parseFloat(payment.opening_balance || 0),
    0,
  );
  const totalAmountPaid = payments.reduce(
    (sum, payment) => sum + parseFloat(payment.total_paid || 0),
    0,
  );
  const totalRemaining = totalPayments - totalAmountPaid;
  const totalCustomers = payments.length;

  // Refresh function
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchPayments();
  }, [fetchPayments]);

  // Calculate total from history
  const calculateTotalFromHistory = history => {
    return history.reduce(
      (total, item) => total + parseFloat(item.amount || 0),
      0,
    );
  };

  // Render History Modal
  const renderHistoryModal = () => {
    if (!showHistoryModal) return null;

    return (
      <Modal
        visible={showHistoryModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowHistoryModal(false)}>
        <View style={styles.historyModalOverlay}>
          <View style={styles.historyModalContent}>
            {/* Header with Gradient */}
            <LinearGradient
              colors={['#7E5EA9', '#20AEBC']}
              style={styles.historyModalHeader}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}>
              <View style={styles.historyModalHeaderContent}>
                <View style={styles.historyModalTitleContainer}>
                  <Text style={styles.historyModalTitle}>Payment History</Text>
                </View>
                <TouchableOpacity
                  onPress={() => setShowHistoryModal(false)}
                  style={styles.historyModalCloseButton}>
                  <Icon name="x" size={moderateScale(24)} color="#FFF" />
                </TouchableOpacity>
              </View>
            </LinearGradient>

            {/* Show selected payment info */}
            {/*  */}

            {/* History List Header */}
            

            {/* FlatList for History */}
            <View style={styles.historyListContainer}>
              {selectedPaymentHistory?.length > 0 ? (
                <FlatList
                  data={selectedPaymentHistory}
                  keyExtractor={(item, index) => 
                    item.id?.toString() || `history-${index}`
                  }
                  showsVerticalScrollIndicator={true}
                  contentContainerStyle={styles.historyListContent}
                  renderItem={({item, index}) => {
                    return (
                      <View style={styles.historyItem}>
                        <View style={styles.historyItemHeader}>
                          <View>
                            <Text style={styles.historyAmount}>
                              ₹{parseFloat(item.amount || 0).toLocaleString('en-IN')}
                            </Text>
                            <View style={styles.historyDateContainer}>
                              <Icon
                                name="calendar"
                                size={moderateScale(12)}
                                color="#666"
                              />
                              <Text style={styles.historyDate}>
                                {formatDate(item.entry_date)}
                              </Text>
                            </View>
                          </View>
                          <View style={styles.historyByContainer}>
                            <Icon name="user" size={moderateScale(14)} color="#666" />
                            <Text style={styles.historyBy}>
                              By: {item.entry_by || 'N/A'}
                            </Text>
                          </View>
                        </View>

                        {item.remarks && (
                          <View style={styles.historyRemarksContainer}>
                            <Icon
                              name="message-square"
                              size={moderateScale(12)}
                              color="#666"
                              style={styles.remarksIcon}
                            />
                            <Text style={styles.historyRemarks}>
                              Remarks: {item.remarks}
                            </Text>
                          </View>
                        )}                        
                      </View>
                    );
                  }}
                />
              ) : (
                <View style={styles.noHistoryContainer}>
                  <Icon name="file-text" size={moderateScale(60)} color="#ccc" />
                  <Text style={styles.noHistoryTitle}>No Payment History</Text>
                  <Text style={styles.noHistoryText}>
                    No payment entries recorded yet
                  </Text>
                </View>
              )}

            </View>           
          </View>
        </View>
      </Modal>
    );
  };

  // Render payment item
  const renderPaymentItem = ({item, index}) => {
    const remaining =
      parseFloat(item.opening_balance) - parseFloat(item.total_paid);
    const hasHistory = item.history && item.history.length > 0;

    return (
      <View style={styles.paymentItem}>
        <LinearGradient
          colors={['#7E5EA9', '#20AEBC']}
          style={styles.itemGradientBorder}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}>
          <View style={styles.itemContent}>
            {/* Status Display */}
            <View style={styles.statusContainer}>
              <View
                style={[
                  styles.statusBadge,
                  {backgroundColor: getStatusColor(item.status)},
                ]}>
                <Icon
                  name={getStatusIcon(item.status)}
                  size={moderateScale(14)}
                  color="#FFF"
                />
                <Text style={styles.statusText}>
                  {getStatusText(item.status)}
                </Text>
              </View>

              {/* Edit Button - Only show when status is 'edited' */}
              {item.status === 'edited' && (
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => handleEditPayment(item)}>
                  <LinearGradient
                    colors={['#f0a93fff', '#FF5722']}
                    style={styles.editButtonGradient}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 0}}>
                    <Icon name="edit" size={moderateScale(14)} color="#FFF" />
                    <Text style={styles.editButtonText}>Edit Button</Text>
                  </LinearGradient>
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.itemHeader}>
              <View style={styles.customerInfo}>
                <Text style={styles.customerName}>{item.customer_name}</Text>
                <Text style={styles.customerFather}>
                  {item.father_name || 'N/A'}
                </Text>
              </View>
              <View style={styles.headerActions}>
                <View style={styles.dateBadge}>
                  <Text style={styles.dateText}>
                    {formatDate(item.entry_date)}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.itemDetails}>
              <View style={styles.detailRow}>
                <View style={styles.detailItem}>
                  <Icon name="hash" size={moderateScale(14)} color="#666" />
                  <Text style={styles.detailLabel}>Chassis No:</Text>
                </View>
                <Text style={styles.detailValue}>{item.chassis_no}</Text>
              </View>

              <View style={styles.detailRow}>
                <View style={styles.detailItem}>
                  <Icon name="hash" size={moderateScale(14)} color="#666" />
                  <Text style={styles.detailLabel}>Ledger No:</Text>
                </View>
                <Text style={styles.detailValue}>{item.ledger_no}</Text>
              </View>

              <View style={styles.detailRow}>
                <View style={styles.detailItem}>
                  <Icon name="truck" size={moderateScale(14)} color="#666" />
                  <Text style={styles.detailLabel}>Tractor Model:</Text>
                </View>
                <Text style={styles.detailValue}>{item.tractor_model}</Text>
              </View>

              <View style={styles.detailRow}>
                <View style={styles.detailItem}>
                  <Icon name="calendar" size={moderateScale(14)} color="#666" />
                  <Text style={styles.detailLabel}>Delivery Date:</Text>
                </View>
                <Text style={styles.detailValue}>
                  {formatDate(item.delivery_date)}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <View style={styles.detailItem}>
                  <Icon name="user" size={moderateScale(14)} color="#666" />
                  <Text style={styles.detailLabel}>Entry By:</Text>
                </View>
                <Text style={styles.detailValue}>{item.entry_by || 'N/A'}</Text>
              </View>

              {item.customer_mobile && (
                <View style={styles.detailRow}>
                  <View style={styles.detailItem}>
                    <Icon name="phone" size={moderateScale(14)} color="#666" />
                    <Text style={styles.detailLabel}>Mobile:</Text>
                  </View>
                  <Text style={styles.detailValue}>{item.customer_mobile}</Text>
                </View>
              )}
            </View>

            <View style={styles.paymentSummary}>
              <View style={styles.amountRow}>
                <View style={styles.amountItem}>
                  <Text style={styles.amountLabel}>Opening Balance</Text>
                  <Text style={styles.amountValue}>
                    {formatCurrency(item.opening_balance)}
                  </Text>
                </View>

                <View style={styles.amountItem}>
                  <Text style={styles.amountLabel}>Amount Paid</Text>
                  <Text style={[styles.amountValue, styles.paidAmount]}>
                    {formatCurrency(item.total_paid)}
                  </Text>
                </View>

                <View style={styles.amountItem}>
                  <Text style={styles.amountLabel}>Remaining</Text>
                  <Text
                    style={[
                      styles.amountValue,
                      remaining > 0
                        ? styles.remainingAmount
                        : styles.fullPaidAmount,
                    ]}>
                    {formatCurrency(remaining)}
                  </Text>
                </View>
              </View>
            </View>

            {/* Payment History Summary */}
            {hasHistory && (
              <View style={styles.historySummaryContainer}>
                <View style={styles.historySummaryHeader}>
                  <Icon
                    name="history"
                    size={moderateScale(16)}
                    color="#7E5EA9"
                  />
                  <Text style={styles.historySummaryTitle}>
                    Payment History
                  </Text>
                  <View style={styles.historyCountBadge}>
                    <Text style={styles.historyCountText}>
                      {item.history.length}
                    </Text>
                  </View>
                </View>
                <View style={styles.historySummaryDetails}>
                  <Text style={styles.historySummaryText}>
                    {item.history.length} payment entr
                    {item.history.length > 1 ? 'ies' : 'y'} recorded
                  </Text>
                  <Text style={styles.historySummaryTotal}>
                    Total:{' '}
                    {formatCurrency(calculateTotalFromHistory(item.history))}
                  </Text>
                </View>
              </View>
            )}

            {item.customer_address && (
              <View style={styles.addressContainer}>
                <View style={styles.detailItem}>
                  <Icon name="map-pin" size={moderateScale(14)} color="#666" />
                  <Text style={styles.addressLabel}>Address:</Text>
                </View>
                <Text style={styles.addressValue}>{item.customer_address}</Text>
              </View>
            )}

            {/* Action Buttons Container */}
            <View style={styles.actionButtonsContainer}>
              {/* View History Button - Show for all payments with history */}
              {hasHistory && (
                <TouchableOpacity
                  style={styles.viewHistoryButton}
                  onPress={() => handleViewHistory(item)}>
                  <LinearGradient
                    colors={['#2196F3', '#1976D2']}
                    style={styles.viewHistoryButtonGradient}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 0}}>
                    <Icon name="eye" size={moderateScale(16)} color="#FFF" />
                    <Text style={styles.viewHistoryButtonText}>
                      View History ({item.history.length})
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              )}

              {/* Download PDF Button - Only show when status is 'approved' */}
              {item.status === 'approved' && (
                <TouchableOpacity
                  style={styles.downloadButton}
                  onPress={() => generatePDF(item.id)}
                  disabled={generatingPdf}>
                  <LinearGradient
                    colors={['#4CAF50', '#45a049']}
                    style={styles.downloadButtonGradient}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 0}}>
                    {generatingPdf ? (
                      <ActivityIndicator size="small" color="#FFF" />
                    ) : (
                      <>
                        <Icon
                          name="download"
                          size={moderateScale(16)}
                          color="#FFF"
                        />
                        <Text style={styles.downloadButtonText}>
                          Download PDF
                        </Text>
                      </>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </LinearGradient>
      </View>
    );
  };

  return (
    <View
      style={[
        styles.container,
        {paddingTop: insets.top, paddingBottom: insets.bottom},
      ]}>
      <StatusBar
        barStyle="dark-content"
        translucent
        backgroundColor="transparent"
      />

      {/* Header */}
      <LinearGradient
        colors={['#7E5EA9', '#20AEBC']}
        style={[styles.header, {paddingTop: 10}]}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={moderateScale(24)} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Payment Details</Text>
          <View style={styles.headerRight}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => navigation.navigate('Addcustomerpayment')}>
              <Icon name="plus" size={moderateScale(24)} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      {/* Main Scrollable Content */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#7E5EA9']}
            tintColor="#7E5EA9"
          />
        }>
        {/* Summary Section */}
        <View style={styles.summarySection}>
          <LinearGradient
            colors={['#7E5EA9', '#20AEBC']}
            style={styles.summaryGradient}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}>
            <View style={styles.summaryContent}>
              <Text style={styles.summaryTitle}>Payment Overview</Text>
              <View style={styles.summaryGrid}>
                <View style={styles.summaryItem}>
                  <View style={styles.summaryIconContainer}>
                    <Icon
                      name="dollar-sign"
                      size={moderateScale(20)}
                      color="#7E5EA9"
                    />
                  </View>
                  <Text style={styles.summaryValue}>
                    {formatCurrency(totalPayments)}
                  </Text>
                  <Text style={styles.summaryLabel}>
                    Total Amount Collected
                  </Text>
                </View>

                <View style={styles.summaryItem}>
                  <View style={[styles.summaryIconContainer, styles.paidIcon]}>
                    <Icon
                      name="check-circle"
                      size={moderateScale(20)}
                      color="#4CAF50"
                    />
                  </View>
                  <Text style={styles.summaryValue}>
                    {formatCurrency(totalAmountPaid)}
                  </Text>
                  <Text style={styles.summaryLabel}>Amount Paid</Text>
                </View>

                <View style={styles.summaryItem}>
                  <View
                    style={[styles.summaryIconContainer, styles.remainingIcon]}>
                    <Icon
                      name="clock"
                      size={moderateScale(20)}
                      color="#FF6B6B"
                    />
                  </View>
                  <Text style={styles.summaryValue}>
                    {formatCurrency(totalRemaining)}
                  </Text>
                  <Text style={styles.summaryLabel}>Remaining Balance</Text>
                </View>

                <View style={styles.summaryItem}>
                  <View
                    style={[styles.summaryIconContainer, styles.customerIcon]}>
                    <Icon
                      name="users"
                      size={moderateScale(20)}
                      color="#20AEBC"
                    />
                  </View>
                  <Text style={styles.summaryValue}>{totalCustomers}</Text>
                  <Text style={styles.summaryLabel}>Customers</Text>
                </View>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Search Section */}
        <View style={styles.searchSection}>
          <Text style={styles.sectionTitle}>Search Payments</Text>
          <View style={styles.searchContainer}>
            <View style={styles.searchInputContainer}>
              <Icon
                name="search"
                size={moderateScale(20)}
                color="#7E5EA9"
                style={styles.searchIcon}
              />
              <TextInput
                style={styles.searchInput}
                placeholder="Chassis No, Customer Name, Date, or Tractor Model"
                placeholderTextColor="#999"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity
                  style={styles.clearButton}
                  onPress={() => setSearchQuery('')}>
                  <Icon name="x-circle" size={moderateScale(18)} color="#999" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Results Info */}
          {searchQuery.length > 0 && (
            <View style={styles.resultsInfo}>
              <Text style={styles.resultsText}>
                Found {filteredPayments.length} of {payments.length} payments
              </Text>
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Text style={styles.clearSearchText}>Clear</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Payments List Section */}
        <View style={styles.listSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {searchQuery.length > 0 ? 'Search Results' : 'All Payments'}
            </Text>
            <Text style={styles.sectionSubtitle}>
              {filteredPayments.length} payment
              {filteredPayments.length !== 1 ? 's' : ''} recorded
            </Text>
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#7E5EA9" />
              <Text style={styles.loadingText}>Loading payments...</Text>
            </View>
          ) : filteredPayments.length === 0 ? (
            <View style={styles.emptyState}>
              <LinearGradient
                colors={['#f8f9ff', '#f0f2ff']}
                style={styles.emptyStateGradient}>
                <Icon
                  name="file-text"
                  size={moderateScale(70)}
                  color="#7E5EA9"
                />
                <Text style={styles.emptyStateTitle}>
                  {payments.length === 0
                    ? 'No Payments Yet'
                    : 'No Payments Found'}
                </Text>
                <Text style={styles.emptyStateText}>
                  {payments.length === 0
                    ? 'Start by adding your first customer payment record'
                    : "Try adjusting your search terms to find what you're looking for"}
                </Text>
                {payments.length === 0 && (
                  <TouchableOpacity
                    style={styles.addFirstButton}
                    onPress={() => navigation.navigate('Addcustomerpayment')}>
                    <LinearGradient
                      colors={['#7E5EA9', '#20AEBC']}
                      style={styles.addFirstGradient}
                      start={{x: 0, y: 0}}
                      end={{x: 1, y: 0}}>
                      <Icon name="plus" size={moderateScale(20)} color="#FFF" />
                      <Text style={styles.addFirstText}>Add First Payment</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                )}
              </LinearGradient>
            </View>
          ) : (
            <View style={styles.paymentsList}>
              {filteredPayments.map((item, index) => (
                <View key={item.id}>{renderPaymentItem({item, index})}</View>
              ))}
            </View>
          )}
        </View>

        {/* Bottom Padding */}
        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* History Modal */}
      {renderHistoryModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFF',
  },
  header: {
    paddingHorizontal: moderateScale(20),
    paddingBottom: verticalScale(10),
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: moderateScale(8),
  },
  headerTitle: {
    color: '#FFF',
    fontSize: moderateScale(20),
    fontWeight: '700',
    textAlign: 'center',
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: moderateScale(8),
    marginLeft: moderateScale(5),
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  summarySection: {
    paddingHorizontal: moderateScale(20),
    paddingTop: verticalScale(20),
    paddingBottom: verticalScale(10),
  },
  summaryGradient: {
    borderRadius: moderateScale(20),
    padding: moderateScale(2),
    shadowColor: '#7E5EA9',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  summaryContent: {
    backgroundColor: '#FFF',
    borderRadius: moderateScale(18),
    padding: moderateScale(20),
  },
  summaryTitle: {
    fontSize: moderateScale(18),
    fontWeight: '700',
    color: '#333',
    marginBottom: verticalScale(15),
    textAlign: 'center',
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  summaryItem: {
    width: '48%',
    alignItems: 'center',
    paddingVertical: verticalScale(15),
    marginBottom: verticalScale(10),
  },
  summaryIconContainer: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    backgroundColor: '#F0F2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: verticalScale(8),
  },
  paidIcon: {
    backgroundColor: '#E8F5E8',
  },
  remainingIcon: {
    backgroundColor: '#FFE8E8',
  },
  customerIcon: {
    backgroundColor: '#E0F7FA',
  },
  summaryValue: {
    fontSize: moderateScale(16),
    fontWeight: '800',
    color: '#2D3748',
    marginBottom: verticalScale(4),
  },
  summaryLabel: {
    fontSize: moderateScale(12),
    color: '#666',
    fontWeight: '500',
    textAlign: 'center',
  },
  searchSection: {
    paddingHorizontal: moderateScale(20),
    paddingVertical: verticalScale(15),
  },
  sectionTitle: {
    fontSize: moderateScale(18),
    fontWeight: '700',
    color: '#2D3748',
    marginBottom: verticalScale(12),
  },
  searchContainer: {
    marginBottom: verticalScale(10),
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: moderateScale(10),
    paddingHorizontal: moderateScale(15),
    paddingVertical: moderateScale(12),
    borderWidth: 1,
    borderColor: 'grey',
  },
  searchIcon: {
    marginRight: moderateScale(10),
  },
  searchInput: {
    flex: 1,
    fontSize: moderateScale(16),
    color: '#333',
    padding: 0,
  },
  clearButton: {
    padding: moderateScale(4),
  },
  resultsInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: moderateScale(5),
  },
  resultsText: {
    fontSize: moderateScale(14),
    color: '#666',
    fontStyle: 'italic',
  },
  clearSearchText: {
    fontSize: moderateScale(14),
    color: '#7E5EA9',
    fontWeight: '500',
  },
  listSection: {
    flex: 1,
    paddingHorizontal: moderateScale(20),
    paddingBottom: verticalScale(20),
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(15),
  },
  sectionSubtitle: {
    fontSize: moderateScale(14),
    color: '#666',
    fontWeight: '500',
  },
  paymentsList: {
    paddingBottom: verticalScale(10),
  },
  paymentItem: {
    marginBottom: moderateScale(15),
  },
  itemGradientBorder: {
    borderRadius: moderateScale(15),
    padding: moderateScale(2),
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  itemContent: {
    backgroundColor: '#FFF',
    borderRadius: moderateScale(13),
    padding: moderateScale(18),
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: moderateScale(12),
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: moderateScale(12),
    paddingVertical: moderateScale(6),
    borderRadius: moderateScale(20),
  },
  statusText: {
    fontSize: moderateScale(12),
    fontWeight: '600',
    color: '#FFF',
    marginLeft: moderateScale(4),
  },
  editButton: {
    borderRadius: moderateScale(20),
    overflow: 'hidden',
  },
  editButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: moderateScale(12),
    paddingVertical: moderateScale(6),
    borderRadius: moderateScale(20),
  },
  editButtonText: {
    fontSize: moderateScale(12),
    fontWeight: '600',
    color: '#FFF',
    marginLeft: moderateScale(4),
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: moderateScale(12),
  },
  customerInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: moderateScale(16),
    fontWeight: '700',
    color: '#2D3748',
    marginBottom: moderateScale(2),
  },
  customerFather: {
    fontSize: moderateScale(12),
    color: '#666',
    fontWeight: '500',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateBadge: {
    backgroundColor: '#F0F2FF',
    paddingHorizontal: moderateScale(10),
    paddingVertical: moderateScale(6),
    borderRadius: moderateScale(8),
    marginRight: moderateScale(8),
  },
  dateText: {
    fontSize: moderateScale(11),
    fontWeight: '600',
    color: '#7E5EA9',
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginBottom: moderateScale(12),
  },
  itemDetails: {
    marginBottom: moderateScale(12),
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: moderateScale(8),
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  detailLabel: {
    fontSize: moderateScale(12),
    color: '#666',
    fontWeight: '500',
    marginLeft: moderateScale(6),
  },
  detailValue: {
    fontSize: moderateScale(12),
    color: '#2D3748',
    fontWeight: '600',
    textAlign: 'right',
    flex: 1,
  },
  paymentSummary: {
    backgroundColor: '#F8FAFF',
    borderRadius: moderateScale(10),
    padding: moderateScale(15),
    marginBottom: moderateScale(12),
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  amountItem: {
    alignItems: 'center',
    flex: 1,
  },
  amountLabel: {
    fontSize: moderateScale(10),
    color: '#666',
    fontWeight: '500',
    marginBottom: moderateScale(4),
    textAlign: 'center',
  },
  amountValue: {
    fontSize: moderateScale(14),
    fontWeight: '800',
    color: '#7E5EA9',
    textAlign: 'center',
  },
  paidAmount: {
    color: '#4CAF50',
  },
  remainingAmount: {
    color: '#FF6B6B',
  },
  fullPaidAmount: {
    color: '#4CAF50',
  },
  historySummaryContainer: {
    backgroundColor: '#F0F2FF',
    borderRadius: moderateScale(8),
    padding: moderateScale(12),
    marginBottom: moderateScale(12),
    borderWidth: 1,
    borderColor: '#E0E7FF',
  },
  historySummaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: moderateScale(8),
  },
  historySummaryTitle: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: '#7E5EA9',
    marginLeft: moderateScale(8),
    flex: 1,
  },
  historyCountBadge: {
    backgroundColor: '#7E5EA9',
    paddingHorizontal: moderateScale(8),
    paddingVertical: moderateScale(2),
    borderRadius: moderateScale(10),
  },
  historyCountText: {
    color: '#FFF',
    fontSize: moderateScale(10),
    fontWeight: '700',
  },
  historySummaryDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  historySummaryText: {
    fontSize: moderateScale(12),
    color: '#666',
    fontStyle: 'italic',
  },
  historySummaryTotal: {
    fontSize: moderateScale(12),
    fontWeight: '700',
    color: '#4CAF50',
  },
  addressContainer: {
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: moderateScale(12),
    marginBottom: moderateScale(12),
  },
  addressLabel: {
    fontSize: moderateScale(12),
    color: '#666',
    fontWeight: '500',
    marginLeft: moderateScale(6),
  },
  addressValue: {
    fontSize: moderateScale(12),
    color: '#2D3748',
    fontStyle: 'italic',
    marginTop: moderateScale(4),
    lineHeight: moderateScale(16),
  },
  actionButtonsContainer: {
    gap: moderateScale(10),
  },
  viewHistoryButton: {
    borderRadius: moderateScale(10),
    overflow: 'hidden',
  },
  viewHistoryButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(12),
    borderRadius: moderateScale(10),
  },
  viewHistoryButtonText: {
    color: '#FFF',
    fontSize: moderateScale(14),
    fontWeight: '600',
    marginLeft: moderateScale(8),
  },
  downloadButton: {
    borderRadius: moderateScale(10),
    overflow: 'hidden',
  },
  downloadButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(12),
    borderRadius: moderateScale(10),
  },
  downloadButtonText: {
    color: '#FFF',
    fontSize: moderateScale(14),
    fontWeight: '600',
    marginLeft: moderateScale(8),
  },
  loadingContainer: {
    padding: moderateScale(40),
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: verticalScale(10),
    fontSize: moderateScale(16),
    color: '#666',
    textAlign: 'center',
  },
  emptyState: {
    marginTop: verticalScale(20),
  },
  emptyStateGradient: {
    borderRadius: moderateScale(20),
    padding: moderateScale(40),
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateTitle: {
    fontSize: moderateScale(18),
    fontWeight: '700',
    color: '#2D3748',
    marginTop: verticalScale(15),
    marginBottom: moderateScale(8),
  },
  emptyStateText: {
    fontSize: moderateScale(14),
    color: '#666',
    textAlign: 'center',
    lineHeight: moderateScale(20),
    marginBottom: moderateScale(20),
  },
  addFirstButton: {
    width: '80%',
  },
  addFirstGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(14),
    borderRadius: moderateScale(12),
    shadowColor: '#7E5EA9',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  addFirstText: {
    color: '#FFF',
    fontSize: moderateScale(16),
    fontWeight: '600',
    marginLeft: moderateScale(8),
  },
  bottomPadding: {
    height: verticalScale(30),
  },
  // History Modal Styles
  historyModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: moderateScale(20),
  },
  historyModalContent: {
    backgroundColor: '#FFF',
    borderRadius: moderateScale(20),
    width: '100%',
    minHeight:'50%',
    maxHeight: '90%',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  historyModalHeader: {
    paddingHorizontal: moderateScale(20),
    paddingVertical: moderateScale(15),
  },
  historyModalHeaderContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  historyModalTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyModalTitle: {
    fontSize: moderateScale(20),
    fontWeight: '700',
    color: '#FFF',
    marginLeft: moderateScale(10),
  },
  historyModalCloseButton: {
    padding: moderateScale(5),
  },
  historyPaymentInfo: {
    padding: moderateScale(15),
    backgroundColor: '#F8FAFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E7FF',
  },
  historyPaymentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: moderateScale(10),
  },
  historyPaymentName: {
    fontSize: moderateScale(16),
    fontWeight: '700',
    color: '#2D3748',
    marginBottom: moderateScale(4),
  },
  historyPaymentChassis: {
    fontSize: moderateScale(12),
    color: '#666',
    fontWeight: '500',
    marginBottom: moderateScale(2),
  },
  historyPaymentTractor: {
    fontSize: moderateScale(11),
    color: '#7E5EA9',
    fontWeight: '600',
    fontStyle: 'italic',
  },
  historyPaymentDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: moderateScale(8),
    paddingVertical: moderateScale(4),
    borderRadius: moderateScale(6),
    borderWidth: 1,
    borderColor: '#E0E7FF',
  },
  historyPaymentDate: {
    fontSize: moderateScale(10),
    color: '#7E5EA9',
    fontWeight: '600',
    marginLeft: moderateScale(4),
  },
  historyPaymentDivider: {
    height: 1,
    backgroundColor: '#E0E7FF',
    marginVertical: moderateScale(8),
  },
  historyPaymentTotals: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  historyTotalItem: {
    alignItems: 'center',
    flex: 1,
  },
  historyTotalLabel: {
    fontSize: moderateScale(10),
    color: '#666',
    fontWeight: '500',
    marginBottom: moderateScale(2),
  },
  historyTotalAmount: {
    fontSize: moderateScale(14),
    fontWeight: '800',
    color: '#7E5EA9',
  },
  historyPaidAmount: {
    color: '#4CAF50',
  },
  historyRemainingAmount: {
    color: '#FF6B6B',
  },
  historyListHeader: {
    paddingHorizontal: moderateScale(15),
    paddingVertical: moderateScale(10),
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  historyListHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  historyListHeaderText: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: '#2D3748',
    flex: 1,
    marginLeft: moderateScale(8),
  },
  historyListHeaderTotal: {
    fontSize: moderateScale(14),
    fontWeight: '700',
    color: '#4CAF50',
  },
  historyListContainer: {
    flex: 1,
    maxHeight: verticalScale(300),
    minHeight: verticalScale(200),
    paddingBottom : verticalScale(50),
  },
  historyListContent: {
    padding: moderateScale(15),
    paddingTop: moderateScale(10),
  },
  historyItem: {
    backgroundColor: '#FFF',
    borderRadius: moderateScale(12),
    padding: moderateScale(16),
    marginBottom: moderateScale(12),
    borderWidth: 1,
    borderColor: '#E0E7FF',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  historyItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: moderateScale(8),
  },
  historyAmount: {
    fontSize: moderateScale(22),
    fontWeight: '800',
    color: '#2E7D32',
    marginBottom: moderateScale(4),
  },
  historyDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyDate: {
    fontSize: moderateScale(12),
    color: '#666',
    marginLeft: moderateScale(4),
  },
  historyByContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F2FF',
    paddingHorizontal: moderateScale(10),
    paddingVertical: moderateScale(6),
    borderRadius: moderateScale(8),
  },
  historyBy: {
    fontSize: moderateScale(12),
    color: '#333',
    fontWeight: '500',
    marginLeft: moderateScale(4),
  },
  historyRemarksContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F8F9FF',
    padding: moderateScale(10),
    borderRadius: moderateScale(6),
    marginBottom: moderateScale(8),
  },
  remarksIcon: {
    marginTop: moderateScale(2),
    marginRight: moderateScale(6),
  },
  historyRemarks: {
    fontSize: moderateScale(13),
    color: '#666',
    fontStyle: 'italic',
    flex: 1,
    lineHeight: moderateScale(18),
  },
  historyDivider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: moderateScale(8),
  },
  historyFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  historyIdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyId: {
    fontSize: moderateScale(11),
    color: '#999',
    fontStyle: 'italic',
    marginLeft: moderateScale(4),
  },
  historyTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyTime: {
    fontSize: moderateScale(11),
    color: '#666',
    marginLeft: moderateScale(4),
  },
  noHistoryContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(40),
  },
  noHistoryTitle: {
    fontSize: moderateScale(18),
    fontWeight: '700',
    color: '#666',
    marginTop: verticalScale(15),
    marginBottom: moderateScale(8),
  },
  noHistoryText: {
    fontSize: moderateScale(14),
    color: '#999',
    textAlign: 'center',
  },
  historyModalFooter: {
    padding: moderateScale(20),
    paddingTop: moderateScale(10),
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  closeHistoryButton: {
    borderRadius: moderateScale(12),
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  closeHistoryGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(14),
    borderRadius: moderateScale(12),
  },
  closeHistoryText: {
    color: '#FFF',
    fontSize: moderateScale(16),
    fontWeight: '600',
    marginLeft: moderateScale(8),
  },
});

export default Customerpaymentdetails;