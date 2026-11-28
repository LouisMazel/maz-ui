<script lang="ts" setup>
const allFruits = ['Pomme', 'Poire', 'Cerise']
const fruits = ref<string[]>(['Pomme'])
const allChecked = computed(() => fruits.value.length === allFruits.length)
const someChecked = computed(() => fruits.value.length > 0 && !allChecked.value)

function toggleAll(checked: boolean) {
  fruits.value = checked
    ? [...allFruits]
    : []
}

const newsletter = ref(false)
const notifications = ref(true)
const radioValue = ref('b')

const period = ref('semaine')
const periodOptions = [
  { label: 'Jour', value: 'jour' },
  { label: 'Semaine', value: 'semaine' },
  { label: 'Mois', value: 'mois' },
  { label: 'Année', value: 'annee' },
]

const textStyles = ref(['gras'])
const textStyleOptions = [
  { label: 'Gras', value: 'gras' },
  { label: 'Italique', value: 'italique' },
  { label: 'Souligné', value: 'souligne' },
  { label: 'Barré', value: 'barre', disabled: true },
]

const weekDays = ref(['lun', 'mer'])
const weekDayOptions = ['lun', 'mar', 'mer', 'jeu', 'ven', 'sam', 'dim'].map(value => ({ label: value, value }))

const groupView = ref('liste')
const groupViewItems = [
  { text: 'Liste', value: 'liste' },
  { text: 'Grille', value: 'grille' },
  { text: 'Carte', value: 'carte' },
]
const toolbarItems = [{ text: 'Couper' }, { text: 'Copier' }, { text: 'Coller' }]

const size = ref('m')
const sizeOptions = [
  { label: 'Petit', value: 's' },
  { label: 'Moyen', value: 'm' },
  { label: 'Grand', value: 'l' },
]

const delivery = ref('standard')
const deliveryOptions = [
  { label: 'Standard', value: 'standard', description: 'Livré sous 5 jours', price: 'Gratuit' },
  { label: 'Express', value: 'express', description: 'Livré en 24 heures', price: '9 €' },
  { label: 'Point relais', value: 'relais', description: 'Prêt demain près de chez toi', price: '3 €' },
]

const extras = ref(['garantie'])
const extraItems = [
  { label: 'Garantie étendue', value: 'garantie', description: 'Trois années de plus', price: '49 €' },
  { label: 'Emballage cadeau', value: 'cadeau', description: 'Avec un mot écrit à la main', price: '5 €' },
  { label: 'Livraison express', value: 'express', description: 'Sous 24 heures', price: '12 €' },
  { label: 'Retrait en magasin', value: 'magasin', description: 'Sans frais de port', price: 'Gratuit' },
]
</script>

