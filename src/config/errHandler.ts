

export class CustomError extends Error {
    constructor(public statusCode: number, message: string, public customCode?: string | null) {
        super(message);
        this.statusCode = statusCode;
        this.customCode = customCode;
        Error.captureStackTrace(this, this.constructor);
        Object.setPrototypeOf(this, new.target.prototype);
    }

}