// ============================================
// OptiImage API Configuration
// ============================================

// Production URL (hosted on Render)
const API_BASE_URL = 'https://optiimage-server-ev2l.onrender.com';

// Local development URL — uncomment when testing against local server
// const API_BASE_URL = 'http://localhost:3000';

export const API_ENDPOINTS = {
  COMPRESS: `${API_BASE_URL}/api/images/compress`,
};

export default API_BASE_URL;
