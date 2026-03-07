import { getCollection, getDb } from "@/lib/mongodb";
import { NextResponse } from "next/server";

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

export async function GET(request) {
    try {
        const db = await getDb();
        const examsCollection = db.collection("questions");

        // URL থেকে রুম কোড চেক করা (যেমন: /api/exams/create?code=123456)
        const { searchParams } = new URL(request.url);
        const code = searchParams.get("code");

        if (code) {
            // ১. নির্দিষ্ট রুম কোড অনুযায়ী ডাটা খোঁজা
            const exam = await examsCollection.findOne({ roomCode: code });

            if (!exam) {
                return NextResponse.json({ success: false, message: "Invalid Room Code" }, { status: 404 });
            }

            // সিকিউরিটির জন্য স্টুডেন্টকে correctAnswer পাঠানো যাবে না
            const safeQuestions = exam.questions.map(({ correctAnswer, ...rest }) => rest);
            return NextResponse.json({ success: true, exam: { ...exam, questions: safeQuestions } });
        }

        // ২. যদি কোড না থাকে, তবে সব এক্সাম রিটার্ন করবে (টিচারের জন্য)
        const exams = await examsCollection.find({}).sort({ createdAt: -1 }).toArray();
        return NextResponse.json({ success: true, data: exams });

    } catch (e) {
        return NextResponse.json({ success: false, error: e.message }, { status: 500 });
    }
}