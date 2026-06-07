const tokenType = @import("token_type.zig");
const std = @import("std");

pub const Token = union(tokenType.TokenType) {
    ILLEGAL: void,
    EOF: void,

    // identifiers + literals
    IDENT: []const u8,
    INT: []const u8,

    // operators
    ASSIGN: void,
    PLUS: void,
    MINUS: void,
    BANG: void,
    ASTERISK: void,
    SLASH: void,
    EQ: void,
    NOT_EQ: void,

    // delimiters
    COMMA: void,
    SEMICOLON: void,
    LPAREN: void,
    RPAREN: void,
    LBRACE: void,
    RBRACE: void,
    LT: void,
    GT: void,

    // keywords
    FUNCTION: void,
    LET: void,
    TRUE: void,
    FALSE: void,
    IF: void,
    ELSE: void,
    RETURN: void,

    pub fn fromIdent(ident: []const u8) Token {
        if (std.mem.eql(u8, ident, "fn")) {
            return Token{ .FUNCTION = {} };
        } else if (std.mem.eql(u8, ident, "let")) {
            return Token{ .LET = {} };
        } else if (std.mem.eql(u8, ident, "true")) {
            return Token{ .TRUE = {} };
        } else if (std.mem.eql(u8, ident, "false")) {
            return Token{ .FALSE = {} };
        } else if (std.mem.eql(u8, ident, "if")) {
            return Token{ .IF = {} };
        } else if (std.mem.eql(u8, ident, "else")) {
            return Token{ .ELSE = {} };
        } else if (std.mem.eql(u8, ident, "return")) {
            return Token{ .RETURN = {} };
        }

        return Token{ .IDENT = ident };
    }
};
