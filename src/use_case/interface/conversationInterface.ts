export default interface IConversationRepoInterface {
    save(conversation: Array<{ memberId: string }>, senderId:string): Promise<any>,
    updateUserLastSeen(id:string,data:Date):Promise<any>,
    findByUserId(id: string): Promise<any>
    checkExisting(members: Array<{ memberId: string }>, senderId:string): Promise<any>
}