<template>
  <div class="maz-img-doc">
    <h4>
      Examples
    </h4>
    <ComponentContainer
      code="<template>
  <h5 class=&quot;maz-mb-3&quot;>
    Basic
  </h5>
  <p class=&quot;maz-mb-3&quot;>
    The image is shown in its natural dimension
  </p>
  <MazImg
    src=&quot;https://static.lexpress.fr/medias_10049/w_2048,h_890,c_crop,x_0,y_365/w_1000,h_563,c_fill,g_north/v1535723159/gerard-depardieu-22_5145169.jpg&quot;
    alt=&quot;Gerard depardieu&quot;
  />
  <br>
  <h5 class=&quot;maz-mb-3&quot;>
    Contain & alt
  </h5>
  <p class=&quot;maz-mb-3&quot;>
    The picture is shown in full no matter what width and height you give
  </p>
  <MazImg
    src=&quot;https://cdn-s-www.ledauphine.com/images/90066DFC-58B0-4D62-A7F8-EA5C9C3D040C/NW_detail_M/title-1576680650.jpg&quot;
    alt=&quot;Gerard depardieu&quot;
    contain
    style=&quot;height: 300px; width: 400px;&quot;
  />
  <br>
  <h5 class=&quot;maz-mb-3&quot;>
    Legend & fullwidth
  </h5>
  <p class=&quot;maz-mb-3&quot;>
    The picture is shown in fullwidth of parent and with a legend
  </p>
  <MazImg
    src=&quot;https://www.slate.fr/sites/default/files/styles/1060x523/public/depardieu_0.jpg&quot;
    legend=&quot;Gerard depardieu&quot;
    fullwidth
  />
  <br>
  <h5 class=&quot;maz-mb-3&quot;>
    no-zoom & no-shadow & no-border-radius
  </h5>
  <p class=&quot;maz-mb-3&quot;>
    User can't click to view whole image and no shadows and border radius apply
  </p>
  <MazImg
    src=&quot;https://photos.tf1.fr/940/531/gerard-depardieu-2-855131-0@1x.jpg&quot;
    no-zoom
    no-shadow
    no-border-radius
  />
</template>"
    >
      <h5 class="maz-mb-3">
        Basic
      </h5>
      <p class="maz-mb-3">
        The image is shown in its natural dimension
      </p>
      <MazImg
        src="https://static.lexpress.fr/medias_10049/w_2048,h_890,c_crop,x_0,y_365/w_1000,h_563,c_fill,g_north/v1535723159/gerard-depardieu-22_5145169.jpg"
        alt="Gerard depardieu"
      />
      <br>
      <h5 class="maz-mb-3">
        Contain & alt
      </h5>
      <p class="maz-mb-3">
        The picture is shown in full no matter what width and height you give
      </p>
      <MazImg
        src="https://cdn-s-www.ledauphine.com/images/90066DFC-58B0-4D62-A7F8-EA5C9C3D040C/NW_detail_M/title-1576680650.jpg"
        alt="Gerard depardieu"
        contain
        style="height: 300px; width: 400px;"
      />
      <br>
      <h5 class="maz-mb-3">
        Legend & fullwidth
      </h5>
      <p class="maz-mb-3">
        The picture is shown in fullwidth of parent and with a legend
      </p>
      <MazImg
        src="https://www.slate.fr/sites/default/files/styles/1060x523/public/depardieu_0.jpg"
        legend="Gerard depardieu"
        fullwidth
      />
      <br>
      <h5 class="maz-mb-3">
        no-zoom & no-shadow & no-border-radius
      </h5>
      <p class="maz-mb-3">
        User can't click to view whole image and no shadows and border radius apply
      </p>
      <MazImg
        src="https://photos.tf1.fr/940/531/gerard-depardieu-2-855131-0@1x.jpg"
        no-zoom
        no-shadow
        no-border-radius
      />
    </ComponentContainer>

    <hr
      id="howToUseIt"
      class="maz-border-top maz-border-solid maz-border-color maz-my-5"
    >

    <h3>
      How to use it ?
    </h3>

    <CodeContainer
      language="html"
      code="<template>
  <MazImg src=&quot;<YOUR_PICTURE_URL>&quot; />
</template>

<script>
  import { MazImg } from 'maz-ui'
  export default {
    components: { MazImg }
  }
</script>"
    />
  </div>
</template>

<script>
export default {
  name: 'MazImgDoc'
}
</script>
