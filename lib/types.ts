export type ButtonVariant =
  | "link"
  | "default"
  | "destructive"
  | "outline"
  | "secondary"
  | "ghost"
  | null
  | undefined;

export enum Level {
  known = "known",
  closer = "closer",
  closest = "closest"
}

export enum RequestStatus {
  Accepted = "Accepted",
  Rejected = "Rejected",
  Pending = "Pending"
}

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