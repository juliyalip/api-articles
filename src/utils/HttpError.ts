export default class HttpError{
    public code: number;
    public message: string;
    constructor( code: number, message: string){
        this.code= code;
        this.message = message

    }
}