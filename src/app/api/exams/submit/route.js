import { getCollection } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const { roomCode, studentAnswers, studentEmail, studentName, questionID } = await request.json();

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
            questionID,
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



// আপনার বর্তমান POST মেথডের নিচে এটি যোগ করুন
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const email = searchParams.get("email"); // স্টুডেন্ট ইমেইল
        const teacherEmail = searchParams.get("teacherEmail"); // টিচার ইমেইল

        const resultsCollection = await getCollection("results");

        let query = {};
        if (email) query.studentEmail = email;
        if (teacherEmail) query.teacherEmail = teacherEmail;

        const results = await resultsCollection.find(query).sort({ submittedAt: -1 }).toArray();

        return NextResponse.json({ success: true, data: results });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}




// আপনার বিদ্যমান GET মেথডের নিচে এটি যোগ করুন
export async function DELETE(request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");
        const deleteAll = searchParams.get("all");

        const resultsCollection = await getCollection("results");

        // সব রেজাল্ট ডিলিট করার জন্য
        if (deleteAll === "true") {
            await resultsCollection.deleteMany({});
            return NextResponse.json({ success: true, message: "All results cleared" });
        }

        // সিঙ্গেল রেজাল্ট ডিলিট করার জন্য
        if (!id) return NextResponse.json({ success: false, message: "ID is required" }, { status: 400 });

        await resultsCollection.deleteOne({ _id: new ObjectId(id) });
        return NextResponse.json({ success: true, message: "Result deleted successfully" });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}