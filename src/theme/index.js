import cssVars from 'css-vars-ponyfill'
import { color, darkColor, validColor, borderRadius, lightColor, errorColor } from './_subs/Vars'
import breakPoints from './_subs/BreakPoints'
import GetTheme from './_subs/GetTheme'

const theme = GetTheme(
  {
    color,
    darkColor,
    validColor,
    borderRadius,
    lightColor,
    errorColor,
    breakPoints
  }
)

cssVars({
  variables: theme
})
