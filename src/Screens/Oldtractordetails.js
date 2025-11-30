import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Image,
  Linking,
  Modal,
  Dimensions,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const {width} = Dimensions.get('window');

const Oldtractordetails = ({navigation}) => {
  const insets = useSafeAreaInsets();
  const [tractorData, setTractorData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(null);
  const [overviewModalVisible, setOverviewModalVisible] = useState(false);
  const [overviewData, setOverviewData] = useState(null);

  // ===== Fetch Data =====
  const fetchTractorData = useCallback(async () => {
    try {
      setLoading(true);
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        Alert.alert('Error', 'No userId found in storage.');
        setLoading(false);
        return;
      }

      console.log('Fetching tractor data for user:', userId);
      
      const formData = new FormData();
      formData.append('user_id', userId);

      const response = await axios.post(
        'https://argosmob.uk/makroo/public/api/v1/tractor-deals/data/get',
        formData,
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data',
          },
          timeout: 30000
        }
      );

      console.log('API Response:', response.data);

      if (response.data && response.data.success && response.data.data) {
        // Use deals array from response
        const dealsData = response.data.data.deals || [];
        
        // Store overview data
        setOverviewData(response.data.data);
        
        // Process the data to ensure picture URLs are properly formatted
        const processedData = dealsData.map(item => {
          // If picture is a relative path, make it absolute
          if (item.picture && !item.picture.startsWith('http')) {
            return {
              ...item,
              picture: `https://argosmob.uk/makroo/public/${item.picture.replace(/^\/+/, '')}`
            };
          }
          return item;
        });
        
        setTractorData(processedData);
        setFilteredData(processedData);
      } else {
        Alert.alert('Info', 'No tractor data found.');
        setTractorData([]);
        setFilteredData([]);
        setOverviewData(null);
      }
    } catch (error) {
      console.log('Error fetching tractor data:', error);
      Alert.alert('Error', 'Failed to fetch tractor data. Please try again.');
      setTractorData([]);
      setFilteredData([]);
      setOverviewData(null);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchTractorData();
  }, [fetchTractorData]);

  // ===== Download PDF Function =====
  const handleDownloadPDF = async (itemId) => {
    try {
      setDownloadingPdf(itemId);
      
      const response = await axios.get(
        `https://argosmob.uk/makroo/public/api/v1/tractor-deals/generate-pdf/${itemId}`,
        {
          timeout: 30000
        }
      );

      console.log('PDF API Response:', response.data);

      if (response.data && response.data.status && response.data.pdf_link) {
        // Try to open the PDF link directly
        try {
          await Linking.openURL(response.data.pdf_link);
          // Don't show success alert as the PDF will open in browser
        } catch (openError) {
          console.log('Error opening URL:', openError);
          Alert.alert(
            'Error', 
            'Cannot open PDF. Please check if you have a PDF viewer app installed or try opening manually in browser.'
          );
        }
      } else {
        Alert.alert('Error', response.data.message || 'Failed to generate PDF');
      }
    } catch (error) {
      console.log('Error downloading PDF:', error);
      Alert.alert('Error', 'Failed to download PDF. Please try again.');
    } finally {
      setDownloadingPdf(null);
    }
  };

  // ===== Search Function =====
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredData(tractorData);
    } else {
      const filtered = tractorData.filter(item =>
        item.customer_name?.toLowerCase().includes(query.toLowerCase()) ||
        item.ledger_no?.toLowerCase().includes(query.toLowerCase()) ||
        item.tractor_model?.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredData(filtered);
    }
  };

  // ===== Profit/Loss Calculation =====
  const calculateProfitLoss = (dealPrice, sellingPrice) => {
    const deal = parseFloat(dealPrice) || 0;
    const selling = parseFloat(sellingPrice) || 0;
    const difference = selling - deal;
    
    return {
      amount: Math.abs(difference),
      type: difference > 0 ? 'profit' : difference < 0 ? 'loss' : 'neutral',
      percentage: deal > 0 ? ((difference / deal) * 100).toFixed(2) : '0.00'
    };
  };

  // ===== Refresh =====
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchTractorData();
  }, [fetchTractorData]);

  // ===== Edit Function =====
  const handleEdit = (item) => {
    // Only allow edit if status is "edited"
    if (item.status === 'edited') {
      navigation.navigate('Addoldtractor', { editData: item });
    } else {
      Alert.alert(
        'Edit Restricted', 
        `This record has status "${item.status}" and cannot be edited. Only records with "edited" status can be modified.`
      );
    }
  };

  // ===== Get Status Color =====
  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return '#4CAF50';
      case 'pending': return '#FF9800';
      case 'rejected': return '#F44336';
      case 'edited': return '#2196F3';
      default: return '#666';
    }
  };

  // ===== Get Status Icon =====
  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return 'check-circle';
      case 'pending': return 'schedule';
      case 'rejected': return 'cancel';
      case 'edited': return 'edit';
      default: return 'help';
    }
  };

  // ===== Format Currency =====
  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return '₹0';
    return `₹${parseFloat(amount).toLocaleString('en-IN')}`;
  };

  // ===== Render Overview Modal =====
  const renderOverviewModal = () => (
    <Modal
      visible={overviewModalVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setOverviewModalVisible(false)}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Modal Header */}
          <LinearGradient
            colors={['#7E5EA9', '#20AEBC']}
            style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Old Tractor Details Overview</Text>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setOverviewModalVisible(false)}>
              <Icon name="close" size={24} color="#fff" />
            </TouchableOpacity>
          </LinearGradient>

          {/* Modal Content */}
          <ScrollView style={styles.modalContent}>
            {overviewData ? (
              <>
                {/* Summary Cards */}
                <View style={styles.summaryRow}>
                  <View style={styles.summaryCard}>
                    <Icon name="inventory" size={30} color="#7E5EA9" />
                    <Text style={styles.summaryNumber}>{overviewData.total_deals_done || 0}</Text>
                    <Text style={styles.summaryLabel}>Total Deals</Text>
                  </View>

                  <View style={styles.summaryCard}>
                    <Icon name="payments" size={30} color="#4CAF50" />
                    <Text style={styles.summaryNumber}>{formatCurrency(overviewData.total_amount || 0)}</Text>
                    <Text style={styles.summaryLabel}>Total Amount Received</Text>
                  </View>
                </View>

                {/* Financial Overview */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Financial Overview</Text>
                  
                  <View style={styles.financialRow}>
                    <View style={styles.financialItem}>
                      <Text style={styles.financialLabel}>Total Deal Price</Text>
                      <Text style={styles.financialValue}>{formatCurrency(overviewData.total_deal_price || 0)}</Text>
                    </View>
                    
                    <View style={styles.financialItem}>
                      <Text style={styles.financialLabel}>Total Selling Price</Text>
                      <Text style={styles.financialValue}>{formatCurrency(overviewData.total_sell_price || 0)}</Text>
                    </View>
                  </View>

                  <View style={styles.financialRow}>
                    <View style={[styles.financialItem, styles.profitItem]}>
                      <Text style={styles.financialLabel}>Total Profit</Text>
                      <Text style={[styles.financialValue, styles.profitText]}>
                        {formatCurrency(overviewData.total_profit || 0)}
                      </Text>
                    </View>
                    
                    <View style={[styles.financialItem, styles.lossItem]}>
                      <Text style={styles.financialLabel}>Total Loss</Text>
                      <Text style={[styles.financialValue, styles.lossText]}>
                        {formatCurrency(overviewData.total_loss || 0)}
                      </Text>
                    </View>
                  </View>

                  {/* Net Profit/Loss */}
                  <View style={[
                    styles.netProfitContainer,
                    (overviewData.net_profit || 0) >= 0 ? styles.netProfitPositive : styles.netProfitNegative
                  ]}>
                    <Icon 
                      name={(overviewData.net_profit || 0) >= 0 ? 'trending-up' : 'trending-down'} 
                      size={28} 
                      color="#fff" 
                    />
                    <View style={styles.netProfitTextContainer}>
                      <Text style={styles.netProfitLabel}>Net Profit/Loss</Text>
                      <Text style={styles.netProfitValue}>
                        {formatCurrency(overviewData.net_profit || 0)}
                      </Text>
                    </View>
                  </View>

                  {/* Payment Summary */}
                  <View style={styles.paymentSummary}>
                    <Text style={styles.sectionTitle}>Payment Summary</Text>
                    <View style={styles.paymentSummaryRow}>
                      <View style={styles.paymentSummaryItem}>
                        <Text style={styles.paymentSummaryLabel}>Total Balance</Text>
                        <Text style={styles.paymentSummaryValue}>
                          {formatCurrency(overviewData.total_balance || 0)}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>

                {/* Status Summary */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Deals Status</Text>
                  <View style={styles.statusSummary}>
                    {tractorData.filter(item => item.status === 'approved').length > 0 && (
                      <View style={styles.statusItem}>
                        <View style={[styles.statusDot, {backgroundColor: '#4CAF50'}]} />
                        <Text style={styles.statusText1}>
                          Approved: {tractorData.filter(item => item.status === 'approved').length}
                        </Text>
                      </View>
                    )}
                    {tractorData.filter(item => item.status === 'pending').length > 0 && (
                      <View style={styles.statusItem}>
                        <View style={[styles.statusDot, {backgroundColor: '#FF9800'}]} />
                        <Text style={styles.statusText1}>
                          Pending: {tractorData.filter(item => item.status === 'pending').length}
                        </Text>
                      </View>
                    )}
                    {tractorData.filter(item => item.status === 'edited').length > 0 && (
                      <View style={styles.statusItem}>
                        <View style={[styles.statusDot, {backgroundColor: '#2196F3'}]} />
                        <Text style={styles.statusText1}>
                          Edited: {tractorData.filter(item => item.status === 'edited').length}
                        </Text>
                      </View>
                    )}
                    {tractorData.filter(item => item.status === 'rejected').length > 0 && (
                      <View style={styles.statusItem}>
                        <View style={[styles.statusDot, {backgroundColor: '#F44336'}]} />
                        <Text style={styles.statusText1}>
                          Rejected: {tractorData.filter(item => item.status === 'rejected').length}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              </>
            ) : (
              <View style={styles.noDataContainer}>
                <Icon name="analytics" size={50} color="#ccc" />
                <Text style={styles.noDataText}>No overview data available</Text>
              </View>
            )}
          </ScrollView>

          {/* Modal Footer */}
          <View style={styles.modalFooter}>
            <TouchableOpacity 
              style={styles.closeModalButton}
              onPress={() => setOverviewModalVisible(false)}>
              <Text style={styles.closeModalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  // ===== Render Item =====
  const renderTractorItem = ({item}) => {
    const profitLoss = calculateProfitLoss(item.deal_price, item.sell_price);
    
    return (
      <View style={styles.card}>
        {/* Header Section */}
        <LinearGradient
          colors={['#7E5EA9', '#20AEBC']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{item.tractor_model}</Text>
          <View style={styles.headerActions}>
            <View style={styles.statusContainer}>
              <Text style={styles.stockText}>{item.stock_type}</Text>
            </View>
            {/* Show edit button only when status is "edited" */}
            {item.status === 'edited' && (
              <TouchableOpacity onPress={() => handleEdit(item)} style={styles.editButton}>
                <Icon name="edit" size={18} color="#fff" />
              </TouchableOpacity>
            )}
          </View>
        </LinearGradient>

        {/* Status Display - Centered below header */}
        <TouchableOpacity style={[styles.statusDisplay, {backgroundColor: getStatusColor(item.status)}]} onPress={() => handleEdit(item)} >
          <Icon name={getStatusIcon(item.status)} size={20} color="#fff" />
          <Text style={styles.statusText}>
            Status: {item.status?.charAt(0).toUpperCase() + item.status?.slice(1)}
          </Text>
        </TouchableOpacity>

        {/* Customer Details */}
        <View style={styles.cardContent}>
          {/* Document Picture */}
          {item.picture ? (
            <View style={styles.documentSection}>
              <Text style={styles.documentLabel}>Tractor Picture:</Text>
              <Image 
                source={{uri: item.picture}} 
                style={styles.documentImage}
                resizeMode="cover"
                onError={(e) => console.log('Image loading error:', e.nativeEvent.error)}
              />
            </View>
          ) : (
            <View style={styles.documentSection}>
              <Text style={styles.documentLabel}>Tractor Picture:</Text>
              <View style={styles.noImageContainer}>
                <Icon name="image-not-supported" size={40} color="#ccc" />
                <Text style={styles.noImageText}>No Image Available</Text>
              </View>
            </View>
          )}

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Customer Name:</Text>
            <Text style={styles.detailValue}>{item.customer_name}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Father's Name:</Text>
            <Text style={styles.detailValue}>{item.father_name}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Ledger No:</Text>
            <Text style={styles.detailValue}>{item.ledger_no}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Mobile No:</Text>
            <Text style={styles.detailValue}>{item.mobile_number}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Chassis No:</Text>
            <Text style={styles.detailValue}>{item.chassis_no}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Entry Date:</Text>
            <Text style={styles.detailValue}>{item.entry_date}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Entered By:</Text>
            <Text style={styles.detailValue}>{item.entry_by}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Year of Manufacture:</Text>
            <Text style={styles.detailValue}>{item.year_of_manufacture}</Text>
          </View>

          <View style={styles.addressRow}>
            <Text style={styles.detailLabel}>Address:</Text>
            <Text style={[styles.detailValue, styles.addressText]}>{item.customer_address}</Text>
          </View>

          {/* Price Section */}
          <View style={styles.priceSection}>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Deal Price:</Text>
              <Text style={styles.priceValue}>₹{parseFloat(item.deal_price || 0).toLocaleString()}</Text>
            </View>

            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Selling Price:</Text>
              <Text style={styles.priceValue}>₹{parseFloat(item.sell_price || 0).toLocaleString()}</Text>
            </View>

            {/* Profit/Loss Section */}
            <View style={[
              styles.profitLossContainer,
              profitLoss.type === 'profit' 
                ? styles.profitBackground 
                : profitLoss.type === 'loss' 
                ? styles.lossBackground 
                : styles.neutralBackground
            ]}>
              <Text style={styles.profitLossTitle}>
                {profitLoss.type === 'profit' 
                  ? '💰 Profit' 
                  : profitLoss.type === 'loss' 
                  ? '📉 Loss' 
                  : '⚖️ No Profit/Loss'
                }
              </Text>
              <View style={styles.profitLossDetails}>
                <Text style={styles.profitLossAmount}>
                  {profitLoss.type !== 'neutral' ? `₹${profitLoss.amount.toLocaleString()}` : '₹0'}
                </Text>
                <Text style={styles.profitLossPercentage}>
                  ({profitLoss.type === 'profit' ? '+' : profitLoss.type === 'loss' ? '' : ''}{profitLoss.percentage}%)
                </Text>
              </View>
            </View>

            {/* Payment Details */}
            <View style={styles.paymentSection}>
              <View style={styles.paymentRow}>
                <Text style={styles.paymentLabel}>Payment Received:</Text>
                <Text style={styles.paymentValue}>₹{parseFloat(item.payment_received || 0).toLocaleString()}</Text>
              </View>

              <View style={styles.paymentRow}>
                <Text style={styles.paymentLabel}>Balance Payment:</Text>
                <Text style={styles.paymentValue}>₹{parseFloat(item.balance_payment || 0).toLocaleString()}</Text>
              </View>
            </View>

            {/* Download PDF Button - Only show for approved status */}
            {item.status === 'approved' && (
              <View style={styles.pdfButtonContainer}>
                <TouchableOpacity
                  style={[styles.pdfButton, downloadingPdf === item.id && styles.pdfButtonDisabled]}
                  onPress={() => handleDownloadPDF(item.id)}
                  disabled={downloadingPdf === item.id}>
                  {downloadingPdf === item.id ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <>
                      <Icon name="picture-as-pdf" size={20} color="#fff" />
                      <Text style={styles.pdfButtonText}>Download PDF</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={{flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom}}>
      {/* Header with Gradient */}
      <LinearGradient
        colors={['#7E5EA9', '#20AEBC']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        style={styles.header}>
        <View style={styles.headerContent}>
          {/* Left Side: Back Icon */}
          <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={25} color="#fff" />
          </TouchableOpacity>

          {/* Center: Dashboard Text */}
          <View style={{flex: 1, alignItems: 'center'}}>
            <Text style={styles.companyName}>Makroo Motor Corp.</Text>
            <Text style={styles.companyName1}>Old Tractor Details</Text>
          </View>

          {/* Right Side: Refresh Icon */}
          <TouchableOpacity style={styles.iconButton} onPress={onRefresh}>
            <Icon name="refresh" size={25} color="#fff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Overview Button */}
      <View style={styles.overviewButtonContainer}>
        <TouchableOpacity 
          style={styles.overviewButton}
          onPress={() => setOverviewModalVisible(true)}>
          <LinearGradient
            colors={['#7E5EA9', '#20AEBC']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={styles.overviewButtonGradient}>
            <Icon name="analytics" size={20} color="#fff" />
            <Text style={styles.overviewButtonText}>Old Tractor Details Overview</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Search Section */}
      <View style={styles.searchContainer}>
        <LinearGradient colors={['#7E5EA9', '#20AEBC']} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={styles.searchGradient}>
          <View style={styles.searchInputContainer}>
            <Icon name="search" size={20} color="#666" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={handleSearch}
              placeholder="Search by Customer Name or Ledger No."
              placeholderTextColor="#666"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => handleSearch('')}>
                <Icon name="close" size={20} color="#666" />
              </TouchableOpacity>
            )}
          </View>
        </LinearGradient>
      </View>

      {/* Results Count */}
      <View style={styles.resultsContainer}>
        <Text style={styles.resultsText}>
          {filteredData.length} {filteredData.length === 1 ? 'record' : 'records'} found
        </Text>
      </View>

      {/* Overview Modal */}
      {renderOverviewModal()}

      {/* Tractor List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#7E5EA9" />
          <Text style={styles.loadingText}>Loading tractor details...</Text>
        </View>
      ) : filteredData.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="inventory" size={60} color="#ccc" />
          <Text style={styles.emptyText}>No tractor records found</Text>
          <Text style={styles.emptySubText}>
            {searchQuery ? 'Try adjusting your search terms' : 'Add new tractor records to see them here'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredData}
          renderItem={renderTractorItem}
          keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#7E5EA9']}
              tintColor="#7E5EA9"
            />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  companyName: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
    fontFamily: 'Inter_28pt-SemiBold',
  },
  companyName1: {
    fontSize: 15,
    fontFamily: 'Inter_28pt-SemiBold',
    color: 'white',
    textAlign: 'center',
  },
  iconButton: {
    padding: 5,
  },
  // Overview Button Styles
  overviewButtonContainer: {
    padding: 15,
    paddingBottom: 10,
  },
  overviewButton: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  overviewButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  overviewButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter_28pt-SemiBold',
    marginLeft: 10,
  },
  // Search Styles
  searchContainer: {
    padding: 15,
    paddingTop: 0,
    paddingBottom: 10,
  },
  searchGradient: {
    borderRadius: 10,
    padding: 1,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 45,
    paddingVertical: 0,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13.5,
    fontFamily: 'Inter_28pt-Regular',
    color: '#000',
  },
  resultsContainer: {
    paddingHorizontal: 15,
    paddingBottom: 10,
  },
  resultsText: {
    fontSize: 14,
    fontFamily: 'Inter_28pt-Medium',
    color: '#666',
    textAlign: 'center',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    width: '100%',
    maxHeight: '80%',
    backgroundColor: '#fff',
    borderRadius: 15,
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Inter_28pt-SemiBold',
    color: '#fff',
    flex: 1,
  },
  closeButton: {
    padding: 5,
  },
  modalContent: {
    maxHeight: '80%',
    padding: 20,
  },
  modalFooter: {
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  closeModalButton: {
    backgroundColor: '#7E5EA9',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeModalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter_28pt-SemiBold',
  },
  // Overview Content Styles
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  summaryNumber: {
    fontSize: 18,
    fontFamily: 'Inter_28pt-Bold',
    color: '#666',
    marginTop: 8,
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    fontFamily: 'Inter_28pt-Medium',
    color: '#666',
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter_28pt-SemiBold',
    color: '#666',
    marginBottom: 15,
    paddingBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: '#7E5EA9',
  },
  financialRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  financialItem: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  profitItem: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    borderColor: 'rgba(76, 175, 80, 0.3)',
  },
  lossItem: {
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
    borderColor: 'rgba(244, 67, 54, 0.3)',
  },
  financialLabel: {
    fontSize: 12,
    fontFamily: 'Inter_28pt-Medium',
    color: '#666',
    marginBottom: 4,
  },
  financialValue: {
    fontSize: 14,
    fontFamily: 'Inter_28pt-SemiBold',
    color: '#666',
  },
  profitText: {
    color: '#4CAF50',
  },
  lossText: {
    color: '#F44336',
  },
  netProfitContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  netProfitPositive: {
    backgroundColor: '#4CAF50',
  },
  netProfitNegative: {
    backgroundColor: '#F44336',
  },
  netProfitTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  netProfitLabel: {
    fontSize: 14,
    fontFamily: 'Inter_28pt-Medium',
    color: '#fff',
  },
  netProfitValue: {
    fontSize: 18,
    fontFamily: 'Inter_28pt-Bold',
    color: '#fff',
    marginTop: 2,
  },
  paymentSummary: {
    marginTop: 15,
  },
  paymentSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  paymentSummaryItem: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  paymentSummaryLabel: {
    fontSize: 12,
    fontFamily: 'Inter_28pt-Medium',
    color: '#666',
    marginBottom: 4,
  },
  paymentSummaryValue: {
    fontSize: 14,
    fontFamily: 'Inter_28pt-SemiBold',
    color: '#20AEBC',
  },
  statusSummary: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
    marginBottom: 10,
    padding: 8,
    backgroundColor: '#f8f9fa',
    borderRadius: 6,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Inter_28pt-Medium',
    color: '#666',
  },
  noDataContainer: {
    alignItems: 'center',
    padding: 40,
  },
  noDataText: {
    fontSize: 16,
    fontFamily: 'Inter_28pt-Medium',
    color: '#666',
    marginTop: 10,
    textAlign: 'center',
  },
  // Existing styles (keep all your existing styles below)
  listContainer: {
    padding: 15,
    paddingTop: 5,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: 'Inter_28pt-SemiBold',
    color: '#fff',
    flex: 1,
  },
  statusContainer: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 15,
    marginRight: 10,
  },
  stockText: {
    fontSize: 12,
    fontFamily: 'Inter_28pt-Medium',
    color: '#fff',
  },
  editButton: {
    padding: 5,
  },
  statusDisplay: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    marginHorizontal: 15,
    marginTop: 10,
    borderRadius: 8,
  },
  statusText: {
    color: 'white',
    marginLeft: 8,
    fontSize: 14,
    fontFamily: 'Inter_28pt-SemiBold',
  },
  statusText1: {
    color: '#666',
    marginLeft: 8,
    fontSize: 14,
    fontFamily: 'Inter_28pt-SemiBold',
  },
  cardContent: {
    padding: 15,
  },
  documentSection: {
    marginBottom: 15,
    alignItems: 'center',
  },
  documentLabel: {
    fontSize: 14,
    fontFamily: 'Inter_28pt-Medium',
    color: '#666',
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  documentImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  noImageContainer: {
    width: '100%',
    height: 200,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noImageText: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    fontFamily: 'Inter_28pt-Regular',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  addressRow: {
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    fontFamily: 'Inter_28pt-Medium',
    color: '#666',
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    fontFamily: 'Inter_28pt-Regular',
    color: '#000',
    flex: 2,
    textAlign: 'right',
  },
  addressText: {
    textAlign: 'left',
    marginTop: 4,
  },
  priceSection: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  priceLabel: {
    fontSize: 14,
    fontFamily: 'Inter_28pt-SemiBold',
    color: '#666',
  },
  priceValue: {
    fontSize: 14,
    fontFamily: 'Inter_28pt-SemiBold',
    color: '#7E5EA9',
  },
  profitLossContainer: {
    marginTop: 10,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  profitBackground: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(76, 175, 80, 0.3)',
  },
  lossBackground: {
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(244, 67, 54, 0.3)',
  },
  neutralBackground: {
    backgroundColor: 'rgba(158, 158, 158, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(158, 158, 158, 0.3)',
  },
  profitLossTitle: {
    fontSize: 16,
    fontFamily: 'Inter_28pt-SemiBold',
    color: '#666',
    marginBottom: 4,
  },
  profitLossDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profitLossAmount: {
    fontSize: 18,
    fontFamily: 'Inter_28pt-Bold',
    color: '#666',
    marginRight: 5,
  },
  profitLossPercentage: {
    fontSize: 14,
    fontFamily: 'Inter_28pt-Medium',
    color: '#666',
  },
  paymentSection: {
    marginTop: 15,
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  paymentLabel: {
    fontSize: 14,
    fontFamily: 'Inter_28pt-Medium',
    color: '#666',
  },
  paymentValue: {
    fontSize: 14,
    fontFamily: 'Inter_28pt-SemiBold',
    color: '#20AEBC',
  },
  pdfButtonContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  pdfButton: {
    flexDirection: 'row',
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 160,
  },
  pdfButtonDisabled: {
    backgroundColor: '#81C784',
    opacity: 0.7,
  },
  pdfButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter_28pt-SemiBold',
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    fontFamily: 'Inter_28pt-Medium',
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontFamily: 'Inter_28pt-SemiBold',
    color: '#666',
    marginTop: 15,
    textAlign: 'center',
  },
  emptySubText: {
    fontSize: 14,
    fontFamily: 'Inter_28pt-Regular',
    color: '#999',
    marginTop: 5,
    textAlign: 'center',
  },
});

export default Oldtractordetails;