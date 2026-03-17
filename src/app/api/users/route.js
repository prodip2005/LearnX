import { getCollection } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const body = await request.json();
        const { email, name, image } = body;
        const usersCollection = await getCollection("users");

        const existingUser = await usersCollection.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ message: "User already exists" }, { status: 200 });
        }

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
        const role = searchParams.get("role"); // নতুন প্যারামিটার যোগ করা হলো

        const usersCollection = await getCollection("users");

        // ১. যদি ইমেইল দিয়ে খোঁজা হয় (নির্দিষ্ট ইউজারের জন্য)
        if (email) {
            const user = await usersCollection.findOne({ email });
            if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
            return NextResponse.json(user, { status: 200 });
        }

        // ২. যদি রোল দিয়ে ফিল্টার করা হয় (যেমন: role=teacher)
        if (role) {
            const users = await usersCollection.find({ role: role }).toArray();
            return NextResponse.json(users, { status: 200 });
        }

        // ৩. কোনো প্যারামিটার না থাকলে সব ইউজার রিটার্ন করবে
        const allUsers = await usersCollection.find({}).toArray();
        return NextResponse.json(allUsers, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}


export async function PATCH(request) {
    try {
        const { id, role } = await request.json();
        const usersCollection = await getCollection("users");

        const result = await usersCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: { role: role } }
        );

        return NextResponse.json({ success: true, message: "Role updated" });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// ৪. ইউজার রিমুভ করার জন্য (DELETE)
export async function DELETE(request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");
        const usersCollection = await getCollection("users");

        const result = await usersCollection.deleteOne({ _id: new ObjectId(id) });
        return NextResponse.json({ success: true, message: "User removed" });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}