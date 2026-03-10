import { getCollection, getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

// ১. এক্সাম ক্রিয়েট করা
export async function POST(request) {
    try {
        const body = await request.json();
        const examsCollection = await getCollection("questions");
        const result = await examsCollection.insertOne({
            ...body,
            createdAt: new Date(),
        });
        return NextResponse.json({ success: true, message: "Room created successfully", id: result.insertedId });
    } catch (e) {
        return NextResponse.json({ success: false, error: "Failed to create exam room" }, { status: 500 });
    }
}

// ২. এক্সাম রিড করা (কোড দিয়ে অথবা টিচার ইমেইল দিয়ে)
export async function GET(request) {
    try {
        const examsCollection = await getCollection("questions");
        const { searchParams } = new URL(request.url);

        const code = searchParams.get("code");
        const email = searchParams.get("email"); // টিচার ইমেইল ফিল্টার

        // ক. যদি রুম কোড থাকে (স্টুডেন্টের জন্য)
        if (code) {
            const exam = await examsCollection.findOne({ roomCode: code });
            if (!exam) {
                return NextResponse.json({ success: false, message: "Invalid Room Code" }, { status: 404 });
            }
            const safeQuestions = exam.questions.map(({ correctAnswer, ...rest }) => rest);
            return NextResponse.json({ success: true, exam: { ...exam, questions: safeQuestions } });
        }

        // খ. যদি টিচার ইমেইল থাকে (টিচারের ড্যাশবোর্ডের জন্য)
        if (email) {
            const exams = await examsCollection.find({ teacherEmail: email }).sort({ createdAt: -1 }).toArray();
            return NextResponse.json({ success: true, data: exams });
        }

        // গ. ডিফল্ট: সব এক্সাম (যদি প্রয়োজন হয়)
        const exams = await examsCollection.find({}).sort({ createdAt: -1 }).toArray();
        return NextResponse.json({ success: true, data: exams });

    } catch (e) {
        return NextResponse.json({ success: false, error: e.message }, { status: 500 });
    }
}

// ৩. এক্সাম ডিলিট করা
export async function DELETE(request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ success: false, message: "ID is required" }, { status: 400 });
        }

        const examsCollection = await getCollection("questions");
        const result = await examsCollection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 1) {
            return NextResponse.json({ success: true, message: "Exam deleted successfully" });
        } else {
            return NextResponse.json({ success: false, message: "Exam not found" }, { status: 404 });
        }
    } catch (e) {
        return NextResponse.json({ success: false, error: e.message }, { status: 500 });
    }
}