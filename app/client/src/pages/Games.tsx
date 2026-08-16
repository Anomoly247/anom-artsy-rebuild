import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Gamepad2, Trophy, Zap, Star, X } from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";

// Trivia Game Component
function TriviaGame({ onClose, onComplete }: { onClose: () => void; onComplete: (score: number) => void }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const questions = [
    {
      q: "What is the capital of France?",
      options: ["London", "Paris", "Berlin", "Madrid"],
      correct: 1,
    },
    {
      q: "What is 2 + 2?",
      options: ["3", "4", "5", "6"],
      correct: 1,
    },
    {
      q: "What is the largest planet?",
      options: ["Earth", "Mars", "Jupiter", "Saturn"],
      correct: 2,
    },
    {
      q: "What color is the sky?",
      options: ["Green", "Blue", "Red", "Yellow"],
      correct: 1,
    },
    {
      q: "How many continents are there?",
      options: ["5", "6", "7", "8"],
      correct: 2,
    },
  ];

  const handleAnswer = (index: number) => {
    if (index === questions[currentQuestion].correct) {
      setScore(score + 20);
    }

    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setGameOver(true);
    }
  };

  if (gameOver) {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
        <Card className="bg-[#1a1f2e] border border-[#ff00cc] p-8 max-w-md text-center">
          <h2 className="text-2xl font-bold text-[#ff00cc] mb-4">Game Over!</h2>
          <p className="text-4xl font-bold text-[#00eaff] mb-6">{score} Points</p>
          <div className="flex gap-4">
            <Button
              className="flex-1 btn-neon-cyan"
              onClick={() => {
                onComplete(score);
                onClose();
              }}
            >
              Claim Reward
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                setCurrentQuestion(0);
                setScore(0);
                setGameOver(false);
              }}
            >
              Play Again
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <Card className="bg-[#1a1f2e] border border-[#ff00cc] p-8 max-w-2xl w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#ff00cc]">Trivia Challenge</h2>
          <Button variant="ghost" onClick={onClose} className="text-[#7a7f8e]">
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="mb-6">
          <p className="text-[#7a7f8e] text-sm mb-2">
            Question {currentQuestion + 1} / {questions.length}
          </p>
          <div className="w-full bg-[#0b0e14] rounded-full h-2">
            <div
              className="bg-[#ff00cc] h-2 rounded-full transition-all"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        <h3 className="text-xl font-bold text-[#00eaff] mb-6">{questions[currentQuestion].q}</h3>

        <div className="grid grid-cols-2 gap-4">
          {questions[currentQuestion].options.map((option, idx) => (
            <Button
              key={idx}
              onClick={() => handleAnswer(idx)}
              className="btn-neon-cyan h-16 text-base"
            >
              {option}
            </Button>
          ))}
        </div>

        <p className="text-center text-[#ff00cc] font-bold mt-6">Score: {score}</p>
      </Card>
    </div>
  );
}

// Memory Game Component
function MemoryGame({ onClose, onComplete }: { onClose: () => void; onComplete: (score: number) => void }) {
  const [cards, setCards] = useState<{ id: number; emoji: string; flipped: boolean; matched: boolean }[]>([
    { id: 1, emoji: "🌟", flipped: false, matched: false },
    { id: 2, emoji: "🌟", flipped: false, matched: false },
    { id: 3, emoji: "🎮", flipped: false, matched: false },
    { id: 4, emoji: "🎮", flipped: false, matched: false },
    { id: 5, emoji: "🚀", flipped: false, matched: false },
    { id: 6, emoji: "🚀", flipped: false, matched: false },
    { id: 7, emoji: "💎", flipped: false, matched: false },
    { id: 8, emoji: "💎", flipped: false, matched: false },
  ]);
  const [moves, setMoves] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const handleCardClick = (index: number) => {
    if (cards[index].flipped || cards[index].matched) return;

    const newCards = [...cards];
    newCards[index].flipped = true;
    setCards(newCards);

    const flipped = newCards.filter((c) => c.flipped && !c.matched);
    if (flipped.length === 2) {
      setMoves(moves + 1);
      if (flipped[0].emoji === flipped[1].emoji) {
        setTimeout(() => {
          const updated = [...newCards];
          updated[newCards.indexOf(flipped[0])].matched = true;
          updated[newCards.indexOf(flipped[1])].matched = true;
          setCards(updated);

          if (updated.every((c) => c.matched)) {
            setGameOver(true);
          }
        }, 500);
      } else {
        setTimeout(() => {
          const updated = [...newCards];
          updated.forEach((c) => {
            if (!c.matched) c.flipped = false;
          });
          setCards(updated);
        }, 1000);
      }
    }
  };

  if (gameOver) {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
        <Card className="bg-[#1a1f2e] border border-[#ff00cc] p-8 max-w-md text-center">
          <h2 className="text-2xl font-bold text-[#ff00cc] mb-4">You Won!</h2>
          <p className="text-4xl font-bold text-[#00eaff] mb-2">{100 - moves * 5} Points</p>
          <p className="text-[#7a7f8e] mb-6">Completed in {moves} moves</p>
          <Button
            className="w-full btn-neon-cyan"
            onClick={() => {
              onComplete(100 - moves * 5);
              onClose();
            }}
          >
            Claim Reward
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <Card className="bg-[#1a1f2e] border border-[#ff00cc] p-8 max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#ff00cc]">Memory Game</h2>
          <Button variant="ghost" onClick={onClose} className="text-[#7a7f8e]">
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="grid grid-cols-4 gap-2 mb-6">
          {cards.map((card, idx) => (
            <button
              key={idx}
              onClick={() => handleCardClick(idx)}
              className="w-16 h-16 bg-gradient-to-br from-[#ff00cc] to-[#9d4edd] rounded-lg flex items-center justify-center text-2xl hover:scale-110 transition-transform"
            >
              {card.flipped || card.matched ? card.emoji : "?"}
            </button>
          ))}
        </div>

        <p className="text-center text-[#00eaff] font-bold">Moves: {moves}</p>
      </Card>
    </div>
  );
}

