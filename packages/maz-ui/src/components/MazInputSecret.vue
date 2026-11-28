<script lang="ts" setup>
import type { HTMLAttributes } from 'vue'
import type { MazColor, MazRoundedSize, MazSize } from './types.ts'
import { useTranslations } from '@maz-ui/translations/composables/useTranslations'
import { computed, defineAsyncComponent, ref, watch } from 'vue'
import { useInstanceUniqId } from '../composables/useInstanceUniqId.ts'
import MazInput from './MazInput.vue'

defineOptions({
  inheritAttrs: false,
})

const {
  class: classProp,
  style,
  id,
  modelValue,
  saved = false,
  label,
  topLabel,
  assistiveText,
  placeholder,
  replaceLabel,
  clearLabel,
  cancelLabel,
  savedText,
  disabled = false,
  error = false,
  success = false,
  warning = false,
  size = 'md',
  roundedSize = 'md',
  color = 'primary',
  block,
  strength = false,
  animated = true,
} = defineProps<MazInputSecretProps>()

const emits = defineEmits<{
  /**
   * The new secret is typed. Never emitted for the saved secret: it is not known by the component
   * @property {string} value - the typed secret
   */
  'update:model-value': [value?: string]
  /** The user asks to delete the saved secret: update `saved` when it is done */
  'clear': [value: void]
  /** The user starts replacing the saved secret */
  'replace': [value: void]
  /** The user gives up replacing the saved secret, `model-value` is reset to an empty string */
  'cancel': [value: void]
  /**
   * The strength of the typed secret changed, from `0` (very weak) to `4` (strong). Only with the `strength` option
   * @property {number} score - the new score
   */
  'strength': [score: number]
}>()

export type MazInputSecretStrengthRuleName = 'length' | 'lowercase' | 'uppercase' | 'number' | 'symbol'

export interface MazInputSecretStrengthRule {
  /** The text of the rule, displayed in the list */
  label: string
  /** Returns `true` when the secret follows the rule */
  test: (value: string) => boolean
}

export interface MazInputSecretStrengthResult {
  label: string
  passed: boolean
}

export interface MazInputSecretStrengthOptions {
  /**
   * The rules of the list: built-in names (`length`, `lowercase`, `uppercase`, `number`, `symbol`) or your own rules
   * @default ['length', 'lowercase', 'uppercase', 'number', 'symbol']
   */
  rules?: (MazInputSecretStrengthRuleName | MazInputSecretStrengthRule)[]
  /**
   * Minimum length of the `length` rule
   * @default 8
   */
  minLength?: number
  /**
   * Your own scoring: returns a score from `0` (very weak) to `4` (strong).
   * By default the score follows the share of rules followed, and stays at `1` at most below the minimum length
   */
  score?: (value: string, results: MazInputSecretStrengthResult[]) => number
  /**
   * Show the list of rules under the meter
   * @default true
   */
  showRules?: boolean
}

