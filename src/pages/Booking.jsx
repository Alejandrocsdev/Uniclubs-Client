import { useState } from 'react';
import BookingTable, { rooms, sampleBookings } from '@/components/BookingTable';
import SelectedVenuePanel from '@/components/SelectedVenuePanel';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { User, LogIn, LogOut } from 'lucide-react';
import { Toaster as Sonner, toast } from 'sonner';

const Booking = () => {
  const [selectedCell, setSelectedCell] = useState(null);
  const [bookings, setBookings] = useState(sampleBookings);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedPlayers, setSelectedPlayers] = useState('1');
  const { user, logout, loading } = useAuth();

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
    <div className="min-h-screen relative bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-blue-600/20" />
      </div>
      <div className="relative p-4 md:p-8 md:pt-4">
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
            selectedPlayers={selectedPlayers}
            onSelectedPlayersChange={setSelectedPlayers}
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
          selectedPlayers={selectedPlayers}
        />
      </div>
    </div>
  );
};

export default Booking;
