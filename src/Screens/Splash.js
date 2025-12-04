// import React, { useEffect, useRef } from 'react';
// import {
//   View,
//   StyleSheet,
//   Image,
//   Animated,
//   Dimensions,
//   StatusBar,
//   Easing
// } from 'react-native';

// const { width, height } = Dimensions.get('window');

// const Splash = ({ navigation }) => {
//   const fadeAnim = useRef(new Animated.Value(0)).current;
//   const scaleAnim = useRef(new Animated.Value(0.8)).current;
//   const rotateAnim = useRef(new Animated.Value(0)).current;

//   useEffect(() => {
//     // Start animation sequence
//     Animated.parallel([
//       // Fade in animation
//       Animated.timing(fadeAnim, {
//         toValue: 1,
//         duration: 1000,
//         easing: Easing.ease,
//         useNativeDriver: true,
//       }),
//       // Scale animation
//       Animated.timing(scaleAnim, {
//         toValue: 1,
//         duration: 1200,
//         easing: Easing.elastic(1.2),
//         useNativeDriver: true,
//       }),
//       // Rotate animation (subtle)
//       Animated.timing(rotateAnim, {
//         toValue: 1,
//         duration: 1500,
//         easing: Easing.linear,
//         useNativeDriver: true,
//       }),
//     ]).start();

//     // Navigate after 3 seconds
//     const timer = setTimeout(() => {
//       navigation.replace('LoginScreen'); // Replace with your main screen name
//     }, 3000);

//     return () => clearTimeout(timer);
//   }, [fadeAnim, scaleAnim, rotateAnim, navigation]);

//   const rotateInterpolate = rotateAnim.interpolate({
//     inputRange: [0, 1],
//     outputRange: ['0deg', '360deg'],
//   });

//   return (
//     <View style={styles.container}>
//       <StatusBar
//         backgroundColor="#7E5EA9"
//         barStyle="light-content"
//         translucent={false}
//       />

//       <Animated.View
//         style={[
//           styles.content,
//           {
//             opacity: fadeAnim,
//             transform: [
//               { scale: scaleAnim },
//               { rotate: rotateInterpolate }
//             ],
//           },
//         ]}
//       >
//         {/* Replace with your own image */}
//         <Image
//           source={require('../Asset/Images/MacrooLogo.jpeg')} // Change this to your image path
//           style={styles.logo}
//           resizeMode="contain"
//         />

//         {/* Optional: App Name */}
//         <Animated.Text style={[styles.appName, { opacity: fadeAnim }]}>
//           Makroo
//         </Animated.Text>

//         {/* Optional: Tagline */}
//         <Animated.Text style={[styles.tagline, { opacity: fadeAnim }]}>
//         John Deere Zindagi Ka Best Decision
//         </Animated.Text>
//       </Animated.View>

//       {/* Optional: Loading indicator */}
//       <Animated.View style={[styles.loadingContainer, { opacity: fadeAnim }]}>
//         <View style={styles.loadingDot} />
//         <View style={styles.loadingDot} />
//         <View style={styles.loadingDot} />
//       </Animated.View>

//       {/* Optional: Copyright/Version */}
//       <Animated.Text style={[styles.footer, { opacity: fadeAnim }]}>
//         Version 1.0.0 • © 2024 Macroo
//       </Animated.Text>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#111', // Change to your brand color
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   content: {
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   logo: {
//     width: width * 0.6,
//     height: height * 0.3,
//     marginBottom: 20,
//   },
//   appName: {
//     fontSize: 32,
//     fontWeight: 'bold',
//     color: '#FFFFFF',
//     marginTop: 10,
//     textAlign: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.3,
//     shadowRadius: 4,
//     elevation: 5,
//   },
//   tagline: {
//     fontSize: 16,
//     color: '#FFFFFF',
//     marginTop: 8,
//     opacity: 0.9,
//     textAlign: 'center',
//     fontStyle: 'italic',
//   },
//   loadingContainer: {
//     flexDirection: 'row',
//     marginTop: 40,
//     alignItems: 'center',
//   },
//   loadingDot: {
//     width: 12,
//     height: 12,
//     borderRadius: 6,
//     backgroundColor: '#FFFFFF',
//     marginHorizontal: 6,
//   },
//   footer: {
//     position: 'absolute',
//     bottom: 30,
//     fontSize: 12,
//     color: 'rgba(255, 255, 255, 0.7)',
//     textAlign: 'center',
//   },
// });

// export default Splash;

import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  Image,
  Animated,
  Dimensions,
  StatusBar,
  Easing,
  Text,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const {width, height} = Dimensions.get('window');

const Splash = ({navigation}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Start animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 1200,
        easing: Easing.elastic(1.2),
        useNativeDriver: true,
      }),
    ]).start();

    // Check user data immediately
    checkUserDataAndNavigate();
  }, [fadeAnim, scaleAnim, navigation]);

  const checkUserDataAndNavigate = async () => {
    try {
      const userDataString = await AsyncStorage.getItem('userData');

      // Wait at least 1.5 seconds for animation to complete
      const minWaitTime = new Promise(resolve => setTimeout(resolve, 1500));

      let navigationTarget = 'LoginScreen';

      if (userDataString) {
        const userData = JSON.parse(userDataString);

        // Check if userData has valid content
        if (
          userData &&
          typeof userData === 'object' &&
          Object.keys(userData).length > 0 &&
          userData.id &&
          userData.email
        ) {
          // Add your specific checks here
          navigationTarget = 'Dashboard'; // or 'HomeScreen'
        }
      }

      // Wait for minimum time, then navigate
      await minWaitTime;
      setChecking(false);
      navigation.replace(navigationTarget);
    } catch (error) {
      console.error('Error checking user data:', error);
      setChecking(false);
      navigation.replace('LoginScreen');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor="#111"
        barStyle="light-content"
        translucent={false}
      />

      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{scale: scaleAnim}],
          },
        ]}>
        <Image
          source={require('../Asset/Images/MacrooLogo.jpeg')}
          style={styles.logo}
          resizeMode="contain"
        />

        <Animated.Text style={[styles.appName, {opacity: fadeAnim}]}>
          Makroo
        </Animated.Text>

        <Animated.Text style={[styles.tagline, {opacity: fadeAnim}]}>
          John Deere Zindagi Ka Best Decision
        </Animated.Text>
      </Animated.View>

      {/* Checking status */}
      <View style={styles.statusContainer}>
        {checking ? (
          <>
            <ActivityIndicator size="small" color="#FFFFFF" />
            <Text style={styles.statusText}>Checking authentication...</Text>
          </>
        ) : (
          <Text style={styles.statusText}>Redirecting...</Text>
        )}
      </View>

      <Animated.Text style={[styles.footer, {opacity: fadeAnim}]}>
        Version 1.0.0 • © 2024 Macroo
      </Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: width * 0.6,
    height: height * 0.3,
    marginBottom: 20,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 10,
    textAlign: 'center',
  },
  tagline: {
    fontSize: 16,
    color: '#FFFFFF',
    marginTop: 8,
    opacity: 0.9,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  statusContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
  statusText: {
    marginTop: 10,
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
  },
});

export default Splash;
