export type CallState =
  | "IDLE"
  | "CALLING" // Outgoing: waiting for callee to receive & answer
  | "RINGING" // Incoming: received incoming call invitation
  | "ACCEPTED" // Accepted by callee, negotiating / preparing
  | "CONNECTING" // WebRTC negotiation in progress
  | "CONNECTED" // Call active
  | "DECLINED" // Rejected by callee
  | "CANCELLED" // Cancelled by caller before answer
  | "MISSED" // Ringing timed out
  | "BUSY" // Target user is already in another call
  | "FAILED" // Error or failure
  | "ENDED"; // Call finished

export interface CallUser {
  id: string;
  name?: string;
  profilePicture?: string;
  role?: string;
}

export interface ActiveCallData {
  callId: string;
  conversationId: string;
  remoteUser: CallUser;
  isOutgoing: boolean;
  startedAt?: Date;
  acceptedAt?: Date;
}
