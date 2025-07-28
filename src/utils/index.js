import { serverUrl } from './url';
import { isTokenValid, isAllowed } from './decode';
import { devLog, devErr } from './debug';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export { serverUrl, isTokenValid, isAllowed, devLog, devErr };

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// 其他工具函数
export function formatDate(date) {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
  }).format(amount);
}
