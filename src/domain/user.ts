interface User{
    [x: string]: any;
    toObject: any;
    _id?:string;
    fname:string;
    lname:string;
    email:string;
    mobile:string;
    password:string;
    admin?:boolean;
    profilePic?: string;
    is_google?: boolean;
    is_blocked:boolean,
    is_verified:boolean;
    refreshToken?: string;
    fcmToken?:string;
}

export default User