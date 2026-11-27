<script lang="ts" setup>
import type { MazUiTranslationsNestedSchema } from '@maz-ui/translations'
import type { DiffGap, DiffLine, DiffRow } from '@maz-ui/utils/helpers/diffLines'
import type { DeepPartial } from '@maz-ui/utils/ts-helpers/DeepPartial'
import { useTranslations } from '@maz-ui/translations/composables/useTranslations'
import { diffLines, diffStats, foldDiff } from '@maz-ui/utils/helpers/diffLines'
import { computed, onMounted, ref, watch } from 'vue'
import { escapeHtml } from '../../utils/escapeHtml.ts'
import { tokensHtml } from './html.ts'
import { loadShiki } from './shiki.ts'

export interface MazCodeHighlightDiffProps {
  /** New text */
  code: string
  /** Old text */
  diff: string
  language: string
  /** Resolved shiki theme */
  theme: string
  context: number
  ignoreWhitespace: boolean
  wrap: boolean
  hideLanguage: boolean
  copyable: boolean
  translations?: DeepPartial<MazUiTranslationsNestedSchema['codeHighlight']>
}

type GapRow = DiffGap & { key: string }

const props = defineProps<MazCodeHighlightDiffProps>()

const emit = defineEmits<{
  ready: []
}>()

const { t } = useTranslations()

const identicalLabel = computed(() => props.translations?.diff?.identical ?? t('codeHighlight.diff.identical'))
const expandLabel = (count: number) => props.translations?.diff?.expand?.replace('{count}', String(count)) ?? t('codeHighlight.diff.expand', { count })

const lines = computed(() => diffLines(props.diff, props.code, { ignoreWhitespace: props.ignoreWhitespace }))
const stats = computed(() => diffStats(lines.value))
const identical = computed(() => stats.value.additions === 0 && stats.value.deletions === 0)
const additionsLabel = computed(() => props.translations?.diff?.additions?.replace('{count}', String(stats.value.additions)) ?? t('codeHighlight.diff.additions', { count: stats.value.additions }))
const deletionsLabel = computed(() => props.translations?.diff?.deletions?.replace('{count}', String(stats.value.deletions)) ?? t('codeHighlight.diff.deletions', { count: stats.value.deletions }))
const numberWidth = computed(() => `${String(lines.value.reduce((max, line) => Math.max(max, line.oldLine ?? 0, line.newLine ?? 0), 0)).length}ch`)

onMounted(() => emit('ready'))

const expanded = ref(new Set<string>())

watch(lines, () => {
  expanded.value = new Set()
})

function gapKey(gap: DiffGap) {
  const first = gap.lines[0]!
  return `${first.oldLine ?? ''}:${first.newLine ?? ''}`
}

const folded = computed<DiffRow[]>(() => Number.isFinite(props.context) ? foldDiff(lines.value, props.context) : lines.value)

const rows = computed<(DiffLine | GapRow)[]>(() => folded.value.flatMap<DiffLine | GapRow>((row) => {
  if (row.type !== 'gap')
    return [row]
  const key = gapKey(row)
  return expanded.value.has(key) ? row.lines : [{ ...row, key }]
}))

function expand(gap: GapRow) {
  expanded.value = new Set(expanded.value).add(gap.key)
}

const oldHtml = ref<string[]>([])
const newHtml = ref<string[]>([])
const preStyle = ref<string>()
let highlightSeq = 0

async function highlight() {
  const seq = ++highlightSeq
  try {
    const { codeToTokens } = await loadShiki()
    const options = { lang: props.language, theme: props.theme } as Parameters<typeof codeToTokens>[1]
    const [before, after] = await Promise.all([
      props.diff ? codeToTokens(props.diff, options) : undefined,
      props.code ? codeToTokens(props.code, options) : undefined,
    ])
    if (seq !== highlightSeq)
      return
    const result = after ?? before
    preStyle.value = result ? result.rootStyle || `background-color:${result.bg ?? ''};color:${result.fg ?? ''}` : undefined
    oldHtml.value = before?.tokens.map(tokensHtml) ?? []
    newHtml.value = after?.tokens.map(tokensHtml) ?? []
  }
  catch {
    if (seq === highlightSeq) {
      preStyle.value = undefined
      oldHtml.value = []
      newHtml.value = []
    }
  }
}

