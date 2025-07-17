import { GameState, gameData, Effect, Chapter } from "./gameData";
import { supabase } from "./supabaseClient";

const USER_ID = "test_user"; // 임시 사용자 ID

// 게임 상태 저장
export async function saveGame(gameState: GameState): Promise<void> {
  try {
    const { data, error } = await supabase
      .from("game_states")
      .upsert({ user_id: USER_ID, state_data: gameState }, { onConflict: "user_id" });

    if (error) {
      throw error;
    }
    console.log("게임 저장 완료:", data);
  } catch (error) {
    console.error("게임 저장 중 오류 발생:", error);
  }
}

// 게임 상태 불러오기
export async function loadGame(): Promise<GameState | null> {
  try {
    const { data, error } = await supabase
      .from("game_states")
      .select("state_data")
      .eq("user_id", USER_ID)
      .single();

    if (error && error.code !== "PGRST116") { // PGRST116은 데이터가 없을 때 발생
      throw error;
    }

    if (data) {
      return data.state_data as GameState;
    }
  } catch (error) {
    console.error("게임 불러오기 중 오류 발생:", error);
  }
  return null;
}

// 게임 상태 업데이트
export function updateGameState(
  gameState: GameState,
  effect: Effect
): GameState {
  const newGameState = { ...gameState };
  for (const key in effect) {
    if (effect.hasOwnProperty(key)) {
      const k = key as keyof Effect;
      if (newGameState[k] !== undefined) {
        (newGameState[k] as number) += effect[k] as number;
        // 스탯이 음수가 되지 않도록 (돈은 음수 가능)
        if (k !== "money" && (newGameState[k] as number) < 0) {
          (newGameState[k] as number) = 0;
        }
      }
    }
  }
  return newGameState;
}

// 배드 엔딩 체크
export function checkBadEnding(
  gameState: GameState
): "stress" | "money" | "naturalist" | null {
  // 챕터별 스트레스 임계값 체크
  const currentChapterData = gameData.chapters[gameState.chapter] as Chapter;
  if (
    currentChapterData &&
    gameState.stress >= currentChapterData.chapter_stress_threshold
  ) {
    return "naturalist";
  }

  // 전역 스트레스 임계값 체크
  if (gameState.stress >= gameData.bad_ending.stress_threshold) {
    return "stress";
  }
  if (gameState.money <= gameData.bad_ending.money_threshold) {
    return "money";
  }
  return null;
}

// 다음 챕터로 진행
export function advanceChapter(
  gameState: GameState
): GameState | "ai_replacement" | "senior_unsuccessful" | null {
  const currentChapterName = gameState.chapter;
  const chaptersOrder = ["newbie", "junior", "mid", "senior", "retirement"];
  const currentIndex = chaptersOrder.indexOf(currentChapterName);

  const currentChapterData = gameData.chapters[currentChapterName] as Chapter;

  // 시니어 챕터에서 기술 마스터 해피 엔딩 또는 시니어 실패 엔딩 체크
  if (currentChapterName === "senior") {
    if (
      currentChapterData.senior_skill_master_threshold &&
      gameState.skill >= currentChapterData.senior_skill_master_threshold
    ) {
      console.log("advanceChapter: 시니어 기술 마스터 해피 엔딩 조건 충족!");
      return null; // isGameComplete: true로 처리될 것임
    } else {
      // 시니어 챕터 완료, 하지만 마스터 스킬 미달

      return "senior_unsuccessful";
    }
  }

  // 일반 챕터의 스킬 임계값 확인 (시니어 챕터는 위에서 처리)
  if (
    currentChapterData &&
    gameState.skill < currentChapterData.skill_threshold
  ) {
    return "ai_replacement"; // 스킬 부족으로 AI 대체 엔딩
  }

  if (currentIndex + 1 <= chaptersOrder.length) {
    const nextChapter = chaptersOrder[currentIndex + 1];
    return {
      ...gameState,
      chapter: nextChapter as GameState["chapter"],
      story_progress: "intro", // 다음 챕터의 시작점으로
    };
  } else {
    // 게임 완료
    console.log("advanceChapter: 게임 완료 (모든 챕터 완료).");
    return null;
  }
}

