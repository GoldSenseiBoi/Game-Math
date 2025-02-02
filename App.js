import { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';

const MAX_NUMBER = 50;
const EASY_TIME = 10;
const HARD_TIME = 5;

const rndNumber = () => Math.floor(Math.random() * MAX_NUMBER);

const formatTime = (time) => (time < 10 ? `00:0${time}` : `00:${time}`);

export default function App() {
  const [numberOne, setNumberOne] = useState(rndNumber());
  const [numberTwo, setNumberTwo] = useState(rndNumber());
  const [numberThree, setNumberThree] = useState(null);
  const [solution, setSolution] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [msg, setMsg] = useState('');
  const [timeLeft, setTimeLeft] = useState(EASY_TIME);
  const [btnEnabled, setBtnEnabled] = useState(true);
  const [difficulty, setDifficulty] = useState('easy'); // Default mode

  useEffect(() => {
    calculateSolution();
  }, [numberOne, numberTwo, numberThree]);

  useEffect(() => {
    const timer = setInterval(decreaseTime, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (timeLeft === 0) {
      setBtnEnabled(false);
      setMsg(`⏰ Temps écoulé ! La bonne réponse était ${solution} ❗`);
    }
  }, [timeLeft]);

  const decreaseTime = () => {
    setTimeLeft((prevTime) => Math.max(prevTime - 1, 0));
  };

  const calculateSolution = () => {
    if (difficulty === 'easy') {
      setSolution(numberOne + numberTwo);
    } else {
      setSolution(numberOne + numberTwo + numberThree);
    }
  };

  const handleSubmit = () => {
    if (parseInt(userAnswer) === solution) {
      setMsg('✅ Bonne réponse ! 🎉');
    } else {
      setMsg(`❌ Mauvaise réponse ! La bonne réponse était ${solution} 🤓`);
    }
  };

  const startNewGame = () => {
    setNumberOne(rndNumber());
    setNumberTwo(rndNumber());
    if (difficulty === 'hard') {
      setNumberThree(rndNumber());
      setTimeLeft(HARD_TIME);
    } else {
      setNumberThree(null);
      setTimeLeft(EASY_TIME);
    }
    setUserAnswer('');
    setMsg('');
    setBtnEnabled(true);
  };

  const handleDifficultyChange = (level) => {
    setDifficulty(level);
    startNewGame();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.timer}>{formatTime(timeLeft)}</Text>
      <View style={styles.buttonRow}>
        <Button title="New Game 🔄" onPress={startNewGame} />
        <Button title="Easy 😊" onPress={() => handleDifficultyChange('easy')} />
        <Button title="Hard 😈" onPress={() => handleDifficultyChange('hard')} />
      </View>
      <Text style={styles.question}>
        {numberOne} + {numberTwo}
        {difficulty === 'hard' && ` + ${numberThree}`} = ?
      </Text>
      <TextInput
        placeholder="Entrez votre réponse ici ✍️"
        keyboardType="numeric"
        onChangeText={setUserAnswer}
        value={userAnswer}
        style={styles.input}
      />
      <Button title="Submit ✅" onPress={handleSubmit} disabled={!btnEnabled} />
      <Text style={styles.message}>{msg}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  timer: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  question: {
    fontSize: 28,
    marginVertical: 15,
  },
  input: {
    borderBottomWidth: 1,
    width: '50%',
    textAlign: 'center',
    marginBottom: 10,
    fontSize: 18,
  },
  message: {
    fontSize: 18,
    marginTop: 15,
  },
});
