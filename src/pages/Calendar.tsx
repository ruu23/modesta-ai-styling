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
import { AppLayout } from '@/components/layout';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent } from '@/components/ui/sheet';

export default function Calendar() {
  const { toast } = useToast();
  const isMobile = useIsMobile();
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
  const [showEventsSidebar, setShowEventsSidebar] = useState(false);

  // Default to week view on mobile
  const effectiveView = isMobile && view === 'month' ? 'week' : view;

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
    <AppLayout showBottomNav={true}>
      <div className="h-[100dvh] flex flex-col bg-background">
        {/* Top Bar */}
        <div className="h-14 border-b border-border bg-card flex items-center justify-between px-3 md:px-4 flex-shrink-0">
          <div className="flex items-center gap-2 md:gap-3">
            <Button variant="ghost" size="icon" asChild className="min-w-[44px] min-h-[44px]">
              <Link to="/">
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </Button>
            <h1 className="font-semibold text-foreground text-sm md:text-base">Outfit Calendar</h1>
          </div>

          <div className="flex items-center gap-1 md:gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleSmartPlan}
              className="hidden sm:flex min-h-[36px]"
            >
              <Wand2 className="w-4 h-4 mr-2" />
              Smart Plan
            </Button>
            <Button variant="ghost" size="icon" className="min-w-[44px] min-h-[44px] hidden sm:flex">
              <Download className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="min-w-[44px] min-h-[44px] hidden sm:flex">
              <Share2 className="w-4 h-4" />
            </Button>
            <ThemeToggle />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar - Events (Desktop only) */}
          <div className="hidden lg:block">
            <EventsSidebar
              events={upcomingEvents}
              onAddEvent={() => handleAddEvent()}
              onSelectEvent={(event) => {
                setSelectedDate(new Date(event.date));
              }}
            />
          </div>

          {/* Calendar */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <CalendarHeader
              currentDate={currentDate}
              view={effectiveView}
              onViewChange={setView}
              onPrev={navigatePrev}
              onNext={navigateNext}
              onToday={goToToday}
            />
            <div className="flex-1 overflow-auto">
              <CalendarGrid
                days={days}
                view={effectiveView}
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
          </div>

          {/* Right Panel - Day Details (Desktop) */}
          {!isMobile && selectedDate && selectedDateWeather && (
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

        {/* Mobile Day Detail - Bottom Sheet */}
        {isMobile && (
          <Sheet open={!!selectedDate} onOpenChange={(open) => !open && setSelectedDate(null)}>
            <SheetContent side="bottom" className="h-[70vh] rounded-t-2xl p-0">
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
            </SheetContent>
          </Sheet>
        )}

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
    </AppLayout>
  );
}
