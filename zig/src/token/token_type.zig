pub const TokenType = enum {
    illegal,
    eof,

    // identifiers + literals
    ident,
    int,

    // operators
    assign,
    plus,

    // delimiters
    comma,
    semicolon,
    lparen,
    rparen,
    lbrace,
    rbrace,

    // keywords
    function,
    let,
};
