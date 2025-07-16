import { NextResponse } from "next/server";
import { loadGame, saveGame, processChoice } from "@/lib/gameLogic";
import { gameData } from "@/lib/gameData";

export async function POST(request: Request) {
  const { choiceKey } = await request.json();
  console.log("API /api/game/choose: 선택 키 수신 -", choiceKey);
  let gameState = loadGame();

  if (!gameState) {
    console.log("API /api/game/choose: 게임 상태를 찾을 수 없습니다.");
    return NextResponse.json({ success: false, message: "게임 상태를 찾을 수 없습니다. 새로운 게임을 시작해주세요." }, { status: 404 });
  }

  const result = processChoice(gameState, choiceKey);
  const newGameState = result.newGameState;
  console.log("API /api/game/choose: processChoice 결과 -", result);

  if (result.badEndingType) {
    let badEndingText = "";
    if (result.badEndingType === "stress") {
      badEndingText = gameData.bad_ending.stress_text;
    } else if (result.badEndingType === "money") {
      badEndingText = gameData.bad_ending.money_text;
    } else if (result.badEndingType === "ai_replacement") {
      badEndingText = gameData.bad_ending.ai_replacement_text;
    } else if (result.badEndingType === "naturalist") {
      badEndingText = gameData.bad_ending.naturalist_text;
    } else if (result.badEndingType === "senior_unsuccessful") {
      badEndingText = gameData.bad_ending.senior_unsuccessful_text;
    }
    saveGame(newGameState!); // 배드 엔딩 상태 저장
    return NextResponse.json({ success: true, gameState: newGameState, isBadEnding: true, badEndingText: badEndingText });
  }

  if (result.isGameComplete) {
    saveGame(newGameState!); // 게임 완료 상태 저장
    return NextResponse.json({ success: true, gameState: newGameState, isGameComplete: true, message: result.message || gameData.happy_ending_text });
  }

  if (newGameState) {
    saveGame(newGameState);
    return NextResponse.json({ success: true, gameState: newGameState });
  } else {
    return NextResponse.json({ success: false, message: result.message || "선택 처리 중 오류가 발생했습니다." }, { status: 400 });
  }
}