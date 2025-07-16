import { NextResponse } from "next/server";
import { loadGame, saveGame } from "@/lib/gameLogic";

export async function GET() {
  const gameState = loadGame();
  if (gameState) {
    return NextResponse.json({ success: true, gameState });
  } else {
    return NextResponse.json({ success: false, message: "저장된 게임이 없습니다." }, { status: 404 });
  }
}

export async function POST(request: Request) {
  const { gameState } = await request.json();
  if (gameState) {
    saveGame(gameState);
    return NextResponse.json({ success: true, message: "게임이 성공적으로 저장되었습니다." });
  } else {
    return NextResponse.json({ success: false, message: "저장할 게임 상태가 제공되지 않았습니다." }, { status: 400 });
  }
}
