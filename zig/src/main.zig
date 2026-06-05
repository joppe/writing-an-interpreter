const std = @import("std");

pub fn main() !void {
    std.debug.print("Hello, Interpreter!\n", .{});
}

// Import test files
test {
    @import("std").testing.refAllDecls(@This());
    _ = @import("lexer/lexer.zig");
    _ = @import("token/token.zig");
    _ = @import("token/token_type.zig");
}
