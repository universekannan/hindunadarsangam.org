<?php
declare(strict_types=1);
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');
$json = str_contains($_SERVER['HTTP_ACCEPT'] ?? '', 'application/json');
function respond(int $code, string $message): never {
    global $json;
    http_response_code($code);
    if ($json) {
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['message' => $message]);
    } else {
        header('Content-Type: text/html; charset=utf-8');
        echo '<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Contact enquiry</title><link rel="stylesheet" href="css/site.css"><main class="card result"><h1>Contact enquiry</h1><p>' . htmlspecialchars($message, ENT_QUOTES, 'UTF-8') . '</p><a class="button" href="contact.html">Back to Contact Us</a></main></html>';
    }
    exit;
}
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Allow: POST'); respond(405, 'Please use the contact form to submit an enquiry.');
}
if ((int)($_SERVER['CONTENT_LENGTH'] ?? 0) > 20000) respond(413, 'The enquiry is too long. Please shorten your message.');
function field(string $key): string {
    return isset($_POST[$key]) && is_string($_POST[$key]) ? trim($_POST[$key]) : '';
}
if (field('website') !== '') respond(422, 'Unable to accept this enquiry. Please contact the office directly.');
$name = field('name'); $email = field('email'); $phone = field('phone');
$subject = field('subject'); $message = field('message');
if ($name === '' || strlen($name) > 400 || !filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($email) > 254 || $subject === '' || strlen($subject) > 600 || $message === '' || strlen($message) > 20000 || strlen($phone) > 120 || preg_match('/[\r\n]/', $email . $subject . $name)) {
    respond(422, 'Please enter a valid name, email address, subject and message.');
}
// Configure PHP mail/SMTP on the hosting server. Never claim success if delivery fails.
$recipient = 'kmhns2015@gmail.com';
$body = "Name: $name\nEmail: $email\nPhone: $phone\n\n$message";
$headers = ['From' => 'Hindu Nadar Sangam <website@hindunadarsangam.org>', 'Reply-To' => $email, 'Content-Type' => 'text/plain; charset=UTF-8'];
$sent = @mail($recipient, 'Website enquiry: ' . $subject, $body, $headers);
if (!$sent) respond(503, 'Email delivery is currently unavailable. Please email kmhns2015@gmail.com or call 04652 - 238460.');
respond(200, 'Thank you. Your enquiry has been submitted to the Sangam office.');
