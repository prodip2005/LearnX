import { getCollection } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

// ১. GET মেথড (একই থাকবে)
export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const email = searchParams.get("email");
        const studentCollection = await getCollection("students");

        if (email) {
            const student = await studentCollection.findOne({ email });
            return NextResponse.json({ success: true, exists: !!student, data: student });
        }

        const students = await studentCollection.find({}).sort({ appliedAt: -1 }).toArray();
        return NextResponse.json({ success: true, data: students });
    } catch (error) {
        return NextResponse.json({ success: false }, { status: 500 });
    }
}

// ২. PATCH মেথড (Accept করার জন্য - একই থাকবে)
export async function PATCH(req) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        const studentCollection = await getCollection("students");
        const usersCollection = await getCollection("users");

        const studentRecord = await studentCollection.findOne({ _id: new ObjectId(id) });
        if (!studentRecord) return NextResponse.json({ success: false }, { status: 404 });

        await studentCollection.updateOne({ _id: new ObjectId(id) }, { $set: { status: true } });
        await usersCollection.updateOne({ email: studentRecord.email }, { $set: { role: "student" } });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ success: false }, { status: 500 });
    }
}

// ৩. DELETE মেথড (রিমুভ করার সময় রোল 'user' করে দিবে)
export async function DELETE(req) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        const studentCollection = await getCollection("students");
        const usersCollection = await getCollection("users");

        // ডিলিট করার আগে ওই স্টুডেন্টের ইমেইলটি সংগ্রহ করি
        const studentRecord = await studentCollection.findOne({ _id: new ObjectId(id) });

        if (studentRecord) {
            // ক) users কালেকশনে তার রোল আবার 'user' করে দেওয়া হচ্ছে
            await usersCollection.updateOne(
                { email: studentRecord.email },
                { $set: { role: "user" } }
            );

            // খ) students কালেকশন থেকে তার আবেদন বা রেকর্ড ডিলিট করা হচ্ছে
            await studentCollection.deleteOne({ _id: new ObjectId(id) });

            return NextResponse.json({ success: true, message: "Student removed and role demoted to user" });
        }

        return NextResponse.json({ success: false, message: "Student not found" }, { status: 404 });
    } catch (error) {
        return NextResponse.json({ success: false }, { status: 500 });
    }
}