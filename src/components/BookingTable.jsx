import React, { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { RotateCw, CalendarIcon, Filter } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Calendar } from './ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

// Sample data
const rooms = [
  { id: 'room1', name: 'Field 1', capacity: 4 },
  { id: 'room2', name: 'Field 2', capacity: 4 },
  { id: 'room3', name: 'Field 3', capacity: 4 },
  { id: 'room4', name: 'Field 4', capacity: 4 },
  { id: 'room5', name: 'Field 5', capacity: 4 },
  { id: 'room6', name: 'Field 6', capacity: 4 },
  { id: 'room7', name: 'Field 7', capacity: 2 },
  { id: 'room8', name: 'Field 8', capacity: 2 },
  { id: 'room9', name: 'Field 9', capacity: 2 },
];

function generateTimeSlots(start = "08:00", end = "22:00", interval = 20) {
  const slots = [];
  let [hour, minute] = start.split(":").map(Number);
  const [endHour, endMinute] = end.split(":").map(Number);

  while (hour < endHour || (hour === endHour && minute <= endMinute)) {
    slots.push(
      `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`
    );
    minute += interval;
    if (minute >= 60) {
      hour += 1;
      minute -= 60;
    }
  }
  return slots;
}

export const timeSlots = generateTimeSlots();

const todayStr = new Date().toISOString().slice(0, 10);
const sampleBookings = [
  { id: '1', roomId: 'room1', timeSlot: '09:00', date: todayStr, status: 'occupied', bookedBy: 'John Smith', userLevel: 'advanced', userEmail: 'john.smith@company.com' },
  { id: '1', roomId: 'room1', timeSlot: '09:00', date: todayStr, status: 'occupied', bookedBy: 'Tyan B', userLevel: 'beginner', userEmail: 'john.smith@company.com' },
  { id: '1', roomId: 'room1', timeSlot: '09:00', date: todayStr, status: 'occupied', bookedBy: 'Tyan B', userLevel: 'beginner', userEmail: 'john.smith@company.com' },
  { id: '1', roomId: 'room1', timeSlot: '09:00', date: todayStr, status: 'occupied', bookedBy: 'Tyan B', userLevel: 'beginner', userEmail: 'john.smith@company.com' },
  { id: '2', roomId: 'room1', timeSlot: '09:30', date: todayStr, status: 'occupied', bookedBy: 'John Smith', userLevel: 'advanced', userEmail: 'john.smith@company.com' },
  { id: '3', roomId: 'room2', timeSlot: '10:00', date: todayStr, status: 'pending', bookedBy: 'Sarah Johnson', userLevel: 'beginner', userEmail: 'sarah.johnson@company.com' },
  { id: '4', roomId: 'room3', timeSlot: '14:00', date: todayStr, status: 'occupied', bookedBy: 'Mike Davis', userLevel: 'advanced', userEmail: 'mike.davis@company.com' },
  { id: '5', roomId: 'room4', timeSlot: '11:00', date: todayStr, status: 'pending', bookedBy: 'Emily Wilson', userLevel: 'beginner', userEmail: 'emily.wilson@company.com'},
  { id: '6', roomId: 'room5', timeSlot: '15:30', date: todayStr, status: 'occupied', bookedBy: 'David Brown', userLevel: 'advanced', userEmail: 'david.brown@company.com'},
  { id: '7', roomId: 'room7', timeSlot: '13:00', date: todayStr, status: 'occupied', bookedBy: 'Lisa Chen', userLevel: 'beginner', userEmail: 'lisa.chen@company.com' },
  { id: '8', roomId: 'room8', timeSlot: '16:00', date: todayStr, status: 'pending', bookedBy: 'Tom Wilson', userLevel: 'advanced', userEmail: 'tom.wilson@company.com' },
  { id: '9', roomId: 'room9', timeSlot: '10:30', date: todayStr, status: 'occupied', bookedBy: 'Anna Lee', userLevel: 'beginner', userEmail: 'anna.lee@company.com' },
];

