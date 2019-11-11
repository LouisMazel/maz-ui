import cssVars from 'css-vars-ponyfill'
import { color, darkColor, validColor, borderRadius, lightColor, errorColor } from './_subs/Colors'
import GetTheme from './_subs/GetTheme'

const theme = GetTheme(
  {
    color,
    darkColor,
    validColor,
    borderRadius,
    lightColor,
    errorColor
  }
)

cssVars({
  variables: theme
})
