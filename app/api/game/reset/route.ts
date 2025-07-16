export const dynamic = "force-static";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const GAME_STATE_FILE = path.resolve(process.cwd(), "game_state.json");

export async function GET() {
  try {
    if (fs.existsSync(GAME_STATE_FILE)) {
      fs.unlinkSync(GAME_STATE_FILE);
      console.log("[게임 상태 파일 삭제 완료]");
      return NextResponse.json({ success: true, message: "게임 상태가 초기화되었습니다." });
    } else {
      return NextResponse.json({ success: true, message: "저장된 게임이 없습니다." });
    }
  } catch (error) {
    console.error("게임 상태 초기화 중 오류 발생:", error);
    return NextResponse.json({ success: false, message: "게임 상태 초기화에 실패했습니다." }, { status: 500 });
  }
}
