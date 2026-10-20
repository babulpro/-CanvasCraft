import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// POST /api/admin/role — Set or toggle user role (ADMIN ONLY)
export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Please sign in." },
        { status: 401 }
      );
    }

    const caller = session.user as typeof session.user & { role?: string };

    // Check if any admin exists in database (for emergency bootstrap only if 0 admins exist)
    const adminCount = await prisma.user.count({
      where: { role: "admin" },
    });

    // If admins already exist, the caller MUST be an admin
    if (adminCount > 0 && caller.role !== "admin") {
      return NextResponse.json(
        {
          success: false,
          error: "Forbidden: Only an authorized Administrator can activate or change user roles.",
        },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { role, targetUserId } = body;

    const validRoles = ["admin", "moderator", "user"];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid role '${role}'. Must be one of: ${validRoles.join(", ")}`,
        },
        { status: 400 }
      );
    }

    const userIdToUpdate = targetUserId || caller.id;

    // Guard: Prevent sole admin from demoting themselves and locking the system
    if (userIdToUpdate === caller.id && role !== "admin" && adminCount <= 1) {
      return NextResponse.json(
        {
          success: false,
          error: "Action Denied: You cannot demote yourself as you are the only Administrator.",
        },
        { status: 400 }
      );
    }

    // Verify target user exists
    const targetUser = await prisma.user.findUnique({
      where: { id: userIdToUpdate },
    });

    if (!targetUser) {
      return NextResponse.json(
        { success: false, error: "Target user not found." },
        { status: 404 }
      );
    }

    // Update in MongoDB via Prisma
    const updatedUser = await prisma.user.update({
      where: { id: userIdToUpdate },
      data: { role },
      select: { id: true, name: true, email: true, username: true, role: true },
    });

    return NextResponse.json({
      success: true,
      message: `Role for ${targetUser.email} successfully updated to '${role}'!`,
      user: updatedUser,
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to update role.";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
