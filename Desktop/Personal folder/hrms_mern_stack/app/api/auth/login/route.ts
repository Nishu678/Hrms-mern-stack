import { dbConnect } from "@/lib/db";
import User from "@/models/User";

export async function POST(req: Request) {
    try {
        await dbConnect();
        const { email, password } = await req.json();
        const userExist = await User.findOne({ email })
        if (!userExist) {
            // res.status(400).json({ message: "User does not exist" })
            return Response.json({ message: "User does not exist" }, { status: 400 })
        }

        if (userExist.isBlocked) {
            return Response.json(
                { message: "User is blocked" },
                { status: 403 }
            );
        }

        const user = userExist as any;
        const isValidPassword = await user.comparePassword(password);
        const token = await user.generateAuthToken();
        if (isValidPassword) {
            return Response.json({ message: "Login successful", token, user_id: userExist._id.toString() }, { status: 200 })
        }
        else {
            return Response.json({ message: "Invalid password" }, { status: 400 })
        }


    } catch (error) {
        console.log("LOGIN ERROR 👉", error);
        return Response.json({ message: "Internal server error" }, { status: 500 })
    }
}