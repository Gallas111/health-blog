
export interface CategoryConfig {
    name: string;
    slug: string;
    folderName: string;
    description: string;
    longDescription: string;
    icon: string;
    keyTopics: string[];
    seoTitle: string;
    seoDescription: string;
}

export const CATEGORY_MAP: Record<string, CategoryConfig> = {
    "symptoms": {
        name: "증상별 건강정보",
        slug: "symptoms",
        folderName: "symptoms",
        icon: "🩺",
        description: "두통, 위염, 감기, 불면증 등 흔한 증상의 원인과 대처법을 알기 쉽게 정리했습니다.",
        longDescription: `갑자기 찾아온 두통, 속이 쓰린 위염, 밤잠을 설치는 불면증... 누구나 한 번쯤 겪는 증상이지만, 정확한 원인과 대처법을 모르면 불안하기만 합니다.

이 카테고리에서는 일상에서 자주 겪는 증상별로 원인, 자가 진단법, 생활습관 개선 팁, 병원 방문이 필요한 시점까지 꼼꼼하게 안내합니다.

증상이 궁금할 때, 가장 먼저 찾아보세요.`,
        keyTopics: ["두통 원인과 해결법", "위염 증상과 식이요법", "감기 빨리 낫는 법", "불면증 자가 진단"],
        seoTitle: "증상별 건강정보 — 두통·위염·감기·불면증 원인과 대처법",
        seoDescription: "두통, 위염, 감기, 불면증 등 흔한 증상의 원인과 대처법. 증상별 자가 진단부터 병원 방문 시점까지 총정리."
    },
    "home-remedies": {
        name: "민간요법·좋은음식",
        slug: "home-remedies",
        folderName: "home-remedies",
        icon: "🍵",
        description: "감기에 좋은 음식, 기침 멈추는 법, 변비에 좋은 음식 등 검증된 민간요법과 식이 정보를 소개합니다.",
        longDescription: `"감기에는 생강차가 좋다더라", "변비에는 고구마가 최고래" — 할머니의 지혜가 담긴 민간요법, 정말 효과가 있을까요?

과학적으로 검증된 민간요법과 증상별 좋은 음식 정보를 정리했습니다. 근거 없는 속설은 걸러내고, 실제로 도움이 되는 생활 건강 팁만 엄선합니다.

약 먹기 전에 음식으로 먼저 관리해보세요.`,
        keyTopics: ["감기에 좋은 음식", "기침 멈추는 법", "변비에 좋은 음식", "소화에 좋은 차"],
        seoTitle: "민간요법·좋은음식 가이드 — 증상별 좋은 음식·생활 건강 팁",
        seoDescription: "감기에 좋은 음식, 기침 멈추는 법, 변비에 좋은 음식 등 과학적으로 검증된 민간요법과 식이 가이드."
    },
    "supplements": {
        name: "영양제 정보",
        slug: "supplements",
        folderName: "supplements",
        icon: "💊",
        description: "비타민D, 오메가3, 마그네슘 등 영양제 효능, 복용법, 부작용 정보를 한눈에 정리합니다.",
        longDescription: `비타민D가 부족하면 뼈가 약해진다는데, 얼마나 먹어야 할까? 오메가3는 어떤 제품이 좋을까? 영양제 선택이 고민된다면 여기서 답을 찾으세요.

인기 영양제의 효능, 올바른 복용법, 주의해야 할 부작용, 추천 제품 비교까지 — 전문 자료를 바탕으로 쉽게 설명합니다.

내 몸에 맞는 영양제를 똑똑하게 골라보세요.`,
        keyTopics: ["비타민D 효능과 복용법", "오메가3 추천 비교", "마그네슘 부족 증상", "멀티비타민 필요성"],
        seoTitle: "영양제 정보 가이드 — 비타민D·오메가3·마그네슘 효능·복용법 총정리",
        seoDescription: "비타민D, 오메가3, 마그네슘 등 인기 영양제 효능, 올바른 복용법, 부작용 정보와 추천 제품 비교."
    },
    "daily-health": {
        name: "생활건강 상식",
        slug: "daily-health",
        folderName: "daily-health",
        icon: "🏃",
        description: "수면, 운동, 식단, 스트레스 관리 등 매일 실천할 수 있는 건강 생활습관을 소개합니다.",
        longDescription: `건강은 거창한 것이 아닙니다. 잠을 잘 자고, 몸을 움직이고, 균형 잡힌 식단을 유지하는 것 — 작은 습관이 큰 변화를 만듭니다.

수면의 질 높이는 법, 집에서 하는 간단한 운동, 면역력 높이는 식단, 장건강 관리법까지 매일 실천할 수 있는 건강 팁을 모았습니다.

오늘부터 건강한 하루를 시작하세요.`,
        keyTopics: ["수면 질 높이는 법", "면역력 높이는 방법", "장건강 관리", "스트레스 해소법"],
        seoTitle: "생활건강 상식 — 수면·운동·식단·면역력 높이는 법 총정리",
        seoDescription: "수면 질 높이는 법, 면역력 높이는 방법, 장건강, 스트레스 관리 등 매일 실천하는 건강 생활습관 가이드."
    },
    "pharmacy-guide": {
        name: "약국·의약품 상식",
        slug: "pharmacy-guide",
        folderName: "pharmacy-guide",
        icon: "🏥",
        description: "처방전 없이 살 수 있는 약, 올바른 복용법, 약 보관법 등 알아두면 유용한 의약품 상식을 정리합니다.",
        longDescription: `두통약은 식후에 먹어야 할까? 소화제와 진통제를 같이 먹어도 될까? 약국에서 자주 묻는 질문에 답합니다.

OTC(일반의약품) 정보부터 올바른 약 복용법, 보관법, 약 부작용 대처법까지 — 약국 방문 전에 알아두면 좋은 실용적인 의약품 상식을 정리했습니다.

약, 제대로 알고 먹으면 더 효과적입니다.`,
        keyTopics: ["처방전 없이 살 수 있는 약", "올바른 약 복용법", "소화제 종류와 선택법", "약 부작용 대처법"],
        seoTitle: "약국·의약품 상식 가이드 — OTC 약 복용법·보관법·부작용 총정리",
        seoDescription: "처방전 없이 살 수 있는 약, 올바른 복용법, 약 보관법, 부작용 대처법까지. 약국 방문 전 알아두면 좋은 의약품 상식."
    }
};

export const CATEGORY_LIST = Object.values(CATEGORY_MAP);

export function getCategoryBySlug(slug: string): CategoryConfig | undefined {
    return CATEGORY_MAP[slug];
}

export function getCategoryByFolderName(folderName: string): CategoryConfig | undefined {
    return Object.values(CATEGORY_MAP).find(c => c.folderName === folderName);
}
