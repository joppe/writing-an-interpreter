const std = @import("std");

const token = @import("../token/token.zig");
const tokenType = @import("../token/token_type.zig");

const EOF: u8 = 0;

pub const Lexer = struct {
    input: []const u8,
    position: usize,
    read_position: usize,
    ch: u8,

    pub fn init(input: []const u8) Lexer {
        var lexer = Lexer{
            .input = input,
            .position = 0,
            .read_position = 0,
            .ch = EOF,
        };

        lexer.read_char();

        return lexer;
    }

    pub fn next_token(self: *Lexer) token.Token {
        self.skip_whitespace();

        var nextToken: token.Token = undefined;

        if (self.ch == '=') {
            if (self.peek_char() == '=') {
                self.read_char();

                nextToken = token.Token{ .EQ = {} };
            } else {
                nextToken = token.Token{ .ASSIGN = {} };
            }
        } else if (self.ch == '+') {
            nextToken = token.Token{ .PLUS = {} };
        } else if (self.ch == '-') {
            nextToken = token.Token{ .MINUS = {} };
        } else if (self.ch == '!') {
            if (self.peek_char() == '=') {
                self.read_char();

                nextToken = token.Token{ .NOT_EQ = {} };
            } else {
                nextToken = token.Token{ .BANG = {} };
            }
        } else if (self.ch == '/') {
            nextToken = token.Token{ .SLASH = {} };
        } else if (self.ch == '*') {
            nextToken = token.Token{ .ASTERISK = {} };
        } else if (self.ch == ';') {
            nextToken = token.Token{ .SEMICOLON = {} };
        } else if (self.ch == ',') {
            nextToken = token.Token{ .COMMA = {} };
        } else if (self.ch == '<') {
            nextToken = token.Token{ .LT = {} };
        } else if (self.ch == '>') {
            nextToken = token.Token{ .GT = {} };
        } else if (self.ch == '(') {
            nextToken = token.Token{ .LPAREN = {} };
        } else if (self.ch == ')') {
            nextToken = token.Token{ .RPAREN = {} };
        } else if (self.ch == '{') {
            nextToken = token.Token{ .LBRACE = {} };
        } else if (self.ch == '}') {
            nextToken = token.Token{ .RBRACE = {} };
        } else if (self.ch == 0) {
            nextToken = token.Token{ .EOF = {} };
        } else if (is_letter(self.ch)) {
            const literal = self.read_identifier();

            return token.Token.fromIdent(literal);
        } else if (is_digit(self.ch)) {
            const literal = self.read_number();
            return token.Token{ .INT = literal };
        } else {
            nextToken = token.Token{ .ILLEGAL = {} };
        }

        self.read_char();

        return nextToken;
    }

    fn peek_char(self: Lexer) u8 {
        if (self.read_position >= self.input.len) {
            return EOF;
        }

        return self.input[self.read_position];
    }

    fn read_identifier(self: *Lexer) []const u8 {
        const position = self.position;

        while (is_letter(self.ch)) {
            self.read_char();
        }

        return self.input[position..self.position];
    }

    fn read_number(self: *Lexer) []const u8 {
        const position = self.position;

        while (is_digit(self.ch)) {
            self.read_char();
        }

        return self.input[position..self.position];
    }

    fn skip_whitespace(self: *Lexer) void {
        while (self.ch == ' ' or self.ch == '\t' or self.ch == '\n' or self.ch == '\r') {
            self.read_char();
        }
    }

    fn is_letter(ch: u8) bool {
        return (ch >= 'a' and ch <= 'z') or (ch >= 'A' and ch <= 'Z') or ch == '_';
    }

    fn is_digit(ch: u8) bool {
        return ch >= '0' and ch <= '9';
    }

    fn read_char(self: *Lexer) void {
        if (self.read_position >= self.input.len) {
            self.ch = EOF;
        } else {
            self.ch = self.input[self.read_position];
        }

        self.position = self.read_position;
        self.read_position += 1;
    }
};

