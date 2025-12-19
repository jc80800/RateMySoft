
import { NextResponse } from 'next/server'



export async function GET(req: Request) {
    //TODO: Call backend API

    return NextResponse.json(
        { categories: ["Backend", "Frontend", "CI/CD", "Database"] },
        { status: 200 }
    )
}
