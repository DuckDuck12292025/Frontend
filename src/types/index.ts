// =====================================================
// DuckDuck TypeScript Type Definitions
// =====================================================

// =====================================================
// 1. Base Types & Enums
// =====================================================

export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
export type UserRole = 'USER' | 'PREMIUM' | 'ADMIN';
export type Theme = 'LIGHT' | 'DARK' | 'SYSTEM';
export type Visibility = 'PUBLIC' | 'FOLLOWERS' | 'SUBSCRIBERS' | 'PRIVATE';
export type MessagePermission = 'ALL' | 'FOLLOWERS' | 'NONE';
export type OAuthProvider = 'KAKAO' | 'NAVER' | 'GOOGLE' | 'APPLE';
export type DeviceType = 'MOBILE' | 'TABLET' | 'DESKTOP' | 'IOS' | 'ANDROID' | 'WEB';
export type LoginStatus = 'SUCCESS' | 'FAILED' | 'BLOCKED';
export type MediaType = 'IMAGE' | 'VIDEO' | 'GIF';
export type LikeTargetType = 'POST' | 'COMMENT';
export type NotificationType =
  | 'LIKE'
  | 'COMMENT'
  | 'FOLLOW'
  | 'REPOST'
  | 'MENTION'
  | 'SUBSCRIPTION'
  | 'SYSTEM'
  | 'CATEGORY_APPROVED'
  | 'CATEGORY_REJECTED';
export type NotificationTargetType = 'POST' | 'COMMENT' | 'USER' | 'CATEGORY';
export type ReportReason = 'SPAM' | 'ABUSE' | 'INAPPROPRIATE' | 'HARASSMENT' | 'OTHER';
export type ReportStatus = 'PENDING' | 'RESOLVED' | 'DISMISSED';
export type ReportTargetType = 'USER' | 'POST' | 'COMMENT';
export type SubscriptionPlanType = 'MONTHLY' | 'YEARLY';
export type SubscriptionStatus = 'ACTIVE' | 'CANCELLED' | 'EXPIRED';
export type PaymentType = 'PREMIUM' | 'FAN_SUBSCRIPTION';
export type PaymentMethod = 'CARD' | 'BANK_TRANSFER';
export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
export type CategoryStatus = 'ACTIVE' | 'INACTIVE' | 'DELETED';
export type BoardApplicationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

// =====================================================
// 2. User Related Types
// =====================================================

export interface User {
  id: number;
  email: string;
  nickname: string;
  handle?: string;
  status: UserStatus;
  role: UserRole;
  isVerified: boolean;
  isBlueChecked: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface UserProfile {
  id: number;
  userId: number;
  profileImageUrl?: string | null;
  backgroundImageUrl?: string | null;
  bio?: string | null;
  followerCount: number;
  followingCount: number;
  postCount: number;
  hasMembership?: boolean; // 멤버십(구독 등급) 설정 여부
  createdAt: string;
  updatedAt: string;
}

export interface UserWithProfile extends User {
  profile?: UserProfile;
}

export interface UserSettings {
  id: number;
  userId: number;
  language: string;
  theme: Theme;
  pushEnabled: boolean;
  pushLike: boolean;
  pushComment: boolean;
  pushFollow: boolean;
  pushRepost: boolean;
  pushSubscription: boolean;
  pushMarketing: boolean;
  emailEnabled: boolean;
  emailMarketing: boolean;
  profileVisibility: Visibility;
  allowMessage: MessagePermission;
  showActivityStatus: boolean;
  showReadReceipts: boolean;
  createdAt: string;
  updatedAt: string;
}

// =====================================================
// 3. Authentication Types
// =====================================================

export interface SocialAccount {
  id: number;
  userId: number;
  provider: OAuthProvider;
  providerId: string;
  createdAt: string;
}

export interface ConnectedAccount {
  id: number;
  userId: number;
  provider: OAuthProvider;
  providerUserId: string;
  providerEmail?: string | null;
  connectedAt: string;
}

export interface LoginHistory {
  id: number;
  userId: number;
  loginType: 'EMAIL' | OAuthProvider;
  ipAddress?: string | null;
  userAgent?: string | null;
  deviceType?: DeviceType | null;
  location?: string | null;
  status: LoginStatus;
  failureReason?: string | null;
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  nickname: string;
}

export interface OAuthLoginRequest {
  provider: OAuthProvider;
  code: string;
  redirectUri: string;
}

// =====================================================
// 4. Category Types
// =====================================================

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  coverImageUrl?: string | null;
  status: CategoryStatus;
  visibility: Visibility;
  postCount: number;
  subscriberCount: number;
  createdBy?: number | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  isSubscribed?: boolean;
}

