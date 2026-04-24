// File type validation configuration
// Defines allowed file formats for each file type category

const FILE_TYPE_VALIDATION = {
  report: {
    allowedExtensions: ['.doc', '.docx', '.tex', '.pdf'],
    allowedMimeTypes: [
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/x-latex',
      'text/x-tex',
      'application/pdf'
    ],
    description: 'Reports must be in DOC, DOCX, LaTeX (.tex), or PDF format'
  },
  
  presentation: {
    allowedExtensions: ['.pdf', '.ppt', '.pptx'],
    allowedMimeTypes: [
      'application/pdf',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    ],
    description: 'Presentations must be in PDF or PPTX format'
  },
  
  documentation: {
    allowedExtensions: ['.doc', '.docx', '.pdf', '.txt', '.md', '.tex'],
    allowedMimeTypes: [
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/pdf',
      'text/plain',
      'text/markdown',
      'application/x-latex',
      'text/x-tex'
    ],
    description: 'Documentation can be in DOC, DOCX, PDF, TXT, Markdown, or LaTeX format'
  },
  
  code: {
    allowedExtensions: [
      '.zip', '.rar', '.7z', '.tar', '.gz',
      '.js', '.py', '.java', '.cpp', '.c', '.h', '.cs', '.php', '.rb', '.go',
      '.html', '.css', '.jsx', '.tsx', '.ts', '.json', '.xml', '.sql'
    ],
    allowedMimeTypes: [
      'application/zip',
      'application/x-zip-compressed',
      'application/x-rar-compressed',
      'application/x-7z-compressed',
      'application/x-tar',
      'application/gzip',
      'text/plain',
      'application/javascript',
      'text/javascript',
      'text/x-python',
      'text/x-java-source',
      'text/x-c',
      'text/x-c++',
      'text/html',
      'text/css',
      'application/json',
      'application/xml',
      'text/xml'
    ],
    description: 'Code files can be source files or compressed archives (ZIP, RAR, 7Z, TAR, GZ)'
  },
  
  design: {
    allowedExtensions: [
      '.jpg', '.jpeg', '.png', '.gif', '.svg', '.bmp', '.webp',
      '.psd', '.ai', '.sketch', '.fig', '.xd',
      '.pdf', '.eps'
    ],
    allowedMimeTypes: [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/svg+xml',
      'image/bmp',
      'image/webp',
      'image/vnd.adobe.photoshop',
      'application/postscript',
      'application/pdf',
      'application/illustrator'
    ],
    description: 'Design files can be images (JPG, PNG, SVG, etc.) or design tool files (PSD, AI, Sketch, Figma, XD)'
  },
  
  other: {
    allowedExtensions: [
      '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.csv',
      '.txt', '.zip', '.rar', '.jpg', '.jpeg', '.png'
    ],
    allowedMimeTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/csv',
      'text/plain',
      'application/zip',
      'application/x-rar-compressed',
      'image/jpeg',
      'image/png'
    ],
    description: 'Other files can be common document, spreadsheet, or image formats'
  }
};

// Storage limits
const STORAGE_LIMITS = {
  DEFAULT_USER_QUOTA: 5 * 1024 * 1024 * 1024, // 5GB in bytes
  MAX_FILE_SIZE: 100 * 1024 * 1024, // 100MB per file
  WARNING_THRESHOLD: 0.8, // Warn when 80% storage used
  CRITICAL_THRESHOLD: 0.95 // Critical warning at 95%
};

/**
 * Validate file type based on extension and mime type
 * @param {string} fileType - The category of file (report, presentation, etc.)
 * @param {string} filename - Original filename
 * @param {string} mimeType - File mime type
 * @returns {Object} - { valid: boolean, message: string }
 */
function validateFileType(fileType, filename, mimeType) {
  const validation = FILE_TYPE_VALIDATION[fileType];
  
  if (!validation) {
    return {
      valid: false,
      message: `Invalid file type category: ${fileType}`
    };
  }
  
  // Get file extension
  const ext = filename.substring(filename.lastIndexOf('.')).toLowerCase();
  
  // Check extension
  const extensionValid = validation.allowedExtensions.includes(ext);
  
  // Check mime type (more lenient as some systems report different mime types)
  const mimeTypeValid = validation.allowedMimeTypes.some(allowed => 
    mimeType.toLowerCase().includes(allowed.toLowerCase()) ||
    allowed.toLowerCase().includes(mimeType.toLowerCase())
  );
  
  if (!extensionValid && !mimeTypeValid) {
    return {
      valid: false,
      message: `Invalid file format for ${fileType}. ${validation.description}. Received: ${ext} (${mimeType})`
    };
  }
  
  return {
    valid: true,
    message: 'File type is valid'
  };
}

/**
 * Check if user has enough storage quota
 * @param {number} currentUsage - Current storage used in bytes
 * @param {number} quota - Total quota in bytes
 * @param {number} fileSize - Size of file to upload in bytes
 * @returns {Object} - { allowed: boolean, message: string, percentageUsed: number }
 */
function checkStorageQuota(currentUsage, quota, fileSize) {
  const newUsage = currentUsage + fileSize;
  const percentageUsed = (newUsage / quota) * 100;
  
  if (newUsage > quota) {
    return {
      allowed: false,
      message: `Storage quota exceeded. You have used ${formatBytes(currentUsage)} of ${formatBytes(quota)}. This file (${formatBytes(fileSize)}) would exceed your limit.`,
      percentageUsed: (currentUsage / quota) * 100,
      remainingSpace: quota - currentUsage
    };
  }
  
  let message = 'Upload allowed';
  if (percentageUsed >= STORAGE_LIMITS.CRITICAL_THRESHOLD * 100) {
    message = `Warning: You are using ${percentageUsed.toFixed(1)}% of your storage quota`;
  } else if (percentageUsed >= STORAGE_LIMITS.WARNING_THRESHOLD * 100) {
    message = `Notice: You have used ${percentageUsed.toFixed(1)}% of your storage quota`;
  }
  
  return {
    allowed: true,
    message,
    percentageUsed,
    remainingSpace: quota - newUsage
  };
}

/**
 * Format bytes to human readable format
 * @param {number} bytes - Size in bytes
 * @returns {string} - Formatted string (e.g., "1.5 GB")
 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

module.exports = {
  FILE_TYPE_VALIDATION,
  STORAGE_LIMITS,
  validateFileType,
  checkStorageQuota,
  formatBytes
};
