import MoodCalendar from '../MoodCalendar';

export default function MoodCalendarExample() {
  const generateDays = () => {
    const days = [];
    const today = 15;
    
    for (let i = 0; i < 5; i++) {
      days.push({ date: i + 27, moodValue: undefined, isCurrentMonth: false, isToday: false });
    }
    
    for (let i = 1; i <= 31; i++) {
      const moodValue = i <= 14 ? Math.floor(Math.random() * 5) + 1 : undefined;
      days.push({
        date: i,
        moodValue,
        isCurrentMonth: true,
        isToday: i === today
      });
    }
    
    return days;
  };

  return (
    <MoodCalendar
      month="January"
      year={2025}
      days={generateDays()}
      onDayClick={(day) => console.log('Clicked day:', day)}
    />
  );
}
