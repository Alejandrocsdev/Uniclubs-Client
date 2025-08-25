import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from './ui/card';
import { X, User, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { timeSlots } from './BookingTable';
import { TIME_MARGIN_MINUTES } from '@/config/booking';

const SelectedVenuePanel = ({
  selectedCell,
  onClearSelection,
  getBookingStatus,
  rooms,
  selectedDate,
  isEditMode,
  bookings,
  onBookingsChange,
  selectedPlayers,
}) => {
  const { user } = useAuth();
  
  const [deleteConfirmBooking, setDeleteConfirmBooking] = useState(null);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [showCannotCancelConfirm, setShowCannotCancelConfirm] = useState(null);

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
    // 使用时间缓冲常量：只有超过时间段开始时间指定分钟后才标记为过去
    if (slotMins + TIME_MARGIN_MINUTES < nowMins) {
      isPastTime = true;
    }
  }

  // 处理离开预订
  const handleLeaveBooking = () => {
    // 新增：检查预订是否已经开始缓冲时间
    if (isToday && !isPastTime) {
      const [slotHour, slotMin] = timeSlot.split(':').map(Number);
      const slotMins = slotHour * 60 + slotMin;
      const nowMins = today.getHours() * 60 + today.getMinutes();
      const timeDiff = nowMins - slotMins;
      if (timeDiff < 0) {
        // 预订还没有开始，可以正常取消
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
      } else if (timeDiff >= 0 && timeDiff <= TIME_MARGIN_MINUTES) {
        // 预订已经开始但未超过缓冲时间，仍然可以取消
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
      } else if (timeDiff > TIME_MARGIN_MINUTES) {
        // 预订已经开始超过缓冲时间，无法取消
        setShowCannotCancelConfirm({
          timeSlot,
          startTime: `${slotHour.toString().padStart(2, '0')}:${slotMin.toString().padStart(2, '0')}`,
          elapsedMinutes: timeDiff
        });
        return;
      }
    } else {
      // 非今天或已过去的时间，正常处理
      if (!showLeaveConfirm) {
        setShowLeaveConfirm(true);
      } else {
        if (userBooking && onBookingsChange) {
          const updatedBookings = bookings.filter(booking => booking.id !== userBooking.id);
          console.log('updatedBookings', updatedBookings);
          setShowLeaveConfirm(false);
          onBookingsChange(updatedBookings);
          onClearSelection();
        }
      }
    }
  };

  const cancelLeave = () => {
    setShowLeaveConfirm(false);
  };

  const handleCannotCancelConfirm = () => {
    setShowCannotCancelConfirm(null);
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
            <h3 className="text-lg font-semibold text-foreground">Booking Details</h3>
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
          <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
            <div className="text-lg font-semibold text-gray-700">{room?.name}</div>
            <div className="text-sm text-gray-500 mt-1">
              Capacity: {room?.capacity} • Time: {timeSlot} - {nextSlot}
            </div>
          </div>

          {/* Players */}
          {booking.length > 0 && (
            <div className="space-y-2">
              <div className="text-sm font-medium text-foreground">
                Players ( {booking.reduce((sum, book) => sum + book.players, 0)} / {room?.capacity} )
              </div>
              <div className="space-y-2">
                {booking.map((book, i) => (
                  <div 
                    key={`${book.id}-${i}`} 
                    className={`flex items-center justify-between p-2.5 rounded-lg border ${
                      book.bookedBy === user?.username 
                        ? 'bg-blue-50 border-blue-200' 
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div>
                        <div className="text-sm font-medium flex items-center gap-2">
                          {book.bookedBy === user?.username ? (
                            <span className="text-blue-700 font-semibold">You</span>
                          ) : (
                            <span className="text-gray-700">{book.bookedBy}</span>
                          )}
                          <span className="text-xs text-muted-foreground">
                            ({book.players} player{book.players > 1 ? 's' : ''})
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {book.userLevel}
                        </div>
                      </div>
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
          <div className="space-y-3">
            {isPastTime ? (
              // 时段已过
              <div className="p-3 bg-gray-100 border border-gray-300 rounded-lg">
                <div className="text-gray-700 font-medium">Time Slot Passed</div>
                <div className="text-gray-500 text-sm mt-1">
                  This time slot has already passed.
                </div>
              </div>
            ) : hasUserBooking ? (
              // 用户已有预订 - 显示成功加入状态
              <div className="p-3 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 border border-purple-200 rounded-lg">
                <div className="text-purple-700 font-medium">Successfully Joined</div>
                <div className="text-purple-600 text-sm mt-1">
                  You have successfully joined this time slot.
                </div>
              </div>
            ) : remaining === 0 ? (
              // 已满
              <div className="p-3 bg-gray-100 border border-gray-300 rounded-lg">
                <div className="text-gray-700 font-medium">Full</div>
                <div className="text-gray-500 text-sm mt-1">
                  This slot is full.
                </div>
              </div>
            ) : parseInt(selectedPlayers) > remaining ? (
              // 选择人数超过可容纳人数
              <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="text-orange-700 font-medium">Insufficient Capacity</div>
                <div className="text-orange-600 text-sm mt-1">
                  You selected {selectedPlayers} player{parseInt(selectedPlayers) > 1 ? 's' : ''}, but only {remaining} spot{remaining > 1 ? 's' : ''} available.
                </div>
              </div>
            ) : (
              // 可预订
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="text-green-700 font-medium">Available</div>
                <div className="text-green-600 text-sm mt-1">
                  This slot has {remaining} spot{remaining > 1 ? 's' : ''} left for joining.
                </div>
              </div>
            )}

            {/* Action Button */}
            {!isPastTime && (
              hasUserBooking ? (
                <div className="space-y-2">
                  {showLeaveConfirm && (
                    <Button
                      onClick={cancelLeave}
                      variant="outline"
                      className="w-full sm:flex-none font-semibold py-2"
                    >
                      Cancel
                    </Button>
                  )}
                  <Button
                    onClick={handleLeaveBooking}
                    className={`w-full sm:flex-none font-semibold py-2 ${
                      showLeaveConfirm 
                        ? 'bg-red-600 hover:bg-red-700 text-white' 
                        : 'bg-red-500 hover:bg-red-600 text-white'
                    }`}
                  >
                    {showLeaveConfirm ? 'Confirm Leave' : 'Leave'}
                  </Button>
                </div>
              ) : remaining > 0 && parseInt(selectedPlayers) <= remaining ? (
                <Button
                  onClick={handleClearSelection}
                  className="w-full rounded-full font-semibold bg-green-500 hover:bg-green-600 text-white py-2"
                >
                  Join Now
                </Button>
              ) : remaining > 0 && parseInt(selectedPlayers) > remaining ? (
                <Button
                  disabled
                  className="w-full rounded-full font-semibold bg-gray-400 text-gray-600 py-2 cursor-not-allowed"
                >
                  Insufficient Capacity
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
              className="p-6 max-w-md mx-4 w-full"
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

        {/* Cannot Cancel Booking Modal */}
        {showCannotCancelConfirm && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={handleCannotCancelConfirm}
          >
            <Card 
              className="p-6 max-w-md mx-4 w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Cannot Cancel Booking</h3>
                <p className="text-sm text-muted-foreground">
                  Your booking at <strong>{showCannotCancelConfirm.startTime}</strong> has already started for {showCannotCancelConfirm.elapsedMinutes} minute(s). 
                  Bookings cannot be cancelled after they have started for more than 3 minutes.
                </p>
                <div className="flex justify-end">
                  <Button 
                    onClick={handleCannotCancelConfirm}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    OK
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
