import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  illustration: ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: ReactNode;
    variant?: 'default' | 'outline' | 'ghost';
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({
  illustration,
  title,
  description,
  action,
  secondaryAction,
  className,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        'flex flex-col items-center justify-center py-16 px-4 text-center',
        className
      )}
    >
      <div className="mb-6">{illustration}</div>
      
      <motion.h3
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-xl md:text-2xl font-semibold text-foreground mb-2"
      >
        {title}
      </motion.h3>
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-muted-foreground mb-6 max-w-md"
      >
        {description}
      </motion.p>
      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex flex-col sm:flex-row gap-3"
      >
        {action && (
          <Button
            onClick={action.onClick}
            variant={action.variant || 'default'}
            className={action.variant === 'default' ? 'gradient-rose text-primary-foreground border-0 hover:opacity-90' : ''}
          >
            {action.icon}
            {action.label}
          </Button>
        )}
        
        {secondaryAction && (
          <Button variant="outline" onClick={secondaryAction.onClick}>
            {secondaryAction.label}
          </Button>
        )}
      </motion.div>
    </motion.div>
  );
}

interface ErrorStateProps {
  illustration?: ReactNode;
  title?: string;
  description?: string;
  error?: Error | string;
  onRetry?: () => void;
  onGoBack?: () => void;
  className?: string;
}

export function ErrorState({
  illustration,
  title = 'Something went wrong',
  description = "We couldn't complete your request. Please try again.",
  error,
  onRetry,
  onGoBack,
  className,
}: ErrorStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        'flex flex-col items-center justify-center py-16 px-4 text-center',
        className
      )}
    >
      {illustration && <div className="mb-6">{illustration}</div>}
      
      <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-2">
        {title}
      </h3>
      
      <p className="text-muted-foreground mb-4 max-w-md">
        {description}
      </p>
      
      {error && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mb-6 p-3 bg-destructive/10 border border-destructive/20 rounded-lg max-w-md w-full"
        >
          <p className="text-sm text-destructive font-mono">
            {typeof error === 'string' ? error : error.message}
          </p>
        </motion.div>
      )}
      
      <div className="flex gap-3">
        {onRetry && (
          <Button onClick={onRetry} className="gradient-rose text-primary-foreground border-0">
            Try Again
          </Button>
        )}
        {onGoBack && (
          <Button variant="outline" onClick={onGoBack}>
            Go Back
          </Button>
        )}
      </div>
    </motion.div>
  );
}

// Loading state
interface LoadingStateProps {
  message?: string;
  className?: string;
}

export function LoadingState({ message = 'Loading...', className }: LoadingStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn(
        'flex flex-col items-center justify-center py-16 px-4',
        className
      )}
    >
      <div className="relative w-16 h-16 mb-4">
        <motion.div
          className="absolute inset-0 border-4 border-primary/20 rounded-full"
        />
        <motion.div
          className="absolute inset-0 border-4 border-transparent border-t-primary rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
      </div>
      <p className="text-muted-foreground animate-pulse">{message}</p>
    </motion.div>
  );
}
