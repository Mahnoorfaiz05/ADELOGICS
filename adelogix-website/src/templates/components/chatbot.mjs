// Chatbot UI component — Phase 1 (predefined FAQ engine)
// Exports renderChatbot(knowledge) returning HTML string.
// Knowledge base is embedded in the HTML as JSON for client-side use.

export function renderChatbot(knowledge) {
  const { faqEntries, suggestedQuestions, welcomeMessage, projectSummaries } = knowledge;
  const knowledgeJson = JSON.stringify({
    faqEntries,
    suggestedQuestions,
    welcomeMessage,
    projectSummaries,
  });

  return `
<div class="chatbot" data-chatbot>
  <!-- Floating launcher -->
  <button class="chatbot__launcher" type="button" data-chatbot-toggle aria-label="Open chat" aria-expanded="false" aria-controls="chatbot-window">
    <span class="chatbot__launcher-icon" aria-hidden="true">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2z"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="12" y1="13" x2="12" x2="21"></line></svg>
    </span>
    <span class="chatbot__launcher-text">Chat</span>
    <span class="chatbot__launcher-pulse" aria-hidden="true"></span>
  </button>

  <!-- Chat window -->
  <div class="chatbot__window" id="chatbot-window" hidden data-chatbot-window>
    <div class="chatbot__header">
      <div class="chatbot__header-brand">
        <span class="chatbot__header-dot" aria-hidden="true"></span>
        <strong>Adelogix Assistant</strong>
      </div>
      <div class="chatbot__header-actions">
        <button class="chatbot__btn" type="button" data-chatbot-new aria-label="New conversation" title="New conversation">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 16s1-3 4-3 5 2 8 2 8-6 2-6 2 2 2-4 0-6-4-6-2-4"></path><circle cx="5" cy="19" r="1"></circle></svg>
        </button>
        <button class="chatbot__btn chatbot__btn--close" type="button" data-chatbot-toggle aria-label="Close chat" title="Close">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>
    </div>

    <div class="chatbot__messages" data-chatbot-messages role="log" aria-label="Conversation">
      <!-- Welcome message injected by JS -->
    </div>

    <div class="chatbot__suggested" data-chatbot-suggested>
      <!-- Suggested questions injected by JS -->
    </div>

    <div class="chatbot__input-area">
      <form class="chatbot__form" data-chatbot-form>
        <input class="chatbot__input" type="text" placeholder="Ask about Adelogix services, case studies or contact..." autocomplete="off" data-chatbot-input required />
        <button class="chatbot__btn--send" type="submit" data-chatbot-send aria-label="Send message">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
        </button>
      </form>
    </div>
  </div>
</div>
<script type="application/json" data-chatbot-knowledge>${knowledgeJson}</script>
`;

}