const BookingTable = ({ selectedCell, onCellSelect }) => {
  const [isHorizontalTime, setIsHorizontalTime] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filter, setFilter] = useState('all');

  // 新增：用於滾動到當前時間
  const tableScrollRef = useRef(null);
  const timeHeaderRefs = useRef([]);

  useEffect(() => {
    // 取得當前時間
    const now = new Date();
    const pad = (n) => n.toString().padStart(2, '0');
    const nowStr = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
    // 找到最接近的 timeSlot index
    let closestIdx = 0;
    let minDiff = Infinity;
    timeSlots.forEach((slot, idx) => {
      const [h, m] = slot.split(":").map(Number);
      const slotMins = h * 60 + m;
      const [nh, nm] = nowStr.split(":").map(Number);
      const nowMins = nh * 60 + nm;
      const diff = Math.abs(slotMins - nowMins);
      if (diff < minDiff) {
        minDiff = diff;
        closestIdx = idx;
      }
    });
    // 滾動到該 timeSlot header
    if (isHorizontalTime && timeHeaderRefs.current[closestIdx] && tableScrollRef.current) {
      const header = timeHeaderRefs.current[closestIdx];
      const container = tableScrollRef.current;
      if (header && container) {
        container.scrollLeft = header.offsetLeft - 120; // 120 為左側欄寬
      }
    }
  }, [isHorizontalTime]);

  const getBookingStatus = (roomId, timeSlot) => {
    const dateStr = selectedDate ? selectedDate.toISOString().slice(0, 10) : todayStr;
    return sampleBookings.filter(booking => 
      booking.roomId === roomId && booking.timeSlot === timeSlot && booking.date === dateStr
    ) || null;
  };

  const getRoomStatus = (roomId, timeSlot) => {
    const bookings = getBookingStatus(roomId, timeSlot);
    const room = rooms.find(r => r.id === roomId);
    const capacity = room?.capacity || 0;
    
    if (!bookings || bookings.length === 0) {
      return 'available';
    }
    
    const occupancyRatio = bookings.length / capacity;
    
    if (occupancyRatio >= 1) {
      return 'full';
    } else if (occupancyRatio >= 0.5) {
      return 'half-full';
    } else {
      return 'partial';
    }
  };

  const shouldShowRoom = (roomId) => {
    if (filter === 'all') return true;
    
    // Check if any time slot for this room matches the filter
    return timeSlots.some(timeSlot => {
      const status = getRoomStatus(roomId, timeSlot);
      return status === filter;
    });
  };

  const filteredRooms = rooms.filter(room => shouldShowRoom(room.id));

  const getCellClass = (roomId, timeSlot) => {
    const bookings = getBookingStatus(roomId, timeSlot);
    const cellId = `${roomId}-${timeSlot}`;
    const isSelected = selectedCell === cellId;
    const room = rooms.find(r => r.id === roomId);
    const capacity = room?.capacity || 0;
    
    let baseClass = "h-12 border border-grid-border transition-all duration-200 cursor-pointer text-xs font-medium flex items-center justify-center relative overflow-hidden ";
    
    if (isSelected) {
      baseClass += "border-2 border-primary ";
    }
    
    let isPast = false;
    const today = new Date();
    const isToday = selectedDate &&
      today.getFullYear() === selectedDate.getFullYear() &&
      today.getMonth() === selectedDate.getMonth() &&
      today.getDate() === selectedDate.getDate();

    const isBeforeToday = selectedDate &&
      (selectedDate.getFullYear() < today.getFullYear() ||
        (selectedDate.getFullYear() === today.getFullYear() && selectedDate.getMonth() < today.getMonth()) ||
        (selectedDate.getFullYear() === today.getFullYear() && selectedDate.getMonth() === today.getMonth() && selectedDate.getDate() < today.getDate()));

    if (isBeforeToday) {
      isPast = true;
    } else if (isToday) {
      const [slotHour, slotMin] = timeSlot.split(":").map(Number);
      const nowMins = today.getHours() * 60 + today.getMinutes();
      const slotMins = slotHour * 60 + slotMin;
      if (slotMins < nowMins) {
        isPast = true;
      }
    }
    // 未來日期 isPast 保持 false
    if (!bookings || bookings.length === 0) {
      return baseClass + (isPast ? "opacity-50 bg-gray-100 " : "") + "bg-card hover:bg-grid-hover text-muted-foreground hover:text-foreground";
    }
    // Determine room status based on occupancy
    const occupancyRatio = bookings.length / capacity;
    let statusClass = "";
    if (occupancyRatio >= 1) {
      statusClass = "bg-booking-occupied text-white hover:opacity-90";
    } else if (occupancyRatio >= 0.5) {
      statusClass = "bg-booking-half-full text-white hover:opacity-90";
    } else {
      statusClass = "bg-booking-partial text-white hover:opacity-90";
    }
    return baseClass + (isPast ? "opacity-50 bg-gray-100 text-black" : "") + statusClass;
  };

  const handleCellClick = (roomId, timeSlot) => {
    const cellId = `${roomId}-${timeSlot}`;
    onCellSelect(selectedCell === cellId ? null : cellId);
  };

  const toggleAxis = () => {
    setIsHorizontalTime(!isHorizontalTime);
    onCellSelect(null);
  };

  const renderCell = (roomId, timeSlot) => {
    const booking = getBookingStatus(roomId, timeSlot);
    const cellClass = getCellClass(roomId, timeSlot);
    const room = rooms.find(r => r.id === roomId);
    
    if (booking.length == 0) {
      return (
        <div
          key={`${roomId}-${timeSlot}`}
          className={cellClass}
          onClick={() => handleCellClick(roomId, timeSlot)}
          title="Available"
        >
          {/* <div className="text-xs text-grey-100">0/{room.capacity}</div> */}
        </div>
      );
    }

    return (
      <TooltipProvider key={`${roomId}-${timeSlot}`}>
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className={cellClass}
              onClick={() => handleCellClick(roomId, timeSlot)}
            >
              <div className="text-center space-y-1">
                <div className='flex flex-row space-x-1'>         
                  {/* <div className={`w-4 h-4 border border-grid-border rounded ${booking[0].userLevel === 'advanced' ? 'bg-booking-advanced' : 'bg-booking-beginner'} `} /> */}
                  <div className="font-bold">{booking[0].bookedBy?.split(' ')[0]}</div>      
                  <div className="text-xs">{booking.length}/{(room?.capacity || 0)}</div>
                </div>
                <div className='flex flex-row space-x-1'>         
                {Array.from({ length: room?.capacity || 0 }).map((_, i) => {
                  const book = booking[i];
                  return (
                    <div className='flex flex-row space-x-1' key={i}>
                      <div className={
                        book
                          ? `w-3 h-3 border border-grid-border rounded ${book.userLevel === 'advanced' ? 'bg-booking-advanced' : 'bg-booking-beginner'}`
                          : 'w-3 h-3 border border-grid-border rounded bg-white'
                      } />
                    </div>
                  );
                })}
                </div>
                <div>
                </div>
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent side="top" className="p-4 max-w-xs">
            <div className="space-y-2">
            <div><strong>Players:</strong> </div>
              {booking.map((book, i) => (
                <div className='flex flex-row space-x-2' key={i}>         
                  <div className={`w-4 h-4 border border-grid-border rounded ${book.userLevel === 'advanced' ? 'bg-booking-advanced' : 'bg-booking-beginner'} `} />
                  <div className="font-semibold">{book.bookedBy}</div>
                </div>
              ))}
              <div className="text-sm space-y-1">
                <div><strong>Field:</strong> {room?.name} ({booking.length}/{(room?.capacity || 0)})</div>
                <div><strong>Time:</strong> {timeSlot}</div>
                <div><strong>Status:</strong> {booking.length >= (room?.capacity || 0) ? 'Full' : booking.length >= (room?.capacity || 0) / 2 ? 'Half Full' : 'Available'}</div>
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">Booking Table</h2>
      </div>
      <Card className="p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-6">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            {/* Date Picker */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full sm:w-[200px] justify-start text-left font-normal",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>

            {/* Filter */}
            <Select value={filter} onValueChange={(value) => setFilter(value)}>
              <SelectTrigger className="w-full sm:w-[140px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Rooms</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="half-full">Half Full</SelectItem>
                <SelectItem value="full">Full</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-wrap gap-2 text-sm justify-end overflow-x-auto">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-card border border-grid-border rounded"></div>
              <span>Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-booking-partial border border-grid-border rounded"></div>
              <span>Partially Booked</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-booking-half-full rounded"></div>
              <span>Half Full</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-booking-occupied rounded"></div>
              <span>Full</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-booking-beginner rounded"></div>
              <span>Beginner</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-booking-advanced rounded"></div>
              <span>Advanced</span>
            </div>
          </div>
        </div>
      </Card>

     {/* Legend */}


      {/* Table */}
      <Card className="overflow-hidden">
        <div className="max-h-[calc(100vh-300px)] overflow-auto" ref={tableScrollRef}>
          {isHorizontalTime ? (
            // Time horizontal, rooms vertical
            <div className="min-w-full">
              <div
                 className="grid min-w-max"
                style={{ gridTemplateColumns: `120px repeat(${timeSlots.length}, 80px)` }}
              >
                {/* Header row */}
                <div className="bg-grid-header border-b border-grid-border p-3 font-semibold text-sm sticky top-0 left-0 z-30" style={{ width: 120, minWidth: 120, maxWidth: 120 }}>
                  Field / Time
                </div>
                {timeSlots.map((time, idx) => (
                  <div
                    key={time}
                    ref={el => timeHeaderRefs.current[idx] = el}
                    className="bg-grid-header border-b border-l border-grid-border p-3 text-center font-medium text-sm sticky top-0 z-20"
                    style={{ width: 80, minWidth: 80, maxWidth: 80 }}
                  >
                    {time}
                  </div>
                ))}
                {/* Data rows */}
                {filteredRooms.map(room => [
                  <div
                    key={`${room.id}-header`}
                    className="bg-grid-header border-b border-grid-border p-3 font-medium text-sm flex items-center sticky left-0 z-20 h-full"
                    style={{ width: 120, minWidth: 120, maxWidth: 120 }}
                  >
                    {room.name}
                  </div>,
                  ...timeSlots.map(time => renderCell(room.id, time))
                ]).flat()}
              </div>
            </div>
          ) : (
            // Rooms horizontal, time vertical
            <div className="min-w-full">
              <div
                className="grid"
                style={{ gridTemplateColumns: `120px repeat(${filteredRooms.length}, 100px)` }}
              >
                {/* Header row */}
                <div className="bg-grid-header border-b border-grid-border p-3 font-semibold text-sm sticky top-0 left-0 z-30" style={{ width: 120, minWidth: 120, maxWidth: 120 }}>
                  Time / Room
                </div>
                {filteredRooms.map(room => (
                  <div
                    key={room.id}
                    className="bg-grid-header border-b border-l border-grid-border p-3 text-center font-medium text-sm sticky top-0 z-20"
                    style={{ width: 100, minWidth: 100, maxWidth: 100 }}
                  >
                    {room.name}
                  </div>
                ))}
                {/* Data rows */}
                {timeSlots.map(time => [
                  <div
                    key={`${time}-header`}
                    className="bg-grid-header border-b border-grid-border p-3 font-medium text-sm flex items-center justify-center sticky left-0 z-20"
                    style={{ width: 120, minWidth: 120, maxWidth: 120 }}
                  >
                    {time}
                  </div>,
                  ...filteredRooms.map(room => renderCell(room.id, time))
                ]).flat()}
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default BookingTable;
export { rooms, sampleBookings };