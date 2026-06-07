pub const TokenType = enum {
    ILLEGAL,
    EOF,

    // identifiers + literals
    IDENT,
    INT,

    // operators
    ASSIGN,
    PLUS,
    MINUS,
    BANG,
    ASTERISK,
    SLASH,
    EQ,
    NOT_EQ,

    // delimiters
    COMMA,
    SEMICOLON,
    LPAREN,
    RPAREN,
    LBRACE,
    RBRACE,
    LT,
    GT,

    // keywords
    FUNCTION,
    LET,
    TRUE,
    FALSE,
    IF,
    ELSE,
    RETURN,
};
