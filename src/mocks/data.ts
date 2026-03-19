import type { UserWithProfile, PostWithAuthor, Category, CommentWithAuthor, NotificationWithSender } from '@/types';

const now = '2025-02-25T12:00:00.000Z';
const hourAgo = '2025-02-25T11:00:00.000Z';
const dayAgo = '2025-02-24T12:00:00.000Z';

export const mockUsers: UserWithProfile[] = [
  {
    id: 1, email: 'test@example.com', nickname: '오리왕', handle: 'duckking',
    status: 'ACTIVE', role: 'USER', isVerified: true, isBlueChecked: false,
    createdAt: dayAgo, updatedAt: now,
    profile: { id: 1, userId: 1, profileImageUrl: null, backgroundImageUrl: null, bio: '애니 덕후입니다! 최애는 스파이패밀리', followerCount: 128, followingCount: 45, postCount: 32, hasMembership: true, createdAt: dayAgo, updatedAt: now },
  },
  {
    id: 2, email: 'dev@example.com', nickname: '코스어김', handle: 'coskim',
    status: 'ACTIVE', role: 'PREMIUM', isVerified: true, isBlueChecked: true,
    createdAt: dayAgo, updatedAt: now,
    profile: { id: 2, userId: 2, profileImageUrl: null, backgroundImageUrl: null, bio: '코스프레이어 & 일러스트레이터', followerCount: 256, followingCount: 89, postCount: 67, hasMembership: true, createdAt: dayAgo, updatedAt: now },
  },
  {
    id: 3, email: 'design@example.com', nickname: '피규어박', handle: 'figurepark',
    status: 'ACTIVE', role: 'USER', isVerified: false, isBlueChecked: false,
    createdAt: dayAgo, updatedAt: now,
    profile: { id: 3, userId: 3, profileImageUrl: null, backgroundImageUrl: null, bio: '피규어 & 굿즈 수집가', followerCount: 64, followingCount: 120, postCount: 15, createdAt: dayAgo, updatedAt: now },
  },
  {
    id: 4, email: 'admin@example.com', nickname: '관리자', handle: 'admin',
    status: 'ACTIVE', role: 'ADMIN', isVerified: true, isBlueChecked: true,
    createdAt: dayAgo, updatedAt: now,
    profile: { id: 4, userId: 4, profileImageUrl: null, backgroundImageUrl: null, bio: 'DuckDuck 운영팀', followerCount: 512, followingCount: 10, postCount: 8, createdAt: dayAgo, updatedAt: now },
  },
];

export const mockCategories: Category[] = [
  { id: 1, name: '애니메이션', slug: 'anime', description: '애니메이션 감상평, 추천, 토론', status: 'ACTIVE', visibility: 'PUBLIC', postCount: 342, subscriberCount: 215, createdAt: dayAgo, updatedAt: now },
  { id: 2, name: '만화', slug: 'manga', description: '웹툰, 만화, 라노벨 이야기', status: 'ACTIVE', visibility: 'PUBLIC', postCount: 187, subscriberCount: 134, createdAt: dayAgo, updatedAt: now },
  { id: 3, name: '게임', slug: 'game', description: '콘솔, PC, 모바일 게임', status: 'ACTIVE', visibility: 'PUBLIC', postCount: 278, subscriberCount: 189, createdAt: dayAgo, updatedAt: now },
  { id: 4, name: '코스프레', slug: 'cosplay', description: '코스프레 사진, 제작기, 팁 공유', status: 'ACTIVE', visibility: 'PUBLIC', postCount: 95, subscriberCount: 78, createdAt: dayAgo, updatedAt: now },
  { id: 5, name: '굿즈/피규어', slug: 'goods', description: '피규어, 굿즈, 앨범 수집 & 거래', status: 'ACTIVE', visibility: 'PUBLIC', postCount: 156, subscriberCount: 102, createdAt: dayAgo, updatedAt: now },
  { id: 6, name: '자유', slug: 'free', description: '자유로운 이야기', status: 'ACTIVE', visibility: 'PUBLIC', postCount: 412, subscriberCount: 230, createdAt: dayAgo, updatedAt: now },
  { id: 7, name: '질문', slug: 'question', description: '질문과 답변', status: 'ACTIVE', visibility: 'PUBLIC', postCount: 98, subscriberCount: 67, createdAt: dayAgo, updatedAt: now },
];

