<script lang="ts" setup>
const volume = ref(40)
const range = ref([20, 70])
const steps = ref(50)
const rtlVolume = ref(60)

const quantity = ref(3)
const price = ref(20)

const password = ref('')
const customPassword = ref('')
const score = ref(0)

const code = ref('')
const codeError = ref(false)
const codeValue = ref<string>()

const phone = ref('0666776666')

const tags = ref(['vue', 'nuxt'])
const keywords = ref(['maz-ui', 'design'])

function checkCode() {
  codeError.value = false
  nextTick(() => {
    codeError.value = code.value !== '1234'
  })
}

function longEnough(value: string) {
  return value.length >= 12
}

function customScore(value: string, results: { passed: boolean }[]) {
  const passed = results.filter(result => result.passed).length

  return value.length >= 16 ? 4 : Math.min(3, passed)
}
</script>

<template>
  <ModernisationSection
    id="pr3-inputs"
    title="PR 3. Curseurs, nombres, secrets, codes et tags"
    description="Le curseur se remplit enfin dans le bon sens en RTL. Le nombre glisse et accélère, le secret mesure sa force, le code se secoue en cas d'erreur, les tags entrent et sortent en douceur."
  >
    <div class="grid gap-4 lg:grid-cols-2">
      <ModernisationDemo title="Curseur avec bulle" hint="Appuie sur le pouce ou déplace-le au clavier : une bulle affiche la valeur, le pouce s'enfonce. En RTL, le remplissage part de la droite et les flèches s'inversent.">
        <MazSlider v-model="volume" :min="0" :max="100" />
      </ModernisationDemo>

      <ModernisationDemo title="Graduations" hint="Avec ticks, une graduation par pas. Elles se colorent au passage du remplissage.">
        <MazSlider v-model="steps" :min="0" :max="100" :step="10" ticks />
      </ModernisationDemo>

      <ModernisationDemo title="Deux curseurs" hint="Les graduations entre les deux pouces sont colorées.">
        <MazSlider v-model="range" :min="0" :max="100" :step="10" ticks />
      </ModernisationDemo>

      <ModernisationDemo title="Sans animation" hint="Avec animated à false, la bulle et les graduations changent sans transition.">
        <MazSlider v-model="rtlVolume" ticks :step="20" :animated="false" />
      </ModernisationDemo>

      <ModernisationDemo title="Nombre qui glisse" hint="Un clic sur + ou - fait glisser la valeur. Garde le bouton appuyé : la répétition accélère. Les flèches du clavier ne s'animent pas.">
        <MazInputNumber v-model="quantity" label="Quantité" :min="0" :max="200" suffix="pièces" />
      </ModernisationDemo>

      <ModernisationDemo title="Bouton grisé à la limite" hint="Le bouton + se grise en douceur à 10, la répétition s'arrête.">
        <MazInputNumber v-model="price" label="Prix" :min="0" :max="10" prefix="€" />
      </ModernisationDemo>

      <ModernisationDemo title="Force du mot de passe" hint="Tape un mot de passe : la jauge se remplit, le verdict roule, les règles se cochent.">
        <MazInputSecret v-model="password" label="Mot de passe" strength block />
      </ModernisationDemo>

      <ModernisationDemo title="Règles et calcul personnalisés" :hint="`Une règle maison, un calcul maison. Score actuel : ${score} sur 4.`">
        <MazInputSecret
          v-model="customPassword"
          label="Phrase secrète"
          :strength="{
            rules: ['lowercase', 'number', { label: 'Au moins 12 caractères', test: longEnough }],
            score: customScore,
          }"
          block
          @strength="score = $event"
        />
      </ModernisationDemo>

      <ModernisationDemo title="Code, erreur et secousse" hint="Tape 1234 pour valider : les cellules se remplissent. Tout autre code se secoue.">
        <div class="flex flex-col gap-3">
          <MazInputCode v-model="code" :code-length="4" :error="codeError" hint="Le bon code est 1234" @completed="checkCode" />
          <MazBtn size="sm" variant="outline" @click="code = ''; codeError = false">
            Effacer
          </MazBtn>
        </div>
      </ModernisationDemo>

      <ModernisationDemo title="Code sans animation" hint="Avec animated à false, les chiffres apparaissent d'un coup.">
        <MazInputCode v-model="codeValue" :code-length="6" :animated="false" />
      </ModernisationDemo>

      <ModernisationDemo title="Téléphone formaté en tapant" hint="Le numéro se formate pendant la saisie. Clique au milieu et change un chiffre : le curseur reste à sa place. Efface un espace avec Retour arrière : c'est le chiffre d'avant qui part, et tu peux tout supprimer.">
        <MazInputPhoneNumber v-model="phone" country-code="FR" auto-format="typing" />
      </ModernisationDemo>

      <ModernisationDemo title="Tags" hint="Ajoute un tag : il entre en grossissant. Supprime-en un : il rétrécit et les autres glissent. Tape un doublon : son jumeau se secoue.">
        <MazInputTags v-model="tags" label="Technologies" block />
      </ModernisationDemo>

      <ModernisationDemo title="Tags sans animation" hint="Avec animated à false, les tags apparaissent et disparaissent sans transition.">
        <MazInputTags v-model="keywords" label="Mots-clés" :animated="false" block />
      </ModernisationDemo>
    </div>
  </ModernisationSection>
</template>
