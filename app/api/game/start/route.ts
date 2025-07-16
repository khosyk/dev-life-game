import { NextResponse } from "next/server";
import { getInitialGameState } from "@/lib/gameData";
import { saveGame } from "@/lib/gameLogic";

export async function GET() {
  const initialGameState = getInitialGameState();
  saveGame(initialGameState); // 새로운 게임 상태를 파일에 저장
  return NextResponse.json({ success: true, gameState: initialGameState });
}
