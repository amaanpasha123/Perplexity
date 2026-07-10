import type { NextFunction } from "express";
import { createSupabaseClient } from "./client";

const client = createSupabaseClient();

export function middleware(req: Request, res: Response, next: NextFunction) {
  const token = (req.headers as any).authorization;
  // Checking if user is valid or not over here from the supabase
  client.auth.getUser(token);
  
}
