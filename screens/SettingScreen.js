import React, { useState, useEffect, useContext } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Switch,
  ScrollView,
  Alert,
  Linking,
  Platform,
  StatusBar,
  SafeAreaView
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const SettingsScreen = ({ navigation }) => {
  // State for settings
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('English');
  const [defaultExportFormat, setDefaultExportFormat] = useState('PDF');
  const [isPremium, setIsPremium] = useState(false);
  
  // Languages available
  const languages = ['English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese'];
  
  // Export formats
  const exportFormats = ['PDF', 'JPG', 'TXT'];
  
  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(previousState => !previousState);
    // In a real app, this would update the app's theme
    Alert.alert('Theme Changed', `Dark mode is now ${!darkMode ? 'enabled' : 'disabled'}`);
  };
  
  // Show language selection
  const showLanguageOptions = () => {
    Alert.alert(
      'Select Language',
      'Choose your preferred language',
      languages.map(lang => ({
        text: lang,
        onPress: () => {
          setLanguage(lang);
          Alert.alert('Language Changed', `Language set to ${lang}`);
        }
      }))
    );
  };
  
  // Show export format options
  const showExportFormatOptions = () => {
    Alert.alert(
      'Default Export Format',
      'Choose your preferred export format',
      exportFormats.map(format => ({
        text: format,
        onPress: () => {
          setDefaultExportFormat(format);
          Alert.alert('Export Format Changed', `Default format set to ${format}`);
        }
      }))
    );
  };
  
  // Handle subscription management
  const handleSubscription = () => {
    if (isPremium) {
      Alert.alert(
        'Manage Subscription',
        'You are currently on the Premium plan ($4.99/month)',
        [
          { text: 'Cancel Subscription', style: 'destructive', onPress: () => confirmCancelSubscription() },
          { text: 'Close', style: 'cancel' }
        ]
      );
    } else {
      Alert.alert(
        'Upgrade to Premium',
        'Enjoy unlimited scans, advanced AI features, auto-tagging, batch operations, and cloud backups for just $4.99/month',
        [
          { text: 'Subscribe Now', onPress: () => handleUpgrade() },
          { text: 'Maybe Later', style: 'cancel' }
        ]
      );
    }
  };
  
  const confirmCancelSubscription = () => {
    Alert.alert(
      'Cancel Subscription',
      'Are you sure you want to cancel your Premium subscription? You will lose access to premium features at the end of your billing cycle.',
      [
        { text: 'Keep Subscription', style: 'cancel' },
        { 
          text: 'Cancel Subscription', 
          style: 'destructive', 
          onPress: () => {
            setIsPremium(false);
            Alert.alert('Subscription Cancelled', 'Your subscription has been cancelled. You will have access to Premium features until the end of your current billing cycle.');
          } 
        }
      ]
    );
  };
  
  const handleUpgrade = () => {
    // In a real app, this would open the payment flow
    Alert.alert(
      'Subscription Successful',
      'Thank you for upgrading to Premium! You now have access to all premium features.',
      [
        { 
          text: 'OK', 
          onPress: () => setIsPremium(true) 
        }
      ]
    );
  };
  
  // Handle opening links
  const openLink = (url) => {
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        Alert.alert('Error', `Cannot open URL: ${url}`);
      }
    });
  };
  
  // Handle contact support
  const contactSupport = () => {
    Alert.alert(
      'Contact Support',
      'How would you like to reach us?',
      [
        { 
          text: 'Email', 
          onPress: () => Linking.openURL('mailto:support@smartscanai.com') 
        },
        { 
          text: 'Live Chat', 
          onPress: () => Alert.alert('Live Chat', 'This would open the in-app chat support in a real implementation.') 
        },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, darkMode && styles.darkContainer]}>
      <StatusBar barStyle={darkMode ? "light-content" : "dark-content"} backgroundColor={darkMode ? "#1A1A1A" : "#FFFFFF"} />
      
      <View style={[styles.header, darkMode && styles.darkHeader]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color={darkMode ? "#FFFFFF" : "#2D5F7C"} />
        </TouchableOpacity>
        <Text style={[styles.title, darkMode && styles.darkTitle]}>Settings</Text>
        <View style={{width: 24}} />
      </View>
      
      <ScrollView style={styles.scrollView}>
        {/* Customization Section */}
        <View style={[styles.section, darkMode && styles.darkSection]}>
          <Text style={[styles.sectionTitle, darkMode && styles.darkSectionTitle]}>Appearance</Text>
          
          <View style={[styles.settingItem, darkMode && styles.darkSettingItem]}>
            <View style={styles.settingLabelContainer}>
              <MaterialIcons name="brightness-6" size={24} color={darkMode ? "#FFFFFF" : "#2D5F7C"} />
              <Text style={[styles.settingLabel, darkMode && styles.darkText]}>Dark Mode</Text>
            </View>
            <View style={styles.comingSoonBadge}>
              <Text style={styles.comingSoonText}>Coming Soon</Text>
            </View>
          </View>
          
          <TouchableOpacity 
            style={[styles.settingItem, darkMode && styles.darkSettingItem]} 
            onPress={showLanguageOptions}
          >
            <View style={styles.settingLabelContainer}>
              <MaterialIcons name="language" size={24} color={darkMode ? "#FFFFFF" : "#2D5F7C"} />
              <Text style={[styles.settingLabel, darkMode && styles.darkText]}>Language</Text>
            </View>
            <View style={styles.comingSoonBadge}>
              <Text style={styles.comingSoonText}>Coming Soon</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.settingItem, darkMode && styles.darkSettingItem]} 
            onPress={showExportFormatOptions}
          >
            <View style={styles.settingLabelContainer}>
              <MaterialIcons name="save-alt" size={24} color={darkMode ? "#FFFFFF" : "#2D5F7C"} />
              <Text style={[styles.settingLabel, darkMode && styles.darkText]}>Default Export Format</Text>
            </View>
            <View style={styles.settingValueContainer}>
              <Text style={[styles.settingValue, darkMode && styles.darkSettingValue]}>{defaultExportFormat}</Text>
              <MaterialIcons name="chevron-right" size={24} color={darkMode ? "#AAAAAA" : "#757575"} />
            </View>
          </TouchableOpacity>
        </View>
        
        {/* Subscription Section */}
        <View style={[styles.section, darkMode && styles.darkSection]}>
          <Text style={[styles.sectionTitle, darkMode && styles.darkSectionTitle]}>Subscription</Text>
          
          <View style={[styles.subscriptionCard, darkMode && styles.darkSubscriptionCard]}>
            <View style={[styles.subscriptionHeader, darkMode && styles.darkSubscriptionHeader]}>
              <Text style={[styles.subscriptionTitle, darkMode && styles.darkSubscriptionTitle]}>
                {isPremium ? 'Premium Plan' : 'Free Plan'}
              </Text>
              {isPremium && (
                <View style={styles.premiumBadge}>
                  <Text style={styles.premiumBadgeText}>PREMIUM</Text>
                </View>
              )}
            </View>
            
            <View style={styles.subscriptionFeatures}>
              {isPremium ? (
                <>
                  <View style={styles.featureItem}>
                    <MaterialIcons name="check-circle" size={20} color="#2D5F7C" />
                    <Text style={[styles.featureText, darkMode && styles.darkFeatureText]}>Unlimited scans</Text>
                  </View>
                  <View style={styles.featureItem}>
                    <MaterialIcons name="check-circle" size={20} color="#2D5F7C" />
                    <Text style={[styles.featureText, darkMode && styles.darkFeatureText]}>Advanced AI features</Text>
                  </View>
                  <View style={styles.featureItem}>
                    <MaterialIcons name="check-circle" size={20} color="#2D5F7C" />
                    <Text style={[styles.featureText, darkMode && styles.darkFeatureText]}>Auto-tagging</Text>
                  </View>
                  <View style={styles.featureItem}>
                    <MaterialIcons name="check-circle" size={20} color="#2D5F7C" />
                    <Text style={[styles.featureText, darkMode && styles.darkFeatureText]}>Batch operations</Text>
                  </View>
                  <View style={styles.featureItem}>
                    <MaterialIcons name="check-circle" size={20} color="#2D5F7C" />
                    <Text style={[styles.featureText, darkMode && styles.darkFeatureText]}>Cloud backups</Text>
                  </View>
                </>
              ) : (
                <>
                  <View style={styles.featureItem}>
                    <MaterialIcons name="check-circle" size={20} color="#2D5F7C" />
                    <Text style={[styles.featureText, darkMode && styles.darkFeatureText]}>Up to 50 scans per month</Text>
                  </View>
                  <View style={styles.featureItem}>
                    <MaterialIcons name="check-circle" size={20} color="#2D5F7C" />
                    <Text style={[styles.featureText, darkMode && styles.darkFeatureText]}>Basic OCR functionality</Text>
                  </View>
                  <View style={styles.featureItem}>
                    <MaterialIcons name="cancel" size={20} color="#e0e0e0" />
                    <Text style={[styles.featureText, styles.disabledFeature, darkMode && styles.darkDisabledFeature]}>Advanced AI features</Text>
                  </View>
                  <View style={styles.featureItem}>
                    <MaterialIcons name="cancel" size={20} color="#e0e0e0" />
                    <Text style={[styles.featureText, styles.disabledFeature, darkMode && styles.darkDisabledFeature]}>Auto-tagging</Text>
                  </View>
                  <View style={styles.featureItem}>
                    <MaterialIcons name="cancel" size={20} color="#e0e0e0" />
                    <Text style={[styles.featureText, styles.disabledFeature, darkMode && styles.darkDisabledFeature]}>Cloud backups</Text>
                  </View>
                </>
              )}
            </View>
            
            <TouchableOpacity 
              style={[
                styles.subscriptionButton, 
                isPremium ? styles.manageSubscriptionButton : styles.upgradeButton,
                darkMode && isPremium && styles.darkManageSubscriptionButton
              ]}
              onPress={handleSubscription}
            >
              <Text style={[
                styles.subscriptionButtonText,
                isPremium && { color: '#2D5F7C' },
                darkMode && isPremium && { color: '#FFFFFF' }
              ]}>
                {isPremium ? 'Manage Subscription' : 'Upgrade to Premium - $4.99/month'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Legal & Support Section */}
        <View style={[styles.section, darkMode && styles.darkSection]}>
          <Text style={[styles.sectionTitle, darkMode && styles.darkSectionTitle]}>Legal & Support</Text>
          
          <TouchableOpacity 
            style={[styles.settingItem, darkMode && styles.darkSettingItem]} 
            onPress={() => openLink('https://smartscanai.com/privacy')}
          >
            <View style={styles.settingLabelContainer}>
              <MaterialIcons name="security" size={24} color={darkMode ? "#FFFFFF" : "#2D5F7C"} />
              <Text style={[styles.settingLabel, darkMode && styles.darkText]}>Privacy Policy</Text>
            </View>
            <MaterialIcons name="open-in-new" size={24} color={darkMode ? "#AAAAAA" : "#757575"} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.settingItem, darkMode && styles.darkSettingItem]} 
            onPress={() => openLink('https://smartscanai.com/terms')}
          >
            <View style={styles.settingLabelContainer}>
              <MaterialIcons name="description" size={24} color={darkMode ? "#FFFFFF" : "#2D5F7C"} />
              <Text style={[styles.settingLabel, darkMode && styles.darkText]}>Terms of Use</Text>
            </View>
            <MaterialIcons name="open-in-new" size={24} color={darkMode ? "#AAAAAA" : "#757575"} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.settingItem, darkMode && styles.darkSettingItem]} 
            onPress={contactSupport}
          >
            <View style={styles.settingLabelContainer}>
              <MaterialIcons name="headset-mic" size={24} color={darkMode ? "#FFFFFF" : "#2D5F7C"} />
              <Text style={[styles.settingLabel, darkMode && styles.darkText]}>Contact Support</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={darkMode ? "#AAAAAA" : "#757575"} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.settingItem, darkMode && styles.darkSettingItem]} 
            onPress={() => Alert.alert('Help Center', 'This would open the in-app help center in a real implementation.')}
          >
            <View style={styles.settingLabelContainer}>
              <MaterialIcons name="help-outline" size={24} color={darkMode ? "#FFFFFF" : "#2D5F7C"} />
              <Text style={[styles.settingLabel, darkMode && styles.darkText]}>Help Center</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={darkMode ? "#AAAAAA" : "#757575"} />
          </TouchableOpacity>
          
          <View style={styles.appInfo}>
            <Text style={[styles.appVersion, darkMode && styles.darkAppVersion]}>SmartScanAI v1.0.0</Text>
            <Text style={[styles.copyright, darkMode && styles.darkCopyright]}>© 2023 SmartScanAI Inc.</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  darkContainer: {
    backgroundColor: '#1A1A1A',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: 'white',
  },
  darkHeader: {
    backgroundColor: '#1A1A1A',
    borderBottomColor: '#333333',
  },
  backButton: {
    padding: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D5F7C',
  },
  darkTitle: {
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    backgroundColor: 'white',
    marginVertical: 8,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
  },
  darkSection: {
    backgroundColor: '#2A2A2A',
    borderColor: '#333333',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginHorizontal: 16,
    marginVertical: 8,
  },
  darkSectionTitle: {
    color: '#FFFFFF',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  darkSettingItem: {
    borderBottomColor: '#333333',
  },
  settingLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  darkText: {
    color: '#FFFFFF',
  },
  settingValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingValue: {
    fontSize: 16,
    color: '#757575',
    marginRight: 8,
  },
  darkSettingValue: {
    color: '#AAAAAA',
  },
  comingSoonBadge: {
    backgroundColor: '#E8EEF2',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  comingSoonText: {
    fontSize: 12,
    color: '#2D5F7C',
    fontWeight: '500',
  },
  subscriptionCard: {
    margin: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    overflow: 'hidden',
  },
  darkSubscriptionCard: {
    backgroundColor: '#2A2A2A',
  },
  subscriptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  darkSubscriptionHeader: {
    backgroundColor: '#333333',
  },
  subscriptionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  darkSubscriptionTitle: {
    color: '#FFFFFF',
  },
  premiumBadge: {
    backgroundColor: '#2D5F7C',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  premiumBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  subscriptionFeatures: {
    padding: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 8,
  },
  darkFeatureText: {
    color: '#FFFFFF',
  },
  disabledFeature: {
    color: '#9e9e9e',
  },
  darkDisabledFeature: {
    color: '#666666',
  },
  subscriptionButton: {
    padding: 16,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  upgradeButton: {
    backgroundColor: '#2D5F7C',
  },
  manageSubscriptionButton: {
    backgroundColor: '#f5f5f5',
  },
  darkManageSubscriptionButton: {
    backgroundColor: '#333333',
    borderTopColor: '#444444',
  },
  subscriptionButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  appInfo: {
    alignItems: 'center',
    padding: 16,
    marginTop: 16,
  },
  appVersion: {
    fontSize: 14,
    color: '#757575',
  },
  darkAppVersion: {
    color: '#AAAAAA',
  },
  copyright: {
    fontSize: 12,
    color: '#9e9e9e',
    marginTop: 4,
  },
  darkCopyright: {
    color: '#777777',
  },
});

export default SettingsScreen; 