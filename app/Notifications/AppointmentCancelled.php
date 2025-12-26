<?php

namespace App\Notifications;

use App\Models\Appointment;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class AppointmentCancelled extends Notification implements ShouldQueue
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
            ->subject('Appointment Cancelled - '.$this->appointment->appointment_number)
            ->greeting('Hello '.$notifiable->name.'!')
            ->line('Your appointment has been cancelled.')
            ->line('Appointment Number: '.$this->appointment->appointment_number)
            ->line('Date: '.$this->appointment->appointment_date->format('F d, Y'))
            ->line('If you need to reschedule, please contact us or book a new appointment.')
            ->action('Book New Appointment', route('patient.appointments.create'))
            ->line('Thank you for using our Hospital Management System!');
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'appointment_cancelled',
            'appointment_id' => $this->appointment->id,
            'appointment_number' => $this->appointment->appointment_number,
            'message' => 'Your appointment has been cancelled.',
        ];
    }
}
