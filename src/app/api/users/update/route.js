import { getCollection } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function PUT(request) {
    try {
        const body = await request.json();
        const { email, name, image, phone, institution, department, currentClass, address } = body;

        const usersCollection = await getCollection("users");
        const studentsCollection = await getCollection("students");

        // ১. Users কালেকশন আপডেট
        const userUpdateDoc = {
            $set: {
                name,
                image,
                phone,
                institution,
                department,
                address,
                updatedAt: new Date()
            }
        };
        await usersCollection.updateOne({ email }, userUpdateDoc);

        // ২. যদি ইউজার স্টুডেন্ট হয়, তবে Students কালেকশন আপডেট
        const currentUser = await usersCollection.findOne({ email });
        if (currentUser?.role === "student") {
            const studentUpdateDoc = {
                $set: {
                    fullName: name,
                    institution,
                    department,
                    currentClass,
                    phone,
                    updatedAt: new Date()
                }
            };
            await studentsCollection.updateOne({ email }, studentUpdateDoc);
        }

        return NextResponse.json({ success: true, message: "Profile updated successfully" });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}