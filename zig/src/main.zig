const std = @import("std");
const repl = @import("repl/repl.zig").repl;

pub fn main(init: std.process.Init) !void {
    const username = init.environ_map.get("USER") orelse "unknown";

    var writeBuffer: [1024]u8 = undefined;
    var stdoutWriter = std.Io.File.stdout().writer(init.io, &writeBuffer);
    const writer = &stdoutWriter.interface;

    try writer.print("Hello {s}! This is the Monkey programming language!\n", .{username});
    try writer.writeAll("Feel free to type in commands\n");
    try writer.flush();

    try repl(init.io);
}

// Import test files
test {
    @import("std").testing.refAllDecls(@This());
    _ = @import("lexer/lexer.zig");
    _ = @import("token/token.zig");
    _ = @import("token/token_type.zig");
}
