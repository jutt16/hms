<?php

namespace App\Notifications;

use App\Models\Appointment;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class AppointmentCompleted extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public Appointment $appointment
    ) {}

    public function via(object $notifiable): array
    {
        return ['database', 'mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Appointment Completed - '.$this->appointment->appointment_number)
            ->greeting('Hello '.$notifiable->name.'!')
            ->line('Your appointment has been completed.')
            ->line('Appointment Number: '.$this->appointment->appointment_number)
            ->line('Date: '.$this->appointment->appointment_date->format('F d, Y'))
            ->line('Diagnosis: '.($this->appointment->diagnosis ?? 'N/A'))
            ->action('View Details', route('patient.appointments.show', $this->appointment->id))
            ->line('Thank you for using our Hospital Management System!');
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'appointment_completed',
            'appointment_id' => $this->appointment->id,
            'appointment_number' => $this->appointment->appointment_number,
            'message' => 'Your appointment has been completed.',
        ];
    }
}
