export interface Effect {
	skill?: number;
	stress?: number;
	money?: number;
}

export interface Choice {
	text: string;
	next_path?: "frontend" | "backend";
	effect?: Effect;
	next_story: string;
}

export interface StoryPoint {
	text: string;
	choices?: { [key: string]: Choice | string | number };
	effect?: Effect;
	image?: string; // 이미지 경로 추가
}

export interface Chapter {
	skill_threshold: number; // 챕터 완료에 필요한 스킬 임계값
	chapter_end_points: string[]; // 이 챕터의 마지막 스토리 포인트들
	chapter_stress_threshold: number; // 챕터별 스트레스 임계값
	senior_skill_master_threshold?: number; // 시니어 챕터 전용: 기술 마스터 해피 엔딩 스킬 임계값
	[key: string]: StoryPoint | number | string[] | undefined;
}

export interface GameData {
	chapters: {
		newbie: Chapter;
		junior: Chapter;
		mid: Chapter;
		senior: Chapter;
		retirement: Chapter;
	};
	bad_ending: {
		stress_threshold: number; // 전역 스트레스 임계값 (치킨집 사장)
		money_threshold: number;
		stress_text: string;
		money_text: string;
		ai_replacement_text: string;
		naturalist_text: string; // 자연인 배드 엔딩 텍스트
		senior_unsuccessful_text: string; // 시니어 실패 배드 엔딩 텍스트
	};
	happy_ending_text: string; // 최종 해피 엔딩 텍스트
	senior_master_ending_text: string; // 시니어 기술 마스터 해피 엔딩 텍스트
}

export interface GameState {
	chapter: "newbie" | "junior" | "mid" | "senior" | "retirement";
	path: "frontend" | "backend" | null;
	skill: number;
	stress: number;
	money: number;
	inventory: string[];
	story_progress: string;
}

