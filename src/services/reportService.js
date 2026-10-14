// Service layer bridging React to the PHP Backend Microservice

const DEFAULT_PHP_BASE_URL = 'http://localhost:8000';

export const checkPhpServerStatus = async () => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1200);

    const res = await fetch(`${DEFAULT_PHP_BASE_URL}/api/report_generator.php`, {
      method: 'GET',
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      return { online: true, details: data };
    }
    return { online: false, message: 'Server responded with non-200' };
  } catch (err) {
    return {
      online: false,
      message: 'PHP server not running on localhost:8000 (Start with: php -S localhost:8000 -t backend)'
    };
  }
};

/**
 * Request PHP Executive Report
 * If PHP server is online, POST payload to /api/report_generator.php
 * If offline, compute equivalent metrics and format cleanly for presentation.
 */
export const generateExecutiveReport = async ({ projectName, tasks, format = 'html' }) => {
  const phpStatus = await checkPhpServerStatus();

  if (phpStatus.online) {
    try {
      const res = await fetch(`${DEFAULT_PHP_BASE_URL}/api/report_generator.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectName, tasks, format })
      });

      if (res.ok) {
        if (format === 'html') {
          const htmlContent = await res.text();
          return { success: true, isPhpLive: true, html: htmlContent };
        } else {
          const jsonData = await res.json();
          return { success: true, isPhpLive: true, data: jsonData };
        }
      }
    } catch (err) {
      console.warn('PHP request failed, falling back to client engine', err);
    }
  }

  // Graceful Client-side Fallback with notice
  const total = tasks.length;
  const statusCounts = { todo: 0, in_progress: 0, review: 0, done: 0 };
  const priorityCounts = { low: 0, medium: 0, high: 0, urgent: 0 };
  const bottlenecks = [];
  const today = new Date().toISOString().split('T')[0];
  let overdueCount = 0;

  tasks.forEach((t) => {
    const s = t.status || 'todo';
    const p = t.priority || 'medium';
    if (statusCounts[s] !== undefined) statusCounts[s]++;
    if (priorityCounts[p] !== undefined) priorityCounts[p]++;

    if (['urgent', 'high'].includes(p) && ['todo', 'in_progress'].includes(s)) {
      bottlenecks.push({
        title: t.title,
        priority: p,
        status: s,
        assignee: t.assigneeName || 'Unassigned',
        dueDate: t.dueDate || 'None'
      });
    }

    if (t.dueDate && t.dueDate < today && s !== 'done') {
      overdueCount++;
    }
  });

  const completionRate = total > 0 ? Math.round((statusCounts.done / total) * 100) : 0;
  const mockHash = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

  return {
    success: true,
    isPhpLive: false,
    message: 'Rendered via client engine. Launch `php -S localhost:8000 -t backend` for native PHP processing.',
    data: {
      projectName,
      generatedAt: new Date().toLocaleString(),
      reportHash: mockHash,
      metrics: {
        totalTasks: total,
        completedTasks: statusCounts.done,
        completionRate,
        inFlightRate: total > 0 ? Math.round(((statusCounts.in_progress + statusCounts.review) / total) * 100) : 0,
        overdueTasks: overdueCount,
        statusBreakdown: statusCounts,
        priorityBreakdown: priorityCounts,
        bottlenecks
      }
    }
  };
};

/**
 * Trigger CSV Export
 */
export const exportTasksAsCsv = async ({ projectName, tasks }) => {
  const phpStatus = await checkPhpServerStatus();

  if (phpStatus.online) {
    try {
      const res = await fetch(`${DEFAULT_PHP_BASE_URL}/api/export_tasks.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectName, tasks })
      });
      if (res.ok) {
        const blob = await res.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = `${projectName.toLowerCase().replace(/\s+/g, '_')}_tasks.csv`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        return { success: true, method: 'PHP Backend Stream' };
      }
    } catch (e) {
      console.warn('PHP CSV export fallback', e);
    }
  }

  // Client-side CSV generation
  const headers = ['ID', 'Title', 'Status', 'Priority', 'Assignee', 'Due Date'];
  const rows = tasks.map((t) => [
    `"${t.id}"`,
    `"${(t.title || '').replace(/"/g, '""')}"`,
    `"${t.status}"`,
    `"${t.priority}"`,
    `"${t.assigneeName || ''}"`,
    `"${t.dueDate || ''}"`
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${projectName.toLowerCase().replace(/\s+/g, '_')}_tasks.csv`);
  document.body.appendChild(link);
  link.click();
  link.remove();

  return { success: true, method: 'Client-side CSV Export' };
};
