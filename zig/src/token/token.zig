const TokenType = @import("token_type.zig").TokenType;
const std = @import("std");

pub const Token = union(TokenType) {
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

    pub fn toString(self: Token, buf: []u8) ![]const u8 {
        return switch (self) {
            .ILLEGAL => try std.fmt.bufPrint(buf, "ILLEGAL", .{}),
            .EOF => try std.fmt.bufPrint(buf, "EOF", .{}),
            .IDENT => |val| try std.fmt.bufPrint(buf, "IDENT({s})", .{val}),
            .INT => |val| try std.fmt.bufPrint(buf, "INT({s})", .{val}),
            .ASSIGN => try std.fmt.bufPrint(buf, "ASSIGN", .{}),
            .PLUS => try std.fmt.bufPrint(buf, "PLUS", .{}),
            .MINUS => try std.fmt.bufPrint(buf, "MINUS", .{}),
            .BANG => try std.fmt.bufPrint(buf, "BANG", .{}),
            .ASTERISK => try std.fmt.bufPrint(buf, "ASTERISK", .{}),
            .SLASH => try std.fmt.bufPrint(buf, "SLASH", .{}),
            .EQ => try std.fmt.bufPrint(buf, "EQ", .{}),
            .NOT_EQ => try std.fmt.bufPrint(buf, "NOT_EQ", .{}),
            .COMMA => try std.fmt.bufPrint(buf, "COMMA", .{}),
            .SEMICOLON => try std.fmt.bufPrint(buf, "SEMICOLON", .{}),
            .LPAREN => try std.fmt.bufPrint(buf, "LPAREN", .{}),
            .RPAREN => try std.fmt.bufPrint(buf, "RPAREN", .{}),
            .LBRACE => try std.fmt.bufPrint(buf, "LBRACE", .{}),
            .RBRACE => try std.fmt.bufPrint(buf, "RBRACE", .{}),
            .LT => try std.fmt.bufPrint(buf, "LT", .{}),
            .GT => try std.fmt.bufPrint(buf, "GT", .{}),
            .FUNCTION => try std.fmt.bufPrint(buf, "FUNCTION", .{}),
            .LET => try std.fmt.bufPrint(buf, "LET", .{}),
            .TRUE => try std.fmt.bufPrint(buf, "TRUE", .{}),
            .FALSE => try std.fmt.bufPrint(buf, "FALSE", .{}),
            .IF => try std.fmt.bufPrint(buf, "IF", .{}),
            .ELSE => try std.fmt.bufPrint(buf, "ELSE", .{}),
            .RETURN => try std.fmt.bufPrint(buf, "RETURN", .{}),
        };
    }

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