test "next_token" {
    const input =
        \\let five = 5;
        \\let ten = 10;
        \\
        \\let add = fn(x, y) {
        \\  x + y;
        \\};
        \\
        \\let result = add(five, ten);
        \\!-/*5;
        \\5 < 10 > 5;
        \\
        \\if (5 < 10) {
        \\return true;
        \\} else {
        \\return false;
        \\}
        \\10 == 10;
        \\10 != 9;
    ;

    const expected = [_]token.Token{
        token.Token{ .LET = {} },
        token.Token{ .IDENT = "five" },
        token.Token{ .ASSIGN = {} },
        token.Token{ .INT = "5" },
        token.Token{ .SEMICOLON = {} },
        token.Token{ .LET = {} },
        token.Token{ .IDENT = "ten" },
        token.Token{ .ASSIGN = {} },
        token.Token{ .INT = "10" },
        token.Token{ .SEMICOLON = {} },
        token.Token{ .LET = {} },
        token.Token{ .IDENT = "add" },
        token.Token{ .ASSIGN = {} },
        token.Token{ .FUNCTION = {} },
        token.Token{ .LPAREN = {} },
        token.Token{ .IDENT = "x" },
        token.Token{ .COMMA = {} },
        token.Token{ .IDENT = "y" },
        token.Token{ .RPAREN = {} },
        token.Token{ .LBRACE = {} },
        token.Token{ .IDENT = "x" },
        token.Token{ .PLUS = {} },
        token.Token{ .IDENT = "y" },
        token.Token{ .SEMICOLON = {} },
        token.Token{ .RBRACE = {} },
        token.Token{ .SEMICOLON = {} },
        token.Token{ .LET = {} },
        token.Token{ .IDENT = "result" },
        token.Token{ .ASSIGN = {} },
        token.Token{ .IDENT = "add" },
        token.Token{ .LPAREN = {} },
        token.Token{ .IDENT = "five" },
        token.Token{ .COMMA = {} },
        token.Token{ .IDENT = "ten" },
        token.Token{ .RPAREN = {} },
        token.Token{ .SEMICOLON = {} },
        token.Token{ .BANG = {} },
        token.Token{ .MINUS = {} },
        token.Token{ .SLASH = {} },
        token.Token{ .ASTERISK = {} },
        token.Token{ .INT = "5" },
        token.Token{ .SEMICOLON = {} },
        token.Token{ .INT = "5" },
        token.Token{ .LT = {} },
        token.Token{ .INT = "10" },
        token.Token{ .GT = {} },
        token.Token{ .INT = "5" },
        token.Token{ .SEMICOLON = {} },
        token.Token{ .IF = {} },
        token.Token{ .LPAREN = {} },
        token.Token{ .INT = "5" },
        token.Token{ .LT = {} },
        token.Token{ .INT = "10" },
        token.Token{ .RPAREN = {} },
        token.Token{ .LBRACE = {} },
        token.Token{ .RETURN = {} },
        token.Token{ .TRUE = {} },
        token.Token{ .SEMICOLON = {} },
        token.Token{ .RBRACE = {} },
        token.Token{ .ELSE = {} },
        token.Token{ .LBRACE = {} },
        token.Token{ .RETURN = {} },
        token.Token{ .FALSE = {} },
        token.Token{ .SEMICOLON = {} },
        token.Token{ .RBRACE = {} },
        token.Token{ .INT = "10" },
        token.Token{ .EQ = {} },
        token.Token{ .INT = "10" },
        token.Token{ .SEMICOLON = {} },
        token.Token{ .INT = "10" },
        token.Token{ .NOT_EQ = {} },
        token.Token{ .INT = "9" },
        token.Token{ .SEMICOLON = {} },
        token.Token{ .EOF = {} },
    };

    var lexer = Lexer.init(input);

    for (expected) |expected_token| {
        const nextToken = lexer.next_token();

        try std.testing.expectEqualDeep(expected_token, nextToken);
    }
}
