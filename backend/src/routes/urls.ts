import { Router, Response } from "express";
import { authenticate, optionalAuth } from "../middleware/auth";
import { UrlService } from "../services/urlService";
import { isValidUrl, isValidSlug, sanitizeSlug } from "../utils/validation";
import { AppError } from "../utils/errorHandler";

const router = Router();

// Create short URL
// @ts-ignore
router.post("/", optionalAuth, async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const { url, customSlug } = req.body;
    // @ts-ignore
    const userId = req.userId;

    if (!url || !isValidUrl(url)) {
      throw new AppError("Please provide a valid URL", 400);
    }

    if (customSlug) {
      const sanitizedSlug = sanitizeSlug(customSlug);
      if (!isValidSlug(sanitizedSlug)) {
        throw new AppError(
          "Invalid slug format. Use only letters, numbers, hyphens, and underscores (3-50 characters)",
          400,
        );
      }
    }

    const shortUrl = await UrlService.createShortUrl(url, userId, customSlug);

    res.json({
      success: true,
      data: {
        id: shortUrl.id,
        originalUrl: shortUrl.originalUrl,
        // @ts-ignore
        shortUrl: `${process.env.BASE_URL}/${shortUrl.slug}`,
        // @ts-ignore
        slug: shortUrl.slug,
      },
    });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Get user's URLs
// @ts-ignore
router.get("/my-urls", authenticate, async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const urls = await UrlService.getUserUrls(req.userId!);
    res.json({ success: true, data: urls });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update URL slug
// @ts-ignore
router.put("/:id/slug", authenticate, async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const { newSlug } = req.body;
    if (!newSlug || !isValidSlug(sanitizeSlug(newSlug))) {
      throw new AppError("Invalid slug format", 400);
    }

    const updated = await UrlService.updateSlug(
      // @ts-ignore
      req.params.id,
      // @ts-ignore
      req.userId!,
      newSlug,
    );
    res.json({ success: true, data: updated });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Get URL statistics
// @ts-ignore
router.get("/stats", authenticate, async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const stats = await UrlService.getUrlStats(req.userId!);
    res.json({ success: true, data: stats });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
