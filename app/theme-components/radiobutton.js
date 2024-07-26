import React, { Component } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';

import { AText } from '.';
import { APP_PRIMARY_COLOR, APP_SECONDARY_COLOR } from '../utils/config';
export default class RadioButton extends Component {
  state = {
    value: this.props.initialValues,
  };
  render() {
    const { data, fieldname, onchange } = this.props;
    const { value } = this.state;
    return (
      <View
        style={{
          flexDirection: this.props.fd ?? 'column',
        }}>
        {data.map((res) => {
          return (
            <View
              key={res.key}
              style={{
                ...styles.container,
                justifyContent: this.props.jc,
              }}>
              <TouchableOpacity
                style={styles.radioCircle}
                onPress={() => {
                  if (value == res.key) {
                    onchange(fieldname, null);
                    this.setState({
                      value: null,
                    });
                  } else {
                    onchange(fieldname, res.key);
                    this.setState({
                      value: res.key,
                    });
                  }
                }}>
                {value === res.key && <View style={styles.selectedRb} />}
              </TouchableOpacity>
              <TouchableWithoutFeedback
                onPress={() => {
                  if (value == res.key) {
                    onchange(fieldname, null);
                    this.setState({
                      value: null,
                    });
                  } else {
                    onchange(fieldname, res.key);
                    this.setState({
                      value: res.key,
                    });
                  }
                }}>
                <View>
                  <AText small color="#9F9F9F">
                    {res.text}
                  </AText>
                </View>
              </TouchableWithoutFeedback>
            </View>
          );
        })}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  radioText: {
    fontSize: 20,
    color: '#000',
    fontWeight: '700',
  },
  radioCircle: {
    height: 15,
    width: 15,
    marginRight: 6,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#707070',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedRb: {
    width: 15,
    height: 15,
    borderRadius: 4,
    backgroundColor: APP_PRIMARY_COLOR,
  },
  result: {
    color: 'white',
    fontWeight: '600',
    backgroundColor: '#F3FBFE',
  },
});