export interface MazInputSecretProps {
  /** Style attribut of the component root element */
  style?: HTMLAttributes['style']
  /** Class attribut of the component root element */
  class?: HTMLAttributes['class']
  /** The id of the input */
  id?: string
  /** @model The new secret typed by the user (empty while the saved secret is untouched) */
  modelValue?: string
  /** A secret is already saved: it is displayed masked, with the replace and clear actions, and never read back */
  saved?: boolean
  /** The label of the field */
  label?: string
  /** Static label displayed above the field */
  topLabel?: string
  /** Text displayed below the field (help, error message) */
  assistiveText?: string
  /** The placeholder of the input when no secret is saved */
  placeholder?: string
  /**
   * The text of the replace button
   * @default 'inputSecret.replace' (translations)
   */
  replaceLabel?: string
  /**
   * The text of the clear button
   * @default 'inputSecret.clear' (translations)
   */
  clearLabel?: string
  /**
   * The text of the cancel button, shown while replacing the saved secret
   * @default 'inputSecret.cancel' (translations)
   */
  cancelLabel?: string
  /**
   * The text read by the screen readers on the masked field
   * @default 'inputSecret.savedDescription' (translations)
   */
  savedText?: string
  /** Disable the field and the buttons */
  disabled?: boolean
  /** Display the field with error style */
  error?: boolean
  /** Display the field with success style */
  success?: boolean
  /** Display the field with warning style */
  warning?: boolean
  /**
   * The size of the field and of the buttons
   * @default 'md'
   */
  size?: MazSize
  /**
   * The rounded size of the field
   * @default 'md'
   */
  roundedSize?: MazRoundedSize
  /**
   * The color of the focused field and of the buttons
   * @default 'primary'
   */
  color?: MazColor
  /** The component will be displayed in full width */
  block?: boolean
  /**
   * Show the strength of the typed secret under the field: a meter that fills, a verdict and the rules that tick themselves.
   * `true` uses the default rules, pass an object to change the rules, the minimum length or the scoring
   * @default false
   */
  strength?: boolean | MazInputSecretStrengthOptions
  /**
   * Animate the meter, the verdict and the rules of the `strength` option
   * @default true
   */
  animated?: boolean
}

const MazBtn = defineAsyncComponent(() => import('./MazBtn.vue'))
const MazRollingText = defineAsyncComponent(() => import('./MazRollingText.vue'))
const MazDrawnIcon = defineAsyncComponent(() => import('./MazDrawnIcon.vue'))

const DEFAULT_RULES: MazInputSecretStrengthRuleName[] = ['length', 'lowercase', 'uppercase', 'number', 'symbol']
const DEFAULT_MIN_LENGTH = 8
const MAX_SCORE = 4
const LEVEL_KEYS = [
  'inputSecret.strengthVeryWeak',
  'inputSecret.strengthWeak',
  'inputSecret.strengthFair',
  'inputSecret.strengthGood',
  'inputSecret.strengthStrong',
] as const
const RULE_KEYS = {
  length: 'inputSecret.ruleLength',
  lowercase: 'inputSecret.ruleLowercase',
  uppercase: 'inputSecret.ruleUppercase',
  number: 'inputSecret.ruleNumber',
  symbol: 'inputSecret.ruleSymbol',
} as const
const BUILT_IN_TESTS: Record<MazInputSecretStrengthRuleName, (value: string, minLength: number) => boolean> = {
  length: (value, minLength) => value.length >= minLength,
  lowercase: value => /\p{Ll}/u.test(value),
  uppercase: value => /\p{Lu}/u.test(value),
  number: value => /\p{N}/u.test(value),
  symbol: value => /[^\p{L}\p{N}\s]/u.test(value),
}

const MASK = '•'.repeat(12)

const { t } = useTranslations()

const instanceId = useInstanceUniqId({
  componentName: 'MazInputSecret',
  providedId: id,
})

const replacing = ref(false)

const isMasked = computed(() => saved && !replacing.value)

const replaceLabelValue = computed(() => replaceLabel || t('inputSecret.replace'))
const clearLabelValue = computed(() => clearLabel || t('inputSecret.clear'))
const cancelLabelValue = computed(() => cancelLabel || t('inputSecret.cancel'))
const savedTextValue = computed(() => savedText || t('inputSecret.savedDescription'))
const savedTextId = computed(() => `${instanceId.value}-saved`)

watch(() => saved, () => {
  replacing.value = false
})

const strengthOptions = computed<MazInputSecretStrengthOptions | undefined>(() => {
  if (!strength)
    return undefined

  return strength === true ? {} : strength
})

const strengthVisible = computed(() => !!strengthOptions.value && !isMasked.value)
const strengthId = computed(() => `${instanceId.value}-strength`)

const strengthRules = computed(() => {
  const options = strengthOptions.value
  const minLength = options?.minLength ?? DEFAULT_MIN_LENGTH

  return (options?.rules ?? DEFAULT_RULES).map((rule) => {
    if (typeof rule !== 'string')
      return rule

    return {
      label: t(RULE_KEYS[rule], { minLength }),
      test: (value: string) => BUILT_IN_TESTS[rule](value, minLength),
    }
  })
})

