export type ButtonVariant =
  | "link"
  | "default"
  | "destructive"
  | "outline"
  | "secondary"
  | "ghost"
  | null
  | undefined;

// export enum Level {
//   known = "known",
//   closer = "closer",
//   closest = "closest"
// }

// export enum RequestStatus {
//   Accepted = "Accepted",
//   Rejected = "Rejected",
//   Pending = "Pending"
// }

export interface Connection {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  connectedUserId: string;
  connectionStatus: RequestStatus;
  level: Level;
  connectedUser: User;
}

export interface User {
  id: string;
  externalId: string;
  profilePicture?: string;
  createdAt: Date;
  email: string;
  username: string;
  given_name?: string;
  family_name?: string;
  birthdate?: Date;
  currentLocation?: string;
  hometown?: string;
  profession?: string;
  bio?: string;
  contactDetails?: ContactDetails;
  socialLinks?: SocialLinks;
  interests: string[];
  hobbies: string[];
  images: string[];
}

export interface ContactDetails {
  id: string;
  userId: string;
  phone?: string;
  address?: string;
}

export interface SocialLinks {
  id: string;
  userId: string;
  facebook?: string;
  instagram?: string;
}

export interface Request {
  id: string;
  createdAt: Date;
  fromUserId: string;
  toUserId: string;
  level: Level;
  status: RequestStatus;
}

// types/user.ts
// import { Level as LevelPrisma, RequestStatus } from '@prisma/client'

// types/user.ts
import { Level, RequestStatus } from '@prisma/client'

export type UserType = {
  id: string;
  externalId: string;
  profilePicture?: string | null;
  createdAt: Date;
  email: string;
  username: string;
  given_name?: string | null;
  family_name?: string | null;
  birthdate?: Date | null;
  currentLocation?: string | null;
  hometown?: string | null;
  profession?: string | null;
  bio?: string | null;
  contactDetails?: {
    id: string;
    userId: string;
    phone: string | null;
    address: string | null;
  } | null;
  socialLinks?: {
    id: string;
    userId: string;
    facebook: string | null;
    instagram: string | null;
    linkedIn: string | null;
    github: string | null;
    twitter: string | null;
    website: string | null;
    snapchat: string | null;
    behance: string | null;
    tiktok: string | null;
    whatsapp: string | null;
    customLinks: any; // Using 'any' for Json type, you might want to define a more specific type
  } | null;
  interests: string[];
  skills: string[];
  hobbies: string[];
  images: string[];
  connectionsFrom: Array<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    connectedUserId: string;
    connectionStatus: RequestStatus;
    level: Level;
  }>;
  connectionsTo: Array<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    connectedUserId: string;
    connectionStatus: RequestStatus;
    level: Level;
  }>;
  sentRequests: Array<{
    id: string;
    createdAt: Date;
    fromUserId: string;
    toUserId: string;
    level: Level;
    status: RequestStatus;
  }>;
  receivedRequests: Array<{
    id: string;
    createdAt: Date;
    fromUserId: string;
    toUserId: string;
    level: Level;
    status: RequestStatus;
  }>;
  updates: Array<{
    id: string;
    createdAt: Date;
    content: string;
    level: Level;
    userId: string;
  }>;
};