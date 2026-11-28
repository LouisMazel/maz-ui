<script lang="ts" setup>
const email = ref('')
const search = ref('Maz UI')
const bio = ref('')
const message = ref('')

const emailValid = computed(() => /^\S[^\s@]*@\S[^\s.]*\.\S+$/.test(email.value))
const emailError = computed(() => !!email.value && !emailValid.value)
const emailText = computed(() => {
  if (emailValid.value)
    return 'Cette adresse est valide'
  if (emailError.value)
    return 'Il manque un @ ou un domaine'
  return 'On ne la partage avec personne'
})
</script>

<template>
  <ModernisationSection
    id="pr3-fields"
    title="PR 3. Champs"
    description="MazInput et MazTextarea partagent la même base : un check se dessine quand le champ est valide, le message cède la place au suivant, le bouton d'effacement apparaît, le compteur se remplit."
  >
    <div class="grid gap-4 lg:grid-cols-2">
      <ModernisationDemo title="Validation en direct" hint="Tape une adresse e-mail : le message d'aide laisse la place à l'erreur, puis un check se dessine quand elle est valide.">
        <MazInput
          v-model="email"
          label="Adresse e-mail"
          type="email"
          :success="emailValid"
          :error="emailError"
          :assistive-text="emailText"
          autocomplete="off"
          block
        />
      </ModernisationDemo>

      <ModernisationDemo title="Bouton d'effacement" hint="Le bouton grandit quand le champ a une valeur, il se focalise au clavier et ramène le focus dans le champ.">
        <MazInput v-model="search" label="Recherche" clearable block autocomplete="off" />
      </ModernisationDemo>

      <ModernisationDemo title="Zone de texte avec compteur" hint="La hauteur suit le texte. L'anneau se remplit, passe à l'orange à 90 % puis au rouge à la limite.">
        <MazTextarea v-model="bio" label="Présentation" counter maxlength="80" assistive-text="80 caractères maximum" />
      </ModernisationDemo>

      <ModernisationDemo title="Libellé au-dessus" hint="topLabel remplace le libellé flottant. Il peut aussi se régler une fois pour toute l'app avec defaults.global.topLabel.">
        <div class="flex flex-col gap-4">
          <MazInput top-label="Nom complet" placeholder="Ada Lovelace" block autocomplete="off" />
          <MazTextarea v-model="message" top-label="Ton message" placeholder="Écris ici" />
        </div>
      </ModernisationDemo>

      <ModernisationDemo title="Sans animation" hint="Avec animated à false, le champ reste comme avant : pas de check, pas de transition.">
        <MazInput label="Champ valide" success :animated="false" assistive-text="Aucun check dessiné" block autocomplete="off" />
      </ModernisationDemo>
    </div>
  </ModernisationSection>
</template>
