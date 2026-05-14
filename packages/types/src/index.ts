// Shared TypeScript types for LEX Platform

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export enum UserRole {
  ADMIN = 'ADMIN',
  EDITOR = 'EDITOR',
  VIEWER = 'VIEWER'
}

export interface Firm {
  id: string;
  name: string;
  tagline?: string;
  logo?: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontPrimary: string;
  fontSecondary: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PracticeArea {
  id: string;
  title: string;
  description: string;
  icon?: string;
  slug: string;
  order: number;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TeamMember {
  id: string;
  name: string;
  title: string;
  bio: string;
  photo?: string;
  email?: string;
  linkedin?: string;
  order: number;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  published: boolean;
  publishedAt?: Date;
  authorId: string;
  categoryId?: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  order: number;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  fileUrl: string;
  fileSize: number;
  fileType: string;
  price: number;
  currency: string;
  slug: string;
  coverImage?: string;
  published: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Purchase {
  id: string;
  resourceId: string;
  userId: string;
  amount: number;
  currency: string;
  status: PurchaseStatus;
  paystackReference?: string;
  downloadUrl?: string;
  downloadExpiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export enum PurchaseStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED'
}

export interface Testimonial {
  id: string;
  name: string;
  company?: string;
  content: string;
  rating: number;
  photo?: string;
  published: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category?: string;
  order: number;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Page {
  id: string;
  title: string;
  slug: string;
  content: string;
  metaTitle?: string;
  metaDescription?: string;
  published: boolean;
  template: PageTemplate;
  createdAt: Date;
  updatedAt: Date;
}

export enum PageTemplate {
  DEFAULT = 'DEFAULT',
  ABOUT = 'ABOUT',
  CONTACT = 'CONTACT',
  PRIVACY = 'PRIVACY',
  TERMS = 'TERMS'
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: ContactStatus;
  createdAt: Date;
  updatedAt: Date;
}

export enum ContactStatus {
  NEW = 'NEW',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED'
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Auth types
export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  name: string;
}
