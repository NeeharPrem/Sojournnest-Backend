interface Conversation {
    members: Array<string>;

}
export default interface IConversationRepoInterface {
    save(conversation: Array<string>): Promise<any>,
    findByUserId(id: string): Promise<any>
    checkExisting(members: Array<string>): Promise<any>
}