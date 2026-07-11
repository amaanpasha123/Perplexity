import type { NextFunction, Request, Response } from "express";
import { createSupabaseClient } from "./client";
import { prisma } from "./db";

const client = createSupabaseClient();

// Extend Express's Request type to include our custom `userId` field
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export async function middleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const token = (req.headers as any).authorization;
  // Checking if user is valid or not over here from the supabase
  const data = await client.auth.getUser(token);
  const userId = data?.data?.user?.id; // adjust based on actual shape of `data`

  if (userId) {
    console.log(JSON.stringify(data));
    try {
      await prisma.user.create({
        data: {
          id : data.data.user?.id,
          supabaseId : data.data.user?.id!,
          email: data.data.user?.email!,
          provider:
            data.data.user?.app_metadata.provider === "google"
              ? "Google"
              : "Github",
          name: data.data.user?.user_metadata.full_name,
        },
      });

    }catch(e) {
      console.log(e);
    }

    req.userId = userId;
    next();
  } else {
    res.status(403).json({
      message: "Incorrect Inputs",
    });
  }
}
