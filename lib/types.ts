export type ButtonVariant =
  | "link"
  | "default"
  | "destructive"
  | "outline"
  | "secondary"
  | "ghost"
  | null
  | undefined;

export interface Connection {
  userId: string;
  connectedUserId: string;
  level: "known" | "closer" | "closest";
  connectionStatus: "Connected" | "Rejected" | "Pending";
  // messages have not been written here
}
