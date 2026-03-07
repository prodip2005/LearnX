import { getCollection } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const body = await request.json();
        const { email, name, image } = body;

        // সরাসরি কালেকশন ইম্পোর্ট করুন
        const usersCollection = await getCollection("users");

        // চেক করা ইউজার আগে থেকে আছে কি না
        const existingUser = await usersCollection.findOne({ email });

        if (existingUser) {
            return NextResponse.json({ message: "User already exists" }, { status: 200 });
        }

        // নতুন ইউজার ডাটা
        const newUser = {
            name,
            email,
            image: image || "",
            role: "user",
            createdAt: new Date(),
        };

        const result = await usersCollection.insertOne(newUser);
        return NextResponse.json({ success: true, ...result }, { status: 201 });

    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const email = searchParams.get("email");

        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        // হেল্পার ফাংশন ব্যবহার করে কালেকশন কল
        const usersCollection = await getCollection("users");
        const user = await usersCollection.findOne({ email });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json(user, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}