import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Alert,
  Platform,
  SafeAreaView
} from 'react-native';
import { useProfileStore } from '../store/useProfileStore';

const API_GATEWAY = 'http://10.197.56.226:8000';

// Mocked local story node flow matching Math Chapter 1
const CHAPTER_STEPS = [
  {
    id: 'intro',
    type: 'story',
    text: 'Greetings, young Hero! The Dark Dragon has locked the massive gates of Count Castle using three magical lock-puzzles. Let’s solve the first quest to enter!',
    speaker: 'Shubh-Buddy'
  },
  {
    id: 'challenge_1',
    type: 'quiz',
    question: 'Shubh-Buddy finds 3 glowing Gold Keys and 4 glowing Silver Keys in the grass. How many keys do we have in total?',
    options: ['5 keys', '6 keys', '7 keys', '8 keys'],
    answerIndex: 2,
    xpAward: 100
  },
  {
    id: 'outro',
    type: 'reward',
    text: 'KABOOM! The dragon lock shatters into gold stars! You saved the Number Kingdom! Shubh-Buddy rewards you with the Math Wizard Badge!',
    speaker: 'System'
  }
];

export default function StoryGameScreen({ navigation }) {
  const activeChild = useProfileStore((state) => state.activeChild);
  const addXp = useProfileStore((state) => state.addXp);
  const parentToken = useProfileStore((state) => state.parentToken);

  const [stepIdx, setStepIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [tutorOpen, setTutorOpen] = useState(false);
  const [tutorInput, setTutorInput] = useState('');
  const [tutorReply, setTutorReply] = useState('');
  const [loading, setLoading] = useState(false);

  const currentStep = CHAPTER_STEPS[stepIdx];

  const handleSubmitAnswer = (optIdx) => {
    setSelectedOpt(optIdx);
    const isCorrect = optIdx === currentStep.answerIndex;
    
    if (isCorrect) {
      addXp(currentStep.xpAward);
      Alert.alert('Splendid!', `Correct! You gained +${currentStep.xpAward} XP!`, [
        { text: 'Awesome', onPress: handleNext }
      ]);
    } else {
      Alert.alert('Oops!', 'No worries, check Shubh-Buddy for a hint and try again!');
    }
  };

  const handleNext = () => {
    setSelectedOpt(null);
    if (stepIdx < CHAPTER_STEPS.length - 1) {
      setStepIdx(stepIdx + 1);
    } else {
      Alert.alert('Chapter Completed!', 'You solved all Count Castle puzzles!', [
        { text: 'Return Home', onPress: () => navigation.pop() }
      ]);
    }
  };

  // Queries actual Python/FastAPI NLP tutor microservice
  const handleAskTutor = async () => {
    if (!tutorInput.trim()) return;
    setLoading(true);
    try {
      const response = await fetch(`${API_GATEWAY}/api/v1/tutor/ask`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${parentToken}`
        },
        body: JSON.stringify({
          childId: activeChild.id,
          query: tutorInput,
          ageGroup: activeChild.ageGroup
        })
      });

      const data = await response.json();
      setTutorReply(data.reply || 'Shubh-Buddy says: Let’s focus on counting castle keys!');
    } catch (err) {
      setTutorReply('Math represents how we describe quantities. Two halves of a circle merge back into a whole shape!');
    } finally {
      setLoading(false);
      setTutorInput('');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Game HUD */}
      <View style={styles.hud}>
        <Text style={styles.hudTitle}>Count Castle Quest</Text>
        <Text style={styles.hudScore}>{activeChild?.totalXp} XP</Text>
      </View>

      {/* Main Canvas Segment */}
      <View style={styles.gameplay}>
        
        {/* Dialogue Box */}
        <View style={styles.dialogueBox}>
          <Text style={styles.speakerLabel}>
            🗣 {currentStep.speaker || 'System'}
          </Text>
          <Text style={styles.dialogueText}>
            {currentStep.text || currentStep.question}
          </Text>
        </View>

        {/* Action Panel (Quiz vs Story navigation) */}
        {currentStep.type === 'quiz' ? (
          <View style={styles.optionsBlock}>
            {currentStep.options.map((opt, idx) => (
              <TouchableOpacity
                key={idx}
                onPress={() => handleSubmitAnswer(idx)}
                style={[
                  styles.optionBtn,
                  selectedOpt === idx && styles.selectedBtn
                ]}
              >
                <Text style={styles.optionText}>{opt}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <TouchableOpacity onPress={handleNext} style={styles.continueBtn}>
            <Text style={styles.continueText}>Continue Adventure &rarr;</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Bottom Nav Bar */}
      <View style={styles.footer}>
        <TouchableOpacity
          onPress={() => setTutorOpen(true)}
          style={styles.buddyBtn}
        >
          <Text style={styles.buddyBtnText}>💬 Ask Shubh-Buddy</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.pop()}
          style={styles.quitBtn}
        >
          <Text style={styles.quitText}>Quit</Text>
        </TouchableOpacity>
      </View>

      {/* TUTOR PANEL MODAL drawer */}
      {tutorOpen && (
        <View style={styles.modalOverlay}>
          <View style={styles.tutorDrawer}>
            <View style={styles.drawerHeader}>
              <Text style={styles.drawerTitle}>🤖 Shubh-Buddy (NLP Tutor)</Text>
              <TouchableOpacity onPress={() => { setTutorOpen(false); setTutorReply(''); }} style={styles.closeBtn}>
                <Text style={styles.closeText}>Close</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.replyArea}>
              <Text style={styles.tutorBubble}>
                {tutorReply || "Hi! Ask me anything about adding things or fraction slices! I can explain in Hindi too! 🌟"}
              </Text>
            </ScrollView>

            <View style={styles.chatInputRow}>
              <TextInput
                placeholder="Ask Shubh-Buddy standard or custom queries..."
                placeholderTextColor="#a1a1aa"
                value={tutorInput}
                onChangeText={setTutorInput}
                style={styles.chatInput}
              />
              <TouchableOpacity onPress={handleAskTutor} style={styles.sendBtn} disabled={loading}>
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.sendText}>Send</Text>}
              </TouchableOpacity>
            </View>
          </View>
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
  hud: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 2,
    borderBottomColor: '#3E2723/10',
  },
  hudTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#3E2723',
  },
  hudScore: {
    fontSize: 13,
    fontWeight: '900',
    color: '#FF6B6B',
  },
  gameplay: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  dialogueBox: {
    backgroundColor: '#FFFDF9',
    borderWidth: 3,
    borderColor: '#3E2723',
    borderRadius: 24,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#3E2723',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  speakerLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: '#FF6B6B',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  dialogueText: {
    fontSize: 15,
    color: '#3E2723',
    lineHeight: 22,
    fontWeight: '750',
  },
  optionsBlock: {
    gap: 12,
  },
  optionBtn: {
    height: 50,
    backgroundColor: '#FFFDF9',
    borderWidth: 3,
    borderColor: '#3E2723',
    borderRadius: 16,
    justifyContent: 'center',
    paddingHorizontal: 16,
    shadowColor: '#3E2723',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  selectedBtn: {
    borderColor: '#FF6B6B',
    backgroundColor: '#E8F4FD',
  },
  optionText: {
    color: '#3E2723',
    fontSize: 14,
    fontWeight: '900',
  },
  continueBtn: {
    height: 52,
    backgroundColor: '#FF6B6B',
    borderWidth: 3,
    borderColor: '#3E2723',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#3E2723',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  continueText: {
    color: '#3E2723',
    fontSize: 14,
    fontWeight: '900',
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  buddyBtn: {
    flex: 2,
    height: 48,
    backgroundColor: '#E8F4FD',
    borderWidth: 3,
    borderColor: '#3E2723',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#3E2723',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  buddyBtnText: {
    color: '#3E2723',
    fontSize: 13,
    fontWeight: '900',
  },
  quitBtn: {
    flex: 1,
    height: 48,
    backgroundColor: '#FFFDF9',
    borderWidth: 3,
    borderColor: '#3E2723',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#3E2723',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  quitText: {
    color: '#3E2723',
    fontSize: 13,
    fontWeight: '900',
  },
  modalOverlay: {
    position: 'absolute',
    inset: 0,
    backgroundColor: '#3E272399',
    justifyContent: 'flex-end',
  },
  tutorDrawer: {
    height: '70%',
    backgroundColor: '#FFFDF9',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 3,
    borderColor: '#3E2723',
    padding: 20,
  },
  drawerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#3E2723/10',
    paddingBottom: 12,
    marginBottom: 12,
  },
  drawerTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#3E2723',
  },
  closeBtn: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    backgroundColor: '#E8F4FD',
    borderWidth: 2,
    borderColor: '#3E2723',
    borderRadius: 8,
  },
  closeText: {
    color: '#3E2723',
    fontSize: 11,
    fontWeight: '900',
  },
  replyArea: {
    flex: 1,
    marginBottom: 16,
  },
  tutorBubble: {
    backgroundColor: '#E8F4FD',
    borderWidth: 2,
    borderColor: '#3E2723',
    borderRadius: 16,
    padding: 14,
    color: '#3E2723',
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '700',
  },
  chatInputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  chatInput: {
    flex: 1,
    height: 46,
    backgroundColor: '#FFFDF9',
    borderWidth: 3,
    borderColor: '#3E2723',
    borderRadius: 12,
    paddingHorizontal: 14,
    color: '#3E2723',
    fontSize: 13,
    fontWeight: '700',
  },
  sendBtn: {
    width: 60,
    backgroundColor: '#FFD700',
    borderWidth: 3,
    borderColor: '#3E2723',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendText: {
    color: '#3E2723',
    fontSize: 13,
    fontWeight: '900',
  },
});
