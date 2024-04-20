import { NextRequest } from "next/server";
import { hash } from "bcryptjs";
import User from "@/models/User";
import { connectToDB } from "@/lib/mongoDB";

export const POST = async (req: NextRequest) => {
  try {
    await connectToDB();

    const { username, email, password } = await req.json();

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return new Response("User already exists", { status: 400 });
    }

    const hashedPassword = await hash(password, 12);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    return new Response(JSON.stringify(newUser), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response("Failed to create a new user", { status: 500 });
  }
};
