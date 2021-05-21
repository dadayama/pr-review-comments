import dayjs from 'dayjs';

export const formatDate = (date: string, format: string = 'YYYY/MM/DD') => dayjs(date).format(format);
