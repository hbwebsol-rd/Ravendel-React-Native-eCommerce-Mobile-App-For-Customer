import React, { useState, useMemo } from 'react';
import { AText, MainLayout } from '../../theme-components';
import IonIcon from 'react-native-vector-icons/Ionicons';
import { isEmpty } from '../../utils/helper';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import AIcon from 'react-native-vector-icons/AntDesign';
import { APP_PRIMARY_COLOR, FontStyle } from '../../utils/config';
import Colors from '../../constants/Colors';

const FilterModal = ({
  filterModal,
  setFilterModal,
  filterList,
  setFilterList,
  handleReset,
  handleFilter,
  setSortBy,
}) => {
  const [filterSelect, setFilterSelect] = useState(0);

  const renderPressable = (startPrice, endPrice, i, isSelected, onPress) => (
    <Pressable
      key={i}
      activeOpacity={0.9}
      style={styles.filterListDatastyle}
      onPress={onPress}>
      <IonIcon
        color={APP_PRIMARY_COLOR}
        name={isSelected ? 'radio-button-on' : 'radio-button-off'}
        style={{ marginHorizontal: 5 }}
        size={20}
      />
      <AText key={`text-${i}`} xtrasmall color="#000" center>
        {endPrice ? `${startPrice} — ${endPrice}` : i}
      </AText>
      {!endPrice && <IonIcon name="star" color="#DDAC17" size={15} />}
    </Pressable>
  );

  const rangeFilterRenderComponent = useMemo(
    () => (type) => {
      let priceSegments = [];
      if (type === 'range') {
        const minPrice =
          filterList[filterSelect].data.minValue !==
          filterList[filterSelect].data.maxValue
            ? filterList[filterSelect].data.minValue
            : 0;
        const maxPrice = filterList[filterSelect].data.maxValue;
        const segments =
          filterList[filterSelect].data.minValue !==
          filterList[filterSelect].data.maxValue
            ? 6
            : 1;
        const step = (maxPrice - minPrice) / segments;
        priceSegments = Array.from({ length: segments }, (_, i) => {
          var startPrice = (minPrice + i * step).toFixed(0);
          var endPrice = (minPrice + (i + 1) * step).toFixed(0);
          startPrice =
            i !== 0 ? Math.ceil(startPrice / 100) * 1000 : startPrice;
          endPrice = Math.ceil(endPrice / 100) * 1000;
          const isSelected =
            !isEmpty(filterList[filterSelect].select) &&
            filterList[filterSelect].select.minPrice == startPrice &&
            filterList[filterSelect].select.maxPrice == endPrice;
          return renderPressable(startPrice, endPrice, i, isSelected, () => {
            const newFilterList = JSON.parse(JSON.stringify(filterList));
            newFilterList[filterSelect].select = {
              minPrice: startPrice,
              maxPrice: endPrice,
            };
            setFilterList(newFilterList);
          });
        });
      } else {
        const segments = 5;

        priceSegments = Array.from({ length: segments }, (_, i) => {
          i = i + 1;
          const isSelected =
            !isEmpty(filterList[filterSelect].select) &&
            filterList[filterSelect].select.minValue == i;
          return renderPressable(null, null, i, isSelected, () => {
            const newFilterList = JSON.parse(JSON.stringify(filterList));
            newFilterList[filterSelect].select = { minValue: i };
            setFilterList(newFilterList);
          });
        });
      }
      return priceSegments;
    },
    [filterList, filterSelect],
  );

  return (
    <Modal
      visible={filterModal}
      contentContainerStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      style={{ flex: 1, flexDirection: 'row' }}>
      <MainLayout hideScroll>
        <View style={styles.filterModalHeader}>
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity style={{ marginEnd: 10 }} onPress={handleReset}>
              <AIcon
                onPress={() => setFilterModal(false)}
                name="arrowleft"
                size={20}
              />
            </TouchableOpacity>
            <AText fonts={FontStyle.semiBold}>Filter</AText>
          </View>
        </View>
        <View style={styles.filterBodyStyle}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={styles.filterListView}>
            {!isEmpty(filterList) && filterList.length > 0
              ? filterList.map((category, index) => {
                  return !isEmpty(category.data) ? (
                    <Pressable
                      activeOpacity={0.9}
                      style={[
                        styles.filterListingWrapper,
                        filterSelect === index && styles.selectedFilter,
                      ]}
                      onPress={() => {
                        setFilterSelect(index);
                      }}>
                      <AText uppercase xtrasmall color="#000" center>
                        {category.heading}
                      </AText>
                    </Pressable>
                  ) : null;
                })
              : null}
          </ScrollView>
          <ScrollView
            style={styles.filterOptionsView}
            showsVerticalScrollIndicator={false}>
            {!isEmpty(filterSelect) &&
            !isEmpty(filterList[filterSelect]) &&
            !isEmpty(filterList[filterSelect].type)
              ? filterList[filterSelect].type == 'choice' &&
                filterList[filterSelect].field == 'rating'
                ? rangeFilterRenderComponent('rating')
                : filterList[filterSelect].type == 'array' ||
                  filterList[filterSelect].type == 'choice'
                ? filterList[filterSelect].data &&
                  filterList[filterSelect].data.map((item, index) => (
                    <Pressable
                      key={index}
                      activeOpacity={0.9}
                      style={styles.filterListDatastyle}
                      onPress={() => {
                        const newFilterList = JSON.parse(
                          JSON.stringify(filterList),
                        );
                        newFilterList[filterSelect].select =
                          newFilterList[filterSelect].select || [];
                        if (filterList[filterSelect].type == 'array') {
                          if (!newFilterList[filterSelect].data[index].select) {
                            newFilterList[filterSelect].select.push(item.value);
                          } else {
                            newFilterList[filterSelect].select.filter(
                              (id) => item.value !== id,
                            );
                          }
                          newFilterList[filterSelect].data[index].select =
                            !newFilterList[filterSelect].data[index].select;
                        } else {
                          if (filterList[filterSelect].field == 'sort') {
                            setSortBy(
                              filterList[filterSelect].data[index].value,
                            );
                          }
                          newFilterList[filterSelect].data.map((key, i) => {
                            key.select = i == index;
                          });
                        }
                        setFilterList(newFilterList);
                      }}>
                      <IonIcon
                        color={APP_PRIMARY_COLOR}
                        name={
                          item.select
                            ? filterList[filterSelect].type === 'choice'
                              ? 'radio-button-on'
                              : 'checkbox-outline'
                            : filterList[filterSelect].type === 'choice'
                            ? 'radio-button-off'
                            : 'square-outline'
                        }
                        style={{ marginHorizontal: 5 }}
                        size={20}
                      />
                      <AText xtrasmall color="#000" center>
                        {item.label}
                      </AText>
                    </Pressable>
                  ))
                : filterList[filterSelect].type == 'range'
                ? rangeFilterRenderComponent('range')
                : null
              : null}
          </ScrollView>
        </View>
        <View style={styles.filterModalFooter}>
          <TouchableOpacity
            onPress={handleFilter}
            style={[styles.clearBtnStyle, { borderColor: APP_PRIMARY_COLOR }]}>
            <AText color={APP_PRIMARY_COLOR} fonts={FontStyle.semiBold}>
              Clear Filter
            </AText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleFilter}
            style={[
              styles.applyButton,
              { backgroundColor: APP_PRIMARY_COLOR },
            ]}>
            <AText color="#fff" fonts={FontStyle.semiBold}>
              Apply
            </AText>
          </TouchableOpacity>
        </View>
      </MainLayout>
    </Modal>
  );
};

