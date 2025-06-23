import { Router, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { authenticate } from "../middleware/auth";

const router = Router();
const prisma = new PrismaClient();

// Register
// @ts-ignore
router.post("/register", async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const { email, password, name } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Email and password are required",
      });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: "User already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    // Generate token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        token,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to register user",
    });
  }
});

// Login
// @ts-ignore
router.post("/login", async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Email and password are required",
      });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Invalid credentials",
      });
    }

    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({
        success: false,
        error: "Invalid credentials",
      });
    }

    // Generate token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        token,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to login",
    });
  }
});

// Get current user profile
// @ts-ignore
router.get("/profile", authenticate, async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      // @ts-ignore
      where: { id: req.userId },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        _count: {
          select: { urls: true },
        },
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Profile error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to get profile",
    });
  }
});

// Update profile
// @ts-ignore
router.put("/profile", authenticate, async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const { name } = req.body;

    const user = await prisma.user.update({
      // @ts-ignore
      where: { id: req.userId },
      data: { name },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update profile",
    });
  }
});

// Change password
router.put(
  "/change-password",
  // @ts-ignore
  authenticate,
  // @ts-ignore
  async (req: Request, res: Response) => {
    try {
      // @ts-ignore
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          error: "Current and new passwords are required",
        });
      }

      // Get user with password
      const user = await prisma.user.findUnique({
        // @ts-ignore
        where: { id: req.userId },
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          error: "User not found",
        });
      }

      // Verify current password
      const validPassword = await bcrypt.compare(
        currentPassword,
        user.password,
      );
      if (!validPassword) {
        return res.status(401).json({
          success: false,
          error: "Current password is incorrect",
        });
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update password
      await prisma.user.update({
        // @ts-ignore
        where: { id: req.userId },
        data: { password: hashedPassword },
      });

      res.json({
        success: true,
        message: "Password changed successfully",
      });
    } catch (error) {
      console.error("Change password error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to change password",
      });
    }
  },
);

export default router;
