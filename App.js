import { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';

const MAX_NUMBER = 50;
const EASY_TIME = 30;
const HARD_TIME = 15;

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
  const [difficulty, setDifficulty] = useState('easy');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

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
      setMsg(`⏰ Temps écoulé ! Votre score final est ${score} ❗`);
      if (score > highScore) {
        setHighScore(score);
      }
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
      setScore((prevScore) => prevScore + 1);
    } else {
      setMsg(`❌ Mauvaise réponse ! La bonne réponse était ${solution} 🤓`);
    }
    generateNewQuestion(); // Génère automatiquement un nouveau calcul
  };

  const generateNewQuestion = () => {
    setNumberOne(rndNumber());
    setNumberTwo(rndNumber());
    if (difficulty === 'hard') {
      setNumberThree(rndNumber());
    } else {
      setNumberThree(null);
    }
    setUserAnswer('');
  };

  const startNewGame = () => {
    setScore(0);
    setTimeLeft(difficulty === 'hard' ? HARD_TIME : EASY_TIME);
    setMsg('');
    setBtnEnabled(true);
    generateNewQuestion();
  };

  const handleDifficultyChange = (level) => {
    setDifficulty(level);
    setTimeLeft(level === 'hard' ? HARD_TIME : EASY_TIME);
    startNewGame();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.timer}>{formatTime(timeLeft)}</Text>
      <Text style={styles.score}>Score: {score} | 🏆 Record: {highScore}</Text>
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
  score: {
    fontSize: 20,
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
