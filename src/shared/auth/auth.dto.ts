export interface LoginContractDto {
    email: string;
    password: string;
}

export interface LoginResponseContractDto {
    access_token: string;
    user_id: string;
    email: string
    first_name: string;
    last_name: string;
}

export interface LoginValidateContractDto {
    user_id: string;
    email: string;
    first_name: string;
    last_name: string;
    roles: any[];
}

export interface ResetPasswordContractDto {
    email: string;
}

export interface ChangePasswordContractDto {
    email: string;
    token: string;
    newPassword: string;
}

export interface VerifyEmailContractDto {
    email: string;
    token: string;
    first_name?: string;
    last_name?: string;
    verify_link?: string;
    unsubscribe_link?: string;
    bcc?: string;
}


export interface MailActionContractDto {
    email: string;
    token: string;
}