const strengthResults = computed<MazInputSecretStrengthResult[]>(() => {
  const value = modelValue ?? ''

  return strengthRules.value.map(rule => ({ label: rule.label, passed: value !== '' && rule.test(value) }))
})

const strengthScore = computed(() => {
  const value = modelValue ?? ''
  const options = strengthOptions.value

  if (!options || value === '')
    return 0

  if (options.score)
    return Math.min(MAX_SCORE, Math.max(0, Math.round(options.score(value, strengthResults.value))))

  const results = strengthResults.value
  const passed = results.filter(result => result.passed).length
  const score = results.length ? Math.floor(passed / results.length * MAX_SCORE) : 0
  const minLength = options.minLength ?? DEFAULT_MIN_LENGTH

  return value.length < minLength ? Math.min(score, 1) : score
})

const strengthVerdict = computed(() => (modelValue ? t(LEVEL_KEYS[strengthScore.value]) : '\u00A0'))

watch(strengthScore, (score) => {
  if (strengthVisible.value)
    emits('strength', score)
})

function startReplace() {
  replacing.value = true
  emits('replace')
}

function cancelReplace() {
  replacing.value = false
  emits('update:model-value', '')
  emits('cancel')
}
</script>

<template>
  <div
    class="m-input-secret m-reset-css maz:inline-flex maz:items-start maz:gap-2 maz:align-top"
    :class="[classProp, { '--block': block, 'maz:w-full': block, '--saved': isMasked, 'maz:flex-wrap': strengthVisible }]"
    :style
  >
    <MazInput
      v-if="isMasked"
      :id="instanceId"
      v-bind="$attrs"
      class="maz:min-w-0 maz:flex-1"
      :model-value="MASK"
      type="text"
      :label
      :top-label
      :assistive-text
      :size
      :color
      :rounded-size
      :aria-describedby="savedTextId"
      :disabled
      :error
      :success
      :warning
      autocomplete="off"
      readonly
      block
    />
    <MazInput
      v-else
      :id="instanceId"
      v-bind="$attrs"
      class="maz:min-w-0 maz:flex-1"
      :model-value="modelValue"
      type="password"
      :label
      :top-label
      :assistive-text
      :placeholder
      :size
      :color
      :rounded-size
      :disabled
      :error
      :success
      :warning
      :auto-focus="replacing"
      :aria-describedby="strengthVisible ? strengthId : undefined"
      autocomplete="new-password"
      block
      @update:model-value="$emit('update:model-value', $event as string | undefined)"
    />

    <div
      v-if="strengthVisible"
      :id="strengthId"
      class="m-input-secret__strength maz:order-last maz:flex maz:w-full maz:flex-col maz:gap-2"
      :class="[`--level-${strengthScore}`, { '--static': !animated }]"
    >
      <div class="maz:flex maz:items-center maz:gap-3">
        <div
          class="m-input-secret__meter maz:h-1.5 maz:flex-1 maz:overflow-hidden maz:rounded-full maz:bg-surface-300"
          role="meter"
          :aria-label="t('inputSecret.strengthLabel')"
          aria-valuemin="0"
          :aria-valuemax="MAX_SCORE"
          :aria-valuenow="strengthScore"
          :aria-valuetext="modelValue ? strengthVerdict : undefined"
        >
          <div class="m-input-secret__meter-bar" :style="{ '--m-strength-ratio': strengthScore / MAX_SCORE }" />
        </div>
        <span class="m-input-secret__verdict maz:min-w-20 maz:text-end maz:text-sm maz:font-medium" aria-live="polite">
          <MazRollingText :value="strengthVerdict" :animated />
        </span>
      </div>

      <ul v-if="strengthOptions?.showRules !== false" class="m-input-secret__rules maz:m-0 maz:flex maz:list-none maz:flex-col maz:gap-1 maz:p-0 maz:text-sm">
        <li
          v-for="(result, index) in strengthResults"
          :key="index"
          class="m-input-secret__rule maz:flex maz:items-center maz:gap-2"
          :data-passed="result.passed"
        >
          <span class="m-input-secret__rule-icon maz:relative maz:flex maz:size-4 maz:flex-none maz:flex-center" aria-hidden="true">
            <MazDrawnIcon name="check" :drawn="result.passed" :stroke-width="2.5" />
          </span>
          <span>{{ result.label }}</span>
          <span class="maz:sr-only">{{ result.passed ? t('inputSecret.ruleMet') : t('inputSecret.ruleNotMet') }}</span>
        </li>
      </ul>
    </div>

    <span v-if="isMasked" :id="savedTextId" class="maz:sr-only">{{ savedTextValue }}</span>

    <div
      v-if="saved"
      class="m-input-secret__actions maz:flex maz:flex-none maz:gap-2"
      :class="{ 'maz:mt-6': topLabel }"
    >
      <template v-if="isMasked">
        <MazBtn
          class="m-input-secret__replace"
          :color
          :size
          variant="outline"
          :disabled
          @click="startReplace"
        >
          {{ replaceLabelValue }}
        </MazBtn>
        <MazBtn
          class="m-input-secret__clear"
          color="destructive"
          :size
          variant="outline"
          :disabled
          @click="$emit('clear')"
        >
          {{ clearLabelValue }}
        </MazBtn>
      </template>
      <MazBtn
        v-else
        class="m-input-secret__cancel"
        color="transparent"
        :size
        :disabled
        @click="cancelReplace"
      >
        {{ cancelLabelValue }}
      </MazBtn>
    </div>
  </div>
