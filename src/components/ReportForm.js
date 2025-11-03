// src/components/ReportForm.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, Alert, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';

export default function ReportForm({ uid, onSuccess }) {
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Allow photo access to report with proof.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      quality: 0.7,
      allowsEditing: true,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  const getLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Location needed', 'Allow GPS to tag your report.');
      return;
    }

    setLoading(true);
    let loc = await Location.getCurrentPositionAsync({});
    setLocation(loc.coords);
    setLoading(false);
  };

  const submitReport = async () => {
  if (!title || !details) {
    Alert.alert('Required', 'Title and details are needed.');
    return;
  }

  setLoading(true);
  try {
    let photoUrl = null;
    if (image) {
      const response = await fetch(image.uri);
      const blob = await response.blob();
      const filename = `reports/${uid}_${Date.now()}.jpg`;
      const storageRef = ref(storage, filename);
      await uploadBytes(storageRef, blob);
      photoUrl = await getDownloadURL(storageRef);
    }

    await addDoc(collection(db, 'reports'), {
      uid,
      title,
      details,
      photoUrl,
      location: location ? { lat: location.latitude, lng: location.longitude } : null,
      status: 'pending',
      createdAt: serverTimestamp(),
    });

    // SUCCESS → SHOW ANIMATION
    setShowSuccess(true); // New state
    setTimeout(() => {
      setShowSuccess(false);
      onSuccess();
    }, 2200);

  } catch (e) {
    Alert.alert('Error', 'Failed to submit. Try again.');
  } finally {
    setLoading(false);
  }
};

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>New Report</Text>

      <TextInput
        placeholder="Promise Title (e.g., Free SHS Books)"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />
      <TextInput
        placeholder="Details (what's missing?)"
        value={details}
        onChangeText={setDetails}
        multiline
        style={[styles.input, { height: 100 }]}
      />

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 }}>
        <Button title="Add Photo" onPress={pickImage} color="#DC2626" />
        <Button title="Add GPS" onPress={getLocation} color="#10B981" />
      </View>

      {image && <Image source={{ uri: image.uri }} style={{ width: '100%', height: 200, borderRadius: 12, marginVertical: 10 }} />}
      {location && <Text style={{ color: '#059669' }}>GPS: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}</Text>}

      {loading ? (
        <ActivityIndicator size="large" color="#DC2626" />
      ) : (
        <Button title="SUBMIT REPORT" onPress={submitReport} color="#1F2937" />
      )}
    </View>
  );
}
{showSuccess && (
  <View style={{ alignItems: 'center', marginTop: 20 }}>
    <LottieView
      source={require('../assets/animations/report-sent.json')}
      autoPlay
      loop={false}
      style={{ width: 180, height: 180 }}
    />
    <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#059669', marginTop: 10 }}>
      Report Submitted!
    </Text>
  </View>
)}
const styles = {
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#F9FAFB',
  },
};