'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { GameState, gameData, StoryPoint, Choice } from '@/lib/gameData';

export default function Home() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [isBadEnding, setIsBadEnding] = useState(false);
  const [isGameComplete, setIsGameComplete] = useState(false);
  const [badEndingText, setBadEndingText] = useState<string | null>(null);

  const fetchGameState = async () => {
    setLoading(true);
    setMessage(null);
    setIsBadEnding(false);
    setIsGameComplete(false);
    setBadEndingText(null);
    try {
      const res = await fetch('/api/game/state');
      if (res.ok) {
        const data = await res.json();
        setGameState(data.gameState);
        console.log("Frontend: 게임 상태 불러오기 성공 - 챕터:", data.gameState.chapter, "스토리:", data.gameState.story_progress);
      } else if (res.status === 404) {
        setMessage('저장된 게임이 없습니다. 새로운 게임을 시작해주세요.');
        setGameState(null);
      } else {
        setMessage('게임 상태를 불러오는 데 실패했습니다.');
      }
    } catch (error) {
      console.error('Error fetching game state:', error);
      setMessage('게임 상태를 불러오는 중 네트워크 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const startNewGame = async () => {
    setLoading(true);
    setMessage(null);
    setIsBadEnding(false);
    setIsGameComplete(false);
    setBadEndingText(null);
    try {
      const res = await fetch('/api/game/start');
      if (res.ok) {
        const data = await res.json();
        setGameState(data.gameState);
        setMessage('새로운 게임이 시작되었습니다!');
        console.log("Frontend: 새 게임 시작 성공 - 챕터:", data.gameState.chapter, "스토리:", data.gameState.story_progress);
      } else {
        setMessage('새로운 게임을 시작하는 데 실패했습니다.');
      }
    } catch (error) {
      console.error('Error starting new game:', error);
      setMessage('새로운 게임을 시작하는 중 네트워크 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleChoice = async (choiceKey: string) => {
    if (!gameState || isBadEnding || isGameComplete) return;

    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch('/api/game/choose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ choiceKey }),
      });

      if (res.ok) {
        const data = await res.json();
        setGameState(data.gameState);
        console.log("Frontend: 선택 처리 후 받은 게임 상태 - 챕터:", data.gameState.chapter, "스토리:", data.gameState.story_progress);
        if (data.isBadEnding) {
          setIsBadEnding(true);
          setBadEndingText(data.badEndingText);
        } else if (data.isGameComplete) {
          setIsGameComplete(true);
          setMessage(data.message);
        }
      } else {
        const errorData = await res.json();
        setMessage(errorData.message || '선택 처리 중 오류이 발생했습니다.');
      }
    } catch (error) {
      console.error('Error processing choice:', error);
      setMessage('선택 처리 중 네트워크 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const saveAndExitGame = async () => {
    if (!gameState) {
      setMessage('저장할 게임 상태가 없습니다.');
      return;
    }
    try {
      const res = await fetch('/api/game/state', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameState }),
      });
      if (res.ok) {
        setMessage('게임이 성공적으로 저장되었습니다! 창을 닫습니다...');
        // 브라우저 보안 정책으로 인해 창이 자동으로 닫히지 않을 수 있습니다.
        // 이 경우 사용자에게 수동으로 닫도록 안내해야 합니다.
        setTimeout(() => {
          window.close();
          alert("게임이 저장되었습니다. 창이 자동으로 닫히지 않으면 수동으로 닫아주세요.");
        }, 1000);
      } else {
        setMessage('게임 저장에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error saving game:', error);
      setMessage('게임 저장 중 네트워크 오류가 발생했습니다.');
    }
  };

  const resetGame = async () => {
    setLoading(true);
    setMessage(null);
    setIsBadEnding(false);
    setIsGameComplete(false);
    setBadEndingText(null);
    try {
      const res = await fetch('/api/game/reset');
      if (res.ok) {
        setGameState(null);
        setMessage('게임이 초기화되었습니다. 새로운 게임을 시작해주세요.');
      } else {
        setMessage('게임 초기화에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error resetting game:', error);
      setMessage('게임 초기화 중 네트워크 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGameState();
  }, []);

  // gameState가 변경될 때마다 로그 출력
  useEffect(() => {
    if (gameState) {
      console.log("Frontend (useEffect): 현재 게임 상태 - 챕터:", gameState.chapter, "스토리:", gameState.story_progress);
    }
  }, [gameState]);

  const currentStoryPoint: StoryPoint | undefined = gameState
    ? gameData.chapters[gameState.chapter as keyof typeof gameData.chapters]?.[gameState.story_progress] as StoryPoint
    : undefined;

  return (
    <div className="game-container">
      <header className="game-header">
        <h1>개발자의 일생</h1>
        <div className="game-actions-top-right">
          {gameState && (
            <button onClick={saveAndExitGame} className="mr-2">저장하고 종료</button>
          )}
          <button onClick={resetGame}>초기화</button>
        </div>
      </header>

      {loading && <p>로딩 중...</p>}

      {!loading && !gameState && (
        <div className="game-actions">
          <button onClick={startNewGame}>새 게임 시작</button>
          <button onClick={fetchGameState}>게임 불러오기</button>
        </div>
      )}

      {!isGameComplete && message && <p className="game-message">{message}</p>}

      {isBadEnding && badEndingText && (
        <div className="game-story">
          <p className="text-red-500 font-bold text-xl">배드 엔딩!</p>
          <p>{badEndingText}</p>
          <button onClick={startNewGame} className="mt-4">다시 시작</button>
        </div>
      )}

      {isGameComplete && (
        <div className="game-story">
          <p className="game-complete-message font-bold text-xl">게임 완료!</p>
          <p>{message}</p>
          <button onClick={startNewGame} className="mt-4">다시 시작</button>
        </div>
      )}

      {!loading && gameState && !isBadEnding && !isGameComplete && currentStoryPoint && (
        <div key={`${gameState.chapter}-${gameState.story_progress}`}> {/* key prop 추가 */}
          <div className="game-stats">
            <div>챕터: {gameState.chapter.toUpperCase()}</div>
            {gameState.path && <div>경로: {gameState.path.charAt(0).toUpperCase() + gameState.path.slice(1)}</div>}
            <div>스킬: {gameState.skill}</div>
            <div>스트레스: {gameState.stress}</div>
            <div>돈: {gameState.money}</div>
          </div>

          <div className="game-story">
            {currentStoryPoint.image && (
              <Image
                src={currentStoryPoint.image}
                alt="Story Image"
                width={600}
                height={400}
                objectFit="contain"
              />
            )}
            <p>{currentStoryPoint.text}</p>
          </div>

          <div className="game-choices">
            {currentStoryPoint.choices &&
              Object.entries(currentStoryPoint.choices).map(([key, choice]) => {
                const choiceObj = choice as Choice;
                const text = choiceObj.text;
                return (
                <button key={key} onClick={() => handleChoice(key)}>
                  {key}. {text}
                </button>
              )}
              )}
          </div>

          <div className="game-actions mt-4">
            {/* 기존 저장 버튼은 상단으로 이동 */}
          </div>
        </div>
      )}
    </div>
  );
}