export interface CategorySubscription {
  id: number;
  userId: number;
  categoryId: number;
  createdAt: string;
}

export interface BoardApplication {
  id: number;
  userId: number;
  boardName: string;
  boardDescription?: string | null;
  requestReason?: string | null;
  status: BoardApplicationStatus;
  adminId?: number | null;
  rejectReason?: string | null;
  createdAt: string;
  processedAt?: string | null;
}

// =====================================================
// 5. Post (Ping) Types
// =====================================================

export interface PostMedia {
  id: number;
  postId: number;
  mediaType: MediaType;
  mediaUrl: string;
  thumbnailUrl?: string | null;
  width?: number | null;
  height?: number | null;
  duration?: number | null;
  orderIndex: number;
  createdAt: string;
}

export interface Post {
  id: number;
  userId: number;
  categoryId?: number | null;
  content: string;
  visibility: Visibility;
  isPinned: boolean;
  likeCount: number;
  commentCount: number;
  repostCount: number;
  viewCount: number;
  bookmarkCount: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface PostWithAuthor extends Post {
  author: UserWithProfile;
  media: PostMedia[];
  category?: Category | null;
  isLiked?: boolean;
  isBookmarked?: boolean;
  isReposted?: boolean;
  // For Pong (repost with content)
  quotedPost?: PostWithAuthor | null;
  // Anonymous question enabled
  acceptsQuestion?: boolean;
  // Q&A items (answered anonymous questions)
  qaItems?: { question: string; answer: string }[];
  // For premium posts - which tiers can access this post
  accessibleTierIds?: number[];
  // Minimum required tier for display purposes
  minRequiredTier?: {
    id: number;
    name: string;
    price: number;
  };
}

export interface CreatePostMediaInfo {
  url: string;
  thumbnailUrl?: string | null;
  mediaType: MediaType;
}

export interface CreatePostRequest {
  content: string;
  categoryId?: number;
  visibility?: Visibility;
  mediaIds?: number[];
  media?: CreatePostMediaInfo[];
  // For premium posts - which tiers can access
  tierIds?: number[];
}

export interface UpdatePostRequest {
  content?: string;
  visibility?: Visibility;
}

// =====================================================
// 6. Interaction Types
// =====================================================

export interface Like {
  id: number;
  userId: number;
  targetType: LikeTargetType;
  targetId: number;
  createdAt: string;
}

export interface Comment {
  id: number;
  postId: number;
  userId: number;
  parentId?: number | null;
  content: string;
  likeCount: number;
  replyCount?: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface ReplyToInfo {
  userId: number;
  nickname: string;
}

export interface CommentWithAuthor extends Comment {
  author: UserWithProfile;
  replyTo?: ReplyToInfo | null;
  replies?: CommentWithAuthor[];
  isLiked?: boolean;
}

export interface CreateCommentRequest {
  postId: number;
  parentId?: number;
  content: string;
}

export interface Repost {
  id: number;
  userId: number;
  postId: number;
  quote?: string | null;
  createdAt: string;
}

export interface RepostWithDetails extends Repost {
  user: UserWithProfile;
  originalPost: PostWithAuthor;
}

export interface CreateRepostRequest {
  postId: number;
  quote?: string;
}

export interface Follow {
  id: number;
  followerId: number;
  followingId: number;
  createdAt: string;
}

export interface FollowWithUser extends Follow {
  follower?: UserWithProfile;
  following?: UserWithProfile;
}

// =====================================================
// 7. Bookmark Types
// =====================================================

export interface BookmarkList {
  id: number;
  userId: number;
  parentId?: number | null;
  name: string;
  coverImageUrl?: string | null;
  bookmarkCount: number;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BookmarkListWithChildren extends BookmarkList {
  children?: BookmarkListWithChildren[];
}

export interface Bookmark {
  id: number;
  userId: number;
  postId: number;
  bookmarkListId?: number | null;
  createdAt: string;
}

export interface BookmarkWithPost extends Bookmark {
  post: PostWithAuthor;
}

export interface CreateBookmarkListRequest {
  name: string;
  parentId?: number;
}

export interface CreateBookmarkRequest {
  postId: number;
  bookmarkListId?: number;
}

// =====================================================
// 8. Notification Types
// =====================================================

export interface Notification {
  id: number;
  userId: number;
  senderId?: number | null;
  type: NotificationType;
  title: string;
  message?: string | null;
  targetType?: NotificationTargetType | null;
  targetId?: number | null;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationWithSender extends Notification {
  sender?: UserWithProfile | null;
}

// =====================================================
// 9. Message Types
// =====================================================

export interface Message {
  id: number;
  senderId: number;
  receiverId: number;
  content: string;
  isRead: boolean;
  senderDeleted: boolean;
  receiverDeleted: boolean;
  createdAt: string;
}

export interface MessageWithUsers extends Message {
  sender: UserWithProfile;
  receiver: UserWithProfile;
}

export interface CreateMessageRequest {
  receiverId: number;
  content: string;
}

// =====================================================
// 10. Block & Report Types
// =====================================================

export interface Block {
  id: number;
  blockerId: number;
  blockedId: number;
  createdAt: string;
}

export interface BlockWithUser extends Block {
  blockedUser: UserWithProfile;
}

export interface Report {
  id: number;
  userId: number;
  targetType: ReportTargetType;
  targetId: number;
  reason: ReportReason;
  description?: string | null;
  status: ReportStatus;
  adminId?: number | null;
  adminNote?: string | null;
  createdAt: string;
  resolvedAt?: string | null;
}

export interface CreateReportRequest {
  targetType: ReportTargetType;
  targetId: number;
  reason: ReportReason;
  description?: string;
}

// =====================================================
// 11. Premium & Subscription Types
// =====================================================

export interface PremiumBenefit {
  id: number;
  name: string;
  description?: string | null;
  isActive: boolean;
}

export interface PremiumSubscription {
  id: number;
  userId: number;
  planType: SubscriptionPlanType;
  status: SubscriptionStatus;
  startedAt: string;
  expiresAt: string;
  cancelledAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PremiumSubscriptionWithBenefits extends PremiumSubscription {
  benefits: PremiumBenefit[];
}

export interface FanTierBenefits {
  items?: string[];
}

export interface FanSubscriptionTier {
  id: number;
  userId: number;
  name: string;
  price: number;
  description?: string | null;
  benefits?: FanTierBenefits | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FanSubscription {
  id: number;
  subscriberId: number;
  creatorId: number;
  tierId: number;
  status: SubscriptionStatus;
  startedAt: string;
  expiresAt: string;
  cancelledAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface FanSubscriptionWithDetails extends FanSubscription {
  subscriber: UserWithProfile;
  creator: UserWithProfile;
  tier: FanSubscriptionTier;
}

export interface CreateFanSubscriptionTierRequest {
  name: string;
  price: number;
  description?: string;
  benefits?: FanTierBenefits;
}

// =====================================================
// 12. Payment Types
// =====================================================

export interface PaymentMethodRecord {
  id: number;
  userId: number;
  type: PaymentMethod;
  cardLastFour?: string | null;
  cardBrand?: string | null;
  isDefault: boolean;
  createdAt: string;
}

export interface Payment {
  id: number;
  userId: number;
  paymentType: PaymentType;
  amount: number;
  currency: string;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string | null;
  paidAt?: string | null;
  createdAt: string;
}

// =====================================================
// 13. API Response Types
// =====================================================

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: ApiError;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface InfiniteScrollResponse<T> {
  items: T[];
  nextCursor?: string | null;
  hasMore: boolean;
}

// =====================================================
// 14. Feed Types
// =====================================================

export type FeedType = 'home' | 'following' | 'category' | 'user' | 'search';

export interface FeedItem {
  type: 'post' | 'repost';
  post: PostWithAuthor;
  repost?: RepostWithDetails;
  timestamp: string;
}

export interface FeedParams {
  type: FeedType;
  categoryId?: number;
  userId?: number;
  query?: string;
  cursor?: string;
  limit?: number;
}

// =====================================================
// 15. Search Types
// =====================================================

export interface SearchParams {
  query: string;
  type?: 'all' | 'posts' | 'users' | 'categories';
  cursor?: string;
  limit?: number;
}

export interface SearchResults {
  posts: PostWithAuthor[];
  users: UserWithProfile[];
  categories: Category[];
}

// =====================================================
// 16. Upload Types
// =====================================================

export interface UploadResponse {
  id: number;
  url: string;
  thumbnailUrl?: string;
  mediaType: MediaType;
  width?: number;
  height?: number;
  duration?: number;
}

// =====================================================
// 17. UI State Types
// =====================================================

export interface ModalState {
  isOpen: boolean;
  type?: string;
  data?: unknown;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}
