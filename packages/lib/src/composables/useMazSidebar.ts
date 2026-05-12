import type { MazSidebarContext } from '../components/MazSidebar.vue'
import { mazSidebarKey } from '../components/MazSidebar.vue'
import { useInjectStrict } from './useInjectStrict'

/**
 * Composable to access the nearest MazSidebar context.
 * Must be called from a descendant of MazSidebar.
 *
 * @returns {MazSidebarContext} Sidebar context with open state, toggle, setOpen, etc.
 */
export function useMazSidebar(): MazSidebarContext {
  return useInjectStrict<MazSidebarContext>(
    mazSidebarKey,
    undefined,
    '[maz-ui](useMazSidebar) No MazSidebar parent found. useMazSidebar must be used inside a MazSidebar component.',
  )
}

export type { MazSidebarContext }