export const mockPosts: PostWithAuthor[] = [
  {
    id: 1, userId: 1, content: '스파이패밀리 시즌3 확정이라니!! 아냐가 또 귀여운 모습 보여줄 생각하니 너무 기대됩니다.\n\n다들 시즌2 결말 어떻게 보셨나요?', visibility: 'PUBLIC', isPinned: false,
    likeCount: 89, commentCount: 12, repostCount: 5, viewCount: 450, bookmarkCount: 15,
    createdAt: hourAgo, updatedAt: hourAgo,
    author: mockUsers[0], media: [], category: mockCategories[0], isLiked: false, isBookmarked: false, isReposted: false,
  },
  {
    id: 2, userId: 2, content: '이번 주말 코스프레 행사 참가합니다!\n\n아커 코스프레 준비 중인데 가발이 생각보다 어렵네요... 혹시 아커 가발 추천해주실 분 계신가요?', visibility: 'PUBLIC', isPinned: false,
    likeCount: 67, commentCount: 9, repostCount: 8, viewCount: 310, bookmarkCount: 18,
    createdAt: dayAgo, updatedAt: dayAgo,
    author: mockUsers[1], media: [], category: mockCategories[3], isLiked: true, isBookmarked: true, isReposted: false,
  },
  {
    id: 3, userId: 3, content: '넨도로이드 신규 라인업 봤는데 지갑이 위험합니다...\n\n이번에 체인소맨 넨도로이드 퀄리티 역대급이네요. 바로 예약했습니다!', visibility: 'PUBLIC', isPinned: false,
    likeCount: 42, commentCount: 8, repostCount: 5, viewCount: 230, bookmarkCount: 12,
    createdAt: now, updatedAt: now,
    author: mockUsers[2], media: [], category: mockCategories[4], isLiked: false, isBookmarked: false, isReposted: false,
  },
  {
    id: 4, userId: 1, content: '주술회전 만화 완결 읽었는데... 결말에 대해 의견이 분분하네요.\n\n개인적으로는 고죠 센세 퇴장이 좀 아쉬웠습니다.', visibility: 'PUBLIC', isPinned: false,
    likeCount: 55, commentCount: 15, repostCount: 3, viewCount: 280, bookmarkCount: 8,
    createdAt: now, updatedAt: now,
    author: mockUsers[0], media: [], category: mockCategories[1], isLiked: false, isBookmarked: false, isReposted: false,
  },
  {
    id: 5, userId: 2, content: '블루아카이브 3주년 이벤트 미쳤다!!\n\n스토리도 좋고 보상도 역대급이네요. 다들 가챠 결과 어떤가요?', visibility: 'PUBLIC', isPinned: false,
    likeCount: 78, commentCount: 22, repostCount: 11, viewCount: 520, bookmarkCount: 25,
    createdAt: hourAgo, updatedAt: hourAgo,
    author: mockUsers[1], media: [], category: mockCategories[2], isLiked: true, isBookmarked: false, isReposted: false,
  },
  {
    id: 6, userId: 2, content: '구독자 전용 코스프레 메이킹 영상입니다.\n\n이번에는 원신 라이덴 쇼군 코스프레 제작 과정을 처음부터 끝까지 공유합니다.\n\n의상 패턴, 소재 선택, 소품 제작까지 전부 담았습니다!',
    visibility: 'SUBSCRIBERS', isPinned: false,
    likeCount: 34, commentCount: 6, repostCount: 0, viewCount: 95, bookmarkCount: 15,
    createdAt: hourAgo, updatedAt: hourAgo,
    author: mockUsers[1], media: [], category: null, isLiked: false, isBookmarked: false, isReposted: false,
    accessibleTierIds: [1, 2],
    minRequiredTier: { id: 1, name: '기본 구독', price: 3000 },
  },
  {
    id: 7, userId: 1, content: '이번 코스프레 퀄리티 기대됩니다!! 라이덴 쇼군 너무 좋아요',
    visibility: 'PUBLIC', isPinned: false,
    likeCount: 11, commentCount: 2, repostCount: 0, viewCount: 45, bookmarkCount: 1,
    createdAt: now, updatedAt: now,
    author: mockUsers[0], media: [], category: mockCategories[3], isLiked: false, isBookmarked: false, isReposted: false,
    quotedPost: {
      id: 2, userId: 2, content: '이번 주말 코스프레 행사 참가합니다!\n\n아커 코스프레 준비 중인데 가발이 생각보다 어렵네요...', visibility: 'PUBLIC', isPinned: false,
      likeCount: 67, commentCount: 9, repostCount: 8, viewCount: 310, bookmarkCount: 18,
      createdAt: dayAgo, updatedAt: dayAgo,
      author: mockUsers[1], media: [], category: mockCategories[3], isLiked: true, isBookmarked: true, isReposted: false,
    },
  },
  {
    id: 8, userId: 4, content: '[공지] 애니메이션 게시판 이용 안내\n\n1. 스포일러는 반드시 스포일러 태그를 사용해주세요\n2. 불법 공유 링크는 삭제됩니다\n3. 서로 존중하며 토론해주세요', visibility: 'PUBLIC', isPinned: true,
    likeCount: 45, commentCount: 3, repostCount: 0, viewCount: 890, bookmarkCount: 20,
    createdAt: dayAgo, updatedAt: dayAgo,
    author: mockUsers[3], media: [], category: mockCategories[0], isLiked: false, isBookmarked: false, isReposted: false,
  },
  {
    id: 9, userId: 4, content: '[공지] 굿즈/피규어 거래 게시판 규칙\n\n1. 거래 시 사기 주의\n2. 가격은 명확히 기재해주세요\n3. 직거래/택배거래 구분 필수', visibility: 'PUBLIC', isPinned: true,
    likeCount: 32, commentCount: 1, repostCount: 0, viewCount: 650, bookmarkCount: 15,
    createdAt: dayAgo, updatedAt: dayAgo,
    author: mockUsers[3], media: [], category: mockCategories[4], isLiked: false, isBookmarked: false, isReposted: false,
  },
  {
    id: 10, userId: 1, content: '오늘 너무 덥네요... 에어컨 틀고 애니 정주행이 답이다!!\n\n추천 좀 해주세요 요즘 볼게 없어요 ㅠㅠ', visibility: 'PUBLIC', isPinned: false,
    likeCount: 24, commentCount: 5, repostCount: 2, viewCount: 120, bookmarkCount: 3,
    createdAt: hourAgo, updatedAt: hourAgo,
    author: mockUsers[0], media: [], category: mockCategories[5], isLiked: false, isBookmarked: false, isReposted: false,
  },
];

