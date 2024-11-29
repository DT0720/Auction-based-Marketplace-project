import { NextResponse } from 'next/server';

// Handle POST requests for signupa
export async function POST(req: Request) {
  try {
    const success = true;

    console.log("Job is running");

    return NextResponse.json(
      { message: success ? 'User created successfully' : 'Failed to create user' },
      { status: success ? 201 : 400 }
    );

  } catch (error: any) {
      console.log(error.message);
      return NextResponse.json(
        { message: 'Failed to create user' },
        { status: 400 }
      );
  }
}
