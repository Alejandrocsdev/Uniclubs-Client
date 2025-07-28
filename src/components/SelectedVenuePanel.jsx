import React, { useState } from 'react';
import { Card } from './ui/card';
import { X, User, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { timeSlots } from './BookingTable';

const SelectedVenuePanel = ({
  selectedCell,
  onClearSelection,
  getBookingStatus,
  rooms,
  selectedDate,
  isEditMode,
  bookings,
  onBookingsChange,
}) => {
  const [deleteConfirmBooking, setDeleteConfirmBooking] = useState(null);

  const handleDeleteBooking = (booking) => {
    setDeleteConfirmBooking(booking);
  };

  const confirmDeleteBooking = () => {
    if (deleteConfirmBooking && onBookingsChange) {
      const updatedBookings = bookings.filter(booking => booking.id !== deleteConfirmBooking.id);
      onBookingsChange(updatedBookings);
      setDeleteConfirmBooking(null);
    }
  };

  const cancelDeleteBooking = () => {
    setDeleteConfirmBooking(null);
  };

  if (!selectedCell) {
    return (
      <Card className="p-6 h-fit">
        <div className="text-center text-muted-foreground">
          <div className="text-lg font-medium mb-2">Select a slot</div>
          <p className="text-sm">
            Click a time slot in the table to view details.
          </p>
        </div>
      </Card>
    );
  }

  const [roomId, timeSlot] = selectedCell.split('-');
  const booking = getBookingStatus(roomId, timeSlot) || [];
  const room = rooms.find(r => r.id === roomId);
  const nextSlot = timeSlots[timeSlots.indexOf(timeSlot) + 1] || timeSlot;
  const totalPlayers = booking.reduce((sum, book) => sum + book.players, 0);
  const remaining = (room?.capacity || 0) - totalPlayers;

  return (
    <Card className="p-6 h-fit space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Booking Details</h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClearSelection}
          className="h-8 w-8"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Room Info */}
      <div>
        <div className="text-xl font-bold">{room?.name}</div>
        <div className="text-sm text-muted-foreground">
          Capacity: {room?.capacity}
        </div>
        <div className="text-sm text-muted-foreground mt-1">
          Time: {timeSlot} - {nextSlot}
        </div>
      </div>

      {/* Players */}
      {booking.length > 0 && (
        <div className="space-y-1">
          <div className="font-bold text-base">
            Players ( {booking.reduce((sum, book) => sum + book.players, 0)} / {room?.capacity} )
          </div>
          <div className="flex flex-col gap-2">
            {booking.map((book, i) => (
              <div key={`${book.id}-${i}`} className="flex items-center gap-3 justify-between">
                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      book.userLevel === 'advanced'
                        ? 'bg-purple-600 text-white'
                        : 'bg-blue-500 text-white'
                    }`}
                  >
                    {book.userLevel === 'advanced' ? 'Advanced' : 'Beginner'}
                  </span>
                  <span className="text-base font-medium flex items-center gap-2">
                    {book.bookedBy}   <span className="flex flex-row text-sm font-medium text-muted-foreground">( {book.players} <User className="pt-1 h-4 w-4" /> ) </span>
                  </span>
                </div>
                {isEditMode && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0 flex items-center justify-center text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleDeleteBooking(book)}
                    title="Delete booking"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Availability Notice */}
      <div className="space-y-20">
        <div
          className={
            remaining === 0
              ? 'p-4 bg-gray-100 border border-gray-300 rounded-lg'
              : 'p-4 bg-green-50 border border-green-200 rounded-lg'
          }
        >
          <div
            className={
              remaining === 0
                ? 'text-gray-500 font-semibold'
                : 'text-green-800 font-semibold'
            }
          >
            {remaining === 0 ? 'Full' : 'Available'}
          </div>
          <div
            className={
              remaining === 0
                ? 'text-gray-500 font-sm'
                : 'text-green-600 text-sm mt-1'
            }
          >
            {remaining > 0
              ? `This slot has ${remaining} spot${remaining > 1 ? 's' : ''} left for joining.`
              : `This slot is full.`}
          </div>
        </div>

        <Button
          onClick={onClearSelection}
          className={
            remaining === 0
              ? 'w-full rounded-full font-semibold bg-gray-300 text-gray-500 cursor-not-allowed py-2'
              : 'w-full rounded-full font-semibold bg-green-500 hover:bg-green-600 text-white py-2 '
          }
          disabled={remaining === 0}
        >
          {booking.length > 0 ? 'Join Now' : 'Book Now'}
        </Button>
      </div>

      {/* Delete Booking Confirmation Modal */}
      {deleteConfirmBooking && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={cancelDeleteBooking}
        >
          <Card 
            className="p-6 max-w-md mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Confirm Delete Booking</h3>
              <p className="text-sm text-muted-foreground">
                Are you sure you want to delete the booking for <strong>{deleteConfirmBooking.bookedBy}</strong>? This action cannot be undone.
              </p>
              <div className="flex flex-col sm:flex-row gap-2 justify-end">
                <Button 
                  variant="outline" 
                  onClick={cancelDeleteBooking}
                  className="flex-1 sm:flex-none"
                >
                  Cancel
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={confirmDeleteBooking}
                  className="flex-1 sm:flex-none"
                >
                  Delete Booking
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </Card>
  );
};

export default SelectedVenuePanel;
