import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  TextInput,
  ActivityIndicator,
  Alert,
  Platform,
  SafeAreaView
} from 'react-native';
import { useProfileStore } from '../store/useProfileStore';

const API_GATEWAY = 'http://10.197.56.226:8000';

export default function HomeScreen({ navigation }) {
  const parentToken = useProfileStore((state) => state.parentToken);
  const activeChild = useProfileStore((state) => state.activeChild);
  const selectChild = useProfileStore((state) => state.selectChild);
  const logout = useProfileStore((state) => state.logout);

  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Profile creation states
  const [createMode, setCreateMode] = useState(false);
  const [childName, setChildName] = useState('');
  const [childDob, setChildDob] = useState(''); // YYYY-MM-DD

  // Fetch children list from User Microservice
  const fetchChildren = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_GATEWAY}/api/v1/children`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${parentToken}`,
        },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to load profiles');
      
      setChildren(data.children || []);
    } catch (err) {
      Alert.alert('Network Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChildren();
  }, []);

  // Post new child profile creation
  const handleCreateChild = async () => {
    if (!childName || !childDob) {
      Alert.alert('Validation Error', 'Please supply both name and DOB.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_GATEWAY}/api/v1/children`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${parentToken}`,
        },
        body: JSON.stringify({ name: childName, dateOfBirth: childDob }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to create child profile');

      setChildName('');
      setChildDob('');
      setCreateMode(false);
      
      Alert.alert('Success', 'Child profile created! Dynamic age group assigned.');
      fetchChildren();
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigation.replace('Login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Shubhanu Hub</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </View>

      {/* Profile Selection List */}
      {!activeChild ? (
        <View style={styles.body}>
          <Text style={styles.sectionTitle}>Select Active Player</Text>
          
          {loading ? (
            <ActivityIndicator size="large" color="#a855f7" />
          ) : (
            <FlatList
              data={children}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ gap: 12, paddingBottom: 20 }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => selectChild(item)}
                  style={styles.profileCard}
                >
                  <View style={styles.profileAvatar}>
                    <Text style={styles.profileAvatarText}>✨</Text>
                  </View>
                  <View style={styles.profileDetails}>
                    <Text style={styles.profileName}>{item.name}</Text>
                    <Text style={styles.profileSub}>
                      Age Group: {item.ageGroup} | {item.totalXp} XP
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <Text style={styles.emptyText}>No child profiles found. Let's create one!</Text>
              }
            />
          )}

          {/* Creation Section Toggle */}
          {!createMode ? (
            <TouchableOpacity
              onPress={() => setCreateMode(true)}
              style={styles.createToggleBtn}
            >
              <Text style={styles.createToggleText}>+ Add Child Profile</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.createForm}>
              <Text style={styles.formTitle}>Add New Profile</Text>
              <TextInput
                placeholder="Child's First Name"
                placeholderTextColor="#a1a1aa"
                value={childName}
                onChangeText={setChildName}
                style={styles.input}
              />
              <TextInput
                placeholder="Date of Birth (YYYY-MM-DD)"
                placeholderTextColor="#a1a1aa"
                value={childDob}
                onChangeText={setChildDob}
                style={styles.input}
              />
              <View style={styles.formActions}>
                <TouchableOpacity
                  onPress={() => setCreateMode(false)}
                  style={[styles.formBtn, styles.cancelBtn]}
                >
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleCreateChild}
                  style={[styles.formBtn, styles.submitBtn]}
                >
                  <Text style={styles.submitText}>Save Profile</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      ) : (
        // Play Block Viewport (If Active child selected)
        <View style={styles.body}>
          <View style={styles.statsCard}>
            <Text style={styles.statsTitle}>Player: {activeChild.name}</Text>
            <View style={styles.statsRow}>
              <Text style={styles.statsText}>🔥 Streak: {activeChild.streakDays} Days</Text>
              <Text style={styles.statsText}>⚡ Total XP: {activeChild.totalXp}</Text>
            </View>
            <Text style={styles.ageBadge}>Target: Age Group {activeChild.ageGroup}</Text>
          </View>

          <Text style={styles.sectionTitle}>Quest Maps Available</Text>
          
          <TouchableOpacity
            onPress={() => navigation.navigate('StoryGame')}
            style={styles.worldCard}
          >
            <Text style={styles.worldEmoji}>⚔️</Text>
            <View style={styles.worldDetails}>
              <Text style={styles.worldTitle}>World 1 — The Number Kingdom</Text>
              <Text style={styles.worldSub}>Mathematics: count keys, add mud blobs, solve locks</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => selectChild(null)}
            style={styles.backToProfilesBtn}
          >
            <Text style={styles.backText}>Change Active Player</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8EC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 2,
    borderBottomColor: '#3E2723/10',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#3E2723',
  },
  logoutBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 2,
    borderColor: '#3E2723',
    borderRadius: 8,
    backgroundColor: '#E8F4FD',
  },
  logoutText: {
    color: '#3E2723',
    fontSize: 12,
    fontWeight: '800',
  },
  body: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#3E2723',
    marginBottom: 16,
  },
  profileCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFDF9',
    borderWidth: 3,
    borderColor: '#3E2723',
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#3E2723',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  profileAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#3E2723',
  },
  profileAvatarText: {
    fontSize: 20,
  },
  profileDetails: {
    marginLeft: 16,
  },
  profileName: {
    fontSize: 15,
    fontWeight: '900',
    color: '#3E2723',
  },
  profileSub: {
    fontSize: 11,
    color: '#3E2723',
    opacity: 0.75,
    fontWeight: '700',
    marginTop: 2,
  },
  emptyText: {
    color: '#3E2723',
    opacity: 0.6,
    textAlign: 'center',
    marginVertical: 40,
    fontSize: 13,
    fontWeight: '700',
  },
  createToggleBtn: {
    width: '100%',
    height: 52,
    borderWidth: 3,
    borderStyle: 'dashed',
    borderColor: '#3E2723',
    borderRadius: 20,
    backgroundColor: '#FFFDF9',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  createToggleText: {
    color: '#3E2723',
    fontSize: 14,
    fontWeight: '900',
  },
  createForm: {
    backgroundColor: '#FFFDF9',
    borderWidth: 3,
    borderColor: '#3E2723',
    borderRadius: 20,
    padding: 16,
    marginTop: 12,
  },
  formTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#3E2723',
    marginBottom: 12,
  },
  input: {
    height: 46,
    backgroundColor: '#FFFDF9',
    borderWidth: 3,
    borderColor: '#3E2723',
    borderRadius: 12,
    paddingHorizontal: 12,
    color: '#3E2723',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 12,
  },
  formActions: {
    flexDirection: 'row',
    gap: 8,
  },
  formBtn: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelBtn: {
    backgroundColor: '#E8F4FD',
    borderWidth: 2,
    borderColor: '#3E2723',
  },
  submitBtn: {
    backgroundColor: '#FF6B6B',
    borderWidth: 3,
    borderColor: '#3E2723',
    shadowColor: '#3E2723',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  cancelText: {
    color: '#3E2723',
    fontSize: 13,
    fontWeight: '900',
  },
  submitText: {
    color: '#3E2723',
    fontSize: 13,
    fontWeight: '900',
  },
  statsCard: {
    backgroundColor: '#FFFDF9',
    borderWidth: 3,
    borderColor: '#3E2723',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#3E2723',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#3E2723',
    marginBottom: 8,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 20,
  },
  statsText: {
    fontSize: 13,
    color: '#3E2723',
    fontWeight: '900',
  },
  ageBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFD700/20',
    color: '#FF6B6B',
    fontSize: 9,
    fontWeight: '950',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
    marginTop: 12,
    borderWidth: 2,
    borderColor: '#3E2723',
    textTransform: 'uppercase',
  },
  worldCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFDF9',
    borderWidth: 3,
    borderColor: '#3E2723',
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#3E2723',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  worldEmoji: {
    fontSize: 32,
  },
  worldDetails: {
    marginLeft: 16,
    flex: 1,
  },
  worldTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#3E2723',
  },
  worldSub: {
    fontSize: 11,
    color: '#3E2723',
    opacity: 0.7,
    fontWeight: '700',
    marginTop: 4,
    lineHeight: 14,
  },
  backToProfilesBtn: {
    width: '100%',
    height: 48,
    backgroundColor: '#E8F4FD',
    borderWidth: 3,
    borderColor: '#3E2723',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 'auto',
    shadowColor: '#3E2723',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  backText: {
    color: '#3E2723',
    fontSize: 13,
    fontWeight: '900',
  },
});
