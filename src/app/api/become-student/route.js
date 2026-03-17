import { getCollection } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const body = await req.json();

        // কালেকশন রেফারেন্স নেওয়া
        const studentCollection = await getCollection("students");

        // ১. চেক করা: এই ইমেইল দিয়ে কি অলরেডি কোনো রিকোয়েস্ট পেন্ডিং বা এক্সেপ্টেড আছে?
        const existingApplication = await studentCollection.findOne({ email: body.email });

        if (existingApplication) {
            return NextResponse.json({
                success: false,
                message: "You have already submitted an application!"
            }, { status: 400 });
        }

        // ২. নতুন ডাটাবেজ অবজেক্ট
        const newStudentApplication = {
            fullName: body.fullName,
            institution: body.institution,
            currentClass: body.currentClass,
            department: body.department,
            phone: body.phone,
            email: body.email,
            status: false, // ডিফল্ট স্ট্যাটাস false
            role: "student",
            appliedAt: new Date(),
        };

        const result = await studentCollection.insertOne(newStudentApplication);

        if (result.insertedId) {
            return NextResponse.json({
                success: true,
                message: "Application submitted successfully"
            }, { status: 201 });
        }

    } catch (error) {
        console.error("Database Error:", error);
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
}