<template>
  <ModernisationSection
    id="pr3-choices"
    title="PR 3. Choix et bascules"
    description="Cases, radios, interrupteurs et groupes de choix : la coche se dessine, l'encre grandit, le point rebondit, la pill glisse. Les cartes de choix et les bascules multiples arrivent sans nouveau composant."
  >
    <ModernisationDemo title="MazCheckbox" hint="Clique : l'encre grandit depuis le centre et la coche se dessine. Le tiret de l'état indéterminé se dessine aussi. Au clavier (Tab), l'anneau de focus est distinct du halo de survol.">
      <div class="flex flex-wrap items-start gap-10">
        <div class="flex flex-col gap-2">
          <MazCheckbox :model-value="allChecked" :indeterminate="someChecked" @update:model-value="toggleAll">
            Tout sélectionner
          </MazCheckbox>
          <div class="flex flex-col gap-2 ps-8">
            <MazCheckbox v-for="fruit in allFruits" :key="fruit" v-model="fruits" :value="fruit" size="sm">
              {{ fruit }}
            </MazCheckbox>
          </div>
        </div>
        <div class="flex flex-col gap-2">
          <MazCheckbox v-model="newsletter" color="success" label="Recevoir la newsletter" hint="Une fois par mois, promis." />
          <MazCheckbox :model-value="true" disabled label="Désactivée et cochée" />
        </div>
      </div>
    </ModernisationDemo>

    <ModernisationDemo title="MazRadio et MazSwitch" hint="Le point du radio rebondit en place. Le pouce de l'interrupteur s'étire quand tu le presses (maintiens le clic) puis rebondit en place.">
      <div class="flex flex-wrap items-center gap-10">
        <div class="flex gap-6">
          <MazRadio v-model="radioValue" name="pr3-radio" value="a" label="Option A" />
          <MazRadio v-model="radioValue" name="pr3-radio" value="b" label="Option B" />
          <MazRadio v-model="radioValue" name="pr3-radio" value="c" label="Option C" />
        </div>
        <div class="flex flex-col gap-3">
          <MazSwitch v-model="notifications" label="Notifications" />
          <MazSwitch v-model="newsletter" color="success" size="lg" label="Grand interrupteur" />
        </div>
      </div>
    </ModernisationDemo>

    <ModernisationDemo title="MazSegmented" hint="La pill glisse vers le segment choisi, avec l'option stretch elle s'étire en route. Les quatre flèches, Début et Fin déplacent la sélection.">
      <div class="flex flex-col items-start gap-4">
        <MazSegmented v-model="period" :options="periodOptions" aria-label="Période" />
        <MazSegmented v-model="period" :options="periodOptions" stretch color="primary" aria-label="Période avec étirement" />
        <p class="text-body-sm text-muted">
          Choix : {{ period }}
        </p>
      </div>
    </ModernisationDemo>

    <ModernisationDemo title="MazSegmented multiple (bascules)" hint="Plusieurs segments peuvent être actifs : un tableau en v-model, des boutons aria-pressed dans un groupe. Les flèches déplacent le focus sans changer la valeur, Espace bascule.">
      <div class="flex flex-col items-start gap-4">
        <MazSegmented v-model="textStyles" multiple :options="textStyleOptions" aria-label="Style du texte" />
        <MazSegmented v-model="weekDays" multiple :options="weekDayOptions" color="primary" aria-label="Jours de la semaine" />
        <p class="text-body-sm text-muted">
          Texte : {{ textStyles }}. Jours : {{ weekDays }}
        </p>
      </div>
    </ModernisationDemo>

    <ModernisationDemo title="MazBtnGroup" hint="Aspect collé (bordures partagées, un arrondi aux extrémités, séparateurs). Avec v-model et indicator, une pill glisse sur le bouton actif. Avec toolbar, un seul bouton dans la tabulation et les flèches déplacent le focus.">
      <div class="flex flex-col items-start gap-5">
        <MazBtnGroup v-model="groupView" :items="groupViewItems" variant="outline" indicator aria-label="Affichage" />
        <MazBtnGroup :items="groupViewItems" aria-label="Groupe plein" />
        <MazBtnGroup :items="toolbarItems" variant="soft" toolbar aria-label="Actions de texte" />
        <MazBtnGroup :items="toolbarItems" variant="outline" orientation="col" toolbar aria-label="Actions en colonne" />
      </div>
    </ModernisationDemo>

    <ModernisationDemo title="MazRadioButtons" hint="Un cadre glisse vers l'option choisie en s'étirant. La coche du sélecteur se dessine. Ce sont de vrais radios : les flèches changent le choix.">
      <div class="flex flex-col items-start gap-4">
        <MazRadioButtons v-model="size" :options="sizeOptions" aria-label="Taille" />
        <MazRadioButtons v-model="size" :options="sizeOptions" selector color="secondary" aria-label="Taille avec sélecteur" />
        <MazRadioButtons v-model="size" :options="sizeOptions" orientation="col" aria-label="Taille en colonne" />
      </div>
    </ModernisationDemo>

    <ModernisationDemo title="Choix en cartes : MazRadioButtons variant=cards" hint="Un seul choix. La bordure de la carte choisie se dessine. Titre, une ligne et prix sur de vrais radios.">
      <MazRadioButtons
        v-model="delivery"
        :options="deliveryOptions"
        variant="cards"
        orientation="col"
        aria-label="Mode de livraison"
      />
    </ModernisationDemo>

    <ModernisationDemo title="Choix en cartes : MazChecklist variant=cards" hint="Plusieurs choix, avec la recherche : les cartes restantes glissent à leur nouvelle place quand tu filtres.">
      <MazChecklist
        v-model="extras"
        :items="extraItems"
        variant="cards"
        title="Options"
        search
      />
    </ModernisationDemo>
  </ModernisationSection>
</template>
