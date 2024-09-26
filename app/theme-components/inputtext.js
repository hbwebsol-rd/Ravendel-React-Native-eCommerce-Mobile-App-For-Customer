import { StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import React from 'react';
import { TextInput } from 'react-native';
import { ARow, AText } from './';
import { APP_SECONDARY_COLOR, FontStyle } from '../utils/config';
import Icon from 'react-native-vector-icons/Feather';
import { useTogglePasswordVisibility } from './hooks/passwordvisibility';
import { isEmpty } from '../utils/helper';
const Textinputs = ({
  heading,
  onerror,
  secureTextEntry,
  placeholder,
  value,
  onchange,
  onblur,
  mode,
  keyboardtype,
  icon,
  hookuse,
  sideheading,
  sideheadclick,
  multi,
  linenumbers,
  afocus,
  handleKeyboardSubmit,
  autofillData,
  max,
  editable,
  autoFillText,
  // Single Style Props
  StylesHeadingText,
  StylesTextInput,
  StylesView,
  //Style Props
  bgColor,
  width,
  bc,
  bw,
  br,
  padding,
  color,
  fw,
  bb,
  iconSize,
  iconColor,
  fs,
  height,
  inputBgColor,
  pl,
  inputtextalign,
  pb,
  placeholdercolor,
  hmt,
  mh,
  pe,
  ViewStyle,
  fullIcon,
  hmb,
  hc,
  ac,
  fonts,
  mt,
  hfs,
  top,
  pr,
  sc,
  onSubmit,
  pt,
}) => {
  const { passwordVisibility, rightIcon, handlePasswordVisibility } =
    useTogglePasswordVisibility();
  return (
    <View
      style={[
        styles.textViewInputStyle,
        { backgroundColor: bgColor ?? null, ...StylesView },
      ]}>
      <ARow row justifyContent={'space-between'}>
        {!isEmpty(heading) && (
          <Text
            style={{
              color: hc ?? LINE_COLOR,
              marginTop: hmt ?? 20,
              marginBottom: hmb ?? 5,
              fontFamily: FontStyle.fontRegular,
              fontSize: hfs ?? 14,
              ...StylesHeadingText,
            }}>
            {heading}
          </Text>
        )}
        {!isEmpty(sideheading) && (
          <TouchableWithoutFeedback
            onPress={() => {
              sideheadclick ? sideheadclick() : null;
            }}>
            <AText
              bold
              right
              fonts={FontStyle.fontRegular}
              color={'#156ABF'}
              xtrasmall
              lineThrough>
              {sideheading}
            </AText>
          </TouchableWithoutFeedback>
        )}
      </ARow>
      <View style={styles.inputviewstyle}>
        <TextInput
          onSubmitEditing={onSubmit}
          pointerEvents={pe ?? 'auto'}
          editable={editable ?? true}
          autoFocus={afocus ?? false}
          theme={{ roundness: 10 }}
          value={value}
          error={onerror}
          keyboardType={keyboardtype}
          onBlur={onblur}
          outlineColor={'#CFCFCF'}
          secureTextEntry={hookuse ? passwordVisibility : secureTextEntry}
          placeholder={placeholder}
          placeholderTextColor={placeholdercolor ?? '#ABA7A7'}
          multiline={multi}
          numberOfLines={linenumbers}
          style={[
            {
              backgroundColor: inputBgColor ?? '#fff',
              width: width ?? '100%',
              height: height ?? undefined,
              borderColor: bc ?? APP_SECONDARY_COLOR,
              textAlignVertical: inputtextalign ?? 'center',
              borderWidth: bw ?? 1,
              borderBottomWidth: bb ?? 1,
              borderRadius: br ?? 8,
              padding: padding ?? 5,
              paddingLeft: pl ?? 12,
              paddingBottom: pb ?? 0,
              paddingTop: pt ?? 0,
              color: color ?? '#ABA7A7',
              fontFamily: FontStyle.fontBoldItalic,
              fontSize: fs ?? 12,
              marginTop: mt ?? 0,
            },
            StylesTextInput,
          ]}
          mode={mode ? mode : 'outlined'}
          onChangeText={onchange}
        />
        {icon ? (
          <Icon
            onPress={handlePasswordVisibility}
            style={styles.iconstyle}
            name={hookuse ? rightIcon : icon}
            size={iconSize ?? 15}
            color={iconColor ?? 'black'}
          />
        ) : null}
      </View>
    </View>
  );
};

export default Textinputs;

const styles = StyleSheet.create({
  textViewInputStyle: {
    backgroundColor: '#fff',
  },
  inputviewstyle: {
    zIndex: -1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconstyle: {
    marginRight: 5,
    position: 'absolute',
    right: 5,
    padding: 5,
  },
});
