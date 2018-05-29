export class Reimbursement {
    private username : string;  // partition key
    private timeSubmitted : string;  // sort key, number
    private items : ReimbursementItem [
        // array of reimbursement items
    ];
    private approver : string; //username of resolver
    private status : string // “approved” or “denied”,
    private receipts : string [// [
        // strings that contain urls to retrieve the receipts from s3 buckets – stretch goal
    ];

    constructor(use: string, time: string, it: ReimbursementItem[], admin: string, stat: string, rec: string[])   {
        this.username = use;
        this.timeSubmitted = new Date(Date.parse(time)).toLocaleString('en-US');
        this.items = it;
        this.approver = admin;
        this.status = stat;
        this.receipts = rec;
    }
    
    getUsername() : string {return this.username;}
    setUsername(user : string) : void {this.username = user;}
    getTimeSubmitted() : string {return this.timeSubmitted;}
    setTimeSubmitted(time : string) : void {this.timeSubmitted = time;}
    getItems() : ReimbursementItem[] {return this.items;}
    setItems(tickets : ReimbursementItem[]) : void {this.items = tickets;}
    getApprover() : string {return this.approver;}
    setApprover(admin : string) : void {this.approver = admin;}
    getStatus() : string {return this.status;}
    setStatus(stat : string) : void {this.status = stat;}
    getReceipts() : string[] {return this.receipts;}
    setReceipts(rec : string[]) : void {this.receipts = rec;}
}
export class ReimbursementItem {
    private title : string; //must be unique to this list
    private amount : number; //50
    private description : string; //description of what the reimbursement is for
    private timeOfExpense : string //timestamp // number

    constructor(legend : string, val : number, desc : string, expTime : string) {
        this.title = legend;
        this.amount = val;
        this.description = desc;
        this.timeOfExpense = new Date(Date.parse(expTime)).toLocaleString('en-US');
    }
    
    getTitle() : string {return this.title;}
    setTitle(legend : string) : void {this.title = legend;}
    getAmount() : number {return this.amount;}
    setAmount(val : number) : void {this.amount = val;}
    getDescription() : string {return this.description;}
    setDescription(desc : string) : void {this.description = desc;}
    getTimeOfExpense() : string {return this.timeOfExpense;}
    setTimeOfExpense(expTime : string) : void {this.timeOfExpense = expTime;}
}