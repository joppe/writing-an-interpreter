const tokenType = @import("token_type.zig");
const std = @import("std");

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

    pub fn fromIdent(ident: []const u8) Token {
        if (std.mem.eql(u8, ident, "fn")) {
            return Token{ .function = {} };
        } else if (std.mem.eql(u8, ident, "let")) {
            return Token{ .let = {} };
        }

        return Token{ .ident = ident };
    }
};
