const std = @import("std");
const Lexer = @import("../lexer/lexer.zig").Lexer;
const TokenType = @import("../token/token_type.zig").TokenType;

pub fn repl(io: std.Io) !void {
    var writeBuffer: [1024]u8 = undefined;
    var stdoutWriter = std.Io.File.stdout().writer(io, &writeBuffer);
    const writer = &stdoutWriter.interface;
    const prefix = ">> ";

    while (true) {
        try writer.writeAll(prefix);
        try writer.flush();

        var readBuffer: [1024]u8 = undefined;
        var stdinReader = std.Io.File.stdin().reader(io, &readBuffer);
        const reader = &stdinReader.interface;
        const line = try reader.takeDelimiterExclusive('\n');

        if (std.mem.eql(u8, line, "exit")) {
            break;
        }

        var lexer = Lexer.init(line);
        var token = lexer.next_token();

        while (token != .EOF) : (token = lexer.next_token()) {
            var buf: [256]u8 = undefined;
            const str = try token.toString(&buf);

            try writer.print("{s}\n", .{str});
            try writer.flush();
        }
    }
}
