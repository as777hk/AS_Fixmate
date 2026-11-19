import { Router } from "express";
import { timingSafeEqual } from "node:crypto";
import { runSeed } from "../../scripts/seed.js";

const router = Router();
let alreadyRan = false;

router.get("/seed-once", async (req, res) => {
  const expected = process.env.FIXMATE_SEED_TOKEN || "";
  const supplied = String(req.query.token || "");
  const expectedBuffer = Buffer.from(expected);
  const suppliedBuffer = Buffer.from(supplied);
  const valid = expected.length >= 40 &&
    expectedBuffer.length === suppliedBuffer.length &&
    timingSafeEqual(expectedBuffer, suppliedBuffer);

  if (!valid) return res.status(404).json({ success: false, message: "Not found." });
  if (alreadyRan) return res.status(409).json({ success: false, message: "Seed has already run in this instance." });
  alreadyRan = true;

  try {
    const result = await runSeed();
    return res.json(result);
  } catch (error) {
    alreadyRan = false;
    console.error("FixMate one-time seed failed:", error);
    return res.status(500).json({ success: false, message: "Seed failed. Check server runtime logs." });
  }
});

export default router;
