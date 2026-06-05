const Token = @import("../token/token.zig");
const tokenType = @import("../token/token_type.zig");
const std = @import("std");

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

    pub fn next_token(self: *Lexer) Token.Token {
        self.skip_whitespace();

        var token: Token.Token = undefined;

        if (self.ch == '=') {
            token = Token.Token{ .assign = {} };
        } else if (self.ch == ';') {
            token = Token.Token{ .semicolon = {} };
        } else if (self.ch == '(') {
            token = Token.Token{ .lparen = {} };
        } else if (self.ch == ')') {
            token = Token.Token{ .rparen = {} };
        } else if (self.ch == ',') {
            token = Token.Token{ .comma = {} };
        } else if (self.ch == '+') {
            token = Token.Token{ .plus = {} };
        } else if (self.ch == '{') {
            token = Token.Token{ .lbrace = {} };
        } else if (self.ch == '}') {
            token = Token.Token{ .rbrace = {} };
        } else if (self.ch == 0) {
            token = Token.Token{ .eof = {} };
        } else if (is_letter(self.ch)) {
            const literal = self.read_identifier();
            return lookup_ident(literal);
        } else if (is_digit(self.ch)) {
            return self.read_number();
        } else {
            token = Token.Token{ .illegal = {} };
        }

        self.read_char();

        return token;
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
    ;

    const expected = [_]Token.Token{
        Token.Token{ .let = {} },
        Token.Token{ .ident = "five" },
        Token.Token{ .assign = {} },
        Token.Token{ .int = "5" },
        Token.Token{ .semicolon = {} },
        Token.Token{ .let = {} },
        Token.Token{ .ident = "ten" },
        Token.Token{ .assign = {} },
        Token.Token{ .int = "10" },
        Token.Token{ .semicolon = {} },
        Token.Token{ .let = {} },
        Token.Token{ .ident = "add" },
        Token.Token{ .assign = {} },
        Token.Token{ .function = {} },
        Token.Token{ .lparen = {} },
        Token.Token{ .ident = "x" },
        Token.Token{ .comma = {} },
        Token.Token{ .ident = "y" },
        Token.Token{ .rparen = {} },
        Token.Token{ .lbrace = {} },
        Token.Token{ .ident = "x" },
        Token.Token{ .plus = {} },
        Token.Token{ .ident = "y" },
        Token.Token{ .semicolon = {} },
        Token.Token{ .rbrace = {} },
        Token.Token{ .semicolon = {} },
        Token.Token{ .let = {} },
        Token.Token{ .ident = "result" },
        Token.Token{ .assign = {} },
        Token.Token{ .ident = "add" },
        Token.Token{ .lparen = {} },
        Token.Token{ .ident = "five" },
        Token.Token{ .comma = {} },
        Token.Token{ .ident = "ten" },
        Token.Token{ .rparen = {} },
        Token.Token{ .semicolon = {} },
        Token.Token{ .eof = {} },
    };

    var lexer = Lexer.init(input);

    for (expected) |expected_token| {
        const tok = lexer.next_token();
        try std.testing.expectEqual(expected_token, tok);
    }
}
