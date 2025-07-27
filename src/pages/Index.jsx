import { useState } from 'react';
import BookingTable, { rooms, sampleBookings } from '@/components/BookingTable';
import Header from '@/components/Header';
import SelectedVenuePanel from '@/components/SelectedVenuePanel';
import { Toaster as Sonner, toast } from "sonner"

const Index = () => {
  const [selectedCell, setSelectedCell] = useState(null);

  const getBookingStatus = (roomId, timeSlot) => {
    return sampleBookings.filter(
      booking => booking.roomId === roomId && booking.timeSlot === timeSlot
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
              />
            </div>
            
            <div className="lg:col-span-1">
              <SelectedVenuePanel
                selectedCell={selectedCell}
                onClearSelection={() => setSelectedCell(null)}
                getBookingStatus={getBookingStatus}
                rooms={rooms}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index; 