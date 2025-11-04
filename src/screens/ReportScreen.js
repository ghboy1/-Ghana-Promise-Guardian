// src/screens/ReportScreen.js
import React, { useState, useRef } from 'react';
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
  Animated,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { submitReport } from '../services/firestore';

const { width } = Dimensions.get('window');

export default function ReportScreen({ uid }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    evidenceUrl: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const categories = [
    { id: 'education', label: 'Education', icon: 'school', color: '#8B5CF6' },
    { id: 'health', label: 'Healthcare', icon: 'medical', color: '#EF4444' },
    { id: 'infrastructure', label: 'Infrastructure', icon: 'construct', color: '#F59E0B' },
    { id: 'economy', label: 'Economy', icon: 'cash', color: '#10B981' },
    { id: 'agriculture', label: 'Agriculture', icon: 'leaf', color: '#14B8A6' },
    { id: 'technology', label: 'Technology', icon: 'laptop', color: '#3B82F6' },
    { id: 'other', label: 'Other', icon: 'ellipsis-horizontal', color: '#6B7280' },
  ];

  const handleSubmit = async () => {
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

  const CategoryButton = ({ category }) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const isSelected = formData.category === category.id;

    const handlePress = () => {
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 0.92,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
      setFormData({ ...formData, category: category.id });
    };

    return (
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <TouchableOpacity
          style={[
            styles.categoryBtn,
            isSelected && { ...styles.categoryBtnActive, borderColor: category.color },
          ]}
          onPress={handlePress}
          activeOpacity={0.8}
        >
          {isSelected && (
            <LinearGradient
              colors={[category.color, category.color + 'DD']}
              style={styles.categoryGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
          )}
          <View style={styles.categoryContent}>
            <View
              style={[
                styles.iconContainer,
                isSelected && { backgroundColor: 'rgba(255,255,255,0.2)' },
              ]}
            >
              <Ionicons
                name={category.icon}
                size={28}
                color={isSelected ? 'white' : category.color}
              />
            </View>
            <Text
              style={[
                styles.categoryText,
                isSelected && styles.categoryTextActive,
              ]}
            >
              {category.label}
            </Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const FloatingLabelInput = ({ label, icon, value, onChangeText, ...props }) => {
    const isFocused = focusedInput === label || value.length > 0;

    return (
      <View style={styles.inputGroup}>
        <View
          style={[
            styles.inputContainer,
            focusedInput === label && styles.inputContainerFocused,
          ]}
        >
          <View style={styles.inputIconContainer}>
            <Ionicons
              name={icon}
              size={20}
              color={focusedInput === label ? '#DC2626' : '#9CA3AF'}
            />
          </View>
          <View style={styles.inputWrapper}>
            <Animated.Text
              style={[
                styles.floatingLabel,
                {
                  fontSize: isFocused ? 12 : 15,
                  top: isFocused ? 8 : 20,
                  color: focusedInput === label ? '#DC2626' : '#9CA3AF',
                },
              ]}
            >
              {label}
            </Animated.Text>
            <TextInput
              style={[styles.floatingInput, { paddingTop: isFocused ? 24 : 12 }]}
              value={value}
              onChangeText={onChangeText}
              onFocus={() => setFocusedInput(label)}
              onBlur={() => setFocusedInput(null)}
              {...props}
            />
          </View>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={100}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Premium Hero Section */}
        <LinearGradient
          colors={['#DC2626', '#B91C1C', '#991B1B']}
          style={styles.hero}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
              alignItems: 'center',
            }}
          >
            <View style={styles.heroIconContainer}>
              <LinearGradient
                colors={['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.1)']}
                style={styles.heroIconGradient}
              >
                <Ionicons name="megaphone" size={56} color="white" />
              </LinearGradient>
            </View>
            <Text style={styles.heroTitle}>Report a Promise Breach</Text>
            <Text style={styles.heroSubtitle}>
              Your voice matters. Report anonymously and hold leaders accountable.
            </Text>
            <View style={styles.heroStats}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>1,247</Text>
                <Text style={styles.statLabel}>Reports Filed</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>89%</Text>
                <Text style={styles.statLabel}>Impact Rate</Text>
              </View>
            </View>
          </Animated.View>
        </LinearGradient>

        {/* Form Container */}
        <Animated.View
          style={[
            styles.formContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Title Input */}
          <FloatingLabelInput
            label="Report Title *"
            icon="pencil"
            value={formData.title}
            onChangeText={(text) => setFormData({ ...formData, title: text })}
            maxLength={100}
          />
          {formData.title.length > 0 && (
            <Text style={styles.charCount}>{formData.title.length}/100</Text>
          )}

          {/* Category Selection */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Ionicons name="pricetag" size={20} color="#DC2626" />
              <Text style={styles.sectionTitle}>Select Category *</Text>
            </View>
            <View style={styles.categoryGrid}>
              {categories.map((cat) => (
                <CategoryButton key={cat.id} category={cat} />
              ))}
            </View>
          </View>

          {/* Description */}
          <View style={styles.inputGroup}>
            <View
              style={[
                styles.inputContainer,
                styles.textAreaContainer,
                focusedInput === 'description' && styles.inputContainerFocused,
              ]}
            >
              <View style={styles.textAreaHeader}>
                <Ionicons
                  name="document-text"
                  size={20}
                  color={focusedInput === 'description' ? '#DC2626' : '#9CA3AF'}
                />
                <Text
                  style={[
                    styles.textAreaLabel,
                    focusedInput === 'description' && { color: '#DC2626' },
                  ]}
                >
                  Description *
                </Text>
              </View>
              <TextInput
                style={styles.textArea}
                placeholder="Describe the promise and why it's broken. Include dates, locations, and what was promised vs. delivered."
                placeholderTextColor="#9CA3AF"
                value={formData.description}
                onChangeText={(text) => setFormData({ ...formData, description: text })}
                onFocus={() => setFocusedInput('description')}
                onBlur={() => setFocusedInput(null)}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
                maxLength={500}
              />
            </View>
            {formData.description.length > 0 && (
              <Text style={styles.charCount}>{formData.description.length}/500</Text>
            )}
          </View>

          {/* Location */}
          <FloatingLabelInput
            label="Location (Optional)"
            icon="location"
            value={formData.location}
            onChangeText={(text) => setFormData({ ...formData, location: text })}
          />

          {/* Evidence URL */}
          <FloatingLabelInput
            label="Evidence Link (Optional)"
            icon="link"
            value={formData.evidenceUrl}
            onChangeText={(text) => setFormData({ ...formData, evidenceUrl: text })}
            keyboardType="url"
            autoCapitalize="none"
          />

          {/* Privacy Notice */}
          <LinearGradient
            colors={['#D1FAE5', '#A7F3D0']}
            style={styles.privacyNotice}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <View style={styles.privacyIconContainer}>
              <Ionicons name="shield-checkmark" size={24} color="#10B981" />
            </View>
            <Text style={styles.privacyText}>
              Your report is <Text style={styles.privacyBold}>100% anonymous</Text>. We
              only store your Guardian ID for verification purposes.
            </Text>
          </LinearGradient>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.submitBtn, submitting && styles.submitBtnDisabled]}
            onPress={handleSubmit}
            disabled={submitting}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={submitting ? ['#9CA3AF', '#6B7280'] : ['#DC2626', '#B91C1C']}
              style={styles.submitGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              {submitting ? (
                <Text style={styles.submitBtnText}>Submitting...</Text>
              ) : (
                <>
                  <Ionicons name="send" size={22} color="white" />
                  <Text style={styles.submitBtnText}>Submit Report</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>

          {/* Guidelines Card */}
          <View style={styles.guidelines}>
            <LinearGradient
              colors={['#FEF3C7', '#FDE68A']}
              style={styles.guidelinesGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
            >
              <View style={styles.guidelinesHeader}>
                <Text style={styles.guidelinesEmoji}>📋</Text>
                <Text style={styles.guidelinesTitle}>Reporting Guidelines</Text>
              </View>
              <View style={styles.guidelinesList}>
                {[
                  { icon: 'checkbox', text: 'Be specific: Include dates, locations, and clear details' },
                  { icon: 'checkbox', text: 'Be truthful: Only report verified information' },
                  { icon: 'checkbox', text: 'Be respectful: Focus on facts, not personal attacks' },
                  { icon: 'checkbox', text: 'Provide evidence: Links to articles or documents help' },
                ].map((item, index) => (
                  <View key={index} style={styles.guidelineItem}>
                    <Ionicons name={item.icon} size={18} color="#92400E" />
                    <Text style={styles.guidelineText}>{item.text}</Text>
                  </View>
                ))}
              </View>
            </LinearGradient>
          </View>

          {/* Bottom Padding */}
          <View style={{ height: 40 }} />
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  // Hero Section
  hero: {
    padding: 40,
    paddingTop: 50,
    paddingBottom: 50,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  heroIconContainer: {
    marginBottom: 20,
  },
  heroIconGradient: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: 'white',
    marginTop: 16,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 12,
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 22,
    fontWeight: '500',
  },
  heroStats: {
    flexDirection: 'row',
    marginTop: 28,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    backdropFilter: 'blur(10px)',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '800',
    color: 'white',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '600',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginHorizontal: 20,
  },

  // Form Container
  formContainer: {
    padding: 24,
    marginTop: -20,
  },

  // Section
  sectionContainer: {
    marginBottom: 28,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginLeft: 8,
  },

  // Floating Input
  inputGroup: {
    marginBottom: 24,
  },
  inputContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    flexDirection: 'row',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  inputContainerFocused: {
    borderColor: '#DC2626',
    shadowColor: '#DC2626',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  inputIconContainer: {
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  inputWrapper: {
    flex: 1,
    position: 'relative',
  },
  floatingLabel: {
    position: 'absolute',
    left: 16,
    fontWeight: '600',
    backgroundColor: 'white',
    paddingHorizontal: 4,
    zIndex: 1,
  },
  floatingInput: {
    fontSize: 15,
    color: '#1F2937',
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 56,
  },
  charCount: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'right',
    marginTop: 6,
    fontWeight: '500',
  },

  // Text Area
  textAreaContainer: {
    flexDirection: 'column',
  },
  textAreaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 12,
    backgroundColor: '#F9FAFB',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  textAreaLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginLeft: 8,
  },
  textArea: {
    fontSize: 15,
    color: '#1F2937',
    padding: 16,
    minHeight: 160,
    lineHeight: 24,
  },

  // Categories
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  categoryBtn: {
    width: (width - 60) / 3,
    aspectRatio: 1,
    margin: 6,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  categoryBtnActive: {
    borderWidth: 3,
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  categoryGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  categoryContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4B5563',
    textAlign: 'center',
  },
  categoryTextActive: {
    color: 'white',
  },

  // Privacy Notice
  privacyNotice: {
    flexDirection: 'row',
    padding: 18,
    borderRadius: 16,
    marginBottom: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#10B981',
  },
  privacyIconContainer: {
    marginRight: 12,
  },
  privacyText: {
    flex: 1,
    fontSize: 14,
    color: '#065F46',
    lineHeight: 20,
    fontWeight: '500',
  },
  privacyBold: {
    fontWeight: '800',
    color: '#047857',
  },

  // Submit Button
  submitBtn: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  submitBtnDisabled: {
    shadowOpacity: 0.1,
  },
  submitGradient: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    gap: 12,
  },
  submitBtnText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.5,
  },

  // Guidelines
  guidelines: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  guidelinesGradient: {
    padding: 24,
    borderWidth: 2,
    borderColor: '#FCD34D',
    borderRadius: 20,
  },
  guidelinesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  guidelinesEmoji: {
    fontSize: 28,
    marginRight: 12,
  },
  guidelinesTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#92400E',
  },
  guidelinesList: {
    gap: 14,
  },
  guidelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  guidelineText: {
    flex: 1,
    fontSize: 14,
    color: '#78350F',
    marginLeft: 12,
    lineHeight: 21,
    fontWeight: '500',
  },
});