export const mockComments: CommentWithAuthor[] = [
  {
    id: 1, postId: 1, userId: 2, content: '아냐 너무 귀엽죠!! 시즌3 기대됩니다~', likeCount: 5, createdAt: hourAgo, updatedAt: hourAgo,
    author: mockUsers[1], isLiked: false,
  },
  {
    id: 2, postId: 1, userId: 3, content: '시즌2 결말 감동이었어요 ㅠㅠ 로이드 아저씨 최고', likeCount: 3, createdAt: now, updatedAt: now,
    author: mockUsers[2], isLiked: false,
  },
  {
    id: 3, postId: 5, userId: 1, content: '가챠 200연차에 픽업 겨우 뽑았습니다... 운이 없었네요', likeCount: 8, createdAt: hourAgo, updatedAt: hourAgo,
    author: mockUsers[0], isLiked: false,
  },
];

export const mockNotifications: NotificationWithSender[] = [
  {
    id: 1, userId: 1, senderId: 2, type: 'LIKE', title: '좋아요', isRead: false, createdAt: hourAgo,
    message: '스파이패밀리 시즌3 확정이라니!!',
    targetType: 'POST', targetId: 1,
    sender: mockUsers[1],
  },
  {
    id: 2, userId: 1, senderId: 3, type: 'FOLLOW', title: '팔로우', isRead: false, createdAt: hourAgo,
    sender: mockUsers[2],
  },
  {
    id: 3, userId: 1, senderId: 2, type: 'COMMENT', title: '댓글', isRead: false, createdAt: hourAgo,
    message: '아냐 너무 귀엽죠!! 시즌3 기대됩니다~',
    targetType: 'POST', targetId: 1,
    sender: mockUsers[1],
  },
  {
    id: 4, userId: 1, senderId: 3, type: 'REPOST', title: '리포스트', isRead: false, createdAt: dayAgo,
    message: '이번 주말 코스프레 행사 참가합니다!',
    targetType: 'POST', targetId: 2,
    sender: mockUsers[2],
  },
  {
    id: 5, userId: 1, senderId: 2, type: 'MENTION', title: '멘션', isRead: true, createdAt: dayAgo,
    message: '@오리왕 넨도로이드 같이 공구할래요?',
    targetType: 'POST', targetId: 3,
    sender: mockUsers[1],
  },
  {
    id: 6, userId: 1, senderId: 3, type: 'LIKE', title: '좋아요', isRead: true, createdAt: dayAgo,
    message: '주술회전 만화 완결 읽었는데...',
    targetType: 'POST', targetId: 4,
    sender: mockUsers[2],
  },
  {
    id: 7, userId: 1, senderId: 2, type: 'COMMENT', title: '댓글', isRead: true, createdAt: dayAgo,
    message: '가챠 200연차에 픽업 겨우 뽑았습니다...',
    targetType: 'POST', targetId: 5,
    sender: mockUsers[1],
  },
];

