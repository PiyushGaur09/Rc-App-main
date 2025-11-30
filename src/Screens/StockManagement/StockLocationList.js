// StockLocation.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Image
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';

const LOCATION_DATA = [
  {id: '1', Model: '5050D Gear Pro', year:"2023",image:"https://i.ibb.co/n8MyHCgd/tractor.jpg"},
  {id: '2', Model: '5050D 4WD Gear Pro', year:"2022",image:"https://i.ibb.co/n8MyHCgd/tractor.jpg"},
  {id: '3', Model: '5050 Gear Pro', year:"2022",image:"https://i.ibb.co/n8MyHCgd/tractor.jpg"},
  {id: '4', Model: '5210 Gear Pro', year:"2021",image:"https://i.ibb.co/n8MyHCgd/tractor.jpg"},
  {id: '5', Model: '5210 4WD Gear Pro', year:"2022",image:"https://i.ibb.co/n8MyHCgd/tractor.jpg"},
  {id: '6', Model: '5050D Gear Pro', year:"2021",image:"https://i.ibb.co/n8MyHCgd/tractor.jpg"},
  {id: '7', Model: '3036EN', year:"2022",image:"https://i.ibb.co/n8MyHCgd/tractor.jpg"},
  {id: '8', Model: '3036EN', year:"2022",image:"https://i.ibb.co/n8MyHCgd/tractor.jpg"},
];

const StockLocationList = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const renderLocation = ({item}) => (
    <TouchableOpacity style={styles.locationItem} onPress={()=> navigation.navigate("ModelDetail")}>
      <View style={styles.locationRow}>
        <View style={styles.imageTextContainer}>
          <Image 
            source={{ uri: item.image }}
            style={styles.tractorImage} 
            resizeMode="cover"
          />
          <View style={styles.textContainer}>
            <Text style={styles.locationText}>{item.Model}</Text>
            <Text style={styles.locationYear}>{item.year}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container,{paddingTop: insets.top, paddingBottom: insets.bottom},]}>
      {/* Header with Linear Gradient */}
      <LinearGradient
        colors={['#7E5EA9', '#20AEBC']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        style={styles.header}>
        <View style={styles.headerContent}>
          {/* Left Side: Menu Icon */}
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={() => navigation.navigate("Hamburger")}
          >
            <Icon name="reorder" size={25} color="#fff" />
          </TouchableOpacity>
          
          {/* Center: Dashboard Text */}
          <View>
            <Text style={styles.headerText}>Makroo Motor Corp.</Text>
            <Text style={styles.headerText1}>Stock Location</Text>
          </View>

          {/* Right Side: Icon */}
          <TouchableOpacity style={styles.iconButton}>
            <Icon name="notifications-on" size={25} color="#fff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>
      
      <ScrollView contentContainerStyle={{paddingHorizontal: 15, paddingVertical: 20}}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Model In Stock</Text>
          <TouchableOpacity style={styles.totalButton}>
            <Text style={styles.totalButtonText}>Total- 8</Text>
          </TouchableOpacity>
        </View>
        
        <FlatList
          data={LOCATION_DATA}
          keyExtractor={item => item.id}
          renderItem={renderLocation}
          scrollEnabled={false}
          contentContainerStyle={styles.flatListContent}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:"#fff"
  },
  header: {
    paddingVertical: 6,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerText: {
    fontSize: 18.5,
    color: '#fff',
    fontFamily: 'Inter_28pt-SemiBold',
  },
  headerText1: {
    fontSize: 14.5,
    color: '#fff',
    fontFamily: 'Inter_28pt-SemiBold',
    textAlign: 'center',
    top: -4,
  },
  iconButton: {
    top: -6,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
    marginBottom: 15
  },
  sectionTitle: {
    fontSize: 15,
    color: '#000',
    marginBottom: 8,
    fontFamily: 'Inter_28pt-SemiBold',
    flex: 1,
  },
  totalButton: {
    backgroundColor: '#7E5EA9',
    paddingHorizontal: 6,
    borderRadius: 5,
    paddingVertical: 3,
    alignSelf: 'center',
  },
  totalButtonText: {
    color: 'white', 
    fontFamily: 'Inter_28pt-SemiBold'
  },
  flatListContent: {
    gap: 5, 
    marginVertical: 0,
    paddingHorizontal: 0
  },
  locationItem: {

    borderRadius: 10,
    padding: 12,
    marginVertical: 4,

  },
  locationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  imageTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  tractorImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    borderWidth:1,
  },
  textContainer: {
    flexDirection: 'column',
  },
  locationText: {
    fontSize: 15,
    color: '#000',
    fontFamily: 'Inter_28pt-SemiBold',
    marginBottom: 4,
  },
  locationYear: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'Inter_28pt-Regular',
  },
  locationUnits: {
    fontSize: 12.5,
    fontFamily: 'Inter_28pt-SemiBold',
    color: '#7E5EA9'
  },
});

export default StockLocationList;