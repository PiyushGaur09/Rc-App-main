import React, {useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Image,
  TextInput,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Customerspage = ({navigation}) => {
  const insets = useSafeAreaInsets();
  const [byRegistration, setByRegistration] = useState(false);

  // Sample customer data
  const customers = [
    {
      id: 1,
      name: 'Ethan Harper',
      vehicle: 'Toyota Camry',
      image: require('../Asset/Images/c1.jpg'),
    },
    {
      id: 2,
      name: 'Olivia Bennett',
      vehicle: 'Honda Civic',
      image: require('../Asset/Images/c2.jpg'),
    },
    {
      id: 3,
      name: 'Noah Carter',
      vehicle: 'Ford F-150',
      image: require('../Asset/Images/c3.jpg'),
    },
    {
      id: 4,
      name: 'Ava Mitchell',
      vehicle: 'Chevrolet Silverado',
      image: require('../Asset/Images/c4.jpg'),
    },
    {
      id: 5,
      name: 'Liam Foster',
      vehicle: 'Tesla Model 3',
      image: require('../Asset/Images/c5.jpg'),
    },
    {
      id: 6,
      name: 'Sophia Reynolds',
      vehicle: 'BMW 3 Series',
      image: require('../Asset/Images/c6.jpg'),
    },
    {
      id: 7,
      name: 'Jackson Hayes',
      vehicle: 'Mercedes-Benz C-Class',
      image: require('../Asset/Images/c7.jpg'),
    },
    {
      id: 8,
      name: 'Isabella Coleman',
      vehicle: 'Audi A4',
      image: require('../Asset/Images/c8.jpg'),
    },
  ];

  // Render Item for FlatList
  const renderCustomer = ({item}) => (
    <TouchableOpacity
      style={styles.customerItem}
      onPress={() =>
        navigation.navigate('Customerinternalpage', {customer: item})
      }>
      <Image source={item.image} style={styles.customerImage} />
      <View style={styles.customerInfo}>
        <Text style={styles.customerName}>{item.name}</Text>
        <Text style={styles.customerVehicle}>Vehicle: {item.vehicle}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View
      style={[
        styles.container,
        {paddingTop: insets.top, paddingBottom: insets.bottom},
      ]}>
      <StatusBar backgroundColor="white" barStyle="dark-content" />

      {/* Gradient Header */}
      <LinearGradient colors={['#7E5EA9', '#20AEBC']} style={styles.header}>
        <Text style={styles.title}>Customers</Text>
        <TouchableOpacity style={styles.plusIcon}>
          <Icon name="add" size={28} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>

      {/* Search Box */}
      <View style={styles.filterSection}>
        <View style={styles.searchWrapper}>
          <Icon name="search" size={22} color="" style={styles.searchIcon} />
          <TextInput
            placeholder="By Registration / Chassis No."
            placeholderTextColor="#888"
            style={styles.searchInput}
          />
        </View>
      </View>

      {/* Customers List */}
      <FlatList
        data={customers}
        renderItem={renderCustomer}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.customersList}
        showsVerticalScrollIndicator={false}
      />
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
    marginBottom: 20,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  title: {
    fontSize: 24,
    color: '#fff',
    textAlign: 'center',
    fontFamily: 'Inter_28pt-SemiBold',
  },
  plusIcon: {
    position: 'absolute',
    right: 20,
  },
  filterSection: {
    marginBottom: 18,
    paddingHorizontal: 15,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
    color: '#000',
    fontFamily: 'Inter_28pt-Regular',
  },
  customersList: {
    paddingBottom: 20,
  },
  customerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  customerImage: {
    width: 50,
    height: 50,
    borderRadius: 30,
    marginRight: 15,
  },
  customerInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    marginBottom: 2,
    fontFamily: 'Inter_28pt-Medium',
  },
  customerVehicle: {
    fontSize: 13,
    color: 'grey',
    fontFamily: 'Inter_28pt-Regular',
  },
});

export default Customerspage;