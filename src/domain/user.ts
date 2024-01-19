interface User{
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
}

export default User