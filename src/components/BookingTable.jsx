import React, { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { RotateCw, CalendarIcon, Filter, User, Settings, Plus, Edit2, Check, X, Trash2 } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Calendar } from './ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

// Sample data
const initialRooms = [
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

function generateTimeSlots(start = '08:00', end = '22:00', interval = 20) {
  const slots = [];
  let [hour, minute] = start.split(':').map(Number);
  const [endHour, endMinute] = end.split(':').map(Number);

  while (hour < endHour || (hour === endHour && minute <= endMinute)) {
    slots.push(
      `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
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
const initialBookings = [
  {
    id: '1',
    roomId: 'room1',
    timeSlot: '09:00',
    date: todayStr,
    status: 'occupied',
    bookedBy: 'John Smith',
    userLevel: 'advanced',
    userEmail: 'john.smith@company.com',
    players: 1,
  },

  {
    id: '1',
    roomId: 'room1',
    timeSlot: '09:00',
    date: todayStr,
    status: 'occupied',
    bookedBy: 'Tyan B',
    userLevel: 'beginner',
    userEmail: 'john.smith@company.com',
    players: 1,
  },
  {
    id: '1',
    roomId: 'room1',
    timeSlot: '09:00',
    date: todayStr,
    status: 'occupied',
    bookedBy: 'Tyan B',
    userLevel: 'beginner',
    userEmail: 'john.smith@company.com',
    players: 1,
  },
  {
    id: '2',
    roomId: 'room1',
    timeSlot: '09:30',
    date: todayStr,
    status: 'occupied',
    bookedBy: 'John Smith',
    userLevel: 'advanced',
    userEmail: 'john.smith@company.com',
    players: 4,
  },
  {
    id: '3',
    roomId: 'room2',
    timeSlot: '10:00',
    date: todayStr,
    status: 'pending',
    bookedBy: 'Sarah Johnson',
    userLevel: 'beginner',
    userEmail: 'sarah.johnson@company.com',
    players: 1,
  },
  {
    id: '4',
    roomId: 'room3',
    timeSlot: '14:00',
    date: todayStr,
    status: 'occupied',
    bookedBy: 'Mike Davis',
    userLevel: 'advanced',
    userEmail: 'mike.davis@company.com',
    players: 1,
  },
  {
    id: '5',
    roomId: 'room4',
    timeSlot: '11:00',
    date: todayStr,
    status: 'pending',
    bookedBy: 'Emily Wilson',
    userLevel: 'beginner',
    userEmail: 'emily.wilson@company.com',
    players: 1,
  },
  {
    id: '6',
    roomId: 'room5',
    timeSlot: '15:30',
    date: todayStr,
    status: 'occupied',
    bookedBy: 'David Brown',
    userLevel: 'advanced',
    userEmail: 'david.brown@company.com',
    players: 1,
  },
  {
    id: '7',
    roomId: 'room7',
    timeSlot: '13:00',
    date: todayStr,
    status: 'occupied',
    bookedBy: 'Lisa Chen',
    userLevel: 'beginner',
    userEmail: 'lisa.chen@company.com',
    players: 4,
  },
  {
    id: '8',
    roomId: 'room8',
    timeSlot: '16:00',
    date: todayStr,
    status: 'pending',
    bookedBy: 'Tom Wilson',
    userLevel: 'advanced',
    userEmail: 'tom.wilson@company.com',
    players: 2,
  },
  {
    id: '9',
    roomId: 'room9',
    timeSlot: '10:30',
    date: todayStr,
    status: 'occupied',
    bookedBy: 'Anna Lee',
    userLevel: 'beginner',
    userEmail: 'anna.lee@company.com',
    players: 1,
  },
];

const BookingTable = ({ 
  selectedCell, 
  onCellSelect, 
  bookings: externalBookings, 
  onBookingsChange,
  selectedDate: externalSelectedDate,
  onSelectedDateChange,
  isEditMode: externalIsEditMode,
  onEditModeChange
}) => {
  const [isHorizontalTime, setIsHorizontalTime] = useState(true);
  const [selectedDate, setSelectedDate] = useState(externalSelectedDate || new Date());
  const [filter, setFilter] = useState('all');
  const [bookings, setBookings] = useState(externalBookings || initialBookings);
  const [selectedPlayers, setSelectedPlayers] = useState('1');
  const [selectedLevel, setSelectedLevel] = useState('beginner');
  const [rooms, setRooms] = useState(initialRooms);
  const [editRoomName, setEditRoomName] = useState('');
  const [editRoomCapacity, setEditRoomCapacity] = useState('4');
  const [deleteConfirmRoom, setDeleteConfirmRoom] = useState(null);
  const [editModalRoom, setEditModalRoom] = useState(null);
  const [showAddRoomModal, setShowAddRoomModal] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomCapacity, setNewRoomCapacity] = useState('4');
  const [isEditMode, setIsEditMode] = useState(externalIsEditMode || false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  // 同步外部传入的 bookings
  useEffect(() => {
    if (externalBookings) {
      setBookings(externalBookings);
    }
  }, [externalBookings]);

  // 同步外部传入的 selectedDate
  useEffect(() => {
    if (externalSelectedDate) {
      setSelectedDate(externalSelectedDate);
    }
  }, [externalSelectedDate]);

  // 同步外部传入的 isEditMode
  useEffect(() => {
    if (externalIsEditMode !== undefined) {
      setIsEditMode(externalIsEditMode);
    }
  }, [externalIsEditMode]);

  // 当内部 bookings 状态改变时，通知父组件
  useEffect(() => {
    if (onBookingsChange) {
      onBookingsChange(bookings);
    }
  }, [bookings, onBookingsChange]);

  // 当内部 selectedDate 状态改变时，通知父组件
  useEffect(() => {
    if (onSelectedDateChange) {
      onSelectedDateChange(selectedDate);
    }
  }, [selectedDate, onSelectedDateChange]);

  // 当内部 isEditMode 状态改变时，通知父组件
  useEffect(() => {
    if (onEditModeChange) {
      onEditModeChange(isEditMode);
    }
  }, [isEditMode, onEditModeChange]);

  // 新增：用於滾動到當前時間
  const tableScrollRef = useRef(null);
  const timeHeaderRefs = useRef([]);

  useEffect(() => {
    // 取得當前時間
    const now = new Date();
    const pad = n => n.toString().padStart(2, '0');
    const nowStr = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
    // 找到最接近的 timeSlot index
    let closestIdx = 0;
    let minDiff = Infinity;
    timeSlots.forEach((slot, idx) => {
      const [h, m] = slot.split(':').map(Number);
      const slotMins = h * 60 + m;
      const [nh, nm] = nowStr.split(':').map(Number);
      const nowMins = nh * 60 + nm;
      const diff = Math.abs(slotMins - nowMins);
      if (diff < minDiff) {
        minDiff = diff;
        closestIdx = idx;
      }
    });
    // 滾動到該 timeSlot header
    if (
      isHorizontalTime &&
      timeHeaderRefs.current[closestIdx] &&
      tableScrollRef.current
    ) {
      const header = timeHeaderRefs.current[closestIdx];
      const container = tableScrollRef.current;
      if (header && container) {
        container.scrollLeft = header.offsetLeft - 120; // 120 為左側欄寬
      }
    }
  }, [isHorizontalTime]);

  const getBookingStatus = (roomId, timeSlot) => {
    const dateStr = selectedDate
      ? selectedDate.toISOString().slice(0, 10)
      : todayStr;
    return (
      bookings.filter(
        booking =>
          booking.roomId === roomId &&
          booking.timeSlot === timeSlot &&
          booking.date === dateStr
      ) || null
    );
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

  const shouldShowRoom = roomId => {
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

    let baseClass =
      'h-14 border border-gray-300 transition-all duration-200 cursor-pointer text-xs font-medium flex items-center justify-center relative overflow-hidden m-0.5 rounded-sm ';

    if (isSelected) {
      baseClass += 'ring-2 ring-primary ring-inset shadow-sm ';
    }

    let isPast = false;
    const today = new Date();
    const isToday =
      selectedDate &&
      today.getFullYear() === selectedDate.getFullYear() &&
      today.getMonth() === selectedDate.getMonth() &&
      today.getDate() === selectedDate.getDate();

    const isBeforeToday =
      selectedDate &&
      (selectedDate.getFullYear() < today.getFullYear() ||
        (selectedDate.getFullYear() === today.getFullYear() &&
          selectedDate.getMonth() < today.getMonth()) ||
        (selectedDate.getFullYear() === today.getFullYear() &&
          selectedDate.getMonth() === today.getMonth() &&
          selectedDate.getDate() < today.getDate()));

    if (isBeforeToday) {
      isPast = true;
    } else if (isToday) {
      const [slotHour, slotMin] = timeSlot.split(':').map(Number);
      const nowMins = today.getHours() * 60 + today.getMinutes();
      const slotMins = slotHour * 60 + slotMin;
      if (slotMins < nowMins) {
        isPast = true;
      }
    }
    
    // 检查是否有当前用户的预订
    const hasUserBooking = bookings && bookings.some(booking => booking.bookedBy === 'New User');
    
    // 未來日期 isPast 保持 false
    if (!bookings || bookings.length === 0) {
      return (
        baseClass +
        (isPast ? 'opacity-50 bg-gray-100 ' : '') +
        'bg-card hover:bg-grid-hover text-muted-foreground hover:text-foreground'
      );
    }
    
    // 如果有当前用户的预订，使用特殊颜色
    if (hasUserBooking) {
      return (
        baseClass +
        (isPast ? 'opacity-50 bg-gray-100 text-black' : '') +
        'bg-booking-user text-white hover:opacity-90'
      );
    }
    
    // Determine room status based on occupancy
    const occupancyRatio = bookings.length / capacity;
    let statusClass = '';
    if (occupancyRatio >= 1) {
      statusClass = 'bg-booking-occupied text-white hover:opacity-90';
    } else if (occupancyRatio >= 0.5) {
      statusClass = 'bg-booking-half-full text-white hover:opacity-90';
    } else {
      statusClass = 'bg-booking-partial text-white hover:opacity-90';
    }
    return (
      baseClass +
      (isPast ? 'opacity-50 bg-gray-100 text-black' : '') +
      statusClass
    );
  };

  const handleCellClick = (roomId, timeSlot) => {
    const cellId = `${roomId}-${timeSlot}`;
    const dateStr = selectedDate
      ? selectedDate.toISOString().slice(0, 10)
      : todayStr;
    
    // 检查是否已有预订
    const existingBookings = getBookingStatus(roomId, timeSlot);
    const room = rooms.find(r => r.id === roomId);
    const capacity = room?.capacity || 0;
    
    // 检查当前用户在当前时间段的所有场地是否已有预订
    const userBookingInTimeSlot = bookings.find(booking => 
      booking.timeSlot === timeSlot && 
      booking.date === dateStr && 
      booking.bookedBy === 'New User'
    );
    
    // 检查当前用户在当前场地和时间段是否已有预订
    const userBookingInCurrentRoom = existingBookings.find(booking => booking.bookedBy === 'New User');
    
    if (userBookingInCurrentRoom) {
      // 如果用户在当前场地已有预订，则移除它
      setBookings(prevBookings => 
        prevBookings.filter(booking => 
          !(booking.roomId === roomId && 
            booking.timeSlot === timeSlot && 
            booking.date === dateStr && 
            booking.bookedBy === 'New User')
        )
      );
    } else {
      // 先移除该用户在同一时段其他场地的预订（如果有的话）
      if (userBookingInTimeSlot) {
        setBookings(prevBookings => 
          prevBookings.filter(booking => 
            !(booking.timeSlot === timeSlot && 
              booking.date === dateStr && 
              booking.bookedBy === 'New User')
          )
        );
      }
      
      // 计算当前已有的玩家总数
      const currentPlayerCount = existingBookings.reduce((total, booking) => total + booking.players, 0);
      const selectedPlayerCount = parseInt(selectedPlayers, 10);
      
      // 检查是否超过容量
      if (currentPlayerCount + selectedPlayerCount > capacity) {
        alert(`Cannot add booking: Selected ${selectedPlayerCount} player(s) plus existing ${currentPlayerCount} player(s) would exceed venue capacity of ${capacity}.`);
        return;
      }
      
      // 添加新预订
      const newBooking = {
        id: Date.now().toString(), // 使用时间戳作为临时ID
        roomId: roomId,
        timeSlot: timeSlot,
        date: dateStr,
        status: 'occupied',
        bookedBy: 'New User', // 可以后续修改为实际用户
        userLevel: selectedLevel, // 使用当前选中的级别
        userEmail: 'new.user@company.com',
        players: selectedPlayerCount, // 使用当前选中的玩家数量
      };
      
      setBookings(prevBookings => [...prevBookings, newBooking]);
    }
    
    onCellSelect(selectedCell === cellId ? null : cellId);
  };

  const toggleAxis = () => {
    setIsHorizontalTime(!isHorizontalTime);
    onCellSelect(null);
  };

  const handleEditRoom = (room) => {
    setEditModalRoom(room);
    setEditRoomName(room.name);
    setEditRoomCapacity(room.capacity.toString());
  };

  const handleSaveRoom = () => {
    if (!editRoomName.trim()) {
      alert('Please enter field name');
      return;
    }
    
    setRooms(prevRooms => 
      prevRooms.map(room => 
        room.id === editModalRoom.id 
          ? { ...room, name: editRoomName.trim(), capacity: parseInt(editRoomCapacity, 10) }
          : room
      )
    );
    
    setEditModalRoom(null);
    setEditRoomName('');
    setEditRoomCapacity('4');
  };

  const handleCancelEdit = () => {
    setEditModalRoom(null);
    setEditRoomName('');
    setEditRoomCapacity('4');
  };

  const handleDeleteRoom = (roomId) => {
    setDeleteConfirmRoom(roomId);
  };

  const confirmDeleteRoom = () => {
    if (deleteConfirmRoom) {
      // 删除相关的预订记录
      setBookings(prevBookings => 
        prevBookings.filter(booking => booking.roomId !== deleteConfirmRoom)
      );
      
      // 删除房间
      setRooms(prevRooms => 
        prevRooms.filter(room => room.id !== deleteConfirmRoom)
      );
      
      setDeleteConfirmRoom(null);
    }
  };

  const cancelDeleteRoom = () => {
    setDeleteConfirmRoom(null);
  };

  const handleAddRoom = () => {
    setShowAddRoomModal(true);
  };

  const handleSaveNewRoom = () => {
    if (!newRoomName.trim()) {
      alert('Please enter field name');
      return;
    }
    
    const roomId = `room${Date.now()}`;
    const newRoom = {
      id: roomId,
      name: newRoomName.trim(),
      capacity: parseInt(newRoomCapacity, 10)
    };
    
    setRooms(prevRooms => [...prevRooms, newRoom]);
    
    // Reset form and close modal
    setNewRoomName('');
    setNewRoomCapacity('4');
    setShowAddRoomModal(false);
  };

  const handleCancelAddRoom = () => {
    setNewRoomName('');
    setNewRoomCapacity('4');
    setShowAddRoomModal(false);
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
                <div className="grid grid-cols-2 gap-1 justify-center">
                  {/* 显示所有预订的总玩家数 */}
                  {Array.from({ 
                    length: booking.reduce((total, book) => total + book.players, 0) 
                  }).map((_, i) => {
                    // 找到对应的预订和玩家索引
                    let playerIndex = 0;
                    let bookingIndex = 0;
                    let currentBook = booking[0];
                    
                    for (let b = 0; b < booking.length; b++) {
                      if (i < playerIndex + booking[b].players) {
                        bookingIndex = b;
                        currentBook = booking[b];
                        break;
                      }
                      playerIndex += booking[b].players;
                    }
                    
                    return (
                      <div
                        className={`w-5 h-5 border border-gray-300 rounded-md ${
                          currentBook.userLevel === 'advanced'
                            ? 'bg-booking-advanced'
                            : 'bg-booking-beginner'
                        } flex items-center justify-center text-[8px] font-semibold text-white shadow-sm`}
                        key={`player-${i}`}
                      >
                        {currentBook?.bookedBy?.charAt(0)}
                      </div>
                    );
                  })}
                  {/* 显示剩余空位 */}
                  {Array.from({ 
                    length: Math.max(0, (room?.capacity || 0) - booking.reduce((total, book) => total + book.players, 0)) 
                  }).map((_, i) => (
                    <div 
                      className="w-5 h-5 border border-gray-300 rounded-md bg-white shadow-sm"
                      key={`empty-${i}`}
                    >
                    </div>
                  ))}
                </div>
                {/* 玩家数量信息 - 右下角固定位置 */}
                <div className="absolute bottom-1 right-1 text-[10px] text-gray-600 bg-white bg-opacity-90 px-1.5 py-0.5 rounded-md flex items-center gap-1 shadow-sm border border-gray-200">
                  {booking.reduce((total, book) => total + book.players, 0)}/{room?.capacity || 0}
                  {/* <User className="h-2.5 w-2.5" /> */}
                </div>
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent side="top" className="p-4 max-w-xs">
            <div className="space-y-2">
              <div>
                <strong>Players:</strong>{' '}
              </div>
              {booking.map((book, i) => (
                <div className="flex flex-row space-x-2" key={i}>
                  <div
                    className={`w-4 h-4 border border-gray-300 rounded-md ${book.userLevel === 'advanced' ? 'bg-booking-advanced' : 'bg-booking-beginner'} shadow-sm`}
                  />
                  <div className="font-semibold">{book.bookedBy}</div>
                </div>
              ))}
              <div className="text-sm space-y-1">
                <div>
                  <strong>Field:</strong> {room?.name} ({booking.length}/
                  {room?.capacity || 0})
                </div>
                <div>
                  <strong>Time:</strong> {timeSlot}
                </div>
                <div>
                  <strong>Status:</strong>{' '}
                  {booking.length >= (room?.capacity || 0)
                    ? 'Full'
                    : booking.length >= (room?.capacity || 0) / 2
                      ? 'Half Full'
                      : 'Available'}
                </div>
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
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Booking Table</h2>
        <Button
          variant={isEditMode ? "default" : "outline"}
          onClick={() => setIsEditMode(!isEditMode)}
          className={`flex items-center font-semibold py-2 px-4 text-base shadow-lg transition-all duration-200 ${
            isEditMode 
              ? 'bg-orange-500 hover:bg-orange-600 text-white border-orange-500' 
              : 'border-2 border-orange-500 text-orange-600 hover:bg-orange-50'
          }`}
          size="lg"
        >
          <Settings className="mr-2 h-5 w-5" />
          {isEditMode ? 'Exit Edit' : 'Edit Mode'}
        </Button>
      </div>
      <Card className="p-4 shadow-lg border-0">
        <div className="flex flex-col gap-4">
          {/* 第一排：控制选项 */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-6">
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <Select value={selectedPlayers} onValueChange={value => setSelectedPlayers(value)}>
                <SelectTrigger className="w-full sm:w-[140px]">
                  <User className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Players" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Player</SelectItem>
                  <SelectItem value="2">2 Players</SelectItem>
                  <SelectItem value="3">3 Players</SelectItem>
                  <SelectItem value="4">4 Players</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedLevel} onValueChange={value => setSelectedLevel(value)}>
                <SelectTrigger className="w-full sm:w-[170px]">
                  <Settings className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    value="beginner"
                    className="flex items-center gap-2"
                  >
                    <div className="flex flex-row space-x-2">
                      <div className="w-4 h-4 bg-booking-beginner border border-grid-border rounded" />
                      <span>Beginner</span>
                    </div>
                  </SelectItem>
                  <SelectItem
                    value="intermediate"
                    className="flex items-center gap-2"
                  >
                    <div className="flex flex-row space-x-2">
                      <div className="w-4 h-4 bg-booking-intermediate border border-grid-border rounded" />
                      <span>Intermediate</span>
                    </div>
                  </SelectItem>
                  <SelectItem
                    value="advanced"
                    className="flex items-center gap-2"
                  >
                    <div className="flex flex-row space-x-2">
                      <div className="w-4 h-4 bg-booking-advanced border border-grid-border rounded" />
                      <span>Advanced</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              {/* Date Picker */}
              <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full sm:w-[200px] justify-start text-left font-normal',
                      !selectedDate && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? (
                      format(selectedDate, 'PPP')
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={date => {
                      if (date) {
                        setSelectedDate(date);
                        setIsDatePickerOpen(false);
                      }
                    }}
                    initialFocus
                    className={cn('p-3 pointer-events-auto')}
                  />
                </PopoverContent>
              </Popover>

              {/* Filter */}
              <Select value={filter} onValueChange={value => setFilter(value)}>
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
          </div>

          <div className="flex justify-end">
            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap gap-2 text-sm overflow-x-auto justify-end">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-card rounded"
                      style={{ border: '1px solid rgb(149, 155, 167)' }}
                  ></div>
                  <span>Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-booking-user rounded"></div>
                  <span>My Booking</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-booking-partial border rounded"></div>
                  <span>Light Booking</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-booking-half-full rounded"></div>
                  <span>Half Full</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-booking-occupied rounded"></div>
                  <span>Full</span>
                </div>
        
              </div>
              <div className="flex flex-wrap gap-2 text-sm overflow-x-auto justify-end">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-booking-beginner rounded"></div>
                  <span>Beginner</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-booking-intermediate rounded"></div>
                  <span>Intermediate</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-booking-advanced rounded"></div>
                  <span>Advanced</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card className="overflow-hidden shadow-lg border-0">
        <div
          className="overflow-auto bg-white w-full"
          ref={tableScrollRef}
        >
          {isHorizontalTime ? (
            // Time horizontal, rooms vertical
            <div className="p-1 bg-gray-50" style={{ width: 'max-content' }}>
              <div
                className="grid gap-0.5"
                style={{
                  gridTemplateColumns: `${isEditMode ? '140px' : '100px'} repeat(${timeSlots.length}, 80px)`,
                }}
              >
                {/* Header row */}
                <div
                  className="bg-grid-header border border-gray-400 p-3 font-semibold text-sm sticky top-0 left-0 z-30 shadow-sm rounded-sm"
                  style={{ 
                    width: isEditMode ? 140 : 100, 
                    minWidth: isEditMode ? 140 : 100, 
                    maxWidth: isEditMode ? 140 : 100 
                  }}
                >
                  Field/Time
                </div>
                {timeSlots.map((time, idx) => (
                  <div
                    key={time}
                    ref={el => (timeHeaderRefs.current[idx] = el)}
                    className="bg-grid-header border border-gray-400 p-3 text-center font-medium text-sm sticky top-0 z-20 shadow-sm rounded-sm"
                    style={{ 
                      width: 80, 
                      minWidth: 80, 
                      maxWidth: 80
                    }}
                  >
                    {time}
                  </div>
                ))}
                {/* Data rows */}
                {filteredRooms
                  .map(room => [
                    <div
                      key={`${room.id}-header`}
                      className="bg-grid-header border border-gray-400 p-3 font-medium text-sm flex items-center sticky left-0 z-20 h-full shadow-sm rounded-sm"
                      style={{ 
                        width: isEditMode ? 140 : 100, 
                        minWidth: isEditMode ? 140 : 100, 
                        maxWidth: isEditMode ? 140 : 100 
                      }}
                    >
                      <div className="flex flex-col w-full h-full justify-center space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="flex flex-col flex-1 min-w-0">
                            <span className="font-semibold text-sm whitespace-nowrap">{room.name}</span>
                            <span className="text-xs text-muted-foreground whitespace-nowrap">{room.capacity} players</span>
                          </div>
                          {isEditMode && (
                            <div className="flex items-center space-x-1 ml-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-6 w-6 p-0 flex items-center justify-center hover:bg-gray-100"
                                onClick={() => handleEditRoom(room)}
                                title="Edit field"
                              >
                                <Edit2 className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-6 w-6 p-0 flex items-center justify-center text-red-500 hover:text-red-700 hover:bg-red-50"
                                onClick={() => handleDeleteRoom(room.id)}
                                title="Delete field"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>,
                    ...timeSlots.map(time => renderCell(room.id, time)),
                  ])
                  .flat()}
              </div>
            </div>
          ) : (
            // Rooms horizontal, time vertical
            <div className="min-w-full p-1 bg-gray-50">
              <div
                className="grid gap-0.5"
                style={{
                  gridTemplateColumns: `${isEditMode ? '140px' : '100px'} repeat(${filteredRooms.length}, 100px)`,
                }}
              >
                {/* Header row */}
                <div
                  className="bg-grid-header border border-gray-400 p-3 font-semibold text-sm sticky top-0 left-0 z-30 shadow-sm rounded-sm"
                  style={{ 
                    width: isEditMode ? 140 : 100, 
                    minWidth: isEditMode ? 140 : 100, 
                    maxWidth: isEditMode ? 140 : 100 
                  }}
                >
                  Time / Room
                </div>
                {filteredRooms.map(room => (
                  <div
                    key={room.id}
                    className="bg-grid-header border border-gray-400 p-2 text-center font-medium text-sm sticky top-0 z-20 relative shadow-sm rounded-sm"
                    style={{ width: 100, minWidth: 100, maxWidth: 100 }}
                  >
                    <div className="flex flex-col items-center space-y-1">
                      <div className="font-semibold text-sm w-full text-center whitespace-nowrap">{room.name}</div>
                      <div className="text-xs text-muted-foreground whitespace-nowrap">{room.capacity}p</div>
                      
                      {isEditMode && (
                        <div className="flex items-center space-x-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-5 w-5 p-0 flex items-center justify-center hover:bg-gray-100"
                            onClick={() => handleEditRoom(room)}
                            title="Edit field"
                          >
                            <Edit2 className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-5 w-5 p-0 flex items-center justify-center text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDeleteRoom(room.id)}
                            title="Delete field"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {/* Data rows */}
                {timeSlots
                  .map(time => [
                    <div
                      key={`${time}-header`}
                      className="bg-grid-header border border-gray-400 p-3 font-medium text-sm flex items-center justify-center sticky left-0 z-20 shadow-sm rounded-sm"
                      style={{ 
                        width: isEditMode ? 140 : 100, 
                        minWidth: isEditMode ? 140 : 100, 
                        maxWidth: isEditMode ? 140 : 100 
                      }}
                    >
                      {time}
                    </div>,
                    ...filteredRooms.map(room => renderCell(room.id, time)),
                  ])
                  .flat()}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Add Room Section - Below table, left aligned */}
      {isEditMode && (
        <div className="flex justify-start">
          <Button 
            onClick={handleAddRoom}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 px-6 text-base shadow-lg"
            size="lg"
          >
            <Plus className="mr-2 h-5 w-5" />
            Add Field
          </Button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmRoom && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={cancelDeleteRoom}
        >
          <Card 
            className="p-6 max-w-md mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Confirm Delete</h3>
              <p className="text-sm text-muted-foreground">
                Are you sure you want to delete this field? This action will also remove all bookings for this field and cannot be undone.
              </p>
              <div className="flex flex-col sm:flex-row gap-2 justify-end">
                <Button 
                  variant="outline" 
                  onClick={cancelDeleteRoom}
                  className="flex-1 sm:flex-none"
                >
                  Cancel
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={confirmDeleteRoom}
                  className="flex-1 sm:flex-none"
                >
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Edit Field Modal */}
      {editModalRoom && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={handleCancelEdit}
        >
          <Card 
            className="p-6 max-w-md mx-4 w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Edit Field</h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Field Name *
                  </label>
                  <input
                    type="text"
                    value={editRoomName}
                    onChange={(e) => setEditRoomName(e.target.value)}
                    placeholder="e.g: Field 10"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    required
                    autoFocus
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Capacity
                  </label>
                  <Select value={editRoomCapacity} onValueChange={setEditRoomCapacity}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select capacity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">2 Players</SelectItem>
                      <SelectItem value="4">4 Players</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2 justify-end">
                <Button 
                  variant="outline" 
                  onClick={handleCancelEdit}
                  className="flex-1 sm:flex-none"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSaveRoom}
                  className="flex-1 sm:flex-none"
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Add Field Modal */}
      {showAddRoomModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={handleCancelAddRoom}
        >
          <Card 
            className="p-6 max-w-md mx-4 w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Add New Field</h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Field Name *
                  </label>
                  <input
                    type="text"
                    value={newRoomName}
                    onChange={(e) => setNewRoomName(e.target.value)}
                    placeholder="e.g: Field 10"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    required
                    autoFocus
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Capacity
                  </label>
                  <Select value={newRoomCapacity} onValueChange={setNewRoomCapacity}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select capacity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">2 Players</SelectItem>
                      <SelectItem value="4">4 Players</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2 justify-end">
                <Button 
                  variant="outline" 
                  onClick={handleCancelAddRoom}
                  className="flex-1 sm:flex-none"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSaveNewRoom}
                  className="flex-1 sm:flex-none"
                >
                  Add Field
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default BookingTable;
export { initialRooms as sampleRooms, initialRooms as rooms, initialBookings as sampleBookings };
