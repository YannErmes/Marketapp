/**
 * Daily Traffic Visitor Tracking Service
 * Tracks visitor info and logs to Google Sheet with unique visitor ID
 */

const APPS_SCRIPT_URL = import.meta.env.VITE_APPS_SCRIPT_URL || "";

export interface VisitorInfo {
  visitor_id: string;
  browser_user_agent: string;
  visit_timestamp: string;
  visit_date: string;
  referrer: string;
  language: string;
}

/**
 * Generate unique visitor ID based on browser fingerprint
 */
const generateVisitorId = (): string => {
  const fingerprint = {
    userAgent: navigator.userAgent,
    language: navigator.language,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    platform: navigator.platform,
    hardwareConcurrency: navigator.hardwareConcurrency || 'unknown',
    timestamp: new Date().toLocaleDateString('en-CA'), // Include date for daily reset
  };

  const fingerprintStr = JSON.stringify(fingerprint);
  
  // Simple hash function to generate consistent ID
  let hash = 0;
  for (let i = 0; i < fingerprintStr.length; i++) {
    const char = fingerprintStr.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }

  return Math.abs(hash).toString(16).slice(0, 16);
};

/**
 * Get or create visitor ID from localStorage
 */
const getOrCreateVisitorId = (): string => {
  const today = new Date().toLocaleDateString('en-CA');
  const storageKey = `visitorId_${today}`;
  let visitorId = localStorage.getItem(storageKey);

  if (!visitorId) {
    visitorId = generateVisitorId();
    localStorage.setItem(storageKey, visitorId);
    // Clean up old visitor IDs (older than 7 days)
    cleanupOldVisitorIds();
  }

  return visitorId;
};

/**
 * Clean up old visitor IDs from localStorage
 */
const cleanupOldVisitorIds = (): void => {
  const today = new Date();
  const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('visitorId_')) {
      const dateStr = key.replace('visitorId_', '');
      try {
        const date = new Date(dateStr);
        if (date < sevenDaysAgo) {
          localStorage.removeItem(key);
        }
      } catch (e) {
        // Invalid date, skip
      }
    }
  }
};

/**
 * Get basic browser information
 */
const getBrowserInfo = (): Omit<VisitorInfo, "visitor_id"> => {
  const now = new Date();
  
  return {
    browser_user_agent: navigator.userAgent,
    referrer: document.referrer || "Direct",
    language: navigator.language || "Unknown",
    visit_timestamp: now.toISOString(),
    visit_date: now.toLocaleDateString('en-CA'), // YYYY-MM-DD format
  };
};

/**
 * Track visitor and send to Google Sheet (daily traffic use sheet)
 */
export const trackDailyVisitor = async (): Promise<void> => {
  // Only track once per user per session using sessionStorage
  const hasTrackedThisSession = sessionStorage.getItem("hasTrackedVisitor");
  
  if (hasTrackedThisSession) {
    return; // Already tracked in this session
  }

  if (!APPS_SCRIPT_URL) {
    console.warn("VITE_APPS_SCRIPT_URL not configured. Cannot track visitor.");
    return;
  }

  try {
    const visitorId = getOrCreateVisitorId();
    const browserInfo = getBrowserInfo();

    const response = await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify({
        action: "track_daily_visitor",
        visitor_id: visitorId,
        ...browserInfo,
      }),
    });

    if (response.ok) {
      // Mark as tracked in this session
      sessionStorage.setItem("hasTrackedVisitor", "true");
    }
  } catch (error) {
    console.error("Failed to track visitor:", error);
    // Silently fail - don't break app functionality
  }
};

/**
 * Get visitor count for today from the sheet (optional)
 */
export const getTodayVisitorCount = async (): Promise<number | null> => {
  if (!APPS_SCRIPT_URL) {
    return null;
  }

  try {
    const today = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD
    const response = await fetch(
      `${APPS_SCRIPT_URL}?action=get_today_visitor_count&date=${encodeURIComponent(today)}`
    );

    if (response.ok) {
      const result = await response.json();
      if (result.success && result.count !== undefined) {
        return result.count;
      }
    }
  } catch (error) {
    console.error("Failed to get visitor count:", error);
  }

  return null;
};
