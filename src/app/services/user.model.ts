export interface User {
    uid: string;
    email: string;
    photoURL?: string;
    displayName?: string;
    fcmTokens?: { [token: string]: true };
}