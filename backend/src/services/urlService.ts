import { PrismaClient } from "@prisma/client";
import { nanoid } from "nanoid";

const prisma = new PrismaClient();

export class UrlService {
  static async createShortUrl(
    originalUrl: string,
    userId?: string,
    customSlug?: string,
  ) {
    // url validation
    try {
      new URL(originalUrl);
    } catch (err) {
      throw new Error("Invalid URL");
    }

    // check custom slug exists
    if (customSlug) {
      const existing = await prisma.url.findUnique({
        // @ts-ignore
        where: { slug: customSlug },
      });
      if (existing) {
        throw new Error("Slug already in use");
      }
    }

    let slug = customSlug || nanoid(6);

    const url = await prisma.url.create({
      data: {
        originalUrl,
        slug,
        // @ts-ignore
        userId,
      },
    });

    return url;
  }

  static async getUrlBySlug(slug: string) {
    return prisma.url.findUnique({
      // @ts-ignore
      where: { slug },
      include: {
        _count: {
          // @ts-ignore
          select: { visits: true },
        },
      },
    });
  }

  static async getUserUrls(userId: string) {
    return prisma.url.findMany({
      // @ts-ignore
      where: { userId },
      include: {
        _count: {
          // @ts-ignore
          select: { visits: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  static async updateSlug(urlId: string, userId: string, newSlug: string) {
    // check if user owns url
    const url = await prisma.url.findFirst({
      // @ts-ignore
      where: { id: urlId, userId },
    });

    if (!url) {
      throw new Error("URL not found or not authorized");
    }

    // check if slug exists   TODO: put this into a module
    // @ts-ignore
    const existing = await prisma.url.findUnique({ where: { slug: newSlug } });
    // @ts-ignore
    if (existing && existing.id !== urlId) {
      throw new Error("Slug already in use");
    }

    return prisma.url.update({
      // @ts-ignore
      where: { id: urlId },
      // @ts-ignore
      data: { slug: newSlug },
    });
  }

  static async recordVisit(
    urlId: string,
    ipAddress?: string,
    userAgent?: string,
    referer?: string,
  ) {
    // @ts-ignore
    return prisma.visit.create({
      data: {
        urlId,
        ipAddress,
        userAgent,
        referer,
      },
    });
  }

  static async getUrlStats(userId: string) {
    const urls = await prisma.url.findMany({
      // @ts-ignore
      where: { userId },
      include: {
        // @ts-ignore
        visits: {
          select: {
            createdAt: true,
          },
        },
      },
    });

    return urls.map((url: any) => ({
      id: url.id,
      originalUrl: url.originalUrl,
      slug: url.slug,
      totalVisits: url.visits.length,
      createdAt: url.createdAt,
      visits: url.visits,
    }));
  }
}
