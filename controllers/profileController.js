const Profile = require("../models/Profile");
const User = require("../models/User");
const Job = require("../models/Job");
const mongoose = require("mongoose");

// Complete profile dynamically
exports.completeProfile = async (req, res) => {
  try {
    const {
      userId,
      dob,
      gender,
      postalCode,
      nricNumber,
      finNumber,
      studentIdNumber,
      schoolName,
      plocExpiryDate,
    } = req.body;

    const user = await User.findById(userId).populate('profileId');
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Fetch or create a new profile
    let profile = user.profileId;
    if (!profile) {
      profile = new Profile({ userId });
    }

    // Update common fields
    profile.dob = dob;
    profile.gender = gender;
    profile.postalCode = postalCode;

    // Update fields based on employment status
    switch (user.employmentStatus) {
      case 'Singaporean/PR':
        profile.nricNumber = nricNumber;
        profile.nricImages = {
          front: req.files?.nricFront?.[0]?.path || null,
          back: req.files?.nricBack?.[0]?.path || null,
        };
        break;
      case 'LTVP':
        profile.finNumber = finNumber;
        profile.finImages = {
          front: req.files?.finFront?.[0]?.path || null,
          back: req.files?.finBack?.[0]?.path || null,
        };
        profile.plocImage = req.files?.plocImage?.[0]?.path || null;
        profile.plocExpiryDate = plocExpiryDate;
        break;
      case 'Student':
        profile.studentIdNumber = studentIdNumber;
        profile.schoolName = schoolName;
        profile.studentCardImage = req.files?.studentCard?.[0]?.path || null;
        break;
      default:
        break;
    }

    // Update the selfie/profile picture if uploaded
    if (req.files?.selfie?.[0]?.path) {
      user.profilePicture = req.files.selfie[0].path;
    }
    await profile.save();

    // Link profile to the user if not already linked
    if (!user.profileId) {
      user.profileId = profile._id;
    }

    await user.save();

    res.status(200).json({
      message: 'Profile completed successfully.',
      profile,
      profilePicture: user.profilePicture,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to complete profile.', details: error.message });
  }
};


exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).populate('profileId');
    if (!user) return res.status(404).json({ error: "User not found." });

    const profile = user.profileId;
    if (!profile) return res.status(404).json({ error: "Profile not found." });

    res.status(200).json({
      profile,
      profilePicture: user.profilePicture,
      fullName: user.fullName,
      phoneNumber: user.phoneNumber,
      email: user.email,
      employmentStatus: user.employmentStatus,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch profile.", details: err.message });
  }
};


exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const updates = req.body;

    const user = await User.findById(userId).populate('profileId');
    if (!user) return res.status(404).json({ error: "User not found." });

    let profile = user.profileId;
    if (!profile) {
      profile = new Profile({ userId });
    }

    // Update common fields
    if (updates.dob) profile.dob = updates.dob;
    if (updates.gender) profile.gender = updates.gender;
    if (updates.postalCode) profile.postalCode = updates.postalCode;

    // Update fields based on employment status
    switch (user.employmentStatus) {
      case 'Singaporean/PR':
        if (updates.nricNumber) profile.nricNumber = updates.nricNumber;
        if (req.files?.nricFront?.[0]?.path || req.files?.nricBack?.[0]?.path) {
          profile.nricImages = {
            front: req.files?.nricFront?.[0]?.path || profile.nricImages?.front || null,
            back: req.files?.nricBack?.[0]?.path || profile.nricImages?.back || null,
          };
        }
        break;
      case 'LTVP':
        if (updates.finNumber) profile.finNumber = updates.finNumber;
        if (req.files?.finFront?.[0]?.path || req.files?.finBack?.[0]?.path) {
          profile.finImages = {
            front: req.files?.finFront?.[0]?.path || profile.finImages?.front || null,
            back: req.files?.finBack?.[0]?.path || profile.finImages?.back || null,
          };
        }
        if (req.files?.plocImage?.[0]?.path) profile.plocImage = req.files.plocImage[0].path;
        if (updates.plocExpiryDate) profile.plocExpiryDate = updates.plocExpiryDate;
        break;
      case 'Student':
        if (updates.studentIdNumber) profile.studentIdNumber = updates.studentIdNumber;
        if (updates.schoolName) profile.schoolName = updates.schoolName;
        if (req.files?.studentCard?.[0]?.path) profile.studentCardImage = req.files.studentCard[0].path;
        break;
    }

    // Update the selfie/profile picture if uploaded
    if (req.files?.selfie?.[0]?.path) {
      user.profilePicture = req.files.selfie[0].path;
    }

    await profile.save();
    await user.save();

    res.status(200).json({
      message: "Profile updated successfully.",
      profile,
      profilePicture: user.profilePicture,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to update profile.", details: err.message });
  }
};


exports.getProfileStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const totalCompletedJobs = await Job.countDocuments({
      applicants: { $elemMatch: { user: new mongoose.Types.ObjectId(userId) } },
      status: "Completed",
    });

    const totalCancelledJobs = await Job.countDocuments({
      applicants: { $elemMatch: { user: new mongoose.Types.ObjectId(userId) } },
      status: "Cancelled",
    });

    const totalHoursWorked = await Job.aggregate([
      {
        $match: {
          applicants: { $elemMatch: { user: new mongoose.Types.ObjectId(userId) } },
          status: "Completed",
        },
      },
      {
        $lookup: {
          from: "shifts",
          localField: "shifts",
          foreignField: "_id",
          as: "shiftDetails",
        },
      },
      { $unwind: "$shiftDetails" },
      {
        $group: {
          _id: null,
          totalHours: { $sum: "$shiftDetails.duration" },
        },
      },
    ]);

    res.status(200).json({
      totalCompletedJobs,
      totalCancelledJobs,
      noShowJobs: 0, // Placeholder for no-show jobs
      totalHoursWorked: totalHoursWorked[0]?.totalHours || 0,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch profile stats.", details: err.message });
  }
};

