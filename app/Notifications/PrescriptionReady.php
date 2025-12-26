<?php

namespace App\Notifications;

use App\Models\Prescription;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PrescriptionReady extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public Prescription $prescription
    ) {}

    public function via(object $notifiable): array
    {
        return ['database', 'mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Prescription Ready - '.$this->prescription->prescription_number)
            ->greeting('Hello '.$notifiable->name.'!')
            ->line('Your prescription is ready.')
            ->line('Prescription Number: '.$this->prescription->prescription_number)
            ->line('Doctor: '.$this->prescription->doctor->user->name)
            ->line('Date: '.$this->prescription->created_at->format('F d, Y'))
            ->action('View Prescription', route('patient.prescriptions.show', $this->prescription->id))
            ->line('You can collect your medicines from the pharmacy.')
            ->line('Thank you for using our Hospital Management System!');
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'prescription_ready',
            'prescription_id' => $this->prescription->id,
            'prescription_number' => $this->prescription->prescription_number,
            'message' => 'Your prescription is ready.',
        ];
    }
}
