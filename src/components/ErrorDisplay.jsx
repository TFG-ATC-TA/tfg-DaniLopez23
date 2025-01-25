import { AlertCircle, XCircle, AlertTriangle, Info } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

const ErrorDisplay = ({ 
  title = "An error occurred", 
  message, 
  type = "error", 
  onRetry,
  onDismiss
}) => {
  const getIcon = () => {
    switch (type) {
      case 'error':
        return <XCircle className="h-5 w-5" />
      case 'warning':
        return <AlertTriangle className="h-5 w-5" />
      case 'info':
        return <Info className="h-5 w-5" />
      default:
        return <AlertCircle className="h-5 w-5" />
    }
  }

  const getAlertVariant = () => {
    switch (type) {
      case 'error':
        return 'destructive'
      case 'warning':
        return 'warning'
      case 'info':
        return 'info'
      default:
        return 'default'
    }
  }

  return (
    <Alert variant={getAlertVariant()} className="max-w-lg mx-auto my-4">
      <div className="flex items-start gap-4">
        {getIcon()}
        <div className="flex-1">
          <AlertTitle className="text-lg font-semibold mb-2">{title}</AlertTitle>
          <AlertDescription className="text-sm">
            {message}
          </AlertDescription>
          {(onRetry || onDismiss) && (
            <div className="flex gap-2 mt-4">
              {onRetry && (
                <Button variant="outline" size="sm" onClick={onRetry}>
                  Retry
                </Button>
              )}
              {onDismiss && (
                <Button variant="ghost" size="sm" onClick={onDismiss}>
                  Dismiss
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </Alert>
  )
}

export default ErrorDisplay