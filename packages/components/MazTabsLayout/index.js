
import TabsBarComponent from './_subs/TabsBar'
import TabsContentComponent from './_subs/TabsContent'
import TabsContentItemComponent from './_subs/TabsContentItem'

TabsBarComponent.install = (Vue) => {
  Vue.component(TabsBarComponent.name, TabsBar)
}
TabsContentComponent.install = (Vue) => {
  Vue.component(TabsContentComponent.name, TabsContentComponent)
}
TabsContentItemComponent.install = (Vue) => {
  Vue.component(TabsContentItemComponent.name, TabsContentItemComponent)
}

export const TabsBar = TabsBarComponent
export const TabsContent = TabsContentComponent
export const TabsContentItem = TabsContentItemComponent
