import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { RotateCw, CalendarIcon, Filter, User, Settings, Plus, Edit2, Check, X, Trash2, ChevronUp } from 'lucide-react';
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

// 生成可选择的时间选项（每20分钟一个）
function generateTimeOptions() {
  const options = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 20) {
      const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      options.push(timeStr);
    }
  }
  return options;
}

const timeOptions = generateTimeOptions();

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
    players: 1,
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
  const { user } = useAuth();
  const [isHorizontalTime, setIsHorizontalTime] = useState(true);
  const [selectedDate, setSelectedDate] = useState(externalSelectedDate || new Date());
  const [filter, setFilter] = useState('all');
  const [bookings, setBookings] = useState(externalBookings || initialBookings);
  const [selectedPlayers, setSelectedPlayers] = useState('1');
  const [selectedLevel, setSelectedLevel] = useState('intermediate');
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
  const [showNotification, setShowNotification] = useState(null);
  const [showConflictConfirm, setShowConflictConfirm] = useState(null);
  const [isControlPanelCollapsed, setIsControlPanelCollapsed] = useState(false);
  
  // 新增：时间设置状态
  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('22:00');
  const [currentTimeSlots, setCurrentTimeSlots] = useState(generateTimeSlots('08:00', '22:00'));

  // 新增：滚动监听相关状态
  const [lastScrollY, setLastScrollY] = useState(0);
  const [scrollDirection, setScrollDirection] = useState('up');
  const isScrolling = useRef(false);
  const manualToggle = useRef(false);
  const isTouching = useRef(false);

  // 检测是否为触摸设备
  const isTouchDevice = () => {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  };

  // 手动切换处理函数
  const handleManualToggle = () => {
    manualToggle.current = true;
    setIsControlPanelCollapsed(!isControlPanelCollapsed);
    // 延迟重置手动切换标志
    setTimeout(() => {
      manualToggle.current = false;
    }, 500);
  };

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

  // 新增：滚动监听 useEffect
  // useEffect(() => {
  //   let ticking = false;
    
  //   // 触摸事件处理
  //   const handleTouchStart = () => {
  //     isTouching.current = true;
  //   };
    
  //   const handleTouchEnd = () => {
  //     // 延迟重置触摸状态，因为滚动可能在触摸结束后继续
  //     setTimeout(() => {
  //       isTouching.current = false;
  //     }, 150);
  //   };
    
  //   const handleScroll = () => {
  //     if (!ticking) {
  //       requestAnimationFrame(() => {
  //         const currentScrollY = window.scrollY;
          
  //         // 防止在状态更新期间或手动切换期间处理滚动事件
  //         if (isScrolling.current || manualToggle.current) {
  //           ticking = false;
  //           return;
  //         }
          
  //         // 在触摸设备上，只有在非触摸滚动时才自动折叠
  //         // 这样可以避免在用户主动滚动时的奇怪行为
  //         const isTouch = isTouchDevice();
  //         if (isTouch && isTouching.current) {
  //           ticking = false;
  //           return;
  //         }
          
  //         // 移动设备使用更大的阈值
  //         const isMobile = window.innerWidth <= 768;
  //         const scrollThreshold = isMobile ? 50 : 10; // 进一步增加移动设备阈值
          
  //         if (Math.abs(currentScrollY - lastScrollY) > scrollThreshold) {
  //           const direction = currentScrollY > lastScrollY ? 'down' : 'up';
            
  //           if (direction !== scrollDirection) {
  //             isScrolling.current = true;
              
  //             setScrollDirection(direction);
              
  //             // 根据滚动方向自动展开/收起控制面板
  //             if (direction === 'down') {
  //               setIsControlPanelCollapsed(true);
  //             } else if (direction === 'up') {
  //               setIsControlPanelCollapsed(false);
  //             }
              
  //             // 移动设备使用更长的延迟
  //             const delay = isMobile ? 500 : 100;
  //             setTimeout(() => {
  //               isScrolling.current = false;
  //             }, delay);
  //           }
            
  //           setLastScrollY(currentScrollY);
  //         }
          
  //         ticking = false;
  //       });
  //       ticking = true;
  //     }
  //   };

  //   // 添加事件监听器
  //   window.addEventListener('scroll', handleScroll, { passive: true });
  //   window.addEventListener('touchstart', handleTouchStart, { passive: true });
  //   window.addEventListener('touchend', handleTouchEnd, { passive: true });
    
  //   // 清理函数
  //   return () => {
  //     window.removeEventListener('scroll', handleScroll);
  //     window.removeEventListener('touchstart', handleTouchStart);
  //     window.removeEventListener('touchend', handleTouchEnd);
  //   };
  // }, [lastScrollY, scrollDirection]);

  // 新增：动态生成时间段的 useEffect
  useEffect(() => {
    // 验证结束时间是否晚于开始时间
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);
    const startMins = startHour * 60 + startMin;
    const endMins = endHour * 60 + endMin;
    
    if (endMins > startMins) {
      const newTimeSlots = generateTimeSlots(startTime, endTime);
      setCurrentTimeSlots(newTimeSlots);
    } else {
      // 如果结束时间不合法，显示通知
      setShowNotification({
        type: 'error',
        message: 'End time must be later than start time'
      });
      setTimeout(() => setShowNotification(null), 3000);
    }
  }, [startTime, endTime]);

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
    currentTimeSlots.forEach((slot, idx) => {
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
  }, [isHorizontalTime, currentTimeSlots]);

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
    } else {
      // Any booking that's not full is "open to join"
      return 'partial';
    }
  };

  const shouldShowRoom = roomId => {
    if (filter === 'all') return true;

    // Check if any time slot for this room matches the filter
    return currentTimeSlots.some(timeSlot => {
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
    const hasUserBooking = bookings && bookings.some(booking => booking.bookedBy === user?.username);
    
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
    } else {
      // Any booking that's not full is "open to join"
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
    
    // 1. 检查当前用户在当前时间段的所有场地是否已有预订
    const userBookingInTimeSlot = bookings.find(booking => 
      booking.timeSlot === timeSlot && 
      booking.date === dateStr && 
      booking.bookedBy === user?.username
    );
    
    // 检查当前用户在当前场地和时间段是否已有预订
    const userBookingInCurrentRoom = existingBookings.find(booking => booking.bookedBy === user?.username);
    
    // 如果用户在当前房间已有预订，直接切换选择状态
    if (userBookingInCurrentRoom) {
      onCellSelect(selectedCell === cellId ? null : cellId);
      return;
    }

    // 4. 检查时段是否已过
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

    if (isPastTime) {
      setShowNotification({
        type: 'error',
        message: 'This time slot has already passed. Please select another time slot.'
      });
      setTimeout(() => setShowNotification(null), 3000);
      onCellSelect(cellId); // 仍然显示面板
      return;
    }

    // 2. 检查此时段此球场是否已满
    const currentPlayerCount = existingBookings.reduce((total, booking) => total + booking.players, 0);
    if (currentPlayerCount >= capacity) {
      setShowNotification({
        type: 'error',
        message: 'This time slot is full. Please select another time slot.'
      });
      setTimeout(() => setShowNotification(null), 3000);
      onCellSelect(cellId); // 仍然显示面板
      return;
    }

    // 3. 检查预约人数是否会超过容量
    const selectedPlayerCount = parseInt(selectedPlayers, 10);
    if (currentPlayerCount + selectedPlayerCount > capacity) {
      setShowNotification({
        type: 'error',
        message: `Cannot add ${selectedPlayerCount} player(s). Only ${capacity - currentPlayerCount} spot(s) available. Please select another time slot.`
      });
      setTimeout(() => setShowNotification(null), 3000);
      onCellSelect(cellId); // 仍然显示面板
      return;
    }

    // 1. 如果用户在同时段有其他预订，显示确认对话框
    if (userBookingInTimeSlot && userBookingInTimeSlot.roomId !== roomId) {
      setShowConflictConfirm({
        timeSlot,
        newRoomId: roomId,
        existingBooking: userBookingInTimeSlot
      });
      return;
    }

    // 执行预订操作
    executeBooking(roomId, timeSlot, dateStr, selectedPlayerCount);
    onCellSelect(cellId);
  };

  const executeBooking = (roomId, timeSlot, dateStr, playerCount) => {
    console.log('Creating booking with level:', selectedLevel);
    
    // 添加新预订
    const newBooking = {
      id: Date.now().toString(),
      roomId: roomId,
      timeSlot: timeSlot,
      date: dateStr,
      status: 'occupied',
      bookedBy: user?.username,
      userLevel: selectedLevel,
      userEmail: user?.email,
      players: playerCount,
    };
    
    console.log('New booking created:', newBooking);
    setBookings(prevBookings => [...prevBookings, newBooking]);
  };

  const handleConflictConfirm = () => {
    const { timeSlot, newRoomId, existingBooking } = showConflictConfirm;
    const dateStr = selectedDate ? selectedDate.toISOString().slice(0, 10) : todayStr;
    const selectedPlayerCount = parseInt(selectedPlayers, 10);

    // 移除同时段的现有预订
    setBookings(prevBookings => 
      prevBookings.filter(booking => booking.id !== existingBooking.id)
    );

    // 添加新预订
    executeBooking(newRoomId, timeSlot, dateStr, selectedPlayerCount);
    
    setShowConflictConfirm(null);
    onCellSelect(`${newRoomId}-${timeSlot}`);
  };

  const handleConflictCancel = () => {
    setShowConflictConfirm(null);
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
                        className={`w-5 h-5 border border-gray-300 rounded-full ${
                          currentBook.userLevel === 'advanced'
                            ? 'bg-booking-advanced'
                            : currentBook.userLevel === 'intermediate'
                            ? 'bg-booking-intermediate'
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
                      className="w-5 h-5 border border-gray-300 rounded-full bg-white shadow-sm"
                      key={`empty-${i}`}
                    >
                    </div>
                  ))}
                </div>
                {/* 玩家数量信息 - 右下角固定位置 */}
                {/* <div className="absolute bottom-1 right-1 text-[10px] text-gray-600 bg-white bg-opacity-90 px-1.5 py-0.5 rounded-md flex items-center gap-1 shadow-sm border border-gray-200">
                  {booking.reduce((total, book) => total + book.players, 0)}/{room?.capacity || 0}
                </div> */}
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
                    className={`w-4 h-4 border border-gray-300 rounded-full ${
                      book.userLevel === 'advanced' 
                        ? 'bg-booking-advanced' 
                        : book.userLevel === 'intermediate'
                        ? 'bg-booking-intermediate'
                        : 'bg-booking-beginner'
                    } shadow-sm`}
                  />
                  <div className="font-semibold">
                    {book.bookedBy || "You"}
                    {book.players > 1 && ` ( ${book.players} )`}
                  </div>
                </div>
              ))}
              <div className="text-sm space-y-1">
                <div>
                  <strong>Field:</strong> {room?.name} ({booking.reduce((total, book) => total + book.players, 0)}/
                  {room?.capacity || 0})
                </div>
                <div>
                  <strong>Time:</strong> {timeSlot}
                </div>
                <div>
                  <strong>Status:</strong>{' '}
                  {booking.reduce((total, book) => total + book.players, 0) >= (room?.capacity || 0)
                    ? 'Full'
                    : 'Open to Join'}
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
      <Card className="p-4 pb-2 shadow-lg border-0">
        <div className="flex flex-col ">
          {/* 始终可见的核心控制选项 */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-4 sm:justify-between sm:items-center">
            {/* 左侧：Players 和 Level 选择器 */}
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
                      <div className="w-4 h-4 bg-booking-beginner border border-grid-border rounded-full" />
                      <span>Beginner</span>
                    </div>
                  </SelectItem>
                  <SelectItem
                    value="intermediate"
                    className="flex items-center gap-2"
                  >
                    <div className="flex flex-row space-x-2">
                      <div className="w-4 h-4 bg-booking-intermediate border border-grid-border rounded-full" />
                      <span>Intermediate</span>
                    </div>
                  </SelectItem>
                  <SelectItem
                    value="advanced"
                    className="flex items-center gap-2"
                  >
                    <div className="flex flex-row space-x-2">
                      <div className="w-4 h-4 bg-booking-advanced border border-grid-border rounded-full" />
                      <span>Advanced</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 右侧：Filter 选择器 */}
            <div className={`flex justify-end ${
              isControlPanelCollapsed ? 'hidden lg:flex' : 'flex'
            }`}>
              <Select value={filter} onValueChange={value => setFilter(value)}>
                <SelectTrigger className="w-full sm:w-[140px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Rooms</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="partial">Open to Join</SelectItem>
                  <SelectItem value="full">Full</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 可折叠的内容区域 */}
          <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
            isControlPanelCollapsed ? 'max-h-0' : 'max-h-96'
          }`}>
            <div className="space-y-4">
              {/* 时间设置 - 只在编辑模式下显示 */}
              {isEditMode && (
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-6">
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground min-w-[80px]">Opening Hours:</span>
                      <Select value={startTime} onValueChange={setStartTime}>
                        <SelectTrigger className="w-full sm:w-[100px]">
                          <SelectValue placeholder="Start" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[200px] overflow-y-auto">
                          {timeOptions.map(time => (
                            <SelectItem key={`start-${time}`} value={time}>
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <span className="text-sm text-muted-foreground">to</span>
                      <Select value={endTime} onValueChange={setEndTime}>
                        <SelectTrigger className="w-full sm:w-[100px]">
                          <SelectValue placeholder="End" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[200px] overflow-y-auto">
                          {timeOptions.filter(time => {
                            const [startHour, startMin] = startTime.split(':').map(Number);
                            const [timeHour, timeMin] = time.split(':').map(Number);
                            const startMins = startHour * 60 + startMin;
                            const timeMins = timeHour * 60 + timeMin;
                            return timeMins > startMins;
                          }).map(time => (
                            <SelectItem key={`end-${time}`} value={time}>
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

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
                        <div className="w-4 h-4 bg-booking-partial rounded"></div>
                        <span>Open to Join</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-booking-occupied rounded"></div>
                        <span>Full</span>
                      </div>
                  
                    </div>
                    <div className="flex flex-wrap gap-2 text-sm overflow-x-auto justify-end">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-booking-beginner rounded-full"></div>
                        <span>Beginner</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-booking-intermediate rounded-full"></div>
                        <span>Intermediate</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-booking-advanced rounded-full"></div>
                        <span>Advanced</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 图例 - 始终显示 */}
              {!isEditMode && (
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
                      <div className="w-4 h-4 bg-booking-partial rounded"></div>
                      <span>Open to Join</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-booking-occupied rounded"></div>
                      <span>Full</span>
                    </div>
                
                  </div>
                  <div className="flex flex-wrap gap-2 text-sm overflow-x-auto justify-end">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-booking-beginner rounded-full"></div>
                      <span>Beginner</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-booking-intermediate rounded-full"></div>
                      <span>Intermediate</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-booking-advanced rounded-full"></div>
                      <span>Advanced</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
            {/* 折叠控制按钮 */}
          <div className="flex items-center justify-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleManualToggle}
              className={`h-6 w-8 p-0 transition-transform duration-200`}
            >
              <ChevronUp 
                className={`h-4 w-4 transition-transform duration-200 ${
                  isControlPanelCollapsed ? 'rotate-180' : ''
                }`} 
              />
            </Button>
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
                  gridTemplateColumns: `${isEditMode ? '140px' : '80px'} repeat(${currentTimeSlots.length}, 70px)`,
                }}
              >
                {/* Header row */}
                <div
                  className="bg-grid-header border border-gray-400 p-2 font-semibold text-sm sticky top-0 left-0 z-30 shadow-sm rounded-sm"
                  style={{ 
                    width: isEditMode ? 140 : 80, 
                    minWidth: isEditMode ? 140 : 80, 
                    maxWidth: isEditMode ? 140 : 80 
                  }}
                >
                  <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="ghost"
                        className="w-full h-full p-1 text-[15px] font-bold hover:bg-grid-hover justify-center text-center leading-tight"
                      >
                        <CalendarIcon className="h-4 w-4 hidden sm:inline-block" />
                        {format(selectedDate, 'MMM dd')}
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
                </div>
                {currentTimeSlots.map((time, idx) => (
                  <div
                    key={time}
                    ref={el => (timeHeaderRefs.current[idx] = el)}
                    className="bg-grid-header border border-gray-400 p-3 text-center font-medium text-sm sticky top-0 z-20 shadow-sm rounded-sm"
                    style={{ 
                      width: 70, 
                      minWidth: 70, 
                      maxWidth: 70
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
                        width: isEditMode ? 140 : 80, 
                        minWidth: isEditMode ? 140 : 80, 
                        maxWidth: isEditMode ? 140 : 80 
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
                    ...currentTimeSlots.map(time => renderCell(room.id, time)),
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
                  gridTemplateColumns: `${isEditMode ? '140px' : '100px'} repeat(${filteredRooms.length}, 90px)`,
                }}
              >
                {/* Header row */}
                <div
                  className="bg-grid-header border border-gray-400 p-2 font-semibold text-sm sticky top-0 left-0 z-30 shadow-sm rounded-sm"
                  style={{ 
                    width: isEditMode ? 140 : 100, 
                    minWidth: isEditMode ? 140 : 100, 
                    maxWidth: isEditMode ? 140 : 100 
                  }}
                >
                  <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="ghost"
                        className="w-full h-full p-1 text-[10px] font-semibold hover:bg-grid-hover justify-center text-center leading-tight"
                      >
                        {format(selectedDate, 'MMM dd')}
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
                </div>
                {filteredRooms.map(room => (
                  <div
                    key={room.id}
                    className="bg-grid-header border border-gray-400 p-2 text-center font-medium text-sm sticky top-0 z-20 relative shadow-sm rounded-sm"
                    style={{ width: 90, minWidth: 90, maxWidth: 90 }}
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
                {currentTimeSlots
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

      {/* Notification */}
      {showNotification && (
        <div className={`fixed bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-md shadow-lg z-50 ${
          showNotification.type === 'error' 
            ? 'bg-red-500 text-white' 
            : 'bg-green-500 text-white'
        }`}>
          {showNotification.message}
        </div>
      )}

      {/* Conflict Confirmation Modal */}
      {showConflictConfirm && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={handleConflictCancel}
        >
          <Card 
            className="p-6 max-w-md mx-4 w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Conflict Detected</h3>
              <p className="text-sm text-muted-foreground">
                You already have a booking for this time slot at{' '}
                <strong>{rooms.find(r => r.id === showConflictConfirm.existingBooking.roomId)?.name || showConflictConfirm.existingBooking.roomId}</strong>. 
                Would you like to replace it with your new booking for{' '}
                <strong>{rooms.find(r => r.id === showConflictConfirm.newRoomId)?.name || showConflictConfirm.newRoomId}</strong>?
              </p>
              <div className="flex flex-col sm:flex-row gap-2 justify-end">
                <Button 
                  variant="outline" 
                  onClick={handleConflictCancel}
                  className="flex-1 sm:flex-none"
                >
                  Cancel
                </Button>
                <Button 
                  variant="default" 
                  onClick={handleConflictConfirm}
                  className="flex-1 sm:flex-none"
                >
                  Replace Booking
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