</template>

<style scoped>
.m-input-secret__meter-bar {
  block-size: 100%;
  inline-size: 100%;
  background-color: var(--maz-destructive);
  transform: scaleX(var(--m-strength-ratio, 0));
  transform-origin: left center;
  transition:
    transform calc(var(--maz-motion-slow, 300ms) * var(--maz-motion-scale, 1)) var(--maz-easing-spring, ease-out),
    background-color calc(var(--maz-motion-normal, 200ms) * var(--maz-motion-scale, 1)) var(--maz-easing-out, ease-out);
}

.m-input-secret__meter:dir(rtl) .m-input-secret__meter-bar {
  transform-origin: right center;
}

.m-input-secret__strength {
  &.--level-2 {
    --m-strength-color: var(--maz-warning);
  }

  &.--level-3,
  &.--level-4 {
    --m-strength-color: var(--maz-success);
  }

  &.--level-0,
  &.--level-1 {
    --m-strength-color: var(--maz-destructive);
  }

  & .m-input-secret__meter-bar {
    background-color: var(--m-strength-color);
  }

  & .m-input-secret__verdict {
    color: var(--m-strength-color);
    transition: color calc(var(--maz-motion-normal, 200ms) * var(--maz-motion-scale, 1)) var(--maz-easing-out, ease-out);
  }

  &.--static .m-input-secret__meter-bar,
  &.--static .m-input-secret__verdict,
  &.--static .m-input-secret__rule,
  &.--static .m-input-secret__rule-icon::before {
    transition: none;
  }
}

.m-input-secret__rule {
  color: var(--maz-muted);
  transition: color calc(var(--maz-motion-normal, 200ms) * var(--maz-motion-scale, 1)) var(--maz-easing-out, ease-out);

  &[data-passed='true'] {
    color: var(--maz-success);
  }
}

.m-input-secret__rule-icon::before {
  content: '';
  position: absolute;
  inline-size: 0.375rem;
  block-size: 0.375rem;
  border-radius: 9999px;
  background-color: currentcolor;
  opacity: 0.5;
  transition: opacity calc(var(--maz-motion-fast, 100ms) * var(--maz-motion-scale, 1)) var(--maz-easing-out, ease-out);
}

.m-input-secret__rule[data-passed='true'] .m-input-secret__rule-icon::before {
  opacity: 0;
}
</style>
