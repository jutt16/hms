<?php

namespace App\Notifications;

use App\Models\LabResult;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class LabResultReady extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public LabResult $labResult
    ) {}

    public function via(object $notifiable): array
    {
        return ['database', 'mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Lab Result Ready - '.$this->labResult->result_number)
            ->greeting('Hello '.$notifiable->name.'!')
            ->line('Your lab test results are ready.')
            ->line('Result Number: '.$this->labResult->result_number)
            ->line('Test: '.$this->labResult->labTest->name)
            ->line('Date: '.$this->labResult->created_at->format('F d, Y'))
            ->action('View Results', route('patient.lab-results.show', $this->labResult->id))
            ->line('Thank you for using our Hospital Management System!');
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'lab_result_ready',
            'lab_result_id' => $this->labResult->id,
            'result_number' => $this->labResult->result_number,
            'test_name' => $this->labResult->labTest->name,
            'message' => 'Your lab test results are ready.',
        ];
    }
}
