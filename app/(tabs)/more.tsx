import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../context/AuthContext";

interface SettingItem {
  id: string;
  icon: string;
  title: string;
  subtitle?: string;
  type: "navigation" | "toggle" | "danger";
  value?: boolean;
  onPress?: () => void;
}

export default function MoreScreen() {
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [biometric, setBiometric] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await logout();
          } catch (error: any) {
            Alert.alert("Error", error.message);
          }
        },
      },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "This action cannot be undone. All your data will be permanently deleted.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            Alert.alert("Info", "Account deletion is not yet implemented");
          },
        },
      ]
    );
  };

  const handleComingSoon = (feature: string) => {
    Alert.alert("Coming Soon", `${feature} feature is coming soon!`);
  };

  const accountSettings: SettingItem[] = [
    {
      id: "profile",
      icon: "person-outline",
      title: "Edit Profile",
      subtitle: "Update your personal information",
      type: "navigation",
      onPress: () => handleComingSoon("Edit Profile"),
    },
    {
      id: "security",
      icon: "lock-closed-outline",
      title: "Security",
      subtitle: "Password and authentication",
      type: "navigation",
      onPress: () => handleComingSoon("Security Settings"),
    },
    {
      id: "privacy",
      icon: "shield-outline",
      title: "Privacy",
      subtitle: "Manage your privacy settings",
      type: "navigation",
      onPress: () => handleComingSoon("Privacy Settings"),
    },
  ];

  const preferencesSettings: SettingItem[] = [
    {
      id: "notifications",
      icon: "notifications-outline",
      title: "Push Notifications",
      subtitle: "Receive alerts and reminders",
      type: "toggle",
      value: notifications,
    },
    {
      id: "biometric",
      icon: "finger-print-outline",
      title: "Biometric Login",
      subtitle: "Use fingerprint or face ID",
      type: "toggle",
      value: biometric,
    },
    {
      id: "darkmode",
      icon: "moon-outline",
      title: "Dark Mode",
      subtitle: "Use dark theme",
      type: "toggle",
      value: darkMode,
    },
    {
      id: "currency",
      icon: "cash-outline",
      title: "Currency",
      subtitle: "USD ($)",
      type: "navigation",
      onPress: () => handleComingSoon("Currency Selection"),
    },
    {
      id: "language",
      icon: "language-outline",
      title: "Language",
      subtitle: "English",
      type: "navigation",
      onPress: () => handleComingSoon("Language Selection"),
    },
  ];

  const appSettings: SettingItem[] = [
    {
      id: "categories",
      icon: "apps-outline",
      title: "Manage Categories",
      subtitle: "Add or edit expense categories",
      type: "navigation",
      onPress: () => handleComingSoon("Manage Categories"),
    },
    {
      id: "budget",
      icon: "wallet-outline",
      title: "Budget Goals",
      subtitle: "Set spending limits",
      type: "navigation",
      onPress: () => handleComingSoon("Budget Goals"),
    },
    {
      id: "export",
      icon: "download-outline",
      title: "Export Data",
      subtitle: "Download your transactions",
      type: "navigation",
      onPress: () => handleComingSoon("Export Data"),
    },
    {
      id: "backup",
      icon: "cloud-upload-outline",
      title: "Backup & Restore",
      subtitle: "Manage your data backup",
      type: "navigation",
      onPress: () => handleComingSoon("Backup & Restore"),
    },
  ];

  const supportSettings: SettingItem[] = [
    {
      id: "help",
      icon: "help-circle-outline",
      title: "Help Center",
      subtitle: "Get help with the app",
      type: "navigation",
      onPress: () => handleComingSoon("Help Center"),
    },
    {
      id: "feedback",
      icon: "chatbubble-outline",
      title: "Send Feedback",
      subtitle: "Share your thoughts",
      type: "navigation",
      onPress: () => handleComingSoon("Feedback"),
    },
    {
      id: "rate",
      icon: "star-outline",
      title: "Rate App",
      subtitle: "Rate us on the app store",
      type: "navigation",
      onPress: () => handleComingSoon("Rate App"),
    },
    {
      id: "about",
      icon: "information-circle-outline",
      title: "About",
      subtitle: "Version 1.0.0",
      type: "navigation",
      onPress: () => handleComingSoon("About"),
    },
  ];

  const renderSettingItem = (item: SettingItem) => {
    if (item.type === "toggle") {
      return (
        <View key={item.id} style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <View style={styles.iconContainer}>
              <Ionicons name={item.icon as any} size={24} color="#000" />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>{item.title}</Text>
              {item.subtitle && (
                <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
              )}
            </View>
          </View>
          <Switch
            value={item.value}
            onValueChange={(value) => {
              if (item.id === "notifications") setNotifications(value);
              if (item.id === "biometric") setBiometric(value);
              if (item.id === "darkmode") setDarkMode(value);
            }}
            trackColor={{ false: "#E0E0E0", true: "#000" }}
            thumbColor="#fff"
          />
        </View>
      );
    }

    return (
      <TouchableOpacity
        key={item.id}
        style={styles.settingItem}
        onPress={item.onPress}
        activeOpacity={0.7}
      >
        <View style={styles.settingLeft}>
          <View
            style={[
              styles.iconContainer,
              item.type === "danger" && styles.iconContainerDanger,
            ]}
          >
            <Ionicons
              name={item.icon as any}
              size={24}
              color={item.type === "danger" ? "#F44336" : "#000"}
            />
          </View>
          <View style={styles.settingContent}>
            <Text
              style={[
                styles.settingTitle,
                item.type === "danger" && styles.settingTitleDanger,
              ]}
            >
              {item.title}
            </Text>
            {item.subtitle && (
              <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
            )}
          </View>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#999" />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>More</Text>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileAvatar}>
            <Text style={styles.profileAvatarText}>
              {user?.displayName?.charAt(0).toUpperCase() || "U"}
            </Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>
              {user?.displayName || "User"}
            </Text>
            <Text style={styles.profileEmail}>{user?.email}</Text>
          </View>
          <TouchableOpacity
            style={styles.profileEditButton}
            onPress={() => handleComingSoon("Edit Profile")}
          >
            <Ionicons name="create-outline" size={20} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Account Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.settingsList}>
            {accountSettings.map(renderSettingItem)}
          </View>
        </View>

        {/* Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.settingsList}>
            {preferencesSettings.map(renderSettingItem)}
          </View>
        </View>

        {/* App Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Settings</Text>
          <View style={styles.settingsList}>
            {appSettings.map(renderSettingItem)}
          </View>
        </View>

        {/* Support */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          <View style={styles.settingsList}>
            {supportSettings.map(renderSettingItem)}
          </View>
        </View>

        {/* Danger Zone */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Danger Zone</Text>
          <View style={styles.settingsList}>
            <TouchableOpacity
              style={styles.settingItem}
              onPress={handleLogout}
              activeOpacity={0.7}
            >
              <View style={styles.settingLeft}>
                <View style={styles.iconContainer}>
                  <Ionicons name="log-out-outline" size={24} color="#F44336" />
                </View>
                <View style={styles.settingContent}>
                  <Text
                    style={[styles.settingTitle, styles.settingTitleDanger]}
                  >
                    Logout
                  </Text>
                  <Text style={styles.settingSubtitle}>
                    Sign out of your account
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.settingItem}
              onPress={handleDeleteAccount}
              activeOpacity={0.7}
            >
              <View style={styles.settingLeft}>
                <View
                  style={[styles.iconContainer, styles.iconContainerDanger]}
                >
                  <Ionicons name="trash-outline" size={24} color="#F44336" />
                </View>
                <View style={styles.settingContent}>
                  <Text
                    style={[styles.settingTitle, styles.settingTitleDanger]}
                  >
                    Delete Account
                  </Text>
                  <Text style={styles.settingSubtitle}>
                    Permanently delete your account
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </TouchableOpacity>
          </View>
        </View>

        {/* App Info */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Finance Tracker</Text>
          <Text style={styles.footerVersion}>Version 1.0.0</Text>
          <Text style={styles.footerCopyright}>© 2024 All rights reserved</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    padding: 20,
    paddingTop: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  profileAvatarText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: "#666",
  },
  profileEditButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  settingsList: {
    backgroundColor: "#f9f9f9",
    marginHorizontal: 20,
    borderRadius: 16,
    overflow: "hidden",
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  iconContainerDanger: {
    backgroundColor: "#FFEBEE",
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 2,
  },
  settingTitleDanger: {
    color: "#F44336",
  },
  settingSubtitle: {
    fontSize: 14,
    color: "#666",
  },
  footer: {
    alignItems: "center",
    paddingVertical: 40,
    paddingBottom: 60,
  },
  footerText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
  },
  footerVersion: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  footerCopyright: {
    fontSize: 12,
    color: "#999",
  },
});
