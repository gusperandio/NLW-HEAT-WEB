import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

interface IPaylaod{
    sub: string
}

export function ensureAuthenticated(request: Request, response: Response, next: NextFunction){
    const authToke = request.headers.authorization;

    if(!authToke){
        return response.status(401).json({
            errorCode: "token.invalid",
        });
    }

    const [, token ] = authToke.split(" ")

    try 
    {

        const { sub } = verify(token, process.env.JWT_SECRET) as IPaylaod

        request.user_id = sub
        return next();
    } 
    catch (err) 
    {
        return response.status(401).json({errorCode: "token.expired"})
    }
}