<?php

namespace App\Notifications;

use App\Models\Bill;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class BillGenerated extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public Bill $bill
    ) {}

    public function via(object $notifiable): array
    {
        return ['database', 'mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('New Bill Generated - '.$this->bill->bill_number)
            ->greeting('Hello '.$notifiable->name.'!')
            ->line('A new bill has been generated for you.')
            ->line('Bill Number: '.$this->bill->bill_number)
            ->line('Bill Type: '.ucfirst($this->bill->bill_type))
            ->line('Total Amount: $'.number_format($this->bill->total, 2))
            ->line('Balance: $'.number_format($this->bill->balance, 2))
            ->action('View Bill', route('billing.bills.show', $this->bill->id))
            ->line('Please make payment at your earliest convenience.')
            ->line('Thank you for using our Hospital Management System!');
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'bill_generated',
            'bill_id' => $this->bill->id,
            'bill_number' => $this->bill->bill_number,
            'total' => $this->bill->total,
            'message' => 'A new bill has been generated for you.',
        ];
    }
}