const styles = StyleSheet.create({
  filterBodyStyle: { flexDirection: 'row', flex: 1 },
  filterListView: { width: '10%', backgroundColor: '#F1F1F1', marginTop: 4 },
  filterListingWrapper: {
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    paddingVertical: 15,
    alignSelf: 'center',
  },
  selectedFilter: { backgroundColor: '#fff', width: '100%' },
  filterModalHeader: {
    flexDirection: 'row',
    shadowColor: '#000',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 0.9,
    borderBottomColor: '#c8c8c8  ',
    // shadowOffset: { width: 0, height: 1 },
    // shadowOpacity: 0.22,
    // shadowRadius: 2.22,
    // elevation: 3,
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  filterModalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    borderTopColor: '#c8c8c8',
    borderTopWidth: 0.9,
    paddingHorizontal: 15,
    paddingVertical: 7,
    backgroundColor: '#fff',
  },
  applyButton: {
    paddingHorizontal: 15,
    paddingVertical: 7,
    borderRadius: 15,
    width: 90,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearBtnStyle: {
    backgroundColor: '#fff',
    borderWidth: 1,
    width: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 14,
    paddingHorizontal: 15,
    paddingVertical: 7,
    borderRadius: 15,
  },
  filterListDatastyle: {
    flexDirection: 'row',
    marginBottom: 10,
    marginHorizontal: 10,
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  filterOptionsView: {
    width: '60%',
    flexDirection: 'column',
    backgroundColor: Colors.whiteColor,
    marginTop: 12,
  },
});

export default FilterModal;
