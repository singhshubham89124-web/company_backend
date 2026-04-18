<?php
/**
 * ASRVTech Contact Form Handler
 * Handles CORS, saves to Firestore, and sends notification via PHPMailer.
 */

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use Kreait\Firebase\Factory;

require 'vendor/autoload.php';

// --- CONFIGURATION ---
// Set your authorized Netlify URL here for production
$allowed_origin = "*"; // You can change this to "https://your-netlify-site.netlify.app"

// Email Settings (Recommended to use Environment Variables)
define('SMTP_HOST', getenv('SMTP_HOST') ?: 'smtp.gmail.com');
define('SMTP_USER', getenv('SMTP_USER') ?: 'your-email@gmail.com');
define('SMTP_PASS', getenv('SMTP_PASS') ?: 'your-app-password');
define('COMPANY_EMAIL', getenv('COMPANY_EMAIL') ?: 'singhshubham29392@gmail.com');

// Firebase Settings
define('FIREBASE_PROJECT_ID', 'company-eb0bf');
define('SERVICE_ACCOUNT_FILE', __DIR__ . '/service-account.json');

// --- CORS HEADERS ---
header("Access-Control-Allow-Origin: $allowed_origin");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// --- MAIN LOGIC ---
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        // 1. Get and decode JSON input
        $inputJSON = file_get_contents('php://input');
        $input = json_decode($inputJSON, true);

        if (!$input || empty($input['name']) || empty($input['email']) || empty($input['service'])) {
            throw new Exception('Missing required fields');
        }

        $name = $input['name'];
        $email = $input['email'];
        $phone = $input['phone'] ?? 'N/A';
        $address = $input['address'] ?? 'N/A';
        $service = $input['service'];
        $message = $input['message'] ?? 'No message provided';

        // 2. Save to Firestore
        if (file_exists(SERVICE_ACCOUNT_FILE)) {
            $factory = (new Factory)
                ->withServiceAccount(SERVICE_ACCOUNT_FILE);
            
            $firestore = $factory->createFirestoreClient();
            $database = $firestore->database();
            
            $collectionReference = $database->collection('service_requests');
            $collectionReference->add([
                'name' => $name,
                'email' => $email,
                'phone' => $phone,
                'address' => $address,
                'service' => $service,
                'message' => $message,
                'createdAt' => new \Google\Cloud\Core\Timestamp(new DateTime()),
                'source' => 'PHP Backend'
            ]);
        } else {
            // Log warning if firebase is not configured but continue to email
            error_log("Firebase service account file not found.");
        }

        // 3. Send Email using PHPMailer
        $mail = new PHPMailer(true);

        try {
            // Server settings
            $mail->isSMTP();
            $mail->Host       = SMTP_HOST;
            $mail->SMTPAuth   = true;
            $mail->Username   = SMTP_USER;
            $mail->Password   = SMTP_PASS;
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
            $mail->Port       = 587;

            // Recipients
            $mail->setFrom(SMTP_USER, 'ASRVTech Website');
            $mail->addAddress(COMPANY_EMAIL);

            // Content
            $mail->isHTML(true);
            $mail->Subject = "New Service Request from $name";
            $mail->Body    = "
                <h3>New Service Request</h3>
                <p><strong>Name:</strong> $name</p>
                <p><strong>Email:</strong> $email</p>
                <p><strong>Phone:</strong> $phone</p>
                <p><strong>Address:</strong> $address</p>
                <p><strong>Service:</strong> $service</p>
                <p><strong>Message:</strong> $message</p>
            ";

            $mail->send();
        } catch (Exception $e) {
            error_log("Mailer Error: {$mail->ErrorInfo}");
            // We still return success if at least one part worked, or you can choose to fail.
        }

        echo json_encode(['success' => true, 'message' => 'Request processed successfully']);

    } catch (Exception $e) {
        http_response_code(400);
        echo json_encode(['error' => $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}
