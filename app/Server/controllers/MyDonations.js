import DonorBloodDonationexport from "../models/DonorBlooddonation.js";

const DONATION_GAP_DAYS = 90; // eligible to donate again after 90 days

const MyDonations = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Please login first." });
    }

    const history = await DonorBloodDonationexport.find({
      UserIdinf: user._id,
    }).sort({ createdAt: -1 });

    const totalDonations = history.length;

    // "Registerday" is the date they registered/scheduled to donate — use
    // the most recent one as the last donation reference point.
    const mostRecent = history[0] || null;
    const lastDonationDate = mostRecent ? mostRecent.Registerday : null;

    let nextEligibleDate = null;
    let daysUntilEligible = 0;
    let eligibleNow = true;

    if (lastDonationDate) {
      const last = new Date(lastDonationDate);
      if (!isNaN(last.getTime())) {
        const next = new Date(last);
        next.setDate(next.getDate() + DONATION_GAP_DAYS);
        nextEligibleDate = next;

        const now = new Date();
        const diffMs = next.getTime() - now.getTime();
        daysUntilEligible = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
        eligibleNow = diffMs <= 0;
      }
    }

    return res.status(200).json({
      success: true,
      stats: {
        totalDonations,
        livesImpacted: totalDonations * 3,
        lastDonationDate,
        nextEligibleDate,
        daysUntilEligible,
        eligibleNow,
      },
      history,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to fetch donation history." });
  }
};

export default MyDonations;
