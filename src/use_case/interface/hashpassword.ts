interface Hashpassword{
    generateHash(password:string):Promise<string>,
    compare(password:string,hashpassword:string):Promise<boolean>
}

export default Hashpassword