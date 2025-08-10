import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
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
  const { user } = useAuth();
  const [deleteConfirmBooking, setDeleteConfirmBooking] = useState(null);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);

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
    return null;
  }

  const [roomId, timeSlot] = selectedCell.split('-');
  const booking = getBookingStatus(roomId, timeSlot) || [];
  const room = rooms.find(r => r.id === roomId);
  const nextSlot = timeSlots[timeSlots.indexOf(timeSlot) + 1] || timeSlot;
  const totalPlayers = booking.reduce((sum, book) => sum + book.players, 0);
  const remaining = (room?.capacity || 0) - totalPlayers;

  // 检查当前用户是否已有预订
  const userBooking = booking.find(book => book.bookedBy === user?.username);
  const hasUserBooking = !!userBooking;

  // 检查时间状态
  const today = new Date();
  const isToday = selectedDate &&
    today.getFullYear() === selectedDate.getFullYear() &&
    today.getMonth() === selectedDate.getMonth() &&
    today.getDate() === selectedDate.getDate();

  const isBeforeToday = selectedDate &&
    (selectedDate.getFullYear() < today.getFullYear() ||
      (selectedDate.getFullYear() === today.getFullYear() &&
        selectedDate.getMonth() < today.getMonth()) ||
      (selectedDate.getFullYear() === today.getFullYear() &&
        selectedDate.getMonth() === today.getMonth() &&
        selectedDate.getDate() < today.getDate()));

  let isPastTime = false;
  if (isBeforeToday) {
    isPastTime = true;
  } else if (isToday) {
    const [slotHour, slotMin] = timeSlot.split(':').map(Number);
    const nowMins = today.getHours() * 60 + today.getMinutes();
    const slotMins = slotHour * 60 + slotMin;
    if (slotMins < nowMins) {
      isPastTime = true;
    }
  }

  // 处理离开预订
  const handleLeaveBooking = () => {
    if (!showLeaveConfirm) {
      setShowLeaveConfirm(true);
    } else {
      if (userBooking && onBookingsChange) {
        const updatedBookings = bookings.filter(booking => booking.id !== userBooking.id);
        setShowLeaveConfirm(false);
        onBookingsChange(updatedBookings);
        onClearSelection();
      }
    }
  };

  const cancelLeave = () => {
    setShowLeaveConfirm(false);
  };

  const handleClearSelection = () => {
    setShowLeaveConfirm(false);
    onClearSelection();
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleClearSelection}
    >
      <Card 
        className="p-6 max-w-md mx-4 w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Booking Details</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClearSelection}
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
                  <div 
                    key={`${book.id}-${i}`} 
                    className={`flex items-center gap-3 justify-between p-3 rounded-lg border ${
                      book.bookedBy === user?.username 
                        ? 'bg-blue-50 border-blue-200 ring-2 ring-blue-300' 
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded-full ${
                          book.userLevel === 'advanced'
                            ? 'bg-booking-advanced text-white'
                            : book.userLevel === 'intermediate'
                            ? 'bg-booking-intermediate text-white'
                            : 'bg-booking-beginner text-white'
                        }`}
                      >
                        {book.userLevel === 'advanced' 
                          ? 'Advanced' 
                          : book.userLevel === 'intermediate'
                          ? 'Intermediate'
                          : 'Beginner'}
                      </span>
                      <span className="text-base font-medium flex items-center gap-2">
                        {book.bookedBy === user?.username ? (
                          <span className="flex items-center gap-2">
                            <strong className="text-blue-700">You</strong>
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-semibold">
                              Your Booking
                            </span>
                          </span>
                        ) : (
                          book.bookedBy
                        )}
                        <span className="flex flex-row text-sm font-medium text-muted-foreground">
                          ( {book.players} <User className="pt-1 h-4 w-4" /> )
                        </span>
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

          {/* Availability Notice and Action Button */}
          <div className="space-y-4">
            {isPastTime ? (
              // 时段已过
              <div className="p-4 bg-gray-100 border border-gray-300 rounded-lg">
                <div className="text-gray-500 font-semibold">Time Slot Passed</div>
                <div className="text-gray-500 text-sm mt-1">
                  This time slot has already passed.
                </div>
              </div>
            ) : hasUserBooking ? (
              // 用户已有预订 - 显示成功加入状态
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="text-blue-800 font-semibold">Successfully Joined</div>
                <div className="text-blue-600 text-sm mt-1">
                  You have successfully joined this time slot.
                </div>
              </div>
            ) : remaining === 0 ? (
              // 已满
              <div className="p-4 bg-gray-100 border border-gray-300 rounded-lg">
                <div className="text-gray-500 font-semibold">Full</div>
                <div className="text-gray-500 text-sm mt-1">
                  This slot is full.
                </div>
              </div>
            ) : (
              // 可预订
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="text-green-800 font-semibold">Available</div>
                <div className="text-green-600 text-sm mt-1">
                  This slot has {remaining} spot{remaining > 1 ? 's' : ''} left for joining.
                </div>
              </div>
            )}

            {/* Action Button */}
            {!isPastTime && (
              hasUserBooking ? (
                <div className="space-y-2">
                  <Button
                    onClick={handleLeaveBooking}
                    className={`w-full rounded-full font-semibold py-2 ${
                      showLeaveConfirm 
                        ? 'bg-red-600 hover:bg-red-700 text-white' 
                        : 'bg-red-500 hover:bg-red-600 text-white'
                    }`}
                  >
                    {showLeaveConfirm ? 'Confirm Leave' : 'Leave'}
                  </Button>
                  {showLeaveConfirm && (
                    <Button
                      onClick={cancelLeave}
                      variant="outline"
                      className="w-full rounded-full font-semibold py-2"
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              ) : remaining > 0 ? (
                <Button
                  onClick={handleClearSelection}
                  className="w-full rounded-full font-semibold bg-green-500 hover:bg-green-600 text-white py-2"
                >
                  Join Now
                </Button>
              ) : null
            )}
          </div>
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
    </div>
  );
};

export default SelectedVenuePanel;
