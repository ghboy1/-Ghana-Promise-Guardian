// src/screens/ReportScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { submitReport } from '../services/firestore';

export default function ReportScreen({ uid }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    evidenceUrl: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const categories = [
    { id: 'education', label: 'Education', icon: 'school' },
    { id: 'health', label: 'Healthcare', icon: 'medical' },
    { id: 'infrastructure', label: 'Infrastructure', icon: 'construct' },
    { id: 'economy', label: 'Economy', icon: 'cash' },
    { id: 'agriculture', label: 'Agriculture', icon: 'leaf' },
    { id: 'technology', label: 'Technology', icon: 'laptop' },
    { id: 'other', label: 'Other', icon: 'ellipsis-horizontal' },
  ];

  const handleSubmit = async () => {
    // Validation
    if (!formData.title.trim()) {
      Alert.alert('Missing Information', 'Please provide a title for your report');
      return;
    }
    if (!formData.description.trim()) {
      Alert.alert('Missing Information', 'Please describe the issue');
      return;
    }
    if (!formData.category) {
      Alert.alert('Missing Information', 'Please select a category');
      return;
    }

    setSubmitting(true);

    try {
      // Submit to Firestore
      await submitReport({
        ...formData,
        userId: uid,
        timestamp: new Date().toISOString(),
      });

      Alert.alert(
        'Report Submitted! 🎉',
        'Thank you for being a guardian. Your report helps hold leaders accountable.',
        [
          {
            text: 'Submit Another',
            onPress: () => {
              setFormData({
                title: '',
                description: '',
                category: '',
                location: '',
                evidenceUrl: '',
              });
            },
          },
          { text: 'Done', style: 'cancel' },
        ]
      );
    } catch (error) {
      console.error('Submission error:', error);
      Alert.alert('Submission Failed', 'Please try again later');
    }

    setSubmitting(false);
  };

  const CategoryButton = ({ category }) => (
    <TouchableOpacity
      style={[
        styles.categoryBtn,
        formData.category === category.id && styles.categoryBtnActive,
      ]}
      onPress={() => setFormData({ ...formData, category: category.id })}
    >
      <Ionicons
        name={category.icon}
        size={24}
        color={formData.category === category.id ? 'white' : '#6B7280'}
      />
      <Text
        style={[
          styles.categoryText,
          formData.category === category.id && styles.categoryTextActive,
        ]}
      >
        {category.label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={100}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.hero}>
          <Ionicons name="megaphone" size={48} color="white" />
          <Text style={styles.heroTitle}>Report a Promise Breach</Text>
          <Text style={styles.heroSubtitle}>
            Your voice matters. Report anonymously and hold leaders accountable.
          </Text>
        </View>

        {/* Form */}
        <View style={styles.formContainer}>
          {/* Title */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              <Ionicons name="pencil" size={16} /> Report Title *
            </Text>
            <TextInput
              style={styles.input}
              placeholder="E.g., Hospital construction not started"
              value={formData.title}
              onChangeText={(text) => setFormData({ ...formData, title: text })}
              maxLength={100}
            />
            <Text style={styles.charCount}>{formData.title.length}/100</Text>
          </View>

          {/* Category */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              <Ionicons name="pricetag" size={16} /> Category *
            </Text>
            <View style={styles.categoryGrid}>
              {categories.map((cat) => (
                <CategoryButton key={cat.id} category={cat} />
              ))}
            </View>
          </View>

          {/* Description */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              <Ionicons name="document-text" size={16} /> Description *
            </Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Describe the promise and why it's broken. Include details like dates, locations, and what was promised vs. delivered."
              value={formData.description}
              onChangeText={(text) => setFormData({ ...formData, description: text })}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
              maxLength={500}
            />
            <Text style={styles.charCount}>{formData.description.length}/500</Text>
          </View>

          {/* Location */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              <Ionicons name="location" size={16} /> Location (Optional)
            </Text>
            <TextInput
              style={styles.input}
              placeholder="E.g., Accra, Greater Accra Region"
              value={formData.location}
              onChangeText={(text) => setFormData({ ...formData, location: text })}
            />
          </View>

          {/* Evidence URL */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              <Ionicons name="link" size={16} /> Evidence Link (Optional)
            </Text>
            <TextInput
              style={styles.input}
              placeholder="https://... (news article, photo, video)"
              value={formData.evidenceUrl}
              onChangeText={(text) => setFormData({ ...formData, evidenceUrl: text })}
              keyboardType="url"
              autoCapitalize="none"
            />
          </View>

          {/* Privacy Notice */}
          <View style={styles.privacyNotice}>
            <Ionicons name="shield-checkmark" size={20} color="#10B981" />
            <Text style={styles.privacyText}>
              Your report is anonymous. We only store your Guardian ID for verification.
            </Text>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.submitBtn, submitting && styles.submitBtnDisabled]}
            onPress={handleSubmit}
            disabled={submitting}
          >
            {submitting ? (
              <Text style={styles.submitBtnText}>Submitting...</Text>
            ) : (
              <>
                <Ionicons name="send" size={20} color="white" style={{ marginRight: 8 }} />
                <Text style={styles.submitBtnText}>Submit Report</Text>
              </>
            )}
          </TouchableOpacity>

          {/* Guidelines */}
          <View style={styles.guidelines}>
            <Text style={styles.guidelinesTitle}>📋 Reporting Guidelines</Text>
            <Text style={styles.guidelineItem}>
              • Be specific: Include dates, locations, and clear details
            </Text>
            <Text style={styles.guidelineItem}>
              • Be truthful: Only report verified information
            </Text>
            <Text style={styles.guidelineItem}>
              • Be respectful: Focus on facts, not personal attacks
            </Text>
            <Text style={styles.guidelineItem}>
              • Provide evidence: Links to news articles or official documents help
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },

  // Hero
  hero: {
    backgroundColor: '#DC2626',
    padding: 32,
    alignItems: 'center',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 12,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 14,
    color: '#FED7AA',
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 20,
  },

  // Form
  formContainer: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#1F2937',
  },
  textArea: {
    height: 120,
    paddingTop: 12,
  },
  charCount: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'right',
    marginTop: 4,
  },

  // Categories
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  categoryBtn: {
    width: '31%',
    aspectRatio: 1,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 12,
    marginRight: '3.5%',
    marginBottom: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryBtnActive: {
    backgroundColor: '#DC2626',
    borderColor: '#DC2626',
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 8,
    textAlign: 'center',
  },
  categoryTextActive: {
    color: 'white',
  },

  // Privacy Notice
  privacyNotice: {
    flexDirection: 'row',
    backgroundColor: '#D1FAE5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: 'center',
  },
  privacyText: {
    flex: 1,
    fontSize: 13,
    color: '#065F46',
    marginLeft: 8,
    lineHeight: 18,
  },

  // Submit Button
  submitBtn: {
    backgroundColor: '#DC2626',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  submitBtnDisabled: {
    backgroundColor: '#9CA3AF',
  },
  submitBtnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },

  // Guidelines
  guidelines: {
    backgroundColor: '#FEF3C7',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FCD34D',
  },
  guidelinesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#92400E',
    marginBottom: 12,
  },
  guidelineItem: {
    fontSize: 13,
    color: '#78350F',
    marginBottom: 6,
    lineHeight: 18,
  },
});