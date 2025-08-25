/**
 * 预订系统配置文件
 */

// 时间缓冲设置（分钟）
export const TIME_MARGIN_MINUTES = 3;

// 时间段设置（分钟）
export const TIME_SLOT_DURATION = 20;

// 默认时间范围
export const DEFAULT_START_TIME = '08:00';
export const DEFAULT_END_TIME = '22:00';

// 预订相关设置
export const BOOKING_SETTINGS = {
  // 最大预订人数
  MAX_PLAYERS_PER_BOOKING: 10,
  
  // 最小预订人数
  MIN_PLAYERS_PER_BOOKING: 1,
  
  // 默认用户等级
  DEFAULT_USER_LEVEL: 'intermediate',
  
  // 默认场地容量
  DEFAULT_ROOM_CAPACITY: 4,
};

// 时间格式
export const TIME_FORMATS = {
  DISPLAY: 'HH:mm',
  INPUT: 'HH:mm',
  ISO: 'HH:mm:ss',
};
