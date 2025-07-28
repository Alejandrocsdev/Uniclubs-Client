import { useState } from 'react';
import BookingTable, { rooms, sampleBookings } from '@/components/BookingTable';
import SelectedVenuePanel from '@/components/SelectedVenuePanel';
import { Toaster as Sonner, toast } from 'sonner';

const Booking = () => {
  const [selectedCell, setSelectedCell] = useState(null);
  const [bookings, setBookings] = useState(sampleBookings);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isEditMode, setIsEditMode] = useState(false);

  const getBookingStatus = (roomId, timeSlot) => {
    const dateStr = selectedDate.toISOString().slice(0, 10);
    return bookings.filter(
      booking => 
        booking.roomId === roomId && 
        booking.timeSlot === timeSlot &&
        booking.date === dateStr
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="p-4 md:p-8 md:pt-4">
        <div className="max-w-full mx-auto">
          <BookingTable
            selectedCell={selectedCell}
            onCellSelect={setSelectedCell}
            bookings={bookings}
            onBookingsChange={setBookings}
            selectedDate={selectedDate}
            onSelectedDateChange={setSelectedDate}
            isEditMode={isEditMode}
            onEditModeChange={setIsEditMode}
          />
        </div>       
        <SelectedVenuePanel
            selectedCell={selectedCell}
            onClearSelection={() => setSelectedCell(null)}
            getBookingStatus={getBookingStatus}
            rooms={rooms}
            selectedDate={selectedDate}
            isEditMode={isEditMode}
            bookings={bookings}
            onBookingsChange={setBookings}
          />
      </div>
    </div>
  );
};

export default Booking;
