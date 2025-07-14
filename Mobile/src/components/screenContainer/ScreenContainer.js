import React from 'react';
import { View, StatusBar } from 'react-native';

export default function ScreenContainer({ children, style }) {
  return (
    <View style={[{ flex: 1, backgroundColor: '#ffffff' }, style]}>
      <StatusBar
        backgroundColor="#005098"
        barStyle="light-content"
        translucent={false}
      />
      {children}
    </View>
  );
} 