import { Bell, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useNotifications } from "@/hooks/use-notifications";
import { Link } from "react-router-dom";

export const NotificationBell = () => {
  const { items, isLoading, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 min-w-[1.25rem] px-1 text-[11px]">
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 max-h-[360px] overflow-y-auto">
        <div className="flex items-center justify-between px-3 py-2">
          <DropdownMenuLabel>Notifications</DropdownMenuLabel>
          {items.length > 0 && (
            <Button variant="ghost" size="sm" className="text-xs" onClick={markAllAsRead}>
              <CheckCheck className="h-4 w-4 mr-1" />
              Tout marquer comme lu
            </Button>
          )}
        </div>
        <DropdownMenuSeparator />
        {isLoading ? (
          <div className="space-y-2 p-3">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-5 w-2/3" />
          </div>
        ) : items.length === 0 ? (
          <div className="px-3 py-6 text-sm text-muted-foreground text-center">
            Aucune notification
          </div>
        ) : (
          items.map((notif) => (
            <DropdownMenuItem
              key={notif.id}
              className="flex flex-col items-start gap-1 cursor-pointer"
              onClick={() => markAsRead(notif.id)}
              asChild={Boolean(notif.link)}
            >
              {notif.link ? (
                <Link to={notif.link}>
                  <span className="text-sm font-medium">
                    {!notif.isRead && <Badge className="mr-2">New</Badge>}
                    {notif.title}
                  </span>
                  <span className="text-xs text-muted-foreground">{notif.message}</span>
                </Link>
              ) : (
                <div>
                  <span className="text-sm font-medium">
                    {!notif.isRead && <Badge className="mr-2">New</Badge>}
                    {notif.title}
                  </span>
                  <span className="block text-xs text-muted-foreground">{notif.message}</span>
                </div>
              )}
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
