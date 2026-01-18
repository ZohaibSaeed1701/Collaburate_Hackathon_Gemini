import dbConnect from "@/app/lib/databaseConnection";
import User from "@/app/models/user.model";
import bcript from "bcryptjs";

export async function POST(request: Request) {
  const { email, password } = await request.json();

  try {
    await dbConnect();

    if (!email || !password) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Email and password are required",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const user = await User.findOne({ email });
    if (!user) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Email not found",
        }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    if (!user.is_verified) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Account not verified. Please verify OTP from signup.",
        }),
        {
          status: 403,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const isPasswordCorrect = await bcript.compare(password, user.password);
    if (!isPasswordCorrect) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Incorrect password",
        }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Login successful",
        role: user.role,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Sign in failed:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Server error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}