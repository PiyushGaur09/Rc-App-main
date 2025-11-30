// HamburgerPage.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

const MENU_ITEMS = [
  { id: '8', title: 'Home', icon: 'home', navigation: 'Dashboard' },
  { id: '1', title: 'Overview', icon: 'dashboard', navigation: 'Overview' },
  { id: '2', title: 'Stock Location', icon: 'location-on', navigation: 'StockLocation' },
  { id: '3', title: 'Transit Status', icon: 'local-shipping', navigation: 'TransitStatus' },
  { id: '4', title: 'Depot', icon: 'warehouse', navigation: 'Depot' },
  { id: '5', title: 'Billing', icon: 'account-balance-wallet', navigation: 'Finance' },
  { id: '6', title: 'Report', icon: 'insert-chart-outlined', navigation: 'Report' },
  { id: '7', title: 'Add Model', icon: 'add-circle-outline', navigation: 'AddModel' },
   
  { id: '9', title: 'Delivery Form', icon: 'assignment', navigation: 'Form' },
  { id: '10', title: 'All Models', icon: 'inventory', navigation: 'GetAllModel' },
  { id: '11', title: 'All Delivery Form', icon: 'assignment-turned-in', navigation: 'AllDelivery' },
  { id: '12', title: 'Add Model Stocks', icon: 'add-shopping-cart', navigation: 'AddModelStocks' },
  { id: '13', title: 'All Location', icon: 'place', navigation: 'AllLocation' },
];



const HamburgerPage = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const renderItem = ({ item }) => (
    <View style={styles.itemWrapper}>
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => navigation.replace(item.navigation)}
      >
        {/* Left side: Icon + Text */}
        <View style={styles.leftSection}>
          <Icon name={item.icon} size={24} color="#7E5EA9" style={styles.icon} />
          <Text style={styles.menuText}>{item.title}</Text>
        </View>

        {/* Right side: Arrow */}
        <Icon name="arrow-forward-ios" size={20} color="grey" style={styles.iconRight} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      {/* Header with Linear Gradient */}
      <LinearGradient
        colors={['#7E5EA9', '#20AEBC']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerText}>Stock Management</Text>
        </View>
      </LinearGradient>

      {/* Menu List */}
      <FlatList
        data={MENU_ITEMS}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 20 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6f9',
  },
  itemWrapper: {
    borderBottomWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 15,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 10,
  },
  menuText: {
    fontSize: 16,
    fontFamily: 'Inter_28pt-SemiBold',
    textAlign: 'left',
  },
  iconRight: {
    marginLeft: 10,
  },
  header: {
    paddingVertical: 6,
    paddingHorizontal: 20,
  },
  headerContent: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  headerText: {
    fontSize: 20,
    color: '#fff',
    fontFamily: 'Inter_28pt-SemiBold',
    textAlign: 'center',
  },
});

export default HamburgerPage;
