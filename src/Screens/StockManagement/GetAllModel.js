// GetAllModel.js
import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_URL = 'https://argosmob.uk/makroo/public/api/v1/model/tractor-models';

// fallback placeholder image if model_picture is null
const PLACEHOLDER_IMG = 'https://image2url.com/images/1759736975224-fc97ba4f-b1b8-4087-a3e7-64a27c57d201.png';

const GetAllModel = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchModels = useCallback(async (isRefresh = false) => {
    try {
      if (!isRefresh) setLoading(true);
      const userId = await AsyncStorage.getItem('userId');

      // Request: include user_id as query param; many APIs also accept GET without it.
      // We also filter client-side below to be safe.
      const url = userId ? `${API_URL}?user_id=${encodeURIComponent(userId)}` : API_URL;

      const res = await axios.get(url, {timeout: 30000});
      const data = Array.isArray(res?.data?.data) ? res.data.data : [];

      // If userId exists, filter for that user; otherwise show all.
      const filtered = userId ? data.filter(x => String(x.user_id) === String(userId)) : data;

      setModels(filtered);
    } catch (err) {
      console.log('GetAllModel fetch error:', err?.message, err?.response?.status, err?.response?.data);
      Alert.alert('Error', 'Unable to load models. Please try again.');
    } finally {
      if (!isRefresh) setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchModels(false);
  }, [fetchModels]);

  useFocusEffect(
    useCallback(() => {
      // Refresh whenever screen gains focus
      fetchModels(true);
    }, [fetchModels]),
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchModels(true);
  }, [fetchModels]);

  const renderItem = ({item}) => {
    const imageUri = item.model_picture ? item.model_picture : PLACEHOLDER_IMG;
    return (
      <TouchableOpacity
        style={styles.locationItem}
        onPress={() => navigation.navigate('ModelDetail', {model: item})}>
        <View style={styles.locationRow}>
          <View style={styles.imageTextContainer}>
            <Image source={{uri: `https://argosmob.uk/makroo/public/${imageUri}`}} style={styles.tractorImage} resizeMode="cover" />
            <View style={styles.textContainer}>
              <Text style={styles.locationText}>{item.model_name || '-'}</Text>
              <Text style={styles.locationYear}>{item.year || '-'}</Text>
              {/* Optional extra lines if you want: */}
              <Text style={styles.metaLine}>Engine: {item.engine_type || '-'}</Text>
              <Text style={styles.metaLine}>HP: {item.horsepower || '-'}</Text>
             
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, {paddingTop: insets.top, paddingBottom: insets.bottom}]}>
        <LinearGradient
          colors={['#7E5EA9', '#20AEBC']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          style={styles.header}>
          <View style={styles.headerContent}>
            <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Hamburger')}>
              <Icon name="reorder" size={25} color="#fff" />
            </TouchableOpacity>
            <View>
              <Text style={styles.headerText}>Makroo Motor Corp.</Text>
              <Text style={styles.headerText1}>All Models</Text>
            </View>
            <TouchableOpacity style={styles.iconButton}>
              <Icon name="notifications-on" size={25} color="#fff" />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        <View style={[styles.loadingWrap, {paddingHorizontal: 15}]}>
          <ActivityIndicator />
          <Text style={styles.loadingText}>Loading models…</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, {paddingTop: insets.top, paddingBottom: insets.bottom}]}>
      {/* Header */}
      <LinearGradient
        colors={['#7E5EA9', '#20AEBC']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Hamburger')}>
            <Icon name="reorder" size={25} color="#fff" />
          </TouchableOpacity>

          <View>
            <Text style={styles.headerText}>Makroo Motor Corp.</Text>
            <Text style={styles.headerText1}>All Models</Text>
          </View>

          <TouchableOpacity style={styles.iconButton}>
            <Icon name="notifications-on" size={25} color="#fff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={{paddingHorizontal: 15, paddingVertical: 20}}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Delivered Model</Text>
          <TouchableOpacity style={styles.totalButton} activeOpacity={0.8}>
            <Text style={styles.totalButtonText}>Total- {models.length}</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={models}
          keyExtractor={item => String(item.id)}
          renderItem={renderItem}
          scrollEnabled={false}
          contentContainerStyle={styles.flatListContent}
          ListEmptyComponent={
            <View style={{paddingVertical: 40, alignItems: 'center'}}>
              <Text style={{color: '#666'}}>No models found.</Text>
            </View>
          }
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff'},
  header: {paddingVertical: 6, paddingHorizontal: 20},
  headerContent: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'},
  headerText: {fontSize: 18.5, color: '#fff', fontFamily: 'Inter_28pt-SemiBold'},
  headerText1: {fontSize: 14.5, color: '#fff', fontFamily: 'Inter_28pt-SemiBold', textAlign: 'center', top: -4},
  iconButton: {top: -6},

  sectionHeader: {flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 5, marginBottom: 15},
  sectionTitle: {fontSize: 15, color: '#000', marginBottom: 8, fontFamily: 'Inter_28pt-SemiBold', flex: 1},
  totalButton: {backgroundColor: '#7E5EA9', paddingHorizontal: 6, borderRadius: 5, paddingVertical: 3, alignSelf: 'center'},
  totalButtonText: {color: 'white', fontFamily: 'Inter_28pt-SemiBold'},

  flatListContent: {gap: 5, marginVertical: 0, paddingHorizontal: 0},
  locationItem: {borderRadius: 10, padding: 12, marginVertical: 4},
  locationRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
  imageTextContainer: {flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1},
  tractorImage: {width: 60, height: 60, borderRadius: 8, backgroundColor: '#f0f0f0', borderWidth: 1},
  textContainer: {flexDirection: 'column'},
  locationText: {fontSize: 15, color: '#000', fontFamily: 'Inter_28pt-SemiBold', marginBottom: 4},
  locationYear: {fontSize: 12, color: '#666', fontFamily: 'Inter_28pt-Regular'},
  metaLine: {fontSize: 12, color: '#7E5EA9', fontFamily: 'Inter_28pt-SemiBold'},

  loadingWrap: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  loadingText: {marginTop: 8, color: '#666'},
});

export default GetAllModel;
