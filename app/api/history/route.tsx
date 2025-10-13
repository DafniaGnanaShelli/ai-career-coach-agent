import { NextResponse } from "next/server";
import { db } from "@/configs/db";
import { HistoryTable } from "@/configs/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq, desc } from "drizzle-orm";
export async function POST(request: any) {
    const { content, recordId, aiAgentType } = await request.json();
    const user = await currentUser();
    try {
        const result = await db.insert(HistoryTable).values({
            recordId: recordId,
            content: content,
            userEmail: user?.primaryEmailAddress?.emailAddress,
            createdAt: new Date().toISOString(),
            aiAgentType: aiAgentType
        });
        return NextResponse.json(result);
    } catch (error) {
        console.error("Error inserting history record:", error);
        return NextResponse.json("Error inserting history record", { status: 500 });
    }
}
export async function PUT(request: any) {
    const { content, recordId } = await request.json();
    try {
        const result = await db.update(HistoryTable).set({
            content: content
        }).where(eq(HistoryTable.recordId, recordId));
        return NextResponse.json(result);
    } catch (error) {
        console.error("Error inserting history record:", error);
        return NextResponse.json("Error inserting history record", { status: 500 });
    }
}

export async function GET(request: any) {
    const { searchParams } = new URL(request.url);
    const user = await currentUser();
    const recordId = searchParams.get('recordId');
    try {

        if (recordId) {
            const result = await db.select().from(HistoryTable)
                .where(eq(HistoryTable.recordId, recordId));
            return NextResponse.json(result[0]);
        }
        else {
            const result = await db.select().from(HistoryTable)
                .where(eq(HistoryTable.userEmail, user?.primaryEmailAddress?.emailAddress ?? ""))
                .orderBy(desc(HistoryTable.id));
            return NextResponse.json(result);
        }
        return NextResponse.json({});
    }
    catch (error) {
        return NextResponse.json("Error getting history record" + error);
    }
}