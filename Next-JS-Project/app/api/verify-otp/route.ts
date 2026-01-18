import dbConnect from "@/app/lib/databaseConnection";
import User from "@/app/models/user.model";

export async function POST(request: Request) {
  const { email, otp } = await request.json();

  try {
    await dbConnect();

    if (!email || !otp) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Email and OTP are required",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const user = await User.findOne({ email });
    if (!user) {
      return new Response(
        JSON.stringify({ success: false, message: "Email not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    if (user.is_verified) {
      return new Response(
        JSON.stringify({ success: true, message: "Already verified" }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!user.otp || user.otp !== otp) {
      return new Response(
        JSON.stringify({ success: false, message: "Invalid OTP" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (user.expiry_time && user.expiry_time.getTime() < Date.now()) {
      return new Response(
        JSON.stringify({ success: false, message: "OTP expired" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    user.is_verified = true;
    user.otp = null;
    user.expiry_time = null;
    await user.save();

    return new Response(
      JSON.stringify({ success: true, message: "Account verified" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Verify OTP failed:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
