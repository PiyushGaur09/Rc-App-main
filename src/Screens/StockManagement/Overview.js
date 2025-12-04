
import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import axios from 'axios';

const API_MODEL_STOCKS =
  'https://argosmob.uk/makroo/public/api/v1/model-stocks';

export default function Overview() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const [data, setData] = useState([]); // array of model-stock entries from API
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // map API item to UI card model
  const mapApiItemToCard = item => {
    const model = item?.model ?? {};
    const location = item?.location ?? {};
    // prefer tractor_model then model_name
    const modelTitle =
      model?.tractor_model || model?.model_name || `Model ${model?.id ?? ''}`;
    const modelSubtitle = model?.model_name
      ? `${model.model_name} (${model.year ?? ''})`
      : '';

    return {
      raw: item,
      id: String(item?.id ?? `${model?.id}-${location?.id}`),
      title: modelTitle,
      subtitle: modelSubtitle,
      locationName: location?.location_name || 'Unknown location',
      locationAddress: location?.address || '',
      location_stock: Number(item?.location_stock ?? 0),
      depot_stock: Number(item?.depot_stock ?? 0),
      in_transit: Number(item?.in_transit ?? 0),
      delivered: Number(item?.delivered ?? 0),
      billed: Number(item?.billed ?? 0),
      billed_cash: item?.billed_cash || 'N/A',
      billed_bank: item?.billed_bank || 'N/A',
      model_picture: model?.model_picture ?? null,
      model_id: item?.model_id ?? model?.id ?? null,
      location_id: item?.location_id ?? location?.id ?? null,
    };
  };

  const fetchOverview = async (isPullToRefresh = false) => {
    try {
      if (isPullToRefresh) setRefreshing(true);
      else setLoading(true);

      const res = await axios.get(API_MODEL_STOCKS, {
        timeout: 12000,
        maxBodyLength: Infinity,
      });

      // API returns {status, message, data: [...]}
      const arr = Array.isArray(res?.data?.data) ? res.data.data : [];
      const mapped = arr.map(mapApiItemToCard);
      setData(mapped);
      // optional: you may want to dedupe/group by model for another screen
      // console.log('Mapped overview data:', JSON.stringify(mapped, null, 2));
    } catch (err) {
      console.log(
        'model-stocks API error:',
        err?.response?.data || err?.message || err,
      );
      const msg = err?.response?.data?.message || 'Failed to load stocks.';
      Alert.alert('Error', msg);
      setData([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOverview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchOverview();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  const renderCard = ({item}) => {
    return (
      <LinearGradient
        colors={['#7E5EA9', '#20AEBC']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        style={styles.gradientBorder}>
        <View style={styles.cardContainer}>
          <View style={styles.cardGradient}>
            <View style={styles.headerRow}>
              <View style={styles.modelInfoContainer}>
                {item.model_picture ? (
                  <Image
                    source={{
                      uri: `https://argosmob.uk/makroo/public/${item.model_picture}`,
                    }}
                    style={styles.modelImage}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.modelImagePlaceholder}>
                    <Icon name="agriculture" size={20} color="#fff" />
                  </View>
                )}

                <View style={styles.textContainer}>
                  <Text style={styles.title} numberOfLines={3}>
                    {item.title}
                  </Text>
                  {item.subtitle ? (
                    <Text style={styles.modelSub} numberOfLines={2}>
                      {item.subtitle}
                    </Text>
                  ) : null}
                </View>
              </View>

              <TouchableOpacity
                style={styles.unitBadge}
                onPress={() =>
                  Alert.alert(
                    'Stock info',
                    `Location stock: ${item.location_stock}\nDepot stock: ${item.depot_stock}\nBilled Cash: ${item.billed_cash}\nBilled Bank: ${item.billed_bank}`,
                  )
                }>
                <Text style={styles.subtitle}>{item.location_stock} @ loc</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Location row */}
          <View style={styles.metricsRow}>
            <View style={{flex: 1}}>
              <Text style={styles.smallLabel}>Location</Text>
              <Text style={styles.metricValueLeft}>{item.locationName}</Text>
              {item.locationAddress ? (
                <Text style={styles.smallMuted}>{item.locationAddress}</Text>
              ) : null}
            </View>

            <View style={{alignItems: 'flex-end'}}>
              <Text style={styles.smallLabel}>Depot stock</Text>
              <Text style={styles.metricValueRight}>{item.depot_stock}</Text>
            </View>
          </View>

          {/* Metrics row */}
          <View style={[styles.metricsRow, {paddingTop: 6}]}>
            <View style={styles.metricCol}>
              <Icon
                name="swap-horiz"
                size={18}
                color="#7E5EA9"
                style={styles.metricIcon}
              />
              <View>
                <Text style={styles.metricLabel}>In Transit</Text>
                <Text style={styles.metricValue}>{item.in_transit}</Text>
              </View>
            </View>

            <View style={styles.metricCol}>
              <Icon
                name="local-shipping"
                size={18}
                color="#7E5EA9"
                style={styles.metricIcon}
              />
              <View>
                <Text style={styles.metricLabel}>Delivered</Text>
                <Text style={styles.metricValue}>{item.delivered}</Text>
              </View>
            </View>

            <View style={styles.metricCol}>
              <Icon
                name="receipt"
                size={18}
                color="#7E5EA9"
                style={styles.metricIcon}
              />
              <View>
                <Text style={styles.metricLabel}>Billed</Text>
                <Text style={styles.metricValue}>{item.billed}</Text>
              </View>
            </View>
          </View>

          {/* Billed Cash & Bank row */}
          <View style={[styles.metricsRow, {paddingTop: 6}]}>
            <View style={styles.metricCol}>
              <Icon
                name="attach-money"
                size={18}
                color="#7E5EA9"
                style={styles.metricIcon}
              />
              <View>
                <Text style={styles.metricLabel}>Billed Cash</Text>
                <Text style={styles.metricValue}>{item.billed_cash}</Text>
              </View>
            </View>

            <View style={styles.metricCol}>
              <Icon
                name="account-balance"
                size={18}
                color="#7E5EA9"
                style={styles.metricIcon}
              />
              <View>
                <Text style={styles.metricLabel}>Billed Bank</Text>
                <Text style={styles.metricValue}>{item.billed_bank}</Text>
              </View>
            </View>

            <View style={styles.metricCol}>
              {/* Empty spacer to maintain layout */}
            </View>
          </View>

          <View
            style={[
              styles.metricsRow,
              {justifyContent: 'flex-end', paddingTop: 10},
            ]}>
            <TouchableOpacity
              style={styles.detailsButton}
              onPress={() =>
                navigation.navigate('Overviewinternal', {
                  id: item.id,
                })
              }>
              <Text style={styles.detailsText}>View Details</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    );
  };

  return (
    <View
      style={[
        styles.safe,
        {paddingTop: insets.top, paddingBottom: insets.bottom},
      ]}>
      <LinearGradient
        colors={['#7E5EA9', '#20AEBC']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.navigate('Hamburger')}>
            <Icon name="reorder" size={25} color="#fff" />
          </TouchableOpacity>

          <View>
            <Text style={styles.headerText}>Makroo Motor Corp.</Text>
            <Text style={styles.headerText1}>Overview</Text>
          </View>

          <TouchableOpacity style={styles.iconButton}>
            <Icon name="notifications-on" size={25} color="#fff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {loading ? (
        <View style={{paddingTop: 40}}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <FlatList
          data={data}
          ListHeaderComponent={
            <Text style={styles.listHeading}>Model Inventory Overview</Text>
          }
          keyExtractor={i => i.id}
          renderItem={renderCard}
          refreshing={refreshing}
          onRefresh={() => fetchOverview(true)}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No data available.</Text>
          }
          contentContainerStyle={{padding: 20, paddingBottom: '25%', gap: 20}}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {flex: 1},
  header: {paddingVertical: 6, paddingHorizontal: 20},
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
  iconButton: {top: -6},

  gradientBorder: {borderRadius: 12, padding: 1.5},
  cardContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 6,
    paddingBottom: 10,
  },
  cardGradient: {
    padding: 12,
    backgroundColor: '#7E5EA9',
    borderRadius: 10,
    paddingHorizontal: 14,
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flex: 1,
  },
  modelInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  textContainer: {
    flex: 1,
    flexShrink: 1,
  },
  title: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '700',
    flexWrap: 'wrap',
    flexShrink: 1,
  },
  modelSub: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 2,
    flexWrap: 'wrap',
    flexShrink: 1,
  },
  unitBadge: {
    backgroundColor: 'white',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 2,
  },
  subtitle: {fontSize: 12, color: '#7E5EA9', fontFamily: 'Inter_28pt-SemiBold'},

  modelImage: {
    width: 46,
    height: 46,
    borderRadius: 8,
    marginRight: 8,
    backgroundColor: '#fff',
  },
  modelImagePlaceholder: {
    width: 46,
    height: 46,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.14)',
  },

  metricsRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    alignItems: 'center',
    paddingHorizontal: 14,
    justifyContent: 'space-between',
  },
  metricCol: {flexDirection: 'row', alignItems: 'center', gap: 8, minWidth: 80},
  metricIcon: {marginRight: 6},
  metricLabel: {fontSize: 12, color: '#000', fontFamily: 'Inter_28pt-SemiBold'},
  metricValue: {
    fontSize: 15,
    color: '#7E5EA9',
    fontFamily: 'Inter_28pt-SemiBold',
  },

  metricValueLeft: {
    fontSize: 14,
    color: '#fff',
    fontFamily: 'Inter_28pt-SemiBold',
  },
  metricValueRight: {
    fontSize: 14,
    color: '#7E5EA9',
    fontFamily: 'Inter_28pt-SemiBold',
  },

  smallLabel: {fontSize: 12, color: 'rgba(0,0,0,0.6)', marginBottom: 4},
  smallMuted: {fontSize: 12, color: 'rgba(0,0,0,0.45)'},

  detailsButton: {
    backgroundColor: '#7E5EA9',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 6,
  },
  detailsText: {color: '#fff', fontSize: 13, fontFamily: 'Inter_28pt-SemiBold'},

  listHeading: {
    fontSize: 16,
    color: '#000',
    fontFamily: 'Inter_28pt-SemiBold',
    marginBottom: 6,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 24,
    fontFamily: 'Inter_28pt-SemiBold',
    color: '#666',
  },
});