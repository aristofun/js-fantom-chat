/** https://stackoverflow.com/a/7053197/1245302 */
function ready(callback) {
  // in case the document is already rendered
  if (document.readyState != 'loading') callback();
  // modern browsers
  else if (document.addEventListener) document.addEventListener('DOMContentLoaded', callback);
  // IE <= 8
  else document.attachEvent('onreadystatechange', function () {
      if (document.readyState == 'complete') callback();
    });
}

function getAll(selector) {
  return Array.prototype.slice.call(document.querySelectorAll(selector), 0);
}

let $dropdowns;

const closeDropdowns = () => {
  $dropdowns.forEach(function (el) {
    el.classList.remove('is-active');
  });
};

ready(() => {
  $dropdowns = getAll('.dropdown:not(.is-hoverable)');

  if ($dropdowns.length > 0) {
    $dropdowns.forEach(function (el) {
      el.addEventListener('click', (event) => {
        // console.log('click on dropdown', event);
        event.stopPropagation();
        el.classList.toggle('is-active');
      });
    });

    document.addEventListener('click', (event) => {
      closeDropdowns();
    });
  }
});

// Modals

let $rootEl;
let $modals;

function openModal(target, message) {
  const _target = document.getElementById(target);
  $rootEl.classList.add('is-clipped');
  if (message) _target.querySelector('#message').innerHTML = message;

  _target.classList.add('is-active');
}

function closeModals() {
  $rootEl.classList.remove('is-clipped');
  $modals.forEach(function (el) {
    el.classList.remove('is-active');
  });
}


ready(() => {
  $rootEl = document.documentElement;
  $modals = getAll('.modal');
  const $modalButtons = getAll('.modal-button');
  const $modalCloses = getAll('.modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button, .modal-content .delete');

  if ($modalButtons.length > 0) {
    $modalButtons.forEach(function (el) {
      el.addEventListener('click', function () {
        const target = el.dataset.target;
        openModal(target);
      });
    });
  }

  if ($modalCloses.length > 0) {
    $modalCloses.forEach(function (el) {
      el.addEventListener('click', function () {
        closeModals();
      });
    });
  }


  document.addEventListener('keydown', function (event) {
    const e = event || window.event;
    if (e.keyCode === 27) {
      closeModals();
      closeDropdowns();
    }
  });
});


// Misc

