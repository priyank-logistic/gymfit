import { NextResponse } from "next/server";
import { verifyPassword, generateToken } from "@/lib/auth";
import { getUserByEmail, getUserByPhone } from "@/lib/users";

export async function POST(request) {
  try {
    const body = await request.json();
    const { email_or_phone, password } = body;

    // Validation
    if (!email_or_phone || !password) {
      return NextResponse.json(
        { error: "Email/phone and password are required" },
        { status: 400 }
      );
    }

    // Find user by email or phone
    let user = getUserByEmail(email_or_phone);
    if (!user) {
      user = getUserByPhone(email_or_phone);
    }

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email/phone or password" },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid email/phone or password" },
        { status: 401 }
      );
    }

    // Generate token
    const token = generateToken(user.id);

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(
      {
        message: "Login successful",
        token,
        user: userWithoutPassword,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

