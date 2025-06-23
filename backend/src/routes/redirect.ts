import { Router, Response } from "express";
import { UrlService } from "../services/urlService";

const router = Router();

// @ts-ignore
router.get("/:slug", async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const { slug } = req.params;
    const url = await UrlService.getUrlBySlug(slug);

    if (!url) {
      return res.status(404).send(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>404 - Not Found</title>
            <style>
              body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
              h1 { color: #333; }
              p { color: #666; }
            </style>
          </head>
          <body>
            <h1>404 - Not Found</h1>
            <p>The short URL you're looking for doesn't exist.</p>
          </body>
        </html>
      `);
    }

    // Record visit
    await UrlService.recordVisit(
      // @ts-ignore
      url.id,
      // @ts-ignore
      req.ip,
      // @ts-ignore
      req.get("user-agent"),
      // @ts-ignore
      req.get("referer"),
    );

    res.redirect(302, url.originalUrl);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

export default router;
