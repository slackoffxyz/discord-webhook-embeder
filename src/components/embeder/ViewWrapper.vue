<template>
  <div class="w-100 h-100 br2 flex flex-column white overflow-hidden bg-discord-dark">
    <div class="w-100 h-100 overflow-auto pa2 discord-view">
      <div class="flex-vertical whitney theme-dark">
        <div class="chat flex-vertical flex-spacer">
          <div class="content flex-spacer flex-horizontal">
            <div class="flex-spacer flex-vertical messages-wrapper">
              <div class="scroller-wrap">
                <div class="scroller messages">
                  <slot />>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
