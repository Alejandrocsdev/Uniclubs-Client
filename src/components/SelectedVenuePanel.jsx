import React from 'react';
import { Card } from './ui/card';
import { X } from 'lucide-react';
import { Button } from './ui/button';
import { timeSlots } from './BookingTable';

const SelectedVenuePanel = ({
  selectedCell,
  onClearSelection,
  getBookingStatus,
  rooms
}) => {
  if (!selectedCell) {
    return (
      <Card className="p-6 h-fit">
        <div className="text-center text-muted-foreground">
          <div className="text-lg font-medium mb-2">Select a slot</div>
          <p className="text-sm">Click a time slot in the table to view details.</p>
        </div>
      </Card>
    );
  }

  const [roomId, timeSlot] = selectedCell.split('-');
  const booking = getBookingStatus(roomId, timeSlot) || [];
  const room = rooms.find(r => r.id === roomId);
  const nextSlot = timeSlots[timeSlots.indexOf(timeSlot) + 1] || timeSlot;
  const remaining = (room?.capacity || 0) - booking.length;

  return (
    <Card className="p-6 h-fit space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Booking Details</h3>
        <Button variant="ghost" size="icon" onClick={onClearSelection} className="h-8 w-8">
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Room Info */}
      <div>
        <div className="text-xl font-bold">{room?.name}</div>
        <div className="text-sm text-muted-foreground">Capacity: {room?.capacity}</div>
        <div className="text-sm text-muted-foreground mt-1">Time: {timeSlot} - {nextSlot}</div>
      </div>

      {/* Players */}
      { booking.length > 0 && <div className="space-y-1">
          <div className="text-sm font-medium text-muted-foreground">
            Players ({booking.length} / {room?.capacity})
          </div>
          <div className="flex flex-col gap-2">
            {booking.map((book, i) => (
              <div key={`${book.id}-${i}`} className="flex items-center gap-3">
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                  book.userLevel === 'advanced'
                    ? 'bg-purple-600 text-white'
                    : 'bg-blue-500 text-white'
                }`}>
                  {book.userLevel === 'advanced' ? 'Advanced' : 'Beginner'}
                </span>
                <span className="text-base font-medium">{book.bookedBy}</span>
              </div>
            ))}
          </div>
        </div>
      }

      {/* Availability Notice */}
      <div className='space-y-20'>
      <div className={remaining === 0 ? "p-4 bg-gray-100 border border-gray-300 rounded-lg" : "p-4 bg-green-50 border border-green-200 rounded-lg"}>
        <div className={remaining === 0 ? "text-gray-500 font-semibold" : "text-green-800 font-semibold"}>
          {remaining === 0 ? "Full" : "Available"}
        </div>
        <div className={remaining === 0 ? "text-gray-500 font-sm" :"text-green-600 text-sm mt-1"}>
          {remaining > 0
            ? `This slot has ${remaining} spot${remaining > 1 ? 's' : ''} left for joining.`
            : `This slot is full.`}
        </div>
      </div>

      <Button
        onClick={onClearSelection}
        className={remaining === 0
          ? "w-full rounded-full font-semibold bg-gray-300 text-gray-500 cursor-not-allowed py-2"
          : "w-full rounded-full font-semibold bg-green-500 hover:bg-green-600 text-white py-2 "
        }
        disabled={remaining === 0}
      >
        {booking.length > 0 ? 'Join Now' : 'Book Now'}
      </Button>
      </div>
    </Card>
  );
};

export default SelectedVenuePanel; 