// controllers/downloadEmailController.js
import DownloadEmail from '../models/DownloadEmail.js';
import Package from '../models/Package.js';

// Track download email
export const trackDownload = async (req, res) => {
  try {
    const { email, packageId, packageTitle, packageSlug } = req.body;
    
    if (!email || !packageId || !packageTitle || !packageSlug) {
      return res.status(400).json({ 
        message: 'Email, packageId, packageTitle, and packageSlug are required' 
      });
    }

    // Validate package exists
    const packageExists = await Package.findById(packageId);
    if (!packageExists) {
      return res.status(404).json({ message: 'Package not found' });
    }

    // Get client IP and user agent
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('User-Agent') || '';

    // Upsert - increment download count if exists, else create new
    const downloadRecord = await DownloadEmail.findOneAndUpdate(
      { email: email.toLowerCase(), packageId },
      { 
        $inc: { downloadCount: 1 },
        $setOnInsert: {
          packageTitle,
          packageSlug,
          userAgent,
          ipAddress
        }
      },
      { 
        upsert: true, 
        new: true,
        setDefaultsOnInsert: true 
      }
    );

    res.status(201).json({ 
      message: 'Download tracked successfully',
      data: downloadRecord 
    });
  } catch (error) {
    console.error('Error tracking download:', error);
    if (error.code === 11000) {
      // Duplicate key error - record already exists and was updated
      res.status(200).json({ message: 'Download count updated' });
    } else {
      res.status(500).json({ 
        message: 'Error tracking download', 
        error: error.message 
      });
    }
  }
};

// Get all download emails with pagination and filters
export const getDownloadEmails = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search = '',
      packageId = '',
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Build filter object
    const filter = {};
    
    // Search filter
    if (search) {
      filter.$or = [
        { email: { $regex: search, $options: 'i' } },
        { packageTitle: { $regex: search, $options: 'i' } },
        { packageSlug: { $regex: search, $options: 'i' } }
      ];
    }

    // Package filter
    if (packageId) {
      filter.packageId = packageId;
    }

    // Sort configuration
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Get downloads with pagination
    const downloads = await DownloadEmail.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limitNum)
      .populate('packageId', 'title slug image')
      .lean();

    // Get total count for pagination
    const total = await DownloadEmail.countDocuments(filter);
    const totalPages = Math.ceil(total / limitNum);

    res.json({
      downloads,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalRecords: total,
        hasNext: pageNum < totalPages,
        hasPrev: pageNum > 1
      }
    });
  } catch (error) {
    console.error('Error fetching download emails:', error);
    res.status(500).json({ 
      message: 'Error fetching download emails', 
      error: error.message 
    });
  }
};

// Get download statistics
export const getDownloadStats = async (req, res) => {
  try {
    const totalDownloads = await DownloadEmail.countDocuments();
    const uniqueEmails = await DownloadEmail.distinct('email');
    const totalPackages = await DownloadEmail.distinct('packageId');
    
    // Top downloaded packages
    const topPackages = await DownloadEmail.aggregate([
      {
        $group: {
          _id: '$packageId',
          packageTitle: { $first: '$packageTitle' },
          downloadCount: { $sum: '$downloadCount' },
          uniqueDownloads: { $addToSet: '$email' }
        }
      },
      {
        $project: {
          packageTitle: 1,
          downloadCount: 1,
          uniqueDownloads: { $size: '$uniqueDownloads' }
        }
      },
      { $sort: { downloadCount: -1 } },
      { $limit: 10 }
    ]);

    // Recent downloads (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentDownloads = await DownloadEmail.countDocuments({
      createdAt: { $gte: sevenDaysAgo }
    });

    res.json({
      totalDownloads,
      totalUniqueEmails: uniqueEmails.length,
      totalPackages: totalPackages.length,
      recentDownloads,
      topPackages
    });
  } catch (error) {
    console.error('Error fetching download stats:', error);
    res.status(500).json({ 
      message: 'Error fetching download statistics', 
      error: error.message 
    });
  }
};

// Delete download record
export const deleteDownloadRecord = async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedRecord = await DownloadEmail.findByIdAndDelete(id);
    
    if (!deletedRecord) {
      return res.status(404).json({ message: 'Download record not found' });
    }

    res.json({ 
      message: 'Download record deleted successfully',
      data: deletedRecord 
    });
  } catch (error) {
    console.error('Error deleting download record:', error);
    res.status(500).json({ 
      message: 'Error deleting download record', 
      error: error.message 
    });
  }
};