// ===== 추가 Mock 데이터 =====

export const mockUserSettings = {
  id: 1, userId: 1, language: 'ko', theme: 'LIGHT' as const,
  pushEnabled: true, pushLike: true, pushComment: true, pushFollow: true,
  pushRepost: true, pushSubscription: true, pushMarketing: false,
  emailEnabled: true, emailMarketing: false,
  profileVisibility: 'PUBLIC' as const, allowMessage: 'ALL' as const,
  showActivityStatus: true, showReadReceipts: true,
  createdAt: now, updatedAt: now,
};

export const mockLoginHistory = [
  { id: 1, userId: 1, loginType: 'EMAIL' as const, ipAddress: '192.168.1.1', userAgent: 'Chrome/120', deviceType: 'DESKTOP' as const, location: '서울', status: 'SUCCESS' as const, createdAt: now },
  { id: 2, userId: 1, loginType: 'EMAIL' as const, ipAddress: '10.0.0.1', userAgent: 'Safari/17', deviceType: 'MOBILE' as const, location: '부산', status: 'SUCCESS' as const, createdAt: dayAgo },
  { id: 3, userId: 1, loginType: 'KAKAO' as const, ipAddress: '172.16.0.1', userAgent: 'KakaoTalk', deviceType: 'MOBILE' as const, location: '서울', status: 'SUCCESS' as const, createdAt: '2025-02-23T12:00:00.000Z' },
];

export const mockFanTiers = [
  { id: 1, userId: 2, name: '기본 구독', price: 3000, description: '기본 구독 혜택', benefits: { items: ['프리미엄 게시글 열람', '댓글 작성'] }, isActive: true, createdAt: now, updatedAt: now },
  { id: 2, userId: 2, name: '프리미엄 구독', price: 10000, description: '프리미엄 혜택', benefits: { items: ['프리미엄 게시글 열람', '댓글 작성', '메이킹 영상', '1:1 쪽지'] }, isActive: true, createdAt: now, updatedAt: now },
];

export const mockReports = [
  { id: 1, userId: 2, targetType: 'POST' as const, targetId: 1, reason: 'SPAM' as const, description: '스팸 게시글입니다', status: 'PENDING' as const, createdAt: now },
  { id: 2, userId: 3, targetType: 'USER' as const, targetId: 5, reason: 'HARASSMENT' as const, description: '괴롭힘', status: 'PENDING' as const, createdAt: dayAgo },
  { id: 3, userId: 1, targetType: 'COMMENT' as const, targetId: 3, reason: 'INAPPROPRIATE' as const, status: 'RESOLVED' as const, adminId: 1, createdAt: '2025-02-23T12:00:00.000Z', resolvedAt: now },
];

export const mockBoardApplications = [
  { id: 1, userId: 2, boardName: '보컬로이드', boardDescription: '보컬로이드 관련 카테고리', requestReason: '보컬로이드 팬 커뮤니티 활성화', status: 'PENDING' as const, createdAt: now },
  { id: 2, userId: 3, boardName: '동인지', boardDescription: '동인 창작물 공유', requestReason: '동인 작가들을 위한 공간', status: 'APPROVED' as const, adminId: 1, createdAt: dayAgo, processedAt: now },
];

export const mockPayments = [
  { id: 1, userId: 1, paymentType: 'PREMIUM' as const, amount: 9900, currency: 'KRW', paymentMethod: 'CARD' as const, status: 'COMPLETED' as const, paidAt: now, createdAt: now },
  { id: 2, userId: 1, paymentType: 'FAN_SUBSCRIPTION' as const, amount: 3000, currency: 'KRW', paymentMethod: 'CARD' as const, status: 'COMPLETED' as const, paidAt: '2025-01-25T12:00:00.000Z', createdAt: '2025-01-25T12:00:00.000Z' },
];

export const mockAdminStats = {
  totalUsers: 1234, activeUsers: 987, totalPosts: 5678,
  totalComments: 12345, totalReports: 23, pendingReports: 8,
  newUsersToday: 15, newPostsToday: 45,
};

