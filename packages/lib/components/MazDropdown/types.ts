export type TriggerType = 'click' | 'hover' | 'both';
export type Position = 'auto' | 'top' | 'top-right' | 'top-left' | 'bottom' | 'bottom-right' | 'bottom-left' | 'left' | 'right';

export interface DropdownProps {
  trigger?: TriggerType;
  position?: Position;
  closeOnClickOutside?: boolean;
  closeOnEsc?: boolean;
  enableContextMenu?: boolean;
  label?: string;
  id?: string;
}