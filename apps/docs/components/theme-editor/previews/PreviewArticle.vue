<template>
  <article class="maz:mx-auto maz:flex maz:max-w-3xl maz:flex-col maz:gap-6 maz:p-[clamp(1.5rem,5vw,3.5rem)]">
    <header class="maz:flex maz:flex-col maz:gap-4">
      <p class="maz:m-0 maz:text-overline maz:text-primary maz:uppercase">
        Design system
      </p>
      <h1 class="maz:m-0 maz:text-display">
        A theme is a promise kept on every screen
      </h1>
      <p class="maz:m-0 maz:text-body-lg maz:text-muted">
        How twelve type levels, eight colors and one radius turn a component library into your product.
      </p>
      <div class="maz:flex maz:items-center maz:gap-3">
        <MazAvatar caption="Ada Lovelace" size="2.5rem" color="auto" />
        <div>
          <p class="maz:m-0 maz:text-label">
            Ada Lovelace
          </p>
          <p class="maz:m-0 maz:text-caption">
            March 12 · 6 min read
          </p>
        </div>
      </div>
    </header>

    <div class="maz:rich-text maz:max-w-none">
      <p>
        Every component of Maz-UI reads the same tokens: the colors of the preset, its fonts, its radius and its <a href="#">type scale</a>. Change one of them and the buttons, cards, dialogs and the text of this article follow.
      </p>
      <h2>Start from the content</h2>
      <p>
        Pick the levels by role, not by size: a card title is <code>text-title-3</code> wherever it lives, and the preset decides what that means.
      </p>
      <ul>
        <li>One primary action per view.</li>
        <li>Muted text for the metadata, never for the content.</li>
        <li>Body text at 4.5:1 on the surface, at least.</li>
      </ul>
      <blockquote>
        Good typography is invisible. Bad typography is everywhere.
      </blockquote>
      <h3>Tokens at a glance</h3>
      <table>
        <thead>
          <tr>
            <th>Token</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>primary</code></td>
            <td>Main actions, links, focus</td>
          </tr>
          <tr>
            <td><code>secondary</code></td>
            <td>A second strong brand color</td>
          </tr>
          <tr>
            <td><code>accent</code></td>
            <td>Highlights and illustrations</td>
          </tr>
        </tbody>
      </table>
      <pre><code>app.use(MazUi, { theme: { preset: brandPreset } })</code></pre>
      <p>
        Press <kbd>⌘</kbd> <kbd>K</kbd> to search the docs.
      </p>
    </div>
  </article>
</template>