export const mockSupportFAQ = [
  { q: '계정은 어떻게 만드나요?', a: '회원가입 페이지에서 이메일과 비밀번호를 입력하여 계정을 만들 수 있습니다.' },
  { q: '비밀번호를 잊어버렸어요', a: '로그인 페이지에서 "비밀번호 찾기"를 클릭하여 이메일로 재설정 링크를 받을 수 있습니다.' },
  { q: '게시글은 어떻게 작성하나요?', a: '하단 네비게이션의 + 버튼을 클릭하여 새 게시글을 작성할 수 있습니다.' },
  { q: '다른 사용자를 차단하고 싶어요', a: '해당 사용자 프로필에서 더보기 메뉴를 통해 차단할 수 있습니다.' },
  { q: '프리미엄 구독은 어떻게 하나요?', a: '해당 크리에이터 프로필에서 구독 버튼을 눌러 구독할 수 있습니다.' },
];

// ===== 익명 질문 =====

export const mockQuestionTemplates = [
  { id: 1, label: '자유 질문', placeholder: '궁금한 것을 자유롭게 물어보세요!', emoji: '💬' },
  { id: 2, label: '추천 요청', placeholder: '추천해주세요! (애니, 만화, 굿즈 등)', emoji: '🎯' },
  { id: 3, label: '후기 요청', placeholder: '후기나 리뷰를 요청해보세요!', emoji: '📝' },
  { id: 4, label: 'TMI 질문', placeholder: '사소한 TMI를 물어보세요!', emoji: '🤫' },
  { id: 5, label: '덕질 상담', placeholder: '덕질 관련 고민을 상담해보세요!', emoji: '🧸' },
];

export interface AnonQuestion {
  id: number;
  receiverId: number;
  sourcePostId: number; // 어떤 게시물에서 받은 질문인지
  templateId: number;
  content: string;
  isRead: boolean;
  isAnswered: boolean;
  answer?: string;
  createdAt: string;
  answeredAt?: string;
}

export const mockAnonQuestions: AnonQuestion[] = [
  { id: 1, receiverId: 1, sourcePostId: 1, templateId: 1, content: '요즘 제일 재밌게 보고 있는 애니가 뭔가요?', isRead: false, isAnswered: false, createdAt: '2025-02-25T14:00:00.000Z' },
  { id: 2, receiverId: 1, sourcePostId: 1, templateId: 2, content: '입문자에게 추천할만한 피규어 있나요? 예산은 5만원 정도입니다', isRead: false, isAnswered: false, createdAt: '2025-02-25T12:30:00.000Z' },
  { id: 3, receiverId: 1, sourcePostId: 1, templateId: 4, content: '덕질 시작한지 얼마나 되셨어요?', isRead: true, isAnswered: true, answer: '대학교 1학년 때부터 시작했으니 벌써 6년 됐네요! 시간 참 빠르죠 ㅎㅎ', createdAt: '2025-02-24T16:00:00.000Z', answeredAt: '2025-02-24T18:00:00.000Z' },
  { id: 4, receiverId: 1, sourcePostId: 2, templateId: 5, content: '코스프레 시작하려면 뭐부터 준비해야 하나요?', isRead: true, isAnswered: false, createdAt: '2025-02-24T10:00:00.000Z' },
  { id: 5, receiverId: 1, sourcePostId: 2, templateId: 1, content: '최애 캐릭터가 누구인가요? 이유도 알려주세요!', isRead: true, isAnswered: true, answer: '아냐 포저입니다! 귀엽고 가끔 보여주는 진지한 모습에 반했어요', createdAt: '2025-02-23T20:00:00.000Z', answeredAt: '2025-02-23T22:00:00.000Z' },
];

export const mockConversations = [
  {
    id: 1,
    otherUser: mockUsers[1],
    lastMessage: '코스프레 행사 같이 가실래요?',
    lastMessageAt: '2025-02-25T11:30:00.000Z',
    unreadCount: 2,
  },
  {
    id: 2,
    otherUser: mockUsers[2],
    lastMessage: '피규어 공구 감사합니다!',
    lastMessageAt: '2025-02-25T10:00:00.000Z',
    unreadCount: 0,
  },
];

export const mockMessages = [
  { id: 1, conversationId: 1, senderId: 2, content: '안녕하세요!', createdAt: '2025-02-25T11:00:00.000Z' },
  { id: 2, conversationId: 1, senderId: 1, content: '안녕하세요! 반갑습니다.', createdAt: '2025-02-25T11:10:00.000Z' },
  { id: 3, conversationId: 1, senderId: 2, content: '코스프레 행사 같이 가실래요?', createdAt: '2025-02-25T11:30:00.000Z' },
  { id: 4, conversationId: 2, senderId: 3, content: '피규어 공구 관련 질문이 있어요', createdAt: '2025-02-25T09:00:00.000Z' },
  { id: 5, conversationId: 2, senderId: 1, content: '피규어 공구 감사합니다!', createdAt: '2025-02-25T10:00:00.000Z' },
];
