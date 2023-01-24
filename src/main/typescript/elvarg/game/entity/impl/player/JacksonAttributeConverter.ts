class JacksonAttributeConverter<T> {
    private static gson = new GsonBuilder().create();
    private clazz: new () => T;

    constructor(clazz: new () => T) {
        this.clazz = clazz;
    }

    public transformFrom(input: T): AttributeValue {
        return { s: gson.toJson(input) };
    }

    public transformTo(input: AttributeValue): T {
        return gson.fromJson(input.s, this.clazz);
    }

    public type(): EnhancedType {
        return EnhancedType.of(this.clazz);
    }

    public attributeValueType(): AttributeValueType {
        return AttributeValueType.S;
    }
}
