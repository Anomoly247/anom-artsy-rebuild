import { Request, Response, Express } from "express";
import { getDb } from "../db";
import { sql } from "drizzle-orm";

export function registerTextColorFix(app: Express) {
  app.get("/api/fix-colors", async (req: Request, res: Response) => {
    try {
      const db = await getDb();
      
      // Execute a direct SQL rewrite to change the text tracking values to a bright readable color
      await db.execute(sql`
        UPDATE platform_settings 
        SET primary_color = '#00eaff', 
            secondary_color = '#ff00c8', 
            accent_color = '#e8e8ee'
      `);
      
      res.send("<h1>✓ Neon text colors updated inside the database!</h1><p>Go back to http://localhost:3000 and refresh.</p>");
    } catch (error) {
      console.error("Color fix failed:", error);
      res.status(500).send(`Error updating database: ${error}`);
    }
  });
}