// Mood Matcher Game Component
function MoodMatcherGame({ onClose, onComplete }: { onClose: () => void; onComplete: (score: number) => void }) {
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);

  const moods = [
    { emoji: "😊", name: "Happy" },
    { emoji: "😢", name: "Sad" },
    { emoji: "😡", name: "Angry" },
    { emoji: "😴", name: "Sleepy" },
  ];

  const rounds = [
    { question: "When you win a game, you feel...", correct: "Happy" },
    { question: "When you lose your favorite toy, you feel...", correct: "Sad" },
    { question: "When someone takes your snack, you feel...", correct: "Angry" },
    { question: "After playing all day, you feel...", correct: "Sleepy" },
  ];

  const handleMoodClick = (mood: string) => {
    if (mood === rounds[round].correct) {
      setScore(score + 25);
    }

    if (round + 1 < rounds.length) {
      setRound(round + 1);
    } else {
      setTimeout(() => {
        onComplete(score + (mood === rounds[round].correct ? 25 : 0));
        onClose();
      }, 500);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <Card className="bg-[#1a1f2e] border border-[#ff00cc] p-8 max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#ff00cc]">Mood Matcher</h2>
          <Button variant="ghost" onClick={onClose} className="text-[#7a7f8e]">
            <X className="w-5 h-5" />
          </Button>
        </div>

        <p className="text-[#00eaff] text-lg mb-6 text-center font-bold">{rounds[round].question}</p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          {moods.map((mood) => (
            <button
              key={mood.name}
              onClick={() => handleMoodClick(mood.name)}
              className="p-4 bg-[#0b0e14] border border-[#2a2f3e] rounded-lg hover:border-[#ff00cc] transition-colors"
            >
              <div className="text-4xl mb-2">{mood.emoji}</div>
              <div className="text-sm text-[#7a7f8e]">{mood.name}</div>
            </button>
          ))}
        </div>

        <p className="text-center text-[#ff00cc] font-bold">Score: {score}</p>
      </Card>
    </div>
  );
}

