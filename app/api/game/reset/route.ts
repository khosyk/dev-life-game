import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

const USER_ID = "test_user"; // 임시 사용자 ID

export async function GET() {
  try {
    const { error } = await supabase
      .from("game_states")
      .delete()
      .eq("user_id", USER_ID);

    if (error) {
      throw error;
    }

    console.log("[게임 상태 삭제 완료]");
    return NextResponse.json({ success: true, message: "게임 상태가 초기화되었습니다." });
  } catch (error) {
    console.error("게임 상태 초기화 중 오류 발생:", error);
    return NextResponse.json({ success: false, message: "게임 상태 초기화에 실패했습니다." }, { status: 500 });
  }
}