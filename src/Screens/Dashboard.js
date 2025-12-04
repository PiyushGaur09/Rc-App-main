import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  StatusBar,
  Alert
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
const Dashboard = ({navigation}) => {
  const insets = useSafeAreaInsets();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              // Clear all user data from AsyncStorage
              await AsyncStorage.multiRemove([
                'userData',
                'userId',
              ]);

              // Navigate to Login screen
              navigation.reset({
                index: 0,
                routes: [{name: 'LoginScreen'}],
              });

              Alert.alert('Success', 'Logged out successfully');
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          },
        },
      ],
      {cancelable: true},
    );
  };

  const menuItems = [
    {
      id: '1',
      title: 'Stock Management',
      colors: ['#7E5EA9', '#20AEBC'],
      navigation: 'Overview',
    },
    {
      id: '3',
      title: 'RC Delivery',
      colors: ['#7E5EA9', '#20AEBC'],
      navigation: 'Rcpage',
    },
    {
      id: '4',
      title: 'PDI Inspection',
      colors: ['#AC62A1', '#EF8549'],
      navigation: 'PDIPage',
    },
    {
      id: '6',
      title: 'Delivery Challan',
      colors: ['#1AB3BB', '#324162'],
      navigation: 'DeliveryChallan',
    },
    {
      id: '7',
      title: 'Form Status',
      colors: ['#7E5EA9', '#20AEBC'],
      navigation: 'Formstatus1',
    },
    {
      id: '8',
      title: 'Payment Management ',
      colors: ['#AC62A1', '#20AEBC'],
      navigation: 'Paymentmanagement',
    },
    {
      id: '9',
      title: 'Old Tractor Management ',
      colors: ['#AC62A1', '#20AEBC'],
      navigation: 'Oldtractormanagement',
    },
  ];

  const renderMenuItem = ({item}) => (
    <TouchableOpacity
      onPress={() => navigation.navigate(item.navigation)}
      style={styles.menuBox}>
      <LinearGradient
        colors={item.colors}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        style={styles.menuGradient}>
        <Text style={styles.menuText}>{item.title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  const keyExtractor = item => item.id;

  return (
    <View
      style={[
        styles.container,
        {paddingTop: insets.top, paddingBottom: insets.bottom},
      ]}>
      <StatusBar backgroundColor="white" barStyle="dark-content" />
      {/* Header with Linear Gradient */}
      <LinearGradient
        colors={['#7E5EA9', '#20AEBC']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        style={styles.header}>
        <View style={styles.headerContent}>
          {/* Left Side: Image */}

          <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
            <Image
              source={require('../Asset/Images/profilerc.jpg')}
              style={styles.headerImage}
            />
          </TouchableOpacity>

          {/* Center: Dashboard Text */}
          <Text style={styles.headerText}>Dashboard</Text>

          {/* Right Side: Icon */}
          <TouchableOpacity style={styles.iconButton} onPress={handleLogout}>
            <Icon name="logout" size={25} color="#fff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* FlatList for Menu Items */}
      <FlatList
        data={menuItems}
        renderItem={renderMenuItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.menuContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerImage: {
    height: 45,
    width: 45,
    borderRadius: 35,
  },
  headerText: {
    fontSize: 22,
    color: '#fff',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 10,
    fontFamily: 'Inter_28pt-SemiBold',
  },
  iconButton: {
    padding: 5,
  },
  menuContainer: {
    padding: 20,
  },
  menuBox: {
    width: '100%',
    height: 60,
    borderRadius: 10,
    marginBottom: 15,
    overflow: 'hidden',
  },
  menuGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuText: {
    color: '#fff',
    fontSize: 16.5,
    fontFamily: 'Inter_28pt-SemiBold',
  },
});

export default Dashboard;
