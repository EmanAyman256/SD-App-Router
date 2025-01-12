export class AuthUser {
   // roles: string[]=[];
    constructor(
        public email: string,
        private _token: string,
        public  roles: string[],
       // public role:[],
    ) { }

    get token() {
        return this._token;
    }
}