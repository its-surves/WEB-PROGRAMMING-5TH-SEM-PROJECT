<?php
/**
 * ==============================================================================
 * TASKFLOW STUDIO - TASK EXPORT & DATA TRANSFORM ENGINE (PHP 8+)
 * ==============================================================================
 * Role: Server-Side Data Transformation & CSV Streamer
 */

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["error" => "Method Not Allowed. Use POST."]);
    exit;
}

define('SUPABASE_URL', 'https://fmuswojgoimfwallfpgx.supabase.co');
define('SUPABASE_ANON_KEY', 'sb_publishable__hjzOrQ4Y-dwAjvsK58nvg_nomVK5Qu');

$rawInput = file_get_contents("php://input");
$payload = json_decode($rawInput, true) ?? [];
$tasks = $payload['tasks'] ?? null;

if ($tasks === null || !is_array($tasks)) {
    $opts = [
        "http" => [
            "method" => "GET",
            "header" => "apikey: " . SUPABASE_ANON_KEY . "\r\n" .
                        "Authorization: Bearer " . SUPABASE_ANON_KEY . "\r\n" .
                        "Accept: application/json\r\n"
        ]
    ];
    $context = stream_context_create($opts);
    $supaRes = @file_get_contents(SUPABASE_URL . "/rest/v1/tasks?select=*", false, $context);
    if ($supaRes !== false) {
        $tasks = json_decode($supaRes, true) ?? [];
    } else {
        $tasks = [];
    }
}

$projectName = preg_replace('/[^a-zA-Z0-9_-]/', '_', $payload['projectName'] ?? 'taskflow_export');
$filename = $projectName . '_' . date("Ymd_His") . '.csv';

// Output headers for automatic file download
header('Content-Type: text/csv; charset=utf-8');
header('Content-Disposition: attachment; filename="' . $filename . '"');

$output = fopen('php://output', 'w');

// Add CSV BOM for proper Excel UTF-8 display
fputs($output, "\xEF\xBB\xBF");

// Write header row
fputcsv($output, ['ID', 'Task Title', 'Status', 'Priority', 'Assignee', 'Due Date', 'Created At']);

// Write task rows
foreach ($tasks as $task) {
    fputcsv($output, [
        $task['id'] ?? '',
        $task['title'] ?? '',
        ucfirst($task['status'] ?? 'todo'),
        strtoupper($task['priority'] ?? 'medium'),
        $task['assignee_name'] ?? 'Unassigned',
        $task['due_date'] ?? 'N/A',
        $task['created_at'] ?? date("Y-m-d H:i:s")
    ]);
}

fclose($output);
exit;
