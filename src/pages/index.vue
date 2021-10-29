<template>
  <div class="text-left flex flex-col items-center">
    <div>
      <h1 class="text-3xl">
        Discord Reaction Embed Creator
      </h1>
      Long name aside, this tool allows you to create a Discord embed then post it via a Webhook URL to your discord server.<br /><br />
      Before proceeding, you'll want to head over to your Discord server and create a Webhook.<br />
      To do so, see "Making a Webhook" section <a
        class="text-blue-500 hover:text-blue-600"
        href="https://support.discord.com/hc/en-us/articles/228383668-Intro-to-Webhooks"
      >Here</a>.<br />
      Once you've done this, click "Copy Webhook URL" and paste it into the Webhook box on the creator page.
      <br /><br />
      <router-link to="/create" class="bg-blue-500 hover:bg-blue-600 p-2 font-bold">
        Create Webhook
      </router-link>
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  layout: default
</route>
