import { useState, useEffect, useMemo, useCallback } from 'react';
import { CalendarEvent, DayWeather, CalendarView } from '@/types/calendar';
import { supabase } from '@/integrations/supabase';
import { useAuth } from './useAuth';
import { toast } from 'sonner';
import { 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval,
  format,
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
  addDays,
  subDays,
  isSameDay,
  isSameMonth,
  isToday,
  isPast
} from 'date-fns';

// Mock weather data
const getWeatherForDate = (date: Date): DayWeather => {
  const conditions: DayWeather['condition'][] = ['sunny', 'cloudy', 'rainy', 'snowy', 'windy'];
  const icons: Record<DayWeather['condition'], string> = {
    sunny: '☀️',
    cloudy: '☁️',
    rainy: '🌧️',
    snowy: '❄️',
    windy: '💨',
  };
  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000);
  const condition = conditions[dayOfYear % conditions.length];
  const baseTemp = 20 + Math.sin(dayOfYear / 30) * 15;
  return {
    temp: Math.round(baseTemp + (Math.random() * 10 - 5)),
    condition,
    icon: icons[condition],
  };
};

export function useCalendar() {
  const { user } = useAuth();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [view, setView] = useState<CalendarView>('month');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch events from Supabase
  const fetchEvents = useCallback(async () => {
    if (!user) {
      setEvents([]);
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('calendar_events')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: true });

      if (error) throw error;

      const transformedEvents: CalendarEvent[] = (data || []).map(event => ({
        id: event.id,
        title: event.title,
        date: event.date,
        time: event.time?.slice(0, 5) || '00:00',
        endTime: event.end_time?.slice(0, 5),
        type: event.type as CalendarEvent['type'],
        location: event.location || undefined,
        dressCode: event.dress_code || undefined,
        outfitId: event.outfit_id || undefined,
        outfitName: event.outfit_name || undefined,
        outfitImage: event.outfit_image || undefined,
        reminder: event.reminder || undefined,
        notes: event.notes || undefined,
      }));

      setEvents(transformedEvents);
    } catch (error) {
      console.error('Error fetching calendar events:', error);
      toast.error('Failed to load calendar events');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Get days for current view
  const days = useMemo(() => {
    if (view === 'month') {
      const start = startOfWeek(startOfMonth(currentDate), { weekStartsOn: 0 });
      const end = endOfWeek(endOfMonth(currentDate), { weekStartsOn: 0 });
      return eachDayOfInterval({ start, end });
    } else if (view === 'week') {
      const start = startOfWeek(currentDate, { weekStartsOn: 0 });
      const end = endOfWeek(currentDate, { weekStartsOn: 0 });
      return eachDayOfInterval({ start, end });
    } else {
      return [currentDate];
    }
  }, [currentDate, view]);

  // Get events for a specific date
  const getEventsForDate = useCallback((date: Date): CalendarEvent[] => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return events.filter(e => e.date === dateStr);
  }, [events]);

  // Get weather for a date
  const getWeather = useCallback((date: Date): DayWeather => {
    return getWeatherForDate(date);
  }, []);

  // Upcoming events
  const upcomingEvents = useMemo(() => {
    const today = new Date();
    return events
      .filter(e => new Date(e.date) >= today)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 10);
  }, [events]);

  // Navigation
  const navigateNext = useCallback(() => {
    if (view === 'month') {
      setCurrentDate(prev => addMonths(prev, 1));
    } else if (view === 'week') {
      setCurrentDate(prev => addWeeks(prev, 1));
    } else {
      setCurrentDate(prev => addDays(prev, 1));
    }
  }, [view]);

  const navigatePrev = useCallback(() => {
    if (view === 'month') {
      setCurrentDate(prev => subMonths(prev, 1));
    } else if (view === 'week') {
      setCurrentDate(prev => subWeeks(prev, 1));
    } else {
      setCurrentDate(prev => subDays(prev, 1));
    }
  }, [view]);

  const goToToday = useCallback(() => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  }, []);

  // Add event
  const addEvent = useCallback(async (event: Omit<CalendarEvent, 'id'>) => {
    if (!user) {
      toast.error('Please sign in to add events');
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('calendar_events')
        .insert({
          user_id: user.id,
          title: event.title,
          date: event.date,
          time: event.time,
          end_time: event.endTime || null,
          type: event.type,
          location: event.location || null,
          dress_code: event.dressCode || null,
          outfit_id: event.outfitId || null,
          outfit_name: event.outfitName || null,
          outfit_image: event.outfitImage || null,
          reminder: event.reminder || null,
          notes: event.notes || null,
        })
        .select()
        .single();

      if (error) throw error;

      const newEvent: CalendarEvent = {
        id: data.id,
        title: data.title,
        date: data.date,
        time: data.time?.slice(0, 5) || '00:00',
        endTime: data.end_time?.slice(0, 5),
        type: data.type as CalendarEvent['type'],
        location: data.location || undefined,
        dressCode: data.dress_code || undefined,
        outfitId: data.outfit_id || undefined,
        outfitName: data.outfit_name || undefined,
        outfitImage: data.outfit_image || undefined,
        reminder: data.reminder || undefined,
        notes: data.notes || undefined,
      };

      setEvents(prev => [...prev, newEvent].sort((a, b) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      ));
      toast.success('Event added');
      return newEvent;
    } catch (error) {
      console.error('Error adding event:', error);
      toast.error('Failed to add event');
      return null;
    }
  }, [user]);

  // Update event
  const updateEvent = useCallback(async (id: string, updates: Partial<CalendarEvent>) => {
    if (!user) return;

    try {
      const dbUpdates: Record<string, unknown> = {};
      if (updates.title !== undefined) dbUpdates.title = updates.title;
      if (updates.date !== undefined) dbUpdates.date = updates.date;
      if (updates.time !== undefined) dbUpdates.time = updates.time;
      if (updates.endTime !== undefined) dbUpdates.end_time = updates.endTime;
      if (updates.type !== undefined) dbUpdates.type = updates.type;
      if (updates.location !== undefined) dbUpdates.location = updates.location;
      if (updates.dressCode !== undefined) dbUpdates.dress_code = updates.dressCode;
      if (updates.outfitId !== undefined) dbUpdates.outfit_id = updates.outfitId;
      if (updates.outfitName !== undefined) dbUpdates.outfit_name = updates.outfitName;
      if (updates.outfitImage !== undefined) dbUpdates.outfit_image = updates.outfitImage;
      if (updates.reminder !== undefined) dbUpdates.reminder = updates.reminder;
      if (updates.notes !== undefined) dbUpdates.notes = updates.notes;

      const { error } = await supabase
        .from('calendar_events')
        .update(dbUpdates)
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setEvents(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
    } catch (error) {
      console.error('Error updating event:', error);
      toast.error('Failed to update event');
    }
  }, [user]);

  // Delete event
  const deleteEvent = useCallback(async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('calendar_events')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setEvents(prev => prev.filter(e => e.id !== id));
      toast.success('Event deleted');
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error('Failed to delete event');
    }
  }, [user]);

  // Assign outfit to event
  const assignOutfit = useCallback(async (eventId: string, outfit: { id: string; name: string; image: string }) => {
    await updateEvent(eventId, {
      outfitId: outfit.id,
      outfitName: outfit.name,
      outfitImage: outfit.image,
    });
  }, [updateEvent]);

  // Copy event to another date
  const copyEventToDate = useCallback(async (eventId: string, newDate: Date) => {
    const event = events.find(e => e.id === eventId);
    if (event) {
      const { id, ...eventData } = event;
      await addEvent({ ...eventData, date: format(newDate, 'yyyy-MM-dd') });
    }
  }, [events, addEvent]);

  return {
    events,
    currentDate,
    selectedDate,
    setSelectedDate,
    view,
    setView,
    days,
    isLoading,
    getEventsForDate,
    getWeather,
    upcomingEvents,
    navigateNext,
    navigatePrev,
    goToToday,
    addEvent,
    updateEvent,
    deleteEvent,
    assignOutfit,
    copyEventToDate,
    isSameDay,
    isSameMonth: (date: Date) => isSameMonth(date, currentDate),
    isToday,
    isPast,
    refetch: fetchEvents,
  };
}

export { isSameDay, isSameMonth, isToday, isPast };
