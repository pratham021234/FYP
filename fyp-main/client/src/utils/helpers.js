import { format, formatDistanceToNow } from 'date-fns';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Merge Tailwind classes
export const cn = (...inputs) => {
  return twMerge(clsx(inputs));
};

// Format date
export const formatDate = (date, formatStr = 'MMM dd, yyyy') => {
  if (!date) return '';
  return format(new Date(date), formatStr);
};

// Format relative time
export const formatRelativeTime = (date) => {
  if (!date) return '';
  return formatDistanceToNow(new Date(date), { addSuffix: true });
};

// Get initials from name
export const getInitials = (name) => {
  if (!name) return '';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// Get status color
export const getStatusColor = (status) => {
  const colors = {
    proposed: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    in_progress: 'bg-blue-100 text-blue-800',
    completed: 'bg-purple-100 text-purple-800',
    on_hold: 'bg-gray-100 text-gray-800',
    submitted: 'bg-blue-100 text-blue-800',
    reviewed: 'bg-indigo-100 text-indigo-800',
    needs_revision: 'bg-orange-100 text-orange-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

// Get grade color
export const getGradeColor = (grade) => {
  const colors = {
    'A+': 'text-green-600',
    'A': 'text-green-500',
    'B+': 'text-blue-600',
    'B': 'text-blue-500',
    'C+': 'text-yellow-600',
    'C': 'text-yellow-500',
    'D': 'text-orange-500',
    'F': 'text-red-600',
  };
  return colors[grade] || 'text-gray-600';
};

// Truncate text
export const truncate = (text, length = 100) => {
  if (!text) return '';
  if (text.length <= length) return text;
  return text.slice(0, length) + '...';
};

// Validate email
export const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// Format file size
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

// Download file
export const downloadFile = (url, filename) => {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Copy to clipboard
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy:', error);
    return false;
  }
};
