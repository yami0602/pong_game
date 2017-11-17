import $ from "jquery";

function waiting(text) {
  var waiting = document.createElement("div");
  waiting.classList.add('waiting');
  waiting.setAttribute("id", "waiting");
  waiting.innerHTML = `
    <div class="psoload">
      <div class="straight"></div>
      <div class="curve"></div>
      <div class="center"></div>
      <div class="inner"></div>
    </div>
    <h3>${text || 'WAITING FOR OPONENT'}</h3>
  `;

  document.body.appendChild(waiting);
}

export const remove = function (){
  $("#waiting").remove();
}

export default waiting;
