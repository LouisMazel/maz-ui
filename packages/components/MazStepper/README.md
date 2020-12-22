# MazStepper

## Props

<!-- @vuese:MazStepper:props:start -->

| Name                  | Description                               | Type      | Required | Default |
| --------------------- | ----------------------------------------- | --------- | -------- | ------- |
| value                 | value of active step                      | `Number`  | `true`   | -       |
| steps                 | steps number                              | `Number`  | `false`  | 1       |
| color                 | choose a color from list                  | `String`  | `false`  | primary |
| showStepNumber        | If is `true`, item number is shown        | `Boolean` | `false`  | false   |
| space                 | flexbox space (`around`, `between`)       | `String`  | `false`  | around  |
| size                  | step size                                 | `Number`  | `false`  | 10      |
| variant               | step style (`dot`, `square`)              | `String`  | `false`  | dot     |
| shadow                | add shadow elevation to step buttons      | `Boolean` | `false`  | false   |
| disabled              | disallow step click                       | `Boolean` | `false`  | false   |
| disabledSteps         | disallow multiple steps click             | `Array`   | `false`  | Array   |
| disabledNextSteps     | disallow next steps from current step     | `Boolean` | `false`  | false   |
| disabledPreviousSteps | disallow previous steps from current step | `Boolean` | `false`  | false   |
| dark                  | set dark mode                             | `Boolean` | `false`  | false   |

<!-- @vuese:MazStepper:props:end -->

## Events

<!-- @vuese:MazStepper:events:start -->

| Event Name | Description                    | Parameters |
| ---------- | ------------------------------ | ---------- |
| input      | return the step number clicked | `Number`   |

<!-- @vuese:MazStepper:events:end -->
