// src/components/ReportMap.js
import React, { useEffect, useState } from 'react';
import { View, Text, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

export default function ReportMap() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'reports'), (snap) => {
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setReports(data.filter(r => r.location));
    });
    return unsub;
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ width: Dimensions.get('window').width, height: '100%' }}
        initialRegion={{
          latitude: 7.9465,
          longitude: -1.0232,
          latitudeDelta: 10,
          longitudeDelta: 10,
        }}
      >
        {reports.map(r => (
          <Marker
            key={r.id}
            coordinate={{ latitude: r.location.lat, longitude: r.location.lng }}
            title={r.title}
            description={r.details}
          />
        ))}
      </MapView>
      <Text style={{ position: 'absolute', top: 50, left: 20, backgroundColor: 'white', padding: 10, borderRadius: 8 }}>
        {reports.length} Live Reports
      </Text>
    </View>
  );
}