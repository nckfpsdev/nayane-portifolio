/* Nayane Queiroz Marrocos, Psicóloga
   O site funciona sem JavaScript. Este arquivo só:
   1) monta a mensagem do formulário de contato (versão celular) e abre o WhatsApp;
   2) atualiza o ano do rodapé. Nada é enviado nem guardado por este site. */
(function () {
  'use strict';

  var WHATSAPP = '5585999586711';

  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });

  var form = document.querySelector('[data-wa-form]');
  if (!form) return;

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    var data = new FormData(form);
    var nome = String(data.get('nome') || '').trim();
    var formato = String(data.get('formato') || '').trim();
    var mensagem = String(data.get('text') || '').trim();

    var partes = ['Olá, Nayane! Vim pelo seu site' + (nome ? ' e me chamo ' + nome + '.' : '.')];
    if (formato) partes.push('Tenho interesse em atendimento ' + formato + '.');
    if (mensagem) partes.push(mensagem);

    var url = 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(partes.join(' '));
    var aba = window.open(url, '_blank', 'noopener');
    if (!aba) window.location.href = url; // pop-up bloqueado: abre na mesma aba
  });
})();