watch(() => [props.diff, props.code, props.language, props.theme], highlight, { immediate: true })

function htmlOf(line: DiffLine): string {
  const html = line.type === 'remove'
    ? oldHtml.value[line.oldLine! - 1]
    : newHtml.value[line.newLine! - 1]
  return html || escapeHtml(line.text)
}

const MARKS = { add: '+', remove: '-', same: ' ' } as const
</script>

<template>
  <pre
    class="shiki m-code-highlight-diff"
    :class="{ '--wrap': wrap }"
    :style="preStyle"
    tabindex="0"
  ><code class="m-code-highlight-diff__code"><span v-if="identical" class="m-code-highlight-diff__identical">{{ identicalLabel }}</span><template v-else><template v-for="(row, index) in rows" :key="row.type === 'gap' ? `gap-${row.key}` : index"><button v-if="row.type === 'gap'" type="button" class="m-code-highlight-diff__gap" @click="expand(row)">{{ expandLabel(row.lines.length) }}</button><span v-else class="m-code-highlight-diff__line" :class="`--${row.type}`" :style="{ '--m-code-highlight-diff-number': numberWidth }"><span class="m-code-highlight-diff__number" aria-hidden="true">{{ row.oldLine }}</span><span class="m-code-highlight-diff__number" aria-hidden="true">{{ row.newLine }}</span><span class="m-code-highlight-diff__mark">{{ MARKS[row.type] }}</span><span class="m-code-highlight-diff__text" v-html="htmlOf(row)" /></span></template></template></code></pre>
  <span
    v-if="!hideLanguage || !identical"
    class="maz:absolute maz:top-2 maz:right-2 maz:flex maz:gap-2 maz:rounded-sm maz:px-2 maz:py-1 maz:text-caption"
    :class="{ 'maz:transition-opacity maz:group-hover:opacity-0': copyable }"
  >
    <template v-if="!identical">
      <span class="maz:text-success" :aria-label="additionsLabel">+{{ stats.additions }}</span>
      <span class="maz:text-destructive" :aria-label="deletionsLabel">-{{ stats.deletions }}</span>
    </template>
    <template v-if="!hideLanguage">{{ language }}</template>
  </span>
</template>

<style scoped>
@reference "../../tailwindcss/tailwind.css";

.m-code-highlight-diff__code {
  @apply maz:block;

  inline-size: max-content;
  min-inline-size: 100%;
}

.m-code-highlight-diff.--wrap .m-code-highlight-diff__code {
  max-inline-size: 100%;
}

.m-code-highlight-diff__line {
  @apply maz:flex maz:items-baseline;

  margin-inline: calc(var(--m-code-highlight-pad, 1rem) * -1);
  padding-inline: var(--m-code-highlight-pad, 1rem);

  &.--add {
    @apply maz:bg-success/10;
  }

  &.--remove {
    @apply maz:bg-destructive/10;
  }
}

.m-code-highlight-diff__number {
  @apply maz:shrink-0 maz:pe-2 maz:text-end maz:opacity-50 maz:tabular-nums maz:select-none;

  inline-size: calc(var(--m-code-highlight-diff-number, 2ch) + 0.5rem);
}

.m-code-highlight-diff__mark {
  @apply maz:w-4 maz:shrink-0 maz:text-center maz:select-none;
}

.--add > .m-code-highlight-diff__mark {
  @apply maz:text-success;
}

.--remove > .m-code-highlight-diff__mark {
  @apply maz:text-destructive;
}

.m-code-highlight-diff__text {
  @apply maz:min-w-0 maz:flex-1;
}

.m-code-highlight-diff__gap {
  @apply maz:block maz:cursor-pointer maz:bg-foreground/5 maz:py-1 maz:text-center maz:font-[inherit] maz:opacity-70 maz:select-none maz:hover:bg-foreground/10 maz:hover:opacity-100 maz:focus-visible:outline-2 maz:focus-visible:-outline-offset-2 maz:focus-visible:outline-primary;

  margin-inline: calc(var(--m-code-highlight-pad, 1rem) * -1);
  inline-size: calc(100% + var(--m-code-highlight-pad, 1rem) * 2);
}

.m-code-highlight-diff__identical {
  @apply maz:block maz:opacity-70;
}
</style>
