import { format, addDays } from 'date-fns';

const timeSlots = [
  "06:00-07:00", "07:00-08:00", "08:00-09:00", "09:00-10:00", "10:00-11:00", "11:00-12:00",
  "12:00-13:00", "13:00-14:00", "14:00-15:00", "15:00-16:00", "16:00-17:00", "17:00-18:00",
  "18:00-19:00", "19:00-20:00", "20:00-21:00", "21:00-22:00", "22:00-23:00", "23:00-00:00"
];

export const generateAvailability = () => {
  const availability = [];
  const today = new Date();

  for (let i = 0; i < 365; i++) {
    const date = format(addDays(today, i), 'yyyy-MM-dd');
    availability.push({ date, timeSlots: [...timeSlots] });
  }

  return availability;
};