import { Plus, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CalendarEvent, EVENT_TYPES } from '@/types/calendar';
import { format, parseISO } from 'date-fns';

interface EventsSidebarProps {
  events: CalendarEvent[];
  onAddEvent: () => void;
  onSelectEvent: (event: CalendarEvent) => void;
}

export function EventsSidebar({
  events,
  onAddEvent,
  onSelectEvent,
}: EventsSidebarProps) {
  const getEventType = (type: CalendarEvent['type']) => {
    return EVENT_TYPES.find(t => t.value === type);
  };

  return (
    <div className="w-72 h-full flex flex-col bg-card border-r border-border">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-foreground">Upcoming Events</h2>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Filter className="w-4 h-4" />
          </Button>
        </div>
        <Button onClick={onAddEvent} className="w-full gradient-rose text-primary-foreground border-0">
          <Plus className="w-4 h-4 mr-2" />
          Quick Add Event
        </Button>
      </div>

      {/* Events List */}
      <ScrollArea className="flex-1">
        <div className="p-3 space-y-2">
          {events.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              <p>No upcoming events</p>
              <p className="text-xs mt-1">Click "Quick Add" to create one</p>
            </div>
          ) : (
            events.map(event => {
              const eventType = getEventType(event.type);
              return (
                <div
                  key={event.id}
                  onClick={() => onSelectEvent(event)}
                  className="p-3 rounded-xl bg-muted/50 hover:bg-muted cursor-pointer transition-colors border border-transparent hover:border-border"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-1 h-full min-h-[40px] rounded-full flex-shrink-0"
                      style={{ backgroundColor: eventType?.color }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span>{eventType?.icon}</span>
                        <h3 className="font-medium text-foreground text-sm truncate">
                          {event.title}
                        </h3>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {format(parseISO(event.date), 'EEE, MMM d')} • {event.time}
                      </p>
                      {event.location && (
                        <p className="text-xs text-muted-foreground truncate">
                          📍 {event.location}
                        </p>
                      )}
                      <div className="mt-2">
                        {event.outfitName ? (
                          <Badge variant="secondary" className="text-xs bg-green-500/10 text-green-600 border-0">
                            ✓ Outfit Planned
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="text-xs bg-amber-500/10 text-amber-600 border-0">
                            No Outfit
                          </Badge>
                        )}
                      </div>
                    </div>
                    {event.outfitImage && (
                      <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                        <img src={event.outfitImage} alt="" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
