export interface TooltipGroupMember {
  /** Closes the bubble at once and gives its last box, for the next bubble of the group to slide from it */
  dismiss: () => DOMRect | undefined
}

const activeByGroup = new Map<string, TooltipGroupMember>()

export function getActiveTooltip(group: string) {
  return activeByGroup.get(group)
}

export function setActiveTooltip(group: string, member: TooltipGroupMember) {
  activeByGroup.set(group, member)
}

export function releaseActiveTooltip(group: string, member: TooltipGroupMember) {
  if (activeByGroup.get(group) === member)
    activeByGroup.delete(group)
}
