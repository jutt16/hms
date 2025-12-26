<?php

namespace App\Notifications;

use App\Models\Appointment;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class AppointmentScheduled extends Notification implements ShouldQueue
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
        $doctor = $this->appointment->doctor->user;
        $patient = $this->appointment->patient->user;

        return (new MailMessage)
            ->subject('Appointment Scheduled - '.$this->appointment->appointment_number)
            ->greeting('Hello '.$notifiable->name.'!')
            ->line('Your appointment has been scheduled successfully.')
            ->line('Appointment Number: '.$this->appointment->appointment_number)
            ->line('Doctor: '.$doctor->name)
            ->line('Patient: '.$patient->name)
            ->line('Date & Time: '.$this->appointment->appointment_date->format('F d, Y h:i A'))
            ->line('Reason: '.($this->appointment->reason ?? 'N/A'))
            ->action('View Appointment', route('patient.appointments.show', $this->appointment->id))
            ->line('Thank you for using our Hospital Management System!');
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'appointment_scheduled',
            'appointment_id' => $this->appointment->id,
            'appointment_number' => $this->appointment->appointment_number,
            'doctor_name' => $this->appointment->doctor->user->name,
            'patient_name' => $this->appointment->patient->user->name,
            'appointment_date' => $this->appointment->appointment_date->toIso8601String(),
            'message' => 'Your appointment has been scheduled for '.$this->appointment->appointment_date->format('F d, Y h:i A'),
        ];
    }
}