export const gameData: GameData = {
	chapters: {
		newbie: {
			skill_threshold: 25, // 신입 챕터 완료에 필요한 스킬
			chapter_end_points: ["newbie_task_10_result"], // 신입 챕터의 끝 지점
			chapter_stress_threshold: 40, // 신입 챕터 스트레스 임계값
			intro: {
				text: "당신은 막 개발의 세계에 발을 들인 신입 개발자입니다. 어떤 길을 선택하시겠습니까?",
				choices: {
					"1": {
						text: "화려한 UI/UX를 만드는 프론트엔드 개발자가 된다.",
						next_path: "frontend",
						next_story: "newbie_task_1_intro",
					},
					"2": {
						text: "견고한 시스템의 기반을 다지는 백엔드 개발자가 된다.",
						next_path: "backend",
						next_story: "newbie_task_1_intro",
					},
				},
				image: "/images/newbie_intro.png",
			},
			// Task 1: 첫 과제 선택 (프론트/백엔드 공통)
			newbie_task_1_intro: {
				text: "첫 번째 과제는 간단한 웹 페이지/API를 만드는 것입니다. 어떻게 접근하시겠습니까?",
				choices: {
					"1": {
						text: "기본에 충실하게 공식 문서를 보며 구현한다.",
						effect: { skill: 3, stress: 2, money: 50000 },
						next_story: "newbie_task_1_result_success",
					},
					"2": {
						text: "일단 구글링부터 하고 스택오버플로우를 뒤진다.",
						effect: { skill: 1, stress: 4, money: 30000 },
						next_story: "newbie_task_1_result_normal",
					},
					"3": {
						text: "잠시 쉬면서 아이디어를 정리한다.",
						effect: { stress: -5, money: -50000 },
						next_story: "newbie_task_1_result_rest",
					},
				},
				image: "/images/task_1.png",
			},
			newbie_task_1_result_success: {
				text: "공식 문서를 통해 깔끔하게 구현했습니다! 기본기가 탄탄해졌습니다.",
				effect: { stress: -1 },
				choices: {
					"1": { text: "다음 과제 진행", next_story: "newbie_task_2_intro" },
				},
				image: "/images/success.png",
			},
			newbie_task_1_result_normal: {
				text: "구글링으로 해결했지만, 코드의 원리를 완전히 이해하지는 못했습니다.",
				effect: { stress: 1 },
				choices: {
					"1": { text: "다음 과제 진행", next_story: "newbie_task_2_intro" },
				},
				image: "/images/normal.png",
			},
			newbie_task_1_result_rest: {
				text: "잠시 쉬고 나니 마음이 편안해졌습니다. 다시 집중할 수 있습니다.",
				effect: { stress: -3 },
				choices: {
					"1": { text: "다음 과제 진행", next_story: "newbie_task_2_intro" },
				},
				image: "/images/rest.png",
			},
			// Task 2: 코드 리뷰
			newbie_task_2_intro: {
				text: "작성한 코드에 대한 첫 코드 리뷰 시간입니다. 피드백을 어떻게 받아들이시겠습니까? (스트레스 관리 선택지 포함)",
				choices: {
					"1": {
						text: "겸허히 받아들이고 개선점을 찾는다.",
						effect: { skill: 4, stress: 1, money: 70000 },
						next_story: "newbie_task_2_result_success",
					},
					"2": {
						text: "내 코드가 최고라고 생각하며 반박한다.",
						effect: { skill: -1, stress: 6, money: 10000 },
						next_story: "newbie_task_2_result_fail",
					},
					"3": {
						text: "동료들과 함께 저녁 식사를 하며 스트레스를 해소한다.",
						effect: { stress: -5, money: -100000 },
						next_story: "newbie_task_2_result_rest",
					},
				},
				image: "/images/code_review.png",
			},
			newbie_task_2_result_success: {
				text: "코드 리뷰를 통해 많은 것을 배웠습니다. 동료들에게 좋은 인상을 남겼습니다.",
				effect: { stress: -1 },
				choices: {
					"1": { text: "다음 과제 진행", next_story: "newbie_task_3_intro" },
				},
				image: "/images/success.png",
			},
			newbie_task_2_result_fail: {
				text: "코드 리뷰가 논쟁으로 번졌습니다. 팀 분위기가 싸늘해졌습니다.",
				effect: { stress: 2 },
				choices: {
					"1": { text: "다음 과제 진행", next_story: "newbie_task_3_intro" },
				},
				image: "/images/fail.png",
			},
			newbie_task_2_result_rest: {
				text: "맛있는 음식과 대화로 스트레스가 풀렸습니다. 내일은 더 잘할 수 있을 것 같습니다.",
				effect: { stress: -3 },
				choices: {
					"1": { text: "다음 과제 진행", next_story: "newbie_task_3_intro" },
				},
				image: "/images/rest.png",
			},
			// Task 3: 버그 발생
			newbie_task_3_intro: {
				text: "배포 후 예상치 못한 버그가 발생했습니다. 어떻게 대처하시겠습니까?",
				choices: {
					"1": {
						text: "침착하게 로그를 분석하고 디버깅한다.",
						effect: { skill: 5, stress: 3, money: 100000 },
						next_story: "newbie_task_3_result_success",
					},
					"2": {
						text: "일단 숨기고 다른 사람에게 떠넘긴다.",
						effect: { skill: -3, stress: 8, money: 50000 },
						next_story: "newbie_task_3_result_fail",
					},
					"3": {
						text: "주말에 여행을 가서 스트레스를 해소한다.",
						effect: { skill: -1, stress: -10, money: -250000 },
						next_story: "newbie_task_3_result_rest",
					},
				},
				image: "/images/bug_fix.png",
			},
			newbie_task_3_result_success: {
				text: "버그를 성공적으로 해결했습니다! 문제 해결 능력이 향상되었습니다.",
				effect: { stress: -1 },
				choices: {
					"1": { text: "다음 과제 진행", next_story: "newbie_task_4_intro" },
				},
				image: "/images/success.png",
			},
			newbie_task_3_result_fail: {
				text: "버그가 더 커져서 결국 팀장님이 해결했습니다. 신뢰를 잃었습니다.",
				effect: { stress: 2 },
				choices: {
					"1": { text: "다음 과제 진행", next_story: "newbie_task_4_intro" },
				},
				image: "/images/fail.png",
			},
			newbie_task_3_result_rest: {
				text: "여행을 통해 스트레스를 완전히 풀었습니다. 하지만 버그는 여전히 남아있습니다.",
				effect: { stress: -5 },
				choices: {
					"1": { text: "다음 과제 진행", next_story: "newbie_task_4_intro" },
				},
				image: "/images/rest.png",
			},
			// Task 4: 새로운 기술 학습
			newbie_task_4_intro: {
				text: "팀에서 새로운 기술 스택 도입을 논의 중입니다. 당신은 어떻게 반응하시겠습니까?",
				choices: {
					"1": {
						text: "적극적으로 학습하고 도입을 제안한다.",
						effect: { skill: 6, stress: 2, money: 120000 },
						next_story: "newbie_task_4_result_success",
					},
					"2": {
						text: "기존 기술에 만족하며 변화를 거부한다.",
						effect: { skill: -1, stress: 3, money: 80000 },
						next_story: "newbie_task_4_result_fail",
					},
					"3": {
						text: "온라인 강의를 수강하며 새로운 기술을 배우지만, 수강료가 비싸다.",
						effect: { skill: 4, stress: -3, money: -100000 },
						next_story: "newbie_task_4_result_study",
					},
				},
				image: "/images/new_tech.png",
			},
			newbie_task_4_result_success: {
				text: "새로운 기술을 빠르게 습득하여 팀에 기여했습니다. 당신의 성장 가능성을 인정받았습니다.",
				effect: { stress: -1 },
				choices: {
					"1": { text: "다음 과제 진행", next_story: "newbie_task_5_intro" },
				},
				image: "/images/success.png",
			},
			newbie_task_4_result_fail: {
				text: "변화를 거부하여 뒤쳐지기 시작했습니다. 팀에서 당신의 역할이 줄어들고 있습니다.",
				effect: { stress: 2 },
				choices: {
					"1": { text: "다음 과제 진행", next_story: "newbie_task_5_intro" },
				},
				image: "/images/fail.png",
			},
			newbie_task_4_result_study: {
				text: "온라인 강의를 통해 새로운 기술을 습득했습니다. 꾸준한 노력을 보여주었습니다.",
				effect: { stress: -2 },
				choices: {
					"1": { text: "다음 과제 진행", next_story: "newbie_task_5_intro" },
				},
				image: "/images/normal.png",
			},
			// Task 5: 회의 참여
			newbie_task_5_intro: {
				text: "주간 팀 회의 시간입니다. 당신은 어떻게 참여하시겠습니까?",
				choices: {
					"1": {
						text: "적극적으로 의견을 제시하고 질문한다.",
						effect: { skill: 3, stress: 1, money: 60000 },
						next_story: "newbie_task_5_result_success",
					},
					"2": {
						text: "조용히 듣기만 하고 아무 말도 하지 않는다.",
						effect: { skill: 0, stress: 2, money: 20000 },
						next_story: "newbie_task_5_result_normal",
					},
					"3": {
						text: "회의 중 잠시 명상하며 스트레스를 관리한다.",
						effect: { skill: -1, stress: -4, money: -25000 },
						next_story: "newbie_task_5_result_meditate",
					},
				},
				image: "/images/meeting.png",
			},
			newbie_task_5_result_success: {
				text: "당신의 의견이 회의에 반영되었습니다. 팀에 대한 기여도가 높아졌습니다.",
				effect: { stress: -1 },
				choices: {
					"1": { text: "다음 과제 진행", next_story: "newbie_task_6_intro" },
				},
				image: "/images/success.png",
			},
			newbie_task_5_result_normal: {
				text: "회의에 참여했지만, 당신의 존재감은 미미했습니다.",
				effect: { stress: 1 },
				choices: {
					"1": { text: "다음 과제 진행", next_story: "newbie_task_6_intro" },
				},
				image: "/images/normal.png",
			},
			newbie_task_5_result_meditate: {
				text: "회의 중 잠시 명상하여 스트레스를 해소했습니다. 평온한 마음으로 회의에 임할 수 있었습니다.",
				effect: { stress: -2 },
				choices: {
					"1": { text: "다음 과제 진행", next_story: "newbie_task_6_intro" },
				},
				image: "/images/rest.png",
			},
			// Task 6: 문서화
			newbie_task_6_intro: {
				text: "새로 개발한 기능에 대한 문서화 작업이 필요합니다. 어떻게 하시겠습니까?",
				choices: {
					"1": {
						text: "꼼꼼하게 사용자 친화적인 문서를 작성한다.",
						effect: { skill: 4, stress: 2, money: 80000 },
						next_story: "newbie_task_6_result_success",
					},
					"2": {
						text: "대충 필요한 내용만 적고 넘어간다.",
						effect: { skill: 1, stress: 3, money: 40000 },
						next_story: "newbie_task_6_result_fail",
					},
					"3": {
						text: "문서화 작업 대신 운동을 하며 스트레스를 해소한다.",
						effect: { stress: -5, money: -80000 },
						next_story: "newbie_task_6_result_exercise",
					},
				},
				image: "/images/documentation.png",
			},
			newbie_task_6_result_success: {
				text: "잘 작성된 문서 덕분에 다른 팀원들이 쉽게 기능을 이해했습니다. 당신의 책임감을 인정받았습니다.",
				effect: { stress: -1 },
				choices: {
					"1": { text: "다음 과제 진행", next_story: "newbie_task_7_intro" },
				},
				image: "/images/success.png",
			},
			newbie_task_6_result_fail: {
				text: "부실한 문서 때문에 다른 팀원들이 혼란을 겪었습니다. 추가적인 설명이 필요했습니다.",
				effect: { stress: 2 },
				choices: {
					"1": { text: "다음 과제 진행", next_story: "newbie_task_7_intro" },
				},
				image: "/images/fail.png",
			},
			newbie_task_6_result_exercise: {
				text: "운동으로 스트레스를 해소했습니다. 몸과 마음이 가벼워졌습니다.",
				effect: { stress: -3 },
				choices: {
					"1": { text: "다음 과제 진행", next_story: "newbie_task_7_intro" },
				},
				image: "/images/rest.png",
			},
			// Task 7: 테스트 코드 작성
			newbie_task_7_intro: {
				text: "새로운 기능에 대한 테스트 코드 작성이 필요합니다. 어떻게 하시겠습니까?",
				choices: {
					"1": {
						text: "모든 엣지 케이스를 고려하여 완벽한 테스트 코드를 작성한다.",
						effect: { skill: 5, stress: 3, money: 110000 },
						next_story: "newbie_task_7_result_success",
					},
					"2": {
						text: "일단 동작하는지만 확인하는 최소한의 테스트만 작성한다.",
						effect: { skill: 2, stress: 4, money: 60000 },
						next_story: "newbie_task_7_result_fail",
					},
					"3": {
						text: "테스트 코드 작성 대신 좋아하는 음악을 들으며 스트레스를 해소한다.",
						effect: { stress: -5, money: -75000 },
						next_story: "newbie_task_7_result_music",
					},
				},
				image: "/images/testing.png",
			},
			newbie_task_7_result_success: {
				text: "견고한 테스트 코드 덕분에 버그 없이 안정적으로 배포되었습니다. 당신의 꼼꼼함을 인정받았습니다.",
				effect: { stress: -1 },
				choices: {
					"1": { text: "다음 과제 진행", next_story: "newbie_task_8_intro" },
				},
				image: "/images/success.png",
			},
			newbie_task_7_result_fail: {
				text: "부실한 테스트 코드 때문에 배포 후 버그가 발생했습니다. 긴급 패치가 필요했습니다.",
				effect: { stress: 2 },
				choices: {
					"1": { text: "다음 과제 진행", next_story: "newbie_task_8_intro" },
				},
				image: "/images/fail.png",
			},
			newbie_task_7_result_music: {
				text: "음악을 들으며 스트레스를 해소했습니다. 마음이 편안해졌습니다.",
				effect: { stress: -3 },
				choices: {
					"1": { text: "다음 과제 진행", next_story: "newbie_task_8_intro" },
				},
				image: "/images/rest.png",
			},
			// Task 8: 데일리 스크럼
			newbie_task_8_intro: {
				text: "데일리 스크럼 시간입니다. 어제 한 일, 오늘 할 일, 그리고 이슈를 공유해야 합니다. 어떻게 발표하시겠습니까?",
				choices: {
					"1": {
						text: "간결하고 명확하게 핵심만 전달한다.",
						effect: { skill: 2, stress: 1, money: 50000 },
						next_story: "newbie_task_8_result_success",
					},
					"2": {
						text: "장황하게 설명하거나, 이슈를 숨긴다.",
						effect: { skill: -1, stress: 4, money: 20000 },
						next_story: "newbie_task_8_result_fail",
					},
					"3": {
						text: "발표 전 동료와 가볍게 대화하며 긴장을 푼다.",
						effect: { stress: -3, money: -25000 },
						next_story: "newbie_task_8_result_chat",
					},
				},
				image: "/images/scrum.png",
			},
			newbie_task_8_result_success: {
				text: "명확한 소통으로 팀의 생산성에 기여했습니다. 당신의 커뮤니케이션 능력이 향상되었습니다.",
				effect: { stress: -1 },
				choices: {
					"1": { text: "다음 과제 진행", next_story: "newbie_task_9_intro" },
				},
				image: "/images/success.png",
			},
			newbie_task_8_result_fail: {
				text: "불명확한 소통으로 팀원들이 혼란을 겪었습니다. 팀장님의 개입이 필요했습니다.",
				effect: { stress: 2 },
				choices: {
					"1": { text: "다음 과제 진행", next_story: "newbie_task_9_intro" },
				},
				image: "/images/fail.png",
			},
			newbie_task_8_result_chat: {
				text: "동료와의 대화로 긴장이 풀렸습니다. 스크럼에 자신감 있게 참여할 수 있었습니다.",
				effect: { stress: -2 },
				choices: {
					"1": { text: "다음 과제 진행", next_story: "newbie_task_9_intro" },
				},
				image: "/images/normal.png",
			},
			// Task 9: 기술 부채
			newbie_task_9_intro: {
				text: "프로젝트에 기술 부채가 쌓여가고 있습니다. 당신은 어떻게 생각하시겠습니까?",
				choices: {
					"1": {
						text: "장기적인 관점에서 기술 부채 해결을 제안한다.",
						effect: { skill: 4, stress: 3, money: 90000 },
						next_story: "newbie_task_9_result_success",
					},
					"2": {
						text: "당장 급한 불만 끄고 넘어간다.",
						effect: { skill: -5, stress: 5, money: 10000 },
						next_story: "newbie_task_9_result_fail",
					},
					"3": {
						text: "기술 부채 관련 책을 읽으며 해결 방안을 모색한다.",
						effect: { skill: 3, stress: -2, money: -50000 },
						next_story: "newbie_task_9_result_book",
					},
				},
				image: "/images/tech_debt.png",
			},
			newbie_task_9_result_success: {
				text: "당신의 제안으로 기술 부채 해결 방안이 논의되었습니다. 당신의 통찰력을 인정받았습니다.",
				effect: { stress: -1 },
				choices: {
					"1": { text: "다음 과제 진행", next_story: "newbie_task_10_intro" },
				},
				image: "/images/success.png",
			},
			newbie_task_9_result_fail: {
				text: "기술 부채는 점점 더 커져만 갑니다. 미래의 당신에게 큰 짐이 될 것입니다.",
				effect: { stress: 2 },
				choices: {
					"1": { text: "다음 과제 진행", next_story: "newbie_task_10_intro" },
				},
				image: "/images/fail.png",
			},
			newbie_task_9_result_book: {
				text: "책을 통해 기술 부채에 대한 이해를 높였습니다. 문제 해결에 대한 새로운 시각을 얻었습니다.",
				effect: { stress: -3 },
				choices: {
					"1": { text: "다음 과제 진행", next_story: "newbie_task_10_intro" },
				},
				image: "/images/normal.png",
			},
			// Task 10: 자기 계발
			newbie_task_10_intro: {
				text: "퇴근 후 당신은 무엇을 하시겠습니까?",
				choices: {
					"1": {
						text: "새로운 기술 스터디나 사이드 프로젝트를 진행한다.",
						effect: { skill: 6, stress: 2, money: 150000 },
						next_story: "newbie_task_10_result",
					},
					"2": {
						text: "푹 쉬면서 게임이나 영화를 본다.",
						effect: { skill: 0, stress: -3, money: -50000 },
						next_story: "newbie_task_10_result",
					},
					"3": {
						text: "친구들과 술 한잔하며 스트레스를 해소한다.",
						effect: { stress: -7, money: -120000 },
						next_story: "newbie_task_10_result",
					},
				},
				image: "/images/self_improvement.png",
			},
			newbie_task_10_result: {
				text: "신입 개발자로서의 첫 챕터를 성공적으로 마쳤습니다. 당신의 노력이 빛을 발할 때입니다.",
				effect: { money: 150000, stress: -2 },
				image: "/images/chapter_end.png",
			},
		},
		junior: {
			skill_threshold: 50, // 주니어 챕터 완료에 필요한 스킬
			chapter_end_points: ["junior_task_10_result"], // 주니어 챕터의 끝 지점
			chapter_stress_threshold: 60, // 주니어 챕터 스트레스 임계값
			intro: {
				text: "주니어 개발자가 되신 것을 축하합니다! 이제 좀 더 복잡한 문제에 직면하게 됩니다. 첫 번째 주니어 과제는 무엇일까요?",
				choices: {
					"1": {
						text: "복잡한 레거시 시스템 리팩토링",
						effect: { skill: 8, stress: 8, money: 200000 },
						next_story: "junior_task_1_result",
					},
					"2": {
						text: "고성능 서비스 아키텍처 설계 참여",
						effect: { skill: 7, stress: 5, money: 180000 },
						next_story: "junior_task_1_result",
					},
					"3": {
						text: "주말에 등산을 하며 스트레스를 해소한다.",
						effect: { stress: -8, money: -100000 },
						next_story: "junior_task_1_result",
					},
				},
				image: "/images/junior_intro.png",
			},
			// Task 1: 복잡한 과제
			junior_task_1_result: {
				text: "첫 번째 주니어 과제를 완료했습니다. 당신의 역량이 한층 성장했습니다.",
				effect: { stress: -1 },
				choices: {
					"1": { text: "다음 과제 진행", next_story: "junior_task_2_intro" },
				},
				image: "/images/success.png",
			},
			// Task 2: 팀 리더십
			junior_task_2_intro: {
				text: "작은 프로젝트의 리더를 맡게 되었습니다. 팀원들을 어떻게 이끌어 나갈까요?",
				choices: {
					"1": {
						text: "적극적으로 소통하고 팀원들의 성장을 돕는다.",
						effect: { skill: 6, stress: 3, money: 150000 },
						next_story: "junior_task_2_result_success",
					},
					"2": {
						text: "모든 것을 혼자 결정하고 지시한다.",
						effect: { skill: 2, stress: 10, money: 100000 },
						next_story: "junior_task_2_result_fail",
					},
					"3": {
						text: "팀원들과 함께 워크숍을 진행하며 스트레스를 해소한다.",
						effect: { stress: -7, money: -250000 },
						next_story: "junior_task_2_result_rest",
					},
				},
				image: "/images/team_leadership.png",
			},
			junior_task_2_result_success: {
				text: "성공적인 리더십으로 프로젝트를 완수했습니다. 팀원들의 신뢰를 얻었습니다.",
				effect: { stress: -1 },
				choices: {
					"1": { text: "다음 과제 진행", next_story: "junior_task_3_intro" },
				},
				image: "/images/success.png",
			},
			junior_task_2_result_fail: {
				text: "독단적인 결정으로 팀원들의 불만이 쌓였습니다. 프로젝트가 지연되었습니다.",
				effect: { stress: 2 },
				choices: {
					"1": { text: "다음 과제 진행", next_story: "junior_task_3_intro" },
				},
				image: "/images/fail.png",
			},
			junior_task_2_result_rest: {
				text: "워크숍을 통해 팀원들과의 유대감이 깊어졌습니다. 스트레스도 해소되었습니다.",
				effect: { stress: -3 },
				choices: {
					"1": { text: "다음 과제 진행", next_story: "junior_task_3_intro" },
				},
				image: "/images/rest.png",
			},
			// Task 3: 장애 대응
			junior_task_3_intro: {
				text: "서비스에 심각한 장애가 발생했습니다. 긴급하게 대응해야 합니다. 어떻게 하시겠습니까?",
				choices: {
					"1": {
						text: "침착하게 원인을 분석하고 복구 계획을 세운다.",
						effect: { skill: 9, stress: 8, money: 200000 },
						next_story: "junior_task_3_result_success",
					},
					"2": {
						text: "패닉에 빠져 우왕좌왕하거나 책임을 회피한다.",
						effect: { skill: -3, stress: 15, money: 50000 },
						next_story: "junior_task_3_result_fail",
					},
					"3": {
						text: "잠시 게임을 하며 스트레스를 해소한다.",
						effect: { stress: -10, money: -50000 },
						next_story: "junior_task_3_result_rest",
					},
				},
				image: "/images/disaster.png",
			},
			junior_task_3_result_success: {
				text: "신속하고 정확한 대응으로 장애를 복구했습니다. 당신의 위기 대응 능력을 인정받았습니다.",
				effect: { stress: -1 },
				choices: {
					"1": { text: "다음 과제 진행", next_story: "junior_task_4_intro" },
				},
				image: "/images/success.png",
			},
			junior_task_3_result_fail: {
				text: "장애 대응에 실패하여 서비스가 장시간 중단되었습니다. 회사에 막대한 손실을 입혔습니다.",
				effect: { stress: 3 },
				choices: {
					"1": { text: "다음 과제 진행", next_story: "junior_task_4_intro" },
				},
				image: "/images/fail.png",
			},
			junior_task_3_result_rest: {
				text: "게임을 하며 스트레스를 해소했습니다. 하지만 장애는 여전히 남아있습니다.",
				effect: { stress: -5 },
				choices: {
					"1": { text: "다음 과제 진행", next_story: "junior_task_4_intro" },
				},
				image: "/images/rest.png",
			},
			// Task 4: 기술 세미나 발표
			junior_task_4_intro: {
				text: "사내 기술 세미나에서 발표할 기회가 생겼습니다. 어떤 주제로 발표하시겠습니까?",
				choices: {
					"1": {
						text: "최근 학습한 새로운 기술에 대해 심도 있게 발표한다.",
						effect: { skill: 7, stress: 10, money: 100000 },
						next_story: "junior_task_4_result_success",
					},
					"2": {
						text: "이미 잘 알려진 기술을 대충 정리해서 발표한다.",
						effect: { skill: 3, stress: 3, money: 50000 },
						next_story: "junior_task_4_result_normal",
					},
					"3": {
						text: "발표 준비 대신 영화를 보며 스트레스를 해소한다.",
						effect: { stress: -7, money: -40000 },
						next_story: "junior_task_4_result_rest",
					},
				},
				image: "/images/seminar.png",
			},
			junior_task_4_result_success: {
				text: "성공적인 발표로 많은 동료들에게 영감을 주었습니다. 당신의 전문성을 인정받았습니다.",
				effect: { stress: -1 },
				choices: {
					"1": { text: "다음 과제 진행", next_story: "junior_task_5_intro" },
				},
				image: "/images/success.png",
			},
			junior_task_4_result_normal: {
				text: "무난한 발표였지만, 큰 인상을 남기지는 못했습니다.",
				effect: { stress: 1 },
				choices: {
					"1": { text: "다음 과제 진행", next_story: "junior_task_5_intro" },
				},
				image: "/images/normal.png",
			},
			junior_task_4_result_rest: {
				text: "영화를 보며 스트레스를 해소했습니다. 하지만 발표 기회를 놓쳤습니다.",
				effect: { stress: -3 },
				choices: {
					"1": { text: "다음 과제 진행", next_story: "junior_task_5_intro" },
				},
				image: "/images/rest.png",
			},
			// Task 5: 주니어 멘토링
			junior_task_5_intro: {
				text: "새로 들어온 신입 개발자를 멘토링하게 되었습니다. 어떻게 멘토링하시겠습니까?",
				choices: {
					"1": {
						text: "친절하게 가르치고, 스스로 문제를 해결하도록 돕는다.",
						effect: { skill: 5, stress: 5, money: 70000 },
						next_story: "junior_task_5_result_success",
					},
					"2": {
						text: "바쁘다는 핑계로 대충 알려주거나 무관심하다.",
						effect: { skill: 1, stress: 1, money: 20000 },
						next_story: "junior_task_5_result_fail",
					},
					"3": {
						text: "멘토링 대신 맛집 탐방으로 스트레스를 해소한다.",
						effect: { stress: -6, money: -100000 },
						next_story: "junior_task_5_result_food",
					},
				},
				image: "/images/mentoring.png",
			},
			junior_task_5_result_success: {
				text: "신입 개발자가 빠르게 성장하는 데 기여했습니다. 당신의 리더십을 인정받았습니다.",
				effect: { stress: -1 },
				choices: {
					"1": { text: "다음 과제 진행", next_story: "junior_task_6_intro" },
				},
				image: "/images/success.png",
			},
			junior_task_5_result_fail: {
				text: "신입 개발자가 어려움을 겪고 결국 퇴사했습니다. 당신의 책임감이 부족했습니다.",
				effect: { stress: 2 },
				choices: {
					"1": { text: "다음 과제 진행", next_story: "junior_task_6_intro" },
				},
				image: "/images/fail.png",
			},
			junior_task_5_result_food: {
				text: "맛있는 음식을 먹으며 스트레스를 해소했습니다. 하지만 멘토링은 뒷전이 되었습니다.",
				effect: { stress: -3 },
				choices: {
					"1": { text: "다음 과제 진행", next_story: "junior_task_6_intro" },
				},
				image: "/images/rest.png",
			},
			// Task 6: 기술 스택 변경 제안
			junior_task_6_intro: {
				text: "현재 프로젝트의 기술 스택이 노후화되었습니다. 새로운 기술 스택으로의 변경을 제안하시겠습니까?",
				choices: {
					"1": {
						text: "타당한 근거와 함께 새로운 기술 스택 도입을 제안한다.",
						effect: { skill: 8, stress: 8, money: 250000 },
						next_story: "junior_task_6_result_success",
					},
					"2": {
						text: "현상 유지에 만족하며 변화를 두려워한다.",
						effect: { skill: 2, stress: 5, money: 150000 },
						next_story: "junior_task_6_result_fail",
					},
					"3": {
						text: "기술 스택 변경 대신 주말에 취미 활동을 즐긴다.",
						effect: { stress: -8, money: -80000 },
						next_story: "junior_task_6_result_hobby",
					},
				},
				image: "/images/tech_stack_change.png",
			},
			junior_task_6_result_success: {
				text: "당신의 제안으로 프로젝트의 기술 스택이 성공적으로 업그레이드되었습니다. 당신의 선견지명을 인정받았습니다.",
				effect: { stress: -1 },
				choices: {
					"1": { text: "다음 과제 진행", next_story: "junior_task_7_intro" },
				},
				image: "/images/success.png",
			},
			junior_task_6_result_fail: {
				text: "기술 스택 노후화로 인해 프로젝트의 유지보수가 점점 더 어려워지고 있습니다.",
				effect: { stress: 2 },
				choices: {
					"1": { text: "다음 과제 진행", next_story: "junior_task_7_intro" },
				},
				image: "/images/fail.png",
			},
			junior_task_6_result_hobby: {
				text: "취미 활동으로 스트레스를 해소했습니다. 하지만 기술 스택 변경 기회를 놓쳤습니다.",
				effect: { stress: -3 },
				choices: {
					"1": { text: "다음 과제 진행", next_story: "junior_task_7_intro" },
				},
				image: "/images/rest.png",
			},
			// Task 7: 외부 컨퍼런스 참여
			junior_task_7_intro: {
				text: "외부 개발자 컨퍼런스에 참여할 기회가 생겼습니다. 어떻게 활용하시겠습니까?",
				choices: {
					"1": {
						text: "적극적으로 네트워킹하고 최신 기술 동향을 파악한다.",
						effect: { skill: 6, stress: 5, money: -80000 },
						next_story: "junior_task_7_result_success",
					},
					"2": {
						text: "그냥 쉬러 가거나, 아는 사람들과만 어울린다.",
						effect: { skill: 1, stress: 0, money: -50000 },
						next_story: "junior_task_7_result_normal",
					},
					"3": {
						text: "컨퍼런스 대신 집에서 휴식을 취한다.",
						effect: { stress: -6, money: -80000 },
						next_story: "junior_task_7_result_rest",
					},
				},
				image: "/images/conference.png",
			},
			junior_task_7_result_success: {
				text: "컨퍼런스에서 얻은 지식으로 팀에 새로운 아이디어를 제시했습니다. 당신의 열정을 인정받았습니다.",
				effect: { stress: -1 },
				choices: {
					"1": { text: "다음 과제 진행", next_story: "junior_task_8_intro" },
				},
				image: "/images/success.png",
			},
			junior_task_7_result_normal: {
				text: "무난한 발표였지만, 큰 인상을 남기지는 못했습니다.",
				effect: { stress: 1 },
				choices: {
					"1": { text: "다음 과제 진행", next_story: "junior_task_8_intro" },
				},
				image: "/images/normal.png",
			},
			junior_task_7_result_rest: {
				text: "충분한 휴식으로 스트레스를 해소했습니다. 하지만 컨퍼런스 기회를 놓쳤습니다.",
				effect: { stress: -3 },
				choices: {
					"1": { text: "다음 과제 진행", next_story: "junior_task_8_intro" },
				},
				image: "/images/rest.png",
			},
			// Task 8: 복잡한 알고리즘 구현
			junior_task_8_intro: {
				text: "프로젝트에 복잡한 알고리즘 구현이 필요합니다. 어떻게 접근하시겠습니까?",
				choices: {
					"1": {
						text: "자료구조와 알고리즘을 깊이 있게 학습하여 최적의 솔루션을 찾는다.",
						effect: { skill: 9, stress: 6, money: 350000 },
						next_story: "junior_task_8_result_success",
					},
					"2": {
						text: "대충 인터넷에서 찾은 코드를 복사 붙여넣기 한다.",
						effect: { skill: 1, stress: 1, money: 100000 },
						next_story: "junior_task_8_result_fail",
					},
					"3": {
						text: "알고리즘 스터디 그룹에 참여하여 함께 해결한다.",
						effect: { skill: 3, stress: -9, money: -80000 },
						next_story: "junior_task_8_result_study",
					},
				},
				image: "/images/algorithm.png",
			},
			junior_task_8_result_success: {
				text: "최적화된 알고리즘 구현으로 서비스 성능을 크게 향상시켰습니다. 당신의 뛰어난 문제 해결 능력을 인정받았습니다.",
				effect: { stress: -1 },
				choices: {
					"1": { text: "다음 과제 진행", next_story: "junior_task_9_intro" },
				},
				image: "/images/success.png",
			},
			junior_task_8_result_fail: {
				text: "성능 문제가 발생하여 서비스에 지장을 주었습니다. 결국 다른 팀원이 해결해야 했습니다.",
				effect: { stress: 3 },
				choices: {
					"1": { text: "다음 과제 진행", next_story: "junior_task_9_intro" },
				},
				image: "/images/fail.png",
			},
			junior_task_8_result_study: {
				text: "스터디 그룹을 통해 알고리즘을 이해하고 해결했습니다. 협력의 중요성을 깨달았습니다.",
				effect: { stress: -2 },
				choices: {
					"1": { text: "다음 과제 진행", next_story: "junior_task_9_intro" },
				},
				image: "/images/normal.png",
			},
			// Task 9: 사이드 프로젝트
			junior_task_9_intro: {
				text: "퇴근 후 당신은 사이드 프로젝트를 시작할까 고민 중입니다. 어떤 프로젝트를 하시겠습니까?",
				choices: {
					"1": {
						text: "새로운 기술을 적용한 혁신적인 프로젝트를 시도한다.",
						effect: { skill: 6, stress: 3, money: 100000 },
						next_story: "junior_task_9_result_success",
					},
					"2": {
						text: "간단한 토이 프로젝트로 만족한다.",
						effect: { skill: 2, stress: 1, money: 0 },
						next_story: "junior_task_9_result_normal",
					},
					"3": {
						text: "사이드 프로젝트 대신 충분한 휴식을 취한다.",
						effect: { stress: -7, money: -100000 },
						next_story: "junior_task_9_result_rest",
					},
				},
				image: "/images/side_project.png",
			},
			junior_task_9_result_success: {
				text: "사이드 프로젝트가 성공적으로 완성되어 포트폴리오에 큰 도움이 되었습니다. 당신의 열정을 인정받았습니다.",
				effect: { stress: -1 },
				choices: {
					"1": { text: "다음 과제 진행", next_story: "junior_task_10_intro" },
				},
				image: "/images/success.png",
			},
			junior_task_9_result_normal: {
				text: "사이드 프로젝트를 통해 소소한 즐거움을 얻었습니다.",
				effect: { stress: 0 },
				choices: {
					"1": { text: "다음 과제 진행", next_story: "junior_task_10_intro" },
				},
				image: "/images/normal.png",
			},
			junior_task_9_result_rest: {
				text: "충분한 휴식으로 스트레스를 해소했습니다. 다음 날 업무에 집중할 수 있었습니다.",
				effect: { stress: -3 },
				choices: {
					"1": { text: "다음 과제 진행", next_story: "junior_task_10_intro" },
				},
				image: "/images/rest.png",
			},
			// Task 10: 주니어 챕터 마무리
			junior_task_10_intro: {
				text: "주니어 개발자로서의 마지막 과제입니다. 당신의 지난 시간을 돌아보며 무엇을 느끼시겠습니까?",
				choices: {
					"1": {
						text: "많은 것을 배우고 성장했음을 느낀다.",
						effect: { skill: 3, stress: -2 },
						next_story: "junior_task_10_result",
					},
					"2": {
						text: "아직 부족한 점이 많다고 느낀다.",
						effect: { skill: 1, stress: 2 },
						next_story: "junior_task_10_result",
					},
					"3": {
						text: "동료들과 함께 회고하며 서로를 격려한다.",
						effect: { skill: 2, stress: -4 },
						next_story: "junior_task_10_result",
					},
				},
				image: "/images/chapter_end.png",
			},
			junior_task_10_result: {
				text: "주니어 개발자 챕터를 성공적으로 마쳤습니다. 이제 당신은 다음 단계로 나아갈 준비가 되었습니다.",
				effect: { money: 200000, stress: -2 },
				image: "/images/chapter_end.png",
			},
		},
		mid: {
			skill_threshold: 80, // 미드 챕터 완료에 필요한 스킬
			chapter_end_points: ["mid_task_10_result"], // 미드 챕터의 끝 지점
			chapter_stress_threshold: 80, // 미드 챕터 스트레스 임계값
			intro: {
				text: "미드 개발자가 되신 것을 축하합니다! 이제 당신은 팀의 핵심 멤버입니다. 첫 번째 미드 과제는 무엇일까요?",
				choices: {
					"1": {
						text: "대규모 시스템 아키텍처 설계",
						effect: { skill: 10, stress: 5, money: 300000 },
						next_story: "mid_task_1_result",
					},
					"2": {
						text: "신규 프로젝트 기술 스택 선정 및 초기 개발",
						effect: { skill: 8, stress: 7, money: 250000 },
						next_story: "mid_task_1_result",
					},
					"3": {
						text: "팀원들과 함께 간식을 먹으며 브레인스토밍한다.",
						effect: { skill: 7, stress: 0, money: -100000 },
						next_story: "mid_task_1_result",
					},
				},
				image: "/images/mid_intro.png",
			},
			mid_task_1_result: {
				text: "미드 챕터의 첫 과제를 완료했습니다. 다음 과제로 넘어갑니다.",
				effect: { stress: -1 },
				choices: {
					"1": { text: "다음 과제 진행", next_story: "mid_task_2_intro" },
				},
				image: "/images/success.png",
			},
			// Task 2: 코드 품질 개선
			mid_task_2_intro: {
				text: "프로젝트의 코드 품질이 좋지 않아 유지보수가 어렵습니다. 어떻게 하시겠습니까?",
				choices: {
					"1": {
						text: "리팩토링 계획을 세우고 팀원들을 설득하여 개선한다.",
						effect: { skill: 12, stress: 10, money: -200000 },
						next_story: "mid_task_2_result_success",
					},
					"2": {
						text: "당장 급한 기능 개발에만 집중하고 코드 품질은 무시한다.",
						effect: { skill: 3, stress: 3, money: 50000 },
						next_story: "mid_task_2_result_fail",
					},
					"3": {
						text: "주말에 개인적으로 시간을 내어 개선하지만, 피로가 쌓인다.",
						effect: { skill: 10, stress: 8, money: -100000 },
						next_story: "mid_task_2_result_personal",
					},
				},
				image: "/images/code_quality.png",
			},
			mid_task_2_result_success: {
				text: "코드 품질 개선으로 프로젝트의 생산성이 향상되었습니다. 당신의 리더십을 인정받았습니다.",
				effect: { stress: -2 },
				choices: {
					"1": { text: "다음 과제 진행", next_story: "mid_task_3_intro" },
				},
				image: "/images/success.png",
			},
			mid_task_2_result_fail: {
				text: "코드 품질은 점점 더 나빠지고, 버그는 늘어만 갑니다. 팀원들의 불만이 커지고 있습니다.",
				effect: { stress: 3 },
				choices: {
					"1": { text: "다음 과제 진행", next_story: "mid_task_3_intro" },
				},
				image: "/images/fail.png",
			},
			mid_task_2_result_personal: {
				text: "개인적인 노력으로 코드 품질을 개선했습니다. 하지만 피로가 쌓였습니다.",
				effect: { stress: 5 },
				choices: {
					"1": { text: "다음 과제 진행", next_story: "mid_task_3_intro" },
				},
				image: "/images/normal.png",
			},
			// Task 3: 팀원 갈등 중재
			mid_task_3_intro: {
				text: "팀원들 사이에 갈등이 발생했습니다. 어떻게 중재하시겠습니까?",
				choices: {
					"1": {
						text: "양쪽의 의견을 경청하고 합리적인 해결책을 제시한다.",
						effect: { skill: 8, stress: 4, money: 100000 },
						next_story: "mid_task_3_result_success",
					},
					"2": {
						text: "모른 척하거나, 한쪽 편만 든다.",
						effect: { skill: 2, stress: 2, money: 50000 },
						next_story: "mid_task_3_result_fail",
					},
					"3": {
						text: "팀 빌딩 활동을 제안하여 분위기를 전환한다.",
						effect: { skill: 5, stress: -5, money: -80000 },
						next_story: "mid_task_3_result_teambuilding",
					},
				},
				image: "/images/conflict.png",
			},
			mid_task_3_result_success: {
				text: "성공적인 중재로 팀 분위기가 다시 좋아졌습니다. 당신의 소통 능력을 인정받았습니다.",
				effect: { stress: -1 },
				choices: {
					"1": { text: "다음 과제 진행", next_story: "mid_task_4_intro" },
				},
				image: "/images/success.png",
			},
			mid_task_3_result_fail: {
				text: "갈등이 심화되어 팀의 생산성이 저하되었습니다. 결국 팀장님의 개입이 필요했습니다.",
				effect: { stress: 2 },
				choices: {
					"1": { text: "다음 과제 진행", next_story: "mid_task_4_intro" },
				},
				image: "/images/fail.png",
			},
			mid_task_3_result_teambuilding: {
				text: "팀 빌딩 활동으로 팀원들의 스트레스를 해소하고 갈등을 완화했습니다.",
				effect: { stress: -4 },
				choices: {
					"1": { text: "다음 과제 진행", next_story: "mid_task_4_intro" },
				},
				image: "/images/team_work.png",
			},
			// Task 4: 클라우드 마이그레이션
			mid_task_4_intro: {
				text: "온프레미스 시스템을 클라우드로 마이그레이션하는 프로젝트를 맡게 되었습니다. 어떻게 진행하시겠습니까?",
				choices: {
					"1": {
						text: "철저한 계획과 검증을 통해 안전하게 마이그레이션한다.",
						effect: { skill: 15, stress: 10, money: 300000 },
						next_story: "mid_task_4_result_success",
					},
					"2": {
						text: "대충 옮기고 나중에 문제 생기면 해결한다.",
						effect: { skill: 5, stress: 5, money: 100000 },
						next_story: "mid_task_4_result_fail",
					},
					"3": {
						text: "클라우드 마이그레이션 대신 휴가를 떠나 스트레스를 해소한다.",
						effect: { stress: -15, money: -500000 },
						next_story: "mid_task_4_result_rest",
					},
				},
				image: "/images/cloud_migration.png",
			},
			mid_task_4_result_success: {
				text: "성공적인 클라우드 마이그레이션으로 시스템의 안정성과 확장성을 확보했습니다. 당신의 전문성을 인정받았습니다.",
				effect: { stress: -1 },
				choices: {
					"1": { text: "다음 과제 진행", next_story: "mid_task_5_intro" },
				},
				image: "/images/success.png",
			},
			mid_task_4_result_fail: {
				text: "마이그레이션 중 심각한 문제가 발생하여 서비스가 중단되었습니다. 회사에 막대한 손실을 입혔습니다.",
				effect: { stress: 3 },
				choices: {
					"1": { text: "다음 과제 진행", next_story: "mid_task_5_intro" },
				},
				image: "/images/fail.png",
			},
			mid_task_4_result_rest: {
				text: "휴가를 통해 스트레스를 해소했습니다. 하지만 마이그레이션은 여전히 남아있습니다.",
				effect: { stress: -5 },
				choices: {
					"1": { text: "다음 과제 진행", next_story: "mid_task_5_intro" },
				},
				image: "/images/rest.png",
			},
			// Task 5: 성능 최적화
			mid_task_5_intro: {
				text: "서비스의 응답 속도가 느려 사용자 불만이 많습니다. 성능 최적화를 어떻게 진행하시겠습니까?",
				choices: {
					"1": {
						text: "병목 현상을 분석하고, 코드 및 인프라 최적화를 진행한다.",
						effect: { skill: 13, stress: 7, money: 300000 },
						next_story: "mid_task_5_result_success",
					},
					"2": {
						text: "일단 서버 증설부터 하고 본다.",
						effect: { skill: 4, stress: 6, money: 150000 },
						next_story: "mid_task_5_result_fail",
					},
					"3": {
						text: "전문가에게 자문을 구하고 함께 해결한다.",
						effect: { skill: 10, stress: -4, money: -100000 },
						next_story: "mid_task_5_result_consult",
					},
				},
				image: "/images/performance.png",
			},
			mid_task_5_result_success: {
				text: "성능 최적화로 서비스 응답 속도가 크게 향상되었습니다. 사용자 만족도가 높아졌습니다.",
				effect: { stress: -1 },
				choices: {
					"1": { text: "다음 과제 진행", next_story: "mid_task_6_intro" },
				},
				image: "/images/success.png",
			},
			mid_task_5_result_fail: {
				text: "서버 증설만으로는 문제가 해결되지 않았습니다. 불필요한 비용만 발생했습니다.",
				effect: { stress: 2 },
				choices: {
					"1": { text: "다음 과제 진행", next_story: "mid_task_6_intro" },
				},
				image: "/images/fail.png",
			},
			mid_task_5_result_consult: {
				text: "전문가의 도움으로 성능 최적화를 성공적으로 완료했습니다. 현명한 판단력을 보여주었습니다.",
				effect: { stress: -3 },
				choices: {
					"1": { text: "다음 과제 진행", next_story: "mid_task_6_intro" },
				},
				image: "/images/normal.png",
			},
			// Task 6: 보안 취약점 발견
			mid_task_6_intro: {
				text: "서비스에서 심각한 보안 취약점이 발견되었습니다. 어떻게 대응하시겠습니까?",
				choices: {
					"1": {
						text: "즉시 패치하고, 재발 방지 대책을 수립한다.",
						effect: { skill: 10, stress: 9, money: 200000 },
						next_story: "mid_task_6_result_success",
					},
					"2": {
						text: "일단 숨기고, 나중에 조용히 해결한다.",
						effect: { skill: -5, stress: 12, money: 100000 },
						next_story: "mid_task_6_result_fail",
					},
					"3": {
						text: "보안 컨퍼런스에 참석하여 최신 보안 기술을 학습한다.",
						effect: { skill: 8, stress: -5, money: -90000 },
						next_story: "mid_task_6_result_conference",
					},
				},
				image: "/images/security.png",
			},
			mid_task_6_result_success: {
				text: "신속한 보안 패치로 추가적인 피해를 막았습니다. 당신의 책임감을 인정받았습니다.",
				effect: { stress: -1 },
				choices: {
					"1": { text: "다음 과제 진행", next_story: "mid_task_7_intro" },
				},
				image: "/images/success.png",
			},
			mid_task_6_result_fail: {
				text: "보안 취약점이 외부에 노출되어 회사 이미지에 큰 타격을 입었습니다. 법적 문제까지 발생했습니다.",
				effect: { stress: 3 },
				choices: {
					"1": { text: "다음 과제 진행", next_story: "mid_task_7_intro" },
				},
				image: "/images/fail.png",
			},
			mid_task_6_result_conference: {
				text: "컨퍼런스에서 얻은 지식으로 보안 취약점을 해결했습니다. 당신의 학습 능력을 인정받았습니다.",
				effect: { stress: -3 },
				choices: {
					"1": { text: "다음 과제 진행", next_story: "mid_task_7_intro" },
				},
				image: "/images/normal.png",
			},
			// Task 7: 신입 개발자 교육
			mid_task_7_intro: {
				text: "회사에서 신입 개발자 교육 프로그램을 기획하게 되었습니다. 어떻게 준비하시겠습니까?",
				choices: {
					"1": {
						text: "실무에 필요한 내용을 중심으로 체계적인 교육 프로그램을 만든다.",
						effect: { skill: 8, stress: 3, money: 100000 },
						next_story: "mid_task_7_result_success",
					},
					"2": {
						text: "대충 기존 자료를 재활용하고, 형식적으로 진행한다.",
						effect: { skill: 2, stress: 5, money: 50000 },
						next_story: "mid_task_7_result_fail",
					},
					"3": {
						text: "교육 준비 대신 휴식을 취한다.",
						effect: { stress: -7, money: -50000 },
						next_story: "mid_task_7_result_rest",
					},
				},
				image: "/images/education.png",
			},
			mid_task_7_result_success: {
				text: "성공적인 교육 프로그램으로 신입 개발자들이 빠르게 적응했습니다. 당신의 교육 능력을 인정받았습니다.",
				effect: { stress: -1 },
				choices: {
					"1": { text: "다음 과제 진행", next_story: "mid_task_8_intro" },
				},
				image: "/images/success.png",
			},
			mid_task_7_result_fail: {
				text: "부실한 교육으로 신입 개발자들이 어려움을 겪었습니다. 팀의 생산성이 저하되었습니다.",
				effect: { stress: 2 },
				choices: {
					"1": { text: "다음 과제 진행", next_story: "mid_task_8_intro" },
				},
				image: "/images/fail.png",
			},
			mid_task_7_result_rest: {
				text: "휴식을 통해 스트레스를 해소했습니다. 하지만 교육 기회를 놓쳤습니다.",
				effect: { stress: -3 },
				choices: {
					"1": { text: "다음 과제 진행", next_story: "mid_task_8_intro" },
				},
				image: "/images/rest.png",
			},
			// Task 8: 기술 블로그 작성
			mid_task_8_intro: {
				text: "회사 기술 블로그에 글을 작성할 기회가 생겼습니다. 어떤 주제로 작성하시겠습니까?",
				choices: {
					"1": {
						text: "최근 해결한 복잡한 기술 문제에 대한 심층 분석 글을 작성한다.",
						effect: { skill: 7, stress: 2, money: 150000 },
						next_story: "mid_task_8_result_success",
					},
					"2": {
						text: "간단한 기술 팁이나 일상적인 내용을 작성한다.",
						effect: { skill: 3, stress: 1, money: 50000 },
						next_story: "mid_task_8_result_normal",
					},
					"3": {
						text: "글쓰기 대신 취미 활동을 즐긴다.",
						effect: { stress: -6, money: -90000 },
						next_story: "mid_task_8_result_hobby",
					},
				},
				image: "/images/blog.png",
			},
			mid_task_8_result_success: {
				text: "당신의 글이 많은 개발자들에게 도움이 되었습니다. 회사와 당신의 명성이 높아졌습니다.",
				effect: { stress: -1 },
				choices: {
					"1": { text: "다음 과제 진행", next_story: "mid_task_9_intro" },
				},
				image: "/images/success.png",
			},
			mid_task_8_result_normal: {
				text: "무난한 글이었지만, 큰 반향을 일으키지는 못했습니다.",
				effect: { stress: 0 },
				choices: {
					"1": { text: "다음 과제 진행", next_story: "mid_task_9_intro" },
				},
				image: "/images/normal.png",
			},
			mid_task_8_result_hobby: {
				text: "취미 활동으로 스트레스를 해소했습니다. 하지만 지식 공유 기회를 놓쳤습니다.",
				effect: { stress: -3 },
				choices: {
					"1": { text: "다음 과제 진행", next_story: "mid_task_9_intro" },
				},
				image: "/images/rest.png",
			},
			// Task 9: 오픈소스 기여
			mid_task_9_intro: {
				text: "사용하는 오픈소스 라이브러리에서 버그를 발견했습니다. 어떻게 하시겠습니까?",
				choices: {
					"1": {
						text: "직접 수정하여 Pull Request를 보낸다.",
						effect: { skill: 10, stress: 5, money: 200000 },
						next_story: "mid_task_9_result_success",
					},
					"2": {
						text: "그냥 다른 라이브러리를 찾아본다.",
						effect: { skill: 1, stress: 2, money: 80000 },
						next_story: "mid_task_9_result_fail",
					},
					"3": {
						text: "오픈소스 커뮤니티에 기부하여 스트레스를 해소한다.",
						effect: { stress: -8, money: -50000 },
						next_story: "mid_task_9_result_donate",
					},
				},
				image: "/images/opensource.png",
			},
			mid_task_9_result_success: {
				text: "당신의 기여로 오픈소스 커뮤니티에 긍정적인 영향을 주었습니다. 당신의 영향력이 커졌습니다.",
				effect: { stress: -1 },
				choices: {
					"1": { text: "다음 과제 진행", next_story: "mid_task_10_intro" },
				},
				image: "/images/success.png",
			},
			mid_task_9_result_fail: {
				text: "다른 라이브러리를 찾느라 시간을 낭비했습니다. 문제 해결 능력이 부족했습니다.",
				effect: { stress: 2 },
				choices: {
					"1": { text: "다음 과제 진행", next_story: "mid_task_10_intro" },
				},
				image: "/images/fail.png",
			},
			mid_task_9_result_donate: {
				text: "오픈소스 커뮤니티에 기부하여 마음의 평화를 얻었습니다. 당신의 선행을 인정받았습니다.",
				effect: { stress: -3 },
				choices: {
					"1": { text: "다음 과제 진행", next_story: "mid_task_10_intro" },
				},
				image: "/images/normal.png",
			},
			// Task 10: 미드 챕터 마무리
			mid_task_10_intro: {
				text: "미드 개발자로서의 마지막 과제입니다. 당신의 지난 시간을 돌아보며 무엇을 느끼시겠습니까?",
				choices: {
					"1": {
						text: "팀의 핵심 멤버로서 많은 성과를 냈다고 느낀다.",
						effect: { skill: 5, stress: -3 },
						next_story: "mid_task_10_result",
					},
					"2": {
						text: "아직 더 많은 것을 배워야 한다고 느낀다.",
						effect: { skill: 2, stress: 1 },
						next_story: "mid_task_10_result",
					},
					"3": {
						text: "동료들과 함께 회고하며 서로를 격려한다.",
						effect: { skill: 3, stress: -4 },
						next_story: "mid_task_10_result",
					},
				},
				image: "/images/chapter_end.png",
			},
			mid_task_10_result: {
				text: "미드 개발자 챕터를 성공적으로 마쳤습니다. 이제 당신은 시니어 개발자로 성장할 준비가 되었습니다.",
				effect: { money: 250000, stress: -2 },
				image: "/images/chapter_end.png",
			},
		},
		senior: {
			skill_threshold: 120, // 시니어 챕터 완료에 필요한 스킬
			senior_skill_master_threshold: 250, // 시니어 기술 마스터 해피 엔딩 스킬 임계값
			chapter_end_points: ["senior_task_10_result"], // 시니어 챕터의 끝 지점
			chapter_stress_threshold: 90, // 시니어 챕터 스트레스 임계값
			intro: {
				text: "시니어 개발자가 되신 것을 축하합니다! 이제 당신은 기술 리더로서 팀과 회사를 이끌어야 합니다. 첫 번째 시니어 과제는 무엇일까요?",
				choices: {
					"1": {
						text: "기술 로드맵 수립 및 실행",
						effect: { skill: 15, stress: 8, money: 400000 },
						next_story: "senior_task_1_result",
					},
					"2": {
						text: "복잡한 시스템의 기술 부채 해결",
						effect: { skill: 12, stress: 10, money: 350000 },
						next_story: "senior_task_1_result",
					},
					"3": {
						text: "기술 로드맵 대신 휴식을 취한다.",
						effect: { stress: -10, money: -800000 },
						next_story: "senior_task_1_result",
					},
				},
				image: "/images/senior_intro.png",
			},
			senior_task_1_result: {
				text: "시니어 챕터의 첫 과제를 완료했습니다. 당신의 영향력이 커지고 있습니다.",
				effect: { stress: -1 },
				choices: {
					"1": { text: "다음 과제 진행", next_story: "senior_task_2_intro" },
				},
				image: "/images/success.png",
			},
			// Task 2: 팀 빌딩
			senior_task_2_intro: {
				text: "새로운 개발팀을 구성해야 합니다. 어떤 기준으로 팀원을 선발하시겠습니까?",
				choices: {
					"1": {
						text: "기술 역량과 함께 팀워크를 중요하게 생각한다.",
						effect: { skill: 10, stress: 5, money: 300000 },
						next_story: "senior_task_2_result_success",
					},
					"2": {
						text: "오로지 기술 역량만 보고 선발한다.",
						effect: { skill: 5, stress: 8, money: 250000 },
						next_story: "senior_task_2_result_fail",
					},
					"3": {
						text: "팀 빌딩 대신 개인적인 시간을 보낸다.",
						effect: { stress: -8, money: -200000 },
						next_story: "senior_task_2_result_rest",
					},
				},
				image: "/images/team_building.png",
			},
			senior_task_2_result_success: {
				text: "최고의 팀을 구성하여 프로젝트를 성공적으로 이끌었습니다. 당신의 리더십을 인정받았습니다.",
				effect: { stress: -1 },
				choices: {
					"1": { text: "다음 과제 진행", next_story: "senior_task_3_intro" },
				},
				image: "/images/success.png",
			},
			senior_task_2_result_fail: {
				text: "팀원 간의 불화로 프로젝트가 지연되었습니다. 팀 빌딩의 중요성을 깨달았습니다.",
				effect: { stress: 2 },
				choices: {
					"1": { text: "다음 과제 진행", next_story: "senior_task_3_intro" },
				},
				image: "/images/fail.png",
			},
			senior_task_2_result_rest: {
				text: "개인적인 시간을 통해 스트레스를 해소했습니다. 하지만 팀 빌딩은 뒷전이 되었습니다.",
				effect: { stress: -3 },
				choices: {
					"1": { text: "다음 과제 진행", next_story: "senior_task_3_intro" },
				},
				image: "/images/rest.png",
			},
			// Task 3: 대외 발표
			senior_task_3_intro: {
				text: "회사 대표로 외부 개발자 컨퍼런스에서 기조연설을 하게 되었습니다. 어떻게 준비하시겠습니까?",
				choices: {
					"1": {
						text: "회사의 비전과 기술력을 효과적으로 전달할 수 있도록 철저히 준비한다.",
						effect: { skill: 18, stress: 10, money: 500000 },
						next_story: "senior_task_3_result_success",
					},
					"2": {
						text: "대충 준비하고, 즉흥적으로 발표한다.",
						effect: { skill: 5, stress: 15, money: 400000 },
						next_story: "senior_task_3_result_fail",
					},
					"3": {
						text: "발표 준비 대신 휴가를 떠나 스트레스를 해소한다.",
						effect: { stress: -15, money: -1000000 },
						next_story: "senior_task_3_result_rest",
					},
				},
				image: "/images/keynote.png",
			},
			senior_task_3_result_success: {
				text: "성공적인 기조연설로 회사의 이미지를 높이고 많은 개발자들에게 영감을 주었습니다. 당신은 업계의 리더가 되었습니다.",
				effect: { stress: -1 },
				choices: {
					"1": { text: "다음 과제 진행", next_story: "senior_task_4_intro" },
				},
				image: "/images/success.png",
			},
			senior_task_3_result_fail: {
				text: "준비 부족으로 발표를 망쳤습니다. 회사 이미지에 큰 타격을 입혔습니다.",
				effect: { stress: 3 },
				choices: {
					"1": { text: "다음 과제 진행", next_story: "senior_task_4_intro" },
				},
				image: "/images/fail.png",
			},
			senior_task_3_result_rest: {
				text: "휴가를 통해 스트레스를 해소했습니다. 하지만 발표 기회를 놓쳤습니다.",
				effect: { stress: -5 },
				choices: {
					"1": { text: "다음 과제 진행", next_story: "senior_task_4_intro" },
				},
				image: "/images/rest.png",
			},
			// Task 4: 기술 자문
			senior_task_4_intro: {
				text: "다른 부서에서 기술적인 문제로 자문을 요청했습니다. 어떻게 응대하시겠습니까?",
				choices: {
					"1": {
						text: "친절하게 설명하고, 해결책을 함께 찾아준다.",
						effect: { skill: 8, stress: 4, money: 150000 },
						next_story: "senior_task_4_result_success",
					},
					"2": {
						text: "바쁘다는 핑계로 대충 넘기거나, 아는 척만 한다.",
						effect: { skill: 2, stress: 5, money: 80000 },
						next_story: "senior_task_4_result_fail",
					},
					"3": {
						text: "기술 자문 대신 취미 활동을 즐긴다.",
						effect: { stress: -7, money: -600000 },
						next_story: "senior_task_4_result_hobby",
					},
				},
				image: "/images/consulting.png",
			},
			senior_task_4_result_success: {
				text: "당신의 자문으로 다른 부서의 문제가 해결되었습니다. 당신의 전문성을 인정받았습니다.",
				effect: { stress: -1 },
				choices: {
					"1": { text: "다음 과제 진행", next_story: "senior_task_5_intro" },
				},
				image: "/images/success.png",
			},
			senior_task_4_result_fail: {
				text: "도움을 주지 못해 다른 부서의 불만이 커졌습니다. 당신의 평판이 나빠졌습니다.",
				effect: { stress: 2 },
				choices: {
					"1": { text: "다음 과제 진행", next_story: "senior_task_5_intro" },
				},
				image: "/images/fail.png",
			},
			senior_task_4_result_hobby: {
				text: "취미 활동으로 스트레스를 해소했습니다. 하지만 기술 자문 기회를 놓쳤습니다.",
				effect: { stress: -3 },
				choices: {
					"1": { text: "다음 과제 진행", next_story: "senior_task_5_intro" },
				},
				image: "/images/rest.png",
			},
			// Task 5: 후배 양성
			senior_task_5_intro: {
				text: "회사의 미래를 위해 후배 개발자 양성에 힘써야 합니다. 어떻게 기여하시겠습니까?",
				choices: {
					"1": {
						text: "정기적인 멘토링과 교육 프로그램을 운영한다.",
						effect: { skill: 10, stress: 5, money: 200000 },
						next_story: "senior_task_5_result_success",
					},
					"2": {
						text: "내 일만으로도 바쁘다며 외면한다.",
						effect: { skill: 1, stress: 6, money: 100000 },
						next_story: "senior_task_5_result_fail",
					},
					"3": {
						text: "후배들과 함께 스터디 그룹을 만들어 스트레스를 해소한다.",
						effect: { stress: -8, money: -100000 },
						next_story: "senior_task_5_result_study",
					},
				},
				image: "/images/mentoring_senior.png",
			},
			senior_task_5_result_success: {
				text: "당신의 노력으로 많은 후배 개발자들이 성장했습니다. 당신은 존경받는 선배가 되었습니다.",
				effect: { stress: -1 },
				choices: {
					"1": { text: "다음 과제 진행", next_story: "senior_task_6_intro" },
				},
				image: "/images/success.png",
			},
			senior_task_5_result_fail: {
				text: "후배 개발자들이 성장하지 못하고 어려움을 겪었습니다. 팀의 미래가 불투명해졌습니다.",
				effect: { stress: 2 },
				choices: {
					"1": { text: "다음 과제 진행", next_story: "senior_task_6_intro" },
				},
				image: "/images/fail.png",
			},
			senior_task_5_result_study: {
				text: "스터디 그룹을 통해 후배들과 함께 성장했습니다. 당신의 리더십을 인정받았습니다.",
				effect: { stress: -3 },
				choices: {
					"1": { text: "다음 과제 진행", next_story: "senior_task_6_intro" },
				},
				image: "/images/success.png",
			},
			// Task 6: 기술 트렌드 예측
			senior_task_6_intro: {
				text: "미래 기술 트렌드를 예측하고 회사에 적용해야 합니다. 어떻게 하시겠습니까?",
				choices: {
					"1": {
						text: "다양한 정보를 분석하고, 전문가들과 교류하며 미래를 예측한다.",
						effect: { skill: 15, stress: 8, money: 500000 },
						next_story: "senior_task_6_result_success",
					},
					"2": {
						text: "남들이 하는 것을 따라가거나, 유행에만 민감하게 반응한다.",
						effect: { skill: 5, stress: 8, money: 300000 },
						next_story: "senior_task_6_result_fail",
					},
					"3": {
						text: "기술 트렌드 예측 대신 휴식을 취한다.",
						effect: { stress: -10, money: -100000 },
						next_story: "senior_task_6_result_rest",
					},
				},
				image: "/images/trend.png",
			},
			senior_task_6_result_success: {
				text: "당신의 예측이 적중하여 회사가 미래 기술 시장을 선점했습니다. 당신의 통찰력을 인정받았습니다.",
				effect: { stress: -1 },
				choices: {
					"1": { text: "다음 과제 진행", next_story: "senior_task_7_intro" },
				},
				image: "/images/success.png",
			},
			senior_task_6_result_fail: {
				text: "잘못된 예측으로 회사가 큰 손실을 입었습니다. 당신의 판단력이 부족했습니다.",
				effect: { stress: 3 },
				choices: {
					"1": { text: "다음 과제 진행", next_story: "senior_task_7_intro" },
				},
				image: "/images/fail.png",
			},
			senior_task_6_result_rest: {
				text: "휴식을 통해 스트레스를 해소했습니다. 하지만 기술 트렌드 예측 기회를 놓쳤습니다.",
				effect: { stress: -3 },
				choices: {
					"1": { text: "다음 과제 진행", next_story: "senior_task_7_intro" },
				},
				image: "/images/rest.png",
			},
			// Task 7: 기술 부채 청산
			senior_task_7_intro: {
				text: "오랜 기간 쌓여온 기술 부채를 청산해야 합니다. 어떻게 접근하시겠습니까?",
				choices: {
					"1": {
						text: "체계적인 계획을 세우고, 팀원들과 협력하여 기술 부채를 해결한다.",
						effect: { skill: 12, stress: 9, money: 300000 },
						next_story: "senior_task_7_result_success",
					},
					"2": {
						text: "기술 부채는 어쩔 수 없다며 방치한다.",
						effect: { skill: 3, stress: 10, money: 200000 },
						next_story: "senior_task_7_result_fail",
					},
					"3": {
						text: "기술 부채 해결을 위한 외부 컨설팅을 제안한다.",
						effect: { skill: 8, stress: -5, money: -120000 },
						next_story: "senior_task_7_result_consult",
					},
				},
				image: "/images/tech_debt_senior.png",
			},
			senior_task_7_result_success: {
				text: "기술 부채 청산으로 시스템의 안정성과 개발 생산성이 크게 향상되었습니다. 당신의 결단력을 인정받았습니다.",
				effect: { stress: -1 },
				choices: {
					"1": { text: "다음 과제 진행", next_story: "senior_task_8_intro" },
				},
				image: "/images/success.png",
			},
			senior_task_7_result_fail: {
				text: "기술 부채는 결국 시스템 붕괴로 이어졌습니다. 회사는 큰 위기에 처했습니다.",
				effect: { stress: 3 },
				choices: {
					"1": { text: "다음 과제 진행", next_story: "senior_task_8_intro" },
				},
				image: "/images/fail.png",
			},
			senior_task_7_result_consult: {
				text: "외부 컨설팅을 통해 기술 부채를 효율적으로 해결했습니다. 현명한 판단력을 보여주었습니다.",
				effect: { stress: -3 },
				choices: {
					"1": { text: "다음 과제 진행", next_story: "senior_task_8_intro" },
				},
				image: "/images/normal.png",
			},
			// Task 8: 인재 영입
			senior_task_8_intro: {
				text: "회사의 성장을 위해 뛰어난 개발자를 영입해야 합니다. 어떻게 하시겠습니까?",
				choices: {
					"1": {
						text: "회사의 비전과 문화를 명확히 제시하며 인재를 유치한다.",
						effect: { skill: 10, stress: 5, money: 300000 },
						next_story: "senior_task_8_result_success",
					},
					"2": {
						text: "높은 연봉만 제시하거나, 회사의 단점을 숨긴다.",
						effect: { skill: 4, stress: 6, money: 150000 },
						next_story: "senior_task_8_result_fail",
					},
					"3": {
						text: "인재 영입 대신 휴식을 취한다.",
						effect: { stress: -8, money: -120000 },
						next_story: "senior_task_8_result_rest",
					},
				},
				image: "/images/recruiting.png",
			},
			senior_task_8_result_success: {
				text: "당신의 노력으로 뛰어난 인재들이 회사에 합류했습니다. 회사의 경쟁력이 강화되었습니다.",
				effect: { stress: -1 },
				choices: {
					"1": { text: "다음 과제 진행", next_story: "senior_task_9_intro" },
				},
				image: "/images/success.png",
			},
			senior_task_8_result_fail: {
				text: "인재 영입에 실패하여 프로젝트 진행에 차질이 생겼습니다. 회사의 성장이 둔화되었습니다.",
				effect: { stress: 2 },
				choices: {
					"1": { text: "다음 과제 진행", next_story: "senior_task_9_intro" },
				},
				image: "/images/fail.png",
			},
			senior_task_8_result_rest: {
				text: "휴식을 통해 스트레스를 해소했습니다. 하지만 인재 영입 기회를 놓쳤습니다.",
				effect: { stress: -3 },
				choices: {
					"1": { text: "다음 과제 진행", next_story: "senior_task_9_intro" },
				},
				image: "/images/rest.png",
			},
			// Task 9: 은퇴 준비
			senior_task_9_intro: {
				text: "이제 당신은 개발자로서의 커리어 정점에 도달했습니다. 은퇴를 준비하며 무엇을 하시겠습니까?",
				choices: {
					"1": {
						text: "후배들에게 지식과 경험을 전수하며 아름다운 마무리를 준비한다.",
						effect: { skill: 8, stress: 5, money: 200000 },
						next_story: "senior_task_9_result_success",
					},
					"2": {
						text: "마지막까지 개인적인 성과에만 집착한다.",
						effect: { skill: 2, stress: 3, money: 500000 },
						next_story: "senior_task_9_result_fail",
					},
					"3": {
						text: "은퇴 후의 삶을 계획하고, 새로운 취미를 찾는다.",
						effect: { skill: 0, stress: -10, money: -1000000 },
						next_story: "senior_task_9_result_hobby",
					},
				},
				image: "/images/retirement_prep.png",
			},
			senior_task_9_result_success: {
				text: "당신의 지혜와 경험은 후배들에게 큰 영감이 되었습니다. 당신은 전설적인 개발자로 기억될 것입니다.",
				effect: { stress: -2 },
				choices: {
					"1": { text: "다음 과제 진행", next_story: "senior_task_10_intro" },
				},
				image: "/images/success.png",
			},
			senior_task_9_result_fail: {
				text: "당신의 지식은 당신과 함께 사라졌습니다. 후배들은 당신을 기억하지 못할 것입니다.",
				effect: { stress: 2 },
				choices: {
					"1": { text: "다음 과제 진행", next_story: "senior_task_10_intro" },
				},
				image: "/images/fail.png",
			},
			senior_task_9_result_hobby: {
				text: "은퇴 후의 삶을 충실히 준비했습니다. 당신의 삶은 더욱 풍요로워질 것입니다.",
				effect: { stress: -7 },
				choices: {
					"1": { text: "다음 과제 진행", next_story: "senior_task_10_intro" },
				},
				image: "/images/rest.png",
			},
			// Task 10: 시니어 챕터 마무리
			senior_task_10_intro: {
				text: "시니어 개발자 챕터를 성공적으로 마쳤습니다. 이제 당신은 개발자로서의 마지막 여정을 시작합니다.",
				choices: {
					"1": {
						text: "다음 챕터로 이동",
						next_story: "senior_task_10_result",
					},
				},
				image: "/images/chapter_end.png",
			},
			senior_task_10_result: {
				text: "시니어 개발자 챕터를 성공적으로 마쳤습니다. 이제 당신은 개발자로서의 마지막 여정을 시작합니다.",
				effect: { money: 500000, stress: -3 },

				image: "/images/chapter_end.png",
			},
		},
		retirement: {
			skill_threshold: 150, // 은퇴 챕터 완료에 필요한 스킬 (사실상 게임 완료 조건)
			chapter_end_points: ["happy_ending"], // 해피 엔딩 지점
			chapter_stress_threshold: 100, // 은퇴 챕터 스트레스 임계값
			happy_ending: {
				text: "당신은 성공적인 개발자 인생을 살았습니다. 당신의 이름은 역사에 길이 남을 것입니다. (해피 엔딩)",
				image: "/images/happy_ending.png",
			},
		},
	},
	bad_ending: {
		stress_threshold: 100,
		money_threshold: -10000000, // -1천만
		stress_text:
			"당신은 개발의 스트레스를 이기지 못하고 결국 모든 것을 내려놓았습니다. 이제 당신은 동네에서 가장 맛있는 프랜차이즈 치킨집 사장이 되었습니다. (스트레스 배드 엔딩)",
		money_text:
			"당신은 무리한 투자와 지출로 인해 재정적 파탄에 이르렀습니다. 결국 당신은 동네에서 가장 맛있는 프랜차이즈 치킨집 사장이 되었습니다. (재정 파탄 배드 엔딩)",
		ai_replacement_text:
			"당신은 현재 챕터의 모든 과제를 수행했지만, 필요한 스킬 레벨에 도달하지 못했습니다. 결국 당신의 자리는 AI로 대체되었습니다. (AI 대체 배드 엔딩)",
		naturalist_text:
			"당신은 개발의 극심한 스트레스를 버티지 못하고 모든 것을 내려놓았습니다. 이제 당신은 자연으로 돌아가 자연인이 되었습니다. (자연인 배드 엔딩)",
		senior_unsuccessful_text:
			"시니어 개발자로서의 여정을 마쳤지만, 당신의 스킬 레벨은 업계의 기대를 충족시키지 못했습니다. 결국 당신은 평범한 개발자로 남게 되었습니다. (시니어 실패 엔딩)",
	},
	happy_ending_text:
		"당신은 성공적인 개발자 인생을 살았습니다. 당신의 이름은 역사에 길이 남을 것입니다. (최종 해피 엔딩)",
	senior_master_ending_text:
		"당신은 시니어 개발자로서 기술의 정점에 도달했습니다. 당신의 이름은 전설로 기억될 것입니다. (기술 마스터 해피 엔딩)",
};

export function getInitialGameState(): GameState {
	return {
		chapter: "newbie",
		path: null,
		skill: 0,
		stress: 0,
		money: 0,
		inventory: [],
		story_progress: "intro",
	};
}
