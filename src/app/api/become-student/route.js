import { getCollection } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const body = await req.json();

        // কালেকশন রেফারেন্স নেওয়া
        const studentCollection = await getCollection("students");

        // ডাটাবেজে ইনসার্ট করার জন্য অবজেক্ট তৈরি
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

        // ডাটাবেজে সেভ করা
        const result = await studentCollection.insertOne(newStudentApplication);

        if (result.insertedId) {
            return NextResponse.json({
                success: true,
                message: "Application submitted successfully"
            }, { status: 201 });
        } else {
            return NextResponse.json({
                success: false,
                message: "Failed to submit application"
            }, { status: 400 });
        }

    } catch (error) {
        console.error("Database Error:", error);
        return NextResponse.json({
            success: false,
            message: "Internal Server Error"
        }, { status: 500 });
    }
}