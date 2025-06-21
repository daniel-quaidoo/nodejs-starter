export class UserCredentialsDto {
    userCredentialsId: string;

    userId: string; // Reference to the linked User

    password?: string;
    loginProvider?: string;
    verificationToken?: string;
    resetToken?: string;
    isSubscribedToken?: string;

    isDisabled: boolean;
    isVerified: boolean;
    isSubscribed: boolean;
    isOnboarded: boolean;
    isApproved: boolean;
    isRejected: boolean;

    lastLoginTime?: Date;
    currentLoginTime?: Date;
}