export default function Games() {
  const { isAuthenticated, loading } = useAuth();
  const [, navigate] = useLocation();
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [gameScores, setGameScores] = useState<Record<string, number>>({});

  const saveGameScore = trpc.games.saveScore.useMutation({
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: () => {
      toast.error("Failed to save game score");
    },
  });

  const games = [
    {
      id: "trivia",
      title: "Trivia Challenge",
      description: "Answer questions and test your knowledge!",
      icon: "🧠",
      difficulty: "Easy",
      reward: 50,
      component: TriviaGame,
    },
    {
      id: "memory",
      title: "Memory Game",
      description: "Match pairs of cards and test your memory!",
      icon: "🎮",
      difficulty: "Medium",
      reward: 75,
      component: MemoryGame,
    },
    {
      id: "mood-matcher",
      title: "Mood Matcher",
      description: "Match emotions to situations!",
      icon: "😊",
      difficulty: "Easy",
      reward: 40,
      component: MoodMatcherGame,
    },
  ];

  const handleGameComplete = (gameId: string, score: number) => {
    setGameScores({ ...gameScores, [gameId]: score });
    setActiveGame(null);
    // Save the game score to the backend and award coins
    saveGameScore.mutate({ gameId, score });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0e14] flex items-center justify-center">
        <div className="text-[#00eaff] text-xl">Loading Games...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0b0e14] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#00eaff] text-xl mb-4">Please sign in to play games</p>
          <Button className="btn-neon-magenta" onClick={() => navigate("/")}>
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const totalRewards = Object.values(gameScores).reduce((a, b) => a + b, 0);

  return (
    <div className="min-h-screen bg-[#0b0e14] text-[#00eaff]">
      {/* Navigation */}
      <nav className="border-b border-[#2a2f3e] px-6 py-4 sticky top-0 bg-[#0b0e14]/95 backdrop-blur z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate("/")} className="text-[#7a7f8e]">
              ← Back
            </Button>
            <h1 className="text-2xl font-bold neon-text-cyan">Mini-Games Arcade</h1>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Stats Section */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card
            className="bg-[#1a1f2e] border border-[#2a2f3e] p-6"
            style={{
              boxShadow: "0 0 10px rgba(255, 0, 204, 0.5), 0 0 20px rgba(255, 0, 204, 0.3)",
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#7a7f8e] text-sm">Games Played</p>
                <p className="text-3xl font-bold text-[#ff00cc]">{Object.keys(gameScores).length}</p>
              </div>
              <Gamepad2 className="w-8 h-8 text-[#ff00cc] opacity-50" />
            </div>
          </Card>

          <Card
            className="bg-[#1a1f2e] border border-[#2a2f3e] p-6"
            style={{
              boxShadow: "0 0 10px rgba(0, 234, 255, 0.5), 0 0 20px rgba(0, 234, 255, 0.3)",
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#7a7f8e] text-sm">Total Points</p>
                <p className="text-3xl font-bold text-[#00eaff]">{totalRewards}</p>
              </div>
              <Zap className="w-8 h-8 text-[#00eaff] opacity-50" />
            </div>
          </Card>

          <Card
            className="bg-[#1a1f2e] border border-[#2a2f3e] p-6"
            style={{
              boxShadow: "0 0 10px rgba(157, 78, 221, 0.5), 0 0 20px rgba(157, 78, 221, 0.3)",
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#7a7f8e] text-sm">Games Available</p>
                <p className="text-3xl font-bold text-[#9d4edd]">{games.length}</p>
              </div>
              <Trophy className="w-8 h-8 text-[#9d4edd] opacity-50" />
            </div>
          </Card>
        </div>

        {/* Games Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => {
            const GameComponent = game.component;
            return (
              <Card
                key={game.id}
                className="bg-[#1a1f2e] border border-[#2a2f3e] p-6 hover:border-[#ff00cc] transition-colors"
                style={{
                  boxShadow: "0 0 10px rgba(255, 0, 204, 0.3), 0 0 20px rgba(255, 0, 204, 0.1)",
                }}
              >
                <div className="text-5xl mb-4 text-center">{game.icon}</div>
                <h3 className="text-lg font-bold text-[#00eaff] mb-2">{game.title}</h3>
                <p className="text-sm text-[#7a7f8e] mb-4">{game.description}</p>

                <div className="flex items-center justify-between mb-4 pb-4 border-b border-[#2a2f3e]">
                  <span className="text-xs px-2 py-1 bg-[#0b0e14] rounded text-[#7a7f8e]">
                    {game.difficulty}
                  </span>
                  <span className="text-xs px-2 py-1 bg-[#0b0e14] rounded text-[#ff00cc] flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    {gameScores[game.id] || game.reward} pts
                  </span>
                </div>

                {gameScores[game.id] && (
                  <div className="mb-4">
                    <p className="text-xs text-[#7a7f8e] mb-1">Best Score</p>
                    <p className="text-2xl font-bold text-[#00eaff] flex items-center gap-2">
                      <Star className="w-5 h-5 text-[#ff00cc]" />
                      {gameScores[game.id]}
                    </p>
                  </div>
                )}

                <Button
                  className="w-full btn-neon-magenta gap-2"
                  onClick={() => setActiveGame(game.id)}
                >
                  <Gamepad2 className="w-4 h-4" />
                  Play Now
                </Button>

                {activeGame === game.id && (
                  <GameComponent
                    onClose={() => setActiveGame(null)}
                    onComplete={(score) => handleGameComplete(game.id, score)}
                  />
                )}
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
}
