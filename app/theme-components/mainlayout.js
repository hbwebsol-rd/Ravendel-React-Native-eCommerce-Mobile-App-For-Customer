import React, { useEffect } from 'react';
import { ScrollView, SafeAreaView, Platform, View } from 'react-native';
import { useScrollToTop } from '@react-navigation/native';

const MainLayout = ({
  children,
  hideScroll,
  navigation,
  isFocused,
  bgColor,
  style,
}) => {
  const ref = React.useRef(null);

  useEffect(() => {
    if (isFocused) {
      ref.current?.scrollTo({
        y: 0,
        animated: true,
      });
    }
  }, [isFocused]);
  useScrollToTop(ref);
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: bgColor ?? '#fff',
        ...style,
      }}>
      <SafeAreaView
        style={{ flex: 1, paddingBottom: Platform.OS === 'ios' ? 50 : 0 }}>
        {hideScroll ? (
          <>{children}</>
        ) : (
          <ScrollView
            keyboardShouldPersistTaps="always"
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              flexGrow: 1,
            }}
            ref={ref}>
            {children}
          </ScrollView>
        )}
      </SafeAreaView>
    </View>
  );
};

export default MainLayout;
