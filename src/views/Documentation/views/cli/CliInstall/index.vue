<template>
  <div class="maz-cli">
    <h2>
      Maz-Cli
    </h2>

    <hr class="maz-border-top maz-border-solid maz-border-color maz-my-5">

    <p>
      <a
        href="https://github.com/LouisMazel/maz-cli"
        target="_blank"
      >
        Maz-CLI
      </a>
      is a command line interface to generate projects with Maz-UI
    </p>

    <h3>
      Install
    </h3>

    <CodeContainer
      language="bash"
      code="npm install -g maz-cli
# yarn global add maz-cli"
    />

    <h3>
      Create Nuxt.JS x Prismic project
    </h3>

    <p>
      With Maz-CLI you can generate a
      <a
        href="https://nuxtjs.org/"
        target="_blank"
      >Nuxt.JS</a> project with the
      headless CMS
      <a
        href="https://prismic.io/"
        target="_blank"
      >Prismic</a> and Maz-UI
    </p>

    <h4>
      Prerequisites
    </h4>

    <p>
      To set the default config of the project, we need:
    </p>

    <ol class="pl-3">
      <li>
        Prismic
        <ul>
          <li>
            Prismic account & repo created
          </li>
        </ul>
      </li>
      <li>
        Website public URL or future URL. Can be changed
      </li>
      <li>
        <strong>optionnal</strong>: If you want use a client e-mail to use
        contact form and receive email requests on you email
        <ul>
          <li>
            Mailgun account:
            <ul>
              <li>
                apiKey
              </li>
              <li>
                domain
              </li>
            </ul>
          </li>
          <li>
            SMTP
            <ul>
              <li>
                host
              </li>
              <li>
                port
              </li>
              <li>
                auth user
              </li>
              <li>
                auth pass
              </li>
            </ul>
          </li>
        </ul>
      </li>
    </ol>

    <h4>
      Launch generator
    </h4>

    <p>
      From the temrinal, launch this command in your workspace directory and and
      give the answers to the information requested to generate the project
    </p>

    <CodeContainer
      code="maz create <app-name>"
      language="bash"
    />

    <p />

    <h3>
      CLI Options
    </h3>

    <h4>
      Help
    </h4>

    <CodeContainer
      code="maz --help
# Alias: -h --> Show all commands"
      language="bash"
    />

    <h4>
      Version
    </h4>

    <CodeContainer
      code="maz --version
# Alias: -v --> Show version number"
      language="bash"
    />
  </div>
</template>

<script>
export default {
  name: 'CliInstall'
}
</script>
