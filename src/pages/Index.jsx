import { useState } from 'react';
import BookingTable, { rooms, sampleBookings } from '@/components/BookingTable';
import Header from '@/components/Header';
import SelectedVenuePanel from '@/components/SelectedVenuePanel';
import { Toaster as Sonner, toast } from 'sonner';

const Index = () => {
  const [selectedCell, setSelectedCell] = useState(null);
  const [bookings, setBookings] = useState(sampleBookings);
  const [selectedDate, setSelectedDate] = useState(new Date());

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
      <Header />

      <div className="mt-14 p-4 md:p-8">
        <div className="max-w-full mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <BookingTable
                selectedCell={selectedCell}
                onCellSelect={setSelectedCell}
                bookings={bookings}
                onBookingsChange={setBookings}
                selectedDate={selectedDate}
                onSelectedDateChange={setSelectedDate}
              />
            </div>

            <div className="lg:col-span-1">
              <SelectedVenuePanel
                selectedCell={selectedCell}
                onClearSelection={() => setSelectedCell(null)}
                getBookingStatus={getBookingStatus}
                rooms={rooms}
                selectedDate={selectedDate}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
