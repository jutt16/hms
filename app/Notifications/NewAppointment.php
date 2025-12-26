<?php

namespace App\Notifications;

use App\Models\Appointment;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewAppointment extends Notification implements ShouldQueue
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
        $patient = $this->appointment->patient->user;

        return (new MailMessage)
            ->subject('New Appointment - '.$this->appointment->appointment_number)
            ->greeting('Hello '.$notifiable->name.'!')
            ->line('You have a new appointment scheduled.')
            ->line('Appointment Number: '.$this->appointment->appointment_number)
            ->line('Patient: '.$patient->name)
            ->line('Date & Time: '.$this->appointment->appointment_date->format('F d, Y h:i A'))
            ->line('Reason: '.($this->appointment->reason ?? 'N/A'))
            ->action('View Appointment', route('doctor.appointments.show', $this->appointment->id))
            ->line('Thank you for using our Hospital Management System!');
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'new_appointment',
            'appointment_id' => $this->appointment->id,
            'appointment_number' => $this->appointment->appointment_number,
            'patient_name' => $this->appointment->patient->user->name,
            'appointment_date' => $this->appointment->appointment_date->toIso8601String(),
            'message' => 'You have a new appointment with '.$this->appointment->patient->user->name,
        ];
    }
}
