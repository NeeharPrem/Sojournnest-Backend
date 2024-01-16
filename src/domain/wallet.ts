interface Wallet {
    _id?: string;
    userId: string;
    walletAmount: string;
    transactions: Array<transactions>;
}

interface transactions{
  date:string
  message:string
  amount:number
  type:string
  balance:number
}

export default Wallet;