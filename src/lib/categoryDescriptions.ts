export interface CategoryInfo {
    title: string;
    description: string;
    features: string[];
}

export const categoryDescriptions: Record<string, CategoryInfo> = {
    "symptoms": {
        title: "증상별 건강정보",
        description: "두통, 위염, 감기, 불면증 등 흔한 증상의 원인과 대처법을 알기 쉽게 정리했습니다.",
        features: [
            "두통·편두통 원인 분석과 해결법",
            "위염·역류성 식도염 증상과 식이요법",
            "감기·독감 빨리 낫는 법 총정리",
            "불면증 자가 진단과 수면 개선 팁"
        ]
    },
    "home-remedies": {
        title: "민간요법·좋은음식 가이드",
        description: "감기에 좋은 음식, 기침 멈추는 법, 변비에 좋은 음식 등 검증된 민간요법과 식이 정보를 소개합니다.",
        features: [
            "증상별 좋은 음식·나쁜 음식 정리",
            "과학적으로 검증된 민간요법 소개",
            "계절별 건강 차·음료 레시피",
            "약 없이 증상 완화하는 생활 팁"
        ]
    },
    "supplements": {
        title: "영양제 정보 가이드",
        description: "비타민D, 오메가3, 마그네슘 등 영양제 효능, 복용법, 부작용 정보를 한눈에 정리합니다.",
        features: [
            "비타민D·오메가3·마그네슘 효능 비교",
            "나이·성별에 맞는 영양제 추천",
            "영양제 올바른 복용 시간과 방법",
            "영양제 부작용과 주의사항 총정리"
        ]
    },
    "daily-health": {
        title: "생활건강 상식",
        description: "수면, 운동, 식단, 스트레스 관리 등 매일 실천할 수 있는 건강 생활습관을 소개합니다.",
        features: [
            "수면의 질 높이는 과학적 방법",
            "면역력 강화 식단과 생활습관",
            "장건강·장내 미생물 관리법",
            "직장인 스트레스 해소·멘탈 관리"
        ]
    },
    "pharmacy-guide": {
        title: "약국·의약품 상식 가이드",
        description: "처방전 없이 살 수 있는 약, 올바른 복용법, 약 보관법 등 알아두면 유용한 의약품 상식을 정리합니다.",
        features: [
            "처방전 없이 구매 가능한 약 총정리",
            "올바른 약 복용법과 보관법",
            "소화제·진통제·감기약 종류와 선택법",
            "약 부작용 대처법과 병용 주의사항"
        ]
    }
};
