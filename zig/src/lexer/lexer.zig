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
            nextToken = token.Token{ .assign = {} };
        } else if (self.ch == ';') {
            nextToken = token.Token{ .semicolon = {} };
        } else if (self.ch == '(') {
            nextToken = token.Token{ .lparen = {} };
        } else if (self.ch == ')') {
            nextToken = token.Token{ .rparen = {} };
        } else if (self.ch == ',') {
            nextToken = token.Token{ .comma = {} };
        } else if (self.ch == '+') {
            nextToken = token.Token{ .plus = {} };
        } else if (self.ch == '{') {
            nextToken = token.Token{ .lbrace = {} };
        } else if (self.ch == '}') {
            nextToken = token.Token{ .rbrace = {} };
        } else if (self.ch == 0) {
            nextToken = token.Token{ .eof = {} };
        } else if (is_letter(self.ch)) {
            const literal = self.read_identifier();

            return token.Token.fromIdent(literal);
        } else if (is_digit(self.ch)) {
            const literal = self.read_number();
            return token.Token{ .int = literal };
        } else {
            nextToken = token.Token{ .illegal = {} };
        }

        self.read_char();

        return nextToken;
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

    const expected = [_]token.Token{
        token.Token{ .let = {} },
        token.Token{ .ident = "five" },
        token.Token{ .assign = {} },
        token.Token{ .int = "5" },
        token.Token{ .semicolon = {} },
        token.Token{ .let = {} },
        token.Token{ .ident = "ten" },
        token.Token{ .assign = {} },
        token.Token{ .int = "10" },
        token.Token{ .semicolon = {} },
        token.Token{ .let = {} },
        token.Token{ .ident = "add" },
        token.Token{ .assign = {} },
        token.Token{ .function = {} },
        token.Token{ .lparen = {} },
        token.Token{ .ident = "x" },
        token.Token{ .comma = {} },
        token.Token{ .ident = "y" },
        token.Token{ .rparen = {} },
        token.Token{ .lbrace = {} },
        token.Token{ .ident = "x" },
        token.Token{ .plus = {} },
        token.Token{ .ident = "y" },
        token.Token{ .semicolon = {} },
        token.Token{ .rbrace = {} },
        token.Token{ .semicolon = {} },
        token.Token{ .let = {} },
        token.Token{ .ident = "result" },
        token.Token{ .assign = {} },
        token.Token{ .ident = "add" },
        token.Token{ .lparen = {} },
        token.Token{ .ident = "five" },
        token.Token{ .comma = {} },
        token.Token{ .ident = "ten" },
        token.Token{ .rparen = {} },
        token.Token{ .semicolon = {} },
        token.Token{ .eof = {} },
    };

    var lexer = Lexer.init(input);

    for (expected) |expected_token| {
        const nextToken = lexer.next_token();

        try std.testing.expectEqualDeep(expected_token, nextToken);
    }
}
