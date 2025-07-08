const Visitor = require("../models/Visitor");

// Utility for counting unique visitors (by IP)
const getUniqueVisitors = async () => {
  const uniques = await Visitor.distinct("ipAddress");
  return uniques.length;
};

exports.addVisitor = async (req, res) => {
  try {
    // Get IP (use x-forwarded-for for proxies)
    const ip =
      req.headers["x-forwarded-for"] ||
      req.socket.remoteAddress ||
      "";
    const { page, country, city, device, browser, sessionDuration } = req.body;
    const userAgent = req.headers["user-agent"] || "";

    const visitor = await Visitor.create({
      ipAddress: ip,
      userAgent,
      page,
      country,
      city,
      device,
      browser,
      sessionDuration,
    });

    res.status(201).json({ success: true, visitor });
  } catch (err) {
    res.status(500).json({ success: false, error: err });
  }
};

exports.getVisitors = async (req, res) => {
  try {
    // Fetch recent visitors (limit to latest 100 for dashboard)
    const visitors = await Visitor.find({}).sort({ visitedAt: -1 }).limit(100);
    res.json({ visitors });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

exports.getVisitorStats = async (req, res) => {
  try {
    const total = await Visitor.countDocuments();
    const unique = await getUniqueVisitors();
    res.json({ total, unique });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
