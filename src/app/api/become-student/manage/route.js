import { getCollection } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

// ১. সকল স্টুডেন্ট ডাটা পাওয়ার জন্য
export async function GET() {
    try {
        const studentCollection = await getCollection("students");
        const students = await studentCollection.find({}).sort({ appliedAt: -1 }).toArray();
        return NextResponse.json({ success: true, data: students });
    } catch (error) {
        return NextResponse.json({ success: false }, { status: 500 });
    }
}

// ২. স্ট্যাটাস আপডেট করার জন্য (Accept)
export async function PATCH(req) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        const studentCollection = await getCollection("students");

        const result = await studentCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: { status: true } }
        );

        return NextResponse.json({ success: true, result });
    } catch (error) {
        return NextResponse.json({ success: false }, { status: 500 });
    }
}

// ৩. ডিলিট করার জন্য (Reject/Remove)
export async function DELETE(req) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        const studentCollection = await getCollection("students");

        const result = await studentCollection.deleteOne({ _id: new ObjectId(id) });

        return NextResponse.json({ success: true, result });
    } catch (error) {
        return NextResponse.json({ success: false }, { status: 500 });
    }
}