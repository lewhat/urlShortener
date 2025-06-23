import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// @ts-ignore
export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // @ts-ignore
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      error: "No authentication token provided",
    });
  }

  const token = authHeader.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({
      success: false,
      error: "Invalid authentication format",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };
    // @ts-ignore
    req.userId = decoded.userId;
    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        success: false,
        error: "Token expired",
      });
    }

    res.status(401).json({
      success: false,
      error: "Invalid token",
    });
  }
};

export const optionalAuth = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  try {
    // @ts-ignore
    const authHeader = req.header("Authorization");

    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");

      if (token) {
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
            userId: string;
          };
          // @ts-ignore
          req.userId = decoded.userId;
        } catch (error) {
          console.log("Optional auth: Invalid token provided");
        }
      }
    }

    next();
  } catch (error) {
    next();
  }
};
