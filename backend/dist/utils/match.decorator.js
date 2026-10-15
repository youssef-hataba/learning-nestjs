import { registerDecorator, } from "class-validator";
export function Match(property, validationOptions) {
    return function (object, propertyName) {
        registerDecorator({
            name: "match",
            target: object.constructor,
            propertyName: propertyName,
            constraints: [property],
            options: validationOptions,
            validator: {
                validate(value, args) {
                    const [relatedPropertyName] = args.constraints;
                    const relatedValue = args.object[relatedPropertyName];
                    return value === relatedValue;
                },
            },
        });
    };
}
//# sourceMappingURL=match.decorator.js.map