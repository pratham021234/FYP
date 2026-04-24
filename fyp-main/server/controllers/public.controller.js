const Project = require('../models/Project.model');

// Search projects from last 3 years
exports.searchProjects = async (req, res) => {
  try {
    const { query, department, category, page = 1, limit = 10 } = req.query;

    if (!query || query.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    // Calculate year range (last 3 years)
    const currentYear = new Date().getFullYear();
    const threeYearsAgo = currentYear - 3;

    // Build search filter
    const searchFilter = {
      status: 'completed',
      completionYear: { $gte: threeYearsAgo, $lte: currentYear },
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { keywords: { $in: [new RegExp(query, 'i')] } },
        { technologies: { $in: [new RegExp(query, 'i')] } },
        { domain: { $regex: query, $options: 'i' } }
      ]
    };

    // Add optional filters
    if (department) {
      searchFilter.department = department;
    }
    if (category) {
      searchFilter.category = category;
    }

    // Execute search with pagination
    const skip = (page - 1) * limit;
    const projects = await Project.find(searchFilter)
      .select('title description keywords technologies domain department category completionYear finalFiles createdAt')
      .populate('group', 'name')
      .populate('guide', 'name department')
      .sort({ completionYear: -1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalCount = await Project.countDocuments(searchFilter);

    // Highlight matching keywords in results
    const highlightedProjects = projects.map(project => {
      const projectObj = project.toObject();
      
      // Highlight in title
      projectObj.highlightedTitle = highlightKeywords(projectObj.title, query);
      
      // Highlight in description (first 200 chars)
      const shortDesc = projectObj.description.substring(0, 200);
      projectObj.shortDescription = highlightKeywords(shortDesc, query) + (projectObj.description.length > 200 ? '...' : '');
      
      return projectObj;
    });

    res.json({
      success: true,
      data: {
        projects: highlightedProjects,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalCount / limit),
          totalResults: totalCount,
          hasMore: skip + projects.length < totalCount
        },
        query,
        yearRange: { from: threeYearsAgo, to: currentYear }
      }
    });
  } catch (error) {
    console.error('Search projects error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search projects'
    });
  }
};

// Autocomplete suggestions
exports.autocompleteProjects = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || query.trim().length < 2) {
      return res.json({
        success: true,
        data: { suggestions: [] }
      });
    }

    const currentYear = new Date().getFullYear();
    const threeYearsAgo = currentYear - 3;

    // Get unique keywords and titles
    const projects = await Project.find({
      status: 'completed',
      completionYear: { $gte: threeYearsAgo },
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { keywords: { $in: [new RegExp(query, 'i')] } },
        { technologies: { $in: [new RegExp(query, 'i')] } }
      ]
    })
    .select('title keywords technologies')
    .limit(10);

    const suggestions = new Set();
    
    projects.forEach(project => {
      // Add matching title
      if (project.title.toLowerCase().includes(query.toLowerCase())) {
        suggestions.add(project.title);
      }
      
      // Add matching keywords
      project.keywords?.forEach(keyword => {
        if (keyword.toLowerCase().includes(query.toLowerCase())) {
          suggestions.add(keyword);
        }
      });
      
      // Add matching technologies
      project.technologies?.forEach(tech => {
        if (tech.toLowerCase().includes(query.toLowerCase())) {
          suggestions.add(tech);
        }
      });
    });

    res.json({
      success: true,
      data: {
        suggestions: Array.from(suggestions).slice(0, 8)
      }
    });
  } catch (error) {
    console.error('Autocomplete error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get suggestions'
    });
  }
};

// Preview project details
exports.previewProject = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findById(id)
      .select('-rejectionReason -approvedBy')
      .populate('group', 'name members')
      .populate('guide', 'name email department');

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Only show completed projects from last 3 years
    const currentYear = new Date().getFullYear();
    const threeYearsAgo = currentYear - 3;

    if (project.status !== 'completed' || project.completionYear < threeYearsAgo) {
      return res.status(403).json({
        success: false,
        message: 'Project not available for preview'
      });
    }

    res.json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error('Preview project error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to preview project'
    });
  }
};

// Helper function to highlight keywords
function highlightKeywords(text, query) {
  if (!text || !query) return text;
  
  const regex = new RegExp(`(${query})`, 'gi');
  return text.replace(regex, '<mark class="bg-yellow-200 px-1 rounded">$1</mark>');
}