// 게임 플레이 로직 (선택 처리)
export function processChoice(
  gameState: GameState,
  choiceKey: string
): {
  newGameState: GameState | null;
  message?: string;
  badEndingType?:
    | "stress"
    | "money"
    | "ai_replacement"
    | "naturalist"
    | "senior_unsuccessful"
    | null;
  isGameComplete?: boolean;
} {
  const currentChapterData = gameData.chapters[gameState.chapter];

  if (!currentChapterData) {
    return {
      newGameState: gameState,
      message: "현재 챕터 데이터를 찾을 수 없습니다.",
    };
  }
  const currentStoryPoint = currentChapterData[gameState.story_progress];

  // currentStoryPoint가 StoryPoint 타입인지 확인
  if (
    !currentStoryPoint ||
    typeof currentStoryPoint !== "object" ||
    Array.isArray(currentStoryPoint) ||
    !("text" in currentStoryPoint)
  ) {
    return { newGameState: gameState, message: "잘못된 스토리 포인트입니다." };
  }

  // 선택지가 없는 스토리 포인트 (챕터 끝 지점 등) 처리
  if (!currentStoryPoint.choices) {
    // 챕터 끝 지점에 도달했는지 다시 확인
    if (
      currentChapterData.chapter_end_points.includes(gameState.story_progress)
    ) {
      const advancedState = advanceChapter(gameState);
      if (advancedState === null) {
        // 시니어 기술 마스터 엔딩 또는 최종 해피 엔딩
        if (
          gameState.chapter === "senior" &&
          currentChapterData.senior_skill_master_threshold &&
          gameState.skill >= currentChapterData.senior_skill_master_threshold
        ) {
          return {
            newGameState: gameState,
            isGameComplete: true,
            message: gameData.senior_master_ending_text,
          };
        } else {
          return {
            newGameState: gameState,
            isGameComplete: true,
            message: gameData.happy_ending_text,
          };
        }
      } else if (advancedState === "ai_replacement") {
        return { newGameState: gameState, badEndingType: "ai_replacement" }; // AI 대체 엔딩
      } else if (advancedState === "senior_unsuccessful") {
        // 시니어 실패 엔딩 추가
        return {
          newGameState: gameState,
          badEndingType: "senior_unsuccessful",
        };
      } else {
        // 다음 챕터로 성공적으로 진행된 경우, 새로운 상태를 즉시 반환
        return { newGameState: advancedState };
      }
    } else {
      return {
        newGameState: gameState,
        message: "잘못된 스토리 포인트 또는 선택지 없음.",
      };
    }
  }

  const selectedChoice = currentStoryPoint.choices[choiceKey];

  if (!selectedChoice) {
    return { newGameState: gameState, message: "잘못된 선택입니다." };
  }

  // selectedChoice가 Choice 타입인지 확인
  if (
    typeof selectedChoice === "string" ||
    typeof selectedChoice === "number"
  ) {
    return { newGameState: gameState, message: "잘못된 선택 타입입니다." };
  }

  let newGameState = { ...gameState };
  if (selectedChoice.next_path) {
    newGameState.path = selectedChoice.next_path;
  }

  if (selectedChoice.effect) {
    newGameState = updateGameState(newGameState, selectedChoice.effect);
  }

  // 선택 처리 후 배드 엔딩 체크
  const badEndingCheckResult = checkBadEnding(newGameState);
  if (badEndingCheckResult) {
    return { newGameState: newGameState, badEndingType: badEndingCheckResult };
  }

  newGameState.story_progress = selectedChoice.next_story;

  // 현재 스토리 포인트가 챕터의 끝 지점인지 확인
  if (
    currentChapterData.chapter_end_points.includes(newGameState.story_progress)
  ) {
    const advancedState = advanceChapter(newGameState);
    if (advancedState === null) {
      // 시니어 기술 마스터 엔딩 또는 최종 해피 엔딩
      if (
        gameState.chapter === "senior" &&
        currentChapterData.senior_skill_master_threshold &&
        gameState.skill >= currentChapterData.senior_skill_master_threshold
      ) {
        return {
          newGameState: newGameState,
          isGameComplete: true,
          message: gameData.senior_master_ending_text,
        };
      } else {
        return {
          newGameState: newGameState,
          isGameComplete: true,
          message: gameData.happy_ending_text,
        };
      }
    } else if (advancedState === "ai_replacement") {
      return { newGameState: newGameState, badEndingType: "ai_replacement" }; // AI 대체 엔딩
    } else if (advancedState === "senior_unsuccessful") {
      // 시니어 실패 엔딩 추가
      return {
        newGameState: newGameState,
        badEndingType: "senior_unsuccessful",
      };
    } else {
      // 다음 챕터로 성공적으로 진행된 경우, 새로운 상태를 즉시 반환
      return { newGameState: advancedState };
    }
  }
  return { newGameState: newGameState };
}