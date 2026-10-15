import { JwtPayload } from "../../utils/types.js";
export declare const CurrentUser: (...dataOrPipes: (keyof JwtPayload | import("@nestjs/common").ParameterDecoratorOptions | import("@nestjs/common").PipeTransform<any, any> | import("@nestjs/common").Type<import("@nestjs/common").PipeTransform<any, any>> | undefined)[]) => ParameterDecorator;
