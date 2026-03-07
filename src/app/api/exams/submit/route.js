import { getCollection } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const { roomCode, studentAnswers, studentEmail, studentName } = await request.json();

        const examsCollection = await getCollection("questions");
        const resultsCollection = await getCollection("results");

        // ডাটাবেস থেকে আসল উত্তরসহ এক্সাম ডাটা আনা
        const exam = await examsCollection.findOne({ roomCode: roomCode });

        if (!exam) return NextResponse.json({ success: false, message: "Exam room not found" }, { status: 404 });

        // সঠিক উত্তরের সাথে স্টুডেন্টের উত্তরের তুলনা (Mark calculation)
        let totalMark = 0;
        exam.questions.forEach((q) => {
            if (studentAnswers[q.id] === q.correctAnswer) {
                totalMark += 1;
            }
        });

        // রেজাল্ট অবজেক্ট তৈরি
        const resultDoc = {
            studentName,
            studentEmail,
            examSubject: exam.roomTitle,
            teacherEmail: exam.teacherEmail,
            roomCode,
            totalMark,
            totalQuestions: exam.questions.length,
            submittedAt: new Date()
        };

        // ডাটাবেসে সেভ করা
        await resultsCollection.insertOne(resultDoc);

        return NextResponse.json({
            success: true,
            score: totalMark,
            total: exam.questions.length
        });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}