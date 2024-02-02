class Token {
    constructor(token, literal) {
        this.token = token || "invalid";
        this.literal = literal || "invalid";
    }

    static lookupIdentity(identity) {
        if (Keywords[identity]) {
            return Keywords[identity];
        }
        return Tokens.IDENT.token;
    }
}

const Tokens = {
    // operators
    ASSIGN: { token: "ASSIGN", literal: "=" },
    PLUS: { token: "PLUS", literal: "+" },
    MINUS: { token: "MINUS", literal: "-" },
    BANG: { token: "BANG", literal: "!" },
    ASTERISK: { token: "ASTERISK", literal: "*" },
    SLASH: { token: "SLASH", literal: "/" },

    LT: { token: "LT", literal: "<" },
    GT: { token: "GT", literal: ">" },

    EQ: { token: "EQ", literal: "==" },
    NOT_EQ: { token: "NOT_EQ", literal: "!=" },

    // delimiters
    COMMA: { token: "COMMA", literal: "," },
    SEMICOLON: { token: "SEMICOLON", literal: ";" },

    LPAREN: { token: "LPAREN", literal: "(" },
    RPAREN: { token: "RPAREN", literal: ")" },
    LBRACE: { token: "LBRACE", literal: "{" },
    RBRACE: { token: "RBRACE", literal: "}" },

    // identifiers
    IDENT: { token: "IDENT", literal: "" },

    // keywords
    FUNCTION: { token: "FUNCTION", literal: "FUNCTION" },
    LET: { token: "LET", literal: "LET" },
    TRUE: { token: "TRUE", literal: "TRUE" },
    FALSE: { token: "FALSE", literal: "FALSE" },
    IF: { token: "IF", literal: "IF" },
    ELSE: { token: "ELSE", literal: "ELSE" },
    RETURN: { token: "RETURN", literal: "RETURN" },

    // other
    ILLEGAL: { token: "ILLEGAL", literal: "" },
    EOF: { token: "EOF", literal: "\0" },

    // data types and functions
    INT: { token: "INT", literal: "" },
    STRING: { token: "STRING", literal: "" },
};

const Keywords = {
    fn: Tokens.FUNCTION.token,
    let: Tokens.LET.token,
    true: Tokens.TRUE.token,
    false: Tokens.FALSE.token,
    if: Tokens.IF.token,
    else: Tokens.ELSE.token,
    return: Tokens.RETURN.token,
};

export { Token, Tokens };
