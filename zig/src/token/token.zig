const tokenType = @import("token_type.zig")

pub const Token = union(tokenType.TokenType) {
    illegal: void,
    eof: void,

    // identifiers + literals
    ident: []const u8,
    int: []const u8,

    // operators
    assign: void,
    plus: void,

    // delimiters
    comma: void,
    semicolon: void,
    lparen: void,
    rparen: void,
    lbrace: void,
    rbrace: void,

    // keywords
    function: void,
    let: void,
};
