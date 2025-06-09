/**
 * A token that can be used to inject a dependency
 * @template T The type of the dependency
 */
export class Token<T> {
    /**
     * Creates a new token
     * @param name The name of the token (for debugging purposes)
     */
    constructor(public readonly name: string) {}

    /**
     * Creates a new token with a unique symbol
     * @param description Description of the token (for debugging)
     * @returns A new token
     */
    static create<T>(description: string): Token<T> {
        return new Token<T>(description);
    }
}
