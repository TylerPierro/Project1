export class User  {
    private username : string;
    private password : string;
    private firstName : string;
    private lastName : string;
    private email : string;
    private role : string;
    
    constructor(use: string, pass: string, first: string, last: string, e: string, r: string)   {
        this.username = use;
        /*const CryptoJS = require('crypto-js/AES');
        const encryptedpass = CryptoJS.AES.encrypt(pass, 'p@r@d1$0');*/
        const passwordHash = require('password-hash');
        const hashedPassword = passwordHash.generate(pass);
        this.password = hashedPassword;
        this.firstName = first;
        this.lastName = last;
        this.email = e;
        this.role = r;
    }
    getUsername() : string   {return this.username;}
    setUsername(use : string) : void {this.username = use;}

    getPassword() : string  {return this.password;}
    setPassword(pass : string) : void {this.password = pass;}

    getFirstName() : string {return this.firstName;}
    setFirstName(first : string) : void {this.firstName = first;}

    getLastName() : string  {return this.lastName;}
    setLastName(last : string) : void {this.lastName = last;}

    getEmail() : string {return this.email;}
    setEmail(e : string) : void {this.email = e;}

    getRole() : string  {return this.role;}
    setRole(r : string) : void {this.role = r;}
}