<?php
$to = 'smartrium.podrezov@mail.ru';
$subject = 'Новая заявка с сайта РЕМЗОНА';

$name = isset($_POST['name']) ? trim($_POST['name']) : '';
$phone = isset($_POST['phone']) ? trim($_POST['phone']) : '';

if (empty($name) || empty($phone)) {
    http_response_code(400);
    echo json_encode(['error' => 'Заполните обязательные поля']);
    exit;
}

$message = "===========================================\n";
$message .= "НОВАЯ ЗАЯВКА С САЙТА\n";
$message .= "===========================================\n\n";
$message .= "Имя: " . $name . "\n";
$message .= "Телефон: " . $phone . "\n";
$message .= "Дата: " . date('d.m.Y H:i:s') . "\n";
$message .= "===========================================\n";

$headers = "From: no-reply@remzona.ru\r\n";
$headers .= "Reply-To: no-reply@remzona.ru\r\n";
$headers .= "Content-Type: text/plain; charset=utf-8\r\n";

if (mail($to, $subject, $message, $headers)) {
    http_response_code(200);
    echo json_encode(['success' => true]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Ошибка отправки']);
}
?>