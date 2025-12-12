import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Wand2, Download, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useCalendar } from '@/hooks/useCalendar';
import { CalendarHeader } from '@/components/calendar/CalendarHeader';
import { CalendarGrid } from '@/components/calendar/CalendarGrid';
import { EventsSidebar } from '@/components/calendar/EventsSidebar';
import { DayDetailPanel } from '@/components/calendar/DayDetailPanel';
import { EventModal } from '@/components/calendar/EventModal';
import { CalendarEvent } from '@/types/calendar';
import { ThemeToggle } from '@/components/theme';

export default function Calendar() {
  const { toast } = useToast();
  const {
    currentDate,
    selectedDate,
    setSelectedDate,
    view,
    setView,
    days,
    getEventsForDate,
    getWeather,
    upcomingEvents,
    navigateNext,
    navigatePrev,
    goToToday,
    addEvent,
    updateEvent,
    deleteEvent,
    isSameMonth,
    isToday,
    isPast,
  } = useCalendar();

  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [modalDate, setModalDate] = useState<Date | undefined>();
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);

  const handleAddEvent = (date?: Date) => {
    setModalDate(date || new Date());
    setEditingEvent(null);
    setIsEventModalOpen(true);
  };

  const handleEditEvent = (event: CalendarEvent) => {
    setEditingEvent(event);
    setIsEventModalOpen(true);
  };

  const handleSaveEvent = (eventData: Omit<CalendarEvent, 'id'>) => {
    if (editingEvent) {
      updateEvent(editingEvent.id, eventData);
      toast({ title: 'Event updated!' });
    } else {
      addEvent(eventData);
      toast({ title: 'Event created!' });
    }
  };

  const handleDeleteEvent = (eventId: string) => {
    deleteEvent(eventId);
    toast({ title: 'Event deleted' });
  };

  const handleAssignOutfit = (eventId: string) => {
    toast({
      title: 'Assign Outfit',
      description: 'Open the outfit builder to assign an outfit.',
    });
  };

  const handleSmartPlan = () => {
    toast({
      title: 'Smart Week Planner',
      description: 'AI is analyzing your schedule and wardrobe...',
    });
  };

  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];
  const selectedDateWeather = selectedDate ? getWeather(selectedDate) : null;

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Top Bar */}
      <div className="h-14 border-b border-border bg-card flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <h1 className="font-semibold text-foreground">Outfit Calendar</h1>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleSmartPlan}>
            <Wand2 className="w-4 h-4 mr-2" />
            Smart Week Planner
          </Button>
          <Button variant="ghost" size="icon">
            <Download className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Share2 className="w-4 h-4" />
          </Button>
          <ThemeToggle />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Events */}
        <EventsSidebar
          events={upcomingEvents}
          onAddEvent={() => handleAddEvent()}
          onSelectEvent={(event) => {
            setSelectedDate(new Date(event.date));
          }}
        />

        {/* Calendar */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <CalendarHeader
            currentDate={currentDate}
            view={view}
            onViewChange={setView}
            onPrev={navigatePrev}
            onNext={navigateNext}
            onToday={goToToday}
          />
          <CalendarGrid
            days={days}
            view={view}
            currentDate={currentDate}
            selectedDate={selectedDate}
            getEventsForDate={getEventsForDate}
            getWeather={getWeather}
            isSameMonth={isSameMonth}
            isToday={isToday}
            isPast={isPast}
            onSelectDate={setSelectedDate}
            onAddEvent={handleAddEvent}
          />
        </div>

        {/* Right Panel - Day Details */}
        {selectedDate && selectedDateWeather && (
          <DayDetailPanel
            date={selectedDate}
            events={selectedDateEvents}
            weather={selectedDateWeather}
            onClose={() => setSelectedDate(null)}
            onEditEvent={handleEditEvent}
            onDeleteEvent={handleDeleteEvent}
            onAddEvent={() => handleAddEvent(selectedDate)}
            onAssignOutfit={handleAssignOutfit}
          />
        )}
      </div>

      {/* Event Modal */}
      <EventModal
        isOpen={isEventModalOpen}
        onClose={() => {
          setIsEventModalOpen(false);
          setEditingEvent(null);
        }}
        onSave={handleSaveEvent}
        initialDate={modalDate}
        editEvent={editingEvent}
      />
    </div>
  );
}
