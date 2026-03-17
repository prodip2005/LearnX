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
        const resultsCollection = await getCollection("results");
        const { searchParams } = new URL(request.url);

        const code = searchParams.get("code");
        const email = searchParams.get("email");
        const studentEmail = searchParams.get("studentEmail");

        // স্টুডেন্ট যখন রুম কোড দিয়ে জয়েন করার চেষ্টা করবে
        if (code) {
            const exam = await examsCollection.findOne({ roomCode: code });

            // ১. রুম কোড ভুল হলে
            if (!exam) {
                return NextResponse.json({ success: false, message: "Invalid Room Code" }, { status: 404 });
            }

            // ২. রুম যদি টিচার এক্টিভেট না করে (exam: false)
            // আপনার এরর ৪0৩ এখান থেকেই আসছে। টিচারকে বলুন ড্যাশবোর্ড থেকে Start Exam দিতে।
            if (exam.exam === false || exam.exam === undefined) {
                return NextResponse.json({
                    success: false,
                    message: "This room is currently inactive. Please wait for your teacher to start the exam."
                }, { status: 403 });
            }

            // ৩. স্টুডেন্ট আগে পরীক্ষা দিয়েছে কি না চেক করা
            if (studentEmail) {
                const alreadySubmitted = await resultsCollection.findOne({
                    roomCode: code,
                    studentEmail: studentEmail
                });
                if (alreadySubmitted) {
                    return NextResponse.json({
                        success: false,
                        message: "Access Denied! You have already submitted this exam once."
                    }, { status: 400 });
                }
            }

            // সব ঠিক থাকলে প্রশ্ন পাঠানো (উত্তর ছাড়া)
            const safeQuestions = exam.questions.map(({ correctAnswer, ...rest }) => rest);
            return NextResponse.json({
                success: true,
                exam: { ...exam, questions: safeQuestions }
            });
        }

        // টিচারের জন্য ইমেইল ফিল্টার
        if (email) {
            const exams = await examsCollection.find({ teacherEmail: email }).sort({ createdAt: -1 }).toArray();
            return NextResponse.json({ success: true, data: exams });
        }

        const exams = await examsCollection.find({}).sort({ createdAt: -1 }).toArray();
        return NextResponse.json({ success: true, data: exams });

    } catch (e) {
        return NextResponse.json({ success: false, error: e.message }, { status: 500 });
    }
}

// ৩. এক্সাম ডিলিট করা
// আপনার বর্তমান DELETE মেথডটি এভাবে আপডেট করুন
// আপনার এপিআই এর DELETE মেথডটি নিচের মতো হবে
export async function DELETE(request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");
        const deleteAll = searchParams.get("all"); // 'all' প্যারামিটার চেক

        const examsCollection = await getCollection("questions");
        const resultsCollection = await getCollection("results");

        // ১. সব ডিলিট করার লজিক
        if (deleteAll === "true") {
            await examsCollection.deleteMany({});
            await resultsCollection.deleteMany({});
            return NextResponse.json({ success: true, message: "All records cleared!" });
        }

        // ২. সিঙ্গেল ডিলিট লজিক
        if (!id) return NextResponse.json({ success: false, message: "ID required" }, { status: 400 });

        const result = await examsCollection.deleteOne({ _id: new ObjectId(id) });
        return NextResponse.json({ success: true, message: "Exam deleted" });

    } catch (e) {
        return NextResponse.json({ success: false, error: e.message }, { status: 500 });
    }
}



// ৪. এক্সাম স্ট্যাটাস আপডেট করা (Toggle exam: true/false)
export async function PATCH(request) {
    try {
        const body = await request.json();
        const { id, exam } = body; // ফ্রন্টএন্ড থেকে id এবং নতুন status (true/false) পাঠানো হবে

        if (!id) {
            return NextResponse.json({ success: false, message: "ID is required" }, { status: 400 });
        }

        const examsCollection = await getCollection("questions");
        const result = await examsCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: { exam: exam } } // ডাটাবেসে exam ফিল্ডটি আপডেট করবে
        );

        if (result.matchedCount === 1) {
            return NextResponse.json({ success: true, message: "Status updated successfully" });
        } else {
            return NextResponse.json({ success: false, message: "Exam not found" }, { status: 404 });
        }
    } catch (e) {
        return NextResponse.json({ success: false, error: e.message }, { status: 500 });
    }
}