import { Button, ButtonProps } from './ui/button'
import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationButtonProps extends ButtonProps {
  direction: 'left' | 'right'
  handler: () => void
}

const PaginationButton: React.FC<PaginationButtonProps> = ({
  className,
  direction,
  handler,
  ...props
}) => {
  const isLeftDirection = direction === 'left'

  return (
    <Button
      aria-label={isLeftDirection ? 'Go to previous page' : 'Go to next page'}
      variant={'outline'}
      size="sm"
      className={cn(
        'gap-1 pl-2.5 text-xm flex items-center justify-center py-0',
        className,
        direction === 'right' ? 'flex-row-reverse' : ''
      )}
      onClick={handler}
      {...props}
    >
      {isLeftDirection ? (
        <ChevronLeft className="w-4 h-4" size={16} />
      ) : (
        <ChevronRight className="w-4 h-4" size={16} />
      )}
      <span className='pb-0.5'>{isLeftDirection ? 'previo' : 'siguiente'}</span>
    </Button>
  )
}

export default PaginationButton
