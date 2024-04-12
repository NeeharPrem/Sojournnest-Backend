import cron from 'node-cron';
import BookingModal from '../database/bookingModel';
import { UpdateWriteOpResult } from 'mongoose';

function updateBookingStatus(): void {
    const today: Date = new Date();
    today.setHours(0, 0, 0, 0);

    BookingModal.updateMany(
        { checkOutDate: { $lt: today }, status: { $in: ['pending', 'confirmed'] } },
        { $set: { status: 'completed' } }
    )
    .then((result: UpdateWriteOpResult) => console.log('Booking status updated:', result))
    .catch((err: Error) => console.error('Error updating booking statuses:', err));
}

export function setupCronJobs(): void {
    cron.schedule('0 12 * * *', updateBookingStatus, {
        scheduled: true,
        timezone: "Asia/Kolkata"
    });
}