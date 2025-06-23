import { Request as OriginalRequest } from "express";

declare global {
  declare interface Request extends OriginalRequest {
    userId?: string;
  }
}
